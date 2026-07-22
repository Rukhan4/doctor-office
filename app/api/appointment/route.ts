import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { sendAppointmentEmail } from "../../../lib/email";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

const appointmentSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(30),
  preferredDate: z.string().trim().min(1).max(50),
  preferredTime: z.string().trim().min(1).max(50),
  reason: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(2000).optional().default(""),
});

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const appointmentRateLimitWindowMs = Number(process.env.APPOINTMENT_RATE_LIMIT_WINDOW_MS ?? "600000");
const appointmentRateLimitMax = Number(process.env.APPOINTMENT_RATE_LIMIT_MAX ?? "5");
const appointmentRateLimitWindowSeconds = Math.max(1, Math.ceil(appointmentRateLimitWindowMs / 1000));
const hasUpstashConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const appointmentRateLimiter = hasUpstashConfig
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(appointmentRateLimitMax, `${appointmentRateLimitWindowSeconds} s`),
      prefix: "ratelimit:appointment",
    })
  : null;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  return forwardedFor.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);
  return existing.count > limit;
}

function cleanExpiredRateLimitEntries() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }
}

async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET;

  if (!secret) {
    return { ok: false, message: "CAPTCHA verification is not configured." };
  }

  const form = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    form.set("remoteip", remoteIp);
  }

  let response: Response;

  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
  } catch {
    return { ok: false, message: "CAPTCHA verification is temporarily unavailable." };
  }

  if (!response.ok) {
    return { ok: false, message: "CAPTCHA verification failed." };
  }

  const result = (await response.json()) as { success?: boolean };

  if (!result.success) {
    return { ok: false, message: "Please complete the CAPTCHA challenge." };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (appointmentRateLimiter) {
      try {
        const { success } = await appointmentRateLimiter.limit(`appointment:${ip}`);

        if (!success) {
          return NextResponse.json(
            { message: "Too many requests. Please wait and try again." },
            { status: 429 },
          );
        }
      } catch {
        cleanExpiredRateLimitEntries();

        if (isRateLimited(ip, appointmentRateLimitMax, appointmentRateLimitWindowMs)) {
          return NextResponse.json(
            { message: "Too many requests. Please wait and try again." },
            { status: 429 },
          );
        }
      }
    } else {
      cleanExpiredRateLimitEntries();

      if (isRateLimited(ip, appointmentRateLimitMax, appointmentRateLimitWindowMs)) {
        return NextResponse.json(
          { message: "Too many requests. Please wait and try again." },
          { status: 429 },
        );
      }
    }

    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    if (body.company) {
      return NextResponse.json({ message: "Spam detected." }, { status: 400 });
    }

    const parseResult = appointmentSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      reason,
      notes,
    } = parseResult.data;

    const captchaToken = isString(body["cf-turnstile-response"])
      ? body["cf-turnstile-response"].trim()
      : "";

    if (!captchaToken) {
      return NextResponse.json({ message: "Please complete the CAPTCHA challenge." }, { status: 400 });
    }

    const remoteIp = ip === "unknown" ? undefined : ip;
    const captchaResult = await verifyTurnstileToken(captchaToken, remoteIp);

    if (!captchaResult.ok) {
      return NextResponse.json({ message: captchaResult.message }, { status: 403 });
    }

    const result = await sendAppointmentEmail({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      reason,
      notes,
    });

    if (!result.ok) {
      return NextResponse.json({ message: result.error }, { status: 503 });
    }

    return NextResponse.json({ message: "Appointment request sent successfully." });
  } catch (error) {
    console.error("Appointment API failed", error);
    return NextResponse.json({ message: "Unable to process the request." }, { status: 500 });
  }
}
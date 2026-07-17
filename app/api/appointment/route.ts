import { NextResponse } from "next/server";
import { sendAppointmentEmail } from "../../../lib/email";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

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

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

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
    const body = (await request.json()) as Record<string, unknown>;

    if (body.company) {
      return NextResponse.json({ message: "Spam detected." }, { status: 400 });
    }

    const name = isString(body.name) ? body.name.trim() : "";
    const email = isString(body.email) ? body.email.trim() : "";
    const phone = isString(body.phone) ? body.phone.trim() : "";
    const preferredDate = isString(body.preferredDate) ? body.preferredDate.trim() : "";
    const preferredTime = isString(body.preferredTime) ? body.preferredTime.trim() : "";
    const reason = isString(body.reason) ? body.reason.trim() : "";
    const notes = isString(body.notes) ? body.notes.trim() : "";
    const captchaToken = isString(body["cf-turnstile-response"])
      ? body["cf-turnstile-response"].trim()
      : "";

    if (!name || !email || !phone || !preferredDate || !preferredTime || !reason) {
      return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
    }

    if (!captchaToken) {
      return NextResponse.json({ message: "Please complete the CAPTCHA challenge." }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
    const remoteIp = forwardedFor.split(",")[0]?.trim() || undefined;
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
  } catch {
    return NextResponse.json({ message: "Unable to process the request." }, { status: 500 });
  }
}
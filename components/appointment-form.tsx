"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Script from "next/script";

type FormState = {
  status: "idle" | "sending" | "success" | "error";
  message: string;
};

const initialState: FormState = {
  status: "idle",
  message: "",
};

export function AppointmentForm() {
  const [state, setState] = useState<FormState>(initialState);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState({ status: "sending", message: "Sending your request..." });

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setState({
        status: "error",
        message: result.message ?? "Unable to send the appointment request.",
      });
      return;
    }

    form.reset();
    setState({
      status: "success",
      message: result.message ?? "Your request was sent successfully.",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-line bg-white/90 p-6 shadow-soft sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Name</span>
          <input name="name" required className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Email</span>
          <input type="email" name="email" required className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Phone</span>
          <input name="phone" required className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Preferred time</span>
          <div className="relative">
            <select
              name="preferredTime"
              required
              defaultValue=""
              className="block min-h-[48px] w-full appearance-none rounded-2xl border border-line bg-page px-4 py-3 pr-10 text-base text-ink outline-none transition focus:border-accent"
            >
              <option value="" disabled>
                Select a preferred time
              </option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Any time">Any time</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted" aria-hidden="true">
              ▾
            </span>
          </div>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Preferred date</span>
          <input type="date" name="preferredDate" required className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Reason for visit</span>
          <input name="reason" required className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent" />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">Additional notes</span>
        <textarea name="notes" rows={5} className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent" placeholder="Share anything the office should know before reaching out." />
      </label>

      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" data-action="turnstile-spin-v2" />
        </>
      ) : (
        <p className="text-sm text-red-700">
          CAPTCHA is not configured. Please try again later.
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "sending" || !turnstileSiteKey}
        className="inline-flex w-fit rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285d52] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.status === "sending" ? "Sending..." : "Send"}
      </button>

      {state.status !== "idle" ? (
        <p className={`text-sm ${state.status === "error" ? "text-red-700" : "text-accent"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
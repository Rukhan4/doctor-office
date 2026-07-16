"use client";

import type { FormEvent } from "react";
import { useState } from "react";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "sending", message: "Sending your request..." });

    const formData = new FormData(event.currentTarget);
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

    event.currentTarget.reset();
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
          <select name="preferredTime" required defaultValue="" className="rounded-2xl border border-line bg-page px-4 py-3 text-ink outline-none transition focus:border-accent">
            <option value="" disabled>
              Select a preferred time
            </option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Any time">Any time</option>
          </select>
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

      <button
        type="submit"
        disabled={state.status === "sending"}
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
import { NextResponse } from "next/server";
import { sendAppointmentEmail } from "../../../lib/email";

function isString(value: unknown): value is string {
  return typeof value === "string";
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

    if (!name || !email || !phone || !preferredDate || !preferredTime || !reason) {
      return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
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
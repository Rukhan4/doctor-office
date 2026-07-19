type AppointmentRequest = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  notes: string;
};

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export async function sendAppointmentEmail(request: AppointmentRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO ?? "primecare.curepe@gmail.com";
  const configuredFrom = process.env.EMAIL_FROM?.trim();
  const from = configuredFrom && !configuredFrom.toLowerCase().includes("gmail.com")
    ? configuredFrom
    : "PrimeCare Medical Centre <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      ok: false,
      error: "Email provider is not configured. Set RESEND_API_KEY.",
    };
  }

  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Appointment request from ${request.name}`,
        reply_to: request.email,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #16211c;">
            <h2 style="margin: 0 0 16px;">New appointment request</h2>
            <p><strong>Name:</strong> ${escapeHtml(request.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(request.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(request.phone)}</p>
            <p><strong>Preferred date:</strong> ${escapeHtml(request.preferredDate)}</p>
            <p><strong>Preferred time:</strong> ${escapeHtml(request.preferredTime)}</p>
            <p><strong>Reason:</strong> ${escapeHtml(request.reason)}</p>
            <p><strong>Notes:</strong><br />${escapeHtml(request.notes).replaceAll("\n", "<br />")}</p>
          </div>
        `,
      }),
    });
  } catch {
    return {
      ok: false,
      error: "Email provider is temporarily unavailable.",
    };
  }

  if (!response.ok) {
    const errorText = await response.text();
    return {
      ok: false,
      error: `Email provider request failed: ${errorText}`,
    };
  }

  return { ok: true };
}
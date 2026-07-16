import type { Metadata } from "next";
import { AppointmentForm } from "../../components/appointment-form";
import { AnalyticsLink } from "../../components/analytics-link";
import { SectionHeading } from "../../components/section-heading";
import { contactPoints, practice } from "../../lib/content";

export const metadata: Metadata = {
  title: "Contact & Book Appointment",
  description: "Contact Doctor's Office Curepe or book your appointment with Dr. Gregory Athekame. Call 645-0182 or submit an appointment request.",
  keywords: ["contact", "appointment", "book", "phone", "email", "location"],
  openGraph: {
    title: "Contact & Appointment | Doctor's Office Curepe",
    description: "Book your appointment or get in touch with Doctor's Office Curepe.",
  },
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title="Book your appointment and reach the office quickly."
          description="Call, email, or submit the form and the office will follow up with confirmation details."
        />
        <div className="mt-10 space-y-4 rounded-[2rem] border border-line bg-white/85 p-6 text-center shadow-sm">
          {contactPoints.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 border-b border-line pb-4 last:border-none last:pb-0">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{item.label}</span>
              <span className="text-base text-ink">{item.value}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1 border-b border-line pb-4 last:border-none last:pb-0">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Map</span>
            <AnalyticsLink href={practice.mapUrl} target="_blank" rel="noreferrer" eventName="map_click" eventLabel="contact_page" className="text-base text-ink underline decoration-accent/50 underline-offset-4">
              Open map and pin location
            </AnalyticsLink>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-line bg-accentSoft p-6 text-center text-sm leading-7 text-ink">
          <p className="text-base font-semibold">Privacy disclaimer</p>
          <p className="mt-2">
            Appointment requests are sent to the office email for follow-up. No client information is stored in a database on this website.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-line bg-white/90 p-6 shadow-soft sm:p-8">
        <SectionHeading
          eyebrow="Appointment request"
          title="Send the office the essentials in one message."
        />
        <div className="mt-8">
          <AppointmentForm />
        </div>
      </div>
    </section>
  );
}
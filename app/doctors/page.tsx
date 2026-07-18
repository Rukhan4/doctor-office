import type { Metadata } from "next";
import { SectionHeading } from "../../components/section-heading";
import { philosophy, team } from "../../lib/content";

export const metadata: Metadata = {
  title: "Medical Team",
  description: "Meet Dr. Gregory Athekame and the dedicated healthcare professionals at PrimeCare Medical Centre committed to patient care.",
  keywords: ["Dr. Gregory Athekame", "medical team", "doctor", "staff", "healthcare professionals"],
  openGraph: {
    title: "Medical Team | PrimeCare Medical Centre",
    description: "Meet our dedicated healthcare professionals led by Dr. Gregory Athekame.",
  },
};

export default function DoctorsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Staff"
        title="Medical and support team"
        description="Dedicated professionals focused on quality care, communication, and patient advocacy."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-1">
        {team.map((member) => (
          <article key={member.name} className="rounded-[1.75rem] border border-line bg-white/85 p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">{member.role}</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">{member.name}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
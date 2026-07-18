import type { Metadata } from "next";
import { SectionHeading } from "../../components/section-heading";
import { services } from "../../lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive medical services including general care, chronic disease management, diabetic wound care, laboratory services, and home/office visits.",
  keywords: ["medical services", "general care", "chronic disease", "wound care", "laboratory", "home visits"],
  openGraph: {
    title: "Services | PrimeCare Medical Centre",
    description: "Comprehensive medical services including general care, chronic disease management, and specialist wound care.",
  },
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
      title="Services"
        eyebrow="What we offer"
        description="Our services include, but are not limited to:"
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.title} className="rounded-[1.75rem] border border-line bg-white/85 p-6 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">{service.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
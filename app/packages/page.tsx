import Link from "next/link";
import type { Metadata } from "next";
import { AnalyticsLink } from "../../components/analytics-link";
import { SectionHeading } from "../../components/section-heading";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Medical Package 1 and All-in-One STI Screening Package details, pricing, and included tests at PrimeCare Medical Centre.",
  keywords: [
    "medical package",
    "sti screening package",
    "health screening",
    "PrimeCare Medical Centre",
    "Curepe",
  ],
  openGraph: {
    title: "Packages | PrimeCare Medical Centre",
    description:
      "See Medical Package 1 and the All-in-One STI Screening Package, including pricing and included services.",
  },
};

export default function PackagesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Packages"
        title="Health Screening Packages"
        description="Explore our currently available package options and what each includes."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-line bg-white p-7 shadow-sm">
          <h2 className="font-display text-3xl text-ink">Medical Package</h2>
          <p className="mt-3 text-lg font-semibold text-accent">Price: $1,300</p>

         

          <h3 className="mt-6 text-lg font-semibold text-ink">Includes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
            <li>Medical consultation</li>
            <li>Complete Blood Count (CBC)</li>
            <li>HbA1c</li>
            <li>Lipid profile (cholesterol)</li>
            <li>Liver function test</li>
            <li>Renal function test</li>
            <li>CA-15.3 (breast cancer marker)</li>
            <li>PSA (for males - prostate screening)</li>
            <li>Free results review</li>
          </ul>
        </article>

        <article className="rounded-[1.5rem] border border-line bg-white p-7 shadow-sm">
          <h2 className="font-display text-3xl text-ink">All-in-One STI Screening Package</h2>
          <p className="mt-3 text-lg font-semibold text-accent">Price: $850</p>

          <h3 className="mt-6 text-lg font-semibold text-ink">Includes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
            <li>HIV I and II</li>
            <li>Syphilis</li>
            <li>Chlamydia</li>
            <li>Gonorrhea</li>
            <li>HSV (Herpes) I and II</li>
            <li>Doctor&apos;s consultation</li>
            <li>Free doctor&apos;s review and post-results consultation</li>
          </ul>

  
        </article>
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-accentSoft p-6 text-center">
        <p className="text-base text-ink">
          Need more information on these packages?
        </p>
        <AnalyticsLink
          href="/contact"
          eventName="package_info_click"
          eventLabel="packages_page"
          className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285d52]"
        >
          Get more information
        </AnalyticsLink>
      </div>
    </section>
  );
}

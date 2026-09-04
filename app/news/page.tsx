import Image from "next/image";
import type { Metadata } from "next";
import { AnalyticsLink } from "../../components/analytics-link";
import { SectionHeading } from "../../components/section-heading";
import { news } from "../../lib/content";

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest news and specials from PrimeCare Medical Centre, including back-to-school vaccine specials.",
  keywords: ["news", "vaccine specials", "PrimeCare Medical Centre", "Curepe"],
  openGraph: {
    title: "News | PrimeCare Medical Centre",
    description: "Latest news and specials from PrimeCare Medical Centre.",
  },
};

export default function NewsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="News"
        title="Latest News & Specials"
        description="Stay up to date with offers, announcements, and health reminders from our practice."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {news.map((post) => (
          <article
            key={post.slug}
            className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm"
          >
            <div className="relative aspect-[2/3] w-full bg-page">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{post.summary}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-accentSoft p-6 text-center">
        <p className="text-base text-ink">Have questions about this special?</p>
        <AnalyticsLink
          href="/contact"
          eventName="news_info_click"
          eventLabel="news_page"
          className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285d52]"
        >
          Contact us
        </AnalyticsLink>
      </div>
    </section>
  );
}

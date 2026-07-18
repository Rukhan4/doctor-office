import Image from "next/image";
import { AnalyticsLink } from "../components/analytics-link";
import { HomeMapPanel } from "../components/home-map-panel";
import { SectionHeading } from "../components/section-heading";
import { insuranceAccepted, philosophy, practice, purposeStatement, serviceAreas } from "../lib/content";

const purposeHighlight = "17 years of clinical experience";

export default function HomePage() {
  const [purposeLead, purposeTail] = purposeStatement.split(purposeHighlight);

  return (
    <>
      <section className="w-full -mt-px">
        <div className="overflow-hidden border-y border-line bg-white/90 shadow-soft">
          <div className="relative mx-auto h-[clamp(420px,48vw,760px)] w-full">
            <Image
              src="/banner.jpeg"
              alt="PrimeCare Medical Centre banner"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="space-y-8 lg:h-full">
            <div className="rounded-[2rem] border border-line bg-white/85 p-8 text-center shadow-sm">
              <SectionHeading eyebrow="Purpose" title="Purpose Statement" />
              <div className="mx-auto mt-8 max-w-3xl text-left text-base leading-8 text-muted">
                <p>
                  {purposeLead}
                  <span className="rounded-full bg-accentSoft px-2 py-0.5 font-semibold text-accent">{purposeHighlight}</span>
                  {purposeTail}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-white/85 p-8 text-center shadow-sm">
              <h3 className="font-display text-3xl text-ink">Our Philosophy</h3>
              <div className="mt-6 grid gap-4">
                {philosophy.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-line bg-page/80 p-5 text-center"
                  >
                    <h4 className="text-xl font-semibold text-ink">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-line bg-white/90 p-8 shadow-soft lg:flex lg:h-full lg:flex-col lg:justify-between lg:self-stretch">
            <SectionHeading
              eyebrow="Map"
              title="Find us in Curepe"
            />
            <div className="mt-8">
              <HomeMapPanel
                lat={practice.mapCenter.lat}
                lng={practice.mapCenter.lng}
                title={`${practice.name} - ${practice.address}`}
              />
            </div>
            <div className="mt-10 text-center">
              <AnalyticsLink
                href={practice.mapUrl}
                target="_blank"
                rel="noreferrer"
                eventName="map_click"
                eventLabel="home_map_section"
                className="inline-flex rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-page"
              >
                Open in Google Maps
              </AnalyticsLink>
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-page/70 p-5 text-center lg:mt-8">
              <h3 className="text-lg font-semibold text-ink">Opening Hours</h3>
              <div className="mt-3 space-y-2 text-sm leading-7 text-muted">
                <p>Monday - Friday: 9:30 a.m. - 5:00 p.m.</p>
                <p>Saturday: 9:00 a.m. - 2:00 p.m.</p>
                <p>Sundays &amp; Public Holidays: By special appointment only.</p>
                <p className="font-medium text-ink">Walk-ins accepted during opening hours.</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-line bg-page/70 p-5 text-center">
              <p className="text-sm font-medium text-accent">{practice.availability}</p>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-page/70 p-5 text-center lg:mt-8">
              <h3 className="text-lg font-semibold text-ink">Insurance Accepted</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {insuranceAccepted.map((provider) => (
                  <span key={provider} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink sm:text-sm">
                    {provider}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-line bg-accentSoft p-10 text-center shadow-soft">
          <h2 className="font-display text-4xl text-ink sm:text-5xl">Ready to book your appointment?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
            Visit the contact page to submit your appointment request and our office will follow up.
          </p>
          <div className="mt-8">
            <AnalyticsLink href="/contact" eventName="book_cta_click" eventLabel="home_bottom" className="inline-flex rounded-full bg-accent px-10 py-4 text-base font-semibold text-white transition hover:bg-[#285d52]">
              Go to Contact Page
            </AnalyticsLink>
          </div>
        </div>
      </section>


    </>
  );
}
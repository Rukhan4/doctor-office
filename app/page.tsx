import { AnalyticsLink } from "../components/analytics-link";
import { HomeMapPanel } from "../components/home-map-panel";
import { SectionHeading } from "../components/section-heading";
import { insuranceAccepted, philosophy, practice, purposeStatement, serviceAreas } from "../lib/content";

export default function HomePage() {
  return (
    <>
      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
     
            <h1 className="mt-6 font-display text-5xl leading-tight text-ink sm:text-6xl">
              {practice.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl">{practice.doctorName}</p>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">{practice.intro}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <AnalyticsLink href="/contact" eventName="book_cta_click" eventLabel="home_hero" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285d52]">
                Book your appointment now
              </AnalyticsLink>
              <AnalyticsLink href={practice.mapUrl} target="_blank" rel="noreferrer" eventName="map_click" eventLabel="home_hero" className="rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white">
                Open map location
              </AnalyticsLink>
              <AnalyticsLink
                href="/patient-registration-form.pdf"
                target="_blank"
                rel="noreferrer"
                eventName="patient_form_click"
                eventLabel="home_hero"
                className="rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Patient registration form (PDF)
              </AnalyticsLink>
            </div>
            <p className="mt-4 text-sm font-medium text-muted">
              Walk-ins accepted during opening hours.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-line bg-white/85 p-8 text-center shadow-sm lg:flex lg:h-full lg:flex-col">
            <SectionHeading
              eyebrow="Purpose"
              title="Purpose Statement"
              description={purposeStatement}
            />
            <h3 className="mt-10 font-display text-3xl text-ink">Our Philosophy</h3>
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

          <div className="rounded-[2rem] border border-line bg-white/90 p-8 shadow-soft lg:flex lg:h-full lg:flex-col">
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

            <div className="mt-8 rounded-2xl border border-line bg-page/70 p-5 text-center lg:mt-auto">
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
import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { practice, serviceAreas } from "../lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://doctorsofficecurepe.com"),
  title: {
    default: `${practice.name} | Dr. Gregory Athekame, MBBS`,
    template: `%s | ${practice.name}`,
  },
  description: "17 years of trusted, patient-centred healthcare in Curepe. Dr. Gregory Athekame offers general medicine, chronic disease management, diabetic wound care, and home/office visits.",
  keywords: [
    "doctor Curepe",
    "GP Trinidad",
    "medical care Curepe",
    "Dr. Gregory Athekame",
    "chronic disease management",
    "diabetic wound care",
    "house calls",
    "workplace health",
    "family doctor",
  ],
  authors: [{ name: practice.name }],
  creator: "PrimeCare Medical Centre",
  openGraph: {
    type: "website",
    locale: "en_TT",
    url: "https://doctorsofficecurepe.com",
    title: `${practice.name} | Dr. Gregory Athekame, MBBS`,
    description: "17 years of trusted, patient-centred healthcare in Curepe.",
    siteName: practice.name,
  },
  twitter: {
    card: "summary_large_image",
    title: practice.name,
    description: "17 years of trusted, patient-centred healthcare in Curepe.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: practice.name,
    description: practice.tagline,
    url: "https://doctorsofficecurepe.com",
    telephone: practice.phone,
    email: practice.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: practice.address,
      addressLocality: "Curepe",
      addressRegion: "Trinidad and Tobago",
      addressCountry: "TT",
    },
    image: "https://doctorsofficecurepe.com/og-image.png",
    founder: {
      "@type": "Person",
      name: practice.doctorName,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: practice.mapCenter.lat,
      longitude: practice.mapCenter.lng,
    },
    areaServed: serviceAreas,
    sameAs: [practice.googleBusinessUrl],
    medicalSpecialty: [
      "General Medicine",
      "Chronic Disease Management",
      "Wound Care",
    ],
  };

  return (
    <html lang="en">
      <head>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-setup" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-page text-ink">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
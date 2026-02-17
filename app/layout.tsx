import type { Metadata } from "next";
import { Geist, Geist_Mono, Borel } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { getMetadata } from "@/lib/content";
import { FooterWrapper } from "@/components/FooterWrapper";
import { ContentWrapper } from "@/components/ContentWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const borel = Borel({
  variable: "--font-borel",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = getMetadata();

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HelloML',
  url: 'https://www.helloml.app',
  logo: 'https://www.helloml.app/icon',
  description:
    'AI-powered voice agent platform that enables businesses to deploy intelligent phone-based customer service agents.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'noah@helloml.app',
    contactType: 'customer support',
  },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HelloML',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Deploy AI-powered voice agents that answer your business phone 24/7. Automated call handling, appointment booking, real-time transcription, and document-based Q&A.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free tier available. Upgrade when ready.',
  },
  featureList: [
    'AI voice agents for 24/7 call handling',
    'Automated appointment booking',
    'Real-time call transcription',
    'Document-based Q&A',
    'Dedicated phone numbers',
    'Google Calendar and Outlook integration',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
          async
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11501080696"
          strategy="afterInteractive"
          async
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17958638557"
          strategy="afterInteractive"
          async
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11501080696');
            gtag('config', 'AW-17958638557');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${borel.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <ContentWrapper>{children}</ContentWrapper>
            <FooterWrapper />
          </div>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

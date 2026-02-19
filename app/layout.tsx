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
    'HelloML provides AI phone agents and virtual receptionist services for small businesses. Automated phone answering, appointment booking, and AI-powered call handling — starting at $5/month.',
  sameAs: [
    'https://www.helloml.app',
  ],
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
    'AI phone agent and virtual receptionist that answers your business calls 24/7. Automated phone answering, AI appointment booking, real-time transcription, and knowledge-base Q&A for small businesses.',
  url: 'https://www.helloml.app',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier — get started at no cost.',
    },
    {
      '@type': 'Offer',
      price: '5.00',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Starter plan — $5/mo for 100 minutes of AI phone answering.',
    },
  ],
  featureList: [
    'AI voice agents for 24/7 call handling',
    'Automated appointment booking',
    'Real-time call transcription',
    'Document-based Q&A',
    'Dedicated phone numbers',
    'Google Calendar and Outlook integration',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is HelloML?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HelloML is an AI phone agent that answers your business calls 24/7, books appointments, and responds to caller questions using your uploaded documents and knowledge base.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does HelloML cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HelloML starts free. The Starter plan is $5/month and includes 100 minutes of AI phone answering. No credit card required to get started.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the AI phone agent book appointments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. HelloML integrates with Google Calendar and Outlook to automatically book appointments during calls based on your availability.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI answering service work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You get a dedicated phone number with an AI voice agent. Upload your FAQs, policies, or menus, and the agent answers caller questions in real time. Calls are transcribed and you receive notifications.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is HelloML suitable for small businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. HelloML is built for small businesses that need a virtual receptionist without the cost of hiring staff. At $5/month, it\'s the most affordable AI answering service available.',
      },
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
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
            gtag('config', 'G-DNYM0FD9B5');
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

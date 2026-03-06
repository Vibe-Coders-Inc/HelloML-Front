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
    'HelloML provides AI phone agents and virtual receptionist services for small businesses. Automated phone answering, appointment booking, and AI-powered call handling — starting at $29/month.',
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
      price: '29.00',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Starter plan — $29/mo for 200 minutes of AI phone answering.',
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
        text: 'HelloML starts free. The Starter plan is $29/month and includes 200 minutes of AI phone answering. No credit card required to get started.',
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
        text: 'Absolutely. HelloML is built for small businesses that need a virtual receptionist without the cost of hiring staff. At $29/month, it\'s the most affordable AI answering service available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does HelloML work with Google Calendar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. HelloML integrates with both Google Calendar and Outlook. Your AI agent checks your real-time availability and books appointments directly during calls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I transfer calls to a real person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can configure call forwarding so the AI transfers callers to a live person when needed. Transfers include caller verification so your team has context before picking up.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the AI can\'t answer a question?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the AI does not have the answer in its knowledge base, it can search the web in real time or transfer the call to a live team member. You control which fallback behavior to use.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I get a dedicated phone number?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every HelloML agent comes with a dedicated phone number included at no extra cost. You can also port an existing number if you prefer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the AI handle multiple calls at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Unlike a human receptionist, your HelloML agent handles unlimited concurrent calls. Every caller gets answered immediately with zero hold time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries does HelloML work for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HelloML works for any business that receives phone calls. Popular industries include contractors, medical clinics, dental offices, salons, law firms, real estate agencies, and restaurants.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can get started with HelloML for free with no credit card required. Create your AI agent and test it before committing to a paid plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I customize what the AI says?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You have full control over your agent\'s system prompt, greeting, personality, and responses. Customize the AI to match your brand voice and business needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does HelloML transcribe calls?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every call is transcribed in real time. You can view full transcripts in your dashboard and search through past conversations.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does HelloML compare to Smith.ai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HelloML starts at $29/month while Smith.ai starts at $200+/month. HelloML uses AI agents that answer instantly with no hold time, while Smith.ai uses human receptionists. Both handle calls professionally, but HelloML is significantly more affordable.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I upload my own documents for the AI to reference?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can upload PDFs, text files, and connect Google Drive. The AI uses these documents as its knowledge base to answer caller questions accurately.',
      },
    },
    {
      '@type': 'Question',
      name: 'What voices are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HelloML offers 9+ natural-sounding voices with different accents and tones. You can preview each voice and choose the one that best fits your brand.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work after business hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your HelloML agent is available 24/7, 365 days a year. It never takes breaks, holidays, or sick days, so you never miss a call.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I see call recordings or transcripts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every call includes a full transcript available in your dashboard. You can review conversations, search by keyword, and track call history.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does setup take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Setup takes under 5 minutes. Just create your agent, customize the greeting and knowledge base, and your dedicated phone number is ready to receive calls.',
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
          src="https://www.googletagmanager.com/gtag/js?id=AW-17958638557"
          strategy="afterInteractive"
          async
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
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

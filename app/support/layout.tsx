import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Support',
  description:
    'Get help with HelloML. Find answers to common questions about setting up voice agents, managing calls, and using the platform.',
  path: '/support',
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I set up my first voice agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After signing in, click "New Business" on your dashboard, enter your business details in the setup wizard, configure your agent\'s personality and greeting, and provision a phone number. Your agent will be ready to take calls within minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What phone numbers are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We currently support US phone numbers through our Twilio integration. You can provision local numbers from any area code, or transfer an existing number to our platform.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI handle calls it cannot answer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your agent uses your uploaded knowledge base documents to answer questions. If the agent encounters a question outside its knowledge, it will politely let the caller know and can offer to take a message or transfer the call (configurable in agent settings).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I review call transcripts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All calls are automatically transcribed. Go to your business dashboard, navigate to the Calls section, and click on any call to view the full transcript. You can also see caller information and track conversation metrics.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file types can I upload to the knowledge base?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can upload PDF documents and plain text files. Our system extracts the text, creates embeddings, and enables your agent to semantically search and reference the content during calls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a limit on calls or documents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Current limits depend on your plan. Contact us for details on pricing tiers and enterprise options with higher limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I cancel or change my phone number?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to your business dashboard, find the phone number section, and click delete or manage. You can release a number and provision a new one at any time.',
      },
    },
  ],
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {children}
    </>
  );
}

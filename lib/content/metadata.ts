import type { Metadata } from 'next';

const BASE_URL = 'https://www.helloml.app';

export const siteMetadata = {
  title: {
    default: 'HelloML - AI Voice Agents for Business Phone Automation',
    template: '%s | HelloML',
  },
  description:
    'Deploy AI-powered voice agents that answer your business phone 24/7. Automated call handling, appointment booking, real-time transcription, and document-based Q&A.',
  keywords: [
    'AI voice agent',
    'AI phone answering',
    'automated call handling',
    'business phone automation',
    'AI receptionist',
    'voice AI',
    'appointment booking AI',
    'call transcription',
    'AI customer service',
    'virtual receptionist',
  ],
  authors: [{ name: 'HelloML' }],
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    siteName: 'HelloML',
    url: BASE_URL,
  },
} as const;

export const getMetadata = (options?: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata => ({
  metadataBase: new URL(BASE_URL),
  title: options?.title
    ? { default: options.title, template: siteMetadata.title.template }
    : siteMetadata.title,
  description: options?.description || siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  authors: [...siteMetadata.authors],
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '32x32' }],
    apple: { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
  },
  openGraph: {
    ...siteMetadata.openGraph,
    title: options?.title || siteMetadata.title.default,
    description: options?.description || siteMetadata.description,
    url: options?.path ? `${BASE_URL}${options.path}` : BASE_URL,
    images: [
      {
        url: '/dashboard-preview.png',
        width: 1200,
        height: 630,
        alt: 'HelloML - AI Voice Agent Platform Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: options?.title || siteMetadata.title.default,
    description: options?.description || siteMetadata.description,
    images: ['/dashboard-preview.png'],
  },
  robots: options?.noIndex
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
  alternates: {
    canonical: options?.path ? `${BASE_URL}${options.path}` : BASE_URL,
  },
});

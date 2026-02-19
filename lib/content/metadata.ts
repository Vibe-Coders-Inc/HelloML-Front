import type { Metadata } from 'next';

const BASE_URL = 'https://www.helloml.app';

export const siteMetadata = {
  title: {
    default: 'HelloML — AI Phone Agent & Virtual Receptionist for Small Business',
    template: '%s | HelloML — AI Phone Agent',
  },
  description:
    'HelloML is an AI phone agent that answers calls 24/7, books appointments, and responds from your knowledge base. The AI receptionist for small business — just $5/mo for 100 minutes. Try automated phone answering free.',
  keywords: [
    'ai phone agent',
    'ai receptionist',
    'automated phone answering',
    'ai appointment booking',
    'virtual receptionist ai',
    'ai answering service small business',
    'AI voice agent',
    'AI phone answering',
    'automated call handling',
    'business phone automation',
    'voice AI',
    'call transcription',
    'AI customer service',
    'virtual receptionist',
    'ai phone answering service',
    'small business ai receptionist',
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

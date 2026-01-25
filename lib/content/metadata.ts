import type { Metadata } from 'next';

export const siteMetadata = {
  title: {
    default: 'HelloML - Voice Agent Provisioning',
    template: '%s | HelloML',
  },
  description: 'Provision AI voice agents in minutes.',
  keywords: ['AI', 'voice agents', 'automation', 'customer service'],
  authors: [{ name: 'HelloML' }],
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    siteName: 'HelloML',
  },
} as const;

export const getMetadata = (options?: {
  title?: string;
  description?: string;
}): Metadata => ({
  title: options?.title || siteMetadata.title.default,
  description: options?.description || siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  authors: [...siteMetadata.authors],
  icons: {
    icon: [
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
  },
  openGraph: {
    ...siteMetadata.openGraph,
    title: options?.title || siteMetadata.title.default,
    description: options?.description || siteMetadata.description,
  },
});

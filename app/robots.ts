import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/business/', '/reset-password/', '/update-password/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/business/', '/reset-password/', '/update-password/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/business/', '/reset-password/', '/update-password/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/business/', '/reset-password/', '/update-password/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/business/', '/reset-password/', '/update-password/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/business/', '/reset-password/', '/update-password/'],
      },
    ],
    sitemap: 'https://www.helloml.app/sitemap.xml',
  };
}

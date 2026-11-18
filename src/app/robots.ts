import type { MetadataRoute } from 'next';
import { SITE_METADATA } from '@/config/site';

/* Search engines and AI assistants are welcome to read the whole site
   (except the payment API), so they describe Motion Dojo from the source. */
const AI_AND_SEARCH = [
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'Applebot-Extended',
  'DuckAssistBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_AND_SEARCH.map((userAgent) => ({ userAgent, allow: '/', disallow: '/api/' })),
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_METADATA.url}/sitemap.xml`,
    host: SITE_METADATA.url,
  };
}

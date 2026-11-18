import type { MetadataRoute } from 'next';
import { SITE_METADATA } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_METADATA.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_METADATA.url}/blackbelt`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];
}

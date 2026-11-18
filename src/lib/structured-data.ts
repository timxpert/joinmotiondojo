/* Structured data (schema.org JSON-LD): the facts about Motion Dojo in a form
   search engines and AI tools read directly. Keep these in step with ABOUT. */
import { ABOUT, CONNECT_URL, SITE_METADATA, SOCIAL_LINKS } from '@/config/site';
import { ENROL } from '@/data/blackbelt';

const URL = SITE_METADATA.url;
const ORG_ID = `${URL}/#organization`;
const FOUNDER_ID = 'https://timxpert.com/#person';

export const organization = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Motion Dojo',
      alternateName: ['Join Motion Dojo', 'joinmotiondojo'],
      url: URL,
      logo: `${URL}/assets/favicon-128.png`,
      description: ABOUT,
      slogan: 'Train like a ninja, create like a master.',
      foundingDate: '2025',
      founder: { '@id': FOUNDER_ID },
      knowsAbout: ['Motion design', 'Smartphone animation', 'Alight Motion', 'Motion graphics', 'Video editing'],
      sameAs: [...SOCIAL_LINKS.map((s) => s.url), CONNECT_URL],
    },
    {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Timothy Goodness',
      alternateName: 'Timxpert',
      url: 'https://timxpert.com',
      jobTitle: 'Motion designer and video producer',
      sameAs: ['https://www.instagram.com/timxpert', 'https://x.com/timxpert', 'https://www.linkedin.com/in/timothy-goodness-367708274'],
    },
    {
      '@type': 'WebSite',
      '@id': `${URL}/#website`,
      name: 'Motion Dojo',
      url: URL,
      description: ABOUT,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en',
    },
  ],
};

export const course = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  '@id': `${URL}/blackbelt#course`,
  name: ENROL.courseName,
  description:
    'Black Belt in Motion Design is the Motion Dojo community’s complete course. Learn Alight Motion and create professional animations, all on your phone.',
  url: `${URL}/blackbelt`,
  provider: { '@type': 'Organization', '@id': ORG_ID, name: 'Motion Dojo', url: URL },
  inLanguage: 'en',
  offers: {
    '@type': 'Offer',
    price: String(ENROL.amountKobo / 100),
    priceCurrency: ENROL.currency,
    category: 'Paid',
    url: `${URL}/blackbelt`,
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Online',
    courseWorkload: 'Self-paced',
  },
};

/** <script type="application/ld+json"> content, safe to put in HTML */
export const ld = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

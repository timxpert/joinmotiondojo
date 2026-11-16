/**
 * Motion Dojo — site configuration.
 * Every outbound link on the site is read from here. Leave a value as '' when it
 * isn't ready yet: the site hides or softens anything that depends on it instead
 * of linking to a dead page.
 */

/**
 * Where "Join the community" sends people.
 * The community is open to members who aren't on the course, so this goes to the
 * community manager on WhatsApp for now. Replace with the group invite link when ready.
 */
export const COMMUNITY_JOIN_URL = 'https://wa.link/be49ci';

/** Black Belt in Motion Design: the course page on this site. */
export const COURSE_URL = '/blackbelt';

/** Dojo's AI — access link. Empty until the tool is ready to share. */
export const DOJO_AI_URL = '';

/** Keyframe Ninjas showcase (student profiles and projects). */
export const NINJAS_SHOWCASE_URL = 'https://ninjasmotiondojo.vercel.app';

export const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: 'Instagram', url: 'https://www.instagram.com/joinmotiondojo' },
  { label: 'YouTube', url: 'https://www.youtube.com/@joinmotiondojo' },
];

/** Contact details shown in the footer. Empty values are hidden. */
export const CONTACT = {
  email: '',
  whatsapp: '',
};

export const SITE_METADATA = {
  title: 'Motion Dojo | Where motion designers grow together',
  description:
    'Motion Dojo is a community for motion designers and creatives who want to learn, improve, connect and build something meaningful.',
  url: 'https://motiondojo.vercel.app',
  ogImage: '/images/hero-video-poster.webp',
};

/** Main navigation (header, mobile menu and footer). */
export const NAV = [
  { href: '/#intro', label: 'About' },
  { href: '/#pillars', label: 'What we do' },
  { href: '/#team', label: 'Team' },
  { href: '/blackbelt', label: 'The course' },
];

export const isExternal = (url: string) => /^https?:\/\//.test(url);

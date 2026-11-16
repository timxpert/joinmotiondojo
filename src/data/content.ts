/**
 * Editable content for sections that will grow over time.
 * Add real items here; components render whatever is listed and skip empty lists.
 */

import { Story } from '@/types';

/* ------------------------------------------------------------------
   Meet the team: names, roles, bios and WhatsApp links as published on
   joinmotiondojo.vercel.app.
------------------------------------------------------------------- */
export type TeamMember = {
  name: string;
  short: string;
  role: string;
  bio: string;
  photo: string;
  focus: string;
  whatsapp: string;
};

export const TEAM: TeamMember[] = [
  {
    name: 'Muhammad Fatihi Abdullahi',
    short: 'Fatihi',
    role: 'Community manager',
    bio: 'I create engaging video ads for businesses and brands using AI video, professional editing, and motion design.',
    photo: '/assets/Muhammad Fatihi Abdullahi.jpg',
    focus: '50% 30%',
    whatsapp: 'https://wa.link/be49ci',
  },
  {
    name: 'Osho Elizabeth Oluwatobiloba',
    short: 'Elizabeth',
    role: 'Moderator',
    bio: 'Founder of Growth Code Builders. I help young people build digital skills, grow with purpose, and turn their potential into impact.',
    photo: '/assets/Osho Elizabeth Oluwatobiloba.jpg',
    focus: '50% 25%',
    whatsapp: 'https://wa.link/9z7uus',
  },
  {
    name: 'George Junior',
    short: 'Junior',
    role: 'Social media manager',
    bio: '2D animator and storyteller. Turning imagination into animation.',
    photo: '/assets/George Junior.jpg',
    focus: '50% 30%',
    whatsapp: 'https://wa.link/fw3u5j',
  },
];

/* ------------------------------------------------------------------
   Testimonials: supplied by the Motion Dojo team (video interviews on Vimeo).
------------------------------------------------------------------- */
export const TESTIMONIALS: (Story & { portrait?: boolean })[] = [
  {
    id: 'mary',
    name: 'Mary',
    role: 'Keyframe Ninja, Cohort 01',
    poster: '/images/testimonial-mary.webp',
    videoUrl: 'https://vimeo.com/1238665663/df4d75a3d5',
    summary:
      'How the structured phases took her from struggling with graph curves to producing confident commercial work.',
  },
  {
    id: 'roseline',
    name: 'Roseline',
    role: 'Keyframe Ninja, Cohort 02',
    poster: '/images/testimonial-roseline.webp',
    videoUrl: 'https://vimeo.com/1238666245/5ac2fba1a7',
    summary: 'Direct mentor critiques, self-paced momentum, and learning a professional motion workflow.',
    portrait: true,
  },
  {
    id: 'fatihi',
    name: 'Muhammad Fatihi',
    role: 'Keyframe Ninja, Cohort 02',
    poster: '/images/testimonial-fatihi.webp',
    videoUrl: 'https://vimeo.com/1238668293/f2b3558f85',
    summary: 'From design theory to fast client delivery, levelling up his portfolio and earning the Black Belt.',
  },
];

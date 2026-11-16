/**
 * Content for /blackbelt (Black Belt in Motion Design), carried over from joinmotiondojo.vercel.app.
 */

export const ENROL = {
  /** Paystack public key (safe to ship to the browser). The secret key lives only in PAYSTACK_SECRET_KEY on the server. */
  paystackPublicKey: 'pk_live_977ea583d678e81d9cf2634c435a0d1a2fc0acd8',
  amountKobo: 4000000, // ₦40,000
  currency: 'NGN',
  courseName: 'Black Belt in Motion Design',
  priceLabel: '₦40,000',
  instalmentLabel: '₦20,000',
  /** WhatsApp: ask for the bank account number */
  accountNumberUrl: 'https://wa.link/ava9k0',
  /** WhatsApp: start paying in two instalments */
  instalmentUrl: 'https://wa.link/92p2yh',
};

export const WHO_FOR = [
  {
    title: 'Motion design enthusiast',
    body: 'You have a smartphone and big ambition. Learn to create world-class motion with the tools you already have.',
  },
  {
    title: 'The stuck beginner',
    body: 'You’ve watched countless YouTube tutorials but still can’t create something you’re proud of. Get a clear path that works.',
  },
  {
    title: 'Business owner',
    body: 'You sell products or services and want to make scroll-stopping animations for your own brand, by yourself.',
  },
  {
    title: 'Graphic designer',
    body: 'Add motion to your skills, raise your rates, and stop losing clients to motion designers.',
  },
];

export const CURRICULUM = [
  {
    title: 'Foundations',
    lessons: [
      'Introduction to motion design',
      'Fundamental design principles',
      'Background music mastery',
      'Visual solutions in motion design',
      'Introduction to Alight Motion',
      'Vector drawing mastery',
      'Steps to creating stunning motion designs',
      'Typography in motion design',
      'Colour usage in motion design',
    ],
  },
  {
    title: 'Alight Motion mastery',
    lessons: [
      'Keyframe mastery',
      'Graph editor mastery',
      'Mastering all the effects in Alight Motion',
      'Null object and camera system',
    ],
  },
  {
    title: 'Creative execution',
    lessons: [
      'The 12 principles of animation',
      'Script writing and voiceovers',
      'Practical: creating different motion designs',
      'Final project 1',
    ],
  },
  {
    title: 'Portfolio & mastery',
    lessons: [
      'AI-powered workflows',
      'Advanced motion design',
      'Portfolio development',
      'Personal branding',
      'Client acquisition',
      'Pricing',
      'Final project 2',
      'Certificate of Mastery',
      'What’s next?',
    ],
  },
];

/** Sample projects made by students (Vimeo: id/hash) */
export const PROJECTS = [
  { title: 'Inmagic AI', poster: '/images/project-inmagic.webp', video: 'https://vimeo.com/1238697726/a5a200a87b' },
  { title: 'Kuda', poster: '/images/project-kuda.webp', video: 'https://vimeo.com/1238698161/ea2615b78c' },
  { title: 'Mysite AI', poster: '/images/project-mysite.webp', video: 'https://vimeo.com/1238698598/33f478d30d' },
];

export const PERKS = [
  'Get quick answers, feedback breakdowns, and practical guidance from experienced peers.',
  'Showcase your animations to build visibility, gain exposure, and attract real project inquiries.',
  'Stay committed to daily practice with mutual accountability that keeps procrastination at bay.',
  'From your first render to signing your dream client, share your milestones with creators who care.',
  'Expand your commercial network, discover paid referrals, and collaborate with like-minded ninjas.',
];

export const INCLUDED = [
  'All four phases',
  'Video tutorials and assignments',
  'Access to the Motion Dojo community',
  'Project-based progression',
];

export const FAQS = [
  {
    q: 'Is the community virtual or physical?',
    a: 'The community is 100% virtual. Learn from home or anywhere in the world, at your own pace, as long as you have a smartphone and internet access.',
  },
  {
    q: 'How do I join the Motion Dojo community?',
    a: 'As soon as your payment is confirmed, our community manager will reach out to give you access.',
  },
  {
    q: 'What phone specs do I need to get started?',
    a: 'You can start with a phone that has at least 4GB RAM and 128GB storage. For complex animations, 8 to 16GB RAM and 256GB storage works best.',
  },
  {
    q: 'How long is the course?',
    a: 'Black Belt in Motion Design is fully self-paced. There is no deadline, so you learn at your own speed and finish whenever you’re ready.',
  },
  { q: 'Is access lifetime?', a: 'Yes. You get lifetime access to the community and the Black Belt course.' },
  { q: 'What experience do I need to get started?', a: 'None. You don’t need any prior experience.' },
  {
    q: 'Will I get a certificate?',
    a: 'Yes, but the Certificate of Mastery is earned, not given. Your Final Project 2 determines whether you earn it.',
  },
  {
    q: 'Can I pay in instalments?',
    a: 'Yes. The full price is ₦40,000. You can pay it in one go, or in two instalments of ₦20,000. The first instalment unlocks Phase 01. The remaining phases unlock once the full fee is paid.',
  },
  {
    q: 'Which app do I use?',
    a: 'You’ll learn on your smartphone using Alight Motion, starting with an introduction in Phase 01.',
  },
];

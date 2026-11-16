import type { Metadata } from 'next';
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FinalCTA } from '@/components/FinalCTA';
import { Projects } from '@/components/blackbelt/Projects';
import { Stories } from '@/components/blackbelt/Stories';
import { EnrolButton, EnrolModal } from '@/components/blackbelt/Enrol';
import {
  CourseHero,
  Curriculum,
  Experience,
  Faq,
  Pricing,
  WhoFor,
} from '@/components/blackbelt/Sections';

const title = 'Black Belt in Motion Design | Motion Dojo';
const description =
  'The complete smartphone motion design course. Master Alight Motion and create pro animations on your phone. ₦40,000, or two payments of ₦20,000.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blackbelt' },
  openGraph: { title, description, url: '/blackbelt' },
  twitter: { title, description },
};

const NAV = [
  { href: '/', label: 'Home' },
  { href: '#curriculum', label: 'Curriculum' },
  { href: '#projects', label: 'Projects' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export default function BlackBeltPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header nav={NAV} cta={{ href: '#pricing', label: 'Enrol now' }} />
      <main id="main">
        <CourseHero />
        <WhoFor />
        <Curriculum />
        <Projects />
        <Experience />
        <Stories />
        <Pricing />
        <Faq />
        <FinalCTA
          title="Train like a ninja, create like a master."
          lede="Join an active dojo for motion designers."
          action={<EnrolButton className="btn btn-lime">Claim your spot</EnrolButton>}
        />
      </main>
      <Footer />
      <EnrolModal />
    </>
  );
}

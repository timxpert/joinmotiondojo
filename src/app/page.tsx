import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Reel } from '@/components/Reel';
import { Intro } from '@/components/Intro';
import { Team } from '@/components/Team';
import { Inside } from '@/components/Inside';
import { Course } from '@/components/Course';
import { Different } from '@/components/Different';
import { Testimonials } from '@/components/Testimonials';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="home">
        <Hero />
        <Reel />
        <Intro />
        <Inside />
        <Different />
        <Course />
        <Team />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Reel } from '@/components/Reel';
import { Intro } from '@/components/Intro';
import { Team } from '@/components/Team';
import { Inside } from '@/components/Inside';
import { Course } from '@/components/Course';
import { Audience } from '@/components/Audience';
import { Different } from '@/components/Different';
import { Testimonials } from '@/components/Testimonials';
import { Mark } from '@/components/Mark';
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
        <Audience />
        <Different />
        <Course />
        <Team />
        <Testimonials
          title={
            <>
              From our <Mark>members</Mark>
            </>
          }
        />
        <FinalCTA
          title={
            <>
              Be part of the Dojo <Mark>experience</Mark>
            </>
          }
          lede="Join smartphone motion designers who learn, share their work and get better together."
        />
      </main>
      <Footer />
    </>
  );
}

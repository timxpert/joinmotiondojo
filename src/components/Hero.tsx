import React from 'react';
import { COMMUNITY_JOIN_URL } from '@/config/site';
import { Mark } from './Mark';
import { DojoGlow } from './ui/DojoGlow';

/* Dark hero: the headline, then the logo reel on its own band below (page.tsx) */
export function Hero() {
  return (
    <section className="hero hero-live" id="top" aria-labelledby="hero-title">
      {/* moving gradient behind the hero, in Motion Dojo colours */}
      <DojoGlow />
      <div className="wrap">
        <div className="hero-copy">
          <h1 className="display" id="hero-title">
            <span className="line">You were never meant</span>
            <span className="line">
              to figure it all out <Mark>alone</Mark>
            </span>
          </h1>

          <p className="lede">
            Growing as a motion designer takes good teaching and people around you who are a step ahead. Motion Dojo gives you
            both.
          </p>

          <div className="btn-pair">
            <a href={COMMUNITY_JOIN_URL} className="btn btn-lime">
              Join the community
            </a>
            <a href="#intro" className="btn btn-paper">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

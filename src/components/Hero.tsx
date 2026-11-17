import React from 'react';
import { COMMUNITY_JOIN_URL } from '@/config/site';
import { Reel } from './Reel';

/* Dark hero: headline on the left, the logo reel on the right */
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="display" id="hero-title">
            <span className="line">You were never meant</span>
            <span className="line">to figure it all out alone</span>
          </h1>

          <p className="lede">
            Motion design is about discovering your creative voice and finding people who understand your ambition.
          </p>

          <div className="btn-pair">
            <a href={COMMUNITY_JOIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-lime">
              Join the community
            </a>
            <a href="#intro" className="btn btn-dark-ghost">
              Learn more
            </a>
          </div>
        </div>

        <Reel />
      </div>
    </section>
  );
}

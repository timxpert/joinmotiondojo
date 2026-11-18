import React from 'react';
import { Mark } from './Mark';
import { ABOUT, COMMUNITY_JOIN_URL } from '@/config/site';

export function Intro() {
  return (
    <section className="section" id="intro" aria-labelledby="intro-title">
      <div className="wrap intro-grid">
        <h2 className="h2" id="intro-title">
          A <Mark>community</Mark> for smartphone motion designers
        </h2>
        <div className="intro-copy">
          <p className="lede">{ABOUT}</p>
          <p className="lede">
            But it’s more than a place to learn how to animate. It’s where you develop your creative skills, discover
            your potential, share ideas, get feedback, collaborate with other creatives, and build confidence in your
            abilities.
          </p>
          <a href={COMMUNITY_JOIN_URL} className="btn btn-primary">
            Join the community
          </a>
        </div>
      </div>
    </section>
  );
}

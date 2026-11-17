'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mark } from './Mark';

/* Who Motion Dojo is for, drawn as an animation timeline: each group is a
   keyframe on one track, and a playhead moves along it as you scroll.
   Left to right on computers, top to bottom on phones. */
const PEOPLE = [
  {
    title: 'Motion design enthusiast',
    body: 'You have a smartphone and are passionate about creating industry standard motion graphics and animations.',
  },
  { title: 'Beginner', body: 'You’ve watched countless YouTube tutorials but still can’t create industry standard videos.' },
  {
    title: 'Business owner',
    body: 'You sell products or services and want to make scroll-stopping animations for your own brand, by yourself.',
  },
  {
    title: 'Graphic designer',
    body: 'You want to add motion to your skills, raise your rates, and stop losing clients to motion designers.',
  },
];

export function Audience() {
  const track = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setP(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3))));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const last = PEOPLE.length - 1;

  return (
    <section className="section" id="who" aria-labelledby="who-title">
      <div className="wrap who">
        <div className="who-head">
          <h2 className="h2" id="who-title">
            Who Motion Dojo is <Mark>for</Mark>
          </h2>
          <p className="lede">Anyone animating on a phone who wants to get better, wherever they’re starting from.</p>
        </div>

        <ol className="who-track" ref={track} style={{ '--p': p } as React.CSSProperties}>
          <span className="who-ruler" aria-hidden="true" />
          <span className="who-playhead" aria-hidden="true" />
          {PEOPLE.map((x, i) => (
            <li key={x.title} className={p >= (i / last) * 0.92 ? 'who-key is-on' : 'who-key'}>
              <span className="who-dia" aria-hidden="true" />
              <h3>{x.title}</h3>
              <p>{x.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

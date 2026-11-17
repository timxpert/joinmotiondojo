'use client';

import React, { useEffect, useRef } from 'react';
import { CURRICULUM } from '@/data/blackbelt';
import { Mark } from '../Mark';

/* The four phases as stacked cards in belt colours: White, Yellow, Green,
   Black. Each card slides up over the last; the covered one shrinks back. */
const BELTS = [
  { name: 'White Belt', tone: 'belt-white' },
  { name: 'Yellow Belt', tone: 'belt-yellow' },
  { name: 'Green Belt', tone: 'belt-green' },
  { name: 'Black Belt', tone: 'belt-black' },
];

export function Curriculum() {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ul = list.current;
    if (!ul || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(ul.children) as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const a = card.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - (b.top - a.top) / Math.max(1, a.height)));
        card.style.setProperty('--p', p.toFixed(3));
      });
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

  return (
    <section className="section" id="curriculum" aria-labelledby="curriculum-title">
      <div className="wrap stack-layout">
        <div className="stack-head">
          <h2 className="h2" id="curriculum-title">
            One journey, four <Mark>phases</Mark>
          </h2>
          <p className="lede">A complete motion design course with Alight Motion, from your first keyframe to landing clients.</p>
        </div>
        <ol className="stack" ref={list}>
          {CURRICULUM.map((p, i) => (
            <li key={p.title} className={`stack-card phase-card ${BELTS[i].tone}`} style={{ '--i': i } as React.CSSProperties}>
              <span className="phase-top">
                <span className="phase-belt">
                  <span className="phase-dot" aria-hidden="true" />
                  {BELTS[i].name}
                </span>
                <span className="stack-n">
                  Phase {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <h3 className="stack-name">{p.title}</h3>
              <p className="phase-count">{p.lessons.length} lessons</p>
              <ol className="phase-lessons">
                {p.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

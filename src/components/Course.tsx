'use client';

import React, { useEffect, useRef } from 'react';
import { COMMUNITY_JOIN_URL, CONNECT_URL, COURSE_URL } from '@/config/site';

/* Motion Dojo, Black Belt and Connect: what each name means.
   Stacked cards: each one slides up over the last, and the card underneath
   shrinks back and dims a little as it's covered. */
const PARTS = [
  {
    name: 'Motion Dojo',
    body: 'The community. Smartphone motion designers and creative enthusiasts learning and growing together.',
    link: { href: COMMUNITY_JOIN_URL, label: 'Join the community', className: 'btn btn-paper' },
    tone: 'violet',
  },
  {
    name: 'Black Belt in Motion Design',
    body: 'The course. Structured training for members who want a guided learning experience.',
    link: { href: COURSE_URL, label: 'See the course', className: 'btn btn-ink' },
    tone: 'lime',
  },
  {
    name: 'Motion Dojo Connect',
    body: 'Where members share their work and talk, without the noise of a WhatsApp group.',
    points: [
      'A profile you can send to clients, with your work and links.',
      'A feed just for motion design. Post your work and ask for feedback.',
      'Private messages with voice notes and project files.',
      'Sign in with your email and member ID.',
    ],
    link: { href: CONNECT_URL, label: 'Open Connect', className: 'btn btn-primary' },
    tone: 'white',
  },
];

export function Course() {
  const list = useRef<HTMLUListElement>(null);

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
        // 0 while the next card is below, 1 once it has slid fully over this one
        const p = Math.min(1, Math.max(0, 1 - (b.top - a.top) / Math.max(1, a.height)));
        card.style.setProperty('--p', p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="section" id="ecosystem" aria-labelledby="ecosystem-title">
      <div className="wrap stack-layout">
        <div className="stack-head">
          <h2 className="h2" id="ecosystem-title">
            Motion Dojo, Black Belt and Connect
          </h2>
        </div>
        <ul className="stack" ref={list}>
          {PARTS.map((p, i) => (
            <li key={p.name} className={`stack-card tone-${p.tone}`} style={{ '--i': i } as React.CSSProperties}>
              <span className="stack-n">
                {String(i + 1).padStart(2, '0')} / {String(PARTS.length).padStart(2, '0')}
              </span>
              <h3 className="stack-name">{p.name}</h3>
              <p>{p.body}</p>
              {p.points && (
                <ul className="stack-points">
                  {p.points.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
              <a
                href={p.link.href}
                className={`${p.link.className} btn-sm`}
                target="_blank"
                rel={/^https?:/.test(p.link.href) ? 'noopener noreferrer' : 'noopener'}
              >
                {p.link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

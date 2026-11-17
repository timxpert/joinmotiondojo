'use client';

import React, { useState } from 'react';
import { TEAM } from '@/data/content';
import { Mark } from './Mark';

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z" />
    </svg>
  );
}

/* Cards hanging from a line. Swipe sideways to see everyone; tap a card and
   it swings on its string and flips over to show the person's bio. */
const DROPS = [26, 52, 34, 46, 30];
const TILTS = [-3, 2, -1.5, 2.5, -2];

export function Team() {
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set());
  // bumping the count restarts the swing each tap
  const [swings, setSwings] = useState<number[]>(() => TEAM.map(() => 0));

  const tap = (i: number) => {
    setFlipped((f) => {
      const next = new Set(f);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    setSwings((s) => s.map((n, j) => (j === i ? n + 1 : n)));
  };

  return (
    <section className="section team-section" id="team" aria-labelledby="team-title">
      <div className="wrap team-head">
        <h2 className="h2" id="team-title">
          Meet the people behind the <Mark>work</Mark>
        </h2>
        <p className="team-hint">Tap a card to read about them. Swipe to see everyone.</p>
      </div>

      <div className="team-rail">
        <ul className="team-line" aria-label="The team">
          {TEAM.map((t, i) => {
            const on = flipped.has(i);
            const swing = swings[i];
            return (
              <li
                key={t.name}
                className={['team-hang', swing ? (swing % 2 ? 'swing-a' : 'swing-b') : ''].join(' ').trim()}
                style={{ '--drop': `${DROPS[i % DROPS.length]}px`, '--tilt': `${TILTS[i % TILTS.length]}deg`, '--d': `${i * 0.6}s` } as React.CSSProperties}
              >
                <span className="team-string" aria-hidden="true" />
                <div
                  className={on ? 'team-card is-flipped' : 'team-card'}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={on ? `${t.short}: show photo` : `${t.short}: read bio`}
                  onClick={() => tap(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      tap(i);
                    }
                  }}
                >
                  <div className="team-face team-front" aria-hidden={on}>
                    <span className="team-pic">
                      <img src={t.photo} alt="" loading="lazy" style={{ objectPosition: t.focus }} />
                    </span>
                    <strong className="team-name">{t.name}</strong>
                    <span className="team-role">{t.role}</span>
                  </div>
                  <div className="team-face team-back" aria-hidden={!on}>
                    <p>{t.bio}</p>
                    <a
                      className="btn btn-primary btn-sm"
                      href={t.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={on ? 0 : -1}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WhatsAppIcon />
                      Connect with {t.short}
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

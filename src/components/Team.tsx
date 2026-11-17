'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TEAM } from '@/data/content';

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z" />
    </svg>
  );
}

/* Cards hanging from a sagging line. Swipe sideways to see everyone; tap a
   card and it swings on its string and flips over to the person's bio. */
const DROPS = [20, 52, 30, 46, 24];
const TILTS = [-3, 2, -1.5, 2.5, -2];
const SAG = 34; // how far the middle of the line hangs below its ends, in px
const pad = (n: number) => String(n).padStart(2, '0');

export function Team() {
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set());
  const [swings, setSwings] = useState<number[]>(() => TEAM.map(() => 0));
  const line = useRef<HTMLUListElement>(null);

  // each string starts where the sagging line passes above its card
  useEffect(() => {
    const ul = line.current;
    if (!ul) return;
    const place = () => {
      const cards = Array.from(ul.querySelectorAll<HTMLElement>('.team-hang'));
      const cord = ul.querySelector<SVGElement>('.team-cord');
      if (!cards.length || !cord) return;
      // the line runs from a little before the first card to a little after the last
      const first = cards[0];
      const last = cards[cards.length - 1];
      const x0 = first.offsetLeft - 56;
      const x1 = last.offsetLeft + last.offsetWidth + 56;
      cord.style.left = `${x0}px`;
      cord.style.width = `${x1 - x0}px`;
      cards.forEach((li) => {
        const t = (li.offsetLeft + li.offsetWidth / 2 - x0) / (x1 - x0);
        li.style.setProperty('--y', `${(4 * SAG * t * (1 - t)).toFixed(1)}px`);
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

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
        <div>
          <p className="team-label">Motion Dojo · The team</p>
          <h2 className="team-title" id="team-title">
            Meet the people
            <br />
            <span>behind the work.</span>
          </h2>
        </div>
        <div className="team-aside">
          <p>The people who run the community, answer your questions and keep things moving.</p>
          <p className="team-label team-label-lime">
            {pad(TEAM.length)} people, one team
          </p>
        </div>
      </div>

      <div className="team-rail">
        <ul className="team-line" ref={line} aria-label="The team">
          <svg className="team-cord" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 0 Q50 20 100 0" />
          </svg>
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
                    <span className="team-top">
                      <span>Team · Dojo</span>
                      <span>#{pad(i + 1)}</span>
                    </span>
                    <span className="team-pic">
                      <img src={t.photo} alt="" loading="lazy" style={{ objectPosition: t.focus }} />
                    </span>
                    <strong className="team-name">{t.name}</strong>
                    <span className="team-role">{t.role}</span>
                    <span className="team-foot">
                      <span>View bio</span>
                      <span className="team-go">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </span>
                  </div>
                  <div className="team-face team-back" aria-hidden={!on}>
                    <p>{t.bio}</p>
                    <a
                      className="btn btn-ink btn-sm"
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

      <div className="wrap team-bottom">
        <span>The people make the Dojo</span>
        <span>Tap a card to flip · Swipe to see all</span>
      </div>
    </section>
  );
}

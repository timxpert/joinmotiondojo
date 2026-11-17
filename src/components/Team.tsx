'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TEAM } from '@/data/content';
import { Mark } from './Mark';

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z" />
    </svg>
  );
}

/* Cards hanging from a sagging line. Swipe sideways to see everyone; tap a
   card and it swings on its string and flips over to the person's bio. */
/* a small badge for each role, in place of an arrow */
function RoleIcon({ role }: { role: string }) {
  const r = role.toLowerCase();
  const path = r.includes('moderator') ? (
    // shield
    <path d="M12 3 5 6v5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6l-7-3Z" />
  ) : r.includes('social') ? (
    // megaphone
    <>
      <path d="M4 10v4h3l6 4V6l-6 4H4Z" />
      <path d="M17 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ) : (
    // two people: community
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
      <path d="M16 6.5a2.6 2.6 0 0 1 0 5.2M17.5 14.6c1.6.5 2.7 1.9 3.1 4.4" />
    </>
  );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path}
    </svg>
  );
}

const DROPS = [20, 52, 30, 46, 24];
const TILTS = [-3, 2, -1.5, 2.5, -2];
const SAG = 34; // how far the middle of the line hangs below its ends, in px
const pad = (n: number) => String(n).padStart(2, '0');

export function Team() {
  // only one card shows its bio at a time
  const [flipped, setFlipped] = useState<number | null>(null);
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
    setFlipped((f) => (f === i ? null : i));
    setSwings((s) => s.map((n, j) => (j === i ? n + 1 : n)));
  };

  return (
    <section className="section team-section" id="team" aria-labelledby="team-title">
      <div className="wrap team-head">
        <div>
          <h2 className="team-title" id="team-title">
            Meet the people
            <br />
            <span>
              behind the <Mark>work</Mark>
            </span>
          </h2>
        </div>
        <div className="team-aside">
          <p>The people who run the community, answer your questions and keep things moving.</p>
        </div>
      </div>

      <div className="team-rail">
        <ul className="team-line" ref={line} aria-label="The team">
          <svg className="team-cord" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 0 Q50 20 100 0" />
          </svg>
          {TEAM.map((t, i) => {
            const on = flipped === i;
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
                      <span>Dojo Team</span>
                      <span>#{pad(i + 1)}</span>
                    </span>
                    <span className="team-pic">
                      <img src={t.photo} alt="" loading="lazy" style={{ objectPosition: t.focus }} />
                    </span>
                    <strong className="team-name">{t.name}</strong>
                    <span className="team-role">{t.role}</span>
                    <span className="team-foot">
                      <span>Tap to see {t.short}’s bio</span>
                      <span className="team-go" title={t.role}>
                        <RoleIcon role={t.role} />
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

    </section>
  );
}

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '@/data/content';
import { VideoModal } from '../VideoModal';
import { Play } from '../Icons';

type T = (typeof TESTIMONIALS)[number];

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

/** Testimonial videos as a centred carousel: one card in focus, its neighbours peeking at the sides. */
export function Stories() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<T | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const close = useCallback(() => setPlaying(null), []);
  const n = TESTIMONIALS.length;

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const li = c as HTMLElement;
      const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const go = (i: number) => {
    const el = track.current;
    const li = el?.children[(i + n) % n] as HTMLElement | undefined;
    if (!el || !li) return;
    el.scrollTo({ left: li.offsetLeft + li.offsetWidth / 2 - el.clientWidth / 2, behavior: 'smooth' });
  };

  if (n === 0) return null;

  return (
    <section className="section" id="stories" aria-labelledby="stories-title">
      <div className="wrap stories">
        <h2 className="h2 stories-title" id="stories-title">
          <span className="line">Hear what community</span>{' '}
          <span className="line">
            members <span className="accent">are saying.</span>
          </span>
        </h2>

        <ul className="stories-track" ref={track} onScroll={onScroll} aria-label="Member stories">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.id} className={i === active ? 'is-active' : ''}>
              <article className="story-card">
                <button
                  type="button"
                  className="story-media"
                  onClick={() => (i === active ? setPlaying(t) : go(i))}
                  aria-label={`Play ${t.name}’s story`}
                >
                  <img src={t.poster} alt="" loading="lazy" className={t.portrait ? 'portrait' : undefined} />
                  <span className="story-play" aria-hidden="true">
                    <Play size={26} />
                  </span>
                </button>
                <h3 className="story-name">{t.name}</h3>
              </article>
            </li>
          ))}
        </ul>

        <div className="stories-nav">
          <button type="button" className="stories-btn" onClick={() => go(active - 1)} aria-label="Previous story">
            <Chevron dir="left" />
          </button>
          <button type="button" className="stories-btn" onClick={() => go(active + 1)} aria-label="Next story">
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      {playing && (
        <VideoModal url={playing.videoUrl} title={`${playing.name}’s story`} portrait={playing.portrait} onClose={close} />
      )}
    </section>
  );
}

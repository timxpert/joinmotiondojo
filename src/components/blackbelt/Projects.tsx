'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS } from '@/data/blackbelt';
import { VideoModal } from '../VideoModal';
import { ArrowRight, Play } from '../Icons';

/** Sample projects: a swipeable carousel of poster cards that open the Vimeo video. */
export function Projects() {
  const [playing, setPlaying] = useState<(typeof PROJECTS)[number] | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const track = useRef<HTMLUListElement>(null);
  const close = useCallback(() => setPlaying(null), []);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: 'smooth' });
  };

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="carousel-head">
          <div className="section-head">
            <h2 className="h2" id="projects-title">
              What you will make
            </h2>
            <p className="lede">Projects made in the Dojo with Alight Motion, on a smartphone.</p>
          </div>
          <div className="carousel-nav">
            <button type="button" className="carousel-btn prev" onClick={() => step(-1)} disabled={edges.start} aria-label="Previous project">
              <ArrowRight className="" />
            </button>
            <button type="button" className="carousel-btn" onClick={() => step(1)} disabled={edges.end} aria-label="Next project">
              <ArrowRight className="" />
            </button>
          </div>
        </div>

        <ul className="projects" ref={track} onScroll={update} aria-label="Sample projects">
          {PROJECTS.map((p) => (
            <li key={p.title}>
              <button type="button" className="project" onClick={() => setPlaying(p)} aria-label={`Play ${p.title}`}>
                <img src={p.poster} alt="" loading="lazy" />
                <span className="project-play" aria-hidden="true">
                  <Play size={20} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {playing && <VideoModal url={playing.video} title={playing.title} onClose={close} />}
    </section>
  );
}

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '@/data/content';
import { getVimeoEmbedUrl } from '@/utils/media';
import { Close, Play } from './Icons';

type T = (typeof TESTIMONIALS)[number];

export function Testimonials({ title = 'From our members' }: { title?: string }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<T | null>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  if (TESTIMONIALS.length === 0) return null;
  const current = TESTIMONIALS[active];

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = TESTIMONIALS.length;
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (next >= 0) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section className="section" id="stories" aria-labelledby="voices-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="voices-title">
            {title}
          </h2>
        </div>

        <div className="voices">
          <div className="voice-stage" id="voice-panel" role="tabpanel" aria-label={`${current.name}’s story`}>
            {TESTIMONIALS.map((t, i) => (
              <img
                key={t.id}
                src={t.poster}
                alt=""
                loading="lazy"
                className={[i === active ? 'is-active' : '', t.portrait ? 'portrait' : ''].join(' ').trim()}
              />
            ))}
            <button ref={playRef} type="button" className="play-btn" onClick={() => setPlaying(current)}>
              <span className="disc">
                <Play size={16} />
              </span>
              Watch {current.name}’s story
            </button>
          </div>

          <div className="voice-list" role="tablist" aria-label="Member stories" aria-orientation="vertical">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="voice-panel"
                tabIndex={i === active ? 0 : -1}
                className="voice-item"
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <img src={t.poster} alt="" loading="lazy" style={{ objectPosition: t.portrait ? '50% 35%' : '50% 45%' }} />
                <span className="voice-name">{t.name}</span>
                <span className="voice-quote">
                  <span>{t.summary}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {playing && (
        <VideoModal
          story={playing}
          onClose={() => {
            setPlaying(null);
            playRef.current?.focus();
          }}
        />
      )}
    </section>
  );
}

function VideoModal({ story, onClose }: { story: T; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const close = useCallback(onClose, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [close]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${story.name}’s story`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className={story.portrait ? 'modal-panel portrait' : 'modal-panel'}>
        <button ref={closeRef} type="button" className="modal-close" onClick={close} aria-label="Close video">
          <Close />
        </button>
        <div className="modal-video">
          {!loaded && <span>Loading video…</span>}
          <iframe
            src={getVimeoEmbedUrl(story.videoUrl)}
            title={`${story.name}’s story`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            style={loaded ? undefined : { position: 'absolute', opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
}

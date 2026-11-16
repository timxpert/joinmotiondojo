'use client';

import React, { useEffect, useRef, useState } from 'react';

// A frame from the reel itself, so the poster lines up with the video when zoomed
const POSTER = '/images/reel-poster.webp';

/**
 * Full-width 16:9 reel under the hero. The source video has the animation on a white card with a
 * margin around it; CSS zooms in so the card fills the full width. Muted, looping, no controls.
 * Lazy-loads, and shows only the poster for reduced motion or data saver.
 */
export function Reel() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) {
      setStill(true);
      return;
    }
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (load) video.current?.play().catch(() => {});
  }, [load]);

  return (
    <section className="reel" ref={box} aria-label="Motion Dojo logo animation">
      {still || failed ? (
        <img src={POSTER} alt="The Motion Dojo logo" />
      ) : (
        <video
          ref={video}
          src={load ? '/videos/hero.mp4' : undefined}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setFailed(true)}
          aria-label="The Motion Dojo logo animation"
        />
      )}
    </section>
  );
}

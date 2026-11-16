'use client';

import { useEffect } from 'react';

/* ------------------------------------------------------------------
   Site-wide motion, mounted once in the root layout.
   1. Tap feedback: buttons get a soft light that spreads from the exact
      point the finger or cursor touched (CSS does the press and release).
   2. Scroll reveal: section content settles into place the first time it
      enters the screen.
   3. Cards tilt toward the cursor (mouse only).
   4. Buttons drift slightly toward the cursor (mouse only).
   5. The header tucks away while scrolling down and returns on the way up.
   Everything switches off when the visitor asks for reduced motion.
------------------------------------------------------------------- */

const TAP_TARGETS = '.btn, .carousel-btn, .stories-btn, .enrol-option, .menu-btn';
const TILT_TARGETS = '.project, .story-card, .bb-plan, .bb-card';
const REVEAL_ITEMS = [
  'main > .section:not(.hero):not(.reel) .wrap > *',
].join(',');

export function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onDown = (e: PointerEvent) => {
      if (reduced.matches || e.button > 0) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>(TAP_TARGETS);
      if (!el || (el as HTMLButtonElement).disabled) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
      const ink = document.createElement('span');
      ink.className = 'tap-ink';
      ink.setAttribute('aria-hidden', 'true');
      ink.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
      el.appendChild(ink);
      const done = () => ink.remove();
      ink.addEventListener('animationend', done, { once: true });
      window.setTimeout(done, 1200);
    };
    document.addEventListener('pointerdown', onDown, { passive: true });

    let io: IntersectionObserver | null = null;
    if (!reduced.matches && 'IntersectionObserver' in window) {
      const items = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_ITEMS));
      const watch = new Map<Element, HTMLElement[]>();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            (watch.get(entry.target) || []).forEach((el) => {
              el.classList.add('is-in');
              // Once settled, drop the stagger delays so hover effects respond instantly
              window.setTimeout(() => el.classList.add('is-done'), 1800);
            });
            io?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      items.forEach((el) => {
        // Already on screen (e.g. after a reload halfway down): leave it alone
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        el.style.setProperty('--i', String(Math.min(siblings.indexOf(el), 3)));
        el.classList.add('reveal');
        // Headings are triggered by their parent block (a hidden heading is a poor trigger)
        const target = el.matches('.h2, .display') && el.parentElement ? el.parentElement : el;
        watch.set(target, [...(watch.get(target) || []), el]);
        io!.observe(target);
      });
    }

    /* 3. Cards lean slightly toward the cursor
          (mouse and trackpad only; touch screens keep things still). */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let tiltEl: HTMLElement | null = null;
    let magnetEl: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const release = (el: HTMLElement | null, kind: 'tilt' | 'magnet') => {
      if (!el) return;
      if (kind === 'tilt') {
        el.classList.remove('is-tilting');
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      } else {
        el.style.removeProperty('translate');
      }
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;

      const t = target?.closest<HTMLElement>(TILT_TARGETS) ?? null;
      if (t !== tiltEl) {
        release(tiltEl, 'tilt');
        tiltEl = t;
      }
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        t.classList.add('is-tilting');
        t.style.setProperty('--rx', `${((0.5 - py) * 5).toFixed(2)}deg`);
        t.style.setProperty('--ry', `${((px - 0.5) * 6).toFixed(2)}deg`);
      }

      /* 4. Buttons drift a few pixels toward the cursor, then spring back. */
      const m = target?.closest<HTMLElement>('.btn') ?? null;
      if (m !== magnetEl) {
        release(magnetEl, 'magnet');
        magnetEl = m;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        m.style.translate = `${(dx * 5).toFixed(1)}px ${(dy * 3).toFixed(1)}px`;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (reduced.matches || !fine.matches || e.pointerType !== 'mouse') return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeaveDoc = () => {
      release(tiltEl, 'tilt');
      release(magnetEl, 'magnet');
      tiltEl = magnetEl = null;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveDoc);

    /* 5. The header slides away while reading down and returns on the way up. */
    const header = document.querySelector<HTMLElement>('.header');
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (header && !header.classList.contains('is-open')) {
        if (y > 480 && y - lastY > 6) header.classList.add('is-tucked');
        else if (lastY - y > 6 || y < 480) header.classList.remove('is-tucked');
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Anything focused inside the header (keyboard users) brings it back
    header?.addEventListener('focusin', () => header.classList.remove('is-tucked'));

    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, []);

  return null;
}

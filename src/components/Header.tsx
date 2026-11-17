'use client';

import React, { useEffect, useState } from 'react';
import { COMMUNITY_JOIN_URL, NAV } from '@/config/site';

type Link = { href: string; label: string };

export function Header({ nav = NAV, cta = { href: COMMUNITY_JOIN_URL, label: 'Join the community' } }: { nav?: Link[]; cta?: Link }) {
  const [open, setOpen] = useState(false);
  // Links to the course page open it in a new tab; in-page links (#pricing) don't
  const ctaTab = /^https?:/.test(cta.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <>
      <header className={['header', scrolled ? 'is-scrolled' : '', open ? 'is-open' : ''].join(' ').trim()}>
        <div className="wrap header-row">
          <a href="/" className="brand" aria-label="Motion Dojo home" onClick={() => setOpen(false)}>
            <img src="/assets/favicon-128.png" alt="" width={34} height={34} />
            Motion Dojo
          </a>

          <nav className="nav" aria-label="Main">
            {nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>

          <a href={cta.href} {...ctaTab} className="btn btn-primary btn-sm">
            {cta.label}
          </a>

          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <div id="mobile-nav" className={open ? 'mobile-nav is-open' : 'mobile-nav'} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={cta.href} {...ctaTab} className="btn btn-primary" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          {cta.label}
        </a>
      </div>
    </>
  );
}

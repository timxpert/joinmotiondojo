import React from 'react';
import { COMMUNITY_JOIN_URL } from '@/config/site';

export function FinalCTA({
  title = '',
  lede = 'Join smartphone motion designers who learn, share their work and get better together.',
  action,
}: {
  title?: string;
  lede?: string;
  /** Replaces the default "Join Motion Dojo" link */
  action?: React.ReactNode;
}) {
  return (
    <section
      className={title ? 'section dark-section final' : 'section dark-section final no-title'}
      {...(title ? { 'aria-labelledby': 'final-title' } : { 'aria-label': 'Join Motion Dojo' })}
    >
      <div className="wrap">
        <svg className="final-art" viewBox="0 0 800 500" aria-hidden="true">
          <path className="trail" d="M40 380 C 200 380, 240 90, 400 120 S 620 330, 760 60" />
          <rect className="k" x="31" y="371" width="18" height="18" rx="3" transform="rotate(45 40 380)" />
          <rect className="k" x="391" y="111" width="18" height="18" rx="3" transform="rotate(45 400 120)" />
          <rect className="k k-lime" x="749" y="49" width="22" height="22" rx="3" transform="rotate(45 760 60)" />
        </svg>

        {title && (
          <h2 className="display" id="final-title">
            {title}
          </h2>
        )}
        <p className="lede">{lede}</p>
        {action ?? (
          <a href={COMMUNITY_JOIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-lime">
            Join the community
          </a>
        )}
      </div>
    </section>
  );
}

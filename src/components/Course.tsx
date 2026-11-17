import React from 'react';
import { COMMUNITY_JOIN_URL, CONNECT_URL, COURSE_URL } from '@/config/site';

/* Motion Dojo, Black Belt and Connect: what each name means. */
export function Course() {
  const parts = [
    {
      name: 'Motion Dojo',
      body: 'The community. Smartphone motion designers and creative enthusiasts learning and growing together.',
      link: { href: COMMUNITY_JOIN_URL, label: 'Join the community', newTab: true, className: 'btn btn-paper' },
      tone: 'violet',
    },
    {
      name: 'Black Belt in Motion Design',
      body: 'The course. Structured training for members who want a guided learning experience.',
      link: { href: COURSE_URL, label: 'See the course', newTab: true, className: 'btn btn-ink' },
      tone: 'lime',
    },
    {
      name: 'Motion Dojo Connect',
      body: 'The members’ space. Your profile and work, a feed for motion design and messages, away from WhatsApp noise.',
      link: { href: CONNECT_URL, label: 'Open Connect', newTab: true, className: 'btn btn-paper' },
      tone: 'dark',
    },
  ];

  return (
    <section className="section" id="ecosystem" aria-labelledby="ecosystem-title">
      <div className="wrap stack-layout">
        <div className="stack-head">
          <h2 className="h2" id="ecosystem-title">
            Motion Dojo, Black Belt and Connect
          </h2>
        </div>
        <ul className="stack">
          {parts.map((p, i) => (
            <li key={p.name} className={`stack-card tone-${p.tone}`} style={{ '--i': i } as React.CSSProperties}>
              <span className="stack-n">
                {String(i + 1).padStart(2, '0')} / {String(parts.length).padStart(2, '0')}
              </span>
              <h3 className="stack-name">{p.name}</h3>
              <p>{p.body}</p>
              {p.link.href && (
                <a
                  href={p.link.href}
                  className={`${p.link.className} btn-sm`}
                  {...(p.link.newTab ? { target: '_blank', rel: /^https?:/.test(p.link.href) ? 'noopener noreferrer' : 'noopener' } : {})}
                >
                  {p.link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

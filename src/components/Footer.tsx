import React from 'react';
import { BackToTop } from './BackToTop';
import { CONNECT_URL, CONTACT, COURSE_URL, DOJO_AI_URL, SOCIAL_LINKS } from '@/config/site';

type IconName =
  | 'belt'
  | 'ninja'
  | 'spark'
  | 'info'
  | 'people'
  | 'team'
  | 'chat'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'whatsapp'
  | 'mail'
  | 'up'
  | 'out';

/** One outline icon set on a 24px grid, 1.8px stroke, round joins. */
function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const d: Record<IconName, React.ReactNode> = {
    // a tied belt: the band and the knot with two tails
    // an award badge: earning the black belt
    belt: (
      <>
        <circle cx="12" cy="9" r="5.5" />
        <path d="m8.6 13.4-1.6 7.1 5-2.6 5 2.6-1.6-7.1" />
      </>
    ),
    // a showcase: a framed piece of work with a play mark
    ninja: (
      <>
        <rect x="3" y="4.5" width="18" height="13" rx="3" />
        <path d="m10.5 8.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" />
        <path d="M8 20.5h8" />
      </>
    ),
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5.5M12 7.6v.1" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
        <path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.8c1.9.6 3.1 2.2 3.5 4.7" />
      </>
    ),
    chat: <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 17H10l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z" />,
    team: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="10" r="3" />
        <path d="M6.6 18.2c1.2-2 3.1-3.2 5.4-3.2s4.2 1.2 5.4 3.2" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    // TikTok note, drawn in the same outline style as the other icons
    tiktok: <path d="M14.8 2.8v12a4.5 4.5 0 1 1-4.5-4.5M14.8 2.8c.3 2.8 2.4 4.9 5.2 5.1" />,
    youtube: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="4" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z" />
        <path d="M9.5 9.5c.3 1.6 1.5 3.4 3.5 4.5l1.2-1 1.8.8c-.2 1-1 1.7-2 1.7-3 0-6.5-3.5-6.5-6.5 0-1 .7-1.8 1.7-2l.8 1.8-1 1.2Z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    up: <path d="M12 19V5M6 11l6-6 6 6" />,
    out: <path d="M7 17 17 7M9 7h8v8" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d[name]}
    </svg>
  );
}

type FLink = { label: string; href: string; icon: IconName; external?: boolean };

function LinkList({ title, links }: { title: string; links: FLink[] }) {
  return (
    <div className="footer-col">
      <h2 className="footer-label">{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.label}>
            <a className="footer-link" href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="footer-ico">
                <Icon name={l.icon} />
              </span>
              <span className="footer-link-text">{l.label}</span>
              <span className="footer-go">
                <Icon name={l.external ? 'out' : 'up'} size={16} />
              </span>
              {l.external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOCIAL_ICON: Record<string, IconName> = { Instagram: 'instagram', YouTube: 'youtube', TikTok: 'tiktok' };

export function Footer() {
  const learn: FLink[] = [
    { label: 'Black Belt in Motion Design', href: COURSE_URL, icon: 'belt' },
    { label: 'Motion Dojo Connect', href: CONNECT_URL, icon: 'chat', external: true },
    ...(DOJO_AI_URL ? [{ label: 'Dojo’s AI', href: DOJO_AI_URL, icon: 'spark' as IconName }] : []),
  ];
  const dojo: FLink[] = [
    { label: 'About', href: '/#intro', icon: 'info' },
    { label: 'Meet the team', href: '/#team', icon: 'team' },
  ];
  const socials = [
    ...SOCIAL_LINKS.filter((s) => SOCIAL_ICON[s.label]).map((s) => ({ label: s.label, href: s.url, icon: SOCIAL_ICON[s.label] })),
    ...(CONTACT.whatsapp
      ? [{ label: 'WhatsApp', href: `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`, icon: 'whatsapp' as IconName }]
      : []),
    ...(CONTACT.email ? [{ label: 'Email', href: `mailto:${CONTACT.email}`, icon: 'mail' as IconName }] : []),
  ];

  return (
    <footer className="footer">
      <div className="footer-panel">
        <div className="footer-brand">
          <a href="/" className="footer-logo" aria-label="Motion Dojo home">
            <img src="/assets/favicon-128.png" alt="" width={32} height={32} />
            Motion Dojo
          </a>
          <p className="footer-tagline">Train like a ninja, create like a master.</p>
          <ul className="footer-socials" aria-label="Motion Dojo on social media">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={s.label}
                  title={s.label}
                >
                  <Icon name={s.icon} size={22} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer-cols" aria-label="Footer">
          <LinkList title="Learn" links={learn} />
          <LinkList title="The dojo" links={dojo} />
        </nav>
      </div>

      <p className="footer-bottom">© {new Date().getFullYear()} Motion Dojo. All rights reserved.</p>
      <BackToTop />
    </footer>
  );
}

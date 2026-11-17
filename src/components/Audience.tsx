import React from 'react';

/* Who Motion Dojo is for. Outline icons on a 24px grid, 1.8px stroke,
   the same style as the footer icons. */
const ICONS = {
  // a sprout: just starting
  start: (
    <>
      <path d="M12 20v-8" />
      <path d="M12 12c0-3.3-2.4-5.5-6-5.5 0 3.3 2.4 5.5 6 5.5Z" />
      <path d="M12 14.5c0-3 2.2-5 5.5-5 0 3-2.2 5-5.5 5Z" />
      <path d="M8 20h8" />
    </>
  ),
  // a play button inside a phone-sized frame: learning from videos
  self: (
    <>
      <rect x="3.5" y="5" width="17" height="12" rx="2.5" />
      <path d="m10.5 8.8 4 2.2-4 2.2Z" />
      <path d="M9 20h6" />
    </>
  ),
  // a phone with a motion line: making content
  creator: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M10 17.5h4" />
      <path d="M9.5 11c1-1.6 2-1.6 2.5 0s1.5 1.6 2.5 0" />
    </>
  ),
  // a briefcase: paid work
  pro: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" />
      <path d="M3.5 12.5h17" />
      <path d="M11 12.5v1.5h2v-1.5" />
    </>
  ),
};

const PEOPLE: { icon: keyof typeof ICONS; title: string; body: string }[] = [
  { icon: 'start', title: 'Beginners', body: 'You’ve never animated before and want to start with the phone you already have.' },
  { icon: 'self', title: 'Self-taught animators', body: 'You learned from YouTube and want structure, feedback and fewer gaps.' },
  { icon: 'creator', title: 'Content creators', body: 'You make content for your own pages or for brands and want it to move.' },
  { icon: 'pro', title: 'Freelancers', body: 'You want paid motion work and need the portfolio and the people to get it.' },
];

export function Audience() {
  return (
    <section className="section" id="who" aria-labelledby="who-title">
      <div className="wrap who">
        <div className="who-head">
          <h2 className="h2" id="who-title">
            Who Motion Dojo is for
          </h2>
          <p className="lede">Anyone animating on a phone who wants to get better, wherever they’re starting from.</p>
        </div>
        <ul className="who-list">
          {PEOPLE.map((p) => (
            <li key={p.title} className="who-item">
              <span className="who-ico" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[p.icon]}
                </svg>
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

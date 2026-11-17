import React from 'react';

/* The three things Motion Dojo is built around, in Motion Dojo's own words. */
const PILLARS = [
  {
    key: 'learn',
    title: 'Learning',
    body: 'Helping members understand motion design, master their tools, and develop strong creative foundations.',
  },
  {
    key: 'community',
    title: 'Community',
    body: 'Connecting like-minded creatives who can learn from, support, challenge, and inspire one another.',
  },
  {
    key: 'grow',
    title: 'Growth',
    body: 'Helping members move beyond tutorials to creating meaningful work, building portfolios, and finding opportunities.',
  },
];

export function Inside() {
  return (
    <section className="section" id="pillars" aria-labelledby="pillars-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="pillars-title">
            What Motion Dojo is built around
          </h2>
        </div>

        <ol className="steps">
          {PILLARS.map((p, i) => (
            <li key={p.key} className="step">
              <span className="step-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

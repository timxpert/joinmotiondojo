import React from 'react';
import { CONNECT_URL } from '@/config/site';

/* Motion Dojo Connect: the members' own space, away from WhatsApp. */
const POINTS = [
  { title: 'Your profile is your portfolio', body: 'Post your work, add your links and share one address with clients.' },
  { title: 'A feed for motion work only', body: 'See what other members are making, ask for feedback and give it.' },
  { title: 'Messages that don’t get buried', body: 'Chat one-to-one, send voice notes, renders and project files.' },
  { title: 'Your belt, if you want it shown', body: 'Black Belt members show their phase, from White to Black. You can keep it private.' },
];

export function Connect() {
  return (
    <section className="section" id="connect" aria-labelledby="connect-title">
      <div className="wrap connect">
        <div className="connect-text">
          <h2 className="h2" id="connect-title">
            Motion Dojo Connect
          </h2>
          <p className="lede">
            WhatsApp groups get noisy. Good work scrolls past in minutes and questions go unanswered. Connect is where members post, talk and keep
            track of each other’s progress, without the noise.
          </p>
          <ul className="connect-points">
            {POINTS.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="connect-actions">
            <a href={CONNECT_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Open Connect
            </a>
            <span className="connect-note">For Motion Dojo members. Sign in with your email and member ID.</span>
          </div>
        </div>

        {/* A drawing of the app, not a screenshot */}
        <div className="connect-mock" aria-hidden="true">
          <div className="cm-card">
            <div className="cm-cover" />
            <div className="cm-who">
              <span className="cm-avatar">A</span>
              <span>
                <strong>Ada</strong>
                <small>Kinetic type · Logo reveals</small>
              </span>
              <span className="cm-belt">Green Belt</span>
            </div>
            <div className="cm-grid">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="cm-chat">
            <p className="cm-msg">How did you get that text bounce?</p>
            <p className="cm-msg is-mine">
              Overshoot on the second keyframe
              <span className="cm-ticks">✓✓</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

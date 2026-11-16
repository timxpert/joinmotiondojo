import React from 'react';
import { CURRICULUM, ENROL, FAQS, INCLUDED, PERKS, WHO_FOR } from '@/data/blackbelt';
import { TEAM } from '@/data/content';
import { EnrolButton } from './Enrol';

/* ------------------------------------------------------------------
   Black Belt in Motion Design: page sections.
   Copy carried over from joinmotiondojo.vercel.app.
------------------------------------------------------------------- */

export function CourseHero() {
  return (
    <section className="hero bb-hero" id="top" aria-labelledby="bb-title">
      <div className="wrap bb-hero-grid">
        <div className="hero-copy">
          <h1 className="display" id="bb-title">
            Become a dangerously good motion designer
          </h1>
          <p className="lede">
            <strong>Black Belt in Motion Design</strong> is the Motion Dojo community’s complete course. Master Alight
            Motion and create professional animations, all on your phone.
          </p>
          <div className="btn-pair">
            <EnrolButton>Enrol now</EnrolButton>
          </div>
          <p className="bb-price-note">
            Pay {ENROL.priceLabel} one-time, or 2 payments of {ENROL.instalmentLabel}.
          </p>
        </div>

        <div className="bb-phone">
          <video
            src="/videos/blackbelt-loop.mp4"
            poster="/images/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Motion design made in Alight Motion on a phone"
          />
        </div>
      </div>
    </section>
  );
}

export function WhoFor() {
  return (
    <section className="section" id="who" aria-labelledby="who-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="who-title">
            Is this for you?
          </h2>
          <p className="lede">A motion design course for anyone with a smartphone and big ambition.</p>
        </div>
        <ul className="bb-grid">
          {WHO_FOR.map((w) => (
            <li key={w.title} className="bb-card">
              <h3 className="h3">{w.title}</h3>
              <p>{w.body}</p>
            </li>
          ))}
        </ul>
        <p className="bb-aside">
          Not for you if you want overnight results without practice. This is a dojo. We train.
        </p>
      </div>
    </section>
  );
}

export function Curriculum() {
  return (
    <section className="section" id="curriculum" aria-labelledby="curriculum-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="curriculum-title">
            One journey, four phases
          </h2>
          <p className="lede">
            A complete motion design course with Alight Motion, from your first keyframe to landing clients.
          </p>
        </div>
        <div className="bb-phases">
          {CURRICULUM.map((p, i) => (
            <details key={p.title} className="bb-phase" open={i === 0}>
              <summary>
                <span className="bb-phase-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="bb-phase-title">
                  <span className="sr-only">Phase {i + 1}: </span>
                  {p.title}
                </span>
                <span className="bb-phase-count">{p.lessons.length} lessons</span>
                <span className="bb-chev" aria-hidden="true" />
              </summary>
              <ol className="bb-lessons">
                {p.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="wrap bb-split">
        <div className="bb-split-copy">
          <h2 className="h2" id="experience-title">
            The Dojo’s Experience
          </h2>
          <p className="lede">Accelerate your growth alongside designers who push standards higher every single day.</p>
        </div>
        <ul className="bb-perks">
          {PERKS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="pricing-title">
            Choose how you want to pay
          </h2>
          <p className="lede">One course, one price. Pay in full or split it in two.</p>
        </div>
        <div className="bb-plans">
          <article className="bb-plan bb-plan-main">
            <h3 className="bb-plan-name">Pay in full</h3>
            <p className="bb-plan-price">{ENROL.priceLabel}</p>
            <p className="bb-plan-sub">One-time payment, lifetime access</p>
            <ul className="bb-included">
              {INCLUDED.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <EnrolButton className="btn btn-lime">Enrol now</EnrolButton>
          </article>
          <article className="bb-plan">
            <h3 className="bb-plan-name">Two instalments</h3>
            <p className="bb-plan-price">
              2 × {ENROL.instalmentLabel}
            </p>
            <p className="bb-plan-sub">
              {ENROL.priceLabel} total. The first instalment unlocks Phase 01 only. The remaining phases unlock once the
              full fee is paid.
            </p>
            <a className="btn btn-primary" href={ENROL.instalmentUrl} target="_blank" rel="noopener noreferrer">
              Start instalment
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap bb-split">
        <div className="bb-split-copy">
          <h2 className="h2" id="faq-title">
            Questions, answered
          </h2>
          <p className="lede">
            Still unsure?{' '}
            <a className="bb-inline" href={TEAM[0].whatsapp} target="_blank" rel="noopener noreferrer">
              Ask our community manager on WhatsApp
            </a>
            .
          </p>
        </div>
        <div className="bb-faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <span className="bb-chev" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

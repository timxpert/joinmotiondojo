import React from 'react';

export function Intro() {
  return (
    <section className="section" id="intro" aria-labelledby="intro-title">
      <div className="wrap intro-grid">
        <h2 className="h2" id="intro-title">
          A community for smartphone motion designers
        </h2>
        <div className="intro-copy">
          <p className="lede">
            Motion Dojo is built for smartphone motion designers and creative enthusiasts who want to learn, improve,
            connect, and grow together.
          </p>
          <p className="lede">
            But it’s more than a place to learn how to animate. It’s where you develop your creative skills, discover
            your potential, share ideas, get feedback, collaborate with other creatives, and build confidence in your
            abilities.
          </p>
        </div>
      </div>
    </section>
  );
}

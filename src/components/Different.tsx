import React from 'react';
import { DojoGlow } from './ui/DojoGlow';

export function Different() {
  return (
    <section className="section dark-section different live-bg" id="different" aria-label="Why Motion Dojo">
      <DojoGlow speed={1.1} />
      <div className="wrap">
        <p className="lede different-line">Your growth shouldn’t be limited by the tools you use, <em>or by learning alone.</em></p>
      </div>
    </section>
  );
}

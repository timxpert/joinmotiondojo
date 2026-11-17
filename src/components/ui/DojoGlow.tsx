import React from 'react';
import Velaris from './velaris';

/* The moving Motion Dojo gradient as a background layer. Put it first inside
   a section that has the "live-bg" class. Same colours as the hero. */
export function DojoGlow({ speed = 1.4 }: { speed?: number }) {
  return <Velaris className="hero-bg" bg="#140a2e" colors={['#6d32e8', '#a77bff', '#3a1a8c', '#140a2e']} speed={speed} grain={0.35} />;
}

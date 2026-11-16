import React from 'react';

type P = { size?: number; className?: string };

const svg = (size: number, className: string | undefined, children: React.ReactNode, filled = false) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {children}
  </svg>
);

export const ArrowRight = ({ size = 18, className = 'arrow' }: P) =>
  svg(size, className, <path d="M5 12h14M13 6l6 6-6 6" />);

export const Play = ({ size = 18, className }: P) =>
  svg(size, className, <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />, true);

export const Close = ({ size = 20, className }: P) => svg(size, className, <path d="M6 6l12 12M18 6 6 18" />);

export const SoundOff = ({ size = 16, className }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </>,
  );

export const SoundOn = ({ size = 16, className }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </>,
  );

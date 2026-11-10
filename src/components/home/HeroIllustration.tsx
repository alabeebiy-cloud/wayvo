import React from 'react';

/** Decorative route graphic drawn in SVG, so no image files are needed. */
export const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 260" role="img" aria-label="A route drawn between a pickup point and a destination" className={className}>
    <rect width="400" height="260" rx="28" fill="#EDFAF3" />
    <g stroke="#D3F3E2" strokeWidth="2">
      <path d="M0 60H400M0 130H400M0 200H400M80 0V260M170 0V260M260 0V260M340 0V260" />
    </g>
    <path d="M60 205 C 120 205, 120 120, 200 125 S 300 70, 345 52" fill="none" stroke="#0F8A55" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 14" />
    <circle cx="60" cy="205" r="12" fill="#14201B" />
    <circle cx="60" cy="205" r="4.5" fill="#fff" />
    <circle cx="345" cy="52" r="14" fill="#0F8A55" />
    <circle cx="345" cy="52" r="5" fill="#fff" />
    <g transform="translate(168 94)">
      <rect width="64" height="34" rx="12" fill="#14201B" />
      <rect x="10" y="7" width="20" height="12" rx="4" fill="#6FD3A1" />
      <rect x="34" y="7" width="20" height="12" rx="4" fill="#6FD3A1" />
      <circle cx="16" cy="30" r="5" fill="#fff" stroke="#14201B" strokeWidth="3" />
      <circle cx="48" cy="30" r="5" fill="#fff" stroke="#14201B" strokeWidth="3" />
    </g>
  </svg>
);
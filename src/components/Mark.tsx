import React from 'react';

/* One word in a heading, set in an italic serif with a hand-drawn loop
   around it. The loop draws itself in as the heading scrolls into view. */
export function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="mark">
      {children}
      <svg className="mark-loop" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          pathLength={1}
          d="M38 14C82 3 168 4 189 29c17 21-22 44-90 46C40 77 6 62 9 41 12 22 48 11 104 9c22-1 40 0 56 3"
        />
      </svg>
    </span>
  );
}

import React from 'react';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; newTab?: boolean };

/** Anchor with an opt-in new tab (used for social profiles and the showcase). */
export function SmartLink({ href, newTab = false, children, ...rest }: Props) {
  return (
    <a href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}

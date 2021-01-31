import React from 'react';
import LinkNext from 'next/link';

export default function Link({ children, href, ...rest }) {
  return (
    <LinkNext href={href} passHref>
      <a {...rest}>
        {children}
      </a>
    </LinkNext>
  );
}

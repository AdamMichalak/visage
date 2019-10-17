import React from 'react';

export const CollapseUpIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <polyline
      fill="none"
      points="21,8.5 12,17.5 3,8.5 "
      stroke="currentColor"
      strokeWidth="2"
      transform="scale(1,-1) translate(0,-24)"
    />
  </svg>
);

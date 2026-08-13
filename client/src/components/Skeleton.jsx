import React from 'react';

// Tiny skeleton placeholder used during loading states. Keep very small and
// purely presentational so it can be reused across components.
export default function Skeleton({ height = 16, width = '100%', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: 8, ...style }}
      aria-hidden="true"
    />
  );
}

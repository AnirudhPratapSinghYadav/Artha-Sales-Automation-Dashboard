import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://www.thinkartha.com/static/img/artha-logo1.png"
      alt="Artha Solutions Logo"
      className={`h-8 object-contain transition-all ${className}`}
    />
  );
}

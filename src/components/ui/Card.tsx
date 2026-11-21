'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`card-dark p-6 ${glow ? 'neon-border' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

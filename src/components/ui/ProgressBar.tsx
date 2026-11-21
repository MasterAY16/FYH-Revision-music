'use client';

import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, className = '', showLabel = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm text-gray-400 font-mono">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden border border-gray-800">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #00FFFF, #FF00FF)',
            boxShadow: '0 0 10px #00FFFF',
          }}
        />
      </div>
    </div>
  );
}

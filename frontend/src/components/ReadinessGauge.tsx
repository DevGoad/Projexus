'use client';

import React from 'react';

interface ReadinessGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export default function ReadinessGauge({
  score,
  size = 40,
  strokeWidth = 3.5,
  showText = true,
}: ReadinessGaugeProps) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#162942"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 leading-tight">
            READINESS
          </span>
          <span className="font-mono text-xs font-bold text-amber-400 leading-tight">
            {normalizedScore}%
          </span>
        </div>
      )}
    </div>
  );
}

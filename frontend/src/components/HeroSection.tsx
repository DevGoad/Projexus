'use client';

import React from 'react';
import { Stats } from '@/types';

interface HeroSectionProps {
  stats?: Stats | null;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const projectsListed = stats?.projects_listed ?? 0;
  const productionReady = stats?.production_ready ?? 0;

  return (
    <section className="mb-8 pt-4">
      {/* Eyebrow label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
          — FINAL-YEAR SHOWCASE INDEX
        </span>
      </div>

      {/* Large headline */}
      <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mb-4">
        Where engineering work gets seen{' '}
        <span className="text-amber-500 font-bold underline decoration-amber-500/40 underline-offset-4">
          before
        </span>{' '}
        the interview.
      </h1>

      {/* Short subtext */}
      <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
        Browse production-ready student projects across mechanical, civil, embedded, energy, and
        software engineering — filtered, scored, and ready for recruiters to evaluate.
      </p>

      {/* Live Stat Strip (Computed from database) */}
      <div className="inline-flex border border-[#162a45] bg-[#091426] divide-x divide-[#162a45]">
        {/* Stat 1: Projects Listed */}
        <div className="px-6 py-3 flex flex-col justify-center min-w-[140px]">
          <span className="font-sans text-2xl sm:text-3xl font-bold text-amber-500 leading-none">
            {projectsListed}
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400 mt-1">
            PROJECTS LISTED
          </span>
        </div>

        {/* Stat 2: Production-Ready */}
        <div className="px-6 py-3 flex flex-col justify-center min-w-[160px]">
          <span className="font-sans text-2xl sm:text-3xl font-bold text-amber-500 leading-none">
            {productionReady}
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400 mt-1">
            PRODUCTION-READY
          </span>
        </div>
      </div>
    </section>
  );
}

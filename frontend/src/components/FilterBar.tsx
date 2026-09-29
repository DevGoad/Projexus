'use client';

import React, { useState } from 'react';
import { Domain, Stats } from '@/types';

interface FilterBarProps {
  domains: Domain[];
  stats?: Stats | null;
  selectedDomain: string;
  onSelectDomain: (domain: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedYear?: number;
  onYearChange: (y?: number) => void;
  selectedBranch?: string;
  onBranchChange: (b?: string) => void;
  selectedTechTag?: string;
  onTechTagChange: (t?: string) => void;
  readinessFilter: string; // 'all' | 'ready' | 'in_progress'
  onReadinessFilterChange: (val: string) => void;
  selectedDemoType?: string;
  onDemoTypeChange: (dt?: string) => void;
  totalShown: number;
}

export default function FilterBar({
  domains,
  stats,
  selectedDomain,
  onSelectDomain,
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedBranch,
  onBranchChange,
  selectedTechTag,
  onTechTagChange,
  readinessFilter,
  onReadinessFilterChange,
  selectedDemoType,
  onDemoTypeChange,
  totalShown,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Available domain chips: start with "ALL", then dynamic domains from DB
  const domainList = ['ALL', ...domains.map((d) => d.name)];

  const hasActiveAdvancedFilters =
    Boolean(selectedYear) ||
    Boolean(selectedBranch) ||
    Boolean(selectedTechTag) ||
    readinessFilter !== 'all' ||
    Boolean(selectedDemoType);

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input + Domain Filter Chips Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, tech, or keyword..."
            className="w-full bg-[#091426] border border-[#162a45] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 font-mono text-xs"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Domain Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {domainList.map((domain) => {
            const isActive =
              selectedDomain.toUpperCase() === domain.toUpperCase();
            return (
              <button
                key={domain}
                onClick={() => onSelectDomain(domain)}
                className={`whitespace-nowrap px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-cyan-400 text-[#070e1c] border-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'bg-[#091426] text-slate-300 border-[#162a45] hover:border-[#224472] hover:text-slate-100'
                }`}
              >
                {domain}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters Toggle & Results Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#13243a]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
            {selectedDomain === 'ALL' ? 'ALL PROJECTS' : selectedDomain}
          </span>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`font-mono text-xs px-2 py-1 border transition-colors flex items-center gap-1 ${
              hasActiveAdvancedFilters || showAdvanced
                ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                : 'border-[#162a45] text-slate-400 hover:border-[#224472] hover:text-slate-300'
            }`}
          >
            <span>[+] FILTERS</span>
            {hasActiveAdvancedFilters && (
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </button>

          {hasActiveAdvancedFilters && (
            <button
              onClick={() => {
                onYearChange(undefined);
                onBranchChange(undefined);
                onTechTagChange(undefined);
                onReadinessFilterChange('all');
                onDemoTypeChange(undefined);
              }}
              className="font-mono text-[11px] text-amber-400 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="font-mono text-xs uppercase tracking-wider text-slate-400">
          <span className="text-slate-200 font-semibold">{totalShown}</span> SHOWN
        </div>
      </div>

      {/* Collapsible Advanced Filters Panel */}
      {showAdvanced && (
        <div className="p-4 bg-[#091426] border border-[#162a45] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          {/* Year Filter */}
          <div>
            <label className="block text-slate-400 mb-1 text-[11px] uppercase">
              Year
            </label>
            <select
              value={selectedYear || ''}
              onChange={(e) =>
                onYearChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full bg-[#060e1b] border border-[#162a45] text-slate-200 px-2 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Years</option>
              {stats?.years?.map((y) => (
                <option key={y} value={y}>
                  Class of {y}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-slate-400 mb-1 text-[11px] uppercase">
              Branch / Dept
            </label>
            <select
              value={selectedBranch || ''}
              onChange={(e) => onBranchChange(e.target.value || undefined)}
              className="w-full bg-[#060e1b] border border-[#162a45] text-slate-200 px-2 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Branches</option>
              {stats?.branches?.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Readiness Range Filter */}
          <div>
            <label className="block text-slate-400 mb-1 text-[11px] uppercase">
              Readiness Score
            </label>
            <select
              value={readinessFilter}
              onChange={(e) => onReadinessFilterChange(e.target.value)}
              className="w-full bg-[#060e1b] border border-[#162a45] text-slate-200 px-2 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Scores (0-100%)</option>
              <option value="ready">Production-Ready (&ge; 75%)</option>
              <option value="in_progress">In Progress (&lt; 75%)</option>
            </select>
          </div>

          {/* Demo Type Filter */}
          <div>
            <label className="block text-slate-400 mb-1 text-[11px] uppercase">
              Demo Type
            </label>
            <select
              value={selectedDemoType || ''}
              onChange={(e) => onDemoTypeChange(e.target.value || undefined)}
              className="w-full bg-[#060e1b] border border-[#162a45] text-slate-200 px-2 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Demo Types</option>
              <option value="live_container">Live Container</option>
              <option value="static_web">Static Web</option>
              <option value="simulation_media">Simulation Media</option>
              <option value="video">Video Walkthrough</option>
              <option value="model_3d">3D Model / CAD</option>
            </select>
          </div>

          {/* Tech Tag Filter */}
          <div>
            <label className="block text-slate-400 mb-1 text-[11px] uppercase">
              Tech Tag
            </label>
            <select
              value={selectedTechTag || ''}
              onChange={(e) => onTechTagChange(e.target.value || undefined)}
              className="w-full bg-[#060e1b] border border-[#162a45] text-slate-200 px-2 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Tags</option>
              {stats?.tags?.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

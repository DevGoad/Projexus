'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Project, Stats, Domain } from '@/types';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import ProjectCard from '@/components/ProjectCard';
import { fetchProjects, fetchStats, fetchDomains } from '@/lib/api';

interface DiscoverClientProps {
  initialProjects: Project[];
  initialStats: Stats;
  initialDomains: Domain[];
}

export default function DiscoverClient({
  initialProjects,
  initialStats,
  initialDomains,
}: DiscoverClientProps) {
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(undefined);
  const [selectedTechTag, setSelectedTechTag] = useState<string | undefined>(undefined);
  const [readinessFilter, setReadinessFilter] = useState('all');
  const [selectedDemoType, setSelectedDemoType] = useState<string | undefined>(undefined);

  // Queries using TanStack Query
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    initialData: initialStats,
  });

  const { data: domains } = useQuery({
    queryKey: ['domains'],
    queryFn: fetchDomains,
    initialData: initialDomains,
  });

  // Calculate min/max readiness params
  const minReadiness = readinessFilter === 'ready' ? 75 : undefined;
  const maxReadiness = readinessFilter === 'in_progress' ? 74 : undefined;

  const { data: projects = initialProjects, isLoading } = useQuery({
    queryKey: [
      'projects',
      selectedDomain,
      searchQuery,
      selectedYear,
      selectedBranch,
      selectedTechTag,
      minReadiness,
      maxReadiness,
      selectedDemoType,
    ],
    queryFn: () =>
      fetchProjects({
        domain: selectedDomain,
        q: searchQuery,
        year: selectedYear,
        branch: selectedBranch,
        tech_tag: selectedTechTag,
        min_readiness: minReadiness,
        max_readiness: maxReadiness,
        demo_type: selectedDemoType,
      }),
    initialData: initialProjects,
  });

  return (
    <div>
      {/* Hero with dynamic stats */}
      <HeroSection stats={stats} />

      {/* Filter and Search Bar */}
      <FilterBar
        domains={domains || []}
        stats={stats}
        selectedDomain={selectedDomain}
        onSelectDomain={setSelectedDomain}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedTechTag={selectedTechTag}
        onTechTagChange={setSelectedTechTag}
        readinessFilter={readinessFilter}
        onReadinessFilterChange={setReadinessFilter}
        selectedDemoType={selectedDemoType}
        onDemoTypeChange={setSelectedDemoType}
        totalShown={projects.length}
      />

      {/* 3-Column Responsive Grid */}
      {isLoading ? (
        <div className="py-20 text-center font-mono text-sm text-slate-500">
          LOADING SPECIFICATIONS...
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-[#162a45] bg-[#091426] font-mono">
          <p className="text-slate-400 text-sm mb-2">
            No engineering projects found matching current criteria.
          </p>
          <button
            onClick={() => {
              setSelectedDomain('ALL');
              setSearchQuery('');
              setSelectedYear(undefined);
              setSelectedBranch(undefined);
              setSelectedTechTag(undefined);
              setReadinessFilter('all');
              setSelectedDemoType(undefined);
            }}
            className="text-xs text-cyan-400 hover:underline uppercase"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}

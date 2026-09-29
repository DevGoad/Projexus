'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import ReadinessGauge from './ReadinessGauge';
import { toggleBookmark } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface ProjectCardProps {
  project: Project;
  onBookmarkChange?: (updated: Project) => void;
}

export default function ProjectCard({ project, onBookmarkChange }: ProjectCardProps) {
  const { isLoggedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(project.is_saved);
  const [isSaving, setIsSaving] = useState(false);

  const handleStarClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('Please log in to save projects to your shortlist.');
      return;
    }

    try {
      setIsSaving(true);
      const updated = await toggleBookmark(project.id);
      setIsSaved(updated.is_saved);
      if (onBookmarkChange) onBookmarkChange(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update bookmark');
    } finally {
      setIsSaving(false);
    }
  };

  const getDemoTypeLabel = (type: string) => {
    switch (type) {
      case 'live_container':
        return 'CONTAINER';
      case 'static_web':
        return 'STATIC WEB';
      case 'simulation_media':
        return 'SIMULATION';
      case 'video':
        return 'VIDEO';
      case 'model_3d':
        return '3D CAD';
      default:
        return 'DEMO';
    }
  };

  return (
    <div className="group relative bg-[#091426] border border-[#162a45] hover:border-[#224472] transition-all duration-200 flex flex-col justify-between p-5 min-h-[340px]">
      <div>
        {/* Top header row: Domain + Star button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-cyan-400 tracking-wider uppercase">
              {project.domain}
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.2 border border-[#1b3456] text-slate-400 uppercase">
              {getDemoTypeLabel(project.demo_type)}
            </span>
          </div>

          <button
            onClick={handleStarClick}
            disabled={isSaving}
            title={isSaved ? 'Remove from saved' : 'Save to shortlist'}
            className="text-slate-400 hover:text-amber-400 transition-colors p-1"
          >
            <svg
              className={`w-4 h-4 transition-transform hover:scale-110 ${
                isSaved ? 'text-amber-400 fill-amber-400' : 'fill-transparent stroke-current'
              }`}
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <Link href={`/projects/${project.id}`}>
          <h3 className="font-sans text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
            {project.title}
          </h3>
        </Link>

        {/* Team */}
        <p className="font-mono text-xs text-slate-400 mb-3 line-clamp-1">
          {project.team ? `${project.team} · team of ${project.team_size}` : `team of ${project.team_size}`}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed font-sans">
          {project.description}
        </p>

        {/* Tech tags chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="font-mono text-[11px] px-2 py-0.5 border border-[#1b3456] bg-[#060e1b] text-slate-300"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 text-slate-500">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Readiness gauge + View spec link */}
      <div className="pt-4 border-t border-[#13243a] flex items-center justify-between">
        <ReadinessGauge score={project.readiness_score} />

        <Link
          href={`/projects/${project.id}`}
          className="font-mono text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
        >
          <span>View spec</span>
          <span className="transition-transform group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

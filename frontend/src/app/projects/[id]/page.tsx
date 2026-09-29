import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProject } from '@/lib/api';
import DemoEngine from '@/components/DemoEngine';
import ReadinessChecklist from '@/components/ReadinessChecklist';
import CompanyActions from '@/components/CompanyActions';
import ReadinessGauge from '@/components/ReadinessGauge';

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  let project;
  try {
    project = await fetchProject(params.id);
  } catch (e) {
    notFound();
  }

  return (
    <div className="pb-16 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="font-mono text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider group"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Main Spec Header Banner */}
      <div className="border border-[#162a45] bg-[#091426] p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-xs px-2.5 py-0.5 border border-cyan-500/40 text-cyan-300 bg-cyan-500/10 font-bold uppercase tracking-wider">
                {project.domain}
              </span>
              <span className="font-mono text-xs text-slate-400">
                CLASS OF {project.year} // {project.branch}
              </span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
              {project.title}
            </h1>

            {/* Team details */}
            <div className="font-mono text-xs text-slate-300 mb-2">
              <span className="text-slate-500">AUTHOR / TEAM: </span>
              <span className="text-slate-200 font-semibold">{project.team}</span>
              <span className="text-slate-500"> ({project.team_size} members)</span>
            </div>

            {project.team_roles && (
              <div className="font-mono text-xs text-slate-400 bg-[#060e1b] p-3 border border-[#14263e] mt-2 leading-relaxed">
                <span className="text-cyan-400 font-semibold">[ROLES & ASSIGNMENTS] </span>
                {project.team_roles}
              </div>
            )}
          </div>

          {/* Large Readiness Score in Header */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#060e1b] border border-[#162a45] min-w-[140px]">
            <ReadinessGauge score={project.readiness_score} size={64} strokeWidth={5} showText={false} />
            <span className="font-sans text-2xl font-bold text-amber-500 mt-2">
              {project.readiness_score}%
            </span>
            <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">
              {project.is_production_ready ? 'PRODUCTION-READY' : 'IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Quick Resource Links */}
        <div className="mt-6 pt-5 border-t border-[#14263e] flex flex-wrap items-center gap-4 font-mono text-xs">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 border border-[#1b3456] bg-[#060e1b] px-3 py-1.5 hover:border-cyan-400 transition-colors"
            >
              <span>GitHub Repository ↗</span>
            </a>
          )}
          {project.docs_url && (
            <a
              href={project.docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 border border-[#1b3456] bg-[#060e1b] px-3 py-1.5 hover:border-cyan-400 transition-colors"
            >
              <span>Technical Report / README ↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Demo Engine (Container, Web, Video, Simulation, 3D) */}
      <DemoEngine project={project} />

      {/* Technical Problem & Overview */}
      <div className="border border-[#162a45] bg-[#091426] p-6 sm:p-8 mb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-4">
          // ENGINEERING SPECIFICATION & PROBLEM STATEMENT
        </span>

        {project.problem_statement && (
          <div className="mb-6 p-4 bg-[#060e1b] border-l-2 border-amber-500">
            <h4 className="font-mono text-xs uppercase text-amber-400 font-bold mb-1 tracking-wider">
              Problem Statement
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {project.problem_statement}
            </p>
          </div>
        )}

        <div className="text-slate-300 text-sm leading-relaxed font-sans space-y-4">
          <p>{project.description}</p>
        </div>

        {/* Tech Stack Breakdown */}
        <div className="mt-8 pt-6 border-t border-[#14263e]">
          <h4 className="font-mono text-xs uppercase text-slate-400 mb-3 tracking-wider">
            Verified Technical Stack & Architecture Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((item, idx) => (
              <span
                key={idx}
                className="font-mono text-xs px-3 py-1 bg-[#060e1b] border border-[#1b3456] text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Domain Tags */}
        <div className="mt-5">
          <h4 className="font-mono text-xs uppercase text-slate-400 mb-3 tracking-wider">
            Domain Focus Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-xs px-2.5 py-0.5 bg-[#09182d] border border-[#224472] text-cyan-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Media Gallery */}
      {project.media_urls && project.media_urls.length > 0 && (
        <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-4">
            // ARTIFACTS & SCHEMATIC GALLERY
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.media_urls.map((url, idx) => (
              <div key={idx} className="border border-[#1a3355] bg-[#060e1b] overflow-hidden group">
                <img
                  src={url}
                  alt={`Artifact ${idx + 1}`}
                  className="w-full h-56 object-cover transition-transform group-hover:scale-105 duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production-Readiness Checklist (Formula & Breakdown) */}
      <ReadinessChecklist project={project} />

      {/* Company / Recruiter Actions */}
      <CompanyActions project={project} />
    </div>
  );
}

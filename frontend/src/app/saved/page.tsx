'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { useAuth } from '@/lib/auth-context';

export default function SavedProjectsPage() {
  const { isLoggedIn, user } = useAuth();

  const { data: savedProjects = [], isLoading, refetch } = useQuery({
    queryKey: ['saved-projects'],
    queryFn: () => fetchProjects({ saved_only: true }),
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center border border-[#162a45] bg-[#091426] p-8">
        <div className="w-12 h-12 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono text-xl mx-auto mb-4">
          ★
        </div>
        <h2 className="font-sans text-2xl font-bold text-white mb-2">
          Saved Projects & Shortlist
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 font-mono">
          Log in to bookmark verified projects, compare engineering candidates, and maintain your recruiting shortlist.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#070e1c] font-mono text-xs font-bold uppercase tracking-wider inline-block"
        >
          Log in with Demo Recruiter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-[#152943] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-1">
            // RECRUITER & EVALUATOR SHORTLIST
          </span>
          <h1 className="font-sans text-3xl font-bold text-white">
            Saved Engineering Projects
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Shortlist account: {user?.name} ({user?.organization || user?.role})
          </p>
        </div>

        <div className="font-mono text-xs text-slate-300 border border-[#162a45] bg-[#091426] px-4 py-2">
          <span className="text-amber-400 font-bold">{savedProjects.length}</span> PROJECTS BOOKMARKED
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-mono text-sm text-slate-500">
          LOADING SAVED SPECIFICATIONS...
        </div>
      ) : savedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onBookmarkChange={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-[#162a45] bg-[#091426] font-mono">
          <p className="text-slate-400 text-sm mb-4">
            Your saved shortlist is currently empty.
          </p>
          <Link
            href="/"
            className="text-xs text-cyan-400 hover:underline uppercase inline-block border border-cyan-500/30 px-4 py-2"
          >
            ← Browse Discover Index to Star Projects
          </Link>
        </div>
      )}
    </div>
  );
}

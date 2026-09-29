'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const pathname = usePathname();
  const { user, isLoggedIn, isRecruiter, logout } = useAuth();

  const isDiscover = pathname === '/' || pathname.startsWith('/projects');
  const isSaved = pathname === '/saved';
  const isSubmit = pathname === '/submit';

  return (
    <header className="border-b border-[#152943] bg-[#070e1c]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-5 h-5 border-2 border-amber-500 bg-transparent flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
          <span className="font-bold tracking-wider text-lg text-white font-sans">
            PROJEXUS
          </span>
          <span className="hidden sm:inline font-mono text-xs text-slate-500 tracking-wide">
            // student.industry.showcase
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4 font-mono text-xs uppercase tracking-wider">
          <Link
            href="/"
            className={`px-3 py-1.5 transition-all ${
              isDiscover && !isSaved && !isSubmit
                ? 'border border-amber-500 text-amber-400 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.15)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            DISCOVER
          </Link>

          <Link
            href="/saved"
            className={`px-3 py-1.5 transition-all ${
              isSaved
                ? 'border border-amber-500 text-amber-400 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.15)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            SAVED
          </Link>

          {/* Company/recruiter users do not see SUBMIT PROJECT */}
          {!isRecruiter && (
            <Link
              href="/submit"
              className={`px-3 py-1.5 transition-all ${
                isSubmit
                  ? 'border border-amber-500 text-amber-400 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              SUBMIT PROJECT
            </Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-[#152943]">
              <span className="hidden md:inline text-[11px] text-cyan-400 font-mono">
                {user?.name}
                {user?.role && (
                  <span className="ml-1 text-slate-500">[{user.role}]</span>
                )}
              </span>
              <button
                onClick={logout}
                className="px-2.5 py-1 text-slate-400 hover:text-amber-400 border border-transparent hover:border-[#22426f] transition-all"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-[#152943]">
              <Link
                href="/login"
                className="px-2.5 py-1 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all"
              >
                LOGIN
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

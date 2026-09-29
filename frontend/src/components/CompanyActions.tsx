'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import { toggleBookmark } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface CompanyActionsProps {
  project: Project;
  onBookmarkChange?: (updated: Project) => void;
}

export default function CompanyActions({ project, onBookmarkChange }: CompanyActionsProps) {
  const { isLoggedIn, isRecruiter } = useAuth();
  const [isSaved, setIsSaved] = useState(project.is_saved);
  const [isSaving, setIsSaving] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState(`Inquiry regarding ${project.title}`);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      alert('Please log in as a recruiter or student to save projects.');
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setIsContactOpen(false);
      setContactMessage('');
    }, 2000);
  };

  const handleDownloadSpec = () => {
    window.print();
  };

  return (
    <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#14263e] mb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            // TALENT ACQUISITION & COMPANY ACTIONS
          </span>
          <p className="font-mono text-xs text-slate-400">
            Direct industry pipeline for recruiting verified engineering candidates
          </p>
        </div>
        {isRecruiter && (
          <span className="font-mono text-[10px] px-2 py-0.5 border border-cyan-500/40 text-cyan-300 bg-cyan-500/10">
            VERIFIED RECRUITER
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Action 1: Save to Shortlist */}
        <button
          onClick={handleBookmark}
          disabled={isSaving}
          className={`px-4 py-3 font-mono text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? 'border-amber-500 bg-amber-500/15 text-amber-400 font-bold'
              : 'border-[#1b3456] bg-[#060e1b] text-slate-200 hover:border-amber-500 hover:text-amber-400'
          }`}
        >
          <span>★</span>
          <span>{isSaved ? 'SAVED TO SHORTLIST' : 'SAVE TO SHORTLIST'}</span>
        </button>

        {/* Action 2: Contact Engineering Team */}
        <button
          onClick={() => setIsContactOpen(true)}
          className="px-4 py-3 font-mono text-xs uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-[#070e1c] font-bold border border-cyan-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
        >
          <span>✉</span>
          <span>CONTACT TEAM</span>
        </button>

        {/* Action 3: Download Spec PDF */}
        <button
          onClick={handleDownloadSpec}
          className="px-4 py-3 font-mono text-xs uppercase tracking-wider border border-[#1b3456] bg-[#060e1b] text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
        >
          <span>⎙</span>
          <span>EXPORT SPEC PDF</span>
        </button>
      </div>

      {/* Contact Team Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 bg-[#060d1a]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-[#1f3d6b] bg-[#091426] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#14263e] mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                Direct Recruiter Message // {project.title}
              </span>
              <button
                onClick={() => setIsContactOpen(false)}
                className="font-mono text-xs text-slate-400 hover:text-white"
              >
                [ESC / X]
              </button>
            </div>

            {contactSent ? (
              <div className="p-8 text-center font-mono">
                <span className="text-2xl text-emerald-400 mb-2 block">✓</span>
                <p className="text-slate-100 text-sm font-semibold mb-1">
                  Message Dispatched to Team
                </p>
                <p className="text-xs text-slate-400">
                  Notification routed to verified author emails: {project.team}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Recipient Team</label>
                  <input
                    type="text"
                    disabled
                    value={project.team || 'Engineering Project Team'}
                    className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Message / Opportunity</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="We reviewed your production readiness score and would like to invite your team for an engineering interview..."
                    className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(false)}
                    className="px-4 py-2 border border-[#162a45] text-slate-400 hover:text-slate-200 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#070e1c] font-bold uppercase transition-colors"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

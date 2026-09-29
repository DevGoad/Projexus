'use client';

import React, { useState } from 'react';
import { Project, ReadinessCheckItem } from '@/types';
import ReadinessGauge from './ReadinessGauge';
import { updateProject } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface ReadinessChecklistProps {
  project: Project;
  onUpdate?: (updated: Project) => void;
}

export default function ReadinessChecklist({ project, onUpdate }: ReadinessChecklistProps) {
  const { user, isLoggedIn } = useAuth();
  const [items, setItems] = useState<ReadinessCheckItem[]>(project.readiness_breakdown);
  const [currentScore, setCurrentScore] = useState(project.readiness_score);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canEdit = isLoggedIn && (project.is_owner || user?.id === project.owner_id || user?.role === 'admin' || user?.role === 'student');

  const handleToggle = async (key: string) => {
    if (!canEdit) return;

    const newItems = items.map((item) =>
      item.key === key ? { ...item, completed: !item.completed } : item
    );
    setItems(newItems);

    // Compute updated score
    const newScore = newItems.reduce((acc, curr) => acc + (curr.completed ? curr.weight : 0), 0);
    setCurrentScore(newScore);

    // Save to backend
    try {
      setIsSaving(true);
      const payload: any = {
        [key]: newItems.find((i) => i.key === key)?.completed,
      };
      const updated = await updateProject(project.id, payload);
      setItems(updated.readiness_breakdown);
      setCurrentScore(updated.readiness_score);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      if (onUpdate) onUpdate(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update readiness checklist');
    } finally {
      setIsSaving(false);
    }
  };

  const isProductionReady = currentScore >= 75;

  return (
    <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#14263e]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              // PRODUCTION-READINESS AUDIT BREAKDOWN
            </span>
            {isProductionReady ? (
              <span className="font-mono text-[10px] px-2 py-0.5 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                PRODUCTION-READY (&ge; 75%)
              </span>
            ) : (
              <span className="font-mono text-[10px] px-2 py-0.5 border border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold uppercase">
                IN PROGRESS (&lt; 75%)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Weighted verification index calculated from 7 standardized engineering deliverables.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ReadinessGauge score={currentScore} size={48} strokeWidth={4} />
          {saveSuccess && (
            <span className="font-mono text-xs text-emerald-400 animate-fade-in">
              Score Saved ✓
            </span>
          )}
        </div>
      </div>

      {/* Checklist items list */}
      <div className="mt-5 space-y-2.5">
        {items.map((item) => {
          return (
            <div
              key={item.key}
              onClick={() => canEdit && handleToggle(item.key)}
              className={`p-3.5 border transition-all flex items-center justify-between gap-4 ${
                canEdit ? 'cursor-pointer hover:border-[#224472]' : ''
              } ${
                item.completed
                  ? 'border-[#1b3b64] bg-[#071120]'
                  : 'border-[#14253c] bg-[#060d1b] opacity-80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 flex items-center justify-center font-mono text-xs border transition-colors ${
                    item.completed
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 font-bold'
                      : 'border-slate-600 bg-transparent text-transparent'
                  }`}
                >
                  {item.completed ? '✓' : ''}
                </div>

                <div>
                  <span
                    className={`font-mono text-xs ${
                      item.completed ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {canEdit && (
                    <span className="block text-[10px] font-mono text-slate-500">
                      Click to toggle status
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs px-2 py-0.5 border ${
                    item.completed
                      ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                      : 'border-[#182d47] text-slate-500'
                  }`}
                >
                  +{item.weight} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guidance footer for students */}
      <div className="mt-6 pt-4 border-t border-[#14263e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs text-slate-400">
        <div>
          <span>Target: Reach </span>
          <span className="text-amber-400 font-bold">75%</span>
          <span> to qualify for the recruiter-visible &quot;Production-Ready&quot; filter index.</span>
        </div>
        {canEdit ? (
          <span className="text-cyan-400 text-[11px]">
            [Student Edit Mode Active: changes update audit log live]
          </span>
        ) : (
          <span className="text-slate-500 text-[11px]">
            Log in as project owner to raise score
          </span>
        )}
      </div>
    </div>
  );
}

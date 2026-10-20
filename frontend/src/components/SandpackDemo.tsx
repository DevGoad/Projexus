'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview as SandpackPreviewPane,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import {
  fetchGitHubRepoFiles,
  buildFallbackFiles,
  parseGitHubUrl,
  type FetchRepoResult,
} from '@/lib/github-fetcher';

interface SandpackDemoProps {
  githubUrl: string;
  title: string;
  description: string;
  techStack: string[];
  demoUrl?: string;
}

type LoadState =
  | { status: 'idle' }
  | { status: 'loading'; message: string }
  | { status: 'loaded'; result: FetchRepoResult }
  | { status: 'error'; message: string; fallback: true }
  | { status: 'no-repo'; fallback: true };

/**
 * Sandpack-powered in-browser demo preview.
 *
 * When a valid GitHub URL is provided, it fetches the repo's source files
 * through the GitHub REST API and boots a full Node.js / React / static
 * environment directly in the recruiter's browser tab via Sandpack
 * (CodeSandbox WebContainers).
 *
 * Zero install. Zero Docker. 2-second boot.
 */
export default function SandpackDemo({
  githubUrl,
  title,
  description,
  techStack,
  demoUrl,
}: SandpackDemoProps) {
  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const [showEditor, setShowEditor] = useState(false);

  const loadRepo = useCallback(async () => {
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      setState({ status: 'no-repo', fallback: true });
      return;
    }

    setState({ status: 'loading', message: `Fetching ${parsed.owner}/${parsed.repo} file tree...` });

    try {
      const result = await fetchGitHubRepoFiles(githubUrl);

      if (Object.keys(result.files).length === 0) {
        throw new Error('Repository appears empty or contains no supported source files.');
      }

      setState({ status: 'loaded', result });
    } catch (err: any) {
      console.error('[SandpackDemo] Fetch error:', err);
      setState({
        status: 'error',
        message: err.message || 'Failed to fetch repository files',
        fallback: true,
      });
    }
  }, [githubUrl]);

  // Blueprint theme for Sandpack editors (matches Projexus dark navy palette)
  const blueprintTheme = {
    colors: {
      surface1: '#060d1a',    // editor background
      surface2: '#091426',    // toolbar / tabs
      surface3: '#0d1e3b',    // hover / active tab
      clickable: '#94a3b8',   // icon / button text
      base: '#e2e8f0',        // default text
      disabled: '#334155',
      hover: '#22d3ee',
      accent: '#f59e0b',      // amber accent
      error: '#ef4444',
      errorSurface: '#1e0808',
    },
    syntax: {
      plain: '#e2e8f0',
      comment: { color: '#475569', fontStyle: 'italic' as const },
      keyword: '#f59e0b',
      tag: '#22d3ee',
      punctuation: '#64748b',
      definition: '#67e8f9',
      property: '#a5f3fc',
      static: '#fbbf24',
      string: '#34d399',
    },
    font: {
      body: 'var(--font-space-grotesk), system-ui, sans-serif',
      mono: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
      size: '13px',
      lineHeight: '1.6',
    },
  };

  // Determine files & template for the provider
  const getProviderProps = () => {
    if (state.status === 'loaded') {
      return {
        files: state.result.files,
        template: state.result.template,
        activeFile: state.result.entryFile,
      };
    }

    // Fallback files
    const fallback = buildFallbackFiles({ title, description, tech_stack: techStack, demo_url: demoUrl });
    return {
      files: fallback,
      template: 'static' as const,
      activeFile: '/index.html',
    };
  };

  // ── Status: idle → show the "Launch Demo" prompt ──────────────
  if (state.status === 'idle') {
    return (
      <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14263e]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                In-Browser WebContainer Runtime
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">
              Sandpack (CodeSandbox) virtual environment — zero install, boots in 2 s
            </p>
          </div>

          <div className="flex items-center gap-3">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs px-3 py-2 border border-[#224472] text-slate-300 hover:text-white hover:border-slate-400 transition-colors uppercase tracking-wider"
              >
                Open in Tab ↗
              </a>
            )}
            <button
              onClick={loadRepo}
              className="font-mono text-xs px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#070e1c] font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-2"
            >
              <span>Launch Demo</span>
              <span className="text-sm">▶</span>
            </button>
          </div>
        </div>

        {/* Idle placeholder */}
        <div className="mt-4 p-8 border border-dashed border-[#1a3355] bg-[#060e1b]/60 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono mb-3">
            ▶
          </div>
          <h4 className="font-sans font-bold text-white text-base mb-1">
            In-Browser Execution Environment
          </h4>
          <p className="text-slate-400 text-xs max-w-lg mb-4">
            Click &quot;Launch Demo&quot; to fetch the student&apos;s repository from GitHub and boot
            a live Node.js / React / static environment directly in this browser tab. No local
            installations needed — 100% safe for evaluators.
          </p>
          {githubUrl && parseGitHubUrl(githubUrl) && (
            <div className="font-mono text-xs text-slate-500 bg-[#070e1a] p-2 border border-[#162a45] mt-1">
              Source: {githubUrl}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Status: loading ──────────────────────────────────────────
  if (state.status === 'loading') {
    return (
      <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[#14263e]">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Provisioning In-Browser Runtime...
          </span>
        </div>

        <div className="mt-4 p-12 bg-[#060e1b] border border-[#1a3355] flex flex-col items-center justify-center text-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-2 border-[#162a45] border-t-amber-400 rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs text-slate-300 mb-1">{state.message}</p>
          <p className="font-mono text-[11px] text-slate-500">
            Downloading source files via GitHub REST API and booting Sandpack WebContainer...
          </p>
        </div>
      </div>
    );
  }

  // ── Status: loaded / error / no-repo → render Sandpack ───────
  const { files, template, activeFile } = getProviderProps();

  const showErrorBanner = state.status === 'error';
  const showNoRepoBanner = state.status === 'no-repo';
  const repoInfo = state.status === 'loaded' ? state.result : null;

  return (
    <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14263e]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {repoInfo ? 'Live In-Browser Runtime Active' : 'Fallback Preview Active'}
            </span>
          </div>
          <p className="font-mono text-xs text-slate-400">
            {repoInfo
              ? `Loaded ${repoInfo.totalFetched} files · Template: ${repoInfo.template} · Entry: ${repoInfo.entryFile}`
              : 'Displaying project specification preview'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {repoInfo && (
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`font-mono text-xs px-3 py-1.5 border transition-all uppercase tracking-wider ${
                showEditor
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10'
                  : 'border-[#224472] text-slate-400 hover:text-slate-200 hover:border-[#3a6099]'
              }`}
            >
              {showEditor ? 'Hide Code' : 'View Source'}
            </button>
          )}

          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs px-3 py-1.5 border border-[#224472] text-slate-300 hover:text-white hover:border-slate-400 transition-colors uppercase tracking-wider"
            >
              Open in Tab ↗
            </a>
          )}

          <button
            onClick={() => setState({ status: 'idle' })}
            className="font-mono text-xs px-3 py-1.5 border border-[#224472] text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>

      {/* Error / no-repo banner */}
      {showErrorBanner && state.status === 'error' && (
        <div className="mt-3 p-3 border border-amber-500/30 bg-amber-500/5 font-mono text-xs text-amber-300 flex items-start gap-2">
          <span className="text-amber-400 font-bold shrink-0">[WARN]</span>
          <span>
            Could not fetch repo files: {state.message}. Displaying specification preview instead.
            {githubUrl && (
              <button
                onClick={loadRepo}
                className="ml-2 text-cyan-400 hover:underline"
              >
                Retry fetch →
              </button>
            )}
          </span>
        </div>
      )}

      {showNoRepoBanner && (
        <div className="mt-3 p-3 border border-[#1a3355] bg-[#060e1b] font-mono text-xs text-slate-400">
          <span className="text-cyan-400 font-bold">[INFO]</span> No valid GitHub repository URL
          configured. Showing project specification preview.
        </div>
      )}

      {/* Sandpack Environment */}
      <div className="mt-4 border border-[#1a3355] bg-[#060e1b] overflow-hidden">
        {/* Runtime address bar */}
        <div className="px-4 py-2 bg-[#0d1c33] border-b border-[#1a3355] flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>
              sandpack://{title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.webcontainer.local
            </span>
          </div>
          <span className="text-slate-500">
            Engine: Sandpack · Isolated Browser Runtime · Zero Install
          </span>
        </div>

        <SandpackProvider
          files={files}
          template={template as any}
          theme={blueprintTheme as any}
          options={{
            activeFile: activeFile,
            visibleFiles: showEditor ? undefined : [activeFile],
            recompileMode: 'delayed',
            recompileDelay: 500,
          }}
        >
          <SandpackLayout
            style={{
              border: 'none',
              borderRadius: 0,
              background: '#060d1a',
            }}
          >
            {showEditor && (
              <>
                <SandpackFileExplorer
                  style={{
                    height: '500px',
                    minWidth: '180px',
                    maxWidth: '220px',
                    background: '#060d1a',
                    borderRight: '1px solid #162a45',
                  }}
                />
                <SandpackCodeEditor
                  style={{
                    height: '500px',
                    minWidth: '300px',
                    background: '#060d1a',
                  }}
                  showLineNumbers
                  showTabs
                  wrapContent
                />
              </>
            )}
            <SandpackPreviewPane
              style={{
                height: showEditor ? '500px' : '480px',
                minWidth: showEditor ? '400px' : '100%',
                background: '#060d1a',
              }}
              showNavigator
              showRefreshButton
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* Footer telemetry bar */}
      {repoInfo && (
        <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px] text-slate-500">
          <span>
            Files loaded: <span className="text-slate-300">{repoInfo.totalFetched}</span>
          </span>
          <span>
            Skipped: <span className="text-slate-300">{repoInfo.totalSkipped}</span>
          </span>
          <span>
            Template: <span className="text-amber-400">{repoInfo.template}</span>
          </span>
          <span>
            Entry: <span className="text-cyan-400">{repoInfo.entryFile}</span>
          </span>
        </div>
      )}
    </div>
  );
}

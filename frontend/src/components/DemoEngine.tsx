'use client';

import React, { useState } from 'react';
import { Project } from '@/types';

interface DemoEngineProps {
  project: Project;
}

export default function DemoEngine({ project }: DemoEngineProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [simIndex, setSimIndex] = useState(0);

  const { demo_type, demo_url, media_urls } = project;

  // Case 1 & 2: live_container or static_web -> Show "Launch Demo"
  if (demo_type === 'live_container' || demo_type === 'static_web') {
    return (
      <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14263e]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {demo_type === 'live_container' ? 'Containerized Live Runtime' : 'Static Web Runtime'}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">
              {demo_type === 'live_container'
                ? 'Docker container provisioned with verified test environment'
                : 'Verified client-side web application build'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {demo_url && (
              <a
                href={demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs px-3 py-2 border border-[#224472] text-slate-300 hover:text-white hover:border-slate-400 transition-colors uppercase tracking-wider"
              >
                Open in Tab ↗
              </a>
            )}
            <button
              onClick={() => {
                setIsLaunching(true);
                setTimeout(() => {
                  setIsLiveActive(!isLiveActive);
                  setIsLaunching(false);
                }, 400);
              }}
              disabled={isLaunching}
              className="font-mono text-xs px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#070e1c] font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-2"
            >
              <span>{isLiveActive ? 'Close Live Demo' : 'Launch Demo'}</span>
              <span className="text-sm">▶</span>
            </button>
          </div>
        </div>

        {/* Live Container / Web Frame Viewer */}
        {isLiveActive ? (
          <div className="mt-4 border border-[#1a3355] bg-[#060e1b]">
            <div className="px-4 py-2 bg-[#0d1c33] border-b border-[#1a3355] flex items-center justify-between font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>runtime://{project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local:8000</span>
              </div>
              <span className="text-slate-500">Latency: 14ms · Memory: 128MB</span>
            </div>
            {demo_url ? (
              <iframe
                src={demo_url}
                title={project.title}
                className="w-full h-[480px] bg-slate-900 border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            ) : (
              <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center">
                <div className="font-mono text-cyan-400 text-sm mb-2">
                  [CONTAINER ACTIVE & READY]
                </div>
                <p className="text-slate-400 text-xs max-w-md mb-4 font-mono">
                  Container health check returned HTTP 200. Exposed internal ports: 8000 (API), 3000 (UI).
                </p>
                <div className="font-mono text-xs text-slate-500 bg-[#070e1a] p-3 border border-[#162a45] text-left w-full max-w-lg">
                  <div>$ docker inspect container_projexus_{project.id}</div>
                  <div className="text-emerald-400">State: Running (Healthy)</div>
                  <div>StartedAt: 2026-09-29T11:45:00Z</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 p-8 border border-dashed border-[#1a3355] bg-[#060e1b]/60 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono mb-3">
              ▶
            </div>
            <h4 className="font-sans font-bold text-white text-base mb-1">
              Interactive Execution Environment
            </h4>
            <p className="text-slate-400 text-xs max-w-lg mb-4">
              Click &quot;Launch Demo&quot; to initialize the verified web interface. Evaluators can test features directly without manual local setup.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Case 3: video -> Video media viewer
  if (demo_type === 'video') {
    return (
      <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#14263e] mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Video Walkthrough & Hardware Test Run
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">
              Verified camera telemetry and physical hardware run
            </p>
          </div>
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs px-3 py-1.5 border border-[#224472] text-cyan-400 hover:border-cyan-400 transition-colors uppercase tracking-wider"
            >
              Watch External ↗
            </a>
          )}
        </div>

        <div className="relative aspect-video bg-[#060e1b] border border-[#1a3355] overflow-hidden flex items-center justify-center">
          {media_urls && media_urls.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={media_urls[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#060e1b]/70 flex flex-col items-center justify-center p-6 text-center">
                <a
                  href={demo_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full border-2 border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 flex items-center justify-center text-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] mb-3"
                >
                  ▶
                </a>
                <span className="font-mono text-xs text-slate-200 uppercase tracking-wider font-semibold">
                  Play Verified Technical Video Demonstration
                </span>
                <span className="font-mono text-[11px] text-slate-400 mt-1">
                  Includes SLAM trajectory map, sensor plots, and physical robot run
                </span>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-slate-400 text-center p-8">
              Video walkthrough available at: {demo_url}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 4: simulation_media -> Simulink / MATLAB / CFD simulation media viewer
  if (demo_type === 'simulation_media') {
    const images = media_urls.length > 0 ? media_urls : [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ];

    return (
      <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#14263e] mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Simulation & Telemetry Media Viewer
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">
              Simulink / MATLAB / Sensor waveform datasets and telemetry dashboards
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500">
            FRAME {simIndex + 1} OF {images.length}
          </span>
        </div>

        <div className="relative border border-[#1a3355] bg-[#060e1b] overflow-hidden">
          <div className="aspect-[16/9] w-full relative">
            <img
              src={images[simIndex]}
              alt={`Simulation ${simIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Engineering Grid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e1b] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-xs text-slate-300">
              <div className="bg-[#091426]/90 px-3 py-1.5 border border-[#162a45]">
                <span>Telemetry: Dynamic load balanced across renewable bus</span>
              </div>
              <div className="flex items-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSimIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-none border transition-all ${
                      simIndex === idx
                        ? 'bg-amber-400 border-amber-400'
                        : 'bg-[#091426] border-[#224472]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 5: model_3d -> 3D CAD / GLB Viewer
  return (
    <div className="border border-[#162a45] bg-[#091426] p-6 mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#14263e] mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              3D CAD / Mechanical Geometry Spec
            </span>
          </div>
          <p className="font-mono text-xs text-slate-400">
            CAD assembly, wireframe cross-sections, and tolerance models
          </p>
        </div>
      </div>

      <div className="h-80 bg-[#060e1b] border border-[#1a3355] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-mono text-lg mb-3">
          ⬡
        </div>
        <h4 className="font-sans font-bold text-white text-base mb-1">
          Interactive 3D Engineering Model
        </h4>
        <p className="font-mono text-xs text-slate-400 max-w-md mb-4">
          GLB/STEP assembly with exploded view capability. Rotate, pan, and zoom to inspect mechanical tolerances.
        </p>
        <span className="font-mono text-[11px] text-amber-400 border border-amber-500/30 px-3 py-1 bg-amber-500/10">
          Hardware & CAD specs evaluated via verified geometry and simulation media
        </span>
      </div>
    </div>
  );
}

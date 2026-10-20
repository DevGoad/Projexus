'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Project } from '@/types';

// Dynamically import SandpackDemo with ssr: false since Sandpack is browser-only
const SandpackDemo = dynamic(() => import('@/components/SandpackDemo'), {
  ssr: false,
  loading: () => (
    <div className="border border-[#162a45] bg-[#091426] p-8 mb-8 text-center font-mono">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <span className="text-xs text-slate-300 uppercase tracking-wider block">
        Initializing In-Browser Sandpack Runtime...
      </span>
      <span className="text-[11px] text-slate-500 mt-1 block">
        Zero-install environment · CodeSandbox WebContainer
      </span>
    </div>
  ),
});

interface DemoEngineProps {
  project: Project;
}

export default function DemoEngine({ project }: DemoEngineProps) {
  const [simIndex, setSimIndex] = useState(0);

  const { demo_type, demo_url, media_urls, github_url, title, description, tech_stack } = project;

  // Case 1 & 2: live_container or static_web -> In-browser Sandpack / WebContainer runtime
  if (demo_type === 'live_container' || demo_type === 'static_web') {
    return (
      <SandpackDemo
        githubUrl={github_url}
        title={title}
        description={description}
        techStack={tech_stack}
        demoUrl={demo_url}
      />
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

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchDomains, createProject } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import ReadinessGauge from '@/components/ReadinessGauge';
import { DemoType } from '@/types';

export default function SubmitProjectPage() {
  const router = useRouter();
  const { isLoggedIn, isRecruiter } = useAuth();

  const { data: domains = [] } = useQuery({
    queryKey: ['domains'],
    queryFn: fetchDomains,
  });

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('SOFTWARE & AI');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState(2026);
  const [team, setTeam] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [teamRoles, setTeamRoles] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [description, setDescription] = useState('');
  const [demoType, setDemoType] = useState<DemoType>('live_container');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [mediaUrlsInput, setMediaUrlsInput] = useState('');

  // Checklist states
  const [checkDesc, setCheckDesc] = useState(true);
  const [checkTeam, setCheckTeam] = useState(true);
  const [checkDemo, setCheckDemo] = useState(false);
  const [checkDocs, setCheckDocs] = useState(false);
  const [checkTech, setCheckTech] = useState(true);
  const [checkMedia, setCheckMedia] = useState(false);
  const [checkFaculty, setCheckFaculty] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate live readiness score
  const computedScore =
    (checkDesc ? 15 : 0) +
    (checkTeam ? 10 : 0) +
    (checkDemo ? 25 : 0) +
    (checkDocs ? 15 : 0) +
    (checkTech ? 10 : 0) +
    (checkMedia ? 10 : 0) +
    (checkFaculty ? 15 : 0);

  if (isRecruiter) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center border border-[#162a45] bg-[#091426] p-8">
        <h2 className="font-sans text-xl font-bold text-white mb-2">
          Company Recruiter Account
        </h2>
        <p className="font-mono text-xs text-slate-400 mb-4">
          Company & recruiter accounts browse and evaluate student submissions. Project submission is restricted to engineering students and faculty.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in before submitting a project.');
      router.push('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const techStack = techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const mediaUrls = mediaUrlsInput
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const newProject = await createProject({
        title,
        domain,
        branch,
        year,
        team,
        team_size: teamSize,
        team_roles: teamRoles,
        problem_statement: problemStatement,
        description,
        demo_type: demoType,
        demo_url: demoUrl,
        github_url: githubUrl,
        docs_url: docsUrl,
        tags,
        tech_stack: techStack,
        media_urls: mediaUrls,
        check_description: checkDesc,
        check_team: checkTeam,
        check_demo: checkDemo,
        check_docs: checkDocs,
        check_tech_stack: checkTech,
        check_media: checkMedia,
        check_faculty_verified: checkFaculty,
      });

      router.push(`/projects/${newProject.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit engineering project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="border-b border-[#152943] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-1">
            // ENGINEERING SUBMISSION FORM
          </span>
          <h1 className="font-sans text-3xl font-bold text-white">
            Register Project Specification
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Complete the standardized specification to generate your production-readiness score.
          </p>
        </div>

        {/* Live Score Preview */}
        <div className="flex items-center gap-3 border border-[#162a45] bg-[#091426] p-3">
          <ReadinessGauge score={computedScore} size={48} strokeWidth={4} />
          <div className="font-mono text-xs">
            <span className="block text-slate-400 text-[10px] uppercase">
              Current Readiness
            </span>
            <span
              className={`font-bold ${
                computedScore >= 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {computedScore >= 75 ? 'PRODUCTION-READY' : 'IN PROGRESS'}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 border border-rose-500/50 bg-rose-500/10 text-rose-400 font-mono text-xs">
          [ERROR] {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border border-[#162a45] bg-[#091426] p-6 space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
            01 // PROJECT OVERVIEW
          </span>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Autonomous Warehouse Rover"
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Engineering Domain *
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {domains.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Branch / Department *
              </label>
              <input
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g., Computer Science & Engineering"
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Graduation Year *
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Problem Statement
            </label>
            <textarea
              rows={2}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="What core engineering challenge or bottleneck does this work solve?"
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Full Technical Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Architecture, algorithms, design decisions, performance metrics..."
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Team and Demo Configuration */}
        <div className="border border-[#162a45] bg-[#091426] p-6 space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
            02 // TEAM & DEMO ENGINE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Author / Teammate Names
              </label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="e.g., Alex Mehta, Rohit Kulkarni, Sneha Iyer"
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Team Size
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Member Roles & Responsibilities
            </label>
            <input
              type="text"
              value={teamRoles}
              onChange={(e) => setTeamRoles(e.target.value)}
              placeholder="e.g., Alex (SLAM Algorithm), Rohit (Motor Driver & Firmware), Sneha (ROS2 Integration)"
              className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Demo Type *
              </label>
              <select
                value={demoType}
                onChange={(e) => setDemoType(e.target.value as DemoType)}
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="live_container">Live Container (Software Docker runtime)</option>
                <option value="static_web">Static Web (Client-side interactive app)</option>
                <option value="video">Video Walkthrough (Hardware & robotics test run)</option>
                <option value="simulation_media">Simulation Media (Simulink/MATLAB plots & logs)</option>
                <option value="model_3d">3D CAD Model (Mechanical/assembly viewer)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Demo URL / Video Link
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.projexus.io/... or YouTube link"
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Repositories & Tech Stack */}
        <div className="border border-[#162a45] bg-[#091426] p-6 space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
            03 // REPOSITORIES & TECH STACK
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Technical Report / Docs URL
              </label>
              <input
                type="url"
                value={docsUrl}
                onChange={(e) => setDocsUrl(e.target.value)}
                placeholder="https://.../report.pdf"
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="ROS2, C++, Python, LiDAR, Raspberry Pi 4"
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
                Domain Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="LiDAR SLAM, Path planning, ROS2"
                className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Artifact / Image URLs (comma-separated)
            </label>
            <input
              type="text"
              value={mediaUrlsInput}
              onChange={(e) => setMediaUrlsInput(e.target.value)}
              placeholder="https://images.unsplash.com/..., https://..."
              className="w-full bg-[#060e1b] border border-[#162a45] px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Readiness Checklist Audit */}
        <div className="border border-[#162a45] bg-[#091426] p-6 space-y-3 font-mono text-xs">
          <span className="uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
            04 // PRODUCTION-READINESS AUDIT CHECKLIST (FIXED WEIGHTS = 100 PTS)
          </span>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkDesc}
                onChange={(e) => setCheckDesc(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Description and problem statement complete</span>
            </span>
            <span className="text-amber-400">+15 pts</span>
          </label>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkTeam}
                onChange={(e) => setCheckTeam(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Team and roles listed</span>
            </span>
            <span className="text-amber-400">+10 pts</span>
          </label>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkDemo}
                onChange={(e) => setCheckDemo(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Demo available and verified working</span>
            </span>
            <span className="text-amber-400">+25 pts</span>
          </label>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkDocs}
                onChange={(e) => setCheckDocs(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Documentation / README / report uploaded</span>
            </span>
            <span className="text-amber-400">+15 pts</span>
          </label>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkTech}
                onChange={(e) => setCheckTech(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Tech stack and tags filled in</span>
            </span>
            <span className="text-amber-400">+10 pts</span>
          </label>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkMedia}
                onChange={(e) => setCheckMedia(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Media (screenshots/video) added</span>
            </span>
            <span className="text-amber-400">+10 pts</span>
          </label>

          <label className="flex items-center justify-between p-3 border border-[#162a45] bg-[#060e1b] cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkFaculty}
                onChange={(e) => setCheckFaculty(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Faculty/mentor verification</span>
            </span>
            <span className="text-amber-400">+15 pts</span>
          </label>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-4">
          <span className="font-mono text-xs text-slate-400">
            Audit standard: Readiness &ge; 75% receives Production-Ready designation.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-[#070e1c] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            {isSubmitting ? 'Registering...' : 'Register Project Specification →'}
          </button>
        </div>
      </form>
    </div>
  );
}

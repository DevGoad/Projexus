'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'recruiter'>('student');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await register({
        name,
        email,
        password,
        role,
        organization,
      });
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="border border-[#162a45] bg-[#091426] p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            // CREATE SYSTEM IDENTITY
          </span>
        </div>
        <h1 className="font-sans text-2xl font-bold text-white mb-2">
          Create Account
        </h1>
        <p className="font-mono text-xs text-slate-400 mb-6">
          Register to showcase verified engineering projects or recruit production-ready talent.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 border border-rose-500/50 bg-rose-500/10 text-rose-400 font-mono text-xs">
            [REGISTRATION ERROR] {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 font-mono text-xs uppercase border transition-all ${
                  role === 'student'
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 font-bold'
                    : 'border-[#162a45] bg-[#060e1b] text-slate-400'
                }`}
              >
                ⚡ Student Author
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2 px-3 font-mono text-xs uppercase border transition-all ${
                  role === 'recruiter'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 font-bold'
                    : 'border-[#162a45] bg-[#060e1b] text-slate-400'
                }`}
              >
                ★ Company Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Chen"
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu or name@company.com"
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              {role === 'student' ? 'University / Institute' : 'Company / Firm'}
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder={role === 'student' ? 'e.g., MIT, IIT, Berkeley' : 'e.g., Tesla, Apex Robotics'}
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#060e1b] border border-[#162a45] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-[#070e1c] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {isSubmitting ? 'Registering...' : 'Register Identity →'}
          </button>
        </form>

        <div className="mt-6 text-center font-mono text-xs text-slate-400">
          <span>Already registered? </span>
          <Link href="/login" className="text-cyan-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

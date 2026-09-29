'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await login(demoEmail, 'demo1234');
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="border border-[#162a45] bg-[#091426] p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            // ACCESS AUTHENTICATION
          </span>
        </div>
        <h1 className="font-sans text-2xl font-bold text-white mb-2">
          Sign In to Projexus
        </h1>
        <p className="font-mono text-xs text-slate-400 mb-6">
          Access your evaluated engineering portfolio or company recruitment shortlist.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 border border-rose-500/50 bg-rose-500/10 text-rose-400 font-mono text-xs">
            [AUTH ERROR] {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recruiter@demo.com or student@demo.com"
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
            {isSubmitting ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-[#14263e]">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-3">
            Quick 1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('recruiter@demo.com')}
              className="px-3 py-2 border border-[#1b3456] bg-[#060e1b] text-slate-300 hover:border-amber-500 hover:text-amber-400 font-mono text-xs uppercase transition-colors"
            >
              ★ Recruiter Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('student@demo.com')}
              className="px-3 py-2 border border-[#1b3456] bg-[#060e1b] text-slate-300 hover:border-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase transition-colors"
            >
              ⚡ Student Demo
            </button>
          </div>
        </div>

        <div className="mt-6 text-center font-mono text-xs text-slate-400">
          <span>New engineer or company? </span>
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sun, Moon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FloatingInput from '@/components/ui/FloatingInput';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function AdminLoginPage() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useDarkMode();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full bg-[#f2f2ef] text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100 flex flex-col items-center justify-center p-4 transition-colors duration-300 relative ${darkMode ? 'dark' : ''}`}>
      
      {/* Top Floating Controls: Back to Site & Theme Switcher */}
      <div className="absolute top-6 inset-x-6 sm:inset-x-12 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fafaf8] dark:bg-[#18181b] hover:bg-[#ebebe8] dark:hover:bg-[#27272a] text-xs font-extrabold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-[#27272a] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Main Website
        </Link>

        <button
          onClick={() => setDarkMode(prev => !prev)}
          aria-label="Toggle Light & Dark Mode"
          className="p-2.5 rounded-full bg-[#fafaf8] dark:bg-[#18181b] hover:bg-[#ebebe8] dark:hover:bg-[#27272a] text-neutral-800 dark:text-neutral-200 transition-colors border border-neutral-300 dark:border-[#27272a] shadow-sm"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-800" />
          )}
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-[#fafaf8] dark:bg-[#121215] border-2 border-[#e0e0da] dark:border-[#27272a] w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden my-auto">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-fuchsia-500" />

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#ebebe8] dark:bg-[#18181b] p-2 mx-auto border-2 border-amber-400 shadow-md mb-3 flex items-center justify-center">
            <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-full h-full object-contain" />
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> CSO Officer Portal
          </span>

          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-2">
            Officer Login
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Enter your admin credentials to access applicant records.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Login Form with Animated Floating Inputs */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <FloatingInput
            label="Officer Email Address"
            type="email"
            required
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <FloatingInput
            label="Password"
            type="password"
            required
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                Login to Admin Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

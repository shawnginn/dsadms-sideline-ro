'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for active SideLine RO session
    const savedSession = localStorage.getItem('sideline_ro_session_v1');
    if (!savedSession) {
      // Security Check Failed: Redirect unauthenticated user to /login
      router.replace('/login');
    } else {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && (parsed.email || parsed.name)) {
          setIsAuthenticated(true);
        } else {
          router.replace('/login');
        }
      } catch (e) {
        router.replace('/login');
      }
    }
  }, [router]);

  // Render secure loading screen during session verification
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide">Verifying SideLine RO Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">SideLine RO Workspace</h1>
            <p className="text-sm text-slate-400">AI Camera OCR & Specialty Products Repair Order Manager</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('sideline_ro_session_v1');
              router.replace('/login');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <p className="text-cyan-400 font-medium">Session Authenticated & Active</p>
        </div>
      </div>
    </div>
  );
}
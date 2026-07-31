'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideLineROLanding from '../page';

export default function WorkspacePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('sideline_ro_session_v1');
    if (!savedSession) {
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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide">Loading SideLine RO Workspace...</p>
        </div>
      </div>
    );
  }

  return <SideLineROLanding />;
}
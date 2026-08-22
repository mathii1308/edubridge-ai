"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Bell, Sparkles, Languages, Check, ShieldCheck, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Tutor Session Confirmed!',
      desc: 'Dr. Rajesh Kumar accepted your session request on Probability for tomorrow at 10:00 AM.',
      time: '10m ago'
    },
    {
      id: 2,
      title: '95% Scholarship Match Found',
      desc: 'You are eligible for PM YASASVI Central Sector Scholarship based on your verified profile.',
      time: '1h ago'
    }
  ];

  return (
    <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-[37px] z-40">
      <div className="flex items-center space-x-3 md:hidden">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">EduBridge AI</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
        <span className="flex items-center space-x-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified RAG Grounding Engine Active</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 relative transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl z-50 border border-slate-700">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h4 className="font-semibold text-xs text-white">Notifications</h4>
                <span className="text-[10px] text-indigo-400">2 New</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <p className="text-xs font-medium text-indigo-300">{n.title}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">{n.desc}</p>
                    <span className="text-[9px] text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-indigo-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

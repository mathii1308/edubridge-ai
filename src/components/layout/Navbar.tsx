"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Sparkles, LogOut, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3 md:hidden">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-base">EduBridge AI</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-2 text-xs">
        <span className="flex items-center space-x-2 text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Academic Portal</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] font-semibold text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="h-4 w-px bg-slate-200"></div>

            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 border border-slate-200 hover:border-red-200 text-xs font-medium transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};



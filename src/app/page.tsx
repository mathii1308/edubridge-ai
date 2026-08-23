"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { GraduationCap, ArrowRight, BookOpen, Users, Award } from 'lucide-react';

export default function LandingPage() {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900">EduBridge AI</span>
        </div>

        <div>
          {user ? (
            <Link
              href={getDashboardPath()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span>Sign In to Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Academic Portal Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-8 my-auto">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
          <GraduationCap className="w-9 h-9" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Academic Learning Platform
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Unified educational environment for Students, Tutors, and Administrators. Access general academic assistance, practice concepts, progress analytics, and verified scholarships.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center space-x-2"
          >
            <span>Enter Academic Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 text-left">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Academic Tutoring & Practice</h3>
            <p className="text-xs text-slate-500">Natural problem solving, subject-targeted quizzes, and open concept mastery.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Human Tutor Coordination</h3>
            <p className="text-xs text-slate-500">Real-time scheduling, slot availability locking, and 1-on-1 session requests.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Verified Scholarships</h3>
            <p className="text-xs text-slate-500">Official government and institutional scholarship access with direct links.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 bg-white">
        <p>© 2026 EduBridge AI — Academic Learning System</p>
      </footer>
    </div>
  );
}


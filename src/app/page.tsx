"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import {
  Sparkles,
  Bot,
  UserCheck,
  Award,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Globe,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">EduBridge AI</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#roles" className="hover:text-indigo-600 transition-colors">Academic Portals</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Platform Workflow</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Capabilities</a>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          {user ? (
            <Link
              href={getDashboardPath()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center space-x-2"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-24 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Unified Academic Platform • AI Assisted • Tutor Supported</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Empowering Academic Excellence Through <br />
          <span className="text-gradient">Intelligent Learning Systems</span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          EduBridge AI brings together grounded AI tutoring, verified human educator support, real-time learning gap analytics, and official scholarship matching in one seamless academic environment.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center space-x-2 shadow-md shadow-indigo-200 transition-all"
          >
            <span>Sign In to Academic Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-sm font-bold flex items-center space-x-2 transition-all shadow-xs"
          >
            <span>Register New Account</span>
          </Link>
        </div>
      </section>

      {/* Role Portals Section */}
      <section id="roles" className="px-6 py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Tailored User Roles</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Choose Your Role to Enter the Platform</h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">Sign in according to your designated academic role to access specialized tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Role */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access personalized AI tutoring across all subjects, search topics, generate targeted practice quizzes, track learning gaps, book 1-on-1 sessions, and apply for verified scholarships.
                </p>
              </div>

              <Link
                href="/login?role=student"
                className="w-full py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs text-center block border border-indigo-200 transition-all"
              >
                Sign In as Student →
              </Link>
            </div>

            {/* Tutor Role */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Tutor Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage availability grids, review incoming student booking requests, view AI-flagged student learning gaps, record session notes, and manage educational reference materials.
                </p>
              </div>

              <Link
                href="/login?role=tutor"
                className="w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs text-center block border border-emerald-200 transition-all"
              >
                Sign In as Tutor →
              </Link>
            </div>

            {/* Admin Role */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 hover:border-purple-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Administrator Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Oversee user accounts, filter students and tutors by role, edit credentials, remove inactive users, ingest verified textbook resources, and manage scholarship rules.
                </p>
              </div>

              <Link
                href="/login?role=admin"
                className="w-full py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs text-center block border border-purple-200 transition-all"
              >
                Sign In as Admin →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Integrated Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Real Academic Workflows & Analytics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <h3 className="text-base font-bold text-slate-900">Grounded AI Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students ask natural doubts across all academic subjects (Math, Physics, CS, DBMS, Chemistry, Engineering) with reference context options.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <h3 className="text-base font-bold text-slate-900">Human Tutor Handoff & Booking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When concept struggles are detected, students find matched tutors, select available times, and request bookings without slot conflicts.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <h3 className="text-base font-bold text-slate-900">Official Scholarship Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matches student academic scores and income criteria against verified government scholarships with direct official portal links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 bg-white">
        <p>© 2026 EduBridge AI — Official Academic Platform. Built with Next.js & FastAPI.</p>
      </footer>
    </div>
  );
}

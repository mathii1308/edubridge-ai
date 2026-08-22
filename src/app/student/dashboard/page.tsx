"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { useAuth } from '@/lib/auth';
import {
  TrendingUp,
  AlertTriangle,
  Bot,
  UserCheck,
  Award,
  CalendarDays,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <RoleSwitcher />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl">
          {/* Welcome Banner */}
          <div className="glass-card rounded-3xl p-6 border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Class 12 STEM Science • Tamil Nadu
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-2">
                Welcome back, {user?.name || 'Ananya'} 👋
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                AI support is ready. Your current overall mastery is <strong>76.0%</strong>. Review your weak topics or get matched with verified scholarships.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/student/ai-tutor"
                className="py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-500/30 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Launch AI Tutor</span>
              </Link>
            </div>
          </div>

          {/* Grid Layout: Progress + Weak Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Mastery Progress Bars */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Subject Mastery Performance
                </h3>
                <Link href="/student/progress" className="text-xs text-indigo-400 hover:underline">
                  View Analytics →
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Mathematics</span>
                    <span className="text-indigo-400">78%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Physics</span>
                    <span className="text-emerald-400">85%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Chemistry</span>
                    <span className="text-amber-400">65%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Session Card */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Upcoming Session</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dr. Rajesh Kumar</h4>
                    <p className="text-xs text-slate-400">Mathematics • Probability</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-300">📅 Tomorrow, Aug 23, 2026</p>
                  <p className="text-indigo-400 font-medium">⏰ 10:00 AM - 11:00 AM</p>
                </div>
              </div>

              <Link
                href="/student/sessions"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center block transition-all"
              >
                View All Sessions
              </Link>
            </div>
          </div>

          {/* Weak Topics Section */}
          <div className="glass-card rounded-3xl p-6 border border-amber-500/20 bg-amber-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Identified Weak Topics (Requires Action)</h3>
              </div>
              <span className="text-[10px] text-amber-300 font-semibold">Accuracy &lt; 60%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">Probability</h4>
                    <p className="text-xs text-slate-400">Mathematics</p>
                  </div>
                  <span className="text-xs font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                    42% Score
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                  <Link
                    href="/student/practice"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all"
                  >
                    Practice 10 Questions
                  </Link>
                  <Link
                    href="/student/ai-tutor"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-all"
                  >
                    Ask AI Tutor
                  </Link>
                  <Link
                    href="/student/tutors?subject=Mathematics&topic=Probability"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-indigo-300 text-xs font-medium hover:bg-slate-700 transition-all"
                  >
                    Connect with Tutor
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">Trigonometry</h4>
                    <p className="text-xs text-slate-400">Mathematics</p>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    55% Score
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                  <Link
                    href="/student/practice"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all"
                  >
                    Practice 10 Questions
                  </Link>
                  <Link
                    href="/student/ai-tutor"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-all"
                  >
                    Ask AI Tutor
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scholarship Recommendation Teaser */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Recommended Verified Scholarships</h3>
              </div>
              <Link href="/student/scholarships" className="text-xs text-indigo-400 hover:underline">
                View All Opportunities →
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">95% Profile Eligibility Match</span>
                <h4 className="text-sm font-bold text-white mt-0.5">PM YASASVI Central Sector Post-Matric Scholarship 2026</h4>
                <p className="text-xs text-slate-400 mt-1">Provider: Ministry of Social Justice & Empowerment • Benefit: ₹75,000 / year</p>
              </div>

              <Link
                href="/student/scholarships"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shrink-0"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

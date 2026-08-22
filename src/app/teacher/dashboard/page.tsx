"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { useAuth } from '@/lib/auth';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle2, Video, ArrowRight } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <RoleSwitcher />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Welcome Banner */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 bg-gradient-to-r from-emerald-900/30 via-slate-900 to-indigo-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Educator Portal
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-2">
                Welcome back, {user?.name || 'Dr. Rajesh Kumar'} 🎓
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                You have <strong>1 upcoming session today</strong> and <strong>1 pending booking request</strong>. AI struggle detection flagged 2 students needing probability review.
              </p>
            </div>

            <Link
              href="/teacher/availability"
              className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-500/30 transition-all shrink-0"
            >
              <Clock className="w-4 h-4" />
              <span>Manage Availability Grid</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Today's Sessions</span>
              <p className="text-2xl font-extrabold text-white">1</p>
              <span className="text-[11px] text-emerald-400 font-medium">10:00 AM Session</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Booking Requests</span>
              <p className="text-2xl font-extrabold text-amber-400">1</p>
              <span className="text-[11px] text-amber-300">Requires Confirmation</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Rating</span>
              <p className="text-2xl font-extrabold text-amber-400">4.9 ★</p>
              <span className="text-[11px] text-slate-400">From 48 Completed Sessions</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Students</span>
              <p className="text-2xl font-extrabold text-indigo-400">12</p>
              <span className="text-[11px] text-slate-400">Mathematics & Physics</span>
            </div>
          </div>

          {/* Grid Layout: Sessions & Students Needing Attention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's & Upcoming Sessions */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Today's Scheduled Sessions
                </h3>
                <Link href="/teacher/bookings" className="text-xs text-indigo-400 hover:underline">
                  Manage Requests →
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                      A
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Ananya Sharma</h4>
                      <p className="text-xs text-indigo-300">Mathematics • Probability & Bayes Theorem</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">📅 Aug 23, 2026 • ⏰ 10:00 AM - 11:00 AM</span>
                  <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Start Classroom
                  </button>
                </div>
              </div>
            </div>

            {/* Students Needing Attention (Learning Gap Insights) */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/20 bg-amber-500/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Students Needing Attention</h3>
                </div>
                <span className="text-[10px] text-amber-300 font-semibold">AI Gap Alert</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Ananya Sharma</h4>
                    <p className="text-xs text-rose-400 font-medium mt-0.5">⚠️ Probability accuracy dropped to 42%</p>
                  </div>
                  <Link
                    href="/teacher/students"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium"
                  >
                    View Notes
                  </Link>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Rohan Verma</h4>
                    <p className="text-xs text-amber-400 font-medium mt-0.5">⚠️ Trigonometry identities struggle</p>
                  </div>
                  <Link
                    href="/teacher/students"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium"
                  >
                    View Notes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

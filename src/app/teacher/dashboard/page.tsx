"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle2, Video, ArrowRight } from 'lucide-react';

function TeacherDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Welcome Banner */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Educator Portal
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
                Welcome back, {user?.name || 'Educator'} 🎓
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium">
                Logged in as <strong>{user?.email}</strong>. Manage your availability slots, booking requests, and student session notes.
              </p>
            </div>

            <Link
              href="/teacher/availability"
              className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all shrink-0"
            >
              <Clock className="w-4 h-4" />
              <span>Manage Availability Grid</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Scheduled Sessions</span>
              <p className="text-2xl font-extrabold text-slate-900">1</p>
              <span className="text-[11px] text-emerald-700 font-bold">10:00 AM Session</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Requests</span>
              <p className="text-2xl font-extrabold text-amber-600">1</p>
              <span className="text-[11px] text-amber-700 font-bold">Requires Action</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Rating</span>
              <p className="text-2xl font-extrabold text-amber-500">4.9 ★</p>
              <span className="text-[11px] text-slate-500 font-bold">Verified Educator</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Students</span>
              <p className="text-2xl font-extrabold text-indigo-600">12</p>
              <span className="text-[11px] text-slate-500 font-bold">Mathematics & DBMS</span>
            </div>
          </div>

          {/* Grid Layout: Sessions & Students Needing Attention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's & Upcoming Sessions */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Today's Scheduled Sessions
                </h3>
                <Link href="/teacher/bookings" className="text-xs text-indigo-600 hover:underline font-bold">
                  Manage Requests →
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-white">
                      S
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Demo Student</h4>
                      <p className="text-xs text-indigo-700 font-bold">DBMS • Normalization (2NF & 3NF)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">📅 Aug 23, 2026 • ⏰ 10:00 AM - 11:00 AM</span>
                  <Link
                    href="/teacher/bookings"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" /> Classroom Session
                  </Link>
                </div>
              </div>
            </div>

            {/* Students Needing Attention */}
            <div className="glass-card rounded-3xl p-6 border border-amber-200 bg-amber-50/40 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Students Needing Attention</h3>
                </div>
                <span className="text-[10px] text-amber-800 font-bold px-2 py-0.5 rounded bg-amber-100 border border-amber-200">AI Gap Alert</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Ananya Sharma</h4>
                    <p className="text-xs text-rose-600 font-bold mt-0.5">⚠️ DBMS Normalization gap flagged</p>
                  </div>
                  <Link
                    href="/teacher/students"
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200"
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

export default function TeacherDashboard() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherDashboardContent />
    </ProtectedRoute>
  );
}

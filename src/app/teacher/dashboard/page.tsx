"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { Calendar, Clock, AlertTriangle, Video } from 'lucide-react';

function TeacherDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Verified Educator Portal
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
                Welcome back, {user?.name || 'Educator'} 🎓
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Logged in as <strong>{user?.email}</strong>. Manage your availability slots, student booking requests, and learning gap notes.
              </p>
            </div>

            <Link
              href="/teacher/availability"
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-2xs transition-all shrink-0"
            >
              <Clock className="w-4 h-4" />
              <span>Manage Availability Grid</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Scheduled Sessions</span>
              <p className="text-2xl font-extrabold text-slate-900">1</p>
              <span className="text-[11px] text-emerald-700 font-semibold">10:00 AM Session</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Pending Requests</span>
              <p className="text-2xl font-extrabold text-amber-600">1</p>
              <span className="text-[11px] text-amber-700 font-semibold">Requires Action</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Current Rating</span>
              <p className="text-2xl font-extrabold text-amber-500">4.9 ★</p>
              <span className="text-[11px] text-slate-500">Verified Educator</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Active Students</span>
              <p className="text-2xl font-extrabold text-blue-600">12</p>
              <span className="text-[11px] text-slate-500">Mathematics & DBMS</span>
            </div>
          </div>

          {/* Grid Layout: Sessions & Students Needing Attention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's & Upcoming Sessions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Today's Scheduled Sessions
                </h3>
                <Link href="/teacher/bookings" className="text-xs text-blue-600 hover:underline font-bold">
                  Manage Requests →
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      S
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Student Account</h4>
                      <p className="text-xs text-blue-700 font-bold">DBMS • Normalization (2NF & 3NF)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">📅 Aug 23, 2026 • ⏰ 10:00 AM - 11:00 AM</span>
                  <Link
                    href="/teacher/bookings"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5" /> Classroom Session
                  </Link>
                </div>
              </div>
            </div>

            {/* Students Needing Attention */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">Students Needing Attention</h3>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">AI Gap Alert</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Ananya Sharma</h4>
                    <p className="text-xs text-rose-600 font-medium mt-0.5">⚠️ DBMS Normalization gap flagged</p>
                  </div>
                  <Link
                    href="/teacher/students"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold"
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


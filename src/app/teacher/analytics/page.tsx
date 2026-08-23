"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';

function TeacherAnalyticsContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-900">Tutor Performance Analytics</h1>
            <p className="text-xs text-slate-500 mt-1">Track student engagement rates, completed 1-on-1 tutoring sessions, and concept resolution rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Completed Sessions</span>
              <p className="text-2xl font-extrabold text-blue-600">24</p>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Satisfaction Rate</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Active Students</span>
              <p className="text-2xl font-extrabold text-emerald-700">12</p>
              <span className="text-[11px] text-slate-500">Math & DBMS</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Educator Rating</span>
              <p className="text-2xl font-extrabold text-amber-500">4.9 ★</p>
              <span className="text-[11px] text-slate-500">Verified Tutor Badge</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Resolved Learning Gaps</span>
              <p className="text-2xl font-extrabold text-slate-900">18</p>
              <span className="text-[11px] text-emerald-700 font-semibold">↑ +8 this month</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function TeacherAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherAnalyticsContent />
    </ProtectedRoute>
  );
}

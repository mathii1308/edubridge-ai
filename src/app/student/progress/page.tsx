"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProgressCharts } from '@/components/progress/ProgressCharts';

function StudentProgressContent() {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h1 className="text-xl font-bold text-white">Learning Gap Detection & Progress Insights</h1>
            <p className="text-xs text-slate-400 mt-1">Real-time analytical graphs tracking topic mastery, weak points, and score progression over time.</p>
          </div>

          <ProgressCharts />
        </main>
      </div>
    </div>
  );
}

export default function StudentProgressPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentProgressContent />
    </ProtectedRoute>
  );
}

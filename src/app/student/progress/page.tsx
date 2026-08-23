"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProgressCharts } from '@/components/progress/ProgressCharts';

function StudentProgressContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-900">Learning Gap Detection & Progress Insights</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time analytical graphs tracking topic mastery, weak points, action notes, and score progression over time.</p>
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


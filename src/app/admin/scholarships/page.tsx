"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ShieldCheck, Plus } from 'lucide-react';

function AdminScholarshipsContent() {
  const [scholarships] = useState([
    {
      id: 1,
      name: "PM YASASVI Central Sector Post-Matric Scholarship 2026",
      provider: "Ministry of Social Justice & Empowerment",
      deadline: "2026-09-30",
      status: "Verified Live",
      lastVerified: "Today"
    },
    {
      id: 2,
      name: "Tamil Nadu State Merit Higher Education Scholarship",
      provider: "Dept. of School Education, Govt. of Tamil Nadu",
      deadline: "2026-10-15",
      status: "Verified Live",
      lastVerified: "Today"
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Verified Scholarship Source Portal</h1>
              <p className="text-xs text-slate-500 mt-1">Manage official government scholarship database entries, eligibility rules, and sync timestamps.</p>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <Plus className="w-4 h-4" /> Add Verified Scholarship
            </button>
          </div>

          <div className="space-y-4">
            {scholarships.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 font-bold mt-0.5">Provider: {s.provider}</p>
                  <p className="text-xs text-slate-500 mt-1">Application Deadline: {s.deadline} • Verified: {s.lastVerified}</p>
                </div>

                <button className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200">
                  Edit Rules & Source
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminScholarshipsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminScholarshipsContent />
    </ProtectedRoute>
  );
}


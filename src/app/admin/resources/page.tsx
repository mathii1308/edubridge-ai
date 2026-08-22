"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookOpen, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';

function AdminResourcesContent() {
  const [resources] = useState([
    {
      id: 1,
      title: "OpenStax University Mathematics: Probability and Combinatorics",
      source: "OpenStax Educational Initiative",
      subject: "Mathematics",
      language: "English",
      url: "https://openstax.org/details/books/introductory-statistics",
      chunks: 8,
      verified: true
    },
    {
      id: 2,
      title: "தமிழ்நாடு பாடநூல்: கணிதம் 12 — நிகழ்தகவு கோட்பாடு",
      source: "Tamil Nadu School Education Department",
      subject: "Mathematics",
      language: "Tamil",
      url: "https://www.textbooksonline.tn.nic.in",
      chunks: 6,
      verified: true
    }
  ]);

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">AI Knowledge Base & Educational Resources</h1>
              <p className="text-xs text-slate-400 mt-1">Ingest open educational textbooks and public academic resources for AI Tutor grounding.</p>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <Plus className="w-4 h-4" /> Ingest New Resource
            </button>
          </div>

          <div className="space-y-4">
            {resources.map((r) => (
              <div key={r.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{r.title}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Grounded & Verified
                    </span>
                  </div>
                  <p className="text-xs text-indigo-300 mt-0.5">Source: {r.source} • Subject: {r.subject} ({r.language})</p>
                  <p className="text-xs text-slate-500 mt-1">Chunks: {r.chunks} Vector Chunks Index</p>
                </div>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  View Source
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminResourcesContent />
    </ProtectedRoute>
  );
}

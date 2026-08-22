"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { Users, AlertTriangle, FileText, Plus } from 'lucide-react';

export default function TeacherStudentsPage() {
  const [students] = useState([
    {
      id: 1,
      name: 'Ananya Sharma',
      class: 'Class 12 STEM Science',
      weakTopic: 'Probability (42% accuracy)',
      gapReason: 'Struggling with conditional probability formula application in multi-step word problems.',
      lastSession: 'Aug 23, 2026'
    },
    {
      id: 2,
      name: 'Rohan Verma',
      class: 'Class 12 STEM Science',
      weakTopic: 'Trigonometry (55% accuracy)',
      gapReason: 'Struggling with sine and cosine law identity proofs.',
      lastSession: 'Aug 18, 2026'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <RoleSwitcher />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h1 className="text-xl font-bold text-white">Assigned Students & Detected Learning Gaps</h1>
            <p className="text-xs text-slate-400 mt-1">Review student performance metrics, identified weak topics, and add custom pedagogical session notes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((s) => (
              <div key={s.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{s.name}</h3>
                    <p className="text-xs text-slate-400">{s.class}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Detected Learning Gap:
                  </span>
                  <p className="text-slate-200 font-semibold">{s.weakTopic}</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-1">{s.gapReason}</p>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Last Session: {s.lastSession}</span>
                  <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium text-xs flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

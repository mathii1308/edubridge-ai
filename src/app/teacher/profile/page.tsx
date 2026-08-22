"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { Save, CheckCircle2 } from 'lucide-react';

function TeacherProfileContent() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "Dr. Rajesh Kumar",
    bio: "Senior Mathematics lecturer with 12+ years experience simplifying Calculus & Probability for competitive exams.",
    experience: 12,
    teachingMode: "Online",
    languages: "English, Tamil",
    subjects: "Mathematics, Physics"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-4xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h1 className="text-xl font-bold text-white">Tutor Profile Settings</h1>
            <p className="text-xs text-slate-400 mt-1">Configure your teaching bio, subjects, supported languages, and teaching mode for the deterministic match algorithm.</p>
          </div>

          <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 text-xs">
            <div>
              <label className="font-semibold text-slate-300 mb-1 block">Full Name:</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 mb-1 block">Bio / Teaching Philosophy:</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Teaching Experience (Years):</label>
                <input
                  type="number"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Teaching Mode:</label>
                <select
                  value={form.teachingMode}
                  onChange={(e) => setForm({ ...form, teachingMode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Both">Both (Hybrid)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Supported Languages:</label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Subjects Taught:</label>
                <input
                  type="text"
                  value={form.subjects}
                  onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> Tutor profile parameters updated successfully!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Verified status: Active</span>
              )}

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Tutor Profile</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function TeacherProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherProfileContent />
    </ProtectedRoute>
  );
}

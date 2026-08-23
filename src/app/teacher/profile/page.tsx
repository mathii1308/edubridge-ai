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
    bio: "Senior Mathematics lecturer with 12+ years experience simplifying Calculus, Probability & DBMS for competitive exams.",
    experience: 12,
    teachingMode: "Online",
    languages: "English, Tamil",
    subjects: "Mathematics, Physics, DBMS"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-4xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-900">Tutor Profile & Teaching Settings</h1>
            <p className="text-xs text-slate-500 mt-1">Configure your teaching bio, subjects, supported languages, and teaching mode for student matching.</p>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Full Name:</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Bio / Teaching Philosophy:</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Teaching Experience (Years):</label>
                <input
                  type="number"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Teaching Mode:</label>
                <select
                  value={form.teachingMode}
                  onChange={(e) => setForm({ ...form, teachingMode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none font-medium"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Both">Both (Hybrid)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Supported Languages:</label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Subjects Taught:</label>
                <input
                  type="text"
                  value={form.subjects}
                  onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tutor profile updated successfully!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">Verified Status: Active Educator</span>
              )}

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
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


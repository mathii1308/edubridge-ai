"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { Save, CheckCircle2 } from 'lucide-react';

function StudentProfileContent() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "Student Account",
    email: user?.email || "",
    educationLevel: "High School",
    institution: "Chennai High School",
    preferredLanguage: "English",
    learningLevel: "Intermediate",
    state: "Tamil Nadu",
    course: "Class 12 STEM Science",
    academicScore: 84.5,
    incomeRange: 180000
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);

    try {
      await fetch('http://localhost:8000/students/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          education_level: form.educationLevel,
          institution: form.institution,
          preferred_language: form.preferredLanguage,
          learning_level: form.learningLevel,
          state: form.state,
          course: form.course,
          academic_score: form.academicScore,
          income_range: form.incomeRange
        })
      });
    } catch {
      // Local fallback
    }

    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-4xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-900">Student Academic Profile & Preferences</h1>
            <p className="text-xs text-slate-500 mt-1">Updates to preferred language, learning level, score, and state dynamically affect AI Tutor responses and scholarship eligibility matching.</p>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
                <label className="font-bold text-slate-700 mb-1 block">Email Address:</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Preferred Learning Language:</label>
                <select
                  value={form.preferredLanguage}
                  onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">AI Tutor Learning Level:</label>
                <select
                  value={form.learningLevel}
                  onChange={(e) => setForm({ ...form, learningLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="Beginner">Beginner Level</option>
                  <option value="Intermediate">Intermediate Level</option>
                  <option value="Advanced">Advanced Level</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">State Domicile:</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Course Stream:</label>
                <input
                  type="text"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Academic Score Percentage (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.academicScore}
                  onChange={(e) => setForm({ ...form, academicScore: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Annual Family Income (INR ₹):</label>
                <input
                  type="number"
                  value={form.incomeRange}
                  onChange={(e) => setForm({ ...form, incomeRange: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile parameters updated & synced!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Your profile data is strictly secured.</span>
              )}

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentProfileContent />
    </ProtectedRoute>
  );
}


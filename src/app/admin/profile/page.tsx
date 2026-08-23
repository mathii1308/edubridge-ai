"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { ShieldCheck, Check } from 'lucide-react';

function AdminProfileContent() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'EduBridge Admin');
  const [email, setEmail] = useState(user?.email || 'admin@edubridge.ai');
  const [saved, setSaved] = useState(false);

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
            <h1 className="text-xl font-bold text-slate-900">Admin Profile Settings</h1>
            <p className="text-xs text-slate-500 mt-1">Manage platform administrator credentials and security preferences.</p>
          </div>

          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Admin profile settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Administrator Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Administrative Role Tier:</label>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 font-bold text-blue-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Super Administrator — Full System Access</span>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminProfileContent />
    </ProtectedRoute>
  );
}

"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { Users, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 1, name: 'Ananya Sharma', email: 'student@edubridge.ai', role: 'student', status: 'Active' },
    { id: 2, name: 'Dr. Rajesh Kumar', email: 'tutor.rajesh@edubridge.ai', role: 'teacher', status: 'Verified Tutor' },
    { id: 3, name: 'Prof. Lakshmi Priya', email: 'tutor.lakshmi@edubridge.ai', role: 'teacher', status: 'Verified Tutor' },
    { id: 4, name: 'EduBridge Admin', email: 'admin@edubridge.ai', role: 'admin', status: 'Super Admin' }
  ]);

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <RoleSwitcher />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h1 className="text-xl font-bold text-white">User & Tutor Credential Management</h1>
            <p className="text-xs text-slate-400 mt-1">Manage user roles, verify tutor educational certificates, and oversee system access.</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                      {u.role === 'student' ? <GraduationCap className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{u.name}</h4>
                      <p className="text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 uppercase">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

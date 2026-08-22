"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { Check, X, Calendar, Clock, User } from 'lucide-react';

export default function TeacherBookingsPage() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: 'Rohan Verma',
      subject: 'Mathematics',
      topic: 'Probability & Bayes Theorem',
      date: '2026-08-24',
      time: '10:00 AM - 11:00 AM',
      status: 'requested',
      note: 'Struggling with conditional probability formula after taking AI Quiz.'
    },
    {
      id: 2,
      studentName: 'Ananya Sharma',
      subject: 'Mathematics',
      topic: 'Probability',
      date: '2026-08-23',
      time: '10:00 AM - 11:00 AM',
      status: 'accepted',
    }
  ]);

  const handleAction = (id: number, action: 'accepted' | 'rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <RoleSwitcher />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h1 className="text-xl font-bold text-white">Student Booking Requests</h1>
            <p className="text-xs text-slate-400 mt-1">Review incoming session requests from students seeking 1-on-1 tutoring support.</p>
          </div>

          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                      {r.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{r.studentName}</h3>
                      <p className="text-xs text-indigo-300 font-medium">{r.subject} — {r.topic}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">📅 {r.date} • ⏰ {r.time}</p>
                  {r.note && (
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 italic">
                      "{r.note}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {r.status === 'requested' ? (
                    <>
                      <button
                        onClick={() => handleAction(r.id, 'accepted')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
                      >
                        <Check className="w-4 h-4" /> Accept Request
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'rejected')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                      {r.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { CalendarDays, Clock, CheckCircle2, Video, FileText } from 'lucide-react';

export default function MySessionsPage() {
  const [sessions] = useState([
    {
      id: 1,
      tutorName: 'Dr. Rajesh Kumar',
      subject: 'Mathematics',
      topic: 'Probability & Bayes Theorem',
      date: '2026-08-23',
      time: '10:00 AM - 11:00 AM',
      status: 'accepted',
      mode: 'Online (Video Classroom)'
    },
    {
      id: 2,
      tutorName: 'Prof. Lakshmi Priya',
      subject: 'Physics',
      topic: 'Wave Optics & Interference',
      date: '2026-08-18',
      time: '04:00 PM - 05:00 PM',
      status: 'completed',
      mode: 'Online',
      notes: 'Reviewed Youngs double slit experiment derivation. Practice 5 numericals.'
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
            <h1 className="text-xl font-bold text-white">My Booked Sessions</h1>
            <p className="text-xs text-slate-400 mt-1">Track upcoming 1-on-1 tutor interactions and access completed session notes.</p>
          </div>

          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-lg shrink-0">
                    {s.tutorName.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">{s.tutorName}</h3>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        s.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-300 font-medium mt-0.5">{s.subject} — {s.topic}</p>
                    <p className="text-xs text-slate-400 mt-1">📅 {s.date} • ⏰ {s.time}</p>

                    {s.notes && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-indigo-400 block mb-0.5">Tutor Notes:</strong>
                        {s.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {s.status === 'accepted' && (
                    <button className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
                      <Video className="w-4 h-4" />
                      <span>Join Classroom</span>
                    </button>
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

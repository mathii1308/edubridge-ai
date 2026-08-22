"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { Clock, Plus, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';

export default function TeacherAvailabilityPage() {
  const [slots, setSlots] = useState([
    { id: 1, date: '2026-08-23', time: '10:00 - 11:00', status: 'booked', student: 'Ananya Sharma' },
    { id: 2, date: '2026-08-23', time: '16:00 - 17:00', status: 'available' },
    { id: 3, date: '2026-08-23', time: '17:30 - 18:30', status: 'available' },
    { id: 4, date: '2026-08-24', time: '10:00 - 11:00', status: 'pending', student: 'Rohan Verma' },
    { id: 5, date: '2026-08-24', time: '15:00 - 16:00', status: 'available' },
    { id: 6, date: '2026-08-25', time: '11:00 - 12:00', status: 'unavailable' },
  ]);

  const toggleSlotStatus = (id: number) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id === id && s.status !== 'booked') {
          const nextStatus = s.status === 'available' ? 'unavailable' : 'available';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <RoleSwitcher />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Real-Time Calendar Availability Manager</span>
              </div>
              <h1 className="text-xl font-bold text-white">Tutor Availability Grid</h1>
              <p className="text-xs text-slate-400 mt-0.5">Click slots to toggle available or block dates. Booked slots are locked in real-time.</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Available (Green)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Booked (Red)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Pending (Yellow)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-600"></span> Blocked (Gray)
              </span>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => {
              const colorClasses =
                slot.status === 'available'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : slot.status === 'booked'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : slot.status === 'pending'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500';

              return (
                <div
                  key={slot.id}
                  onClick={() => toggleSlotStatus(slot.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${colorClasses}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" /> {slot.date}
                    </span>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/60">
                      {slot.status}
                    </span>
                  </div>

                  <p className="text-sm font-bold">{slot.time}</p>

                  {slot.student && (
                    <p className="text-[11px] font-medium text-slate-300">
                      Student: {slot.student}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

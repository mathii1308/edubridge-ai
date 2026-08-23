"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

function TeacherAvailabilityContent() {
  const [slots, setSlots] = useState([
    { id: 1, date: '2026-08-23', time: '10:00 - 11:00', status: 'booked', student: 'Student Account' },
    { id: 2, date: '2026-08-23', time: '16:00 - 17:00', status: 'available' },
    { id: 3, date: '2026-08-23', time: '17:30 - 18:30', status: 'available' },
    { id: 4, date: '2026-08-24', time: '10:00 - 11:00', status: 'pending', student: 'Ananya Sharma' },
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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Calendar Availability Grid</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Tutor Availability Manager</h1>
              <p className="text-xs text-slate-500 mt-0.5">Click slots to toggle available or block dates. Booked slots are locked in real-time.</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Available
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Booked
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Pending
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Blocked
              </span>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => {
              const colorClasses =
                slot.status === 'available'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                  : slot.status === 'booked'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : slot.status === 'pending'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-100 border-slate-200 text-slate-500';

              return (
                <div
                  key={slot.id}
                  onClick={() => toggleSlotStatus(slot.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 shadow-2xs ${colorClasses}`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" /> {slot.date}
                    </span>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                      {slot.status}
                    </span>
                  </div>

                  <p className="text-sm font-bold">{slot.time}</p>

                  {slot.student && (
                    <p className="text-[11px] font-semibold text-slate-700">
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

export default function TeacherAvailabilityPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherAvailabilityContent />
    </ProtectedRoute>
  );
}


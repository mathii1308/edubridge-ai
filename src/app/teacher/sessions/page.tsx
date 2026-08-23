"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookingChatModal } from '@/components/chat/BookingChatModal';
import { Booking } from '@/types';
import { useAuth } from '@/lib/auth';
import { CalendarDays, Video, MessageSquare, Sparkles } from 'lucide-react';

function TeacherSessionsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      let list: Booking[] = [];
      try {
        const res = await fetch(`http://localhost:8000/bookings?user_role=teacher&user_id=${user?.id || 2}`);
        if (res.ok) {
          list = await res.json();
        }
      } catch (e) {}

      try {
        const saved = localStorage.getItem('edubridge_bookings');
        if (saved) {
          const localArr = JSON.parse(saved);
          const existingIds = new Set(list.map(b => b.id));
          localArr.forEach((b: Booking) => {
            if (!existingIds.has(b.id)) list.push(b);
          });
        }
      } catch (e) {}

      setBookings(list);
    };

    loadBookings();
  }, [user?.id]);

  const activeSessions = bookings.filter(b => b.status === 'accepted' || b.status === 'requested');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Tutor Scheduled Sessions</h1>
              <p className="text-xs text-slate-500 mt-1">Review upcoming 1-on-1 sessions with assigned students and launch video classrooms.</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-bold">
              Active Sessions: {activeSessions.length}
            </div>
          </div>

          <div className="space-y-4">
            {activeSessions.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs text-center text-slate-500 text-xs">
                No active tutoring sessions scheduled yet.
              </div>
            ) : (
              activeSessions.map((b) => (
                <div key={b.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
                      {b.student_name ? b.student_name.charAt(0) : 'S'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{b.student_name || 'Student Account'}</h3>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                          b.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <p className="text-xs text-blue-700 font-bold">{b.subject_name} — {b.topic_name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span>📅 Date: {b.scheduled_date}</span>
                        <span>•</span>
                        <span>⏰ Time: {b.start_time} - {b.end_time}</span>
                      </p>

                      {b.student_requirement && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 mt-2">
                          <strong className="text-slate-900 block mb-0.5 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Student Request Context:
                          </strong>
                          {b.student_requirement}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <button
                      onClick={() => { setSelectedBooking(b); setIsChatOpen(true); }}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-200"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>Chat with Student</span>
                    </button>

                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                      <Video className="w-4 h-4" />
                      <span>Start Live Session</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {selectedBooking && (
        <BookingChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}

export default function TeacherSessionsPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherSessionsContent />
    </ProtectedRoute>
  );
}

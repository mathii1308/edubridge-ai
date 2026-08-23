"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookingChatModal } from '@/components/chat/BookingChatModal';
import { Booking } from '@/types';
import { useAuth } from '@/lib/auth';
import { CalendarDays, Video, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

function MySessionsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const fetchBookings = async () => {
        try {
          const res = await fetch(`http://localhost:8000/bookings?user_role=student&user_id=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setBookings(data);
          } else {
            setBookings([]);
          }
        } catch {
          setBookings([]);
        }
      };

      fetchBookings();
    }
  }, [user?.id]);

  const upcomingBookings = bookings.filter(b => b.status === 'accepted' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Booked Sessions</h1>
              <p className="text-xs text-slate-500 mt-1">Track upcoming 1-on-1 tutor interactions, message your tutor, and review booking statuses.</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-bold">
              Active Sessions: {upcomingBookings.length}
            </div>
          </div>

          {/* Upcoming Sessions Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              Scheduled & Pending Sessions
            </h2>

            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs text-center text-slate-500 text-xs space-y-3">
                <p>No active sessions scheduled yet for your account.</p>
                <Link
                  href="/student/tutors"
                  className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs"
                >
                  Find a Human Tutor & Book Slot
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg shrink-0">
                      {b.teacher_name ? b.teacher_name.charAt(0) : 'T'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{b.teacher_name || 'Assigned Tutor'}</h3>
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
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Student Request Details:
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
                      <span>Chat with Tutor</span>
                    </button>

                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                      <Video className="w-4 h-4" />
                      <span>Join Classroom</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Past Sessions Section */}
          {pastBookings.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Completed & Rejected Sessions
              </h2>
              {pastBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-xl p-5 border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{b.teacher_name} ({b.subject_name} - {b.topic_name})</h3>
                    <p className="text-xs text-slate-500">{b.scheduled_date} • {b.start_time} - {b.end_time}</p>
                  </div>
                  <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase font-semibold border border-slate-200">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
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

export default function MySessionsPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <MySessionsContent />
    </ProtectedRoute>
  );
}


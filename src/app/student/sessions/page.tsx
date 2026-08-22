"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookingChatModal } from '@/components/chat/BookingChatModal';
import { Booking } from '@/types';
import { useAuth } from '@/lib/auth';
import { CalendarDays, Clock, CheckCircle2, Video, MessageSquare, Sparkles, AlertCircle } from 'lucide-react';

function MySessionsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchBookings = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`http://localhost:8000/bookings?user_role=student&user_id=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setBookings(data);
          } else {
            setBookings([]);
          }
        } catch {
          setBookings([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }
  }, [user?.id]);

  const upcomingBookings = bookings.filter(b => b.status === 'accepted' || b.status === 'requested');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">My Booked Sessions</h1>
              <p className="text-xs text-slate-400 mt-1">Track upcoming 1-on-1 tutor interactions, message your tutor, and review past session details.</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium">
              Active Sessions: {upcomingBookings.length}
            </div>
          </div>

          {/* Upcoming Sessions Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Upcoming Scheduled Sessions
            </h2>

            {upcomingBookings.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center text-slate-400 text-xs space-y-3">
                <p>No active sessions scheduled yet for your account.</p>
                <a
                  href="/student/tutors"
                  className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
                >
                  Find a Human Tutor & Book Slot
                </a>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div key={b.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-lg shrink-0">
                      {b.teacher_name ? b.teacher_name.charAt(0) : 'T'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{b.teacher_name || 'Assigned Tutor'}</h3>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                          {b.status}
                        </span>
                      </div>

                      <p className="text-xs text-indigo-300 font-semibold">{b.subject_name} — {b.topic_name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>📅 Date: {b.scheduled_date}</span>
                        <span>•</span>
                        <span>⏰ Time: {b.start_time} - {b.end_time}</span>
                      </p>

                      {b.student_requirement && (
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-amber-300 mt-2">
                          <strong className="text-slate-400 block mb-0.5 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" /> AI Doubts Handoff Payload:
                          </strong>
                          {b.student_requirement}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <button
                      onClick={() => { setSelectedBooking(b); setIsChatOpen(true); }}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Tutor</span>
                    </button>

                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md">
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
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Completed & Past Sessions
              </h2>
              {pastBookings.map((b) => (
                <div key={b.id} className="glass-card rounded-3xl p-5 border border-slate-800/80 opacity-80 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{b.teacher_name} ({b.subject_name} - {b.topic_name})</h3>
                    <p className="text-xs text-slate-400">{b.scheduled_date} • {b.start_time} - {b.end_time}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase font-medium">
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

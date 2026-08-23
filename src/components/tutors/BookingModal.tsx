"use client";

import React, { useState } from 'react';
import { Tutor } from '@/types';
import { Calendar, Clock, CheckCircle2, X, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: Tutor;
  subject: string;
  topic: string;
  studentRequirement?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  tutor,
  subject,
  topic,
  studentRequirement = "Needs 1-on-1 concept explanation"
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-23');
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 11:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: tutor.id,
          subject_name: subject || 'Mathematics',
          topic_name: topic || 'Probability',
          scheduled_date: selectedDate,
          start_time: selectedSlot.split(' - ')[0],
          end_time: selectedSlot.split(' - ')[1],
          student_requirement: studentRequirement
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || 'Slot unavailable or double-booked.');
        setIsSubmitting(false);
        return;
      }

      setIsConfirmed(true);
    } catch {
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-xl p-6 border border-slate-200 relative shadow-xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-2xs">
                {tutor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Book 1-on-1 Session with {tutor.name}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-500">{subject} • {topic}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block mb-0.5 font-semibold">Session Topic Context:</span>
              <span className="text-blue-800 font-bold">{studentRequirement}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" /> Select Date:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['2026-08-23', '2026-08-24', '2026-08-25'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-2.5 rounded-lg font-semibold border text-center transition-all ${
                        selectedDate === d
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Select Available Time Slot:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['10:00 - 11:00', '16:00 - 17:00', '17:30 - 18:30'].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-lg font-semibold border text-center transition-all ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Lock...' : 'Submit Session Booking Request'}
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Booking Request Sent!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your 1-on-1 session request with <strong className="text-slate-900">{tutor.name}</strong> for <strong className="text-slate-900">{topic}</strong> has been sent for <strong>{selectedDate} ({selectedSlot})</strong>. It will appear under <strong>My Sessions</strong> as pending approval.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



"use client";

import React, { useState } from 'react';
import { Tutor } from '@/types';
import { BookingModal } from './BookingModal';
import { Star, ShieldCheck, Languages, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface TutorCardProps {
  tutor: Tutor;
  searchSubject?: string;
  searchTopic?: string;
  studentRequirement?: string;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, searchSubject, searchTopic, studentRequirement }) => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner & Match Percentage */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-2xs">
              {tutor.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                {tutor.name}
                {tutor.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {tutor.rating}
                </span>
                <span>•</span>
                <span>{tutor.experience} Yrs Exp</span>
                <span>•</span>
                <span className="text-blue-700 font-semibold">{tutor.teaching_mode}</span>
              </div>
            </div>
          </div>

          {tutor.match_score && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> {tutor.match_score}% Match
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">
          {tutor.bio}
        </p>

        {/* Match Reasons */}
        {tutor.match_reasons && tutor.match_reasons.length > 0 && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mb-4 space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Matching Qualifications:</p>
            <div className="flex flex-wrap gap-1.5">
              {tutor.match_reasons.map((reason, i) => (
                <span key={i} className="text-[11px] text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  ✓ {reason}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Subjects */}
        <div className="space-y-2 text-xs mb-5">
          <div className="flex items-center space-x-2 text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">Subjects: {tutor.subjects.join(', ')}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>Languages: {tutor.languages.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Real-time Status & Booking Trigger */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Slots Open Today</span>
        </div>

        <button
          onClick={() => setShowBooking(true)}
          className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all"
        >
          <span>Book Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        tutor={tutor}
        subject={searchSubject || tutor.subjects[0] || 'Mathematics'}
        topic={searchTopic || tutor.topics[0] || 'Probability'}
        studentRequirement={studentRequirement}
      />
    </div>
  );
};



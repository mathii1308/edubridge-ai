"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, AlertCircle, ArrowRight, X } from 'lucide-react';

interface TutorHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  topic: string;
  language: string;
  learningLevel: string;
  studentRequirement?: string;
}

export const TutorHandoffModal: React.FC<TutorHandoffModalProps> = ({
  isOpen,
  onClose,
  subject,
  topic,
  language,
  learningLevel,
  studentRequirement = "Needs 1-on-1 concept explanation"
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceed = () => {
    onClose();
    router.push(
      `/student/tutors?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&language=${encodeURIComponent(language)}&requirement=${encodeURIComponent(studentRequirement)}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xl p-6 border border-slate-200 relative shadow-xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Struggle Flagged — Human Tutor Support</h3>
            <p className="text-xs text-amber-800 font-semibold">AI identified concept gap</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          You expressed difficulty grasping <strong className="text-slate-900">{topic}</strong> in <strong className="text-slate-900">{subject}</strong>. Connect with a human tutor for personalized guidance.
        </p>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Subject & Topic:</span>
            <span className="font-bold text-slate-900">{subject} — {topic}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Requirement:</span>
            <span className="font-bold text-blue-800 truncate max-w-[180px]">{studentRequirement}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Language:</span>
            <span className="font-bold text-slate-900">{language}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Status:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Available Tutors Found
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
          >
            Continue with AI
          </button>

          <button
            onClick={handleProceed}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <UserCheck className="w-4 h-4" />
            <span>Find Tutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};



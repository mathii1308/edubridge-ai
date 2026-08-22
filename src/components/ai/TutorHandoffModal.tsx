"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Sparkles, AlertCircle, ArrowRight, X } from 'lucide-react';

interface TutorHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  topic: string;
  language: string;
  learningLevel: string;
}

export const TutorHandoffModal: React.FC<TutorHandoffModalProps> = ({
  isOpen,
  onClose,
  subject,
  topic,
  language,
  learningLevel,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceed = () => {
    onClose();
    // Redirect to Tutor Discovery with pre-filled state query
    router.push(
      `/student/tutors?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&language=${encodeURIComponent(language)}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-indigo-500/30 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Struggle Detected — Human Tutor Support</h3>
            <p className="text-xs text-amber-300">AI identified a key concept gap</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-5 leading-relaxed">
          You expressed difficulty grasping <strong className="text-indigo-300">{topic}</strong> in <strong className="text-indigo-300">{subject}</strong>. Learning complex concepts is easier with a dedicated 1-on-1 human educator.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 mb-6 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subject & Topic:</span>
            <span className="font-semibold text-slate-200">{subject} — {topic}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Preferred Language:</span>
            <span className="font-semibold text-indigo-300">{language}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Learning Pace:</span>
            <span className="font-semibold text-slate-200">{learningLevel}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Real-time Status:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Available Tutors Found
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Try AI Again
          </button>

          <button
            onClick={handleProceed}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Connect with Tutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

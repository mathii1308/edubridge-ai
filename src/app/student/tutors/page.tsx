"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TutorCard } from '@/components/tutors/TutorCard';
import { Tutor } from '@/types';
import { Search, Sparkles, AlertCircle } from 'lucide-react';

function FindTutorContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'DBMS';
  const initialTopic = searchParams.get('topic') || 'Normalization';
  const initialLanguage = searchParams.get('language') || 'English';
  const initialRequirement = searchParams.get('requirement') || 'Needs 1-on-1 concept explanation';

  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [language, setLanguage] = useState(initialLanguage);
  const [requirement, setRequirement] = useState(initialRequirement);

  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: 1,
      user_id: 2,
      name: "Dr. Rajesh Kumar",
      bio: "Senior Mathematics lecturer with 12+ years experience simplifying Calculus, Probability & DBMS for competitive exams.",
      experience: 12,
      rating: 4.9,
      teaching_mode: "Online",
      verified: true,
      subjects: ["Mathematics", "DBMS"],
      topics: ["Probability", "Trigonometry", "Calculus & Derivatives", "Normalization"],
      languages: ["English", "Tamil"],
      match_score: 95.0,
      match_reasons: ["Expert in DBMS Normalization", "Fluent in Tamil", "Open Slots Today", "Top Rated 4.9★"]
    },
    {
      id: 2,
      user_id: 3,
      name: "Prof. Lakshmi Priya",
      bio: "Physics PhD Researcher specializing in Quantum Mechanics, Optics, and Electromagnetism with bilingual proficiency.",
      experience: 8,
      rating: 4.85,
      teaching_mode: "Both",
      verified: true,
      subjects: ["Physics", "Mathematics", "DBMS"],
      topics: ["Wave Optics & Light", "Electromagnetism", "Trigonometry", "Normalization"],
      languages: ["English", "Tamil"],
      match_score: 88.0,
      match_reasons: ["Teaches DBMS & Physics", "Bilingual Support"]
    },
    {
      id: 3,
      user_id: 4,
      name: "Karthik Sundaram",
      bio: "Chemistry Educator and Olympiad Mentor focused on Organic Chemistry reaction mechanisms.",
      experience: 6,
      rating: 4.75,
      teaching_mode: "Online",
      verified: true,
      subjects: ["Chemistry"],
      topics: ["Organic Reaction Mechanisms", "Thermodynamics"],
      languages: ["English"],
      match_score: 75.0,
      match_reasons: ["Verified Chemistry Educator"]
    }
  ]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(`http://localhost:8000/tutors?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&language=${encodeURIComponent(language)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setTutors(data);
        }
      } catch {
        // Fallback
      }
    };
    fetchTutors();
  }, [subject, topic, language]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Header Banner */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Multi-Factor Tutor Matching</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Find a Verified Academic Tutor</h1>
              <p className="text-xs text-slate-500 mt-0.5">Matched using Subject, Language, Availability, Experience, and Rating.</p>
            </div>

            {searchParams.get('topic') && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs flex items-center space-x-2 text-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-blue-600" />
                <span>AI Tutor payload active for <strong>{topic}</strong></span>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Filter by concept topic..."
                className="bg-transparent text-slate-900 focus:outline-none w-full font-medium"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-semibold">Subject:</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none font-medium"
              >
                <option value="DBMS">DBMS</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-semibold">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none font-medium"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          {/* Tutor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                searchSubject={subject}
                searchTopic={topic}
                studentRequirement={requirement}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FindTutorPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 text-sm">
          Loading Tutor Search...
        </div>
      }>
        <FindTutorContent />
      </Suspense>
    </ProtectedRoute>
  );
}



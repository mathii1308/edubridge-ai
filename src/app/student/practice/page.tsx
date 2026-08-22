"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { QuizCard } from '@/components/practice/QuizCard';
import { BrainCircuit, BookOpen, Sparkles } from 'lucide-react';

function PracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedTopic, setSelectedTopic] = useState('Probability');

  const demoQuestions = [
    {
      id: 1,
      question: "If P(A) = 0.6, P(B) = 0.5, and P(A ∩ B) = 0.3, what is the conditional probability P(A|B)?",
      options: ["0.30", "0.50", "0.60", "0.83"],
      explanation: "Using conditional probability formula P(A|B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.60."
    },
    {
      id: 2,
      question: "A bag contains 4 red balls and 6 blue balls. Two balls are drawn successively without replacement. What is the probability that both are red?",
      options: ["16/100", "2/15", "4/25", "1/5"],
      explanation: "First draw: 4/10. Second draw: 3/9. Total probability = (4/10) * (3/9) = 12/90 = 2/15."
    },
    {
      id: 3,
      question: "If two events A and B are independent, which of the following is true?",
      options: ["P(A|B) = P(A)", "P(A ∩ B) = 0", "P(A ∪ B) = 1", "P(A|B) = P(B)"],
      explanation: "By definition of independence, event B occurring gives no information about event A, so P(A|B) = P(A)."
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 mb-1">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Adaptive Practice Engine</span>
              </div>
              <h1 className="text-xl font-bold text-white">Personalized Quizzes & Skill Building</h1>
              <p className="text-xs text-slate-400 mt-0.5">Questions automatically adjust difficulty based on your topic accuracy history.</p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="DBMS">DBMS</option>
              </select>

              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="Probability">Probability</option>
                <option value="Trigonometry">Trigonometry</option>
                <option value="Calculus & Derivatives">Calculus</option>
                <option value="Normalization">DBMS Normalization</option>
              </select>
            </div>
          </div>

          <QuizCard
            quizId={1}
            subject={selectedSubject}
            topic={selectedTopic}
            questions={demoQuestions}
          />
        </main>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <PracticeContent />
    </ProtectedRoute>
  );
}

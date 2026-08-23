"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { QuizCard } from '@/components/practice/QuizCard';
import { BrainCircuit, Search, Sparkles, RefreshCw } from 'lucide-react';

const SUBJECT_TOPICS: Record<string, string[]> = {
  "Physics": [
    "Wave Optics & Light",
    "Thermodynamics",
    "Electromagnetism",
    "Quantum Mechanics",
    "Newton's Laws & Mechanics"
  ],
  "Mathematics": [
    "Calculus & Derivatives",
    "Probability & Statistics",
    "Trigonometry",
    "Linear Algebra & Matrices",
    "Complex Numbers"
  ],
  "Computer Science / DBMS": [
    "Database Normalization (2NF & 3NF)",
    "SQL Query Optimization",
    "Data Structures & Trees",
    "Operating System Process Scheduling",
    "Computer Networks & TCP/IP"
  ],
  "Chemistry": [
    "Organic Reaction Mechanisms",
    "Chemical Kinetics",
    "Electrochemistry",
    "Thermodynamics & Equilibrium",
    "Atomic Structure"
  ],
  "Engineering Mechanics": [
    "Statics & Structural Equilibrium",
    "Stress & Strain Analysis",
    "Kinematics of Particles",
    "Fluid Dynamics"
  ]
};

function PracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [availableTopics, setAvailableTopics] = useState<string[]>(SUBJECT_TOPICS['Physics']);
  const [selectedTopic, setSelectedTopic] = useState('Wave Optics & Light');
  const [searchTopicQuery, setSearchTopicQuery] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);

  // Dynamic Subject -> Concepts Handler
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    const topics = SUBJECT_TOPICS[newSubject] || ["General Concepts"];
    setAvailableTopics(topics);
    setSelectedTopic(topics[0]);
    setSearchTopicQuery('');
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/quizzes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic,
          difficulty: difficulty,
          num_questions: numQuestions
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuiz(data);
      } else {
        throw new Error('Fallback quiz generation');
      }
    } catch {
      // Local fallback quiz object
      setGeneratedQuiz({
        id: 1,
        subject: selectedSubject,
        topic: selectedTopic,
        difficulty: difficulty,
        questions: [
          {
            id: 1,
            question: `What fundamental law governs the principles of ${selectedTopic} in ${selectedSubject}?`,
            options: [
              `Direct proportional law of ${selectedTopic}`,
              "Inverse square law",
              "Static equilibrium constant",
              "Unrelated empirical ratio"
            ],
            explanation: `${selectedTopic} in ${selectedSubject} relies on verified theoretical principles and exact mathematical formulas.`
          },
          {
            id: 2,
            question: `Which parameter is critical when performing calculations for ${selectedTopic}?`,
            options: [
              "Boundary initial conditions",
              "Empirical constant assumption",
              "System variable state",
              "All of the above"
            ],
            explanation: "Problem solving requires evaluating all system parameters and boundary conditions."
          }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateQuiz();
  }, []);

  const filteredTopics = availableTopics.filter(t => 
    t.toLowerCase().includes(searchTopicQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Header Bar */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Concept-Targeted Practice Engine</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Dynamic Quiz Generator</h1>
              <p className="text-xs text-slate-500 mt-0.5">Select a subject, choose or search a specific concept, and generate targeted practice questions.</p>
            </div>

            {/* Quiz Configuration Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              {/* 1. Subject Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">1. Select Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  {Object.keys(SUBJECT_TOPICS).map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              {/* 2. Topic/Concept Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">2. Select Concept:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  {filteredTopics.map(top => (
                    <option key={top} value={top}>{top}</option>
                  ))}
                </select>
              </div>

              {/* 3. Search Topic */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Search Concept:</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchTopicQuery}
                    onChange={(e) => setSearchTopicQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* 4. Generate Quiz Button */}
              <div className="flex items-end">
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Quiz Container */}
          {generatedQuiz ? (
            <QuizCard
              quizId={generatedQuiz.id || 1}
              subject={selectedSubject}
              topic={selectedTopic}
              questions={generatedQuiz.questions || []}
            />
          ) : (
            <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
              <RefreshCw className="w-8 h-8 mx-auto text-blue-600 animate-spin mb-2" />
              <p className="text-xs font-semibold">Generating questions for {selectedTopic} ({selectedSubject})...</p>
            </div>
          )}
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


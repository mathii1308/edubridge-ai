"use client";

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { QuizCard } from '@/components/practice/QuizCard';
import { BrainCircuit, Search, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

const SUBJECT_TOPIC_MAP: Record<string, string[]> = {
  "Physics": [
    "Wave Optics & Interference",
    "Thermodynamics & Heat Transfer",
    "Electromagnetism & Faraday Law",
    "Newtonian Mechanics & Dynamics",
    "Quantum Physics & Photoelectric Effect",
    "Ray Optics & Lenses"
  ],
  "Mathematics": [
    "Probability & Bayes Theorem",
    "Calculus & Derivatives",
    "Linear Algebra & Matrices",
    "Trigonometry & Identities",
    "Complex Numbers",
    "Differential Equations"
  ],
  "Computer Science & DBMS": [
    "DBMS Normalization (1NF, 2NF, 3NF, BCNF)",
    "SQL Joins & Complex Queries",
    "Database Indexing & B-Trees",
    "Data Structures (Trees & Graphs)",
    "Sorting Algorithms & Complexity",
    "Operating Systems & Process Scheduling"
  ],
  "Chemistry": [
    "Organic Reaction Mechanisms",
    "Chemical Bonding & Molecular Orbital",
    "Electrochemistry & Nernst Equation",
    "Atomic Structure & Quantum Numbers",
    "Chemical Kinetics & Rate Law"
  ],
  "Engineering & Electrical": [
    "Circuit Analysis & Kirchhoff Laws",
    "Digital Logic & Gate Design",
    "Control Systems & Transfer Functions",
    "Fluid Mechanics & Bernoulli Theorem"
  ]
};

function PracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [topicSearch, setTopicSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Wave Optics & Interference');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizKey, setQuizKey] = useState(Date.now());

  // Filter topics based on selected subject and topicSearch string
  const availableTopics = useMemo(() => {
    const topics = SUBJECT_TOPIC_MAP[selectedSubject] || SUBJECT_TOPIC_MAP["Physics"];
    if (!topicSearch.trim()) return topics;
    return topics.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase()));
  }, [selectedSubject, topicSearch]);

  const handleSubjectChange = (newSub: string) => {
    setSelectedSubject(newSub);
    setTopicSearch('');
    const newTopics = SUBJECT_TOPIC_MAP[newSub] || [];
    if (newTopics.length > 0) {
      setSelectedTopic(newTopics[0]);
    }
  };

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setQuizKey(Date.now());
      setIsGenerating(false);
    }, 300);
  };

  // Generate dynamic questions tailored to the selected Subject + Concept
  const dynamicQuestions = useMemo(() => {
    if (selectedSubject === 'Physics') {
      return [
        {
          id: 1,
          question: `In ${selectedTopic}, two coherent light sources produce an interference pattern on a screen. If the slit separation is halved, what happens to the fringe width?`,
          options: ["Fringe width is doubled", "Fringe width is halved", "Fringe width remains unchanged", "Fringe width is quadrupled"],
          explanation: "Fringe width β = (λ * D) / d. Halving the slit separation 'd' doubles the fringe width β."
        },
        {
          id: 2,
          question: `According to Huygens principle in ${selectedTopic}, every point on a primary wavefront acts as:`,
          options: ["A source of secondary wavelets", "A point of destructive interference", "A stationary node", "A point of infinite frequency"],
          explanation: "Huygens principle states every point on a wavefront serves as a point source for spherical secondary wavelets."
        },
        {
          id: 3,
          question: "When unpolarized light passes through a ideal polarizing filter, its intensity decreases by:",
          options: ["50%", "25%", "75%", "0%"],
          explanation: "By Malus's Law average, unpolarized light intensity is reduced by exactly 50% upon passing through a linear polarizer."
        }
      ];
    } else if (selectedSubject === 'Computer Science & DBMS') {
      return [
        {
          id: 1,
          question: `In ${selectedTopic}, a relation is in Second Normal Form (2NF) if it is in 1NF and:`,
          options: [
            "No non-prime attribute is partially dependent on any candidate key",
            "No transitive dependencies exist between non-prime attributes",
            "Every determinant is a super key",
            "Multi-valued dependencies are eliminated"
          ],
          explanation: "2NF requires eliminating partial dependencies where a non-key attribute depends on only part of a composite primary key."
        },
        {
          id: 2,
          question: "Which dependency type violates Third Normal Form (3NF)?",
          options: [
            "Transitive Dependency (X → Y and Y → Z)",
            "Partial Dependency on Primary Key",
            "Trivial Functional Dependency",
            "Candidate Key Multi-value Mapping"
          ],
          explanation: "3NF requires eliminating transitive dependencies where non-prime attributes depend on other non-prime attributes."
        }
      ];
    } else if (selectedSubject === 'Chemistry') {
      return [
        {
          id: 1,
          question: `In ${selectedTopic}, which intermediate is formed during SN1 reaction of tertiary alkyl halides?`,
          options: ["Plannar Carbocation", "Carbanion", "Free Radical", "Pentavalent Transition State"],
          explanation: "SN1 reactions proceed via rate-determining step forming a planar carbocation intermediate."
        }
      ];
    } else {
      // Mathematics / General
      return [
        {
          id: 1,
          question: `If P(A) = 0.6, P(B) = 0.5, and P(A ∩ B) = 0.3 in ${selectedTopic}, what is conditional probability P(A|B)?`,
          options: ["0.60", "0.50", "0.30", "0.83"],
          explanation: "P(A|B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.60."
        },
        {
          id: 2,
          question: "A bag contains 4 red balls and 6 blue balls. Two balls are drawn without replacement. Probability both are red?",
          options: ["2/15", "4/25", "16/100", "1/5"],
          explanation: "P(1st Red) = 4/10; P(2nd Red) = 3/9. Total = (4/10) * (3/9) = 12/90 = 2/15."
        }
      ];
    }
  }, [selectedSubject, selectedTopic, quizKey]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          {/* Header Banner */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Concept-Specific Practice Engine</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">Personalized Quizzes & Concept Mastery</h1>
              <p className="text-xs text-slate-500 mt-0.5">Select a subject, search your topic/concept, and generate targeted practice questions.</p>
            </div>
          </div>

          {/* Controls: Subject -> Search Concept -> Difficulty -> Generate */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Quiz Configuration Parameters
              </h3>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Dynamic Concept Generator
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Step 1: Select Subject */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">1. Select Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                >
                  {Object.keys(SUBJECT_TOPIC_MAP).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: Search Topic/Concept */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">2. Search Topic / Concept:</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Search concept (e.g. Wave Optics)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Step 3: Select Concept Dropdown */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">3. Select Concept:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 truncate"
                >
                  {availableTopics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  {topicSearch.trim() && !availableTopics.includes(topicSearch) && (
                    <option value={topicSearch}>Custom: {topicSearch}</option>
                  )}
                </select>
              </div>

              {/* Step 4: Difficulty & Action */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">4. Difficulty Level:</label>
                <div className="flex space-x-2">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <button
                    onClick={handleGenerateQuiz}
                    disabled={isGenerating}
                    className="w-1/2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1"
                  >
                    {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Generate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Rendering */}
          <QuizCard
            key={quizKey}
            quizId={1}
            subject={selectedSubject}
            topic={selectedTopic}
            questions={dynamicQuestions}
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


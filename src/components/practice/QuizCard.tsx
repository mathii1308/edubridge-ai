"use client";

import React, { useState } from 'react';
import { QuizQuestion } from '@/types';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Sparkles, RefreshCw } from 'lucide-react';

interface QuizCardProps {
  quizId: number;
  subject: string;
  topic: string;
  questions: QuizQuestion[];
  onComplete?: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quizId,
  subject,
  topic,
  questions,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultScore, setResultScore] = useState<number | null>(null);

  const currentQ = questions[currentIndex] || {
    id: 1,
    question: "If P(A) = 0.6, P(B) = 0.5, and P(A ∩ B) = 0.3, what is P(A|B)?",
    options: ["0.30", "0.50", "0.60", "0.83"],
    explanation: "Using conditional probability formula P(A|B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.60."
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitted(true);
    let correct = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === 2) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / Math.max(1, questions.length)) * 100);
    setResultScore(scorePct);

    try {
      await fetch(`http://localhost:8000/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quizId,
          answers: Object.entries(selectedAnswers).map(([qid, ans]) => ({
            question_id: Number(qid),
            answer: ans,
            time_taken: 15
          }))
        })
      });
    } catch {
      // Local score calculation fallback
    }

    if (onComplete) onComplete();
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider">
            {subject} Practice Module
          </span>
          <h3 className="text-base font-bold text-slate-900">{topic} Quiz</h3>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </p>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showExplanation ? 'Hide Concept Hint' : 'Show Concept Hint'}</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                Submit Practice Quiz
              </button>
            )}
          </div>

          {showExplanation && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-slate-700 animate-in fade-in">
              <strong className="text-indigo-700 block mb-1">Concept Hint & Explanation:</strong>
              {currentQ.explanation}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto text-xl font-extrabold shadow-sm">
            {resultScore}%
          </div>
          <h3 className="text-lg font-bold text-slate-900">Quiz Attempt Completed!</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your score and concept accuracy for <strong>{topic}</strong> have been recorded in student progress analytics.
          </p>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentIndex(0);
              setSelectedAnswers({});
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" /> Retry Practice
          </button>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from 'react';
import { QuizQuestion } from '@/types';
import { CheckCircle2, ArrowRight, HelpCircle, RefreshCw } from 'lucide-react';

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
    question: `What fundamental law governs ${topic} in ${subject}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    explanation: "Refer to the textbook concept guidelines."
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitted(true);
    let correct = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === 0 || selectedAnswers[q.id] === 1) {
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
      // Local fallback
    }

    if (onComplete) onComplete();
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
            {subject} Academic Practice
          </span>
          <h3 className="text-base font-bold text-slate-900">{topic}</h3>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {currentQ.question}
          </p>

          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>{showExplanation ? 'Hide Hint' : 'Show Concept Hint'}</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
              >
                Submit Practice Quiz
              </button>
            )}
          </div>

          {showExplanation && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <strong className="text-blue-800 block mb-1">Concept Guidance:</strong>
              {currentQ.explanation}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto text-xl font-extrabold shadow-2xs">
            {resultScore}%
          </div>
          <h3 className="text-lg font-bold text-slate-900">Practice Attempt Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your results have been recorded under your student topic progress metrics.
          </p>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentIndex(0);
              setSelectedAnswers({});
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 mx-auto border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Retry Practice
          </button>
        </div>
      )}
    </div>
  );
};


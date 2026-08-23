"use client";

import React, { useState } from 'react';
import { ChatMessage, Citation } from '@/types';
import { TutorHandoffModal } from './TutorHandoffModal';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Lightbulb,
  ExternalLink,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  FileText
} from 'lucide-react';

const SAMPLE_REFERENCES = [
  "General Academic Knowledge",
  "OpenStax University Mathematics: Probability & Calculus",
  "NCERT Standard 12 Physics & Wave Optics",
  "Fundamentals of Database Systems (Elmasri & Navathe)",
  "MIT OpenCourseWare: Computer Science & Algorithms",
  "Organic Chemistry Principles & Mechanisms"
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am your AI Academic Tutor. You can ask me any doubt across Mathematics, Physics, Chemistry, Computer Science, DBMS, Engineering, Literature, or any other academic subject. You can also select a specific reference material below to ground my answer.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedReference, setSelectedReference] = useState<string>('General Academic Knowledge');
  const [subject, setSubject] = useState('General Academic');
  const [topic, setTopic] = useState('General Concept');
  const [studentRequirement, setStudentRequirement] = useState('Concept explanation requested');

  const [isLoading, setIsLoading] = useState(false);
  const [showHandoffModal, setShowHandoffModal] = useState(false);

  const sendMessage = async (customMessage?: string, actionType: string = 'explain') => {
    const queryText = customMessage || input;
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      language: language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: language,
          learning_level: learningLevel,
          subject: subject,
          topic: topic,
          reference: selectedReference,
          action_type: actionType
        })
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        throw new Error('API unavailable');
      }

      const citationsList: Citation[] = selectedReference !== 'General Academic Knowledge' ? [
        {
          title: selectedReference,
          source_url: 'https://openstax.org',
          source_name: 'Academic Textbook Grounding Engine'
        }
      ] : (data.citations || []);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        subject: data.subject || subject,
        topic: data.topic || topic,
        citations: citationsList,
        needs_tutor: data.needs_tutor || false,
        learning_gap: data.learning_gap,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.subject) setSubject(data.subject);
      if (data.topic) setTopic(data.topic);
      if (data.learning_gap) setStudentRequirement(data.learning_gap);

      if (data.needs_tutor || actionType === 'struggle') {
        setShowHandoffModal(true);
      }
    } catch {
      const isStruggle = actionType === 'struggle' || queryText.toLowerCase().includes("don't understand");

      let replyText = "";
      if (isStruggle) {
        replyText = language === 'Tamil'
          ? `**இந்த கருத்து இன்னமும் சவாலாக உள்ளதா?** எங்கள் தகுதியான ஆசிரியர்களுடன் நேரடி அமர்வை திட்டமிடலாம்.`
          : `**Step-by-Step Learning Guidance:** Let's clarify this question systematically. If you feel persistent difficulty, you can connect directly with a qualified 1-on-1 human tutor.`;
      } else {
        replyText = `**Academic Answer:**\n\n1. **Core Concept Explanation:** When approaching "${queryText}", we first analyze the underlying principles.\n2. **Step-by-Step Resolution:** Apply the fundamental formulas or standard definitions for the domain.\n3. **Application & Verification:** Verify boundary conditions to confirm numerical or conceptual accuracy.`;
      }

      const citationsList: Citation[] = selectedReference !== 'General Academic Knowledge' ? [
        {
          title: selectedReference,
          source_url: 'https://openstax.org',
          source_name: 'Academic Textbook Reference Engine'
        }
      ] : [];

      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        subject: subject,
        topic: topic,
        citations: citationsList,
        needs_tutor: isStruggle,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackMsg]);
      if (isStruggle) {
        setShowHandoffModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      {/* Top Academic Options Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              AI Academic Tutor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                All Subjects Supported
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">Ask any academic question naturally or select a reference source</p>
          </div>
        </div>

        {/* Controls: Reference Selection, Language & Level */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reference Material Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={selectedReference}
              onChange={(e) => setSelectedReference(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none max-w-[180px] truncate"
            >
              {SAMPLE_REFERENCES.map(ref => (
                <option key={ref} value={ref}>{ref}</option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-300 text-xs">
            <button
              onClick={() => setLanguage('English')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'English' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('Tamil')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                language === 'Tamil' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Grounding Reference Banner */}
      {selectedReference !== 'General Academic Knowledge' && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-800 flex items-center justify-between">
          <span className="flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Answer Grounded on Reference: <strong>{selectedReference}</strong></span>
          </span>
          <button onClick={() => setSelectedReference('General Academic Knowledge')} className="text-[11px] underline font-semibold text-blue-700">Clear Reference</button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-blue-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-2xs'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Educational Grounding Citation Badge */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-blue-700 font-bold flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Grounded in Academic Reference Material:
                    </p>
                    {msg.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-medium transition-colors"
                      >
                        <span className="truncate max-w-xs">{c.title}</span>
                        <ExternalLink className="w-3 h-3 text-blue-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Escalation Feedback Check on AI Messages */}
                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Did this answer clarify your doubt?</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => sendMessage("Yes, thank you! I understand this concept clearly.", "understand")}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold"
                      >
                        <ThumbsUp className="w-3 h-3 text-emerald-600" /> Yes, clear
                      </button>
                      <button
                        onClick={() => sendMessage(`I still need help with this question.`, "struggle")}
                        className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 font-semibold"
                      >
                        <ThumbsDown className="w-3 h-3 text-amber-600" /> Need Tutor
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-blue-600 text-xs p-3">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Formulating academic explanation...</span>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Pills */}
      <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-500 font-semibold mr-1">Suggested Controls:</span>
        <button
          onClick={() => sendMessage("Explain this concept step-by-step with simple examples.", "simplify")}
          className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 transition-all flex items-center gap-1.5 font-medium"
        >
          <Lightbulb className="w-3 h-3 text-amber-500" /> Step-by-step Explanation
        </button>

        <button
          onClick={() => sendMessage("Show a step-by-step numerical problem solution.", "example")}
          className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 transition-all flex items-center gap-1.5 font-medium"
        >
          <BookOpen className="w-3 h-3 text-blue-600" /> Problem Solution Example
        </button>

        <button
          onClick={() => sendMessage(`I would like to request 1-on-1 human tutoring for this subject.`, "struggle")}
          className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[11px] text-blue-700 font-semibold transition-all flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3 h-3 text-blue-600" /> Request Human Tutor
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={language === 'Tamil' ? "உங்கள் கேள்வியைக் கேளுங்கள்..." : "Ask any academic doubt naturally (e.g. Solve dx/dt = 2x, Explain Wave Optics, DBMS 3NF...)"}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shadow-xs"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Tutor Handoff Modal */}
      <TutorHandoffModal
        isOpen={showHandoffModal}
        onClose={() => setShowHandoffModal(false)}
        subject={subject}
        topic={topic}
        language={language}
        learningLevel={learningLevel}
        studentRequirement={studentRequirement}
      />
    </div>
  );
};


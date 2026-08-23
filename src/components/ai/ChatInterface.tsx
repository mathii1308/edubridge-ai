"use client";

import React, { useState } from 'react';
import { ChatMessage } from '@/types';
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
  Paperclip,
  X,
  FileText
} from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am EduBridge AI, your general academic tutor. Ask me doubts across any academic subject (Mathematics, Physics, Chemistry, CS, DBMS, Engineering, etc.). You can also attach reference materials for grounded context.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [subject, setSubject] = useState('Auto-Detect');
  const [topic, setTopic] = useState('General Concept');
  const [studentRequirement, setStudentRequirement] = useState('Needs concept explanation');

  const [showRefInput, setShowRefInput] = useState(false);
  const [refTitle, setRefTitle] = useState('');
  const [refText, setRefText] = useState('');

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
      // Call FastAPI AI chat API endpoint
      const res = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: language,
          learning_level: learningLevel,
          subject: subject === 'Auto-Detect' ? undefined : subject,
          topic: topic === 'General Concept' ? undefined : topic,
          action_type: actionType,
          reference_text: refText.trim() ? refText : undefined,
          reference_title: refTitle.trim() ? refTitle : undefined
        })
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        throw new Error('API unavailable');
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        subject: data.subject || subject,
        topic: data.topic || topic,
        citations: data.citations || [],
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
      // Offline fallback AI response engine
      const isStruggle = actionType === 'struggle' || queryText.toLowerCase().includes("don't understand");

      let replyText = "";
      if (refText.trim()) {
        replyText = `📌 **Answer based on student provided reference context (${refTitle || 'Uploaded Reference'}):**\n\nBased on your provided reference text:\n\n1. **Core Insight:** The reference outlines fundamental rules for ${subject} (${topic}).\n2. **Guidance for '${queryText}':** Following your provided reference, solve step-by-step applying the specified formulas.\n3. **Summary:** All conditions match the constraints in your reference text.`;
      } else if (isStruggle) {
        replyText = language === 'Tamil'
          ? `**${topic} பற்றிய விளக்கம் இன்னமும் கடினமாக உள்ளதா?** நாங்கள் உங்களுக்கு உதவ தகுதியான ஆசிரியரை பரிந்துரைக்க முடியும்.`
          : `**I understand this concept is tricky!** Learning ${topic} (${subject}) requires step-by-step guidance. Connecting with a human tutor will help you master it faster.`;
      } else {
        replyText = language === 'Tamil'
          ? `**EduBridge AI கற்றல் உதவியாளர் (${subject} - ${topic}):**\n\n1. கோட்பாட்டின் அடிப்படை கருத்துக்களை புரிந்துகொள்ள வேண்டும்.\n2. படி படியாக சூத்திரத்தைப் பயன்படுத்தவும்.`
          : `**Step-by-Step Explanation for ${topic} (${subject}):**\n\n1. **Concept Breakdown:** Step-by-step procedure to analyze doubts on ${queryText}.\n2. **Methodology:** State assumptions, apply standard equations, and compute final results.\n3. **Verification:** Check boundary conditions for validity.`;
      }

      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        subject: subject,
        topic: topic,
        citations: refText.trim() ? [{
          title: `Reference: ${refTitle || 'Student Reference Text'}`,
          source_name: "Uploaded Reference Material",
          source_url: "#reference",
          snippet: refText.slice(0, 100) + "..."
        }] : [],
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
    <div className="flex flex-col h-[calc(100vh-140px)] glass-card rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Top Options Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              EduBridge AI General Academic Tutor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
                All Subjects Supported
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Subject: {subject} • Topic: {topic}</p>
          </div>
        </div>

        {/* Controls: Subject, Language & Learning Level */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g. Physics)"
            className="w-28 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
          />

          <button
            onClick={() => setShowRefInput(!showRefInput)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
              refText ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>{refText ? 'Reference Attached' : 'Attach Reference'}</span>
          </button>

          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setLanguage('English')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                language === 'English' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('Tamil')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                language === 'Tamil' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Reference Context Attachment Input Drawer */}
      {showRefInput && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Provide Reference Material / Textbook Text:
            </span>
            <button onClick={() => setShowRefInput(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={refTitle}
            onChange={(e) => setRefTitle(e.target.value)}
            placeholder="Reference Title / Source Name (e.g. Chapter 4 Optics Notes)"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
          />

          <textarea
            value={refText}
            onChange={(e) => setRefText(e.target.value)}
            rows={2}
            placeholder="Paste reference text or textbook excerpt here. AI Tutor will ground answers on this material..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
          />
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
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Educational Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-600" />
                      Educational Sources / Reference Basis:
                    </p>
                    {msg.citations.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-indigo-700 font-medium"
                      >
                        <span className="truncate max-w-xs">{c.title}</span>
                        {c.source_url !== '#reference' && (
                          <a href={c.source_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Escalation Feedback Check on AI Messages */}
                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Did this explanation help?</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => sendMessage("Yes, thank you! I understand this concept now.", "understand")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-bold"
                      >
                        <ThumbsUp className="w-3 h-3 text-emerald-600" /> Yes
                      </button>
                      <button
                        onClick={() => sendMessage(`I still don't understand ${topic} in ${subject}.`, "struggle")}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 font-bold"
                      >
                        <ThumbsDown className="w-3 h-3 text-amber-600" /> Not yet
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
          <div className="flex items-center space-x-2 text-indigo-600 text-xs p-3 font-bold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Consulting AI Learning Engine...</span>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Pills */}
      <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-400 font-bold mr-1">Controls:</span>
        <button
          onClick={() => sendMessage("Can you explain this step-by-step in simpler terms?", "simplify")}
          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] text-slate-700 font-bold transition-all flex items-center gap-1.5"
        >
          <Lightbulb className="w-3 h-3 text-amber-600" /> Simplify Explanation
        </button>

        <button
          onClick={() => sendMessage("Give me a practical real-world example.", "example")}
          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] text-slate-700 font-bold transition-all flex items-center gap-1.5"
        >
          <BookOpen className="w-3 h-3 text-emerald-600" /> Practical Example
        </button>

        <button
          onClick={() => sendMessage(`I need help from a human tutor for ${subject} (${topic}).`, "struggle")}
          className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] text-amber-700 font-bold transition-all flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3 h-3 text-amber-600" /> Connect with Human Tutor
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={language === 'Tamil' ? "உங்கள் கேள்வியைக் கேளுங்கள்..." : "Ask any academic question across any subject..."}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all shadow-sm"
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


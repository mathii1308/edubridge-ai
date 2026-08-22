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
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  Languages,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am EduBridge AI, your personalized academic tutor. Select your subject or topic, and ask me anything. If a concept feels difficult, click 'I still don't understand' anytime to try simpler steps or connect directly with a verified human tutor.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('Probability');

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
      // Call FastAPI AI chat API endpoint with RAG context lookup
      const res = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: language,
          learning_level: learningLevel,
          subject: subject,
          topic: topic,
          action_type: actionType
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

      if (data.needs_tutor || actionType === 'struggle') {
        setShowHandoffModal(true);
      }
    } catch {
      // Fallback grounded AI response for local demo environments
      const isStruggle = actionType === 'struggle' || queryText.toLowerCase().includes("don't understand");
      
      let replyText = "";
      if (isStruggle) {
        replyText = language === 'Tamil'
          ? `**மன்னிக்கவும், ${topic} தலைப்பு உங்களுக்கு சவாலாக உள்ளது.** நாங்கள் மீண்டும் எளிய முறையில் விளக்க முயன்றோம். நேரலை ஆசிரியரை அணுக தயாரா?`
          : `**I understand this concept is tricky!** Learning ${topic} takes step-by-step guidance. Connecting with a human tutor will help you master it faster.`;
      } else {
        replyText = language === 'Tamil'
          ? `**EduBridge AI கற்றல் வழிகாட்டி (${subject} - ${topic}):**\n\nசார்பு நிகழ்தகவு சூத்திரம்: P(A|B) = P(A ∩ B) / P(B).\n\n1. முதல் நிகழ்ச்சி நடந்த பிறகுதான் இரண்டாம் நிகழ்ச்சி நடக்கும்.\n2. மூல நூல்: தமிழ்நாடு கல்வி பாடநூல் 12.`
          : `**Step-by-Step Explanation for ${topic} (${subject}):**\n\nConditional probability measures the chance of event A given event B has occurred.\n\n• **Formula:** P(A|B) = P(A ∩ B) / P(B)\n• **Key Rule:** P(B) must be > 0.`;
      }

      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        subject: subject,
        topic: topic,
        citations: [
          {
            title: "OpenStax University Mathematics: Probability",
            source_name: "OpenStax Educational Initiative",
            source_url: "https://openstax.org/details/books/introductory-statistics",
            snippet: "P(A|B) = P(A ∩ B) / P(B). Conditional probability evaluates outcome likelihood under prior constraints."
          }
        ],
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
    <div className="flex flex-col h-[calc(100vh-140px)] glass-card rounded-3xl overflow-hidden border border-slate-800">
      {/* Top Options Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              EduBridge AI Tutor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                RAG Grounded
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Subject: {subject} • Topic: {topic}</p>
          </div>
        </div>

        {/* Controls: Language & Learning Level */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setLanguage('English')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                language === 'English' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('Tamil')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                language === 'Tamil' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>

          {/* Level Selector */}
          <select
            value={learningLevel}
            onChange={(e) => setLearningLevel(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="Beginner">Beginner Level</option>
            <option value="Intermediate">Intermediate Level</option>
            <option value="Advanced">Advanced Level</option>
          </select>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white'
                  : 'bg-slate-800 border border-indigo-500/40 text-indigo-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounded RAG Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" />
                      Grounded Educational Citations:
                    </p>
                    {msg.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-[11px] text-indigo-300 transition-colors group"
                      >
                        <span className="font-medium truncate max-w-xs">Source: {c.title} ({c.source_name})</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-indigo-400 text-xs p-3">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Consulting Educational Knowledge Base...</span>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Pills */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Actions:</span>
        <button
          onClick={() => sendMessage("Can you explain this step-by-step in simpler terms?", "simplify")}
          className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-all flex items-center gap-1.5"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" /> Simplify Explanation
        </button>

        <button
          onClick={() => sendMessage("Give me a practical real-world example.", "example")}
          className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-all flex items-center gap-1.5"
        >
          <BookOpen className="w-3 h-3 text-emerald-400" /> Real-World Example
        </button>

        {/* CORE FEATURE: "I still don't understand" trigger */}
        <button
          onClick={() => sendMessage("I still don't understand quadratic probability.", "struggle")}
          className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] text-amber-300 font-semibold transition-all flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400 animate-bounce" /> I still don't understand
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={language === 'Tamil' ? "உங்கள் கேள்வியைக் கேளுங்கள்..." : "Ask any academic doubt (e.g. Explain conditional probability)..."}
          className="flex-1 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25"
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
      />
    </div>
  );
};

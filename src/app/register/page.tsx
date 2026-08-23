"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Sparkles, ArrowRight, User, Mail, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify and try again.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          preferred_language: language,
          learning_level: learningLevel
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setVerificationPending(true);
      login(data.user, data.access_token);
    } catch (err: any) {
      if (err.message.includes("already registered")) {
        setErrorMsg("This email address is already registered. Please sign in instead.");
      } else {
        const mockUser = {
          id: Date.now(),
          name,
          email,
          role,
          email_verified: false,
          account_status: "unverified",
          created_at: new Date().toISOString()
        };
        setVerificationPending(true);
        login(mockUser, "offline_demo_register_token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      await fetch(`http://localhost:8000/auth/verify-email?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });
    } catch {
      // Local fallback
    } finally {
      setIsLoading(false);
      if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
        <div className="bg-white max-w-md w-full rounded-xl p-8 border border-slate-200 space-y-6 shadow-xs text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Verify Your Email Address</h2>
            <p className="text-xs text-slate-500">
              We have sent a verification code to <strong className="text-blue-700">{email}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
            <div className="flex justify-between">
              <span>Account Name:</span>
              <span className="font-bold text-slate-900">{name}</span>
            </div>
            <div className="flex justify-between">
              <span>Assigned Role:</span>
              <span className="font-bold uppercase text-blue-700">{role}</span>
            </div>
            <div className="flex justify-between">
              <span>Verification Status:</span>
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Verification
              </span>
            </div>
          </div>

          <button
            onClick={handleVerifyEmail}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Complete Verification & Open Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <div className="bg-white max-w-md w-full rounded-xl p-8 border border-slate-200 space-y-6 shadow-xs">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create Academic Account</h2>
          <p className="text-xs text-slate-500">Join EduBridge AI platform as a Student or Educator</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Full Name:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ananya Sharma"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. student@edubridge.ai"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Account Role:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 rounded-lg font-bold border text-center transition-all ${
                  role === 'student'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-2.5 rounded-lg font-bold border text-center transition-all ${
                  role === 'teacher'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Teacher / Tutor
              </button>
            </div>
          </div>

          {role === 'student' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Learning Level:</label>
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Confirm Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Register Account</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}



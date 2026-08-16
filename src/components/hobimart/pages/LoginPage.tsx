'use client';

import { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const { navigate, login } = useAppStore();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ login: loginId, password });
      navigate('home');
    } catch (err: any) {
      setError(err?.error?.message || err?.message || 'Login gagal');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#1F2937]">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your HobiMart account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                placeholder="email@example.com or 08xxx"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-xl hover:bg-[#E55A2B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('register')} className="text-[#FF6B35] font-semibold hover:underline">
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
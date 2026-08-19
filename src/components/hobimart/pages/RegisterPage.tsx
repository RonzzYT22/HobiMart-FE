'use client';

import { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function RegisterPage() {
  const { navigate, register } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPw) {
      setError('Password tidak cocok');
      return;
    }
    if (!email && !phone) {
      setError('Email atau nomor telepon harus diisi');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email: email || undefined, phone: phone || undefined, password, password_confirmation: confirmPw });
      navigate('home');
    } catch (err: any) {
      setError(err?.error?.message || err?.message || 'Register gagal');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hobbyco-cream flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-hobbyco-purple/5 rounded-full -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-hobbyco-orange/5 rounded-full translate-y-1/2 translate-x-1/3"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-hobbyco-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand animate-float">
            <Shield className="w-9 h-9 text-white" fill="#FFF" />
          </div>
          <h1 className="text-3xl font-black text-hobbyco-dark font-display">Create Account</h1>
          <p className="text-gray-500 mt-2 font-medium">Join the HOBBYCO community</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4 shadow-lg shadow-hobbyco-green/5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-hobbyco-dark mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-hobbyco-orange focus:ring-2 focus:ring-hobbyco-orange/20 transition-all bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-hobbyco-dark mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-hobbyco-orange focus:ring-2 focus:ring-hobbyco-orange/20 transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-hobbyco-dark mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-hobbyco-orange focus:ring-2 focus:ring-hobbyco-orange/20 transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-hobbyco-dark mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-hobbyco-orange focus:ring-2 focus:ring-hobbyco-orange/20 transition-all bg-white"
                required
                minLength={8}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-hobbyco-dark mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-hobbyco-orange focus:ring-2 focus:ring-hobbyco-orange/20 transition-all bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hobbyco-orange text-white font-bold py-3.5 rounded-xl hover:bg-hobbyco-orange-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-hover-lift shadow-orange-glow"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('login')} className="text-hobbyco-orange font-bold hover:underline">
              Sign In →
            </button>
          </p>
        </form>
        
        {/* Brand Tagline */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">COLLECT • ENJOY • CONNECT</p>
      </div>
    </div>
  );
}

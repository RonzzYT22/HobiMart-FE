'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, LogOut, Edit3, Check, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ProfilePage() {
  const { auth, navigate, logout, fetchMe } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(auth.user?.name || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  const [phone, setPhone] = useState(auth.user?.phone || '');

  useEffect(() => { fetchMe(); }, [fetchMe]);

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1F2937] mb-2">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to login to view your profile</p>
          <button onClick={() => navigate('login')} className="bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#E55A2B] transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const user = auth.user;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">{user?.name}</h1>
          <p className="text-gray-400 text-sm mt-1">My Profile</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1F2937]">Account Info</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm text-[#FF6B35] font-semibold flex items-center gap-1 hover:underline"
            >
              {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit</>}
            </button>
          </div>

          {/* Name */}
          <div className="flex items-center gap-3 py-2">
            <User className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Name</p>
              {editing ? (
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-sm font-semibold text-[#1F2937] border-b border-[#E5E7EB] focus:outline-none focus:border-[#FF6B35] py-1"
                />
              ) : (
                <p className="text-sm font-semibold text-[#1F2937]">{user?.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 py-2">
            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Email</p>
              {editing ? (
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-sm font-semibold text-[#1F2937] border-b border-[#E5E7EB] focus:outline-none focus:border-[#FF6B35] py-1"
                />
              ) : (
                <p className="text-sm font-semibold text-[#1F2937]">{user?.email || '-'}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 py-2">
            <Phone className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Phone</p>
              {editing ? (
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-sm font-semibold text-[#1F2937] border-b border-[#E5E7EB] focus:outline-none focus:border-[#FF6B35] py-1"
                />
              ) : (
                <p className="text-sm font-semibold text-[#1F2937]">{user?.phone || '-'}</p>
              )}
            </div>
          </div>

          {editing && (
            <button className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-xl hover:bg-[#E55A2B] transition-colors flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Save Changes
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={async () => { await logout(); navigate('home'); }}
          className="w-full mt-4 bg-white border border-red-200 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
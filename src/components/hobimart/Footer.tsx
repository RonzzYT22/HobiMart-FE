'use client';

import { Shield, Heart, ArrowRight, Mail } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer className="bg-hobbyco-green text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-hobbyco-green" fill="#0F3D34" />
              </div>
              <span className="text-lg font-black font-display tracking-tight">
                HOBBY<span className="text-hobbyco-orange">CO</span>
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              COLLECT • ENJOY • CONNECT
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Your ultimate destination for hobby collectibles. Trade cards, figures, and more with fellow collectors.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3">Stay Updated</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-hobbyco-orange"
                />
                <button className="px-3 py-2 bg-hobbyco-orange rounded-lg hover:bg-hobbyco-orange-dark transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-hobbyco-orange rounded-full"></span>
              Shop
            </h4>
            <ul className="space-y-2.5">
              {['Trading Cards', 'Gundam & Gunpla', 'Figures', 'Collectibles', 'Accessories', 'Deals'].map(item => (
                <li key={item}>
                  <button onClick={() => item === 'Deals' ? navigate('deals') : navigate('shop', { category: item })} className="text-sm text-white/60 hover:text-hobbyco-orange transition-colors flex items-center gap-1 group">
                    {item}
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-hobbyco-orange rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'How It Works', 'Careers', 'Blog', 'Press'].map(item => (
                <li key={item}><span className="text-sm text-white/60 hover:text-hobbyco-orange transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-hobbyco-orange rounded-full"></span>
              Support
            </h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Buyer Protection', 'Seller Guide', 'Return Policy', 'Contact Us'].map(item => (
                <li key={item}><span className="text-sm text-white/60 hover:text-hobbyco-orange transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Shield className="w-4 h-4" />
              <span>© 2025 HOBBYCO. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Terms</span>
              <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-hobbyco-orange via-hobbyco-purple to-hobbyco-orange"></div>
    </footer>
  );
}

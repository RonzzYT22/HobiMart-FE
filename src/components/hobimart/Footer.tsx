'use client';

import { ShoppingBag } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer className="bg-[#1F2937] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Hobi<span className="text-[#FF6B35]">Mart</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Buy. Collect. Trade.<br />Your Hobby. Your Collection.</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['Trading Cards', 'Gundam & Gunpla', 'Figures', 'Collectibles', 'Accessories', 'Deals'].map(item => (
                <li key={item}>
                  <button onClick={() => item === 'Deals' ? navigate('deals') : navigate('shop', { category: item })} className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'How It Works', 'Careers', 'Blog', 'Press'].map(item => (
                <li key={item}><span className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Buyer Protection', 'Seller Guide', 'Return Policy', 'Contact Us'].map(item => (
                <li key={item}><span className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 Shop HobiMart. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">Terms</span>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">Privacy</span>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
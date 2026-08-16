'use client';

import { useState, useRef, useEffect } from 'react';
import {  Search, Heart, ShoppingBag, Bell, User, Menu, X, ChevronDown , Package, Tag, ArrowLeftRight, MessageCircle, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { products } from '@/lib/data';

const navLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Shop', page: 'shop' as const },
  { label: 'Deals', page: 'deals' as const },
  { label: 'Trade-In', page: 'trade-in' as const },
  { label: 'Community', page: 'community' as const },
];

const popularSearches = ['Charizard', 'Gundam MG', 'One Piece Card', 'Marvel Figure'];

export default function Navbar() {
  const { page, navigate, cart, wishlist, cartOpen, setCartOpen, setSearchQuery, searchQuery, setNotifOpen, notifOpen, notifications, unreadCount, fetchNotifications } = useAppStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const unreadNotifs = unreadCount;

    useEffect(() => {
      fetchNotifications();
      const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) { navigate('search', { q: q }); setSearchFocused(false); }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 bg-[#FF6B35] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1F2937] hidden sm:block">Hobi<span className="text-[#FF6B35]">Mart</span></span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === link.page ? 'text-[#FF6B35] bg-orange-50' : 'text-[#374151] hover:text-[#FF6B35] hover:bg-orange-50/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards, Gundam, figures & collectibles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all placeholder:text-gray-400"
              />
            </div>
            {searchFocused && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-4 animate-fade-in">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate('wishlist')}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => { setCartOpen(!cartOpen); setNotifOpen(false); }}
                className="relative p-2.5 rounded-xl text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">{totalItems}</span>
                )}
              </button>
            </div>

            <button
              onClick={() => { setNotifOpen(!notifOpen); setCartOpen(false); }}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadNotifs}</span>
              )}
            </button>

            <button
              onClick={() => navigate('notifications')}
              className="p-2.5 rounded-xl text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors hidden sm:block"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E7EB] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { navigate(link.page); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  page === link.page ? 'text-[#FF6B35] bg-orange-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button onClick={() => { navigate('notifications'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Notifications
            </button>
          </div>
        </div>
      )}

      {/* Cart Dropdown */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCartOpen(false)} />
          <div className="absolute right-4 sm:right-8 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl z-50 animate-fade-in">
            <div className="p-4 border-b border-[#E5E7EB]">
              <h3 className="font-semibold text-[#1F2937]">Your Cart ({totalItems})</h3>
            </div>
            <div className="max-h-64 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <ProductImage name={item.product.name} image={item.product.image} className="w-14 h-14 rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#FF6B35]">{(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[#E5E7EB]">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-semibold text-[#1F2937]">Rp{cart.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { navigate('cart'); setCartOpen(false); }} className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">View Cart</button>
                <button onClick={() => { navigate('checkout'); setCartOpen(false); }} className="flex-1 py-2.5 bg-[#FF6B35] text-white rounded-xl text-sm font-medium hover:bg-[#E55A2B] transition-colors">Checkout</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notification Dropdown */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="absolute right-4 sm:right-8 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl z-50 animate-fade-in">
            <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center">
              <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
              <button onClick={() => navigate('notifications')} className="text-xs text-[#FF6B35] font-medium hover:underline">View All</button>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-orange-50/30' : ''}`}>
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      n.type === 'order' ? 'bg-blue-100 text-blue-600' :
                      n.type === 'price' ? 'bg-green-100 text-green-600' :
                      n.type === 'wishlist' ? 'bg-pink-100 text-pink-600' :
                      n.type === 'trade' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-xs">{n.type === 'order' ? <Package className="w-3 h-3" /> : n.type === 'price' ? <Tag className="w-3 h-3" /> : n.type === 'wishlist' ? <Heart className="w-3 h-3" /> : n.type === 'trade' ? <ArrowLeftRight className="w-3 h-3" /> : n.type === 'message' ? <MessageCircle className="w-3 h-3" /> : <Users className="w-3 h-3" />}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1F2937]">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function ProductImage({ name, image, className = '' }: { name: string; image: string; className?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`bg-gray-100 ${className} overflow-hidden relative`}>
      {!err ? (
        <img src={image} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
      ) : (
        <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 opacity-30" /></div>
      )}
    </div>
  );
}

export { ProductImage };
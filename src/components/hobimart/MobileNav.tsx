'use client';

import { Home, Grid3X3, ArrowLeftRight, ShoppingBag, User } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const items = [
  { icon: Home, label: 'Home', page: 'home' as const },
  { icon: Grid3X3, label: 'Shop', page: 'shop' as const },
  { icon: ArrowLeftRight, label: 'Trade', page: 'trade-in' as const },
  { icon: ShoppingBag, label: 'Cart', page: 'cart' as const },
  { icon: User, label: 'You', page: 'collector-profile' as const },
];

export default function MobileNav() {
  const { page, navigate, cart } = useAppStore();
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-hobbyco-green/10 lg:hidden safe-area-bottom shadow-[0_-4px_20px_rgba(15,61,52,0.08)]">
      <div className="flex items-center justify-around h-16">
        {items.map(item => {
          const isActive = page === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative ${
                isActive ? 'text-hobbyco-orange' : 'text-gray-400'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-hobbyco-orange rounded-full" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.page === 'cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-hobbyco-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? '' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

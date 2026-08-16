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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map(item => {
          const isActive = page === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative ${
                isActive ? 'text-[#FF6B35]' : 'text-gray-400'
              }`}
            >
              {isActive && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#FF6B35] rounded-full" />}
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {item.page === 'cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#FF6B35] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
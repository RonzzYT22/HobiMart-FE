'use client';

import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product, formatPrice, getConditionColor, getBadgeColor } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

export default function ProductCard({ product, variant = 'standard', rank }: { product: Product; variant?: 'standard' | 'sale' | 'rare' | 'soldout' | 'trade'; rank?: number }) {
  const { navigate, addToCart, toggleWishlist, wishlist } = useAppStore();
  const [liked, setLiked] = useState(wishlist.includes(product.id));
  const [imgError, setImgError] = useState(false);
  const isSoldOut = product.stock === 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const fallbackColors: Record<string, string> = {
    'Trading Cards': 'from-orange-100 to-red-50',
    'Gundam & Gunpla': 'from-blue-100 to-indigo-50',
    'Figures': 'from-purple-100 to-pink-50',
    'Collectibles': 'from-amber-100 to-yellow-50',
    'Accessories': 'from-green-100 to-emerald-50',
  };

  return (
    <div
      onClick={() => navigate('product', { id: product.id })}
      className={`group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 ${variant === 'rare' ? 'ring-1 ring-amber-300' : ''} ${isSoldOut ? 'opacity-70' : ''}`}
    >
      <div className="relative aspect-square bg-[#FF6B35] ${fallbackColors[product.category] || 'from-gray-100 to-gray-50'} overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-10 h-10 opacity-30" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.discount && !isSoldOut && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">-{product.discount}%</span>
          )}
          {rank && (
            <span className="px-2 py-0.5 bg-[#1F2937] text-white text-[10px] font-bold rounded-md">#{rank}</span>
          )}
          {product.badges.filter(b => b !== 'VERIFIED').slice(0, 1).map(b => (
            <span key={b} className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${getBadgeColor(b)}`}>{b}</span>
          ))}
        </div>

        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-1.5 bg-gray-800 text-white text-sm font-bold rounded-lg">SOLD OUT</span>
          </div>
        )}

        {variant === 'trade' && !isSoldOut && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2 py-0.5 bg-teal-500 text-white text-[10px] font-bold rounded-md">TRADE AVAILABLE</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm font-semibold text-[#1F2937] mt-0.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">{product.name}</h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-[#1F2937]">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-400">{product.sold} sold</span>
        </div>

        <div className="mt-2">
          <p className="text-base font-bold text-[#1F2937]">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getConditionColor(product.condition)}`}>● {product.condition}</span>
          {product.verified && (
            <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Verified
            </span>
          )}
        </div>

        {!isSoldOut && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 py-2 bg-[#FF6B35] text-white text-xs font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

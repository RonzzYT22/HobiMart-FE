'use client';

import { Heart, ShoppingCart, Star, Package } from 'lucide-react';
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
    'Trading Cards': 'from-orange-200 to-red-100',
    'Gundam & Gunpla': 'from-blue-200 to-indigo-100',
    'Figures': 'from-purple-200 to-pink-100',
    'Collectibles': 'from-amber-200 to-yellow-100',
    'Accessories': 'from-green-200 to-emerald-100',
  };

  return (
    <div
      onClick={() => navigate('product', { id: product.id })}
      className={`group bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 card-hover ${
        variant === 'rare' ? 'border-hobbyco-purple/40 ring-1 ring-hobbyco-purple/20' : 
        variant === 'trade' ? 'border-teal-300/50 ring-1 ring-teal-200/30' :
        'border-gray-100'
      } ${isSoldOut ? 'opacity-70' : ''}`}
    >
      <div className="relative aspect-square bg-gradient-to-br ${fallbackColors[product.category] || 'from-gray-100 to-gray-50'} overflow-hidden">
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
            <Package className="w-10 h-10 opacity-30 text-hobbyco-green" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.discount && !isSoldOut && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md badge-comic">-{product.discount}%</span>
          )}
          {rank && (
            <span className="px-2 py-0.5 bg-hobbyco-dark text-white text-[10px] font-bold rounded-md">#{rank}</span>
          )}
          {product.badges.filter(b => b !== 'VERIFIED').slice(0, 1).map(b => (
            <span key={b} className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${getBadgeColor(b)}`}>{b}</span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all border border-gray-100"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
        </button>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-hobbyco-dark/60 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-1.5 bg-hobbyco-dark text-white text-sm font-bold rounded-lg shadow-lg">SOLD OUT</span>
          </div>
        )}

        {/* Trade Badge */}
        {variant === 'trade' && !isSoldOut && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2 py-0.5 bg-teal-500 text-white text-[10px] font-bold rounded-md animate-pulse">TRADE AVAILABLE</span>
          </div>
        )}
        
        {/* Sale Badge */}
        {variant === 'sale' && !isSoldOut && (
          <div className="absolute top-2.5 right-12">
            <span className="px-2 py-0.5 bg-hobbyco-orange text-white text-[10px] font-bold rounded-md animate-bounce-subtle">SALE</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5">
        <p className="text-[11px] text-hobbyco-green/60 font-bold uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm font-bold text-hobbyco-dark mt-0.5 line-clamp-1 group-hover:text-hobbyco-orange transition-colors">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-hobbyco-dark">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-400">{product.sold} sold</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          <p className="text-base font-black text-hobbyco-dark">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
          )}
        </div>

        {/* Condition & Verified */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getConditionColor(product.condition)}`}>● {product.condition}</span>
          {product.verified && (
            <span className="flex items-center gap-0.5 text-[10px] text-blue-600 font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Verified
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {!isSoldOut && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 py-2.5 bg-hobbyco-orange text-white text-xs font-bold rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all btn-hover-lift flex items-center justify-center gap-1.5 shadow-md shadow-hobbyco-orange/20"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

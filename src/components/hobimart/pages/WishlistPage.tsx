'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  ChevronRight,
  TrendingDown,
  SlidersHorizontal,
  X,
  Grid3X3,
  LayoutGrid,
  ShoppingBag,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice, getConditionColor } from '@/lib/data';
import ProductCard from '../ProductCard';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

/* Product IDs that had a recent price drop of 15% */
const PRICE_DROP_IDS = ['p1', 'p11'];

const sortOptions = [
  { value: 'newest', label: 'Newest Added' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'name', label: 'Name: A-Z' },
];

export default function WishlistPage() {
  const { wishlist, navigate, toggleWishlist, wishlistItems, fetchWishlist } = useAppStore();
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const wishlistProducts = useMemo(() => {
    const items = wishlistItems.length > 0 ? wishlistItems : [];
    switch (sortBy) {
      case 'price-asc':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...items].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return items;
    }
  }, [wishlist, sortBy]);

  const totalPrice = useMemo(
    () => wishlistProducts.reduce((sum, p) => sum + p.price, 0),
    [wishlistProducts],
  );

  /* ─── Empty state ─── */
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-hobbyco-cream">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-400">
              <button
                onClick={() => navigate('home')}
                className="hover:text-hobbyco-orange transition-colors font-medium"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-hobbyco-dark font-bold">My Wishlist</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 animate-float">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-hobbyco-dark font-display">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mt-2 text-base font-medium">
              Save items you&apos;re interested in
            </p>
            <button
              onClick={() => navigate('shop')}
              className="mt-8 px-8 py-3 bg-hobbyco-orange text-white text-sm font-bold rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all shadow-orange-glow btn-hover-lift inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Populated state ─── */
  return (
    <div className="min-h-screen bg-hobbyco-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('home')}
                  className="cursor-pointer text-gray-500 hover:text-hobbyco-orange transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-200" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-hobbyco-dark font-bold">
                  My Wishlist
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">
                <Heart className="w-6 h-6 text-red-500 inline" /> My Wishlist
              </h1>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-hobbyco-orange text-white text-xs font-bold">
                {wishlistProducts.length}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Total value: {formatPrice(totalPrice)}
            </p>
          </div>

          {/* Sort & Grid Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:block font-medium">
                Sort:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] sm:w-[180px] h-8 text-xs rounded-lg border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs rounded-md"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex items-center border border-gray-200 rounded-lg p-0.5 bg-hobbyco-cream/30">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-md transition-all duration-150 ${
                  gridCols === 3
                    ? 'bg-hobbyco-orange text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                }`}
                aria-label="3 columns"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-md transition-all duration-150 ${
                  gridCols === 4
                    ? 'bg-hobbyco-orange text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                }`}
                aria-label="4 columns"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Price Drop Alert Banner */}
        {wishlistProducts.some((p) => PRICE_DROP_IDS.includes(p.id)) && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200/60 rounded-xl">
            <TrendingDown className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-700 font-bold">
              Good news! {wishlistProducts.filter((p) => PRICE_DROP_IDS.includes(p.id)).length} item{wishlistProducts.filter((p) => PRICE_DROP_IDS.includes(p.id)).length > 1 ? 's' : ''} in your wishlist {wishlistProducts.filter((p) => PRICE_DROP_IDS.includes(p.id)).length === 1 ? 'has' : 'have'} dropped in price.
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div
          className={`grid gap-3 sm:gap-4 ${
            gridCols === 4
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
          }`}
        >
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative">
              {/* Price dropped badge */}
              {PRICE_DROP_IDS.includes(product.id) && (
                <div className="absolute top-2.5 right-14 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-md shadow-sm">
                    <TrendingDown className="w-3 h-3" />
                    Price dropped 15%
                  </span>
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

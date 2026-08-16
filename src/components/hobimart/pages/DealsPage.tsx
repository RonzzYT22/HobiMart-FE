'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Zap,
  Clock,
  Tag,
  Percent,
  Gift,
  Star,
  ChevronRight,
  Timer,
  Sparkles,
  Crown,
  Package,
  TrendingDown,
} from 'lucide-react';
import { formatPrice } from '@/lib/data';
import ProductCard from '../ProductCard';
import { useAppStore } from '@/lib/store';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

/* ── Countdown Timer Hook ── */
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 86399));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
  };
}

/* ── Section component ── */
function DealSection({
  title,
  icon,
  iconColor,
  bgColor,
  productIds,
  viewAllLabel,
}: {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  productIds: string[];
  viewAllLabel?: string;
}) {
  const { products } = useAppStore();
  const sectionProducts = useMemo(
    () => products.filter((p: any) => productIds.includes(p.id)),
    [productIds, products],
  );

  if (sectionProducts.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
            {icon}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F2937]">{title}</h2>
        </div>
        {viewAllLabel && (
          <button className="text-xs font-semibold text-[#FF6B35] hover:text-[#E55A2B] flex items-center gap-1 transition-colors">
            {viewAllLabel}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {sectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} variant="sale" />
        ))}
      </div>
    </section>
  );
}

/* ── Bundle Deal Card ── */
function BundleCard({
  title,
  items,
  bundlePrice,
  originalTotal,
  image,
}: {
  title: string;
  items: string[];
  bundlePrice: number;
  originalTotal: number;
  image: string;
}) {
  const savings = Math.round(((originalTotal - bundlePrice) / originalTotal) * 100);
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 group">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-400 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl drop-shadow-lg">{image}</span>
            <p className="text-xs text-white/90 font-semibold mt-2 drop-shadow">{title}</p>
          </div>
        </div>
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          <span className="px-2.5 py-0.5 bg-[#1F2937] text-white text-[10px] font-bold rounded-md flex items-center gap-1">
            <Gift className="w-3 h-3" />
            BUNDLE
          </span>
          <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Save {savings}%
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#FF6B35] transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
          {items.length} items included
        </p>
        <div className="flex items-end gap-2 mt-2">
          <p className="text-base font-bold text-[#1F2937]">{formatPrice(bundlePrice)}</p>
          <p className="text-xs text-gray-400 line-through">{formatPrice(originalTotal)}</p>
        </div>
        <button className="w-full mt-3 py-2 bg-[#FF6B35] text-white text-xs font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          Add Bundle to Cart
        </button>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const { navigate, products, fetchProducts } = useAppStore();
  const { hours, minutes, seconds } = useCountdown(4 * 3600 + 32 * 60 + 18);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* Product groupings for each section */
  const flashSaleIds = ['p1', 'p6', 'p11', 'p4'];
  const weeklyDealIds = ['p2', 'p3', 'p10'];
  const clearanceIds = ['p7'];
  const limitedOfferIds = ['p5', 'p12', 'p8'];

  /* Mock bundle deals */
  const bundles = [
    {
      title: 'Starter Card Pack',
      items: ['Charizard EX', 'Blue-Eyes White Dragon', 'Pikachu Illustration'],
      bundlePrice: 2200000,
      originalTotal: 2680000,
      image: '🃏',
    },
    {
      title: 'Gundam Builder Kit',
      items: ['Gundam RG Nu', 'Gundam HG Aerial'],
      bundlePrice: 850000,
      originalTotal: 1135000,
      image: '🤖',
    },
    {
      title: 'Anime Figure Duo',
      items: ['Iron Man Mark 46', 'Spider-Man Figure'],
      bundlePrice: 2250000,
      originalTotal: 2550000,
      image: '🧸',
    },
    {
      title: 'Pro Collector Bundle',
      items: ['Charizard VMAX Rainbow', 'Naruto Sage Mode'],
      bundlePrice: 2400000,
      originalTotal: 3150000,
      image: '💎',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('home')}
                  className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E5E7EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Deals
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              🔥 HobiMart Deals
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Grab the best offers on hobby collectibles
            </p>
          </div>
        </div>

        {/* ── Promotional Banner ── */}
        <div className="relative mb-8 overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-[#FF6B35] via-[#FF8F5E] to-[#FF6B35] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/8 rounded-full" />

            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Limited Time
                </span>
                <span className="px-2.5 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Extra 10% Off
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                Summer Hobby Festival!
              </h2>
              <p className="text-white/80 text-sm mt-1.5 max-w-lg">
                Use code <span className="font-bold text-yellow-300">HOBI10</span> for extra 10%
                off on all deals. Valid until June 30, 2025.
              </p>
            </div>

            {/* Mini stats */}
            <div className="relative z-10 flex items-center gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">150+</p>
                <p className="text-[11px] text-white/70 font-medium">Products on Sale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-yellow-300">70%</p>
                <p className="text-[11px] text-white/70 font-medium">Max Discount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* ── Flash Sale ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1F2937]">
                  ⚡ Flash Sale
                </h2>
              </div>
              <button className="text-xs font-semibold text-[#FF6B35] hover:text-[#E55A2B] flex items-center gap-1 transition-colors">
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-50 border border-red-200/60 rounded-xl">
              <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-xs text-red-600 font-medium">Ends in:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'H', value: hours },
                  { label: 'M', value: minutes },
                  { label: 'S', value: seconds },
                ].map((unit) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 bg-[#1F2937] text-white text-sm font-bold rounded-lg">
                      {unit.value}
                    </span>
                    {unit.label !== 'S' && (
                      <span className="text-[#1F2937] font-bold text-sm">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products
                .filter((p) => flashSaleIds.includes(p.id))
                .map((product) => (
                  <ProductCard key={product.id} product={product} variant="sale" />
                ))}
            </div>
          </div>

          {/* ── Weekly Deals ── */}
          <DealSection
            title="🏷️ Weekly Deals"
            icon={<Tag className="w-4 h-4 text-amber-500" />}
            iconColor="bg-amber-100"
            bgColor="bg-amber-100"
            productIds={weeklyDealIds}
            viewAllLabel="View All Deals"
          />

          {/* ── Clearance ── */}
          <DealSection
            title="📉 Clearance"
            icon={<Percent className="w-4 h-4 text-green-500" />}
            iconColor="bg-green-100"
            bgColor="bg-green-100"
            productIds={clearanceIds}
            viewAllLabel="View Clearance"
          />

          {/* ── Bundle Deals ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-purple-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1F2937]">
                  🎁 Bundle Deals
                </h2>
              </div>
              <button className="text-xs font-semibold text-[#FF6B35] hover:text-[#E55A2B] flex items-center gap-1 transition-colors">
                View All Bundles
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Save more when you buy together — curated bundles at special prices
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {bundles.map((bundle, idx) => (
                <BundleCard
                  key={idx}
                  title={bundle.title}
                  items={bundle.items}
                  bundlePrice={bundle.bundlePrice}
                  originalTotal={bundle.originalTotal}
                  image={bundle.image}
                />
              ))}
            </div>
          </section>

          {/* ── Limited Offers ── */}
          <DealSection
            title="👑 Limited Offers"
            icon={<Crown className="w-4 h-4 text-amber-500" />}
            iconColor="bg-amber-100"
            bgColor="bg-amber-100"
            productIds={limitedOfferIds}
            viewAllLabel="View All Limited"
          />

          {/* ── Bottom CTA ── */}
          <div className="bg-gradient-to-r from-[#1F2937] to-[#374151] rounded-2xl p-6 sm:p-8 text-center">
            <Sparkles className="w-8 h-8 text-[#FF6B35] mx-auto mb-3" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Don&apos;t Miss Out!
            </h3>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              New deals are added every week. Follow our store and enable notifications
              to be the first to grab limited offers.
            </p>
            <button className="mt-5 px-6 py-2.5 bg-[#FF6B35] text-white text-sm font-bold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 inline-flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Follow HobiMart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

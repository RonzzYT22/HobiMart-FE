'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Repeat,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Handshake,
  MessageSquareText,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { products, formatPrice, getConditionColor, categories } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const conditionOptions = ['All Conditions', 'Mint', 'Near Mint', 'Excellent', 'Good', 'Played'];
const lookingForOptions = ['Any Category', 'Trading Cards', 'Gundam & Gunpla', 'Figures', 'Collectibles'];
const locationOptions = ['All Locations', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan', 'Bali'];

const tradeProducts = products.filter((p) => p.tradeAvailable);

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
];

export default function TradeInPage() {
  const { navigate, products, fetchProducts } = useAppStore();
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [conditionFilter, setConditionFilter] = useState('All Conditions');
  const [lookingFor, setLookingFor] = useState('Any Category');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products.filter((p: any) => p.tradeAvailable)];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== 'All Categories') {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (conditionFilter !== 'All Conditions') {
      result = result.filter((p) => p.condition === conditionFilter);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, categoryFilter, conditionFilter, lookingFor, locationFilter, sortBy]);

  const activeFilterCount =
    (categoryFilter !== 'All Categories' ? 1 : 0) +
    (conditionFilter !== 'All Conditions' ? 1 : 0) +
    (lookingFor !== 'Any Category' ? 1 : 0) +
    (locationFilter !== 'All Locations' ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter('All Categories');
    setConditionFilter('All Conditions');
    setLookingFor('Any Category');
    setLocationFilter('All Locations');
    setSearchQuery('');
  };

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
                  Trade-In Marketplace
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FF6B35] flex items-center justify-center">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
                Trade-In Marketplace
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">
                {tradeProducts.length} Items Available for Trade
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trade items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
              />
            </div>

            {/* Category */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs rounded-lg border-[#E5E7EB] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {['All Categories', ...categories.map((c) => c.name)].map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs rounded-md">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition */}
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs rounded-lg border-[#E5E7EB] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {conditionOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs rounded-md">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Looking For (desktop only) */}
            <Select value={lookingFor} onValueChange={setLookingFor}>
              <SelectTrigger className="hidden lg:block w-[160px] h-9 text-xs rounded-lg border-[#E5E7EB] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {lookingForOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs rounded-md">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location (desktop only) */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="hidden lg:block w-[140px] h-9 text-xs rounded-lg border-[#E5E7EB] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {locationOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs rounded-md">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] lg:w-[150px] h-9 text-xs rounded-lg border-[#E5E7EB] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs rounded-md">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile filter sheet button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-1.5 rounded-lg text-xs font-medium border-[#E5E7EB] hover:bg-orange-50 hover:border-[#FF6B35] hover:text-[#FF6B35] h-9"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-white">
                <SheetHeader className="border-b border-[#E5E7EB] px-5 py-4">
                  <SheetTitle className="text-[#1F2937]">Trade Filters</SheetTitle>
                </SheetHeader>
                <div className="px-5 py-5 space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Looking For
                    </label>
                    <Select value={lookingFor} onValueChange={setLookingFor}>
                      <SelectTrigger className="w-full h-9 text-sm rounded-lg border-[#E5E7EB]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {lookingForOptions.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-sm rounded-md">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Location
                    </label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="w-full h-9 text-sm rounded-lg border-[#E5E7EB]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {locationOptions.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-sm rounded-md">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="hidden lg:block text-xs text-red-500 font-semibold hover:underline whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="trade" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-[#E5E7EB]">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Repeat className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
              No trade items found
            </h3>
            <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-6">
              Try adjusting your filters to discover more items available for trade.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* How Trading Works */}
        <section className="mt-14">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] text-center mb-2">
            How Trading Works
          </h2>
          <p className="text-sm text-[#64748B] text-center mb-8 max-w-lg mx-auto">
            Trade your hobby items with other collectors safely and easily through HobiMart.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center group hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-100 transition-colors">
                <Eye className="w-7 h-7 text-teal-600" />
              </div>
              <span className="absolute top-4 right-5 w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">
                Find an Item
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Browse the Trade-In Marketplace and discover items you&apos;d love to have. Filter by category, condition, and what the trader is looking for.
              </p>
              {/* Arrow connector (desktop only) */}
              <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-gray-300" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center group hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-100 transition-colors">
                <MessageSquareText className="w-7 h-7 text-teal-600" />
              </div>
              <span className="absolute top-4 right-5 w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">
                Send Offer
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Propose a trade with items from your own collection. Add a cash difference if needed. The other trader will review your offer.
              </p>
              {/* Arrow connector (desktop only) */}
              <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-gray-300" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center group hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-100 transition-colors">
                <Handshake className="w-7 h-7 text-teal-600" />
              </div>
              <span className="absolute top-4 right-5 w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-[#1F2937] mb-1.5">
                Complete Trade
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Once both sides agree, ship your items with tracked shipping. HobiMart holds the trade safe until both items are delivered.
              </p>
            </div>
          </div>

          {/* Trust note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>All trades are protected by HobiMart&apos;s Trade Guarantee</span>
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight,
  Layers,
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  Sparkles,
    Heart, Bot, Gem } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { products, categories, formatPrice, getConditionColor } from '@/lib/data';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

/* ── Category breakdown data ── */
const collectionCategories = [
  {
    name: 'Trading Cards',
    count: 48,
    icon: Heart,
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600' },
  {
    name: 'Gundam & Gunpla',
    count: 12,
    icon: Bot,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600' },
  {
    name: 'Figures',
    count: 24,
    icon: Gem,
    color: 'from-purple-400 to-pink-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600' },
];

/* ── Mock collection items ── */
const collectionItems = [
  { id: 'ci1', name: 'Charizard EX', category: 'Trading Cards', condition: 'Near Mint' as const, dateAdded: 'Dec 28, 2024', productId: 'p1' },
  { id: 'ci2', name: 'Gundam MGEX Unicorn', category: 'Gundam & Gunpla', condition: 'Mint' as const, dateAdded: 'Dec 15, 2024', productId: 'p2' },
  { id: 'ci3', name: 'Iron Man Mark 46', category: 'Figures', condition: 'Mint' as const, dateAdded: 'Dec 10, 2024', productId: 'p5' },
  { id: 'ci4', name: 'Blue-Eyes White Dragon', category: 'Trading Cards', condition: 'Near Mint' as const, dateAdded: 'Nov 30, 2024', productId: 'p6' },
  { id: 'ci5', name: 'Pikachu Illustration Rare', category: 'Trading Cards', condition: 'Excellent' as const, dateAdded: 'Nov 18, 2024', productId: 'p4' },
  { id: 'ci6', name: 'Gundam RG Nu Gundam', category: 'Gundam & Gunpla', condition: 'Near Mint' as const, dateAdded: 'Nov 5, 2024', productId: 'p3' },
  { id: 'ci7', name: 'Spider-Man Figure', category: 'Figures', condition: 'Excellent' as const, dateAdded: 'Oct 22, 2024', productId: 'p8' },
  { id: 'ci8', name: 'Charizard VMAX Rainbow', category: 'Trading Cards', condition: 'Mint' as const, dateAdded: 'Oct 10, 2024', productId: 'p11' },
  { id: 'ci9', name: 'Naruto Sage Mode Figure', category: 'Figures', condition: 'Near Mint' as const, dateAdded: 'Sep 28, 2024', productId: 'p10' },
  { id: 'ci10', name: 'One Piece Luffy Card', category: 'Trading Cards', condition: 'Good' as const, dateAdded: 'Sep 15, 2024', productId: 'p7' },
  { id: 'ci11', name: 'Gundam HG Aerial', category: 'Gundam & Gunpla', condition: 'Mint' as const, dateAdded: 'Sep 1, 2024', productId: 'p9' },
  { id: 'ci12', name: 'Gundam PG Strike Freedom', category: 'Gundam & Gunpla', condition: 'Mint' as const, dateAdded: 'Aug 20, 2024', productId: 'p12' },
];

export default function MyCollectionPage() {
  const { navigate, products, fetchProducts } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleImgError = (id: string) => setImgErrors(prev => new Set(prev).add(id));

  const filteredItems = useMemo(() => {
    return products.filter((item: any) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
                  My Collection
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* ── Title ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
                <Sparkles className="w-6 h-6 text-[#FF6B35] inline" /> My Collection
              </h1>
              <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-full bg-[#FF6B35] text-white text-xs font-bold px-2">
                84 Items
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">
              Your personal hobby collection showcase
            </p>
          </div>
        </div>

        {/* ── Category Breakdown Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {collectionCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? 'All' : cat.name
                )
              }
              className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group ${
                selectedCategory === cat.name
                  ? 'border-[#FF6B35] bg-[#FF6B35]/5 ring-1 ring-[#FF6B35]/20'
                  : 'border-[#E5E7EB] bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl ${cat.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {cat.name}
                  </p>
                  <p className={`text-2xl font-bold mt-0.5 ${cat.textColor}`}>
                    {cat.count}
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      items
                    </span>
                  </p>
                </div>
              </div>
              {/* Decorative gradient bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B35] ${cat.color} transition-all ${
                  selectedCategory === cat.name ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          ))}
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#FF6B35]/20 focus-visible:border-[#FF6B35]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...collectionCategories.map((c) => c.name)].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#FF6B35] text-white shadow-sm shadow-orange-500/20'
                      : 'bg-white border border-[#E5E7EB] text-gray-500 hover:border-gray-300 hover:text-[#1F2937]'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* ── Gallery Grid ── */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {imgErrors.has(item.id) ? (
                    <Package className="w-12 h-12 opacity-30 mx-auto" />
                  ) : (
                    <img
                      src={products.find(p => p.id === item.productId)?.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImgError(item.id)}
                    />
                  )}
                  {/* Condition badge */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${getConditionColor(item.condition)}`}
                    >
                      ● {item.condition}
                    </span>
                  </div>
                  {/* Sparkle decoration */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Card content */}
                <div className="p-3.5">
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-semibold text-[#1F2937] mt-0.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[11px]">Added {item.dateAdded}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-5">
              <Layers className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">
              No items found
            </h3>
            <p className="text-sm text-gray-400 mt-1.5 max-w-sm mx-auto">
              {searchQuery
                ? `No items matching "${searchQuery}" in your collection`
                : `No items in ${selectedCategory} category`}
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              variant="outline"
              className="mt-5 rounded-xl font-semibold text-sm border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8FAFC] shadow-none"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Clear Filters
            </Button>
          </div>
        )}

        {/* Showing count */}
        {filteredItems.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Showing {filteredItems.length} of 84 items in your collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

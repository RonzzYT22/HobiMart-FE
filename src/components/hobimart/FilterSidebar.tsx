'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { products, categories, formatPrice } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

export interface FilterState {
  selectedCategories: string[];
  priceRange: [number, number];
  conditions: string[];
  minRating: number;
  selectedBrands: string[];
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice: number;
}

const allConditions = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Played', 'Damaged'];

export function FilterSidebar({ filters, onFiltersChange, maxPrice }: FilterSidebarProps) {
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).sort();

  const toggleCategory = (cat: string) => {
    const updated = filters.selectedCategories.includes(cat)
      ? filters.selectedCategories.filter(c => c !== cat)
      : [...filters.selectedCategories, cat];
    onFiltersChange({ ...filters, selectedCategories: updated });
  };

  const toggleCondition = (cond: string) => {
    const updated = filters.conditions.includes(cond)
      ? filters.conditions.filter(c => c !== cond)
      : [...filters.conditions, cond];
    onFiltersChange({ ...filters, conditions: updated });
  };

  const toggleBrand = (brand: string) => {
    const updated = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    onFiltersChange({ ...filters, selectedBrands: updated });
  };

  const clearAll = () => {
    onFiltersChange(defaultFilters(maxPrice));
  };

  const activeFilterCount =
    filters.selectedCategories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.conditions.length +
    (filters.minRating > 0 ? 1 : 0) +
    filters.selectedBrands.length +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1F2937]" />
          <h3 className="font-bold text-[#1F2937] text-sm">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-[#FF6B35] font-semibold hover:underline">
            Clear All
          </button>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Categories */}
      <FilterSection title="Category" defaultOpen>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.name} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={filters.selectedCategories.includes(cat.name)}
                onCheckedChange={() => toggleCategory(cat.name)}
                className="data-[state=checked]:bg-[#FF6B35] data-[state=checked]:border-[#FF6B35]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#1F2937] transition-colors flex-1">
                {cat.name}
              </span>
              <span className="text-[11px] text-gray-400 tabular-nums">({cat.count.toLocaleString()})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" defaultOpen>
        <div className="px-0.5">
          <Slider
            value={filters.priceRange}
            min={0}
            max={maxPrice}
            step={50000}
            onValueChange={(v) => onFiltersChange({ ...filters, priceRange: v as [number, number] })}
            className="mb-3 [&_[data-slot=slider-range]]:bg-[#FF6B35] [&_[data-slot=slider-thumb]]:border-[#FF6B35] [&_[data-slot=slider-thumb]]:hover:ring-[#FF6B35]/20 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:h-4"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[11px] text-[#64748B] font-medium">{formatPrice(filters.priceRange[0])}</span>
            </div>
            <span className="text-xs text-gray-300 shrink-0">—</span>
            <div className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[11px] text-[#64748B] font-medium">{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition" defaultOpen>
        <div className="space-y-2">
          {allConditions.map(cond => {
            const count = products.filter(p => p.condition === cond).length;
            return (
              <label key={cond} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  checked={filters.conditions.includes(cond)}
                  onCheckedChange={() => toggleCondition(cond)}
                  className="data-[state=checked]:bg-[#FF6B35] data-[state=checked]:border-[#FF6B35]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#1F2937] transition-colors flex-1">
                  {cond}
                </span>
                <span className="text-[11px] text-gray-400 tabular-nums">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" defaultOpen>
        <div className="space-y-1">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => onFiltersChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating })}
              className={`flex items-center gap-2 w-full py-1.5 px-2 rounded-lg transition-colors ${
                filters.minRating === rating
                  ? 'bg-orange-50 border border-orange-100'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">& Up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen>
        <div className="space-y-2">
          {uniqueBrands.map(brand => {
            const count = products.filter(p => p.brand === brand).length;
            return (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  checked={filters.selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                  className="data-[state=checked]:bg-[#FF6B35] data-[state=checked]:border-[#FF6B35]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#1F2937] transition-colors flex-1">
                  {brand}
                </span>
                <span className="text-[11px] text-gray-400 tabular-nums">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, inStockOnly: !!checked })}
            className="data-[state=checked]:bg-[#FF6B35] data-[state=checked]:border-[#FF6B35]"
          />
          <span className="text-sm text-gray-600 group-hover:text-[#1F2937] transition-colors flex-1">
            In Stock Only
          </span>
          <span className="text-[11px] text-gray-400">
            ({products.filter(p => p.stock > 0).length})
          </span>
        </label>
      </FilterSection>
    </div>
  );
}

/* Collapsible filter section */
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-[13px] font-semibold text-[#1F2937] group"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[500px] opacity-100 mt-2.5' : 'max-h-0 opacity-0 mt-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

/* Helpers */
export const defaultFilters = (maxPrice: number): FilterState => ({
  selectedCategories: [],
  priceRange: [0, maxPrice],
  conditions: [],
  minRating: 0,
  selectedBrands: [],
  inStockOnly: false,
});

export function applyFilters(
  productList: typeof products,
  filters: FilterState
): typeof products {
  return productList.filter((p) => {
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(p.category))
      return false;
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    if (filters.conditions.length > 0 && !filters.conditions.includes(p.condition)) return false;
    if (filters.minRating > 0 && p.rating < filters.minRating) return false;
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(p.brand)) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    return true;
  });
}

export function sortProducts(
  productList: typeof products,
  sortBy: string
): typeof products {
  const sorted = [...productList];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popular':
      return sorted.sort((a, b) => b.sold - a.sold);
    default:
      return sorted;
  }
}

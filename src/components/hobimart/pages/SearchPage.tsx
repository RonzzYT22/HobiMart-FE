'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  SlidersHorizontal,
  Search,
  Grid3X3,
  LayoutGrid,
  X,
  PackageOpen,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import ProductCard from '../ProductCard';
import {
  FilterSidebar,
  type FilterState,
  defaultFilters,
  applyFilters,
  sortProducts,
} from '../FilterSidebar';
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const MAX_PRICE = 4000000;

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'popular', label: 'Most Popular' },
];

export default function SearchPage() {
  const { pageParams, navigate, searchQuery, setSearchQuery, products, fetchProducts, loading } = useAppStore();
  const query = pageParams.q || searchQuery || '';
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
    if (query) fetchProducts({ q: query });
    else fetchProducts();
  }, [query, fetchProducts]);

  const [filters, setFilters] = useState<FilterState>(() => defaultFilters(MAX_PRICE));
  const [sortBy, setSortBy] = useState('relevance');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    const searchFiltered = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.subcategory.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
      : products;
    const filterApplied = applyFilters(searchFiltered, filters);
    return sortProducts(filterApplied, sortBy);
  }, [query, filters, sortBy]);

  const handleSearch = useCallback(
    (q: string) => {
      setLocalQuery(q);
      setSearchQuery(q);
      if (q.trim()) {
        navigate('search', { q: q.trim() });
      }
    },
    [navigate, setSearchQuery]
  );

  const handleClearSearch = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
    navigate('home');
  }, [navigate, setSearchQuery]);

  const activeFilterCount =
    filters.selectedCategories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_PRICE ? 1 : 0) +
    filters.conditions.length +
    (filters.minRating > 0 ? 1 : 0) +
    filters.selectedBrands.length +
    (filters.inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setFilters(defaultFilters(MAX_PRICE));
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
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
              {query ? (
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Search results for &ldquo;{query}&rdquo;
                </BreadcrumbPage>
              ) : (
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Search
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] leading-tight">
            {query ? (
              <>
                Search results for{' '}
                <span className="text-[#FF6B35]">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              'Search HobiMart'
            )}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {filteredProducts.length} Products Found
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-5">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(localQuery)}
              placeholder="Search cards, Gundam, figures & collectibles..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-[#E5E7EB] rounded-2xl text-sm focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all placeholder:text-gray-400 shadow-sm"
              autoFocus
            />
            {localQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Popular suggestions when no query */}
        {!query && (
          <div className="mb-6 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="text-sm font-semibold text-[#1F2937]">
                Popular Searches
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Charizard',
                'Gundam MG',
                'One Piece Card',
                'Marvel Figure',
                'Pokémon Card',
                'Rare',
                'Limited Edition',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3.5 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50/50 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100/60">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active:
            </span>
            {filters.selectedCategories.map((cat) => (
              <FilterTag
                key={cat}
                label={cat}
                onRemove={() =>
                  setFilters({
                    ...filters,
                    selectedCategories: filters.selectedCategories.filter((c) => c !== cat),
                  })
                }
              />
            ))}
            {filters.selectedBrands.map((brand) => (
              <FilterTag
                key={brand}
                label={brand}
                onRemove={() =>
                  setFilters({
                    ...filters,
                    selectedBrands: filters.selectedBrands.filter((b) => b !== brand),
                  })
                }
              />
            ))}
            {filters.conditions.map((cond) => (
              <FilterTag
                key={cond}
                label={cond}
                onRemove={() =>
                  setFilters({
                    ...filters,
                    conditions: filters.conditions.filter((c) => c !== cond),
                  })
                }
              />
            ))}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_PRICE) && (
              <FilterTag
                label={`${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`}
                onRemove={() => setFilters({ ...filters, priceRange: [0, MAX_PRICE] })}
              />
            )}
            {filters.minRating > 0 && (
              <FilterTag
                label={`${filters.minRating}★ & Up`}
                onRemove={() => setFilters({ ...filters, minRating: 0 })}
              />
            )}
            {filters.inStockOnly && (
              <FilterTag
                label="In Stock"
                onRemove={() => setFilters({ ...filters, inStockOnly: false })}
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-500 font-semibold hover:underline ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#E5E7EB] p-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin shadow-sm">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                maxPrice={MAX_PRICE}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 bg-white rounded-xl border border-[#E5E7EB] px-4 py-2.5 shadow-sm">
              {/* Mobile Filter Button */}
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden gap-1.5 rounded-lg text-xs font-medium border-[#E5E7EB] hover:bg-orange-50 hover:border-[#FF6B35] hover:text-[#FF6B35]"
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
                      <SheetTitle className="text-[#1F2937]">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="px-5 py-5 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin">
                      <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                        maxPrice={MAX_PRICE}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-xs text-[#64748B] hidden sm:block">
                  {filteredProducts.length} results
                </span>
              </div>

              {/* Sort & Grid Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 hidden sm:block">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] sm:w-[170px] h-8 text-xs rounded-lg border-[#E5E7EB] bg-[#F8FAFC]">
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
                </div>

                {/* Grid Columns Toggle */}
                <div className="hidden md:flex items-center border border-[#E5E7EB] rounded-lg p-0.5 bg-[#F8FAFC]">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 rounded-md transition-all duration-150 ${
                      gridCols === 3
                        ? 'bg-[#FF6B35] text-white shadow-sm'
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
                        ? 'bg-[#FF6B35] text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                    }`}
                    aria-label="4 columns"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-3 sm:gap-4 ${
                  gridCols === 4
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
                  No results for &ldquo;{query}&rdquo;
                </h3>
                <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-6">
                  Try searching with different keywords, checking the spelling,
                  or adjusting your filters.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleClearSearch}
                    className="px-5 py-2.5 border border-[#E5E7EB] text-[#374151] text-sm font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small removable filter tag */
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#FF6B35] text-xs font-medium rounded-full border border-orange-200/60 shadow-sm">
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

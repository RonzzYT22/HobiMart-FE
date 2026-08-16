'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronRight,
  X,
  Grid3X3,
  LayoutGrid,
  PackageOpen,
  ChevronUp,
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

export default function ShopPage() {
  const { pageParams, navigate, products, categories, brands, fetchProducts, fetchCategories, fetchBrands, loading } = useAppStore();
  const categoryFilter = pageParams.category || '';

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  const [filters, setFilters] = useState<FilterState>(() => {
    const defaults = defaultFilters(MAX_PRICE);
    if (categoryFilter) {
      defaults.selectedCategories = [categoryFilter];
    }
    return defaults;
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const filteredProducts = useMemo(() => {
    let result = categoryFilter
      ? products.filter((p) => p.category === categoryFilter)
      : [...products];
    result = applyFilters(result, filters);
    result = sortProducts(result, sortBy);
    return result;
  }, [categoryFilter, filters, sortBy]);

  const categoryName = categoryFilter || 'Shop';
  const categoryData = categories.find((c) => c.name === categoryFilter);

  const activeFilterCount =
    (categoryFilter && filters.selectedCategories.length === 1
      ? 0
      : filters.selectedCategories.length) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_PRICE ? 1 : 0) +
    filters.conditions.length +
    (filters.minRating > 0 ? 1 : 0) +
    filters.selectedBrands.length +
    (filters.inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    const defaults = defaultFilters(MAX_PRICE);
    if (categoryFilter) {
      defaults.selectedCategories = [categoryFilter];
    }
    setFilters(defaults);
  };

  const removeCategoryFilter = (cat: string) => {
    setFilters({
      ...filters,
      selectedCategories: filters.selectedCategories.filter((c) => c !== cat),
    });
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
              {categoryFilter ? (
                <BreadcrumbLink
                  onClick={() => navigate('shop')}
                  className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors"
                >
                  Shop
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Shop
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {categoryFilter && (
              <>
                <BreadcrumbSeparator className="text-[#E5E7EB]" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#111827] font-semibold">
                    {categoryFilter}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            {categoryData && (
              <span className="text-3xl">{categoryData.icon}</span>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] leading-tight">
                {categoryName}
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">
                {filteredProducts.length} Products Found
              </p>
            </div>
          </div>
          {!categoryFilter && (
            <p className="text-sm text-[#64748B] mt-2 max-w-2xl">
              Explore our full catalog of trading cards, Gundam models, action figures,
              and rare collectibles from verified sellers across Indonesia.
            </p>
          )}
        </div>

        {/* Category Quick Links (only on main shop page) */}
        {!categoryFilter && (
          <div className="flex gap-2 flex-wrap mb-5">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate('shop', { category: cat.name })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-xs font-medium text-[#374151] hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50/50 transition-all"
              >
                <span>{cat.icon}</span>
                {cat.name}
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </button>
            ))}
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100/60">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active:
            </span>
            {filters.selectedCategories
              .filter((c) => !(categoryFilter && c === categoryFilter))
              .map((cat) => (
                <FilterTag key={cat} label={cat} onRemove={() => removeCategoryFilter(cat)} />
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
                  <PackageOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
                  No products found
                </h3>
                <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any products matching your current filters.
                  Try adjusting them or browse all products.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
                >
                  Clear All Filters
                </button>
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

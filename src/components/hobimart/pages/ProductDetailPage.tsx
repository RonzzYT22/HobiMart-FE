'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Star, Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw,
  ChevronRight, CheckCircle2, Store, Home, ChevronLeft, Package, Eye,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { products, reviews, formatPrice, getConditionColor, getBadgeColor, sellers } from '@/lib/data';
import ProductCard from '@/components/hobimart/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const THUMBNAILS = ['Front', 'Back', 'Corner', 'Surface', 'Packaging'] as const;
const CONDITION_BARS = [
  { label: 'Overall', value: 90 },
  { label: 'Corners', value: 100 },
  { label: 'Surface', value: 80 },
  { label: 'Packaging', value: 90 },
];

export default function ProductDetailPage() {
  const { pageParams, navigate, addToCart, toggleWishlist, wishlist, cart, products, selectedProduct, fetchProduct, loading } = useAppStore();
  const [activeThumb, setActiveThumb] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const sku = pageParams.id;
    if (sku) fetchProduct(sku);
  }, [pageParams.id, fetchProduct]);

  const product = useMemo(() => {
    const id = pageParams.id;
    const found = selectedProduct || products.find(p => p.id === id || p.sku === id);
    return found || products[0] || {};
  }, [pageParams.id, selectedProduct, products]);

  const isWished = wishlist.includes(product.id);

  const [imgError, setImgError] = useState(false);

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  const ratingBreakdown = [
    { stars: 5, count: Math.round(product.reviewCount * 0.65) },
    { stars: 4, count: Math.round(product.reviewCount * 0.22) },
    { stars: 3, count: Math.round(product.reviewCount * 0.08) },
    { stars: 2, count: Math.round(product.reviewCount * 0.03) },
    { stars: 1, count: Math.round(product.reviewCount * 0.02) },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 overflow-x-auto">
            <button onClick={() => navigate('home')} className="flex items-center gap-1 hover:text-[#FF6B35] transition-colors shrink-0">
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <button onClick={() => navigate('shop')} className="hover:text-[#FF6B35] transition-colors shrink-0">Shop</button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <button onClick={() => { navigate('shop'); }} className="hover:text-[#FF6B35] transition-colors shrink-0">{product.category}</button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[#1F2937] font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Image Gallery */}
          <div>
            <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center relative">
                {imgError ? (
                  <span className="text-6xl sm:text-8xl">📦</span>
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                )}
                {product.discount && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">-{product.discount}%</div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 mt-4">
              {THUMBNAILS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setActiveThumb(i)}
                  className={`flex-1 aspect-square rounded-xl bg-gray-100 flex items-center justify-center transition-all duration-200 ${activeThumb === i ? 'ring-2 ring-[#FF6B35] ring-offset-2 scale-[1.02] shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'}`}
                >
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-xs text-[#FF6B35] font-semibold uppercase tracking-widest">{product.category} · {product.subcategory}</p>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mt-2 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2.5 mt-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4.5 h-4.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1F2937]">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              <span className="text-sm text-gray-300">|</span>
              <span className="text-sm text-gray-400">{product.sold} sold</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-bold text-[#1F2937]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="px-2.5 py-1 bg-red-50 text-red-500 text-sm font-bold rounded-lg mb-0.5">-{product.discount}%</span>
              )}
            </div>

            {/* Condition & Verified */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getConditionColor(product.condition)}`}>
                ● {product.condition}
              </span>
              {product.verified && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Verified Authentic
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-sm font-semibold">🔥 Only {product.stock} left</span>
              )}
            </div>

            {/* Badges */}
            {product.badges.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {product.badges.map(b => (
                  <span key={b} className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${getBadgeColor(b)}`}>{b}</span>
                ))}
              </div>
            )}

            <div className="h-px bg-[#E5E7EB] my-5" />

            {/* Seller Info */}
            <button
              onClick={() => navigate('shop')}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group w-fit"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1F2937] group-hover:text-[#FF6B35] transition-colors">{product.seller.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.seller.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{product.seller.totalSales.toLocaleString()} sales</span>
                  <span>·</span>
                  <span>{product.seller.positiveRate}% positive</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
            </button>

            <div className="h-px bg-[#E5E7EB] my-5" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#1F2937]">Quantity</span>
              <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-[#1F2937]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-[#1F2937]">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-[#1F2937]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400">{product.stock} available</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#FF6B35] text-white text-sm font-bold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#1F2937] text-white text-sm font-bold rounded-xl hover:bg-[#111827] active:scale-[0.98] transition-all"
              >
                Buy Now
              </button>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${isWished ? 'border-red-200 bg-red-50 text-red-500' : 'border-[#E5E7EB] text-gray-500 hover:border-red-200 hover:text-red-500'}`}
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500' : ''}`} />
                {isWished ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-gray-500 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <Truck className="w-5 h-5 text-[#FF6B35]" />
                <span className="text-[11px] text-gray-500 font-medium text-center">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <Shield className="w-5 h-5 text-[#FF6B35]" />
                <span className="text-[11px] text-gray-500 font-medium text-center">Buyer Protection</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <RotateCcw className="w-5 h-5 text-[#FF6B35]" />
                <span className="text-[11px] text-gray-500 font-medium text-center">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 lg:mt-14">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-white border border-[#E5E7EB] rounded-xl p-1 h-auto overflow-x-auto">
              <TabsTrigger value="description" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">Description</TabsTrigger>
              <TabsTrigger value="condition" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">Condition</TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#1F2937] mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description}</p>
                <div className="mt-6 p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                  <h4 className="text-sm font-semibold text-[#1F2937] mb-2">What&apos;s in the Box</h4>
                  <ul className="space-y-1.5 text-sm text-gray-500">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> 1x {product.name}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Protective sleeve & toploader</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Certificate of authenticity</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> HobiMart guarantee card</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="condition" className="mt-6">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">Condition Report</h3>
                <p className="text-sm text-gray-400 mb-6">Detailed condition assessment by our expert team</p>
                <div className="space-y-5">
                  {CONDITION_BARS.map(bar => (
                    <div key={bar.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[#1F2937]">{bar.label}</span>
                        <span className="text-sm font-bold text-[#FF6B35]">{bar.value}%</span>
                      </div>
                      <Progress value={bar.value} className="h-2.5 [&>div]:bg-[#FF6B35] bg-gray-100" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Condition Verified</p>
                      <p className="text-xs text-green-600 mt-0.5">This item has been inspected and graded by our certified team.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-[#E5E7EB]">
                  <h3 className="text-lg font-bold text-[#1F2937]">Product Specifications</h3>
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Series', value: product.series || '—' },
                    { label: 'Type', value: product.itemType || '—' },
                    { label: 'Language', value: product.language || '—' },
                    { label: 'Year', value: product.year ? String(product.year) : '—' },
                    { label: 'Condition', value: product.condition },
                    { label: 'Authenticity', value: product.verified ? 'Verified ✓' : 'Unverified' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center px-6 sm:px-8 py-4 hover:bg-gray-50/50 transition-colors">
                      <span className="w-40 shrink-0 text-sm text-gray-400 font-medium">{row.label}</span>
                      <span className="text-sm font-semibold text-[#1F2937]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Summary */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-[#1F2937]">{product.rating}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{product.reviewCount} reviews</p>
                  </div>

                  {/* Histogram */}
                  <div className="space-y-2.5 mt-6">
                    {ratingBreakdown.map(r => (
                      <div key={r.stars} className="flex items-center gap-2.5">
                        <span className="text-xs text-gray-400 w-3">{r.stars}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${(r.count / product.reviewCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="lg:col-span-2 space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B35] to-orange-300 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{review.user[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1F2937]">{review.user}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="shrink-0 flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#1F2937] mb-6">Shipping Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-[#FF6B35]" />
                      <span className="text-sm font-semibold text-[#1F2937]">Regular Shipping</span>
                    </div>
                    <p className="text-xs text-gray-400">Estimated 5-7 business days</p>
                    <p className="text-sm font-bold text-[#1F2937] mt-1">Rp15.000 - Rp25.000</p>
                  </div>
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-[#FF6B35]" />
                      <span className="text-sm font-semibold text-[#1F2937]">Express Shipping</span>
                    </div>
                    <p className="text-xs text-gray-400">Estimated 2-3 business days</p>
                    <p className="text-sm font-bold text-[#1F2937] mt-1">Rp35.000 - Rp50.000</p>
                  </div>
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#FF6B35]" />
                      <span className="text-sm font-semibold text-[#1F2937]">Packaging</span>
                    </div>
                    <p className="text-xs text-gray-400">Professional packaging with bubble wrap, cardboard, and "fragile" labels for safe delivery.</p>
                  </div>
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-[#FF6B35]" />
                      <span className="text-sm font-semibold text-[#1F2937]">Insurance</span>
                    </div>
                    <p className="text-xs text-gray-400">All items above Rp500.000 include free shipping insurance up to the full value.</p>
                  </div>
                </div>
                <div className="mt-5 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-sm text-orange-700"><strong>Free shipping</strong> on orders over Rp300.000 from {product.seller.name}!</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 lg:mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">Related Products</h2>
              <button onClick={() => navigate('shop')} className="text-sm font-semibold text-[#FF6B35] hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'client';

import { useEffect } from 'react';
import { ArrowRight, Shield, CheckCircle, Star, Package, ArrowLeftRight, Users, ChevronRight, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import ProductCard from '../ProductCard';

export default function HomePage() {
  const { navigate, featuredProducts, flashDeals, categories, fetchFeatured, fetchFlashDeals, fetchCategories } = useAppStore();
  const flashProducts = flashDeals.slice(0, 8);
  const trending = featuredProducts.slice(0, 4);
  const newArrivals = featuredProducts.slice(4, 8);
  const rareFinds = featuredProducts.slice(2, 6);

  useEffect(() => {
    fetchFeatured();
    fetchFlashDeals();
    fetchCategories();
  }, [fetchFeatured, fetchFlashDeals, fetchCategories]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#1F2937] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🃏</div>
          <div className="absolute top-20 right-20 text-9xl">🤖</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🧸</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm text-orange-300 font-medium mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse" />
              Buy. Collect. Trade.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-tight">
              Your Hobby<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F59E0B]">Starts Here.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg">
              Discover trading cards, Gundam, figures, and collectibles made for every kind of hobbyist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('shop')} className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25">
                Shop Now
              </button>
              <button onClick={() => navigate('shop')} className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                Explore Categories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Shop by Category</h2>
          <button onClick={() => navigate('shop')} className="text-sm text-[#FF6B35] font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => {
            const icons: Record<string, string> = { 'Trading Cards': '🃏', 'Gundam & Gunpla': '🤖', 'Figures': '🧸', 'Collectibles': '💎', 'Accessories': '🛠️' };
            return (
              <button key={cat.name} onClick={() => navigate('shop', { category: cat.name })} className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`h-32 sm:h-40 bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <span className="text-5xl sm:text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{icons[cat.name]}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#1F2937] text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count.toLocaleString()} Products</p>
                  <span className="inline-flex items-center gap-1 text-xs text-[#FF6B35] font-medium mt-2 group-hover:gap-2 transition-all">Shop Now <ChevronRight className="w-3 h-3" /></span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Flash Deals</h2>
                <div className="flex items-center gap-2 mt-1"><Clock className="w-3.5 h-3.5 text-red-500" /><span className="text-xs text-red-500 font-semibold animate-countdown">Ends in 04:32:18</span></div>
              </div>
            </div>
            <button onClick={() => navigate('deals')} className="text-sm text-[#FF6B35] font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} variant="sale" />)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-orange-200 text-sm font-semibold uppercase tracking-wider">Weekend Hobby Sale</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Up to 30% OFF</h3>
            <p className="text-orange-100 mt-1">Selected Collectibles</p>
          </div>
          <button onClick={() => navigate('deals')} className="px-6 py-3 bg-white text-[#FF6B35] font-bold rounded-xl hover:bg-orange-50 active:scale-[0.98] transition-all whitespace-nowrap shadow-lg">Shop Deals</button>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Trending Now</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><span className="text-2xl">✨</span><h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">New Arrivals</h2></div>
            <button onClick={() => navigate('shop')} className="text-sm text-[#FF6B35] font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.length > 0 ? newArrivals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />) :
                          featuredProducts.slice(4, 8).map(p => <ProductCard key={p.id} product={p} />)}
            }
          </div>
        </div>
      </section>

      {/* Rare Finds */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">💎</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Rare Finds</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {rareFinds.map(p => <ProductCard key={p.id} product={p} variant="rare" />)}
        </div>
      </section>

      {/* Recommendation */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-2">Picked For Your Hobby</h2>
          <p className="text-sm text-gray-500 mb-8">Because you viewed Trading Cards</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.filter(p => p.category === 'Trading Cards').slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] text-center mb-10">Why Shop HobiMart?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: <CheckCircle className="w-6 h-6" />, title: 'Verified Sellers', desc: 'All sellers are vetted' },
            { icon: <Star className="w-6 h-6" />, title: 'Detailed Condition', desc: 'Accurate grading' },
            { icon: <Shield className="w-6 h-6" />, title: 'Secure Checkout', desc: 'Encrypted payments' },
            { icon: <Package className="w-6 h-6" />, title: 'Buyer Protection', desc: 'Money back guarantee' },
            { icon: <Users className="w-6 h-6" />, title: 'Real Reviews', desc: 'From collectors' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 text-[#FF6B35] rounded-xl flex items-center justify-center mx-auto mb-3">{item.icon}</div>
              <h3 className="font-semibold text-sm text-[#1F2937]">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* More Than Store */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] text-center mb-10">More Than Just a Hobby Store</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <button onClick={() => navigate('shop')} className="group md:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-8 text-left hover:shadow-lg hover:border-orange-200 transition-all">
            <span className="text-4xl">🛒</span>
            <h3 className="text-xl font-bold text-[#1F2937] mt-4">SHOP</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Find your next collectible from verified sellers across Indonesia. Thousands of products across every hobby category.</p>
          </button>
          <button onClick={() => navigate('trade-in')} className="group bg-white rounded-2xl border border-[#E5E7EB] p-8 text-left hover:shadow-lg hover:border-orange-200 transition-all">
            <span className="text-4xl">🔄</span>
            <h3 className="text-xl font-bold text-[#1F2937] mt-4">TRADE</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Trade your collection with other collectors safely.</p>
          </button>
        </div>
        <button onClick={() => navigate('my-collection')} className="group w-full mt-6 bg-white rounded-2xl border border-[#E5E7EB] p-8 text-left hover:shadow-lg hover:border-orange-200 transition-all">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <div>
              <h3 className="text-xl font-bold text-[#1F2937]">COLLECT</h3>
              <p className="text-sm text-gray-500 mt-1">Build and showcase your collection.</p>
            </div>
          </div>
        </button>
      </section>

      {/* Trade-In Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-[#1F2937] to-[#374151] rounded-2xl p-8 sm:p-10 text-center">
          <ArrowLeftRight className="w-10 h-10 text-[#FF6B35] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Have Something to Trade?</h2>
          <p className="text-gray-300 mt-3 max-w-md mx-auto">Turn your collection into your next favorite collectible.</p>
          <button onClick={() => navigate('trade-in')} className="mt-6 px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all">Explore Trade-In</button>
        </div>
      </section>

      {/* Community */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">From the HobiMart Community</h2>
          <button onClick={() => navigate('community')} className="text-sm text-[#FF6B35] font-semibold hover:underline">Visit Community</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ t: '"Is this card authentic?"', r: 24, time: '3h ago' }, { t: '"Best Gunpla under 1 million?"', r: 45, time: '6h ago' }, { t: '"How do you store your cards?"', r: 18, time: '1d ago' }, { t: '"Hot Toys vs SH Figuarts?"', r: 31, time: '2d ago' }].map(post => (
            <div key={post.t} className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-sm font-medium text-[#1F2937] leading-snug">{post.t}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400"><span>{post.r} replies</span><span>·</span><span>{post.time}</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


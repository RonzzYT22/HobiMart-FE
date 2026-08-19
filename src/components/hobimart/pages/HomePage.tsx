'client';

import { useEffect } from 'react';
import { ArrowRight, Shield, CheckCircle, Star, Package, ArrowLeftRight, Users, ChevronRight, Clock, Heart, Gem, Wrench, Bot, ShoppingCart, Flame, Diamond, Sparkles, Trophy, Zap } from 'lucide-react';
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
      {/* Hero Section - HOBBYCO Style */}
      <section className="relative bg-hero-gradient overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-8xl opacity-5"><Heart className="w-32 h-32 text-hobbyco-orange" /></div>
          <div className="absolute top-20 right-20 text-9xl opacity-5"><Bot className="w-40 h-40 text-hobbyco-purple" /></div>
          <div className="absolute bottom-10 left-1/3 text-7xl opacity-5"><Gem className="w-28 h-28 text-hobbyco-orange-light" /></div>
          {/* Geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-hobbyco-orange/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-hobbyco-purple/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-hobbyco-orange font-bold mb-6 backdrop-blur-sm border border-hobbyco-orange/20">
              <Sparkles className="w-4 h-4 animate-sparkle" />
              COLLECT • ENJOY • CONNECT
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-white leading-tight font-display">
              Your Hobby<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hobbyco-orange to-hobbyco-orange-light">Starts Here.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-lg font-medium">
              Discover trading cards, Gundam, figures, and collectibles made for every kind of hobbyist.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => navigate('shop')} className="group px-8 py-4 bg-hobbyco-orange text-white font-bold rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all shadow-orange-glow btn-hover-lift flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('shop')} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                Explore Categories
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
              {[
                { value: '50K+', label: 'Products' },
                { value: '10K+', label: 'Collectors' },
                { value: '99%', label: 'Happy' }
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - HOBBYCO Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">Shop by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Find your perfect collectible</p>
          </div>
          <button onClick={() => navigate('shop')} className="text-sm text-hobbyco-orange font-bold hover:underline flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => {
            const icons: Record<string, React.ReactNode> = { 
              'Trading Cards': <Heart className="w-6 h-6" />, 
              'Gundam & Gunpla': <Bot className="w-6 h-6" />, 
              'Figures': <Gem className="w-6 h-6" />, 
              'Collectibles': <Diamond className="w-6 h-6" />, 
              'Accessories': <Wrench className="w-6 h-6" /> 
            };
            return (
              <button key={cat.name} onClick={() => navigate('shop', { category: cat.name })} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover p-4 text-left">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                  cat.name === 'Trading Cards' ? 'from-orange-100 to-red-50' :
                  cat.name === 'Gundam & Gunpla' ? 'from-blue-100 to-indigo-50' :
                  cat.name === 'Figures' ? 'from-purple-100 to-pink-50' :
                  cat.name === 'Collectibles' ? 'from-amber-100 to-yellow-50' :
                  'from-green-100 to-emerald-50'
                } flex items-center justify-center mb-3`}>
                  <span className="text-hobbyco-green group-hover:scale-110 transition-transform duration-300">{icons[cat.name]}</span>
                </div>
                <h3 className="font-bold text-hobbyco-dark text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{cat.count.toLocaleString()} Products</p>
                <span className="inline-flex items-center gap-1 text-xs text-hobbyco-orange font-bold mt-3 opacity-0 group-hover:opacity-100 transition-all">
                  Shop Now <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Flash Deals Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">Flash Deals</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs text-red-500 font-bold animate-countdown">Ends in 04:32:18</span>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('deals')} className="text-sm text-hobbyco-orange font-bold hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} variant="sale" />)}
          </div>
        </div>
      </section>

      {/* Promo Banner - HOBBYCO Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-hero-gradient rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-hobbyco-orange/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-hobbyco-purple/10 rounded-full translate-y-1/2"></div>
          
          <div className="relative z-10">
            <p className="text-hobbyco-orange text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4" /> Weekend Hobby Sale
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">Up to 30% OFF</h3>
            <p className="text-white/60 mt-1">Selected Collectibles • Limited Time</p>
          </div>
          <button onClick={() => navigate('deals')} className="relative z-10 px-8 py-3 bg-hobbyco-orange text-white font-black rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all shadow-orange-glow btn-hover-lift whitespace-nowrap">
            Shop Deals →
          </button>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Flame className="w-5 h-5 text-hobbyco-orange" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">Trending Now</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1} />)}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">New Arrivals</h2>
            </div>
            <button onClick={() => navigate('shop')} className="text-sm text-hobbyco-orange font-bold hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.length > 0 ? newArrivals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />) :
              featuredProducts.slice(4, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Rare Finds Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Diamond className="w-5 h-5 text-hobbyco-purple" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">Rare Finds</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {rareFinds.map(p => <ProductCard key={p.id} product={p} variant="rare" />)}
        </div>
      </section>

      {/* Recommendation Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-hobbyco-dark mb-2 font-display">Picked For Your Hobby</h2>
          <p className="text-sm text-gray-500 mb-8">Because you viewed Trading Cards</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.filter(p => p.category === 'Trading Cards').slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Trust Section - HOBBYCO Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark text-center mb-10 font-display">Why Shop HOBBYCO?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: <CheckCircle className="w-6 h-6" />, title: 'Verified Sellers', desc: 'All sellers are vetted', color: 'bg-green-50 text-green-600' },
            { icon: <Star className="w-6 h-6" />, title: 'Detailed Condition', desc: 'Accurate grading', color: 'bg-amber-50 text-amber-600' },
            { icon: <Shield className="w-6 h-6" />, title: 'Secure Checkout', desc: 'Encrypted payments', color: 'bg-blue-50 text-blue-600' },
            { icon: <Package className="w-6 h-6" />, title: 'Buyer Protection', desc: 'Money back guarantee', color: 'bg-purple-50 text-purple-600' },
            { icon: <Users className="w-6 h-6" />, title: 'Real Reviews', desc: 'From collectors', color: 'bg-pink-50 text-pink-600' },
          ].map(item => (
            <div key={item.title} className={`bg-white rounded-2xl border border-gray-100 p-5 text-center card-hover ${item.color.split(' ')[0]}`}>
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>{item.icon}</div>
              <h3 className="font-bold text-sm text-hobbyco-dark">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* More Than Store Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-hobbyco-dark text-center mb-10 font-display">More Than Just a Hobby Store</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <button onClick={() => navigate('shop')} className="group md:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 text-left card-hover">
            <div className="w-12 h-12 rounded-xl bg-hobbyco-cream flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-hobbyco-green" />
            </div>
            <h3 className="text-xl font-black text-hobbyco-dark font-display">SHOP</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">Find your next collectible from verified sellers across Indonesia. Thousands of products across every hobby category.</p>
          </button>
          <button onClick={() => navigate('trade-in')} className="group bg-white rounded-2xl border border-gray-100 p-8 text-left card-hover">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <ArrowLeftRight className="w-6 h-6 text-hobbyco-orange" />
            </div>
            <h3 className="text-xl font-black text-hobbyco-dark font-display">TRADE</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">Trade your collection with other collectors safely.</p>
          </button>
        </div>
        <button onClick={() => navigate('my-collection')} className="group w-full mt-6 bg-white rounded-2xl border border-gray-100 p-8 text-left card-hover">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-hobbyco-dark font-display">COLLECT</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">Build and showcase your collection.</p>
            </div>
          </div>
        </button>
      </section>

      {/* Trade-In Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-hero-gradient rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-hobbyco-orange/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-hobbyco-purple/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-hobbyco-orange/20 flex items-center justify-center mx-auto mb-4">
              <ArrowLeftRight className="w-7 h-7 text-hobbyco-orange" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">Have Something to Trade?</h2>
            <p className="text-white/60 mt-3 max-w-md mx-auto font-medium">Turn your collection into your next favorite collectible.</p>
            <button onClick={() => navigate('trade-in')} className="mt-6 px-8 py-3 bg-hobbyco-orange text-white font-bold rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all shadow-orange-glow btn-hover-lift">
              Explore Trade-In
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-hobbyco-dark font-display">From the HOBBYCO Community</h2>
            <p className="text-sm text-gray-500 mt-1">Join the conversation</p>
          </div>
          <button onClick={() => navigate('community')} className="text-sm text-hobbyco-orange font-bold hover:underline">Visit Community →</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ t: '"Is this card authentic?"', r: 24, time: '3h ago' }, { t: '"Best Gunpla under 1 million?"', r: 45, time: '6h ago' }, { t: '"How do you store your cards?"', r: 18, time: '1d ago' }, { t: '"Hot Toys vs SH Figuarts?"', r: 31, time: '2d ago' }].map(post => (
            <div key={post.t} className="bg-white rounded-xl border border-gray-100 p-4 card-hover cursor-pointer">
              <p className="text-sm font-semibold text-hobbyco-dark leading-snug">{post.t}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>{post.r} replies</span><span>·</span><span>{post.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

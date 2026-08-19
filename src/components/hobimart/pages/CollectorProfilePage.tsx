'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  UserCheck,
  MessageSquare,
  ArrowLeft,
  Repeat,
  ShoppingBag,
  Layers,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import ProductCard from '@/components/hobimart/ProductCard';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/* ── Mock Reviews for this collector ── */
const collectorReviews = [
  {
    id: 'cr1',
    reviewer: 'CardMaster99',
    rating: 5,
    date: '1 week ago',
    text: 'Kevin is a great trader! Cards were exactly as described. Fast shipping and excellent communication throughout the trade process.',
    product: 'Charizard EX',
  },
  {
    id: 'cr2',
    reviewer: 'GundamFanID',
    rating: 5,
    date: '2 weeks ago',
    text: 'Bought a Gundam kit from his collection. Box was in perfect condition, all parts sealed. Highly recommended seller and collector.',
    product: 'Gundam RG Nu Gundam',
  },
  {
    id: 'cr3',
    reviewer: 'AnimeFigureLover',
    rating: 4,
    date: '3 weeks ago',
    text: 'Smooth trade experience. Item condition was accurate. Would trade again!',
    product: 'Naruto Sage Mode Figure',
  },
  {
    id: 'cr4',
    reviewer: 'ProCollector',
    rating: 5,
    date: '1 month ago',
    text: 'One of the most reliable collectors on HobiMart. Always authentic items and fair trade values.',
    product: 'Blue-Eyes White Dragon',
  },
  {
    id: 'cr5',
    reviewer: 'HobbyBeginner',
    rating: 5,
    date: '1 month ago',
    text: 'Very helpful and patient with a beginner like me. Gave great advice on card storage. A+ community member!',
    product: 'Pikachu Illustration Rare',
  },
];

/* ── Mock Trade History ── */
const tradeHistory = [
  {
    id: 't1',
    date: 'Dec 28, 2024',
    given: 'Pikachu Illustration Rare',
    received: 'Charizard VMAX Rainbow',
    status: 'Completed' as const,
  },
  {
    id: 't2',
    date: 'Dec 15, 2024',
    given: 'Gundam HG Aerial (Built)',
    received: 'Blue-Eyes White Dragon 1st Ed',
    status: 'Completed' as const,
  },
  {
    id: 't3',
    date: 'Nov 30, 2024',
    given: 'One Piece Luffy Card',
    received: 'Spider-Man Figure',
    status: 'Completed' as const,
  },
  {
    id: 't4',
    date: 'Nov 18, 2024',
    given: 'Iron Man Mark 46 Figure',
    received: 'Gundam MGEX Unicorn',
    status: 'In Progress' as const,
  },
  {
    id: 't5',
    date: 'Nov 5, 2024',
    given: 'Naruto Sage Mode Figure',
    received: 'Charizard EX',
    status: 'Completed' as const,
  },
  {
    id: 't6',
    date: 'Oct 22, 2024',
    given: 'Gundam RG Nu Gundam',
    received: 'Pikachu Illustration Rare',
    status: 'Cancelled' as const,
  },
];

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700 border-green-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function CollectorProfilePage() {
  const { navigate, products, fetchProducts } = useAppStore();
  const [following, setFollowing] = useState(false);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const collectorProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-[hobbyco-cream]">
      {/* Back Navigation */}
      <div className="bg-white border-b border-[gray-200]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[hobbyco-orange] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* ── Profile Header Card ── */}
        <div className="bg-white rounded-2xl border border-[gray-200] p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7">
            {/* Avatar */}
            <div className="flex-shrink-0 self-start">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[hobbyco-dark] flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  KC
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-[hobbyco-dark]">
                      KevinCollector
                    </h1>
                    <Badge className="bg-[hobbyco-orange]/10 text-[hobbyco-orange] border-[hobbyco-orange]/20 hover:bg-[hobbyco-orange]/15 font-black px-2.5 py-0.5 text-xs gap-1">
                      <UserCheck className="w-3 h-3" />
                      Verified Collector
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={4.9} />
                    <span className="text-sm font-black text-[hobbyco-dark]">
                      4.9
                    </span>
                    <span className="text-xs text-gray-400">
                      (84 reviews)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 sm:flex-shrink-0">
                  <Button
                    onClick={() => setFollowing(!following)}
                    className={`${
                      following
                        ? 'bg-white text-[hobbyco-orange] border-2 border-[hobbyco-orange] hover:bg-[hobbyco-orange]/5'
                        : 'bg-[hobbyco-orange] text-white hover:bg-[hobbyco-orange-dark]'
                    } rounded-xl font-black px-5 h-10 text-sm shadow-none transition-all`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl font-black px-5 h-10 text-sm border-[gray-200] text-[hobbyco-dark] hover:bg-[hobbyco-cream] hover:border-gray-300 shadow-none"
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 sm:gap-6 mt-5 pt-5 border-t border-[gray-200]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[hobbyco-orange]/10 flex items-center justify-center">
                    <Repeat className="w-4.5 h-4.5 text-[hobbyco-orange]" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[hobbyco-dark]">127</p>
                    <p className="text-[11px] text-gray-400">Trades</p>
                  </div>
                </div>
                <div className="w-px h-9 bg-[gray-200]" />
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[hobbyco-dark]">54</p>
                    <p className="text-[11px] text-gray-400">Sales</p>
                  </div>
                </div>
                <div className="w-px h-9 bg-[gray-200]" />
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Layers className="w-4.5 h-4.5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[hobbyco-dark]">84</p>
                    <p className="text-[11px] text-gray-400">Collection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="products" className="mt-6">
          <TabsList className="bg-white border border-[gray-200] rounded-xl p-1 h-auto">
            <TabsTrigger
              value="products"
              className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[hobbyco-orange] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20 text-gray-500 data-[state=active]:border-transparent"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[hobbyco-orange] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20 text-gray-500 data-[state=active]:border-transparent"
            >
              Collection
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[hobbyco-orange] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20 text-gray-500 data-[state=active]:border-transparent"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="trade-history"
              className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[hobbyco-orange] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20 text-gray-500 data-[state=active]:border-transparent"
            >
              Trade History
            </TabsTrigger>
          </TabsList>

          {/* ── Products Tab ── */}
          <TabsContent value="products" className="mt-5">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {collectorProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          {/* ── Collection Tab ── */}
          <TabsContent value="collection" className="mt-5">
            <div className="bg-white rounded-2xl border border-[gray-200] p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-black text-[hobbyco-dark]">
                84 Items in Collection
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                View Kevin&apos;s full collection in their profile
              </p>
              <Button
                onClick={() => navigate('my-collection')}
                className="mt-4 bg-[hobbyco-orange] text-white hover:bg-[hobbyco-orange-dark] rounded-xl font-black text-sm shadow-none"
              >
                View All Items
              </Button>
            </div>
          </TabsContent>

          {/* ── Reviews Tab ── */}
          <TabsContent value="reviews" className="mt-5">
            <div className="space-y-4">
              {collectorReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border border-[gray-200] p-5 sm:p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[hobbyco-orange] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-black text-gray-600">
                          {review.reviewer.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-[hobbyco-dark]">
                          {review.reviewer}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} />
                          <span className="text-xs text-gray-400">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {review.text}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[11px] text-gray-400 border-[gray-200] font-normal"
                    >
                      About: {review.product}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── Trade History Tab ── */}
          <TabsContent value="trade-history" className="mt-5">
            <div className="bg-white rounded-2xl border border-[gray-200] overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[hobbyco-cream] hover:bg-[hobbyco-cream]">
                      <TableHead className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        Item Given
                      </TableHead>
                      <TableHead className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        Item Received
                      </TableHead>
                      <TableHead className="text-xs font-black text-gray-500 uppercase tracking-wider text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tradeHistory.map((trade) => (
                      <TableRow
                        key={trade.id}
                        className="hover:bg-[hobbyco-cream] transition-colors"
                      >
                        <TableCell className="text-sm text-gray-500 py-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-300" />
                            {trade.date}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-medium text-[hobbyco-dark]">
                            {trade.given}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-medium text-[hobbyco-orange]">
                            {trade.received}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border ${statusStyles[trade.status]}`}
                          >
                            {trade.status === 'Completed' && (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            )}
                            {trade.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-[gray-200]">
                {tradeHistory.map((trade) => (
                  <div key={trade.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {trade.date}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black border ${statusStyles[trade.status]}`}
                      >
                        {trade.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">
                          Given
                        </p>
                        <p className="text-sm font-medium text-[hobbyco-dark] truncate">
                          {trade.given}
                        </p>
                      </div>
                      <Repeat className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">
                          Received
                        </p>
                        <p className="text-sm font-medium text-[hobbyco-orange] truncate">
                          {trade.received}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

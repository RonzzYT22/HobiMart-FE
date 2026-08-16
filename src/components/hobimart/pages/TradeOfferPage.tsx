'use client';

import { useState } from 'react';
import {
  ArrowLeftRight,
  Star,
  Shield,
  MessageSquare,
  Send,
  Truck,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { products, formatPrice, getConditionColor } from '@/lib/data';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const traderRatings = [
  { label: 'Communication', rating: 4.8, reviews: 42 },
  { label: 'Condition Accuracy', rating: 4.9, reviews: 38 },
  { label: 'Shipping', rating: 4.7, reviews: 41 },
];

const receiveProduct = products.find((p) => p.id === 'p5')!;
const giveProduct = products.find((p) => p.id === 'p10')!;

function TradeProductCard({
  product,
  label,
  labelColor,
}: {
  product: (typeof products)[0];
  label: string;
  labelColor: string;
}) {
  const [imgError, setImgError] = useState(false);
  const conditionClass = getConditionColor(product.condition);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <div className={`${labelColor} px-4 py-2.5 flex items-center justify-between`}>
        <span className="text-xs font-bold text-white uppercase tracking-wider">{label}</span>
        <span className="text-xs text-white/80 font-medium">{product.seller.name}</span>
      </div>

      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {imgError ? (
          <span className="text-5xl sm:text-6xl flex items-center justify-center w-full h-full">📦</span>
        ) : (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-base font-bold text-[#1F2937]">{product.name}</h3>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${conditionClass}`}>
            <span className="mr-1">\u25CF</span>{product.condition}
          </span>
          {product.verified && (
            <span className="flex items-center gap-1 text-xs text-blue-500 font-medium">
              <Shield className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
          {product.tradeAvailable && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700">
              Trade Available
            </span>
          )}
        </div>

        <div className="flex items-end gap-2">
          <span className="text-xl font-bold text-[#1F2937]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through pb-0.5">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-[#E5E7EB] grid grid-cols-2 gap-2 text-xs text-[#64748B]">
          <div>
            <span className="text-gray-400">Brand</span>
            <p className="font-medium text-[#1F2937] mt-0.5">{product.brand}</p>
          </div>
          <div>
            <span className="text-gray-400">Category</span>
            <p className="font-medium text-[#1F2937] mt-0.5">{product.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ value, size = 'w-4 h-4' }: { value: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(value);
        const half = !filled && star === Math.ceil(value) && value % 1 >= 0.5;
        return (
          <div key={star} className="relative">
            <Star className={`${size} text-gray-200`} />
            {(filled || half) && (
              <div className="absolute inset-0 overflow-hidden" style={half ? { width: '50%' } : undefined}>
                <Star className={`${size} fill-amber-400 text-amber-400`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TradeOfferPage() {
  const { navigate } = useAppStore();
  const [cashDifference, setCashDifference] = useState(100000);
  const [includeCash, setIncludeCash] = useState(true);
  const [message, setMessage] = useState('');

  const effectiveCash = includeCash ? cashDifference : 0;
  const totalYouGive = giveProduct.price + effectiveCash;
  const isFair = Math.abs(totalYouGive - receiveProduct.price) <= 100000;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
                <BreadcrumbLink
                  onClick={() => navigate('trade-in')}
                  className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors"
                >
                  Trade-In
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E5E7EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Trade Offer
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Trade Offer</h1>
          <p className="text-sm text-[#64748B] mt-1">Review your trade proposal before sending</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
          <TradeProductCard
            product={giveProduct}
            label="You Give"
            labelColor="bg-gradient-to-r from-gray-700 to-gray-900"
          />

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 mt-[180px] z-20">
            <div className="w-12 h-12 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>

          <TradeProductCard
            product={receiveProduct}
            label="You Receive"
            labelColor="bg-gradient-to-r from-[#FF6B35] to-[#FF8F65]"
          />
        </div>

        <div className="flex md:hidden items-center justify-center -my-2 relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <span className="text-sm font-bold text-amber-600">Rp</span>
              </span>
              Add Cash Difference
            </h3>
            <button
              onClick={() => setIncludeCash(!includeCash)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${includeCash ? 'bg-[#FF6B35]' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${includeCash ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>

          {includeCash && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#1F2937] shrink-0">+</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={cashDifference}
                    onChange={(e) => setCashDifference(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Quick add:</span>
                {[50000, 100000, 200000, 500000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCashDifference(amt)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${cashDifference === amt ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]' : 'border-[#E5E7EB] text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    +{formatPrice(amt)}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#64748B]">Your item value</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(giveProduct.price)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#64748B]">Cash difference</span>
                  <span className={`text-sm font-semibold ${includeCash ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                    {includeCash ? '+ ' + formatPrice(cashDifference) : 'None'}
                  </span>
                </div>
                <div className="h-px bg-[#E5E7EB] my-2" />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#1F2937]">Total you offer</span>
                  <span className="text-base font-bold text-[#1F2937]">{formatPrice(totalYouGive)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1F2937]">Item you receive</span>
                  <span className="text-base font-bold text-[#FF6B35]">{formatPrice(receiveProduct.price)}</span>
                </div>
                {isFair && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    Fair trade - values are balanced
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 mb-6">
          <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            Message to Trader (Optional)
          </h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note about your trade offer..."
            rows={3}
            className="w-full px-4 py-3 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#1F2937]">Trader Rating</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-green-700">4.8</span>
              </div>
              <span className="text-xs text-[#64748B]">from {receiveProduct.seller.totalSales} trades</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {traderRatings.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]"
              >
                <span className="text-xs text-[#64748B] font-medium mb-2">{item.label}</span>
                <StarRating value={item.rating} />
                <span className="text-lg font-bold text-[#1F2937] mt-1.5">{item.rating}</span>
                <span className="text-xs text-gray-400 mt-0.5">{item.reviews} ratings</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-sm font-bold">
                {receiveProduct.seller.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-[#1F2937]">{receiveProduct.seller.name}</span>
                  {receiveProduct.seller.verified && (
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                <span className="text-xs text-[#64748B]">
                  {receiveProduct.seller.positiveRate}% positive
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#64748B]">
              <Truck className="w-3.5 h-3.5" />
              <span>Ships from Jakarta</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => navigate('trade-in')}
            className="px-6 py-3.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            className="flex-1 sm:flex-none px-8 py-3.5 bg-[#FF6B35] text-white text-sm font-bold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Send className="w-4 h-4" />
            Send Trade Offer
          </button>
        </div>
      </div>
    </div>
  );
}

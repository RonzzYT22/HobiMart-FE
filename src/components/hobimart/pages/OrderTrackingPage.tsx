'use client';

import { useState } from 'react';
import { ChevronRight, Package, CheckCircle2, Circle, Clock, ArrowLeft, MapPin, Truck, CreditCard, Check, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';

type StepStatus = 'completed' | 'current' | 'upcoming';

interface TimelineStep {
  title: string;
  description: string;
  timestamp: string;
  status: StepStatus;
  icon: React.ElementType;
}

const timelineSteps: TimelineStep[] = [
  {
    title: 'Order Placed',
    description: 'Your order has been placed successfully and is being processed.',
    timestamp: 'Jun 5, 2025 14:30',
    status: 'completed',
    icon: Package,
  },
  {
    title: 'Payment Confirmed',
    description: 'We have received your payment and confirmed the transaction.',
    timestamp: 'Jun 5, 2025 14:35',
    status: 'completed',
    icon: CreditCard,
  },
  {
    title: 'Processing',
    description: 'Your items are being carefully packed and prepared for shipment.',
    timestamp: 'Est. Jun 6, 2025',
    status: 'current',
    icon: Clock,
  },
  {
    title: 'Shipped',
    description: 'Your package has been handed over to the courier for delivery.',
    timestamp: '',
    status: 'upcoming',
    icon: Truck,
  },
  {
    title: 'Delivered',
    description: 'Your order has been delivered to your address.',
    timestamp: '',
    status: 'upcoming',
    icon: CheckCircle2,
  },
];

export default function OrderTrackingPage() {
  const { cart, navigate } = useAppStore();
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const handleImgError = (id: string) => setImgErrors(prev => new Set(prev).add(id));

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 45000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <button onClick={() => navigate('home')} className="hover:text-[#FF6B35] transition-colors">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:text-[#FF6B35] transition-colors cursor-pointer">Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F2937] font-medium">Order #HM-10294</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Order Tracking</h1>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FF6B35] text-xs font-bold">
                Processing
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Order <span className="font-semibold text-[#1F2937]">#HM-10294</span> · Placed on Jun 5, 2025
            </p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Timeline + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-6">Order Status</h2>

              <div className="relative">
                {timelineSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isLast = idx === timelineSteps.length - 1;

                  return (
                    <div key={step.title} className="flex gap-4 relative">
                      {/* Timeline line + dot column */}
                      <div className="flex flex-col items-center">
                        {/* Circle icon */}
                        <div
                          className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                            step.status === 'completed'
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                              : step.status === 'current'
                                ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-500/30'
                                : 'bg-gray-100 text-gray-300 border-2 border-dashed border-gray-200'
                          }`}
                        >
                          {step.status === 'completed' ? (
                            <Check className="w-5 h-5" />
                          ) : step.status === 'current' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}

                          {/* Animated pulse for current step */}
                          {step.status === 'current' && (
                            <span className="absolute inset-0 rounded-full bg-[#FF6B35] animate-ping opacity-20" />
                          )}
                        </div>

                        {/* Connecting line */}
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 min-h-[3rem] ${
                              step.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                          <h3
                            className={`text-sm font-bold ${
                              step.status === 'upcoming' ? 'text-gray-400' : 'text-[#1F2937]'
                            }`}
                          >
                            {step.title}
                          </h3>
                          {step.timestamp && (
                            <span
                              className={`text-xs ${
                                step.status === 'upcoming' ? 'text-gray-300' : 'text-gray-400'
                              }`}
                            >
                              {step.timestamp}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm mt-1 leading-relaxed ${
                            step.status === 'upcoming' ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-5">Order Details</h2>

              {/* Items list */}
              <div className="divide-y divide-[#E5E7EB]">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                      {imgErrors.has(item.product.id) ? (
                        <span className="text-xl flex items-center justify-center w-full h-full">📦</span>
                      ) : (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={() => handleImgError(item.product.id)} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1F2937] truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.product.category} · {item.product.condition} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#1F2937] shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="h-px bg-[#E5E7EB] my-5" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shipping (Express)</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(shipping)}</span>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#1F2937]">Total</span>
                  <span className="text-xl font-bold text-[#FF6B35]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Shipping Address Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Recipient</p>
                  <p className="text-sm font-semibold text-[#1F2937]">Ahmad Fauzan</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <p className="text-sm font-medium text-[#1F2937]">0812-3456-7890</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Address</p>
                  <p className="text-sm text-[#1F2937] leading-relaxed">
                    Jl. Kemang Raya No. 45, Apt. Green Garden Blok C-12
                    <br />
                    Jakarta Selatan, DKI Jakarta
                    <br />
                    12730
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#E5E7EB] my-5" />

              {/* Payment info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">Payment</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Method</span>
                  <span className="text-sm font-semibold text-[#1F2937]">QRIS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">
                    <Check className="w-3 h-3" />
                    Paid
                  </span>
                </div>
              </div>

              <div className="h-px bg-[#E5E7EB] my-5" />

              {/* Delivery info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">Delivery</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Courier</span>
                  <span className="text-sm font-semibold text-[#1F2937]">JNE Express (YES)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Est. Arrival</span>
                  <span className="text-sm font-semibold text-[#1F2937]">Jun 7, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tracking</span>
                  <span className="text-sm font-semibold text-[#FF6B35]">JNE-123456789</span>
                </div>
              </div>

              {/* Help button */}
              <button
                className="w-full mt-6 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

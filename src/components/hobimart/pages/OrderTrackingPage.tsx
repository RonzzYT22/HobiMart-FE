'use client';

import { useState } from 'react';
import {  ChevronRight, Package, CheckCircle2, Circle, Clock, ArrowLeft, MapPin, Truck, CreditCard, Check, Loader2  } from 'lucide-react';
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
    <div className="min-h-screen bg-hobbyco-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <button onClick={() => navigate('home')} className="hover:text-hobbyco-orange transition-colors font-medium">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:text-hobbyco-orange transition-colors cursor-pointer">Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-hobbyco-dark font-bold">Order #HM-10294</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">Order Tracking</h1>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-hobbyco-orange text-xs font-bold animate-pulse">
                Processing
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Order <span className="font-bold text-hobbyco-dark">#HM-10294</span> · Placed on Jun 5, 2025
            </p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-hobbyco-dark hover:bg-hobbyco-cream transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Timeline + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-black text-hobbyco-dark mb-6 font-display">Order Status</h2>

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
                                ? 'bg-hobbyco-orange text-white shadow-lg shadow-orange-glow'
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
                            <span className="absolute inset-0 rounded-full bg-hobbyco-orange animate-ping opacity-20" />
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
                              step.status === 'upcoming' ? 'text-gray-400' : 'text-hobbyco-dark'
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
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-black text-hobbyco-dark mb-5 font-display">Order Details</h2>

              {/* Items list */}
              <div className="divide-y divide-gray-100">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl bg-hobbyco-cream shrink-0 overflow-hidden">
                      {imgErrors.has(item.product.id) ? (
                        <Package className="w-6 h-6 opacity-30 mx-auto text-hobbyco-green" />
                      ) : (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={() => handleImgError(item.product.id)} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-hobbyco-dark truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.product.category} · {item.product.condition} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-black text-hobbyco-dark shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="h-px bg-gray-200 my-5"></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="text-sm font-bold text-hobbyco-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shipping (Express)</span>
                  <span className="text-sm font-bold text-hobbyco-dark">{formatPrice(shipping)}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-hobbyco-dark">Total</span>
                  <span className="text-xl font-black text-hobbyco-orange">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Shipping Address Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 sticky top-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-hobbyco-orange" />
                </div>
                <h2 className="text-lg font-black text-hobbyco-dark font-display">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Recipient</p>
                  <p className="text-sm font-bold text-hobbyco-dark">Ahmad Fauzan</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Phone</p>
                  <p className="text-sm font-medium text-hobbyco-dark">0812-3456-7890</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Address</p>
                  <p className="text-sm text-hobbyco-dark leading-relaxed">
                    Jl. Kemang Raya No. 45, Apt. Green Garden Blok C-12
                    <br />
                    Jakarta Selatan, DKI Jakarta
                    <br />
                    12730
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-5"></div>

              {/* Payment info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-hobbyco-orange" />
                </div>
                <h2 className="text-lg font-black text-hobbyco-dark font-display">Payment</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Method</span>
                  <span className="text-sm font-bold text-hobbyco-dark">QRIS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">
                    <Check className="w-3 h-3" />
                    Paid
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-5"></div>

              {/* Delivery info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-hobbyco-orange" />
                </div>
                <h2 className="text-lg font-black text-hobbyco-dark font-display">Delivery</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Courier</span>
                  <span className="text-sm font-bold text-hobbyco-dark">JNE Express (YES)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Est. Arrival</span>
                  <span className="text-sm font-bold text-hobbyco-dark">Jun 7, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Tracking</span>
                  <span className="text-sm font-bold text-hobbyco-orange">JNE-123456789</span>
                </div>
              </div>

              {/* Help button */}
              <button
                className="w-full mt-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-hobbyco-dark hover:bg-hobbyco-cream transition-colors cursor-pointer"
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

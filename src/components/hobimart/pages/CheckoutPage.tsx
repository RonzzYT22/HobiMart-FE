'use client';

import { useState } from 'react';
import {
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
  ClipboardCheck,
  Check,
  ShieldCheck,
  QrCode,
  Building2,
  Wallet,
  Landmark,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const gradientColors: Record<string, string> = {
  'Trading Cards': 'from-orange-400 to-red-400',
  'Gundam & Gunpla': 'from-blue-400 to-indigo-500',
  'Figures': 'from-purple-400 to-pink-400',
  'Collectibles': 'from-amber-400 to-yellow-400',
  'Accessories': 'from-green-400 to-emerald-500',
};
const categoryIcons: Record<string, string> = {
  'Trading Cards': '🃏',
  'Gundam & Gunpla': '🤖',
  'Figures': '🧸',
  'Collectibles': '💎',
  'Accessories': '🛠️',
};

const steps = [
  { label: 'Shipping Address', icon: MapPin },
  { label: 'Delivery', icon: Truck },
  { label: 'Payment', icon: CreditCard },
  { label: 'Review', icon: ClipboardCheck },
];

const deliveryOptions = [
  { id: 'regular', label: 'Regular', price: 20000, days: '3-5 days', icon: Truck, desc: 'Standard delivery via JNE / J&T' },
  { id: 'express', label: 'Express', price: 45000, days: '1-2 days', icon: Truck, desc: 'Fast delivery via JNE YES / SiCepat BEST' },
  { id: 'sameday', label: 'Same Day', price: 80000, days: 'Today', icon: Truck, desc: 'Same day delivery via GoSend / GrabExpress' },
];

const paymentOptions = [
  { id: 'qris', label: 'QRIS', desc: 'Scan & pay with any app', icon: QrCode, badge: null },
  { id: 'bank', label: 'Bank Transfer', desc: 'BCA / BRI / Mandiri', icon: Landmark, badge: null },
  { id: 'ewallet', label: 'E-Wallet', desc: 'GoPay / OVO / Dana', icon: Wallet, badge: null },
  { id: 'cc', label: 'Credit Card', desc: 'Visa, Mastercard, JCB', icon: CreditCard, badge: 'Popular' },
];

export default function CheckoutPage() {
  const { cart, navigate } = useAppStore();
  const [delivery, setDelivery] = useState('regular');
  const [payment, setPayment] = useState('qris');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = deliveryOptions.find(d => d.id === delivery)?.price ?? 20000;
  const total = subtotal + shippingCost;

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    navigate('order-tracking');
  };

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
            <button onClick={() => navigate('cart')} className="hover:text-[#FF6B35] transition-colors">
              Cart
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F2937] font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-6">Checkout</h1>

        {/* Step Progress Indicator */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 mb-8">
          <div className="flex items-center justify-between relative">
            {/* Connector line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 hidden sm:block" />
            <div
              className="absolute top-5 left-[10%] h-0.5 bg-[#FF6B35] hidden sm:block transition-all duration-500"
              style={{ width: '0%' }}
            />

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === 0;
              const isCompleted = false;
              return (
                <div key={step.label} className="flex flex-col items-center relative z-10 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-500/30'
                        : isActive
                          ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-500/30 ring-4 ring-[#FF6B35]/10'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold text-center hidden sm:block ${
                      isActive ? 'text-[#FF6B35]' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-gray-300 hidden sm:block">
                    Step {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address Form */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Shipping Address</h2>
                  <p className="text-xs text-gray-400">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-gray-600 text-sm">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Ahmad Fauzan"
                    value={form.fullName}
                    onChange={e => updateField('fullName', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-gray-600 text-sm">
                    Phone Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 0812-3456-7890"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="address1" className="text-gray-600 text-sm">
                    Address Line 1 <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="address1"
                    placeholder="Street address, apartment, suite, unit, building, floor, etc."
                    value={form.address1}
                    onChange={e => updateField('address1', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="address2" className="text-gray-600 text-sm">
                    Address Line 2 <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="address2"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    value={form.address2}
                    onChange={e => updateField('address2', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-gray-600 text-sm">
                    City <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. Jakarta Selatan"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>

                {/* Province */}
                <div className="space-y-1.5">
                  <Label htmlFor="province" className="text-gray-600 text-sm">
                    Province <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="province"
                    placeholder="e.g. DKI Jakarta"
                    value={form.province}
                    onChange={e => updateField('province', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>

                {/* Postal Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="postalCode" className="text-gray-600 text-sm">
                    Postal Code <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    placeholder="e.g. 12345"
                    value={form.postalCode}
                    onChange={e => updateField('postalCode', e.target.value)}
                    className="h-11 rounded-xl border-[#E5E7EB] focus-visible:border-[#FF6B35] focus-visible:ring-[#FF6B35]/20 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Delivery Method</h2>
                  <p className="text-xs text-gray-400">Choose your preferred shipping speed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deliveryOptions.map(option => {
                  const isSelected = delivery === option.id;
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setDelivery(option.id)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'border-[#FF6B35] bg-orange-50/50 shadow-sm'
                          : 'border-[#E5E7EB] bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Radio indicator */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                          }`}
                        >
                          <OptionIcon className="w-4 h-4" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-[#FF6B35]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
                        </div>
                      </div>

                      <p className={`text-sm font-bold ${isSelected ? 'text-[#1F2937]' : 'text-gray-600'}`}>
                        {option.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-orange-600/70' : 'text-gray-400'}`}>
                        {option.desc}
                      </p>

                      <div className="flex items-baseline gap-1.5 mt-3">
                        <span className={`text-base font-bold ${isSelected ? 'text-[#FF6B35]' : 'text-[#1F2937]'}`}>
                          {formatPrice(option.price)}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 font-medium ${isSelected ? 'text-orange-500' : 'text-gray-400'}`}>
                        {option.days}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Payment Method</h2>
                  <p className="text-xs text-gray-400">Select how you'd like to pay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentOptions.map(option => {
                  const isSelected = payment === option.id;
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPayment(option.id)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group flex items-center gap-4 ${
                        isSelected
                          ? 'border-[#FF6B35] bg-orange-50/50 shadow-sm'
                          : 'border-[#E5E7EB] bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                        }`}
                      >
                        <OptionIcon className="w-6 h-6" />
                      </div>

                      {/* Text + Radio */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${isSelected ? 'text-[#1F2937]' : 'text-gray-600'}`}>
                            {option.label}
                          </p>
                          {option.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-bold">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-orange-600/70' : 'text-gray-400'}`}>
                          {option.desc}
                        </p>
                      </div>

                      {/* Radio dot */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#FF6B35]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 sticky top-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-5">Order Summary</h2>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                        gradientColors[item.product.category] || 'from-gray-300 to-gray-400'
                      } flex items-center justify-center shrink-0`}
                    >
                      <span className="text-xl drop-shadow-lg">
                        {categoryIcons[item.product.category] || '📦'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1F2937] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                      <p className="text-sm font-bold text-[#1F2937] mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-[#E5E7EB] my-5" />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(shippingCost)}</span>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#1F2937]">Total</span>
                  <span className="text-xl font-bold text-[#FF6B35]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-3.5 bg-[#FF6B35] text-white text-sm font-bold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Place Order
              </button>

              {/* Trust note */}
              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                <span>Your payment is secured with 256-bit SSL encryption. HobiMart buyer protection guarantees your order.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

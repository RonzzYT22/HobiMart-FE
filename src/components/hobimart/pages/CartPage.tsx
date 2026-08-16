'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, ArrowLeft, Truck, ShieldCheck, Tag, CreditCard } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, navigate } = useAppStore();
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const handleImgError = (id: string) => setImgErrors(prev => new Set(prev).add(id));

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-400">
              <span className="text-gray-400">Home</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#1F2937] font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#FF6B35]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Your Cart is Empty</h2>
            <p className="text-gray-400 mt-2 text-base">Find something worth collecting</p>
            <button
              onClick={() => navigate('shop')}
              className="mt-8 px-8 py-3 bg-[#FF6B35] text-white text-sm font-bold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 inline-flex items-center gap-2"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <button onClick={() => navigate('home')} className="hover:text-[#FF6B35] transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F2937] font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Your Shopping Cart</h1>
            <p className="text-sm text-gray-400 mt-1">{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Desktop Table / Mobile Cards */}
          <div className="lg:col-span-2">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_44px] gap-4 px-6 py-3 bg-gray-50 rounded-t-2xl border border-[#E5E7EB] border-b-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Price</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Quantity</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Total</span>
              <span />
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-[#E5E7EB] bg-white border border-[#E5E7EB] lg:rounded-b-2xl overflow-hidden">
              {cart.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <div key={item.product.id} className="group">
                    {/* Desktop Row */}
                    <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_44px] gap-4 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      {/* Product */}
                      <button
                        onClick={() => navigate('product', { id: item.product.id })}
                        className="flex items-center gap-4 text-left"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                          {imgErrors.has(item.product.id) ? (
                            <span className="text-2xl flex items-center justify-center w-full h-full">📦</span>
                          ) : (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={() => handleImgError(item.product.id)} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1F2937] truncate group-hover:text-[#FF6B35] transition-colors">{item.product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.product.category} · {item.product.seller.name}</p>
                          <p className="text-xs text-gray-400">Condition: {item.product.condition}</p>
                        </div>
                      </button>

                      {/* Unit Price */}
                      <p className="text-sm font-semibold text-[#1F2937] text-center">{formatPrice(item.product.price)}</p>

                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#1F2937]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <p className="text-sm font-bold text-[#1F2937] text-right">{formatPrice(lineTotal)}</p>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mobile Card */}
                    <div className="lg:hidden p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate('product', { id: item.product.id })}
                          className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden"
                        >
                          {imgErrors.has(item.product.id) ? (
                            <span className="text-3xl flex items-center justify-center w-full h-full">📦</span>
                          ) : (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={() => handleImgError(item.product.id)} />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => navigate('product', { id: item.product.id })}
                              className="text-sm font-semibold text-[#1F2937] line-clamp-2 text-left hover:text-[#FF6B35] transition-colors"
                            >
                              {item.product.name}
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{item.product.seller.name} · {item.product.condition}</p>
                          <p className="text-sm font-bold text-[#1F2937] mt-1">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-[#1F2937]">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-[#FF6B35]">{formatPrice(lineTotal)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Continue Shopping */}
            <button
              onClick={() => navigate('shop')}
              className="sm:hidden mt-4 flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sticky top-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-5">Order Summary</h2>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{formatPrice(shipping)}</span>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#1F2937]">Total</span>
                  <span className="text-xl font-bold text-[#FF6B35]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('checkout')}
                className="w-full mt-6 py-3.5 bg-[#FF6B35] text-white text-sm font-bold rounded-xl hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>

              {/* Promo Code */}
              <div className="mt-5 flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                  />
                </div>
                <button className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors">
                  Apply
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Secure payment with buyer protection</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Truck className="w-4 h-4 text-[#FF6B35] shrink-0" />
                  <span>Professional packaging & tracking</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <CreditCard className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Multiple payment methods accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

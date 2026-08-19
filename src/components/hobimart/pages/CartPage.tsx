'use client';

import { useState } from 'react';
import {  Minus, Plus, Trash2, ShoppingBag, ChevronRight, ArrowLeft, Truck, ShieldCheck, Tag, CreditCard , Package } from 'lucide-react';
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
      <div className="min-h-screen bg-hobbyco-cream">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-400">
              <span className="text-gray-400">Home</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-hobbyco-dark font-bold">Shopping Cart</span>
            </nav>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6 animate-float">
              <ShoppingBag className="w-12 h-12 text-hobbyco-orange" />
            </div>
            <h2 className="text-2xl font-black text-hobbyco-dark font-display">Your Cart is Empty</h2>
            <p className="text-gray-500 mt-2 text-base font-medium">Find something worth collecting</p>
            <button
              onClick={() => navigate('shop')}
              className="mt-8 px-8 py-3 bg-hobbyco-orange text-white text-sm font-bold rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all shadow-orange-glow btn-hover-lift inline-flex items-center gap-2"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hobbyco-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <button onClick={() => navigate('home')} className="hover:text-hobbyco-orange transition-colors font-medium">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-hobbyco-dark font-bold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-hobbyco-dark font-display">Your Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-hobbyco-orange hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Desktop Table / Mobile Cards */}
          <div className="lg:col-span-2">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_44px] gap-4 px-6 py-3 bg-white rounded-t-2xl border border-gray-100 border-b-0">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Price</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Quantity</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</span>
              <span />
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-100 bg-white border border-gray-100 lg:rounded-b-2xl overflow-hidden">
              {cart.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <div key={item.product.id} className="group">
                    {/* Desktop Row */}
                    <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_44px] gap-4 items-center px-6 py-4 hover:bg-hobbyco-cream/30 transition-colors">
                      {/* Product */}
                      <button
                        onClick={() => navigate('product', { id: item.product.id })}
                        className="flex items-center gap-4 text-left"
                      >
                        <div className="w-16 h-16 rounded-xl bg-hobbyco-cream shrink-0 overflow-hidden">
                          {imgErrors.has(item.product.id) ? (
                            <Package className="w-8 h-8 opacity-30 mx-auto text-hobbyco-green" />
                          ) : (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={() => handleImgError(item.product.id)} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-hobbyco-dark truncate group-hover:text-hobbyco-orange transition-colors">{item.product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.product.category} · {item.product.seller.name}</p>
                          <p className="text-xs text-gray-400">Condition: {item.product.condition}</p>
                        </div>
                      </button>

                      {/* Unit Price */}
                      <p className="text-sm font-bold text-hobbyco-dark text-center">{formatPrice(item.product.price)}</p>

                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-black text-hobbyco-dark">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <p className="text-sm font-black text-hobbyco-dark text-right">{formatPrice(lineTotal)}</p>

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
                          className="w-20 h-20 rounded-xl bg-hobbyco-cream shrink-0 overflow-hidden"
                        >
                          {imgErrors.has(item.product.id) ? (
                            <Package className="w-10 h-10 opacity-30 mx-auto text-hobbyco-green" />
                          ) : (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={() => handleImgError(item.product.id)} />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => navigate('product', { id: item.product.id })}
                              className="text-sm font-bold text-hobbyo-dark line-clamp-2 text-left hover:text-hobbyco-orange transition-colors"
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
                          <p className="text-sm font-black text-hobbyco-dark mt-1">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-black text-hobbyco-dark">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-black text-hobbyco-orange">{formatPrice(lineTotal)}</p>
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
              className="sm:hidden mt-4 flex items-center gap-2 text-sm font-bold text-hobbyco-orange hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6 shadow-sm">
              <h2 className="text-lg font-black text-hobbyco-dark mb-5 font-display">Order Summary</h2>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="text-sm font-bold text-hobbyco-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm font-bold text-hobbyco-dark">{formatPrice(shipping)}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-hobbyco-dark">Total</span>
                  <span className="text-xl font-black text-hobbyco-orange">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('checkout')}
                className="w-full mt-6 py-3.5 bg-hobbyco-orange text-white text-sm font-bold rounded-xl hover:bg-hobbyco-orange-dark active:scale-[0.98] transition-all shadow-orange-glow btn-hover-lift flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Promo Code */}
              <div className="mt-5 flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-hobbyco-orange focus:ring-2 focus:ring-hobbyco-orange/20 transition-all"
                  />
                </div>
                <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-hobbyco-dark hover:bg-hobbyco-cream transition-colors">
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
                  <Truck className="w-4 h-4 text-hobbyco-orange shrink-0" />
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

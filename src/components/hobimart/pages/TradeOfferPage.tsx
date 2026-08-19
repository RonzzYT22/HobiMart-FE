'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, Star, Shield, MessageSquare, Send, Truck, Package,
  Search, Loader2, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import * as api from '@/lib/api';
import { formatPrice, getConditionColor } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
} from '@/components/ui/breadcrumb';

function TradeProductCard({ product, label, labelColor }: { product: any; label: string; labelColor: string }) {
  const [imgError, setImgError] = useState(false);
  const conditionClass = product?.condition ? getConditionColor(product.condition) : '';

  return (
    <div className="bg-white rounded-2xl border border-[gray-200] overflow-hidden">
      <div className={`${labelColor} px-4 py-2.5 flex items-center justify-between`}>
        <span className="text-xs font-black text-white uppercase tracking-wider">{label}</span>
      </div>
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {imgError ? (
          <Package className="w-16 h-16 opacity-30 mx-auto" />
        ) : (
          <img src={product?.image || product?.product?.image} alt={product?.name || product?.product?.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-base font-black text-[hobbyco-dark]">{product?.name || product?.product?.name || 'Unknown'}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {product?.condition && (
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${conditionClass}`}>
              <span className="mr-1">{'\u25CF'}</span>{product.condition}
            </span>
          )}
          {product?.grade && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-50 text-amber-700">{product.grade}</span>
          )}
        </div>
        <div className="flex items-end gap-2">
          <span className="text-xl font-black text-[hobbyco-dark]">{formatPrice(product?.price || product?.product?.price || 0)}</span>
        </div>
      </div>
    </div>
  );
}

export default function TradeOfferPage() {
  const { navigate, auth, collections, trades, fetchCollections, fetchTrades, createTrade } = useAppStore();
  const [step, setStep] = useState<'select' | 'offer' | 'sent'>('select');
  const [myItem, setMyItem] = useState<any>(null);
  const [theirProduct, setTheirProduct] = useState<any>(null);
  const [targetUserId, setTargetUserId] = useState<number>(0);
  const [cashDifference, setCashDifference] = useState(0);
  const [includeCash, setIncludeCash] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tradeResult, setTradeResult] = useState<any>(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchCollections();
      fetchTrades();
    }
  }, []);

  // Parse URL params for product SKU and target user
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sku = urlParams.get('sku');
    const userId = urlParams.get('userId');
    if (sku) loadProductBySku(sku);
    if (userId) setTargetUserId(parseInt(userId));
  }, []);

  const loadProductBySku = async (sku: string) => {
    try {
      const res = await api.apiGetProduct(sku);
      setTheirProduct(res);
    } catch { /* ignore */ }
  };

  const handleSendTrade = async () => {
    if (!myItem || !targetUserId) { alert('Pilih item dari koleksi dan target user'); return; }
    setLoading(true);
    try {
      const data: any = {
        my_collection_id: myItem.id,
        receiver_id: targetUserId,
        cash_difference: includeCash ? cashDifference : 0,
      };
      if (theirProduct?.id) data.receiver_product_id = theirProduct.id;
      if (message) data.message = message;
      const res = await createTrade(data);
      setTradeResult(res);
      setStep('sent');
    } catch (e: any) {
      alert(e?.message || 'Gagal mengirim trade offer');
    }
    setLoading(false);
  };

  // Filter collections that are public and suitable for trade
  const publicCollections = (collections || []).filter((c: any) => c.is_public);

  if (step === 'sent') {
    return (
      <div className="min-h-screen bg-[hobbyco-cream] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-black text-[hobbyco-dark] mb-2">Trade Offer Sent!</h2>
          <p className="text-sm text-gray-400 mb-6">Trade kamu sudah dikirim ke receiver. Mereka akan menerima notifikasi.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('transactions')} className="bg-[hobbyco-orange] hover:bg-[hobbyco-orange-dark] text-white rounded-xl">Lihat Riwayat</Button>
            <Button onClick={() => { setStep('select'); setMyItem(null); }} variant="outline" className="rounded-xl">Trade Baru</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hobbyco-cream]">
      <div className="bg-white border-b border-[gray-200]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer text-[gray-500] hover:text-[hobbyco-orange] transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[gray-200]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[hobbyco-dark] font-black">Trade Offer</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[hobbyco-dark]">Trade Offer</h1>
          <p className="text-sm text-[gray-500] mt-1">Tukar koleksi kamu dengan koleksi orang lain</p>
        </div>

        {/* Step 1: Pilih item dari koleksi */}
        <div className="bg-white rounded-2xl border border-[gray-200] p-5 sm:p-6 mb-6">
          <h3 className="text-base font-black text-[hobbyco-dark] mb-4">1. Pilih Item dari Koleksi Kamu</h3>
          {publicCollections.length === 0 ? (
            <div className="text-center py-6">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Belum ada item di koleksi. Tambah dulu di My Collection.</p>
              <Button onClick={() => navigate('my-collection')} variant="outline" className="mt-3 rounded-xl text-sm">Buka My Collection</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {publicCollections.map((c: any) => (
                <button key={c.id} onClick={() => setMyItem(c)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    myItem?.id === c.id ? 'border-[hobbyco-orange] bg-orange-50' : 'border-[gray-200] hover:border-gray-300'}`}>
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    {c.product?.image ? <img src={c.product.image} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 opacity-30 mx-auto" />}
                  </div>
                  <p className="text-xs font-black text-[hobbyco-dark] line-clamp-1">{c.product?.name}</p>
                  <p className="text-[10px] text-gray-400">{c.condition}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Target user */}
        <div className="bg-white rounded-2xl border border-[gray-200] p-5 sm:p-6 mb-6">
          <h3 className="text-base font-black text-[hobbyco-dark] mb-4">2. Penerima Trade (User ID)</h3>
          <Input type="number" value={targetUserId || ''} onChange={e => setTargetUserId(parseInt(e.target.value) || 0)}
            placeholder="Masukkan ID user tujuan" className="rounded-xl max-w-xs" />
        </div>

        {/* Preview */}
        {myItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <TradeProductCard product={myItem} label="You Give" labelColor="bg-[hobbyco-orange]" />
            <TradeProductCard product={theirProduct} label="You Receive" labelColor="bg-[hobbyco-dark]" />
          </div>
        )}

        {/* Cash difference */}
        {myItem && (
          <div className="bg-white rounded-2xl border border-[gray-200] p-5 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-[hobbyco-dark]">Tambahkan Cash Difference</h3>
              <button onClick={() => setIncludeCash(!includeCash)}
                className={`w-11 h-6 rounded-full transition-colors ${includeCash ? 'bg-[hobbyco-orange]' : 'bg-gray-300'}`}>
                <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${includeCash ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {includeCash && (
              <div className="space-y-3">
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                  <input type="number" value={cashDifference} onChange={e => setCashDifference(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-[gray-200] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hobbyco-orange]/20 font-black" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Quick:</span>
                  {[50000, 100000, 200000, 500000].map(amt => (
                    <button key={amt} onClick={() => setCashDifference(amt)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border ${cashDifference === amt ? 'border-[hobbyco-orange] bg-orange-50 text-[hobbyco-orange]' : 'border-[gray-200] text-gray-500 hover:border-gray-300'}`}>
                      +{formatPrice(amt)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {myItem && (
          <div className="bg-white rounded-2xl border border-[gray-200] p-5 sm:p-6 mb-6">
            <h3 className="text-base font-black text-[hobbyco-dark] flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-gray-400" /> Pesan (Opsional)
            </h3>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Tambahkan catatan untuk trade offer..."
              rows={3} className="w-full px-4 py-3 text-sm border border-[gray-200] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hobbyco-orange]/20 resize-none" />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button onClick={() => navigate('trade-in')} variant="outline" className="px-6 py-3.5 rounded-xl text-sm font-black order-2 sm:order-1">
            Cancel
          </Button>
          <Button onClick={handleSendTrade} disabled={!myItem || !targetUserId || loading}
            className="flex-1 sm:flex-none px-8 py-3.5 bg-[hobbyco-orange] text-white text-sm font-black rounded-xl hover:bg-[hobbyco-orange-dark] disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Kirim Trade Offer
          </Button>
        </div>
      </div>
    </div>
  );
}
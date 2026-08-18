'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, ShoppingBag, Search, ChevronDown, Download,
  Clock, Package, Truck, CheckCircle, XCircle, AlertCircle, MessageSquare,
  Filter, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
} from '@/components/ui/breadcrumb';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  // order statuses
  'Placed': { label: 'Placed', color: 'bg-blue-100 text-blue-700', icon: Clock },
  'Processing': { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Package },
  'Shipped': { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  'Delivered': { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'Cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
  'Refunded': { label: 'Refunded', color: 'bg-red-100 text-red-700', icon: XCircle },
  // trade statuses
  'pending': { label: 'Pending', color: 'bg-blue-100 text-blue-700', icon: Clock },
  'negotiating': { label: 'Negotiating', color: 'bg-yellow-100 text-yellow-700', icon: MessageSquare },
  'agreed': { label: 'Agreed', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
  'shipped_initiator': { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  'shipped_receiver': { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
  'disputed': { label: 'Disputed', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

export default function TransactionsPage() {
  const { navigate, auth, transactions, transactionsTotal, transactionsHasMore, fetchTransactions } = useAppStore();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!auth.isAuthenticated) { navigate('login'); return; }
    loadTransactions();
  }, [page, typeFilter, statusFilter]);

  const loadTransactions = async () => {
    const params: Record<string, string> = {
      page: String(page), limit: '20',
    };
    if (typeFilter !== 'all') params.type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    await fetchTransactions(params);
  };

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return <Badge variant="outline" className="text-xs">{status}</Badge>;
    const Icon = cfg.icon;
    return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>;
  };

  const handleExport = async () => {
    const { apiExportTransactions } = await import('@/lib/api');
    const token = auth.token;
    if (!token) return;
    try {
      const blob = await apiExportTransactions(token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `riwayat-transaksi-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Gagal export'); }
  };

  const TYPES = [
    { value: 'all', label: 'All' },
    { value: 'buy', label: 'Buy', icon: ShoppingBag },
    { value: 'trade', label: 'Trade', icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E5E7EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#111827] font-semibold">Riwayat Transaksi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Riwayat Transaksi</h1>
            <p className="text-sm text-[#64748B] mt-1">{transactionsTotal} total transaksi</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="rounded-xl text-sm border-[#E5E7EB]">
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Type tabs */}
          <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => { setTypeFilter(t.value); setPage(1); }}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  typeFilter === t.value ? 'bg-[#FF6B35] text-white shadow-sm' : 'text-gray-500 hover:text-[#1F2937]'}`}>
                {t.icon && <t.icon className="w-3.5 h-3.5" />}{t.label}
              </button>
            ))}
          </div>
          {/* Status filter */}
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20">
            <option value="">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-5">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Belum ada transaksi</h3>
              <p className="text-sm text-gray-400 mt-1.5">Riwayat pembelian dan trade akan muncul di sini</p>
            </div>
          ) : (
            transactions.map((tx: any) => (
              <div key={tx.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'trade' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                      {tx.type === 'trade' ? <ArrowLeftRight className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1F2937]">
                          {tx.type === 'buy' ? `Order ${tx.orderNumber}` : `Trade #${tx.tradeId}`}
                        </span>
                        {getStatusBadge(tx.status)}
                      </div>
                      {/* Items summary */}
                      {tx.type === 'buy' ? (
                        <p className="text-xs text-gray-400 mt-1">
                          {tx.items?.map((i: any) => i.name).join(', ') || '-'}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">
                          My: {tx.myItem?.product?.name || '-'} ↔ Their: {tx.theirItem?.product?.name || '-'}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Right side */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#1F2937]">
                      {tx.type === 'buy' ? formatPrice(tx.total) : (
                        tx.cashDifference !== 0 ? `${tx.cashDifference < 0 ? '-' : '+'}${formatPrice(Math.abs(tx.cashDifference))}` : 'Trade Murni'
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {transactionsHasMore && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => setPage(p => p + 1)} className="rounded-xl text-sm">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
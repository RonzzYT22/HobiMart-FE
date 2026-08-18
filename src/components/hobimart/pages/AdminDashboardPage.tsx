'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Package, ShoppingBag, DollarSign, ArrowLeftRight, TrendingUp, ChevronRight,
  Search, Shield, Ban, CheckCircle, XCircle, AlertCircle, Trash2, Edit3, Truck,
  Download, Filter, RefreshCw, BarChart3, PieChart, Activity } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import * as api from '@/lib/api';
import { formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF6B35', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'trades', label: 'Trades', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Analytics', icon: Activity },
];

export default function AdminDashboardPage() {
  const { auth, navigate } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Overview data
  const [overview, setOverview] = useState<any>(null);
  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderSearch, setOrderSearch] = useState('');
  // Trades
  const [trades, setTrades] = useState<any[]>([]);
  const [tradesTotal, setTradesTotal] = useState(0);
  const [tradeSearch, setTradeSearch] = useState('');
  // Analytics
  const [charts, setCharts] = useState<any>(null);
  const [categories, setCategories] = useState<any>(null);
  const [sellers, setSellers] = useState<any>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) { navigate('login'); return; }
    loadTab(activeTab);
  }, [activeTab]);

  const loadTab = async (tab: string) => {
    setLoading(true);
    setError('');
    const token = auth.token!;
    try {
      switch (tab) {
        case 'overview': {
          const [o, c, s] = await Promise.all([
            api.apiAdminAnalytics(token, 'overview'),
            api.apiAdminAnalytics(token, 'categories'),
            api.apiAdminAnalytics(token, 'sellers'),
          ]);
          setOverview(o);
          setCategories(c);
          setSellers(s);
          break;
        }
        case 'users': {
          const res = await api.apiAdminGetUsers(token, userSearch ? { search: userSearch } : {});
          setUsers(res.items || []);
          setUsersTotal(res.total || 0);
          break;
        }
        case 'products': {
          const res = await api.apiAdminGetProducts(token, productSearch ? { search: productSearch } : {});
          setProducts(res.items || []);
          setProductsTotal(res.total || 0);
          break;
        }
        case 'orders': {
          const res = await api.apiAdminGetOrders(token, orderSearch ? { search: orderSearch } : {});
          setOrders(res.items || []);
          setOrdersTotal(res.total || 0);
          break;
        }
        case 'trades': {
          const res = await api.apiAdminGetTrades(token, tradeSearch ? { search: tradeSearch } : {});
          setTrades(res.items || []);
          setTradesTotal(res.total || 0);
          break;
        }
        case 'analytics': {
          const [ch] = await Promise.all([
            api.apiAdminAnalytics(token, 'charts'),
          ]);
          setCharts(ch);
          break;
        }
      }
    } catch (err: any) {
      setError(err?.error?.message || 'Failed to load');
    }
    setLoading(false);
  };

  const handleBanUser = async (id: number, ban: boolean) => {
    await api.apiAdminUpdateUser(auth.token!, id, { is_banned: ban });
    loadTab('users');
  };
  const handleVerifySeller = async (id: number) => {
    await api.apiAdminUpdateUser(auth.token!, id, { is_verified_seller: true });
    loadTab('users');
  };
  const handleVerifyProduct = async (id: number) => {
    await api.apiAdminUpdateProduct(auth.token!, id, { verified: true });
    loadTab('products');
  };
  const handleBulkVerify = async () => {
    const ids = products.filter(p => !p.verified).map(p => p.id);
    if (ids.length === 0) return alert('Semua produk sudah verified');
    await api.apiAdminBulkVerifyProducts(auth.token!, ids);
    loadTab('products');
  };
  const handleRefundOrder = async (id: number) => {
    if (!confirm('Proses refund?')) return;
    await api.apiAdminRefundOrder(auth.token!, id);
    loadTab('orders');
  };
  const handleForceCompleteTrade = async (id: number) => {
    await api.apiAdminForceCompleteTrade(auth.token!, id);
    loadTab('trades');
  };
  const handleForceCancelTrade = async (id: number) => {
    await api.apiAdminForceCancelTrade(auth.token!, id);
    loadTab('trades');
  };
  const handleResolveDispute = async (id: number, resolution: 'complete' | 'cancel') => {
    await api.apiAdminResolveDispute(auth.token!, id, resolution);
    loadTab('trades');
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">HobiMart management</p>
          </div>
          <button onClick={() => navigate('home')} className="text-sm text-[#FF6B35] font-semibold hover:underline flex items-center gap-1">
            Back to Store <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-white border border-[#E5E7EB] text-gray-500 hover:border-gray-300'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
          <button onClick={() => loadTab(activeTab)} className="ml-auto p-2.5 rounded-xl text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-red-500 text-center py-10">{error}</p>}

        {!loading && !error && (
          <>
            {/* ===== OVERVIEW ===== */}
            {activeTab === 'overview' && overview && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={<DollarSign className="w-5 h-5" />} label="GMV" value={`Rp ${(overview.gmv?.current || 0).toLocaleString('id-ID')}`} change={overview.gmv?.change} color="bg-green-50 text-green-600" />
                  <StatCard icon={<ArrowLeftRight className="w-5 h-5" />} label="Trade Volume" value={overview.tradeVolume?.current || 0} change={overview.tradeVolume?.change} color="bg-purple-50 text-purple-600" />
                  <StatCard icon={<Users className="w-5 h-5" />} label="New Users" value={overview.newUsers?.current || 0} change={overview.newUsers?.change} color="bg-blue-50 text-blue-600" />
                  <StatCard icon={<Activity className="w-5 h-5" />} label="Active Users" value={overview.activeUsers || 0} color="bg-orange-50 text-orange-600" />
                </div>

                {/* Categories */}
                {categories && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                      <h3 className="text-base font-bold text-[#1F2937] mb-4">Top Categories (Sales)</h3>
                      <div className="space-y-3">
                        {categories.sales?.slice(0, 8).map((c: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{c.category}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#FF6B35] rounded-full" style={{ width: `${Math.min(100, (c.total_sold / (categories.sales[0]?.total_sold || 1)) * 100)}%` }} /></div>
                              <span className="text-sm font-semibold text-[#1F2937] w-12 text-right">{c.total_sold}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                      <h3 className="text-base font-bold text-[#1F2937] mb-4">Top Sellers (Revenue)</h3>
                      <div className="space-y-3">
                        {sellers?.byRevenue?.slice(0, 8).map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{s.name?.charAt(0)}</div>
                              <span className="text-sm font-medium text-[#1F2937]">{s.name}</span>
                            </div>
                            <span className="text-sm font-semibold">{formatPrice(s.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== USERS ===== */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadTab('users')} className="pl-9 h-10 rounded-xl" />
                  </div>
                  <Button onClick={() => loadTab('users')} className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-xl text-sm">Search</Button>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-[#E5E7EB] bg-gray-50">
                        <th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Role</th><th className="p-3 font-medium">Seller</th><th className="p-3 font-medium">Banned</th><th className="p-3 font-medium">Actions</th>
                      </tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-b border-[#F1F5F9] hover:bg-gray-50">
                            <td className="p-3 font-semibold text-[#1F2937]">{u.name}</td>
                            <td className="p-3 text-gray-500">{u.email}</td>
                            <td className="p-3"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
                            <td className="p-3">{u.isVerifiedSeller ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}</td>
                            <td className="p-3">{u.isBanned ? <Badge className="bg-red-100 text-red-700 text-xs">Banned</Badge> : <span className="text-xs text-gray-400">-</span>}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                {!u.isVerifiedSeller && <button onClick={() => handleVerifySeller(u.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600" title="Verify Seller"><Shield className="w-3.5 h-3.5" /></button>}
                                <button onClick={() => handleBanUser(u.id, !u.isBanned)} className={`p-1.5 rounded-lg hover:bg-red-50 ${u.isBanned ? 'text-red-500' : 'text-gray-400 hover:text-red-600'}`} title={u.isBanned ? 'Unban' : 'Ban'}>
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 text-xs text-gray-400 border-t border-[#E5E7EB]">{usersTotal} total users</div>
                </div>
              </div>
            )}

            {/* ===== PRODUCTS ===== */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadTab('products')} className="pl-9 h-10 rounded-xl" />
                  </div>
                  <Button onClick={() => loadTab('products')} className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-xl text-sm">Search</Button>
                  <Button onClick={handleBulkVerify} variant="outline" className="rounded-xl text-sm border-green-300 text-green-600 hover:bg-green-50">
                    <CheckCircle className="w-4 h-4 mr-1" /> Verify All
                  </Button>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-[#E5E7EB] bg-gray-50">
                        <th className="p-3 font-medium">Product</th><th className="p-3 font-medium">Seller</th><th className="p-3 font-medium">Price</th><th className="p-3 font-medium">Stock</th><th className="p-3 font-medium">Sold</th><th className="p-3 font-medium">Verified</th><th className="p-3 font-medium">Trade</th><th className="p-3 font-medium">Action</th>
                      </tr></thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id} className="border-b border-[#F1F5F9] hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {p.image && <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />}
                                <div><p className="font-semibold text-[#1F2937] text-xs">{p.name}</p><p className="text-[10px] text-gray-400">{p.sku}</p></div>
                              </div>
                            </td>
                            <td className="p-3 text-xs text-gray-500">{p.seller?.name || '-'}</td>
                            <td className="p-3 text-xs font-semibold">{formatPrice(p.price)}</td>
                            <td className="p-3 text-xs">{p.stock}</td>
                            <td className="p-3 text-xs">{p.sold}</td>
                            <td className="p-3">{p.verified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}</td>
                            <td className="p-3">{p.tradeAvailable ? <Badge className="bg-purple-100 text-purple-700 text-xs">Yes</Badge> : <span className="text-xs text-gray-400">-</span>}</td>
                            <td className="p-3">
                              {!p.verified && <button onClick={() => handleVerifyProduct(p.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600" title="Verify"><Shield className="w-3.5 h-3.5" /></button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 text-xs text-gray-400 border-t border-[#E5E7EB]">{productsTotal} total products</div>
                </div>
              </div>
            )}

            {/* ===== ORDERS ===== */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search orders..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadTab('orders')} className="pl-9 h-10 rounded-xl" />
                  </div>
                  <Button onClick={() => loadTab('orders')} className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-xl text-sm">Search</Button>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-[#E5E7EB] bg-gray-50">
                        <th className="p-3 font-medium">Order #</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Payment</th><th className="p-3 font-medium">Tracking</th><th className="p-3 font-medium">Action</th>
                      </tr></thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-[#F1F5F9] hover:bg-gray-50">
                            <td className="p-3 font-semibold text-[#1F2937] text-xs">{o.orderNumber}</td>
                            <td className="p-3 text-xs text-gray-500">{o.customer?.name || '-'}</td>
                            <td className="p-3 text-xs font-semibold">{formatPrice(o.total)}</td>
                            <td className="p-3"><Badge className="text-xs">{o.status}</Badge></td>
                            <td className="p-3"><Badge className={`text-xs ${o.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paymentStatus}</Badge></td>
                            <td className="p-3 text-xs text-gray-400">{o.trackingNumber || '-'}</td>
                            <td className="p-3">
                              {o.paymentStatus === 'Paid' && o.status !== 'Refunded' && (
                                <button onClick={() => handleRefundOrder(o.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Refund">
                                  <DollarSign className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 text-xs text-gray-400 border-t border-[#E5E7EB]">{ordersTotal} total orders</div>
                </div>
              </div>
            )}

            {/* ===== TRADES ===== */}
            {activeTab === 'trades' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search trades..." value={tradeSearch} onChange={e => setTradeSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadTab('trades')} className="pl-9 h-10 rounded-xl" />
                  </div>
                  <Button onClick={() => loadTab('trades')} className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-xl text-sm">Search</Button>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-[#E5E7EB] bg-gray-50">
                        <th className="p-3 font-medium">ID</th><th className="p-3 font-medium">Initiator</th><th className="p-3 font-medium">Receiver</th><th className="p-3 font-medium">Cash Diff</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Actions</th>
                      </tr></thead>
                      <tbody>
                        {trades.map(t => (
                          <tr key={t.id} className="border-b border-[#F1F5F9] hover:bg-gray-50">
                            <td className="p-3 text-xs font-semibold text-[#1F2937]">#{t.id}</td>
                            <td className="p-3 text-xs text-gray-500">{t.initiator?.name}</td>
                            <td className="p-3 text-xs text-gray-500">{t.receiver?.name}</td>
                            <td className="p-3 text-xs font-semibold">{t.cashDifference !== 0 ? formatPrice(t.cashDifference) : 'Trade murni'}</td>
                            <td className="p-3">
                              <Badge className={`text-xs ${
                                t.status === 'completed' ? 'bg-green-100 text-green-700' :
                                t.status === 'disputed' ? 'bg-orange-100 text-orange-700' :
                                t.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'}`}>{t.status}</Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                {t.status === 'disputed' && (
                                  <>
                                    <button onClick={() => handleResolveDispute(t.id, 'complete')} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600" title="Complete"><CheckCircle className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleResolveDispute(t.id, 'cancel')} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Cancel"><XCircle className="w-3.5 h-3.5" /></button>
                                  </>
                                )}
                                {t.status !== 'completed' && t.status !== 'cancelled' && t.status !== 'disputed' && (
                                  <>
                                    <button onClick={() => handleForceCompleteTrade(t.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600" title="Force Complete"><CheckCircle className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleForceCancelTrade(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Force Cancel"><XCircle className="w-3.5 h-3.5" /></button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 text-xs text-gray-400 border-t border-[#E5E7EB]">{tradesTotal} total trades</div>
                </div>
              </div>
            )}

            {/* ===== ANALYTICS ===== */}
            {activeTab === 'analytics' && charts && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  <h3 className="text-base font-bold text-[#1F2937] mb-4">GMV (6 Bulan)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={charts.gmv}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={(v: any) => `Rp${(Number(v)/1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(v: any) => [`Rp ${Number(v).toLocaleString('id-ID')}`, 'GMV']} />
                      <Bar dataKey="gmv" fill="#FF6B35" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                    <h3 className="text-base font-bold text-[#1F2937] mb-4">Orders per Bulan</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={charts.orders}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                    <h3 className="text-base font-bold text-[#1F2937] mb-4">Trades per Bulan</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={charts.trades}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <Tooltip />
                        <Line type="monotone" dataKey="trades" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  <h3 className="text-base font-bold text-[#1F2937] mb-4">New Users per Bulan</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={charts.users}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                      <Tooltip />
                      <Bar dataKey="users" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color }: { icon: React.ReactNode; label: string; value: string | number; change?: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <p className="text-xs text-gray-400">{label}</p>
        {change !== undefined && (
          <span className={`text-xs font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
}
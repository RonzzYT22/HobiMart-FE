'use client';

import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
  productsByCategory: Record<string, number>;
  recentUsers: { id: number; name: string; email: string; role: string; created_at: string }[];
  recentOrders: { id: number; order_number: string; total: number; status: string; user: { name: string } }[];
}

export default function AdminDashboardPage() {
  const { auth, navigate } = useAppStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('login');
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          setError('Admin access required');
          return;
        }
        throw await res.json();
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.error?.message || 'Failed to load dashboard');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button onClick={() => navigate('home')} className="bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#E55A2B]">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">HobiMart management overview</p>
          </div>
          <button onClick={() => navigate('home')} className="text-sm text-[#FF6B35] font-semibold hover:underline flex items-center gap-1">
            Back to Store <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-50 text-blue-600" />
          <StatCard icon={<Package className="w-5 h-5" />} label="Total Products" value={stats?.totalProducts || 0} color="bg-orange-50 text-orange-600" />
          <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={stats?.totalOrders || 0} color="bg-green-50 text-green-600" />
          <StatCard icon={<DollarSign className="w-5 h-5" />} label="Revenue" value={`Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`} color="bg-purple-50 text-purple-600" />
        </div>

        {/* Products by Category */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Products by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {data?.productsByCategory && Object.entries(data.productsByCategory).map(([cat, count]) => (
              <div key={cat} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#1F2937]">{count}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{cat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-[#E5E7EB]">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentUsers?.map(user => (
                  <tr key={user.id} className="border-b border-[#F1F5F9]">
                    <td className="py-3 font-semibold text-[#1F2937]">{user.name}</td>
                    <td className="py-3 text-gray-500">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-[#E5E7EB]">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map(order => (
                  <tr key={order.id} className="border-b border-[#F1F5F9]">
                    <td className="py-3 font-semibold text-[#1F2937]">{order.order_number}</td>
                    <td className="py-3 text-gray-500">{order.user?.name}</td>
                    <td className="py-3 font-semibold">Rp {order.total?.toLocaleString('id-ID')}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, X, Calendar, Sparkles,
  Heart, Bot, Gem, Diamond, Wrench,
  Layers, Package, Edit3, Trash2, Eye, EyeOff,
  Save, Upload } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import * as api from '@/lib/api';
import { formatPrice, products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
} from '@/components/ui/breadcrumb';

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  'Trading Cards': Heart, 'Gundam & Gunpla': Bot, 'Figures': Gem,
  'Collectibles': Diamond, 'Accessories': Wrench,
};
const CATEGORY_COLORS: Record<string, string> = {
  'Trading Cards': 'bg-orange-50 text-orange-600', 'Gundam & Gunpla': 'bg-blue-50 text-blue-600',
  'Figures': 'bg-purple-50 text-purple-600', 'Collectibles': 'bg-amber-50 text-amber-600',
  'Accessories': 'bg-green-50 text-green-600',
};

const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

function getConditionColor(c: string) {
  const map: Record<string, string> = {
    'Mint': 'bg-green-100 text-green-700', 'Near Mint': 'bg-emerald-100 text-emerald-700',
    'Excellent': 'bg-blue-100 text-blue-700', 'Very Good': 'bg-teal-100 text-teal-700',
    'Good': 'bg-amber-100 text-amber-700', 'Fair': 'bg-orange-100 text-orange-700',
    'Poor': 'bg-red-100 text-red-700',
  };
  return map[c] || 'bg-gray-100 text-gray-700';
}

export default function MyCollectionPage() {
  const { navigate, auth, collections, fetchCollections, addCollection, updateCollection, removeCollection } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    product_id: 0, condition: 'Good', grade: '', purchase_price: '',
    purchase_date: '', notes: '', is_public: true, images: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCollections(); }, []);

  const collectionProducts = collections || [];

  const categories = useMemo(() => {
    const cats = ['Trading Cards', 'Gundam & Gunpla', 'Figures', 'Collectibles', 'Accessories'];
    return cats.map(cat => ({
      name: cat,
      count: collectionProducts.filter((p: any) => p.product?.category === cat).length,
      icon: CATEGORY_ICONS[cat] || Heart,
      bgColor: CATEGORY_COLORS[cat]?.split(' ')[0] || 'bg-gray-50',
      textColor: CATEGORY_COLORS[cat]?.split(' ')[1] || 'text-gray-600',
    }));
  }, [collectionProducts]);

  const filteredItems = useMemo(() => {
    return collectionProducts.filter((item: any) => {
      const matchesCategory = selectedCategory === 'All' || item.product?.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, collectionProducts]);

  const resetForm = () => {
    setForm({ product_id: 0, condition: 'Good', grade: '', purchase_price: '',
      purchase_date: '', notes: '', is_public: true, images: [] });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.product_id) return;
    setLoading(true);
    try {
      const data: any = {
        product_id: form.product_id,
        condition: form.condition,
        is_public: form.is_public,
      };
      if (form.grade) data.grade = form.grade;
      if (form.purchase_price) data.purchase_price = parseInt(form.purchase_price as string);
      if (form.purchase_date) data.purchase_date = form.purchase_date;
      if (form.notes) data.notes = form.notes;
      if (editingId) await updateCollection(editingId, data);
      else await addCollection(data);
      setShowForm(false);
      resetForm();
    } catch (e: any) { alert(e?.message || 'Gagal menyimpan'); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus item dari koleksi?')) return;
    await removeCollection(id);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      product_id: item.product_id,
      condition: item.condition || 'Good',
      grade: item.grade || '',
      purchase_price: item.purchase_price ? String(item.purchase_price) : '',
      purchase_date: item.purchase_date || '',
      notes: item.notes || '',
      is_public: item.is_public ?? true,
      images: item.images || [],
    });
    setShowForm(true);
  };

  // upload images via existing upload API
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !auth.token) return;
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const res = await api.apiUpload(auth.token, files[i]);
        if (res.url) uploaded.push(res.url);
      } catch { /* ignore */ }
    }
    setForm(f => ({ ...f, images: [...f.images, ...uploaded] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E5E7EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#111827] font-semibold">My Collection</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* ── Title + Add Button ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
                <Sparkles className="w-6 h-6 text-[#FF6B35] inline" /> My Collection
              </h1>
              <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-full bg-[#FF6B35] text-white text-xs font-bold px-2">
                {collectionProducts.length} Items
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">Your personal hobby collection showcase</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-sm px-5 py-2.5">
            <Plus className="w-4 h-4 mr-1.5" /> Add Item
          </Button>
        </div>

        {/* ── Add / Edit Form ── */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 mb-6">
            <h3 className="text-base font-bold text-[#1F2937] mb-4">
              {editingId ? 'Edit Collection Item' : 'Add New Collection Item'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product ID */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Product ID (dari katalog)</label>
                <Input type="number" value={form.product_id || ''} onChange={e => setForm(f => ({ ...f, product_id: parseInt(e.target.value) || 0 }))}
                  placeholder="Masukkan ID produk dari katalog" className="rounded-xl" />
              </div>
              {/* Condition */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Condition</label>
                <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20">
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Grade */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Grade (optional)</label>
                <Input value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                  placeholder="e.g. PSA 10, BGS 9.5" className="rounded-xl" />
              </div>
              {/* Purchase Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Purchase Price (Rp)</label>
                <Input type="number" value={form.purchase_price} onChange={e => setForm(f => ({ ...f, purchase_price: e.target.value }))}
                  placeholder="Harga beli" className="rounded-xl" />
              </div>
              {/* Purchase Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Purchase Date</label>
                <Input type="date" value={form.purchase_date} onChange={e => setForm(f => ({ ...f, purchase_date: e.target.value }))}
                  className="rounded-xl" />
              </div>
              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Catatan pribadi" className="rounded-xl" />
              </div>
              {/* Public */}
              <div className="flex items-center gap-3 pt-5">
                <button onClick={() => setForm(f => ({ ...f, is_public: !f.is_public }))}
                  className={`w-11 h-6 rounded-full transition-colors ${form.is_public ? 'bg-[#FF6B35]' : 'bg-gray-300'}`}>
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${form.is_public ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-gray-600">{form.is_public ? 'Public' : 'Private'}</span>
              </div>
              {/* Images */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Images</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 border border-dashed border-[#E5E7EB] rounded-xl text-sm text-gray-500 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors">
                    <Upload className="w-4 h-4 inline mr-1" />Upload
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {form.images.length > 0 && (
                    <span className="text-xs text-gray-400">{form.images.length} image(s)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={handleSubmit} disabled={loading} className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl">
                <Save className="w-4 h-4 mr-1" /> {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={() => { setShowForm(false); resetForm(); }} variant="outline" className="rounded-xl border-[#E5E7EB]">Cancel</Button>
            </div>
          </div>
        )}

        {/* ── Category Breakdown Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
              className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group ${
                selectedCategory === cat.name ? 'border-[#FF6B35] bg-[#FF6B35]/5 ring-1 ring-[#FF6B35]/20' : 'border-[#E5E7EB] bg-white hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${cat.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {(() => { const Icon = cat.icon; return <Icon className="w-6 h-6" />; })()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">{cat.name}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${cat.textColor}`}>{cat.count}<span className="text-xs font-normal text-gray-400 ml-1">items</span></p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B35] transition-all ${selectedCategory === cat.name ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* ── Search & Filter ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search your collection..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#FF6B35]/20 focus-visible:border-[#FF6B35]" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...categories.map(c => c.name)].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-white border border-[#E5E7EB] text-gray-500 hover:border-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Gallery Grid ── */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-12 h-12 opacity-30 mx-auto" />
                  )}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${getConditionColor(item.condition)}`}>
                      ● {item.condition}
                    </span>
                  </div>
                  {!item.is_public && (
                    <div className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">Private</div>
                  )}
                  <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
                      <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    {item.product?.category || '-'}
                  </p>
                  <h3 className="text-sm font-semibold text-[#1F2937] mt-0.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                    {item.product?.name || 'Unknown'}
                  </h3>
                  {item.grade && <p className="text-xs text-[#FF6B35] font-bold mt-1">{item.grade}</p>}
                  <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[11px]">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-5">
              <Layers className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">No items found</h3>
            <p className="text-sm text-gray-400 mt-1.5 max-w-sm mx-auto">
              {searchQuery ? `No items matching "${searchQuery}"` : `No items in ${selectedCategory} category`}
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} variant="outline" className="mt-5 rounded-xl font-semibold text-sm">
              <X className="w-3.5 h-3.5 mr-1.5" /> Clear Filters
            </Button>
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Showing {filteredItems.length} of {collectionProducts.length} items</p>
          </div>
        )}
      </div>
    </div>
  );
}
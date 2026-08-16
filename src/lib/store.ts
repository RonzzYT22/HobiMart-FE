import { create } from 'zustand';
import type { Product, CartItem } from './data';
import * as api from './api';

export type Page =
  | 'home' | 'shop' | 'search' | 'deals' | 'category' | 'product'
  | 'cart' | 'checkout' | 'order-tracking' | 'wishlist'
  | 'trade-in' | 'trade-offer' | 'collector-profile' | 'my-collection'
  | 'community' | 'notifications' | 'messages' | 'reviews'
  | 'login' | 'register' | 'profile';

interface AuthState {
  token: string | null;
  user: { id: number; name: string; email: string | null; phone: string | null; avatar: string | null } | null;
  isAuthenticated: boolean;
}

interface AppState {
  // navigation
  page: Page;
  pageParams: Record<string, string>;

  // auth
  auth: AuthState;
  login: (data: { login: string; password: string }) => Promise<void>;
  register: (data: { name: string; email?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;

  // cart (local)
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;

  // wishlist (API-backed)
  wishlist: string[];
  wishlistItems: Product[];
  wishlistTotal: number;
  wishlistPriceDropCount: number;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => void;

  // products
  products: Product[];
  productsTotal: number;
  selectedProduct: Product | null;
  featuredProducts: Product[];
  flashDeals: Product[];
  loading: boolean;
  fetchProducts: (params?: Record<string, string>) => Promise<void>;
  fetchProduct: (sku: string) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchFlashDeals: () => Promise<void>;

  // categories
  categories: { name: string; icon: string; count: number; color: string }[];
  brands: { name: string; count: number }[];
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;

  // search
  searchQuery: string;
  popularSearches: string[];
  setSearchQuery: (q: string) => void;
  fetchPopularSearches: () => Promise<void>;

  // orders
  orders: unknown[];
  selectedOrder: unknown | null;
  fetchOrders: () => Promise<void>;
  fetchOrderDetail: (orderNumber: string) => Promise<void>;
  createOrder: (data: Record<string, unknown>) => Promise<unknown>;
  payOrder: (orderNumber: string) => Promise<void>;

  // notifications
  notifications: unknown[];
  unreadCount: number;
  fetchNotifications: (params?: Record<string, string>) => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // conversations
  conversations: unknown[];
  selectedConversation: unknown | null;
  messages: unknown[];
  fetchConversations: () => Promise<void>;
  fetchMessages: (convId: number) => Promise<void>;
  sendMessage: (convId: number, text: string) => Promise<void>;

  // trade-ins
  tradeIns: unknown[];
  fetchTradeIns: (status?: string) => Promise<void>;

  // community
  posts: unknown[];
  selectedPost: unknown | null;
  fetchPosts: (category?: string) => Promise<void>;
  fetchPost: (id: number) => Promise<void>;

  // geo
  provinces: { id: number; name: string }[];
  cities: { id: number; name: string }[];
  fetchProvinces: () => Promise<void>;
  fetchCities: (provinceId: number) => Promise<void>;

  // delivery & payment
  deliveryOptions: { id: string; label: string; price: number; days: string }[];
  paymentMethods: { id: string; label: string; desc: string; badge: string | null }[];
  fetchDeliveryOptions: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;

  // UI
  cartOpen: boolean;
  notifOpen: boolean;
  selectedCategory: string;
  navigate: (page: Page, params?: Record<string, string>) => void;
  setSelectedCategory: (c: string) => void;
  setCartOpen: (open: boolean) => void;
  setNotifOpen: (open: boolean) => void;
}

function getInitialAuth(): AuthState {
  const token = api.getToken();
  return { token, user: null, isAuthenticated: !!token };
}

export const useAppStore = create<AppState>((set, get) => ({
  page: 'home',
  pageParams: {},
  auth: getInitialAuth(),

  // ========== Auth ==========
  login: async (data) => {
    const res = await api.apiLogin(data);
    api.setToken(res.token);
    set({ auth: { token: res.token, user: res.user, isAuthenticated: true } });
  },
  register: async (data) => {
    const res = await api.apiRegister(data);
    api.setToken(res.token);
    set({ auth: { token: res.token, user: res.user, isAuthenticated: true } });
  },
  logout: async () => {
    const token = get().auth.token;
    if (token) await api.apiLogout(token).catch(() => {});
    api.removeToken();
    set({ auth: { token: null, user: null, isAuthenticated: false }, cart: [], wishlist: [] });
  },
  fetchMe: async () => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiMe(token);
      set({ auth: { ...get().auth, user: res.user || res } });
    } catch { /* ignore */ }
  },

  // ========== Cart (local) ==========
  cart: [],
  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find(i => i.product.id === product.id);
    if (existing) {
      set({ cart: cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => set({ cart: get().cart.filter(i => i.product.id !== productId) }),
  updateCartQty: (productId, qty) => {
    if (qty <= 0) { get().removeFromCart(productId); return; }
    set({ cart: get().cart.map(i => i.product.id === productId ? { ...i, quantity: qty } : i) });
  },

  // ========== Wishlist ==========
  wishlist: [],
  wishlistItems: [],
  wishlistTotal: 0,
  wishlistPriceDropCount: 0,
  fetchWishlist: async () => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetWishlist(token);
      set({
        wishlistItems: res.items || [],
        wishlistTotal: res.totalValue || 0,
        wishlistPriceDropCount: res.priceDropCount || 0,
        wishlist: (res.items || []).map((i: Product) => i.id),
      });
    } catch { /* ignore */ }
  },
  toggleWishlist: async (productId) => {
    const { wishlist, auth } = get();
    if (!auth.token) return;
    if (wishlist.includes(productId)) {
      try {
        await api.apiRemoveFromWishlist(auth.token, parseInt(productId));
        set({ wishlist: wishlist.filter(id => id !== productId) });
      } catch { /* ignore */ }
    } else {
      try {
        await api.apiAddToWishlist(auth.token, parseInt(productId));
        set({ wishlist: [...wishlist, productId] });
      } catch { /* ignore */ }
    }
  },

  // ========== Products ==========
  products: [],
  productsTotal: 0,
  selectedProduct: null,
  featuredProducts: [],
  flashDeals: [],
  loading: false,
  fetchProducts: async (params) => {
    set({ loading: true });
    try {
      const res = await api.apiGetProducts(params);
      set({ products: res.items || res.data || [], productsTotal: res.total || 0, loading: false });
    } catch { set({ loading: false }); }
  },
  fetchProduct: async (sku) => {
    set({ loading: true });
    try {
      const res = await api.apiGetProduct(sku);
      set({ selectedProduct: res, loading: false });
    } catch { set({ loading: false }); }
  },
  fetchFeatured: async () => {
    try {
      const res = await api.apiGetFeatured();
      // backend returns {trending: [], newArrivals: [], rareFinds: [], recommendations: []}
      const flat = Array.isArray(res) ? res : [
        ...(res.trending || []),
        ...(res.newArrivals || []),
        ...(res.rareFinds || []),
        ...(res.recommendations || []),
      ];
      set({ featuredProducts: flat });
    } catch { /* ignore */ }
  },
  fetchFlashDeals: async () => {
    try {
      const res = await api.apiGetFlashDeals();
      // backend returns {items: [], total, page, ...}
      set({ flashDeals: res.items || res || [] });
    } catch { /* ignore */ }
  },

  // ========== Categories ==========
  categories: [],
  brands: [],
  fetchCategories: async () => {
    try {
      const res = await api.apiGetCategories();
      const data = Array.isArray(res) ? res : (res.data || res.categories || []);
      set({ categories: data });
    } catch { /* ignore */ }
  },
  fetchBrands: async () => {
    try {
      const res = await api.apiGetBrands();
      const data = Array.isArray(res) ? res : (res.data || res.brands || []);
      set({ brands: data });
    } catch { /* ignore */ }
  },

  // ========== Search ==========
  searchQuery: '',
  popularSearches: [],
  setSearchQuery: (q) => set({ searchQuery: q }),
  fetchPopularSearches: async () => {
    try {
      const res = await api.apiGetPopularSearches();
      const data = Array.isArray(res) ? res : (res.data || res.terms || []);
      set({ popularSearches: data });
    } catch { /* ignore */ }
  },

  // ========== Orders ==========
  orders: [],
  selectedOrder: null,
  fetchOrders: async () => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetOrders(token);
      set({ orders: res.items || [] });
    } catch { /* ignore */ }
  },
  fetchOrderDetail: async (orderNumber) => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetOrderDetail(token, orderNumber);
      set({ selectedOrder: res });
    } catch { /* ignore */ }
  },
  createOrder: async (data) => {
    const token = get().auth.token;
    if (!token) throw new Error('Harus login');
    const res = await api.apiCreateOrder(token, data);
    return res;
  },
  payOrder: async (orderNumber) => {
    const token = get().auth.token;
    if (!token) throw new Error('Harus login');
    await api.apiPayOrder(token, orderNumber);
    await get().fetchOrders();
  },

  // ========== Notifications ==========
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async (params) => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetNotifications(token, params);
      set({ notifications: res.items || [], unreadCount: res.unreadCount || 0 });
    } catch { /* ignore */ }
  },
  markNotificationRead: async (id) => {
    const token = get().auth.token;
    if (!token) return;
    await api.apiMarkNotificationRead(token, id);
    await get().fetchNotifications();
  },
  markAllNotificationsRead: async () => {
    const token = get().auth.token;
    if (!token) return;
    await api.apiMarkAllNotificationsRead(token);
    await get().fetchNotifications();
  },

  // ========== Conversations ==========
  conversations: [],
  selectedConversation: null,
  messages: [],
  fetchConversations: async () => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetConversations(token);
      set({ conversations: res.items || [] });
    } catch { /* ignore */ }
  },
  fetchMessages: async (convId) => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetMessages(token, convId);
      set({ selectedConversation: res, messages: res.messages || [] });
    } catch { /* ignore */ }
  },
  sendMessage: async (convId, text) => {
    const token = get().auth.token;
    if (!token) return;
    await api.apiSendMessage(token, convId, text);
    await get().fetchMessages(convId);
  },

  // ========== Trade-ins ==========
  tradeIns: [],
  fetchTradeIns: async (status) => {
    const token = get().auth.token;
    if (!token) return;
    try {
      const res = await api.apiGetTradeIns(token, status);
      set({ tradeIns: res.items || [] });
    } catch { /* ignore */ }
  },

  // ========== Community ==========
  posts: [],
  selectedPost: null,
  fetchPosts: async (category) => {
    try {
      const res = await api.apiGetPosts(category);
      set({ posts: res.data || [] });
    } catch { /* ignore */ }
  },
  fetchPost: async (id) => {
    try {
      const res = await api.apiGetPost(id);
      set({ selectedPost: res });
    } catch { /* ignore */ }
  },

  // ========== Geo ==========
  provinces: [],
  cities: [],
  fetchProvinces: async () => {
    try {
      const res = await api.apiGetProvinces();
      set({ provinces: res.provinces || res || [] });
    } catch { /* ignore */ }
  },
  fetchCities: async (provinceId) => {
    try {
      const res = await api.apiGetCities(provinceId);
      set({ cities: res.cities || res || [] });
    } catch { /* ignore */ }
  },

  // ========== Delivery & Payment ==========
  deliveryOptions: [],
  paymentMethods: [],
  fetchDeliveryOptions: async () => {
    try {
      const res = await api.apiGetDeliveryOptions();
      set({ deliveryOptions: res.options || [] });
    } catch { /* ignore */ }
  },
  fetchPaymentMethods: async () => {
    try {
      const res = await api.apiGetPaymentMethods();
      set({ paymentMethods: res.methods || [] });
    } catch { /* ignore */ }
  },

  // ========== UI ==========
  cartOpen: false,
  notifOpen: false,
  selectedCategory: '',
  navigate: (page, params = {}) => set({ page, pageParams: params }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setCartOpen: (open) => set({ cartOpen: open }),
  setNotifOpen: (open) => set({ notifOpen: open }),
}));
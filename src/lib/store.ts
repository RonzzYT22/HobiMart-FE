import { create } from 'zustand';
import type { Product, CartItem } from './data';
import { products } from './data';

export type Page =
  | 'home'
  | 'shop'
  | 'search'
  | 'deals'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'wishlist'
  | 'trade-in'
  | 'trade-offer'
  | 'collector-profile'
  | 'my-collection'
  | 'community'
  | 'notifications'
  | 'messages'
  | 'reviews';

interface AppState {
  page: Page;
  pageParams: Record<string, string>;
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  selectedCategory: string;
  cartOpen: boolean;
  notifOpen: boolean;
  navigate: (page: Page, params?: Record<string, string>) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  toggleWishlist: (productId: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  setCartOpen: (open: boolean) => void;
  setNotifOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  page: 'home',
  pageParams: {},
  cart: [
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 1 },
    { product: products[9], quantity: 2 },
  ],
  wishlist: ['p1', 'p5', 'p11'],
  searchQuery: '',
  selectedCategory: '',
  cartOpen: false,
  notifOpen: false,
  navigate: (page, params = {}) => set({ page, pageParams: params }),
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
  toggleWishlist: (productId) => {
    const { wishlist } = get();
    set({ wishlist: wishlist.includes(productId) ? wishlist.filter(id => id !== productId) : [...wishlist, productId] });
  },
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setCartOpen: (open) => set({ cartOpen: open }),
  setNotifOpen: (open) => set({ notifOpen: open }),
}));
/**
 * HobiMart API Service
 * Semua fungsi untuk komunikasi dengan backend Laravel
 */
import type { Product, Seller, Notification, Message, CommunityPost } from './data';

// di dev mode, panggil backend via Next.js rewrite (same origin, no CORS)
const API = '/api';

// ========== Auth ==========

// ambil CSRF cookie dulu sebelum login/register
async function getCsrf() {
  await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
  // baca XSRF-TOKEN cookie untuk dikirim sebagai header
  const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
  if (token) {
    (window as any).__csrfToken = decodeURIComponent(token.split('=')[1]);
  }
}

function csrfHeaders(): Record<string, string> {
  const token = (window as any).__csrfToken;
  return token ? { 'X-XSRF-TOKEN': token } : {};
}

export async function apiRegister(data: { name: string; email?: string; phone?: string; password: string; password_confirmation: string }) {
  await getCsrf();
  const res = await fetch(`${API}/auth/register`, {
      method: 'POST', headers: { ...csrfHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data), credentials: 'include',
    });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiLogin(data: { login: string; password: string }) {
  await getCsrf();
  // tentukan apakah login pakai email atau phone
  const isEmail = data.login.includes('@');
  const body: Record<string, string> = { password: data.password };
  if (isEmail) body.email = data.login;
  else body.phone = data.login;

  const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { ...csrfHeaders(), 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body), credentials: 'include',
    });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiRefresh(token: string) {
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiLogout(token: string) {
  await fetch(`${API}/auth/logout`, {
    method: 'POST', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
}

export async function apiMe(token: string) {
  const res = await fetch(`${API}/me`, {
    headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiUpdateProfile(token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API}/me`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Products ==========
export async function apiGetProducts(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API}/products${qs}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiGetProduct(sku: string) {
  const res = await fetch(`${API}/products/${sku}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiGetFeatured() {
  const res = await fetch(`${API}/products/featured`);
  return res.json();
}

export async function apiGetFlashDeals() {
  const res = await fetch(`${API}/products/flash-deals`);
  return res.json();
}

export async function apiGetRelatedProducts(sku: string) {
  const res = await fetch(`${API}/products/${sku}/related`);
  return res.json();
}

export async function apiCreateProduct(token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API}/products`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiUpdateProduct(token: string, sku: string, data: Record<string, unknown>) {
  const res = await fetch(`${API}/products/${sku}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiDeleteProduct(token: string, sku: string) {
  const res = await fetch(`${API}/products/${sku}`, {
    method: 'DELETE', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Categories & Brands ==========
export async function apiGetCategories() {
  const res = await fetch(`${API}/categories`);
  return res.json();
}

export async function apiGetSubcategories(category: string) {
  const res = await fetch(`${API}/categories/${category}/subcategories`);
  return res.json();
}

export async function apiGetBrands() {
  const res = await fetch(`${API}/brands`);
  return res.json();
}

// ========== Search ==========
export async function apiGetPopularSearches() {
  const res = await fetch(`${API}/search/popular`);
  return res.json();
}

// ========== Wishlist ==========
export async function apiGetWishlist(token: string, sort?: string) {
  const qs = sort ? `?sort=${sort}` : '';
  const res = await fetch(`${API}/wishlist${qs}`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiAddToWishlist(token: string, productId: number) {
  const res = await fetch(`${API}/wishlist`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiRemoveFromWishlist(token: string, productId: number) {
  const res = await fetch(`${API}/wishlist/${productId}`, {
    method: 'DELETE', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiCheckWishlist(token: string, productIds: number[]) {
  const res = await fetch(`${API}/wishlist/check?product_ids=${productIds.join(',')}`, {
    headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Orders ==========
export async function apiCreateOrder(token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiGetOrders(token: string) {
  const res = await fetch(`${API}/orders`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiGetOrderDetail(token: string, orderNumber: string) {
  const res = await fetch(`${API}/orders/${orderNumber}`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiPayOrder(token: string, orderNumber: string) {
  const res = await fetch(`${API}/orders/${orderNumber}/pay`, {
    method: 'POST', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiTrackOrder(orderNumber: string) {
  const res = await fetch(`${API}/orders/tracking/${orderNumber}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Delivery & Payment ==========
export async function apiGetDeliveryOptions() {
  const res = await fetch(`${API}/delivery/options`);
  return res.json();
}

export async function apiGetPaymentMethods() {
  const res = await fetch(`${API}/payment/methods`);
  return res.json();
}

// ========== Promo ==========
export async function apiValidatePromo(code: string, total: number) {
  const res = await fetch(`${API}/promo/validate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ code, total }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Upload ==========
export async function apiUpload(token: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API}/upload`, {
    method: 'POST', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: formData,
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiUploadMultiple(token: string, files: File[]) {
  const formData = new FormData();
  files.forEach(f => formData.append('files[]', f));
  const res = await fetch(`${API}/upload/multiple`, {
    method: 'POST', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: formData,
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Notifications ==========
export async function apiGetNotifications(token: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API}/notifications${qs}`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiMarkNotificationRead(token: string, id: number) {
  const res = await fetch(`${API}/notifications/${id}/read`, {
    method: 'PATCH', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiMarkAllNotificationsRead(token: string) {
  const res = await fetch(`${API}/notifications/read-all`, {
    method: 'PATCH', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Conversations ==========
export async function apiGetConversations(token: string) {
  const res = await fetch(`${API}/conversations`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiCreateConversation(token: string, userId: number) {
  const res = await fetch(`${API}/conversations`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiGetMessages(token: string, convId: number) {
  const res = await fetch(`${API}/conversations/${convId}`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiSendMessage(token: string, convId: number, text: string) {
  const res = await fetch(`${API}/conversations/${convId}/messages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Trade-in ==========
export async function apiGetTradeIns(token: string, status?: string) {
  const qs = status ? `?status=${status}` : '';
  const res = await fetch(`${API}/trade-ins${qs}`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiCreateTradeIn(token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API}/trade-ins`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiAcceptTradeIn(token: string, id: number) {
  const res = await fetch(`${API}/trade-ins/${id}/accept`, {
    method: 'PATCH', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiRejectTradeIn(token: string, id: number) {
  const res = await fetch(`${API}/trade-ins/${id}/reject`, {
    method: 'PATCH', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Community ==========
export async function apiGetPosts(category?: string) {
  const qs = category ? `?category=${category}` : '';
  const res = await fetch(`${API}/community/posts${qs}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiGetPost(id: number) {
  const res = await fetch(`${API}/community/posts/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiCreatePost(token: string, data: { title: string; content: string; category?: string }) {
  const res = await fetch(`${API}/community/posts`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiAddComment(token: string, postId: number, content: string) {
  const res = await fetch(`${API}/community/posts/${postId}/comments`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiLikePost(postId: number) {
  const res = await fetch(`${API}/community/posts/${postId}/like`, {
    method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Admin ==========
export async function apiGetAdminStats(token: string) {
  const res = await fetch(`${API}/admin/stats`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiVerifySeller(token: string, userId: number) {
  const res = await fetch(`${API}/admin/verify-seller/${userId}`, {
    method: 'PATCH', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Seller ==========
export async function apiGetSellerStats(token: string) {
  const res = await fetch(`${API}/seller/stats`, { headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Shipping ==========
export async function apiGenerateShippingLabel(token: string, orderNumber: string) {
  const res = await fetch(`${API}/orders/${orderNumber}/shipping-label`, {
    method: 'POST', headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ========== Geo ==========
export async function apiGetProvinces() {
  const res = await fetch(`${API}/geo/provinces`);
  return res.json();
}

export async function apiGetCities(provinceId: number) {
  const res = await fetch(`${API}/geo/provinces/${provinceId}/cities`);
  return res.json();
}

// ========== Helpers ==========
const isBrowser = typeof window !== 'undefined';

export function getToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  if (!isBrowser) return;
  localStorage.setItem('token', token);
}

export function removeToken() {
  if (!isBrowser) return;
  localStorage.removeItem('token');
}
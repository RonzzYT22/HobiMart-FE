'use client';

import { useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/hobimart/Navbar';
import Footer from '@/components/hobimart/Footer';
import MobileNav from '@/components/hobimart/MobileNav';
import HomePage from '@/components/hobimart/pages/HomePage';
import ShopPage from '@/components/hobimart/pages/ShopPage';
import SearchPage from '@/components/hobimart/pages/SearchPage';
import ProductDetailPage from '@/components/hobimart/pages/ProductDetailPage';
import CartPage from '@/components/hobimart/pages/CartPage';
import CheckoutPage from '@/components/hobimart/pages/CheckoutPage';
import OrderTrackingPage from '@/components/hobimart/pages/OrderTrackingPage';
import WishlistPage from '@/components/hobimart/pages/WishlistPage';
import TradeInPage from '@/components/hobimart/pages/TradeInPage';
import TradeOfferPage from '@/components/hobimart/pages/TradeOfferPage';
import TransactionsPage from '@/components/hobimart/pages/TransactionsPage';
import CollectorProfilePage from '@/components/hobimart/pages/CollectorProfilePage';
import MyCollectionPage from '@/components/hobimart/pages/MyCollectionPage';
import CommunityPage from '@/components/hobimart/pages/CommunityPage';
import NotificationsPage from '@/components/hobimart/pages/NotificationsPage';
import MessagesPage from '@/components/hobimart/pages/MessagesPage';
import DealsPage from '@/components/hobimart/pages/DealsPage';
import LoginPage from '@/components/hobimart/pages/LoginPage';
import RegisterPage from '@/components/hobimart/pages/RegisterPage';
import ProfilePage from '@/components/hobimart/pages/ProfilePage';

import AdminDashboardPage from '@/components/hobimart/pages/AdminDashboardPage';

// halaman yang butuh login
const authPages = ['checkout', 'my-collection', 'trade-in', 'trade-offer', 'wishlist', 'notifications', 'messages', 'profile', 'order-tracking', 'transactions'];

export default function Home() {
  const { page, auth, fetchMe, navigate } = useAppStore();

  // auto-hydrate user data on mount (refresh-safe)
  useEffect(() => {
    if (auth.isAuthenticated) fetchMe();
  }, []);

  const renderPage = () => {
    // auth guard: redirect ke login kalau belum login
    if (authPages.includes(page) && !auth.isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Login Required</h2>
            <p className="text-gray-400 mb-6">You need to sign in to access this page</p>
            <button onClick={() => navigate('login')} className="bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#E55A2B] transition-colors">
              Sign In
            </button>
          </div>
        </div>
      );
    }

    switch (page) {
      case 'home': return <HomePage />;
      case 'shop':
      case 'category': return <ShopPage />;
      case 'search': return <SearchPage />;
      case 'product': return <ProductDetailPage />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'order-tracking': return <OrderTrackingPage />;
      case 'wishlist': return <WishlistPage />;
      case 'trade-in': return <TradeInPage />;
      case 'trade-offer': return <TradeOfferPage />;
            case 'transactions': return <TransactionsPage />;
            case 'collector-profile': return <CollectorProfilePage />;
      case 'my-collection': return <MyCollectionPage />;
      case 'community': return <CommunityPage />;
      case 'notifications': return <NotificationsPage />;
      case 'messages': return <MessagesPage />;
      case 'deals': return <DealsPage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'profile': return <ProfilePage />;
      case 'admin-dashboard': return <AdminDashboardPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0" key={page}>{renderPage()}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

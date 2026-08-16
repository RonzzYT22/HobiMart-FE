'use client';

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
import CollectorProfilePage from '@/components/hobimart/pages/CollectorProfilePage';
import MyCollectionPage from '@/components/hobimart/pages/MyCollectionPage';
import CommunityPage from '@/components/hobimart/pages/CommunityPage';
import NotificationsPage from '@/components/hobimart/pages/NotificationsPage';
import MessagesPage from '@/components/hobimart/pages/MessagesPage';
import DealsPage from '@/components/hobimart/pages/DealsPage';

export default function Home() {
  const { page } = useAppStore();

  const renderPage = () => {
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
      case 'collector-profile': return <CollectorProfilePage />;
      case 'my-collection': return <MyCollectionPage />;
      case 'community': return <CommunityPage />;
      case 'notifications': return <NotificationsPage />;
      case 'messages': return <MessagesPage />;
      case 'deals': return <DealsPage />;
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

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { HomeView } from './components/home/HomeView';
import { SearchView } from './components/catalog/SearchView';
import { ProductDetailView } from './components/catalog/ProductDetailView';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderConfirmationView } from './components/orders/OrderConfirmationView';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { OrdersView } from './components/orders/OrdersView';
import { WishlistView } from './components/profile/WishlistView';
import { ProfileView } from './components/profile/ProfileView';
import { SellerView } from './components/seller/SellerView';
import { AdminView } from './components/admin/AdminView';
import { SupportView } from './components/support/SupportView';
import { ImportResellHubView } from './components/reseller/ImportResellHubView';
import { ProductShareModal } from './components/reseller/ProductShareModal';
import { AppleStoreHubView } from './components/catalog/AppleStoreHubView';

// Push Notification UI Components
import { PushNotificationToast } from './components/notifications/PushNotificationToast';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AppLogoModal } from './components/common/AppLogoModal';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    toastMessage, 
    pushNotificationToast, 
    dismissPushToast,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    shareModalProduct,
  } = useApp();

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'orders':
        return <OrdersView />;
      case 'wishlist':
        return <WishlistView />;
      case 'profile':
        return <ProfileView />;
      case 'seller-dashboard':
        return <SellerView />;
      case 'import-resell':
        return <ImportResellHubView />;
      case 'apple-store':
      case 'apple-hub':
        return <AppleStoreHubView />;
      case 'admin-dashboard':
        return <AdminView />;
      case 'support':
        return <SupportView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {renderActiveView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Navigation (Visible on mobile/tablet screens) */}
      <MobileNav />

      {/* Real-time Push Notification Floating HUD Banner */}
      <PushNotificationToast
        notification={pushNotificationToast}
        onDismiss={dismissPushToast}
      />

      {/* Full Notification Center Slide-over Drawer & Preferences */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {/* Official App Logos & Brand Suite Modal */}
      <AppLogoModal />

      {/* Global Product Sourcing & Social Selling Share Modal */}
      <ProductShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={shareModalProduct}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

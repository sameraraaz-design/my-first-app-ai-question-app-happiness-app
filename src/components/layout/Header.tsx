import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Bell, 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  Store, 
  SlidersHorizontal,
  LogOut,
  Package,
  HelpCircle,
  X,
  Palette,
  Mic,
  Share2
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { VoiceSearchModal } from '../catalog/VoiceSearchModal';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    role,
    setRole,
    user,
    cartCount,
    wishlist,
    unreadNotificationsCount,
    notifications,
    markNotificationRead,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    userPincode,
    setUserPincode,
    setAuthModalOpen,
    products,
    setSelectedProductId,
    setIsNotificationDrawerOpen,
    trackSearch,
    currentAppLogoUrl,
    setIsAppLogoModalOpen,
    showToast,
  } = useApp();

  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [tempPincode, setTempPincode] = useState(userPincode);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  const handleVoiceSearchResult = (transcript: string) => {
    const clean = transcript.trim();
    if (!clean) return;
    setSearchQuery(clean);
    trackSearch(clean);
    setShowSuggestions(false);
    setActiveView('search');
    showToast(`Voice Search: "${clean}"`);
  };

  // Instant autocomplete
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const matches = products
        .filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
        .map(p => p.title)
        .slice(0, 5);
      setSearchSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      trackSearch(searchQuery.trim());
    }
    setShowSuggestions(false);
    setActiveView('search');
  };

  const handleSelectSuggestion = (title: string) => {
    setSearchQuery(title);
    trackSearch(title);
    setShowSuggestions(false);
    const matched = products.find(p => p.title === title);
    if (matched) {
      setSelectedProductId(matched.id);
      setActiveView('product-detail');
    } else {
      setActiveView('search');
    }
  };

  const handleSavePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPincode.length === 6 && /^\d+$/.test(tempPincode)) {
      setUserPincode(tempPincode);
      setShowPincodeModal(false);
    }
  };

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Mobiles',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Grocery',
    'Beauty',
    'Sports'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner - Bharat Cart Assurance & Role Switcher */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-amber-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Bharat Assured Genuine
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">Fast Delivery across 19,000+ Indian Pincodes</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Role Switcher for instant testing */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold px-1.5">View As:</span>
              <button
                id="role-btn-customer"
                onClick={() => {
                  setRole('CUSTOMER');
                  setActiveView('home');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  role === 'CUSTOMER' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                id="role-btn-seller"
                onClick={() => {
                  setRole('SELLER');
                  setActiveView('seller-portal');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  role === 'SELLER' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Seller Hub
              </button>
              <button
                id="role-btn-admin"
                onClick={() => {
                  setRole('ADMIN');
                  setActiveView('admin-portal');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  role === 'ADMIN' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            <button
              id="top-bar-import-resell-btn"
              onClick={() => setActiveView('import-resell')}
              className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors flex items-center text-[11px] bg-emerald-950/70 hover:bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-500/40"
              title="Import Products from other apps and resell on WhatsApp"
            >
              <Share2 className="w-3 h-3 mr-1 text-emerald-400" /> Import & Resell
            </button>

            <button
              id="top-bar-app-logos-btn"
              onClick={() => setIsAppLogoModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center text-[11px] bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-amber-400/30"
              title="Open Official Bharat Cart App Logos & Brand Suite"
            >
              <Palette className="w-3 h-3 mr-1" /> App Logos
            </button>

            <button
              onClick={() => setActiveView('support')}
              className="text-slate-300 hover:text-white transition-colors flex items-center text-[11px]"
            >
              <HelpCircle className="w-3 h-3 mr-1" /> 24x7 Help
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-2 shrink-0">
            <div 
              id="brand-logo"
              onClick={() => setActiveView(role === 'SELLER' ? 'seller-portal' : role === 'ADMIN' ? 'admin-portal' : 'home')}
              className="flex items-center space-x-2.5 cursor-pointer shrink-0"
              title="Bharat Cart Home"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 border border-blue-600 bg-blue-950 shrink-0">
                <img
                  src={currentAppLogoUrl}
                  alt="Bharat Cart"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                    Bharat<span className="text-blue-600">Cart</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-800 px-1 rounded">
                    India
                  </span>
                </div>
                <p className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide">
                  India Ka Apna Marketplace
                </p>
              </div>
            </div>

            {/* Quick App Logos Switcher Pill */}
            <button
              type="button"
              id="header-app-logos-pill"
              onClick={() => setIsAppLogoModalOpen(true)}
              className="hidden xl:flex items-center space-x-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2 py-0.5 rounded-full transition-all"
              title="Customize or download Bharat Cart App Logos"
            >
              <Palette className="w-2.5 h-2.5" />
              <span>Logos</span>
            </button>
          </div>

          {/* Delivery Pincode Selector */}
          <button
            id="pincode-trigger-btn"
            onClick={() => setShowPincodeModal(true)}
            className="hidden lg:flex items-center space-x-1.5 text-left text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] block">Deliver to {user.name.split(' ')[0]}</span>
              <span className="font-semibold text-slate-800 flex items-center">
                {userPincode} <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
              </span>
            </div>
          </button>

          {/* Search Bar with live autocomplete & Voice Search */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchSuggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search for Mobiles, Kurtas, Laptops, Groceries & more..."
                className="w-full bg-slate-100 focus:bg-white text-slate-900 text-sm pl-4 pr-20 sm:pr-24 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
              />

              {/* Action buttons inside search bar */}
              <div className="absolute right-1.5 flex items-center space-x-1">
                {searchQuery && (
                  <button
                    type="button"
                    id="header-clear-search-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                    title="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Voice-to-Text Search Button */}
                <button
                  id="header-voice-search-btn"
                  type="button"
                  onClick={() => setIsVoiceSearchOpen(true)}
                  className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center"
                  title="Voice Search - Speak in English, Hindi, Tamil & more"
                  aria-label="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Submit Search Button */}
                <button
                  id="header-search-btn"
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors shadow-xs active:scale-95"
                  title="Search"
                  aria-label="Submit Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Suggested Products
                </div>
                {searchSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions & Navigation */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => setIsNotificationDrawerOpen(true)}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Apple Multi-Store Sourcing Hub Button */}
            <button
              id="header-apple-hub-btn"
              onClick={() => setActiveView('apple-hub')}
              className="hidden lg:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-xl transition-colors font-bold text-xs shadow-xs"
              title="Buy Apple products: Compare prices across Amazon, Croma, Flipkart, Vijay Sales & Apple Store"
            >
              <span>🍏</span>
              <span>Apple Hub</span>
              <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded-md font-semibold">Compare</span>
            </button>

            {/* Import & Resell Sourcing Hub Button */}
            <button
              id="header-import-resell-action-btn"
              onClick={() => setActiveView('import-resell')}
              className="hidden md:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl transition-colors font-semibold text-xs"
              title="Import products from other apps & resell on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import & Resell</span>
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => setActiveView('wishlist')}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative hidden sm:flex items-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              id="header-cart-btn"
              onClick={() => setActiveView('cart')}
              className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl transition-colors font-medium text-sm relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-semibold">Cart</span>
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              <button
                id="header-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs font-semibold"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {user.name[0]}
                </div>
                <span className="hidden lg:inline text-slate-800">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <p className="font-semibold text-xs text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                      {role} Account
                    </span>
                  </div>

                  <div className="py-1 text-xs text-slate-700">
                    <button
                      onClick={() => {
                        setActiveView('apple-hub');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-900 flex items-center space-x-2 font-bold"
                    >
                      <span>🍏</span>
                      <span>Apple Store (Compare Apps)</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('import-resell');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-800 flex items-center space-x-2 font-medium"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Import & Resell Hub</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>My Profile & Addresses</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('orders');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                      <span>My Orders & Tracking</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('wishlist');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-slate-500" />
                      <span>My Wishlist ({wishlist.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('support');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Customer Support 24x7</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 pb-1">
                    <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-medium flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Switch / Demo Login</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation Ribbon */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveView('apple-hub')}
            className="px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center space-x-1.5 shadow-2xs shrink-0"
          >
            <span>🍏</span>
            <span>Apple Store (Compare Apps)</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveView('search');
              }}
              className="px-3 py-1.5 rounded-full font-medium whitespace-nowrap bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200/80 transition-colors"
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto shrink-0 flex items-center space-x-2 pl-2 border-l border-slate-200">
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              ⚡ Festive Dhamaka Live
            </span>
          </div>
        </div>
      </div>

      {/* Pincode Change Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-heading font-bold text-lg text-slate-900">Delivery Location</h3>
              </div>
              <button 
                onClick={() => setShowPincodeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your 6-digit Indian PIN code to view accurate product availability and delivery timelines.
            </p>
            <form onSubmit={handleSavePincode}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Indian Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 110001, 560001, 400001"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] text-slate-400 w-full">Popular Cities:</span>
                {[
                  { name: 'Bengaluru', pin: '560001' },
                  { name: 'Delhi NCR', pin: '110001' },
                  { name: 'Mumbai', pin: '400001' },
                  { name: 'Chennai', pin: '600001' },
                  { name: 'Kolkata', pin: '700001' },
                ].map((item) => (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => setTempPincode(item.pin)}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    {item.name} ({item.pin})
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPincodeModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  Apply Pincode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice-to-Text Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={handleVoiceSearchResult}
      />
    </header>
  );
};

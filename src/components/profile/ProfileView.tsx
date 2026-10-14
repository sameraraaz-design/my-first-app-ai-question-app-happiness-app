import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Coins, 
  Package, 
  Heart, 
  Plus, 
  Trash2, 
  Check, 
  X,
  CreditCard,
  HeadphonesIcon,
  ShoppingCart,
  Bell,
  Zap,
  Truck,
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  Sliders,
  Maximize2,
  ImageIcon,
  Palette,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Address } from '../../types';
import { APP_LOGOS, BHARAT_BRAND_COLORS } from '../../data/appLogos';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    addresses,
    deleteAddress,
    addAddress,
    orders,
    wishlist,
    removeFromWishlist,
    addToCart,
    setSelectedProductId,
    setActiveView,
    showToast,
    notificationPreferences,
    updateNotificationPreferences,
    browserPermission,
    requestBrowserPushPermission,
    triggerOrderNotification,
    triggerDealNotification,
    triggerRecommendationNotification,
    setIsNotificationDrawerOpen,
    products,
    selectedAppLogo,
    setSelectedAppLogo,
    currentAppLogo,
    setIsAppLogoModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'WISHLIST' | 'ADDRESSES' | 'COINS' | 'NOTIFICATIONS' | 'LOGOS'>('PROFILE');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; desc: string; ratio: string } | null>(null);

  // Address form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [flat, setFlat] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressType, setAddressType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !pincode || !flat || !city || !state) {
      showToast('Please fill all mandatory address fields');
      return;
    }

    addAddress({
      fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      pincode,
      flatHouse: flat,
      areaStreet: area,
      city,
      state,
      addressType,
      isDefault: false,
    });

    setIsAddressModalOpen(false);
    setFullName('');
    setPhone('');
    setPincode('');
    setFlat('');
    setArea('');
    setCity('');
    setState('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {currentUser.name[0]}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-heading text-slate-900">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-3">
              <span>{currentUser.email}</span>
              <span>•</span>
              <span>{currentUser.phone}</span>
            </p>
          </div>
        </div>

        {/* Loyalty Reward Coins */}
        <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Bharat Rewards
            </span>
            <span className="text-base font-black text-amber-950">
              350 Coins
            </span>
            <span className="text-[10px] text-amber-700 block">Worth ₹350 on next order</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'PROFILE', label: 'Account Overview' },
          { id: 'WISHLIST', label: `My Wishlist (${wishlist.length})` },
          { id: 'ADDRESSES', label: `Saved Addresses (${addresses.length})` },
          { id: 'COINS', label: 'Reward Coins & Perks' },
          { id: 'NOTIFICATIONS', label: 'Push Notifications & Alerts' },
          { id: 'LOGOS', label: 'App Logos & Branding' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile Overview */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Shortcuts */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-slate-900 text-sm">
              Quick Shortcuts
            </h3>
            <div className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => setActiveView('orders')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>All Orders</span>
                </div>
                <span className="text-slate-400 font-normal">({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('WISHLIST')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                  <span>My Wishlist</span>
                </div>
                <span className="text-slate-400 font-normal">({wishlist.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ADDRESSES')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-slate-400 font-normal">({addresses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('NOTIFICATIONS')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Push Notifications</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold uppercase">Settings</span>
              </button>

              <button
                id="profile-shortcut-logos-btn"
                onClick={() => setActiveTab('LOGOS')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>App Logos & Branding</span>
                </div>
                <span className="text-[10px] text-purple-700 font-bold uppercase bg-purple-50 px-1.5 py-0.5 rounded">
                  3 Icons
                </span>
              </button>

              <button
                onClick={() => setActiveView('support')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <HeadphonesIcon className="w-4 h-4 text-indigo-600" />
                  <span>24x7 Customer Help</span>
                </div>
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-heading font-bold text-slate-900 text-sm">
              Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
                <span className="font-semibold text-slate-900 text-sm">{currentUser.name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-900">{currentUser.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Number</span>
                <span className="font-semibold text-slate-900">{currentUser.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Status</span>
                <span className="font-semibold text-emerald-700">Active & KYC Verified</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-900 block text-xs">Bharat Security Guarantee</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Your personal information and payment tokens are protected with RBI data localization standards.
                  </p>
                </div>
              </div>
            </div>

            {/* App Visual Identity & Media Assets */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <h4 className="font-heading font-bold text-slate-900 text-sm">
                    Bharat Cart Official App Images & Visual Identity
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  Official Assets
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Generated brand media assets including the high-resolution app icon, PWA emblem, and e-commerce marketplace hero showcase banner.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. App Logo / Icon */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-sm transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">App Icon & Logo</span>
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        1:1 Square
                      </span>
                    </div>
                    <div className="relative aspect-square w-32 mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-blue-950 mb-3 group-hover:scale-105 transition-transform">
                      <img
                        src="/app-logo.jpg"
                        alt="Bharat Cart App Logo"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      Glossy 3D shopping bag emblem with tricolor accents, used for app header, mobile home screen, and favicon.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewImage({
                      url: '/app-logo.jpg',
                      title: 'Bharat Cart Official App Logo & Icon',
                      desc: 'Square 1:1 brand emblem featuring golden-amber shopping bag with royal blue & emerald accents.',
                      ratio: '1:1'
                    })}
                    className="mt-3 w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Full Size</span>
                  </button>
                </div>

                {/* 2. App Hero / Showcase Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-sm transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">Marketplace Hero Showcase</span>
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        16:9 Banner
                      </span>
                    </div>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 mb-3 group-hover:scale-[1.02] transition-transform">
                      <img
                        src="/app-hero.jpg"
                        alt="Bharat Cart Hero Showcase Banner"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      3D digital marketplace illustration with festive packages, shopping bags, and electronics for banners and social shares.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewImage({
                      url: '/app-hero.jpg',
                      title: 'Bharat Cart Marketplace Showcase Banner',
                      desc: 'Widescreen 16:9 festive shopping banner with delivery packages, electronics, and digital storefront visuals.',
                      ratio: '16:9'
                    })}
                    className="mt-3 w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Full Size</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'WISHLIST' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-lg">
                My Saved Wishlist ({wishlist.length})
              </h2>
              <p className="text-xs text-slate-500">
                Products you saved for later. Add items directly to your shopping cart or manage your list.
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={() => setActiveView('wishlist')}
                className="text-xs text-blue-600 font-bold hover:underline self-start sm:self-auto"
              >
                Open Full Screen Wishlist →
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore Bharat Cart's authentic Indian brands and click the heart icon on any product details page to save it here.
              </p>
              <button
                onClick={() => setActiveView('home')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors inline-block"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs hover:border-blue-300 transition-all group"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-xl bg-slate-50 p-3 mb-3 border border-slate-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.productId)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center shadow-xs border border-slate-100 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.product.brand}
                    </span>
                    <h4
                      onClick={() => {
                        setSelectedProductId(item.productId);
                        setActiveView('product-detail');
                      }}
                      className="font-bold text-slate-900 text-xs line-clamp-2 hover:text-blue-600 cursor-pointer mt-0.5"
                    >
                      {item.product.title}
                    </h4>

                    <div className="flex items-center space-x-1.5 mt-1.5 text-[11px]">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px]">
                        {item.product.rating} ★
                      </span>
                      <span className="text-slate-400">({item.product.ratingCount})</span>
                    </div>

                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-sm font-black text-slate-900">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                      {item.product.mrp > item.product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item.product, 1);
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-2 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item.product, 1);
                        removeFromWishlist(item.productId);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-2 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
                      title="Add to cart and remove from wishlist"
                    >
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'ADDRESSES' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{addr.fullName}</span>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {addr.addressType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.flatHouse}, {addr.areaStreet}
                  </p>
                  <p className="text-xs text-slate-600">
                    {addr.city}, {addr.state} - <span className="font-semibold text-slate-800">{addr.pincode}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Phone: {addr.phone}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {addr.isDefault ? (
                    <span className="text-emerald-700 font-bold text-[11px]">✓ Default Address</span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Secondary Address</span>
                  )}

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 font-semibold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Rewards & Coins */}
      {activeTab === 'COINS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Coins className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-black text-2xl text-slate-900">
              350 Bharat Cart Coins
            </h3>
            <p className="text-xs text-slate-500">
              Earn 2 coins for every ₹100 spent on Bharat Cart marketplace. Redeemable directly on payment checkout!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm">Instant Cash Off</span>
              <p className="text-slate-500 mt-1">1 Bharat Coin = ₹1 cash discount at final checkout.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm">Free Express Shipping</span>
              <p className="text-slate-500 mt-1">Exchange 100 coins for free priority next-day delivery.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm">Early Sale Access</span>
              <p className="text-slate-500 mt-1">Get 24-hour head start during Great Indian Diwali Sales.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Push Notifications & Alerts Settings */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span>Push Notification Center</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage real-time push alerts for orders, lightning deals, and personalized picks.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="open-notif-drawer-profile-btn"
                  onClick={() => setIsNotificationDrawerOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Notification Center</span>
                </button>
              </div>
            </div>

            {/* Browser Permission Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-blue-950 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Native Browser Push Notifications: <span className="capitalize font-black text-blue-700">{browserPermission}</span></span>
                </span>
                <p className="text-[11px] text-blue-800/80">
                  {browserPermission === 'granted'
                    ? 'Browser push is active. You will receive notifications even when this tab is not in focus.'
                    : 'Allow notification access to get live order milestones and lightning flash sale alerts.'}
                </p>
              </div>

              {browserPermission !== 'granted' && (
                <button
                  id="profile-enable-push-btn"
                  onClick={requestBrowserPushPermission}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
                >
                  Enable Browser Push
                </button>
              )}
            </div>

            {/* Notification Preference Toggles */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alert Preferences
              </h4>

              {/* 1. Order Status Updates */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Order Status Updates
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Receive real-time push milestones when your order is Placed, Shipped, Out for Delivery, and Delivered.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-order-updates"
                    type="checkbox"
                    checked={notificationPreferences.orderUpdates}
                    onChange={(e) => updateNotificationPreferences({ orderUpdates: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* 2. Deals and Flash Sales */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      New Deals & Flash Sales
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Instant alerts when price drops, festive Dhamaka offers, and limited-period flash sales go live.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-deal-updates"
                    type="checkbox"
                    checked={notificationPreferences.dealsAndFlashSales}
                    onChange={(e) => updateNotificationPreferences({ dealsAndFlashSales: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* 3. Personalized Product Recommendations */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Personalized Recommendations
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Smart recommendations curated specifically from your viewed products, search history, and wishlist.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-rec-updates"
                    type="checkbox"
                    checked={notificationPreferences.recommendations}
                    onChange={(e) => updateNotificationPreferences({ recommendations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* 4. Audio Chime */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    {notificationPreferences.soundAlert ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Audible Push Chime
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Play a clean synth tone whenever an alert arrives on screen.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-sound-chime"
                    type="checkbox"
                    checked={notificationPreferences.soundAlert}
                    onChange={(e) => updateNotificationPreferences({ soundAlert: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Live Notification Testing Simulator
              </span>
              <p className="text-xs text-slate-500 mb-3">
                Click any trigger below to test the push notification banner, chime tone, and tracking flow in real time:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="profile-sim-order-btn"
                  onClick={() => {
                    const sampleOrder = orders[0] || {
                      id: 'BC-2024-88412',
                      items: [{ product: products[0], quantity: 1 }],
                      totalAmount: 39999,
                      deliveryPartner: 'BlueDart Express',
                      trackingNumber: 'BD89124018IN',
                      otpForDelivery: '4821',
                      estimatedDelivery: 'Today by 7:00 PM',
                    };
                    const stages: ('PLACED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED')[] = [
                      'OUT_FOR_DELIVERY',
                      'SHIPPED',
                      'DELIVERED',
                    ];
                    const nextStage = stages[Math.floor(Math.random() * stages.length)];
                    triggerOrderNotification(sampleOrder as any, nextStage);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Test Order Push</span>
                  </div>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  id="profile-sim-deal-btn"
                  onClick={() => {
                    const discountProds = products.filter((p) => (p.discountPercent || 0) >= 20);
                    const prod = discountProds[Math.floor(Math.random() * discountProds.length)] || products[0];
                    triggerDealNotification(undefined, prod);
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Test Flash Deal</span>
                  </div>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  id="profile-sim-rec-btn"
                  onClick={() => {
                    triggerRecommendationNotification();
                  }}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Test Recommendation</span>
                  </div>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: App Logos & Visual Branding */}
      {activeTab === 'LOGOS' && (
        <div className="space-y-6">
          {/* Section 1: Active Logo Showcase & Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <span>Official Bharat Cart App Logos & Brand Suite</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-definition 1:1 3D renders for mobile applications, web portals, app store badges, and merchant packaging.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  id="profile-open-logo-modal-btn"
                  onClick={() => setIsAppLogoModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Interactive Simulator</span>
                </button>
              </div>
            </div>

            {/* Currently Active Logo Highlight Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black shrink-0 relative group">
                  <img
                    src={currentAppLogo.url}
                    alt={currentAppLogo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setPreviewImage({
                      url: currentAppLogo.url,
                      title: currentAppLogo.name,
                      desc: currentAppLogo.description,
                      ratio: '1:1'
                    })}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Currently Active in App
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentAppLogo.dimensions}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-xl text-white mt-1">
                    {currentAppLogo.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                    {currentAppLogo.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
                <a
                  href={currentAppLogo.url}
                  download={currentAppLogo.downloadName}
                  className="flex-1 md:flex-initial bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + currentAppLogo.url);
                    showToast(`Copied URL for ${currentAppLogo.name}!`);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center space-x-1 border border-slate-700"
                  title="Copy URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid of All 3 Logo Editions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Select Active App Logo Edition
                </h4>
                <span className="text-xs text-slate-500">
                  Click any card to activate instantly across the website, favicon, and mobile view
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {APP_LOGOS.map((logo) => {
                  const isActive = selectedAppLogo === logo.id;

                  return (
                    <div
                      key={logo.id}
                      id={`profile-logo-edition-${logo.id}`}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {logo.badge}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          )}
                        </div>

                        {/* 1:1 Image Preview */}
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 relative group mb-3.5 flex items-center justify-center p-2 shadow-md">
                          <img
                            src={logo.url}
                            alt={logo.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({
                                url: logo.url,
                                title: logo.name,
                                desc: logo.description,
                                ratio: '1:1'
                              })}
                              className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow hover:scale-110 transition-transform"
                              title="Zoom Preview"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <a
                              href={logo.url}
                              download={logo.downloadName}
                              className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow hover:scale-110 transition-transform"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-heading font-bold text-slate-900 text-sm">
                              {logo.name}
                            </h5>
                            <span
                              className="w-3 h-3 rounded-full border border-white shadow-2xs shrink-0"
                              style={{ backgroundColor: logo.accentHex }}
                            />
                          </div>
                          <p className="text-[11px] font-semibold text-slate-600">
                            {logo.tagline}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {logo.description}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          id={`profile-apply-logo-${logo.id}`}
                          onClick={() => setSelectedAppLogo(logo.id)}
                          className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-2xs ${
                            isActive
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Active App Logo</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Use This Logo</span>
                            </>
                          )}
                        </button>

                        <a
                          href={logo.url}
                          download={logo.downloadName}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brand Color Tokens Swatches */}
            <div className="pt-2 border-t border-slate-100">
              <div className="mb-3">
                <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>Official Bharat Cart Color Palette</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Official hex codes for typography, banners, packaging, and digital touchpoints. Click to copy.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {BHARAT_BRAND_COLORS.map((col) => (
                  <div
                    key={col.hex}
                    onClick={() => {
                      navigator.clipboard.writeText(col.hex);
                      showToast(`Copied ${col.hex} (${col.name})!`);
                    }}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div
                      className="w-full h-10 rounded-xl mb-2 shadow-inner border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {col.name}
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                      <code className="font-mono text-[10px] text-slate-700 font-semibold">{col.hex}</code>
                      <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Add New Delivery Address
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Flat / House No.</label>
                <input
                  type="text"
                  required
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  placeholder="e.g. #402 Palm Grove Apartments"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area / Street</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Indiranagar 100ft Road"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type</label>
                <div className="flex gap-2">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddressType(t)}
                      className={`flex-1 py-1.5 rounded-xl border font-bold text-xs ${
                        addressType === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Image Preview Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  {previewImage.title}
                </h3>
                <p className="text-xs text-slate-500">{previewImage.desc}</p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                referrerPolicy="no-referrer"
                className={`max-h-[70vh] object-contain rounded-xl shadow-lg ${
                  previewImage.ratio === '1:1' ? 'max-w-[360px]' : 'w-full'
                }`}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">
                Asset Path: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">{previewImage.url}</code>
              </span>
              <a
                href={previewImage.url}
                download
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <span>Open Direct</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

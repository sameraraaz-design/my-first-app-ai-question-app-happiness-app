import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, AppleProductSourceApp, ExternalAppOffer } from '../../types';
import { APPLE_PARTNER_APPS } from '../../data/appleProductsData';
import { AppleStoreAppChooser } from './AppleStoreAppChooser';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  Filter, 
  Check, 
  ExternalLink,
  ChevronRight,
  Zap,
  Repeat,
  ShoppingBag,
  Info,
  X
} from 'lucide-react';

export const AppleStoreHubView: React.FC = () => {
  const { 
    products, 
    addToCart, 
    buyNow, 
    setSelectedProductId, 
    setActiveView 
  } = useApp();

  // Filter state
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'lowest_price' | 'highest_discount' | 'rating'>('lowest_price');

  // Modal for deep store comparison
  const [comparisonModalProduct, setComparisonModalProduct] = useState<Product | null>(null);

  // Per-card selected app override state: map of productId -> AppleProductSourceApp
  const [cardSelectedApp, setCardSelectedApp] = useState<Record<string, AppleProductSourceApp>>({});

  // Filter only Apple products
  const appleProducts = products.filter(
    (p) => p.isAppleProduct || p.brand.toLowerCase() === 'apple' || p.title.toLowerCase().includes('apple') || p.title.toLowerCase().includes('iphone') || p.title.toLowerCase().includes('macbook')
  );

  // Filter by series
  const seriesFiltered = appleProducts.filter((p) => {
    if (selectedSeries === 'All') return true;
    if (selectedSeries === 'iPhone') return p.appleSeries === 'iPhone' || p.title.includes('iPhone');
    if (selectedSeries === 'MacBook') return p.appleSeries === 'MacBook' || p.title.includes('MacBook');
    if (selectedSeries === 'iPad') return p.appleSeries === 'iPad' || p.title.includes('iPad');
    if (selectedSeries === 'Watch') return p.appleSeries === 'Watch' || p.title.includes('Watch');
    if (selectedSeries === 'AirPods') return p.appleSeries === 'AirPods' || p.title.includes('AirPods');
    return true;
  });

  // Filter by app availability
  const appFiltered = seriesFiltered.filter((p) => {
    if (selectedAppFilter === 'All') return true;
    if (!p.externalAppOffers) return true;
    return p.externalAppOffers.some((o) => o.appId === selectedAppFilter);
  });

  // Sort products
  const sortedProducts = [...appFiltered].sort((a, b) => {
    if (selectedSort === 'lowest_price') return a.price - b.price;
    if (selectedSort === 'highest_discount') return b.discountPercent - a.discountPercent;
    return b.rating - a.rating;
  });

  // Series tabs
  const seriesTabs = [
    { id: 'All', label: 'All Apple Products', icon: '🍏' },
    { id: 'iPhone', label: 'iPhone', icon: '📱' },
    { id: 'MacBook', label: 'MacBook', icon: '💻' },
    { id: 'iPad', label: 'iPad', icon: '📋' },
    { id: 'Watch', label: 'Apple Watch', icon: '⌚' },
    { id: 'AirPods', label: 'AirPods & Audio', icon: '🎧' },
  ];

  const appFilterOptions: { id: string; label: string; icon: string }[] = [
    { id: 'All', label: 'All Partner Stores', icon: '🌐' },
    { id: 'amazon', label: 'Amazon India', icon: '🛒' },
    { id: 'flipkart', label: 'Flipkart', icon: '⚡' },
    { id: 'apple_store', label: 'Official Apple Store', icon: '🍏' },
    { id: 'croma', label: 'Croma', icon: '🏪' },
    { id: 'vijay_sales', label: 'Vijay Sales', icon: '🏷️' },
    { id: 'reliance_digital', label: 'Reliance Digital', icon: '💎' },
  ];

  return (
    <div className="min-w-0 max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Hero Apple Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
            <span className="text-base">🍏</span>
            <span className="text-slate-200">Apple Multi-Store Sourcing Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-black">Live Price Compare</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            Buy Apple Products from Other Apps.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Pick Your Store. Get the Best Deal.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Why check Amazon, Flipkart, Croma, Vijay Sales, and Apple Store separately? Compare prices, live bank offers, exchange bonuses, and delivery speeds in one place. Choose the exact app you want to buy from with 100% genuine Apple India warranty.
          </p>

          {/* Quick Value Metrics */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">Authorised Stores</span>
              <span className="text-lg font-black text-white">6 Top Apps</span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">Bank Cashback</span>
              <span className="text-lg font-black text-emerald-400">Up to ₹10,000</span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">Fastest Delivery</span>
              <span className="text-lg font-black text-blue-400">2-Hour Pickup</span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 block font-medium">Warranty</span>
              <span className="text-lg font-black text-amber-300">1 Yr Apple India</span>
            </div>
          </div>
        </div>

        {/* Ambient subtle lighting */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Series Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {seriesTabs.map((tab) => {
          const isActive = selectedSeries === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSeries(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Sorter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* App Store Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center shrink-0">
            <Filter className="w-3.5 h-3.5 mr-1" /> Store App:
          </span>
          {appFilterOptions.map((opt) => {
            const isSelected = selectedAppFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedAppFilter(opt.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">Sort by:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lowest_price">Lowest Price First</option>
            <option value="highest_discount">Highest Discount</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Apple Products Catalog with Cross-App Buying Choices */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold font-heading text-slate-900">
              {selectedSeries === 'All' ? 'Available Apple Devices' : `${selectedSeries} Collection`}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {sortedProducts.length} models with live multi-app price comparison
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✓ Genuine Apple India Sealed Boxes
          </span>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-slate-800">No Apple models matched this filter</h3>
            <p className="text-xs text-slate-500">Try choosing "All Partner Stores" or another Apple category.</p>
            <button
              onClick={() => {
                setSelectedSeries('All');
                setSelectedAppFilter('All');
              }}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedProducts.map((product) => {
              const offers = product.externalAppOffers || [];
              const lowestPrice = offers.length > 0 ? Math.min(...offers.map((o) => o.price)) : product.price;
              
              // Selected app for this card
              const currentAppId: AppleProductSourceApp = cardSelectedApp[product.id] || (product.selectedSourceApp || (offers[0]?.appId || 'amazon'));
              const activeOffer: ExternalAppOffer | undefined = offers.find((o) => o.appId === currentAppId) || offers[0];

              const effectivePrice = activeOffer ? activeOffer.price : product.price;
              const effectiveMrp = activeOffer ? activeOffer.mrp : product.mrp;
              const savings = effectiveMrp - effectivePrice;
              const discountPercent = activeOffer ? activeOffer.discountPercent : product.discountPercent;
              const activeAppMeta = activeOffer ? APPLE_PARTNER_APPS[activeOffer.appId] : null;

              return (
                <div
                  key={product.id}
                  id={`apple-card-${product.id}`}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Brand & Lowest Price Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🍏</span>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Apple Official
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {offers.length > 0 && (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>BEST DEAL: ₹{lowestPrice.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Middle: Image & Details */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Product Image */}
                      <div 
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setActiveView('product-detail');
                        }}
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shrink-0 cursor-pointer group"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <h3 
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setActiveView('product-detail');
                          }}
                          className="font-black text-slate-900 text-base sm:text-lg line-clamp-2 hover:text-blue-600 cursor-pointer font-heading"
                        >
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center">
                            ★ {product.rating}
                          </span>
                          <span className="text-slate-400">
                            ({product.ratingCount.toLocaleString('en-IN')} reviews)
                          </span>
                        </div>

                        {/* Specs bullet preview */}
                        <div className="text-xs text-slate-500 space-y-1 pt-1 line-clamp-2">
                          <p>{product.features[0]}</p>
                          <p>{product.features[1]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Multi-App Store Selector Pills */}
                    {offers.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                          <span className="flex items-center">
                            <Repeat className="w-3.5 h-3.5 mr-1 text-blue-600" />
                            Choose Source App:
                          </span>
                          <button
                            onClick={() => setComparisonModalProduct(product)}
                            className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center"
                          >
                            <span>Compare All 5+ Apps</span>
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </button>
                        </div>

                        {/* Store Offer Selector Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {offers.map((offer) => {
                            const isSelected = offer.appId === currentAppId;
                            const isLowest = offer.price === lowestPrice;

                            return (
                              <button
                                key={offer.appId}
                                onClick={() => {
                                  setCardSelectedApp((prev) => ({
                                    ...prev,
                                    [product.id]: offer.appId,
                                  }));
                                }}
                                className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold line-clamp-1 text-[11px]">
                                    {offer.appName.split(' ')[0]}
                                  </span>
                                  {isLowest && (
                                    <span className={`text-[9px] font-black px-1 rounded ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                      BEST
                                    </span>
                                  )}
                                </div>
                                <span className={`font-black text-xs mt-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                  ₹{offer.price.toLocaleString('en-IN')}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Active Store Offer Highlight Box */}
                    {activeOffer && (
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center">
                            <span className="mr-1.5">{activeAppMeta?.logoIcon || '🏪'}</span>
                            Buying from {activeOffer.appName}
                          </span>
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-200">
                            {activeAppMeta?.badge || 'Authorised Partner'}
                          </span>
                        </div>

                        {/* Bank Offer */}
                        <div className="flex items-start space-x-1.5 text-emerald-700 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60 text-[11px]">
                          <CreditCard className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="font-semibold">{activeOffer.bankOffer}</span>
                        </div>

                        {/* Delivery */}
                        <div className="flex items-center text-slate-600 text-[11px]">
                          <Truck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>{activeOffer.deliveryTime}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Footer: Price & Buy CTA */}
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-slate-900">
                          ₹{effectivePrice.toLocaleString('en-IN')}
                        </span>
                        {savings > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{effectiveMrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {savings > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600">
                          Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}% off)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1, currentAppId, activeOffer);
                        }}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => {
                          buyNow(product, currentAppId, activeOffer);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center space-x-1"
                      >
                        <span>Buy from {activeOffer?.appName.split(' ')[0] || 'App'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apple Ecosystem & Authenticity Guarantee Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Direct Consumer Trust
            </span>
            <h3 className="text-2xl font-black font-heading text-white">
              Why Buy Apple Through Bharat Cart Multi-Store?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              We eliminate buyer anxiety by scanning top Apple authorised retailers across India in real-time. You get the lowest legitimate price with genuine warranty protection.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveView('search');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Explore All Deals
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
              🏷️
            </div>
            <h4 className="font-bold text-sm text-white">Automatic Price Matching</h4>
            <p className="text-xs text-slate-400">
              Instantly spots whether Amazon, Flipkart, Croma, or Vijay Sales has a flash price drop or extra coupon.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <h4 className="font-bold text-sm text-white">100% Genuine Apple India</h4>
            <p className="text-xs text-slate-400">
              Only verified Apple Authorised Resellers and the Official Apple Store. Never open-box or unauthorized gray market units.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              💳
            </div>
            <h4 className="font-bold text-sm text-white">Bank Offers & No Cost EMI</h4>
            <p className="text-xs text-slate-400">
              Pre-calculated instant discounts on HDFC, ICICI, SBI, and Axis Bank cards with up to 24 months zero interest EMI.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {comparisonModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">
                  Multi-App Comparison: {comparisonModalProduct.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Select which store you want to fulfill this Apple device
                </p>
              </div>
              <button
                onClick={() => setComparisonModalProduct(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AppleStoreAppChooser
              offers={comparisonModalProduct.externalAppOffers || []}
              selectedAppId={cardSelectedApp[comparisonModalProduct.id] || 'amazon'}
              onSelectApp={(appId) => {
                setCardSelectedApp((prev) => ({
                  ...prev,
                  [comparisonModalProduct.id]: appId,
                }));
              }}
              onAddToCart={(offer) => {
                addToCart(comparisonModalProduct, 1, offer.appId, offer);
                setComparisonModalProduct(null);
              }}
              onBuyNow={(offer) => {
                buyNow(comparisonModalProduct, offer.appId, offer);
                setComparisonModalProduct(null);
              }}
              showActionButtons={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

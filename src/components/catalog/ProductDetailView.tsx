import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductDetailSkeleton } from '../skeletons/ProductDetailSkeleton';
import { AskExpertSection } from './AskExpertSection';
import { AppleStoreAppChooser } from './AppleStoreAppChooser';
import { AppleProductSourceApp, ExternalAppOffer } from '../../types';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  IndianRupee, 
  Check, 
  MapPin, 
  Share2, 
  ThumbsUp, 
  MessageSquarePlus, 
  CreditCard, 
  ChevronRight,
  X,
  RotateCw,
  Sparkles
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setActiveView,
    addToCart,
    buyNow,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    voteHelpfulReview,
    userPincode,
    setUserPincode,
    showToast,
    trackProductView,
    trackCategoryView,
    openShareProductModal,
  } = useApp();

  // Loading state for perceived performance while data is fetched
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedProductId]);

  const handleSimulateFetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (product) {
      trackProductView(product.id);
      trackCategoryView(product.category);
    }
  }, [product?.id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincodeInput, setPincodeInput] = useState(userPincode);
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Cross-App Sourcing & Variant Selection
  const [selectedAppId, setSelectedAppId] = useState<AppleProductSourceApp>(
    () => product?.selectedSourceApp || (product?.externalAppOffers?.[0]?.appId || 'amazon')
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);

  // Sync selectedAppId when product changes
  useEffect(() => {
    if (product?.selectedSourceApp) {
      setSelectedAppId(product.selectedSourceApp);
    } else if (product?.externalAppOffers?.[0]?.appId) {
      setSelectedAppId(product.externalAppOffers[0].appId);
    }
    setSelectedColorIndex(0);
    setSelectedStorageIndex(0);
    setSelectedImageIndex(0);
  }, [product?.id]);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  // Return realistic skeleton screen while product data is being fetched
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <p className="text-slate-500">Product not found.</p>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // External App Offers for Cross-App Sourcing (e.g. Apple)
  const hasAppOffers = Boolean(product.externalAppOffers && product.externalAppOffers.length > 0);
  const activeAppOffer = hasAppOffers
    ? product.externalAppOffers!.find((o) => o.appId === selectedAppId) || product.externalAppOffers![0]
    : undefined;

  const effectivePrice = activeAppOffer ? activeAppOffer.price : product.price;
  const effectiveMrp = activeAppOffer ? activeAppOffer.mrp : product.mrp;
  const effectiveDiscount = activeAppOffer ? activeAppOffer.discountPercent : product.discountPercent;
  const effectiveSavings = effectiveMrp - effectivePrice;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.length === 6 && /^\d+$/.test(pincodeInput)) {
      setUserPincode(pincodeInput);
      setPincodeChecked(true);
      showToast(`Pincode ${pincodeInput} verified! Delivery available.`);
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      showToast('Please fill out all review fields');
      return;
    }

    addReview({
      productId: product.id,
      userName: reviewerName.trim() || 'Verified Customer',
      userLocation: 'Bengaluru, India',
      rating: newRating,
      title: newTitle,
      comment: newComment,
      verifiedPurchase: true,
      helpfulCount: 0,
    });

    setIsReviewModalOpen(false);
    setNewTitle('');
    setNewComment('');
    setReviewerName('');
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb Navigation + Refresh Trigger */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap">
        <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto">
          <button onClick={() => setActiveView('home')} className="hover:text-blue-600">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button 
            onClick={() => {
              setActiveView('search');
            }}
            className="hover:text-blue-600"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{product.brand}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <button
          id="simulate-product-fetch-btn"
          onClick={handleSimulateFetch}
          title="Simulate data fetch to view skeleton screen"
          className="text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <RotateCw className="w-3 h-3 text-slate-500" />
          <span className="hidden sm:inline">Simulate Fetch</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Main Photo */}
          <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply"
            />

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white text-slate-400 hover:text-rose-500'
              }`}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>

            {product.badge && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 overflow-hidden shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${idx}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Direct CTAs on Desktop */}
          <div className="space-y-2 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                id="detail-add-to-cart"
                onClick={() => addToCart(product, 1, selectedAppId, activeAppOffer)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                id="detail-buy-now"
                onClick={() => buyNow(product, selectedAppId, activeAppOffer)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            <button
              id="detail-share-product-btn"
              onClick={() => openShareProductModal(product)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Share & Resell (Earn Profit on WhatsApp)</span>
            </button>

            <button
              id="detail-toggle-wishlist"
              onClick={() => toggleWishlist(product)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span>{isFavorited ? 'Saved in Wishlist (Click to remove)' : 'Add to Wishlist'}</span>
            </button>

            <button
              id="detail-jump-ask-expert"
              onClick={() => {
                document.getElementById('ask-expert-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Ask an Expert (Gemini AI)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Details, Pricing, Offers & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Sold by {product.sellerName}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Ratings & Verified */}
            <div className="flex items-center space-x-3 mt-2">
              <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-700 text-white">
                {product.rating} <Star className="w-3.5 h-3.5 ml-1 fill-white text-white" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {product.ratingCount.toLocaleString('en-IN')} Ratings & {productReviews.length} Verified Reviews
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Bharat Assured
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {effectiveMrp > effectivePrice && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{effectiveMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {effectiveDiscount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Inclusive of all taxes. Free EMI options available.
            </p>
            {effectiveSavings > 0 && (
              <p className="text-xs font-semibold text-emerald-700 mt-1.5 flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" /> You save ₹{effectiveSavings.toLocaleString('en-IN')} on this order!
              </p>
            )}

            {/* Sourced App Notification Badge */}
            {activeAppOffer && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <span className="mr-1.5">⚡</span>
                  Sourced via: <span className="text-blue-700 ml-1 font-extrabold">{activeAppOffer.appName}</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeAppOffer.deliveryTime}
                </span>
              </div>
            )}
          </div>

          {/* Color Variants (e.g. Apple Finishes) */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Finish: <span className="font-medium text-slate-600">{product.colorVariants[selectedColorIndex]?.name}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                {product.colorVariants.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColorIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/40 scale-110 shadow-xs'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Storage Variants (e.g. 128GB, 256GB, 512GB, 1TB) */}
          {product.storageVariants && product.storageVariants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Storage: <span className="font-medium text-slate-600">{product.storageVariants[selectedStorageIndex]}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.storageVariants.map((storage, idx) => (
                  <button
                    key={storage}
                    type="button"
                    onClick={() => setSelectedStorageIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      selectedStorageIndex === idx
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Apple & Partner Store Chooser */}
          {hasAppOffers && (
            <div className="pt-2">
              <AppleStoreAppChooser
                offers={product.externalAppOffers!}
                selectedAppId={selectedAppId}
                onSelectApp={(appId) => setSelectedAppId(appId)}
                onAddToCart={(offer) => addToCart(product, 1, offer.appId, offer)}
                onBuyNow={(offer) => buyNow(product, offer.appId, offer)}
                showActionButtons={false}
              />
            </div>
          )}

          {/* Bank & Payment Offers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <CreditCard className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Available Bank & UPI Offers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="font-bold text-blue-900 block">Bank Offer: 10% Instant Discount</span>
                <span className="text-blue-700 text-[11px]">Up to ₹1,500 on HDFC Bank & SBI Credit Cards. Min order ₹5,000.</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-900 block">Bharat Cart UPI Cashback</span>
                <span className="text-amber-800 text-[11px]">Get flat ₹100 cashback via Google Pay / PhonePe with code BHARAT100.</span>
              </div>
            </div>
          </div>

          {/* Pincode & Delivery Checker */}
          <div className="p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Delivery Options
              </span>
              {pincodeChecked && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" /> Available in {userPincode}
                </span>
              )}
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Check
              </button>
            </form>

            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <div className="flex items-center space-x-2 text-emerald-700 font-medium">
                <Truck className="w-4 h-4" />
                <span>
                  {product.deliveryDays === 1 ? 'Lightning Delivery Tomorrow' : `Delivery in ${product.deliveryDays} Business Days`}
                  {product.freeDelivery ? ' • FREE' : ' • ₹40'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>{product.returnPolicyDays} Days Replacement Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <IndianRupee className="w-4 h-4 text-slate-400" />
                <span>{product.codAvailable ? 'Cash on Delivery (COD) Available' : 'Online Payment Only'}</span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Key Highlights
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Specifications
              </h4>
              <button
                onClick={() => {
                  document.getElementById('ask-expert-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Ask Compatibility & Specs</span>
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              {Object.entries(product.specs).map(([key, val], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-3 p-2.5 ${
                    idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="col-span-2 text-slate-800 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* AI-Powered Ask an Expert Feature */}
      <AskExpertSection product={product} />

      {/* Customer Ratings & Reviews */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Ratings & Customer Reviews
            </h3>
            <p className="text-xs text-slate-500">Genuine reviews from verified Indian buyers</p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-blue-200 transition-colors flex items-center space-x-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Rate & Write Review</span>
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-b border-slate-100">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-4xl font-black text-slate-900">{product.rating}</span>
            <div className="flex text-amber-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Based on {product.ratingCount.toLocaleString('en-IN')} verified ratings
            </span>
          </div>

          <div className="md:col-span-2 space-y-2 justify-center flex flex-col text-xs">
            {[
              { stars: '5★', pct: 72, count: Math.floor(product.ratingCount * 0.72) },
              { stars: '4★', pct: 18, count: Math.floor(product.ratingCount * 0.18) },
              { stars: '3★', pct: 6, count: Math.floor(product.ratingCount * 0.06) },
              { stars: '2★', pct: 2, count: Math.floor(product.ratingCount * 0.02) },
              { stars: '1★', pct: 2, count: Math.floor(product.ratingCount * 0.02) },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center space-x-3">
                <span className="w-8 font-semibold text-slate-600">{bar.stars}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-14 text-right text-slate-400">{bar.count.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-slate-100 pt-2">
          {productReviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No customer reviews written yet. Be the first to review this product!
            </p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="py-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-700 text-white">
                      {rev.rating} <Star className="w-3 h-3 ml-0.5 fill-white" />
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">{rev.title}</h5>
                  </div>
                  <span className="text-slate-400 text-[11px]">{rev.date}</span>
                </div>

                <p className="text-slate-700 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">{rev.userName}</span>
                    <span>•</span>
                    <span>{rev.userLocation}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => voteHelpfulReview(rev.id)}
                    className="flex items-center space-x-1 text-slate-500 hover:text-blue-600 font-medium"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-heading font-bold text-slate-900">
            Similar Products in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Write Product Review
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{newRating} out of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Excellent battery life and fast delivery!"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Feedback</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with sound, quality, packaging, delivery etc."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center space-x-2 md:hidden shadow-lg">
        <button
          id="detail-mobile-wishlist"
          onClick={() => toggleWishlist(product)}
          className={`w-12 h-11 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
        <button
          id="detail-mobile-add-to-cart"
          onClick={() => addToCart(product, 1, selectedAppId, activeAppOffer)}
          className="flex-1 bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
        <button
          id="detail-mobile-buy-now"
          onClick={() => buyNow(product, selectedAppId, activeAppOffer)}
          className="flex-1 bg-blue-600 active:bg-blue-700 text-white font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};

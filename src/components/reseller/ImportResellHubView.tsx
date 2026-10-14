import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Share2, 
  Sparkles, 
  IndianRupee, 
  Link as LinkIcon, 
  Check, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Plus, 
  ShoppingBag, 
  TrendingUp, 
  Store, 
  Layers, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  SOURCE_PLATFORMS, 
  DEMO_SOURCE_PRODUCTS, 
  DemoSourcedProduct, 
  detectSourcePlatform 
} from '../../data/dropshipSources';
import { ProductCategory, SourceAppPlatform, ImportedProduct } from '../../types';

export const ImportResellHubView: React.FC = () => {
  const {
    importedProducts,
    importProductFromSource,
    updateImportedProduct,
    deleteImportedProduct,
    openShareProductModal,
    showToast,
    setActiveView,
    setSelectedProductId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'IMPORT' | 'MY_CATALOG' | 'TRENDING_FEED' | 'PLAYBOOK'>('IMPORT');
  
  // URL Input State
  const [sourceUrl, setSourceUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStep, setExtractStep] = useState<string>('');
  const [extractedProduct, setExtractedProduct] = useState<DemoSourcedProduct | null>(null);

  // Customization & Markup Form
  const [customTitle, setCustomTitle] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [customCategory, setCustomCategory] = useState<ProductCategory>('Fashion');
  const [supplierPrice, setSupplierPrice] = useState<number>(350);
  const [resalePrice, setResalePrice] = useState<number>(699);
  const [customMrp, setCustomMrp] = useState<number>(1499);
  const [customDesc, setCustomDesc] = useState('');
  const [customStock, setCustomStock] = useState<number>(50);
  const [customNotes, setCustomNotes] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState<SourceAppPlatform>('meesho');

  // Filter / Search for My Catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  // Edit Resale Price in Catalog
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);

  // Metrics
  const totalImported = importedProducts.length;
  const totalPotentialProfit = importedProducts.reduce(
    (sum, p) => sum + (p.price - (p.sourceOriginalPrice || 0)) * (p.stockCount || 10),
    0
  );
  const totalShares = importedProducts.reduce((sum, p) => sum + (p.shareCount || 0), 0);

  // Trigger Simulated Extraction
  const handleExtractFromUrl = (urlToExtract: string, demoOverride?: DemoSourcedProduct) => {
    const url = urlToExtract.trim();
    if (!url && !demoOverride) {
      showToast('Please enter or paste a valid product link');
      return;
    }

    setIsExtracting(true);
    setExtractStep('Connecting to external marketplace...');

    // Select matched demo or closest match
    const platform = detectSourcePlatform(url);
    const matched = demoOverride || DEMO_SOURCE_PRODUCTS.find((d) => d.sourcePlatform === platform) || DEMO_SOURCE_PRODUCTS[0];

    setTimeout(() => {
      setExtractStep('Parsing high-resolution product photography & titles...');
    }, 600);

    setTimeout(() => {
      setExtractStep('Extracting wholesale supplier costs & inventory specifications...');
    }, 1200);

    setTimeout(() => {
      setIsExtracting(false);
      setExtractedProduct(matched);
      setSourcePlatform(matched.sourcePlatform);
      setCustomTitle(matched.title);
      setCustomBrand(matched.brand);
      setCustomCategory(matched.category);
      setSupplierPrice(matched.sourceOriginalPrice);
      setResalePrice(matched.suggestedResalePrice);
      setCustomMrp(matched.mrp);
      setCustomDesc(matched.description);
      setCustomStock(matched.stockCount);
      setCustomNotes(`Imported from ${matched.sourcePlatform}. High quality supplier rated ${matched.supplierRating}★ with ${matched.supplierOrders}+ orders.`);
      showToast(`Extracted "${matched.title.slice(0, 24)}..." from ${SOURCE_PLATFORMS[matched.sourcePlatform].name}!`);
    }, 1800);
  };

  // Add Product to Store
  const handleAddToStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedProduct) return;

    if (!customTitle || resalePrice <= 0) {
      showToast('Please verify product title and resale price');
      return;
    }

    const markup = Math.max(0, resalePrice - supplierPrice);
    const marginPercent = supplierPrice > 0 ? parseFloat(((markup / resalePrice) * 100).toFixed(1)) : 0;
    const discount = customMrp > resalePrice ? Math.round(((customMrp - resalePrice) / customMrp) * 100) : 0;

    const newProd = importProductFromSource({
      title: customTitle,
      brand: customBrand || 'Bharat Curated',
      category: customCategory,
      subcategory: extractedProduct.subcategory || customCategory,
      price: resalePrice,
      mrp: customMrp || Math.round(resalePrice * 1.5),
      discountPercent: discount,
      rating: extractedProduct.supplierRating || 4.7,
      ratingCount: Math.floor(Math.random() * 80) + 20,
      images: extractedProduct.images,
      description: customDesc || extractedProduct.description,
      features: extractedProduct.features || ['Premium verified quality', 'Pan-India fast dispatch', '7-day return guarantee'],
      specs: extractedProduct.specs || { 'Origin': 'India', 'Supplier Verification': 'Certified' },
      inStock: true,
      stockCount: customStock,
      sellerId: 'reseller-store-user',
      sellerName: 'My Reseller Boutique',
      badge: 'Trending',
      deliveryDays: extractedProduct.deliveryDays || 3,
      freeDelivery: true,
      returnPolicyDays: 7,
      codAvailable: true,
      sourcePlatform,
      sourceUrl: sourceUrl || extractedProduct.sampleUrl,
      sourceOriginalPrice: supplierPrice,
      resellerMarkup: markup,
      profitMarginPercent: marginPercent,
      resellerNotes: customNotes,
    });

    // Reset form & prompt share
    setExtractedProduct(null);
    setSourceUrl('');
    setActiveTab('MY_CATALOG');
    
    // Automatically open share modal so user can share immediately!
    setTimeout(() => {
      openShareProductModal(newProd);
    }, 400);
  };

  // Profit calculation for current form
  const currentMarkup = Math.max(0, resalePrice - supplierPrice);
  const currentMarginPercent = resalePrice > 0 ? ((currentMarkup / resalePrice) * 100).toFixed(1) : '0';

  // Filtered catalog list
  const filteredCatalog = importedProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesPlatform = platformFilter === 'ALL' || p.sourcePlatform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="inline-flex items-center space-x-1 text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Inventory • Dropship & Resell</span>
              </span>
              <span className="text-xs text-slate-400">Meesho • AliExpress • Amazon • Shopify</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
              Product Sourcing & Sharing Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Import products from external apps with 1 click, customize your resale prices to earn healthy profit margins, and share directly to WhatsApp groups, Instagram stories & customers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs shrink-0">
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black text-white">{totalImported}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Imported</div>
            </div>
            <div className="text-center px-2 border-x border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">₹{totalPotentialProfit.toLocaleString('en-IN')}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Profit Goal</div>
            </div>
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black text-blue-400">{totalShares}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Shares</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-white/10">
          <button
            id="tab-import-btn"
            onClick={() => setActiveTab('IMPORT')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'IMPORT'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>1. Import from Other Apps</span>
          </button>

          <button
            id="tab-catalog-btn"
            onClick={() => setActiveTab('MY_CATALOG')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'MY_CATALOG'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>2. My Imported Catalog ({importedProducts.length})</span>
          </button>

          <button
            id="tab-feed-btn"
            onClick={() => setActiveTab('TRENDING_FEED')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'TRENDING_FEED'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. Trending Wholesale Feed</span>
          </button>

          <button
            id="tab-playbook-btn"
            onClick={() => setActiveTab('PLAYBOOK')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'PLAYBOOK'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>4. Social Selling Playbook</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: IMPORT FROM OTHER APPS
         ======================================================== */}
      {activeTab === 'IMPORT' && (
        <div className="space-y-6 animate-fadeIn">
          {/* URL Extractor Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs">
            <div className="max-w-3xl">
              <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 text-blue-600" />
                <span>Paste Any Product Link from an External App</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter a product URL from Meesho, AliExpress, Amazon, Flipkart, Shopify, IndiaMART or TikTok Shop. Our extractor fetches title, photos, specifications and supplier wholesale price.
              </p>
            </div>

            {/* Input & Action Row */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="source-product-url-input"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="e.g. https://meesho.com/s/p/trending-anarkali-kurta or aliexpress.com/item/..."
                  className="w-full bg-slate-50 focus:bg-white text-slate-900 text-sm px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                />
                {sourceUrl && (
                  <button
                    onClick={() => setSourceUrl('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                id="fetch-product-btn"
                type="button"
                onClick={() => handleExtractFromUrl(sourceUrl)}
                disabled={isExtracting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-98 shrink-0"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Import Product</span>
                  </>
                )}
              </button>
            </div>

            {/* Fast 1-Click Demo Import Shortcuts */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Or Try 1-Click Sample Imports from Popular Apps:</span>
                </span>
                <span className="text-[11px] text-slate-600 font-medium">Click any item to test instantly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DEMO_SOURCE_PRODUCTS.map((demo) => {
                  const platform = SOURCE_PLATFORMS[demo.sourcePlatform];
                  return (
                    <button
                      key={demo.title}
                      type="button"
                      onClick={() => {
                        setSourceUrl(demo.sampleUrl);
                        handleExtractFromUrl(demo.sampleUrl, demo);
                      }}
                      className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 bg-slate-50/70 transition-all flex items-center space-x-3 group"
                    >
                      <img
                        src={demo.images[0]}
                        alt={demo.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${platform.badgeColor}`}>
                            {platform.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-800">
                            Cost: ₹{demo.sourceOriginalPrice}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5 group-hover:text-blue-600">
                          {demo.title}
                        </h4>
                        <p className="text-[10px] text-slate-600">
                          Suggested: ₹{demo.suggestedResalePrice} (+₹{demo.suggestedResalePrice - demo.sourceOriginalPrice} profit)
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Progress Bar during extraction */}
            {isExtracting && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2 animate-pulse">
                <div className="flex items-center space-x-2 text-xs font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{extractStep}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Extracted Product Customization & Add Form */}
          {extractedProduct && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-blue-500 shadow-lg space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${SOURCE_PLATFORMS[sourcePlatform].badgeColor}`}>
                    ✓ Imported from {SOURCE_PLATFORMS[sourcePlatform].name}
                  </span>
                  <span className="text-xs text-slate-500">
                    Step 2: Customize Price & Add to Bharat Cart
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setExtractedProduct(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Discard
                </button>
              </div>

              {/* Product Visual & Pricing Calculator Grid */}
              <form onSubmit={handleAddToStore} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Product Images Gallery */}
                  <div className="lg:col-span-4 space-y-3">
                    <img
                      src={extractedProduct.images[0]}
                      alt={customTitle}
                      className="w-full h-64 sm:h-72 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {extractedProduct.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="thumbnail"
                          className="w-full h-20 rounded-xl object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>Supplier Rating:</span>
                        <span className="font-bold text-amber-600">★ {extractedProduct.supplierRating} / 5</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Orders Fulfilled:</span>
                        <span className="font-bold text-slate-800">{extractedProduct.supplierOrders.toLocaleString('en-IN')}+</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Supplier Delivery:</span>
                        <span className="font-bold text-slate-800">{extractedProduct.deliveryDays} Days to Customer</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Resale Price & Profit Margin Calculator */}
                  <div className="lg:col-span-8 space-y-5">
                    {/* Live Profit Calculator Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span>Reseller Profit Margin Calculator</span>
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                          {currentMarginPercent}% Profit Margin
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                          <div className="text-[11px] font-semibold text-slate-400">Supplier Wholesale Cost</div>
                          <div className="text-xl font-bold text-slate-700 mt-1">₹{supplierPrice.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">What the factory charges</div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border-2 border-blue-500 shadow-xs">
                          <div className="text-[11px] font-bold text-blue-700">Your Resale Price (₹)</div>
                          <div className="mt-1 flex items-center justify-center">
                            <span className="text-xl font-black text-slate-900">₹</span>
                            <input
                              type="number"
                              id="resale-price-input"
                              value={resalePrice}
                              onChange={(e) => setResalePrice(Math.max(1, Number(e.target.value)))}
                              className="w-24 text-xl font-black text-slate-900 text-center outline-none bg-transparent"
                            />
                          </div>
                          <div className="text-[10px] text-blue-600 font-medium mt-0.5">What customer pays you</div>
                        </div>

                        <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-xs">
                          <div className="text-[11px] font-bold text-emerald-100">Your Net Profit Per Sale</div>
                          <div className="text-xl font-black text-white mt-1">+₹{currentMarkup.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-emerald-200 mt-0.5">Direct to your bank</div>
                        </div>
                      </div>

                      {/* Quick Margin Adjustment Buttons */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 text-xs">
                        <span className="text-slate-600 font-medium">Quick Markup:</span>
                        {[150, 250, 400, 600].map((add) => (
                          <button
                            key={add}
                            type="button"
                            onClick={() => setResalePrice(supplierPrice + add)}
                            className="bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                          >
                            +₹{add} Profit
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setResalePrice(Math.round(supplierPrice * 1.5))}
                          className="bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                        >
                          +50% Margin
                        </button>
                      </div>
                    </div>

                    {/* Product Details Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                        <input
                          type="text"
                          id="custom-product-title-input"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="w-full text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-blue-600 outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                          <input
                            type="text"
                            value={customBrand}
                            onChange={(e) => setCustomBrand(e.target.value)}
                            className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                          <select
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value as ProductCategory)}
                            className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
                          >
                            <option value="Fashion">Fashion</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Sports">Sports</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">MRP / Strikethrough</label>
                          <input
                            type="number"
                            value={customMrp}
                            onChange={(e) => setCustomMrp(Number(e.target.value))}
                            className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Description & Marketing Hook</label>
                        <textarea
                          rows={3}
                          value={customDesc}
                          onChange={(e) => setCustomDesc(e.target.value)}
                          className="w-full text-xs text-slate-900 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl p-3 focus:border-blue-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* Submit Row */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        id="add-to-store-and-share-btn"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
                      >
                        <Store className="w-4 h-4" />
                        <span>Add Product to My App & Launch Share</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExtractedProduct(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: MY IMPORTED PRODUCTS CATALOG
         ======================================================== */}
      {activeTab === 'MY_CATALOG' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search your imported products..."
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-medium shrink-0">Platform:</span>
              {['ALL', 'meesho', 'aliexpress', 'shopify', 'amazon'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
                    platformFilter === plat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredCatalog.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No imported products yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Import products from Meesho, AliExpress or wholesale sources to start selling and sharing with customers.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('IMPORT')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Import Your First Product Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCatalog.map((prod) => {
                const markup = prod.price - (prod.sourceOriginalPrice || 0);
                const platformInfo = SOURCE_PLATFORMS[prod.sourcePlatform] || SOURCE_PLATFORMS.custom_url;

                return (
                  <div
                    key={prod.id}
                    id={`imported-card-${prod.id}`}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image with badges */}
                      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border ${platformInfo.badgeColor}`}>
                            From {platformInfo.name.split(' ')[0]}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center space-x-1">
                            <span>+₹{markup} Profit</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{prod.category}</span>
                          <span className="font-semibold text-slate-600">Shares: {prod.shareCount || 0}</span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {prod.title}
                        </h3>

                        {/* Financials Strip */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Supplier Cost:</span>
                            <span className="font-bold text-slate-600">₹{prod.sourceOriginalPrice}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-blue-600 font-bold block">Your Selling Price:</span>
                            <span className="font-black text-slate-900 text-sm">₹{prod.price}</span>
                          </div>
                        </div>

                        {prod.resellerNotes && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                            💡 {prod.resellerNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Footers */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`share-btn-${prod.id}`}
                          onClick={() => openShareProductModal(prod)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share to Earn</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActiveView('product-detail');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View in Store</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => {
                            setEditingProductId(prod.id);
                            setEditPriceVal(prod.price);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Margin</span>
                        </button>

                        <button
                          onClick={() => deleteImportedProduct(prod.id)}
                          className="text-rose-500 hover:text-rose-700 font-semibold flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* In-place quick price edit */}
                      {editingProductId === prod.id && (
                        <div className="mt-2 p-2.5 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Update Selling Price:</span>
                            <span className="text-[11px] font-bold text-emerald-700">
                              Profit: ₹{Math.max(0, editPriceVal - (prod.sourceOriginalPrice || 0))}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editPriceVal}
                              onChange={(e) => setEditPriceVal(Number(e.target.value))}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold outline-none"
                            />
                            <button
                              onClick={() => {
                                updateImportedProduct({
                                  ...prod,
                                  price: editPriceVal,
                                  resellerMarkup: Math.max(0, editPriceVal - (prod.sourceOriginalPrice || 0)),
                                });
                                setEditingProductId(null);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="text-slate-500 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: TRENDING WHOLESALE SOURCING FEED
         ======================================================== */}
      {activeTab === 'TRENDING_FEED' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-slate-900">
              Curated High-Margin Dropship Catalog (Ready to Import)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pre-negotiated wholesale rates directly from verified manufacturers across Jaipur, Surat, Shenzhen and Delhi. Click "Import to My Store" to add any item to your personal catalog and start reselling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_SOURCE_PRODUCTS.map((item) => {
              const platform = SOURCE_PLATFORMS[item.sourcePlatform];
              const potentialProfit = item.suggestedResalePrice - item.sourceOriginalPrice;
              const isAlreadyImported = importedProducts.some((ip) => ip.title === item.title);

              return (
                <div 
                  key={item.title}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/3 bg-slate-100">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border ${platform.badgeColor}`}>
                          {platform.name}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                          Earn ~₹{potentialProfit} / unit
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{item.category} • {item.subcategory}</span>
                        <span className="text-amber-600 font-bold">★ {item.supplierRating}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Wholesale Sourcing:</span>
                          <span className="font-bold text-slate-700">₹{item.sourceOriginalPrice}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-blue-600 font-bold block">Suggested Resale:</span>
                          <span className="font-black text-slate-900 text-sm">₹{item.suggestedResalePrice}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <p className="line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setSourceUrl(item.sampleUrl);
                        handleExtractFromUrl(item.sampleUrl, item);
                        setActiveTab('IMPORT');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAlreadyImported ? 'Import Again with New Margin' : 'Import to My App & Customize'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: SOCIAL SELLING PLAYBOOK & SHARING GUIDE
         ======================================================== */}
      {activeTab === 'PLAYBOOK' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                The 3-Step Social Selling Playbook for Bharat Cart Resellers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                How over 50,000+ home entrepreneurs and boutique owners generate ₹15,000 to ₹60,000 monthly without holding inventory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base">
                  1
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Import High-Margin Products</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse Meesho or AliExpress to find trending clothing, jewelry, or tech gadgets. Paste the link into Bharat Cart and set a 30% to 60% profit margin.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base">
                  2
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Share to WhatsApp & Instagram</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use our 1-click WhatsApp share button to broadcast clean images, selling prices, and your store checkout link to WhatsApp groups, family chats, and daily status stories.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-base">
                  3
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Automatic Delivery & Margin Credit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When a customer orders via your link, Bharat Cart's supplier dispatches the product directly to their doorstep with COD. Your profit margin is credited automatically upon delivery!
                </p>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base">Ready to start sourcing products?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Try importing our trending Jaipuri Anarkali Kurta or ANC Earbuds right now.</p>
              </div>
              <button
                onClick={() => setActiveTab('IMPORT')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shrink-0"
              >
                Go to Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

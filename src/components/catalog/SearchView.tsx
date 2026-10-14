import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Search, 
  Star, 
  Check, 
  ChevronDown,
  Mic 
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { VoiceSearchModal } from './VoiceSearchModal';

export const SearchView: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    minRating,
    setMinRating,
    onlyInStock,
    setOnlyInStock,
    onlyAssured,
    setOnlyAssured,
    resetFilters,
    trackSearch,
    showToast,
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleVoiceSearch = (transcript: string) => {
    const clean = transcript.trim();
    if (!clean) return;
    setSearchQuery(clean);
    trackSearch(clean);
    showToast(`Voice Search: "${clean}"`);
  };

  // Available brands in catalogue
  const availableBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand));
    return Array.from(brands);
  }, [products]);

  // Categories list
  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Mobiles',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Grocery',
    'Beauty',
    'Sports',
  ];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchCategory && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand && product.brand !== selectedBrand) {
        return false;
      }

      // Price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Stock
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // Bharat Assured
      if (onlyAssured && product.badge !== 'Bharat Assured') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      // Default: Popularity (rating count * rating)
      return (b.ratingCount * b.rating) - (a.ratingCount * a.rating);
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    minRating,
    onlyInStock,
    onlyAssured,
    sortBy,
  ]);

  const activeFiltersCount = 
    (searchQuery.trim().length > 0 ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyAssured ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center">
          <Filter className="w-4 h-4 mr-1.5 text-blue-600" /> Filters
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset All
          </button>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Price (₹)
          </h4>
          <span className="text-xs font-bold text-blue-600">
            Up to ₹{priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="50000"
          step="500"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>₹100</span>
          <span>₹25,000</span>
          <span>₹50,000+</span>
        </div>
      </div>

      {/* Brands Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
              selectedBrand === null
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Brands</span>
            {selectedBrand === null && <Check className="w-3.5 h-3.5 text-blue-600" />}
          </button>
          {availableBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedBrand === brand
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{brand}</span>
              {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 0].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                minRating === rating
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center">
                {rating === 0 ? (
                  <span>All Ratings</span>
                ) : (
                  <span className="flex items-center">
                    {rating}★ & above
                  </span>
                )}
              </div>
              {minRating === rating && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-2 border-t border-slate-200 space-y-2.5 text-xs">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAssured}
            onChange={(e) => setOnlyAssured(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <span className="font-semibold text-slate-700">Bharat Assured Only</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <span className="text-slate-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Search & Filter Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
              <h1 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900">
                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'All Marketplace Products'}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                {filteredProducts.length} items
              </span>
              <button
                type="button"
                id="search-view-voice-search-btn"
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full transition-all"
                title="Speak to search products"
              >
                <Mic className="w-3.5 h-3.5 text-blue-600" />
                <span>Voice Search</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare prices, read customer reviews, and order with 100% verified delivery
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter trigger button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-2 font-semibold outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-blue-900" title="Clear search query">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                {selectedBrand}
                <button onClick={() => setSelectedBrand(null)} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                {minRating}★ & above
                <button onClick={() => setMinRating(0)} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyAssured && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                Bharat Assured
                <button onClick={() => setOnlyAssured(false)} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-rose-600 hover:text-rose-800 font-bold ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit sticky top-28">
          <FilterSidebar />
        </aside>

        {/* Product Results */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-800 mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try clearing your search query or relaxing filter criteria to view more available Indian marketplace items.
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-heading font-bold text-slate-900 text-base">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-sm"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice-to-Text Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleVoiceSearch}
      />
    </div>
  );
};

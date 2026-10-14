import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
    setActiveView,
    setSelectedProductId,
    showToast,
  } = useApp();

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Wishlist link copied to clipboard!');
    } else {
      showToast('Wishlist ready to share!');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black font-heading text-slate-900 mb-1">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Save your favourite smartphones, fashion wear, and Indian spices to purchase later.
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal collection of saved products on Bharat Cart
          </p>
        </div>

        <button
          onClick={handleShareWishlist}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share Wishlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between p-4 group transition-all hover:border-blue-300"
          >
            <div>
              {/* Image & Delete */}
              <div className="relative aspect-square w-full rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center shadow-sm border border-slate-100 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Brand */}
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {item.product.brand}
              </span>
              <h3
                onClick={() => {
                  setSelectedProductId(item.productId);
                  setActiveView('product-detail');
                }}
                className="font-semibold text-slate-900 text-xs line-clamp-2 hover:text-blue-600 cursor-pointer mt-0.5"
              >
                {item.product.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px]">
                <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-emerald-700 text-white font-bold text-[10px]">
                  {item.product.rating} <Star className="w-2.5 h-2.5 ml-0.5 fill-white" />
                </span>
                <span className="text-slate-400">({item.product.ratingCount})</span>
              </div>

              {/* Price */}
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

            {/* Action CTAs */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  addToCart(item.product, 1);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
                title="Add to shopping cart"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
                title="Move item to cart and remove from wishlist"
              >
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Heart, ShoppingCart, ShieldCheck, Share2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProductId, 
    setActiveView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    openShareProductModal
  } = useApp();

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActiveView('product-detail');
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Actions Top Right: Wishlist & Share */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorited 
              ? 'bg-rose-50 text-rose-600 shadow-sm' 
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openShareProductModal(product);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-white/80 text-slate-400 hover:text-emerald-600 hover:bg-white shadow-xs transition-all"
          title="Share & Resell on WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider ${
            product.badge === 'Bharat Assured'
              ? 'bg-blue-600 text-white'
              : product.badge === 'Bestseller'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-emerald-600 text-white'
          }`}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Image Area */}
      <div 
        onClick={handleCardClick}
        className="w-full aspect-square bg-slate-50 p-4 flex items-center justify-center overflow-hidden cursor-pointer relative"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-slate-600">{product.brand}</span>
            <span className="text-slate-400">{product.category}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={handleCardClick}
            className="font-medium text-slate-800 text-sm line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors leading-snug mb-2"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-700 text-white">
              {product.rating} <Star className="w-3 h-3 ml-0.5 fill-white text-white" />
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.ratingCount.toLocaleString('en-IN')})
            </span>
            {product.freeDelivery && (
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                Free Delivery
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Price details */}
          <div className="flex items-baseline space-x-2 pt-1 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Store Comparison indicator if cross-app sourcing is available */}
          {product.externalAppOffers && product.externalAppOffers.length > 0 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="mb-2.5 px-2 py-1 bg-slate-100/90 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[10px] font-semibold flex items-center justify-between cursor-pointer border border-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1">
                <span>🍏</span>
                <span>{product.externalAppOffers.length} Partner Stores</span>
              </span>
              <span className="text-blue-600 font-bold">Compare & Choose &rarr;</span>
            </div>
          )}

          {/* Quick Add To Cart / Choose Store Button */}
          {product.externalAppOffers && product.externalAppOffers.length > 0 ? (
            <button
              type="button"
              onClick={handleCardClick}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-xs active:scale-[0.98]"
            >
              <span>Choose Store & Buy</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-xs active:scale-[0.98]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  X,
  Truck
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartItemsTotal,
    cartDiscountTotal,
    cartCouponDiscount,
    cartDeliveryFee,
    cartPlatformFee,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons,
    setActiveView,
    setSelectedProductId,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
      setShowCouponList(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black font-heading text-slate-900 mb-2">
          Your Bharat Cart is Empty
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Explore today's hottest deals across smartphones, authentic Indian handlooms, home essentials, and groceries.
        </p>
        <button
          id="empty-cart-shop-now-btn"
          onClick={() => setActiveView('home')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all inline-flex items-center space-x-2"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const totalSaved = cartDiscountTotal + cartCouponDiscount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            Shopping Cart ({cartCount} items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Items in your cart are reserved for you with secure Indian checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
            >
              {/* Product Thumbnail */}
              <div
                onClick={() => {
                  setSelectedProductId(item.productId);
                  setActiveView('product-detail');
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 p-2 border border-slate-100 shrink-0 cursor-pointer flex items-center justify-center overflow-hidden"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.product.brand}
                </span>
                <h3
                  onClick={() => {
                    setSelectedProductId(item.productId);
                    setActiveView('product-detail');
                  }}
                  className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                >
                  {item.product.title}
                </h3>

                <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                  <span className="text-emerald-700 font-semibold">In Stock</span>
                  <span>•</span>
                  <span>Sold by {item.product.sellerName}</span>
                </div>

                {/* Sourced Partner Store Tag */}
                {item.appliedAppOffer && (
                  <div className="mt-2 inline-flex items-center flex-wrap gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200/80 rounded-lg text-xs">
                    <span className="text-slate-600 font-medium">Sourced from:</span>
                    <span className="font-bold text-blue-800">{item.appliedAppOffer.appName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{item.appliedAppOffer.deliveryTime}</span>
                    {item.appliedAppOffer.bankOffer && (
                      <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                        {item.appliedAppOffer.bankOffer}
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-base sm:text-lg font-black text-slate-900">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </span>
                  {item.product.mrp > item.product.price && (
                    <>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.product.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {item.product.discountPercent}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Quantity Controls & Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      toggleWishlist(item.product);
                      removeFromCart(item.productId);
                    }}
                    className="text-xs text-slate-600 hover:text-rose-600 flex items-center space-x-1 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Save for Later</span>
                  </button>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center space-x-1 transition-colors ml-auto sm:ml-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Delivery Note */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800">
            <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Fast Pan-India Delivery: </span>
              <span>All items packed with tamper-proof security seals and verified courier delivery.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Apply Promo Code
            </h4>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-emerald-800">{appliedCoupon.code}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                      Applied
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {appliedCoupon.title} (-₹{cartCouponDiscount.toLocaleString('en-IN')})
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    placeholder="Enter code (e.g. BHARAT100)"
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl uppercase font-mono tracking-wider focus:border-blue-500 outline-none"
                  />
                  <button
                    id="apply-coupon-btn"
                    onClick={() => handleApplyCoupon()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-600">{couponError}</p>
                )}

                <button
                  onClick={() => setShowCouponList(!showCouponList)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-block pt-1"
                >
                  {showCouponList ? 'Hide available coupons' : 'View available coupons'}
                </button>

                {showCouponList && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {availableCoupons.map((c) => (
                      <div
                        key={c.code}
                        onClick={() => handleApplyCoupon(c.code)}
                        className="p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-blue-700">{c.code}</span>
                          <span className="text-[11px] font-bold text-emerald-600">
                            {c.discountType === 'FLAT' ? `Flat ₹${c.discountValue} Off` : `${c.discountValue}% Off`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{c.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
              Price Details
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Price ({cartCount} items)</span>
                <span>₹{cartItemsTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount on MRP</span>
                <span>-₹{cartDiscountTotal.toLocaleString('en-IN')}</span>
              </div>

              {cartCouponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cartCouponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span>₹{cartDeliveryFee}</span>
                )}
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Secured Packaging & Platform Fee</span>
                <span>₹{cartPlatformFee}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {totalSaved > 0 && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-2xl border border-emerald-200 text-center">
                🎉 You will save ₹{totalSaved.toLocaleString('en-IN')} on this order!
              </div>
            )}

            <button
              id="proceed-to-checkout-btn"
              onClick={() => setActiveView('checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1" />
                100% Safe & Secure UPI and Card Payments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

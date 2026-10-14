import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  Store, 
  ShoppingBag, 
  IndianRupee, 
  Tag, 
  Check, 
  X, 
  Trash2, 
  Plus, 
  Activity, 
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Coupon } from '../../types';

export const AdminView: React.FC = () => {
  const {
    products,
    orders,
    availableCoupons,
    addCoupon,
    deleteCoupon,
    sellers,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'SELLERS' | 'COUPONS' | 'PRODUCTS'>('ANALYTICS');
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);

  // New coupon form
  const [couponCode, setCouponCode] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('FLAT');
  const [discountValue, setDiscountValue] = useState('150');
  const [minOrder, setMinOrder] = useState('999');
  const [couponDesc, setCouponDesc] = useState('');

  // Total GMV (Gross Merchandise Value)
  const totalGmv = orders.reduce((acc, o) => acc + o.totalAmount, 0) + 184500;

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponTitle || !discountValue) {
      showToast('Please fill all required coupon fields');
      return;
    }

    addCoupon({
      code: couponCode.toUpperCase().trim(),
      title: couponTitle,
      description: couponDesc || `${discountValue} discount on your order`,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrder) || 0,
      validUntil: '31 Dec 2025',
    });

    setIsNewCouponOpen(false);
    setCouponCode('');
    setCouponTitle('');
    setDiscountValue('150');
    setMinOrder('999');
    setCouponDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black font-heading">
                Bharat Cart Central Operations
              </h1>
              <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Marketplace Health • 100% Pan-India Courier Connectivity
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            <Activity className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> Platform All Systems Operational
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'ANALYTICS', label: 'Platform Metrics & GMV' },
          { id: 'SELLERS', label: `Merchant KYC Approvals (${sellers.length})` },
          { id: 'COUPONS', label: `Campaigns & Coupons (${availableCoupons.length})` },
          { id: 'PRODUCTS', label: `Catalog Audit (${products.length} SKUs)` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Marketplace GMV</span>
              <div className="text-2xl font-black font-heading text-slate-900 mt-1">
                ₹{totalGmv.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                ↑ +24.8% vs last quarter
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Indian Buyers</span>
              <div className="text-2xl font-black font-heading text-slate-900 mt-1">
                24,912 Users
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Coverage across 28 states & 8 UTs
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Registered Sellers</span>
              <div className="text-2xl font-black font-heading text-slate-900 mt-1">
                {sellers.length + 84} Verified
              </div>
              <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
                100% GST registered
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Order Fulfillment Rate</span>
              <div className="text-2xl font-black font-heading text-emerald-600 mt-1">
                98.6%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                BlueDart, Delhivery & Ekart SLA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-heading font-bold text-slate-900 text-sm">
                Category Contribution to Sales
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Mobiles & Smart Gadgets', pct: 42, color: 'bg-blue-600' },
                  { name: 'Electronics & Audio', pct: 26, color: 'bg-indigo-600' },
                  { name: 'Fashion & Ethnic Wear', pct: 15, color: 'bg-amber-500' },
                  { name: 'Home & Kitchen Appliances', pct: 10, color: 'bg-emerald-600' },
                  { name: 'Grocery & Organic Spices', pct: 7, color: 'bg-rose-500' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-heading font-bold text-slate-900 text-sm">
                Payment Method Share
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { mode: 'UPI (PhonePe, GPay, Paytm, BHIM)', share: 64, badge: 'Dominant' },
                  { mode: 'RuPay & Credit / Debit Cards', share: 22, badge: 'Growing' },
                  { mode: 'Cash on Delivery (COD)', share: 11, badge: 'Tier 2/3' },
                  { mode: 'Net Banking & EMI', share: 3, badge: 'High Value' },
                ].map((p) => (
                  <div key={p.mode} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">{p.mode}</span>
                      <span className="text-[10px] text-slate-400">{p.badge}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{p.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Seller Approvals */}
      {activeTab === 'SELLERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Merchant KYC Verification Directory
            </h3>
            <p className="text-xs text-slate-500">Audit GSTIN, PAN, and bank accounts of Indian sellers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Merchant Name</th>
                  <th className="py-3 px-4">GST Number</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{seller.businessName}</span>
                        <span className="text-slate-400">{seller.name} • {seller.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {seller.gstNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {seller.city}, {seller.state} ({seller.pincode})
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center w-fit">
                        <Check className="w-3 h-3 mr-1" /> Approved
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-400 font-medium">Verified Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Coupons */}
      {activeTab === 'COUPONS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Active Promotional Coupons & Offers
              </h3>
              <p className="text-xs text-slate-500">Drive repeat customer orders with targeted discounts</p>
            </div>
            <button
              onClick={() => setIsNewCouponOpen(true)}
              className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-blue-700 text-base bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {coupon.code}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {coupon.discountType === 'FLAT' ? `Flat ₹${coupon.discountValue} Off` : `${coupon.discountValue}% Off`}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-1">{coupon.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{coupon.description}</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Min order: ₹{coupon.minOrderAmount} • Valid till {coupon.validUntil}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold text-[11px]">✓ Active in Checkout</span>
                  <button
                    onClick={() => deleteCoupon(coupon.code)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Products Audit */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Catalog Compliance Audit ({products.length} Products)
            </h3>
            <p className="text-xs text-slate-500">Verify genuine Indian branding, prices, and stock integrity</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Product SKU</th>
                  <th className="py-3 px-4">Merchant</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Quality Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-200"
                        />
                        <span className="font-bold text-slate-800 truncate max-w-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.sellerName}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-semibold text-amber-600">{p.rating}★</td>
                    <td className="py-3 px-4 font-mono">{p.stockCount} units</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded">
                        Bharat Assured
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isNewCouponOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Create Promotional Coupon
              </h3>
              <button
                onClick={() => setIsNewCouponOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI25"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Promotion Title *</label>
                <input
                  type="text"
                  required
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  placeholder="e.g. Diwali Dhamaka Special"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  >
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="e.g. 999"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  placeholder="e.g. Get flat ₹200 off on orders above ₹999"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewCouponOpen(false)}
                  className="flex-1 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

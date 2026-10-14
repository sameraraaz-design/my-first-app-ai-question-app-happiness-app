import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Plus, 
  Package, 
  TrendingUp, 
  DollarSign, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Clock, 
  ShieldCheck, 
  X,
  Edit2,
  Trash2,
  Building,
  Upload,
  Download,
  Share2
} from 'lucide-react';
import { ProductCategory, Product } from '../../types';

export const SellerView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProductStock,
    orders,
    currentSeller,
    showToast,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRODUCTS' | 'ORDERS' | 'KYC'>('OVERVIEW');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Electronics');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newStock, setNewStock] = useState('25');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Seller's specific products
  const sellerProducts = products.filter(
    (p) => p.sellerId === currentSeller.id || p.sellerName.includes(currentSeller.businessName)
  );

  // Fallback to sample seller catalog if none found
  const displayedProducts = sellerProducts.length > 0 ? sellerProducts : products.slice(0, 5);

  const totalSalesRevenue = displayedProducts.reduce(
    (acc, p) => acc + p.price * 12,
    0
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBrand || !newPrice || !newMrp) {
      showToast('Please fill all required product fields');
      return;
    }

    const priceNum = Number(newPrice);
    const mrpNum = Number(newMrp);
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    const defaultImg = newImage || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';

    addProduct({
      title: newTitle,
      brand: newBrand,
      category: newCategory,
      subcategory: newCategory,
      price: priceNum,
      mrp: mrpNum,
      discountPercent: discount,
      rating: 4.5,
      ratingCount: 1,
      images: [defaultImg],
      description: newDesc || 'High quality authentic merchandise on Bharat Cart marketplace.',
      features: ['Genuine manufacturer guarantee', 'Fast dispatch ready', 'Tested and verified quality'],
      specs: { 'Brand Origin': 'India', 'Warranty': '1 Year Manufacturer Warranty' },
      inStock: true,
      stockCount: Number(newStock) || 20,
      sellerId: currentSeller.id,
      sellerName: currentSeller.businessName,
      badge: 'Bharat Assured',
      freeDelivery: true,
      deliveryDays: 2,
      codAvailable: true,
      returnPolicyDays: 7,
    });

    setIsAddProductOpen(false);
    setNewTitle('');
    setNewBrand('');
    setNewPrice('');
    setNewMrp('');
    setNewStock('25');
    setNewImage('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Seller Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black font-heading">
                {currentSeller.businessName}
              </h1>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Merchant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              GST: <span className="font-mono text-slate-300">{currentSeller.gstNumber}</span> • Pincode: {currentSeller.pincode} • Rating: 4.8★
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="seller-import-resell-btn"
            onClick={() => setActiveView('import-resell')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Import & Resell Hub</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>List New Product</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Merchant Dashboard' },
          { id: 'PRODUCTS', label: `Inventory & Listings (${displayedProducts.length})` },
          { id: 'ORDERS', label: `Customer Orders (${orders.length})` },
          { id: 'KYC', label: 'Bank & GST KYC Details' },
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

      {/* Tab 1: Overview Dashboard */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Net Revenue</span>
              <div className="text-2xl font-black font-heading text-slate-900 mt-1">
                ₹{totalSalesRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                ↑ +18.4% this month
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Catalog SKUs</span>
              <div className="text-2xl font-black font-heading text-slate-900 mt-1">
                {displayedProducts.length} Products
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                All Bharat Assured compliant
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Customer Orders</span>
              <div className="text-2xl font-black font-heading text-slate-900 mt-1">
                {orders.length + 38} Orders
              </div>
              <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
                99.2% on-time dispatch
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Seller Rating</span>
              <div className="text-2xl font-black font-heading text-amber-500 mt-1 flex items-center">
                4.8★
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Top-rated merchant badge
              </span>
            </div>
          </div>

          {/* Quick fulfillment alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-sm">Delhivery & BlueDart Pickup Scheduled</h4>
                <p className="text-blue-700 mt-0.5">
                  Courier agent arrives at 3:30 PM today for 3 manifested packages.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('ORDERS')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shrink-0"
            >
              Prepare Manifests
            </button>
          </div>

          {/* Dropshipping & External Import Promo Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Zero Inventory • High Margins
              </span>
              <h3 className="text-lg font-bold">Import Products from Meesho, AliExpress & Amazon</h3>
              <p className="text-xs text-emerald-200/80 max-w-xl">
                Paste any external product link, auto-fetch details, markup your profit margin, and generate viral WhatsApp sharing catalogs with 1-click customer ordering.
              </p>
            </div>
            <button
              onClick={() => setActiveView('import-resell')}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Open Sourcing Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Listings */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Merchant Inventory ({displayedProducts.length} Items)
            </h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New SKU</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">{product.title}</span>
                          <span className="text-slate-400">{product.brand}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {product.category}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateProductStock(product.id, Math.max(0, product.stockCount - 5))}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-800 w-8 text-center">{product.stockCount}</span>
                        <button
                          onClick={() => updateProductStock(product.id, product.stockCount + 5)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {product.inStock ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          Live on Store
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => updateProductStock(product.id, product.inStock ? 0 : 20)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        {product.inStock ? 'Mark OOS' : 'Restock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Fulfillment */}
      {activeTab === 'ORDERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-heading font-bold text-slate-900 text-base">
            Incoming Orders to Dispatch
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {orders.map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 font-mono text-sm">#{order.id}</span>
                    <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Ship to: <span className="font-semibold text-slate-800">{order.shippingAddress.fullName}</span> ({order.shippingAddress.city}, {order.shippingAddress.pincode})
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    Items: {order.items.map((i) => `${i.product.title} (x${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-black text-slate-900 text-sm">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-semibold">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: KYC & Bank Details */}
      {activeTab === 'KYC' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Merchant Verification & Settlement Accounts
            </h3>
            <p className="text-slate-500">Government compliance and automatic daily bank settlements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">GSTIN Registration</span>
              <p className="font-mono font-bold text-slate-900 text-sm">{currentSeller.gstNumber}</p>
              <span className="text-emerald-700 font-semibold block">✓ Verified Active Status with GSTN Portal</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">PAN Identification</span>
              <p className="font-mono font-bold text-slate-900 text-sm">{currentSeller.panNumber || currentSeller.pan}</p>
              <span className="text-emerald-700 font-semibold block">✓ Income Tax Department Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Settlement Bank Account</span>
              <p className="font-mono font-bold text-slate-900 text-sm">
                {currentSeller.bankDetails?.accountNumber || 'HDFC00012849921'}
              </p>
              <p className="text-slate-600">
                {currentSeller.bankDetails?.bankName || 'HDFC Bank'} • IFSC: {currentSeller.bankDetails?.ifsc || 'HDFC0001284'}
              </p>
              <span className="text-emerald-700 font-semibold block">✓ Penny Drop Verification Successful</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Warehouse</span>
              <p className="font-bold text-slate-900 text-sm">Indiranagar Logistics Hub, Bengaluru</p>
              <p className="text-slate-600">PIN: 560038 • Daily pickup slots: 11 AM & 4 PM</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                List New Product on Bharat Cart
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. boAt Wave Call 2 Smart Watch (1.83 HD Display)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. boAt"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 1999"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    placeholder="e.g. 4999"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe specifications, warranty, materials and usage."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

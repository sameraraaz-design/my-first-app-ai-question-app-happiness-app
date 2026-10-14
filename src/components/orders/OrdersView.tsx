import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  Truck, 
  ArrowRight, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrdersView: React.FC = () => {
  const {
    orders,
    setSelectedOrderId,
    setActiveView,
    addToCart,
    cancelOrder,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'ALL' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    // Filter tab
    if (filterTab === 'IN_TRANSIT') {
      if (order.status === 'DELIVERED' || order.status === 'CANCELLED') return false;
    } else if (filterTab === 'DELIVERED') {
      if (order.status !== 'DELIVERED') return false;
    } else if (filterTab === 'CANCELLED') {
      if (order.status !== 'CANCELLED') return false;
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.product.title.toLowerCase().includes(q));
      return matchId || matchItem;
    }

    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Cancelled
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full animate-pulse">
            <Truck className="w-3.5 h-3.5 mr-1 text-blue-600" /> Out for Delivery Today
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 mr-1 text-indigo-600" /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Order Confirmed
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            My Orders ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View past purchases, invoices, and track live shipments across India
          </p>
        </div>

        {/* Order Search Bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders or products..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'IN_TRANSIT', label: 'In Transit / On the Way' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              filterTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-base text-slate-800">
              No orders found in this filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              When you order products on Bharat Cart, their shipment status will appear here in real-time.
            </p>
            <button
              onClick={() => setActiveView('home')}
              className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
            >
              Shop Bharat Cart
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-blue-300"
            >
              {/* Order Card Header */}
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                    <span className="font-bold text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ship To</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[120px] block">
                      {order.shippingAddress.fullName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-600 text-xs">#{order.id}</span>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">{getStatusBadge(order.status)}</div>
                    <p className="text-xs text-slate-500">
                      Estimated Delivery: <span className="font-semibold text-slate-800">{order.estimatedDelivery}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setActiveView('order-tracking');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Package</span>
                    </button>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-slate-100 pt-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-slate-500">
                            <span>Qty: {item.quantity} • Sold by: {item.product.sellerName}</span>
                            {item.appliedAppOffer && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                ⚡ Sourced from {item.appliedAppOffer.appName}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-slate-900 mt-0.5">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-500" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Courier: {order.deliveryPartner} (Tracking: {order.trackingNumber})</span>
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

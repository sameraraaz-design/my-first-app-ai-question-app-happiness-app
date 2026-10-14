import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Download, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Clock, 
  X,
  Printer
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { orders, selectedOrderId, setActiveView } = useApp();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Latest placed order
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500">No order found.</p>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 bg-blue-600 text-white text-xs px-4 py-2 rounded-xl"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Celebration Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
            Thank you! Your Order is Placed.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order ID: <span className="font-mono font-bold text-slate-800">{order.id}</span> • A confirmation SMS & Email has been sent to your registered phone.
          </p>
        </div>

        {/* Delivery OTP Highlight */}
        <div className="bg-blue-50/80 border border-blue-200/80 p-4 rounded-2xl max-w-sm mx-auto">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            Delivery Verification OTP
          </span>
          <span className="text-2xl font-mono font-black text-blue-900 tracking-widest my-0.5 block">
            {order.otpForDelivery}
          </span>
          <span className="text-[10px] text-blue-600">
            Share this 4-digit OTP with your delivery agent only after inspecting your parcel.
          </span>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="confirmation-track-order-btn"
            onClick={() => setActiveView('order-tracking')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Status</span>
          </button>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>View Tax Invoice</span>
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="w-full sm:w-auto text-blue-600 hover:text-blue-800 font-bold text-xs py-3 px-4 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Snapshot & Delivery Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Shipping Address */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-slate-800 font-bold">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Shipping Address</span>
          </div>
          <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
          <p className="text-slate-600">{order.shippingAddress.flatHouse}, {order.shippingAddress.areaStreet}</p>
          <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p className="text-slate-500 font-medium">Contact: {order.shippingAddress.phone}</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-slate-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Payment Summary</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Mode:</span>
            <span className="font-bold text-slate-900">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Transaction Reference:</span>
            <span className="font-mono text-[11px] text-slate-700">{order.paymentDetails.transactionId}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Amount Paid:</span>
            <span className="font-black text-sm text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-semibold pt-1">
            <span>Payment Status:</span>
            <span>✓ Verified Successful</span>
          </div>
        </div>
      </div>

      {/* Items in Order */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-slate-900 text-sm">
          Ordered Items ({order.items.length})
        </h3>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.productId} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 shrink-0"
                />
                <div className="truncate">
                  <span className="font-bold text-slate-900 block truncate">{item.product.title}</span>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <span>Qty: {item.quantity} • Sold by {item.product.sellerName}</span>
                    {item.appliedAppOffer && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        ⚡ {item.appliedAppOffer.appName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="font-bold text-slate-900 shrink-0 text-sm">
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
                  BC
                </div>
                <div>
                  <span className="font-heading font-black text-slate-900 text-base">Bharat Cart Tax Invoice</span>
                  <span className="text-[10px] text-slate-400 block">GSTIN: 29AABCU9603R1ZM</span>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Billed To:</span>
                <p className="font-bold text-slate-900 mt-0.5">{order.shippingAddress.fullName}</p>
                <p className="text-slate-600">{order.shippingAddress.flatHouse}, {order.shippingAddress.areaStreet}</p>
                <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Invoice Details:</span>
                <p className="text-slate-700 mt-0.5"><span className="font-semibold">Invoice No:</span> INV-{order.id}</p>
                <p className="text-slate-700"><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-slate-700"><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
              </div>
            </div>

            {/* Table of items */}
            <div className="py-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Description of Goods</span>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1 font-semibold">Item</th>
                    <th className="py-1 text-center font-semibold">Qty</th>
                    <th className="py-1 text-right font-semibold">Price</th>
                    <th className="py-1 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 text-slate-800 pr-2">{item.product.title}</td>
                      <td className="py-2 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-2 text-right text-slate-600">₹{item.product.price.toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right font-bold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Total */}
            <div className="py-3 border-t border-slate-200 space-y-1 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Total Taxable Value:</span>
                <span>₹{(order.totalAmount * 0.82).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST (18%):</span>
                <span>₹{(order.totalAmount * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

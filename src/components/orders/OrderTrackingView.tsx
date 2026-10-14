import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Truck, 
  MapPin, 
  Phone, 
  Package, 
  ShieldCheck, 
  ArrowLeft, 
  RefreshCw, 
  Clock,
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    advanceOrderTracking,
    setActiveView,
    cancelOrder,
  } = useApp();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500 mb-4">No order selected for tracking.</p>
        <button
          onClick={() => setActiveView('orders')}
          className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('orders')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                Track Delivery
              </h1>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                isDelivered
                  ? 'bg-emerald-100 text-emerald-800'
                  : isCancelled
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800 animate-pulse'
              }`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Order #{order.id} • Shipped via <span className="font-semibold text-slate-700">{order.deliveryPartner}</span> ({order.trackingNumber})
            </p>
          </div>
        </div>

        {/* Live Simulation Trigger (Awesome for Testing!) */}
        {!isDelivered && !isCancelled && (
          <button
            id="advance-tracking-step-btn"
            onClick={() => advanceOrderTracking(order.id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 shrink-0 active:scale-[0.98]"
            title="Simulate courier moving to next stage"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Delivery Progress</span>
          </button>
        )}
      </div>

      {/* Main Tracking Status Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Estimated Delivery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
              {order.estimatedDelivery}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Destination: {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          {/* Delivery OTP Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center sm:text-right shrink-0">
            <span className="text-[11px] text-slate-300 uppercase font-semibold tracking-wider block">
              Doorstep Verification OTP
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-widest block my-0.5">
              {order.otpForDelivery}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Provide to courier upon delivery
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Agent Card (When Out for Delivery) */}
      {order.deliveryAgent && (order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED') && (
        <div className="bg-amber-50/80 border border-amber-200/80 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
              {order.deliveryAgent.name[0]}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Delivery Executive Assigned
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">
                {order.deliveryAgent.name}
              </h4>
              <p className="text-xs text-slate-600">
                Vehicle: {order.deliveryAgent.vehicle}
              </p>
            </div>
          </div>

          <a
            href={`tel:${order.deliveryAgent.phone}`}
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-xs shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call Executive ({order.deliveryAgent.phone})</span>
          </a>
        </div>
      )}

      {/* Interactive Vertical Tracking Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-heading font-bold text-slate-900 text-base">
          Shipment Journey
        </h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {order.trackingSteps.map((step, idx) => {
            const isCompleted = step.completed;
            const isCurrent = step.current;

            return (
              <div key={idx} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-[27px] top-1">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-4 h-4 fill-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-4 ring-blue-100 animate-pulse">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                      <Circle className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className={`font-bold text-sm ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">{step.timestamp}</span>
                  </div>

                  <p className="text-slate-600 mt-1">{step.description}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    <span>{step.location}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Contents & Destination Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Package Items */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center">
            <Package className="w-4 h-4 mr-1.5 text-blue-600" /> Items in this Package
          </h4>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5 truncate">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 block truncate">{item.product.title}</span>
                    <span className="text-slate-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Support */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center mb-2">
              <MapPin className="w-4 h-4 mr-1.5 text-blue-600" /> Delivery Address
            </h4>
            <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
            <p className="text-slate-600">{order.shippingAddress.flatHouse}, {order.shippingAddress.areaStreet}</p>
            <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="text-slate-500 mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveView('support')}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need Help with this Delivery?</span>
            </button>

            {!isDelivered && !isCancelled && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="text-rose-600 hover:text-rose-800 font-bold text-[11px]"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

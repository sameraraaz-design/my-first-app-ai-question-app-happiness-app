import React, { useState } from 'react';
import { 
  Bell, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  X, 
  Check, 
  Sliders, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Notification, NotificationType } from '../../types';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications,
    setActiveView,
    setSelectedProductId,
    setSelectedOrderTrackingId,
    notificationPreferences,
    updateNotificationPreferences,
    requestBrowserPushPermission,
    browserPermission,
    triggerOrderNotification,
    triggerDealNotification,
    triggerRecommendationNotification,
    orders,
    products,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ORDER' | 'DEAL' | 'RECOMMENDATION'>('ALL');
  const [showSettings, setShowSettings] = useState(false);
  const [simulating, setSimulating] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ORDER') return notif.type === 'ORDER';
    if (activeFilter === 'DEAL') return notif.type === 'DEAL' || notif.type === 'OFFER';
    if (activeFilter === 'RECOMMENDATION') return notif.type === 'RECOMMENDATION';
    return true;
  });

  const handleNotificationClick = (notif: Notification) => {
    markNotificationRead(notif.id);
    if (notif.orderId) {
      setSelectedOrderTrackingId(notif.orderId);
      setActiveView('order-tracking');
    } else if (notif.productId) {
      setSelectedProductId(notif.productId);
      setActiveView('product-detail');
    } else if (notif.targetView) {
      setActiveView(notif.targetView as any);
    }
    onClose();
  };

  const handleSimulateOrder = async () => {
    setSimulating('order');
    const targetOrder = orders[0] || {
      id: `BC-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [{ product: products[0], quantity: 1, selectedVariant: '' }],
      totalAmount: 39999,
      deliveryPartner: 'BlueDart Express',
      trackingNumber: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      otpForDelivery: '7291',
      estimatedDelivery: 'Tomorrow, by 8:00 PM',
      shippingAddress: { city: 'Bengaluru' },
    };

    // Cycle status
    const statusCycle: ('PLACED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED')[] = [
      'SHIPPED', 
      'OUT_FOR_DELIVERY', 
      'DELIVERED', 
      'PLACED'
    ];
    const pickedStatus = statusCycle[Math.floor(Math.random() * statusCycle.length)];
    triggerOrderNotification(targetOrder as any, pickedStatus);
    setTimeout(() => setSimulating(null), 600);
  };

  const handleSimulateDeal = async () => {
    setSimulating('deal');
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    triggerDealNotification(undefined, randomProduct);
    setTimeout(() => setSimulating(null), 600);
  };

  const handleSimulateRecommendation = async () => {
    setSimulating('rec');
    triggerRecommendationNotification();
    setTimeout(() => setSimulating(null), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Slide-over panel */}
      <div 
        id="notification-center-drawer"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-bold text-sm">Notifications</h3>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadNotificationsCount} unread
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Order tracking, flash deals & recommendations</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              id="toggle-notif-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg transition-colors ${
                showSettings ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Notification Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              id="close-notif-drawer-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Push Notification Permission Banner */}
        {browserPermission !== 'granted' && (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between gap-2">
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-slate-900 block">Enable Real-Time Push Alerts</span>
                <span className="text-slate-600">Receive order & deal notifications in background.</span>
              </div>
            </div>
            <button
              id="enable-browser-push-btn"
              onClick={async () => {
                await requestBrowserPushPermission();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors shrink-0 shadow-xs"
            >
              Allow Push
            </button>
          </div>
        )}

        {/* Settings Sub-Panel */}
        {showSettings ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                Push Notification Preferences
              </h4>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Done
              </button>
            </div>

            <div className="space-y-3">
              {/* Order Updates */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Order Status Updates</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Live alerts when your order is confirmed, shipped, out for delivery, and delivered.
                  </p>
                </div>
                <input
                  id="pref-order-updates"
                  type="checkbox"
                  checked={notificationPreferences.orderUpdates}
                  onChange={(e) => updateNotificationPreferences({ orderUpdates: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Deals & Flash Sales */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>New Deals & Flash Sales</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Limited-time price drops, lightning sales, and festive coupons.
                  </p>
                </div>
                <input
                  id="pref-deals-sales"
                  type="checkbox"
                  checked={notificationPreferences.dealsAndFlashSales}
                  onChange={(e) => updateNotificationPreferences({ dealsAndFlashSales: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Recommendations */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Personalized Recommendations</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Curated product recommendations based on items and categories you browse.
                  </p>
                </div>
                <input
                  id="pref-recommendations"
                  type="checkbox"
                  checked={notificationPreferences.recommendations}
                  onChange={(e) => updateNotificationPreferences({ recommendations: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Sound Chime Alert */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    {notificationPreferences.soundAlert ? (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>Sound Chime Alert</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Play a gentle audible tone when a new notification arrives.
                  </p>
                </div>
                <input
                  id="pref-sound-alert"
                  type="checkbox"
                  checked={notificationPreferences.soundAlert}
                  onChange={(e) => updateNotificationPreferences({ soundAlert: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Browser Push Permission Toggle */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    <span>Native OS Push Notifications</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Status: <span className="font-semibold text-slate-700 capitalize">{browserPermission}</span>
                  </p>
                </div>
                {browserPermission !== 'granted' ? (
                  <button
                    onClick={requestBrowserPushPermission}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  >
                    Enable
                  </button>
                ) : (
                  <span className="text-emerald-600 font-bold text-xs flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" /> Active
                  </span>
                )}
              </div>
            </div>

            {/* Test Push Triggers */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Test Push Notification Triggers
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={handleSimulateOrder}
                  disabled={simulating !== null}
                  className="w-full text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">Simulate Order Status Update</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={handleSimulateDeal}
                  disabled={simulating !== null}
                  className="w-full text-left bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-slate-800">Simulate Flash Deal Drop</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={handleSimulateRecommendation}
                  disabled={simulating !== null}
                  className="w-full text-left bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-slate-800">Simulate Personalized Pick</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Tabs & Bulk Actions */}
            <div className="p-3 bg-white border-b border-slate-200 space-y-2.5">
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 text-xs font-semibold">
                <button
                  id="tab-all-notifs"
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  id="tab-order-notifs"
                  onClick={() => setActiveFilter('ORDER')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center space-x-1 ${
                    activeFilter === 'ORDER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  <span>Orders</span>
                </button>
                <button
                  id="tab-deal-notifs"
                  onClick={() => setActiveFilter('DEAL')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center space-x-1 ${
                    activeFilter === 'DEAL'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Deals</span>
                </button>
                <button
                  id="tab-rec-notifs"
                  onClick={() => setActiveFilter('RECOMMENDATION')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center space-x-1 ${
                    activeFilter === 'RECOMMENDATION'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Picks</span>
                </button>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center space-x-3 text-slate-500">
                  <button
                    id="mark-all-read-btn"
                    onClick={markAllNotificationsAsRead}
                    disabled={unreadNotificationsCount === 0}
                    className="hover:text-blue-600 disabled:opacity-40 disabled:hover:text-slate-500 font-medium"
                  >
                    Mark all as read
                  </button>
                  <span>•</span>
                  <button
                    id="clear-all-notifs-btn"
                    onClick={clearAllNotifications}
                    disabled={notifications.length === 0}
                    className="hover:text-rose-600 disabled:opacity-40 disabled:hover:text-slate-500 font-medium"
                  >
                    Clear list
                  </button>
                </div>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Notifications Here</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    You're all caught up! Order progress updates, flash deals, and personalized picks will show here.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleSimulateOrder}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Trigger a sample notification →
                    </button>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isOrder = notif.type === 'ORDER';
                  const isDeal = notif.type === 'DEAL' || notif.type === 'OFFER';
                  const isRec = notif.type === 'RECOMMENDATION';

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 transition-all cursor-pointer flex items-start space-x-3 group relative ${
                        notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                      }`}
                    >
                      {/* Left thumbnail or icon */}
                      {notif.imageUrl ? (
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden relative shadow-2xs">
                          <img
                            src={notif.imageUrl}
                            alt={notif.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                          />
                          {isDeal && (
                            <span className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-tl">
                              %
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isOrder ? 'bg-blue-100 text-blue-700' :
                          isDeal ? 'bg-amber-100 text-amber-700' :
                          isRec ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isOrder && <Truck className="w-5 h-5" />}
                          {isDeal && <Zap className="w-5 h-5" />}
                          {isRec && <Sparkles className="w-5 h-5" />}
                          {!isOrder && !isDeal && !isRec && <Bell className="w-5 h-5" />}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <div className="flex items-center space-x-1.5 truncate">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                              isOrder ? 'bg-blue-100 text-blue-800' :
                              isDeal ? 'bg-amber-100 text-amber-800' :
                              isRec ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isOrder ? 'Order' : isDeal ? 'Deal' : isRec ? 'For You' : 'Alert'}
                            </span>
                            <span className={`font-bold text-xs truncate ${notif.read ? 'text-slate-800' : 'text-slate-950 font-black'}`}>
                              {notif.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                            <span>{notif.actionText || 'View Details'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>

                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Demo Dock in Footer */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">Simulate Push Alerts:</span>
                <span className="text-[10px] text-slate-400">Live test triggers</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  id="sim-order-btn"
                  onClick={handleSimulateOrder}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] py-2 px-2 rounded-lg text-center transition-colors flex items-center justify-center space-x-1 border border-blue-200/60"
                  title="Simulate an order status update push"
                >
                  <Truck className="w-3 h-3" />
                  <span className="truncate">Order</span>
                </button>
                <button
                  id="sim-deal-btn"
                  onClick={handleSimulateDeal}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] py-2 px-2 rounded-lg text-center transition-colors flex items-center justify-center space-x-1 border border-amber-200/60"
                  title="Simulate a flash deal notification"
                >
                  <Zap className="w-3 h-3" />
                  <span className="truncate">Flash Deal</span>
                </button>
                <button
                  id="sim-rec-btn"
                  onClick={handleSimulateRecommendation}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] py-2 px-2 rounded-lg text-center transition-colors flex items-center justify-center space-x-1 border border-purple-200/60"
                  title="Simulate a personalized recommendation push"
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="truncate">Recommend</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  X, 
  ExternalLink,
  Bell
} from 'lucide-react';
import { Notification } from '../../types';
import { useApp } from '../../context/AppContext';

interface PushNotificationToastProps {
  notification: Notification | null;
  onDismiss: () => void;
  onAction?: (notification: Notification) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  const { setActiveView, setSelectedProductId, setSelectedOrderTrackingId, markNotificationRead } = useApp();

  // Auto dismiss after 6 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6500);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const handleActionClick = () => {
    markNotificationRead(notification.id);
    if (onAction) {
      onAction(notification);
    } else {
      if (notification.orderId) {
        setSelectedOrderTrackingId(notification.orderId);
        setActiveView('order-tracking');
      } else if (notification.productId) {
        setSelectedProductId(notification.productId);
        setActiveView('product-detail');
      } else if (notification.targetView) {
        setActiveView(notification.targetView as any);
      }
    }
    onDismiss();
  };

  const getIcon = () => {
    if (notification.type === 'ORDER') {
      if (notification.orderStatus === 'DELIVERED') {
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      }
      if (notification.orderStatus === 'SHIPPED' || notification.orderStatus === 'OUT_FOR_DELIVERY') {
        return <Truck className="w-5 h-5 text-blue-600" />;
      }
      if (notification.orderStatus === 'CANCELLED') {
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      }
      return <Package className="w-5 h-5 text-indigo-600" />;
    }
    if (notification.type === 'DEAL') {
      return <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />;
    }
    if (notification.type === 'RECOMMENDATION') {
      return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
    return <Bell className="w-5 h-5 text-blue-600" />;
  };

  const getBadgeStyle = () => {
    if (notification.type === 'ORDER') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (notification.type === 'DEAL') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    if (notification.type === 'RECOMMENDATION') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getCategoryLabel = () => {
    if (notification.type === 'ORDER') {
      if (notification.orderStatus === 'PLACED') return 'Order Placed';
      if (notification.orderStatus === 'SHIPPED') return 'Order Shipped';
      if (notification.orderStatus === 'OUT_FOR_DELIVERY') return 'Out for Delivery';
      if (notification.orderStatus === 'DELIVERED') return 'Delivered';
      return 'Order Update';
    }
    if (notification.type === 'DEAL') return 'Flash Sale Alert';
    if (notification.type === 'RECOMMENDATION') return 'Personalized Pick';
    return 'Bharat Cart Alert';
  };

  return (
    <AnimatePresence>
      <div 
        id="push-notification-toast-container"
        className="fixed top-4 right-4 z-50 max-w-sm sm:max-w-md w-full px-3 sm:px-0 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-black/5"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50/80 border-b border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle()}`}>
                {getCategoryLabel()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Just now</span>
            </div>
            <button
              id="dismiss-push-toast-btn"
              onClick={onDismiss}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-3.5 flex items-start space-x-3">
            {/* Thumbnail / Icon */}
            {notification.imageUrl ? (
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden relative">
                <img
                  src={notification.imageUrl}
                  alt={notification.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                <div className="absolute bottom-0 right-0 bg-white/90 rounded-full p-0.5 shadow-xs">
                  {getIcon()}
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                {getIcon()}
              </div>
            )}

            {/* Texts */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 leading-snug">
                {notification.title}
              </h4>
              <p className="text-slate-600 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                {notification.message}
              </p>

              {/* Action Button */}
              <div className="mt-2.5 flex items-center space-x-2">
                <button
                  id="push-toast-action-btn"
                  onClick={handleActionClick}
                  className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors active:scale-95"
                >
                  <span>{notification.actionText || 'View Details'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={onDismiss}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>

          {/* Progress countdown bar */}
          <div className="h-0.5 bg-slate-100 overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6.5, ease: 'linear' }}
              className="h-full bg-blue-500"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

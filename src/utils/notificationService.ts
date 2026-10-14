import { NotificationPreferences, Notification, Product, ProductCategory, Order, OrderStatus } from '../types';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  orderUpdates: true,
  dealsAndFlashSales: true,
  recommendations: true,
  browserPush: false,
  soundAlert: true,
};

/**
 * Synthesizes a pleasant two-tone e-commerce chime using the Web Audio API.
 * Safe to call in browser environments; fails gracefully if audio context is blocked.
 */
export const playNotificationChime = (): void => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2: 880 Hz (A5) with slight delay for cheerful chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.09);

    gain2.gain.setValueAtTime(0, now + 0.09);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.09);
    osc2.stop(now + 0.45);
  } catch {
    // Audio context may be restricted by browser autoplay policy
  }
};

/**
 * Check if the browser supports native Web Push Notifications
 */
export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Get current browser notification permission
 */
export const getBrowserNotificationPermission = (): NotificationPermission => {
  if (!isPushSupported()) return 'denied';
  return window.Notification.permission;
};

/**
 * Request permission for native browser notifications
 */
export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) return 'denied';
  try {
    const permission = await window.Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
};

/**
 * Trigger a native desktop/mobile OS notification if granted
 */
export const sendNativeBrowserNotification = (
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    onClick?: () => void;
  }
): void => {
  if (!isPushSupported() || window.Notification.permission !== 'granted') {
    return;
  }

  try {
    const notif = new window.Notification(title, {
      body: options?.body,
      icon: options?.icon || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=128&q=80',
      tag: options?.tag,
      badge: options?.icon,
    });

    if (options?.onClick) {
      notif.onclick = () => {
        window.focus();
        options.onClick?.();
        notif.close();
      };
    }
  } catch {
    // Some mobile browsers restrict new Notification() directly outside of service workers
  }
};

/**
 * Generate formatted order notification for each lifecycle event
 */
export const buildOrderNotification = (
  order: Order,
  statusType: 'PLACED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
): Notification => {
  const itemNames = order.items.map((i) => i.product.title.split(' ')[0]).join(', ');
  const firstItemImage = order.items[0]?.product.images[0] || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80';

  let title = '';
  let message = '';
  let actionText = 'Track Live Order';

  switch (statusType) {
    case 'PLACED':
      title = `📦 Order Placed: #${order.id}`;
      message = `Your order of ₹${order.totalAmount.toLocaleString('en-IN')} (${itemNames}) is confirmed! Delivery expected ${order.estimatedDelivery}.`;
      actionText = 'View Order Details';
      break;
    case 'SHIPPED':
      title = `🚚 Order Dispatched: #${order.id}`;
      message = `Handed over to ${order.deliveryPartner} (AWB: ${order.trackingNumber}). It has left the regional hub!`;
      actionText = 'Track Shipment';
      break;
    case 'OUT_FOR_DELIVERY':
      title = `🛵 Out for Delivery: #${order.id}`;
      message = `Agent ${order.deliveryAgent?.name || 'Suresh'} is arriving today. Share Delivery OTP ${order.otpForDelivery} on arrival.`;
      actionText = 'View Live Delivery';
      break;
    case 'DELIVERED':
      title = `✅ Order Delivered: #${order.id}`;
      message = `Package successfully delivered to ${order.shippingAddress.city}. Thank you for shopping on Bharat Cart!`;
      actionText = 'Rate & Review';
      break;
    case 'CANCELLED':
      title = `⚠️ Order Cancelled: #${order.id}`;
      message = `Order has been cancelled. If paid via UPI/Card, refund of ₹${order.totalAmount.toLocaleString('en-IN')} is initiated.`;
      actionText = 'View Refund Status';
      break;
  }

  return {
    id: `notif-order-${statusType.toLowerCase()}-${Date.now()}`,
    title,
    message,
    type: 'ORDER',
    date: 'Just now',
    read: false,
    targetView: 'order-tracking',
    orderId: order.id,
    orderStatus: statusType,
    imageUrl: firstItemImage,
    timestamp: Date.now(),
    actionText,
  };
};

/**
 * Generate a Flash Sale / Deal Notification
 */
export const buildDealNotification = (
  dealProduct: Product,
  customTag?: string
): Notification => {
  const discount = dealProduct.discountPercent || Math.round(((dealProduct.mrp - dealProduct.price) / dealProduct.mrp) * 100);
  const tag = customTag || `⚡ Flash Deal: ${discount}% OFF`;

  return {
    id: `notif-deal-${dealProduct.id}-${Date.now()}`,
    title: `${tag} on ${dealProduct.brand}!`,
    message: `${dealProduct.title} is now available at ₹${dealProduct.price.toLocaleString('en-IN')} (MRP ₹${dealProduct.mrp.toLocaleString('en-IN')}). Limited stock available!`,
    type: 'DEAL',
    date: 'Just now',
    read: false,
    targetView: 'product-detail',
    productId: dealProduct.id,
    imageUrl: dealProduct.images[0],
    discountTag: `${discount}% OFF`,
    timestamp: Date.now(),
    actionText: 'Grab Deal Now',
  };
};

/**
 * Generate Personalized Recommendation based on user behavior (browsing history & wishlist)
 */
export const buildRecommendationNotification = (
  recommendedProduct: Product,
  reason: 'VIEWED_CATEGORY' | 'VIEWED_PRODUCT' | 'WISHLIST_SIMILAR' | 'TRENDING' = 'VIEWED_CATEGORY',
  contextCategory?: ProductCategory
): Notification => {
  let title = `✨ Recommended For You`;
  let message = `We found something you might love: ${recommendedProduct.title} by ${recommendedProduct.brand}.`;

  if (reason === 'VIEWED_CATEGORY' && contextCategory) {
    title = `✨ Because you explored ${contextCategory}`;
    message = `Check out top-rated ${recommendedProduct.title} starting at ₹${recommendedProduct.price.toLocaleString('en-IN')} (${recommendedProduct.rating}★).`;
  } else if (reason === 'WISHLIST_SIMILAR') {
    title = `🔥 Price Drop on Trending ${recommendedProduct.category}`;
    message = `Special offer on ${recommendedProduct.title}. Rated ${recommendedProduct.rating}★ by Indian shoppers!`;
  }

  return {
    id: `notif-rec-${recommendedProduct.id}-${Date.now()}`,
    title,
    message,
    type: 'RECOMMENDATION',
    date: 'Just now',
    read: false,
    targetView: 'product-detail',
    productId: recommendedProduct.id,
    imageUrl: recommendedProduct.images[0],
    discountTag: `${recommendedProduct.discountPercent}% OFF`,
    timestamp: Date.now(),
    actionText: 'View Product',
  };
};

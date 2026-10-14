import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ProductCategory, 
  CartItem, 
  WishlistItem, 
  Address, 
  Order, 
  OrderStatus, 
  Coupon, 
  Review, 
  Notification, 
  NotificationPreferences,
  UserBehavior,
  User, 
  SellerProfile, 
  UserRole, 
  ActiveView,
  AppLogoOption,
  AppLogoInfo,
  ImportedProduct,
  AppleProductSourceApp,
  ExternalAppOffer
} from '../types';
import { APP_LOGOS } from '../data/appLogos';
import { INITIAL_IMPORTED_PRODUCTS } from '../data/dropshipSources';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_COUPONS, 
  INITIAL_USER, 
  INITIAL_SELLERS, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS 
} from '../data/mockData';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  playNotificationChime,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  sendNativeBrowserNotification,
  buildOrderNotification,
  buildDealNotification,
  buildRecommendationNotification
} from '../utils/notificationService';

interface AppContextType {
  // Navigation & Role
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: User;
  currentUser: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;

  // Selection state
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  userPincode: string;
  setUserPincode: (pin: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating' | 'discount';
  setSortBy: (sort: 'popular' | 'price-low' | 'price-high' | 'rating' | 'discount') => void;
  minRating: number;
  setMinRating: (r: number) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  onlyAssured: boolean;
  setOnlyAssured: (val: boolean) => void;
  resetFilters: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product, 
    quantity?: number, 
    selectedSourceApp?: AppleProductSourceApp, 
    appliedAppOffer?: ExternalAppOffer
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  buyNow: (
    product: Product, 
    selectedSourceApp?: AppleProductSourceApp, 
    appliedAppOffer?: ExternalAppOffer
  ) => void;
  cartCount: number;
  cartItemsTotal: number;
  cartDiscountTotal: number;
  cartCouponDiscount: number;
  cartDeliveryFee: number;
  cartPlatformFee: number;
  cartTotal: number;

  // Coupons
  availableCoupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // Addresses
  addresses: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderTracking: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  voteHelpfulReview: (reviewId: string) => void;

  // Sellers
  sellers: SellerProfile[];
  currentSeller: SellerProfile;
  updateSellerKYC: (sellerId: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING') => void;

  // Notifications & Push Alerts
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;
  pushNotificationToast: Notification | null;
  dismissPushToast: () => void;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  browserPermission: NotificationPermission;
  requestBrowserPushPermission: () => Promise<NotificationPermission>;
  triggerOrderNotification: (order: Order, status: 'PLACED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED') => void;
  triggerDealNotification: (customTag?: string, product?: Product) => void;
  triggerRecommendationNotification: () => void;
  userBehavior: UserBehavior;
  trackProductView: (productId: string) => void;
  trackCategoryView: (category: ProductCategory) => void;
  trackSearch: (query: string) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  setSelectedOrderTrackingId: (orderId: string) => void;

  // Toast UI
  toast: string | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth modal
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // App Logos & Visual Identity
  selectedAppLogo: AppLogoOption;
  setSelectedAppLogo: (logo: AppLogoOption) => void;
  currentAppLogo: AppLogoInfo;
  currentAppLogoUrl: string;
  isAppLogoModalOpen: boolean;
  setIsAppLogoModalOpen: (open: boolean) => void;

  // Product Sourcing, Dropshipping & Social Sharing
  importedProducts: ImportedProduct[];
  importProductFromSource: (importedData: Omit<ImportedProduct, 'id' | 'createdAt' | 'importedAt' | 'shareCount'>) => ImportedProduct;
  updateImportedProduct: (product: ImportedProduct) => void;
  deleteImportedProduct: (productId: string) => void;
  recordProductShare: (productId: string, channel: string) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareModalProduct: Product | ImportedProduct | null;
  openShareProductModal: (product: Product | ImportedProduct) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('bc_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Selected state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('BC-2024-88412');
  const [userPincode, setUserPincode] = useState<string>('560001');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating' | 'discount'>('popular');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyAssured, setOnlyAssured] = useState<boolean>(false);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bc_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      // Ensure all catalog items (including Apple products) exist in the working catalog
      const existingIds = new Set(parsed.map((p) => p.id));
      const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
      return missing.length > 0 ? [...parsed, ...missing] : parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Imported / Dropshipped Products from external apps
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>(() => {
    const saved = localStorage.getItem('bc_imported_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_IMPORTED_PRODUCTS;
  });

  // Global Product Share Modal State
  const [shareModalProduct, setShareModalProduct] = useState<Product | ImportedProduct | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const openShareProductModal = (product: Product | ImportedProduct) => {
    setShareModalProduct(product);
    setIsShareModalOpen(true);
  };

  // Sync imported products to localStorage & ensure they exist in main store catalog
  useEffect(() => {
    localStorage.setItem('bc_imported_products', JSON.stringify(importedProducts));
  }, [importedProducts]);

  useEffect(() => {
    if (importedProducts.length > 0) {
      setProducts((currentProds) => {
        const existingIds = new Set(currentProds.map((p) => p.id));
        const missing = importedProducts.filter((ip) => !existingIds.has(ip.id));
        if (missing.length > 0) {
          return [...missing, ...currentProds];
        }
        return currentProds;
      });
    }
  }, [importedProducts]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bc_cart');
    return saved ? JSON.parse(saved) : [
      {
        productId: 'prod-mob-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
      },
      {
        productId: 'prod-fash-1',
        product: INITIAL_PRODUCTS[6],
        quantity: 1,
      }
    ];
  });

  // Coupons
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('bc_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('bc_wishlist');
    return saved ? JSON.parse(saved) : [
      {
        productId: 'prod-elec-2',
        product: INITIAL_PRODUCTS[4],
        addedAt: new Date().toISOString(),
      }
    ];
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('bc_addresses');
    return saved ? JSON.parse(saved) : INITIAL_USER.addresses;
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = INITIAL_USER.addresses.find(a => a.isDefault) || INITIAL_USER.addresses[0];
    return defaultAddr ? defaultAddr.id : '';
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('bc_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Sellers
  const [sellers, setSellers] = useState<SellerProfile[]>(() => {
    const saved = localStorage.getItem('bc_sellers');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });

  // Push Notifications state & preferences
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('bc_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'notif-1',
        title: '🛵 Out for Delivery!',
        message: 'Your order BC-2024-88412 is out with delivery agent Manoj Kumar. OTP: 4821.',
        type: 'ORDER',
        date: 'Just now',
        read: false,
        targetView: 'order-tracking',
        orderId: 'BC-2024-88412',
        orderStatus: 'OUT_FOR_DELIVERY',
        actionText: 'Track Live Delivery',
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
        timestamp: Date.now(),
      },
      {
        id: 'notif-2',
        title: '⚡ Lightning Flash Sale: 67% OFF!',
        message: 'boAt Rockerz 450 Pro Bluetooth Wireless Headphones at flat ₹999!',
        type: 'DEAL',
        date: '10 mins ago',
        read: false,
        targetView: 'product-detail',
        productId: 'prod-aud-2',
        discountTag: '67% OFF',
        actionText: 'Grab Deal Now',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        timestamp: Date.now() - 600000,
      },
      {
        id: 'notif-3',
        title: '✨ Recommended For You',
        message: 'Based on your interest in Smartphones, check out OnePlus 12R 5G (16GB RAM) starting at ₹39,999!',
        type: 'RECOMMENDATION',
        date: '1 hour ago',
        read: true,
        targetView: 'product-detail',
        productId: 'prod-mob-1',
        actionText: 'View Product',
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
        timestamp: Date.now() - 3600000,
      },
    ];
  });

  const [pushNotificationToast, setPushNotificationToast] = useState<Notification | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('bc_notification_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_NOTIFICATION_PREFERENCES;
  });

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return getBrowserNotificationPermission();
  });

  const [userBehavior, setUserBehavior] = useState<UserBehavior>(() => {
    const saved = localStorage.getItem('bc_user_behavior');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      viewedProductIds: ['prod-mob-1', 'prod-aud-1'],
      viewedCategories: ['Mobiles', 'Electronics'],
      searchHistory: ['OnePlus', 'Wireless Earbuds'],
      lastInteractedCategory: 'Mobiles',
    };
  });

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // App Logos & Visual Identity
  const [selectedAppLogo, setSelectedAppLogoState] = useState<AppLogoOption>(() => {
    const saved = localStorage.getItem('bc_app_logo');
    if (saved === 'classic' || saved === 'modern' || saved === 'luxe') return saved;
    return 'classic';
  });
  const [isAppLogoModalOpen, setIsAppLogoModalOpen] = useState<boolean>(false);

  const setSelectedAppLogo = (logo: AppLogoOption) => {
    setSelectedAppLogoState(logo);
    localStorage.setItem('bc_app_logo', logo);
    const found = APP_LOGOS.find((l) => l.id === logo);
    if (found) {
      const favicons = document.querySelectorAll("link[rel*='icon']");
      favicons.forEach((el) => {
        (el as HTMLLinkElement).href = found.url;
      });
      showToast(`Active logo updated to "${found.name}"!`);
    }
  };

  const currentAppLogo = APP_LOGOS.find((l) => l.id === selectedAppLogo) || APP_LOGOS[0];
  const currentAppLogoUrl = currentAppLogo.url;

  // Sync favicon on mount or logo change
  useEffect(() => {
    const favicons = document.querySelectorAll("link[rel*='icon']");
    favicons.forEach((el) => {
      (el as HTMLLinkElement).href = currentAppLogoUrl;
    });
  }, [currentAppLogoUrl]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bc_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('bc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('bc_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('bc_coupons', JSON.stringify(availableCoupons));
  }, [availableCoupons]);

  useEffect(() => {
    localStorage.setItem('bc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bc_notification_preferences', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    localStorage.setItem('bc_user_behavior', JSON.stringify(userBehavior));
  }, [userBehavior]);

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartItemsTotal = cart.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const cartDiscountTotal = cart.reduce((acc, item) => acc + (item.product.mrp - item.product.price) * item.quantity, 0);
  const subtotalAfterProductDiscount = cartItemsTotal - cartDiscountTotal;

  // Coupon Calculation
  let cartCouponDiscount = 0;
  const couponMinOrder = appliedCoupon?.minOrderValue ?? appliedCoupon?.minOrderAmount ?? 0;
  if (appliedCoupon && subtotalAfterProductDiscount >= couponMinOrder) {
    if (appliedCoupon.discountType === 'FLAT') {
      cartCouponDiscount = appliedCoupon.discountValue;
    } else {
      const calculated = (subtotalAfterProductDiscount * appliedCoupon.discountValue) / 100;
      cartCouponDiscount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }
  }

  const cartDeliveryFee = subtotalAfterProductDiscount > 500 || subtotalAfterProductDiscount === 0 ? 0 : 40;
  const cartPlatformFee = cart.length > 0 ? 5 : 0;
  const cartTotal = Math.max(0, subtotalAfterProductDiscount - cartCouponDiscount + cartDeliveryFee + cartPlatformFee);

  // Cart Actions
  const addToCart = (
    product: Product, 
    quantity = 1, 
    selectedSourceApp?: AppleProductSourceApp, 
    appliedAppOffer?: ExternalAppOffer
  ) => {
    // If an external app offer is selected, use that store's price and metadata
    const effectivePrice = appliedAppOffer ? appliedAppOffer.price : product.price;
    const effectiveProduct: Product = {
      ...product,
      price: effectivePrice,
      selectedSourceApp: selectedSourceApp || product.selectedSourceApp,
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => 
        item.productId === product.id && 
        (!selectedSourceApp || item.selectedSourceApp === selectedSourceApp)
      );

      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                product: effectiveProduct,
                selectedSourceApp: selectedSourceApp || item.selectedSourceApp,
                selectedSourceAppName: appliedAppOffer?.appName || item.selectedSourceAppName,
                appliedAppOffer: appliedAppOffer || item.appliedAppOffer,
              }
            : item
        );
      }
      return [
        ...prev, 
        { 
          productId: product.id, 
          product: effectiveProduct, 
          quantity,
          selectedSourceApp,
          selectedSourceAppName: appliedAppOffer?.appName,
          appliedAppOffer
        }
      ];
    });

    const storeNote = appliedAppOffer ? ` (via ${appliedAppOffer.appName})` : '';
    showToast(`Added "${product.title.slice(0, 24)}..."${storeNote} to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const buyNow = (
    product: Product, 
    selectedSourceApp?: AppleProductSourceApp, 
    appliedAppOffer?: ExternalAppOffer
  ) => {
    const effectivePrice = appliedAppOffer ? appliedAppOffer.price : product.price;
    const effectiveProduct: Product = {
      ...product,
      price: effectivePrice,
      selectedSourceApp: selectedSourceApp || product.selectedSourceApp,
    };

    setCart((prev) => {
      const existing = prev.find((item) => 
        item.productId === product.id && 
        (!selectedSourceApp || item.selectedSourceApp === selectedSourceApp)
      );
      if (existing) return prev;
      return [
        ...prev, 
        { 
          productId: product.id, 
          product: effectiveProduct, 
          quantity: 1,
          selectedSourceApp,
          selectedSourceAppName: appliedAppOffer?.appName,
          appliedAppOffer
        }
      ];
    });
    setActiveView('checkout');
  };

  // Wishlist Actions
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      showToast(`Removed from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, { productId: product.id, product, addedAt: new Date().toISOString() }]);
      showToast(`Saved to Wishlist!`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Removed from Wishlist');
  };

  const moveToCartFromWishlist = (productId: string) => {
    const item = wishlist.find((i) => i.productId === productId);
    if (item) {
      addToCart(item.product, 1);
      setWishlist((prev) => prev.filter((i) => i.productId !== productId));
    }
  };

  // Coupon Actions
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = availableCoupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const minVal = found.minOrderValue ?? found.minOrderAmount ?? 0;
    if (subtotalAfterProductDiscount < minVal) {
      return {
        success: false,
        message: `Minimum order value of ₹${minVal.toLocaleString('en-IN')} required for ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied!`);
    return { success: true, message: `Yay! Coupon ${found.code} applied successfully.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const addCoupon = (coupon: Coupon) => {
    setAvailableCoupons((prev) => [coupon, ...prev]);
    showToast(`New coupon ${coupon.code} created!`);
  };

  const deleteCoupon = (code: string) => {
    setAvailableCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
    showToast(`Coupon ${code} removed.`);
  };

  // Address Actions
  const addAddress = (newAddrData: Omit<Address, 'id'>) => {
    const newId = `addr-${Date.now()}`;
    const newAddr: Address = { ...newAddrData, id: newId };
    setAddresses((prev) => {
      const updated = newAddr.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
      return [newAddr, ...updated];
    });
    setSelectedAddressId(newId);
    showToast('New address saved successfully!');
  };

  const updateAddress = (updatedAddr: Address) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === updatedAddr.id) return updatedAddr;
        if (updatedAddr.isDefault) return { ...a, isDefault: false };
        return a;
      })
    );
    showToast('Address updated');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      const remaining = addresses.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        setSelectedAddressId(remaining[0].id);
      }
    }
    showToast('Address deleted');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    setSelectedAddressId(id);
    showToast('Default address updated');
  };

  // Order Actions
  const placeOrder = (orderPayload: Partial<Order>): Order => {
    const currentAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || INITIAL_USER.addresses[0];
    const newOrderId = `BC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: newOrderId,
      customerId: user.id,
      customerName: currentAddress.fullName || user.name,
      customerPhone: currentAddress.phone || user.phone,
      items: [...cart],
      itemsTotal: cartItemsTotal,
      discountAmount: cartDiscountTotal,
      couponApplied: appliedCoupon?.code,
      couponDiscount: cartCouponDiscount,
      deliveryFee: cartDeliveryFee,
      platformFee: cartPlatformFee,
      totalAmount: cartTotal,
      shippingAddress: currentAddress,
      paymentMethod: orderPayload.paymentMethod || 'UPI',
      paymentDetails: orderPayload.paymentDetails || {
        method: orderPayload.paymentMethod || 'UPI',
        transactionId: `TXN-BC-${Date.now()}`,
        status: 'SUCCESS',
        paidAt: new Date().toISOString(),
      },
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'In 2-3 Business Days',
      deliveryPartner: 'Delhivery Express Logistics',
      trackingNumber: `DEL-${Math.floor(100000000 + Math.random() * 900000000)}`,
      otpForDelivery: randomOtp,
      deliveryAgent: {
        name: 'Suresh Yadav',
        phone: '+91 98440 33211',
        vehicle: 'Bajaj Pulsar (KA-03-MM-5521)',
      },
      trackingSteps: [
        {
          title: 'Order Placed & Confirmed',
          description: `Payment of ₹${cartTotal.toLocaleString('en-IN')} confirmed via ${orderPayload.paymentMethod || 'UPI'}`,
          timestamp: 'Just Now',
          location: 'Bharat Cart Central Gateway',
          completed: true,
          current: true,
        },
        {
          title: 'Packed & Dispatched',
          description: 'Package being verified by Seller and labeled for transit',
          timestamp: 'Estimated Tomorrow',
          location: 'Seller Warehouse',
          completed: false,
          current: false,
        },
        {
          title: 'In Transit',
          description: 'Package arriving at your regional sorting hub',
          timestamp: 'In 2 Days',
          location: 'Regional Sorting Facility',
          completed: false,
          current: false,
        },
        {
          title: 'Out for Delivery',
          description: 'Delivery executive will deliver with OTP verification',
          timestamp: 'In 3 Days',
          location: `${currentAddress.city} Delivery Center`,
          completed: false,
          current: false,
        },
        {
          title: 'Delivered',
          description: `Will be handed over to ${currentAddress.fullName}`,
          timestamp: 'Expected within 3 days',
          location: currentAddress.city,
          completed: false,
          current: false,
        },
      ],
      ...orderPayload,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    clearCart();

    // Trigger push notification for newly placed order
    triggerOrderNotification(newOrder, 'PLACED');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: newStatus,
        };
      })
    );
    showToast(`Order status updated to ${newStatus}`);
  };

  // Simulates tracking progress step by step (Placed -> Confirmed -> Shipped -> Out for Delivery -> Delivered)
  const advanceOrderTracking = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const currentStepIndex = order.trackingSteps.findIndex((s) => s.current);
        const nextStepIndex = currentStepIndex + 1;

        if (nextStepIndex >= order.trackingSteps.length) {
          showToast('Order is already marked as Delivered!');
          return order;
        }

        const newSteps = order.trackingSteps.map((step, idx) => {
          if (idx < nextStepIndex) {
            return { ...step, completed: true, current: false };
          }
          if (idx === nextStepIndex) {
            return { ...step, completed: idx === order.trackingSteps.length - 1, current: true, timestamp: 'Updated Just Now' };
          }
          return { ...step, completed: false, current: false };
        });

        let updatedStatus: OrderStatus = order.status;
        let notifStatus: 'PLACED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' = 'PLACED';
        if (nextStepIndex === 1) {
          updatedStatus = 'CONFIRMED';
          notifStatus = 'PLACED';
        } else if (nextStepIndex === 2) {
          updatedStatus = 'SHIPPED';
          notifStatus = 'SHIPPED';
        } else if (nextStepIndex === 3) {
          updatedStatus = 'OUT_FOR_DELIVERY';
          notifStatus = 'OUT_FOR_DELIVERY';
        } else if (nextStepIndex === 4) {
          updatedStatus = 'DELIVERED';
          notifStatus = 'DELIVERED';
        }

        const updatedOrder = {
          ...order,
          status: updatedStatus,
          trackingSteps: newSteps,
        };

        // Dispatch real-time push alert for step change
        triggerOrderNotification(updatedOrder, notifStatus);

        showToast(`Tracking progressed: ${newSteps[nextStepIndex].title}`);
        return updatedOrder;
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    let cancelledOrder: Order | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          cancelledOrder = { ...o, status: 'CANCELLED' as OrderStatus };
          return cancelledOrder;
        }
        return o;
      })
    );
    if (cancelledOrder) {
      triggerOrderNotification(cancelledOrder, 'CANCELLED');
    }
    showToast(`Order #${orderId} cancelled.`);
  };

  // Review Actions
  const addReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Today',
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== newReviewData.productId) return p;
        const currentCount = p.ratingCount;
        const newCount = currentCount + 1;
        const newRating = parseFloat(((p.rating * currentCount + newReviewData.rating) / newCount).toFixed(1));
        return { ...p, rating: newRating, ratingCount: newCount };
      })
    );

    showToast('Thank you! Your verified review was posted.');
  };

  const voteHelpfulReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Marked as helpful');
  };

  // Product Catalog Actions (Seller/Admin)
  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${p.title.slice(0, 20)}..." listed successfully!`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product updated`);
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stockCount: newStock, inStock: newStock > 0 }
          : p
      )
    );
    showToast('Inventory stock updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setImportedProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from store');
  };

  // Product Sourcing & Dropshipping Actions
  const importProductFromSource = (
    importedData: Omit<ImportedProduct, 'id' | 'createdAt' | 'importedAt' | 'shareCount'>
  ): ImportedProduct => {
    const now = new Date().toISOString();
    const newImported: ImportedProduct = {
      ...importedData,
      id: `IMP-${Date.now().toString().slice(-6)}`,
      createdAt: now,
      importedAt: now,
      shareCount: 0,
      totalResellerSales: 0,
      totalProfitEarned: 0,
      sellerId: user.id || 'reseller-store',
      sellerName: `${user.name || 'My'} Store`,
      badge: 'Trending',
    };

    setImportedProducts((prev) => [newImported, ...prev]);
    setProducts((prev) => [newImported, ...prev]);
    showToast(`Added "${newImported.title.slice(0, 24)}..." to your store! Ready to share.`);
    return newImported;
  };

  const updateImportedProduct = (updated: ImportedProduct) => {
    setImportedProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Updated resale price and profit margin');
  };

  const deleteImportedProduct = (productId: string) => {
    setImportedProducts((prev) => prev.filter((p) => p.id !== productId));
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from imported catalog');
  };

  const recordProductShare = (productId: string, _channel: string) => {
    setImportedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, shareCount: (p.shareCount || 0) + 1 } : p))
    );
  };

  // Seller KYC Actions (Admin)
  const updateSellerKYC = (sellerId: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING') => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: status } : s))
    );
    showToast(`Seller KYC status updated to ${status}`);
  };

  // Notifications & Push Alerts Dispatchers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notification list cleared');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const dismissPushToast = () => {
    setPushNotificationToast(null);
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences((prev) => ({ ...prev, ...prefs }));
    showToast('Notification preferences updated');
  };

  const requestBrowserPushPermission = async (): Promise<NotificationPermission> => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      updateNotificationPreferences({ browserPush: true });
      showToast('Browser Push Notifications Enabled!');
      dispatchPushNotification({
        id: `notif-welcome-${Date.now()}`,
        title: '🔔 Push Notifications Active',
        message: 'You will receive real-time order tracking milestones, flash sale drops, and personalized deals.',
        type: 'SYSTEM',
        date: 'Just now',
        read: false,
        actionText: 'Great!',
        timestamp: Date.now(),
      });
    } else if (perm === 'denied') {
      updateNotificationPreferences({ browserPush: false });
      showToast('Push permission was declined.');
    }
    return perm;
  };

  const dispatchPushNotification = (notif: Notification) => {
    // Honor user preferences
    if (notif.type === 'ORDER' && !notificationPreferences.orderUpdates) return;
    if ((notif.type === 'DEAL' || notif.type === 'OFFER') && !notificationPreferences.dealsAndFlashSales) return;
    if (notif.type === 'RECOMMENDATION' && !notificationPreferences.recommendations) return;

    // Prepend to persistent notification history
    setNotifications((prev) => [notif, ...prev]);

    // Trigger visual HUD banner toast
    setPushNotificationToast(notif);

    // Audible chime sound
    if (notificationPreferences.soundAlert) {
      playNotificationChime();
    }

    // Native browser push notification
    if (notificationPreferences.browserPush && browserPermission === 'granted') {
      sendNativeBrowserNotification(notif.title, {
        body: notif.message,
        icon: notif.imageUrl,
        tag: notif.id,
        onClick: () => {
          if (notif.orderId) {
            setSelectedOrderId(notif.orderId);
            setActiveView('order-tracking');
          } else if (notif.productId) {
            setSelectedProductId(notif.productId);
            setActiveView('product-detail');
          }
        },
      });
    }
  };

  const triggerOrderNotification = (
    order: Order,
    status: 'PLACED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  ) => {
    const notif = buildOrderNotification(order, status);
    dispatchPushNotification(notif);
  };

  const triggerDealNotification = (customTag?: string, product?: Product) => {
    let dealProduct = product;
    if (!dealProduct) {
      const discounted = products.filter((p) => (p.discountPercent || 0) >= 20);
      dealProduct = discounted[Math.floor(Math.random() * discounted.length)] || products[0];
    }
    const notif = buildDealNotification(dealProduct, customTag);
    dispatchPushNotification(notif);
  };

  const triggerRecommendationNotification = () => {
    const categoryOfInterest = userBehavior.lastInteractedCategory || 
      (wishlist.length > 0 ? wishlist[0].product.category : 'Mobiles');

    const candidates = products.filter(
      (p) => p.category === categoryOfInterest && !userBehavior.viewedProductIds.includes(p.id)
    );

    const recommendedProduct = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : products.find((p) => p.category === categoryOfInterest) || products[0];

    const notif = buildRecommendationNotification(
      recommendedProduct,
      userBehavior.lastInteractedCategory ? 'VIEWED_CATEGORY' : 'TRENDING',
      categoryOfInterest
    );
    dispatchPushNotification(notif);
  };

  const trackProductView = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setUserBehavior((prev) => {
      const updatedIds = [productId, ...prev.viewedProductIds.filter((id) => id !== productId)].slice(0, 20);
      const updatedCats = product
        ? [product.category, ...prev.viewedCategories.filter((c) => c !== product.category)].slice(0, 10)
        : prev.viewedCategories;

      return {
        ...prev,
        viewedProductIds: updatedIds,
        viewedCategories: updatedCats,
        lastInteractedCategory: product ? product.category : prev.lastInteractedCategory,
      };
    });
  };

  const trackCategoryView = (category: ProductCategory) => {
    setUserBehavior((prev) => ({
      ...prev,
      viewedCategories: [category, ...prev.viewedCategories.filter((c) => c !== category)].slice(0, 10),
      lastInteractedCategory: category,
    }));
  };

  const trackSearch = (query: string) => {
    if (!query.trim()) return;
    setUserBehavior((prev) => ({
      ...prev,
      searchHistory: [query.trim(), ...prev.searchHistory.filter((q) => q !== query.trim())].slice(0, 10),
    }));
  };

  const setSelectedOrderTrackingId = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand(null);
    setPriceRange([0, 100000]);
    setSortBy('popular');
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyAssured(false);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        role,
        setRole,
        user,
        currentUser: user,
        setUser,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        userPincode,
        setUserPincode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        minRating,
        setMinRating,
        onlyInStock,
        setOnlyInStock,
        onlyAssured,
        setOnlyAssured,
        resetFilters,
        products,
        addProduct,
        updateProduct,
        updateProductStock,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        buyNow,
        cartCount,
        cartItemsTotal,
        cartDiscountTotal,
        cartCouponDiscount,
        cartDeliveryFee,
        cartPlatformFee,
        cartTotal,
        availableCoupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        placeOrder,
        updateOrderStatus,
        advanceOrderTracking,
        cancelOrder,
        reviews,
        addReview,
        voteHelpfulReview,
        sellers,
        currentSeller: sellers[0],
        updateSellerKYC,
        notifications,
        markNotificationRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        pushNotificationToast,
        dismissPushToast,
        notificationPreferences,
        updateNotificationPreferences,
        browserPermission,
        requestBrowserPushPermission,
        triggerOrderNotification,
        triggerDealNotification,
        triggerRecommendationNotification,
        userBehavior,
        trackProductView,
        trackCategoryView,
        trackSearch,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        setSelectedOrderTrackingId,
        toast,
        toastMessage: toast,
        showToast,
        authModalOpen,
        setAuthModalOpen,
        selectedAppLogo,
        setSelectedAppLogo,
        currentAppLogo,
        currentAppLogoUrl,
        isAppLogoModalOpen,
        setIsAppLogoModalOpen,
        importedProducts,
        importProductFromSource,
        updateImportedProduct,
        deleteImportedProduct,
        recordProductShare,
        isShareModalOpen,
        setIsShareModalOpen,
        shareModalProduct,
        openShareProductModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

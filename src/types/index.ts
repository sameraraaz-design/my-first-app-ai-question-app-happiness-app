export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export type ProductCategory = 
  | 'Electronics'
  | 'Mobiles'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Grocery'
  | 'Beauty'
  | 'Sports';

export type AppleProductSourceApp = 
  | 'apple_store' 
  | 'amazon' 
  | 'flipkart' 
  | 'croma' 
  | 'vijay_sales' 
  | 'reliance_digital';

export interface ExternalAppOffer {
  appId: AppleProductSourceApp;
  appName: string;
  appBadgeColor: string;
  appIconBg: string;
  price: number; // Current live price on this app in INR
  mrp: number;
  discountPercent: number;
  inStock: boolean;
  deliveryTime: string;
  deliveryType: 'prime' | 'standard' | 'store_pickup' | 'same_day';
  bankOffer: string; // e.g. "Flat ₹5,000 Instant Cashback on HDFC Bank Cards"
  exchangeBonus?: string; // e.g. "Up to ₹38,000 Exchange Bonus on old smartphone"
  officialWarranty: string; // e.g. "1 Year Apple India Warranty"
  rating: number;
  ratingCount: number;
  directUrl: string;
  isLowestPrice?: boolean;
  perks?: string[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  price: number; // Selling price in INR
  mrp: number; // Maximum retail price in INR
  discountPercent: number;
  rating: number;
  ratingCount: number;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  sellerId: string;
  sellerName: string;
  badge?: 'Bestseller' | 'Mega Deal' | 'Bharat Assured' | 'Trending' | 'New Arrival' | 'Top Deal';
  deliveryDays: number;
  freeDelivery: boolean;
  returnPolicyDays: number;
  codAvailable: boolean;
  createdAt: string;
  // Apple & Cross-App Sourcing fields
  isAppleProduct?: boolean;
  appleSeries?: 'iPhone' | 'MacBook' | 'iPad' | 'Watch' | 'AirPods' | 'Accessories';
  externalAppOffers?: ExternalAppOffer[];
  selectedSourceApp?: AppleProductSourceApp;
  colorVariants?: { name: string; hex: string; image?: string }[];
  storageVariants?: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
  selectedSourceApp?: AppleProductSourceApp;
  selectedSourceAppName?: string;
  appliedAppOffer?: ExternalAppOffer;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  flatHouse: string;
  areaStreet: string;
  landmark?: string;
  city: string;
  state: string;
  addressType: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD' | 'EMI';

export interface PaymentDetails {
  method: PaymentMethod;
  upiApp?: 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'Other UPI';
  upiId?: string;
  cardLast4?: string;
  cardNetwork?: 'RuPay' | 'Visa' | 'Mastercard';
  bankName?: string;
  transactionId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  paidAt: string;
}

export type OrderStatus = 
  | 'PLACED'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  itemsTotal: number;
  discountAmount: number;
  couponApplied?: string;
  couponDiscount: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingSteps: OrderTrackingStep[];
  deliveryPartner: string;
  trackingNumber: string;
  otpForDelivery: string;
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  active?: boolean;
  expiresAt?: string;
  validUntil?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userLocation: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export type NotificationType = 'ORDER' | 'DEAL' | 'RECOMMENDATION' | 'SYSTEM' | 'OFFER';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
  targetView?: string;
  orderId?: string;
  orderStatus?: OrderStatus;
  productId?: string;
  imageUrl?: string;
  discountTag?: string;
  timestamp?: number;
  actionText?: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  dealsAndFlashSales: boolean;
  recommendations: boolean;
  browserPush: boolean;
  soundAlert: boolean;
}

export interface UserBehavior {
  viewedProductIds: string[];
  viewedCategories: ProductCategory[];
  searchHistory: string[];
  lastInteractedCategory?: ProductCategory;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  ownerName: string;
  name?: string;
  email: string;
  phone: string;
  gstin: string;
  gstNumber?: string;
  pan: string;
  panNumber?: string;
  city: string;
  state: string;
  pincode: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  productsCount: number;
  joinedDate: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
  };
}

export type ActiveView = 
  | 'home'
  | 'search'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'orders'
  | 'order-tracking'
  | 'wishlist'
  | 'profile'
  | 'support'
  | 'seller-portal'
  | 'seller-dashboard'
  | 'admin-portal'
  | 'admin-dashboard'
  | 'import-resell'
  | 'apple-store'
  | 'apple-hub';

export type SourceAppPlatform = 
  | 'meesho' 
  | 'aliexpress' 
  | 'amazon' 
  | 'flipkart' 
  | 'shopify' 
  | 'indiamart' 
  | 'tiktok_shop' 
  | 'custom_url';

export interface ImportedProduct extends Product {
  sourcePlatform: SourceAppPlatform;
  sourceUrl?: string;
  sourceOriginalPrice: number; // Wholesale/Supplier cost
  resellerMarkup: number; // Added profit markup
  profitMarginPercent: number; // Computed profit margin %
  resellerNotes?: string;
  importedAt: string;
  shareCount: number;
  totalResellerSales?: number;
  totalProfitEarned?: number;
}

export type AppLogoOption = 'classic' | 'modern' | 'luxe';

export interface AppLogoInfo {
  id: AppLogoOption;
  name: string;
  tagline: string;
  url: string;
  badge: string;
  themeColor: string;
  accentHex: string;
  description: string;
  dimensions: string;
  format: string;
  downloadName: string;
}

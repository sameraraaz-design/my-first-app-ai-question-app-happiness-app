import { ProductCategory, SourceAppPlatform, ImportedProduct } from '../types';

export interface SourcePlatformInfo {
  id: SourceAppPlatform;
  name: string;
  tagline: string;
  badgeColor: string;
  accentColor: string;
  iconBg: string;
  averageProfitMargin: string;
  shippingEstimate: string;
  description: string;
}

export const SOURCE_PLATFORMS: Record<SourceAppPlatform, SourcePlatformInfo> = {
  meesho: {
    id: 'meesho',
    name: 'Meesho Supplier Hub',
    tagline: "India's #1 Reseller & Wholesale Network",
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    accentColor: '#9C27B0',
    iconBg: 'bg-pink-600',
    averageProfitMargin: '35% - 60%',
    shippingEstimate: '3-5 business days across India',
    description: 'Factory-direct ethnic wear, jewelry, home decor, and daily lifestyle products with COD support.',
  },
  aliexpress: {
    id: 'aliexpress',
    name: 'AliExpress Global Dropship',
    tagline: 'Direct-from-Manufacturer Tech & Gadgets',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    accentColor: '#FF5722',
    iconBg: 'bg-amber-600',
    averageProfitMargin: '45% - 75%',
    shippingEstimate: '7-12 days global tracked delivery',
    description: 'Viral TikTok accessories, smart wearables, RGB tech gear, and unique consumer electronics.',
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon Business / FBA',
    tagline: 'High Trust Prime Fast-Fulfillment',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    accentColor: '#232F3E',
    iconBg: 'bg-slate-900',
    averageProfitMargin: '20% - 40%',
    shippingEstimate: '1-3 days express dispatch',
    description: 'Branded premium consumer electronics, personal care, and certified authentic appliances.',
  },
  flipkart: {
    id: 'flipkart',
    name: 'Flipkart Wholesale',
    tagline: 'SuperCoins & Pan-India B2B Hub',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    accentColor: '#2874F0',
    iconBg: 'bg-blue-600',
    averageProfitMargin: '25% - 45%',
    shippingEstimate: '2-4 days Bharat express',
    description: 'Smartphones, Indian audio accessories, kitchen appliances, and fashion collections.',
  },
  shopify: {
    id: 'shopify',
    name: 'Shopify D2C Store',
    tagline: 'Independent Designer Brands & Dropshippers',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accentColor: '#008060',
    iconBg: 'bg-emerald-600',
    averageProfitMargin: '40% - 65%',
    shippingEstimate: '3-6 days direct courier',
    description: 'Artisanal crafts, organic skin care, boutique fashion, and minimalist stationery.',
  },
  indiamart: {
    id: 'indiamart',
    name: 'IndiaMART B2B Exporters',
    tagline: 'Bulk Manufacturing Lots & Surat Mills',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    accentColor: '#00A699',
    iconBg: 'bg-teal-700',
    averageProfitMargin: '50% - 85%',
    shippingEstimate: '4-7 days bulk transport',
    description: 'Surat textile sarees, brassware from Moradabad, and direct stainless kitchenware lots.',
  },
  tiktok_shop: {
    id: 'tiktok_shop',
    name: 'TikTok Viral Finds',
    tagline: 'Trending Social Video Products',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    accentColor: '#FE2C55',
    iconBg: 'bg-purple-700',
    averageProfitMargin: '50% - 80%',
    shippingEstimate: '5-9 days express logistics',
    description: 'High-conversion viral video trends, smart aesthetic home goods, and beauty hacks.',
  },
  custom_url: {
    id: 'custom_url',
    name: 'Custom Web Store Link',
    tagline: 'Universal Product Extractor',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    accentColor: '#4F46E5',
    iconBg: 'bg-indigo-600',
    averageProfitMargin: '30% - 60%',
    shippingEstimate: 'Standard courier delivery',
    description: 'Extract title, images, specifications, and pricing from any publicly accessible shopping link.',
  },
};

export interface DemoSourcedProduct {
  sourcePlatform: SourceAppPlatform;
  sampleUrl: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  sourceOriginalPrice: number; // Wholesale cost
  suggestedResalePrice: number;
  mrp: number;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  stockCount: number;
  supplierRating: number;
  supplierOrders: number;
  deliveryDays: number;
  shippingCost: number;
}

export const DEMO_SOURCE_PRODUCTS: DemoSourcedProduct[] = [
  {
    sourcePlatform: 'meesho',
    sampleUrl: 'https://meesho.com/s/p/trending-anarkali-kurta-set/8892',
    title: 'Jaipuri Pure Cotton Embroidered Anarkali Kurta with Pant & Dupatta Set',
    brand: 'Jaipuri Vastra Mills',
    category: 'Fashion',
    subcategory: 'Ethnic Wear',
    sourceOriginalPrice: 380,
    suggestedResalePrice: 699,
    mrp: 1499,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733975-045330364f33?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Exquisite authentic Jaipur hand-block printed Anarkali suit set crafted with 100% breathable organic cotton, paired with matching pants and mulmul dupatta. Ideal for festive and daily elegance.',
    features: [
      '100% Pure breathable premium cotton fabric',
      'Hand embroidery zari yoke border design',
      'Pre-shrunk color-fast guaranteed dyes',
      'Includes Anarkali kurta, straight pant & 2.2m dupatta',
    ],
    specs: {
      Fabric: 'Pure Cambric Cotton 60x60',
      Pattern: 'Anarkali Flare with Gotta Patti',
      Stitch: 'Full Stitched Ready to Wear',
      WashCare: 'Gentle Machine Wash',
      Origin: 'Sanganer, Jaipur (Rajasthan)',
    },
    stockCount: 45,
    supplierRating: 4.8,
    supplierOrders: 3420,
    deliveryDays: 3,
    shippingCost: 0,
  },
  {
    sourcePlatform: 'aliexpress',
    sampleUrl: 'https://aliexpress.com/item/t9-pro-anc-wireless-earbuds/100500612.html',
    title: 'AcousticPro T9 Active Noise Cancelling Wireless Earbuds with Low Latency Gaming',
    brand: 'AcousticPro Audio',
    category: 'Electronics',
    subcategory: 'Audio & Wearables',
    sourceOriginalPrice: 520,
    suggestedResalePrice: 1199,
    mrp: 2999,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Next-generation Bluetooth 5.4 earbuds featuring 35dB Active Noise Cancellation, quad ENC microphones for crystal-clear calling, and 45ms ultra-low gaming latency. 40 hours total playtime.',
    features: [
      '35dB Hybrid Active Noise Cancellation (ANC)',
      '13mm Titanium-coated dynamic bass drivers',
      'Quad mic AI environmental noise cancellation for calls',
      'IPX5 sweat and splash water resistance',
      '40 Hours battery backup with USB-C fast charging',
    ],
    specs: {
      Connectivity: 'Bluetooth 5.4 + EDR',
      BatteryLife: '8h earbuds + 32h charging case',
      DriverSize: '13mm Beryllium Diaphragm',
      ChargingTime: '45 mins Fast Charge',
      Warranty: '1 Year Manufacturer Guarantee',
    },
    stockCount: 80,
    supplierRating: 4.9,
    supplierOrders: 8940,
    deliveryDays: 5,
    shippingCost: 0,
  },
  {
    sourcePlatform: 'shopify',
    sampleUrl: 'https://craftleather.co/products/classic-vintage-messenger-bag',
    title: 'Handcrafted Full-Grain Buffalo Leather Laptop Messenger & Office Satchel',
    brand: 'Heritage Leatherworks',
    category: 'Fashion',
    subcategory: 'Bags & Accessories',
    sourceOriginalPrice: 850,
    suggestedResalePrice: 1799,
    mrp: 3999,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Timeless vintage full-grain buffalo leather bag with padded 15.6-inch laptop compartment, antique brass hardware, and heavy-duty YKK zippers. Ages gracefully with a natural rich patina.',
    features: [
      '100% Genuine vintage treated buffalo leather',
      'Padded sleeve fits laptops up to 15.6 inches',
      'Heavy-duty solid brass buckles and YKK zips',
      'Adjustable padded shoulder strap with ergonomic grip',
    ],
    specs: {
      Material: 'Top Grain Buffalo Hide',
      Dimensions: '16 x 12 x 4.5 inches',
      Compartments: '3 Main + 4 Internal Organizer Pockets',
      Weight: '1.2 kg',
      Color: 'Vintage Tan Saddle',
    },
    stockCount: 22,
    supplierRating: 4.7,
    supplierOrders: 1120,
    deliveryDays: 4,
    shippingCost: 0,
  },
  {
    sourcePlatform: 'amazon',
    sampleUrl: 'https://amazon.in/dp/B0CX8932KP/smart-watch-bluetooth-calling',
    title: 'PulseFit Chrono AMOLED 1.43" Bluetooth Calling Smartwatch with AI Health Tracker',
    brand: 'PulseFit Tech',
    category: 'Mobiles',
    subcategory: 'Smartwatches',
    sourceOriginalPrice: 950,
    suggestedResalePrice: 1999,
    mrp: 4999,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Stunning 1.43-inch Always-On AMOLED smartwatch with 1000 nits peak brightness, single-chip BT calling, 120+ sports modes, 24/7 continuous heart rate and SpO2 tracking.',
    features: [
      '1.43" Vivid AMOLED Display (466x466 resolution, Always-On)',
      'Crisp Bluetooth Calling with noise-filtering mic & speaker',
      '24/7 SpO2, Heart Rate, Sleep Quality, and Stress Monitor',
      'Zinc alloy metallic unibody with magnetic silicone strap',
      'IP68 Water resistance suitable for swimming & workouts',
    ],
    specs: {
      Display: '1.43" AMOLED 1000 Nits',
      Battery: 'Up to 10 days standby, 3 days calling',
      Compatibility: 'Android 6.0+ & iOS 10.0+',
      Sensors: 'Optical PPG HR, 3-Axis Accel, SpO2',
      Colors: 'Midnight Carbon Black',
    },
    stockCount: 60,
    supplierRating: 4.6,
    supplierOrders: 4500,
    deliveryDays: 2,
    shippingCost: 0,
  },
  {
    sourcePlatform: 'indiamart',
    sampleUrl: 'https://indiamart.com/proddetail/insulated-stainless-steel-bottle-750ml.html',
    title: 'UltraThermos Double-Wall Vacuum Insulated 304 Stainless Steel Bottle 750ml',
    brand: 'ThermaSteel India',
    category: 'Home & Kitchen',
    subcategory: 'Kitchen & Dining',
    sourceOriginalPrice: 220,
    suggestedResalePrice: 499,
    mrp: 999,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Food-grade 304 stainless steel thermos flask keeping beverages hot for 18 hours or ice-cold for 24 hours. 100% leak-proof silicon ring cap with sweat-free powder coating.',
    features: [
      'Food Grade 18/8 (304) Rust-free Stainless Steel',
      '24h Cold / 18h Hot temperature retention technology',
      'BPA Free, Phthalate Free, non-toxic eco friendly',
      'Zero condensation sweat-free matte textured finish',
    ],
    specs: {
      Capacity: '750 ml',
      Material: 'Double Wall SUS 304 Stainless Steel',
      Closure: 'Airtight leak-proof twist cap',
      Weight: '380 grams',
    },
    stockCount: 150,
    supplierRating: 4.8,
    supplierOrders: 15400,
    deliveryDays: 3,
    shippingCost: 0,
  },
  {
    sourcePlatform: 'tiktok_shop',
    sampleUrl: 'https://tiktok.com/shop/viral-sunset-lamp-smart-ambient',
    title: 'Smart 16-Color RGB Sunset Projection Lamp with App & Remote Control',
    brand: 'LuminaVibe',
    category: 'Home & Kitchen',
    subcategory: 'Home Decor',
    sourceOriginalPrice: 280,
    suggestedResalePrice: 599,
    mrp: 1299,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Viral 360-degree rotatable aluminum sunset projection lamp with 16 color modes, smartphone Bluetooth app color sync, and music pulsing rhythm mode. Perfect for photography and room aesthetics.',
    features: [
      '16 RGB colors + 4 gradient strobe lighting modes',
      'Smartphone app + 24-key infrared remote control',
      '360° Rotatable flexible optical glass lens',
      'USB-powered with weighted anti-slip aluminum base',
    ],
    specs: {
      PowerSource: '5V/2A USB Type-A Cable included',
      Material: 'Anodized Aluminum Alloy + HD Optical Lens',
      CableLength: '1.5 Meters with inline switch',
      LightSource: '10W High Power RGB COB LED',
    },
    stockCount: 95,
    supplierRating: 4.7,
    supplierOrders: 12800,
    deliveryDays: 4,
    shippingCost: 0,
  }
];

export const INITIAL_IMPORTED_PRODUCTS: ImportedProduct[] = [
  {
    id: 'IMP-MEESHO-8892',
    title: 'Jaipuri Pure Cotton Embroidered Anarkali Kurta with Pant & Dupatta Set',
    brand: 'Jaipuri Vastra Mills',
    category: 'Fashion',
    subcategory: 'Ethnic Wear',
    price: 699,
    mrp: 1499,
    discountPercent: 53,
    rating: 4.8,
    ratingCount: 142,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Exquisite authentic Jaipur hand-block printed Anarkali suit set crafted with 100% breathable organic cotton, paired with matching pants and mulmul dupatta.',
    features: [
      '100% Pure breathable premium cotton fabric',
      'Hand embroidery zari yoke border design',
      'Pre-shrunk color-fast guaranteed dyes',
      'Includes Anarkali kurta, straight pant & 2.2m dupatta',
    ],
    specs: {
      Fabric: 'Pure Cambric Cotton 60x60',
      Pattern: 'Anarkali Flare with Gotta Patti',
      Stitch: 'Full Stitched Ready to Wear',
      Origin: 'Sanganer, Jaipur (Rajasthan)',
    },
    inStock: true,
    stockCount: 45,
    sellerId: 'reseller-store-current-user',
    sellerName: 'My Reseller Boutique',
    badge: 'Trending',
    deliveryDays: 3,
    freeDelivery: true,
    returnPolicyDays: 7,
    codAvailable: true,
    createdAt: '2026-09-18T10:00:00Z',
    sourcePlatform: 'meesho',
    sourceUrl: 'https://meesho.com/s/p/trending-anarkali-kurta-set/8892',
    sourceOriginalPrice: 380,
    resellerMarkup: 319,
    profitMarginPercent: 45.6,
    resellerNotes: 'High demand in WhatsApp family groups during wedding & festival seasons.',
    importedAt: '2026-09-18T10:00:00Z',
    shareCount: 18,
    totalResellerSales: 8,
    totalProfitEarned: 2552,
  },
  {
    id: 'IMP-ALI-6120',
    title: 'AcousticPro T9 Active Noise Cancelling Wireless Earbuds with Low Latency Gaming',
    brand: 'AcousticPro Audio',
    category: 'Electronics',
    subcategory: 'Audio & Wearables',
    price: 1199,
    mrp: 2999,
    discountPercent: 60,
    rating: 4.9,
    ratingCount: 388,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Next-generation Bluetooth 5.4 earbuds featuring 35dB Active Noise Cancellation, quad ENC microphones for crystal-clear calling, and 45ms ultra-low gaming latency.',
    features: [
      '35dB Hybrid Active Noise Cancellation (ANC)',
      '13mm Titanium-coated dynamic bass drivers',
      'Quad mic AI environmental noise cancellation for calls',
      '40 Hours battery backup with USB-C fast charging',
    ],
    specs: {
      Connectivity: 'Bluetooth 5.4 + EDR',
      BatteryLife: '40 Hours Total with Case',
      DriverSize: '13mm Beryllium Diaphragm',
    },
    inStock: true,
    stockCount: 80,
    sellerId: 'reseller-store-current-user',
    sellerName: 'My Reseller Boutique',
    badge: 'Bestseller',
    deliveryDays: 5,
    freeDelivery: true,
    returnPolicyDays: 10,
    codAvailable: true,
    createdAt: '2026-09-20T14:30:00Z',
    sourcePlatform: 'aliexpress',
    sourceUrl: 'https://aliexpress.com/item/t9-pro-anc-wireless-earbuds/100500612.html',
    sourceOriginalPrice: 520,
    resellerMarkup: 679,
    profitMarginPercent: 56.6,
    resellerNotes: 'Super popular with college students and mobile gamers.',
    importedAt: '2026-09-20T14:30:00Z',
    shareCount: 34,
    totalResellerSales: 14,
    totalProfitEarned: 9506,
  }
];

export function detectSourcePlatform(url: string): SourceAppPlatform {
  const lower = url.toLowerCase();
  if (lower.includes('meesho.com') || lower.includes('meesho')) return 'meesho';
  if (lower.includes('aliexpress.com') || lower.includes('aliexpress') || lower.includes('cjdropshipping')) return 'aliexpress';
  if (lower.includes('amazon.') || lower.includes('amzn.')) return 'amazon';
  if (lower.includes('flipkart.com') || lower.includes('fkrt.it')) return 'flipkart';
  if (lower.includes('shopify') || lower.includes('myshopify')) return 'shopify';
  if (lower.includes('indiamart.com') || lower.includes('indiamart')) return 'indiamart';
  if (lower.includes('tiktok.com') || lower.includes('tiktok')) return 'tiktok_shop';
  return 'custom_url';
}

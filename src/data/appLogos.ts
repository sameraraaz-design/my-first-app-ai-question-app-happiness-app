import { AppLogoInfo } from '../types';

export const APP_LOGOS: AppLogoInfo[] = [
  {
    id: 'classic',
    name: 'Classic Bharat Gold',
    tagline: 'Official Tricolor 3D Shopping Bag',
    url: '/app-logo.jpg',
    badge: 'Primary Brand Mark',
    themeColor: 'from-amber-400 to-amber-600',
    accentHex: '#F59E0B',
    description: 'The iconic 3D glossy shopping bag with metallic gold handles, tricolor Indian saffron and emerald accents against a royal blue ground.',
    dimensions: '1024 × 1024 px',
    format: 'High-Res 3D Emblem (Square 1:1)',
    downloadName: 'bharat-cart-classic-logo.jpg',
  },
  {
    id: 'modern',
    name: 'Neo Saffron 3D Squircle',
    tagline: 'Modern Mobile App Store Icon',
    url: '/app-logo-modern.jpg',
    badge: 'Trending Mobile App Icon',
    themeColor: 'from-orange-500 to-indigo-600',
    accentHex: '#EA580C',
    description: 'Ultra-modern iOS & Android app store squircle with vibrant saffron-orange, deep indigo shadow, and precision gold trim.',
    dimensions: '1024 × 1024 px',
    format: 'iOS / Android Squircle (Square 1:1)',
    downloadName: 'bharat-cart-modern-logo.jpg',
  },
  {
    id: 'luxe',
    name: 'Midnight Luxe Edition',
    tagline: 'Obsidian Black & Illuminated Cart',
    url: '/app-logo-luxe.jpg',
    badge: 'Dark Luxe Edition',
    themeColor: 'from-slate-900 to-emerald-600',
    accentHex: '#10B981',
    description: 'Premium dark aesthetic app icon featuring matte obsidian black with glowing metallic gold cart and illuminated saffron & emerald neon accents.',
    dimensions: '1024 × 1024 px',
    format: 'Dark Luxe 3D Icon (Square 1:1)',
    downloadName: 'bharat-cart-luxe-logo.jpg',
  },
];

export interface BrandColorToken {
  name: string;
  hex: string;
  role: string;
  description: string;
}

export const BHARAT_BRAND_COLORS: BrandColorToken[] = [
  {
    name: 'Kesari Saffron',
    hex: '#F97316',
    role: 'Primary Accent & CTAs',
    description: 'Warm, energetic Indian saffron representing courage, vitality, and joyful commerce.',
  },
  {
    name: 'Ashoka Royal Navy',
    hex: '#1E3A8A',
    role: 'Primary Header & Trust Base',
    description: 'Deep royal blue symbolizing trust, reliability, and nation-wide digital reach.',
  },
  {
    name: 'Harit Emerald',
    hex: '#059669',
    role: 'Success & Bharat Assured',
    description: 'Fresh emerald green representing prosperity, verified authentic quality, and savings.',
  },
  {
    name: 'Bharat Gold',
    hex: '#F59E0B',
    role: 'Festive Deals & Coins',
    description: 'Gleaming golden luster for festival mega-sales, reward coins, and premium tier badges.',
  },
  {
    name: 'Obsidian Luxe',
    hex: '#0F172A',
    role: 'Dark Canvas & Contrast',
    description: 'Sophisticated deep charcoal-slate providing ultra-sharp typographic contrast.',
  },
];

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import { HomeSkeleton } from '../skeletons/HomeSkeleton';
import { 
  Smartphone, 
  Tv, 
  Shirt, 
  Utensils, 
  ShoppingBasket, 
  Sparkles, 
  Dumbbell, 
  ArrowRight, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Percent,
  ChevronRight,
  TrendingUp,
  Tag,
  RotateCw
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const HomeView: React.FC = () => {
  const { products, setSelectedCategory, setActiveView, setSelectedProductId } = useApp();

  // Loading state for perceived performance while data is fetched
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulateFetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 650);
  };

  // Banners carousel state
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      id: 1,
      title: 'Great Indian Savings Dhamaka',
      tagline: 'Up to 70% Off on Top Smartphones & Audio',
      bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
      accentColor: 'text-amber-400',
      badge: 'FESTIVE SPECIAL',
      category: 'Electronics' as ProductCategory,
      image: '/app-hero.jpg',
      couponText: 'Use coupon FESTIVE20 for extra 20% off',
    },
    {
      id: 2,
      title: 'Authentic Indian Handloom & Fashion',
      tagline: 'Chikankari Kurtas, Festive Anarkalis & Footwear',
      bgGradient: 'from-rose-950 via-red-900 to-amber-950',
      accentColor: 'text-amber-300',
      badge: 'HANDCRAFTED IN INDIA',
      category: 'Fashion' as ProductCategory,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      couponText: 'Flat ₹100 off with code BHARAT100',
    },
    {
      id: 3,
      title: 'Smart Kitchen & Home Upgrade',
      tagline: 'Mixer Grinders, Pressure Cookers & Pure Cotton Linens',
      bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
      accentColor: 'text-emerald-300',
      badge: 'HOME SAVER FEST',
      category: 'Home & Kitchen' as ProductCategory,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
      couponText: 'Free Delivery on all orders above ₹499',
    },
  ];

  // Auto rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Deal of the day countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categoryCards = [
    { name: 'Mobiles' as ProductCategory, icon: Smartphone, color: 'bg-blue-50 text-blue-600', count: '5G Phones & Cases' },
    { name: 'Electronics' as ProductCategory, icon: Tv, color: 'bg-indigo-50 text-indigo-600', count: 'Earbuds, Watches & Audio' },
    { name: 'Fashion' as ProductCategory, icon: Shirt, color: 'bg-rose-50 text-rose-600', count: 'Kurtas, Sarees & Shoes' },
    { name: 'Home & Kitchen' as ProductCategory, icon: Utensils, color: 'bg-amber-50 text-amber-600', count: 'Mixers, Cookers & Decor' },
    { name: 'Grocery' as ProductCategory, icon: ShoppingBasket, color: 'bg-emerald-50 text-emerald-600', count: 'Dals, Spices & Tea' },
    { name: 'Beauty' as ProductCategory, icon: Sparkles, color: 'bg-pink-50 text-pink-600', count: 'Ayurveda & Skincare' },
    { name: 'Sports' as ProductCategory, icon: Dumbbell, color: 'bg-purple-50 text-purple-600', count: 'Cricket & Yoga Mats' },
  ];

  // Featured sections
  const dealProducts = products.filter((p) => p.discountPercent >= 40).slice(0, 4);
  const appleProducts = products.filter((p) => p.isAppleProduct || p.brand.toLowerCase() === 'apple').slice(0, 4);
  const techProducts = products.filter((p) => p.category === 'Mobiles' || p.category === 'Electronics').slice(0, 4);
  const fashionProducts = products.filter((p) => p.category === 'Fashion').slice(0, 3);
  const homeAndKitchen = products.filter((p) => p.category === 'Home & Kitchen' || p.category === 'Grocery').slice(0, 4);

  // Return realistic skeleton screen while data is being fetched
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Carousel Banner */}
      <section className="relative overflow-hidden rounded-3xl mx-4 max-w-7xl lg:mx-auto mt-4 shadow-xl">
        <div 
          className={`relative bg-gradient-to-r ${banners[currentBanner].bgGradient} p-6 sm:p-10 md:p-14 text-white transition-all duration-700 min-h-[320px] sm:min-h-[380px] flex items-center`}
        >
          <div className="max-w-xl z-10 space-y-3">
            <span className="inline-block bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border border-white/20">
              {banners[currentBanner].badge}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight leading-tight">
              {banners[currentBanner].title}
            </h1>
            <p className={`text-base sm:text-lg font-medium ${banners[currentBanner].accentColor}`}>
              {banners[currentBanner].tagline}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-explore-btn"
                onClick={() => {
                  setSelectedCategory(banners[currentBanner].category);
                  setActiveView('search');
                }}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg flex items-center space-x-2"
              >
                <span>Shop Deals Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-xs bg-black/30 backdrop-blur-xs border border-white/20 px-3 py-2 rounded-xl text-slate-200 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>{banners[currentBanner].couponText}</span>
              </div>
            </div>
          </div>

          {/* Right Product Spotlight Image */}
          <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-72 lg:w-96 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-1">
            <img
              src={banners[currentBanner].image}
              alt={banners[currentBanner].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-2 rounded-full transition-all ${
                currentBanner === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Bubbles Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500">Explore millions of items across India's favorite collections</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="simulate-home-fetch-btn"
              onClick={handleSimulateFetch}
              title="Reload feed to test skeleton screen"
              className="text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <RotateCw className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Simulate Fetch</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveView('search');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center ml-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setActiveView('search');
                }}
                className="bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-left group flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                <div className={`w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Deal of the Day + Countdown Timer */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-200 fill-amber-200" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-200 bg-black/20 px-2 py-0.5 rounded">
                  Limited Time Offers
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-heading mt-0.5">
                  Mega Deals of the Day (Up to 71% Off)
                </h2>
              </div>
            </div>

            {/* Countdown box */}
            <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20">
              <Clock className="w-4 h-4 text-amber-300 mr-1" />
              <span className="text-xs text-slate-200 font-semibold mr-1">Ends in:</span>
              <div className="flex items-center space-x-1 font-mono text-sm font-bold">
                <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-2 py-1 rounded-lg text-red-600">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Apple Products Multi-App Sourcing Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-2">
                <span>🍏</span>
                <span>Cross-App Price Comparison & Sourcing</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                Buy Apple Products From Other Apps — Choose & Compare
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Compare live deal prices, bank offers, and lightning delivery across Amazon, Croma, Flipkart, Vijay Sales, Reliance Digital, and Apple Store.
              </p>
            </div>

            <button
              onClick={() => setActiveView('apple-hub')}
              className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0 active:scale-95"
            >
              <span>Explore Apple Hub & Compare</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Sourcing Partner Badges */}
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Choose Retailer:</span>
            {[
              { name: 'Amazon India', icon: '🛒', color: 'bg-amber-950/60 text-amber-300 border-amber-800/40' },
              { name: 'Croma (Tata)', icon: '🏬', color: 'bg-teal-950/60 text-teal-300 border-teal-800/40' },
              { name: 'Flipkart', icon: '⚡', color: 'bg-blue-950/60 text-blue-300 border-blue-800/40' },
              { name: 'Vijay Sales', icon: '🏷️', color: 'bg-red-950/60 text-red-300 border-red-800/40' },
              { name: 'Reliance Digital', icon: '🛍️', color: 'bg-sky-950/60 text-sky-300 border-sky-800/40' },
              { name: 'Official Apple Store', icon: '🍏', color: 'bg-zinc-800/80 text-zinc-200 border-zinc-700' },
            ].map((app) => (
              <span key={app.name} className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1.5 ${app.color}`}>
                <span>{app.icon}</span>
                <span>{app.name}</span>
              </span>
            ))}
          </div>

          {/* Grid of Apple Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {appleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobiles & Tech Spotlight */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900">
                Top Rated Smartphones & Audio
              </h2>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Snapdragon & 5G
              </span>
            </div>
            <p className="text-xs text-slate-500">Flagship performance with manufacturer warranty and fast delivery</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('Mobiles');
              setActiveView('search');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span>See All Tech</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Special Offer Banner: Handloom & Indian Crafts */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-200 text-amber-900 px-2.5 py-1 rounded-md">
              Vocal for Local • Handcrafted in India
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              Discover Authentic Lucknowi & Festive Wear
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Direct from master artisans and verified heritage weavers in Lucknow, Jaipur, and Varanasi. 100% pure breathable fabrics with zero synthetic blends.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('Fashion');
                  setActiveView('search');
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center space-x-1.5"
              >
                <span>Browse Indian Ethnic Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex -space-x-4 overflow-hidden py-2 shrink-0">
            {fashionProducts.map((p, idx) => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedProductId(p.id);
                  setActiveView('product-detail');
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home, Kitchen & Daily Groceries */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900">
              Home, Kitchen & Groceries
            </h2>
            <p className="text-xs text-slate-500">Unpolished dals, Assam CTC tea, and reliable Prestige kitchenware</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('Home & Kitchen');
              setActiveView('search');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {homeAndKitchen.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Bharat Cart Guarantee</span>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white mt-0.5">
                Safe Indian Shopping with Instant UPI & RuPay
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Every order is protected by our 7-day hassle-free doorstep replacement guarantee and verified seller tracking.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">Covered PIN Codes</span>
              <span className="text-sm font-bold text-white">19,000+</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">Happy Customers</span>
              <span className="text-sm font-bold text-emerald-400">1.2 Million+</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">Verified Sellers</span>
              <span className="text-sm font-bold text-amber-400">25,000+</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

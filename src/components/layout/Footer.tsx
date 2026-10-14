import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, RotateCcw, Truck, Headphones, IndianRupee, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategory, setRole, currentAppLogoUrl, setIsAppLogoModalOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Genuine</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic products directly from verified Indian sellers</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free doorstep pickup & instant UPI refund</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/60 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Fast Pan-India Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Covering 19,000+ PIN codes with live delivery tracking</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24x7 Customer Help</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant live chat & dedicated support in regional languages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        <div>
          <div 
            onClick={() => setIsAppLogoModalOpen(true)}
            className="flex items-center space-x-2.5 mb-3 cursor-pointer group"
            title="Click to view all Bharat Cart App Logos"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-blue-500/50 bg-blue-950 shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={currentAppLogoUrl}
                alt="Bharat Cart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-heading font-bold text-base text-white group-hover:text-blue-400 transition-colors">Bharat Cart</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Empowering Indian artisans, brands, and shoppers with a modern, trusted marketplace experience.
          </p>
          <div className="mt-4 flex flex-col space-y-2 text-slate-400">
            <span className="inline-flex items-center text-slate-300 font-semibold text-[11px] bg-slate-800 px-2 py-1 rounded w-fit">
              🇮🇳 Made with pride in India
            </span>
            <button
              type="button"
              id="footer-app-logos-btn"
              onClick={() => setIsAppLogoModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] flex items-center space-x-1 transition-colors text-left"
            >
              <span>🎨 App Logos & Brand Suite</span>
            </button>
          </div>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Top Categories</h5>
          <ul className="space-y-2 text-slate-400">
            {['Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 'Grocery', 'Beauty'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat as any);
                    setActiveView('search');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Customer Service</h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveView('orders')} className="hover:text-blue-400 transition-colors">
                Track My Order
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('support')} className="hover:text-blue-400 transition-colors">
                Returns & Replacement
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('support')} className="hover:text-blue-400 transition-colors">
                Shipping Rates & Policies
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('support')} className="hover:text-blue-400 transition-colors">
                Help & FAQs
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">For Businesses</h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => {
                  setRole('SELLER');
                  setActiveView('seller-portal');
                }}
                className="text-amber-400 font-medium hover:underline"
              >
                Sell on Bharat Cart
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setRole('SELLER');
                  setActiveView('seller-portal');
                }}
                className="hover:text-blue-400 transition-colors"
              >
                Seller Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setRole('ADMIN');
                  setActiveView('admin-portal');
                }}
                className="text-emerald-400 font-medium hover:underline"
              >
                Admin Management Portal
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('support')} className="hover:text-blue-400 transition-colors">
                Advertise Your Products
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Payment Partners</h5>
          <p className="text-slate-400 mb-3">
            Supports 100% secure Indian payment gateways:
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">UPI / BHIM</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">RuPay</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Google Pay</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">PhonePe</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Paytm</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Net Banking</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 Bharat Cart Technologies India Private Limited. All rights reserved.</p>
        <p className="flex items-center">
          Crafted with care for Indian shoppers and digital sellers
        </p>
      </div>
    </footer>
  );
};

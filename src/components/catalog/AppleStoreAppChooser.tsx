import React from 'react';
import { ExternalAppOffer, AppleProductSourceApp } from '../../types';
import { APPLE_PARTNER_APPS } from '../../data/appleProductsData';
import { 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Sparkles, 
  ArrowRight,
  Truck,
  Building2,
  BadgePercent
} from 'lucide-react';

interface AppleStoreAppChooserProps {
  offers: ExternalAppOffer[];
  selectedAppId: AppleProductSourceApp;
  onSelectApp: (appId: AppleProductSourceApp, offer: ExternalAppOffer) => void;
  onAddToCart?: (offer: ExternalAppOffer) => void;
  onBuyNow?: (offer: ExternalAppOffer) => void;
  showActionButtons?: boolean;
}

export const AppleStoreAppChooser: React.FC<AppleStoreAppChooserProps> = ({
  offers,
  selectedAppId,
  onSelectApp,
  onAddToCart,
  onBuyNow,
  showActionButtons = false,
}) => {
  if (!offers || offers.length === 0) return null;

  // Find lowest price
  const lowestPrice = Math.min(...offers.map((o) => o.price));
  const activeOffer = offers.find((o) => o.appId === selectedAppId) || offers[0];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🍏</span>
            <h3 className="text-lg font-black font-heading text-white">
              Choose App to Buy From
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-0.5 rounded-full">
              Live Multi-Store Compare
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your preferred partner app. Sourced 100% genuine with official Apple India 1-Year Warranty.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">Apple Authorized Inventory</span>
        </div>
      </div>

      {/* Store Offers Comparison List */}
      <div className="space-y-3">
        {offers.map((offer) => {
          const appMeta = APPLE_PARTNER_APPS[offer.appId];
          const isSelected = offer.appId === selectedAppId;
          const isBestPrice = offer.price === lowestPrice;
          const savings = offer.mrp - offer.price;

          return (
            <div
              key={offer.appId}
              onClick={() => onSelectApp(offer.appId, offer)}
              id={`apple-store-choice-${offer.appId}`}
              className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                  : 'bg-slate-800/40 border-slate-700/70 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
            >
              {/* Best Price Tag */}
              {isBestPrice && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>LOWEST PRICE</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Store Info & Selection */}
                <div className="flex items-start space-x-3.5 flex-1">
                  {/* Custom Radio Button */}
                  <div className="mt-1">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-slate-600 bg-slate-700'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 fill-white text-blue-600" />}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white flex items-center">
                        <span className="mr-1.5">{appMeta?.logoIcon || '🏪'}</span>
                        {offer.appName}
                      </span>
                      
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        offer.appId === 'apple_store' 
                          ? 'bg-slate-700 text-slate-200 border-slate-600'
                          : offer.appId === 'amazon'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : offer.appId === 'flipkart'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      }`}>
                        {appMeta?.badge || 'Authorised Partner'}
                      </span>

                      {offer.deliveryType === 'prime' && (
                        <span className="text-[10px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">
                          Prime
                        </span>
                      )}
                    </div>

                    {/* Delivery & Perks */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300">
                      <span className="flex items-center text-slate-300">
                        <Truck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {offer.deliveryTime}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-xs">
                        {offer.officialWarranty}
                      </span>
                    </div>

                    {/* Bank Offer Banner */}
                    <div className="flex items-start space-x-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-700/50 text-[11px] text-emerald-300">
                      <CreditCard className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <span className="font-semibold text-emerald-300">{offer.bankOffer}</span>
                        {offer.exchangeBonus && (
                          <span className="block text-slate-400 text-[10px] mt-0.5">
                            {offer.exchangeBonus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Selection Status */}
                <div className="flex items-center md:items-end justify-between md:justify-center md:flex-col gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/60 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xl sm:text-2xl font-black text-white">
                        ₹{offer.price.toLocaleString('en-IN')}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{offer.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {savings > 0 ? (
                      <span className="text-[11px] font-bold text-emerald-400">
                        Save ₹{savings.toLocaleString('en-IN')} ({offer.discountPercent}% off)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Standard Apple MRP
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApp(offer.appId, offer);
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      <span>{isSelected ? 'Selected' : 'Select'}</span>
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>

                    {offer.directUrl && (
                      <a
                        href={offer.directUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e) => e.stopPropagation()}
                        title={`View on official ${offer.appName} website`}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected App Summary Footer */}
      <div className="bg-gradient-to-r from-blue-950/60 to-slate-800/80 p-4 rounded-2xl border border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs text-slate-300 flex items-center space-x-1.5">
            <span className="font-bold text-white">Active Sourcing Choice:</span>
            <span className="text-blue-400 font-semibold">{activeOffer.appName}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Order fulfilled with verified sealed package, official Apple India invoice & warranty.
          </p>
        </div>

        {showActionButtons && onAddToCart && onBuyNow && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onAddToCart(activeOffer)}
              className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(activeOffer)}
              className="px-4 py-2 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors flex items-center space-x-1"
            >
              <span>Buy from {activeOffer.appName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

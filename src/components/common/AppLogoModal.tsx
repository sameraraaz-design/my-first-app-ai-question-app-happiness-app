import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_LOGOS, BHARAT_BRAND_COLORS } from '../../data/appLogos';
import { AppLogoOption } from '../../types';
import { 
  X, 
  Check, 
  Download, 
  Copy, 
  Smartphone, 
  Globe, 
  Store, 
  Sparkles, 
  Palette, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

export const AppLogoModal: React.FC = () => {
  const { 
    isAppLogoModalOpen, 
    setIsAppLogoModalOpen, 
    selectedAppLogo, 
    setSelectedAppLogo,
    showToast 
  } = useApp();

  const [previewMockupType, setPreviewMockupType] = useState<'homescreen' | 'appstore' | 'browsertab'>('homescreen');
  const [inspectedLogoId, setInspectedLogoId] = useState<AppLogoOption>(selectedAppLogo);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isAppLogoModalOpen) return null;

  const inspectedLogo = APP_LOGOS.find((l) => l.id === inspectedLogoId) || APP_LOGOS[0];

  const handleCopyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    showToast(`Copied ${name} URL to clipboard!`);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div 
      id="app-logo-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setIsAppLogoModalOpen(false)}
    >
      <div 
        id="app-logo-modal-card"
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Palette className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
                Bharat Cart App Logos & Brand Suite
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Explore official 1:1 high-definition mobile app icons, switch the live app theme icon, or download vector-style assets.
            </p>
          </div>

          <button
            id="close-app-logo-modal-btn"
            onClick={() => setIsAppLogoModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-8 flex-1">
          {/* Section 1: Logo Grid Cards */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Official App Logo Editions</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select any logo below to preview in mockups or apply directly across the live website & mobile app.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full self-start">
                3 Editions Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {APP_LOGOS.map((logo) => {
                const isActive = selectedAppLogo === logo.id;
                const isInspected = inspectedLogoId === logo.id;

                return (
                  <div
                    key={logo.id}
                    id={`app-logo-card-${logo.id}`}
                    onClick={() => setInspectedLogoId(logo.id)}
                    className={`rounded-2xl border-2 transition-all cursor-pointer p-4.5 flex flex-col justify-between ${
                      isInspected 
                        ? 'border-blue-600 bg-blue-50/30 shadow-md ring-2 ring-blue-500/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {logo.badge}
                        </span>
                        {isActive ? (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active in App</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {logo.dimensions}
                          </span>
                        )}
                      </div>

                      {/* 1:1 App Logo Container */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md group mb-3 flex items-center justify-center p-2">
                        <img
                          src={logo.url}
                          alt={logo.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                          <a
                            href={logo.url}
                            download={logo.downloadName}
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 rounded-xl bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            title="Download High-Res"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUrl(logo.url, logo.name);
                            }}
                            className="w-9 h-9 rounded-xl bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            title="Copy image link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-bold text-slate-900 text-sm">
                            {logo.name}
                          </h4>
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs shrink-0" 
                            style={{ backgroundColor: logo.accentHex }}
                            title={`Accent: ${logo.accentHex}`}
                          />
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600">
                          {logo.tagline}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {logo.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        id={`apply-logo-btn-${logo.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppLogo(logo.id);
                        }}
                        className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-2xs ${
                          isActive
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied Active</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Set Active Logo</span>
                          </>
                        )}
                      </button>

                      <a
                        href={logo.url}
                        download={logo.downloadName}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                        title="Download JPG"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Real-World Mockup Simulator */}
          <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Interactive Simulator
                </span>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Live Preview: {inspectedLogo.name}
                </h3>
                <p className="text-xs text-slate-500">
                  See how the selected logo renders on mobile home screens, Google Play / App Store listings, and web browser tabs.
                </p>
              </div>

              {/* Mockup Tabs */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start">
                <button
                  type="button"
                  id="tab-mockup-homescreen"
                  onClick={() => setPreviewMockupType('homescreen')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                    previewMockupType === 'homescreen'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone Home Screen</span>
                </button>
                <button
                  type="button"
                  id="tab-mockup-appstore"
                  onClick={() => setPreviewMockupType('appstore')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                    previewMockupType === 'appstore'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>App Store Listing</span>
                </button>
                <button
                  type="button"
                  id="tab-mockup-browser"
                  onClick={() => setPreviewMockupType('browsertab')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                    previewMockupType === 'browsertab'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Browser Tab & Favicon</span>
                </button>
              </div>
            </div>

            {/* Mockup Render Area */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs min-h-[260px] flex items-center justify-center">
              {/* Mockup 1: Smartphone Home Screen */}
              {previewMockupType === 'homescreen' && (
                <div className="w-full max-w-sm bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-[36px] p-5 border-4 border-slate-800 shadow-2xl text-white">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-6 px-2">
                    <span>9:41</span>
                    <div className="w-20 h-4 bg-black rounded-full mx-auto"></div>
                    <div className="flex items-center space-x-1.5 text-[10px]">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App Grid Simulation */}
                  <div className="grid grid-cols-4 gap-4 text-center my-4">
                    {/* Dummy App 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 shadow-md flex items-center justify-center text-white text-xs font-bold">
                        Photos
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1">Photos</span>
                    </div>

                    {/* Dummy App 2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 shadow-md flex items-center justify-center text-white text-xs font-bold">
                        UPI
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1">Pay</span>
                    </div>

                    {/* Bharat Cart App Logo (Hero Item) */}
                    <div className="flex flex-col items-center relative group">
                      <div className="relative w-13 h-13 rounded-2xl overflow-hidden shadow-lg shadow-orange-500/20 border border-white/20 ring-2 ring-amber-400/80 transition-transform group-hover:scale-105">
                        <img
                          src={inspectedLogo.url}
                          alt="Bharat Cart Icon"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Notification Badge */}
                      <span className="absolute -top-1.5 right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md">
                        2
                      </span>
                      <span className="text-[10px] font-bold text-white mt-1">
                        BharatCart
                      </span>
                    </div>

                    {/* Dummy App 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md flex items-center justify-center text-white text-xs font-bold">
                        Music
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1">Music</span>
                    </div>
                  </div>

                  {/* Dock */}
                  <div className="mt-8 pt-3 border-t border-white/10 bg-white/5 rounded-2xl p-2.5 flex justify-around items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-[10px] font-bold">Call</div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-[10px] font-bold">Chat</div>
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-[10px] font-bold">Web</div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-[10px] font-bold">Files</div>
                  </div>
                </div>
              )}

              {/* Mockup 2: App Store / Google Play Listing */}
              {previewMockupType === 'appstore' && (
                <div className="w-full max-w-lg bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-md shrink-0">
                      <img
                        src={inspectedLogo.url}
                        alt={inspectedLogo.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-heading font-black text-slate-900 text-base">
                          Bharat Cart - Online Shopping
                        </h4>
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">
                        Bharat Retail Technologies Pvt Ltd
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
                        <span className="font-bold text-slate-900 flex items-center">
                          4.8 ★ <span className="font-normal text-slate-400 ml-1">(1.2M reviews)</span>
                        </span>
                        <span>•</span>
                        <span>50M+ Downloads</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Rated 3+</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedAppLogo(inspectedLogo.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors text-center"
                    >
                      {selectedAppLogo === inspectedLogo.id ? 'Already Applied' : 'Install / Apply Active Icon'}
                    </button>
                    <a
                      href={inspectedLogo.url}
                      download={inspectedLogo.downloadName}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download HQ Icon</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Mockup 3: Web Browser Tab & Header */}
              {previewMockupType === 'browsertab' && (
                <div className="w-full max-w-xl bg-slate-100 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
                  {/* Browser Chrome Header */}
                  <div className="bg-slate-200 px-3 pt-2 pb-1.5 flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>

                    {/* Active Browser Tab */}
                    <div className="bg-white rounded-t-xl px-3 py-1.5 flex items-center space-x-2 shadow-xs text-xs font-semibold text-slate-800 max-w-xs">
                      <img
                        src={inspectedLogo.url}
                        alt="Favicon"
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 rounded object-cover shrink-0"
                      />
                      <span className="truncate">Bharat Cart - India's Trusted Online Marketplace</span>
                      <X className="w-3 h-3 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer" />
                    </div>
                  </div>

                  {/* Browser URL Bar */}
                  <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center space-x-2 text-xs text-slate-500">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 flex-1 flex items-center space-x-1.5 text-slate-700">
                      <span className="text-emerald-600 font-bold text-[10px]">https://</span>
                      <span className="font-medium">bharatcart.in</span>
                    </div>
                  </div>

                  {/* App Header Preview Inside Web */}
                  <div className="bg-white p-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-blue-600 shadow-xs shrink-0">
                        <img
                          src={inspectedLogo.url}
                          alt="Navbar Logo"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-heading font-extrabold text-base tracking-tight text-slate-900">
                          Bharat<span className="text-blue-600">Cart</span>
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-widest bg-amber-100 text-amber-800 px-1 rounded ml-1">
                          India
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 italic">Header Navbar Brand Icon</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Official Brand Colors & Design Tokens */}
          <div>
            <div className="mb-3">
              <h3 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>Official Brand Colors & Design Tokens</span>
              </h3>
              <p className="text-xs text-slate-500">
                Click any color swatch to copy its verified HEX code for branding, social banners, or packaging.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {BHARAT_BRAND_COLORS.map((col) => (
                <div
                  key={col.hex}
                  id={`brand-color-${col.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleCopyHex(col.hex)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div 
                    className="w-full h-12 rounded-xl mb-2.5 shadow-inner border border-black/10 flex items-end justify-end p-1"
                    style={{ backgroundColor: col.hex }}
                  >
                    {copiedHex === col.hex && (
                      <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center space-x-0.5">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Copied!</span>
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-900 block truncate">
                    {col.name}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                    <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-800 group-hover:bg-blue-50 group-hover:text-blue-700">
                      {col.hex}
                    </code>
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {col.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Specifications & Guidelines */}
          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/80 flex items-start space-x-3 text-xs text-blue-950">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">App Logo Usage Guidelines</span>
              <p className="text-blue-900/80 leading-relaxed">
                All 3 Bharat Cart logo variations are rendered at 1024 × 1024 pixels in 1:1 square ratio with built-in safe padding (15% clear margins). When incorporating into external seller packaging, invoices, or social media, maintain minimum clear space equal to 25% of the logo width and do not alter the authentic Indian Tricolor palette.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">Active Logo:</span>
            <span className="bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
              {APP_LOGOS.find((l) => l.id === selectedAppLogo)?.name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAppLogoModalOpen(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Close
            </button>
            <a
              href={APP_LOGOS.find((l) => l.id === selectedAppLogo)?.url}
              download={APP_LOGOS.find((l) => l.id === selectedAppLogo)?.downloadName}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Active Logo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

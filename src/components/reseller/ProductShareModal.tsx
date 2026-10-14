import React, { useState, useRef } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  Send, 
  MessageSquare, 
  ExternalLink, 
  Sparkles,
  IndianRupee,
  ShieldCheck,
  Tag,
  Percent,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ImportedProduct } from '../../types';

interface ProductShareModalProps {
  product: Product | ImportedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { showToast, recordProductShare } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(product?.price || 0);
  const [includePrice, setIncludePrice] = useState(true);
  const [includeLink, setIncludeLink] = useState(true);
  const [activeTab, setActiveTab] = useState<'WHATSAPP' | 'POSTER' | 'LINKS'>('WHATSAPP');
  const posterRef = useRef<HTMLDivElement>(null);

  // Sync custom price if product changes
  React.useEffect(() => {
    if (product) {
      setCustomPrice(product.price);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isImported = 'sourcePlatform' in product;
  const importedProd = isImported ? (product as ImportedProduct) : null;
  const supplierCost = importedProd?.sourceOriginalPrice || Math.round(product.price * 0.6);
  const calculatedProfit = Math.max(0, customPrice - supplierCost);

  // Referral link
  const shareUrl = `${window.location.origin}/?product=${product.id}&ref=reseller_${product.id.slice(-4)}`;

  // Formatted WhatsApp message
  const generateWhatsAppMessage = () => {
    let msg = `✨ *Exclusive Collection on Bharat Cart!* ✨\n\n`;
    msg += `🛍️ *${product.title}*\n`;
    msg += `🏷️ Brand: ${product.brand} | Category: ${product.category}\n\n`;

    if (includePrice) {
      msg += `💰 *Special Offer Price:* ₹${customPrice.toLocaleString('en-IN')}\n`;
      if (product.mrp && product.mrp > customPrice) {
        const discount = Math.round(((product.mrp - customPrice) / product.mrp) * 100);
        msg += `❌ MRP: ~₹${product.mrp.toLocaleString('en-IN')}~ (*${discount}% OFF*)\n`;
      }
    }

    msg += `🚚 *Free Delivery* | 💵 *Cash on Delivery (COD) Available*\n`;
    msg += `⭐ Rating: ${product.rating} / 5 (${product.ratingCount} reviews)\n\n`;
    msg += `✅ 100% Quality Checked & Bharat Assured\n`;
    msg += `🔄 7 Days Easy Return Guarantee\n\n`;

    if (includeLink) {
      msg += `👉 *Order Directly / View Details:* ${shareUrl}\n\n`;
    }

    msg += `_Hurry, limited stock available! Reply here to order or place on the link above._`;
    return msg;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    recordProductShare(product.id, 'link');
    showToast('Product store link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    recordProductShare(product.id, 'copy_pitch');
    showToast('WhatsApp sales pitch copied!');
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    recordProductShare(product.id, 'whatsapp');
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Bharat Cart for ₹${customPrice}!`,
          url: shareUrl,
        });
        recordProductShare(product.id, 'native_share');
        showToast('Shared successfully!');
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`Check out ${product.title} for ₹${customPrice} on Bharat Cart!`);
    const url = encodeURIComponent(shareUrl);
    recordProductShare(product.id, 'telegram');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    recordProductShare(product.id, 'facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Order ${product.title} on Bharat Cart for ₹${customPrice}!`);
    const url = encodeURIComponent(shareUrl);
    recordProductShare(product.id, 'twitter');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  // Download flyer as visual HTML / trigger download
  const handleDownloadFlyer = () => {
    recordProductShare(product.id, 'flyer_download');
    // Create an elegant SVG-rendered flyer card converted to downloadable canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      showToast('Downloading social promo flyer...');
      return;
    }

    // Draw background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 800, 1000);

    // Accent header
    const gradient = ctx.createLinearGradient(0, 0, 800, 0);
    gradient.addColorStop(0, '#FF9933');
    gradient.addColorStop(0.5, '#FFFFFF');
    gradient.addColorStop(1, '#138808');
    ctx.fillStyle = gradient;
    ctx.fillRect(40, 40, 720, 8);

    // Store badge
    ctx.fillStyle = '#1E293B';
    ctx.roundRect?.(40, 70, 720, 80, 16);
    ctx.fill();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('BHARAT CART VERIFIED STORE', 70, 120);

    // Product Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    const cleanTitle = product.title.length > 38 ? product.title.slice(0, 36) + '...' : product.title;
    ctx.fillText(cleanTitle, 40, 200);

    // Price Card
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`Special Price: ₹${customPrice.toLocaleString('en-IN')}`, 40, 260);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px sans-serif';
    ctx.fillText(`MRP: ₹${product.mrp.toLocaleString('en-IN')}  •  Free Delivery  •  COD Available`, 40, 300);

    // Features
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '20px sans-serif';
    ctx.fillText(`✓ 100% Genuine Verified Merchandise`, 40, 360);
    ctx.fillText(`✓ 7-Day Easy Return & Instant Replacement`, 40, 400);
    ctx.fillText(`✓ Pan-India Fast Tracked Dispatch`, 40, 440);

    // CTA Box
    ctx.fillStyle = '#2563EB';
    ctx.roundRect?.(40, 880, 720, 80, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Order Online: ${shareUrl.slice(0, 45)}...`, 70, 930);

    // Trigger download
    const link = document.createElement('a');
    link.download = `bharatcart-promo-${product.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Promo flyer downloaded successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        id="product-share-modal-container"
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center space-x-2">
                <span>Share & Resell Product</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  Direct Selling Hub
                </span>
              </h2>
              <p className="text-xs text-slate-400">Share with customers on WhatsApp, Instagram & Social Channels</p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('WHATSAPP')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'WHATSAPP'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Share</span>
          </button>
          <button
            onClick={() => setActiveTab('POSTER')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'POSTER'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Social Flyer & Poster</span>
          </button>
          <button
            onClick={() => setActiveTab('LINKS')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'LINKS'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Channel Links</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Product Mini Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {product.category}
                </span>
                {isImported && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 border border-pink-200 px-1.5 py-0.5 rounded">
                    From {importedProd?.sourcePlatform}
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold text-slate-900 truncate mt-0.5">{product.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-extrabold text-slate-900">
                  ₹{customPrice.toLocaleString('en-IN')}
                </span>
                {product.mrp > customPrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {isImported && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +₹{calculatedProfit} Profit
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Customization Controls */}
          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                <span>Your Resale Selling Price:</span>
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    id="share-modal-custom-price"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Math.max(1, Number(e.target.value)))}
                    className="w-28 pl-6 pr-2.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                {isImported && (
                  <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-1 rounded-lg">
                    Margin: ₹{calculatedProfit}
                  </div>
                )}
              </div>
            </div>

            {/* Quick markup buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Add Profit:</span>
              {[100, 200, 300, 500].map((add) => (
                <button
                  key={add}
                  type="button"
                  onClick={() => setCustomPrice((prev) => prev + add)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 rounded-md transition-colors"
                >
                  +₹{add}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomPrice(product.price)}
                className="px-2 py-0.5 text-[11px] font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Toggle checkboxes */}
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-700">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePrice}
                  onChange={(e) => setIncludePrice(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Include price tag in pitch</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLink}
                  onChange={(e) => setIncludeLink(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Include online store checkout link</span>
              </label>
            </div>
          </div>

          {/* TAB 1: WHATSAPP SHARING */}
          {activeTab === 'WHATSAPP' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Preview Formatted WhatsApp Message:</span>
                  <button
                    onClick={handleCopyMessage}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMessage ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-200 p-3.5 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {generateWhatsAppMessage()}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  id="whatsapp-direct-share-btn"
                  onClick={handleShareWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Share Directly to WhatsApp</span>
                </button>
                <button
                  id="copy-whatsapp-pitch-btn"
                  onClick={handleCopyMessage}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedMessage ? 'Copied to Clipboard!' : 'Copy Pitch with Photos'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL FLYER & POSTER */}
          {activeTab === 'POSTER' && (
            <div className="space-y-4">
              <div 
                ref={posterRef}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-5 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden"
              >
                {/* Tricolor top border accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 rounded-full mb-3" />

                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-700/60">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>BHARAT CART VERIFIED</span>
                  </div>
                  <span className="bg-blue-600/40 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    Direct Order
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 my-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-white/20 shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2 text-white">
                      {product.title}
                    </h4>
                    <div className="mt-2 flex items-baseline justify-center sm:justify-start space-x-2">
                      <span className="text-xl sm:text-2xl font-black text-emerald-400">
                        ₹{customPrice.toLocaleString('en-IN')}
                      </span>
                      {product.mrp > customPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                      <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-full">
                        🚚 Free Delivery
                      </span>
                      <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-full">
                        💵 COD Available
                      </span>
                      <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-full">
                        🔄 7-Day Returns
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-900" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-white">Scan QR or Open Link to Buy</p>
                      <p className="text-slate-400 text-[10px] mt-0.5 truncate max-w-xs">{shareUrl}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  id="download-flyer-btn"
                  onClick={handleDownloadFlyer}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Social Promo Card</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Share Flyer Link</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MULTI-CHANNEL LINKS */}
          {activeTab === 'LINKS' && (
            <div className="space-y-4">
              {/* Copy Direct Link */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Direct Reseller Store URL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Social Channels Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 flex flex-col items-center justify-center text-center transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold text-emerald-800">WhatsApp</span>
                  <span className="text-[10px] text-emerald-600">Groups / Status</span>
                </button>

                <button
                  onClick={handleShareTelegram}
                  className="p-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 flex flex-col items-center justify-center text-center transition-colors"
                >
                  <Send className="w-5 h-5 text-sky-600 mb-1" />
                  <span className="text-xs font-bold text-sky-800">Telegram</span>
                  <span className="text-[10px] text-sky-600">Channels / Chats</span>
                </button>

                <button
                  onClick={handleShareFacebook}
                  className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 flex flex-col items-center justify-center text-center transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-blue-800">Facebook</span>
                  <span className="text-[10px] text-blue-600">Marketplace / Post</span>
                </button>

                <button
                  onClick={handleShareTwitter}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center text-center transition-colors"
                >
                  <Share2 className="w-5 h-5 text-slate-800 mb-1" />
                  <span className="text-xs font-bold text-slate-800">X / Twitter</span>
                  <span className="text-[10px] text-slate-600">Post update</span>
                </button>
              </div>

              {/* Native Device Share */}
              <button
                onClick={handleNativeShare}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-300"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Open Native Phone Share Sheet (Instagram, SMS, More)</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Orders placed via your shared link earn instant resale margin</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Address } from '../../types';
import { 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  Check, 
  Lock, 
  ArrowLeft,
  X,
  QrCode,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    cartItemsTotal,
    cartDiscountTotal,
    cartCouponDiscount,
    cartDeliveryFee,
    cartPlatformFee,
    appliedCoupon,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    placeOrder,
    setActiveView,
    showToast,
  } = useApp();

  // Selected payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'Other UPI'>('Google Pay');
  const [upiIdInput, setUpiIdInput] = useState('aarav@okaxis');
  const [upiVerified, setUpiVerified] = useState(true);

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8921 0092 4092');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [cardName, setCardName] = useState('Aarav Sharma');

  // Net banking bank
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  // COD Captcha
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode] = useState('749');

  // Delivery speed
  const [deliverySpeed, setDeliverySpeed] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');

  // New address modal state
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newFlat, setNewFlat] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newType, setNewType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');

  // Loading state during payment simulation
  const [isProcessing, setIsProcessing] = useState(false);

  const currentAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newPincode || !newFlat || !newCity || !newState) {
      showToast('Please fill all required address fields');
      return;
    }

    addAddress({
      fullName: newFullName,
      phone: newPhone.startsWith('+91') ? newPhone : `+91 ${newPhone}`,
      pincode: newPincode,
      flatHouse: newFlat,
      areaStreet: newArea,
      city: newCity,
      state: newState,
      addressType: newType,
      isDefault: false,
    });

    setIsNewAddressModalOpen(false);
    // Reset form
    setNewFullName('');
    setNewPhone('');
    setNewPincode('');
    setNewFlat('');
    setNewArea('');
    setNewCity('');
    setNewState('');
  };

  const handlePlaceOrder = () => {
    if (!currentAddress) {
      showToast('Please select or add a delivery address');
      return;
    }

    if (paymentMethod === 'COD' && captchaInput !== captchaCode) {
      showToast(`Please enter the correct security code (${captchaCode}) for COD verification`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let paymentDetailsPayload: any = {
        method: paymentMethod,
        transactionId: `TXN-BC-${Date.now()}`,
        status: 'SUCCESS',
        paidAt: new Date().toISOString(),
      };

      if (paymentMethod === 'UPI') {
        paymentDetailsPayload.upiApp = selectedUpiApp;
        paymentDetailsPayload.upiId = upiIdInput;
      } else if (paymentMethod === 'CARD') {
        paymentDetailsPayload.cardLast4 = cardNumber.slice(-4);
        paymentDetailsPayload.cardNetwork = 'RuPay';
      } else if (paymentMethod === 'NET_BANKING') {
        paymentDetailsPayload.bankName = selectedBank;
      } else if (paymentMethod === 'COD') {
        paymentDetailsPayload.status = 'PENDING';
      }

      placeOrder({
        shippingAddress: currentAddress,
        paymentMethod,
        paymentDetails: paymentDetailsPayload,
      });

      setIsProcessing(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }

      setActiveView('order-confirmation');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <p className="text-slate-500 mb-4">No items to checkout.</p>
        <button
          onClick={() => setActiveView('home')}
          className="bg-blue-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => setActiveView('cart')}
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            Checkout & Secure Payment
          </h1>
          <p className="text-xs text-slate-500">
            Fast 2-Step Checkout • 100% Encrypted Indian Payment Gateway
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Delivery Address
                </h3>
              </div>

              <button
                onClick={() => setIsNewAddressModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Saved Addresses List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {addr.addressType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.flatHouse}, {addr.areaStreet}
                    </p>
                    <p className="text-xs text-slate-600">
                      {addr.city}, {addr.state} - <span className="font-semibold text-slate-800">{addr.pincode}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Phone: {addr.phone}
                    </p>

                    {isSelected && (
                      <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Delivery Speed Option */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Delivery Slot & Speed
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3 transition-all ${
                  deliverySpeed === 'STANDARD'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery_speed"
                  checked={deliverySpeed === 'STANDARD'}
                  onChange={() => setDeliverySpeed('STANDARD')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Standard Delivery</span>
                  <span className="text-slate-500 block mt-0.5">Delivery within 2-3 business days</span>
                  <span className="text-emerald-700 font-bold mt-1 inline-block">FREE Delivery</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3 transition-all ${
                  deliverySpeed === 'EXPRESS'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery_speed"
                  checked={deliverySpeed === 'EXPRESS'}
                  onChange={() => setDeliverySpeed('EXPRESS')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-900 text-sm">Express Priority</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 rounded">
                      FAST
                    </span>
                  </div>
                  <span className="text-slate-500 block mt-0.5">Guaranteed Delivery by Tomorrow 1:00 PM</span>
                  <span className="text-blue-700 font-bold mt-1 inline-block">₹49 Express Fee</span>
                </div>
              </label>
            </div>
          </div>

          {/* STEP 3: Payment Method Options */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Select Payment Option
              </h3>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UPI' as PaymentMethod, label: 'UPI / QR', icon: Smartphone, highlight: 'Instant & Zero Fee' },
                { id: 'CARD' as PaymentMethod, label: 'Cards', icon: CreditCard, highlight: 'RuPay / Visa / MC' },
                { id: 'NET_BANKING' as PaymentMethod, label: 'Net Banking', icon: Building2, highlight: 'All Indian Banks' },
                { id: 'COD' as PaymentMethod, label: 'Cash on Delivery', icon: Banknote, highlight: 'Pay at Doorstep' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900 block">{m.label}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{m.highlight}</span>
                  </button>
                );
              })}
            </div>

            {/* Payment Details Container */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              {/* UPI Option */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <span className="font-bold text-slate-800 text-xs block">Choose UPI Application:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpiApp(app as any)}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-colors ${
                          selectedUpiApp === app
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block font-semibold text-slate-700">Enter your UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="e.g. mobile@upi, name@okhdfcbank"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUpiVerified(true);
                          showToast('UPI ID Verified! Ready to proceed.');
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl font-semibold"
                      >
                        Verify
                      </button>
                    </div>
                    {upiVerified && (
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Verified: Aarav Sharma (Axis Bank)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Card Option */}
              {paymentMethod === 'CARD' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Number (RuPay, Visa, Mastercard)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="16-digit Card Number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">CVV / Security Code</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="3 digits"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Full Name as printed on card"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Net Banking Option */}
              {paymentMethod === 'NET_BANKING' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-800 text-xs block">Choose Your Bank:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'State Bank of India (SBI)',
                      'HDFC Bank',
                      'ICICI Bank',
                      'Axis Bank',
                      'Punjab National Bank (PNB)',
                      'Kotak Mahindra Bank',
                    ].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-colors ${
                          selectedBank === bank
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash on Delivery Option */}
              {paymentMethod === 'COD' && (
                <div className="space-y-3">
                  <p className="text-slate-600 leading-relaxed">
                    Pay in cash or through UPI QR code directly to the courier agent upon receiving your order.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-3">
                    <span className="font-mono text-base font-black tracking-widest bg-slate-900 text-amber-400 px-3 py-1 rounded-lg">
                      {captchaCode}
                    </span>
                    <div className="flex-1">
                      <input
                        type="text"
                        maxLength={3}
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Enter the 3-digit code"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    This security verification prevents automated and duplicate orders.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
              Order Items ({cartCount})
            </h3>

            {/* Items mini preview */}
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.productId} className="py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 truncate">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <span className="truncate text-slate-700 font-medium block">
                        {item.product.title}
                      </span>
                      {item.appliedAppOffer && (
                        <span className="text-[10px] text-blue-700 font-bold block">
                          ⚡ {item.appliedAppOffer.appName}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items MRP Total</span>
                <span>₹{cartItemsTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Product Discounts</span>
                <span>-₹{cartDiscountTotal.toLocaleString('en-IN')}</span>
              </div>

              {cartCouponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-₹{cartCouponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                {deliverySpeed === 'EXPRESS' ? (
                  <span className="text-blue-600 font-bold">₹49 (Express)</span>
                ) : cartDeliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span>₹{cartDeliveryFee}</span>
                )}
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Secured Platform Fee</span>
                <span>₹{cartPlatformFee}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>Total Payable</span>
                <span>
                  ₹{(cartTotal + (deliverySpeed === 'EXPRESS' ? 49 : 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Complete Purchase Button */}
            <button
              id="checkout-pay-btn"
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-4 px-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay & Place Order • ₹{(cartTotal + (deliverySpeed === 'EXPRESS' ? 49 : 0)).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1" />
                RBI Compliant 256-bit SSL Payment Gateway
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {isNewAddressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Add New Delivery Address
                </h3>
              </div>
              <button
                onClick={() => setIsNewAddressModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Flat, House no., Building *</label>
                <input
                  type="text"
                  required
                  value={newFlat}
                  onChange={(e) => setNewFlat(e.target.value)}
                  placeholder="e.g. Flat 302, Gokul Heights"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area, Street, Sector</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="e.g. Andheri East"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address Type</label>
                <div className="flex gap-2">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewType(type)}
                      className={`flex-1 py-1.5 rounded-xl border font-bold text-xs ${
                        newType === type
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewAddressModalOpen(false)}
                  className="flex-1 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

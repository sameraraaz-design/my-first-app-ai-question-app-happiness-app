import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Headphones, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const { orders, showToast } = useApp();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket Form
  const [ticketCategory, setTicketCategory] = useState('Order & Delivery');
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const faqs = [
    {
      q: 'How can I track my Bharat Cart order?',
      a: 'Go to the "Track Orders" section in your header or navigate to My Orders. You will find real-time live tracking with live updates from BlueDart and Delhivery couriers.',
    },
    {
      q: 'What is the return and replacement policy?',
      a: 'Bharat Cart offers a 7-day hassle-free replacement guarantee for electronics, mobile accessories, fashion, and home appliances. In case of defective or damaged goods, a courier will pick up the parcel from your doorstep at zero extra cost.',
    },
    {
      q: 'What happens if my UPI transaction fails but money was deducted?',
      a: 'If money was debited from your bank account during UPI payment, it is automatically reversed by the NPCI (National Payments Corporation of India) banking switch within 2 to 4 business hours.',
    },
    {
      q: 'What is Bharat Assured?',
      a: 'Products with the Bharat Assured badge undergo strict 6-point quality checks, are backed by manufacturer warranty, and are eligible for fast priority dispatch and doorstep replacement.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast('Please fill all ticket details');
      return;
    }

    const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setTicketSubmitted(true);
    showToast(`Support Ticket ${generatedId} created successfully!`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Support Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-white">
          <Headphones className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading">
          Bharat Cart 24x7 Customer Care
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
          We are dedicated to helping our customers and sellers across all Indian states and pin codes.
        </p>
      </div>

      {/* Direct Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Toll-Free Helpline</span>
            <span className="font-bold text-slate-900 text-sm">1800-209-4455</span>
            <span className="text-slate-500 block text-[11px]">Mon-Sun, 8 AM - 10 PM IST</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">WhatsApp Support</span>
            <span className="font-bold text-slate-900 text-sm">+91 91234 56789</span>
            <span className="text-slate-500 block text-[11px]">Instant automated bot & agent</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Desk</span>
            <span className="font-bold text-slate-900 text-sm">support@bharatcart.in</span>
            <span className="text-slate-500 block text-[11px]">Reply within 2 business hours</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket Form + FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticket Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-slate-900 text-base">
            Raise a Support Request
          </h3>
          <p className="text-xs text-slate-500">
            Our priority customer resolution team will contact you directly on your phone or email.
          </p>

          {ticketSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-sm">
                Request Registered: {ticketId}
              </h4>
              <p className="text-xs text-emerald-800">
                Our customer executive will reach out to you within 30 minutes. You can also view updates in SMS.
              </p>
              <button
                onClick={() => setTicketSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Submit another query
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                >
                  <option value="Order & Delivery">Order Delivery Status</option>
                  <option value="Return & Refund">Return or Replacement</option>
                  <option value="Payment & UPI">Payment Failure / UPI Reversal</option>
                  <option value="Product Quality">Product Defect or Quality</option>
                  <option value="Seller Issue">Merchant Dispute</option>
                </select>
              </div>

              {orders.length > 0 && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Related Order (Optional)</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-mono"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        #{o.id} - ₹{o.totalAmount} ({o.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Courier agent did not arrive for delivery"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe what occurred with your order or payment..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-heading font-bold text-slate-900 text-base">
            Frequently Asked Questions
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between transition-colors hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-2 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 text-xs text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All transactions on Bharat Cart are protected by 100% Buyer Protection and RBI mandated secure gateways.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

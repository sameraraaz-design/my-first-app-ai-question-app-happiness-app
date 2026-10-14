import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Cpu, 
  Copy, 
  Check, 
  ThumbsUp, 
  RotateCw, 
  Zap, 
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';

interface AskExpertResponse {
  answer: string;
  compatibilityStatus: 'COMPATIBLE' | 'NOT_COMPATIBLE' | 'PARTIAL' | 'VERIFIED_SPEC' | 'GENERAL_INFO';
  compatibilityBadge: string;
  keySpecsMentioned: string[];
  expertTips: string[];
  suggestedFollowUps: string[];
  source: 'gemini' | 'catalog-fallback';
}

interface QnAPair {
  id: string;
  question: string;
  response: AskExpertResponse;
  timestamp: string;
}

interface AskExpertSectionProps {
  product: Product;
}

export const AskExpertSection: React.FC<AskExpertSectionProps> = ({ product }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<QnAPair[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [helpfulIds, setHelpfulIds] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested preset questions based on category and product title
  const getPresetQuestions = (prod: Product): string[] => {
    switch (prod.category) {
      case 'Mobiles':
        return [
          'Is this compatible with Airtel & Jio 5G in India?',
          'Does the retail box include a fast charger & cable?',
          'What is the battery backup on heavy usage & gaming?',
          'Is it compatible with Mac & Windows for data transfer?',
        ];
      case 'Electronics':
        return [
          'Is this compatible with both iOS and Android devices?',
          'What are the connectivity options & Bluetooth version?',
          'Does this run on standard 220V–240V Indian voltage?',
          'What is the exact battery life or power consumption?',
        ];
      case 'Home & Kitchen':
        return [
          'Is this compatible with standard Indian 220V-240V sockets?',
          'What accessories and attachments are included in the box?',
          'Is it dishwasher safe and easy to clean?',
          'What are the exact product dimensions and weight?',
        ];
      case 'Fashion':
        return [
          'What is the exact fabric blend and wash care guide?',
          'Does this garment shrink after washing?',
          'What size should I choose for standard Indian fit?',
          'Is the color bleeding-resistant?',
        ];
      case 'Beauty':
      case 'Grocery':
        return [
          'What are the key active ingredients & shelf life?',
          'Is this 100% vegetarian / vegan certified?',
          'Is it suitable for all skin / hair types?',
          'Are there any artificial preservatives or added sugars?',
        ];
      default:
        return [
          'What are the exact specifications and dimensions?',
          'Is this product covered by brand warranty in India?',
          'What items are included inside the retail packaging?',
        ];
    }
  };

  const presetQuestions = getPresetQuestions(product);

  const handleAsk = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    setIsLoading(true);
    setQuestion('');

    try {
      // Build previous dialogue context
      const chatHistory = history.flatMap((item) => [
        { role: 'user' as const, text: item.question },
        { role: 'model' as const, text: item.response.answer },
      ]);

      const res = await fetch('/api/ai/ask-expert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          product: {
            id: product.id,
            title: product.title,
            brand: product.brand,
            category: product.category,
            subcategory: product.subcategory,
            price: product.price,
            mrp: product.mrp,
            specs: product.specs,
            features: product.features,
            description: product.description,
          },
          question: trimmed,
          chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AskExpertResponse = await res.json();

      const newEntry: QnAPair = {
        id: `qna-${Date.now()}`,
        question: trimmed,
        response: data,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [...prev, newEntry]);

      // Scroll to answer smoothly
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to ask expert:', err);
      setErrorMsg('Unable to reach the expert server. Please try again or inspect specifications below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadgeStyle = (status: AskExpertResponse['compatibilityStatus']) => {
    switch (status) {
      case 'COMPATIBLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'NOT_COMPATIBLE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PARTIAL':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'VERIFIED_SPEC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <section 
      id="ask-expert-section" 
      className="bg-gradient-to-b from-blue-50/40 via-white to-white rounded-3xl border border-blue-200/80 shadow-xs overflow-hidden transition-all"
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-white">
                Ask an Expert
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-xs">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Instant answers on specifications, hardware compatibility & Indian standards for {product.brand}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-200 hover:text-white flex items-center space-x-1 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors shrink-0"
        >
          <span>{isExpanded ? 'Collapse' : 'Ask Question'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Preset Questions Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Frequently Asked Compatibility & Specs</span>
              </span>
              <span className="text-[11px] text-slate-400">Click to ask instantly</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={isLoading}
                  className="text-xs text-left bg-slate-50 hover:bg-blue-50/80 hover:text-blue-700 hover:border-blue-300 text-slate-700 px-3 py-2 rounded-xl border border-slate-200/90 transition-all flex items-center space-x-1.5 active:scale-[0.98] disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation History */}
          {history.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-600">
                  Expert Consultation History ({history.length})
                </span>
                <button
                  onClick={() => setHistory([])}
                  className="text-slate-400 hover:text-rose-600 text-[11px] transition-colors"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="space-y-3 bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    {/* User Question */}
                    <div className="flex items-start space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900">{item.question}</p>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expert Response Box */}
                    <div className="pl-9 space-y-3">
                      {/* Compatibility Badge & Source */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadgeStyle(item.response.compatibilityStatus)}`}>
                          {item.response.compatibilityStatus === 'COMPATIBLE' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
                          {item.response.compatibilityStatus === 'NOT_COMPATIBLE' && <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
                          {item.response.compatibilityStatus === 'PARTIAL' && <Info className="w-3.5 h-3.5 mr-1 text-amber-600" />}
                          {item.response.compatibilityStatus === 'VERIFIED_SPEC' && <Cpu className="w-3.5 h-3.5 mr-1 text-blue-600" />}
                          {item.response.compatibilityBadge}
                        </span>

                        <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>{item.response.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Catalog Verified'}</span>
                        </span>
                      </div>

                      {/* Answer Text */}
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs whitespace-pre-line">
                        {item.response.answer}
                      </div>

                      {/* Key Specs Referenced */}
                      {item.response.keySpecsMentioned && item.response.keySpecsMentioned.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Relevant Product Specs
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.response.keySpecsMentioned.map((spec, sIdx) => (
                              <span 
                                key={sIdx} 
                                className="inline-flex items-center text-[11px] font-medium bg-blue-50/80 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded-md"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expert Tips */}
                      {item.response.expertTips && item.response.expertTips.length > 0 && (
                        <div className="bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-xl text-xs text-amber-900 space-y-1">
                          <span className="font-bold flex items-center space-x-1 text-amber-950 text-[11px] uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Expert Tip</span>
                          </span>
                          {item.response.expertTips.map((tip, tIdx) => (
                            <p key={tIdx} className="text-amber-900/90 text-[11px] leading-normal">
                              • {tip}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Follow-up suggestions */}
                      {item.response.suggestedFollowUps && item.response.suggestedFollowUps.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                            Suggested follow-ups:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.response.suggestedFollowUps.map((fu, fIdx) => (
                              <button
                                key={fIdx}
                                onClick={() => handleAsk(fu)}
                                disabled={isLoading}
                                className="text-[11px] bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1"
                              >
                                <span>{fu}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons (Copy, Helpful) */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs text-slate-500">
                        <button
                          onClick={() => handleCopy(item.id, item.response.answer)}
                          className="flex items-center space-x-1 hover:text-slate-800 text-[11px] transition-colors"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Copied to clipboard</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => toggleHelpful(item.id)}
                          className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                            helpfulIds[item.id]
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'hover:text-slate-800'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${helpfulIds[item.id] ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                          <span>{helpfulIds[item.id] ? 'Helpful' : 'Mark as Helpful'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center space-x-3 text-xs text-blue-800 animate-pulse">
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <div>
                <span className="font-bold block">Analyzing product specifications with Gemini...</span>
                <span className="text-[11px] text-blue-600">Cross-checking technical specs, voltage standards & hardware compatibility</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg(null)}
                className="font-bold underline ml-2 text-rose-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Custom Question Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }} 
            className="pt-2"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Ask an expert about ${product.title} (e.g. "Will this work with iPhone 15?", "What is in the box?")...`}
                disabled={isLoading}
                className="w-full pl-4 pr-24 py-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
              />
              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs disabled:cursor-not-allowed"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 px-1">
              <span>Powered by Gemini 3.8 Flash • Specialized on electronics, voltage & compatibility</span>
              <span>Press Enter to ask</span>
            </div>
          </form>
          <div ref={bottomRef} />
        </div>
      )}
    </section>
  );
};

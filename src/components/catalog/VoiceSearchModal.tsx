import React, { useEffect, useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Search, 
  Sparkles, 
  Volume2, 
  AlertCircle, 
  Check, 
  RefreshCw,
  Languages
} from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (transcript: string) => void;
  initialLanguage?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
];

const POPULAR_VOICE_QUERIES = [
  'OnePlus 5G mobiles',
  'Boat wireless earbuds',
  'Pure cotton kurta sets',
  'Smart watch under 2000',
  'Basmati rice 5kg',
  'Running shoes for men'
];

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  initialLanguage = 'en-IN',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (final) {
          const cleanFinal = final.trim();
          setTranscript(cleanFinal);
          setInterimTranscript('');
          
          // Auto search after 1 second of final speech
          if (autoSubmitTimeoutRef.current) clearTimeout(autoSubmitTimeoutRef.current);
          autoSubmitTimeoutRef.current = setTimeout(() => {
            handleCompleteSearch(cleanFinal);
          }, 900);
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setErrorMessage("Didn't catch that. Tap the microphone and try speaking again.");
        } else if (event.error === 'network') {
          setErrorMessage('Network connection issue for voice recognition. Try again.');
        } else {
          setErrorMessage('Could not process voice input. You can type or tap a sample query.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Error setting up SpeechRecognition:', e);
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (autoSubmitTimeoutRef.current) clearTimeout(autoSubmitTimeoutRef.current);
    };
  }, [selectedLanguage]);

  // Start listening on open if supported
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterimTranscript('');
      setErrorMessage(null);
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    try {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    } catch (err: any) {
      // If already started or aborting
      if (err.name !== 'InvalidStateError') {
        setErrorMessage('Unable to start microphone. Please check permissions.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    if (autoSubmitTimeoutRef.current) clearTimeout(autoSubmitTimeoutRef.current);
  };

  const handleCompleteSearch = (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) return;
    stopListening();
    onSearch(q);
    onClose();
  };

  const handleQuerySuggestionClick = (queryText: string) => {
    setTranscript(queryText);
    handleCompleteSearch(queryText);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="voice-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="voice-search-modal-content"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center space-x-1.5">
                <span>Voice Search</span>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Accessible
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Speak naturally in English or Indian regional languages
              </p>
            </div>
          </div>

          <button
            id="close-voice-search-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-6">
          {/* Language Selector Bar */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center mr-1">
              <Languages className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Language:
            </span>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                id={`voice-lang-${lang.code}`}
                type="button"
                onClick={() => {
                  stopListening();
                  setSelectedLanguage(lang.code);
                  setTimeout(() => {
                    if (recognitionRef.current) {
                      recognitionRef.current.lang = lang.code;
                      startListening();
                    }
                  }, 200);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Central Microphone Animation Stage */}
          <div className="relative flex flex-col items-center justify-center py-4">
            {/* Animated Soundwave Rings */}
            {isListening && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-blue-500/10 animate-ping duration-1000" />
                <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-pulse" />
              </>
            )}

            {/* Mic Action Button */}
            <button
              id="voice-mic-main-btn"
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white ring-4 ring-rose-200 animate-pulse'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-4 ring-blue-100 hover:scale-105'
              }`}
              title={isListening ? 'Tap to pause' : 'Tap to speak'}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>

            {/* Status Label */}
            <div className="mt-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isListening ? 'text-blue-600 animate-pulse' : 'text-slate-500'
              }`}>
                {isListening ? 'Listening... Speak now' : 'Tap microphone to speak'}
              </span>
            </div>
          </div>

          {/* Speech Transcript Output Box */}
          <div className="min-h-[72px] bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center">
            {transcript || interimTranscript ? (
              <div className="space-y-1 max-w-sm">
                <p className="text-base font-bold text-slate-900 leading-snug">
                  "{transcript || interimTranscript}"
                </p>
                {interimTranscript && !transcript && (
                  <span className="text-[11px] text-blue-600 font-medium italic">
                    Transcribing...
                  </span>
                )}
              </div>
            ) : errorMessage ? (
              <div className="flex items-center space-x-2 text-xs text-rose-600 font-semibold px-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Try saying: "OnePlus 5G", "Boat wireless earbuds", or "Cotton kurta"
              </p>
            )}
          </div>

          {/* Fallback & Suggestion Quick Chips */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Voice Prompts</span>
              </span>
              <span className="text-[10px] text-slate-400">Tap to auto-search</span>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {POPULAR_VOICE_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handleQuerySuggestionClick(query)}
                  className="text-xs font-semibold bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors shadow-2xs flex items-center space-x-1"
                >
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px]">
            {isSpeechSupported ? (
              <span className="flex items-center text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5 mr-1" />
                Speech API Active
              </span>
            ) : (
              <span className="text-amber-600 font-medium">
                Microphone fallback mode active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              id="voice-submit-search-btn"
              disabled={!transcript && !interimTranscript}
              onClick={() => handleCompleteSearch(transcript || interimTranscript)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                transcript || interimTranscript
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search "{transcript || interimTranscript || ''}"</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

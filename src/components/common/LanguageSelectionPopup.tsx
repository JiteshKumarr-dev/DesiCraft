import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import { universalVoiceEngine, PHONETIC_SAMPLES } from '../../services/voiceLanguageService';
import {
  Globe,
  Search,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface LanguageOption {
  code: LanguageCode;
  name: string;
  native: string;
  greeting: string;
  speechSample: string;
  flagEmoji: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    greeting: 'Welcome to Desi Craft',
    speechSample: 'English. Discover India living heritage.',
    flagEmoji: '🇬🇧',
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    greeting: 'देसी क्राफ्ट में आपका स्वागत है',
    speechSample: 'हिन्दी. भारत की जीवित शिल्पकला का अनुभव करें.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'te',
    name: 'Telugu',
    native: 'తెలుగు',
    greeting: 'దేశీ క్రాఫ్ట్‌కు స్వాగతం',
    speechSample: 'తెలుగు. భారతీయ చేతివృత్తుల వారసత్వాన్ని అనుభవించండి.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    greeting: 'தேசி கிராஃப்டிற்கு நல்வரவு',
    speechSample: 'தமிழ். இந்தியாவின் கைவினைப் பாரம்பரியத்தை உணருங்கள்.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'kn',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    greeting: 'ದೇಸಿ ಕ್ರಾಫ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ',
    speechSample: 'ಕನ್ನಡ. ಭಾರತೀಯ ಕರಕುಶಲ ಪರಂಪರೆಯನ್ನು ಅನ್ವೇಷಿಸಿ.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    native: 'മലയാളം',
    greeting: 'ദേസി ക്രാഫ്റ്റിലേക്ക് സ്വാഗതം',
    speechSample: 'മലയാളം. ഭാരതത്തിന്റെ കരകൗശല പാരമ്പര്യം അറിയുക.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'mr',
    name: 'Marathi',
    native: 'मराठी',
    greeting: 'देसी क्राफ्टमध्ये आपले स्वागत आहे',
    speechSample: 'मराठी. भारताचा जिवंत हस्तकला वारसा अनुभवा.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'bn',
    name: 'Bengali',
    native: 'বাংলা',
    greeting: 'দেশি ক্রাফটে আপনাকে স্বাগতম',
    speechSample: 'বাংলা. ভারতের জীবন্ত ঐতিহ্য ও হস্তশিল্প আবিষ্কার করুন.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    native: 'ગુજરાતી',
    greeting: 'દેશી ક્રાફ્ટમાં આપનું સ્વાગત છે',
    speechSample: 'ગુજરાતી. ભારતીય હસ્તકળાનો વૈભવ અનુભવો.',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    greeting: 'ਦੇਸੀ ਕਰਾਫ਼ਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    speechSample: 'ਪੰਜਾਬੀ. ਭਾਰਤ ਦੇ ਜਿਊਂਦੇ ਜਾਗਦੇ ਹਸਤਕਲਾ ਵਿਰਸੇ ਨੂੰ ਜਾਣੋ.',
    flagEmoji: '🇮🇳',
  },
];

export const LanguageSelectionPopup: React.FC = () => {
  const { language, setLanguage, isLanguagePopupOpen, setIsLanguagePopupOpen, setIsHelpMenuOpen, t } = useApp();

  const [selectedCode, setSelectedCode] = useState<LanguageCode>(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingCode, setSpeakingCode] = useState<LanguageCode | null>(null);

  // Synchronize with universal voice engine state
  useEffect(() => {
    const unsubscribe = universalVoiceEngine.subscribe((speaking, activeLang) => {
      setSpeakingCode(speaking ? activeLang : null);
    });
    return () => {
      unsubscribe();
      universalVoiceEngine.stop();
    };
  }, []);

  if (!isLanguagePopupOpen) return null;

  // Filter languages by name or native script
  const filteredLanguages = LANGUAGE_OPTIONS.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Audio Speech Pronunciation using Universal Voice Engine
  const handlePronounce = (e: React.MouseEvent, lang: LanguageOption) => {
    e.stopPropagation();

    // Toggle off if already speaking this language
    if (speakingCode === lang.code) {
      universalVoiceEngine.stop();
      setSpeakingCode(null);
      return;
    }

    const phonetic = PHONETIC_SAMPLES[lang.code]?.sample;
    universalVoiceEngine.play({
      text: lang.speechSample,
      lang: lang.code,
      phoneticFallback: phonetic,
      onStart: () => setSpeakingCode(lang.code),
      onEnd: () => setSpeakingCode(null),
      onError: () => setSpeakingCode(null),
    });
  };

  const handleConfirm = () => {
    universalVoiceEngine.stop();
    setLanguage(selectedCode);
    localStorage.setItem('desi_craft_lang_selected', 'true');
    setIsLanguagePopupOpen(false);
    // Trigger 2nd popup: Guided Help immediately
    setIsHelpMenuOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline/30 flex flex-col max-h-[92vh] overflow-hidden z-[10000]">
        {/* Header Ribbon */}
        <div className="bg-surface-container-high border-b border-outline/20 p-6 sm:p-7 text-center relative">
          <button
            onClick={() => {
              universalVoiceEngine.stop();
              localStorage.setItem('desi_craft_lang_selected', 'true');
              setIsLanguagePopupOpen(false);
              // Trigger 2nd popup: Guided Help immediately
              setIsHelpMenuOpen(true);
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface transition cursor-pointer"
            aria-label={t('Close')}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-3 shadow-xs">
            <Globe className="w-6 h-6 animate-pulse text-primary" />
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-secondary/15 text-secondary border border-secondary/30 mb-1">
            {t('FIRST-VISIT PERSONALIZATION')}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {t('How would you like to experience India’s heritage?')}
          </h2>

          <p className="font-serif text-xs sm:text-sm text-primary font-semibold mt-1">
            Choose your language • भाषा चुनें • భాష ఎంచుకోండి • உங்கள் மொழியைத் தேர்வுசெய்க
          </p>

          <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-2 leading-relaxed">
            {t('Language shapes your interface, AI assistant, artisan stories, and authentic craft certificates.')}
          </p>

          {/* Search Filter Bar */}
          <div className="relative max-w-md mx-auto mt-4">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('Search by language (e.g., Telugu, हिन्दी, தமிழ்)...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-outline/30 rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedCode === lang.code;
              const isSpeaking = speakingCode === lang.code;

              return (
                <div
                  key={lang.code}
                  onClick={() => setSelectedCode(lang.code)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                      : 'border-outline/20 bg-surface-container-low hover:bg-surface-container hover:border-primary/30'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedCode(lang.code);
                    }
                  }}
                  aria-label={`${lang.name} - ${lang.native}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{lang.flagEmoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-on-surface">
                          {lang.native}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">
                          ({lang.name})
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {lang.greeting}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Hear Pronunciation Button */}
                    <button
                      type="button"
                      onClick={(e) => handlePronounce(e, lang)}
                      title={`Hear ${lang.name} pronunciation`}
                      className={`p-1.5 rounded-full border transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-primary text-on-primary border-primary animate-pulse'
                          : 'bg-surface border-outline/20 text-on-surface-variant hover:text-primary hover:border-primary/40'
                      }`}
                      aria-label={`Hear ${lang.name} pronunciation`}
                    >
                      {isSpeaking ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4 opacity-70" />
                      )}
                    </button>

                    {/* Selected Checkmark Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-outline/30 bg-surface'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-xs text-on-surface-variant">
              No matching languages found. Search using English or native script.
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="bg-surface-container-high border-t border-outline/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-on-surface-variant text-center sm:text-left">
            🌐 You can switch your preferred language anytime from the Header or Profile.
          </p>

          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Continue in {LANGUAGE_OPTIONS.find((l) => l.code === selectedCode)?.name || 'Language'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

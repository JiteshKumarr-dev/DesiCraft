// Desi Craft - First Time Onboarding Welcome Modal
// Displays step-by-step introduction prompt for new visitors in their chosen language

import React from 'react';
import { useApp } from '../../context/AppContext';
import { GUIDE_UI_LABELS } from '../../services/guidedHelpService';
import { Sparkles, Volume2, ArrowRight, X } from 'lucide-react';

export const FirstTimeWelcomeModal: React.FC = () => {
  const {
    language,
    isFirstTimeWelcomeOpen,
    setIsFirstTimeWelcomeOpen,
    startTour,
    guidedHelpEnabled,
    t,
  } = useApp();

  if (!isFirstTimeWelcomeOpen || !guidedHelpEnabled) return null;

  const handleStartTour = () => {
    localStorage.setItem('desi_craft_welcomed', 'true');
    setIsFirstTimeWelcomeOpen(false);
    startTour('CUSTOMER_HOME_TOUR', 0);
  };

  const handleSkip = () => {
    localStorage.setItem('desi_craft_welcomed', 'true');
    setIsFirstTimeWelcomeOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-surface text-on-surface rounded-2xl shadow-2xl border-2 border-primary/40 p-6 sm:p-7 space-y-5 animate-scaleUp z-[10000]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
      >
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          aria-label={t('Skip for now')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary mx-auto shadow-sm">
            <Sparkles className="w-7 h-7 text-primary animate-pulse" />
          </div>
          <h2 id="welcome-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
            {GUIDE_UI_LABELS.welcomeToDesiCraft[language] || 'Welcome to Desi Craft'}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
            {GUIDE_UI_LABELS.firstTimeSubtext[language] ||
              'We can guide you through the website step by step in your selected language.'}
          </p>
        </div>

        {/* Voice Feature Callout Badge */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center gap-2 text-xs font-semibold text-primary">
          <Volume2 className="w-4 h-4 text-primary" />
          <span>{GUIDE_UI_LABELS.voiceGuidanceAvailable[language] || '🔊 Voice guidance is available.'}</span>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleStartTour}
            className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-md cursor-pointer"
          >
            <span>{GUIDE_UI_LABELS.startTourBtn[language] || 'Start Guided Tour'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-2.5 px-4 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-semibold transition cursor-pointer"
          >
            {GUIDE_UI_LABELS.skipForNowBtn[language] || 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
};

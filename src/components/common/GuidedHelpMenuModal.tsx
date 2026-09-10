// Desi Craft - Guided Help Menu Modal
// Quick contextual access to page guidance, spoken explanations, and settings in all 10 languages

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TOURS,
  speechController,
  GUIDE_UI_LABELS,
} from '../../services/guidedHelpService';
import {
  HelpCircle,
  Compass,
  Volume2,
  RotateCcw,
  Settings,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Camera,
  Layers,
  ArrowRight,
  Film,
} from 'lucide-react';

export const GuidedHelpMenuModal: React.FC = () => {
  const {
    language,
    activeMode,
    isHelpMenuOpen,
    setIsHelpMenuOpen,
    startTour,
    restartTour,
    guidedHelpEnabled,
    setGuidedHelpEnabled,
    voiceGuidanceEnabled,
    setVoiceGuidanceEnabled,
    isPhotoEnhancerOpen,
    isVoiceCreatorOpen,
    selectedProduct,
    setIsDemoVideoOpen,
  } = useApp();

  if (!isHelpMenuOpen) return null;

  // Determine current contextual tour ID based on active mode and modal state
  let currentTourId = 'CUSTOMER_HOME_TOUR';
  if (isPhotoEnhancerOpen) {
    currentTourId = 'AI_DEBLUR_TOUR';
  } else if (isVoiceCreatorOpen) {
    currentTourId = 'VOICE_CREATOR_TOUR';
  } else if (selectedProduct) {
    currentTourId = 'PRODUCT_DETAIL_TOUR';
  } else if (activeMode === 'ARTISAN') {
    currentTourId = 'ARTISAN_DASHBOARD_TOUR';
  } else {
    currentTourId = 'CUSTOMER_HOME_TOUR';
  }

  const currentTour = TOURS[currentTourId];

  const handleStartTour = () => {
    setIsHelpMenuOpen(false);
    if (!guidedHelpEnabled) {
      setGuidedHelpEnabled(true);
    }
    startTour(currentTourId, 0);
  };

  const handleRestartTour = () => {
    setIsHelpMenuOpen(false);
    if (!guidedHelpEnabled) {
      setGuidedHelpEnabled(true);
    }
    restartTour(currentTourId);
  };

  const handleListenOverview = () => {
    if (!currentTour) return;
    const firstStep = currentTour.steps[0];
    const textToSpeak = firstStep.voiceScript[language] || firstStep.content[language];
    if (textToSpeak) {
      speechController.speak(textToSpeak, language);
    }
    setIsHelpMenuOpen(false);
  };

  const handleLaunchHeritageMapTour = () => {
    setIsHelpMenuOpen(false);
    if (!guidedHelpEnabled) {
      setGuidedHelpEnabled(true);
    }
    startTour('HERITAGE_MAP_TOUR', 0);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-surface text-on-surface rounded-3xl shadow-2xl border-2 border-primary/40 p-5 sm:p-6 space-y-4 animate-scaleUp z-[10000] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-menu-heading"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline/15 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="help-menu-heading" className="font-serif text-lg font-bold text-on-surface">
                {GUIDE_UI_LABELS.guidedHelpTitle[language] || 'Guided Help'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {GUIDE_UI_LABELS.howCanWeHelp[language] || 'How can we help you?'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHelpMenuOpen(false)}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Welcome & Start Tour Banner */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-center space-y-2.5">
          <div className="space-y-1">
            <h3 className="font-serif text-sm sm:text-base font-bold text-primary flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{GUIDE_UI_LABELS.welcomeToDesiCraft[language] || 'Welcome to Desi Craft'}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              {GUIDE_UI_LABELS.firstTimeSubtext[language] ||
                'We can guide you through the website step by step in your selected language.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-secondary">
            <Volume2 className="w-3.5 h-3.5 text-secondary" />
            <span>{GUIDE_UI_LABELS.voiceGuidanceAvailable[language] || '🔊 Voice guidance is available.'}</span>
          </div>

          <button
            onClick={handleStartTour}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-md cursor-pointer hover:scale-[1.01]"
          >
            <span>{GUIDE_UI_LABELS.startTourBtn[language] || 'Start Guided Tour'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Context Badge */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Active Context
            </span>
            <span className="font-semibold text-on-surface">
              {currentTour?.name[language] || currentTour?.name.en}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
            {activeMode === 'ARTISAN' ? 'Artisan Studio' : 'Customer Mode'}
          </span>
        </div>

        {/* Action Options */}
        <div className="space-y-2">
          {/* 0. Watch Official 3-Min SIH Demo Video */}
          <button
            onClick={() => {
              setIsHelpMenuOpen(false);
              setIsDemoVideoOpen(true);
            }}
            className="w-full p-3.5 rounded-xl border-2 border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 transition text-left flex items-center gap-3.5 cursor-pointer group shadow-xs animate-pulse"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <span>🎬 Watch 3-Min SIH Demo Video</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-900 dark:text-amber-200">1080p</span>
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Full platform walkthrough with voiceover narration and Indian instrumental music.
              </p>
            </div>
          </button>

          {/* 1. Guide me through this page */}
          <button
            onClick={handleStartTour}
            className="w-full p-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition text-left flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-on-surface">
                {GUIDE_UI_LABELS.guideThroughPage[language] || 'Guide me through this page'}
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Highlighted walkthrough of key actions and elements.
              </p>
            </div>
          </button>

          {/* 2. Listen to instructions aloud */}
          <button
            onClick={handleListenOverview}
            className="w-full p-3 rounded-xl border border-outline/20 hover:border-primary/30 hover:bg-surface-container-low transition text-left flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-on-surface">
                {GUIDE_UI_LABELS.listen[language] || 'Listen to instructions'}
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Hear instructions spoken aloud in your selected language.
              </p>
            </div>
          </button>

          {/* 3. Explore India Heritage Map Tour (Customer Mode) */}
          {activeMode === 'CUSTOMER' && (
            <button
              onClick={handleLaunchHeritageMapTour}
              className="w-full p-3 rounded-xl border border-outline/20 hover:border-primary/30 hover:bg-surface-container-low transition text-left flex items-center gap-3.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-on-surface">
                  {TOURS.HERITAGE_MAP_TOUR.name[language] || 'India Heritage Map Tour'}
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Learn how to explore state GI clusters and crafts.
                </p>
              </div>
            </button>
          )}

          {/* 4. Restart Tutorial */}
          <button
            onClick={handleRestartTour}
            className="w-full p-3 rounded-xl border border-outline/20 hover:border-primary/30 hover:bg-surface-container-low transition text-left flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-on-surface">
                {GUIDE_UI_LABELS.restartTour[language] || 'Restart Tutorial'}
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Reset progress and replay step-by-step guidance from Step 1.
              </p>
            </div>
          </button>
        </div>

        {/* Quick Toggles: Guided Help & Voice Guidance */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface">Guided Help</span>
            <button
              onClick={() => setGuidedHelpEnabled(!guidedHelpEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                guidedHelpEnabled
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {guidedHelpEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-primary" />
              Voice Guidance
            </span>
            <button
              onClick={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                voiceGuidanceEnabled
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {voiceGuidanceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

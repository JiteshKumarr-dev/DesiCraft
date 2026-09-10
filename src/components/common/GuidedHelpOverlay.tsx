// Desi Craft - Guided Help Overlay Component
// Visual element spotlight, synchronized Web Speech Synthesis, responsive layout, and accessible controls across 10 languages

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TOURS,
  speechController,
  GUIDE_UI_LABELS,
  SPEECH_UNAVAILABLE_MESSAGE,
} from '../../services/guidedHelpService';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const GuidedHelpOverlay: React.FC = () => {
  const {
    language,
    activeTourId,
    activeStepIndex,
    guidedHelpEnabled,
    voiceGuidanceEnabled,
    nextTourStep,
    prevTourStep,
    skipTour,
    finishTour,
    closeTour,
  } = useApp();

  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasVoiceFallback, setHasVoiceFallback] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasSpokenStepRef = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const tour = activeTourId ? TOURS[activeTourId] : null;
  const currentStep = tour && tour.steps[activeStepIndex] ? tour.steps[activeStepIndex] : null;
  const totalSteps = tour ? tour.steps.length : 0;
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === totalSteps - 1;

  // Check reduced motion and screen size
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Listen to speech synthesis state changes
  useEffect(() => {
    const unsubscribe = speechController.subscribe((speaking, paused) => {
      setIsSpeaking(speaking);
      setIsPaused(paused);
    });
    return unsubscribe;
  }, []);

  // Locate and measure target element
  const updateTargetRect = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(`[data-guide="${currentStep.target}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      // Gently scroll into view if target is outside visible viewport
      const inViewport =
        rect.top >= 80 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 80;
      if (!inViewport) {
        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    } else {
      // Graceful fallback if target element not yet in DOM: null center fallback
      setTargetRect(null);
    }
  }, [currentStep, prefersReducedMotion]);

  useEffect(() => {
    updateTargetRect();
    const handleScrollOrResize = () => updateTargetRect();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);
    const timer = setTimeout(updateTargetRect, 200);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      clearTimeout(timer);
    };
  }, [updateTargetRect]);

  // Voice Guidance Trigger
  useEffect(() => {
    if (!guidedHelpEnabled || !tour || !currentStep) {
      speechController.stop();
      return;
    }

    const stepKey = `${activeTourId}_${activeStepIndex}_${language}`;
    const isVoiceAvail = speechController.isVoiceAvailableForLanguage(language);
    setHasVoiceFallback(!isVoiceAvail);

    // Speak once per step if voiceGuidanceEnabled is active
    if (voiceGuidanceEnabled && hasSpokenStepRef.current !== stepKey) {
      hasSpokenStepRef.current = stepKey;
      const textToSpeak = currentStep.voiceScript[language] || currentStep.content[language];
      if (textToSpeak) {
        speechController.speak(textToSpeak, language);
      }
    }
  }, [activeTourId, activeStepIndex, language, guidedHelpEnabled, voiceGuidanceEnabled, tour, currentStep]);

  // Keyboard accessibility
  useEffect(() => {
    if (!activeTourId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeTour();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextTourStep();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        e.preventDefault();
        prevTourStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTourId, isFirstStep, closeTour, nextTourStep, prevTourStep]);

  if (!guidedHelpEnabled || !tour || !currentStep) {
    return null;
  }

  // Voice Actions
  const handlePlayOrReplay = () => {
    const textToSpeak = currentStep.voiceScript[language] || currentStep.content[language];
    if (textToSpeak) {
      speechController.speak(textToSpeak, language);
    }
  };

  const handlePause = () => {
    speechController.pause();
  };

  const handleResume = () => {
    speechController.resume();
  };

  const handleStop = () => {
    speechController.stop();
  };

  const stepOfLabel = GUIDE_UI_LABELS.stepOf[language]
    ? GUIDE_UI_LABELS.stepOf[language]
        .replace('{current}', String(activeStepIndex + 1))
        .replace('{total}', String(totalSteps))
    : `Step ${activeStepIndex + 1} of ${totalSteps}`;

  // Tooltip positioning logic (Desktop vs Mobile)
  const getCardStyle = (): React.CSSProperties => {
    if (isMobile || !targetRect) {
      // Mobile: fixed near bottom
      return {
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        right: '16px',
        margin: '0 auto',
        maxWidth: '460px',
        zIndex: 10000,
      };
    }

    const cardWidth = 360;
    const cardHeight = 240;
    const padding = 16;
    const target = targetRect;

    // Viewport coordinates
    const targetViewportTop = target.top - window.scrollY;
    const targetViewportLeft = target.left - window.scrollX;

    let top = targetViewportTop + target.height + padding;
    let left = targetViewportLeft;

    // Default to bottom. If not enough space, place above
    if (top + cardHeight > window.innerHeight && targetViewportTop - cardHeight - padding > 80) {
      top = targetViewportTop - cardHeight - padding;
    }

    // Keep within horizontal bounds
    if (left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }
    if (left < 16) left = 16;

    return {
      position: 'fixed',
      top: `${Math.max(80, top)}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      zIndex: 10000,
    };
  };

  return (
    <div className="desi-craft-guided-help-root" role="region" aria-label="Guided Help Tour">
      {/* 1. Subtle Non-Oppressive Backdrop */}
      <div
        className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Target Spotlight Glow Ring (if target found) */}
      {targetRect && (
        <div
          className={`absolute z-[9995] pointer-events-none rounded-2xl ring-4 ring-primary ring-offset-4 ring-offset-surface/80 shadow-[0_0_28px_rgba(217,119,6,0.55)] transition-all ${
            prefersReducedMotion ? '' : 'duration-300 animate-pulse'
          }`}
          style={{
            top: `${targetRect.top - 6}px`,
            left: `${targetRect.left - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. Floating Accessible Instruction Card */}
      <div
        ref={cardRef}
        style={getCardStyle()}
        className={`bg-surface text-on-surface border-2 border-primary/50 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 z-[10000] animate-fadeIn ${
          prefersReducedMotion ? '' : 'transition-transform'
        }`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="guided-help-title"
        aria-describedby="guided-help-desc"
      >
        {/* Header: Tour Name, Step Counter, Close Button */}
        <div className="flex items-center justify-between gap-2 border-b border-outline/15 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/25">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase block">
                {tour.name[language] || tour.name.en}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">{stepOfLabel}</span>
            </div>
          </div>

          <button
            onClick={closeTour}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            aria-label="Close Guide"
            title="Close Guide (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Title & Instruction Content */}
        <div className="space-y-1.5">
          <h3
            id="guided-help-title"
            className="font-serif font-bold text-sm sm:text-base text-on-surface flex items-center gap-2"
          >
            <span>{currentStep.title[language] || currentStep.title.en}</span>
          </h3>
          <p
            id="guided-help-desc"
            className="text-xs sm:text-sm text-on-surface-variant leading-relaxed"
          >
            {currentStep.content[language] || currentStep.content.en}
          </p>
        </div>

        {/* Voice Playback Controls Bar */}
        <div className="p-2.5 rounded-xl bg-surface-container-low border border-primary/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!isSpeaking ? (
              <button
                onClick={handlePlayOrReplay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-xs font-bold cursor-pointer"
                title="Hear instructions aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {hasSpokenStepRef.current === `${activeTourId}_${activeStepIndex}_${language}`
                    ? GUIDE_UI_LABELS.replay[language] || 'Replay'
                    : GUIDE_UI_LABELS.listen[language] || 'Listen'}
                </span>
              </button>
            ) : isPaused ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition text-xs font-bold cursor-pointer"
                title="Resume Voice"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{GUIDE_UI_LABELS.resume[language] || 'Resume'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePause}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition text-xs font-semibold cursor-pointer"
                  title="Pause Voice"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>{GUIDE_UI_LABELS.pause[language] || 'Pause'}</span>
                </button>
                <button
                  onClick={handleStop}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
                  title="Stop Voice"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Live Audio Waveform Animation when speaking */}
            {isSpeaking && !isPaused && (
              <div
                className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-primary/10"
                aria-label="Voice reading aloud"
              >
                <span className="w-1 h-3 bg-primary rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            )}
          </div>

          <button
            onClick={skipTour}
            className="text-[11px] font-semibold text-on-surface-variant hover:text-on-surface hover:underline cursor-pointer"
          >
            {GUIDE_UI_LABELS.skip[language] || 'Skip Tour'}
          </button>
        </div>

        {/* Fallback Warning Notice if native TTS missing for this language on device */}
        {hasVoiceFallback && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              {SPEECH_UNAVAILABLE_MESSAGE[language] || SPEECH_UNAVAILABLE_MESSAGE.en}
            </span>
          </div>
        )}

        {/* Navigation Step Buttons: [ Back ] [ Next / Finish ] */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-outline/10">
          <button
            onClick={prevTourStep}
            disabled={isFirstStep}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isFirstStep
                ? 'opacity-40 border-outline/20 text-on-surface-variant cursor-not-allowed'
                : 'border-outline/40 text-on-surface hover:bg-surface-container cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{GUIDE_UI_LABELS.back[language] || 'Back'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {tour.steps.map((_, idx) => (
              <span
                key={idx}
                className={`inline-block rounded-full transition-all ${
                  idx === activeStepIndex
                    ? 'w-4 h-1.5 bg-primary'
                    : 'w-1.5 h-1.5 bg-outline/40'
                }`}
              />
            ))}
          </div>

          {!isLastStep ? (
            <button
              onClick={nextTourStep}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
            >
              <span>{GUIDE_UI_LABELS.next[language] || 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={finishTour}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{GUIDE_UI_LABELS.finish[language] || 'Finish'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

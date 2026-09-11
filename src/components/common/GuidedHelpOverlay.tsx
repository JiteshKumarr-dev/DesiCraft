// Desi Craft - Guided Help Overlay Component
// Implements strict top-to-bottom step progression, synchronized fixed spotlight positioning,
// controlled target retry mechanism, decoupled scrolling (zero infinite loops), and multilingual speech synthesis.

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
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Info,
} from 'lucide-react';

interface ElementViewportRect {
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
    activeMode,
    t,
  } = useApp();

  const [targetRect, setTargetRect] = useState<ElementViewportRect | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasVoiceFallback, setHasVoiceFallback] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for stable lifecycle, timer cleanup, and element references
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastScrolledStepKeyRef = useRef<string | null>(null);
  const lastSpokenStepKeyRef = useRef<string | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true);

  const tour = activeTourId ? TOURS[activeTourId] : null;
  const currentStep = tour && tour.steps[activeStepIndex] ? tour.steps[activeStepIndex] : null;
  const totalSteps = tour ? tour.steps.length : 0;
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === totalSteps - 1;

  // Track initial trigger element for restoring focus when guide closes
  useEffect(() => {
    if (activeTourId && !triggerElementRef.current && document.activeElement instanceof HTMLElement) {
      triggerElementRef.current = document.activeElement;
    }
    if (!activeTourId && triggerElementRef.current) {
      try {
        triggerElementRef.current.focus();
      } catch (_) {
        // Ignore if element is no longer in DOM
      }
      triggerElementRef.current = null;
    }
  }, [activeTourId]);

  // Screen size and reduced motion detection
  useEffect(() => {
    isMountedRef.current = true;
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      isMountedRef.current = false;
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Listen to speech controller status changes
  useEffect(() => {
    const unsubscribe = speechController.subscribe((speaking, paused) => {
      if (isMountedRef.current) {
        setIsSpeaking(speaking);
        setIsPaused(paused);
      }
    });
    return unsubscribe;
  }, []);

  // Single unified cleanup function
  const cleanupGuide = useCallback(() => {
    // 1. Stop any speech synthesis immediately
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // 2. Clear any pending retry timer
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    // 3. Clear any pending animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    // 4. Remove active highlight rect
    setTargetRect(null);
    retryCountRef.current = 0;
  }, []);

  // Mode change safety: if mode changes while guide is running, cleanly stop
  useEffect(() => {
    if (activeTourId && tour) {
      if (tour.mode !== 'ANY' && tour.mode !== activeMode) {
        cleanupGuide();
        closeTour();
      }
    }
  }, [activeMode, activeTourId, tour, cleanupGuide, closeTour]);

  // Locate and measure target element strictly in fixed viewport coordinates
  // (Notice: This function NEVER triggers scrollIntoView to prevent infinite scroll loops)
  const measureTargetInViewport = useCallback((): ElementViewportRect | null => {
    if (!currentStep) return null;
    const element = document.querySelector(`[data-guide="${currentStep.target}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }
    return null;
  }, [currentStep]);

  // Controlled retry mechanism and smooth one-time scrolling per step change
  useEffect(() => {
    if (!guidedHelpEnabled || !activeTourId || !currentStep) {
      cleanupGuide();
      return;
    }

    // Step identifier for tracking scroll and voice executions
    const currentStepKey = `${activeTourId}_step_${activeStepIndex}`;

    // Clear any previous retry attempt
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;

    const findAndActivateTarget = () => {
      const element = document.querySelector(`[data-guide="${currentStep.target}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        // Smoothly scroll into view strictly ONCE when step changes
        if (lastScrolledStepKeyRef.current !== currentStepKey) {
          lastScrolledStepKeyRef.current = currentStepKey;
          element.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      } else {
        // Element not in DOM yet. Retry up to 6 times at 100ms intervals (600ms total)
        if (retryCountRef.current < 6) {
          retryCountRef.current += 1;
          retryTimerRef.current = setTimeout(findAndActivateTarget, 100);
        } else {
          // If still unavailable after 6 retries, safely skip ONLY this step without crashing
          console.warn(
            `[GuidedHelp] Target [data-guide="${currentStep.target}"] not found after retries. Safely advancing step.`
          );
          setTargetRect(null);
          if (!isLastStep) {
            nextTourStep();
          } else {
            finishTour();
          }
        }
      }
    };

    findAndActivateTarget();

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [
    activeTourId,
    activeStepIndex,
    currentStep,
    guidedHelpEnabled,
    isLastStep,
    nextTourStep,
    finishTour,
    prefersReducedMotion,
    cleanupGuide,
  ]);

  // Passive, throttled scroll and resize listener (NEVER scrolls, only updates rect)
  useEffect(() => {
    if (!guidedHelpEnabled || !activeTourId || !currentStep) return;

    const handleScrollOrResize = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        const rect = measureTargetInViewport();
        if (rect) {
          setTargetRect(rect);
        }
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [guidedHelpEnabled, activeTourId, currentStep, measureTargetInViewport]);

  // Synchronized voice guidance: cancels old speech before speaking new step
  useEffect(() => {
    if (!guidedHelpEnabled || !tour || !currentStep) {
      speechController.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const voiceAvail = speechController.isVoiceAvailableForLanguage(language);
    setHasVoiceFallback(!voiceAvail);

    const stepVoiceKey = `${activeTourId}_${activeStepIndex}_${language}`;

    if (voiceGuidanceEnabled && lastSpokenStepKeyRef.current !== stepVoiceKey) {
      lastSpokenStepKeyRef.current = stepVoiceKey;
      const textToSpeak = currentStep.voiceScript[language] || currentStep.content[language];
      if (textToSpeak) {
        // Immediate cancellation of previous utterance to prevent speech overlapping
        speechController.stop();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        speechController.speak(textToSpeak, language);
      }
    }
  }, [
    activeTourId,
    activeStepIndex,
    language,
    guidedHelpEnabled,
    voiceGuidanceEnabled,
    tour,
    currentStep,
  ]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!activeTourId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing in form controls
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        cleanupGuide();
        closeTour();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isLastStep) nextTourStep();
        else finishTour();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        e.preventDefault();
        prevTourStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTourId, isFirstStep, isLastStep, nextTourStep, prevTourStep, closeTour, finishTour, cleanupGuide]);

  if (!guidedHelpEnabled || !tour || !currentStep) {
    return null;
  }

  // Voice playback actions
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

  const handleClose = () => {
    cleanupGuide();
    closeTour();
  };

  const handleSkip = () => {
    cleanupGuide();
    skipTour();
  };

  const handleFinish = () => {
    cleanupGuide();
    finishTour();
  };

  const stepOfLabel = GUIDE_UI_LABELS.stepOf[language]
    ? GUIDE_UI_LABELS.stepOf[language]
        .replace('{current}', String(activeStepIndex + 1))
        .replace('{total}', String(totalSteps))
    : `Step ${activeStepIndex + 1} of ${totalSteps}`;

  // Robust fixed viewport positioning for the tooltip card
  const getCardStyle = (): React.CSSProperties => {
    const cardWidth = 360;
    const cardEstimatedHeight = 240;
    const padding = 16;

    if (isMobile || !targetRect) {
      // Mobile or fallback: fixed near bottom of viewport
      return {
        position: 'fixed',
        bottom: '20px',
        left: '16px',
        right: '16px',
        margin: '0 auto',
        maxWidth: '440px',
        zIndex: 10000,
      };
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let top = targetRect.top + targetRect.height + padding;
    let left = targetRect.left;

    // Check if bottom placement overflows screen. If so, position above the target
    if (top + cardEstimatedHeight > viewportH - 20 && targetRect.top - cardEstimatedHeight - padding > 70) {
      top = targetRect.top - cardEstimatedHeight - padding;
    }

    // Keep horizontal coordinates within safe viewport boundaries
    if (left + cardWidth > viewportW - 16) {
      left = viewportW - cardWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }

    // Clamp top within viewport boundaries
    top = Math.max(76, Math.min(top, viewportH - cardEstimatedHeight - 16));

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      zIndex: 10000,
    };
  };

  return (
    <div className="desi-craft-guided-help-root" role="region" aria-label={t('Guided Help Tour')}>
      {/* 1. Subtle Backdrop: Non-oppressive, allows reading page context */}
      <div
        className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Target Spotlight Glow Ring: Synchronized in fixed viewport coordinate space */}
      {targetRect && (
        <div
          className={`fixed z-[9995] pointer-events-none rounded-2xl ring-4 ring-primary ring-offset-4 ring-offset-surface/80 shadow-[0_0_32px_rgba(217,119,6,0.65)] transition-all ${
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
          prefersReducedMotion ? '' : 'transition-all duration-200'
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
            onClick={handleClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            aria-label={t('Close Guide')}
            title={t('Close Guide (Esc)')}
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
                title={t('Hear instructions aloud')}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {lastSpokenStepKeyRef.current === `${activeTourId}_${activeStepIndex}_${language}`
                    ? GUIDE_UI_LABELS.replay[language] || 'Replay'
                    : GUIDE_UI_LABELS.listen[language] || 'Listen'}
                </span>
              </button>
            ) : isPaused ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition text-xs font-bold cursor-pointer"
                title={t('Resume Voice')}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{GUIDE_UI_LABELS.resume[language] || 'Resume'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePause}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition text-xs font-semibold cursor-pointer"
                  title={t('Pause Voice')}
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>{GUIDE_UI_LABELS.pause[language] || 'Pause'}</span>
                </button>
                <button
                  onClick={handleStop}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
                  title={t('Stop Voice')}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Live Audio Waveform Animation when speaking */}
            {isSpeaking && !isPaused && (
              <div
                className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-primary/10"
                aria-label={t('Voice reading aloud')}
              >
                <span className="w-1 h-3 bg-primary rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            )}
          </div>

          <button
            onClick={handleSkip}
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
              onClick={handleFinish}
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

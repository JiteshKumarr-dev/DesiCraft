import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_SCENES, DemoScene, TOTAL_DEMO_DURATION, getSceneAtTime, getCurrentCaption } from '../../services/demoVideoScenes';
import { indianInstrumentalSynth } from '../../services/indianInstrumentalAudio';
import { demoVoiceover } from '../../services/demoVoiceoverService';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  FastForward,
  Rewind,
  Film,
  Sparkles,
  Compass,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface LiveDemoWalkthroughOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onOpenCinematicPlayer: () => void;
}

export const LiveDemoWalkthroughOverlay: React.FC<LiveDemoWalkthroughOverlayProps> = ({
  isActive,
  onClose,
  onOpenCinematicPlayer,
}) => {
  const {
    activeMode,
    setMode,
    passports,
    setSelectedPassport,
    setIsVoiceCreatorOpen,
    setIsPriceAdvisorOpen,
    setIsPhotoEnhancerOpen,
    setSellerTab,
    setActiveSellerConversationId,
    setIsLanguagePopupOpen,
    showNotification,
  } = useApp();

  const [currentSec, setCurrentSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);
  const lastExecutedSceneRef = useRef<number | null>(null);

  const currentScene = getSceneAtTime(currentSec);
  const activeCaption = getCurrentCaption(currentScene, currentSec);

  const scheduleAction = (fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timeoutIdsRef.current.push(id);
  };

  const clearScheduledActions = () => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
  };

  // Stop everything when closing
  useEffect(() => {
    if (!isActive) {
      handlePause();
      clearScheduledActions();
      indianInstrumentalSynth.stop();
      demoVoiceover.stop();
    } else {
      handlePlay();
    }
  }, [isActive]);

  // Clock interval
  useEffect(() => {
    if (isPlaying && isActive) {
      const interval = window.setInterval(() => {
        setCurrentSec((prev) => {
          const next = prev + 0.5;
          if (next >= TOTAL_DEMO_DURATION) {
            handlePause();
            clearScheduledActions();
            showNotification('SIH Live Guided Walkthrough Complete!');
            return TOTAL_DEMO_DURATION;
          }
          return next;
        });
      }, 500);

      timerRef.current = interval;
      return () => window.clearInterval(interval);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isPlaying, isActive]);

  // Execute DOM / State actions for each scene
  useEffect(() => {
    if (!isActive) return;

    if (lastExecutedSceneRef.current !== currentScene.id) {
      lastExecutedSceneRef.current = currentScene.id;
      clearScheduledActions();

      // Play narration and music
      if (isPlaying) {
        demoVoiceover.speakScene(currentScene.narrationText);
      }

      // Live App UI State Automations
      switch (currentScene.key) {
        case 'opening':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'the_problem':
          // Keep on customer view
          if (activeMode !== 'CUSTOMER') setMode('CUSTOMER');
          break;

        case 'enter_desicraft':
          // Show toggle mode
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'customer_map':
          if (activeMode !== 'CUSTOMER') setMode('CUSTOMER');
          // Scroll to Heritage Map section
          scheduleAction(() => {
            const mapEl = document.querySelector('[data-guide="heritage-map"]') || document.querySelector('section');
            if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
          break;

        case 'digital_passport':
          // Open Pochampally Double Ikat Passport
          if (passports.length > 1) {
            setSelectedPassport(passports[1]);
          } else if (passports.length > 0) {
            setSelectedPassport(passports[0]);
          }
          break;

        case 'artisan_mode':
          // Close passport and switch to Artisan Mode
          setSelectedPassport(null);
          setMode('ARTISAN');
          setSellerTab('DASHBOARD');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'voice_creator':
          // Launch AI Voice Creator and auto-stream Kalamkari speech sample
          setMode('ARTISAN');
          setIsVoiceCreatorOpen(true);
          scheduleAction(() => {
            window.dispatchEvent(new CustomEvent('desicraft:run-sih-voice-demo'));
          }, 600);
          break;

        case 'fair_price':
          // Close Voice Creator, Open Fair Price Advisor
          setIsVoiceCreatorOpen(false);
          setIsPriceAdvisorOpen(true);
          break;

        case 'image_studio':
          // Close Price Advisor, Open Photo Enhancer
          setIsPriceAdvisorOpen(false);
          setIsPhotoEnhancerOpen(true);
          break;

        case 'collaboration':
          // Close image studio, navigate to Collaborate tab, then Messages tab
          setIsPhotoEnhancerOpen(false);
          setMode('ARTISAN');
          setSellerTab('COLLABORATE');
          scheduleAction(() => {
            setSellerTab('MESSAGES');
            setActiveSellerConversationId('conv-rajesh-lakshmi');
          }, 6000);
          break;

        case 'opportunities':
          setMode('ARTISAN');
          setSellerTab('OPPORTUNITIES');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'multilingual':
          setIsLanguagePopupOpen(true);
          break;

        case 'final_impact':
          setIsLanguagePopupOpen(false);
          setMode('CUSTOMER');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        default:
          break;
      }
    }
  }, [currentScene.id, isActive, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    indianInstrumentalSynth.start();
    demoVoiceover.speakScene(currentScene.narrationText);
    lastExecutedSceneRef.current = currentScene.id;
  };

  const handlePause = () => {
    setIsPlaying(false);
    indianInstrumentalSynth.stop();
    demoVoiceover.stop();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleJumpToScene = (sceneIndex: number) => {
    const target = DEMO_SCENES[sceneIndex];
    if (!target) return;
    clearScheduledActions();
    setCurrentSec(target.startTime);
    lastExecutedSceneRef.current = null;
  };

  if (!isActive) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[95%] max-w-3xl bg-stone-950/95 backdrop-blur-xl border-2 border-amber-500/50 rounded-2xl shadow-2xl p-4 text-stone-100 animate-slideUp font-sans select-none">
      {/* Top Banner with Scene Info & Close */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            LIVE WALKTHROUGH • SCENE {currentScene.id}/13
          </span>
          <span className="text-xs font-semibold text-stone-200 hidden sm:inline">
            {currentScene.title.split(':')[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCinematicPlayer}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open 1080p Player</span>
          </button>

          <button
            onClick={() => {
              handlePause();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
            title="Exit Walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narration Subtitle */}
      <div className="py-2.5 text-center">
        <p className="text-xs sm:text-sm font-medium text-amber-100 italic line-clamp-2">
          "{activeCaption}"
        </p>
      </div>

      {/* Progress & Controls Bar */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-stone-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleJumpToScene(Math.max(0, currentScene.id - 2))}
            disabled={currentScene.id <= 1}
            className="p-1.5 rounded-lg text-stone-300 hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
            title="Previous Scene"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => handleJumpToScene(Math.min(DEMO_SCENES.length - 1, currentScene.id))}
            disabled={currentScene.id >= DEMO_SCENES.length}
            className="p-1.5 rounded-lg text-stone-300 hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
            title="Next Scene"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timestamp */}
        <div className="text-xs font-mono text-stone-400">
          <span className="text-amber-300 font-bold">{formatTime(currentSec)}</span> / {formatTime(TOTAL_DEMO_DURATION)}
        </div>
      </div>
    </div>
  );
};

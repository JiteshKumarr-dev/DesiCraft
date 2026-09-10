import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DEMO_SCENES,
  DemoScene,
  TOTAL_DEMO_DURATION,
  getSceneAtTime,
  getCurrentCaption,
} from '../../services/demoVideoScenes';
import { indianInstrumentalSynth } from '../../services/indianInstrumentalAudio';
import { demoVoiceover } from '../../services/demoVoiceoverService';
import { demoVideoRecorder, RecordProgress } from '../../services/demoVideoRecorder';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Sparkles,
  Music,
  Mic,
  X,
  Radio,
  Layers,
  Globe,
  Award,
  ShieldCheck,
  Compass,
  Film,
  FastForward,
  Rewind,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sliders,
  MapPin,
  MessageSquare,
  Building2,
} from 'lucide-react';

interface CinematicDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLiveWalkthrough?: () => void;
}

export const CinematicDemoModal: React.FC<CinematicDemoModalProps> = ({
  isOpen,
  onClose,
  onStartLiveWalkthrough,
}) => {
  const {
    products,
    passports,
    setMode,
    setSelectedPassport,
    setIsVoiceCreatorOpen,
    setIsPriceAdvisorOpen,
    setSellerTab,
    setActiveSellerConversationId,
    setIsLanguagePopupOpen,
    showNotification,
  } = useApp();

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(0.2);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [isCaptionsVisible, setIsCaptionsVisible] = useState(true);

  // Video Recording States
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordDurationMode, setRecordDurationMode] = useState<240 | 30>(240);
  const [recordProgress, setRecordProgress] = useState<RecordProgress | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Split Slider for Image Enhancement simulation in Player
  const [simulatedSplitPos, setSimulatedSplitPos] = useState(50);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastSpokenSceneRef = useRef<number | null>(null);

  const currentScene = getSceneAtTime(currentTime);
  const activeCaption = getCurrentCaption(currentScene, currentTime);

  // Animate split slider during Scene 9 (AI Image Studio)
  useEffect(() => {
    if (currentScene.key === 'image_studio' && isPlaying) {
      const animSplit = 50 + Math.sin(currentTime * 2.2) * 28;
      setSimulatedSplitPos(Math.round(animSplit));
    }
  }, [currentTime, currentScene.key, isPlaying]);

  // Stop everything when closing
  useEffect(() => {
    if (!isOpen) {
      handlePause();
      indianInstrumentalSynth.stop();
      demoVoiceover.stop();
      demoVideoRecorder.cancelRecording();
      setIsRecordingVideo(false);
    }
  }, [isOpen]);

  // Handle Playback Clock
  useEffect(() => {
    if (isPlaying) {
      const interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.25 * playbackRate;
          if (next >= TOTAL_DEMO_DURATION) {
            handlePause();
            return TOTAL_DEMO_DURATION;
          }
          return next;
        });
      }, 250);

      timerRef.current = interval;
      return () => window.clearInterval(interval);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isPlaying, playbackRate]);

  // Handle Synchronized Voiceover when entering a new scene
  useEffect(() => {
    if (isPlaying && isVoiceActive) {
      if (lastSpokenSceneRef.current !== currentScene.id) {
        lastSpokenSceneRef.current = currentScene.id;
        demoVoiceover.speakScene(currentScene.narrationText);
      }
    }
  }, [currentScene.id, isPlaying, isVoiceActive]);

  // Handle Indian Instrumental BGM start / volume sync
  useEffect(() => {
    if (isBgmActive && isPlaying) {
      indianInstrumentalSynth.start();
      indianInstrumentalSynth.setVolume(bgmVolume);
    } else {
      indianInstrumentalSynth.stop();
    }
  }, [isBgmActive, isPlaying, bgmVolume]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (isBgmActive) {
      indianInstrumentalSynth.start();
      indianInstrumentalSynth.setVolume(bgmVolume);
    }
    if (isVoiceActive) {
      demoVoiceover.speakScene(currentScene.narrationText);
      lastSpokenSceneRef.current = currentScene.id;
    }
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
      if (currentTime >= TOTAL_DEMO_DURATION) {
        setCurrentTime(0);
      }
      handlePlay();
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DEMO_DURATION, newTime));
    setCurrentTime(clamped);
    const targetScene = getSceneAtTime(clamped);
    if (isPlaying && isVoiceActive) {
      lastSpokenSceneRef.current = targetScene.id;
      demoVoiceover.speakScene(targetScene.narrationText);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    lastSpokenSceneRef.current = null;
    if (isPlaying) {
      handlePlay();
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    demoVoiceover.setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // 1080p Video Recording & Instant File Download
  const handleStartRecording = (durationSec: 240 | 30 = recordDurationMode) => {
    handlePause();
    setIsRecordingVideo(true);
    setRecordProgress(null);
    setRecordedVideoUrl(null);

    demoVideoRecorder.startRecording(
      { durationSeconds: durationSec, includeVoiceover: isVoiceActive },
      (prog: RecordProgress) => {
        setRecordProgress(prog);
      },
      (blobUrl, fileName) => {
        setIsRecordingVideo(false);
        setRecordedVideoUrl(blobUrl);

        // Automatically trigger browser download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showNotification(
          `1080p SIH Demo Video (${durationSec === 30 ? '30s Reel' : '4m Official'}) exported & downloaded successfully!`
        );
      },
      (err) => {
        console.error('Video recording failed:', err);
        setIsRecordingVideo(false);
        showNotification('Recording failed: ' + err.message);
      }
    );
  };

  // Launch live interactive auto-walkthrough in actual app DOM
  const handleTriggerLiveWalkthrough = () => {
    handlePause();
    onClose();
    if (onStartLiveWalkthrough) {
      onStartLiveWalkthrough();
    } else {
      // Fallback direct walkthrough
      setMode('CUSTOMER');
      showNotification('Starting Live In-App Guided Walkthrough...');
    }
  };

  if (!isOpen) return null;

  const progressPercent = (currentTime / TOTAL_DEMO_DURATION) * 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-stone-950 text-stone-100 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden font-sans"
      >
        {/* Top Heritage Gold Bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

        {/* Modal Header Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-stone-800/80 bg-stone-900/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-100">
                  Desi<span className="text-amber-400 font-normal italic">Craft</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SIH 2024 / 2026 OFFICIAL DEMO
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                16:9 • 1080p Cinematic Showcase & Auto-Walkthrough
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Auto-Tour Button */}
            <button
              onClick={handleTriggerLiveWalkthrough}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Drive the live web app step-by-step with voiceover"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Run Live In-App Walkthrough</span>
              <span className="md:hidden">Live Tour</span>
            </button>

            {/* 1080p Download Button with Duration Selector */}
            <div className="flex items-center rounded-lg bg-stone-800/90 p-0.5 border border-stone-700/80">
              <button
                onClick={() => setRecordDurationMode(240)}
                disabled={isRecordingVideo}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  recordDurationMode === 240
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Full 4-minute SIH Official Demo Video (1080p)"
              >
                4m Full
              </button>
              <button
                onClick={() => setRecordDurationMode(30)}
                disabled={isRecordingVideo}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  recordDurationMode === 30
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Fast 30-second SIH Highlights Reel (1080p)"
              >
                30s Reel
              </button>
              <button
                onClick={() => handleStartRecording(recordDurationMode)}
                disabled={isRecordingVideo}
                className="ml-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 text-xs font-bold flex items-center gap-1 transition shadow-sm cursor-pointer"
                title={`Export & Download 1080p Video (${recordDurationMode === 30 ? '30-second Reel' : '4-minute Video'})`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isRecordingVideo ? 'Recording 1080p...' : 'Download 1080p'}
                </span>
                <span className="sm:hidden">1080p</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recording Overlay Progress Bar */}
        {isRecordingVideo && (
          <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-semibold">
                {recordProgress ? recordProgress.status : 'Rendering 1080p frames & Indian classical audio stream...'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold">
                {recordProgress ? `${recordProgress.percent}%` : '0%'}
              </span>
              <button
                onClick={() => {
                  demoVideoRecorder.cancelRecording();
                  setIsRecordingVideo(false);
                  showNotification('Recording cancelled.');
                }}
                className="px-2.5 py-1 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 text-[11px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area: 16:9 Viewport */}
        <div className="relative flex-1 bg-stone-950 overflow-hidden flex flex-col justify-between">
          {/* 16:9 Aspect Ratio Container */}
          <div className="relative w-full aspect-video max-h-[58vh] sm:max-h-[62vh] md:max-h-[66vh] mx-auto bg-stone-900 border-b border-stone-800 flex flex-col overflow-hidden">
            {/* Visual Canvas Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/20 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              {/* Scene Top Info */}
              <div className="flex items-start justify-between z-10">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: currentScene.themeColor }}
                    >
                      {currentScene.badge}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {formatTime(currentTime)} / {formatTime(TOTAL_DEMO_DURATION)}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-100 drop-shadow-sm line-clamp-1">
                    {currentScene.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 line-clamp-1">
                    {currentScene.subtitle}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-stone-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-800 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-stone-300 font-medium">Indian English Voiceover Active</span>
                </div>
              </div>

              {/* Dynamic Center Visual Representation for Current Scene */}
              <div className="relative z-10 flex-1 my-3 flex items-center justify-center">
                {/* Scene 1: Opening */}
                {currentScene.key === 'opening' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl animate-fadeIn">
                    {[
                      { name: 'Varanasi Brocade', state: 'Uttar Pradesh', tag: 'GI-2009-UP-0044', img: '/images/banarasi-gold-saree.png' },
                      { name: 'Pochampally Ikat', state: 'Telangana', tag: 'GI-2005-TS-0004', img: '/images/kadwa-saree-portrait.jpg' },
                      { name: 'Bastar Dhokra', state: 'Chhattisgarh', tag: 'GI-2008-CG-0089', img: '/images/hero-saree.png' },
                      { name: 'Srikalahasti Kalamkari', state: 'Andhra Pradesh', tag: 'GI-2006-AP-0032', img: '/images/kadwa-saree-portrait.jpg' },
                    ].map((c, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-stone-900/80 border border-amber-500/30 text-center space-y-1.5 shadow-lg">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{c.tag}</span>
                        <h4 className="font-serif text-sm font-bold text-stone-100">{c.name}</h4>
                        <p className="text-[11px] text-stone-400">📍 {c.state}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scene 2: The Problem */}
                {currentScene.key === 'the_problem' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl animate-fadeIn">
                    {[
                      { title: 'Predatory Middlemen', stat: '75–85%', desc: 'Lost value taken by non-producing traders' },
                      { title: 'Language Exclusion', stat: '90%+', desc: 'Unable to read or type English interfaces' },
                      { title: 'Unfair Pricing', stat: 'Distress', desc: 'Zero calculation of loom days & GI mastery' },
                      { title: 'Loom Abandonment', stat: '40% Drop', desc: 'Generations forced into unorganized labor' },
                    ].map((p, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-center space-y-1">
                        <span className="text-xl sm:text-2xl font-bold text-red-400 font-mono">{p.stat}</span>
                        <h4 className="font-bold text-xs text-stone-200">{p.title}</h4>
                        <p className="text-[10px] text-stone-400">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scene 3: Enter DesiCraft */}
                {currentScene.key === 'enter_desicraft' && (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl animate-fadeIn">
                    <div className="flex-1 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        CUSTOMER MODE
                      </span>
                      <h4 className="font-serif text-base font-bold text-amber-200">Heritage Connoisseur</h4>
                      <p className="text-xs text-stone-300">Interactive Map, Verified Passports, Visual Search, Oral Stories</p>
                    </div>

                    <div className="px-3 py-2 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold text-center">
                      ONE ACCOUNT ⇋ TWO MODES
                    </div>

                    <div className="flex-1 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                        ARTISAN MODE
                      </span>
                      <h4 className="font-serif text-base font-bold text-purple-200">Business Command Center</h4>
                      <p className="text-xs text-stone-300">Voice Product Creator, AI Pricing, Image Deblur, Collaboration</p>
                    </div>
                  </div>
                )}

                {/* Scene 4: Customer Experience & Heritage Map */}
                {currentScene.key === 'customer_map' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl animate-fadeIn">
                    <div className="p-4 rounded-xl bg-stone-900/90 border border-amber-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-amber-400">STATE EXPLORER</span>
                        <span className="text-xs text-stone-400">Telangana</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-stone-100">
                        Pochampally Double Ikat (Telia Rumal)
                      </h3>
                      <p className="text-xs text-stone-300">
                        Master Artisan: Gaddam Lakshmi Devi • 5th Generation Loom Heritage
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] font-semibold">
                          GI-2005-TS-0004
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">100% GI Tag Certified</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                      <h4 className="font-bold text-sm text-stone-200">Telia Rumal Royal Silk Saree</h4>
                      <p className="text-xs text-stone-400">
                        Natural Indigofera and Madder Root Dyeing with Geometric Double Ikat Weave.
                      </p>
                      <div className="text-sm font-bold text-amber-400 font-mono">₹18,900</div>
                      <button
                        onClick={() => setSelectedPassport(passports[1] || passports[0])}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Inspect Digital Craft Passport →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Scene 5: Digital Craft Passport */}
                {currentScene.key === 'digital_passport' && (
                  <div className="p-5 rounded-2xl bg-stone-900/95 border-2 border-blue-500/40 w-full max-w-3xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-mono font-bold text-blue-400">
                          GOVERNMENT OF INDIA • GI REGISTRY
                        </span>
                      </div>
                      <span className="text-xs font-mono text-stone-400">GI-2005-TS-0004</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block">CRAFT</span>
                        <span className="font-bold text-stone-200">Pochampally Ikat</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">MASTER ARTISAN</span>
                        <span className="font-bold text-stone-200">Gaddam Lakshmi Devi</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">MATERIALS</span>
                        <span className="font-bold text-stone-200">Organic Mulberry Silk</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">BLOCKCHAIN HASH</span>
                        <span className="font-mono text-amber-400 font-bold">0x8f2a...9d7e</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 6: Artisan Mode */}
                {currentScene.key === 'artisan_mode' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl animate-fadeIn">
                    {[
                      { label: 'Artisan Net Earnings', val: '₹1,42,800', badge: '+24% Growth' },
                      { label: 'Active Handloom Orders', val: '8 Orders', badge: 'Realtime Track' },
                      { label: 'Artisan Rating', val: '4.95 ★', badge: '142 Reviews' },
                      { label: 'Verification', val: 'GI Master', badge: 'National Award' },
                    ].map((m, i) => (
                      <div key={i} className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-center space-y-1">
                        <span className="text-[11px] text-stone-400">{m.label}</span>
                        <div className="text-xl sm:text-2xl font-bold text-purple-300 font-mono">{m.val}</div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {m.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scene 7: Voice Creator */}
                {currentScene.key === 'voice_creator' && (
                  <div className="w-full max-w-3xl p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>Artisan Native Speech Input:</span>
                    </div>
                    <div className="p-3 rounded-lg bg-stone-900/90 border border-emerald-500/20 text-xs italic text-stone-200">
                      "Hand-painted Kalamkari cotton dupatta, made using natural dyes and traditional bamboo pen on organic cotton with sacred Tree of Life and peacock motifs. Suggested price is 4800 rupees."
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-stone-900 border border-stone-800">
                        <span className="text-stone-400 text-[10px] block">Extracted Title</span>
                        <span className="font-bold text-emerald-300">Kalamkari Dupatta</span>
                      </div>
                      <div className="p-2 rounded bg-stone-900 border border-stone-800">
                        <span className="text-stone-400 text-[10px] block">GI Tag</span>
                        <span className="font-bold text-emerald-300">GI-2006-AP-0032</span>
                      </div>
                      <div className="p-2 rounded bg-stone-900 border border-stone-800">
                        <span className="text-stone-400 text-[10px] block">Materials</span>
                        <span className="font-bold text-emerald-300">Natural Dyes & Cotton</span>
                      </div>
                      <div className="p-2 rounded bg-stone-900 border border-stone-800">
                        <span className="text-stone-400 text-[10px] block">Extracted Price</span>
                        <span className="font-bold text-amber-400 font-mono">₹4,800</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 8: AI Fair Price Advisor */}
                {currentScene.key === 'fair_price' && (
                  <div className="w-full max-w-3xl p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2.5 animate-fadeIn">
                    <h3 className="font-serif text-base font-bold text-amber-300">
                      Transparent Fair Living-Wage Formula
                    </h3>
                    <div className="space-y-1.5 text-xs text-stone-300">
                      <div className="flex justify-between p-2 rounded bg-stone-900/80 border border-stone-800">
                        <span>Indigenous Raw Material Cost (Katan Silk & Zari):</span>
                        <span className="font-mono font-bold text-amber-400">₹4,500</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-stone-900/80 border border-stone-800">
                        <span>Artisan Loom Labor (25 Days @ Living Wage):</span>
                        <span className="font-mono font-bold text-amber-400">₹18,750</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-stone-900/80 border border-stone-800">
                        <span>GI Heritage Craft Mastery Multiplier:</span>
                        <span className="font-mono font-bold text-amber-400">₹3,750</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      <span>RECOMMENDED EQUITABLE FAIR PRICE:</span>
                      <span className="font-mono text-base text-emerald-400">₹27,000</span>
                    </div>
                  </div>
                )}

                {/* Scene 9: AI Image Studio Enhancement */}
                {currentScene.key === 'image_studio' && (
                  <div className="relative w-full max-w-xl h-48 sm:h-56 rounded-xl overflow-hidden border-2 border-stone-700 bg-stone-900 shadow-2xl animate-fadeIn">
                    {/* Background blurry side */}
                    <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-xs bg-black/60 px-3 py-1 rounded-full">
                        RAW CAMERA PHOTO (Blurry Focus)
                      </span>
                    </div>

                    {/* Enhanced side clipped */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-emerald-950/60 flex items-center justify-end pr-8"
                      style={{ clipPath: `inset(0 0 0 ${simulatedSplitPos}%)` }}
                    >
                      <span className="text-emerald-300 font-bold text-xs bg-black/60 px-3 py-1 rounded-full border border-emerald-500/40">
                        ✨ ENHANCED (60%+ Sharpness & Restored Luster)
                      </span>
                    </div>

                    {/* Split Slider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-md"
                      style={{ left: `${simulatedSplitPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white text-stone-950 font-bold text-[10px] flex items-center justify-center shadow-lg">
                        ⇋
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 10: Collaboration & Messages */}
                {currentScene.key === 'collaboration' && (
                  <div className="w-full max-w-3xl p-4 rounded-2xl bg-sky-950/20 border border-sky-500/40 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-1.5">
                      <span className="text-sky-300 font-bold">🤝 Craft Fusion Collaboration</span>
                      <span className="text-stone-400">Varanasi Zari x Pochampally Ikat</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 rounded bg-stone-900/90 border border-stone-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-stone-200">Gaddam Lakshmi Devi: </span>
                          <span className="text-stone-300">"Warp clusters prepared with natural indigo."</span>
                        </div>
                        <span className="text-[10px] text-stone-400">18:45</span>
                      </div>
                      <div className="p-2 rounded bg-blue-950/40 border border-blue-500/30 text-blue-200 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Cluster Card: Pochampally Ikat Weavers Colony, Telangana (17.3486° N)</span>
                      </div>
                      <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 flex items-center justify-between">
                        <span>📎 Attached: Kadwa_Zari_Border_Draft.png (1.8 MB)</span>
                        <span className="text-[11px] text-red-400 font-semibold cursor-pointer">🗑 Unsend / Delete</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 11: Opportunities Radar */}
                {currentScene.key === 'opportunities' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-4xl animate-fadeIn">
                    {[
                      { name: 'PM Vishwakarma', credit: '₹3,00,000 Credit @ 5%', feat: '₹15,000 Tool Voucher' },
                      { name: 'ODOP Scheme', credit: 'Export Subsidies', feat: 'International Fairs' },
                      { name: 'National Craft Fairs', credit: 'Surajkund & Dilli Haat', feat: 'Direct Stall Allotment' },
                    ].map((s, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30 text-center space-y-1">
                        <h4 className="font-bold text-xs text-orange-300">{s.name}</h4>
                        <div className="font-mono font-bold text-sm text-stone-100">{s.credit}</div>
                        <p className="text-[11px] text-stone-400">{s.feat}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scene 12: Multilingual */}
                {currentScene.key === 'multilingual' && (
                  <div className="grid grid-cols-5 gap-2 w-full max-w-3xl animate-fadeIn text-center">
                    {[
                      { en: 'Hindi', native: 'हिन्दी' },
                      { en: 'Telugu', native: 'తెలుగు' },
                      { en: 'Tamil', native: 'தமிழ்' },
                      { en: 'Kannada', native: 'ಕನ್ನಡ' },
                      { en: 'Malayalam', native: 'മലയാളം' },
                      { en: 'Marathi', native: 'मराठी' },
                      { en: 'Bengali', native: 'বাংলা' },
                      { en: 'Gujarati', native: 'ગુજરાતી' },
                      { en: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
                      { en: 'English', native: 'English' },
                    ].map((l, i) => (
                      <div key={i} className="p-2 rounded-lg bg-teal-950/30 border border-teal-500/30 space-y-0.5">
                        <div className="font-serif text-sm font-bold text-teal-300">{l.native}</div>
                        <div className="text-[10px] text-stone-400">{l.en}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scene 13: Final Impact */}
                {currentScene.key === 'final_impact' && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-2 max-w-2xl animate-fadeIn">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                      "DesiCraft is not just another marketplace."
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-200">
                      It is a digital ecosystem where heritage is discovered, artisans are empowered, technology removes barriers, and creators can grow together.
                    </p>
                    <div className="pt-2 font-mono text-xs font-bold text-amber-400">
                      DESICRAFT • SMART INDIA HACKATHON
                    </div>
                  </div>
                )}
              </div>

              {/* Subtitles Overlay Bar */}
              {isCaptionsVisible && (
                <div className="relative z-10 mx-auto max-w-3xl w-full text-center">
                  <div className="inline-block px-4 py-2 rounded-xl bg-black/85 border border-amber-500/30 text-amber-100 text-xs sm:text-sm md:text-base font-medium backdrop-blur-md shadow-lg">
                    "{activeCaption}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Timeline Scrubber with Chapters */}
          <div className="px-4 sm:px-6 pt-3 pb-2 bg-stone-900/90 border-t border-stone-800 space-y-2">
            {/* Scrubber Bar */}
            <div
              className="relative h-2.5 bg-stone-800 rounded-full cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                handleSeek(pos * TOTAL_DEMO_DURATION);
              }}
            >
              {/* Played fill */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Chapter Dots */}
              {DEMO_SCENES.map((s) => {
                const dotPos = (s.startTime / TOTAL_DEMO_DURATION) * 100;
                const isPassed = currentTime >= s.startTime;
                return (
                  <div
                    key={s.id}
                    title={`${s.id}. ${s.title} (${formatTime(s.startTime)})`}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-transform ${
                      isPassed ? 'bg-amber-300 scale-110' : 'bg-stone-600 hover:scale-125'
                    }`}
                    style={{ left: `${dotPos}%` }}
                  />
                );
              })}

              {/* Scrubber Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-stone-950 shadow-md group-hover:scale-125 transition-transform pointer-events-none"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Left Controls: Play/Pause, Rewind, Fast-Forward, Time */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleRestart}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
                  title="Restart from beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSeek(currentTime - 10)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
                  title="Rewind 10 seconds"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  title="Play / Pause (Space)"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => handleSeek(currentTime + 10)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
                  title="Forward 10 seconds"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                <div className="text-xs font-mono text-stone-300 ml-1">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-stone-500"> / {formatTime(TOTAL_DEMO_DURATION)}</span>
                </div>
              </div>

              {/* Center: Active Scene Name */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-400 truncate max-w-sm">
                <span className="text-amber-400 font-bold">Scene {currentScene.id}:</span>
                <span className="truncate">{currentScene.title}</span>
              </div>

              {/* Right Controls: Speed, Captions, Audio Mixer, Fullscreen */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs">
                {/* Speed selector */}
                <div className="flex items-center rounded-lg bg-stone-800/80 p-0.5 border border-stone-700/50">
                  {[1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition ${
                        playbackRate === rate
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Subtitles CC Toggle */}
                <button
                  onClick={() => setIsCaptionsVisible(!isCaptionsVisible)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                    isCaptionsVisible
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                  title="Toggle Subtitles / Closed Captions"
                >
                  CC
                </button>

                {/* Indian Instrumental BGM Toggle */}
                <button
                  onClick={() => setIsBgmActive(!isBgmActive)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition ${
                    isBgmActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                  title={isBgmActive ? 'Indian Classical BGM: ON' : 'Indian Classical BGM: MUTED'}
                >
                  <Music className="w-3.5 h-3.5" />
                </button>

                {/* Voiceover Speech Toggle */}
                <button
                  onClick={() => {
                    const next = !isVoiceActive;
                    setIsVoiceActive(next);
                    demoVoiceover.setMuted(!next);
                  }}
                  className={`p-1.5 rounded-lg border cursor-pointer transition ${
                    isVoiceActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                  title={isVoiceActive ? 'Voiceover Narration: ON' : 'Voiceover Narration: MUTED'}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Drawer at Bottom for Fast Scrubbing */}
        <div className="bg-stone-900 border-t border-stone-800/80 px-4 py-2.5 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
            CHAPTERS:
          </span>
          {DEMO_SCENES.map((s) => {
            const isCurrent = currentScene.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSeek(s.startTime)}
                className={`px-2.5 py-1 rounded-md shrink-0 transition cursor-pointer text-left border ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-xs'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 border-stone-700/50'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80 mr-1">{formatTime(s.startTime)}</span>
                <span>{s.id}. {s.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

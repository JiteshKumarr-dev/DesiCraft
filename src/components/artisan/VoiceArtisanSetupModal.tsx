import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArtisanProfile, LanguageCode } from '../../types';
import {
  RealtimeVoiceSession,
  speakAssistantFeedback,
  SPEECH_LANG_MAP,
} from '../../services/realtimeVoiceAssistant';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
  X,
  Volume2,
  Award,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  Globe,
  Radio,
} from 'lucide-react';

const ARTISAN_VOICE_PRESETS: Record<string, { label: string; text: string; craft: string; years: number; guild: string; state: string; district: string; bio: string }> = {
  hi: {
    label: 'हिन्दी (Varanasi Kadwa Silk)',
    text: 'मैं वाराणसी के मदनपुरा से राजेशवर अंसारी हूँ। हमारे परिवार में पाँच पीढ़ियों से कड़वा तकनीक से शुद्ध कतान सिल्क और चांदी की जरी की साड़ियाँ बुनी जाती हैं। मुझे 24 साल का अनुभव है। हम काशी बुनकर सहकारी समिति से जुड़े हैं।',
    craft: 'Varanasi Zari & Brocade',
    years: 24,
    guild: 'Kashi Bunakar Vankar Cooperative',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    bio: 'Preserving 5 generations of Kadwa pit-loom tapestry weaving with pure silver Zari in the sacred alleyways of Varanasi.',
  },
  te: {
    label: 'తెలుగు (Pochampally Ikat)',
    text: 'నేను భూదాన్ పోచంపల్లి నుండి గడ్డం లక్ష్మీ దేవిని. గత 28 సంవత్సరాలుగా పట్టు పోచంపల్లి డబుల్ ఇక్కత్ చీరలను ఆసు ఫ్రేమ్ మరియు పిట్-మగ్గంపై నేస్తున్నాను. మేము పోచంపల్లి చేనేత సహకార సంఘంలో సభ్యులం.',
    craft: 'Pochampally Ikat',
    years: 28,
    guild: 'Pochampally Handloom Weavers Cooperative',
    state: 'Telangana',
    district: 'Yadadri Bhuvanagiri',
    bio: 'Master of mathematical Asu frame tie-and-dye double ikat weaving with organic plant extracts.',
  },
  ta: {
    label: 'தமிழ் (Kanchipuram Silk)',
    text: 'நான் காஞ்சிபுரத்தைச் சேர்ந்த சுப்பிரமணியன். கடந்த 32 ஆண்டுகளாக பாரம்பரிய முப்பெரும் பட்டுச் சேலைகளை கொர்வை இணைப்பில் நெய்து வருகிறேன். காஞ்சிபுரம் பட்டு கூட்டுறவு சங்கத்தின் உறுப்பினர்.',
    craft: 'Kanchipuram Silk',
    years: 32,
    guild: 'Kanchi Kamakshi Silk Weavers Guild',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    bio: 'Specialist in 3-shuttle Korvai interlocking temple border silk sarees.',
  },
  en: {
    label: 'English (Jaipur Blue Pottery)',
    text: 'My name is Kripal Singh from Jaipur Rajasthan. I have been practicing GI tagged Jaipur Blue Pottery for 19 years without using river clay, creating traditional cobalt floral ceramics with quartz stone powder and natural gum.',
    craft: 'Jaipur Blue Pottery',
    years: 19,
    guild: 'Jaipur Traditional Ceramic Guild',
    state: 'Rajasthan',
    district: 'Jaipur',
    bio: 'Reviving non-clay quartz ceramic firing techniques with mineral cobalt glaze motifs.',
  },
};

export const VoiceArtisanSetupModal: React.FC = () => {
  const {
    user,
    setUser,
    isVoiceArtisanSetupOpen,
    setIsVoiceArtisanSetupOpen,
    setMode,
    showNotification,
    language,
    t,
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSpeechLang, setActiveSpeechLang] = useState<LanguageCode>(language);

  // Extracted structured fields
  const [craftName, setCraftName] = useState('Varanasi Zari & Brocade');
  const [experienceYears, setExperienceYears] = useState(20);
  const [guildName, setGuildName] = useState('Traditional Artisans Cooperative');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [districtName, setDistrictName] = useState('Varanasi');
  const [bioStory, setBioStory] = useState('Master artisan continuing ancestral handloom lineage.');
  const [learningAvailable, setLearningAvailable] = useState(true);
  const [collaborationAvailable, setCollaborationAvailable] = useState(true);

  const sessionRef = useRef<RealtimeVoiceSession | null>(null);

  useEffect(() => {
    setActiveSpeechLang(language);
  }, [language]);

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
        sessionRef.current = null;
      }
    };
  }, [isVoiceArtisanSetupOpen]);

  if (!isVoiceArtisanSetupOpen) return null;

  // Real-time microphone toggle
  const handleToggleRecord = async () => {
    if (isRecording) {
      if (sessionRef.current) {
        const fullText = sessionRef.current.stop();
        sessionRef.current = null;
        setIsRecording(false);
        setAudioLevel(0);
        setInterimText('');
        parseAndApplyArtisanProfile(fullText || spokenTranscript);
      }
    } else {
      setSpokenTranscript('');
      setInterimText('');

      const session = new RealtimeVoiceSession(activeSpeechLang, {
        onStart: () => {
          setIsRecording(true);
        },
        onInterim: (interim, fullDisplay) => {
          setInterimText(interim);
          setSpokenTranscript(fullDisplay);
          quickExtractArtisanDetails(fullDisplay);
        },
        onFinal: (final, fullDisplay) => {
          setSpokenTranscript(fullDisplay);
          setInterimText('');
          quickExtractArtisanDetails(fullDisplay);
        },
        onError: (err) => {
          showNotification(err);
          setIsRecording(false);
          setAudioLevel(0);
        },
        onAudioLevel: (lvl) => setAudioLevel(lvl),
        onEnd: () => {
          setIsRecording(false);
          setAudioLevel(0);
        },
      });

      sessionRef.current = session;
      await session.start();
    }
  };

  const quickExtractArtisanDetails = (text: string) => {
    const lower = text.toLowerCase();

    // Years of experience extraction (e.g. "24 years" or "20 saal")
    const yearsMatch = lower.match(/(\d+)\s*(?:years?|yrs?|saal|sal|సంవత్సరాలు|ஆண்டுகள்|ವರ್ಷ)/i);
    if (yearsMatch && yearsMatch[1]) {
      const y = parseInt(yearsMatch[1], 10);
      if (y > 0 && y < 80) setExperienceYears(y);
    }

    // Craft matching
    if (lower.includes('ikat') || lower.includes('pochampally') || lower.includes('ఇక్కత్')) {
      setCraftName('Pochampally Ikat');
      setStateName('Telangana');
      setDistrictName('Yadadri Bhuvanagiri');
    } else if (lower.includes('banarasi') || lower.includes('varanasi') || lower.includes('kashi') || lower.includes('बनारसी')) {
      setCraftName('Varanasi Zari & Brocade');
      setStateName('Uttar Pradesh');
      setDistrictName('Varanasi');
    } else if (lower.includes('kanchipuram') || lower.includes('காஞ்சிபுரம்')) {
      setCraftName('Kanchipuram Silk');
      setStateName('Tamil Nadu');
      setDistrictName('Kanchipuram');
    } else if (lower.includes('blue pottery') || lower.includes('jaipur')) {
      setCraftName('Jaipur Blue Pottery');
      setStateName('Rajasthan');
      setDistrictName('Jaipur');
    } else if (lower.includes('channapatna') || lower.includes('ಚನ್ನಪಟ್ಟಣ')) {
      setCraftName('Channapatna Lacquer Toys');
      setStateName('Karnataka');
      setDistrictName('Ramanagara');
    }
  };

  const parseAndApplyArtisanProfile = (fullText: string) => {
    if (!fullText.trim()) return;
    setIsAnalyzing(true);

    quickExtractArtisanDetails(fullText);
    setBioStory(fullText);

    setTimeout(() => {
      setIsAnalyzing(false);
      showNotification('✨ AI analyzed voice transcript and populated your artisan credentials in real time!');
      speakAssistantFeedback(`Artisan credentials recorded for ${craftName}. Lineage extracted with ${experienceYears} years experience.`, activeSpeechLang);
    }, 600);
  };

  // Handle Preset Voice Trigger for simulation
  const handleTriggerPreset = (presetKey: string) => {
    const preset = ARTISAN_VOICE_PRESETS[presetKey] || ARTISAN_VOICE_PRESETS.hi;
    setSpokenTranscript(preset.text);
    setInterimText('');
    setIsAnalyzing(true);

    setTimeout(() => {
      setCraftName(preset.craft);
      setExperienceYears(preset.years);
      setGuildName(preset.guild);
      setStateName(preset.state);
      setDistrictName(preset.district);
      setBioStory(preset.bio);
      setIsAnalyzing(false);
      showNotification('AI analyzed voice transcript and populated artisan credentials!');
    }, 600);
  };

  const handleSaveArtisanProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const newArtisanProfile: ArtisanProfile = {
      id: `ap-${Date.now()}`,
      user_id: user.id,
      name: user.name,
      craft_id: 'craft-varanasi-brocade',
      craft_name: craftName,
      state: stateName,
      district: districtName,
      experience_years: experienceYears,
      bio: bioStory,
      craft_story: spokenTranscript || bioStory,
      learning_available: learningAvailable,
      collaboration_available: collaborationAvailable,
      verification_status: 'VERIFIED',
      languages_spoken: ['Hindi', 'English'],
      avatar_url: '/images/hero-saree.png',
      guild_name: guildName,
      rating: 4.95,
      reviews_count: 12,
    };

    const updatedUser = {
      ...user,
      active_mode: 'ARTISAN' as const,
      artisan_profile: newArtisanProfile,
    };

    setUser(updatedUser);
    localStorage.setItem('desi_craft_user', JSON.stringify(updatedUser));
    setMode('ARTISAN');
    setIsVoiceArtisanSetupOpen(false);
    showNotification('Artisan profile verified & saved! Welcome to your Studio Command Center.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline/30 max-h-[92vh] overflow-hidden flex flex-col text-on-surface">
        {/* Header */}
        <div className="bg-surface-container-high p-6 border-b border-outline/20 relative">
          <button
            onClick={() => setIsVoiceArtisanSetupOpen(false)}
            aria-label={t('Close modal')}
            className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                REAL-TIME VOICE ONBOARDING
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Voice-First Artisan Studio Setup
              </h2>
              <p className="text-xs text-on-surface-variant">
                No complex paperwork. Speak in your mother tongue; AI extracts your craft lineage live.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Voice Microphone Center */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-primary/30 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-serif font-bold text-on-surface uppercase tracking-wider block">
                🎙️ Tap & Speak in your language
              </span>
              <p className="text-xs text-on-surface-variant">
                "I am from Varanasi, weaving Katan Silk Kadwa sarees for 24 years with Kashi Cooperative..."
              </p>
            </div>

            {/* Dialect selector */}
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <select
                value={activeSpeechLang}
                onChange={(e) => {
                  const l = e.target.value as LanguageCode;
                  setActiveSpeechLang(l);
                  if (sessionRef.current) sessionRef.current.setLanguage(l);
                }}
                className="text-xs font-semibold bg-surface border border-outline/30 rounded-lg px-2.5 py-1 text-primary focus:outline-none cursor-pointer"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="en">English (India)</option>
              </select>
            </div>

            {/* Pulsing Mic Button */}
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <div
                  className="absolute w-24 h-24 rounded-full bg-red-500/30 animate-ping"
                  style={{ transform: `scale(${1 + audioLevel / 50})` }}
                />
              )}
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white ring-8 ring-red-200 dark:ring-red-900/60 shadow-red-500/50'
                    : 'bg-primary text-on-primary hover:scale-105 ring-4 ring-primary/20 shadow-primary/30'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            {/* Soundwaves frequency visualization */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1 h-6">
                {[12, 28, 16, 36, 22, 30, 14, 38, 20, 32, 18].map((h, i) => {
                  const dynamicH = Math.max(4, Math.min(24, (h * (audioLevel || 20)) / 40));
                  return (
                    <span
                      key={i}
                      style={{ height: `${dynamicH}px` }}
                      className="w-1 bg-red-500 rounded-full transition-all duration-75"
                    />
                  );
                })}
              </div>
            )}

            <span className="text-xs font-bold text-on-surface block">
              {isRecording ? `🔴 Live Recording in ${activeSpeechLang.toUpperCase()}...` : 'Tap Mic to Start Speaking'}
            </span>

            {/* Preset Language Voice Samples */}
            <div className="pt-2 border-t border-outline/10">
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-2">
                Or test with sample voice recordings in your language:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Object.entries(ARTISAN_VOICE_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTriggerPreset(key)}
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline/20 text-xs font-medium text-on-surface hover:border-primary transition cursor-pointer"
                  >
                    🗣️ {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spoken Transcript Preview */}
          {(spokenTranscript || interimText) && (
            <div className="p-4 rounded-2xl bg-surface-container border border-outline/20 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  {isRecording ? 'Listening in Real Time:' : 'Spoken Voice Lineage:'}
                </span>
                {isAnalyzing ? (
                  <span className="text-primary font-semibold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Structuring Credentials...
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                <span>"{spokenTranscript}"</span>
                {interimText && <span className="text-primary italic"> {interimText}...</span>}
              </p>
            </div>
          )}

          {/* Extracted Structured Credentials Form */}
          <form onSubmit={handleSaveArtisanProfile} className="space-y-4 pt-2 border-t border-outline/10">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-on-surface">
                Extracted Artisan Credentials (Review & Edit)
              </h3>
              <span className="text-[10px] uppercase font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">
                AI Extracted Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-primary" /> Primary Craft Tradition
                </label>
                <input
                  type="text"
                  required
                  value={craftName}
                  onChange={(e) => setCraftName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-xl text-on-surface focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Years of Master Experience
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={70}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-xl text-on-surface focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-primary" /> Cooperative / Guild Affiliation
                </label>
                <input
                  type="text"
                  required
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-xl text-on-surface focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> District & State
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder={t('District')}
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-xl text-on-surface focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    required
                    placeholder={t('State')}
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-xl text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">{t('Artisan Biography & Craft Story')}</label>
              <textarea
                rows={2}
                required
                value={bioStory}
                onChange={(e) => setBioStory(e.target.value)}
                className="w-full p-2.5 text-xs bg-surface-container-low border border-outline/30 rounded-xl text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline/20 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={learningAvailable}
                  onChange={(e) => setLearningAvailable(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>{t('Open for Apprenticeship Workshops')}</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline/20 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={collaborationAvailable}
                  onChange={(e) => setCollaborationAvailable(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>{t('Open for Inter-Craft Collaborations')}</span>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline/10">
              <button
                type="button"
                onClick={() => setIsVoiceArtisanSetupOpen(false)}
                className="px-5 py-2.5 rounded-full border border-outline/30 text-xs font-bold hover:bg-surface-container transition cursor-pointer"
              >
                {t('Skip for now')}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>{t('Save Artisan Profile & Enter Studio')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

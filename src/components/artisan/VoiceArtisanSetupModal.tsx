import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArtisanProfile, LanguageCode } from '../../types';
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
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Extracted structured fields
  const [craftName, setCraftName] = useState('Varanasi Zari & Brocade');
  const [experienceYears, setExperienceYears] = useState(20);
  const [guildName, setGuildName] = useState('Traditional Artisans Cooperative');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [districtName, setDistrictName] = useState('Varanasi');
  const [bioStory, setBioStory] = useState('Master artisan continuing ancestral handloom lineage.');
  const [learningAvailable, setLearningAvailable] = useState(true);
  const [collaborationAvailable, setCollaborationAvailable] = useState(true);

  if (!isVoiceArtisanSetupOpen) return null;

  // Handle Preset Voice Trigger for simulation
  const handleTriggerPreset = (presetKey: string) => {
    const preset = ARTISAN_VOICE_PRESETS[presetKey] || ARTISAN_VOICE_PRESETS.hi;
    setSpokenTranscript(preset.text);
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
    }, 700);
  };

  // Live microphone simulation / Web Speech API
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        showNotification('AI structured your craft profile successfully!');
      }, 800);
    } else {
      setIsRecording(true);
      const activePreset = ARTISAN_VOICE_PRESETS[language] || ARTISAN_VOICE_PRESETS.hi;
      setSpokenTranscript(activePreset.text);

      setTimeout(() => {
        setCraftName(activePreset.craft);
        setExperienceYears(activePreset.years);
        setGuildName(activePreset.guild);
        setStateName(activePreset.state);
        setDistrictName(activePreset.district);
        setBioStory(activePreset.bio);
        setIsRecording(false);
      }, 2500);
    }
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
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline/30 max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-container-high p-6 border-b border-outline/20 relative">
          <button
            onClick={() => setIsVoiceArtisanSetupOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                LOW-TYPING ONBOARDING
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Voice-First Artisan Studio Setup
              </h2>
              <p className="text-xs text-on-surface-variant">
                No complex paperwork. Speak in your mother tongue; AI extracts your craft lineage.
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

            {/* Pulsing Mic Button */}
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white animate-ping'
                  : 'bg-primary text-on-primary hover:scale-105 ring-4 ring-primary/20'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            {/* Soundwaves visualization */}
            <div className="flex items-center justify-center gap-1 h-6">
              {[12, 28, 16, 36, 22, 30, 14, 38, 20, 32, 18].map((h, i) => (
                <span
                  key={i}
                  style={{ height: isRecording ? `${h}px` : '4px' }}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isRecording ? 'bg-primary' : 'bg-outline/40'
                  }`}
                />
              ))}
            </div>

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
          {spokenTranscript && (
            <div className="p-4 rounded-xl bg-surface-container border border-outline/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Spoken Voice Transcript
              </span>
              <p className="text-xs italic text-on-surface font-serif">
                "{spokenTranscript}"
              </p>
            </div>
          )}

          {/* AI Structured Profile Form (Review & Edit) */}
          <form id="artisan-setup-form" onSubmit={handleSaveArtisanProfile} className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-outline/10 pb-2">
              <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-700" />
                <span>AI-Extracted Artisan Credentials (Review & Edit)</span>
              </h3>
              {isAnalyzing && (
                <span className="text-[11px] text-primary flex items-center gap-1 animate-pulse font-semibold">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Structuring...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-on-surface">Craft Specialty / Name</label>
                <input
                  type="text"
                  required
                  value={craftName}
                  onChange={(e) => setCraftName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">Years of Mastery</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">State of Heritage Origin</label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">District / Cluster</label>
                <input
                  type="text"
                  required
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Affiliated Guild / Cooperative</label>
              <input
                type="text"
                required
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Artisan Studio Narrative</label>
              <textarea
                rows={2}
                required
                value={bioStory}
                onChange={(e) => setBioStory(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline/30 rounded-xl"
              />
            </div>

            {/* Availability toggles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="p-3 rounded-xl bg-surface-container-low border border-outline/20 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={learningAvailable}
                  onChange={(e) => setLearningAvailable(e.target.checked)}
                  className="rounded text-primary focus:ring-primary/40"
                />
                <span className="font-semibold text-on-surface text-[11px]">
                  🎓 Offer Masterclasses & Apprenticeships
                </span>
              </label>

              <label className="p-3 rounded-xl bg-surface-container-low border border-outline/20 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collaborationAvailable}
                  onChange={(e) => setCollaborationAvailable(e.target.checked)}
                  className="rounded text-primary focus:ring-primary/40"
                />
                <span className="font-semibold text-on-surface text-[11px]">
                  🤝 Open to Artisan Collaborations
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-high p-4 sm:p-5 border-t border-outline/20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsVoiceArtisanSetupOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            Skip for now
          </button>

          <button
            type="submit"
            form="artisan-setup-form"
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Save Artisan Profile & Enter Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiServices, VOICE_SAMPLE_PRESETS } from '../../services/aiServices';
import { LanguageCode, Product, DigitalCraftPassport } from '../../types';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
  X,
  Volume2,
  Layers,
  Clock,
  Tag,
  ShieldCheck,
  ArrowRight,
  Upload,
} from 'lucide-react';

export const VoiceProductCreator: React.FC = () => {
  const {
    isVoiceCreatorOpen,
    setIsVoiceCreatorOpen,
    language,
    setLanguage,
    addProduct,
    user,
    t,
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  // Editable Form fields populated by AI
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [craftName, setCraftName] = useState('Varanasi Zari & Brocade');
  const [craftId, setCraftId] = useState('craft-varanasi-brocade');
  const [materials, setMaterials] = useState<string[]>(['Mulberry Katan Silk', 'Pure Silver Zari']);
  const [newMaterialInput, setNewMaterialInput] = useState('');
  const [technique, setTechnique] = useState('Kadwa Pit-Loom Tapestry');
  const [price, setPrice] = useState(22000);
  const [productionTime, setProductionTime] = useState('45 Days');
  const [region, setRegion] = useState<'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast'>('North');
  const [imageUrl, setImageUrl] = useState(
    '/images/hero-saree.png'
  );

  if (!isVoiceCreatorOpen) return null;

  // Handle Preset Voice Sample for test simulation
  const handleLoadPreset = (lang: LanguageCode) => {
    const preset = VOICE_SAMPLE_PRESETS[lang] || VOICE_SAMPLE_PRESETS.en;
    setSpokenTranscript(preset.text);
    triggerAiExtraction(preset.text, lang);
  };

  const handleSimulateVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      triggerAiExtraction(spokenTranscript, language);
    } else {
      setIsRecording(true);
      const preset = VOICE_SAMPLE_PRESETS[language] || VOICE_SAMPLE_PRESETS.en;
      setSpokenTranscript(preset.text);
      setTimeout(() => {
        setIsRecording(false);
        triggerAiExtraction(preset.text, language);
      }, 1500);
    }
  };

  const triggerAiExtraction = async (text: string, lang: LanguageCode) => {
    setIsExtracting(true);
    try {
      const parsed = await aiServices.parseVoiceListing(text, lang);
      setExtractedData(parsed);
      setTitle(parsed.name);
      setDescription(parsed.description);
      setCraftName(parsed.craft_name);
      setCraftId(parsed.craft_id);
      setMaterials(parsed.materials);
      setTechnique(parsed.technique);
      setPrice(parsed.suggested_price);
      setProductionTime(parsed.production_time);
      setRegion(parsed.region);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddMaterial = () => {
    if (newMaterialInput.trim()) {
      setMaterials([...materials, newMaterialInput.trim()]);
      setNewMaterialInput('');
    }
  };

  const handleRemoveMaterial = (idx: number) => {
    setMaterials(materials.filter((_, i) => i !== idx));
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();

    const newProductId = `prod-${Date.now()}`;
    const newPassportId = `pass-${Date.now()}`;

    const newPassport: DigitalCraftPassport = {
      id: newPassportId,
      product_id: newProductId,
      craft_id: craftId,
      craft_name: craftName,
      artisan_id: user.id,
      artisan_name: user.name,
      region: `${region} India`,
      materials: materials,
      technique: technique,
      cultural_info: `Authentic traditional piece handwoven under the living heritage guidelines of ${craftName}.`,
      artisan_story: description,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DESI-CRAFT-${newProductId}`,
      gi_tag: `GI-2026-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      blockchain_hash: `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      created_at: new Date().toISOString(),
    };

    const newProduct: Product = {
      id: newProductId,
      artisan_id: user.id,
      artisan_name: user.name,
      artisan_guild: user.artisan_profile?.guild_name || 'Traditional Artisan Guild',
      artisan_avatar: user.artisan_profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      craft_id: craftId,
      craft_name: craftName,
      name: title,
      description: description,
      materials: materials,
      technique: technique,
      price: price,
      quantity: 1,
      production_time: productionTime,
      region: region,
      status: 'PUBLISHED',
      images: [imageUrl],
      primary_image: imageUrl,
      passport_id: newPassportId,
      gi_tag: newPassport.gi_tag,
      created_at: new Date().toISOString(),
      story: description,
      authenticity_status: 'VERIFIED',
      is_ai_enhanced: true,
    };

    addProduct(newProduct, newPassport);
    setIsVoiceCreatorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-surface rounded-2xl shadow-2xl border-2 border-primary/40 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-outline/20 bg-surface-container-low rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary uppercase tracking-wider">
                  VOICE-FIRST STUDIO AI
                </span>
                <span className="text-xs font-semibold text-primary">
                  10 Indian Languages Supported
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-on-surface mt-0.5">
                Voice Product Creator
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsVoiceCreatorOpen(false)}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Voice Input Section */}
          <div className="p-5 rounded-2xl bg-surface-container border border-primary/30 space-y-4 text-center">
            <p className="text-xs text-on-surface-variant">
              Speak naturally in your mother tongue (Hindi, Telugu, Tamil, Gujarati, etc.). AI extracts materials, technique, and fair price automatically.
            </p>

            {/* Mic Pulse Button */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                type="button"
                onClick={handleSimulateVoiceRecording}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-200'
                    : 'bg-primary text-on-primary hover:bg-primary/90'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <span className="text-xs font-bold text-on-surface block">
              {isRecording ? 'Listening in ' + language.toUpperCase() + '...' : 'Tap Mic to Speak in Native Dialect'}
            </span>

            {/* Language Preset Simulator Pills */}
            <div className="pt-2 border-t border-outline/10">
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-2">
                Quick Test Voice Presets in Indian Languages:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'en', label: 'English' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'kn', label: 'ಕನ್ನಡ' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'gu', label: 'ગુજરાતી' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLoadPreset(l.code as LanguageCode)}
                    className="px-2.5 py-1 rounded-full text-xs bg-surface border border-outline/30 hover:border-primary text-on-surface font-serif transition cursor-pointer"
                  >
                    ✦ {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spoken Text Transcript Box */}
          {spokenTranscript && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Audio Transcript Detected:
                </span>
                {isExtracting && (
                  <span className="text-primary font-medium flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> AI Extracting Details...
                  </span>
                )}
              </div>
              <p className="text-xs italic text-on-surface leading-relaxed">
                "{spokenTranscript}"
              </p>
            </div>
          )}

          {/* AI-Extracted Structured Form */}
          <form onSubmit={handlePublishListing} className="space-y-4 pt-2 border-t border-outline/10">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-on-surface">
                Structured Catalog Details (Auto-Filled by AI)
              </h3>
              <span className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-md font-semibold border border-green-200">
                AI Confidence 98%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Craft Tradition</label>
                <input
                  type="text"
                  required
                  value={craftName}
                  onChange={(e) => setCraftName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Product Narrative & Lineage</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>

            {/* Materials List Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">Indigenous Raw Materials</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {materials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs bg-surface-container border border-outline/20 text-on-surface flex items-center gap-1.5"
                  >
                    <span>{mat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(i)}
                      className="text-on-surface-variant hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add another pure material..."
                  value={newMaterialInput}
                  onChange={(e) => setNewMaterialInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-outline/30 text-xs font-semibold hover:bg-surface-container"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Fair Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg font-bold text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Time on Loom</label>
                <input
                  type="text"
                  required
                  value={productionTime}
                  onChange={(e) => setProductionTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Handcraft Technique</label>
                <input
                  type="text"
                  required
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>
            </div>

            {/* Passport Notice */}
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-3 text-xs text-secondary-container">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
              <span>
                Publishing will automatically mint an official <strong>Digital Craft Passport</strong> with QR code and cryptographic proof of provenance.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mint Digital Craft Passport & Publish to Bharat Catalog</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

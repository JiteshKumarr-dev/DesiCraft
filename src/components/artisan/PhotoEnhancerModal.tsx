import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SunMedium,
  Sparkles,
  X,
  Layers,
  Check,
  Eye,
  Sliders,
} from 'lucide-react';

export const PhotoEnhancerModal: React.FC = () => {
  const { isPhotoEnhancerOpen, setIsPhotoEnhancerOpen, showNotification } = useApp();

  const [activeFilter, setActiveFilter] = useState<'GALLERY' | 'WARM_SUN' | 'MINIMAL'>('GALLERY');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPhotoEnhancerOpen) return null;

  const samplePhoto = '/images/hero-saree.png';

  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showNotification('Studio photo enhancement applied! Ready for catalog.');
      setIsPhotoEnhancerOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsPhotoEnhancerOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <SunMedium className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                COMPUTER VISION ENHANCEMENT
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Studio Lighting Enhancer
              </h2>
              <p className="text-xs text-on-surface-variant">
                Transform dim workshop and loom photos into pristine gallery-grade catalog shots without losing handcraft texture.
              </p>
            </div>
          </div>

          {/* Image Preview with Toggle */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/10 border border-outline/20">
            <img
              src={samplePhoto}
              alt="Enhancement preview"
              className={`w-full h-full object-cover transition-all duration-300 ${
                showOriginal
                  ? 'filter brightness-80 contrast-90 sepia-0'
                  : activeFilter === 'GALLERY'
                  ? 'filter brightness-105 contrast-110 saturate-110'
                  : activeFilter === 'WARM_SUN'
                  ? 'filter brightness-110 contrast-105 sepia-15'
                  : 'filter brightness-100 contrast-120'
              }`}
            />

            {/* Hold to View Original Button */}
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOriginal ? 'Showing Raw Loom Shot' : 'Hold to View Original'}</span>
              </button>
            </div>

            <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Handloom Texture Intact</span>
            </div>
          </div>

          {/* Lighting Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface">Select Lighting Preset</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'GALLERY', label: 'Warm Gallery Studio', desc: 'Diffused museum light' },
                { id: 'WARM_SUN', label: 'Morning Sun Courtyard', desc: 'Natural golden hour warmth' },
                { id: 'MINIMAL', label: 'Clean High-Contrast', desc: 'Sharp thread definition' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveFilter(m.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    activeFilter === m.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-outline/20 bg-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="font-serif font-bold text-xs text-on-surface block">
                    {m.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block mt-0.5">
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsPhotoEnhancerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Enhancing Image...' : 'Save & Enhance Listing'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

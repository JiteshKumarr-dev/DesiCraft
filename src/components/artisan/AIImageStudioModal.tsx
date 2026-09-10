import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Check,
  RotateCcw,
  Download,
  Eye,
  UploadCloud,
  Sliders,
  CheckCircle2,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';
import {
  enhanceProductPhoto,
  DeblurLevel,
  DEBLUR_PRESETS,
  DeblurProgress,
  DeblurResult,
} from '../../services/aiImageStudio';

export interface AIImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageSrc?: string;
  onApply: (deblurredDataUrl: string) => void;
  craftName?: string;
}

export const AIImageStudioModal: React.FC<AIImageStudioModalProps> = ({
  isOpen,
  onClose,
  initialImageSrc = '/images/kadwa-saree-portrait.jpg',
  onApply,
  craftName = 'Handcrafted Creation',
}) => {
  const [originalImageSrc, setOriginalImageSrc] = useState<string>(initialImageSrc);
  const [deblurredResultUrl, setDeblurredResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressState, setProgressState] = useState<DeblurProgress | null>(null);
  const [activeLevel, setActiveLevel] = useState<DeblurLevel>('STANDARD');
  const [customStrength, setCustomStrength] = useState<number>(65);
  const [activeViewTab, setActiveViewTab] = useState<'SPLIT' | 'SIDE_BY_SIDE' | 'DEBLURRED_ONLY'>('SPLIT');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [sharpnessGain, setSharpnessGain] = useState<number>(60);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingSplit = useRef(false);

  // Sync initial image when modal opens
  useEffect(() => {
    if (isOpen && initialImageSrc) {
      setOriginalImageSrc(initialImageSrc);
      setDeblurredResultUrl(null);
      setActiveLevel('STANDARD');
      setCustomStrength(65);
      runDeblur(initialImageSrc, 'STANDARD', 65);
    }
  }, [isOpen, initialImageSrc]);

  if (!isOpen) return null;

  // Run the Deblur algorithm
  const runDeblur = async (src: string, level: DeblurLevel, strength: number) => {
    setIsProcessing(true);
    setProgressState({
      stepIndex: 1,
      totalSteps: 4,
      stepMessage: 'Analyzing photo focus & blur spread...',
      percent: 25,
    });

    try {
      const result: DeblurResult = await enhanceProductPhoto(
        src,
        { level, strength },
        (prog) => setProgressState(prog)
      );

      setDeblurredResultUrl(result.dataUrl);
      setSharpnessGain(result.sharpnessGainPercent);
    } catch (err: any) {
      console.warn('[AI Deblur] Error processing image:', err);
      // Safe fallback: keep original untouched
      setDeblurredResultUrl(src);
    } finally {
      setIsProcessing(false);
      setProgressState(null);
    }
  };

  // Change preset level
  const handlePresetSelect = (level: DeblurLevel) => {
    setActiveLevel(level);
    const preset = DEBLUR_PRESETS.find((p) => p.id === level);
    const strength = preset ? preset.strength : 65;
    setCustomStrength(strength);
    runDeblur(originalImageSrc, level, strength);
  };

  // Slider change
  const handleStrengthSliderChange = (newStrength: number) => {
    setCustomStrength(newStrength);
  };

  // Apply slider change on release
  const handleStrengthSliderCommit = () => {
    runDeblur(originalImageSrc, activeLevel, customStrength);
  };

  // Handle uploading a new photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setOriginalImageSrc(dataUrl);
        runDeblur(dataUrl, activeLevel, customStrength);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Before/After split slider drag
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSplit.current || !splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSplitSliderPos(percent);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingSplit.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingSplit.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Actions
  const handleApplyDeblurred = () => {
    if (deblurredResultUrl) {
      onApply(deblurredResultUrl);
      onClose();
    }
  };

  const handleKeepOriginal = () => {
    onApply(originalImageSrc);
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = deblurredResultUrl || originalImageSrc;
    link.download = `${craftName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-deblurred.jpg`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-surface rounded-2xl shadow-2xl border border-outline/30 my-auto overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline/20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  AI Sharpness & Clarity
                </span>
                <span className="text-xs text-on-surface-variant hidden sm:inline">
                  Preserves Original Background & Scene
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                AI Photo Deblur Enhancer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-guide="photo-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline/30 text-xs font-semibold text-on-surface hover:bg-surface-container transition cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              <span>Change Photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Deblur Strength Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Deblur Strength
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-guide="enhancement-modes">
              {DEBLUR_PRESETS.map((preset) => {
                const isSelected = activeLevel === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-xs'
                        : 'border-outline/25 bg-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-primary bg-primary' : 'border-outline/60'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="font-serif font-bold text-xs sm:text-sm text-on-surface">
                          {preset.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fine Tuning Slider */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sliders className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-on-surface shrink-0">Fine-Tune Clarity:</span>
              <span className="font-mono font-bold text-primary">{customStrength}%</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-3/5">
              <span className="text-[10px] text-on-surface-variant">Soft</span>
              <input
                type="range"
                min="10"
                max="100"
                value={customStrength}
                onChange={(e) => handleStrengthSliderChange(Number(e.target.value))}
                onMouseUp={handleStrengthSliderCommit}
                onTouchEnd={handleStrengthSliderCommit}
                className="w-full accent-primary cursor-pointer"
              />
              <span className="text-[10px] text-on-surface-variant">Sharp</span>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-outline/15">
            <span className="font-medium text-on-surface-variant">
              Drag slider to inspect deblur result:
            </span>
            <div className="flex items-center gap-1 bg-surface-container rounded-lg p-0.5 border border-outline/20 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveViewTab('SPLIT')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  activeViewTab === 'SPLIT'
                    ? 'bg-surface text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Split Comparison
              </button>
              <button
                type="button"
                onClick={() => setActiveViewTab('SIDE_BY_SIDE')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  activeViewTab === 'SIDE_BY_SIDE'
                    ? 'bg-surface text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Side by Side
              </button>
              <button
                type="button"
                onClick={() => setActiveViewTab('DEBLURRED_ONLY')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  activeViewTab === 'DEBLURRED_ONLY'
                    ? 'bg-surface text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sharp Only
              </button>
            </div>
          </div>

          {/* Visual Display Stage */}
          <div className="relative rounded-2xl overflow-hidden border border-outline/25 bg-neutral-900 min-h-[300px] sm:min-h-[400px] flex items-center justify-center p-3 sm:p-4">
            {/* Processing Spinner */}
            {isProcessing && (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3 animate-fadeIn">
                <div className="w-10 h-10 rounded-full border-3 border-amber-500/30 border-t-primary animate-spin" />
                <div className="space-y-1 max-w-xs">
                  <p className="text-xs font-semibold text-white">
                    {progressState?.stepMessage || 'Removing camera blur...'}
                  </p>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${progressState?.percent || 30}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Split Slider View */}
            {activeViewTab === 'SPLIT' && (
              <div
                ref={splitContainerRef}
                data-guide="compare-slider-view"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="relative w-full aspect-square sm:aspect-4/3 max-h-[460px] rounded-xl overflow-hidden shadow-lg select-none touch-none bg-black/40 flex items-center justify-center cursor-ew-resize"
              >
                {/* Deblurred (Full underneath) */}
                <img
                  src={deblurredResultUrl || originalImageSrc}
                  alt="Deblurred"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Original (Clipped on Left) */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-white shadow-2xl"
                  style={{ width: `${splitSliderPos}%` }}
                >
                  <img
                    src={originalImageSrc}
                    alt="Original Blurry"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      width: splitContainerRef.current?.clientWidth || '100%',
                      maxWidth: 'none',
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black/75 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    Original (Blurry)
                  </div>
                </div>

                {/* Deblurred Label on Right */}
                <div className="absolute top-3 right-3 bg-primary/90 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-md">
                  ✨ Deblurred (Sharp)
                </div>

                {/* Handle */}
                <div
                  className="absolute top-0 bottom-0 z-20 flex items-center justify-center pointer-events-none"
                  style={{ left: `${splitSliderPos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-black shadow-xl border-2 border-primary flex items-center justify-center text-xs font-bold">
                    ⇄
                  </div>
                </div>
              </div>
            )}

            {/* Side by Side View */}
            {activeViewTab === 'SIDE_BY_SIDE' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-white/70 px-1">
                    <span>ORIGINAL PHOTO</span>
                    <span className="text-white/40 text-[10px]">Unmodified</span>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                    <img
                      src={originalImageSrc}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 px-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> DEBLURRED PHOTO
                    </span>
                    <span className="text-emerald-300/80 text-[10px]">+{sharpnessGain}% Clarity</span>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-emerald-500/30 flex items-center justify-center">
                    <img
                      src={deblurredResultUrl || originalImageSrc}
                      alt="Deblurred"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Deblurred Only View */}
            {activeViewTab === 'DEBLURRED_ONLY' && (
              <div className="w-full aspect-square sm:aspect-4/3 max-h-[460px] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img
                  src={deblurredResultUrl || originalImageSrc}
                  alt="Deblurred Result"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Clarity & Preservation Status */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Camera blur removed • 100% Original background, scene & colors intact</span>
            </div>

            <span className="text-[11px] text-on-surface-variant">
              No elements added or removed
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline/20 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleKeepOriginal}
              className="px-4 py-2 rounded-lg border border-outline/30 text-xs font-semibold text-on-surface hover:bg-surface-container transition cursor-pointer"
            >
              Keep Original
            </button>

            <button
              type="button"
              data-guide="enhance-action-btn"
              onClick={() => runDeblur(originalImageSrc, activeLevel, customStrength)}
              disabled={isProcessing}
              className="px-3.5 py-2 rounded-lg border border-outline/30 text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Apply</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              title="Download deblurred photo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          <button
            type="button"
            data-guide="apply-to-product-btn"
            onClick={handleApplyDeblurred}
            disabled={isProcessing || !deblurredResultUrl}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold shadow-md hover:bg-primary/90 transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Check className="w-4 h-4" />
            <span>Use Deblurred Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

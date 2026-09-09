import React from 'react';
import { ArtisanProfile } from '../../types';
import {
  BookOpen,
  X,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  GraduationCap,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CurriculumModalProps {
  artisan: ArtisanProfile | null;
  onClose: () => void;
  onApply: (artisan: ArtisanProfile) => void;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  artisan,
  onClose,
  onApply,
}) => {
  if (!artisan) return null;

  const syllabusModules = [
    {
      stage: 'Stage 1 (Days 1–2)',
      title: 'Indigenous Raw Material Alchemy & Botanical Extraction',
      focus: 'Understanding the living soul of materials',
      topics: [
        'Identification of pure Mulberry Katan Silk vs synthetic polyester blends',
        'Traditional botanical dye fermentation (living Indigofera vats & Indian madder root)',
        'Natural sizing using fermented rice starch and indigenous gums',
      ],
    },
    {
      stage: 'Stage 2 (Days 3–5)',
      title: 'Geometric Drafting, Mathematical Graphing & Loom Setup',
      focus: 'Bridging mathematics and ancestral pattern memory',
      topics: [
        'Calculation of warp and weft counts on traditional Asu frames',
        'Graphing classical motifs (Kalga peacocks, Telia Rumal chevrons, sacred lotuses)',
        'Mounting warp yarns with tension balancing on traditional pit-looms',
      ],
    },
    {
      stage: 'Stage 3 (Days 6–10)',
      title: 'Hands-on Shuttle Throwing & Interlocking Weft Mastery',
      focus: 'The rhythmic body memory of the master artisan',
      topics: [
        'Operating manual foot pedals and coordinating hand shuttle rhythm',
        'Kadwa discontinuous weft tapestry technique with zero reverse float fringes',
        'Tension control, edge salvage alignment, and temple pin-hole positioning',
      ],
    },
    {
      stage: 'Stage 4 (Days 11–14)',
      title: 'Heirloom Finishing, GI Provenance & Digital Passport Minting',
      focus: 'Preserving and authenticating your living creation',
      topics: [
        'Traditional river washing, sunlight finishing, and screw-pine friction buffing',
        'Verification against the official Government of India GI Tag registry standards',
        'Minting a verifiable Digital Craft Passport with your apprentice attribution',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <img
              src={artisan.avatar_url}
              alt={artisan.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>GURU-SHISHYA MASTER SYLLABUS</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-on-surface mt-1">
                {artisan.craft_name} Apprenticeship
              </h2>
              <p className="text-xs text-on-surface-variant">
                Direct Mentorship with {artisan.name} • {artisan.district}, {artisan.state}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Format</span>
              <span className="font-serif font-bold text-primary">In-Person Studio</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Duration</span>
              <span className="font-serif font-bold text-on-surface">2 to 14 Days</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Certification</span>
              <span className="font-serif font-bold text-secondary">Guild Endorsed</span>
            </div>
          </div>

          {/* Syllabus Modules */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-on-surface flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Comprehensive 4-Stage Hands-On Curriculum</span>
            </h3>

            <div className="space-y-2.5">
              {syllabusModules.map((mod, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary">{mod.stage}</span>
                    <span className="text-[11px] text-on-surface-variant italic">{mod.focus}</span>
                  </div>

                  <h4 className="font-serif font-bold text-xs sm:text-sm text-on-surface">
                    {mod.title}
                  </h4>

                  <ul className="space-y-1 pt-1 text-[11px] text-on-surface-variant">
                    {mod.topics.map((top, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold">✦</span>
                        <span>{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-outline/20 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              Close Syllabus
            </button>

            <button
              onClick={() => {
                onClose();
                onApply(artisan);
              }}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for this Masterclass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  ShieldCheck,
  X,
  Award,
  Sparkles,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Gift,
} from 'lucide-react';

interface EndangeredCraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EndangeredCraftsModal: React.FC<EndangeredCraftsModalProps> = ({ isOpen, onClose }) => {
  const { user, showNotification, t } = useApp();

  const [selectedCraftIndex, setSelectedCraftIndex] = useState(0);
  const [sponsorshipTier, setSponsorshipTier] = useState<'RAW_MATERIALS' | 'APPRENTICE_STIPEND' | 'FULL_LOOM'>('APPRENTICE_STIPEND');
  const [patronName, setPatronName] = useState(user.name || 'Devi Prasad Sharma');
  const [isSponsored, setIsSponsored] = useState(false);
  const [certificateHash, setCertificateHash] = useState('');

  if (!isOpen) return null;

  const endangeredList = [
    {
      name: 'Rogan Castor-Oil Fabric Painting',
      location: 'Nirona Village, Kutch, Gujarat',
      survivingLineages: '1 Single Family in the World (Khatri Abdul Gafur & Sons)',
      giTag: 'GI-2022-GJ-0711',
      urgency: 'CRITICALLY ENDANGERED',
      description: 'Extremely intricate freehand painting using heated castor oil, natural earth pigments, and a 6-inch brass rod. The artist draws motifs in thin air before laying them onto cotton.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Longpi Black Stone Pottery',
      location: 'Longpi Village, Ukhrul, Manipur',
      survivingLineages: 'Less than 15 Master Artisans',
      giTag: 'GI-2015-MN-0504',
      urgency: 'VULNERABLE',
      description: 'Crafted without a potter’s wheel from weathered serpentinite rock and black clay found only along riverbanks in Ukhrul, rubbed with Machi tree leaves for a metallic black shine.',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Toda Geometric Red-Black Embroidery (Poothkullu)',
      location: 'Nilgiri Hills, Tamil Nadu',
      survivingLineages: 'Toda Pastoral Tribal Women',
      giTag: 'GI-2013-TN-0231',
      urgency: 'CRITICALLY ENDANGERED',
      description: 'Darning stitch embroidery counting threads by hand on unbleached coarse cotton, using sacred black and red wool to depict buffalo horn and floral constellations.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const currentCraft = endangeredList[selectedCraftIndex];

  const tiers = [
    { id: 'RAW_MATERIALS', label: 'Sponsor Pure Raw Materials', amount: 1500, desc: 'Supplies organic castor oil, botanical indigo, and beeswax for 1 month.' },
    { id: 'APPRENTICE_STIPEND', label: 'Sponsor a Youth Apprentice', amount: 3500, desc: 'Direct living stipend for 1 rural apprentice learning under the master.' },
    { id: 'FULL_LOOM', label: 'Adopt a Master Loom / Kiln', amount: 7500, desc: 'Full operational support for traditional wooden loom and maintenance.' },
  ];

  const currentTier = tiers.find((t) => t.id === sponsorshipTier) || tiers[1];

  const handleSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    const hash = `0xPATRON_${Math.floor(10000000 + Math.random() * 90000000).toString(16)}_${Date.now().toString(16)}`;
    setCertificateHash(hash);
    setIsSponsored(true);
    showNotification(`Dhanyavad, ${patronName}! You are officially recorded as a Living Heritage Patron.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSponsored ? (
          /* Patron Certificate View */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary mx-auto flex items-center justify-center">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary text-on-primary uppercase tracking-wider">
                OFFICIAL PATRON OF LIVING HERITAGE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mt-2">
                Living Heritage Patron Certificate
              </h2>
              <p className="text-xs text-on-surface-variant">
                Permanent, cryptographically sealed record of cultural preservation
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border-2 border-secondary/40 space-y-3 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                    Patron Name
                  </span>
                  <p className="font-serif text-lg font-bold text-on-surface">{patronName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                    Preservation Grant
                  </span>
                  <p className="font-bold text-primary text-base">₹{currentTier.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t border-outline/10 pt-2">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Supported Lineage & Craft
                </span>
                <p className="font-serif text-sm font-semibold text-primary">
                  {currentCraft.name} ({currentCraft.location})
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{currentTier.desc}</p>
              </div>

              <div className="border-t border-outline/10 pt-2 flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">Verification Hash:</span>
                <span className="font-mono text-primary font-semibold truncate max-w-xs">{certificateHash}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
            >
              Done & Return to Ecosystem
            </button>
          </div>
        ) : (
          /* Sponsorship Form */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-red-700" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> CRITICALLY ENDANGERED CRAFTS INITIATIVE
                </span>
                <h2 className="font-serif text-2xl font-bold text-on-surface">
                  Adopt a Master Loom & Lineage
                </h2>
              </div>
            </div>

            {/* Craft Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {endangeredList.map((craft, idx) => (
                <button
                  key={craft.name}
                  type="button"
                  onClick={() => {
                    setSelectedCraftIndex(idx);
                    setIsSponsored(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedCraftIndex === idx
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-outline/20 bg-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="text-[10px] font-bold text-red-600 uppercase block">
                    {craft.urgency}
                  </span>
                  <h4 className="font-serif font-bold text-xs text-on-surface truncate mt-0.5">
                    {craft.name}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant truncate mt-0.5">
                    {craft.location}
                  </p>
                </button>
              ))}
            </div>

            {/* Selected Craft Card */}
            <div className="relative rounded-2xl overflow-hidden border border-outline/20 bg-surface-container-low">
              <div className="aspect-16/7 w-full overflow-hidden">
                <img
                  src={currentCraft.image}
                  alt={currentCraft.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-serif text-base font-bold text-on-surface">
                    {currentCraft.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-secondary/15 text-secondary border border-secondary/20">
                    {currentCraft.giTag}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {currentCraft.description}
                </p>
                <div className="text-[11px] font-semibold text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                  ⚠️ Surviving Custodians: {currentCraft.survivingLineages}
                </div>
              </div>
            </div>

            {/* Sponsorship Tiers */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface">{t('Choose Micro-Patronage Tier')}</label>
              <div className="space-y-2">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSponsorshipTier(tier.id as any)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      sponsorshipTier === tier.id
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-outline/20 bg-surface hover:bg-surface-container'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif font-bold text-xs text-on-surface">{t(tier.label)}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{t(tier.desc)}</p>
                    </div>
                    <span className="font-bold text-sm text-primary font-mono shrink-0 ml-3">
                      ₹{tier.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSponsor} className="space-y-3 pt-2 border-t border-outline/10">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">{t('Name for Official Patron Certificate')}</label>
                <input
                  type="text"
                  required
                  value={patronName}
                  onChange={(e) => setPatronName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Sponsor & Adopt This Living Lineage (₹{currentTier.amount.toLocaleString('en-IN')})</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

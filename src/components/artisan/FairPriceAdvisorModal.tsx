import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiServices, PriceBreakdown } from '../../services/aiServices';
import {
  DollarSign,
  Sparkles,
  X,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle,
} from 'lucide-react';

export const FairPriceAdvisorModal: React.FC = () => {
  const { isPriceAdvisorOpen, setIsPriceAdvisorOpen, t } = useApp();

  const [rawMaterialCost, setRawMaterialCost] = useState(4500);
  const [laborDays, setLaborDays] = useState(25);
  const [complexity, setComplexity] = useState<'MODERATE' | 'HIGH' | 'MASTER'>('HIGH');

  if (!isPriceAdvisorOpen) return null;

  const breakdown: PriceBreakdown = aiServices.calculateFairPrice(rawMaterialCost, laborDays, complexity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsPriceAdvisorOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                {t('TRANSPARENT VALUE MODEL')}
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                {t('AI Fair Price Advisor')}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {t('Calculate equitable market value ensuring dignity, living wages, and heritage preservation.')}
              </p>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 p-4 rounded-xl bg-surface-container-low border border-outline/20">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-on-surface">{t('Indigenous Raw Material Cost')}</span>
                <span className="font-bold text-primary font-mono">₹{rawMaterialCost.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={rawMaterialCost}
                onChange={(e) => setRawMaterialCost(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-on-surface">{t('Weaving / Handcraft Labor Days')}</span>
                <span className="font-bold text-primary font-mono">{laborDays} {t('Days')}</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                step="1"
                value={laborDays}
                onChange={(e) => setLaborDays(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">{t('Skill Complexity Tier')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'MODERATE', label: t('Skilled Artisan') },
                  { id: 'HIGH', label: t('Senior Master') },
                  { id: 'MASTER', label: t('National Awardee') },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setComplexity(c.id as any)}
                    className={`py-2 px-1 text-xs rounded-lg border font-medium text-center transition cursor-pointer ${
                      complexity === c.id
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline/20 text-on-surface hover:bg-surface'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Value Breakdown Display */}
          <div className="p-5 rounded-2xl bg-surface-container border-2 border-primary/30 space-y-4">
            <div className="flex items-baseline justify-between border-b border-outline/10 pb-3">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                  {t('Recommended Fair Retail Price')}
                </span>
                <h3 className="font-serif text-3xl font-bold text-primary">
                  ₹{breakdown.recommended_price.toLocaleString('en-IN')}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {breakdown.artisan_direct_share_percent}% {t('To Artisan Family')}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('Direct Artisan Labor')} ({laborDays} {t('days')} @ ₹{breakdown.daily_fair_wage}/{t('day living wage')}):</span>
                <span className="font-semibold text-on-surface">₹{breakdown.total_labor_cost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('Pure Natural Materials:')}</span>
                <span className="font-semibold text-on-surface">₹{breakdown.raw_material_cost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('GI Provenance & Intangible Cultural Lineage:')}</span>
                <span className="font-semibold text-on-surface">₹{breakdown.heritage_gi_premium.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Middlemen exploitation comparison */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 text-xs space-y-1">
              <span className="text-[11px] font-bold text-red-600 block">
                {t('Typical Commercial Middleman Exploitation:')}
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Standard retail boutiques mark this item up to <strong>₹{breakdown.market_comparison_traditional_retail.toLocaleString('en-IN')}</strong>, giving the artisan only ~25-35%. On Desi Craft, you receive 100% of fair customer value directly.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPriceAdvisorOpen(false)}
            className="w-full py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            {t('Apply Fair Price to Product')}
          </button>
        </div>
      </div>
    </div>
  );
};

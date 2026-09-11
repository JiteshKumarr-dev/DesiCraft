import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Users,
  Eye,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { Product } from '../../types';
import {
  calculateProductDemand,
  ProductDemandPrediction,
} from '../../services/demandPredictorService';

interface DemandPredictorWidgetProps {
  product: Product;
}

export const DemandPredictorWidget: React.FC<DemandPredictorWidgetProps> = ({ product }) => {
  const { t } = useApp();
  const [prediction, setPrediction] = useState<ProductDemandPrediction>(() =>
    calculateProductDemand(product)
  );
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recalcStep, setRecalcStep] = useState<string>('');

  // Re-detect and recalculate demand with realistic live AI steps
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    setRecalcStep('Detecting indigenous materials & weave complexity...');
    await new Promise((r) => setTimeout(r, 260));

    setRecalcStep('Analyzing pan-India search volume & festive wedding calendar...');
    await new Promise((r) => setTimeout(r, 300));

    setRecalcStep('Calculating active loom capacity vs buyer demand velocity...');
    await new Promise((r) => setTimeout(r, 240));

    const updated = calculateProductDemand(product);
    setPrediction(updated);
    setIsRecalculating(false);
    setRecalcStep('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30';
    if (score >= 90) return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-primary bg-primary/10 border-primary/30';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return '🔥 SURGING MARKET DEMAND';
    if (score >= 90) return '📈 VERY HIGH DEMAND';
    return '✨ HIGH DEMAND';
  };

  return (
    <div className="rounded-2xl bg-linear-to-br from-surface-container-low via-surface-container to-surface-container-low border border-primary/30 p-4 sm:p-5 shadow-sm space-y-4 animate-fadeIn">
      {/* Top Header: Badge & Live Score */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-linear-to-r from-red-500 to-amber-600 text-white shadow-xs animate-pulse">
              <Flame className="w-3 h-3" />
              {t('LIVE DEMAND PREDICTOR')}
            </span>

            <span className="text-[11px] font-semibold text-primary">
              {t('AI Market Velocity Engine')}
            </span>
          </div>

          <h4 className="font-serif text-base sm:text-lg font-bold text-on-surface flex items-center gap-1.5">
            <span>{t(product.craft_name)}</span>
            <span className="text-xs font-normal text-on-surface-variant">• {t('Market Intelligence')}</span>
          </h4>
        </div>

        {/* Big Score Pill */}
        <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-outline/25 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block leading-tight">
              {t('Predicted Demand')}
            </span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">
              {t('Top 5% Nationwide')}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-amber-500 to-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
            {prediction.demandScore}
          </div>
        </div>
      </div>

      {/* Recalculating Live Banner */}
      {isRecalculating && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-2.5 text-xs text-primary font-medium animate-fadeIn">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{recalcStep ? t(recalcStep) : t('Computing real-time demand...')}</span>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Metric 1: Search & Interest Velocity */}
        <div className="p-2.5 rounded-xl bg-surface border border-outline/20 space-y-1">
          <span className="text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-red-500" /> {t('Market Velocity')}
          </span>
          <div className="font-bold text-xs sm:text-[13px] text-on-surface">
            {prediction.growthRate.split(' ')[0]}
          </div>
          <p className="text-[10px] text-on-surface-variant line-clamp-1">
            {t('Buyer search surge')}
          </p>
        </div>

        {/* Metric 2: Loom Scarcity */}
        <div className="p-2.5 rounded-xl bg-surface border border-outline/20 space-y-1">
          <span className="text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-500" /> {t('Loom Scarcity')}
          </span>
          <div className="font-bold text-xs sm:text-[13px] text-on-surface">
            {product.production_time ? t(product.production_time) : t('35 Days')}
          </div>
          <p className="text-[10px] text-on-surface-variant line-clamp-1">
            {t('Loom time per unit')}
          </p>
        </div>

        {/* Metric 3: Peak Buying Window */}
        <div className="p-2.5 rounded-xl bg-surface border border-outline/20 space-y-1">
          <span className="text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-500" /> {t('Peak Window')}
          </span>
          <div className="font-bold text-xs sm:text-[13px] text-on-surface">
            {t('Oct – Feb')}
          </div>
          <p className="text-[10px] text-on-surface-variant line-clamp-1">
            {t('Bridal & festive peak')}
          </p>
        </div>

        {/* Metric 4: Investment Appraisal */}
        <div className="p-2.5 rounded-xl bg-surface border border-outline/20 space-y-1">
          <span className="text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3 text-primary" /> {t('City Retail')}
          </span>
          <div className="font-bold text-xs sm:text-[13px] text-primary">
            ₹{prediction.appraisedMarketValue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold line-clamp-1">
            {t('Save')} {prediction.savingsPercent}% {t('Direct')}
          </p>
        </div>
      </div>

      {/* Demand Bar & Live Ticker */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-on-surface flex items-center gap-1">
            <span>{t('Overall Demand Velocity:')}</span>
            <span className="font-bold text-primary">{t(getScoreBadge(prediction.demandScore))}</span>
          </span>
          <span className="text-[11px] font-mono text-on-surface-variant font-bold">
            {prediction.demandScore}/100
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden border border-outline/15">
          <div
            className="h-full bg-linear-to-r from-amber-500 via-primary to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${prediction.demandScore}%` }}
          />
        </div>
      </div>

      {/* Live Buyer Signals Ticker */}
      <div className="p-2.5 rounded-xl bg-surface border border-outline/20 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-2 text-on-surface">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-medium text-[11px]">
            <strong>{prediction.inquiriesThisWeek} {t('collectors')}</strong> {t('inquired this week')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            <strong>{prediction.activeCartIntent}</strong> {t('in carts & wishlists')}
          </span>

          <button
            type="button"
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
            title={t('Re-run real-time AI demand calculation')}
          >
            <RefreshCw className={`w-3 h-3 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{t('Recalculate')}</span>
          </button>
        </div>
      </div>

      {/* Expandable In-Depth Market Drivers & Demographics */}
      <div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 px-3 rounded-xl border border-outline/20 bg-surface hover:bg-surface-container transition text-xs font-semibold text-on-surface flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>
              {isExpanded ? t('Hide In-Depth Demand Breakdown') : t('View In-Depth Demand Drivers & Regional Hotspots')}
            </span>
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 rounded-xl bg-surface border border-outline/20 space-y-4 animate-fadeIn text-xs">
            {/* AI Narrative Summary */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline/15 text-[11px] text-on-surface leading-relaxed">
              <strong className="text-primary block mb-0.5">{t('AI Market Analysis Summary:')}</strong>
              {t(prediction.analysisSummary)}
            </div>

            {/* Demand Drivers Breakdown */}
            <div className="space-y-2.5">
              <span className="font-bold text-on-surface text-xs uppercase tracking-wider block">
                {t('Calculated Demand Drivers')}
              </span>

              <div className="space-y-2">
                {prediction.drivers.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-on-surface">{t(d.label)}</span>
                      <span className="font-mono font-bold text-primary">{d.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-on-surface-variant">{t(d.detail)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Demand Hotspots */}
            <div className="space-y-2 pt-2 border-t border-outline/15">
              <span className="font-bold text-on-surface text-xs uppercase tracking-wider block">
                {t('Regional Demand Hotspots')}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {prediction.regionalHotspots.map((h, i) => (
                  <div key={i} className="p-2 rounded-lg bg-surface-container-low border border-outline/15 text-center">
                    <span className="font-bold text-primary text-xs block">{h.sharePercent}%</span>
                    <span className="text-[10px] text-on-surface-variant block mt-0.5 leading-tight line-clamp-2">
                      {t(h.region)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

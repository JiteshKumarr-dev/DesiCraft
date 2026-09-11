import React from 'react';
import { useApp } from '../../context/AppContext';
import { aiServices, DemandInsight } from '../../services/aiServices';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Flame,
  Calendar,
  Layers,
  Lightbulb,
} from 'lucide-react';

export const DemandPulse: React.FC = () => {
  const { t } = useApp();
  const insights: DemandInsight[] = aiServices.getDemandInsights();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline/20">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <TrendingUp className="w-4 h-4" />
            <span>{t('MARKET PULSE INTELLIGENCE')}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            {t('What Should I Make Next?')}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {t('Real-time search trends, upcoming festival cycles, and domestic/export buyer requests translated into actionable production guidance for your loom or workshop.')}
          </p>
        </div>
      </div>

      {/* Demand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-surface border border-outline/20 hover:border-primary/40 transition shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                  {t(item.category)}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    item.trend === 'SURGING'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  {t(item.trend)} ({item.growth_rate})
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-on-surface leading-snug">
                {t(item.insight_title)}
              </h3>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 text-xs space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-on-surface">
                  <Lightbulb className="w-3.5 h-3.5 text-secondary" />
                  <span>{t('Actionable Studio Recommendation:')}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  {t(item.recommendation)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-outline/10 flex items-center justify-between text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> {t(item.peak_season)}
              </span>
              <span className="font-semibold text-primary">{t('High Conversion Potential')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

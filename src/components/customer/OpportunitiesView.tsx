import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Calendar,
  ExternalLink,
  Award,
  ShieldCheck,
  CheckCircle,
  Building2,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, t } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = opportunities.filter((opp) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'GOV') return opp.type === 'GOVERNMENT_PROGRAM';
    if (filterType === 'FAIR') return opp.type === 'FAIR' || opp.type === 'FESTIVAL' || opp.type === 'EXHIBITION';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline/20">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Compass className="w-4 h-4" />
            <span>{t('OPPORTUNITY RADAR')}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            {t('Cultural Festivals, Exhibitions & Government Schemes')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {t('Discover national crafts melas, export delegations, and direct Central & State Government financial assistance initiatives (PM Vishwakarma, ODOP, AHVY).')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'ALL', label: 'All Opportunities' },
          { id: 'GOV', label: 'Government Schemes & Grants' },
          { id: 'FAIR', label: 'Fairs & Cultural Melas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              filterType === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
            }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((opp) => {
          const isGov = opp.type === 'GOVERNMENT_PROGRAM';

          return (
            <div
              key={opp.id}
              className={`p-6 rounded-2xl bg-surface border transition flex flex-col justify-between space-y-4 shadow-xs ${
                isGov ? 'border-secondary/40 hover:border-secondary' : 'border-outline/20 hover:border-primary/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isGov
                        ? 'bg-secondary/15 text-secondary border border-secondary/30'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {isGov ? 'Government Program' : 'Cultural Mela / Fair'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {opp.date}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-on-surface leading-snug">
                  {opp.name}
                </h3>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {opp.description}
                </p>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>
                      <strong>Location:</strong> {opp.location_district}, {opp.location_state}
                    </span>
                  </div>
                  {opp.eligibility && (
                    <p className="text-[11px] text-on-surface-variant leading-tight">
                      <strong>Eligibility:</strong> {opp.eligibility}
                    </p>
                  )}
                  {opp.benefits && (
                    <p className="text-[11px] text-secondary font-medium leading-tight pt-1">
                      <strong>Benefits:</strong> {opp.benefits}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-outline/10 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {opp.craft_category}
                </span>

                <a
                  href={opp.official_url || opp.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition text-xs font-bold"
                >
                  <span>{t('Official Details')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

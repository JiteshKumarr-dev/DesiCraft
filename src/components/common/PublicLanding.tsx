import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Palette,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const PublicLanding: React.FC = () => {
  const { enterMode, t } = useApp();

  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-primary p-8 sm:p-12 md:p-16 text-white shadow-xl border border-amber-600/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-black/40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wide text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('Welcome to DesiCraft — India\'s Living Heritage Platform')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            {t('Preserving 5,000 Years of Indian Craft Heritage')}
          </h1>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed font-light">
            {t('Bridging ancestral Indian GI artisan clusters with conscious global patrons through verifiable digital craft passports and living heritage AI.')}
          </p>

          <div className="pt-2 text-xs text-amber-200/90 font-medium">
            {t('Choose your mode to begin:')}
          </div>
        </div>
      </div>

      {/* Mode Entry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buyer Marketplace Card */}
        <div className="group rounded-3xl bg-surface border border-outline/20 hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-8 relative">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7 text-primary" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {t('Patron & Collector Portal')}
              </span>
              <h2 className="text-2xl font-serif font-bold text-on-surface mt-1">
                {t('Buyer Marketplace')}
              </h2>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t('Sign in to explore products, discover artisans, and purchase traditional crafts.')}
            </p>

            <ul className="space-y-2 pt-2 text-xs text-on-surface-variant">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('Authentic GI Handlooms & Crafts')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('Verifiable Blockchain Digital Craft Passports')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('Direct Artisan Master Workshops & Apprenticeships')}</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => enterMode('CUSTOMER')}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>{t('Enter Buyer Marketplace')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Artisan Studio Card */}
        <div className="group rounded-3xl bg-surface border border-outline/20 hover:border-amber-500/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-8 relative">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Palette className="w-7 h-7 text-secondary" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                {t('Artisan & Guild Workspace')}
              </span>
              <h2 className="text-2xl font-serif font-bold text-on-surface mt-1">
                {t('Artisan Studio')}
              </h2>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t('Sign in to manage your products, use AI tools, discover opportunities, and collaborate with artisans.')}
            </p>

            <ul className="space-y-2 pt-2 text-xs text-on-surface-variant">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t('Multilingual Voice Product Creator (10 Languages)')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t('Algorithmic GI Fair Price & Raw Material Advisor')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t('Inter-Craft Synergy & Artisan Collaboration Hub')}</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => enterMode('ARTISAN')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-primary hover:from-amber-700 hover:to-primary/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>{t('Enter Artisan Studio')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Heritage Footprint Bar */}
      <div className="rounded-2xl bg-surface-container border border-outline/15 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-primary">100%</span>
          <p className="text-xs text-on-surface-variant font-medium">{t('Authentic GI Verified')}</p>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-secondary">28+</span>
          <p className="text-xs text-on-surface-variant font-medium">{t('Heritage Craft Guilds')}</p>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-amber-600">10</span>
          <p className="text-xs text-on-surface-variant font-medium">{t('Indian Languages')}</p>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-emerald-600">0%</span>
          <p className="text-xs text-on-surface-variant font-medium">{t('Middleman Exploitation')}</p>
        </div>
      </div>
    </div>
  );
};

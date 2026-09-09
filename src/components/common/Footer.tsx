import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Heart, Compass, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, activeMode, toggleMode } = useApp();

  return (
    <footer className="bg-surface-container-high border-t border-outline/20 text-on-surface pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-on-surface">
                Desi<span className="text-primary italic ml-1">Craft</span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t("India’s first living heritage digital ecosystem connecting traditional master artisans directly with conscious patrons, learners, and national cultural opportunities.")}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('100% Verifiable GI Tag Integrity')}</span>
            </div>
          </div>

          {/* Regional Living Heritage */}
          <div>
            <h4 className="font-serif text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
              {t('Living Heritage Clusters')}
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>{t('North: Varanasi Silk & Kashmir Pashmina')}</li>
              <li>{t('South: Pochampally Ikat & Channapatna Wood')}</li>
              <li>{t('East: Madhubani Canvas & Bankura Terracotta')}</li>
              <li>{t('West: Kutch Ajrakh & Warli Indigenous Art')}</li>
              <li>{t('Central: Bastar Dhokra Lost-Wax Bell Metal')}</li>
              <li>{t('Northeast: Assam Fine Cane & Bamboo Guilds')}</li>
            </ul>
          </div>

          {/* Government & Institutional Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
              {t('Govt & Institutional Support')}
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <a
                  href="https://pmvishwakarma.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition"
                >
                  <span>{t('PM Vishwakarma Portal')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.investindia.gov.in/one-district-one-product"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition"
                >
                  <span>{t('One District One Product (ODOP)')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="http://handicrafts.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition"
                >
                  <span>{t('Development Commissioner (Handicrafts)')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://ipindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition"
                >
                  <span>{t('Geographical Indications Registry India')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Dual Mode Switch & Living Archive */}
          <div>
            <h4 className="font-serif text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
              {t('Ecosystem Features')}
            </h4>
            <div className="space-y-3 text-xs text-on-surface-variant">
              <p>
                {t('Switch between purchasing living art and creating listings via voice in your mother tongue:')}
              </p>
              <button
                onClick={toggleMode}
                className="w-full py-2 px-3 rounded-lg bg-surface border border-outline/30 text-primary font-semibold hover:bg-primary/10 transition text-left flex items-center justify-between cursor-pointer"
              >
                <span>{activeMode === 'CUSTOMER' ? t('Go to Artisan Studio') : t('Go to Buyer Marketplace')}</span>
                <Compass className="w-4 h-4" />
              </button>
              <div className="pt-2 flex items-center gap-1 text-[11px] text-on-surface-variant/80">
                <Award className="w-3.5 h-3.5 text-secondary" />
                <span>{t('Zero Commission on Artisan Direct Transactions')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-outline/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>{t('© 2026 Desi Craft • National Heritage Technology Initiative. Preserving 5,000 years of unbroken craft memory.')}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-primary">
              {t('Crafted with')} <Heart className="w-3.5 h-3.5 fill-primary" /> {t('for Indian Artisans')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

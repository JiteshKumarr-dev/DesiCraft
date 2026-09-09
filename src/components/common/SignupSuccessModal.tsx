import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Palette,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';

export const SignupSuccessModal: React.FC = () => {
  const {
    user,
    isSignupSuccessModalOpen,
    setIsSignupSuccessModalOpen,
    setMode,
    setIsVoiceArtisanSetupOpen,
    showNotification,
  } = useApp();

  if (!isSignupSuccessModalOpen) return null;

  const handleChooseCustomer = () => {
    setMode('CUSTOMER');
    setIsSignupSuccessModalOpen(false);
    showNotification(`Welcome to Desi Craft Marketplace, ${user.name}!`);
  };

  const handleChooseArtisan = () => {
    setMode('ARTISAN');
    setIsSignupSuccessModalOpen(false);
    setIsVoiceArtisanSetupOpen(true);
    showNotification('Entering Artisan Studio. Let us set up your craft profile with voice!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-outline/30 p-6 sm:p-8 text-center space-y-6 overflow-hidden">
        {/* Top Celebration Emblem */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-linear-to-tr from-primary to-secondary text-on-primary flex items-center justify-center shadow-lg animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-900/15 text-green-700 border border-green-700/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>UNIVERSAL ACCOUNT READY</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            Welcome to Desi Craft, <br />
            <span className="text-primary">{user.name}</span>!
          </h2>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Your single universal account has been created. You can buy authentic crafts, book guru-shishya apprenticeships, or manage your loom studio.
          </p>
        </div>

        {/* Not Permanent Notice */}
        <div className="p-3.5 rounded-2xl bg-surface-container border border-primary/20 flex items-center gap-2.5 text-left">
          <ArrowLeftRight className="w-5 h-5 text-primary shrink-0 animate-pulse" />
          <p className="text-[11px] text-on-surface leading-tight">
            <strong>One Account. Two Modes.</strong> This is <em>not a permanent role choice</em>. You can freely switch between Customer & Artisan modes anytime in 1 click from the header.
          </p>
        </div>

        {/* Two Choices */}
        <div className="space-y-3 pt-1">
          <span className="text-xs font-serif font-bold text-on-surface uppercase tracking-wider block">
            How would you like to explore today?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
            {/* 1. Explore as Customer */}
            <button
              type="button"
              onClick={handleChooseCustomer}
              className="p-5 rounded-2xl border-2 border-primary/30 bg-surface-container-low hover:border-primary hover:bg-primary/5 transition duration-200 cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-on-surface">
                  🛍️ Explore as Customer
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  Discover certified GI crafts, listen to oral weaver stories, and gift handcrafted heirlooms.
                </p>
              </div>

              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span>Enter Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </button>

            {/* 2. Start Artisan Mode */}
            <button
              type="button"
              onClick={handleChooseArtisan}
              className="p-5 rounded-2xl border-2 border-secondary/40 bg-surface-container-low hover:border-secondary hover:bg-secondary/5 transition duration-200 cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition">
                <Palette className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-on-surface">
                  🧑‍🎨 Start Artisan Mode
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  Set up your studio via voice, calculate fair prices, and mint digital craft passports.
                </p>
              </div>

              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                <span>Set Up Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[10px] text-on-surface-variant">
            🇮🇳 Government of India GI Registry & Ministry of Textiles Certified Ecosystem
          </p>
        </div>
      </div>
    </div>
  );
};

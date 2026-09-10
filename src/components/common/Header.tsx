import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import {
  Sparkles,
  Search,
  ShoppingBag,
  Heart,
  Globe,
  Camera,
  Gift,
  ArrowLeftRight,
  User as UserIcon,
  Menu,
  X,
  Palette,
  Mic,
  QrCode,
  MapPin,
  HelpCircle,
  Film,
} from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenWishlist?: () => void;
  onOpenQrScanner?: () => void;
  onOpenEndangeredModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenWishlist,
  onOpenQrScanner,
  onOpenEndangeredModal,
}) => {
  const {
    activeMode,
    toggleMode,
    language,
    setLanguage,
    t,
    cartCount,
    setIsCartOpen,
    wishlist,
    searchTerm,
    setSearchTerm,
    setIsGiftModeModalOpen,
    setIsVisualSearchOpen,
    setIsVoiceCreatorOpen,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthMode,
    setIsLanguagePopupOpen,
    setIsHelpMenuOpen,
    setIsDemoVideoOpen,
    guidedHelpEnabled,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languagesList: { code: LanguageCode; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline/20 shadow-xs transition-colors">
      {/* Top Heritage Notice Bar */}
      <div className="bg-primary text-on-primary text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>{t.livingHeritageNotice}</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="opacity-90">{t('100% GI Tagged & Direct-From-Artisan Lineage')}</span>
            <div className="h-3 w-px bg-on-primary/30" />
            <button
              onClick={onOpenEndangeredModal}
              className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-secondary text-secondary" />
              <span>{t('Adopt a Loom')}</span>
            </button>
            <div className="h-3 w-px bg-on-primary/30" />
            <button
              onClick={onOpenQrScanner}
              className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t('Verify Physical QR')}</span>
            </button>
            <div className="h-3 w-px bg-on-primary/30" />
            <button
              onClick={() => setIsGiftModeModalOpen(true)}
              className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{t('Handmade Gift Mode')}</span>
            </button>
            <div className="h-3 w-px bg-on-primary/30" />
            <button
              onClick={() => setIsDemoVideoOpen(true)}
              className="flex items-center gap-1 text-amber-200 hover:text-white font-bold transition-colors cursor-pointer animate-pulse"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{t('🎬 3-Min Demo Video')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3" data-guide="brand-logo">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-xs">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-on-surface">
                  Desi<span className="text-primary font-normal italic ml-1">Craft</span>
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                    activeMode === 'ARTISAN'
                      ? 'bg-secondary/15 text-secondary border-secondary/30'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}
                >
                  {activeMode === 'ARTISAN' ? t('Studio Mode') : t('Marketplace')}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant line-clamp-1">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4" data-guide="craft-search">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-20 py-2 text-xs md:text-sm bg-surface-container-low border border-outline/30 rounded-full text-on-surface placeholder:text-on-surface-variant/70 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  title="Visual Pattern Search"
                  onClick={() => setIsVisualSearchOpen(true)}
                  className="p-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
                {activeMode === 'ARTISAN' && (
                  <button
                    type="button"
                    title="Voice Product Creator"
                    onClick={() => setIsVoiceCreatorOpen(true)}
                    className="p-1 rounded-full text-primary bg-primary/10 hover:bg-primary/20 transition cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Icons & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ONE ACCOUNT → TWO MODES TOGGLE BUTTON */}
            <button
              onClick={toggleMode}
              data-guide="artisan-switch"
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition cursor-pointer border ${
                activeMode === 'CUSTOMER'
                  ? 'bg-surface-container-highest text-primary border-primary/30 hover:bg-primary/10'
                  : 'bg-primary text-on-primary border-primary hover:bg-primary/90'
              }`}
              title="One Account: Switch seamlessly between Customer and Artisan Mode"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">
                {activeMode === 'CUSTOMER' ? t.switchModeToArtisan : t.switchModeToCustomer}
              </span>
              <span className="sm:hidden">
                {activeMode === 'CUSTOMER' ? t('Studio Mode') : t('Marketplace')}
              </span>
            </button>

            {/* Language Dropdown Selector (10 Indian Languages) */}
            <div className="relative" data-guide="language-select">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline/30 bg-surface-container-low text-xs font-medium text-on-surface hover:bg-surface-container transition cursor-pointer"
                aria-label={t.languageSelect}
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold">{languagesList.find((l) => l.code === language)?.native || 'English'}</span>
              </button>

              {isLangDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-outline/20 py-2 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline/10">
                      {t.languageSelect}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {languagesList.map((item) => (
                        <button
                          key={item.code}
                          onClick={() => {
                            setLanguage(item.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-primary/10 transition cursor-pointer ${
                            language === item.code ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'
                          }`}
                        >
                          <span>{item.name}</span>
                          <span className="text-on-surface-variant text-[11px] font-serif">{item.native}</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-outline/15 bg-surface-container-low">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLangDropdownOpen(false);
                          setIsLanguagePopupOpen(true);
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-primary/10 text-primary text-[11px] font-bold text-center hover:bg-primary/20 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{t('All 10 Languages (Audio & Search)')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* PERSISTENT GUIDED HELP / ASSISTANCE BUTTON */}
            <button
              onClick={() => setIsHelpMenuOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition shadow-2xs cursor-pointer group"
              title="Guided Help & Voice Assistance"
              aria-label="Guided Help"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">{t('Guided Help')}</span>
            </button>

            {/* CINEMATIC SIH DEMO VIDEO BUTTON */}
            <button
              onClick={() => setIsDemoVideoOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition shadow-2xs cursor-pointer group animate-pulse"
              title="Watch Official 3-Minute SIH Demo Video & Walkthrough"
              aria-label="SIH Demo Video"
            >
              <Film className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-bold">{t('🎬 Demo Video')}</span>
              <span className="sm:hidden">{t('Demo')}</span>
            </button>

            {/* Wishlist & Cart Icons (Customer Mode) */}
            {activeMode === 'CUSTOMER' && (
              <>
                <button
                  onClick={onOpenWishlist}
                  className="relative p-2 rounded-full text-on-surface hover:bg-surface-container-high transition cursor-pointer"
                  title="Saved Heirlooms Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 text-on-surface" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-full text-on-surface hover:bg-surface-container-high transition cursor-pointer"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5 text-on-surface" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Sign In / Join Button or Profile Avatar */}
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setAuthMode('SIGNUP');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('Join / Sign In')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenProfile}
                  className="p-2 rounded-full text-on-surface hover:bg-surface-container-high transition cursor-pointer"
                  title={t.account}
                >
                  <UserIcon className="w-5 h-5 text-on-surface" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-high transition"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-3 pt-2 border-t border-outline/10">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-full text-on-surface placeholder:text-on-surface-variant/70 focus:outline-hidden focus:ring-2 focus:ring-primary/40"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="p-1 text-on-surface-variant hover:text-primary"
              >
                <Camera className="w-4 h-4" />
              </button>
              {activeMode === 'ARTISAN' && (
                <button
                  type="button"
                  onClick={() => setIsVoiceCreatorOpen(true)}
                  className="p-1 text-primary"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

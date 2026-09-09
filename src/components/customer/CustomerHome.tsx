import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Region, Craft, Product } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  ShoppingBag,
  ChevronRight,
  Gift,
  Search,
} from 'lucide-react';
import { LearningView } from './LearningView';
import { OpportunitiesView } from './OpportunitiesView';
import { StateCraftExplorer } from './StateCraftExplorer';

export const CustomerHome: React.FC = () => {
  const {
    crafts,
    products,
    artisans,
    activeRegionFilter,
    setActiveRegionFilter,
    setSelectedCraft,
    setSelectedProduct,
    setSelectedPassport,
    passports,
    addToCart,
    wishlist,
    toggleWishlist,
    searchTerm,
    setIsGiftModeModalOpen,
    openChatWith,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'LEARNING' | 'OPPORTUNITIES' | 'STATES'>('MARKETPLACE');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Oral Story Audio Player with Web Speech Synthesis
  const [playingArtisanId, setPlayingArtisanId] = useState<string | null>(artisans[0]?.id || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleSpeechAudio = (storyText: string) => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(storyText);
        utterance.rate = 0.9; // Calm storytelling pace
        utterance.pitch = 1.0;
        // Try to match Indian English or Hindi if available
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('hi') || v.name.includes('India'));
        if (indianVoice) utterance.voice = indianVoice;

        utterance.onend = () => {
          setIsPlayingAudio(false);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback simulation timer
        setTimeout(() => {
          setIsPlayingAudio(false);
        }, 12000);
      }
    }
  };

  // Region tabs
  const regions: (Region | 'All')[] = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];

  // Categories
  const categories = ['ALL', 'Textiles', 'Pottery', 'Metalcraft', 'Folk Painting', 'Woodcraft'];

  // Filter crafts by region
  const filteredCrafts = crafts.filter((c) => {
    if (activeRegionFilter === 'All') return true;
    return c.region === activeRegionFilter;
  });

  // Filter products by region, category, search
  const filteredProducts = products.filter((p) => {
    const matchesRegion = activeRegionFilter === 'All' || p.region === activeRegionFilter;
    const matchesCategory =
      selectedCategory === 'ALL' ||
      crafts.find((c) => c.id === p.craft_id)?.heritage_category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.craft_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.artisan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technique.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesCategory && matchesSearch;
  });

  const currentPlayingArtisan = artisans.find((a) => a.id === playingArtisanId) || artisans[0];

  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* 1. HERO SHOWCASE */}
      <section className="relative rounded-3xl overflow-hidden bg-surface-container-high border border-outline/20 p-8 sm:p-12 lg:p-16">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/20 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>{t('AUTHENTIC INDIAN LIVING HERITAGE ECOSYSTEM')}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.15]">
            {language === 'en' ? (
              <>
                Preserving Bharat’s <br />
                <span className="text-primary italic">Handcrafted Soul</span> & Living Traditions.
              </>
            ) : (
              t('Preserving Bharat’s Handcrafted Soul & Living Traditions.')
            )}
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl font-normal">
            {t('Directly connect with 5th-generation master weavers, lost-wax metallurgists, and folk painters across India. Every masterpiece comes with an official GI Tag and a cryptographic Digital Craft Passport.')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('marketplace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{t('Explore Living Marketplace')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsGiftModeModalOpen(true)}
              className="px-5 py-3.5 rounded-full bg-surface border border-outline/30 text-on-surface text-xs sm:text-sm font-bold hover:bg-surface-container transition flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-secondary" />
              <span>{t('Handmade Gift Mode')}</span>
            </button>
          </div>

          {/* Living Heritage Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-outline/20">
            <div>
              <span className="font-serif text-2xl font-bold text-on-surface">12+</span>
              <p className="text-[11px] text-on-surface-variant">{t('GI Heritage Crafts')}</p>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-primary">10</span>
              <p className="text-[11px] text-on-surface-variant">{t('Indian Languages')}</p>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-on-surface">100%</span>
              <p className="text-[11px] text-on-surface-variant">{t('Direct Artisan Wages')}</p>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-secondary">0%</span>
              <p className="text-[11px] text-on-surface-variant">{t('Middleman Exploitation')}</p>
            </div>
          </div>
        </div>

        {/* Decorative subtle background overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-surface-container-high via-surface-container-high/50 to-transparent z-10 hidden lg:block" />
          <img
            src="/images/hero-saree.png"
            alt="Authentic Handcrafted Indian Heritage Silk"
            className="w-full h-full object-cover object-top opacity-25 lg:opacity-80"
          />
        </div>
      </section>

      {/* 2. NAVIGATION SUB-TABS */}
      <div className="flex items-center justify-between border-b border-outline/20 pb-4">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'MARKETPLACE'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t('Marketplace & Crafts')}
          </button>

          <button
            onClick={() => setActiveTab('LEARNING')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'LEARNING'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.learningHub}
          </button>

          <button
            onClick={() => setActiveTab('OPPORTUNITIES')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'OPPORTUNITIES'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.opportunities}
          </button>

          <button
            onClick={() => setActiveTab('STATES')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'STATES'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t('State GI Directory')}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-primary font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('Verifiable Geographical Indications')}</span>
        </div>
      </div>

      {activeTab === 'LEARNING' ? (
        <LearningView />
      ) : activeTab === 'OPPORTUNITIES' ? (
        <OpportunitiesView />
      ) : activeTab === 'STATES' ? (
        <StateCraftExplorer />
      ) : (
        <>
          {/* 3. GEOGRAPHIC REGIONAL CRAFT EXPLORER */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  {t('CULTURAL GEOGRAPHY OF BHARAT')}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  {t('Explore by Geographic Region')}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {t('From Himalayan Pashmina to Deccan Ikat and Kutch Block Prints')}
                </p>
              </div>

              {/* Region Selector Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setActiveRegionFilter(reg)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeRegionFilter === reg
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {reg === 'All' ? t.allRegions : t(reg)}
                  </button>
                ))}
              </div>
            </div>

            {/* Crafts Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCrafts.slice(0, 4).map((craft) => (
                <div
                  key={craft.id}
                  onClick={() => setSelectedCraft(craft)}
                  className="group relative rounded-2xl overflow-hidden bg-surface border border-outline/20 hover:border-primary/50 transition duration-300 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={craft.image_url}
                      alt={craft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-xs text-primary font-bold text-[10px] px-2 py-0.5 rounded-md">
                      {t(craft.region + ' India')}
                    </span>
                    <span className="absolute bottom-3 left-3 text-white text-xs font-mono font-medium">
                      {craft.gi_tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-on-surface group-hover:text-primary transition">
                      {craft.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {craft.description}
                    </p>
                    <div className="pt-2 border-t border-outline/10 flex items-center justify-between text-xs font-bold text-primary">
                      <span>{t('Explore Cultural Lineage')}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. ORAL ARTISAN STORIES AUDIO & READING PLAYER */}
          <section className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
                  <Volume2 className="w-4 h-4" />
                  <span>{t('ORAL LIVING MEMORY')}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-on-surface mt-1">
                  {t('Listen to Master Artisans in Their Mother Tongue')}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {t('Hear the sound of the loom and stories passed down through four generations.')}
                </p>
              </div>

              {/* Artisan Selector Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {artisans.slice(0, 4).map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      setPlayingArtisanId(art.id);
                      toggleSpeechAudio(art.craft_story);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                      playingArtisanId === art.id
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline/20 text-on-surface hover:bg-surface'
                    }`}
                  >
                    <img
                      src={art.avatar_url}
                      alt={art.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{art.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Player Card */}
            <div className="p-6 rounded-2xl bg-surface border border-outline/20 flex flex-col md:flex-row items-center gap-6 shadow-xs">
              <div className="relative shrink-0">
                <img
                  src={currentPlayingArtisan.avatar_url}
                  alt={currentPlayingArtisan.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/30"
                />
                <button
                  onClick={() => toggleSpeechAudio(currentPlayingArtisan.craft_story)}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary/90 transition cursor-pointer"
                  title={isPlayingAudio ? 'Pause oral story' : 'Listen to oral story'}
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h3 className="font-serif font-bold text-lg text-on-surface">
                    {currentPlayingArtisan.name}
                  </h3>
                  <span className="text-xs text-primary font-semibold px-2 py-0.5 rounded-md bg-primary/10">
                    {currentPlayingArtisan.craft_name} ({currentPlayingArtisan.district})
                  </span>
                </div>

                <p className="text-xs italic text-on-surface leading-relaxed font-serif">
                  "{currentPlayingArtisan.craft_story}"
                </p>

                {/* Simulated Audio Waveform */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1 flex-1 h-6">
                    {[12, 24, 16, 32, 20, 28, 14, 30, 22, 18, 34, 15, 26, 20, 31, 19, 25, 16].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: isPlayingAudio ? `${h}px` : '6px' }}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'bg-primary' : 'bg-outline/40'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-on-surface-variant">
                    {isPlayingAudio ? '01:42 / 03:15' : '00:00 / 03:15'}
                  </span>

                  <button
                    onClick={() =>
                      openChatWith({
                        id: currentPlayingArtisan.id,
                        name: currentPlayingArtisan.name,
                        avatar: currentPlayingArtisan.avatar_url,
                      })
                    }
                    className="px-3 py-1 rounded-full border border-primary text-primary text-xs font-semibold hover:bg-primary/10 transition cursor-pointer"
                  >
                    {t('Chat with Artisan')}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FEATURED MASTERPIECES CATALOG */}
          <section id="marketplace-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  {t('DIRECT FROM TRADITIONAL LOOMS')}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  {t('Certified Masterpieces')}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {filteredProducts.length} {t('authentic handcrafted treasures with Digital Craft Passports')}
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {t(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isWish = wishlist.includes(product.id);
                const passport = passports.find((p) => p.id === product.passport_id) || passports[0];

                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl overflow-hidden bg-surface border border-outline/20 hover:border-primary/40 transition duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
                  >
                    {/* Image & Badges */}
                    <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        onClick={() => setSelectedProduct(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                      />

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-xs text-on-surface hover:text-red-500 transition cursor-pointer shadow-xs"
                      >
                        <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* GI Tag chip */}
                      <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-secondary" />
                        <span>{product.gi_tag}</span>
                      </span>
                    </div>

                    {/* Product Metadata */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                          {product.craft_name}
                        </span>

                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-serif font-bold text-sm text-on-surface line-clamp-1 hover:text-primary transition cursor-pointer"
                        >
                          {product.name}
                        </h3>

                        <p className="text-[11px] text-on-surface-variant">
                          By {product.artisan_name}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-outline/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-on-surface-variant block">{t('Direct Fair Value')}</span>
                            <span className="font-serif font-bold text-base text-on-surface">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedPassport(passport)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition cursor-pointer"
                          >
                            {t('GI Passport')}
                          </button>
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-full py-2 px-3 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

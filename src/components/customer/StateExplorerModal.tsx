import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Users,
  Award,
  ChevronRight,
  ChevronLeft,
  Heart,
  Star,
  BookOpen,
  Calendar,
  Sparkles,
  Compass,
  GraduationCap,
  Landmark,
  MessageCircle,
  Volume2,
} from 'lucide-react';
import {
  StateHeritageData,
  MapCraftItem,
  MapArtisanItem,
  getStateHeritage,
} from '../../data/heritageMapData';

interface StateExplorerModalProps {
  stateData: StateHeritageData | null;
  onClose: () => void;
  onSelectCraftForLineage?: (craftName: string) => void;
  onOpenArtisanProfile?: (artisan: MapArtisanItem) => void;
}

export const StateExplorerModal: React.FC<StateExplorerModalProps> = ({
  stateData,
  onClose,
  onSelectCraftForLineage,
  onOpenArtisanProfile,
}) => {
  const { crafts, setSelectedCraft, openChatWith, t, language } = useApp();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'CRAFTS' | 'EXPLORE' | 'ARTISANS' | 'STORIES' | 'EVENTS'>('CRAFTS');

  // Selected craft inside the modal
  const [selectedCraftIndex, setSelectedCraftIndex] = useState<number>(0);

  // Favorite artisans tracking
  const [favoritedArtisanIds, setFavoritedArtisanIds] = useState<Record<string, boolean>>({});

  // Expanded explore section (Tourist Places, Workshops, Events)
  const [expandedSection, setExpandedSection] = useState<'PLACES' | 'WORKSHOPS' | 'EVENTS' | null>(null);

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reset selected craft when stateData changes
  useEffect(() => {
    setSelectedCraftIndex(0);
    setExpandedSection(null);
    setActiveTab('CRAFTS');
  }, [stateData?.id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!stateData) return null;

  const currentCraft: MapCraftItem | undefined = stateData.crafts[selectedCraftIndex] || stateData.crafts[0];

  // Filter or prioritize artisans for the selected craft
  const suggestedArtisans = stateData.suggestedArtisans.filter(
    (a) => !currentCraft || a.craftId === currentCraft.id || a.tags.some((tag) => currentCraft.name.toLowerCase().includes(tag.toLowerCase()))
  );
  // Fallback to all artisans if none match exact filter
  const displayedArtisans = suggestedArtisans.length > 0 ? suggestedArtisans : stateData.suggestedArtisans;

  const toggleFavorite = (artisanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritedArtisanIds((prev) => ({
      ...prev,
      [artisanId]: !prev[artisanId],
    }));
  };

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenCraftDetail = () => {
    if (!currentCraft) return;
    // Find matching app craft in AppContext
    const matchedAppCraft = crafts.find(
      (c) =>
        c.name.toLowerCase().includes(currentCraft.name.toLowerCase().split(' ')[0]) ||
        c.state.toLowerCase() === stateData.name.toLowerCase()
    );
    if (matchedAppCraft) {
      setSelectedCraft(matchedAppCraft);
    } else if (onSelectCraftForLineage) {
      onSelectCraftForLineage(currentCraft.name);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="state-explorer-title"
    >
      <div className="relative w-full max-w-5xl bg-surface rounded-3xl shadow-2xl border border-outline/30 max-h-[92vh] flex flex-col overflow-hidden text-on-surface">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t('Close state exploration modal')}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-surface/80 hover:bg-surface-container text-on-surface shadow-md backdrop-blur-xs transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-7 no-scrollbar">
          {/* 1. TOP STATE HERO BANNER */}
          <div className="relative rounded-2xl overflow-hidden bg-surface-container-low border border-outline/20 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
            {/* Left Narrative */}
            <div className="flex-1 space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <h1
                  id="state-explorer-title"
                  className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight"
                >
                  {t(stateData.name)}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {t(stateData.region)}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-on-surface/90">
                {t(stateData.tagline)}
              </h2>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {t(stateData.description)}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-6 sm:gap-8 pt-3 border-t border-outline/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏺</span>
                  <div>
                    <span className="font-serif font-bold text-base sm:text-lg text-primary block leading-tight">
                      {stateData.stats.uniqueCrafts}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {t('Unique Crafts')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  <div>
                    <span className="font-serif font-bold text-base sm:text-lg text-primary block leading-tight">
                      {stateData.stats.artisans}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {t('Artisans')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <div>
                    <span className="font-serif font-bold text-base sm:text-lg text-primary block leading-tight">
                      {stateData.stats.districts}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {t('Districts')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual with Handwritten Script Overlay */}
            <div className="w-full lg:w-80 h-52 sm:h-60 rounded-2xl overflow-hidden relative shadow-md shrink-0 group">
              <img
                src={stateData.heroImage}
                alt={t(stateData.heroImageCaption)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Cursive quote banner */}
              {stateData.heroQuote && (
                <div className="absolute top-4 right-4 max-w-[200px] text-right pointer-events-none">
                  <p className="font-serif italic text-amber-100 text-xs sm:text-sm font-medium leading-tight drop-shadow-md">
                    "{t(stateData.heroQuote)}"
                  </p>
                </div>
              )}

              {/* Caption */}
              <div className="absolute bottom-3 right-3 text-white/90 text-[11px] font-medium backdrop-blur-xs bg-black/40 px-2.5 py-0.5 rounded-md">
                {t(stateData.heroImageCaption)}
              </div>
            </div>
          </div>

          {/* 2. SUB-NAVIGATION TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-outline/10">
            <button
              onClick={() => {
                setActiveTab('CRAFTS');
                setExpandedSection(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'CRAFTS'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t('Famous Crafts')}
            </button>

            <button
              onClick={() => {
                setActiveTab('EXPLORE');
                setExpandedSection('PLACES');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'EXPLORE'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{t('Explore')}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ARTISANS');
                setExpandedSection(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'ARTISANS'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('Artisans')}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('STORIES');
                setExpandedSection(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'STORIES'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('Stories')}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('EVENTS');
                setExpandedSection('EVENTS');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'EVENTS'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('Events & Opportunities')}</span>
            </button>
          </div>

          {/* 3. FAMOUS CRAFTS CAROUSEL */}
          <div className="space-y-3" data-guide="state-crafts-list">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                {language === 'en'
                  ? `${t('Famous Crafts of')} ${t(stateData.name)}`
                  : `${t(stateData.name)} ${t('Famous Crafts of')}`}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary">
                  {t('View All')} ({stateData.crafts.length}) →
                </span>
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    onClick={() => handleScrollCarousel('left')}
                    aria-label={t('Previous crafts')}
                    className="p-1 rounded-full border border-outline/20 hover:bg-surface-container text-on-surface transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleScrollCarousel('right')}
                    aria-label={t('Next crafts')}
                    className="p-1 rounded-full border border-outline/20 hover:bg-surface-container text-on-surface transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Scroll Cards */}
            <div
              ref={carouselRef}
              className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
            >
              {stateData.crafts.map((craft, idx) => {
                const isSelected = selectedCraftIndex === idx;
                return (
                  <button
                    key={craft.id}
                    onClick={() => setSelectedCraftIndex(idx)}
                    className={`relative w-44 sm:w-48 aspect-4/3 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 text-left group cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 shadow-md scale-102'
                        : 'border-transparent hover:border-outline/40 shadow-xs'
                    }`}
                  >
                    <img
                      src={craft.image}
                      alt={t(craft.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-1 text-white">
                      <span className="font-serif font-bold text-xs sm:text-sm line-clamp-2 leading-tight">
                        {t(craft.name)}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-primary shrink-0 transition-transform ${
                          isSelected ? 'translate-x-0.5' : 'opacity-75'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. SELECTED CRAFT DETAIL PANEL */}
          {currentCraft && (
            <div className="p-5 sm:p-7 rounded-2xl bg-surface-container-low border border-outline/20 space-y-6 shadow-xs animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Craft Image Thumbnail */}
                <div className="lg:col-span-3 w-full aspect-square rounded-2xl overflow-hidden relative shadow-md">
                  <img
                    src={currentCraft.image}
                    alt={t(currentCraft.name)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                </div>

                {/* Craft Central Narrative */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                      {t(currentCraft.name)}
                    </h4>
                    {currentCraft.isGI && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                        {t('GI Tagged')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-primary">
                    {t(`The Pride of ${stateData.name}`) !== `The Pride of ${stateData.name}`
                      ? t(`The Pride of ${stateData.name}`)
                      : (language === 'en'
                          ? `${t('The Pride of')} ${t(stateData.name)}`
                          : `${t(stateData.name)} ${t('The Pride of')}`)}
                  </p>

                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {t(currentCraft.description)}
                  </p>

                  <button
                    onClick={handleOpenCraftDetail}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
                  >
                    <span>
                      {t(`Explore All About ${currentCraft.name}`) !== `Explore All About ${currentCraft.name}`
                        ? t(`Explore All About ${currentCraft.name}`)
                        : `${t('Explore All About')} ${t(currentCraft.name)}`}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Craft Spec Grid */}
                <div className="lg:col-span-4 p-4 rounded-xl bg-surface border border-outline/20 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                      <span>🪢</span> {t('Technique')}
                    </span>
                    <p className="font-semibold text-on-surface mt-0.5">
                      {t(currentCraft.technique)}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                      <span>🧶</span> {t('Materials')}
                    </span>
                    <p className="font-semibold text-on-surface mt-0.5">
                      {currentCraft.materials.map((m) => t(m)).join(', ')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                      <span>🎨</span> {t('Known For')}
                    </span>
                    <p className="font-semibold text-on-surface mt-0.5">
                      {currentCraft.knownFor.map((k) => t(k)).join(', ')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                      <span>🏛️</span> {t('Cultural Significance')}
                    </span>
                    <p className="text-on-surface-variant mt-0.5 text-[11px] leading-relaxed">
                      {t(currentCraft.culturalSignificance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SUGGESTED ARTISANS SECTION */}
          <div className="space-y-4" data-guide="explore-artisans-action">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                {t('Suggested Artisans')}
              </h3>
              <span className="text-xs font-semibold text-primary">
                {t('View All Artisans →')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedArtisans.map((artisan) => {
                const isFavorited = !!favoritedArtisanIds[artisan.id];
                return (
                  <div
                    key={artisan.id}
                    onClick={() => {
                      if (onOpenArtisanProfile) {
                        onOpenArtisanProfile(artisan);
                      } else {
                        openChatWith({
                          id: artisan.id,
                          name: artisan.name,
                          avatar: artisan.avatar,
                        });
                      }
                    }}
                    className="p-3.5 rounded-2xl bg-surface border border-outline/20 hover:border-primary/50 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      {/* Artisan Image with Favorite Button */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                        <img
                          src={artisan.avatar}
                          alt={t(artisan.name)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => toggleFavorite(artisan.id, e)}
                          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-xs transition cursor-pointer ${
                            isFavorited
                              ? 'bg-red-500 text-white shadow-xs'
                              : 'bg-white/80 dark:bg-black/60 text-on-surface hover:text-red-500'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="font-serif font-bold text-sm text-on-surface group-hover:text-primary transition truncate">
                          {t(artisan.name)}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          {t(artisan.location)}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-on-surface">
                          {artisan.rating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          ({artisan.reviewsCount} {t('reviews')})
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {artisan.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary"
                          >
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chat / Connect trigger */}
                    <div className="pt-3 mt-3 border-t border-outline/10 flex items-center justify-between text-xs font-bold text-primary">
                      <span>{t('Meet Artisan')}</span>
                      <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. MORE TO EXPLORE IN [STATE] (CRITICAL: No Food & Culture) */}
          <div className="space-y-4 pt-2 border-t border-outline/10">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
              {language === 'en'
                ? `${t('More to Explore in')} ${t(stateData.name)}`
                : `${t(stateData.name)} ${t('More to Explore in')}`}
            </h3>

            {/* 3 Interactive Exploration Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tile 1: Tourist Places */}
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'PLACES' ? null : 'PLACES')
                }
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  expandedSection === 'PLACES'
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-outline/20 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-on-surface">
                      {t('Tourist Places')}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      {t('Forts, Temples, Lakes...')}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-primary transition-transform ${
                    expandedSection === 'PLACES' ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Tile 2: Workshops & Learning */}
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'WORKSHOPS' ? null : 'WORKSHOPS')
                }
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  expandedSection === 'WORKSHOPS'
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-outline/20 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-on-surface">
                      {t('Workshops & Learning')}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      {t('Learn from Artisans')}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-primary transition-transform ${
                    expandedSection === 'WORKSHOPS' ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Tile 3: Upcoming Events */}
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'EVENTS' ? null : 'EVENTS')
                }
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  expandedSection === 'EVENTS'
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-outline/20 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-on-surface">
                      {t('Upcoming Events')}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      {t('Exhibitions, Fairs, Melas')}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-primary transition-transform ${
                    expandedSection === 'EVENTS' ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>

            {/* Expandable Tile Content */}
            {expandedSection === 'PLACES' && (
              <div className="p-5 rounded-2xl bg-surface border border-primary/30 space-y-3 animate-fadeIn">
                <h4 className="font-serif font-bold text-sm text-on-surface flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-primary" />
                  {language === 'en'
                    ? `${t('Heritage & Craft Tourism in')} ${t(stateData.name)}`
                    : `${t(stateData.name)} ${t('Heritage & Craft Tourism in')}`}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stateData.touristPlaces.map((place, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-surface-container-low border border-outline/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-on-surface">
                          {t(place.name)}
                        </span>
                        <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                          {t(place.district)}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        {t(place.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedSection === 'WORKSHOPS' && (
              <div className="p-5 rounded-2xl bg-surface border border-primary/30 space-y-3 animate-fadeIn">
                <h4 className="font-serif font-bold text-sm text-on-surface flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  {language === 'en'
                    ? `${t('Hands-on Master Classes & Workshops in')} ${t(stateData.name)}`
                    : `${t(stateData.name)} ${t('Hands-on Master Classes & Workshops in')}`}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stateData.workshops.map((ws, wIdx) => (
                    <div
                      key={wIdx}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 space-y-1.5"
                    >
                      <h5 className="font-serif font-bold text-xs text-on-surface">
                        {t(ws.title)}
                      </h5>
                      <p className="text-[11px] text-primary font-medium">
                        {t('Instructor')}: {t(ws.artisan)}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-1">
                        <span>{t('Duration')}: {t(ws.duration)}</span>
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          {ws.spotsLeft} {t('spots remaining')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedSection === 'EVENTS' && (
              <div className="p-5 rounded-2xl bg-surface border border-primary/30 space-y-3 animate-fadeIn">
                <h4 className="font-serif font-bold text-sm text-on-surface flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {t('Upcoming Craft Exhibitions & Artisan Melas')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stateData.events.map((evt, eIdx) => (
                    <div
                      key={eIdx}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-xs text-on-surface">
                          {t(evt.title)}
                        </h5>
                        <span className="text-[10px] font-bold text-primary">
                          {t(evt.date)}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        📍 {t(evt.location)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

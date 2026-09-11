import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Star,
  Award,
  Volume2,
  VolumeX,
  MessageCircle,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MapArtisanItem } from '../../data/heritageMapData';

interface ArtisanProfileModalProps {
  artisan: MapArtisanItem | null;
  onClose: () => void;
}

export const ArtisanProfileModal: React.FC<ArtisanProfileModalProps> = ({
  artisan,
  onClose,
}) => {
  const { openChatWith, setIsCustomOrderModalOpen, bookWorkshop, products, setSelectedProduct, t } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!artisan) return null;

  const artisanProducts = products.filter(
    (p) =>
      p.status === 'PUBLISHED' &&
      (p.artisan_name.toLowerCase().includes(artisan.name.toLowerCase().split(' ')[0]) ||
        p.craft_name.toLowerCase().includes(artisan.craftName.toLowerCase().split(' ')[0]))
  );

  const toggleStoryAudio = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = artisan.craftStory || `${artisan.name} has dedicated ${artisan.experienceYears || 25} years to mastering ${artisan.craftName} in ${artisan.location}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const inVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('hi') || v.name.includes('India'));
        if (inVoice) utterance.voice = inVoice;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 8000);
      }
    }
  };

  const handleStartChat = () => {
    openChatWith({
      id: artisan.id,
      name: artisan.name,
      avatar: artisan.avatar,
    });
    onClose();
  };

  const handleBookApprenticeship = () => {
    bookWorkshop({
      artisan_id: artisan.id,
      artisan_name: artisan.name,
      craft_id: artisan.craftId,
      craft_name: artisan.craftName,
      customer_id: 'user-heirloom-001',
      customer_name: 'Devi Prasad Sharma',
      type: 'WORKSHOP',
      preferred_dates: 'Next Weekend',
      language: artisan.languages?.[0] || 'English',
      message: `Interested in learning ${artisan.craftName} directly with master artisan.`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-on-surface">
        <button
          onClick={onClose}
          aria-label={t('Close')}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-outline/10 pb-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 ring-2 ring-primary/30">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 p-1 rounded-full bg-green-500 text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase">
                {t('Verified Master Artisan')}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-on-surface">{artisan.rating.toFixed(1)}</span>
                <span className="text-on-surface-variant text-[11px]">({artisan.reviewsCount} {t('reviews')})</span>
              </div>
            </div>

            <h3 className="font-serif text-2xl font-bold text-on-surface">
              {artisan.name}
            </h3>

            <p className="text-xs font-medium text-primary flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{artisan.location}, {artisan.state}</span>
            </p>

            <p className="text-xs text-on-surface-variant">
              {artisan.experienceYears || 25}+ {t('Years Generational Mastery')} • {t('Speaks')}: {artisan.languages?.join(', ') || 'Telugu, Hindi, English'}
            </p>
          </div>
        </div>

        {/* Oral Craft Story Player */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
              <Volume2 className="w-4 h-4" /> {t('Living Oral Craft Lineage')}
            </span>
            <button
              onClick={toggleStoryAudio}
              className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-primary text-on-primary animate-pulse'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{t('Pause Voice')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('Listen in Mother Tongue')}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm italic text-on-surface/90 leading-relaxed font-serif">
            "{artisan.craftStory || artisan.bio}"
          </p>
        </div>

        {/* Products by this Artisan */}
        {artisanProducts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-on-surface">
              {t('Handcrafted Creations from this Studio')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {artisanProducts.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-surface border border-outline/20 hover:border-primary/50 transition cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif font-bold text-xs text-on-surface truncate">
                      {prod.name}
                    </h5>
                    <p className="text-[11px] font-bold text-primary">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={handleStartChat}
            className="w-full py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('Start Direct Chat')}</span>
          </button>

          <button
            onClick={() => {
              setIsCustomOrderModalOpen(true);
              onClose();
            }}
            className="w-full py-2.5 rounded-full border border-primary text-primary hover:bg-primary/10 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('Custom Commission')}</span>
          </button>

          <button
            onClick={handleBookApprenticeship}
            className="w-full py-2.5 rounded-full bg-secondary/15 text-secondary hover:bg-secondary/25 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t('Book Workshop')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

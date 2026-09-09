import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArtisanProfile } from '../../types';
import { CurriculumModal } from './CurriculumModal';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const LearningView: React.FC = () => {
  const { artisans, bookWorkshop, openChatWith, user, t } = useApp();

  const [bookingArtisan, setBookingArtisan] = useState<ArtisanProfile | null>(null);
  const [selectedCurriculumArtisan, setSelectedCurriculumArtisan] = useState<ArtisanProfile | null>(null);
  const [workshopType, setWorkshopType] = useState<'WORKSHOP' | 'DEMONSTRATION' | 'APPRENTICESHIP'>('WORKSHOP');
  const [preferredDates, setPreferredDates] = useState('Weekend of next month');
  const [message, setMessage] = useState('I want to learn traditional techniques and pigment extraction from the master.');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');

  // Filter artisans offering learning
  const learningArtisans = artisans.filter((a) => a.learning_available);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingArtisan) return;

    bookWorkshop({
      customer_id: user.id,
      customer_name: user.name,
      artisan_id: bookingArtisan.id,
      artisan_name: bookingArtisan.name,
      craft_id: bookingArtisan.craft_id,
      craft_name: bookingArtisan.craft_name,
      type: workshopType,
      preferred_dates: preferredDates,
      language: selectedLanguage,
      message,
    });

    setBookingArtisan(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline/20 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
            <GraduationCap className="w-4 h-4" />
            <span>{t('GURU-SHISHYA TRADITION')}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            {t('Learn Living Crafts from National Master Artisans')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {t("Preserve India's living cultural legacy by learning directly from master craftspeople. From weekend indigo vats in Kutch to pit-loom weaving in Pochampally.")}
          </p>
        </div>
      </div>

      {/* Artisans Offering Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningArtisans.map((artisan) => (
          <div
            key={artisan.id}
            className="p-6 rounded-2xl bg-surface border border-outline/20 hover:border-primary/40 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <img
                  src={artisan.avatar_url}
                  alt={artisan.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-base text-on-surface">
                      {artisan.name}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-primary">
                    {artisan.craft_name}
                  </p>
                  <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {artisan.district}, {artisan.state} • {artisan.experience_years} Years Master
                  </p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                {artisan.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-medium text-on-surface border border-outline/10">
                  🗣 Teaches in: {artisan.languages_spoken.join(', ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-semibold">
                  ★ {artisan.rating} ({artisan.reviews_count} Reviews)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-outline/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    openChatWith({
                      id: artisan.id,
                      name: artisan.name,
                      avatar: artisan.avatar_url,
                    })
                  }
                  className="text-xs font-semibold text-on-surface-variant hover:text-primary transition cursor-pointer"
                >
                  Inquire
                </button>
                <button
                  onClick={() => setSelectedCurriculumArtisan(artisan)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Syllabus</span>
                </button>
              </div>

              <button
                onClick={() => setBookingArtisan(artisan)}
                className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book Masterclass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-outline/30 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  ENROLL IN APPRENTICESHIP
                </span>
                <h3 className="font-serif text-xl font-bold text-on-surface mt-0.5">
                  Learn {bookingArtisan.craft_name}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  With {bookingArtisan.name} ({bookingArtisan.district})
                </p>
              </div>
              <button
                onClick={() => setBookingArtisan(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'WORKSHOP', label: 'Weekend Workshop' },
                    { id: 'DEMONSTRATION', label: 'Live Demonstration' },
                    { id: 'APPRENTICESHIP', label: 'Master Apprenticeship' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setWorkshopType(f.id as any)}
                      className={`p-2 rounded-lg border text-center font-medium cursor-pointer ${
                        workshopType === f.id
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline/20 text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface">Preferred Timeline / Dates</label>
                <input
                  type="text"
                  required
                  value={preferredDates}
                  onChange={(e) => setPreferredDates(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface">Language of Instruction</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-lg"
                >
                  {bookingArtisan.languages_spoken.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface">Message / Learning Objectives</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline/30 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/90 transition shadow-md cursor-pointer"
              >
                Submit Learning Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Curriculum Modal */}
      <CurriculumModal
        artisan={selectedCurriculumArtisan}
        onClose={() => setSelectedCurriculumArtisan(null)}
        onApply={(artisan) => {
          setSelectedCurriculumArtisan(null);
          setBookingArtisan(artisan);
        }}
      />
    </div>
  );
};

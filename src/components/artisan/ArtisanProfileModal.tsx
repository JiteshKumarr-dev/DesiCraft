import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArtisanProfile } from '../../types';
import {
  X,
  MapPin,
  Award,
  Star,
  Sparkles,
  MessageSquare,
  Handshake,
  CheckCircle2,
  Volume2,
  Package,
  Layers,
  ScrollText,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ArtisanProfileModalProps {
  artisan: ArtisanProfile | null;
  onClose: () => void;
  onOpenCollaboration: (artisan: ArtisanProfile) => void;
}

export const ArtisanProfileModal: React.FC<ArtisanProfileModalProps> = ({
  artisan,
  onClose,
  onOpenCollaboration,
}) => {
  const { products, openSellerChatWith, t } = useApp();
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [activeTab, setActiveTab] = useState<'ABOUT' | 'SKILLS' | 'PRODUCTS' | 'PORTFOLIO'>('ABOUT');

  if (!artisan) return null;

  // Filter artisan's products
  const artisanProducts = products.filter(
    (p) => p.artisan_id === artisan.id || p.artisan_name === artisan.name
  );

  const handleStartChat = () => {
    onClose();
    openSellerChatWith(artisan.id);
  };

  const handleProposeCollab = () => {
    onClose();
    onOpenCollaboration(artisan);
  };

  const playAudio = () => {
    if (!artisan.story_audio_url) return;
    const audio = new Audio(artisan.story_audio_url);
    setIsPlayingStory(true);
    audio.play();
    audio.onended = () => setIsPlayingStory(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-surface-container-low border border-outline/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header Hero Banner */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-amber-900 via-primary-container/80 to-tertiary-container/80 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg flex-shrink-0 bg-surface">
              <img
                src={artisan.avatar_url}
                alt={artisan.name}
                className="w-full h-full object-cover"
              />
              {artisan.verification_status === 'VERIFIED' && (
                <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-emerald-600 text-white" title="Verified Master Artisan">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight truncate drop-shadow-sm">
                  {artisan.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/30">
                  {artisan.craft_name}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs sm:text-sm text-white/80 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {artisan.district}, {artisan.state}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {artisan.experience_years} Years Master
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {artisan.rating} ({artisan.reviews_count})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline/15 px-6 bg-surface flex-shrink-0 text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('ABOUT')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'ABOUT'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            Ancestral Story
          </button>
          <button
            onClick={() => setActiveTab('SKILLS')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'SKILLS'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-4 h-4" />
            Skills & Techniques
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'PRODUCTS'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({artisanProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'PORTFOLIO'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Handshake className="w-4 h-4" />
            Collaborations
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'ABOUT' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Bio & Guild */}
              <div className="p-4 rounded-2xl bg-surface border border-outline/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Guild Affiliation
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {artisan.guild_name}
                  </span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed">{artisan.bio}</p>
              </div>

              {/* Craft Story with Audio */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-serif text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-amber-600" />
                    The Master's Voice & Craft Story
                  </h3>
                  {artisan.story_audio_url && (
                    <button
                      onClick={playAudio}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-900 dark:text-amber-200 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingStory ? 'animate-bounce text-primary' : ''}`} />
                      {isPlayingStory ? 'Playing...' : 'Listen Story'}
                    </button>
                  )}
                </div>
                <p className="text-sm italic text-on-surface/90 leading-relaxed font-serif">
                  "{artisan.craft_story}"
                </p>
              </div>

              {/* Spoken Languages */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Languages Spoken
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artisan.languages_spoken.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-container border border-outline/20 text-on-surface"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SKILLS' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Master Skills */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Core Master Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artisan.skills && artisan.skills.length > 0 ? (
                    artisan.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">Craft heritage mastery.</p>
                  )}
                </div>
              </div>

              {/* Traditional Techniques */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Ancestral Techniques
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artisan.traditional_techniques && artisan.traditional_techniques.length > 0 ? (
                    artisan.traditional_techniques.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">Traditional heritage techniques.</p>
                  )}
                </div>
              </div>

              {/* Raw Materials */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tertiary flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> Pure Raw Materials Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artisan.materials && artisan.materials.length > 0 ? (
                    artisan.materials.map((mat) => (
                      <span
                        key={mat}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20"
                      >
                        {mat}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">100% natural, unadulterated heritage materials.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PRODUCTS' && (
            <div className="space-y-4 animate-fadeIn">
              {artisanProducts.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant">
                  <Package className="w-10 h-10 mx-auto text-outline mb-2" />
                  <p className="text-sm">No individual catalog items listed currently.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {artisanProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex gap-3 p-3 rounded-2xl bg-surface border border-outline/15 hover:border-primary/40 transition-colors"
                    >
                      <img
                        src={prod.primary_image}
                        alt={prod.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-surface-container"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h5 className="text-sm font-semibold text-on-surface truncate">
                            {prod.name}
                          </h5>
                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                            {prod.technique}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-primary">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold">
                            Authentic GI
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'PORTFOLIO' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Collaboration Interests */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Handshake className="w-4 h-4" /> Open Collaboration Formats
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artisan.collaboration_interests && artisan.collaboration_interests.length > 0 ? (
                    artisan.collaboration_interests.map((int) => (
                      <span
                        key={int}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {int}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant">Open to creative partnerships</span>
                  )}
                </div>
              </div>

              {/* Previous Collaborations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Previous Joint Works & Capsule Collections
                </h4>
                {artisan.previous_collaborations && artisan.previous_collaborations.length > 0 ? (
                  artisan.previous_collaborations.map((collab, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface border border-outline/15 flex gap-4 items-start"
                    >
                      {collab.image_url && (
                        <img
                          src={collab.image_url}
                          alt={collab.title}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-sm font-bold text-on-surface">{collab.title}</h5>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                            {collab.year}
                          </span>
                        </div>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          With {collab.partner_name} ({collab.partner_craft})
                        </p>
                        {collab.description && (
                          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            {collab.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant italic">
                    Ready to embark on their first inter-craft fusion!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-outline/15 bg-surface flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-outline/30 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleStartChat}
            className="px-4 py-2.5 rounded-xl border border-primary/30 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            Start a Conversation
          </button>
          <button
            onClick={handleProposeCollab}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-primary text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Handshake className="w-4 h-4" />
            Send Collaboration Request
          </button>
        </div>
      </div>
    </div>
  );
};

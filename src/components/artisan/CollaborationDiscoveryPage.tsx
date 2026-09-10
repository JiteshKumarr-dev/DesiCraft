import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ArtisanProfile, Region, CollaborationType, CollaborationRequest } from '../../types';
import { ArtisanProfileModal } from './ArtisanProfileModal';
import { CollaborationRequestModal } from './CollaborationRequestModal';
import {
  Handshake,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Send,
  Inbox,
  Check,
  X,
  Layers,
  Award,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

const REGIONS: (Region | 'All')[] = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];

const CRAFT_TYPES = [
  'All',
  'Textiles',
  'Pottery',
  'Metalcraft',
  'Woodcraft',
  'Folk Painting',
  'Jewellery',
  'Cane & Bamboo',
];

const COLLAB_TYPES: (CollaborationType | 'All')[] = [
  'All',
  'Product Collaboration',
  'Craft Fusion',
  'Joint Collection',
  'Custom Project',
  'Exhibition',
  'Workshop',
  'Skill Exchange',
];

const LANGUAGES = [
  'All',
  'Hindi',
  'Telugu',
  'Bengali',
  'Gujarati',
  'Rajasthani',
  'Kashmiri',
  'Gondi',
  'Maithili',
  'English',
  'Urdu',
];

interface AICuratorIdea {
  id: string;
  artisanId: string;
  partnerCraft: string;
  collabType: CollaborationType;
  title: string;
  concept: string;
  marketPotential: string;
  tags: string[];
}

const AI_COLLAB_IDEAS: AICuratorIdea[] = [
  {
    id: 'ai-idea-1',
    artisanId: 'artisan-somnath-bastar',
    partnerCraft: 'Bastar Dhokra Bell Metal',
    collabType: 'Craft Fusion',
    title: 'Kadwa Brocade Silk & Cast Brass Evening Clutches',
    concept: 'Pair hand-cast 4,500-year-old Cire Perdue brass tribal motifs as clasp hardware and decorative handles with antique pure silver Zari Kadwa woven silk.',
    marketPotential: 'High luxury festive bridal & international collector appeal.',
    tags: ['Luxury Wear', 'Zero Plastic', 'GI Fusion'],
  },
  {
    id: 'ai-idea-2',
    artisanId: 'artisan-lakshmi-pochampally',
    partnerCraft: 'Pochampally Ikat',
    collabType: 'Joint Collection',
    title: 'Royal Kadwa Silk & Geometric Double Ikat Capsule Stoles',
    concept: 'Integrate precision double ikat chevron bands seamlessly into the drape pallu with Kadwa brocade floral borders on mulberry silk warp.',
    marketPotential: 'Substantial demand among conscious handloom connoisseurs.',
    tags: ['Capsule Range', 'Festive 2026', 'Silk Mark'],
  },
  {
    id: 'ai-idea-3',
    artisanId: 'artisan-ismail-kutch',
    partnerCraft: 'Kutch Ajrakh Block Print',
    collabType: 'Product Collaboration',
    title: 'Natural Indigo Ajrakh Resist Printing on Handspun Katan Brocade',
    concept: '16-step natural indigo and pomegranate rind resist block printing on unbleached pure Katan silk grounds, bordered by handwoven gold zari.',
    marketPotential: 'Premium export demand across European ethical fashion houses.',
    tags: ['Zero Chemical', 'Natural Indigo', 'Heritage Export'],
  },
  {
    id: 'ai-idea-4',
    artisanId: 'artisan-kripal-jaipur',
    partnerCraft: 'Jaipur Blue Pottery',
    collabType: 'Custom Project',
    title: 'Jaipur Quartz Ceramic Knobs Mounted on Zari Silk Chests',
    concept: 'Bespoke hand-painted cobalt and copper oxide floral ceramic medallions mounted as heirloom hardware on handwoven textile decor pieces.',
    marketPotential: 'High-end architectural boutique hotels & interior designers.',
    tags: ['Home Living', 'Ceramics', 'Architectural'],
  },
];

export const CollaborationDiscoveryPage: React.FC = () => {
  const {
    user,
    artisans,
    collaborationRequests,
    acceptCollaborationRequest,
    declineCollaborationRequest,
    openSellerChatWith,
  } = useApp();

  // Navigation Sub-tab
  const [activeSection, setActiveSection] = useState<'DISCOVER' | 'REQUESTS' | 'AI_IDEAS'>('DISCOVER');
  const [requestsTab, setRequestsTab] = useState<'RECEIVED' | 'SENT' | 'ACTIVE'>('RECEIVED');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [selectedCraftType, setSelectedCraftType] = useState<string>('All');
  const [selectedCollabType, setSelectedCollabType] = useState<CollaborationType | 'All'>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  // Modals state
  const [viewingProfileArtisan, setViewingProfileArtisan] = useState<ArtisanProfile | null>(null);
  const [collabModalTarget, setCollabModalTarget] = useState<ArtisanProfile | null>(null);
  const [collabModalInitialTitle, setCollabModalInitialTitle] = useState('');
  const [collabModalInitialMessage, setCollabModalInitialMessage] = useState('');
  const [collabModalInitialType, setCollabModalInitialType] = useState<CollaborationType>('Craft Fusion');

  const myArtisanId = user.artisan_profile?.id || user.id;

  // Filter artisans (exclude current logged-in user)
  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      // Exclude self
      if (artisan.id === myArtisanId || artisan.user_id === myArtisanId) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = artisan.name.toLowerCase().includes(q);
        const matchCraft = artisan.craft_name.toLowerCase().includes(q);
        const matchState = artisan.state.toLowerCase().includes(q);
        const matchDistrict = artisan.district.toLowerCase().includes(q);
        const matchGuild = artisan.guild_name.toLowerCase().includes(q);
        const matchBio = artisan.bio.toLowerCase().includes(q);
        const matchSkills = artisan.skills?.some((s) => s.toLowerCase().includes(q)) || false;
        if (!matchName && !matchCraft && !matchState && !matchDistrict && !matchGuild && !matchBio && !matchSkills) {
          return false;
        }
      }

      // Region Filter
      if (selectedRegion !== 'All') {
        const northStates = ['Uttar Pradesh', 'Jammu & Kashmir', 'Punjab', 'Himachal Pradesh', 'Delhi', 'Haryana', 'Uttarakhand'];
        const southStates = ['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Kerala'];
        const westStates = ['Gujarat', 'Rajasthan', 'Maharashtra', 'Goa'];
        const eastStates = ['Bihar', 'West Bengal', 'Odisha', 'Jharkhand'];
        const centralStates = ['Chhattisgarh', 'Madhya Pradesh'];
        const northeastStates = ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Mizoram', 'Sikkim'];

        let stateMatches = false;
        if (selectedRegion === 'North') stateMatches = northStates.includes(artisan.state);
        else if (selectedRegion === 'South') stateMatches = southStates.includes(artisan.state);
        else if (selectedRegion === 'West') stateMatches = westStates.includes(artisan.state);
        else if (selectedRegion === 'East') stateMatches = eastStates.includes(artisan.state);
        else if (selectedRegion === 'Central') stateMatches = centralStates.includes(artisan.state);
        else if (selectedRegion === 'Northeast') stateMatches = northeastStates.includes(artisan.state);

        if (!stateMatches) return false;
      }

      // Craft Type Filter
      if (selectedCraftType !== 'All') {
        const craftLower = artisan.craft_name.toLowerCase();
        if (selectedCraftType === 'Textiles' && !craftLower.includes('brocade') && !craftLower.includes('ikat') && !craftLower.includes('block') && !craftLower.includes('pashmina') && !craftLower.includes('weaving')) return false;
        if (selectedCraftType === 'Pottery' && !craftLower.includes('pottery') && !craftLower.includes('ceramic')) return false;
        if (selectedCraftType === 'Metalcraft' && !craftLower.includes('metal') && !craftLower.includes('dhokra') && !craftLower.includes('bell')) return false;
        if (selectedCraftType === 'Folk Painting' && !craftLower.includes('painting') && !craftLower.includes('madhubani') && !craftLower.includes('mithila')) return false;
      }

      // Collab Type Filter
      if (selectedCollabType !== 'All') {
        if (!artisan.collaboration_interests?.includes(selectedCollabType)) {
          return false;
        }
      }

      // Language Filter
      if (selectedLanguage !== 'All') {
        if (!artisan.languages_spoken.includes(selectedLanguage)) {
          return false;
        }
      }

      return true;
    });
  }, [artisans, myArtisanId, searchQuery, selectedRegion, selectedCraftType, selectedCollabType, selectedLanguage]);

  // Request bucketing
  const receivedRequests = collaborationRequests.filter(
    (req) => req.receiver_artisan_id === myArtisanId && req.status !== 'ACCEPTED'
  );

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'PENDING').length;

  const sentRequests = collaborationRequests.filter(
    (req) => req.sender_artisan_id === myArtisanId && req.status !== 'ACCEPTED'
  );

  const activeCollaborations = collaborationRequests.filter(
    (req) => req.status === 'ACCEPTED' && (req.sender_artisan_id === myArtisanId || req.receiver_artisan_id === myArtisanId)
  );

  const handleOpenCollabModal = (artisan: ArtisanProfile, initialTitle = '', initialMessage = '', initialType: CollaborationType = 'Craft Fusion') => {
    setCollabModalTarget(artisan);
    setCollabModalInitialTitle(initialTitle);
    setCollabModalInitialMessage(initialMessage);
    setCollabModalInitialType(initialType);
  };

  const handleApplyAIIdea = (idea: AICuratorIdea) => {
    const partner = artisans.find((a) => a.id === idea.artisanId) || artisans[1];
    handleOpenCollabModal(
      partner,
      idea.title,
      `Namaste ${partner.name}! I am excited to propose our AI-curated synergy concept: "${idea.title}". ${idea.concept}`,
      idea.collabType
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedCraftType('All');
    setSelectedCollabType('All');
    setSelectedLanguage('All');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-primary-container to-surface-container border border-outline/20 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
            <Handshake className="w-4 h-4 text-amber-500" />
            Seller-to-Seller Heritage Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-on-surface tracking-tight">
            Collaborate with Artisans
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Connect with creators across India and build something together. Form inter-craft capsule collections, execute bespoke commissions, and revive ancestral art fusions.
          </p>
        </div>
      </div>

      {/* Top Section Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline/15 pb-2">
        <button
          onClick={() => setActiveSection('DISCOVER')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSection === 'DISCOVER'
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
          }`}
        >
          <Search className="w-4 h-4" />
          Discover Artisans ({filteredArtisans.length})
        </button>

        <button
          onClick={() => setActiveSection('REQUESTS')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSection === 'REQUESTS'
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Collaboration Requests
          {pendingReceivedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-black">
              {pendingReceivedCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('AI_IDEAS')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSection === 'AI_IDEAS'
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Synergy Concepts
        </button>
      </div>

      {/* SECTION 1: DISCOVERY */}
      {activeSection === 'DISCOVER' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Comprehensive Filters */}
          <div className="p-4 sm:p-6 rounded-3xl bg-surface border border-outline/15 shadow-sm space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by artisan name, craft (e.g. Ikat, Zari), state, skill or technique..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container-low border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>

            {/* 4 Interactive Dropdown Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Region */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as Region | 'All')}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All Regions' : `${r} India`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Craft Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Craft Category
                </label>
                <select
                  value={selectedCraftType}
                  onChange={(e) => setSelectedCraftType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {CRAFT_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Craft Categories' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Collaboration Format */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Collaboration Format
                </label>
                <select
                  value={selectedCollabType}
                  onChange={(e) => setSelectedCollabType(e.target.value as CollaborationType | 'All')}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {COLLAB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === 'All' ? 'All Formats' : t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Language Spoken
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l === 'All' ? 'All Languages' : l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Reset */}
            {(searchQuery || selectedRegion !== 'All' || selectedCraftType !== 'All' || selectedCollabType !== 'All' || selectedLanguage !== 'All') && (
              <div className="flex items-center justify-between pt-2 border-t border-outline/10 text-xs">
                <span className="text-on-surface-variant">
                  Showing <strong>{filteredArtisans.length}</strong> matching master artisans
                </span>
                <button
                  onClick={resetFilters}
                  className="text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Artisans Discovery Grid */}
          {filteredArtisans.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface border border-outline/15 space-y-3">
              <Search className="w-12 h-12 mx-auto text-outline" />
              <h3 className="text-base font-bold text-on-surface">No matching artisans found</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                Try broadening your filter criteria or clearing the search query to discover master creators across India.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-dark"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArtisans.map((artisan) => (
                <div
                  key={artisan.id}
                  className="rounded-3xl bg-surface border border-outline/15 hover:border-primary/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Avatar & Basic Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={artisan.avatar_url}
                          alt={artisan.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-outline/20 bg-surface-container"
                        />
                        {artisan.verification_status === 'VERIFIED' && (
                          <div
                            className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-600 text-white"
                            title="Verified Artisan"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold font-serif text-on-surface truncate">
                          {artisan.name}
                        </h3>
                        <p className="text-xs text-primary font-bold truncate">
                          {artisan.craft_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-secondary" />
                            {artisan.district}, {artisan.state}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {artisan.experience_years}y
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {artisan.bio}
                    </p>

                    {/* Master Skills Chips */}
                    {artisan.skills && artisan.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Master Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {artisan.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-surface-container border border-outline/15 text-on-surface truncate max-w-[200px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collaboration Interests Tags */}
                    {artisan.collaboration_interests && artisan.collaboration_interests.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <Handshake className="w-3 h-3" /> Collaboration Openings:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {artisan.collaboration_interests.map((int) => (
                            <span
                              key={int}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20"
                            >
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-surface-container-low border-t border-outline/15 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingProfileArtisan(artisan)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      View Profile
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openSellerChatWith(artisan.id)}
                        className="p-2 rounded-xl border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                        title={`Message ${artisan.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenCollabModal(artisan)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-primary text-white text-xs font-bold shadow hover:shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Handshake className="w-3.5 h-3.5" />
                        Collaborate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: COLLABORATION REQUESTS HUB */}
      {activeSection === 'REQUESTS' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Requests Tabs */}
          <div className="flex items-center gap-2 border-b border-outline/15 pb-2">
            <button
              onClick={() => setRequestsTab('RECEIVED')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                requestsTab === 'RECEIVED'
                  ? 'bg-surface-container text-primary border border-primary/30'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Received Proposals ({receivedRequests.length})
            </button>
            <button
              onClick={() => setRequestsTab('SENT')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                requestsTab === 'SENT'
                  ? 'bg-surface-container text-primary border border-primary/30'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sent Proposals ({sentRequests.length})
            </button>
            <button
              onClick={() => setRequestsTab('ACTIVE')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                requestsTab === 'ACTIVE'
                  ? 'bg-surface-container text-primary border border-primary/30'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Active Collaborations ({activeCollaborations.length})
            </button>
          </div>

          {/* Sub-tab 1: Received Proposals */}
          {requestsTab === 'RECEIVED' && (
            <div className="space-y-4">
              {receivedRequests.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-surface border border-outline/15 space-y-2">
                  <Inbox className="w-10 h-10 mx-auto text-outline" />
                  <h4 className="text-sm font-bold text-on-surface">No pending proposals received</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    When other master artisans propose collaborations with your craft, their requests will appear here for review.
                  </p>
                </div>
              ) : (
                receivedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 sm:p-6 rounded-3xl bg-surface border border-outline/15 hover:border-primary/30 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.sender_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                          alt={req.sender_name}
                          className="w-12 h-12 rounded-2xl object-cover border border-outline/20"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-on-surface">{req.sender_name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/20">
                              {req.collaboration_type}
                            </span>
                          </div>
                          <p className="text-xs text-primary font-medium">{req.sender_craft}</p>
                        </div>
                      </div>

                      <span className="text-[11px] text-on-surface-variant font-medium">
                        Received {new Date(req.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline/10 space-y-1.5">
                      <h5 className="text-sm font-bold text-on-surface">{req.title}</h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{req.message}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2">
                      <button
                        onClick={() => declineCollaborationRequest(req.id)}
                        className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => openSellerChatWith(req.sender_artisan_id, { id: req.id, title: req.title })}
                        className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Message
                      </button>
                      <button
                        onClick={() => acceptCollaborationRequest(req.id)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow hover:shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept & Start Collaboration
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-tab 2: Sent Proposals */}
          {requestsTab === 'SENT' && (
            <div className="space-y-4">
              {sentRequests.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-surface border border-outline/15 space-y-2">
                  <Send className="w-10 h-10 mx-auto text-outline" />
                  <h4 className="text-sm font-bold text-on-surface">No sent proposals</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    Propose partnerships from the Discover tab or select an AI synergy idea to launch your proposal.
                  </p>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 sm:p-6 rounded-3xl bg-surface border border-outline/15 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.receiver_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                          alt={req.receiver_name}
                          className="w-11 h-11 rounded-2xl object-cover border border-outline/20"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-on-surface">To: {req.receiver_name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline/15">
                              {req.collaboration_type}
                            </span>
                          </div>
                          <p className="text-xs text-primary font-medium">{req.receiver_craft}</p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          req.status === 'PENDING'
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200'
                            : req.status === 'ACCEPTED'
                            ? 'bg-emerald-500/15 text-emerald-700'
                            : 'bg-rose-500/15 text-rose-700'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {req.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline/10 text-xs text-on-surface-variant">
                      <p className="font-bold text-on-surface mb-1">{req.title}</p>
                      <p>{req.message}</p>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => openSellerChatWith(req.receiver_artisan_id, { id: req.id, title: req.title })}
                        className="px-4 py-1.5 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Message Partner
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-tab 3: Active Collaborations */}
          {requestsTab === 'ACTIVE' && (
            <div className="space-y-4">
              {activeCollaborations.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-surface border border-outline/15 space-y-2">
                  <Handshake className="w-10 h-10 mx-auto text-outline" />
                  <h4 className="text-sm font-bold text-on-surface">No active collaborations yet</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    Accept a received proposal to initiate an active collaborative project.
                  </p>
                </div>
              ) : (
                activeCollaborations.map((collab) => {
                  const partnerId = collab.sender_artisan_id === myArtisanId ? collab.receiver_artisan_id : collab.sender_artisan_id;
                  const partnerName = collab.sender_artisan_id === myArtisanId ? collab.receiver_name : collab.sender_name;
                  const partnerCraft = collab.sender_artisan_id === myArtisanId ? collab.receiver_craft : collab.sender_craft;
                  const partnerAvatar = collab.sender_artisan_id === myArtisanId ? collab.receiver_avatar : collab.sender_avatar;

                  return (
                    <div
                      key={collab.id}
                      className="p-6 rounded-3xl bg-surface border-2 border-emerald-500/30 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={partnerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                            alt={partnerName}
                            className="w-14 h-14 rounded-2xl object-cover border border-outline/20"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-on-surface">{collab.title}</h4>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                ACTIVE
                              </span>
                            </div>
                            <p className="text-xs text-primary font-semibold mt-0.5">
                              Craft Fusion: {user.artisan_profile?.craft_name || 'Varanasi Brocade'} × {partnerCraft}
                            </p>
                            <p className="text-xs text-on-surface-variant">Co-Creator: {partnerName}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => openSellerChatWith(partnerId, { id: collab.id, title: collab.title })}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-primary text-white text-xs font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Open Private Chat
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-on-surface-variant flex items-center justify-between">
                        <span>Project Status: Active Design & Loom Coordination</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                          {collab.collaboration_type}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: AI COLLABORATION SYNERGY CONCEPTS */}
      {activeSection === 'AI_IDEAS' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-serif text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                DesiCraft AI Heritage Conceptualizer
              </h3>
              <p className="text-xs text-on-surface-variant max-w-2xl">
                Our algorithmic model analyzes traditional GI crafts across regions, balancing textures, ancestral materials, and commercial viability to propose unprecedented inter-craft synergies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AI_COLLAB_IDEAS.map((idea) => {
              const targetArtisan = artisans.find((a) => a.id === idea.artisanId) || artisans[1];

              return (
                <div
                  key={idea.id}
                  className="p-6 rounded-3xl bg-surface border border-outline/15 hover:border-amber-500/40 shadow-sm flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                        {idea.collabType}
                      </span>
                      <span className="text-[11px] font-bold text-primary">
                        Recommended Partner: {targetArtisan.name}
                      </span>
                    </div>

                    <h4 className="text-base font-bold font-serif text-on-surface">
                      {idea.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {idea.concept}
                    </p>

                    <div className="p-3 rounded-xl bg-surface-container text-[11px] text-on-surface space-y-1">
                      <span className="font-bold text-amber-700 dark:text-amber-300">Commercial Potential:</span>
                      <p className="text-on-surface-variant">{idea.marketPotential}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {idea.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-container-high text-on-surface-variant"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={targetArtisan.avatar_url}
                        alt={targetArtisan.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span className="text-xs font-semibold text-on-surface">{targetArtisan.craft_name}</span>
                    </div>

                    <button
                      onClick={() => handleApplyAIIdea(idea)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-primary text-white text-xs font-bold shadow hover:shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Propose This Fusion
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {viewingProfileArtisan && (
        <ArtisanProfileModal
          artisan={viewingProfileArtisan}
          onClose={() => setViewingProfileArtisan(null)}
          onOpenCollaboration={(artisan) => handleOpenCollabModal(artisan)}
        />
      )}

      {collabModalTarget && (
        <CollaborationRequestModal
          artisan={collabModalTarget}
          initialTitle={collabModalInitialTitle}
          initialMessage={collabModalInitialMessage}
          initialType={collabModalInitialType}
          onClose={() => setCollabModalTarget(null)}
        />
      )}
    </div>
  );
};

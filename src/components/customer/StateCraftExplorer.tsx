import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ShieldCheck,
  Award,
  AlertTriangle,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface StateHeritageEntry {
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  craftsCount: number;
  featuredCrafts: string[];
  giRegistrations: string[];
  endangeredStatus: 'Thriving' | 'Vulnerable' | 'Critically Endangered';
  registeredArtisanFamilies: number;
  description: string;
}

export const STATE_HERITAGE_DATA: StateHeritageEntry[] = [
  {
    state: 'Telangana',
    region: 'South',
    craftsCount: 16,
    featuredCrafts: ['Pochampally Double Ikat', 'Cheriyal Scroll Painting', 'Pembarthi Sheet Metal', 'Gadwal Sarees'],
    giRegistrations: ['GI-2005-TS-0004', 'GI-2007-TS-0070', 'GI-2010-TS-0182'],
    endangeredStatus: 'Vulnerable',
    registeredArtisanFamilies: 42000,
    description: 'Renowned for mathematical double ikat tie-dyed silks, brass temple repoussé metalcraft, and narrative scroll paintings on khadi cloth.',
  },
  {
    state: 'Uttar Pradesh',
    region: 'North',
    craftsCount: 34,
    featuredCrafts: ['Varanasi Zari & Brocade', 'Lucknow Chikankari', 'Moradabad Metalcraft', 'Bhadohi Hand-Knotted Carpets'],
    giRegistrations: ['GI-2009-UP-0044', 'GI-2008-UP-0119', 'GI-2014-UP-0433'],
    endangeredStatus: 'Thriving',
    registeredArtisanFamilies: 185000,
    description: 'Epicenter of royal Mughal and temple silk brocades, delicate white-on-white shadow embroidery, and lost-wax brassware.',
  },
  {
    state: 'Rajasthan',
    region: 'North',
    craftsCount: 22,
    featuredCrafts: ['Jaipur Blue Pottery', 'Sanganeri Block Print', 'Molela Terracotta Plaque', 'Kota Doria'],
    giRegistrations: ['GI-2008-RJ-0083', 'GI-2009-RJ-0118', 'GI-2007-RJ-0089'],
    endangeredStatus: 'Thriving',
    registeredArtisanFamilies: 110000,
    description: 'Vibrant land of non-clay glazed turquoise ceramics, wooden mud-resist block printing, and clay votive plaques of local deities.',
  },
  {
    state: 'Gujarat',
    region: 'West',
    craftsCount: 19,
    featuredCrafts: ['Kutch Ajrakh Block Print', 'Patan Patola Double Ikat', 'Tangaliya Shawl Weaving', 'Rogan Art'],
    giRegistrations: ['GI-2011-GJ-0211', 'GI-2013-GJ-0232', 'GI-2012-GJ-0226'],
    endangeredStatus: 'Vulnerable',
    registeredArtisanFamilies: 65000,
    description: 'Ancient desert textile traditions from Indus Valley lineage, castor-oil based Rogan painting, and 16-stage natural indigo mud resist.',
  },
  {
    state: 'Bihar',
    region: 'East',
    craftsCount: 14,
    featuredCrafts: ['Mithila / Madhubani Painting', 'Sikki Grass Craft', 'Bhagalpur Tussar Silk', 'Sujani Kantha Embroidery'],
    giRegistrations: ['GI-2007-BR-0074', 'GI-2007-BR-0075', 'GI-2012-BR-0219'],
    endangeredStatus: 'Thriving',
    registeredArtisanFamilies: 58000,
    description: 'Ecological ritual folk painting executed with bamboo twigs and botanical pigments, alongside golden Sikki grass basketry.',
  },
  {
    state: 'Karnataka',
    region: 'South',
    craftsCount: 25,
    featuredCrafts: ['Channapatna Lacquer Toys', 'Bidriware Silver Inlay', 'Mysore Silk Weaving', 'Kinhal Woodcraft'],
    giRegistrations: ['GI-2006-KA-0023', 'GI-2006-KA-0019', 'GI-2005-KA-0029'],
    endangeredStatus: 'Vulnerable',
    registeredArtisanFamilies: 78000,
    description: 'Home of child-safe natural plant lacquer lathe-turned toys and dramatic jet-black alloy inlaid with pure 99.9% fine silver wire.',
  },
  {
    state: 'Jammu & Kashmir',
    region: 'North',
    craftsCount: 11,
    featuredCrafts: ['Kashmir Pashmina', 'Kani Jamawar Shawl', 'Papier Mâché', 'Walnut Wood Carving'],
    giRegistrations: ['GI-2008-JK-0046', 'GI-2008-JK-0047', 'GI-2011-JK-0199'],
    endangeredStatus: 'Critically Endangered',
    registeredArtisanFamilies: 35000,
    description: 'Ultra-fine 13-micron Himalayan Changthangi goat fleece spun on wooden Charkhas and guided by coded Talim calligraphy scripts.',
  },
  {
    state: 'Assam',
    region: 'Northeast',
    craftsCount: 12,
    featuredCrafts: ['Assam Cane & Bamboo', 'Muga Golden Silk', 'Eri Peace Silk', 'Sitalpati Cold Mats'],
    giRegistrations: ['GI-2021-AS-0689', 'GI-2007-AS-0055', 'GI-2019-AS-0599'],
    endangeredStatus: 'Vulnerable',
    registeredArtisanFamilies: 48000,
    description: 'Lush biodiversity yielding natural golden Muga silk that shines brighter with every wash, paired with sustainable cane living architecture.',
  },
  {
    state: 'West Bengal',
    region: 'East',
    craftsCount: 21,
    featuredCrafts: ['Bankura Terracotta', 'Baluchari Silk Saree', 'Purulia Chhau Mask', 'Shantiniketan Leather'],
    giRegistrations: ['GI-2018-WB-0245', 'GI-2011-WB-0201', 'GI-2018-WB-0588'],
    endangeredStatus: 'Thriving',
    registeredArtisanFamilies: 92000,
    description: 'Votive clay Bankura horses, mythological woven Baluchari tapestry narratives, and papier-mâché tribal dance masks.',
  },
  {
    state: 'Chhattisgarh',
    region: 'Central',
    craftsCount: 9,
    featuredCrafts: ['Bastar Dhokra Bell Metal', 'Bastar Wooden Mask', 'Bastar Wrought Iron'],
    giRegistrations: ['GI-2008-CG-0085', 'GI-2008-CG-0086', 'GI-2008-CG-0087'],
    endangeredStatus: 'Critically Endangered',
    registeredArtisanFamilies: 18000,
    description: 'Ancestral 4,500-year-old lost-wax tribal metallurgy preserving primordial reverence for forest spirits and deities.',
  },
];

export const StateCraftExplorer: React.FC = () => {
  const { crafts, setSelectedCraft, setActiveRegionFilter, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('Telangana');

  const filteredStates = STATE_HERITAGE_DATA.filter(
    (s) =>
      s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.featuredCrafts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentState = STATE_HERITAGE_DATA.find((s) => s.state === selectedStateName) || STATE_HERITAGE_DATA[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <MapPin className="w-4 h-4" />
            <span>{t('NATIONAL GEOGRAPHICAL INDICATIONS DIRECTORY')}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            {t('State-by-State Living Heritage Explorer')}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            {t('Explore India’s official GI-certified craft clusters, preservation vulnerability ratings, and master artisan cooperatives across every state.')}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('Search state, craft or GI tag...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-outline/30 rounded-full text-on-surface focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of States */}
        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {filteredStates.map((st) => (
            <button
              key={st.state}
              onClick={() => setSelectedStateName(st.state)}
              className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                selectedStateName === st.state
                  ? 'border-primary bg-primary/10 shadow-xs'
                  : 'border-outline/20 bg-surface hover:bg-surface-container'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-on-surface">
                    {st.state}
                  </span>
                  <span className="text-[10px] text-on-surface-variant px-2 py-0.2 rounded-md bg-surface-container">
                    {st.region}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                  {st.featuredCrafts.join(', ')}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-primary block">
                  {st.craftsCount} {t('GI Crafts')}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    st.endangeredStatus === 'Critically Endangered'
                      ? 'text-red-700'
                      : st.endangeredStatus === 'Vulnerable'
                      ? 'text-amber-700'
                      : 'text-green-700'
                  }`}
                >
                  {t(st.endangeredStatus)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Detail Pane for Current State */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-surface border border-outline/20 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                  {currentState.region.toUpperCase()} CLUSTER
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    currentState.endangeredStatus === 'Critically Endangered'
                      ? 'bg-red-100 text-red-800'
                      : currentState.endangeredStatus === 'Vulnerable'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  Preservation Status: {currentState.endangeredStatus}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                {currentState.state}
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                Artisan Lineage Families
              </span>
              <span className="font-serif text-xl font-bold text-primary">
                {currentState.registeredArtisanFamilies.toLocaleString('en-IN')}+
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {currentState.description}
          </p>

          {/* Featured GI Crafts in this state */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-on-surface">
              Featured GI-Certified Crafts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentState.featuredCrafts.map((craftName, idx) => {
                const matchedAppCraft = crafts.find(
                  (c) => c.name.toLowerCase().includes(craftName.toLowerCase().split(' ')[0])
                );

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-xs text-on-surface">
                        {craftName}
                      </h5>
                      <span className="text-[10px] font-mono text-primary">
                        {currentState.giRegistrations[idx] || 'GOI Registered'}
                      </span>
                    </div>

                    {matchedAppCraft && (
                      <button
                        onClick={() => setSelectedCraft(matchedAppCraft)}
                        className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary hover:text-on-primary transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Region Filter Link */}
          <div className="pt-2 border-t border-outline/10 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Want to see all products from this geographical region?
            </span>
            <button
              onClick={() => {
                setActiveRegionFilter(currentState.region);
                const el = document.getElementById('marketplace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>View {currentState.region} Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

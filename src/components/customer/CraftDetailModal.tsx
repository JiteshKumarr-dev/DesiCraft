import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Award,
  MapPin,
  Clock,
  Layers,
  Scroll,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const CraftDetailModal: React.FC = () => {
  const { selectedCraft, setSelectedCraft, products, setSelectedProduct } = useApp();

  if (!selectedCraft) return null;

  const matchingProducts = products.filter(
    (p) => p.craft_id === selectedCraft.id && p.status === 'PUBLISHED'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setSelectedCraft(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image & GI Tag */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={selectedCraft.image_url}
            alt={selectedCraft.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                GI TAG CERTIFIED
              </span>
              <span className="text-xs font-mono bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                {selectedCraft.gi_tag}
              </span>
              <span className="text-xs bg-secondary/80 text-white px-2.5 py-0.5 rounded-md">
                {selectedCraft.region} India • {selectedCraft.state}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {selectedCraft.name}
            </h2>
          </div>
        </div>

        {/* Craft Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-on-surface leading-relaxed">
            {selectedCraft.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-2">
              <span className="font-serif font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase">
                <Clock className="w-4 h-4 text-primary" /> Historical Lineage & Origin
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                {selectedCraft.origin}
              </p>
              <p className="text-[11px] text-on-surface leading-relaxed pt-1">
                {selectedCraft.history}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-2">
              <span className="font-serif font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase">
                <BookOpen className="w-4 h-4 text-secondary" /> Cultural Significance
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                {selectedCraft.cultural_significance}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-3">
            <span className="font-serif font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase">
              <Scroll className="w-4 h-4 text-primary" /> Traditional Handcraft Techniques
            </span>
            <p className="text-xs text-on-surface leading-relaxed">
              {selectedCraft.traditional_techniques}
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-serif font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase">
              <Layers className="w-4 h-4 text-secondary" /> Authentic Indigenous Raw Materials
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedCraft.materials.map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs bg-surface-container border border-outline/20 font-medium text-on-surface"
                >
                  ✦ {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Masterpieces from this Craft */}
          {matchingProducts.length > 0 && (
            <div className="pt-4 border-t border-outline/20 space-y-3">
              <h3 className="font-serif text-sm font-bold text-on-surface">
                Certified Masterpieces Available ({matchingProducts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedCraft(null);
                      setSelectedProduct(prod);
                    }}
                    className="flex gap-3 p-3 rounded-xl bg-surface-container-low border border-outline/20 hover:border-primary transition cursor-pointer"
                  >
                    <img
                      src={prod.primary_image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <h4 className="font-serif text-xs font-bold text-on-surface line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-primary">By {prod.artisan_name}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-xs text-on-surface">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

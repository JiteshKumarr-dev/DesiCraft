import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Award,
  Sparkles,
  MessageCircle,
  Clock,
  Layers,
  MapPin,
  CheckCircle,
  SunMedium,
  Check,
} from 'lucide-react';

import { ProductReviewsSection } from './ProductReviewsSection';
import { DemandPredictorWidget } from './DemandPredictorWidget';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    passports,
    setSelectedPassport,
    openChatWith,
    artisans,
    setIsCustomOrderModalOpen,
    setIsCartOpen,
    t,
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isStudioLightingOn, setIsStudioLightingOn] = useState(true);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const matchedPassport = passports.find((p) => p.id === selectedProduct.passport_id) || passports[0];
  const matchedArtisan = artisans.find((a) => a.id === selectedProduct.artisan_id) || {
    id: selectedProduct.artisan_id,
    name: selectedProduct.artisan_name,
    avatar: selectedProduct.artisan_avatar,
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, 1);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Left Column: Image Gallery & Studio Lighting Toggle */}
          <div className="space-y-4" data-guide="product-gallery">
            <div className="relative rounded-2xl overflow-hidden aspect-square border border-outline/20 bg-surface-container-low shadow-sm">
              <img
                src={selectedProduct.images[activeImageIdx] || selectedProduct.primary_image}
                alt={selectedProduct.name}
                className={`w-full h-full object-cover transition duration-300 ${
                  isStudioLightingOn ? 'filter brightness-105 contrast-105 saturate-110' : 'filter brightness-90 contrast-95'
                }`}
              />

              {/* Studio Lighting AI Toggle */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 text-white text-[11px] font-medium border border-white/20">
                <SunMedium className={`w-3.5 h-3.5 ${isStudioLightingOn ? 'text-amber-400' : 'text-gray-400'}`} />
                <span>Studio Lighting:</span>
                <button
                  type="button"
                  onClick={() => setIsStudioLightingOn(!isStudioLightingOn)}
                  className="underline font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer"
                >
                  {isStudioLightingOn ? 'ON (Studio View)' : 'OFF (Raw Loom)'}
                </button>
              </div>

              {/* GI Tag Badge */}
              <div className="absolute bottom-3 left-3 bg-primary/90 text-on-primary backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                <span>{selectedProduct.gi_tag}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {selectedProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                      activeImageIdx === idx ? 'border-primary' : 'border-outline/20 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Digital Craft Passport Callout Card */}
            <div data-guide="gi-passport-badge" className="p-4 rounded-xl bg-surface-container-low border border-primary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-on-surface">
                    Digital Craft Passport Attached
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Verifiable cryptographic record of master lineage
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPassport(matchedPassport);
                }}
                className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary/10 transition cursor-pointer"
              >
                Inspect Passport
              </button>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {selectedProduct.craft_name} • {selectedProduct.region} India
                </span>
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-2 rounded-full border transition cursor-pointer ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-outline/20 text-on-surface-variant hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
                {selectedProduct.name}
              </h1>

              {/* Price & Fair Wage Indicator */}
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="font-serif text-3xl font-bold text-primary">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-md font-semibold border border-green-200">
                  82% Direct Artisan Wage Guaranteed
                </span>
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800 flex items-center gap-1">
                  🔥 High Demand
                </span>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Craft Technique & Production Time Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline/20">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">
                    Handcraft Technique
                  </span>
                  <span className="font-medium text-on-surface mt-0.5 block">
                    {selectedProduct.technique}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-outline/20">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">
                    Time on Traditional Loom
                  </span>
                  <span className="font-medium text-on-surface mt-0.5 block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {selectedProduct.production_time}
                  </span>
                </div>
              </div>

              {/* AI Demand Predictor Widget */}
              <div data-guide="demand-badge">
                <DemandPredictorWidget product={selectedProduct} />
              </div>

              {/* Indigenous Materials */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-on-surface">Indigenous Pure Materials:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md text-xs bg-surface-container border border-outline/20 text-on-surface"
                    >
                      ✦ {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Artisan Profile Snippet */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.artisan_avatar}
                    alt={selectedProduct.artisan_name}
                    className="w-11 h-11 rounded-full object-cover border border-primary/30"
                  />
                  <div>
                    <h5 className="font-serif font-bold text-xs text-on-surface flex items-center gap-1">
                      {selectedProduct.artisan_name}
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </h5>
                    <p className="text-[11px] text-on-surface-variant">
                      {selectedProduct.artisan_guild}
                    </p>
                  </div>
                </div>

                {/* Multilingual Chat Button */}
                <button
                  onClick={() => {
                    openChatWith({
                      id: selectedProduct.artisan_id,
                      name: selectedProduct.artisan_name,
                      avatar: selectedProduct.artisan_avatar,
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 transition cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat in Your Language</span>
                </button>
              </div>

              {/* Verified Connoisseur Reviews */}
              <ProductReviewsSection />
            </div>

            {/* Action Buttons */}
            <div data-guide="order-actions" className="space-y-2 pt-4 border-t border-outline/20">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(selectedProduct, 1)}
                  className="py-3 px-4 rounded-full border border-primary text-primary font-bold text-xs sm:text-sm hover:bg-primary/10 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.buyNow}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsCustomOrderModalOpen(true);
                }}
                className="w-full py-2 px-3 text-center text-xs text-on-surface-variant hover:text-primary transition font-medium cursor-pointer"
              >
                Want custom colors or sizes? <u>Request a Bespoke Commission from this Artisan</u>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

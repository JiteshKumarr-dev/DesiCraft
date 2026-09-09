import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Sparkles, X, Heart, Check, ArrowRight } from 'lucide-react';

export const GiftModeModal: React.FC = () => {
  const { isGiftModeModalOpen, setIsGiftModeModalOpen, products, addToCart, showNotification } = useApp();

  const [occasion, setOccasion] = useState('Festive & Diwali');
  const [recipient, setRecipient] = useState('Family / Elders');
  const [budget, setBudget] = useState('₹5,000 – ₹10,000');
  const [calligraphyNote, setCalligraphyNote] = useState('Wishing you divine blessings, warmth, and prosperity from the master artisans of Bharat.');
  const [giftBoxStyle, setGiftBoxStyle] = useState('Raw Silk Box with Zari Ribbon');

  if (!isGiftModeModalOpen) return null;

  const occasions = ['Festive & Diwali', 'Indian Wedding Gift', 'Griha Pravesh (Housewarming)', 'Corporate Heritage Gifting'];
  const recipients = ['Family / Elders', 'Art & Textile Connoisseur', 'Colleague / Partner', 'New Homeowner'];
  const budgets = ['Under ₹3,000', '₹3,000 – ₹6,000', '₹6,000 – ₹12,000', 'Luxury Heirloom (₹12,000+)'];

  // Curate products matching selection
  const curatedHampers = products.slice(0, 3);

  const handleAddHamper = (product: any) => {
    addToCart(product, 1);
    showNotification(`Added gift-wrapped ${product.name} to cart with artisan calligraphy note!`);
    setIsGiftModeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <div className="h-2.5 bg-gradient-to-r from-secondary via-primary to-secondary" />

        <button
          onClick={() => setIsGiftModeModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                CURATED ARTISAN GIFTING
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Handmade Heritage Gift Mode
              </h2>
              <p className="text-xs text-on-surface-variant">
                Gift something imbued with living soul, cultural lineage, and handcrafted mastery.
              </p>
            </div>
          </div>

          {/* Occasion Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface">Select Occasion</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`py-2 px-2.5 text-xs rounded-lg border text-center transition cursor-pointer ${
                    occasion === occ
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-outline/20 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface">Recipient Profile</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              >
                {recipients.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface">Budget Tier</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              >
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Packaging & Handwritten Calligraphy Note */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-on-surface">
                Artisan Handwritten Note (Included Free)
              </span>
              <span className="text-[10px] text-primary font-medium">Hand-lettered with natural ink</span>
            </div>
            <textarea
              rows={2}
              value={calligraphyNote}
              onChange={(e) => setCalligraphyNote(e.target.value)}
              className="w-full p-2.5 text-xs bg-surface border border-outline/30 rounded-lg font-serif italic text-on-surface"
            />
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Packaging: <strong>{giftBoxStyle}</strong></span>
              <span className="text-secondary font-semibold">Includes Official GI Seal Wax Stamp</span>
            </div>
          </div>

          {/* Recommended Heritage Gifts */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-on-surface">
              Curated Masterpiece Recommendations for {occasion}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {curatedHampers.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-xl border border-outline/20 bg-surface overflow-hidden flex flex-col justify-between"
                >
                  <img
                    src={prod.primary_image}
                    alt={prod.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] text-primary font-medium block">
                        {prod.craft_name}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-on-surface line-clamp-1">
                        {prod.name}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-outline/10">
                      <span className="font-bold text-xs text-on-surface">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleAddHamper(prod)}
                        className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-semibold hover:bg-primary/90 transition cursor-pointer"
                      >
                        Select Gift
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

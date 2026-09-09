import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Palette, Calendar, DollarSign, Send } from 'lucide-react';

export const CustomOrderModal: React.FC = () => {
  const { isCustomOrderModalOpen, setIsCustomOrderModalOpen, crafts, createCustomOrder } = useApp();

  const [craftName, setCraftName] = useState(crafts[0]?.name || 'Varanasi Zari & Brocade');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(25000);
  const [deadline, setDeadline] = useState('2026-05-15');
  const [materialPreference, setMaterialPreference] = useState('Pure Mulberry Silk with Real Silver Zari');

  if (!isCustomOrderModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createCustomOrder({
      customer_id: 'user-heirloom-001',
      customer_name: 'Devi Prasad Sharma',
      craft_name: craftName,
      description,
      budget_min: Number(budgetMin),
      budget_max: Number(budgetMax),
      deadline,
      material_preference: materialPreference,
    });

    setIsCustomOrderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsCustomOrderModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                BESPOKE ARTISAN COMMISSIONS
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Commission Custom Handcraft
              </h2>
              <p className="text-xs text-on-surface-variant">
                Directly engage a master weaver or artisan for unique bespoke work.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface">Target Craft Tradition</label>
            <select
              value={craftName}
              onChange={(e) => setCraftName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
            >
              {crafts.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Describe Your Vision, Colors & Dimensions
            </label>
            <textarea
              rows={3}
              required
              placeholder="E.g., I would like a bridal Kadwa brocade saree in midnight blue with silver lotus motifs, 6.2 meters in length..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface">Material & Fiber Preference</label>
            <input
              type="text"
              required
              value={materialPreference}
              onChange={(e) => setMaterialPreference(e.target.value)}
              placeholder="E.g., Pure Katan Silk, Organic Indigo, Teakwood"
              className="w-full px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">Min Budget (₹)</label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">Max Budget (₹)</label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Required Delivery Target
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Commission Request to Master Artisans</span>
          </button>
        </form>
      </div>
    </div>
  );
};

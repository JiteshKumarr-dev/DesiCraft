import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ShieldCheck,
  X,
  CheckCircle,
  Building2,
  CreditCard,
  MapPin,
  Sparkles,
  Save,
} from 'lucide-react';

interface EditArtisanProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditArtisanProfileModal: React.FC<EditArtisanProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, showNotification } = useApp();

  const artisan = user.artisan_profile;

  const [name, setName] = useState(artisan?.name || user.name);
  const [bio, setBio] = useState(artisan?.bio || '');
  const [experienceYears, setExperienceYears] = useState(artisan?.experience_years || 24);
  const [guildName, setGuildName] = useState(artisan?.guild_name || 'Kashi Bunakar Vankar Cooperative Society');
  const [state, setState] = useState(artisan?.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState(artisan?.district || 'Varanasi');
  const [pehchanCardId, setPehchanCardId] = useState('UP-VAR-102948');
  const [bankUpi, setBankUpi] = useState('artisan.rajesh@okaxis');
  const [visitationOpen, setVisitationOpen] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Artisan Studio profile & Pehchan verification credentials updated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                STUDIO CREDENTIALS
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Edit Artisan Profile & Pehchan Card
              </h2>
              <p className="text-xs text-on-surface-variant">
                Manage your government credentials, guild registration, and direct DBT bank accounts.
              </p>
            </div>
          </div>

          {/* Name & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-on-surface">Master Artisan Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Years of Mastery</label>
              <input
                type="number"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Artisan Studio Narrative & Lineage</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 text-xs bg-surface-container-low border border-outline/30 rounded-lg leading-relaxed"
            />
          </div>

          {/* Guild & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Registered Guild / SHG Name</label>
              <input
                type="text"
                required
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">District & Cluster</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
              />
            </div>
          </div>

          {/* Pehchan Card & Bank Account */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Government Identity & Direct DBT Transfer Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">
                  Ministry of Textiles Pehchan Card Number
                </label>
                <input
                  type="text"
                  required
                  value={pehchanCardId}
                  onChange={(e) => setPehchanCardId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-surface border border-outline/30 rounded-lg font-mono font-bold text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">
                  Direct Payment UPI VPA ID
                </label>
                <input
                  type="text"
                  required
                  value={bankUpi}
                  onChange={(e) => setBankUpi(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-surface border border-outline/30 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Tourism & Visitation Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline/20 text-xs">
            <div>
              <span className="font-semibold text-on-surface block">Cultural Heritage Loom Tourism</span>
              <span className="text-[11px] text-on-surface-variant">
                Allow patrons to book verified studio visits and live loom demonstrations.
              </span>
            </div>
            <input
              type="checkbox"
              checked={visitationOpen}
              onChange={(e) => setVisitationOpen(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Artisan Studio Profile & Credentials</span>
          </button>
        </form>
      </div>
    </div>
  );
};

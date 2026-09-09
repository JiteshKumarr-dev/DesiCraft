import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User as UserIcon,
  ArrowLeftRight,
  ShieldCheck,
  Package,
  Award,
  Sparkles,
  MapPin,
  Heart,
  Globe,
  LogOut,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    activeMode,
    toggleMode,
    orders,
    wishlist,
    language,
    setIsLanguagePopupOpen,
    logoutUser,
    setIsAuthModalOpen,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-xl font-bold font-serif">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-on-surface">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                  VERIFIED PATRON & ARTISAN
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{user.email}</p>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Hyderabad, Telangana / Varanasi, UP</span>
              </div>
            </div>
          </div>

          {/* One Account Dual Mode Switch Banner */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  ONE ACCOUNT → DUAL MODES
                </span>
                <p className="text-sm font-bold text-on-surface">
                  Currently in: <span className="text-primary">{activeMode === 'CUSTOMER' ? 'Heritage Marketplace' : 'Artisan Studio'}</span>
                </p>
              </div>
              <button
                onClick={toggleMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Switch to {activeMode === 'CUSTOMER' ? 'Artisan Studio' : 'Marketplace'}</span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              You do not need multiple logins. Sell handcrafted masterpieces and commission bespoke works from fellow artisans from the same account.
            </p>
          </div>

          {/* Living Heritage Impact Score */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-surface-container border border-outline/20">
              <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                Direct Wage Impact
              </span>
              <span className="font-serif text-lg font-bold text-primary">₹18,900</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-outline/20">
              <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                Lineages Backed
              </span>
              <span className="font-serif text-lg font-bold text-on-surface">3 Guilds</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-outline/20">
              <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                GI Passports Held
              </span>
              <span className="font-serif text-lg font-bold text-secondary">2 Verified</span>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-on-surface flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Active Orders ({orders.length})
            </h3>
            <div className="space-y-2">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-xl bg-surface-container-low border border-outline/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-on-surface">{o.id}</span>
                    <p className="text-[11px] text-on-surface-variant">
                      {o.items[0]?.product_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {o.order_status}
                    </span>
                    <p className="text-[11px] font-semibold text-on-surface mt-1">
                      ₹{o.total_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Language Manager */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-primary" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                  INTERFACE LANGUAGE
                </span>
                <span className="font-serif font-bold text-xs text-on-surface">
                  {language.toUpperCase()} (Selected)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                setIsLanguagePopupOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg border border-primary/40 bg-surface text-primary text-xs font-semibold hover:bg-primary/10 transition cursor-pointer"
            >
              Change Language
            </button>
          </div>

          {/* Master Artisan Credentials */}
          {user.artisan_profile && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-on-surface">
                <Award className="w-4 h-4 text-secondary" />
                <span>Affiliated Guild & Artisan Profile</span>
              </div>
              <p className="text-xs text-on-surface">
                <strong>{user.artisan_profile.guild_name}</strong> • {user.artisan_profile.experience_years} Years Experience
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Craft Specialty: {user.artisan_profile.craft_name} ({user.artisan_profile.district}, {user.artisan_profile.state})
              </p>
            </div>
          )}

          {/* Account Actions / Logout */}
          <div className="pt-2 border-t border-outline/15 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Switch Account / Demo Logins
            </button>

            <button
              onClick={() => {
                logoutUser();
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

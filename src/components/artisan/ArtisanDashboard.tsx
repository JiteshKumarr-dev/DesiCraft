import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  Mic,
  DollarSign,
  SunMedium,
  Handshake,
  TrendingUp,
  Building2,
  Package,
  Layers,
  Award,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { CollaborationHub } from './CollaborationHub';
import { DemandPulse } from './DemandPulse';
import { GovernmentNavigator } from './GovernmentNavigator';
import { EditArtisanProfileModal } from './EditArtisanProfileModal';
import { StudioAnalytics } from './StudioAnalytics';

export const ArtisanDashboard: React.FC = () => {
  const {
    user,
    orders,
    updateOrderStatus,
    products,
    deleteProduct,
    passports,
    setSelectedPassport,
    setIsVoiceCreatorOpen,
    setIsPriceAdvisorOpen,
    setIsPhotoEnhancerOpen,
    customOrders,
    updateCustomOrderStatus,
    openChatWith,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'COMMISSIONS' | 'CATALOG' | 'ANALYTICS' | 'COLLAB' | 'DEMAND' | 'GOVT'>('ORDERS');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Filter products by artisan user
  const myProducts = products.filter(
    (p) => p.artisan_id === user.id || p.artisan_id === 'artisan-rajesh-varanasi'
  );

  const totalEarnings = orders.reduce((sum, o) => sum + o.total_price, 0);

  const orderStatuses: OrderStatus[] = ['ORDERED', 'ACCEPTED', 'PREPARING', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Studio Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-high border border-outline/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-on-primary uppercase tracking-wider">
              ARTISAN STUDIO COMMAND CENTER
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              Varanasi Weaving Cluster
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
            Welcome, {user.name}
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Guild: <strong>{user.artisan_profile?.guild_name || 'Kashi Bunakar Vankar Cooperative'}</strong> • Manage looms, verify digital craft passports, and create listings with your voice.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-3 rounded-full border border-primary/40 bg-surface text-primary text-xs font-bold hover:bg-primary/10 transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Pehchan & Studio Credentials</span>
          </button>

          {/* Quick Voice Creator Button */}
          <button
            onClick={() => setIsVoiceCreatorOpen(true)}
            className="px-6 py-3.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{t.voiceProductListing}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              {t.activeOrders}
            </span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface">{orders.length}</p>
          <span className="text-[11px] text-green-700 font-medium">100% on-time fulfillment</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              {t.totalEarnings}
            </span>
            <DollarSign className="w-4 h-4 text-green-700" />
          </div>
          <p className="font-serif text-2xl font-bold text-primary">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-on-surface-variant">Direct to Bank / UPI</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              GI Passports Minted
            </span>
            <Award className="w-4 h-4 text-secondary" />
          </div>
          <p className="font-serif text-2xl font-bold text-secondary">{passports.length}</p>
          <span className="text-[11px] text-secondary font-medium">Cryptographically Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">
              Heritage Impact Score
            </span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface">99.4 / 100</p>
          <span className="text-[11px] text-primary font-medium">Master Artisan Tier</span>
        </div>
      </div>

      {/* Studio Tool Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setIsVoiceCreatorOpen(true)}
          className="p-5 rounded-2xl bg-surface border border-primary/30 hover:border-primary transition shadow-xs text-left space-y-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-on-surface">
            Voice Product Creator
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Speak in any Indian language. AI creates listing specs, materials, and fair pricing.
          </p>
        </button>

        <button
          onClick={() => setIsPriceAdvisorOpen(true)}
          className="p-5 rounded-2xl bg-surface border border-outline/20 hover:border-primary transition shadow-xs text-left space-y-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-on-surface">
            AI Fair Price Advisor
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Calculate equitable prices covering labor hours, living wages, and GI lineage.
          </p>
        </button>

        <button
          onClick={() => setIsPhotoEnhancerOpen(true)}
          className="p-5 rounded-2xl bg-surface border border-outline/20 hover:border-primary transition shadow-xs text-left space-y-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
            <SunMedium className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-on-surface">
            Studio Lighting Enhancer
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Transform raw loom workshop photos into diffused studio-grade gallery shots.
          </p>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-outline/20 pb-3 no-scrollbar">
        {[
          { id: 'ORDERS', label: 'Active Loom Orders' },
          { id: 'COMMISSIONS', label: `Bespoke Commissions (${customOrders.length})` },
          { id: 'CATALOG', label: 'Loom Inventory & GI Passports' },
          { id: 'ANALYTICS', label: 'Analytics & DBT Payouts' },
          { id: 'COLLAB', label: 'Artisan Synergy Hub' },
          { id: 'DEMAND', label: 'Demand Pulse Intelligence' },
          { id: 'GOVT', label: 'PM Vishwakarma & Grants' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'COLLAB' ? (
        <CollaborationHub />
      ) : activeTab === 'DEMAND' ? (
        <DemandPulse />
      ) : activeTab === 'GOVT' ? (
        <GovernmentNavigator />
      ) : activeTab === 'COMMISSIONS' ? (
        /* Bespoke Customer Commissions */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">
                Incoming Bespoke Patron Commissions ({customOrders.length})
              </h3>
              <p className="text-xs text-on-surface-variant">
                Direct commission requests from patrons seeking custom handwoven or handcrafted masterpieces.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {customOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-on-surface">
                        {order.customer_name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      Target Craft: {order.craft_name}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-on-surface-variant">Patron Budget Range</span>
                    <p className="font-serif text-base font-bold text-primary">
                      ₹{order.budget_min.toLocaleString('en-IN')} – ₹{order.budget_max.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic bg-surface-container-low p-3.5 rounded-xl border border-outline/10">
                  "{order.description}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline/10">
                    <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                      Preferred Indigenous Materials:
                    </span>
                    <span className="font-medium text-on-surface mt-0.5 block">
                      {order.material_preference}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline/10">
                    <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                      Required Delivery Deadline:
                    </span>
                    <span className="font-medium text-on-surface mt-0.5 block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {new Date(order.deadline).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      openChatWith({
                        id: order.customer_id,
                        name: order.customer_name,
                      })
                    }
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Chat with Patron in Mother Tongue
                  </button>

                  <div className="flex items-center gap-2">
                    {order.status === 'OPEN' && (
                      <button
                        onClick={() => updateCustomOrderStatus(order.id, 'ACCEPTED')}
                        className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
                      >
                        Accept & Commit to Loom
                      </button>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <span className="text-green-700 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Commission Active on Loom
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'CATALOG' ? (
        /* Inventory and Passports */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-on-surface">
              Active Handcrafted Inventory ({myProducts.length})
            </h3>
            <button
              onClick={() => setIsVoiceCreatorOpen(true)}
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add via Voice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProducts.map((prod) => {
              const passport = passports.find((p) => p.id === prod.passport_id) || passports[0];

              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-surface border border-outline/20 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.primary_image}
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-cover border border-outline/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-primary uppercase">
                        {prod.craft_name}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-on-surface line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="font-bold text-xs text-on-surface mt-1">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-sm font-semibold border border-green-200 inline-block mt-1">
                        {prod.gi_tag}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedPassport(passport)}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Passport QR</span>
                    </button>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="text-on-surface-variant hover:text-red-600 transition p-1 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'ANALYTICS' ? (
        <StudioAnalytics />
      ) : (
        /* Orders & Fulfillment Stepper */
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-on-surface">
            Active Loom Fulfillment ({orders.length})
          </h3>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-surface border border-outline/20 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-on-surface">
                        {order.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        {order.order_status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Customer: <strong>{order.customer_name}</strong> ({order.shipping_address.city}, {order.shipping_address.state})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-on-surface-variant">Order Value</span>
                    <p className="font-serif text-lg font-bold text-primary">
                      ₹{order.total_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                    Loom Stage Progress:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
                    {orderStatuses.map((st, idx) => {
                      const currentIdx = orderStatuses.indexOf(order.order_status);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(order.id, st)}
                          className={`p-2 rounded-xl text-[10px] sm:text-xs font-semibold border transition cursor-pointer ${
                            isCurrent
                              ? 'bg-primary text-on-primary border-primary shadow-xs'
                              : isComplete
                              ? 'bg-green-50 text-green-800 border-green-300'
                              : 'bg-surface-container-low text-on-surface-variant border-outline/20 hover:bg-surface-container'
                          }`}
                        >
                          {isComplete && !isCurrent ? '✓ ' : ''}
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Shipping */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-on-surface-variant">
                    Item: <strong>{order.items[0]?.product_name}</strong>
                  </span>
                  <span className="font-mono text-primary">
                    Tracking: {order.tracking_id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Studio Profile Modal */}
      <EditArtisanProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

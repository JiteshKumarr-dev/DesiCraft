import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Product } from '../../types';
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
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  UserCheck,
  Edit3,
  EyeOff,
  MessageSquare,
} from 'lucide-react';
import { CollaborationDiscoveryPage } from './CollaborationDiscoveryPage';
import { SellerMessagesPage } from './SellerMessagesPage';
import { DemandPulse } from './DemandPulse';
import { GovernmentNavigator } from './GovernmentNavigator';
import { EditArtisanProfileModal } from './EditArtisanProfileModal';
import { StudioAnalytics } from './StudioAnalytics';
import { EditProductModal } from './EditProductModal';

export const ArtisanDashboard: React.FC = () => {
  const {
    user,
    orders,
    updateOrderStatus,
    products,
    deleteProduct,
    beginEditProduct,
    editingProduct,
    passports,
    setSelectedPassport,
    setIsVoiceCreatorOpen,
    setIsPriceAdvisorOpen,
    setIsPhotoEnhancerOpen,
    customOrders,
    updateCustomOrderStatus,
    openChatWith,
    sellerTab,
    setSellerTab,
    collaborationRequests,
    sellerConversations,
    t,
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState<Product | null>(null);

  // Filter products by artisan user
  const myProducts = products.filter(
    (p) => p.artisan_id === user.id || p.artisan_id === 'artisan-rajesh-varanasi'
  );

  const totalEarnings = orders.reduce((sum, o) => sum + o.total_price, 0);
  const orderStatuses: OrderStatus[] = ['ORDERED', 'ACCEPTED', 'PREPARING', 'SHIPPED', 'DELIVERED'];

  // Summary Counters for Collaboration
  const myId = user.artisan_profile?.id || user.id;
  const pendingRequestsCount = collaborationRequests.filter(
    (r) => r.receiver_artisan_id === myId && r.status === 'PENDING'
  ).length;

  const activeCollaborationsCount = collaborationRequests.filter(
    (r) => r.status === 'ACCEPTED' && (r.sender_artisan_id === myId || r.receiver_artisan_id === myId)
  ).length;

  const unreadMessagesCount = sellerConversations.reduce(
    (sum, c) => sum + (c.unread_counts[myId] || 0),
    0
  );

  const SELLER_NAV_ITEMS = [
    { id: 'DASHBOARD' as const, label: 'Dashboard', icon: LayoutDashboard, guide: 'seller-dashboard-tab' },
    { id: 'CATALOG' as const, label: 'My Products', icon: Package, guide: 'seller-products-tab' },
    { id: 'ORDERS' as const, label: 'Orders', icon: ShoppingBag, badge: orders.length, guide: 'seller-orders-tab' },
    { id: 'AISTUDIO' as const, label: 'AI Studio', icon: Sparkles, guide: 'seller-aistudio-tab' },
    { id: 'OPPORTUNITIES' as const, label: 'Opportunities', icon: Building2, guide: 'seller-opportunities-tab' },
    {
      id: 'COLLABORATE' as const,
      label: 'Collaborate',
      icon: Handshake,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      guide: 'seller-collaborate-tab',
    },
    {
      id: 'MESSAGES' as const,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      guide: 'seller-messages-tab',
    },
    { id: 'PROFILE' as const, label: 'Profile', icon: ShieldCheck, guide: 'seller-profile-tab' },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Studio Header Banner */}
      <div data-guide="artisan-welcome-card" className="p-6 sm:p-8 rounded-3xl bg-surface-container-high border border-outline/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-on-primary uppercase tracking-wider">
              {t('ARTISAN STUDIO COMMAND CENTER')}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {t('Varanasi Weaving Cluster')}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
            {t('Welcome')}, {user.name}
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            {t('Guild')}: <strong>{user.artisan_profile?.guild_name ? t(user.artisan_profile.guild_name) : t('Kashi Bunakar Vankar Cooperative Society')}</strong> • {t('Manage looms, verify digital craft passports, collaborate with fellow artisans, and create listings with your voice.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-3 rounded-full border border-primary/40 bg-surface text-primary text-xs font-bold hover:bg-primary/10 transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{t('Pehchan & Studio Credentials')}</span>
          </button>

          {/* Quick Voice Creator Button */}
          <button
            data-guide="voice-creator-trigger"
            onClick={() => setIsVoiceCreatorOpen(true)}
            className="px-6 py-3.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{t.voiceProductListing}</span>
          </button>
        </div>
      </div>

      {/* Unified Seller Mode Navigation Bar */}
      <div data-guide="seller-navigation" className="flex gap-2 overflow-x-auto border-b border-outline/20 pb-3 no-scrollbar">
        {SELLER_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = sellerTab === item.id;

          return (
            <button
              key={item.id}
              {...(item.guide ? { 'data-guide': item.guide } : {})}
              onClick={() => {
                if (item.id === 'PROFILE') {
                  setIsEditProfileOpen(true);
                } else {
                  setSellerTab(item.id);
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(item.label)}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB PANEL 1: DASHBOARD */}
      {sellerTab === 'DASHBOARD' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Metrics Row */}
          <div data-guide="artisan-metrics-row" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">
                  {t.activeOrders}
                </span>
                <Package className="w-4 h-4 text-primary" />
              </div>
              <p className="font-serif text-2xl font-bold text-on-surface">{orders.length}</p>
              <span className="text-[11px] text-green-700 font-medium">{t('100% on-time fulfillment')}</span>
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
              <span className="text-[11px] text-on-surface-variant">{t('Direct to Bank / UPI')}</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">
                  {t('GI Passports Minted')}
                </span>
                <Award className="w-4 h-4 text-secondary" />
              </div>
              <p className="font-serif text-2xl font-bold text-secondary">{passports.length}</p>
              <span className="text-[11px] text-secondary font-medium">{t('Cryptographically Verified')}</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-outline/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">
                  {t('Heritage Impact Score')}
                </span>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <p className="font-serif text-2xl font-bold text-on-surface">99.4 / 100</p>
              <span className="text-[11px] text-primary font-medium">{t('Master Artisan Tier')}</span>
            </div>
          </div>

          {/* SELLER DASHBOARD SUMMARY CARD: COLLABORATION */}
          <div data-guide="artisan-collab-summary" className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-surface to-surface-container border border-amber-500/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30">
                  <Handshake className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-on-surface">{t('Collaboration')}</h3>
                  <p className="text-xs text-on-surface-variant">
                    {t('Inter-craft partnerships, joint collections & direct messaging with creators')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSellerTab('COLLABORATE')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-primary text-white text-xs font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{t('Open Collaborations')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-outline/10">
              <button
                onClick={() => setSellerTab('COLLABORATE')}
                className="p-4 rounded-2xl bg-surface border border-outline/15 hover:border-amber-500/40 text-left transition-colors cursor-pointer group"
              >
                <span className="text-xs font-medium text-on-surface-variant block">{t('Pending Requests')}</span>
                <p className="text-2xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-1">
                  {pendingRequestsCount}
                </p>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold group-hover:underline inline-block mt-0.5">
                  {t('Review proposals →')}
                </span>
              </button>

              <button
                onClick={() => setSellerTab('COLLABORATE')}
                className="p-4 rounded-2xl bg-surface border border-outline/15 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group"
              >
                <span className="text-xs font-medium text-on-surface-variant block">{t('Active Collaborations')}</span>
                <p className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeCollaborationsCount}
                </p>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold group-hover:underline inline-block mt-0.5">
                  {t('View active work →')}
                </span>
              </button>

              <button
                onClick={() => setSellerTab('MESSAGES')}
                className="p-4 rounded-2xl bg-surface border border-outline/15 hover:border-primary/40 text-left transition-colors cursor-pointer group"
              >
                <span className="text-xs font-medium text-on-surface-variant block">{t('Unread Messages')}</span>
                <p className="text-2xl font-bold font-serif text-primary mt-1">
                  {unreadMessagesCount}
                </p>
                <span className="text-[10px] text-primary font-semibold group-hover:underline inline-block mt-0.5">
                  {t('Open chat inbox →')}
                </span>
              </button>
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
                {t('Voice Product Creator')}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('Speak in any Indian language. AI creates listing specs, materials, and fair pricing.')}
              </p>
            </button>

            <button
              data-guide="fair-price-advisor-trigger"
              onClick={() => setIsPriceAdvisorOpen(true)}
              className="p-5 rounded-2xl bg-surface border border-outline/20 hover:border-primary transition shadow-xs text-left space-y-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">
                {t('AI Fair Price Advisor')}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('Calculate equitable prices covering labor hours, living wages, and GI lineage.')}
              </p>
            </button>

            <button
              data-guide="ai-enhancer-trigger"
              onClick={() => setIsPhotoEnhancerOpen(true)}
              className="p-5 rounded-2xl bg-surface border border-outline/20 hover:border-primary transition shadow-xs text-left space-y-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                <SunMedium className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">
                {t('Studio Lighting Enhancer')}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('Transform raw loom workshop photos into diffused studio-grade gallery shots.')}
              </p>
            </button>
          </div>

          {/* Active Orders & Loom Fulfillment Preview */}
          <div className="space-y-4" data-guide="orders-management-section">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-on-surface">
                {t('Active Loom Fulfillment')} ({orders.length})
              </h3>
              <button
                onClick={() => setSellerTab('ORDERS')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                {t('View all orders')} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
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
                          {t(order.order_status)}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {t('Customer')}: <strong>{order.customer_name}</strong> ({order.shipping_address.city}, {order.shipping_address.state})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-on-surface-variant">{t('Order Value')}</span>
                      <p className="font-serif text-lg font-bold text-primary">
                        ₹{order.total_price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Status Stepper */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      {t('Loom Stage Progress:')}
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
                            {t(st)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items & Shipping */}
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-variant">
                      {t('Item')}: <strong>{order.items[0]?.product_name ? t(order.items[0].product_name) : ''}</strong>
                    </span>
                    <span className="font-mono text-primary">
                      {t('Tracking')}: {order.tracking_id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 2: MY PRODUCTS (CATALOG) */}
      {sellerTab === 'CATALOG' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-on-surface">
              {t('Active Handcrafted Inventory')} ({myProducts.length})
            </h3>
            <button
              onClick={() => setIsVoiceCreatorOpen(true)}
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('Add via Voice')}</span>
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
                        {t(prod.craft_name)}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-on-surface line-clamp-1">
                        {t(prod.name)}
                      </h4>
                      <p className="font-bold text-xs text-on-surface mt-1">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-sm font-semibold border border-green-200 inline-block">
                          {t(prod.gi_tag)}
                        </span>
                        {prod.status === 'EDITING' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-sm font-bold border border-amber-300 dark:border-amber-700">
                            <EyeOff className="w-3 h-3" />
                            <span>{t('Editing — Hidden from customers')}</span>
                          </span>
                        ) : prod.status === 'UNPUBLISHED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded-sm font-semibold border border-gray-300">
                            <span>{t('Unpublished')}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t('Published')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline/10 flex items-center justify-between text-xs gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedPassport(passport)}
                        className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{t('Passport')}</span>
                      </button>

                      <button
                        onClick={async () => {
                          setSelectedEditProduct(prod);
                          setIsEditModalOpen(true);
                          await beginEditProduct(prod.id);
                        }}
                        className="text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{prod.status === 'EDITING' ? t('Continue Editing') : t('Edit Product')}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="text-on-surface-variant hover:text-red-600 transition p-1 cursor-pointer"
                      title={t('Delete Product')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB PANEL 3: ORDERS & COMMISSIONS */}
      {sellerTab === 'ORDERS' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Loom Orders */}
          <div className="space-y-4" data-guide="orders-management-section">
            <h3 className="font-serif text-lg font-bold text-on-surface">
              {t('Active Loom Fulfillment')} ({orders.length})
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
                          {t(order.order_status)}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {t('Customer')}: <strong>{order.customer_name}</strong> ({order.shipping_address.city}, {order.shipping_address.state})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-on-surface-variant">{t('Order Value')}</span>
                      <p className="font-serif text-lg font-bold text-primary">
                        ₹{order.total_price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Status Stepper */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                      {t('Loom Stage Progress:')}
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
                            {t(st)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items & Shipping */}
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-variant">
                      {t('Item')}: <strong>{order.items[0]?.product_name ? t(order.items[0].product_name) : ''}</strong>
                    </span>
                    <span className="font-mono text-primary">
                      {t('Tracking')}: {order.tracking_id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bespoke Customer Commissions */}
          <div className="space-y-4 pt-6 border-t border-outline/15">
            <h3 className="font-serif text-lg font-bold text-on-surface">
              {t('Incoming Bespoke Patron Commissions')} ({customOrders.length})
            </h3>
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
                        {t('Target Craft')}: {t(order.craft_name || '')}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-on-surface-variant">{t('Patron Budget Range')}</span>
                      <p className="font-serif text-base font-bold text-primary">
                        ₹{order.budget_min.toLocaleString('en-IN')} – ₹{order.budget_max.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic bg-surface-container-low p-3.5 rounded-xl border border-outline/10">
                    "{order.description}"
                  </p>

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
                      {t('Chat with Patron in Mother Tongue')}
                    </button>

                    <div className="flex items-center gap-2">
                      {order.status === 'OPEN' && (
                        <button
                          onClick={() => updateCustomOrderStatus(order.id, 'ACCEPTED')}
                          className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
                        >
                          {t('Accept & Commit to Loom')}
                        </button>
                      )}
                      {order.status === 'ACCEPTED' && (
                        <span className="text-green-700 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {t('Commission Active on Loom')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 4: AI STUDIO */}
      {sellerTab === 'AISTUDIO' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Studio Tool Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setIsVoiceCreatorOpen(true)}
              className="p-6 rounded-3xl bg-surface border border-primary/30 hover:border-primary transition shadow-xs text-left space-y-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-on-surface">
                {t('Voice Product Creator')}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('Speak in any Indian language. AI creates listing specs, materials, and fair pricing.')}
              </p>
            </button>

            <button
              onClick={() => setIsPriceAdvisorOpen(true)}
              className="p-6 rounded-3xl bg-surface border border-outline/20 hover:border-primary transition shadow-xs text-left space-y-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-on-surface">
                {t('AI Fair Price Advisor')}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('Calculate equitable prices covering labor hours, living wages, and GI lineage.')}
              </p>
            </button>

            <button
              onClick={() => setIsPhotoEnhancerOpen(true)}
              className="p-6 rounded-3xl bg-surface border border-outline/20 hover:border-primary transition shadow-xs text-left space-y-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition">
                <SunMedium className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-on-surface">
                {t('Studio Lighting Enhancer')}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('Transform raw loom workshop photos into diffused studio-grade gallery shots.')}
              </p>
            </button>
          </div>

          <DemandPulse />
        </div>
      )}

      {/* TAB PANEL 5: OPPORTUNITIES & GOVERNMENT SCHEMES */}
      {sellerTab === 'OPPORTUNITIES' && (
        <div className="animate-fadeIn">
          <GovernmentNavigator />
        </div>
      )}

      {/* TAB PANEL 6: COLLABORATE WITH ARTISANS (NEW) */}
      {sellerTab === 'COLLABORATE' && (
        <div className="animate-fadeIn">
          <CollaborationDiscoveryPage />
        </div>
      )}

      {/* TAB PANEL 7: SELLER MESSAGES PAGE (NEW) */}
      {sellerTab === 'MESSAGES' && (
        <div className="animate-fadeIn">
          <SellerMessagesPage />
        </div>
      )}

      {/* Edit Studio Profile Modal */}
      <EditArtisanProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Edit Product Modal (Safe Editing Workflow) */}
      <EditProductModal
        product={selectedEditProduct || editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditProduct(null);
        }}
      />
    </div>
  );
};

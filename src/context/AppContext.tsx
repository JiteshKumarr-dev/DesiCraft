import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserMode,
  LanguageCode,
  Craft,
  Product,
  ArtisanProfile,
  DigitalCraftPassport,
  Opportunity,
  Order,
  OrderStatus,
  LearningRequest,
  CollaborationRequest,
  ChatMessage,
  CustomOrderRequest,
  Region,
  SellerConversation,
  SellerMessage,
  SellerMessageLocation,
  CollaborationType,
} from '../types';
import { craftsData } from '../data/craftsData';
import { artisansData } from '../data/artisansData';
import { productsData, passportsData } from '../data/productsData';
import { opportunitiesData } from '../data/opportunitiesData';
import { createTranslator, TranslateFn } from '../data/translations';
import { speechController, TOURS } from '../services/guidedHelpService';
import {
  AppRoute,
  getCurrentRoute,
  navigate,
  setIntendedDestination,
  getIntendedDestination,
  clearIntendedDestination,
} from '../services/router';
import {
  supabase,
  testSupabaseConnection,
  signUpWithSupabase,
  signInWithSupabase,
  signOutWithSupabase,
  fetchUserProfile,
  fetchSupabaseProducts,
  saveSupabaseProduct,
  deleteSupabaseProduct,
  beginProductEdit,
  updateProductSafely,
  cancelProductEdit,
  placeOrderSafely,
  fetchSupabasePassports,
  saveSupabasePassport,
  fetchSupabaseOrders,
  saveSupabaseOrder,
  updateSupabaseOrderStatus,
  fetchSupabaseLearningRequests,
  saveSupabaseLearningRequest,
  updateSupabaseLearningStatus,
  fetchSupabaseCustomOrders,
  saveSupabaseCustomOrder,
  updateSupabaseCustomOrderStatus,
  fetchSupabaseCollaborationRequests,
  saveSupabaseCollaborationRequest,
  updateSupabaseCollaborationStatus,
  fetchSupabaseChatMessages,
  saveSupabaseChatMessage,
  deleteSupabaseChatMessage,
  subscribeToSupabaseChat,
  fetchSupabaseSellerConversations,
  saveSupabaseSellerConversation,
  fetchSupabaseSellerMessages,
  saveSupabaseSellerMessage,
  deleteSupabaseSellerMessage,
  updateSupabaseSellerMessageRead,
  subscribeToSupabaseSellerMessages,
} from '../services/supabaseClient';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  // User & Mode
  user: User;
  setUser: (user: User) => void;
  activeMode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslateFn;

  // Data
  crafts: Craft[];
  products: Product[];
  artisans: ArtisanProfile[];
  passports: DigitalCraftPassport[];
  opportunities: Opportunity[];

  // Product Management (Artisan Studio)
  addProduct: (product: Product, passport?: DigitalCraftPassport) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  beginEditProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  saveProductEdit: (productId: string, newPrice: number, newDescription: string) => Promise<{ success: boolean; error?: string }>;
  cancelProductEditSession: (productId: string) => Promise<{ success: boolean; error?: string }>;

  // Cart & Wishlist (Customer Marketplace)
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    payment_method: 'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery';
    shipping_address: Order['shipping_address'];
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Learning & Workshops
  learningRequests: LearningRequest[];
  bookWorkshop: (request: Omit<LearningRequest, 'id' | 'created_at' | 'status'>) => void;
  updateLearningStatus: (id: string, status: LearningRequest['status']) => void;

  // Custom Bespoke Commissions
  customOrders: CustomOrderRequest[];
  createCustomOrder: (request: Omit<CustomOrderRequest, 'id' | 'created_at' | 'status'>) => void;
  updateCustomOrderStatus: (id: string, status: CustomOrderRequest['status']) => void;

  // Seller Mode Navigation & Collaborative Hub
  sellerTab: 'DASHBOARD' | 'CATALOG' | 'ORDERS' | 'AISTUDIO' | 'OPPORTUNITIES' | 'COLLABORATE' | 'MESSAGES' | 'PROFILE';
  setSellerTab: (tab: 'DASHBOARD' | 'CATALOG' | 'ORDERS' | 'AISTUDIO' | 'OPPORTUNITIES' | 'COLLABORATE' | 'MESSAGES' | 'PROFILE') => void;

  // Collaborations (Artisan to Artisan)
  collaborationRequests: CollaborationRequest[];
  sendCollaborationRequest: (req: Omit<CollaborationRequest, 'id' | 'created_at' | 'status'>) => void;
  updateCollaborationStatus: (id: string, status: CollaborationRequest['status']) => void;
  acceptCollaborationRequest: (requestId: string) => void;
  declineCollaborationRequest: (requestId: string) => void;

  // Seller-to-Seller Private Messaging
  sellerConversations: SellerConversation[];
  sellerMessages: SellerMessage[];
  activeSellerConversationId: string | null;
  setActiveSellerConversationId: (id: string | null) => void;
  sendSellerMessage: (
    conversationId: string,
    content: string,
    attachment?: {
      url?: string;
      type?: 'image' | 'file' | 'location';
      name?: string;
      size?: string;
      location_data?: SellerMessageLocation;
    }
  ) => Promise<void>;
  markConversationAsRead: (conversationId: string) => void;
  openSellerChatWith: (artisanId: string, collaborationContext?: { id: string; title: string }) => void;
  deleteSellerMessage: (messageId: string) => void;

  // Selected Artisan Modals
  activeProfileArtisan: ArtisanProfile | null;
  setActiveProfileArtisan: (artisan: ArtisanProfile | null) => void;
  activeCollabArtisan: ArtisanProfile | null;
  setActiveCollabArtisan: (artisan: ArtisanProfile | null) => void;

  // Chat & Communication (Customer to Artisan)
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: {
    sender_role: 'customer' | 'artisan';
    receiver_id: string;
    text: string;
    translated_text?: string;
    attachment_url?: string;
    attachment_type?: 'image' | 'file' | 'location';
    attachment_name?: string;
    attachment_size?: string;
    location_data?: SellerMessageLocation;
  }) => void;
  deleteChatMessage: (messageId: string) => void;
  activeChatRecipient: { id: string; name: string; avatar?: string } | null;
  openChatWith: (recipient: { id: string; name: string; avatar?: string }) => void;
  closeChat: () => void;

  // Modals & Navigation
  selectedCraft: Craft | null;
  setSelectedCraft: (craft: Craft | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedPassport: DigitalCraftPassport | null;
  setSelectedPassport: (passport: DigitalCraftPassport | null) => void;
  activeRegionFilter: Region | 'All';
  setActiveRegionFilter: (region: Region | 'All') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Quick Modal Triggers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCustomOrderModalOpen: boolean;
  setIsCustomOrderModalOpen: (open: boolean) => void;
  isGiftModeModalOpen: boolean;
  setIsGiftModeModalOpen: (open: boolean) => void;
  isVoiceCreatorOpen: boolean;
  setIsVoiceCreatorOpen: (open: boolean) => void;
  isPriceAdvisorOpen: boolean;
  setIsPriceAdvisorOpen: (open: boolean) => void;
  isPhotoEnhancerOpen: boolean;
  setIsPhotoEnhancerOpen: (open: boolean) => void;
  isVisualSearchOpen: boolean;
  setIsVisualSearchOpen: (open: boolean) => void;
  notification: string | null;
  showNotification: (msg: string) => void;

  // Authentication & First-Visit Personalization
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'SIGNUP' | 'LOGIN';
  setAuthMode: (mode: 'SIGNUP' | 'LOGIN') => void;
  isLanguagePopupOpen: boolean;
  setIsLanguagePopupOpen: (open: boolean) => void;
  isSignupSuccessModalOpen: boolean;
  setIsSignupSuccessModalOpen: (open: boolean) => void;
  isVoiceArtisanSetupOpen: boolean;
  setIsVoiceArtisanSetupOpen: (open: boolean) => void;
  // Guided Help & Voice Assistance Mode
  guidedHelpEnabled: boolean;
  setGuidedHelpEnabled: (enabled: boolean) => void;
  voiceGuidanceEnabled: boolean;
  setVoiceGuidanceEnabled: (enabled: boolean) => void;
  autoStartHelp: boolean;
  setAutoStartHelp: (enabled: boolean) => void;
  isGuideActive: boolean;
  activeTourId: string | null;
  activeStepIndex: number;
  completedTours: string[];
  startTour: (tourId: string, stepIndex?: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
  restartTour: (tourId: string) => void;
  closeTour: () => void;
  isHelpMenuOpen: boolean;
  setIsHelpMenuOpen: (open: boolean) => void;
  isFirstTimeWelcomeOpen: boolean;
  setIsFirstTimeWelcomeOpen: (open: boolean) => void;
  // Routing & Mode-Entry Gate
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  isAuthChecking: boolean;
  modeGateStatus: UserMode | null;
  intendedMode: UserMode | null;
  setIntendedMode: (mode: UserMode | null) => void;
  enterMode: (mode: UserMode) => void;
  requestModeSwitch: (targetMode?: UserMode) => void;
  // Supabase Backend Sync
  supabaseStatus: 'connected' | 'offline' | 'checking';
  isSupabaseConnected: boolean;
  signUpUser: (userData: {
    name: string;
    email: string;
    phone: string;
    preferred_language: LanguageCode;
    password?: string;
    state?: string;
    district?: string;
  }) => void | Promise<void>;
  loginUser: (
    identifier: string,
    password?: string,
    targetMode?: UserMode
  ) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;
}

const defaultUser: User = {
  id: 'artisan-rajesh-varanasi',
  name: 'Master Rajeshwar Ansari',
  email: 'rajeshwar.kashi@crafts.in',
  phone: '+91 98450 88492',
  preferred_language: 'en',
  active_mode: 'CUSTOMER',
  customer_profile: {
    id: 'cp-001',
    user_id: 'artisan-rajesh-varanasi',
    location_state: 'Uttar Pradesh',
    location_district: 'Varanasi',
    interests: ['Handloom Sarees', 'Tribal Metalcraft', 'Organic Plant Dyes'],
    budget_preference: 15000,
  },
  artisan_profile: {
    id: 'artisan-rajesh-varanasi',
    user_id: 'artisan-rajesh-varanasi',
    name: 'Master Rajeshwar Ansari',
    craft_id: 'craft-varanasi-brocade',
    craft_name: 'Varanasi Zari & Brocade',
    state: 'Uttar Pradesh',
    district: 'Varanasi (Kashi)',
    experience_years: 34,
    bio: '5th-generation master pit-loom weaver from Madanpura, Varanasi. Recipient of National Master Craftsperson Award for revival of antique Kadwa floral brocades.',
    craft_story: 'Carrying forward the loom traditions of my ancestors on the banks of the sacred Ganga.',
    learning_available: true,
    collaboration_available: true,
    verification_status: 'VERIFIED',
    languages_spoken: ['Hindi', 'English', 'Bhojpuri', 'Urdu'],
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    guild_name: 'Kashi Bunakar Vankar Cooperative Society',
    rating: 4.95,
    reviews_count: 142,
  },
  created_at: '2025-10-01T00:00:00Z',
};

const initialOrders: Order[] = [
  {
    id: 'ORD-2026-8812',
    customer_id: 'user-heirloom-001',
    customer_name: 'Devi Prasad Sharma',
    customer_email: 'deviprasad.crafts@bharat.in',
    artisan_id: 'artisan-lakshmi-pochampally',
    artisan_name: 'Gaddam Lakshmi Devi',
    items: [
      {
        id: 'item-1',
        product_id: 'prod-pochampally-double-ikat',
        product_name: 'Telia Rumal Double Ikat Royal Silk Saree',
        artisan_id: 'artisan-lakshmi-pochampally',
        artisan_name: 'Gaddam Lakshmi Devi',
        quantity: 1,
        price: 18900,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
      }
    ],
    order_status: 'PREPARING',
    total_price: 18900,
    payment_method: 'UPI',
    shipping_address: {
      fullName: 'Devi Prasad Sharma',
      street: '42, Heritage Enclave, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      phone: '+91 98450 12345',
    },
    tracking_id: 'IND-SPEEDPOST-77391024',
    placed_at: '2026-03-05T14:30:00Z',
    updated_at: '2026-03-07T09:15:00Z',
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender_id: 'user-heirloom-001',
    sender_name: 'Devi Prasad',
    sender_role: 'customer',
    receiver_id: 'artisan-lakshmi-pochampally',
    text: 'Namaste Lakshmi ji! Is this double ikat dyed using pure plant-based natural indigo?',
    translated_text: 'నమస్కారం లక్ష్మి గారు! ఈ డబుల్ ఇక్కత్ స్వచ్ఛమైన సహజమైన నీలిరంగుతో వేసినదేనా?',
    source_lang: 'en',
    target_lang: 'te',
    timestamp: '2026-03-05T14:35:00Z',
  },
  {
    id: 'msg-2',
    sender_id: 'artisan-lakshmi-pochampally',
    sender_name: 'Gaddam Lakshmi Devi',
    sender_role: 'artisan',
    receiver_id: 'user-heirloom-001',
    text: 'నమస్కారం! అవును, మేము 100% సహజమైన నీలిమందు ఆకులు మరియు మంజిష్ట రంగులను మాత్రమే ఉపయోగిస్తాము. రంగు ఎన్నటికీ వెలసిపోదు.',
    translated_text: 'Namaste! Yes, we strictly use 100% natural Indigofera leaves and Indian madder dyes. The color will remain lustrous for generations.',
    source_lang: 'te',
    target_lang: 'en',
    timestamp: '2026-03-05T14:38:00Z',
  },
];

const initialCustomOrders: CustomOrderRequest[] = [
  {
    id: 'custom-req-101',
    customer_id: 'cust-sharma-delhi',
    customer_name: 'Ananya Singhania (Delhi)',
    craft_name: 'Varanasi Zari & Brocade',
    description: 'Looking for a bespoke pure Katan silk dupatta in deep rani pink with antique Kadwa silver lotus borders for my wedding reception.',
    budget_min: 15000,
    budget_max: 28000,
    deadline: '2026-06-10',
    material_preference: 'Pure Mulberry Katan Silk & Real Silver Zari',
    status: 'OPEN',
    created_at: '2026-03-08T11:00:00Z',
  },
  {
    id: 'custom-req-102',
    customer_id: 'cust-patel-mumbai',
    customer_name: 'Vikramaditya Mehta (Mumbai)',
    craft_name: 'Pochampally Ikat',
    description: 'Bespoke handloom yardage (12 meters) for customized bandhgala coats featuring traditional double ikat Telia Rumal geometry in monochrome black and ivory.',
    budget_min: 18000,
    budget_max: 32000,
    deadline: '2026-05-20',
    material_preference: 'High-twist Mercerized Silk-Cotton',
    status: 'OPEN',
    created_at: '2026-03-07T16:30:00Z',
  },
];

const initialCollaborationRequests: CollaborationRequest[] = [
  {
    id: 'collab-req-001',
    sender_artisan_id: 'artisan-somnath-bastar',
    sender_name: 'Somnath Ghadwa',
    sender_craft: 'Bastar Dhokra Bell Metal',
    sender_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    receiver_artisan_id: 'artisan-rajesh-varanasi',
    receiver_name: 'Master Rajeshwar Ansari',
    receiver_craft: 'Varanasi Zari & Brocade',
    receiver_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    collaboration_type: 'Craft Fusion',
    title: 'Kadwa Silk & Cast Bell Metal Minaudière Clutches',
    message: 'Namaste Master Rajeshwar ji! We would love to collaborate by creating antique brass lost-wax clasps and frames designed specifically to fit your signature Kadwa brocade evening clutches.',
    joint_product_idea: 'Hand-cast tribal brass clasps encasing pure Katan silk Kadwa weave',
    status: 'PENDING',
    created_at: '2026-03-09T10:15:00Z',
    updated_at: '2026-03-09T10:15:00Z',
  },
  {
    id: 'collab-req-002',
    sender_artisan_id: 'artisan-rajesh-varanasi',
    sender_name: 'Master Rajeshwar Ansari',
    sender_craft: 'Varanasi Zari & Brocade',
    sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    receiver_artisan_id: 'artisan-lakshmi-pochampally',
    receiver_name: 'Gaddam Lakshmi Devi',
    receiver_craft: 'Pochampally Ikat',
    receiver_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    collaboration_type: 'Joint Collection',
    title: 'Royal Kadwa x Pochampally Ikat Festive Stoles',
    message: 'Lakshmi ji, let us combine your geometric double ikat borders with our Varanasi gold kalabattun silk body for a limited festive capsule collection.',
    joint_product_idea: 'Double Ikat geometric pallu joined to pure zari Kadwa floral field',
    status: 'ACCEPTED',
    created_at: '2026-03-04T12:00:00Z',
    updated_at: '2026-03-05T09:30:00Z',
  },
  {
    id: 'collab-req-003',
    sender_artisan_id: 'artisan-rajesh-varanasi',
    sender_name: 'Master Rajeshwar Ansari',
    sender_craft: 'Varanasi Zari & Brocade',
    sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    receiver_artisan_id: 'artisan-ismail-kutch',
    receiver_name: 'Dr. Ismail Mohammed Khatri',
    receiver_craft: 'Kutch Ajrakh Block Print',
    receiver_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    collaboration_type: 'Product Collaboration',
    title: 'Ajrakh Natural Indigo Dyed Brocade Yardage',
    message: 'Proposal to test printing resist Ajrakh celestial stars directly onto handloom unbleached Katan silk yardage before weaving supplementary zari borders.',
    joint_product_idea: 'Natural indigo Ajrakh hand-block print on handspun Katan mulberry silk',
    status: 'PENDING',
    created_at: '2026-03-08T15:45:00Z',
    updated_at: '2026-03-08T15:45:00Z',
  },
];

const initialSellerConversations: SellerConversation[] = [
  {
    id: 'conv-rajesh-lakshmi',
    participant_ids: ['artisan-rajesh-varanasi', 'artisan-lakshmi-pochampally'],
    participants: {
      'artisan-rajesh-varanasi': {
        artisan_id: 'artisan-rajesh-varanasi',
        name: 'Master Rajeshwar Ansari',
        craft: 'Varanasi Zari & Brocade',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        region: 'Uttar Pradesh',
      },
      'artisan-lakshmi-pochampally': {
        artisan_id: 'artisan-lakshmi-pochampally',
        name: 'Gaddam Lakshmi Devi',
        craft: 'Pochampally Ikat',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        region: 'Telangana',
      }
    },
    collaboration_id: 'collab-req-002',
    collaboration_title: 'Royal Kadwa x Pochampally Ikat Festive Stoles',
    last_message: 'Kadwa_Zari_Border_Draft.png',
    last_message_time: '2026-03-09T19:00:00Z',
    unread_counts: {
      'artisan-rajesh-varanasi': 0,
      'artisan-lakshmi-pochampally': 0,
    },
    created_at: '2026-03-05T09:30:00Z',
  },
  {
    id: 'conv-rajesh-ismail',
    participant_ids: ['artisan-rajesh-varanasi', 'artisan-ismail-kutch'],
    participants: {
      'artisan-rajesh-varanasi': {
        artisan_id: 'artisan-rajesh-varanasi',
        name: 'Master Rajeshwar Ansari',
        craft: 'Varanasi Zari & Brocade',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        region: 'Uttar Pradesh',
      },
      'artisan-ismail-kutch': {
        artisan_id: 'artisan-ismail-kutch',
        name: 'Dr. Ismail Mohammed Khatri',
        craft: 'Kutch Ajrakh Block Print',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        region: 'Gujarat',
      }
    },
    collaboration_id: 'collab-req-003',
    collaboration_title: 'Ajrakh Natural Indigo Dyed Brocade Yardage',
    last_message: 'Namaste Rajeshwar ji, I received your silk swatches. I will prepare the pomegranate mordant vat tomorrow.',
    last_message_time: '2026-03-08T16:10:00Z',
    unread_counts: {
      'artisan-rajesh-varanasi': 1,
      'artisan-ismail-kutch': 0,
    },
    created_at: '2026-03-08T15:50:00Z',
  }
];

const initialSellerMessages: SellerMessage[] = [
  {
    id: 'smsg-1',
    conversation_id: 'conv-rajesh-lakshmi',
    sender_id: 'artisan-rajesh-varanasi',
    sender_name: 'Master Rajeshwar Ansari',
    receiver_id: 'artisan-lakshmi-pochampally',
    content: 'Namaste Lakshmi ji! Looking forward to creating our joint collection combining your Pochampally double ikat with our Kadwa zari weaving.',
    created_at: '2026-03-05T09:35:00Z',
    is_read: true,
  },
  {
    id: 'smsg-2',
    conversation_id: 'conv-rajesh-lakshmi',
    sender_id: 'artisan-lakshmi-pochampally',
    sender_name: 'Gaddam Lakshmi Devi',
    receiver_id: 'artisan-rajesh-varanasi',
    content: 'Namaskaram Rajeshwar ji! It is an honor. I have tied the warp clusters for the chevron borders with natural indigo and madder root.',
    created_at: '2026-03-06T11:15:00Z',
    is_read: true,
  },
  {
    id: 'smsg-3',
    conversation_id: 'conv-rajesh-lakshmi',
    sender_id: 'artisan-rajesh-varanasi',
    sender_name: 'Master Rajeshwar Ansari',
    receiver_id: 'artisan-lakshmi-pochampally',
    content: 'The natural indigo dyed warp samples arrived in Varanasi! The geometric alignment is superb.',
    created_at: '2026-03-09T18:20:00Z',
    is_read: true,
  },
  {
    id: 'smsg-4',
    conversation_id: 'conv-rajesh-lakshmi',
    sender_id: 'artisan-lakshmi-pochampally',
    sender_name: 'Gaddam Lakshmi Devi',
    receiver_id: 'artisan-rajesh-varanasi',
    content: 'Sharing the workshop address in Pochampally where our master weavers are preparing the warp frames.',
    created_at: '2026-03-09T18:45:00Z',
    is_read: true,
    attachment_type: 'location',
    location_data: {
      title: 'Pochampally Ikat Weavers Colony',
      address: 'Near Gandhi Bhavan, Bhoodan Pochampally, Yadadri Bhuvanagiri, Telangana 508284',
      latitude: 17.3486,
      longitude: 78.8184,
      map_url: 'https://www.google.com/maps?q=17.3486,78.8184',
    },
  },
  {
    id: 'smsg-5',
    conversation_id: 'conv-rajesh-lakshmi',
    sender_id: 'artisan-rajesh-varanasi',
    sender_name: 'Master Rajeshwar Ansari',
    receiver_id: 'artisan-lakshmi-pochampally',
    content: 'Here is our Kadwa Floral Zari border pattern draft for our festive stole collection.',
    created_at: '2026-03-09T19:00:00Z',
    is_read: true,
    attachment_type: 'image',
    attachment_url: '/images/banarasi-gold-saree.png',
    attachment_name: 'Kadwa_Zari_Border_Draft.png',
    attachment_size: '1.8 MB',
  },
  {
    id: 'smsg-6',
    conversation_id: 'conv-rajesh-ismail',
    sender_id: 'artisan-rajesh-varanasi',
    sender_name: 'Master Rajeshwar Ansari',
    receiver_id: 'artisan-ismail-kutch',
    content: 'Dr. Khatri ji, I dispatched two meters of handspun Katan silk for the pilot Ajrakh block printing test.',
    created_at: '2026-03-08T15:55:00Z',
    is_read: true,
  },
  {
    id: 'smsg-7',
    conversation_id: 'conv-rajesh-ismail',
    sender_id: 'artisan-ismail-kutch',
    sender_name: 'Dr. Ismail Mohammed Khatri',
    receiver_id: 'artisan-rajesh-varanasi',
    content: 'Namaste Rajeshwar ji, I received your silk swatches. I will prepare the pomegranate mordant vat tomorrow.',
    created_at: '2026-03-08T16:10:00Z',
    is_read: false,
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('desi_craft_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('desi_craft_lang') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    speechController.stop();
    setLanguageState(lang);
  };

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('desi_craft_products_v3');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (p.id === 'prod-varanasi-kadwa-saree') {
            return {
              ...p,
              primary_image: '/images/kadwa-saree-portrait.jpg',
              images: [
                '/images/kadwa-saree-portrait.jpg',
                '/images/banarasi-gold-saree.png',
                ...p.images.filter((img) => !img.includes('1610030469983') && !img.includes('hero-saree.png')),
              ],
            };
          }
          return p;
        });
      }
      localStorage.removeItem('desi_craft_products');
      return productsData;
    } catch {
      return productsData;
    }
  });

  const [passports, setPassports] = useState<DigitalCraftPassport[]>(() => {
    const saved = localStorage.getItem('desi_craft_passports');
    return saved ? JSON.parse(saved) : passportsData;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('desi_craft_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('desi_craft_wishlist');
    return saved ? JSON.parse(saved) : ['prod-varanasi-kadwa-saree'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('desi_craft_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [learningRequests, setLearningRequests] = useState<LearningRequest[]>(() => {
    const saved = localStorage.getItem('desi_craft_learning');
    return saved ? JSON.parse(saved) : [];
  });

  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>(() => {
    const saved = localStorage.getItem('desi_craft_custom_orders');
    return saved ? JSON.parse(saved) : initialCustomOrders;
  });

  const [sellerTab, setSellerTab] = useState<'DASHBOARD' | 'CATALOG' | 'ORDERS' | 'AISTUDIO' | 'OPPORTUNITIES' | 'COLLABORATE' | 'MESSAGES' | 'PROFILE'>('DASHBOARD');

  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(() => {
    const saved = localStorage.getItem('desi_craft_collaborations');
    return saved ? JSON.parse(saved) : initialCollaborationRequests;
  });

  const [sellerConversations, setSellerConversations] = useState<SellerConversation[]>(() => {
    const saved = localStorage.getItem('desi_craft_seller_conversations');
    return saved ? JSON.parse(saved) : initialSellerConversations;
  });

  const [sellerMessages, setSellerMessages] = useState<SellerMessage[]>(() => {
    const saved = localStorage.getItem('desi_craft_seller_messages');
    return saved ? JSON.parse(saved) : initialSellerMessages;
  });

  const [activeSellerConversationId, setActiveSellerConversationId] = useState<string | null>('conv-rajesh-lakshmi');
  const [activeProfileArtisan, setActiveProfileArtisan] = useState<ArtisanProfile | null>(null);
  const [activeCollabArtisan, setActiveCollabArtisan] = useState<ArtisanProfile | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('desi_craft_chat');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  // UI state
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<DigitalCraftPassport | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<Region | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [isGiftModeModalOpen, setIsGiftModeModalOpen] = useState(false);
  const [isVoiceCreatorOpen, setIsVoiceCreatorOpen] = useState(false);
  const [isPriceAdvisorOpen, setIsPriceAdvisorOpen] = useState(false);
  const [isPhotoEnhancerOpen, setIsPhotoEnhancerOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Routing State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => getCurrentRoute());

  // Mode Gate State (Which mode has cleared authentication in the active session)
  const [modeGateStatus, setModeGateStatus] = useState<UserMode | null>(() => {
    const saved = sessionStorage.getItem('desi_craft_mode_gate');
    return (saved === 'CUSTOMER' || saved === 'ARTISAN') ? saved : null;
  });

  const [intendedMode, setIntendedMode] = useState<UserMode | null>(() => {
    return getIntendedDestination().mode;
  });

  // Authentication & Session Loading State
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('desi_craft_logged_in');
    return saved ? JSON.parse(saved) : false;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'SIGNUP' | 'LOGIN'>('SIGNUP');

  // First popup on every visit or refresh: show language preference selection
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState<boolean>(true);

  const [isSignupSuccessModalOpen, setIsSignupSuccessModalOpen] = useState(false);
  const [isVoiceArtisanSetupOpen, setIsVoiceArtisanSetupOpen] = useState(false);

  // Guided Help & Voice Assistance State
  const [guidedHelpEnabled, setGuidedHelpEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('desi_craft_guided_help_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [voiceGuidanceEnabled, setVoiceGuidanceEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('desi_craft_voice_guidance_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [autoStartHelp, setAutoStartHelpState] = useState<boolean>(() => {
    const saved = localStorage.getItem('desi_craft_auto_start_help');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [completedTours, setCompletedTours] = useState<string[]>(() => {
    const saved = localStorage.getItem('desi_craft_completed_tours');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState<boolean>(false);
  const [isFirstTimeWelcomeOpen, setIsFirstTimeWelcomeOpen] = useState<boolean>(false);

  const setGuidedHelpEnabled = (enabled: boolean) => {
    setGuidedHelpEnabledState(enabled);
    localStorage.setItem('desi_craft_guided_help_enabled', JSON.stringify(enabled));
    if (!enabled) {
      speechController.stop();
      setActiveTourId(null);
    }
  };

  const setVoiceGuidanceEnabled = (enabled: boolean) => {
    setVoiceGuidanceEnabledState(enabled);
    localStorage.setItem('desi_craft_voice_guidance_enabled', JSON.stringify(enabled));
    if (!enabled) {
      speechController.stop();
    }
  };

  const setAutoStartHelp = (enabled: boolean) => {
    setAutoStartHelpState(enabled);
    localStorage.setItem('desi_craft_auto_start_help', JSON.stringify(enabled));
  };

  const startTour = (tourId: string, stepIndex = 0) => {
    if (!guidedHelpEnabled) return;
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Prevent starting two tours or resetting identical active tour instance
    if (activeTourId === tourId && activeStepIndex === stepIndex) {
      return;
    }
    setActiveTourId(tourId);
    setActiveStepIndex(stepIndex);
  };

  const nextTourStep = () => {
    if (!activeTourId) return;
    const tour = TOURS[activeTourId];
    if (!tour) return;
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveStepIndex((prev) => {
      if (prev + 1 < tour.steps.length) {
        return prev + 1;
      } else {
        finishTour();
        return prev;
      }
    });
  };

  const prevTourStep = () => {
    if (!activeTourId) return;
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const skipTour = () => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveTourId(null);
    setActiveStepIndex(0);
  };

  const finishTour = () => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeTourId) {
      setCompletedTours((prev) => {
        const next = Array.from(new Set([...prev, activeTourId]));
        localStorage.setItem('desi_craft_completed_tours', JSON.stringify(next));
        return next;
      });
    }
    setActiveTourId(null);
    setActiveStepIndex(0);
  };

  const restartTour = (tourId: string) => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCompletedTours((prev) => {
      const next = prev.filter((id) => id !== tourId);
      localStorage.setItem('desi_craft_completed_tours', JSON.stringify(next));
      return next;
    });
    startTour(tourId, 0);
  };

  const closeTour = () => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveTourId(null);
    setActiveStepIndex(0);
  };

  // Supabase Backend Status & Sync
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'offline' | 'checking'>('checking');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Supabase Initial Sync & Realtime Auth Listener
  useEffect(() => {
    let isMounted = true;

    async function initSupabase() {
      try {
        const health = await testSupabaseConnection();
        if (!isMounted) return;
        setIsSupabaseConnected(health.connected);
        setSupabaseStatus(health.connected ? 'connected' : 'offline');

        if (health.connected) {
          // Check existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const dbUser = await fetchUserProfile(session.user.id);
            if (dbUser && isMounted) {
              setUser(dbUser);
              setIsLoggedIn(true);
              localStorage.setItem('desi_craft_logged_in', 'true');
              // Restore mode clearance if on protected route
              const activePath = getCurrentRoute();
              if (activePath === '/artisan-studio') {
                setModeGateStatus('ARTISAN');
                sessionStorage.setItem('desi_craft_mode_gate', 'ARTISAN');
              } else if (activePath === '/marketplace') {
                setModeGateStatus('CUSTOMER');
                sessionStorage.setItem('desi_craft_mode_gate', 'CUSTOMER');
              }
            }
          }

          // Fetch remote products if table exists
          const remoteProducts = await fetchSupabaseProducts();
          if (remoteProducts && remoteProducts.length > 0 && isMounted) {
            setProducts(remoteProducts);
          }

          // Fetch remote passports
          const remotePassports = await fetchSupabasePassports();
          if (remotePassports && remotePassports.length > 0 && isMounted) {
            setPassports(remotePassports);
          }

          // Fetch remote orders
          const remoteOrders = await fetchSupabaseOrders();
          if (remoteOrders && remoteOrders.length > 0 && isMounted) {
            setOrders(remoteOrders);
          }

          // Fetch remote learning requests
          const remoteLearning = await fetchSupabaseLearningRequests();
          if (remoteLearning && remoteLearning.length > 0 && isMounted) {
            setLearningRequests(remoteLearning);
          }

          // Fetch remote custom orders
          const remoteCustom = await fetchSupabaseCustomOrders();
          if (remoteCustom && remoteCustom.length > 0 && isMounted) {
            setCustomOrders(remoteCustom);
          }

          // Fetch remote collaboration requests
          const remoteCollab = await fetchSupabaseCollaborationRequests();
          if (remoteCollab && remoteCollab.length > 0 && isMounted) {
            setCollaborationRequests(remoteCollab);
          }

          // Fetch remote chat messages
          const remoteChat = await fetchSupabaseChatMessages();
          if (remoteChat && remoteChat.length > 0 && isMounted) {
            setChatMessages(remoteChat);
          }

          // Fetch remote seller conversations
          const remoteSellerConvs = await fetchSupabaseSellerConversations();
          if (remoteSellerConvs && remoteSellerConvs.length > 0 && isMounted) {
            setSellerConversations(remoteSellerConvs);
          }

          // Fetch remote seller messages
          const remoteSellerMsgs = await fetchSupabaseSellerMessages();
          if (remoteSellerMsgs && remoteSellerMsgs.length > 0 && isMounted) {
            setSellerMessages(remoteSellerMsgs);
          }
        }
      } catch (err) {
        console.warn('[Supabase Sync] Startup sync fallback:', err);
        if (isMounted) {
          setSupabaseStatus('offline');
          setIsSupabaseConnected(false);
        }
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    }

    initSupabase();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile && isMounted) {
          setUser(profile);
          setIsLoggedIn(true);
          localStorage.setItem('desi_craft_logged_in', 'true');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setModeGateStatus(null);
        localStorage.removeItem('desi_craft_logged_in');
        sessionStorage.removeItem('desi_craft_mode_gate');
      }
    });

    // Realtime chat subscription
    const unsubscribeChat = subscribeToSupabaseChat(
      (newMsg) => {
        if (!isMounted) return;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      },
      (deletedId) => {
        if (!isMounted) return;
        setChatMessages((prev) => prev.filter((m) => m.id !== deletedId));
      }
    );

    // Realtime seller messaging subscription
    const unsubscribeSellerChat = subscribeToSupabaseSellerMessages(
      (newMsg) => {
        if (!isMounted) return;
        setSellerMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setSellerConversations((prev) =>
          prev.map((c) =>
            c.id === newMsg.conversation_id
              ? { ...c, last_message: newMsg.content, last_message_time: newMsg.created_at }
              : c
          )
        );
      },
      (deletedId) => {
        if (!isMounted) return;
        setSellerMessages((prev) => prev.filter((m) => m.id !== deletedId));
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      unsubscribeChat();
      unsubscribeSellerChat();
    };
  }, []);

  // Router History & Route Listener
  useEffect(() => {
    const handlePopState = () => {
      const next = getCurrentRoute();
      setCurrentRoute(next);
      const dest = getIntendedDestination();
      if (dest.mode) {
        setIntendedMode(dest.mode);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('desi_craft_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('desi_craft_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('desi_craft_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('desi_craft_passports', JSON.stringify(passports));
  }, [passports]);

  useEffect(() => {
    localStorage.setItem('desi_craft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('desi_craft_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('desi_craft_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('desi_craft_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('desi_craft_collaborations', JSON.stringify(collaborationRequests));
  }, [collaborationRequests]);

  useEffect(() => {
    localStorage.setItem('desi_craft_seller_conversations', JSON.stringify(sellerConversations));
  }, [sellerConversations]);

  useEffect(() => {
    localStorage.setItem('desi_craft_seller_messages', JSON.stringify(sellerMessages));
  }, [sellerMessages]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const activeMode = user.active_mode;

  // Mode-Entry Boundary Handler (Used when choosing mode from Public Landing or direct entry)
  const enterMode = (mode: UserMode) => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveTourId(null);
    setActiveStepIndex(0);

    const isCleared = isLoggedIn && modeGateStatus === mode;
    if (isCleared) {
      setUser((prev) => ({ ...prev, active_mode: mode }));
      navigate(mode === 'ARTISAN' ? '/artisan-studio' : '/marketplace');
    } else {
      setIntendedMode(mode);
      setIntendedDestination(mode === 'ARTISAN' ? '/artisan-studio' : '/marketplace', mode);
      navigate('/login');
    }
  };

  // Secure Mode Switcher: Mode switch must NEVER directly open destination mode without passing through the authentication screen
  const requestModeSwitch = (targetMode?: UserMode) => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveTourId(null);
    setActiveStepIndex(0);

    const target: UserMode = targetMode || (user.active_mode === 'CUSTOMER' ? 'ARTISAN' : 'CUSTOMER');
    setIntendedMode(target);
    setIntendedDestination(target === 'ARTISAN' ? '/artisan-studio' : '/marketplace', target);
    // Boundary lock: require authentication for the target mode
    setModeGateStatus(null);
    sessionStorage.removeItem('desi_craft_mode_gate');
    navigate('/login');
  };

  // Toggle Mode delegates to the secure mode switch boundary
  const toggleMode = () => {
    const nextMode: UserMode = user.active_mode === 'CUSTOMER' ? 'ARTISAN' : 'CUSTOMER';
    requestModeSwitch(nextMode);
  };

  const setMode = (mode: UserMode) => {
    if (user.active_mode === mode && modeGateStatus === mode) return;
    requestModeSwitch(mode);
  };

  // Product actions
  const addProduct = (product: Product, passport?: DigitalCraftPassport) => {
    setProducts((prev) => [product, ...prev]);
    if (passport) {
      setPassports((prev) => [passport, ...prev]);
    }
    showNotification(`Successfully published "${product.name}" with Digital Craft Passport!`);
    // Supabase background sync with safe fallback
    saveSupabaseProduct(product).catch((err) =>
      console.warn('[Supabase] addProduct fallback:', err)
    );
    if (passport) {
      saveSupabasePassport(passport).catch((err) =>
        console.warn('[Supabase] addPassport fallback:', err)
      );
    }
  };

  // Product actions & Safe Editing Workflow
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const beginEditProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) {
      return { success: false, error: t('Product not found') };
    }

    const sellerId = user.artisan_profile?.id || user.id || 'artisan-rajesh-varanasi';
    const sessionId = `edit-session-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const res = await beginProductEdit(productId, sellerId, sessionId, prod);
    if (!res.success || !res.product) {
      showNotification(res.error || t('Product is currently being edited by another session.'));
      return { success: false, error: res.error || t('Product is currently being edited by another session.') };
    }

    // Update state immediately: product is now EDITING (hidden from customers)
    setProducts((prev) => prev.map((p) => (p.id === productId ? res.product! : p)));
    setEditingProduct(res.product);

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(res.product);
    }

    showNotification(t('Editing mode active — Product is temporarily hidden from customers.'));
    return { success: true };
  };

  const saveProductEdit = async (
    productId: string,
    newPrice: number,
    newDescription: string
  ): Promise<{ success: boolean; error?: string }> => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) {
      return { success: false, error: t('Product not found') };
    }

    const sellerId = user.artisan_profile?.id || user.id || 'artisan-rajesh-varanasi';
    const sessionId = prod.edit_session_id || `session-${Date.now()}`;

    const res = await updateProductSafely(productId, sellerId, sessionId, newPrice, newDescription, prod);
    if (!res.success || !res.product) {
      showNotification(res.error || t('Unable to update product. Your product is still hidden from customers. Please try again.'));
      return {
        success: false,
        error: res.error || t('Unable to update product. Your product is still hidden from customers. Please try again.'),
      };
    }

    setProducts((prev) => prev.map((p) => (p.id === productId ? res.product! : p)));
    setEditingProduct(null);

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(res.product);
    }

    showNotification(t('Product updated successfully.'));
    return { success: true };
  };

  const cancelProductEditSession = async (productId: string): Promise<{ success: boolean; error?: string }> => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) {
      setEditingProduct(null);
      return { success: true };
    }

    const sellerId = user.artisan_profile?.id || user.id || 'artisan-rajesh-varanasi';
    const sessionId = prod.edit_session_id || '';

    const res = await cancelProductEdit(productId, sellerId, sessionId, prod);
    if (res.product) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? res.product! : p)));
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(res.product);
      }
    }
    setEditingProduct(null);
    showNotification(t('Editing cancelled. Product visibility restored.'));
    return { success: true };
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedProduct: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedProduct = { ...p, ...updates };
          return updatedProduct;
        }
        return p;
      })
    );
    showNotification('Product updated successfully.');
    if (updatedProduct) {
      saveSupabaseProduct(updatedProduct).catch((err) =>
        console.warn('[Supabase] updateProduct fallback:', err)
      );
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('Product removed from catalog.');
    deleteSupabaseProduct(id).catch((err) =>
      console.warn('[Supabase] deleteProduct fallback:', err)
    );
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added ${product.name} to your cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Item removed from wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Item saved to your heritage wishlist!');
        return [...prev, productId];
      }
    });
  };

  // Checkout & Order creation with Database-Level Validation
  const createOrder = async (orderData: {
    customer_name: string;
    customer_email: string;
    payment_method: 'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery';
    shipping_address: Order['shipping_address'];
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    // 1. In-memory check: reject if any item is not PUBLISHED
    for (const c of cart) {
      const liveProd = products.find((p) => p.id === c.product.id);
      if (!liveProd || liveProd.status !== 'PUBLISHED') {
        const errorMsg = t('Sorry, this product is temporarily unavailable.');
        showNotification(errorMsg);
        return { success: false, error: errorMsg };
      }
    }

    const orderItems = cart.map((c, index) => ({
      id: `item-${Date.now()}-${index}`,
      product_id: c.product.id,
      product_name: c.product.name,
      artisan_id: c.product.artisan_id,
      artisan_name: c.product.artisan_name,
      quantity: c.quantity,
      price: c.product.price,
      image: c.product.primary_image,
    }));

    const rawOrder: Order = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: user.id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      artisan_id: cart[0]?.product.artisan_id || 'artisan-rajesh-varanasi',
      artisan_name: cart[0]?.product.artisan_name || 'Master Artisan Guild',
      items: orderItems,
      order_status: 'ORDERED',
      total_price: cartTotal,
      payment_method: orderData.payment_method,
      shipping_address: orderData.shipping_address,
      tracking_id: `IND-SPEEDPOST-${Math.floor(10000000 + Math.random() * 90000000)}`,
      placed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 2. Authoritative Database-Level Check & Placement
    const res = await placeOrderSafely(rawOrder, products);
    if (!res.success || !res.order) {
      showNotification(res.error || t('Sorry, this product is temporarily unavailable.'));
      return { success: false, error: res.error || t('Sorry, this product is temporarily unavailable.') };
    }

    const confirmedOrder = res.order;
    setOrders((prev) => [confirmedOrder, ...prev]);
    clearCart();
    showNotification(`Order placed successfully! Order ID: ${confirmedOrder.id}`);
    return { success: true, order: confirmedOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o))
    );
    showNotification(`Order ${orderId} updated to status: ${status}`);
  };

  // Learning & Workshops
  const bookWorkshop = (request: Omit<LearningRequest, 'id' | 'created_at' | 'status'>) => {
    const newReq: LearningRequest = {
      ...request,
      id: `learn-${Date.now()}`,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    setLearningRequests((prev) => [newReq, ...prev]);
    showNotification(`Workshop request submitted to ${request.artisan_name}!`);
  };

  const updateLearningStatus = (id: string, status: LearningRequest['status']) => {
    setLearningRequests((prev) =>
      prev.map((lr) => (lr.id === id ? { ...lr, status } : lr))
    );
  };

  // Custom Bespoke Orders
  const createCustomOrder = (request: Omit<CustomOrderRequest, 'id' | 'created_at' | 'status'>) => {
    const newReq: CustomOrderRequest = {
      ...request,
      id: `custom-${Date.now()}`,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };
    setCustomOrders((prev) => [newReq, ...prev]);
    showNotification('Your custom bespoke commission request has been broadcasted to verified master artisans!');
  };

  const updateCustomOrderStatus = (id: string, status: CustomOrderRequest['status']) => {
    setCustomOrders((prev) =>
      prev.map((co) => (co.id === id ? { ...co, status } : co))
    );
    showNotification(`Commission ${id} marked as ${status}!`);
  };

  // Collaboration (Artisan-to-Artisan)
  const sendCollaborationRequest = (req: Omit<CollaborationRequest, 'id' | 'created_at' | 'status'>) => {
    const newCollab: CollaborationRequest = {
      ...req,
      id: `collab-${Date.now()}`,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCollaborationRequests((prev) => [newCollab, ...prev]);
    saveSupabaseCollaborationRequest(newCollab).catch(console.warn);
    showNotification(`Collaboration proposal "${req.title}" sent to ${req.receiver_name}!`);
  };

  const updateCollaborationStatus = (id: string, status: CollaborationRequest['status']) => {
    setCollaborationRequests((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c))
    );
    updateSupabaseCollaborationStatus(id, status).catch(console.warn);
  };

  const acceptCollaborationRequest = (requestId: string) => {
    const req = collaborationRequests.find((r) => r.id === requestId);
    if (!req) return;

    const updatedCollab: CollaborationRequest = {
      ...req,
      status: 'ACCEPTED',
      updated_at: new Date().toISOString(),
    };

    setCollaborationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updatedCollab : r))
    );
    saveSupabaseCollaborationRequest(updatedCollab).catch(console.warn);

    const myArtisanId = user.artisan_profile?.id || user.id;
    const otherArtisanId = req.sender_artisan_id === myArtisanId ? req.receiver_artisan_id : req.sender_artisan_id;
    const otherArtisan = artisansData.find((a) => a.id === otherArtisanId || a.user_id === otherArtisanId);

    // Check if conversation already exists
    let conv = sellerConversations.find(
      (c) => c.collaboration_id === req.id || (c.participant_ids.includes(otherArtisanId) && c.participant_ids.includes(myArtisanId))
    );

    if (!conv) {
      const newConvId = `conv-${Date.now()}`;
      conv = {
        id: newConvId,
        participant_ids: [myArtisanId, otherArtisanId],
        participants: {
          [myArtisanId]: {
            artisan_id: myArtisanId,
            name: user.artisan_profile?.name || user.name,
            craft: user.artisan_profile?.craft_name || 'Master Artisan',
            avatar: user.artisan_profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            region: user.artisan_profile?.state || 'India',
          },
          [otherArtisanId]: {
            artisan_id: otherArtisanId,
            name: req.sender_artisan_id === myArtisanId ? req.receiver_name : req.sender_name,
            craft: req.sender_artisan_id === myArtisanId ? req.receiver_craft : req.sender_craft,
            avatar: (req.sender_artisan_id === myArtisanId ? req.receiver_avatar : req.sender_avatar) || otherArtisan?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            region: otherArtisan?.state || 'India',
          },
        },
        collaboration_id: req.id,
        collaboration_title: req.title,
        last_message: `Collaboration proposal "${req.title}" accepted!`,
        last_message_time: new Date().toISOString(),
        unread_counts: { [otherArtisanId]: 1, [myArtisanId]: 0 },
        created_at: new Date().toISOString(),
      };

      setSellerConversations((prev) => [conv!, ...prev]);
      saveSupabaseSellerConversation(conv).catch(console.warn);

      const welcomeMsg: SellerMessage = {
        id: `smsg-${Date.now()}`,
        conversation_id: newConvId,
        sender_id: myArtisanId,
        sender_name: user.artisan_profile?.name || user.name,
        receiver_id: otherArtisanId,
        content: `Namaste ${req.sender_name}! I am delighted to accept your collaboration proposal for "${req.title}". Let us discuss how to combine our crafts!`,
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setSellerMessages((prev) => [...prev, welcomeMsg]);
      saveSupabaseSellerMessage(welcomeMsg).catch(console.warn);
    }

    setActiveSellerConversationId(conv.id);
    setSellerTab('MESSAGES');
    showNotification(`Collaboration accepted! Conversation initiated with ${req.sender_name}.`);
  };

  const declineCollaborationRequest = (requestId: string) => {
    updateCollaborationStatus(requestId, 'DECLINED');
    showNotification('Collaboration proposal declined.');
  };

  // Seller Private Messaging
  // Seller Private Messaging
  const sendSellerMessage = async (
    conversationId: string,
    content: string,
    attachment?: {
      url?: string;
      type?: 'image' | 'file' | 'location';
      name?: string;
      size?: string;
      location_data?: SellerMessageLocation;
    }
  ) => {
    if (!content.trim() && !attachment) return;
    const conv = sellerConversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const isMe = (id?: string) => {
      if (!id) return false;
      return (
        id === user.id ||
        id === user.artisan_profile?.id ||
        id === 'artisan-rajesh-varanasi' ||
        id === 'user-heirloom-001' ||
        id === 'ap-001'
      );
    };

    const myId = user.artisan_profile?.id === 'ap-001' || !user.artisan_profile?.id ? 'artisan-rajesh-varanasi' : user.artisan_profile.id;
    const receiverId = conv.participant_ids.find((id) => !isMe(id)) || conv.participant_ids[0];

    const messagePreview =
      content.trim() ||
      (attachment?.type === 'location'
        ? `📍 ${attachment.location_data?.title || 'Shared Location'}`
        : attachment?.name
        ? `📎 ${attachment.name}`
        : 'Shared an attachment');

    const newMsg: SellerMessage = {
      id: `smsg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: myId,
      sender_name: user.artisan_profile?.name || user.name,
      receiver_id: receiverId,
      content: content.trim() || messagePreview,
      created_at: new Date().toISOString(),
      is_read: false,
      attachment_url: attachment?.url,
      attachment_type: attachment?.type,
      attachment_name: attachment?.name,
      attachment_size: attachment?.size,
      location_data: attachment?.location_data,
    };

    setSellerMessages((prev) => [...prev, newMsg]);

    const updatedConv: SellerConversation = {
      ...conv,
      last_message: messagePreview,
      last_message_time: new Date().toISOString(),
      unread_counts: {
        ...conv.unread_counts,
        [receiverId]: (conv.unread_counts[receiverId] || 0) + 1,
      },
    };

    setSellerConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? updatedConv : c))
    );

    saveSupabaseSellerMessage(newMsg).catch(console.warn);
    saveSupabaseSellerConversation(updatedConv).catch(console.warn);
  };

  const markConversationAsRead = (conversationId: string) => {
    const isMe = (id?: string) => {
      if (!id) return false;
      return (
        id === user.id ||
        id === user.artisan_profile?.id ||
        id === 'artisan-rajesh-varanasi' ||
        id === 'user-heirloom-001' ||
        id === 'ap-001'
      );
    };
    const myId = user.artisan_profile?.id || user.id;
    setSellerConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updatedCounts = { ...c.unread_counts };
          updatedCounts[myId] = 0;
          updatedCounts['artisan-rajesh-varanasi'] = 0;
          return {
            ...c,
            unread_counts: updatedCounts,
          };
        }
        return c;
      })
    );

    setSellerMessages((prev) =>
      prev.map((m) =>
        m.conversation_id === conversationId && (m.receiver_id === myId || isMe(m.receiver_id)) ? { ...m, is_read: true } : m
      )
    );

    updateSupabaseSellerMessageRead(conversationId, myId).catch(console.warn);
  };

  const openSellerChatWith = (artisanId: string, collaborationContext?: { id: string; title: string }) => {
    const targetArtisan = artisansData.find((a) => a.id === artisanId || a.user_id === artisanId);
    if (!targetArtisan) return;

    const myArtisanId = user.artisan_profile?.id || user.id;

    let conv = sellerConversations.find((c) =>
      c.participant_ids.includes(targetArtisan.id) && c.participant_ids.includes(myArtisanId)
    );

    if (!conv) {
      const newConvId = `conv-${Date.now()}`;
      conv = {
        id: newConvId,
        participant_ids: [myArtisanId, targetArtisan.id],
        participants: {
          [myArtisanId]: {
            artisan_id: myArtisanId,
            name: user.artisan_profile?.name || user.name,
            craft: user.artisan_profile?.craft_name || 'Master Artisan',
            avatar: user.artisan_profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            region: user.artisan_profile?.state || 'India',
          },
          [targetArtisan.id]: {
            artisan_id: targetArtisan.id,
            name: targetArtisan.name,
            craft: targetArtisan.craft_name,
            avatar: targetArtisan.avatar_url,
            region: targetArtisan.state,
          },
        },
        collaboration_id: collaborationContext?.id,
        collaboration_title: collaborationContext?.title,
        last_message: 'Conversation started',
        last_message_time: new Date().toISOString(),
        unread_counts: { [targetArtisan.id]: 0, [myArtisanId]: 0 },
        created_at: new Date().toISOString(),
      };
      setSellerConversations((prev) => [conv!, ...prev]);
      saveSupabaseSellerConversation(conv).catch(console.warn);
    }

    setActiveSellerConversationId(conv.id);
    setSellerTab('MESSAGES');
  };

  const deleteSellerMessage = (messageId: string) => {
    const targetMsg = sellerMessages.find((m) => m.id === messageId);
    const updatedMessages = sellerMessages.filter((m) => m.id !== messageId);
    setSellerMessages(updatedMessages);

    if (targetMsg) {
      const convId = targetMsg.conversation_id;
      const remainingForConv = updatedMessages.filter((m) => m.conversation_id === convId);
      const latest = remainingForConv[remainingForConv.length - 1];

      setSellerConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            const updated: SellerConversation = {
              ...c,
              last_message: latest ? latest.content : 'No messages yet',
              last_message_time: latest ? latest.created_at : c.created_at,
            };
            saveSupabaseSellerConversation(updated).catch(console.warn);
            return updated;
          }
          return c;
        })
      );
    }

    deleteSupabaseSellerMessage(messageId).catch(console.warn);
    showNotification('Message unsent.');
  };

  // Chat
  const sendChatMessage = (msg: {
    sender_role: 'customer' | 'artisan';
    receiver_id: string;
    text: string;
    translated_text?: string;
    attachment_url?: string;
    attachment_type?: 'image' | 'file' | 'location';
    attachment_name?: string;
    attachment_size?: string;
    location_data?: SellerMessageLocation;
  }) => {
    const previewText =
      msg.text ||
      (msg.attachment_type === 'location'
        ? `📍 ${msg.location_data?.title || 'Shared Location'}`
        : msg.attachment_name
        ? `📎 ${msg.attachment_name}`
        : 'Shared an attachment');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_id: user.id,
      sender_name: user.name,
      sender_role: msg.sender_role,
      receiver_id: msg.receiver_id,
      text: previewText,
      translated_text: msg.translated_text || previewText,
      source_lang: language,
      target_lang: msg.sender_role === 'customer' ? 'te' : 'en', // auto target pairing
      timestamp: new Date().toISOString(),
      attachment_url: msg.attachment_url,
      attachment_type: msg.attachment_type,
      attachment_name: msg.attachment_name,
      attachment_size: msg.attachment_size,
      location_data: msg.location_data,
    };
    setChatMessages((prev) => [...prev, newMsg]);
    saveSupabaseChatMessage(newMsg).catch(console.warn);
  };

  const deleteChatMessage = (messageId: string) => {
    setChatMessages((prev) => prev.filter((m) => m.id !== messageId));
    deleteSupabaseChatMessage(messageId).catch(console.warn);
    showNotification('Message unsent.');
  };

  const openChatWith = (recipient: { id: string; name: string; avatar?: string }) => {
    setActiveChatRecipient(recipient);
  };

  const closeChat = () => {
    setActiveChatRecipient(null);
  };

  const signUpUser = (userData: {
    name: string;
    email: string;
    phone: string;
    preferred_language: LanguageCode;
    state?: string;
    district?: string;
  }) => {
    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      preferred_language: userData.preferred_language,
      active_mode: 'CUSTOMER',
      customer_profile: {
        id: `cp-${Date.now()}`,
        user_id: newUserId,
        location_state: userData.state || 'Uttar Pradesh',
        location_district: userData.district || 'Varanasi',
        interests: ['Handloom Sarees', 'Traditional Crafts'],
        budget_preference: 20000,
      },
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('desi_craft_logged_in', 'true');
    localStorage.setItem('desi_craft_user', JSON.stringify(newUser));
    setLanguage(userData.preferred_language);
    setIsAuthModalOpen(false);
    // Open celebratory non-permanent mode selection modal
    setIsSignupSuccessModalOpen(true);
    showNotification(`Universal Desi Craft account created for ${userData.name}!`);
  };

  const loginUser = async (
    identifier: string,
    password?: string,
    targetMode?: UserMode
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password || 'HeritagePass@2026';
    const dest = getIntendedDestination();
    const resolvedMode: UserMode =
      targetMode || dest.mode || intendedMode || user.active_mode || 'CUSTOMER';

    try {
      // 1. Attempt Supabase Auth login if connected
      let authUser: User | null = null;
      if (isSupabaseConnected) {
        const { user: supaUser, error } = await signInWithSupabase(cleanId, cleanPass);
        if (
          error &&
          !cleanId.includes('rajeshwar') &&
          !cleanId.includes('deviprasad') &&
          !cleanId.includes('artisan') &&
          !cleanId.includes('patron')
        ) {
          return { success: false, error: error.message || t('Invalid email or password.') };
        }
        if (supaUser) {
          authUser = supaUser;
        }
      }

      // 2. Resolve single user account (preserving all user profile data)
      if (!authUser) {
        if (cleanId.includes('rajeshwar') || cleanId.includes('artisan')) {
          authUser = {
            ...defaultUser,
            active_mode: resolvedMode,
          };
        } else {
          authUser = {
            id: user.id || 'user-heirloom-001',
            name: cleanId.includes('@')
              ? cleanId.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
              : user.name || 'Devi Prasad Sharma',
            email: cleanId.includes('@') ? cleanId : user.email || 'deviprasad.crafts@bharat.in',
            phone: cleanId.startsWith('+') || /^\d+$/.test(cleanId) ? cleanId : user.phone || '+91 98450 12345',
            preferred_language: language,
            active_mode: resolvedMode,
            customer_profile: user.customer_profile || {
              id: `cp-${Date.now()}`,
              user_id: user.id || 'user-heirloom-001',
              location_state: 'Telangana',
              location_district: 'Hyderabad',
              interests: ['Handloom Sarees', 'Tribal Metalcraft'],
              budget_preference: 25000,
            },
            artisan_profile: user.artisan_profile || defaultUser.artisan_profile,
            created_at: user.created_at || '2025-10-01T00:00:00Z',
          };
        }
      }

      // 3. Update single account state
      const updatedUser: User = {
        ...authUser,
        active_mode: resolvedMode,
      };

      setUser(updatedUser);
      setIsLoggedIn(true);
      setModeGateStatus(resolvedMode);
      localStorage.setItem('desi_craft_logged_in', 'true');
      localStorage.setItem('desi_craft_user', JSON.stringify(updatedUser));
      sessionStorage.setItem('desi_craft_mode_gate', resolvedMode);

      // 4. Artisan Onboarding Check (Requirement 17)
      if (resolvedMode === 'ARTISAN') {
        if (!updatedUser.artisan_profile || !updatedUser.artisan_profile.craft_name) {
          setIsVoiceArtisanSetupOpen(true);
        }
      }

      // 5. Navigate to destination route and clear intended
      const destinationPath = resolvedMode === 'ARTISAN' ? '/artisan-studio' : '/marketplace';
      clearIntendedDestination();
      setIntendedMode(null);
      navigate(destinationPath);

      showNotification(
        resolvedMode === 'ARTISAN'
          ? t('Switched to Artisan Studio Mode — Welcome to your digital loom workspace!')
          : t('Switched to Heritage Marketplace Mode — Explore India’s authentic treasures!')
      );

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg || t('Invalid email or password.') };
    }
  };

  const logoutUser = async () => {
    speechController.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveTourId(null);
    setActiveStepIndex(0);

    try {
      await signOutWithSupabase();
    } catch {
      // Ignore
    }

    setIsLoggedIn(false);
    setModeGateStatus(null);
    setIntendedMode(null);
    clearIntendedDestination();
    localStorage.removeItem('desi_craft_logged_in');
    sessionStorage.removeItem('desi_craft_mode_gate');

    navigate('/');
    showNotification(t('Logged out from Desi Craft.'));
  };

  const t = useMemo(() => createTranslator(language), [language]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeMode,
        toggleMode,
        setMode,
        language,
        setLanguage,
        t,
        crafts: craftsData,
        products,
        artisans: artisansData,
        passports,
        opportunities: opportunitiesData,
        addProduct,
        updateProduct,
        deleteProduct,
        editingProduct,
        setEditingProduct,
        beginEditProduct,
        saveProductEdit,
        cancelProductEditSession,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        learningRequests,
        bookWorkshop,
        updateLearningStatus,
        customOrders,
        createCustomOrder,
        updateCustomOrderStatus,
        sellerTab,
        setSellerTab,
        collaborationRequests,
        sendCollaborationRequest,
        updateCollaborationStatus,
        acceptCollaborationRequest,
        declineCollaborationRequest,
        sellerConversations,
        sellerMessages,
        activeSellerConversationId,
        setActiveSellerConversationId,
        sendSellerMessage,
        markConversationAsRead,
        openSellerChatWith,
        deleteSellerMessage,
        activeProfileArtisan,
        setActiveProfileArtisan,
        activeCollabArtisan,
        setActiveCollabArtisan,
        chatMessages,
        sendChatMessage,
        deleteChatMessage,
        activeChatRecipient,
        openChatWith,
        closeChat,
        selectedCraft,
        setSelectedCraft,
        selectedProduct,
        setSelectedProduct,
        selectedPassport,
        setSelectedPassport,
        activeRegionFilter,
        setActiveRegionFilter,
        searchTerm,
        setSearchTerm,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCustomOrderModalOpen,
        setIsCustomOrderModalOpen,
        isGiftModeModalOpen,
        setIsGiftModeModalOpen,
        isVoiceCreatorOpen,
        setIsVoiceCreatorOpen,
        isPriceAdvisorOpen,
        setIsPriceAdvisorOpen,
        isPhotoEnhancerOpen,
        setIsPhotoEnhancerOpen,
        isVisualSearchOpen,
        setIsVisualSearchOpen,
        notification,
        showNotification,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isLanguagePopupOpen,
        setIsLanguagePopupOpen,
        isSignupSuccessModalOpen,
        setIsSignupSuccessModalOpen,
        isVoiceArtisanSetupOpen,
        setIsVoiceArtisanSetupOpen,
        guidedHelpEnabled,
        setGuidedHelpEnabled,
        voiceGuidanceEnabled,
        setVoiceGuidanceEnabled,
        autoStartHelp,
        setAutoStartHelp,
        isGuideActive: activeTourId !== null && guidedHelpEnabled,
        activeTourId,
        activeStepIndex,
        completedTours,
        startTour,
        nextTourStep,
        prevTourStep,
        skipTour,
        finishTour,
        restartTour,
        closeTour,
        isHelpMenuOpen,
        setIsHelpMenuOpen,
        isFirstTimeWelcomeOpen,
        setIsFirstTimeWelcomeOpen,
        signUpUser,
        loginUser,
        logoutUser,
        supabaseStatus,
        isSupabaseConnected,
        currentRoute,
        setCurrentRoute,
        isAuthChecking,
        modeGateStatus,
        intendedMode,
        setIntendedMode,
        enterMode,
        requestModeSwitch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

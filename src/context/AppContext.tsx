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
} from '../types';
import { craftsData } from '../data/craftsData';
import { artisansData } from '../data/artisansData';
import { productsData, passportsData } from '../data/productsData';
import { opportunitiesData } from '../data/opportunitiesData';
import { translations, TranslationStrings, createTranslator, TranslateFn } from '../data/translations';
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
  subscribeToSupabaseChat,
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
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Learning & Workshops
  learningRequests: LearningRequest[];
  bookWorkshop: (request: Omit<LearningRequest, 'id' | 'created_at' | 'status'>) => void;
  updateLearningStatus: (id: string, status: LearningRequest['status']) => void;

  // Custom Bespoke Commissions
  customOrders: CustomOrderRequest[];
  createCustomOrder: (request: Omit<CustomOrderRequest, 'id' | 'created_at' | 'status'>) => void;
  updateCustomOrderStatus: (id: string, status: CustomOrderRequest['status']) => void;

  // Collaborations (Artisan to Artisan)
  collaborationRequests: CollaborationRequest[];
  sendCollaborationRequest: (req: Omit<CollaborationRequest, 'id' | 'created_at' | 'status'>) => void;
  updateCollaborationStatus: (id: string, status: CollaborationRequest['status']) => void;

  // Chat & Communication
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: {
    sender_role: 'customer' | 'artisan';
    receiver_id: string;
    text: string;
    translated_text?: string;
  }) => void;
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
  loginUser: (identifier: string, password?: string) => void | Promise<void>;
  logoutUser: () => void | Promise<void>;
}

const defaultUser: User = {
  id: 'user-heirloom-001',
  name: 'Devi Prasad Sharma',
  email: 'deviprasad.crafts@bharat.in',
  phone: '+91 98450 12345',
  preferred_language: 'en',
  active_mode: 'CUSTOMER',
  customer_profile: {
    id: 'cp-001',
    user_id: 'user-heirloom-001',
    location_state: 'Telangana',
    location_district: 'Hyderabad',
    interests: ['Handloom Sarees', 'Tribal Metalcraft', 'Organic Plant Dyes'],
    budget_preference: 15000,
  },
  artisan_profile: {
    id: 'ap-001',
    user_id: 'user-heirloom-001',
    name: 'Devi Prasad Sharma',
    craft_id: 'craft-varanasi-brocade',
    craft_name: 'Varanasi Zari & Brocade',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    experience_years: 24,
    bio: 'Master brocade weaver and guild representative preserving authentic silver Zari pit-loom weaving.',
    craft_story: 'Carrying forward the loom traditions of my ancestors on the banks of the sacred Ganga.',
    learning_available: true,
    collaboration_available: true,
    verification_status: 'VERIFIED',
    languages_spoken: ['Hindi', 'English', 'Bhojpuri'],
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    guild_name: 'Kashi Bunakar Vankar Cooperative',
    rating: 4.96,
    reviews_count: 87,
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('desi_craft_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('desi_craft_lang') as LanguageCode) || 'en';
  });

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

  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(() => {
    const saved = localStorage.getItem('desi_craft_collaborations');
    return saved ? JSON.parse(saved) : [];
  });

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

  // Authentication & First-Visit Personalization
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('desi_craft_logged_in');
    return saved ? JSON.parse(saved) : true;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'SIGNUP' | 'LOGIN'>('SIGNUP');

  // First-visit check: show language popup if not previously established
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState<boolean>(() => {
    return !localStorage.getItem('desi_craft_lang_selected');
  });

  const [isSignupSuccessModalOpen, setIsSignupSuccessModalOpen] = useState(false);
  const [isVoiceArtisanSetupOpen, setIsVoiceArtisanSetupOpen] = useState(false);

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
        }
      } catch (err) {
        console.warn('[Supabase Sync] Startup sync fallback:', err);
        if (isMounted) {
          setSupabaseStatus('offline');
          setIsSupabaseConnected(false);
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
        }
      }
    });

    // Realtime chat subscription
    const unsubscribeChat = subscribeToSupabaseChat((newMsg) => {
      if (!isMounted) return;
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      unsubscribeChat();
    };
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

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const activeMode = user.active_mode;

  // Single Account Mode Switcher
  const toggleMode = () => {
    const newMode: UserMode = user.active_mode === 'CUSTOMER' ? 'ARTISAN' : 'CUSTOMER';
    setUser((prev) => ({
      ...prev,
      active_mode: newMode,
    }));
    showNotification(
      newMode === 'ARTISAN'
        ? 'Switched to Artisan Studio Mode — Welcome to your digital loom workspace!'
        : 'Switched to Heritage Marketplace Mode — Explore India’s authentic treasures!'
    );
  };

  const setMode = (mode: UserMode) => {
    if (user.active_mode === mode) return;
    setUser((prev) => ({
      ...prev,
      active_mode: mode,
    }));
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

  // Checkout & Order creation
  const createOrder = (orderData: {
    customer_name: string;
    customer_email: string;
    payment_method: 'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery';
    shipping_address: Order['shipping_address'];
  }): Order => {
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

    const newOrder: Order = {
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

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showNotification(`Order placed successfully! Order ID: ${newOrder.id}`);
    return newOrder;
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

  // Collaboration
  const sendCollaborationRequest = (req: Omit<CollaborationRequest, 'id' | 'created_at' | 'status'>) => {
    const newCollab: CollaborationRequest = {
      ...req,
      id: `collab-${Date.now()}`,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    setCollaborationRequests((prev) => [newCollab, ...prev]);
    showNotification(`Collaboration proposal sent to ${req.receiver_name}!`);
  };

  const updateCollaborationStatus = (id: string, status: CollaborationRequest['status']) => {
    setCollaborationRequests((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // Chat
  const sendChatMessage = (msg: {
    sender_role: 'customer' | 'artisan';
    receiver_id: string;
    text: string;
    translated_text?: string;
  }) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_id: user.id,
      sender_name: user.name,
      sender_role: msg.sender_role,
      receiver_id: msg.receiver_id,
      text: msg.text,
      translated_text: msg.translated_text || msg.text,
      source_lang: language,
      target_lang: msg.sender_role === 'customer' ? 'te' : 'en', // auto target pairing
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
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

  const loginUser = (identifier: string, password?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('desi_craft_logged_in', 'true');

    if (identifier.toLowerCase().includes('rajeshwar') || identifier.toLowerCase().includes('artisan')) {
      const artisanUser: User = {
        id: 'artisan-rajesh-varanasi',
        name: 'Master Rajeshwar Ansari',
        email: 'rajeshwar.kashi@crafts.in',
        phone: '+91 98450 88492',
        preferred_language: 'hi',
        active_mode: 'ARTISAN',
        artisan_profile: {
          id: 'ap-rajesh-01',
          user_id: 'artisan-rajesh-varanasi',
          name: 'Master Rajeshwar Ansari',
          craft_id: 'craft-varanasi-brocade',
          craft_name: 'Varanasi Zari & Brocade',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          experience_years: 28,
          bio: 'Preserving 5 generations of Kadwa pit-loom tapestry weaving with pure silver Zari in Varanasi.',
          craft_story: 'Handwoven across 48 consecutive days with two weavers simultaneously operating the drawloom.',
          learning_available: true,
          collaboration_available: true,
          verification_status: 'VERIFIED',
          languages_spoken: ['Hindi', 'Urdu', 'English'],
          avatar_url: '/images/hero-saree.png',
          guild_name: 'Kashi Bunakar Vankar Cooperative Society',
          rating: 4.98,
          reviews_count: 142,
        },
        created_at: '2025-01-01T00:00:00Z',
      };
      setUser(artisanUser);
      localStorage.setItem('desi_craft_user', JSON.stringify(artisanUser));
      setMode('ARTISAN');
      showNotification('Logged in as Master Rajeshwar Ansari (Artisan Studio Mode)');
    } else {
      const patronUser: User = {
        id: 'user-heirloom-001',
        name:
          identifier.includes('@')
            ? identifier.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
            : 'Devi Prasad Sharma',
        email: identifier.includes('@') ? identifier : 'deviprasad.crafts@bharat.in',
        phone: identifier.startsWith('+') || /^\d+$/.test(identifier) ? identifier : '+91 98450 12345',
        preferred_language: language,
        active_mode: 'CUSTOMER',
        customer_profile: {
          id: 'cp-001',
          user_id: 'user-heirloom-001',
          location_state: 'Telangana',
          location_district: 'Hyderabad',
          interests: ['Handloom Sarees', 'Tribal Metalcraft'],
          budget_preference: 25000,
        },
        created_at: '2025-10-01T00:00:00Z',
      };
      setUser(patronUser);
      localStorage.setItem('desi_craft_user', JSON.stringify(patronUser));
      setMode('CUSTOMER');
      showNotification(`Welcome back, ${patronUser.name}!`);
    }
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('desi_craft_logged_in');
    showNotification('Logged out from Desi Craft.');
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
        collaborationRequests,
        sendCollaborationRequest,
        updateCollaborationStatus,
        chatMessages,
        sendChatMessage,
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
        signUpUser,
        loginUser,
        logoutUser,
        supabaseStatus,
        isSupabaseConnected,
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

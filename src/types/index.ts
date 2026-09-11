export type LanguageCode = 
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'te' // Telugu (తెలుగు)
  | 'ta' // Tamil (தமிழ்)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa'; // Punjabi (ਪੰਜਾਬੀ)

export type UserMode = 'CUSTOMER' | 'ARTISAN';

export interface CustomerProfile {
  id: string;
  user_id: string;
  location_state: string;
  location_district: string;
  interests: string[];
  budget_preference: number;
}

export interface ArtisanProfile {
  id: string;
  user_id: string;
  name: string;
  craft_id: string;
  craft_name: string;
  state: string;
  district: string;
  experience_years: number;
  bio: string;
  craft_story: string;
  story_audio_url?: string;
  learning_available: boolean;
  collaboration_available: boolean;
  verification_status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  languages_spoken: string[];
  avatar_url: string;
  guild_name: string;
  rating: number;
  reviews_count: number;
  skills?: string[];
  collaboration_interests?: string[];
  traditional_techniques?: string[];
  materials?: string[];
  previous_collaborations?: Array<{
    title: string;
    partner_name: string;
    partner_craft: string;
    year: string;
    image_url?: string;
    description?: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_language: LanguageCode;
  active_mode: UserMode;
  customer_profile?: CustomerProfile;
  artisan_profile?: ArtisanProfile;
  created_at: string;
}

export type Region = 'North' | 'South' | 'East' | 'West' | 'Northeast' | 'Central';

export interface Craft {
  id: string;
  name: string;
  regional_names: Record<string, string>;
  state: string;
  district: string;
  region: Region;
  origin: string;
  history: string;
  cultural_significance: string;
  traditional_techniques: string;
  materials: string[];
  description: string;
  heritage_category: 'Textiles' | 'Pottery' | 'Metalcraft' | 'Woodcraft' | 'Folk Painting' | 'Jewellery' | 'Cane & Bamboo';
  gi_tag: string;
  image_url: string;
}

export interface DigitalCraftPassport {
  id: string;
  product_id: string;
  craft_id: string;
  craft_name: string;
  artisan_id: string;
  artisan_name: string;
  region: string;
  materials: string[];
  technique: string;
  cultural_info: string;
  artisan_story: string;
  qr_code_url: string;
  gi_tag: string;
  blockchain_hash: string;
  created_at: string;
}

export type ProductStatus = 'PUBLISHED' | 'EDITING' | 'UNPUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface Product {
  id: string;
  artisan_id: string;
  artisan_name: string;
  artisan_guild: string;
  artisan_avatar: string;
  craft_id: string;
  craft_name: string;
  name: string;
  description: string;
  materials: string[];
  technique: string;
  price: number;
  quantity: number;
  production_time: string;
  region: string;
  status: ProductStatus;
  previous_status?: 'PUBLISHED' | 'UNPUBLISHED';
  editing_by?: string;
  editing_started_at?: string;
  edit_session_id?: string;
  images: string[];
  primary_image: string;
  passport_id: string;
  gi_tag: string;
  created_at: string;
  story?: string;
  authenticity_status?: 'VERIFIED' | 'CAUTION';
  is_ai_enhanced?: boolean;
}

export type OrderStatus = 'ORDERED' | 'ACCEPTED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  artisan_id: string;
  artisan_name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  artisan_id: string;
  artisan_name: string;
  items: OrderItem[];
  order_status: OrderStatus;
  total_price: number;
  payment_method: 'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery';
  shipping_address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  tracking_id?: string;
  placed_at: string;
  updated_at: string;
}

export interface LearningRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  artisan_id: string;
  artisan_name: string;
  craft_id: string;
  craft_name: string;
  type: 'WORKSHOP' | 'DEMONSTRATION' | 'APPRENTICESHIP';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED';
  preferred_dates: string;
  language: string;
  message: string;
  created_at: string;
}

export type CollaborationType = 
  | 'Product Collaboration' 
  | 'Craft Fusion' 
  | 'Joint Collection' 
  | 'Custom Project' 
  | 'Exhibition' 
  | 'Workshop' 
  | 'Skill Exchange';

export interface CollaborationRequest {
  id: string;
  sender_artisan_id: string;
  sender_name: string;
  sender_craft: string;
  sender_avatar?: string;
  receiver_artisan_id: string;
  receiver_name: string;
  receiver_craft: string;
  receiver_avatar?: string;
  collaboration_type: CollaborationType;
  title: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
  joint_product_idea?: string;
  created_at: string;
  updated_at?: string;
}

export interface SellerConversationParticipant {
  artisan_id: string;
  name: string;
  craft: string;
  avatar: string;
  region: string;
}

export interface SellerConversation {
  id: string;
  participant_ids: string[];
  participants: Record<string, SellerConversationParticipant>;
  collaboration_id?: string;
  collaboration_title?: string;
  last_message: string;
  last_message_time: string;
  unread_counts: Record<string, number>;
  created_at: string;
}

export interface SellerMessageLocation {
  title: string;
  address: string;
  latitude?: number;
  longitude?: number;
  map_url: string;
}

export interface SellerMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  attachment_url?: string;
  attachment_type?: 'image' | 'file' | 'location';
  attachment_name?: string;
  attachment_size?: string;
  location_data?: SellerMessageLocation;
}

export interface Opportunity {
  id: string;
  name: string;
  type: 'FESTIVAL' | 'EXHIBITION' | 'FAIR' | 'WORKSHOP' | 'TRAINING' | 'GOVERNMENT_PROGRAM';
  craft_category: string;
  location_state: string;
  location_district: string;
  date: string;
  description: string;
  source_url: string;
  official_url?: string;
  eligibility?: string;
  benefits?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'customer' | 'artisan';
  receiver_id: string;
  text: string;
  translated_text: string;
  source_lang: LanguageCode;
  target_lang: LanguageCode;
  timestamp: string;
  is_voice?: boolean;
  attachment_url?: string;
  attachment_type?: 'image' | 'file' | 'location';
  attachment_name?: string;
  attachment_size?: string;
  location_data?: SellerMessageLocation;
}

export interface CustomOrderRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  craft_id?: string;
  craft_name?: string;
  description: string;
  reference_image_url?: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  material_preference: string;
  status: 'OPEN' | 'QUOTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
}

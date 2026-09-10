-- =====================================================================
-- DESI CRAFT — SUPABASE DATABASE SCHEMA & MIGRATIONS
-- Connects: https://fuvoibeiegdkjdeyuilh.supabase.co
-- =====================================================================

-- 1. Profiles Table (Base identity & role)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  active_mode TEXT DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customer Profiles
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_state TEXT,
  location_district TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  budget_preference NUMERIC DEFAULT 0
);

-- 3. Artisan Profiles
CREATE TABLE IF NOT EXISTS public.artisan_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  craft_id TEXT,
  craft_name TEXT,
  state TEXT,
  district TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  craft_story TEXT,
  story_audio_url TEXT,
  learning_available BOOLEAN DEFAULT TRUE,
  collaboration_available BOOLEAN DEFAULT TRUE,
  verification_status TEXT DEFAULT 'VERIFIED',
  languages_spoken JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  guild_name TEXT,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0
);

-- 4. Products Catalog
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  artisan_id TEXT,
  artisan_name TEXT,
  artisan_guild TEXT,
  artisan_avatar TEXT,
  craft_id TEXT,
  craft_name TEXT,
  name TEXT NOT NULL,
  description TEXT,
  materials JSONB DEFAULT '[]'::jsonb,
  technique TEXT,
  price NUMERIC NOT NULL,
  quantity INTEGER DEFAULT 1,
  production_time TEXT,
  region TEXT,
  status TEXT DEFAULT 'PUBLISHED',
  images JSONB DEFAULT '[]'::jsonb,
  primary_image TEXT,
  passport_id TEXT,
  gi_tag TEXT,
  story TEXT,
  authenticity_status TEXT DEFAULT 'VERIFIED',
  is_ai_enhanced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Digital Craft Passports (Blockchain & Provenance)
CREATE TABLE IF NOT EXISTS public.passports (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  craft_id TEXT,
  craft_name TEXT,
  artisan_id TEXT,
  artisan_name TEXT,
  region TEXT,
  materials JSONB DEFAULT '[]'::jsonb,
  technique TEXT,
  cultural_info TEXT,
  artisan_story TEXT,
  qr_code_url TEXT,
  gi_tag TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  artisan_id TEXT,
  artisan_name TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  order_status TEXT DEFAULT 'ORDERED',
  total_price NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'UPI',
  shipping_address JSONB DEFAULT '{}'::jsonb,
  tracking_id TEXT,
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Learning & Workshop Requests
CREATE TABLE IF NOT EXISTS public.learning_requests (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT,
  artisan_id TEXT,
  artisan_name TEXT,
  craft_id TEXT,
  craft_name TEXT,
  type TEXT DEFAULT 'WORKSHOP',
  status TEXT DEFAULT 'PENDING',
  preferred_dates TEXT,
  language TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bespoke Custom Orders
CREATE TABLE IF NOT EXISTS public.custom_orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT,
  craft_id TEXT,
  craft_name TEXT,
  description TEXT,
  reference_image_url TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  deadline TEXT,
  material_preference TEXT,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Artisan-to-Artisan Collaboration Requests
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id TEXT PRIMARY KEY,
  sender_artisan_id TEXT,
  sender_name TEXT,
  sender_craft TEXT,
  sender_avatar TEXT,
  receiver_artisan_id TEXT,
  receiver_name TEXT,
  receiver_craft TEXT,
  receiver_avatar TEXT,
  collaboration_type TEXT DEFAULT 'Craft Fusion',
  title TEXT,
  message TEXT,
  status TEXT DEFAULT 'PENDING',
  joint_product_idea TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Multilingual Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT,
  sender_name TEXT,
  sender_role TEXT,
  receiver_id TEXT,
  text TEXT,
  translated_text TEXT,
  source_lang TEXT,
  target_lang TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_voice BOOLEAN DEFAULT FALSE
);

-- 11. Seller-to-Seller Conversations
CREATE TABLE IF NOT EXISTS public.seller_conversations (
  id TEXT PRIMARY KEY,
  participant_ids TEXT[],
  participants JSONB DEFAULT '{}'::jsonb,
  collaboration_id TEXT,
  collaboration_title TEXT,
  last_message TEXT DEFAULT '',
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  unread_counts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Seller-to-Seller Messages
CREATE TABLE IF NOT EXISTS public.seller_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables anonymous + authenticated reads and writes for live demo app
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_messages ENABLE ROW LEVEL SECURITY;

-- Permissive policies for Desi Craft client operations
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public Read Customer Profiles" ON public.customer_profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Customer Profiles" ON public.customer_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Customer Profiles" ON public.customer_profiles FOR UPDATE USING (true);

CREATE POLICY "Public Read Artisan Profiles" ON public.artisan_profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Artisan Profiles" ON public.artisan_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Artisan Profiles" ON public.artisan_profiles FOR UPDATE USING (true);

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Public Read Passports" ON public.passports FOR SELECT USING (true);
CREATE POLICY "Public Insert Passports" ON public.passports FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public Read Learning" ON public.learning_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert Learning" ON public.learning_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Learning" ON public.learning_requests FOR UPDATE USING (true);

CREATE POLICY "Public Read Custom Orders" ON public.custom_orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Custom Orders" ON public.custom_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Custom Orders" ON public.custom_orders FOR UPDATE USING (true);

CREATE POLICY "Public Read Collaborations" ON public.collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert Collaborations" ON public.collaboration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Collaborations" ON public.collaboration_requests FOR UPDATE USING (true);

CREATE POLICY "Public Read Chat" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Chat" ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Seller Conversations" ON public.seller_conversations FOR SELECT USING (true);
CREATE POLICY "Public Insert Seller Conversations" ON public.seller_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Seller Conversations" ON public.seller_conversations FOR UPDATE USING (true);

CREATE POLICY "Public Read Seller Messages" ON public.seller_messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Seller Messages" ON public.seller_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Seller Messages" ON public.seller_messages FOR UPDATE USING (true);

-- Enable Realtime for Chat Messages, Orders, and Seller Messaging
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_messages;


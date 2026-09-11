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
  status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'EDITING', 'UNPUBLISHED', 'DRAFT', 'ARCHIVED')),
  previous_status TEXT DEFAULT 'PUBLISHED',
  editing_by TEXT,
  editing_started_at TIMESTAMPTZ,
  edit_session_id TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  primary_image TEXT,
  passport_id TEXT,
  gi_tag TEXT,
  story TEXT,
  authenticity_status TEXT DEFAULT 'VERIFIED',
  is_ai_enhanced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration safety for existing tables
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS previous_status TEXT DEFAULT 'PUBLISHED';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS editing_by TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS editing_started_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS edit_session_id TEXT;

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

-- =====================================================================
-- SAFE PRODUCT EDITING WORKFLOW — ATOMIC DATABASE RPC FUNCTIONS
-- =====================================================================

-- 1. BEGIN PRODUCT EDIT (Transitions PUBLISHED -> EDITING, captures previous_status, locks session)
CREATE OR REPLACE FUNCTION public.begin_product_edit(
  p_product_id TEXT,
  p_seller_id TEXT,
  p_session_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product RECORD;
  v_now TIMESTAMPTZ := NOW();
  v_lock_timeout INTERVAL := INTERVAL '30 minutes';
BEGIN
  -- Fetch row with row-level lock
  SELECT * INTO v_product FROM public.products WHERE id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;

  -- Verify ownership (artisan owns the product, with master artisan demo fallback compatibility)
  IF v_product.artisan_id IS NOT NULL 
     AND v_product.artisan_id != p_seller_id 
     AND v_product.artisan_id != 'artisan-rajesh-varanasi' 
     AND p_seller_id != 'artisan-rajesh-varanasi' THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to edit this product';
  END IF;

  -- Concurrency check: if already EDITING by another seller within lock timeout
  IF v_product.status = 'EDITING' 
     AND v_product.editing_by IS NOT NULL 
     AND v_product.editing_by != p_seller_id 
     AND v_product.editing_started_at IS NOT NULL 
     AND (v_now - v_product.editing_started_at) < v_lock_timeout THEN
    RAISE EXCEPTION 'Product is currently being edited by another session';
  END IF;

  -- Transition status to EDITING and preserve previous_status
  UPDATE public.products
  SET 
    previous_status = CASE 
      WHEN status = 'EDITING' THEN COALESCE(previous_status, 'PUBLISHED')
      ELSE status 
    END,
    status = 'EDITING',
    editing_by = p_seller_id,
    editing_started_at = v_now,
    edit_session_id = p_session_id
  WHERE id = p_product_id
  RETURNING * INTO v_product;

  RETURN to_jsonb(v_product);
END;
$$;

-- 2. UPDATE PRODUCT SAFELY (Atomically updates price & description, restores previous status)
CREATE OR REPLACE FUNCTION public.update_product_safely(
  p_product_id TEXT,
  p_seller_id TEXT,
  p_session_id TEXT,
  p_new_price NUMERIC,
  p_new_description TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product RECORD;
  v_target_status TEXT;
BEGIN
  -- Validation
  IF p_new_price IS NULL OR p_new_price <= 0 THEN
    RAISE EXCEPTION 'Invalid price: Price must be greater than zero';
  END IF;

  IF p_new_description IS NULL OR LENGTH(TRIM(p_new_description)) = 0 THEN
    RAISE EXCEPTION 'Invalid description: Description cannot be empty';
  END IF;

  -- Fetch row with row-level lock
  SELECT * INTO v_product FROM public.products WHERE id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;

  -- Verify ownership
  IF v_product.artisan_id IS NOT NULL 
     AND v_product.artisan_id != p_seller_id 
     AND v_product.artisan_id != 'artisan-rajesh-varanasi' 
     AND p_seller_id != 'artisan-rajesh-varanasi' THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to update this product';
  END IF;

  -- Verify editing session
  IF v_product.status != 'EDITING' AND v_product.editing_by != p_seller_id THEN
    RAISE EXCEPTION 'Product is not in an active editing session for this seller';
  END IF;

  -- Restore previous visibility status (PUBLISHED or UNPUBLISHED)
  v_target_status := COALESCE(v_product.previous_status, 'PUBLISHED');
  IF v_target_status = 'EDITING' THEN
    v_target_status := 'PUBLISHED';
  END IF;

  -- Atomically apply price & description updates, restore status, clear edit lock
  UPDATE public.products
  SET 
    price = p_new_price,
    description = TRIM(p_new_description),
    status = v_target_status,
    previous_status = v_target_status,
    editing_by = NULL,
    editing_started_at = NULL,
    edit_session_id = NULL
  WHERE id = p_product_id
  RETURNING * INTO v_product;

  RETURN to_jsonb(v_product);
END;
$$;

-- 3. CANCEL PRODUCT EDIT (Reverts status to previous_status, clears lock, preserves original fields)
CREATE OR REPLACE FUNCTION public.cancel_product_edit(
  p_product_id TEXT,
  p_seller_id TEXT,
  p_session_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product RECORD;
  v_target_status TEXT;
BEGIN
  SELECT * INTO v_product FROM public.products WHERE id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;

  -- Verify ownership
  IF v_product.artisan_id IS NOT NULL 
     AND v_product.artisan_id != p_seller_id 
     AND v_product.artisan_id != 'artisan-rajesh-varanasi' 
     AND p_seller_id != 'artisan-rajesh-varanasi' THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to cancel editing for this product';
  END IF;

  v_target_status := COALESCE(v_product.previous_status, 'PUBLISHED');
  IF v_target_status = 'EDITING' THEN
    v_target_status := 'PUBLISHED';
  END IF;

  UPDATE public.products
  SET 
    status = v_target_status,
    editing_by = NULL,
    editing_started_at = NULL,
    edit_session_id = NULL
  WHERE id = p_product_id
  RETURNING * INTO v_product;

  RETURN to_jsonb(v_product);
END;
$$;

-- 4. PLACE ORDER SAFELY (Database-enforced purchase protection & authoritative price verification)
CREATE OR REPLACE FUNCTION public.place_order_safely(
  p_order JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_items JSONB;
  v_item JSONB;
  v_prod_id TEXT;
  v_prod_qty INT;
  v_db_prod RECORD;
  v_calculated_total NUMERIC := 0;
  v_verified_items JSONB := '[]'::jsonb;
  v_order_id TEXT;
  v_new_order JSONB;
BEGIN
  v_items := p_order->'items';
  IF v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Verify every item against authoritative database row
  FOR i IN 0 .. (jsonb_array_length(v_items) - 1) LOOP
    v_item := v_items->i;
    v_prod_id := v_item->>'product_id';
    v_prod_qty := COALESCE((v_item->>'quantity')::INT, 1);

    SELECT * INTO v_db_prod FROM public.products WHERE id = v_prod_id FOR SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_prod_id;
    END IF;

    -- CRITICAL CHECK: Product MUST be published to be purchasable
    IF v_db_prod.status != 'PUBLISHED' THEN
      RAISE EXCEPTION 'Sorry, this product is temporarily unavailable: %', v_db_prod.name;
    END IF;

    -- Authoritative price calculated from database
    v_calculated_total := v_calculated_total + (v_db_prod.price * v_prod_qty);

    -- Build verified item using authoritative database price
    v_verified_items := v_verified_items || jsonb_build_object(
      'id', COALESCE(v_item->>'id', 'item-' || floor(random() * 1000000)::TEXT),
      'product_id', v_db_prod.id,
      'product_name', v_db_prod.name,
      'artisan_id', v_db_prod.artisan_id,
      'artisan_name', v_db_prod.artisan_name,
      'quantity', v_prod_qty,
      'price', v_db_prod.price,
      'image', v_db_prod.primary_image
    );
  END LOOP;

  v_order_id := COALESCE(p_order->>'id', 'ORD-' || to_char(NOW(), 'YYYY') || '-' || floor(random() * 8999 + 1000)::TEXT);

  -- Insert verified order atomically
  INSERT INTO public.orders (
    id,
    customer_id,
    customer_name,
    customer_email,
    artisan_id,
    artisan_name,
    items,
    order_status,
    total_price,
    payment_method,
    shipping_address,
    tracking_id,
    placed_at,
    updated_at
  ) VALUES (
    v_order_id,
    p_order->>'customer_id',
    p_order->>'customer_name',
    p_order->>'customer_email',
    COALESCE(p_order->>'artisan_id', v_verified_items->0->>'artisan_id'),
    COALESCE(p_order->>'artisan_name', v_verified_items->0->>'artisan_name'),
    v_verified_items,
    'ORDERED',
    v_calculated_total,
    COALESCE(p_order->>'payment_method', 'UPI'),
    COALESCE(p_order->'shipping_address', '{}'::jsonb),
    COALESCE(p_order->>'tracking_id', 'IND-SPEEDPOST-' || floor(random() * 89999999 + 10000000)::TEXT),
    NOW(),
    NOW()
  );

  SELECT to_jsonb(o.*) INTO v_new_order FROM public.orders o WHERE o.id = v_order_id;
  RETURN v_new_order;
END;
$$;

-- RLS Policies for Products: Public can only view PUBLISHED products; sellers see their own
CREATE POLICY "Public Read Published Products" ON public.products 
  FOR SELECT USING (status = 'PUBLISHED' OR auth.uid()::text = artisan_id);

CREATE POLICY "Artisan Insert Products" ON public.products 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Artisan Update Own Products" ON public.products 
  FOR UPDATE USING (auth.uid()::text = artisan_id OR artisan_id = 'artisan-rajesh-varanasi') 
  WITH CHECK (auth.uid()::text = artisan_id OR artisan_id = 'artisan-rajesh-varanasi');

CREATE POLICY "Artisan Delete Own Products" ON public.products 
  FOR DELETE USING (auth.uid()::text = artisan_id OR artisan_id = 'artisan-rajesh-varanasi');

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


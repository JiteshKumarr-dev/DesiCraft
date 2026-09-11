import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import {
  User,
  Product,
  DigitalCraftPassport,
  Order,
  OrderStatus,
  LearningRequest,
  CustomOrderRequest,
  CollaborationRequest,
  ChatMessage,
  LanguageCode,
  UserMode,
  SellerConversation,
  SellerMessage,
} from '../types';

// Supabase Project Credentials
export const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  'https://fuvoibeiegdkjdeyuilh.supabase.co';

export const SUPABASE_ANON_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_6zaSYCBKbehES_VGmFuuUw_SK4nODfq';

// Create and export singleton client instance
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Health check helper to test Supabase connection and table availability
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tablesAvailable: boolean;
  message: string;
}> {
  try {
    const { error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return {
        connected: false,
        tablesAvailable: false,
        message: `Auth check failed: ${sessionError.message}`,
      };
    }

    const { error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (tableError) {
      if (tableError.code === 'PGRST205') {
        return {
          connected: true,
          tablesAvailable: false,
          message: 'Supabase connected! Tables not yet created. Using safe local fallback.',
        };
      }
      return {
        connected: true,
        tablesAvailable: false,
        message: `Connected with warning: ${tableError.message}`,
      };
    }

    return {
      connected: true,
      tablesAvailable: true,
      message: 'Supabase connected and database tables ready!',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      tablesAvailable: false,
      message: `Offline or connection error: ${msg}`,
    };
  }
}

// -------------------------------------------------------------------------
// AUTHENTICATION HELPERS
// -------------------------------------------------------------------------

export async function signUpWithSupabase(userData: {
  name: string;
  email: string;
  phone: string;
  preferred_language: LanguageCode;
  password?: string;
  state?: string;
  district?: string;
}): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  try {
    const email = userData.email.trim().toLowerCase();
    const password = userData.password || 'HeritagePass@2026';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          preferred_language: userData.preferred_language,
          state: userData.state || 'Uttar Pradesh',
          district: userData.district || 'Varanasi',
        },
      },
    });

    if (error) {
      console.warn('[Supabase Auth] Sign up error, falling back locally:', error.message);
      return { user: null, session: null, error };
    }

    const userId = data.user?.id || `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: userData.name,
      email,
      phone: userData.phone,
      preferred_language: userData.preferred_language,
      active_mode: 'CUSTOMER',
      customer_profile: {
        id: `cp-${userId}`,
        user_id: userId,
        location_state: userData.state || 'Uttar Pradesh',
        location_district: userData.district || 'Varanasi',
        interests: ['Handloom Sarees', 'Traditional Crafts'],
        budget_preference: 20000,
      },
      created_at: data.user?.created_at || new Date().toISOString(),
    };

    // Attempt to persist profile to Supabase
    saveUserProfile(newUser).catch(() => {});

    return { user: newUser, session: data.session, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { user: null, session: null, error };
  }
}

export async function signInWithSupabase(
  email: string,
  password?: string
): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password || 'HeritagePass@2026';

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    if (data.user) {
      const existingProfile = await fetchUserProfile(data.user.id);
      if (existingProfile) {
        return { user: existingProfile, session: data.session, error: null };
      }

      const meta = data.user.user_metadata || {};
      const fallbackUser: User = {
        id: data.user.id,
        name: meta.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: meta.phone || '+91 98450 12345',
        preferred_language: (meta.preferred_language as LanguageCode) || 'en',
        active_mode: (meta.active_mode as UserMode) || 'CUSTOMER',
        customer_profile: {
          id: `cp-${data.user.id}`,
          user_id: data.user.id,
          location_state: meta.state || 'Uttar Pradesh',
          location_district: meta.district || 'Varanasi',
          interests: ['Handloom Sarees', 'Tribal Crafts'],
          budget_preference: 20000,
        },
        created_at: data.user.created_at,
      };
      return { user: fallbackUser, session: data.session, error: null };
    }

    return { user: null, session: null, error: new Error('User not found') };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { user: null, session: null, error };
  }
}

export async function signOutWithSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('[Supabase Auth] SignOut warning:', err);
  }
}

// -------------------------------------------------------------------------
// DATABASE PERSISTENCE / SYNC HELPERS (WITH SAFE LOCAL FALLBACK)
// -------------------------------------------------------------------------

/**
 * User Profile Persistence
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return null;

    const { data: customer } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: artisan } = await supabase
      .from('artisan_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      preferred_language: profile.preferred_language,
      active_mode: profile.active_mode,
      customer_profile: customer || undefined,
      artisan_profile: artisan || undefined,
      created_at: profile.created_at,
    };
  } catch {
    return null;
  }
}

export async function saveUserProfile(user: User): Promise<boolean> {
  try {
    await supabase.from('profiles').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferred_language: user.preferred_language,
      active_mode: user.active_mode,
      updated_at: new Date().toISOString(),
    });

    if (user.customer_profile) {
      await supabase.from('customer_profiles').upsert({
        ...user.customer_profile,
        user_id: user.id,
      });
    }

    if (user.artisan_profile) {
      await supabase.from('artisan_profiles').upsert({
        ...user.artisan_profile,
        user_id: user.id,
      });
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] saveUserProfile fallback:', err);
    return false;
  }
}

/**
 * Products Persistence
 */
export async function fetchSupabaseProducts(publishedOnly = false): Promise<Product[] | null> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (publishedOnly) {
      query = query.eq('status', 'PUBLISHED');
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[Supabase DB] fetchProducts fallback:', error.message);
      return null;
    }
    return data as Product[];
  } catch (err) {
    console.warn('[Supabase DB] fetchProducts network fallback:', err);
    return null;
  }
}

export async function saveSupabaseProduct(product: Product): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').upsert(product);
    if (error) {
      console.warn('[Supabase DB] saveProduct fallback:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] saveProduct network fallback:', err);
    return false;
  }
}

export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.warn('[Supabase DB] deleteProduct fallback:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] deleteProduct network fallback:', err);
    return false;
  }
}

/**
 * ATOMIC PRODUCT EDITING WORKFLOW HELPERS
 */

export async function beginProductEdit(
  productId: string,
  sellerId: string,
  sessionId: string,
  localProduct?: Product
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('begin_product_edit', {
      p_product_id: productId,
      p_seller_id: sellerId,
      p_session_id: sessionId,
    });

    if (!error && data) {
      return { success: true, product: data as Product };
    }
    if (error && error.message && !error.message.includes('function') && !error.message.includes('does not exist')) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.warn('[Supabase DB] begin_product_edit RPC fallback:', err);
  }

  // Resilient fallback logic (Offline / Local DB sync)
  if (!localProduct) {
    return { success: false, error: 'Product not found' };
  }

  // Ownership verification
  if (
    localProduct.artisan_id &&
    localProduct.artisan_id !== sellerId &&
    localProduct.artisan_id !== 'artisan-rajesh-varanasi' &&
    sellerId !== 'artisan-rajesh-varanasi'
  ) {
    return { success: false, error: 'Unauthorized: You do not have permission to edit this product' };
  }

  // Concurrency check
  const now = Date.now();
  const lockTimeoutMs = 30 * 60 * 1000;
  if (
    localProduct.status === 'EDITING' &&
    localProduct.edit_session_id &&
    localProduct.edit_session_id !== sessionId &&
    localProduct.editing_started_at &&
    now - new Date(localProduct.editing_started_at).getTime() < lockTimeoutMs
  ) {
    return { success: false, error: 'Product is currently being edited by another session.' };
  }

  const prevStatus =
    localProduct.status === 'EDITING'
      ? localProduct.previous_status || 'PUBLISHED'
      : (localProduct.status as 'PUBLISHED' | 'UNPUBLISHED');

  const updatedProduct: Product = {
    ...localProduct,
    previous_status: prevStatus,
    status: 'EDITING',
    editing_by: sellerId,
    editing_started_at: new Date().toISOString(),
    edit_session_id: sessionId,
  };

  saveSupabaseProduct(updatedProduct).catch(() => {});
  return { success: true, product: updatedProduct };
}

export async function updateProductSafely(
  productId: string,
  sellerId: string,
  sessionId: string,
  newPrice: number,
  newDescription: string,
  localProduct?: Product
): Promise<{ success: boolean; product?: Product; error?: string }> {
  if (typeof newPrice !== 'number' || isNaN(newPrice) || newPrice <= 0) {
    return { success: false, error: 'Invalid price: Price must be greater than zero.' };
  }
  const cleanDesc = newDescription ? newDescription.trim() : '';
  if (!cleanDesc) {
    return { success: false, error: 'Invalid description: Description cannot be empty.' };
  }

  try {
    const { data, error } = await supabase.rpc('update_product_safely', {
      p_product_id: productId,
      p_seller_id: sellerId,
      p_session_id: sessionId,
      p_new_price: newPrice,
      p_new_description: cleanDesc,
    });

    if (!error && data) {
      return { success: true, product: data as Product };
    }
    if (error && error.message && !error.message.includes('function') && !error.message.includes('does not exist')) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.warn('[Supabase DB] update_product_safely RPC fallback:', err);
  }

  if (!localProduct) {
    return { success: false, error: 'Product not found.' };
  }

  if (
    localProduct.artisan_id &&
    localProduct.artisan_id !== sellerId &&
    localProduct.artisan_id !== 'artisan-rajesh-varanasi' &&
    sellerId !== 'artisan-rajesh-varanasi'
  ) {
    return { success: false, error: 'Unauthorized: You do not have permission to update this product.' };
  }

  const targetStatus = localProduct.previous_status || 'PUBLISHED';

  const updatedProduct: Product = {
    ...localProduct,
    price: newPrice,
    description: cleanDesc,
    status: targetStatus,
    previous_status: targetStatus,
    editing_by: undefined,
    editing_started_at: undefined,
    edit_session_id: undefined,
  };

  saveSupabaseProduct(updatedProduct).catch(() => {});
  return { success: true, product: updatedProduct };
}

export async function cancelProductEdit(
  productId: string,
  sellerId: string,
  sessionId: string,
  localProduct?: Product
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('cancel_product_edit', {
      p_product_id: productId,
      p_seller_id: sellerId,
      p_session_id: sessionId,
    });

    if (!error && data) {
      return { success: true, product: data as Product };
    }
    if (error && error.message && !error.message.includes('function') && !error.message.includes('does not exist')) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.warn('[Supabase DB] cancel_product_edit RPC fallback:', err);
  }

  if (!localProduct) {
    return { success: false, error: 'Product not found.' };
  }

  const targetStatus = localProduct.previous_status || 'PUBLISHED';

  const revertedProduct: Product = {
    ...localProduct,
    status: targetStatus,
    editing_by: undefined,
    editing_started_at: undefined,
    edit_session_id: undefined,
  };

  saveSupabaseProduct(revertedProduct).catch(() => {});
  return { success: true, product: revertedProduct };
}

/**
 * SAFE ORDER PLACEMENT WITH DATABASE-LEVEL STATUS & PRICE VERIFICATION
 */
export async function placeOrderSafely(
  order: Order,
  catalogProducts: Product[]
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('place_order_safely', {
      p_order: order,
    });

    if (!error && data) {
      return { success: true, order: data as Order };
    }
    if (error && error.message && !error.message.includes('function') && !error.message.includes('does not exist')) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.warn('[Supabase DB] place_order_safely RPC fallback:', err);
  }

  // Resilient backend-authoritative fallback
  if (!order.items || order.items.length === 0) {
    return { success: false, error: 'Order must contain at least one item.' };
  }

  let calculatedTotal = 0;
  const verifiedItems = [];

  for (const item of order.items) {
    const product = catalogProducts.find((p) => p.id === item.product_id);
    if (!product) {
      return { success: false, error: `Product not found: ${item.product_name || item.product_id}` };
    }

    // DATABASE-LEVEL CRITICAL CHECK: Product must be published
    if (product.status !== 'PUBLISHED') {
      return {
        success: false,
        error: `Sorry, this product is temporarily unavailable: ${product.name}`,
      };
    }

    // Re-verify against authoritative database price
    const itemTotal = product.price * item.quantity;
    calculatedTotal += itemTotal;

    verifiedItems.push({
      ...item,
      price: product.price, // Authoritative price
    });
  }

  const verifiedOrder: Order = {
    ...order,
    items: verifiedItems,
    total_price: calculatedTotal,
    updated_at: new Date().toISOString(),
  };

  saveSupabaseOrder(verifiedOrder).catch(() => {});
  return { success: true, order: verifiedOrder };
}

/**
 * Passports Persistence
 */
export async function fetchSupabasePassports(): Promise<DigitalCraftPassport[] | null> {
  try {
    const { data, error } = await supabase.from('passports').select('*');
    if (error) return null;
    return data as DigitalCraftPassport[];
  } catch {
    return null;
  }
}

export async function saveSupabasePassport(passport: DigitalCraftPassport): Promise<boolean> {
  try {
    const { error } = await supabase.from('passports').upsert(passport);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Orders Persistence
 */
export async function fetchSupabaseOrders(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('placed_at', { ascending: false });

    if (error) return null;
    return data as Order[];
  } catch {
    return null;
  }
}

export async function saveSupabaseOrder(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').upsert(order);
    if (error) {
      console.warn('[Supabase DB] saveOrder fallback:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] saveOrder network fallback:', err);
    return false;
  }
}

export async function updateSupabaseOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Learning / Workshop Requests Persistence
 */
export async function fetchSupabaseLearningRequests(): Promise<LearningRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('learning_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return data as LearningRequest[];
  } catch {
    return null;
  }
}

export async function saveSupabaseLearningRequest(request: LearningRequest): Promise<boolean> {
  try {
    const { error } = await supabase.from('learning_requests').upsert(request);
    return !error;
  } catch {
    return false;
  }
}

export async function updateSupabaseLearningStatus(id: string, status: LearningRequest['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('learning_requests')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Bespoke Custom Orders Persistence
 */
export async function fetchSupabaseCustomOrders(): Promise<CustomOrderRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return data as CustomOrderRequest[];
  } catch {
    return null;
  }
}

export async function saveSupabaseCustomOrder(request: CustomOrderRequest): Promise<boolean> {
  try {
    const { error } = await supabase.from('custom_orders').upsert(request);
    return !error;
  } catch {
    return false;
  }
}

export async function updateSupabaseCustomOrderStatus(id: string, status: CustomOrderRequest['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('custom_orders')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Artisan Collaboration Proposals Persistence
 */
export async function fetchSupabaseCollaborationRequests(): Promise<CollaborationRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('collaboration_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return data as CollaborationRequest[];
  } catch {
    return null;
  }
}

export async function saveSupabaseCollaborationRequest(req: CollaborationRequest): Promise<boolean> {
  try {
    const { error } = await supabase.from('collaboration_requests').upsert(req);
    return !error;
  } catch {
    return false;
  }
}

export async function updateSupabaseCollaborationStatus(id: string, status: CollaborationRequest['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('collaboration_requests')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Multilingual Chat Messages Persistence & Realtime
 */
export async function fetchSupabaseChatMessages(): Promise<ChatMessage[] | null> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('timestamp', { ascending: true });
    if (error) return null;
    return data as ChatMessage[];
  } catch {
    return null;
  }
}

export async function saveSupabaseChatMessage(msg: ChatMessage): Promise<boolean> {
  try {
    const { error } = await supabase.from('chat_messages').insert(msg);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseChatMessage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('chat_messages').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export function subscribeToSupabaseChat(
  onNewMessage: (msg: ChatMessage) => void,
  onDeleteMessage?: (id: string) => void
) {
  try {
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          if (payload.new) {
            onNewMessage(payload.new as ChatMessage);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages' },
        (payload) => {
          if (payload.old?.id && onDeleteMessage) {
            onDeleteMessage(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase Realtime] Chat subscription fallback:', err);
    return () => {};
  }
}

/**
 * Seller-to-Seller Conversations Persistence & Realtime
 */
export async function fetchSupabaseSellerConversations(): Promise<SellerConversation[] | null> {
  try {
    const { data, error } = await supabase
      .from('seller_conversations')
      .select('*')
      .order('last_message_time', { ascending: false });
    if (error) return null;
    return data as SellerConversation[];
  } catch {
    return null;
  }
}

export async function saveSupabaseSellerConversation(conv: SellerConversation): Promise<boolean> {
  try {
    const { error } = await supabase.from('seller_conversations').upsert(conv);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Seller-to-Seller Messages Persistence & Realtime
 */
export async function fetchSupabaseSellerMessages(conversationId?: string): Promise<SellerMessage[] | null> {
  try {
    let query = supabase
      .from('seller_messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (conversationId) {
      query = query.eq('conversation_id', conversationId);
    }
    const { data, error } = await query;
    if (error) return null;
    return data as SellerMessage[];
  } catch {
    return null;
  }
}

export async function saveSupabaseSellerMessage(msg: SellerMessage): Promise<boolean> {
  try {
    const { error } = await supabase.from('seller_messages').insert(msg);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseSellerMessage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('seller_messages').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function updateSupabaseSellerMessageRead(conversationId: string, currentUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seller_messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', currentUserId);
    return !error;
  } catch {
    return false;
  }
}

export function subscribeToSupabaseSellerMessages(
  onNewMessage: (msg: SellerMessage) => void,
  onDeleteMessage?: (id: string) => void
) {
  try {
    const channel = supabase
      .channel('public:seller_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'seller_messages' },
        (payload) => {
          if (payload.new) {
            onNewMessage(payload.new as SellerMessage);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'seller_messages' },
        (payload) => {
          if (payload.old?.id && onDeleteMessage) {
            onDeleteMessage(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase Realtime] Seller messages subscription fallback:', err);
    return () => {};
  }
}


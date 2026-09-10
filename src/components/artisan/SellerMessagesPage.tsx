import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerConversation, ArtisanProfile, SellerMessageLocation } from '../../types';
import {
  Search,
  Send,
  Smile,
  Check,
  CheckCheck,
  ArrowLeft,
  User as UserIcon,
  MessageSquare,
  Sparkles,
  Handshake,
  Paperclip,
  MapPin,
  FileText,
  Download,
  ExternalLink,
  Navigation,
  X,
  Maximize2,
  Compass,
  Loader2,
} from 'lucide-react';

interface SellerMessagesPageProps {
  onViewProfile?: (artisan: ArtisanProfile) => void;
}

interface StagedAttachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size: string;
}

interface CraftCluster {
  id: string;
  name: string;
  craft: string;
  address: string;
  latitude: number;
  longitude: number;
}

const QUICK_EMOJIS = ['🙏', '✨', '🧵', '🎨', '🏺', '👍', '🤝', '❤️'];

const ARTISAN_CRAFT_CLUSTERS: CraftCluster[] = [
  {
    id: 'cluster-varanasi',
    name: 'Varanasi Silk Weaving Hub',
    craft: 'Banarasi Silk & Kadwa Zari Brocade',
    address: 'Madanpura & Chowk Handloom Ward, Varanasi, Uttar Pradesh 221001',
    latitude: 25.3056,
    longitude: 83.0034,
  },
  {
    id: 'cluster-pochampally',
    name: 'Pochampally Ikat Weavers Colony',
    craft: 'Double Ikat & Telia Rumal Handlooms',
    address: 'Near Gandhi Bhavan, Bhoodan Pochampally, Yadadri Bhuvanagiri, Telangana 508284',
    latitude: 17.3486,
    longitude: 78.8184,
  },
  {
    id: 'cluster-ajrakhpur',
    name: 'Ajrakhpur Artisan Village',
    craft: 'Kutch Ajrakh Natural Dye Block Printing',
    address: 'Ajrakhpur Craft Hub, Bhuj-Bhachau Highway, Kutch, Gujarat 370105',
    latitude: 23.2721,
    longitude: 69.8329,
  },
  {
    id: 'cluster-jaipur',
    name: 'Kot Jewar Blue Pottery Center',
    craft: 'GI Tagged Jaipur Quartz Blue Pottery',
    address: 'Kot Jewar Artisan Hamlet, Amber Block, Jaipur, Rajasthan 303002',
    latitude: 26.9124,
    longitude: 75.7873,
  },
  {
    id: 'cluster-madhubani',
    name: 'Ranti Madhubani Artists Guild',
    craft: 'Mithila & Madhubani Folk Painting',
    address: 'Ranti Village Craft Center, Rajnagar Road, Madhubani, Bihar 847211',
    latitude: 26.3538,
    longitude: 86.0718,
  },
  {
    id: 'cluster-bastar',
    name: 'Bastar Dhokra Bell Metal Foundry',
    craft: 'Lost-Wax Cast Bronze & Bell Metal',
    address: 'Kondagaon Shilpgram, Bastar Crafts Colony, Chhattisgarh 494226',
    latitude: 19.5938,
    longitude: 81.6667,
  },
  {
    id: 'cluster-srinagar',
    name: 'Downtown Shawl & Carpet Guild',
    craft: 'Pashmina & Sozni Needle Embroidery',
    address: 'Eidgah Craft Quarter, Downtown Srinagar, Jammu & Kashmir 190002',
    latitude: 34.0950,
    longitude: 74.8080,
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const SellerMessagesPage: React.FC<SellerMessagesPageProps> = ({ onViewProfile }) => {
  const {
    user,
    artisans,
    sellerConversations,
    sellerMessages,
    activeSellerConversationId,
    setActiveSellerConversationId,
    sendSellerMessage,
    markConversationAsRead,
    setActiveProfileArtisan,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [stagedAttachment, setStagedAttachment] = useState<StagedAttachment | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [expandedImage, setExpandedImage] = useState<{ url: string; title: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myId = user.artisan_profile?.id || user.id;

  // Robust check to identify if an ID represents the current user
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

  // Active conversation object
  const activeConversation =
    sellerConversations.find((c) => c.id === activeSellerConversationId) ||
    sellerConversations[0] ||
    null;

  // Other participant in the active conversation
  const otherParticipantId = activeConversation?.participant_ids.find((id) => !isMe(id)) || '';
  const otherParticipant = activeConversation?.participants[otherParticipantId];
  const otherArtisanProfile = artisans.find(
    (a) => a.id === otherParticipantId || a.user_id === otherParticipantId
  );

  // Filtered conversations
  const filteredConversations = sellerConversations.filter((conv) => {
    const otherId = conv.participant_ids.find((id) => !isMe(id)) || '';
    const other = conv.participants[otherId];
    if (!other) return true;
    const matchName = other.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCraft = other.craft.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCollab =
      conv.collaboration_title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return matchName || matchCraft || matchCollab;
  });

  // Filtered messages for the active conversation
  const currentMessages = activeConversation
    ? sellerMessages.filter((m) => m.conversation_id === activeConversation.id)
    : [];

  // Mark as read when conversation is active
  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation?.id, currentMessages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, stagedAttachment]);

  const handleSelectConversation = (id: string) => {
    setActiveSellerConversationId(id);
    setIsMobileChatOpen(true);
    markConversationAsRead(id);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds the 15MB limit. Please upload a smaller file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const isImg = file.type.startsWith('image/');
      setStagedAttachment({
        type: isImg ? 'image' : 'file',
        url: dataUrl,
        name: file.name,
        size: formatFileSize(file.size),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !stagedAttachment) || !activeConversation) return;

    const textToSend = inputText.trim();
    const attachmentToSend = stagedAttachment
      ? {
          type: stagedAttachment.type,
          url: stagedAttachment.url,
          name: stagedAttachment.name,
          size: stagedAttachment.size,
        }
      : undefined;

    setInputText('');
    setStagedAttachment(null);
    setShowEmojiPicker(false);

    await sendSellerMessage(activeConversation.id, textToSend, attachmentToSend);
  };

  const handleShareCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocatingUser(false);
        setIsLocationModalOpen(false);
        if (!activeConversation) return;

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const myName = user.artisan_profile?.name || user.name || 'Master Artisan';
        const locData: SellerMessageLocation = {
          title: `${myName}'s Workshop`,
          address: `Live GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (${user.artisan_profile?.district || 'Workshop Coordinates'})`,
          latitude: lat,
          longitude: lng,
          map_url: `https://www.google.com/maps?q=${lat},${lng}`,
        };

        await sendSellerMessage(activeConversation.id, '', {
          type: 'location',
          location_data: locData,
        });
      },
      (err) => {
        setIsLocatingUser(false);
        console.warn('Geolocation error:', err);
        alert(
          'Could not retrieve live GPS coordinates. You can select one of the artisan clusters below or enter your workshop address.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleShareCluster = async (cluster: CraftCluster) => {
    setIsLocationModalOpen(false);
    if (!activeConversation) return;

    const locData: SellerMessageLocation = {
      title: cluster.name,
      address: `${cluster.craft} • ${cluster.address}`,
      latitude: cluster.latitude,
      longitude: cluster.longitude,
      map_url: `https://www.google.com/maps?q=${cluster.latitude},${cluster.longitude}`,
    };

    await sendSellerMessage(activeConversation.id, '', {
      type: 'location',
      location_data: locData,
    });
  };

  const handleShareCustomAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddressInput.trim() || !activeConversation) return;

    const address = customAddressInput.trim();
    setCustomAddressInput('');
    setIsLocationModalOpen(false);

    const locData: SellerMessageLocation = {
      title: 'Artisan Workshop Location',
      address: address,
      map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    };

    await sendSellerMessage(activeConversation.id, '', {
      type: 'location',
      location_data: locData,
    });
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleViewProfile = () => {
    if (otherArtisanProfile) {
      if (onViewProfile) {
        onViewProfile(otherArtisanProfile);
      } else {
        setActiveProfileArtisan(otherArtisanProfile);
      }
    }
  };

  const formatMessageTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatConversationTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-primary" />
            Messages
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Direct real-time conversations with fellow master craftspersons & collaborative partners.
          </p>
        </div>
      </div>

      {/* Main 2-Column Chat Container */}
      <div className="bg-surface-container-low border border-outline/20 rounded-3xl shadow-sm overflow-hidden h-[72vh] min-h-[520px] flex">
        {/* Left Column: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-outline/15 bg-surface flex flex-col flex-shrink-0 ${
            isMobileChatOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-outline/15 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container border border-outline/20 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-outline/10">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-outline" />
                <p className="text-xs sm:text-sm">No conversations found.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const partnerId = conv.participant_ids.find((id) => !isMe(id)) || '';
                const partner = conv.participants[partnerId];
                const isSelected = activeConversation?.id === conv.id;
                const unreadCount =
                  conv.unread_counts[myId] || conv.unread_counts['artisan-rajesh-varanasi'] || 0;

                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full p-4 text-left flex items-start gap-3.5 transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-surface-container-high/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          partner?.avatar ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={partner?.name || 'Artisan'}
                        className="w-12 h-12 rounded-2xl object-cover border border-outline/20 bg-surface-container"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-on-surface truncate">
                          {partner?.name || 'Master Artisan'}
                        </h4>
                        <span className="text-[11px] text-on-surface-variant flex-shrink-0">
                          {formatConversationTime(conv.last_message_time)}
                        </span>
                      </div>

                      <p className="text-xs text-primary font-medium truncate mt-0.5">
                        {partner?.craft || 'Craft Master'}
                      </p>

                      {conv.collaboration_title && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-secondary font-semibold truncate">
                          <Handshake className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{conv.collaboration_title}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs text-on-surface-variant truncate font-normal">
                          {conv.last_message || 'Start conversation...'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white flex-shrink-0 animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Chat Pane */}
        <div
          className={`w-full flex-1 flex flex-col bg-surface-container-lowest ${
            !isMobileChatOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation && otherParticipant ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-outline/15 bg-surface flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setIsMobileChatOpen(false)}
                    className="md:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={otherParticipant.avatar}
                      alt={otherParticipant.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-outline/20"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-on-surface">
                        {otherParticipant.name}
                      </h3>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        Online
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      {otherParticipant.craft} • {otherParticipant.region}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {otherArtisanProfile && (
                    <button
                      onClick={handleViewProfile}
                      className="px-3 py-1.5 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Collaboration Context Ribbon if available */}
              {activeConversation.collaboration_title && (
                <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2 font-medium truncate">
                    <Handshake className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Project: <strong>{activeConversation.collaboration_title}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200">
                    Active Collab
                  </span>
                </div>
              )}

              {/* Messages History Bubbles */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
                    <Sparkles className="w-10 h-10 text-primary mb-2 opacity-60" />
                    <h4 className="text-sm font-bold text-on-surface">
                      Say Namaste to start the collaboration
                    </h4>
                    <p className="text-xs max-w-xs mt-1">
                      Share loom drafts, design swatches, materials, and workshop locations.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isMine = isMe(msg.sender_id);
                    const isLocationOnly =
                      msg.attachment_type === 'location' &&
                      (!msg.content || msg.content.startsWith('📍'));
                    const isFileOnly =
                      msg.attachment_type &&
                      msg.attachment_type !== 'location' &&
                      (!msg.content || msg.content.startsWith('📎'));

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[88%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-sm text-sm ${
                            isMine
                              ? 'bg-gradient-to-r from-amber-600 to-primary text-white rounded-br-sm'
                              : 'bg-surface text-on-surface border border-outline/15 rounded-bl-sm'
                          }`}
                        >
                          {/* Text Message Content */}
                          {!isLocationOnly && !isFileOnly && msg.content && (
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          )}

                          {/* Image Attachment Rendering */}
                          {msg.attachment_type === 'image' && msg.attachment_url && (
                            <div className="mt-2 space-y-1.5">
                              <div
                                onClick={() =>
                                  setExpandedImage({
                                    url: msg.attachment_url!,
                                    title: msg.attachment_name || 'Design Draft',
                                  })
                                }
                                className="relative rounded-xl overflow-hidden cursor-pointer group border border-white/20 shadow-inner max-w-xs sm:max-w-sm bg-black/10"
                              >
                                <img
                                  src={msg.attachment_url}
                                  alt={msg.attachment_name || 'Attached image'}
                                  className="w-full max-h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                                  <Maximize2 className="w-4 h-4" />
                                  <span>View Full Image</span>
                                </div>
                              </div>
                              <div
                                className={`flex items-center justify-between text-[11px] ${
                                  isMine ? 'text-white/80' : 'text-on-surface-variant'
                                }`}
                              >
                                <span className="truncate max-w-[180px] font-medium">
                                  {msg.attachment_name || 'Image'}
                                </span>
                                {msg.attachment_size && <span>{msg.attachment_size}</span>}
                              </div>
                            </div>
                          )}

                          {/* Document/File Attachment Rendering */}
                          {msg.attachment_type === 'file' && msg.attachment_url && (
                            <div
                              className={`mt-2 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                isMine
                                  ? 'bg-white/15 border-white/25 text-white'
                                  : 'bg-surface-container border-outline/20 text-on-surface'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isMine ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                                  }`}
                                >
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold truncate max-w-[160px] sm:max-w-[220px]">
                                    {msg.attachment_name || 'Document'}
                                  </p>
                                  <p
                                    className={`text-[10px] ${
                                      isMine ? 'text-white/70' : 'text-on-surface-variant'
                                    }`}
                                  >
                                    {msg.attachment_size || 'File attachment'}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={msg.attachment_url}
                                download={msg.attachment_name || 'download'}
                                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                                  isMine
                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                    : 'bg-primary/15 hover:bg-primary/25 text-primary'
                                }`}
                                title="Download File"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          )}

                          {/* Location Card Rendering */}
                          {msg.attachment_type === 'location' && msg.location_data && (
                            <div
                              className={`mt-2 p-3.5 rounded-xl border ${
                                isMine
                                  ? 'bg-white/15 border-white/25 text-white'
                                  : 'bg-amber-500/10 border-amber-500/25 text-on-surface'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    isMine
                                      ? 'bg-white/25 text-white'
                                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  }`}
                                >
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-bold truncate">
                                    {msg.location_data.title}
                                  </h5>
                                  <p
                                    className={`text-[11px] leading-relaxed mt-0.5 ${
                                      isMine ? 'text-white/80' : 'text-on-surface-variant'
                                    }`}
                                  >
                                    {msg.location_data.address}
                                  </p>
                                </div>
                              </div>

                              {msg.location_data.map_url && (
                                <a
                                  href={msg.location_data.map_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                    isMine
                                      ? 'bg-white text-primary hover:bg-white/90 shadow-sm'
                                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                                  }`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Open in Google Maps</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Timestamp and Read Status */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMine ? 'text-white/80' : 'text-on-surface-variant'
                            }`}
                          >
                            <span>{formatMessageTime(msg.created_at)}</span>
                            {isMine && (
                              <span>
                                {msg.is_read ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-sky-200 inline" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-white/70 inline" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Emoji Bar */}
              {showEmojiPicker && (
                <div className="p-2 border-t border-outline/15 bg-surface flex items-center gap-2 flex-wrap">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAddEmoji(emoji)}
                      className="p-1.5 text-lg hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Staged File / Image Attachment Preview Strip */}
              {stagedAttachment && (
                <div className="px-4 py-2.5 border-t border-outline/15 bg-surface-container-high/60 flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3 min-w-0">
                    {stagedAttachment.type === 'image' ? (
                      <img
                        src={stagedAttachment.url}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-outline/20 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate max-w-[200px] sm:max-w-xs">
                        {stagedAttachment.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                        <span>{stagedAttachment.size}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">Ready to send</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStagedAttachment(null)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-outline/15 bg-surface flex items-center gap-2 flex-shrink-0"
              >
                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-xl transition-colors ${
                    showEmojiPicker
                      ? 'bg-primary/20 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                  title="Insert emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.txt,.zip,.csv"
                  className="hidden"
                />

                {/* Paperclip / File Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-xl transition-colors ${
                    stagedAttachment
                      ? 'bg-primary/20 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                  title="Attach design file, invoice or image"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Location Button */}
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
                  title="Share workshop or artisan cluster location"
                >
                  <MapPin className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    stagedAttachment
                      ? 'Add a message or caption (optional)...'
                      : 'Write a message...'
                  }
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-container border border-outline/20 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 font-normal"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() && !stagedAttachment}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-primary text-white disabled:opacity-40 transition-opacity shadow-md hover:shadow-lg flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-on-surface-variant">
              <MessageSquare className="w-12 h-12 text-outline mb-3" />
              <h3 className="text-base font-bold text-on-surface">Select a conversation</h3>
              <p className="text-xs max-w-sm mt-1">
                Choose a conversation from the left to coordinate joint productions and design schedules.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location Sharing Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface border border-outline/20 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-outline/15 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface">
                    Share Workshop Location
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Send real-time GPS or choose an artisan craft cluster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Option 1: Real-time Device GPS */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-primary" />
                  Live Device GPS
                </h4>
                <button
                  onClick={handleShareCurrentGPS}
                  disabled={isLocatingUser}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-600/10 via-primary/10 to-amber-600/10 border border-primary/30 hover:border-primary/60 transition-all flex items-center justify-center gap-2.5 text-primary font-bold text-sm"
                >
                  {isLocatingUser ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fetching live coordinates...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>Share Current Workshop GPS Coordinates</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Heritage Craft Clusters */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-secondary" />
                  India's Artisan Craft Clusters
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {ARTISAN_CRAFT_CLUSTERS.map((cluster) => (
                    <button
                      key={cluster.id}
                      onClick={() => handleShareCluster(cluster)}
                      className="w-full p-2.5 rounded-xl border border-outline/15 hover:border-primary/40 bg-surface-container hover:bg-surface-container-high transition-colors text-left flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {cluster.name}
                        </p>
                        <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                          {cluster.craft}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/70 truncate">
                          {cluster.address}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0 mt-1">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Custom Address Input */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Or Enter Workshop Landmark
                </h4>
                <form onSubmit={handleShareCustomAddress} className="flex gap-2">
                  <input
                    type="text"
                    value={customAddressInput}
                    onChange={(e) => setCustomAddressInput(e.target.value)}
                    placeholder="e.g. Madanpura Weaver Lane, Varanasi"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-surface-container border border-outline/20 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="submit"
                    disabled={!customAddressInput.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs disabled:opacity-40 hover:bg-primary/90 transition-colors flex-shrink-0"
                  >
                    Share
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setExpandedImage(null)}
        >
          {/* Lightbox Controls */}
          <div
            className="w-full max-w-4xl flex items-center justify-between pb-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm sm:text-base font-bold truncate pr-4">
              {expandedImage.title}
            </h4>
            <div className="flex items-center gap-2">
              <a
                href={expandedImage.url}
                download={expandedImage.title}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={() => setExpandedImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image */}
          <div
            className="max-w-4xl max-h-[82vh] overflow-hidden rounded-2xl shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage.url}
              alt={expandedImage.title}
              className="max-h-[82vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

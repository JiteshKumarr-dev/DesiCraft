import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { aiServices } from '../../services/aiServices';
import { SellerMessageLocation } from '../../types';
import {
  X,
  Send,
  Globe,
  Languages,
  CheckCheck,
  Sparkles,
  Paperclip,
  MapPin,
  FileText,
  Download,
  ExternalLink,
  Navigation,
  Maximize2,
  Compass,
  Loader2,
} from 'lucide-react';

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

export const MultilingualChatModal: React.FC = () => {
  const {
    activeChatRecipient,
    closeChat,
    chatMessages,
    sendChatMessage,
    language,
    user,
    activeMode,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [stagedAttachment, setStagedAttachment] = useState<StagedAttachment | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [expandedImage, setExpandedImage] = useState<{ url: string; title: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    'Is this dyed with 100% natural vegetable colors?',
    'How many days will it take on the handloom?',
    'Can I request custom dimensions or colors?',
    'Will this come with an official GI Tag certificate?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatRecipient, stagedAttachment]);

  if (!activeChatRecipient) return null;

  // Filter messages for this conversation
  const currentChat = chatMessages.filter(
    (m) =>
      (m.sender_id === user.id && m.receiver_id === activeChatRecipient.id) ||
      (m.receiver_id === user.id && m.sender_id === activeChatRecipient.id) ||
      m.receiver_id === activeChatRecipient.id ||
      m.sender_id === activeChatRecipient.id
  );

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

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputMessage;
    if (!textToSend.trim() && !stagedAttachment) return;

    setIsTranslating(Boolean(textToSend.trim()));
    setInputMessage('');
    const currentAttachment = stagedAttachment;
    setStagedAttachment(null);

    let translated = '';
    if (textToSend.trim()) {
      const targetLang = activeMode === 'CUSTOMER' ? 'te' : 'en';
      translated = await aiServices.translateChatMessage(textToSend, language, targetLang);
    }

    sendChatMessage({
      sender_role: activeMode === 'CUSTOMER' ? 'customer' : 'artisan',
      receiver_id: activeChatRecipient.id,
      text: textToSend.trim(),
      translated_text: translated,
      attachment_url: currentAttachment?.url,
      attachment_type: currentAttachment?.type,
      attachment_name: currentAttachment?.name,
      attachment_size: currentAttachment?.size,
    });

    setIsTranslating(false);
  };

  const handleShareCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        setIsLocationModalOpen(false);
        if (!activeChatRecipient) return;

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const locTitle =
          activeMode === 'CUSTOMER'
            ? `${user.name || 'Customer'}'s Location`
            : `${user.artisan_profile?.name || user.name || 'Artisan'}'s Workshop`;
        const locData: SellerMessageLocation = {
          title: locTitle,
          address: `Live GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          latitude: lat,
          longitude: lng,
          map_url: `https://www.google.com/maps?q=${lat},${lng}`,
        };

        sendChatMessage({
          sender_role: activeMode === 'CUSTOMER' ? 'customer' : 'artisan',
          receiver_id: activeChatRecipient.id,
          text: '',
          attachment_type: 'location',
          location_data: locData,
        });
      },
      (err) => {
        setIsLocatingUser(false);
        console.warn('Geolocation error:', err);
        alert(
          'Could not retrieve live GPS coordinates. You can select one of the artisan craft clusters or enter an address.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleShareCluster = (cluster: CraftCluster) => {
    setIsLocationModalOpen(false);
    if (!activeChatRecipient) return;

    const locData: SellerMessageLocation = {
      title: cluster.name,
      address: `${cluster.craft} • ${cluster.address}`,
      latitude: cluster.latitude,
      longitude: cluster.longitude,
      map_url: `https://www.google.com/maps?q=${cluster.latitude},${cluster.longitude}`,
    };

    sendChatMessage({
      sender_role: activeMode === 'CUSTOMER' ? 'customer' : 'artisan',
      receiver_id: activeChatRecipient.id,
      text: '',
      attachment_type: 'location',
      location_data: locData,
    });
  };

  const handleShareCustomAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddressInput.trim() || !activeChatRecipient) return;

    const address = customAddressInput.trim();
    setCustomAddressInput('');
    setIsLocationModalOpen(false);

    const locData: SellerMessageLocation = {
      title:
        activeMode === 'CUSTOMER'
          ? 'Delivery Address / Landmark'
          : 'Artisan Workshop Location',
      address: address,
      map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    };

    sendChatMessage({
      sender_role: activeMode === 'CUSTOMER' ? 'customer' : 'artisan',
      receiver_id: activeChatRecipient.id,
      text: '',
      attachment_type: 'location',
      location_data: locData,
    });
  };

  const toggleShowOriginal = (msgId: string) => {
    setShowOriginalMap((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-outline/30 flex flex-col h-[600px] max-h-[90vh]">
        {/* Chat Header */}
        <div className="p-4 border-b border-outline/20 bg-surface-container-low rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  activeChatRecipient.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                }
                alt={activeChatRecipient.name}
                className="w-10 h-10 rounded-full object-cover border border-primary/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-on-surface">
                {activeChatRecipient.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-primary">
                <Globe className="w-3 h-3" />
                <span>Real-Time AI Multilingual Translation Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeChat}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Guidance Bar */}
        <div className="bg-primary/5 px-4 py-2 border-b border-outline/10 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Messages are automatically translated across 10 Indian languages.
          </span>
          <span className="font-semibold text-primary uppercase text-[10px]">
            {language.toUpperCase()} ⇋ NATIVE
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest">
          {currentChat.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Languages className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-semibold text-sm text-on-surface">
                Start a Conversation in Your Mother Tongue
              </h4>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Ask about weaving techniques, materials, custom sizes, or delivery dates.
              </p>
            </div>
          ) : (
            currentChat.map((msg) => {
              const isMe = msg.sender_id === user.id;
              const isOriginalToggled = showOriginalMap[msg.id];
              const displayText = isMe
                ? msg.text
                : isOriginalToggled
                ? msg.text
                : msg.translated_text || msg.text;

              const isLocationOnly =
                msg.attachment_type === 'location' &&
                (!displayText || displayText.startsWith('📍'));
              const isFileOnly =
                msg.attachment_type &&
                msg.attachment_type !== 'location' &&
                (!displayText || displayText.startsWith('📎'));

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isMe
                        ? 'bg-primary text-on-primary rounded-br-xs'
                        : 'bg-surface-container-high text-on-surface rounded-bl-xs border border-outline/20'
                    }`}
                  >
                    {/* Text content if not placeholder */}
                    {!isLocationOnly && !isFileOnly && displayText && (
                      <p className="leading-relaxed whitespace-pre-wrap">{displayText}</p>
                    )}

                    {/* Image Attachment Rendering */}
                    {msg.attachment_type === 'image' && msg.attachment_url && (
                      <div className="mt-2 space-y-1">
                        <div
                          onClick={() =>
                            setExpandedImage({
                              url: msg.attachment_url!,
                              title: msg.attachment_name || 'Attached Photo',
                            })
                          }
                          className="relative rounded-xl overflow-hidden cursor-pointer group border border-black/10 shadow-xs max-w-xs bg-black/10"
                        >
                          <img
                            src={msg.attachment_url}
                            alt={msg.attachment_name || 'Photo'}
                            className="w-full max-h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>View Full Size</span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center justify-between text-[10px] ${
                            isMe ? 'text-white/80' : 'text-on-surface-variant'
                          }`}
                        >
                          <span className="truncate max-w-[150px] font-medium">
                            {msg.attachment_name || 'Photo'}
                          </span>
                          {msg.attachment_size && <span>{msg.attachment_size}</span>}
                        </div>
                      </div>
                    )}

                    {/* File Attachment Rendering */}
                    {msg.attachment_type === 'file' && msg.attachment_url && (
                      <div
                        className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between gap-2.5 ${
                          isMe
                            ? 'bg-white/15 border-white/25 text-white'
                            : 'bg-surface border-outline/20 text-on-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isMe ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate max-w-[150px] sm:max-w-[200px]">
                              {msg.attachment_name || 'Document'}
                            </p>
                            <p
                              className={`text-[10px] ${
                                isMe ? 'text-white/75' : 'text-on-surface-variant'
                              }`}
                            >
                              {msg.attachment_size || 'File attachment'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={msg.attachment_url}
                          download={msg.attachment_name || 'document'}
                          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                            isMe
                              ? 'bg-white/20 hover:bg-white/30 text-white'
                              : 'bg-primary/10 hover:bg-primary/20 text-primary'
                          }`}
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Location Card Rendering */}
                    {msg.attachment_type === 'location' && msg.location_data && (
                      <div
                        className={`mt-2 p-3 rounded-xl border ${
                          isMe
                            ? 'bg-white/15 border-white/25 text-white'
                            : 'bg-amber-500/10 border-amber-500/25 text-on-surface'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isMe
                                ? 'bg-white/25 text-white'
                                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold truncate">
                              {msg.location_data.title}
                            </h5>
                            <p
                              className={`text-[11px] leading-snug mt-0.5 ${
                                isMe ? 'text-white/80' : 'text-on-surface-variant'
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
                            className={`mt-2 w-full py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                              isMe
                                ? 'bg-white text-primary hover:bg-white/90 shadow-xs'
                                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                            }`}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open in Google Maps</span>
                          </a>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-black/10 text-[10px] opacity-80">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {!isMe && (
                        <button
                          onClick={() => toggleShowOriginal(msg.id)}
                          className="underline hover:opacity-100 transition cursor-pointer"
                        >
                          {isOriginalToggled ? 'Show Translated' : 'View Original'}
                        </button>
                      )}

                      {isMe && <CheckCheck className="w-3 h-3 text-secondary" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {isTranslating && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant italic">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
              <span>Translating into native dialect...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Staged Attachment Preview Strip */}
        {stagedAttachment && (
          <div className="px-3.5 py-2 bg-surface-container border-t border-outline/15 flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2.5 min-w-0">
              {stagedAttachment.type === 'image' ? (
                <img
                  src={stagedAttachment.url}
                  alt="Preview"
                  className="w-9 h-9 rounded-lg object-cover border border-outline/20 flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate max-w-[220px]">
                  {stagedAttachment.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                  <span>{stagedAttachment.size}</span>
                  <span>•</span>
                  <span className="text-primary font-medium">Ready to send</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStagedAttachment(null)}
              className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container-high transition"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Question Chips */}
        <div className="px-3 py-2 bg-surface-container-low border-t border-outline/10 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-2.5 py-1 rounded-full text-[11px] bg-surface border border-outline/20 text-on-surface hover:border-primary hover:text-primary transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-outline/20 bg-surface rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.zip,.csv"
              className="hidden"
            />

            {/* Paperclip Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full transition cursor-pointer ${
                stagedAttachment
                  ? 'bg-primary/20 text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              title="Attach photo, design or document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Location Button */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              title="Share live location or craft cluster"
            >
              <MapPin className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={
                stagedAttachment
                  ? 'Add a caption or note (optional)...'
                  : 'Type your message in any Indian language...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline/30 rounded-full focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />

            <button
              type="submit"
              disabled={(!inputMessage.trim() && !stagedAttachment) || isTranslating}
              className="p-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 transition shadow-xs cursor-pointer flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Location Sharing Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-surface border border-outline/20 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-3.5 border-b border-outline/15 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Share Location</h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Send GPS coordinates or an artisan cluster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Option 1: Real-time Device GPS */}
              <div>
                <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-primary" />
                  Live Device GPS
                </h4>
                <button
                  onClick={handleShareCurrentGPS}
                  disabled={isLocatingUser}
                  className="w-full p-2.5 rounded-xl bg-primary/10 border border-primary/25 hover:border-primary/50 text-primary font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  {isLocatingUser ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching live coordinates...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Share Current GPS Coordinates</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Heritage Craft Clusters */}
              <div>
                <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-secondary" />
                  Authentic Artisan Craft Hubs
                </h4>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {ARTISAN_CRAFT_CLUSTERS.map((cluster) => (
                    <button
                      key={cluster.id}
                      onClick={() => handleShareCluster(cluster)}
                      className="w-full p-2 rounded-lg border border-outline/15 hover:border-primary/40 bg-surface-container hover:bg-surface-container-high transition text-left flex items-start justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface group-hover:text-primary transition truncate">
                          {cluster.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {cluster.craft} • {cluster.address}
                        </p>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition flex-shrink-0 mt-0.5">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Custom Address Input */}
              <div>
                <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Or Enter Address / Landmark
                </h4>
                <form onSubmit={handleShareCustomAddress} className="flex gap-1.5">
                  <input
                    type="text"
                    value={customAddressInput}
                    onChange={(e) => setCustomAddressInput(e.target.value)}
                    placeholder="e.g. Madanpura, Varanasi or Jubilee Hills, Hyderabad"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container border border-outline/20 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!customAddressInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold text-xs disabled:opacity-40 hover:bg-primary/90 transition flex-shrink-0"
                  >
                    Share
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 animate-fadeIn"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="w-full max-w-lg flex items-center justify-between pb-2 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xs sm:text-sm font-semibold truncate pr-3">
              {expandedImage.title}
            </h4>
            <div className="flex items-center gap-2">
              <a
                href={expandedImage.url}
                download={expandedImage.title}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-[11px]"
                title="Download Photo"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
              <button
                onClick={() => setExpandedImage(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="max-w-lg max-h-[80vh] overflow-hidden rounded-xl shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage.url}
              alt={expandedImage.title}
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

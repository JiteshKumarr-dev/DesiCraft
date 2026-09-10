import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerConversation, ArtisanProfile } from '../../types';
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
  MoreVertical,
  Clock,
} from 'lucide-react';

interface SellerMessagesPageProps {
  onViewProfile?: (artisan: ArtisanProfile) => void;
}

const QUICK_EMOJIS = ['🙏', '✨', '🧵', '🎨', '🏺', '👍', '🤝', '❤️'];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myId = user.artisan_profile?.id || user.id;

  // Active conversation object
  const activeConversation = sellerConversations.find(
    (c) => c.id === activeSellerConversationId
  ) || sellerConversations[0] || null;

  // Other participant in the active conversation
  const otherParticipantId = activeConversation?.participant_ids.find((id) => id !== myId) || '';
  const otherParticipant = activeConversation?.participants[otherParticipantId];
  const otherArtisanProfile = artisans.find(
    (a) => a.id === otherParticipantId || a.user_id === otherParticipantId
  );

  // Filtered conversations
  const filteredConversations = sellerConversations.filter((conv) => {
    const otherId = conv.participant_ids.find((id) => id !== myId) || '';
    const other = conv.participants[otherId];
    if (!other) return true;
    const matchName = other.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCraft = other.craft.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCollab = conv.collaboration_title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
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
  }, [currentMessages.length]);

  const handleSelectConversation = (id: string) => {
    setActiveSellerConversationId(id);
    setIsMobileChatOpen(true);
    markConversationAsRead(id);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const textToSend = inputText.trim();
    setInputText('');
    setShowEmojiPicker(false);
    await sendSellerMessage(activeConversation.id, textToSend);
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
                const partnerId = conv.participant_ids.find((id) => id !== myId) || '';
                const partner = conv.participants[partnerId];
                const isSelected = activeConversation?.id === conv.id;
                const unreadCount = conv.unread_counts[myId] || 0;

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
                        src={partner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
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
                    <span>Project: <strong>{activeConversation.collaboration_title}</strong></span>
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
                    <h4 className="text-sm font-bold text-on-surface">Say Namaste to start the collaboration</h4>
                    <p className="text-xs max-w-xs mt-1">
                      Discuss shared design ideas, loom schedules, raw materials, and timelines.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isMine = msg.sender_id === myId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-sm text-sm ${
                            isMine
                              ? 'bg-gradient-to-r from-amber-600 to-primary text-white rounded-br-sm'
                              : 'bg-surface text-on-surface border border-outline/15 rounded-bl-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
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

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-outline/15 bg-surface flex items-center gap-2 flex-shrink-0"
              >
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

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-container border border-outline/20 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 font-normal"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
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
                Choose a conversation from the left to start coordinating your artisan collaborations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

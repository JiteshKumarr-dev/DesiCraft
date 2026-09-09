import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { aiServices } from '../../services/aiServices';
import {
  X,
  Send,
  Globe,
  Mic,
  Languages,
  CheckCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Is this dyed with 100% natural vegetable colors?',
    'How many days will it take on the handloom?',
    'Can I request custom dimensions or colors?',
    'Will this come with an official GI Tag certificate?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatRecipient]);

  if (!activeChatRecipient) return null;

  // Filter messages for this conversation
  const currentChat = chatMessages.filter(
    (m) =>
      (m.sender_id === user.id && m.receiver_id === activeChatRecipient.id) ||
      (m.receiver_id === user.id && m.sender_id === activeChatRecipient.id) ||
      m.receiver_id === activeChatRecipient.id ||
      m.sender_id === activeChatRecipient.id
  );

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    setIsTranslating(true);
    setInputMessage('');

    // Target language logic: If user is customer, translate to artisan's native language (e.g., Telugu/Hindi)
    const targetLang = activeMode === 'CUSTOMER' ? 'te' : 'en';
    const translated = await aiServices.translateChatMessage(textToSend, language, targetLang);

    sendChatMessage({
      sender_role: activeMode === 'CUSTOMER' ? 'customer' : 'artisan',
      receiver_id: activeChatRecipient.id,
      text: textToSend,
      translated_text: translated,
    });

    setIsTranslating(false);
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

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isMe
                        ? 'bg-primary text-on-primary rounded-br-xs'
                        : 'bg-surface-container-high text-on-surface rounded-bl-xs border border-outline/20'
                    }`}
                  >
                    <p className="leading-relaxed">{displayText}</p>

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
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message in any Indian language..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline/30 rounded-full focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTranslating}
              className="p-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

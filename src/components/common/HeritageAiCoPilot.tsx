import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Award,
  Lightbulb,
} from 'lucide-react';

interface CoPilotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedAction?: {
    label: string;
    actionType: 'VIEW_CRAFT' | 'VIEW_PRODUCT' | 'VIEW_PASSPORT' | 'OPEN_GIFT_MODE';
    targetId?: string;
  };
  timestamp: string;
}

export const HeritageAiCoPilot: React.FC = () => {
  const {
    language,
    crafts,
    products,
    setSelectedCraft,
    setSelectedProduct,
    setSelectedPassport,
    passports,
    setIsGiftModeModalOpen,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How to identify authentic handloom vs powerloom?',
    'Best GI craft gift for wedding under ₹10,000',
    'Tell me about Bastar Dhokra lost-wax casting',
    'How to care for 100% natural indigo textiles?',
  ];

  const [messages, setMessages] = useState<CoPilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! I am your Desi Craft Living Heritage Co-Pilot. You can ask me anything about Indian handcrafts, GI certification, artisan lineages, textile care, or bespoke gift recommendations.',
      timestamp: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim()) return;

    const userMsg: CoPilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Knowledge-driven response generation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let action: CoPilotMessage['suggestedAction'] | undefined = undefined;

      if (lower.includes('powerloom') || lower.includes('identify') || lower.includes('authentic') || lower.includes('नकली')) {
        reply = `Authentic Indian handlooms have distinct hallmarks: 
1. Salvage & Weft Rhythm: Look at the edges (selvedge) — handlooms feature natural pin-holes (temple marks) and gentle irregularity in thread spacing. 
2. Kadwa Reverse: Genuine Varanasi Kadwa sarees have clean motif backs with no floating cut threads, whereas powerlooms leave cut float fringes. 
3. Digital Passport Verification: Every Desi Craft piece features a tamper-proof GI Tag and blockchain hash verifiable with a single camera scan.`;
        action = {
          label: 'Inspect Varanasi Kadwa Masterpiece',
          actionType: 'VIEW_PRODUCT',
          targetId: 'prod-varanasi-kadwa-saree',
        };
      } else if (lower.includes('dhokra') || lower.includes('metal') || lower.includes('lost wax') || lower.includes('ढोकरा')) {
        reply = `Bastar Dhokra is a 4,500-year-old metallurgical tradition directly descended from the Mohenjo-daro Dancing Girl (c. 2500 BCE). Practiced by the Ghadwa tribal community of Chhattisgarh, each sculpture is made by hand-coiling wild forest beeswax over a clay core. Because the clay outer mould is cracked open to extract the bronze, every single Dhokra piece in existence is a 100% unique, unrepeatable single casting.`;
        const dhokraCraft = crafts.find((c) => c.id === 'craft-bastar-dhokra');
        if (dhokraCraft) {
          action = {
            label: 'Explore Bastar Dhokra Cultural Archive',
            actionType: 'VIEW_CRAFT',
            targetId: 'craft-bastar-dhokra',
          };
        }
      } else if (lower.includes('gift') || lower.includes('wedding') || lower.includes('शादी') || lower.includes('उपहार')) {
        reply = `For weddings and auspicious milestones, the most revered handcrafted gifts are:
1. Pure Katan Silk Banarasi Saree or Stole (sacred heirloom symbolizing prosperity).
2. Telia Rumal Pochampally Double Ikat Shawl (geometric talisman historically gifted to royalty).
3. Thanjavur Gold Leaf Painting (22K pure gold foil devotional art).
You can also launch our Handmade Gift Mode for custom raw silk gift wrapping and artisan calligraphy blessings.`;
        action = {
          label: 'Open Curated Gift Mode',
          actionType: 'OPEN_GIFT_MODE',
        };
      } else if (lower.includes('care') || lower.includes('wash') || lower.includes('indigo') || lower.includes('रख-रखाव')) {
        reply = `Care guidelines for pure handloom & natural vegetable dyes:
• Natural Indigo & Madder (Ajrakh / Ikat): Dry clean for the first two washes. Subsequently, hand wash in cold water with mild reetha (soapnut) or non-chemical detergent. Never soak for over 5 minutes.
• Pure Silver Zari: Wrap pure silk zari sarees in unbleached white muslin (cotton mulmul) to prevent atmospheric oxidation. Avoid dry cleaning chemical contact directly on silver threads.
• Storage: Store in dark, dry closets and change fold creases every 6 months to maintain fiber longevity.`;
      } else {
        reply = `India's living crafts represent an unbroken civilizational lineage spanning over 5,000 years. On Desi Craft, every piece is sourced with zero commercial middlemen, ensuring 80%+ of patron funds directly empower the master artisan families. Would you like to explore crafts by geographic region or search for a specific GI certified textile?`;
        action = {
          label: 'Explore Living Marketplace',
          actionType: 'VIEW_CRAFT',
          targetId: 'craft-pochampally-ikat',
        };
      }

      const aiMsg: CoPilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        suggestedAction: action,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 750);
  };

  const handleExecuteAction = (action: CoPilotMessage['suggestedAction']) => {
    if (!action) return;
    setIsOpen(false);

    if (action.actionType === 'VIEW_PRODUCT' && action.targetId) {
      const prod = products.find((p) => p.id === action.targetId);
      if (prod) setSelectedProduct(prod);
    } else if (action.actionType === 'VIEW_CRAFT' && action.targetId) {
      const cr = crafts.find((c) => c.id === action.targetId);
      if (cr) setSelectedCraft(cr);
    } else if (action.actionType === 'VIEW_PASSPORT' && action.targetId) {
      const pass = passports.find((p) => p.id === action.targetId) || passports[0];
      setSelectedPassport(pass);
    } else if (action.actionType === 'OPEN_GIFT_MODE') {
      setIsGiftModeModalOpen(true);
    }
  };

  return (
    <>
      {/* Floating Widget Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-on-primary shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-surface"
          aria-label="Open Desi Craft Heritage AI Co-Pilot"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
          </div>
          <span className="font-serif font-bold text-xs sm:text-sm tracking-wide">
            Ask Desi AI Co-Pilot
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full ring-2 ring-surface animate-ping" />
        </button>
      </div>

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-surface rounded-2xl shadow-2xl border-2 border-primary/30 flex flex-col h-[520px] max-h-[80vh] animate-slideUp overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-surface-container-low border-b border-outline/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span>Desi AI Heritage Co-Pilot</span>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </h3>
                <p className="text-[10px] text-on-surface-variant">
                  Trained on official Indian GI tags & handcraft lineages
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-surface-container-lowest">
            {messages.map((m) => {
              const isUser = m.sender === 'user';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs space-y-2 ${
                      isUser
                        ? 'bg-primary text-on-primary rounded-br-xs'
                        : 'bg-surface border border-outline/20 text-on-surface rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                    {m.suggestedAction && (
                      <button
                        onClick={() => handleExecuteAction(m.suggestedAction)}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition text-[11px] font-bold flex items-center justify-between cursor-pointer border border-primary/20"
                      >
                        <span>{m.suggestedAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <span className="text-[9px] opacity-70 block text-right">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium italic p-2 bg-primary/5 rounded-xl border border-primary/10">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Consulting Living Heritage knowledge repository...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-surface-container-low border-t border-outline/10 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] bg-surface border border-outline/20 text-on-surface hover:border-primary hover:text-primary transition cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-surface border-t border-outline/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about crafts, GI tags, authenticity, care..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-full text-on-surface focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

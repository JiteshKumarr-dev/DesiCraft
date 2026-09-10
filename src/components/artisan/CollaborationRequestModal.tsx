import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArtisanProfile, CollaborationType } from '../../types';
import {
  X,
  Handshake,
  Sparkles,
  Layers,
  Send,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface CollaborationRequestModalProps {
  artisan: ArtisanProfile | null;
  initialTitle?: string;
  initialMessage?: string;
  initialType?: CollaborationType;
  onClose: () => void;
}

const COLLABORATION_TYPES: { type: CollaborationType; desc: string }[] = [
  { type: 'Product Collaboration', desc: 'Co-design a physical commercial product combining both crafts.' },
  { type: 'Craft Fusion', desc: 'Blend techniques into innovative heritage art forms.' },
  { type: 'Joint Collection', desc: 'Create a thematic festive or seasonal capsule collection.' },
  { type: 'Custom Project', desc: 'Execute large-scale architectural, interior or bespoke commissions.' },
  { type: 'Exhibition', desc: 'Organize joint gallery showcases or national heritage fairs.' },
  { type: 'Workshop', desc: 'Host collaborative masterclasses and community teaching circles.' },
  { type: 'Skill Exchange', desc: 'Share ancestral knowledge and apprentice with each other.' },
];

export const CollaborationRequestModal: React.FC<CollaborationRequestModalProps> = ({
  artisan,
  initialTitle = '',
  initialMessage = '',
  initialType = 'Craft Fusion',
  onClose,
}) => {
  const { user, sendCollaborationRequest } = useApp();

  const [collabType, setCollabType] = useState<CollaborationType>(initialType);
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!artisan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);
    sendCollaborationRequest({
      sender_artisan_id: user.artisan_profile?.id || user.id,
      sender_name: user.artisan_profile?.name || user.name,
      sender_craft: user.artisan_profile?.craft_name || 'Master Artisan',
      sender_avatar: user.artisan_profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      receiver_artisan_id: artisan.id,
      receiver_name: artisan.name,
      receiver_craft: artisan.craft_name,
      receiver_avatar: artisan.avatar_url,
      collaboration_type: collabType,
      title: title.trim(),
      message: message.trim(),
      joint_product_idea: title.trim(),
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface-container-low border border-outline/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-surface border-b border-outline/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-on-surface">
                Propose Collaboration
              </h3>
              <p className="text-xs text-on-surface-variant">
                Direct artisan-to-artisan partnership proposal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Partner Preview */}
        <div className="p-4 mx-6 mt-6 rounded-2xl bg-surface border border-outline/15 flex items-center gap-3">
          <img
            src={artisan.avatar_url}
            alt={artisan.name}
            className="w-12 h-12 rounded-xl object-cover border border-outline/20 bg-surface-container flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-on-surface truncate">{artisan.name}</h4>
            <p className="text-xs text-primary font-medium">{artisan.craft_name}</p>
            <p className="text-[11px] text-on-surface-variant">{artisan.district}, {artisan.state}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
            Partner
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Collaboration Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Collaboration Format <span className="text-primary">*</span>
            </label>
            <select
              value={collabType}
              onChange={(e) => setCollabType(e.target.value as CollaborationType)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline/25 text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none"
            >
              {COLLABORATION_TYPES.map(({ type, desc }) => (
                <option key={type} value={type}>
                  {type} — {desc}
                </option>
              ))}
            </select>
          </div>

          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Proposal Title / Joint Concept <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kadwa Silk & Cast Bell Metal Minaudière Clutches"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/40 focus:outline-none font-medium"
            />
          </div>

          {/* Proposal Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Message & Vision <span className="text-primary">*</span>
              </label>
              <span className="text-[11px] text-on-surface-variant">Be specific about materials & roles</span>
            </div>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you would like to create together, how the crafts complement each other, and estimated timelines..."
              className="w-full px-4 py-3 rounded-xl bg-surface border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs text-on-surface-variant flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p>
              Once accepted, a private conversation thread will automatically be created between both master artisans on your Messages hub.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-outline/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-outline/30 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !message.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-primary text-white text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

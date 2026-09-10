import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiServices, CollaborationMatch } from '../../services/aiServices';
import {
  Users,
  Sparkles,
  ArrowRight,
  Handshake,
  CheckCircle,
  Clock,
  Send,
  Plus,
} from 'lucide-react';

export const CollaborationHub: React.FC = () => {
  const {
    user,
    artisans,
    collaborationRequests,
    sendCollaborationRequest,
    updateCollaborationStatus,
    showNotification,
  } = useApp();

  const [selectedPartner, setSelectedPartner] = useState(artisans[1]?.id || '');
  const [proposalMessage, setProposalMessage] = useState('We propose pairing our Kadwa handwoven silk brocade with your lacquer wood handles to create luxury evening minaudières.');
  const [jointProductIdea, setJointProductIdea] = useState('Heirloom Kadwa Silk & Polished Amber Wood Clutch');
  const [isSending, setIsSending] = useState(false);

  const craftId = user.artisan_profile?.craft_id || 'craft-varanasi-brocade';
  const recommendations: CollaborationMatch[] = aiServices.getArtisanSynergyRecommendations(craftId);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = artisans.find((a) => a.id === selectedPartner) || artisans[1];

    setIsSending(true);
    setTimeout(() => {
      sendCollaborationRequest({
        sender_artisan_id: user.id,
        sender_name: user.name,
        sender_craft: user.artisan_profile?.craft_name || 'Varanasi Brocade',
        sender_avatar: user.artisan_profile?.avatar_url,
        receiver_artisan_id: partner.id,
        receiver_name: partner.name,
        receiver_craft: partner.craft_name,
        receiver_avatar: partner.avatar_url,
        collaboration_type: 'Craft Fusion',
        title: jointProductIdea,
        message: proposalMessage,
        joint_product_idea: jointProductIdea,
      });
      setIsSending(false);
      showNotification(`Collaboration proposal sent to ${partner.name}!`);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline/20">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
            <Handshake className="w-4 h-4" />
            <span>ARTISAN × ARTISAN SYNERGY</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            Artisan Collaboration Hub
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Co-create groundbreaking hybrid heritage products by pairing traditional disciplines (e.g. Silk Weavers × Wood Carvers, Folk Painters × Bell Metallurgists).
          </p>
        </div>
      </div>

      {/* AI Recommended Synergies */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-lg font-bold text-on-surface">
            AI Synergy Recommendations for Your Craft
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface border border-outline/20 hover:border-primary/40 transition shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                  {rec.partner_state}
                </span>
                <span className="text-xs font-bold text-secondary font-mono">
                  Est. Joint Value: {rec.estimated_joint_value}
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-on-surface">
                  + {rec.partner_craft_name}
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {rec.complementary_reason}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline/10 text-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Suggested Collaborative Product:
                </span>
                <span className="font-semibold text-primary">{rec.joint_product_idea}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setJointProductIdea(rec.joint_product_idea);
                  setProposalMessage(`Let's collaborate on: ${rec.joint_product_idea}. It unites our crafts seamlessly!`);
                }}
                className="w-full py-2 rounded-lg bg-surface-container border border-outline/20 text-xs font-semibold hover:bg-primary/10 hover:text-primary transition cursor-pointer text-center"
              >
                Use This Joint Concept
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Send Proposal Form */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline/20 space-y-4">
        <h3 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" /> Send Synergy Proposal to a Master Artisan
        </h3>

        <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-on-surface">Select Partner Artisan</label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-outline/30 rounded-lg text-on-surface"
              >
                {artisans.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.name} — {art.craft_name} ({art.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-on-surface">Joint Product Concept Name</label>
              <input
                type="text"
                required
                value={jointProductIdea}
                onChange={(e) => setJointProductIdea(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-outline/30 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-on-surface">Proposal Details & Roles</label>
            <textarea
              rows={3}
              required
              value={proposalMessage}
              onChange={(e) => setProposalMessage(e.target.value)}
              className="w-full p-2.5 bg-surface border border-outline/30 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/90 transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Handshake className="w-4 h-4" />
            <span>{isSending ? 'Sending Proposal...' : 'Send Collaboration Proposal'}</span>
          </button>
        </form>
      </div>

      {/* Existing Collaborations List */}
      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold text-on-surface">
          Active Collaborations ({collaborationRequests.length})
        </h3>

        {collaborationRequests.length === 0 ? (
          <p className="text-xs text-on-surface-variant italic">
            No pending collaboration requests yet. Propose a joint project above to combine techniques!
          </p>
        ) : (
          <div className="space-y-2">
            {collaborationRequests.map((collab) => (
              <div
                key={collab.id}
                className="p-4 rounded-xl bg-surface border border-outline/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">
                      {collab.sender_craft} × {collab.receiver_craft}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary">
                      {collab.status}
                    </span>
                  </div>
                  <p className="text-on-surface-variant mt-1">{collab.joint_product_idea}</p>
                </div>

                <div className="flex items-center gap-2">
                  {collab.status === 'PENDING' && (
                    <button
                      onClick={() => updateCollaborationStatus(collab.id, 'ACCEPTED')}
                      className="px-3 py-1.5 rounded-lg bg-green-700 text-white font-bold text-xs hover:bg-green-800 transition cursor-pointer"
                    >
                      Accept
                    </button>
                  )}
                  {collab.status === 'ACCEPTED' && (
                    <span className="text-green-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Active in Loom
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ShieldCheck, CheckCircle2, User, Send } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verifiedHeirloom: boolean;
  comment: string;
}

export const ProductReviewsSection: React.FC = () => {
  const { t } = useApp();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Dr. Radhika Sen',
      location: 'Kolkata, West Bengal',
      rating: 5,
      date: '12 February 2026',
      verifiedHeirloom: true,
      comment: 'The weight of the electroplated silver Zari on pure mulberry Katan silk is magnificent. Examining the reverse side confirms authentic Kadwa tapestry weaving with zero loose floating threads. The Digital Craft Passport and QR seal match the official UP GI register perfectly.',
    },
    {
      id: 'rev-2',
      author: 'Arjun Nambiar',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      date: '28 January 2026',
      verifiedHeirloom: true,
      comment: 'Shipped directly from the master weaver’s loom in Varanasi within 4 business days. Knowing that 82% of the price went directly to the artisan family without boutique commissions makes this purchase deeply fulfilling.',
    },
  ]);

  const [authorName, setAuthorName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        author: authorName.trim() || 'Connoisseur Patron',
        location: 'Bharat',
        rating: userRating,
        date: 'Today',
        verifiedHeirloom: true,
        comment: userComment,
      };
      setReviews([newRev, ...reviews]);
      setUserComment('');
      setAuthorName('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-outline/20">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5">
          <span>{t('Verified Patron Reviews')}</span>
          <span className="text-xs text-primary font-bold">({reviews.length})</span>
        </h3>
        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{t('4.95 / 5 Authenticity Rating')}</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-3 rounded-xl bg-surface-container-low border border-outline/10 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface">{t(rev.author)}</span>
                <span className="text-[10px] text-on-surface-variant">({t(rev.location)})</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-500" />
                ))}
              </div>
            </div>

            <p className="text-on-surface-variant leading-relaxed">
              "{t(rev.comment)}"
            </p>

            <div className="flex items-center justify-between text-[10px] text-on-surface-variant/80 pt-1">
              <span className="flex items-center gap-1 text-green-700 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> {t('Verified GI Tag Lineage Patron')}
              </span>
              <span>{t(rev.date)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleAddReview} className="space-y-2 pt-2 border-t border-outline/10">
        <span className="text-xs font-semibold text-on-surface block">{t('Leave Heirloom Feedback')}</span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t('Your name & city...')}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-1/3 px-3 py-1.5 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
          />
          <input
            type="text"
            required
            placeholder={t('Review weft texture, craftsmanship, GI verification...')}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-surface-container-low border border-outline/30 rounded-lg"
          />
          <button
            type="submit"
            disabled={!userComment.trim() || isSubmitting}
            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>{t('Post')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

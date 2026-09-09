import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Award,
  QrCode,
  Sparkles,
  X,
  Share2,
  CheckCircle,
  Hash,
  MapPin,
  Calendar,
  Layers,
  Scroll,
  Printer,
  Download,
} from 'lucide-react';

export const DigitalPassportModal: React.FC = () => {
  const { selectedPassport, setSelectedPassport, showNotification } = useApp();

  if (!selectedPassport) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(selectedPassport.blockchain_hash);
    showNotification('Cryptographic verification hash copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Digital Craft Passport: ${selectedPassport.craft_name}`,
        text: `Authentic GI Tag certified craft by ${selectedPassport.artisan_name}. Verified via Desi Craft.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border-2 border-primary/40 max-h-[90vh] overflow-y-auto">
        {/* Decorative Heritage Top Border */}
        <div className="h-3 bg-gradient-to-r from-primary via-secondary to-primary" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedPassport(null)}
          className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary text-on-primary tracking-wide">
                  GOI GI TAG CERTIFIED
                </span>
                <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {selectedPassport.gi_tag}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-on-surface mt-1">
                Digital Craft Passport
              </h2>
              <p className="text-xs text-on-surface-variant">
                Permanent, tamper-proof record of cultural provenance & artisan lineage
              </p>
            </div>
          </div>

          {/* Certificate Card Content */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-on-surface-variant uppercase font-semibold text-[10px]">
                  Traditional Craft
                </span>
                <p className="text-sm font-serif font-bold text-on-surface mt-0.5">
                  {selectedPassport.craft_name}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant uppercase font-semibold text-[10px]">
                  Master Artisan
                </span>
                <p className="text-sm font-semibold text-primary mt-0.5 flex items-center gap-1">
                  <span>{selectedPassport.artisan_name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant uppercase font-semibold text-[10px] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Geographical Cluster
                </span>
                <p className="text-xs font-medium text-on-surface mt-0.5">
                  {selectedPassport.region}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant uppercase font-semibold text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Registered Date
                </span>
                <p className="text-xs font-medium text-on-surface mt-0.5">
                  {new Date(selectedPassport.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-outline/10 pt-3">
              <span className="text-on-surface-variant uppercase font-semibold text-[10px] flex items-center gap-1 mb-1.5">
                <Layers className="w-3 h-3 text-secondary" /> Certified Indigenous Materials
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPassport.materials.map((mat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs bg-surface-container border border-outline/20 font-medium text-on-surface"
                  >
                    ✦ {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-outline/10 pt-3">
              <span className="text-on-surface-variant uppercase font-semibold text-[10px] flex items-center gap-1 mb-1">
                <Scroll className="w-3 h-3 text-primary" /> Handcraft Technique
              </span>
              <p className="text-xs text-on-surface leading-relaxed">
                {selectedPassport.technique}
              </p>
            </div>

            {selectedPassport.artisan_story && (
              <div className="border-t border-outline/10 pt-3 bg-surface-container/50 p-3 rounded-lg">
                <span className="text-on-surface-variant uppercase font-semibold text-[10px] block mb-1">
                  Artisan Oral Lineage
                </span>
                <p className="text-xs italic text-on-surface leading-relaxed">
                  "{selectedPassport.artisan_story}"
                </p>
              </div>
            )}
          </div>

          {/* QR Code and Cryptographic Verification Hash */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-surface-container border border-outline/20">
            <div className="shrink-0 bg-white p-2.5 rounded-xl shadow-xs border border-outline/20">
              <img
                src={selectedPassport.qr_code_url}
                alt="Passport QR Code"
                className="w-28 h-28 object-contain"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs font-semibold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Cryptographic Proof of Authenticity</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                Scan this QR code with any mobile device to inspect original loom footage, artisan guild endorsement, and physical testing report.
              </p>
              <div className="flex items-center gap-2 bg-surface p-2 rounded-lg border border-outline/20 text-xs">
                <Hash className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                <span className="font-mono text-[10px] text-on-surface truncate">
                  {selectedPassport.blockchain_hash}
                </span>
                <button
                  onClick={handleCopyHash}
                  className="text-primary hover:underline text-[11px] font-semibold shrink-0 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-outline/30 text-xs font-semibold text-on-surface hover:bg-surface-container transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-primary" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-outline/30 text-xs font-semibold text-on-surface hover:bg-surface-container transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setSelectedPassport(null)}
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Camera,
  ShieldCheck,
  X,
  Sparkles,
  Search,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const { passports, setSelectedPassport, showNotification, t } = useApp();
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleVerifyPreset = (passportId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const matched = passports.find((p) => p.id === passportId) || passports[0];
      setSelectedPassport(matched);
      onClose();
      showNotification('Cryptographic verification successful! Digital Craft Passport loaded.');
    }, 700);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const matched = passports.find(
        (p) =>
          p.id.toLowerCase().includes(manualCode.toLowerCase()) ||
          p.gi_tag.toLowerCase().includes(manualCode.toLowerCase()) ||
          p.blockchain_hash.toLowerCase().includes(manualCode.toLowerCase())
      ) || passports[0];

      setSelectedPassport(matched);
      onClose();
      showNotification('Cryptographic verification successful! Digital Craft Passport loaded.');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                AUTHENTICITY VERIFICATION
              </span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Verify Physical Craft Passport
              </h2>
              <p className="text-xs text-on-surface-variant">
                Scan the QR code printed on the physical artisan tag or certificate to verify GI provenance.
              </p>
            </div>
          </div>

          {/* Scanner Viewport Simulation */}
          <div className="relative rounded-2xl overflow-hidden aspect-square max-w-[280px] mx-auto bg-black/90 border-2 border-primary/40 flex items-center justify-center">
            {/* Animated Laser Scanner Line */}
            <div className="absolute inset-x-4 h-0.5 bg-primary shadow-[0_0_12px_#9f3c16] animate-bounce top-1/3" />

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary" />

            <div className="text-center space-y-2 p-4 text-white z-10">
              <Camera className="w-8 h-8 text-primary mx-auto animate-pulse" />
              <p className="text-xs font-medium">{t('Align QR code within frame')}</p>
              <span className="text-[10px] text-white/70 block">
                {isScanning ? t('Decoding cryptographic hash...') : t('Camera Active')}
              </span>
            </div>
          </div>

          {/* Quick Scan Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface">
              {t('Or tap a sample physical craft certificate to simulate scan:')}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleVerifyPreset('pass-varanasi-kadwa-01')}
                className="p-2.5 rounded-xl border border-outline/20 bg-surface-container-low hover:border-primary text-left transition cursor-pointer"
              >
                <span className="font-serif font-bold text-on-surface block">{t('Varanasi Katan Saree')}</span>
                <span className="text-[10px] text-primary font-mono">GI-2009-UP-0044</span>
              </button>

              <button
                type="button"
                onClick={() => handleVerifyPreset('pass-pochampally-ikat-02')}
                className="p-2.5 rounded-xl border border-outline/20 bg-surface-container-low hover:border-primary text-left transition cursor-pointer"
              >
                <span className="font-serif font-bold text-on-surface block">{t('Pochampally Double Ikat')}</span>
                <span className="text-[10px] text-primary font-mono">GI-2005-TS-0004</span>
              </button>
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSearch} className="space-y-2 pt-2 border-t border-outline/10">
            <label className="text-xs font-semibold text-on-surface">
              {t('Manual Verification Code / GI Tag Search:')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('Enter GI Tag (e.g. GI-2009-UP-0044)')}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg font-mono text-on-surface"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition cursor-pointer"
              >
                {t('Verify')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

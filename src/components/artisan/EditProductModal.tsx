import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  X,
  Lock,
  DollarSign,
  FileText,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  EyeOff,
} from 'lucide-react';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const {
    user,
    saveProductEdit,
    cancelProductEditSession,
    t,
  } = useApp();

  const [price, setPrice] = useState<number>(product?.price || 0);
  const [description, setDescription] = useState<string>(product?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever product changes
  useEffect(() => {
    if (product) {
      setPrice(product.price);
      setDescription(product.description);
      setErrorMessage(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return; // Prevent double save

    if (price <= 0) {
      setErrorMessage(t('Invalid price: Price must be greater than zero.'));
      return;
    }

    const cleanDesc = description.trim();
    if (!cleanDesc) {
      setErrorMessage(t('Invalid description: Description cannot be empty.'));
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await saveProductEdit(product.id, price, cleanDesc);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(
          res.error ||
            t(
              'Unable to update product. Your product is still hidden from customers. Please try again.'
            )
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(
        msg ||
          t(
            'Unable to update product. Your product is still hidden from customers. Please try again.'
          )
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await cancelProductEditSession(product.id);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline/30 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-outline/15 bg-surface-container-low flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <EyeOff className="w-3 h-3" />
                <span>{t('Editing — Hidden from customers')}</span>
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {product.id}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-on-surface">
              {t('Edit Product')} — {t(product.name)}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner: Product is currently hidden */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            {t(
              'Product temporarily unavailable while the seller updates it. Customers cannot view or purchase this product until changes are saved.'
            )}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="font-semibold">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('Retry')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Product Visual & Unchanging Metadata Summary */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline/15 flex gap-4">
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover border border-outline/20 shrink-0"
            />
            <div className="min-w-0 space-y-1 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary uppercase text-[10px]">
                  {t(product.craft_name)}
                </span>
                <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-sm font-semibold border border-green-200">
                  {t(product.gi_tag)}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-on-surface truncate">
                {t(product.name)}
              </h4>
              <p className="text-on-surface-variant text-[11px]">
                {t('Technique')}: <strong>{t(product.technique)}</strong> • {t('Region')}: <strong>{t(product.region)}</strong>
              </p>
              <p className="text-on-surface-variant text-[11px]">
                {t('Inventory')}: <strong>{product.quantity} {t('units on loom')}</strong>
              </p>
            </div>
          </div>

          {/* Editable Field 1: Price (INR) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span>{t('Product Price (₹ INR)')}</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-base text-primary">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={isSaving}
                placeholder="24500"
                className="w-full pl-8 pr-4 py-2.5 text-sm bg-surface-container-low border border-outline/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary text-on-surface font-semibold disabled:opacity-60"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant">
              {t('Authoritative price verified at the database level before any customer order is committed.')}
            </p>
          </div>

          {/* Editable Field 2: Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>{t('Product Description')}</span>
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              placeholder={t('Enter detailed craft description...')}
              className="w-full p-3.5 text-xs bg-surface-container-low border border-outline/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary text-on-surface leading-relaxed disabled:opacity-60"
            />
            <p className="text-[11px] text-on-surface-variant">
              {t('Describe the masterwork, motifs, and cultural heritage behind this handcrafted piece.')}
            </p>
          </div>

          {/* Preserved Materials & Attributes (Read-only reassurance) */}
          <div className="space-y-2 pt-2 border-t border-outline/10">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase">
              {t('Preserved Craft Heritage Details (Read-only):')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.materials.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] bg-surface-container border border-outline/20 text-on-surface"
                >
                  ✦ {t(m)}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-outline/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full border border-outline/30 text-xs font-bold text-on-surface hover:bg-surface-container transition cursor-pointer disabled:opacity-50"
            >
              {t('Cancel')}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('Saving changes...')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('Save Changes')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

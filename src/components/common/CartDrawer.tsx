import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    setIsCheckoutOpen,
    t,
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col border-l border-outline/20">
        {/* Header */}
        <div className="p-4 border-b border-outline/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-lg text-on-surface">
              {t.cart} ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg text-on-surface font-semibold">Your Cart is Empty</p>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Explore handloom sarees, lost-wax bronze sculptures, and GI certified treasures from master artisans.
              </p>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-xl bg-surface-container-low border border-outline/20"
              >
                <img
                  src={product.primary_image}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover border border-outline/20 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-xs font-bold text-on-surface line-clamp-1">
                      {product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-on-surface-variant hover:text-red-600 transition p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-primary font-medium">
                    By {product.artisan_name}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 border border-outline/30 rounded-lg bg-surface px-2 py-0.5">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold text-on-surface">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-sm text-on-surface">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Direct Artisan Impact */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-outline/20 bg-surface-container-low space-y-3">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                <strong>₹{Math.round(cartTotal * 0.8).toLocaleString('en-IN')}</strong> goes directly to master artisan families.
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>Digital Craft Passport Certificate</span>
                <span>FREE (Included)</span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>Direct Artisan Insured Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline/10">
                <span>Total Amount</span>
                <span className="text-primary font-serif text-base">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3 px-4 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.buyNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

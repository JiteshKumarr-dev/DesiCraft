import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, products, addToCart, setSelectedProduct, setIsCartOpen } = useApp();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col border-l border-outline/20">
        {/* Header */}
        <div className="p-4 border-b border-outline/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h3 className="font-serif font-bold text-lg text-on-surface">
              Saved Heirlooms ({wishlistedProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg text-on-surface font-semibold">Your Wishlist is Empty</p>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Explore handloom sarees, bronze sculptures, and GI certified treasures and save your favorite living art.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-xl bg-surface-container-low border border-outline/20 hover:border-primary/30 transition"
              >
                <img
                  src={product.primary_image}
                  alt={product.name}
                  onClick={() => {
                    setSelectedProduct(product);
                    onClose();
                  }}
                  className="w-20 h-20 rounded-lg object-cover border border-outline/20 shrink-0 cursor-pointer"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      onClick={() => {
                        setSelectedProduct(product);
                        onClose();
                      }}
                      className="font-serif text-xs font-bold text-on-surface line-clamp-1 hover:text-primary transition cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-on-surface-variant hover:text-red-600 transition p-1 cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-primary">By {product.artisan_name}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-sm text-on-surface">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="p-4 border-t border-outline/20 bg-surface-container-low">
            <button
              onClick={() => {
                onClose();
                setIsCartOpen(true);
              }}
              className="w-full py-2.5 rounded-full border border-primary text-primary font-bold text-xs hover:bg-primary/10 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

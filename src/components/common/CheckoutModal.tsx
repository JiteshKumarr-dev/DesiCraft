import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartTotal,
    createOrder,
    user,
    setSelectedPassport,
    passports,
    t,
  } = useApp();

  const [fullName, setFullName] = useState(user.name || 'Devi Prasad Sharma');
  const [email, setEmail] = useState(user.email || 'patron@bharat.in');
  const [phone, setPhone] = useState(user.phone || '+91 98450 12345');
  const [street, setStreet] = useState('42, Heritage Enclave, Jubilee Hills');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('500033');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery'>('UPI');
  const [upiId, setUpiId] = useState('deviprasad@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await createOrder({
        customer_name: fullName,
        customer_email: email,
        payment_method: paymentMethod,
        shipping_address: {
          fullName,
          street,
          city,
          state,
          pincode,
          phone,
        },
      });

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
      } else {
        setErrorMessage(res.error || t('Sorry, this product is temporarily unavailable.'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || t('Sorry, this product is temporarily unavailable.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-outline/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                ORDER CONFIRMED & COMMITTED TO LOOM
              </span>
              <h3 className="font-serif text-2xl font-bold text-on-surface mt-2">
                Dhanyavad, {confirmedOrder.customer_name}!
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Your direct-from-artisan purchase order has been generated and dispatched to the master artisan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline/20 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Order Number:</span>
                <span className="font-mono font-bold text-on-surface">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estimated Dispatch:</span>
                <span className="font-medium text-on-surface">3-5 Business Days (Direct from Loom)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tracking Reference:</span>
                <span className="font-mono text-primary font-semibold">{confirmedOrder.tracking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Paid:</span>
                <span className="font-serif font-bold text-base text-primary">
                  ₹{confirmedOrder.total_price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-3 text-xs text-secondary-container">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-on-surface">{t('Digital Craft Passport Issued')}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {t('A tamper-proof certificate of authenticity and GI Tag registration has been linked to your account.')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  handleClose();
                  if (passports.length > 0) setSelectedPassport(passports[0]);
                }}
                className="px-4 py-2.5 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary/10 transition cursor-pointer"
              >
                {t('View Digital Craft Passport')}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                {t('Return to Marketplace')}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('Direct Artisan Checkout')}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-on-surface mt-1">
                {t('Complete Your Heritage Order')}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {t('100% of proceeds directly support indigenous craft lineages without marketplace commissions.')}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Delivery Address */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-on-surface flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Delivery Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t('Full Name')}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <input
                  type="tel"
                  placeholder={t('Phone Number')}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <input
                type="text"
                placeholder={t('Street Address / House No.')}
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={t('City')}
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder={t('State')}
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder={t('Pincode')}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-surface-container-low border border-outline/30 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-on-surface flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" /> Indian Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / BHIM / GPay' },
                  { id: 'Card', label: 'Credit / Debit Card' },
                  { id: 'NetBanking', label: 'Indian NetBanking' },
                  { id: 'CashOnDelivery', label: 'Cash on Delivery' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2.5 px-3 text-xs rounded-lg border font-medium transition cursor-pointer text-left ${
                      paymentMethod === m.id
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline/30 bg-surface text-on-surface'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline/20 space-y-2">
                  <label className="text-[11px] text-on-surface-variant font-semibold">
                    Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3 py-2 text-xs bg-surface border border-outline/30 rounded-md font-mono"
                  />
                </div>
              )}
            </div>

            {/* Total summary & submit */}
            <div className="pt-4 border-t border-outline/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-on-surface-variant uppercase">{t('Total Payable')}</span>
                <p className="font-serif text-xl font-bold text-primary">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span>{t('Securing Artisan Loom Order...')}</span>
                ) : (
                  <>
                    <span>{t('Pay & Place Order')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

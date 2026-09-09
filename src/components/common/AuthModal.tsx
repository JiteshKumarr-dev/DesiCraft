import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import {
  X,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  User as UserIcon,
  MapPin,
  Globe,
  Award,
  BookOpen,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Gujarat',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    language,
    setIsLanguagePopupOpen,
    signUpUser,
    loginUser,
    showNotification,
  } = useApp();

  // Form states
  const [activeTab, setActiveTab] = useState<'SIGNUP' | 'LOGIN'>(authMode || 'SIGNUP');
  const [fullName, setFullName] = useState('');
  const [contactType, setContactType] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stateLocation, setStateLocation] = useState('Uttar Pradesh');
  const [cityLocation, setCityLocation] = useState('Varanasi');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Login specific state
  const [loginIdentifier, setLoginIdentifier] = useState('deviprasad.crafts@bharat.in');
  const [loginPassword, setLoginPassword] = useState('heritage2026');

  // Sync active tab with global authMode
  React.useEffect(() => {
    if (authMode) setActiveTab(authMode);
  }, [authMode]);

  if (!isAuthModalOpen) return null;

  // Password strength calculation
  const calculatePasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: '', color: 'bg-neutral-300' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-green-600' };
  };

  const strength = calculatePasswordStrength(password);

  // Handle Signup Submit - Direct Universal Registration
  const handleInitiateSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showNotification('Please enter your full name');
      return;
    }
    if (!contactValue.trim()) {
      showNotification(contactType === 'PHONE' ? 'Please enter a valid phone number' : 'Please enter your email');
      return;
    }
    if (password.length < 8) {
      showNotification('Password must be at least 8 characters long');
      return;
    }
    if (!agreedToTerms) {
      showNotification('Please accept the Terms & Heritage Code of Ethics');
      return;
    }

    finalizeRegistration();
  };

  const finalizeRegistration = () => {
    signUpUser({
      name: fullName,
      email: contactType === 'EMAIL' ? contactValue : `${fullName.toLowerCase().replace(/\s+/g, '.')}@crafts.in`,
      phone: contactType === 'PHONE' ? `+91 ${contactValue}` : '+91 98765 43210',
      preferred_language: language,
      state: stateLocation,
      district: cityLocation,
    });
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showNotification('Please enter your Phone or Email');
      return;
    }
    loginUser(loginIdentifier, loginPassword);
    setIsAuthModalOpen(false);
  };

  // Quick Demo Login helpers
  const handleDemoLogin = (role: 'PATRON' | 'ARTISAN') => {
    if (role === 'PATRON') {
      loginUser('deviprasad.crafts@bharat.in', 'patron123');
    } else {
      loginUser('rajeshwar.kashi@crafts.in', 'artisan123');
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-surface rounded-3xl shadow-2xl border border-outline/30 flex flex-col md:flex-row max-h-[92vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Modern Indian Handcrafted Editorial Manifesto (Desktop) */}
        <div className="hidden md:flex md:w-5/12 bg-linear-to-b from-surface-container-highest via-surface-container-high to-surface-container p-8 flex-col justify-between border-r border-outline/20 relative overflow-hidden">
          {/* Subtle background motif */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src="/images/banarasi-gold-saree.png"
              alt="Indian Heritage Handloom"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold text-on-surface">
                Desi<span className="text-primary italic font-normal">Craft</span>
              </span>
            </div>

            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary/15 text-secondary border border-secondary/30">
                BHARAT LIVING HERITAGE
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-on-surface leading-snug">
                India’s crafts are more than products.
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                They carry ancestral stories, mathematical memories, and centuries of living lineage. Discover the master artisans behind them.
              </p>
            </div>

            {/* Cultural Four Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-on-surface font-medium">
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  🏺
                </div>
                <span>Certified Geographical Indication (GI) Crafts</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-on-surface font-medium">
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  🧑‍🎨
                </div>
                <span>National Master Artisans & Weaving Guilds</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-on-surface font-medium">
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  📖
                </div>
                <span>Oral Heritage Stories in 10 Mother Tongues</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-on-surface font-medium">
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  🌏
                </div>
                <span>Cryptographic Digital Craft Passports</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-outline/20">
            <div className="p-3 rounded-2xl bg-surface/80 backdrop-blur-xs border border-outline/20 text-center">
              <p className="text-[11px] font-serif font-bold text-primary">
                "One account. Two switchable modes."
              </p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                Explore as a patron or manage your loom studio anytime.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Universal Sign Up / Login Form */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto no-scrollbar flex flex-col justify-between">
          <div>
            {/* Tab Switcher: Sign Up vs Login */}
            <div className="flex border-b border-outline/20 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('SIGNUP');
                  setAuthMode('SIGNUP');
                }}
                className={`pb-3 text-sm font-serif font-bold transition-all relative cursor-pointer mr-6 ${
                  activeTab === 'SIGNUP'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Join Desi Craft
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setAuthMode('LOGIN');
                }}
                className={`pb-3 text-sm font-serif font-bold transition-all relative cursor-pointer ${
                  activeTab === 'LOGIN'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Welcome Back (Login)
              </button>
            </div>

            {/* TAB 1: UNIVERSAL SIGN UP */}
            {activeTab === 'SIGNUP' && (
              <div className="space-y-4">
                <form onSubmit={handleInitiateSignup} className="space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-on-surface">
                      Create your universal account
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Discover India's heritage. Support artisans. Keep traditions alive.
                    </p>
                  </div>

                  {/* 1. Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-primary" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                  </div>

                  {/* 2. Contact: Phone or Email */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-on-surface flex items-center gap-1">
                        {contactType === 'PHONE' ? (
                          <Phone className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-primary" />
                        )}
                        <span>{contactType === 'PHONE' ? 'Mobile Number *' : 'Email Address *'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setContactType(contactType === 'PHONE' ? 'EMAIL' : 'PHONE');
                          setContactValue('');
                        }}
                        className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
                      >
                        Use {contactType === 'PHONE' ? 'Email instead' : 'Phone instead'}
                      </button>
                    </div>

                    <div className="flex items-center bg-surface-container-low border border-outline/30 rounded-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition overflow-hidden">
                      {contactType === 'PHONE' && (
                        <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-surface-container/60 border-r border-outline/25 text-xs sm:text-sm font-semibold text-on-surface select-none shrink-0">
                          <span className="text-base leading-none">🇮🇳</span>
                          <span className="text-on-surface-variant font-mono font-medium">+91</span>
                        </div>
                      )}
                      <input
                        type={contactType === 'PHONE' ? 'tel' : 'email'}
                        required
                        placeholder={contactType === 'PHONE' ? '98450 12345' : 'you@example.com'}
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden"
                      />
                    </div>
                  </div>

                    {/* 3. Password with Strength & Visibility Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span>Password *</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Minimum 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 pr-10 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      {password && (
                        <div className="space-y-1 pt-0.5">
                          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden flex gap-1">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                strength.score >= 1 ? strength.color : 'bg-transparent'
                              }`}
                              style={{ width: '33.3%' }}
                            />
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                strength.score >= 2 ? strength.color : 'bg-transparent'
                              }`}
                              style={{ width: '33.3%' }}
                            />
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                strength.score >= 3 ? strength.color : 'bg-transparent'
                              }`}
                              style={{ width: '33.3%' }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-on-surface-variant">
                            <span>Strength: {strength.label}</span>
                            <span>Min. 8 characters</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Preferred Language (Populated from First-Visit Popup) */}
                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                            Preferred Language
                          </span>
                          <span className="text-xs font-serif font-bold text-on-surface">
                            {language.toUpperCase()} (Selected)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLanguagePopupOpen(true)}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    {/* 5. Location (State & City) */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-on-surface flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span>State</span>
                        </label>
                        <select
                          value={stateLocation}
                          onChange={(e) => setStateLocation(e.target.value)}
                          className="w-full px-2.5 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-on-surface">
                          City / District
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Varanasi, Hyderabad"
                          value={cityLocation}
                          onChange={(e) => setCityLocation(e.target.value)}
                          className="w-full px-2.5 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms-check"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 rounded border-outline/30 text-primary focus:ring-primary/40 cursor-pointer"
                      />
                      <label htmlFor="terms-check" className="text-[11px] text-on-surface-variant leading-tight cursor-pointer">
                        I agree to the <strong className="text-on-surface">Terms of Service</strong>, <strong className="text-on-surface">Privacy Policy</strong>, and the <strong className="text-primary">Indian Handcraft Code of Ethics</strong>.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <span>Create Universal Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
              </div>
            )}

            {/* TAB 2: LOGIN */}
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-on-surface">
                    Welcome back to Desi Craft
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Sign in to your universal account to manage loom orders or patronize heirlooms.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Phone Number or Email *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter phone or email"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-on-surface flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span>Password *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered email/phone')}
                      className="text-[11px] text-primary hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 pr-10 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In to Desi Craft</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ONE-CLICK TEST DEMO LOGINS */}
            <div className="mt-6 pt-5 border-t border-outline/15 space-y-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block text-center">
                Fast Demo Testing Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('PATRON')}
                  className="p-2.5 rounded-xl bg-surface-container-low border border-outline/20 hover:border-primary/40 text-left transition cursor-pointer"
                >
                  <span className="text-xs font-bold text-on-surface block">🛍️ Log in as Patron</span>
                  <span className="text-[10px] text-on-surface-variant">Devi Prasad (Hyderabad)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('ARTISAN')}
                  className="p-2.5 rounded-xl bg-surface-container-low border border-outline/20 hover:border-primary/40 text-left transition cursor-pointer"
                >
                  <span className="text-xs font-bold text-on-surface block">🧑‍🎨 Log in as Artisan</span>
                  <span className="text-[10px] text-on-surface-variant">Master Rajeshwar (Varanasi)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-[11px] text-on-surface-variant">
              🔒 256-bit Encrypted • Direct Beneficiary KYC Protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

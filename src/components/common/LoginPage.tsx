import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Palette,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Award,
  CheckCircle2,
  MapPin,
  Clock,
} from 'lucide-react';
import { navigate, getIntendedDestination } from '../../services/router';
import { UserMode } from '../../types';

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

const ARTISAN_CRAFTS = [
  'Varanasi Zari & Brocade Handloom (GI-2005)',
  'Pochampally Ikat Silk Weaving (GI-2004)',
  'Kutch Rogan & Ajrakh Art (GI-2014)',
  'Bidriware Silver Inlay Metalcraft (GI-2006)',
  'Jaipur Blue Pottery (GI-2008)',
  'Channapatna Lacquerware Woodcraft (GI-2006)',
  'Madhubani Folk Painting (GI-2007)',
  'Kashmir Pashmina & Walnut Wood (GI-2008)',
  'Toda Tribal Embroidery (GI-2013)',
  'Bankura Panchmura Terracotta (GI-2018)',
  'Other Traditional Indian Heritage GI Craft',
];

export const LoginPage: React.FC = () => {
  const {
    user,
    isLoggedIn,
    intendedMode,
    setIntendedMode,
    loginUser,
    signUpUser,
    showNotification,
    t,
  } = useApp();

  // Determine target mode (default to intendedMode, or from router, or CUSTOMER)
  const targetMode: UserMode =
    intendedMode || getIntendedDestination().mode || (user.active_mode === 'ARTISAN' ? 'ARTISAN' : 'CUSTOMER');
  const isArtisanTarget = targetMode === 'ARTISAN';

  const [authTab, setAuthTab] = useState<'LOGIN' | 'SIGNUP'>(() => {
    const dest = getIntendedDestination();
    if (intendedMode === 'ARTISAN' || dest.mode === 'ARTISAN') {
      return 'SIGNUP';
    }
    return 'LOGIN';
  });

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupCraft, setSignupCraft] = useState(ARTISAN_CRAFTS[0]);
  const [signupExperience, setSignupExperience] = useState('20');
  const [signupState, setSignupState] = useState('Uttar Pradesh');
  const [signupDistrict, setSignupDistrict] = useState('Varanasi');
  const [agreedToEthics, setAgreedToEthics] = useState(true);

  // Pre-fill email if user is already known
  useEffect(() => {
    if (user?.email && !identifier && isLoggedIn) {
      setIdentifier(user.email);
    }
  }, [user, isLoggedIn]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage(t('Please enter your Phone or Email'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(cleanId, password, targetMode);
      if (result && !result.success) {
        setErrorMessage(result.error || t('Invalid email or password.'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || t('Invalid email or password.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupName.trim()) {
      setErrorMessage(isArtisanTarget ? t('Please enter your Master Artisan or Guild name') : t('Please enter your full name'));
      return;
    }
    if (!identifier.trim()) {
      setErrorMessage(t('Please enter your email or phone'));
      return;
    }
    if (password.length < 6) {
      setErrorMessage(t('Password must be at least 6 characters long'));
      return;
    }
    if (isArtisanTarget && !agreedToEthics) {
      setErrorMessage(t('Please confirm authentic handcrafted GI lineage standards.'));
      return;
    }

    setIsLoading(true);
    try {
      await signUpUser({
        name: signupName.trim(),
        email: identifier.includes('@') ? identifier.trim() : `${signupName.toLowerCase().replace(/\s+/g, '.')}@crafts.in`,
        phone: !identifier.includes('@') ? identifier.trim() : '+91 98450 12345',
        preferred_language: 'en',
        password,
        state: signupState,
        district: signupDistrict,
        targetMode: isArtisanTarget ? 'ARTISAN' : 'CUSTOMER',
        craftName: isArtisanTarget ? signupCraft : undefined,
        experienceYears: isArtisanTarget ? parseInt(signupExperience, 10) || 15 : undefined,
      });

      // After signup, automatically authenticate for the target mode
      await loginUser(identifier.trim(), password, targetMode);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || t('Unable to create account. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'BUYER' | 'ARTISAN') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (type === 'BUYER') {
        setIdentifier('deviprasad.crafts@bharat.in');
        setPassword('patron123');
        await loginUser('deviprasad.crafts@bharat.in', 'patron123', 'CUSTOMER');
      } else {
        setIdentifier('rajeshwar.kashi@crafts.in');
        setPassword('artisan123');
        await loginUser('rajeshwar.kashi@crafts.in', 'artisan123', 'ARTISAN');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 animate-fadeIn">
      {/* Back to Portal button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('Back to DesiCraft Home')}</span>
      </button>

      <div className="bg-surface border border-outline/20 rounded-3xl shadow-xl overflow-hidden">
        {/* Header Ribbon with Mode Specific Badge */}
        <div
          className={`p-6 sm:p-8 text-white relative overflow-hidden ${
            isArtisanTarget
              ? 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950'
              : 'bg-gradient-to-r from-primary via-primary-dark to-stone-900'
          }`}
        >
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-amber-200 border border-white/20">
              {isArtisanTarget ? (
                <Palette className="w-3.5 h-3.5 text-secondary" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>
                {isArtisanTarget ? t('Artisan Studio') : t('Buyer Marketplace')}
              </span>
              <span>•</span>
              <span className="uppercase text-[10px] tracking-wider">
                {isArtisanTarget ? t('Master Artisan Portal') : t('Mode-Entry Security Gate')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              {isArtisanTarget
                ? authTab === 'SIGNUP'
                  ? t('Sign up as an Artisan & Open Studio')
                  : t('Sign in to access Artisan Studio')
                : authTab === 'SIGNUP'
                ? t('Create your DesiCraft Account')
                : t('Sign in to access Buyer Marketplace')}
            </h1>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
              {isArtisanTarget
                ? t('Sign in to manage your products, use AI tools, discover opportunities, and collaborate with artisans.')
                : t('Sign in to explore products, discover artisans, and purchase traditional crafts.')}
            </p>
          </div>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="flex border-b border-outline/15 bg-surface-container-low px-6">
          {isArtisanTarget ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('SIGNUP');
                  setErrorMessage(null);
                }}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  authTab === 'SIGNUP'
                    ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t('Sign Up as Artisan')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('LOGIN');
                  setErrorMessage(null);
                }}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  authTab === 'LOGIN'
                    ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t('Sign In')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('LOGIN');
                  setErrorMessage(null);
                }}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  authTab === 'LOGIN'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t('Sign In')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('SIGNUP');
                  setErrorMessage(null);
                }}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  authTab === 'SIGNUP'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t('Create Account')}
              </button>
            </>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-error/10 border border-error/20 text-error flex items-start gap-2.5 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {authTab === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  {t('Email or Phone')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isArtisanTarget ? 'e.g. rajeshwar.kashi@crafts.in or +91 98450...' : t('e.g. user@example.com or +91 98450...')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    {t('Password')}
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2 text-white ${
                  isArtisanTarget
                    ? 'bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950'
                    : 'bg-primary hover:bg-primary/90 text-on-primary'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Checking your session...')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isArtisanTarget ? t('Sign In & Open Artisan Studio') : t('Sign In')}</span>
                  </>
                )}
              </button>

              {isArtisanTarget && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthTab('SIGNUP')}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    {t('New artisan? Create your Artisan Account →')}
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  {isArtisanTarget ? t('Master Artisan / Full Name') : t('Full Name')}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={isArtisanTarget ? t('e.g. Master Rajeshwar Ansari') : t('e.g. Aarav Sharma')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>

              {isArtisanTarget && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                      {t('Craft Specialization / GI Category')}
                    </label>
                    <div className="relative">
                      <Palette className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={signupCraft}
                        onChange={(e) => setSignupCraft(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      >
                        {ARTISAN_CRAFTS.map((craft) => (
                          <option key={craft} value={craft}>
                            {craft}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                        {t('State')}
                      </label>
                      <select
                        value={signupState}
                        onChange={(e) => setSignupState(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      >
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                        {t('District / Guild Cluster')}
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={signupDistrict}
                          onChange={(e) => setSignupDistrict(e.target.value)}
                          placeholder="e.g. Varanasi (Kashi)"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                      {t('Generational Experience (Years)')}
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="number"
                        min="1"
                        max="80"
                        value={signupExperience}
                        onChange={(e) => setSignupExperience(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  {t('Email or Phone')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isArtisanTarget ? 'e.g. +91 98450 12345 or artisan@kashi.in' : t('e.g. aarav@bharat.in')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  {t('Create Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('At least 6 characters')}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container border border-outline/25 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isArtisanTarget && (
                <label className="flex items-start gap-2.5 text-xs text-on-surface-variant cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedToEthics}
                    onChange={(e) => setAgreedToEthics(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    {t('I confirm that our workshop produces authentic hand-crafted goods compliant with Indian GI lineage & fair craft trade standards.')}
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2 text-white ${
                  isArtisanTarget
                    ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950'
                    : 'bg-primary hover:bg-primary/90 text-on-primary'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Creating Account...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isArtisanTarget ? t('Register as Artisan & Open Studio') : t('Create Account')}</span>
                  </>
                )}
              </button>

              {isArtisanTarget && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthTab('LOGIN')}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    {t('Already registered? Sign In to Artisan Studio →')}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Artisan Lineage Perks Banner */}
          {isArtisanTarget && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-on-surface-variant space-y-1.5">
              <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                {t('National Master Artisan Benefits')}
              </span>
              <ul className="space-y-1 text-on-surface-variant/90 pl-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{t('0% Platform Commission — 100% of sales goes directly to the master artisan')}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{t('Voice Product Creator in 10 Indian Regional Languages')}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{t('Verifiable Blockchain Digital Craft Passports for your heritage lineage')}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Quick Demo Logins Section */}
          <div className="pt-2 border-t border-outline/15 space-y-2">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
              {t('Quick Demo Access:')}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('ARTISAN')}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500/15 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                  <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t('Master Rajeshwar')}</span>
                </div>
                <p className="text-[10px] text-amber-800 dark:text-amber-300 mt-0.5">{t('Verified Master Weaver')}</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('BUYER')}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-outline/20 hover:border-primary/50 bg-surface-container hover:bg-primary/5 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                  <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                  <span>{t('Devi Prasad')}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{t('Patron / Buyer Account')}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

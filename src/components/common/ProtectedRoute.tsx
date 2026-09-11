import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserMode } from '../../types';
import { navigate, setIntendedDestination } from '../../services/router';
import { Sparkles, Loader2, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  requiredMode: UserMode;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredMode, children }) => {
  const { isLoggedIn, isAuthChecking, modeGateStatus, t } = useApp();

  useEffect(() => {
    if (isAuthChecking) return;

    // Check if user is authenticated and cleared for this mode boundary
    const isClearedForMode = isLoggedIn && modeGateStatus === requiredMode;

    if (!isClearedForMode) {
      const targetPath = requiredMode === 'ARTISAN' ? '/artisan-studio' : '/marketplace';
      setIntendedDestination(targetPath, requiredMode);
      navigate('/login', true);
    }
  }, [isLoggedIn, isAuthChecking, modeGateStatus, requiredMode]);

  // While checking Supabase session, show non-flashing loading state
  if (isAuthChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <h3 className="text-lg font-serif font-bold text-on-surface">
          {t('Checking your session...')}
        </h3>
        <p className="text-xs text-on-surface-variant max-w-sm mt-1.5 leading-relaxed">
          {t('Verifying your authentic Supabase session and mode access credentials.')}
        </p>
      </div>
    );
  }

  // If not logged in or not cleared for this mode, do NOT render protected content (prevents content flashing)
  if (!isLoggedIn || modeGateStatus !== requiredMode) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mb-3">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-on-surface">
          {requiredMode === 'ARTISAN'
            ? t('Sign in to enter Artisan Studio.')
            : t('Sign in to continue to DesiCraft Marketplace.')}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

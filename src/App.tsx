import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';
import { DigitalPassportModal } from './components/common/DigitalPassportModal';
import { MultilingualChatModal } from './components/common/MultilingualChatModal';
import { CartDrawer } from './components/common/CartDrawer';
import { CheckoutModal } from './components/common/CheckoutModal';
import { GiftModeModal } from './components/common/GiftModeModal';
import { VisualSearchModal } from './components/common/VisualSearchModal';
import { UserProfileModal } from './components/common/UserProfileModal';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { QrScannerModal } from './components/common/QrScannerModal';
import { EndangeredCraftsModal } from './components/common/EndangeredCraftsModal';
import { HeritageAiCoPilot } from './components/common/HeritageAiCoPilot';
import { LanguageSelectionPopup } from './components/common/LanguageSelectionPopup';
import { AuthModal } from './components/common/AuthModal';
import { SignupSuccessModal } from './components/common/SignupSuccessModal';

// Customer View
import { CustomerHome } from './components/customer/CustomerHome';
import { CraftDetailModal } from './components/customer/CraftDetailModal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CustomOrderModal } from './components/customer/CustomOrderModal';

// Artisan View
import { ArtisanDashboard } from './components/artisan/ArtisanDashboard';
import { VoiceProductCreator } from './components/artisan/VoiceProductCreator';
import { FairPriceAdvisorModal } from './components/artisan/FairPriceAdvisorModal';
import { PhotoEnhancerModal } from './components/artisan/PhotoEnhancerModal';
import { VoiceArtisanSetupModal } from './components/artisan/VoiceArtisanSetupModal';

export const App: React.FC = () => {
  const { activeMode } = useApp();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isEndangeredOpen, setIsEndangeredOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors">
      {/* Global Navigation Header */}
      <Header
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenEndangeredModal={() => setIsEndangeredOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeMode === 'CUSTOMER' ? <CustomerHome /> : <ArtisanDashboard />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Slide-ins */}
      <DigitalPassportModal />
      <MultilingualChatModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />
      <GiftModeModal />
      <VisualSearchModal />
      <EndangeredCraftsModal
        isOpen={isEndangeredOpen}
        onClose={() => setIsEndangeredOpen(false)}
      />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <CraftDetailModal />
      <ProductDetailModal />
      <CustomOrderModal />
      <VoiceProductCreator />
      <FairPriceAdvisorModal />
      <PhotoEnhancerModal />
      <VoiceArtisanSetupModal />
      <HeritageAiCoPilot />
      <LanguageSelectionPopup />
      <AuthModal />
      <SignupSuccessModal />
      <NotificationToast />
    </div>
  );
};

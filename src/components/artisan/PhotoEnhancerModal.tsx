import React from 'react';
import { useApp } from '../../context/AppContext';
import { AIImageStudioModal } from './AIImageStudioModal';

export const PhotoEnhancerModal: React.FC = () => {
  const { isPhotoEnhancerOpen, setIsPhotoEnhancerOpen, showNotification } = useApp();

  if (!isPhotoEnhancerOpen) return null;

  return (
    <AIImageStudioModal
      isOpen={isPhotoEnhancerOpen}
      onClose={() => setIsPhotoEnhancerOpen(false)}
      initialImageSrc="/images/kadwa-saree-portrait.jpg"
      craftName="Varanasi Zari Brocade & Handloom"
      onApply={(_enhancedUrl) => {
        showNotification('✨ Professionally enhanced photo saved to catalog assets!');
        setIsPhotoEnhancerOpen(false);
      }}
    />
  );
};

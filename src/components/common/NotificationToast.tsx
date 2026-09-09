import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, showNotification } = useApp();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slideUp">
      <div className="flex items-center gap-3 bg-surface-container-highest border border-primary/30 text-on-surface shadow-xl rounded-xl p-4">
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs sm:text-sm font-medium leading-snug">{notification}</p>
        <button
          onClick={() => showNotification('')}
          className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

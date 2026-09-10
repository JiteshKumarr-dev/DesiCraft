import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { StateHeritageData } from '../../data/heritageMapData';

interface StateHoverCardProps {
  stateData: StateHeritageData;
  position: { x: number; y: number };
  onOpenModal: (stateData: StateHeritageData) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const StateHoverCard: React.FC<StateHoverCardProps> = ({
  stateData,
  position,
  onOpenModal,
  onMouseEnter,
  onMouseLeave,
}) => {
  const representativeCraft = stateData.crafts[0];
  const famousCraftsNames = stateData.crafts.slice(0, 3).map((c) => c.name).join(', ');

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onOpenModal(stateData)}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className="absolute z-40 transform -translate-y-1/2 transition-all duration-200 ease-out cursor-pointer group pointer-events-auto"
      role="region"
      aria-label={`Preview of ${stateData.name} crafts`}
    >
      <div className="flex items-center gap-3.5 p-3 sm:p-3.5 bg-white/95 dark:bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-outline/20 group-hover:border-primary/50 group-hover:shadow-2xl transition-all duration-200 w-72 sm:w-80">
        {/* Representative Craft Image Thumbnail */}
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-xs">
          <img
            src={representativeCraft?.image || stateData.heroImage}
            alt={representativeCraft?.name || stateData.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
        </div>

        {/* State Information */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-serif font-bold text-base text-on-surface group-hover:text-primary transition-colors truncate">
              {stateData.name}
            </h4>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
          </div>

          <p className="text-[11px] font-semibold text-primary/90 mt-0.5">
            Famous For:
          </p>

          <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-2 mt-0.5">
            {famousCraftsNames}
          </p>
        </div>
      </div>
    </div>
  );
};

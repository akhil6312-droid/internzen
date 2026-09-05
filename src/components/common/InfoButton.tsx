import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Lightbulb, Compass } from 'lucide-react';

interface InfoButtonProps {
  title: string;
  description: string;
  rationale?: string;
  tip?: string;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left' | 'right' | 'bottom';
  className?: string;
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  title,
  description,
  rationale,
  tip,
  placement = 'bottom-left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive mobile screen tracking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on outside click (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Lock body scroll when mobile modal is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  const placementClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2',
    'left': 'right-full top-0 mr-2',
    'right': 'left-full top-0 ml-2',
  }[placement];

  return (
    <div className={`relative inline-flex items-center ml-1.5 sm:ml-2 ${isOpen ? 'z-30' : ''} ${className}`} ref={containerRef}>
      {/* Tap Target Container (44px touch-friendly on mobile, compact on desktop) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-1.5 sm:p-0 flex items-center justify-center -my-2.5 -mx-1 sm:my-0 sm:mx-0 group cursor-pointer focus:outline-none"
        title={`Learn about: ${title}`}
        aria-label={`Info: ${title}`}
        aria-expanded={isOpen}
      >
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            isOpen
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30 ring-2 ring-violet-400'
              : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700'
          }`}
        >
          <Info className="w-3 h-3 stroke-[2.5]" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          isMobile ? (
            /* MOBILE POPUP / BOTTOM SHEET MODAL (Prevents cut-off by screen boundaries) */
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div 
                className="fixed inset-0"
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 shadow-2xl text-slate-800 dark:text-slate-100 text-xs text-left"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-700/80 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 dark:border-violet-500/30 flex items-center justify-center shrink-0">
                      <Compass className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 -mr-2 -mt-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    aria-label="Close information modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {description}
                  </p>

                  {rationale && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block mb-1 text-[10px]">
                        Placement Rationale
                      </span>
                      {rationale}
                    </div>
                  )}

                  {tip && (
                    <div className="flex items-start gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="leading-snug">
                        <strong className="text-emerald-900 dark:text-emerald-200 font-semibold">Pro-tip: </strong>
                        {tip}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Done button */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white transition-colors flex items-center justify-center"
                  >
                    Got It
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            /* DESKTOP POPOVER (Elevated z-[9999] pointer-events-auto, solid high-contrast background) */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: placement.startsWith('bottom') ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: placement.startsWith('bottom') ? 6 : -6 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`absolute ${placementClasses} z-[9999] pointer-events-auto w-64 p-3 rounded-xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs text-left`}
            >
              {/* Popover Header */}
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {title}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close information popover"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="space-y-2 text-xs">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {description}
                </p>

                {rationale && (
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block mb-0.5 text-[10px]">
                      Placement Rationale
                    </span>
                    {rationale}
                  </div>
                )}

                {tip && (
                  <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="leading-snug">
                      <strong className="text-emerald-900 dark:text-emerald-200 font-semibold">Pro-tip: </strong>
                      {tip}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

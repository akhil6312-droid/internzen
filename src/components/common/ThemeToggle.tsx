import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { ThemeOption } from '../../types';

interface ThemeToggleProps {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  onThemeChange,
  className = '',
  showLabel = false,
}) => {
  const isDark = currentTheme !== 'light' && currentTheme !== 'modern-light';

  const handleToggle = () => {
    onThemeChange(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center gap-2 px-3 py-2 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer ${className}`}
      title={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
      aria-label={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
    >
      <motion.div
        key={isDark ? 'dark-icon' : 'light-icon'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-500" />
        )}
      </motion.div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? 'Day Mode' : 'Night Mode'}
        </span>
      )}
    </motion.button>
  );
};

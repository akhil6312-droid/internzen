import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { ThemeOption } from '../../types';

interface ThemeSwitcherProps {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

const THEMES: { id: ThemeOption; name: string; description: string; dotClass: string }[] = [
  {
    id: 'dark-slate',
    name: 'Dark Slate',
    description: 'Deep navy slate & violet accents',
    dotClass: 'bg-indigo-500 ring-2 ring-indigo-400',
  },
  {
    id: 'onyx-black',
    name: 'Pure Onyx Black',
    description: 'OLED pure black & high contrast',
    dotClass: 'bg-zinc-900 border border-zinc-500 ring-2 ring-zinc-400',
  },
  {
    id: 'modern-light',
    name: 'Modern Light',
    description: 'Clean crisp white & slate text',
    dotClass: 'bg-white border border-slate-300 ring-2 ring-slate-400',
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    description: 'Deep cyber emerald & pine glow',
    dotClass: 'bg-emerald-500 ring-2 ring-emerald-400',
  },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-sm"
        title="Change Theme Palette"
        aria-label="Select theme palette"
        aria-expanded={isOpen}
      >
        <Palette className="w-3.5 h-3.5 text-violet-400" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 border-b border-slate-800/80 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Theme Palette
              </span>
            </div>

            <div className="space-y-1">
              {THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-violet-600/20 text-white border border-violet-500/30'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${theme.dotClass}`} />
                      <div>
                        <div className="text-xs font-bold leading-none">{theme.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                          {theme.description}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-violet-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

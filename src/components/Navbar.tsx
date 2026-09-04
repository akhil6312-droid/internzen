import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  GraduationCap, 
  Building2, 
  CheckCircle, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  LogOut,
  Briefcase
} from 'lucide-react';
import { StudentProfile, UserAccount, ThemeOption } from '../types';
import { ThemeSwitcher } from './common/ThemeSwitcher';
import { InfoButton } from './common/InfoButton';

interface NavbarProps {
  currentMode: 'student' | 'recruiter';
  onModeChange: (mode: 'student' | 'recruiter') => void;
  studentProfile: StudentProfile;
  currentUser: UserAccount | null;
  applicationsCount: number;
  onOpenApplicationsDrawer: () => void;
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  studentProfile,
  currentUser,
  applicationsCount,
  onOpenApplicationsDrawer,
  currentTheme,
  onThemeChange,
  onOpenAuth,
  onLogout,
}) => {
  const verifiedCount = studentProfile.skills.filter((s) => s.isVerified).length;

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AS';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo & Brand Identity */}
        <div className="flex items-center space-x-3.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-violet-400/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Zen</span>
              </span>
              <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Placement Intelligence
              </span>
            </div>
            <p className="hidden lg:block text-[11px] text-slate-400 font-medium tracking-tight">
              Skill-First Internship & Placement Intelligence
            </p>
          </div>
        </div>

        {/* Center/Right Actions: Mode Switcher, My Applications, Theme Switcher & Auth */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Desktop Animated 2-Way Mode Switcher */}
          <div className="hidden sm:flex relative p-1 bg-slate-900 border border-slate-800 rounded-xl items-center shadow-inner">
            <button
              onClick={() => onModeChange('student')}
              className={`relative z-10 flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentMode === 'student' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {currentMode === 'student' && (
                <motion.div
                  layoutId="modeSliderDesktop"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <GraduationCap className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Student Mode</span>
            </button>

            <button
              onClick={() => onModeChange('recruiter')}
              className={`relative z-10 flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentMode === 'recruiter' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {currentMode === 'recruiter' && (
                <motion.div
                  layoutId="modeSliderDesktop"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Building2 className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Recruiter Mode</span>
            </button>

            <InfoButton
              title="Dual-Persona Mode Switcher"
              description="InternZen serves both placement candidates and hiring partners in one unified platform."
              rationale="Student Mode lets you assess readiness and bridge skill gaps. Recruiter Mode gives enterprise talent teams weighted candidate ranking and a 100% weight allocator."
              tip="Switch to Recruiter Mode to see how hiring managers view your application!"
              placement="bottom-right"
              className="ml-1"
            />
          </div>

          {/* Student "My Applications" Button with Badge */}
          {currentMode === 'student' && (
            <button
              onClick={onOpenApplicationsDrawer}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 min-h-[40px] sm:min-h-0 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 hover:text-white transition-all shadow-sm group"
              title="View Applied Companies & Tracking"
              aria-label={`View applied companies (${applicationsCount} applied)`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">My Applications</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                {applicationsCount}
              </span>
            </button>
          )}

          {/* 4-Theme Switcher */}
          <ThemeSwitcher
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />

          {/* User Account / Login Actions */}
          {currentUser ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold ${
                    currentUser.role === 'student'
                      ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-violet-500/20 border-violet-500/30 text-violet-300'
                  }`}
                >
                  {initials}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    <span className="truncate max-w-[110px]">{currentUser.name}</span>
                    {currentUser.role === 'student' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {currentUser.role === 'student'
                      ? `${verifiedCount} Skills Verified`
                      : `${currentUser.company || 'Enterprise'}`}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                title="Log Out / Switch Account"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/20 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dedicated Mode Switcher Strip (Sub-Bar with >=44px tap targets) */}
      <div className="sm:hidden px-3 py-2 border-t border-slate-800/80 bg-slate-950/95 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="relative flex-1 p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center shadow-inner">
          <button
            onClick={() => onModeChange('student')}
            className={`relative z-10 flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg transition-colors ${
              currentMode === 'student' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {currentMode === 'student' && (
              <motion.div
                layoutId="modeSliderMobile"
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <GraduationCap className="w-4 h-4 relative z-10" />
            <span className="relative z-10 font-bold">Student Mode</span>
          </button>

          <button
            onClick={() => onModeChange('recruiter')}
            className={`relative z-10 flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg transition-colors ${
              currentMode === 'recruiter' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {currentMode === 'recruiter' && (
              <motion.div
                layoutId="modeSliderMobile"
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <Building2 className="w-4 h-4 relative z-10" />
            <span className="relative z-10 font-bold">Recruiter Mode</span>
          </button>
        </div>

        <InfoButton
          title="Dual-Persona Mode Switcher"
          description="InternZen serves both placement candidates and hiring partners in one unified platform."
          rationale="Student Mode lets you assess readiness and bridge skill gaps. Recruiter Mode gives enterprise talent teams weighted candidate ranking and a 100% weight allocator."
          tip="Switch to Recruiter Mode to see how hiring managers view your application!"
          placement="bottom-left"
        />
      </div>
    </header>
  );
};

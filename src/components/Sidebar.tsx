import React, { useState } from 'react';
import { 
  Network, 
  LayoutDashboard, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    currentPersona, 
    activeNavTab, 
    setActiveNavTab,
    candidates,
    jobOpenings,
    curriculumGaps
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'skill-mirror', 
      label: 'Skill Mirror Diagnostic', 
      icon: Sparkles,
      badge: activeRole === 'student' ? '74%' : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    { 
      id: 'job-feed', 
      label: activeRole === 'recruiter' ? 'Active Listings' : 'Job Feed', 
      icon: Briefcase,
      badge: activeRole === 'recruiter' ? `${jobOpenings.length}` : '14',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    },
    { 
      id: 'workshops', 
      label: 'Campus Workshops', 
      icon: GraduationCap,
      badge: activeRole === 'tpo' ? `${curriculumGaps.filter(g => g.remedialScheduled).length} Active` : '3 Labs',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      badge: null
    }
  ];

  const roleOptions: { role: UserRole; title: string; subtitle: string }[] = [
    { role: 'student', title: 'Student View', subtitle: 'Aarav Sharma • CS \'26' },
    { role: 'recruiter', title: 'Recruiter View', subtitle: 'Priya Nair • PhonePe Hiring' },
    { role: 'tpo', title: 'College TPO View', subtitle: 'Dr. K. Venkat • Placement Dean' }
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Top Header Section: Logo & Role Switcher */}
      <div className="p-4 space-y-4">
        {/* App Logo */}
        <div className="flex items-center space-x-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white border border-emerald-400/30">
            <Network className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Skill<span className="text-emerald-400">Match</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-mono">
              ENGINE // ACADEMIA-INDUSTRY
            </p>
          </div>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
            <span>Active Persona</span>
            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
          </label>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="w-full bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 text-left flex items-center justify-between transition-all duration-200 group focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                activeRole === 'student' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' :
                activeRole === 'recruiter' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' :
                'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`} />
              <div className="truncate">
                <div className="text-xs font-semibold text-white tracking-tight flex items-center space-x-1.5">
                  <span>{currentPersona.roleLabel}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentPersona.name}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isRoleMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Dropdown Menu Modal */}
          {isRoleMenuOpen && (
            <div 
              className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Switch Perspective:
              </div>
              {roleOptions.map(opt => {
                const isSelected = activeRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    onClick={() => {
                      setActiveRole(opt.role);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors duration-150 ${
                      isSelected 
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30' 
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-200">{opt.title}</div>
                      <div className="text-[10px] text-slate-400">{opt.subtitle}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Persistent Navigation Links */}
        <nav className="space-y-1 pt-1">
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeNavTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="relative">
            <img 
              src={currentPersona.avatar} 
              alt={currentPersona.name} 
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate block">
                {currentPersona.name}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate block">
              {currentPersona.title}
            </span>
            <div className="mt-1">
              <span className={`inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full border ${currentPersona.badgeColor}`}>
                <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                {currentPersona.roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

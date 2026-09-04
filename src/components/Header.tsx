import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Sparkles, 
  Activity, 
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    activeRole, 
    currentPersona, 
    activeNavTab, 
    setIsPostJobModalOpen,
    addToast
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbLabels: Record<string, string> = {
    'dashboard': 'Placement & Readiness Dashboard',
    'skill-mirror': 'Skill Mirror Diagnostic Engine',
    'job-feed': activeRole === 'recruiter' ? 'Active Listings & Pipeline' : 'Curated Internship Feed',
    'workshops': 'Campus Remedial & Industry Workshops',
    'analytics': 'Macro Talent & Placement Analytics',
    'settings': 'System & Matching Preferences'
  };

  const notifications = [
    {
      id: 'n1',
      title: 'PhonePe Match Updated',
      desc: 'Full-Stack Web Intern match increased to 74% (+6%).',
      time: '12m ago',
      unread: true
    },
    {
      id: 'n2',
      title: 'New Campus Workshop',
      desc: 'Docker & Microservices hands-on lab posted for this weekend.',
      time: '1h ago',
      unread: true
    },
    {
      id: 'n3',
      title: 'Industry Demand Alert',
      desc: 'Cloud Deployments deficit tagged critical by 18 visiting recruiters.',
      time: '3h ago',
      unread: false
    }
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
      {/* Left: Breadcrumbs & Page title */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
          SkillMatch
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-300 font-medium capitalize">
          {currentPersona.roleLabel}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-emerald-400 font-semibold">
          {breadcrumbLabels[activeNavTab] || 'Overview'}
        </span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills, verified candidates, companies, or workshops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Live Status & Notifications */}
      <div className="flex items-center space-x-4">
        {/* Role-specific Quick Action */}
        {activeRole === 'recruiter' && (
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Opening</span>
          </button>
        )}

        {activeRole === 'student' && (
          <button
            onClick={() => addToast('Skill Diagnostic Refreshed', 'Synced GitHub commits & latest course completions.', 'success')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sync GitHub</span>
          </button>
        )}

        {activeRole === 'tpo' && (
          <button
            onClick={() => addToast('Batch Benchmark Run', 'Analyzed 1,240 3rd & 4th year student profiles against 48 hiring rubrics.', 'info')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Recalculate Gaps</span>
          </button>
        )}

        {/* Live System Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MATCH ENGINE ACTIVE</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-200">Alerts & Match Updates</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    className="p-2 rounded-lg bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

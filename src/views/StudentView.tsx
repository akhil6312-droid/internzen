import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Lock, 
  Briefcase, 
  ArrowUpRight, 
  Sparkles, 
  Video, 
  Calendar, 
  FileText, 
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACTIVE_APPLICATIONS } from '../data/mockData';

export const StudentView: React.FC = () => {
  const { 
    targetRoleDiagnostic, 
    selectedTargetRoleId, 
    setSelectedTargetRoleId, 
    availableTargetRoles,
    addToast 
  } = useApp();

  // Circular SVG Readiness Dial calculation (82%)
  const readinessPercent = 82;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessPercent / 100) * circumference;

  const handleApplyClick = () => {
    if (targetRoleDiagnostic.matchScore < targetRoleDiagnostic.unlockThreshold) {
      addToast(
        'Threshold Locked',
        `PhonePe requires minimum ${targetRoleDiagnostic.unlockThreshold}% match compatibility. Complete 1 more recommended resource to unlock 1-click apply.`,
        'warning'
      );
    } else {
      addToast(
        'Application Dispatched!',
        `Your verified profile was submitted directly to the ${targetRoleDiagnostic.company} campus hiring lead.`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================
          1. TOP STATS ROW (3 Web Cards)
         ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Overall Readiness Index with Circular SVG Dial */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40 flex items-center justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Overall Readiness Index
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              82<span className="text-emerald-400 text-2xl">%</span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+8% this month</span>
              <span>• Top Tier CS</span>
            </p>
          </div>

          {/* Circular SVG Dial */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0 z-10">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle track */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#1e293b"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Animated Progress Dial */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#10b981"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out animate-dial-glow"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-extrabold text-white font-mono">82%</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">READY</span>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 2: Matched Internships Available */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Matched Internships
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              14 <span className="text-sm font-semibold text-slate-400">Roles</span>
            </div>
            <p className="text-xs text-slate-400">
              <span className="text-indigo-400 font-semibold font-mono">&gt;70% Match</span> threshold across 42 active hiring partners
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">PhonePe, Razorpay, CRED</span>
            <span className="text-indigo-400 font-semibold flex items-center hover:underline cursor-pointer">
              Browse Feed <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 3: Skills Verified vs. Gap Alert */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Skills Verified vs. Gap Alert
              </span>
            </div>
            <div className="flex items-baseline space-x-3 mt-1">
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight font-['Plus_Jakarta_Sans']">
                9 <span className="text-xs text-slate-400 font-medium font-sans">Verified</span>
              </div>
              <span className="text-slate-600 text-xl font-light">|</span>
              <div className="text-3xl font-extrabold text-rose-400 tracking-tight font-['Plus_Jakarta_Sans']">
                3 <span className="text-xs text-slate-400 font-medium font-sans">Deficits</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Docker, PostgreSQL indexing, and Redis currently gating Tier-1 openings
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-mono">GitHub Audited</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              All Verified
            </span>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

      </section>

      {/* ========================================================
          2. CENTER STAGE: THE SKILL MIRROR DIAGNOSTIC (2-Column Grid)
         ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                The Skill Mirror Diagnostic
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side gap analysis mapping candidate competencies directly against active hiring requirements
            </p>
          </div>

          {/* Target Role Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 font-mono hidden sm:inline">TARGET ROLE:</span>
            <div className="relative">
              <select
                value={selectedTargetRoleId}
                onChange={(e) => setSelectedTargetRoleId(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-lg"
              >
                {availableTargetRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roleTitle}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Candidate vs. Selected Job */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Header with Selected Role Badge */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-sm">
                    {targetRoleDiagnostic.companyLogoText}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {targetRoleDiagnostic.roleTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                      <span>{targetRoleDiagnostic.location}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold font-mono">₹45,000 / mo</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono font-semibold">
                  INTERNSHIP
                </span>
              </div>

              {/* Dynamic Score Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <span>Role Compatibility Index</span>
                    <span className="text-[10px] text-slate-500 font-mono">(Verified against live rubric)</span>
                  </span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">
                    {targetRoleDiagnostic.matchScore}% Match Compatibility
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${targetRoleDiagnostic.matchScore}%` }}
                  />
                </div>
              </div>

              {/* Visual Badge Matrix */}
              <div className="space-y-4 pt-2">
                {/* Green Badges: Matched */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Matched Competencies ({targetRoleDiagnostic.matchedSkills.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">CONFIRMED</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {targetRoleDiagnostic.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shadow-sm"
                      >
                        <span>{skill}</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-1" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Red Alert Badges: Missing Deficits */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Missing Skill Deficits ({targetRoleDiagnostic.missingSkills.length})</span>
                    </span>
                    <span className="text-[10px] text-rose-400/80 font-mono">ACTION REQUIRED</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {targetRoleDiagnostic.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold shadow-sm animate-pulse"
                      >
                        <span>{skill}</span>
                        <AlertCircle className="w-3 h-3 text-rose-400 ml-1" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Micro benchmark footnote */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>
                Based on 2026 rubric for PhonePe Core Web & Platform teams. 74% matches 38 other candidates.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: "Bridge the Gap" Resource Pipeline */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono">
                    "Bridge the Gap" Resource Pipeline
                  </h3>
                </div>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  3 TARGETED ACTIONS
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Directly mapped to your 3 missing competencies. Complete these recommended modules to elevate compatibility above the <strong className="text-white">80% threshold</strong>:
              </p>

              {/* Action Cards (Video, Campus Event, Doc) */}
              <div className="space-y-3">
                {targetRoleDiagnostic.resources.map((res, idx) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between space-x-3 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                        {res.type === 'video' && <Video className="w-4 h-4 text-emerald-400" />}
                        {res.type === 'workshop' && <Calendar className="w-4 h-4 text-indigo-400" />}
                        {res.type === 'cheatsheet' && <FileText className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            res.type === 'video' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                            res.type === 'workshop' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' :
                            'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {res.badgeLabel}
                          </span>
                          <span className="text-[11px] text-slate-400">• {res.provider}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 mt-1 group-hover:text-white transition-colors">
                          {res.title}
                        </h4>
                      </div>
                    </div>

                    <a
                      href={res.url}
                      onClick={(e) => {
                        if (res.url === '#') e.preventDefault();
                        addToast(`Opening Resource`, `Accessing ${res.title}`, 'info');
                      }}
                      className="shrink-0 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors self-center"
                      title={res.linkText}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* "Unlock 1-Click Apply" Button with Disabled State */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={handleApplyClick}
                disabled={targetRoleDiagnostic.matchScore < targetRoleDiagnostic.unlockThreshold}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  targetRoleDiagnostic.matchScore >= targetRoleDiagnostic.unlockThreshold
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {targetRoleDiagnostic.matchScore < targetRoleDiagnostic.unlockThreshold ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Unlock 1-Click Apply (Learn 1 more skill to reach 80% threshold)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>1-Click Apply Now (Threshold Surpassed)</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. ACTIVE APPLICATIONS WEB TABLE
         ======================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Active Applications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status tracking across submitted campus internship pipelines
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Active: <strong className="text-emerald-400">{ACTIVE_APPLICATIONS.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-5">Hiring Company</th>
                <th className="py-3 px-5">Target Position</th>
                <th className="py-3 px-5">Match Score</th>
                <th className="py-3 px-5">Date Applied</th>
                <th className="py-3 px-5">Real-time Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {ACTIVE_APPLICATIONS.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5 flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-mono font-bold text-[11px]">
                      {app.company.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-white">{app.company}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    {app.position}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold font-mono ${
                        app.matchScore >= 80 ? 'text-emerald-400' : 'text-indigo-400'
                      }`}>
                        {app.matchScore}%
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            app.matchScore >= 80 ? 'bg-emerald-400' : 'bg-indigo-400'
                          }`}
                          style={{ width: `${app.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono">
                    {app.dateApplied}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${app.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => addToast('Application Details', `Viewing progress for ${app.position} @ ${app.company}`, 'info')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      View Thread &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

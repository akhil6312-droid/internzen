import React from 'react';
import { 
  X, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Star, 
  Code2, 
  Award, 
  GraduationCap, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CandidateDetailModal: React.FC = () => {
  const { 
    selectedCandidateForReport, 
    setSelectedCandidateForReport, 
    toggleShortlistCandidate,
    addToast 
  } = useApp();

  if (!selectedCandidateForReport) return null;
  const candidate = selectedCandidateForReport;

  const handleScheduleInterview = () => {
    addToast(
      'Interview Slot Reserved',
      `Sent technical assessment invitation to ${candidate.name} via Google Meet.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-lg"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                    {candidate.name}
                  </h3>
                  {candidate.githubVerified && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <Github className="w-3 h-3" />
                      <span>VERIFIED DEV</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {candidate.batch} • {candidate.department}
                </p>
                <div className="flex items-center space-x-2 mt-1 font-mono text-[11px] text-slate-500">
                  <span>github.com/{candidate.githubHandle}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCandidateForReport(null)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Top Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Job Match Score</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5 flex items-baseline space-x-1">
                <span>{candidate.matchScore}%</span>
                <span className="text-[10px] text-emerald-500 font-normal">Rank #1</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Code Rubric Score</div>
              <div className="text-2xl font-extrabold text-indigo-400 mt-0.5">
                {candidate.codeAssessmentScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Academic CGPA</div>
              <div className="text-2xl font-extrabold text-white mt-0.5">
                {candidate.cgpa}<span className="text-xs text-slate-500 font-normal">/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Breakdown Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Matched vs Deficit Skills */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 font-mono mb-3 flex items-center justify-between">
              <span>Skill Matrix Alignment</span>
              <span className="text-emerald-400 text-[11px] font-semibold">{candidate.matchedSkills.length} of {candidate.matchedSkills.length + candidate.missingSkills.length} Required</span>
            </h4>

            <div className="space-y-3">
              {/* Matched */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Competencies (Direct Match)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deficits */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Skill Deficits (Requires Remediation / Onboarding)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Activity & Code Verification */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Verified Git Repository Intelligence</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">142 Commits in 90 Days</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzed 6 public repositories. Heavy contributions to full-stack TypeScript, React state management, and custom REST API implementations with JWT authentication.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Top Repo</div>
                <div className="font-semibold text-slate-200 mt-0.5 truncate">micro-services-ecommerce</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Coding Style</div>
                <div className="font-semibold text-slate-200 mt-0.5 truncate">Clean Architecture / Strict TS</div>
              </div>
            </div>
          </div>

          {/* Recruiter Evaluation Notes */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h5 className="text-xs font-bold text-slate-300 mb-1 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>SkillMatch AI Recommendation</span>
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Candidate Aarav demonstrates exceptional algorithmic readiness (Top 5% in College CS cohort). Recommended for fast-track Technical Round 1 with minor onboarding on Redis caching patterns.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/80 sticky bottom-0 z-10 flex items-center space-x-3">
          <button
            onClick={() => toggleShortlistCandidate(candidate.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              candidate.isShortlisted
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:bg-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${candidate.isShortlisted ? 'fill-emerald-400 text-emerald-400' : ''}`} />
            <span>{candidate.isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}</span>
          </button>

          <button
            onClick={handleScheduleInterview}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
          </button>
        </div>

      </div>
    </div>
  );
};

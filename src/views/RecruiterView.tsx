import React, { useState } from 'react';
import { 
  Plus, 
  Github, 
  Star, 
  FileText, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  Calendar,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Candidate } from '../types';

export const RecruiterView: React.FC = () => {
  const { 
    candidates, 
    toggleShortlistCandidate, 
    setSelectedCandidateForReport, 
    setIsPostJobModalOpen,
    jobOpenings 
  } = useApp();

  const [filterQuery, setFilterQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  // Strictly rank candidates by Match % descending
  const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);

  const filteredCandidates = sortedCandidates.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.matchedSkills.some(s => s.toLowerCase().includes(filterQuery.toLowerCase())) ||
      c.department.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================
          RECRUITER HEADER & ACTIONS
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
              Recruiter & Industry Talent Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active Campaign: <strong className="text-white">PhonePe 2026 Campus Internship Hiring</strong> • 342 pre-screened students
          </p>
        </div>

        {/* Action: Post New Internship Opening */}
        <button
          onClick={() => setIsPostJobModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Internship Opening</span>
        </button>
      </div>

      {/* Recruiter Quick KPI Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Top Match Pool</div>
            <div className="text-xl font-bold text-white mt-0.5">38 Candidates &gt;80%</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Direct Shortlisted</div>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">
              {candidates.filter(c => c.isShortlisted).length} Candidates
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Active Openings</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {jobOpenings.length} Campus Listings
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Talent Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter candidates by name, skill (e.g. Docker), or dept..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>SORTED STRICTLY BY:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            MATCH % (DESCENDING)
          </span>
        </div>
      </div>

      {/* ========================================================
          WEB TALENT GRID (3-COLUMN LAYOUT)
         ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map((candidate, idx) => {
          const isTopTier = candidate.matchScore >= 90;
          return (
            <div
              key={candidate.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 hover:translate-y-[-2px] ${
                candidate.isShortlisted 
                  ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-950/20 to-slate-900' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3.5">
                {/* Top Card Row: Avatar, Info & Rank Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                        {candidate.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {candidate.batch} • {candidate.department.split(' ')[0]}
                      </p>
                      {/* Verified GitHub Badge */}
                      {candidate.githubVerified && (
                        <span className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-mono">
                          <Github className="w-3 h-3 text-emerald-400" />
                          <span>github.com/{candidate.githubHandle}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Percentage Badge */}
                  <div className="text-right">
                    <div className={`px-2.5 py-1 rounded-xl font-mono text-sm font-extrabold inline-flex items-baseline space-x-0.5 border ${
                      isTopTier
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                        : candidate.matchScore >= 80
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      <span>{candidate.matchScore}</span>
                      <span className="text-[10px] font-normal">%</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wide mt-0.5">
                      RANK #{idx + 1}
                    </div>
                  </div>
                </div>

                {/* Score & Rubric Breakdown */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] font-mono uppercase block">Code Score</span>
                    <span className="font-bold text-indigo-300 font-mono">
                      {candidate.codeAssessmentScore}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-mono uppercase block">CGPA</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {candidate.cgpa}
                    </span>
                  </div>
                </div>

                {/* Matched Skills Chips */}
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Verified Matched Skills</span>
                    <span className="text-emerald-400">{candidate.matchedSkills.length} Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                    {candidate.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deficit Alert if any */}
                {candidate.missingSkills.length > 0 && (
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Missing: {candidate.missingSkills.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: "View Match Report" and "Direct Shortlist" */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCandidateForReport(candidate)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Match Report</span>
                </button>

                <button
                  onClick={() => toggleShortlistCandidate(candidate.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    candidate.isShortlisted
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${candidate.isShortlisted ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                  <span>{candidate.isShortlisted ? 'Shortlisted' : 'Direct Shortlist'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </section>

    </div>
  );
};

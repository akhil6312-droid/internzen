import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Check, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  Mail
} from 'lucide-react';
import { Candidate, Job, MatchBreakdown } from '../../types';

interface CandidateCardProps {
  candidate: Candidate;
  job: Job;
  breakdown: MatchBreakdown;
  rank: number;
  onToggleShortlist: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  job,
  breakdown,
  rank,
  onToggleShortlist,
}) => {
  const isQualified = breakdown.unlockedApply; // >= 75%

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        candidate.isShortlisted
          ? 'bg-slate-900/95 border-violet-500/50 shadow-lg shadow-violet-500/10'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header with Rank, Avatar, Name and Shortlist Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Rank badge */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono border ${
                rank === 1
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : rank === 2
                  ? 'bg-slate-400/20 border-slate-400/40 text-slate-300'
                  : rank === 3
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              #{rank}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {candidate.name}
                </h4>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <span>{candidate.college} • {candidate.batch}</span>
              </p>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isQualified
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {breakdown.score}% Match
            </span>
          </div>
        </div>

        {/* Skill Breakdown against this Job */}
        <div className="space-y-2 mb-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Evaluation vs. {job.title}</span>
            <span>{breakdown.matchedSkills.length} of {job.requirements.length} requirements</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.requirements.map((req) => {
              const hasSkill = candidate.skills.some(
                (s) => s.skillId === req.skillId && s.proficiencyScore > 0
              );

              return (
                <span
                  key={req.skillId}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                    hasSkill
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  {hasSkill ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                  ) : (
                    <X className="w-2.5 h-2.5 text-rose-400 stroke-[3]" />
                  )}
                  <span>{req.skillName}</span>
                  <span className="opacity-70 font-mono text-[10px]">({req.weight}%)</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Candidate Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Mail className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[140px] sm:max-w-none">{candidate.email}</span>
        </span>

        <button
          onClick={() => onToggleShortlist(candidate.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            candidate.isShortlisted
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              candidate.isShortlisted ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
            }`}
          />
          <span>{candidate.isShortlisted ? 'Shortlisted' : '1-Click Shortlist'}</span>
        </button>
      </div>
    </motion.div>
  );
};

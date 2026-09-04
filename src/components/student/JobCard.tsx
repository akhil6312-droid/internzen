import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Banknote, 
  Check, 
  X, 
  Lock, 
  Sparkles, 
  SendHorizontal, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Job, MatchBreakdown } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';
import { InfoButton } from '../common/InfoButton';

interface JobCardProps {
  job: Job;
  breakdown: MatchBreakdown;
  isApplied: boolean;
  onOpenDiagnostic: (job: Job) => void;
  onApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  breakdown,
  isApplied,
  onOpenDiagnostic,
  onApply,
}) => {
  const isEligible = breakdown.unlockedApply; // score >= 75

  const domainLabels: Record<string, string> = {
    software: 'Software / IT',
    mechanical: 'Mechanical / CAD',
    teaching: 'Teaching / EdTech',
    electrical: 'Electronics / IoT',
    business: 'Business / Finance',
    soft_skill: 'General',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/20 group relative overflow-hidden"
    >
      {/* Top Header Row with Company Vector Logo */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3.5">
            <CompanyLogo
              logoType={job.logoType}
              companyName={job.company}
              brandColor={job.brandColor}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-300">
                  {job.company}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {domainLabels[job.domain] || job.domain}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                  isEligible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
                {breakdown.score}% Match
              </div>
              <InfoButton
                title="Explainable Match Score"
                description={`Calculated strictly as the sum of recruiter requirement weights for verified skills you possess. For this role, current compatibility is ${breakdown.score}%.`}
                rationale="Eliminates ATS keyword guesswork by using a deterministic linear model: Score = ∑ (Weight × Possession)."
                tip="Achieve ≥ 75% to unlock direct application. Click 'Diagnostic & Skill Mirror' to see targeted courses."
                placement="left"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isEligible ? 'Qualified to Apply' : 'Requires Upskilling'}
            </p>
          </div>
        </div>

        {/* Details Row: Stipend & Location */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>{job.stipend}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Job Description Preview */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Visible Requirements Breakdown Tags */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Skill Requirements & Weights</span>
              <InfoButton
                title="Recruiter Skill Weights"
                description="Hiring managers assign each skill an explicit weight (summing to 100%). Green chips indicate verified skills in your profile; red chips indicate missing competencies."
                rationale="Provides complete transparency into why an applicant qualifies or falls short."
                placement="bottom"
              />
            </div>
            <span>
              {breakdown.matchedSkills.length} of {job.requirements.length} satisfied
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.requirements.map((req) => {
              const isMatched = breakdown.matchedSkills.some(
                (m) => m.skillName.toLowerCase() === req.skillName.toLowerCase()
              );

              return (
                <span
                  key={req.skillId}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isMatched
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                  title={`${req.skillName} contributes ${req.weight}% to total readiness`}
                >
                  {isMatched ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0 stroke-[2.5]" />
                  ) : (
                    <X className="w-3 h-3 text-rose-400 shrink-0 stroke-[2.5]" />
                  )}
                  <span>{req.skillName}</span>
                  <span className="text-[10px] opacity-70 font-mono">({req.weight}%)</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          onClick={() => onOpenDiagnostic(job)}
          className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-all shadow-sm active:scale-[0.98]"
        >
          <Activity className="w-3.5 h-3.5 text-violet-400" />
          <span>Diagnostic & Skill Mirror</span>
        </button>

        {isApplied ? (
          <button
            disabled
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Applied ✓ (In Dashboard)</span>
          </button>
        ) : (
          <button
            onClick={() => isEligible && onApply(job)}
            disabled={!isEligible}
            className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98] ${
              isEligible
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer'
                : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
            title={
              !isEligible
                ? `Match score is ${breakdown.score}%. Unlock direct application at 75%+. Use Skill Mirror to close the gap!`
                : 'Score is above 75%! Click to verify credentials and apply.'
            }
          >
            {isEligible ? (
              <>
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>Verify & Apply</span>
                <Sparkles className="w-3 h-3 text-emerald-200" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Apply ({breakdown.score}% / 75%)</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

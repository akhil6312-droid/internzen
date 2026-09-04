import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Check, 
  Sparkles, 
  SendHorizontal, 
  Youtube, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Job, MatchBreakdown, StudentSkill } from '../../types';
import { LEARNING_RESOURCES } from '../../data/seed';
import { InfoButton } from '../common/InfoButton';
import { fireConfetti } from '../../utils/confetti';

interface SkillMirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  breakdown: MatchBreakdown;
  studentSkills: StudentSkill[];
  isApplied: boolean;
  onToggleSkillLearned: (skillId: string, skillName: string) => void;
  onApply: (job: Job) => void;
}

export const SkillMirrorModal: React.FC<SkillMirrorModalProps> = ({
  isOpen,
  onClose,
  job,
  breakdown,
  studentSkills,
  isApplied,
  onToggleSkillLearned,
  onApply,
}) => {
  if (!isOpen || !job) return null;

  const isEligible = breakdown.unlockedApply;

  // Helper to fetch or generate 3 distinct tracks for a missing skill
  const getSkillTracks = (skillId: string, skillName: string) => {
    const existing = LEARNING_RESOURCES[skillId] || [];
    const videoTrack = existing.find((r) => r.type === 'youtube') || {
      id: `res-vid-${skillId}`,
      skillId,
      skillName,
      title: `${skillName} Practical Crash Course & Code Walkthrough`,
      type: 'youtube' as const,
      platform: 'FreeCodeCamp / YouTube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' tutorial freecodecamp')}`,
      duration: '2h 30m',
    };

    const courseTrack = existing.find((r) => r.type === 'course') || {
      id: `res-course-${skillId}`,
      skillId,
      skillName,
      title: `${skillName} Specialization & Interactive Labs`,
      type: 'course' as const,
      platform: 'Coursera (Free Audit) / NPTEL',
      url: `https://www.coursera.org/search?query=${encodeURIComponent(skillName)}`,
      duration: '4 Modules (Free)',
    };

    const docsTrack = existing.find((r) => r.type === 'docs' || r.type === 'pdf') || {
      id: `res-doc-${skillId}`,
      skillId,
      skillName,
      title: `${skillName} Official Documentation & Reference Cheat Sheet PDF`,
      type: 'docs' as const,
      platform: 'Official Documentation / PDF',
      url: `https://devdocs.io/#q=${encodeURIComponent(skillName)}`,
      duration: '20 mins read',
    };

    return { videoTrack, courseTrack, docsTrack };
  };

  // Specifically check if Power BI is a requirement in this job and its state
  const powerBIReq = job.requirements.find((r) => r.skillName.toLowerCase().includes('power bi'));
  const hasPowerBI = powerBIReq
    ? studentSkills.some((s) => s.skillId === powerBIReq.skillId && s.proficiencyScore > 0)
    : false;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/90 sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Skill Mirror Diagnostic
              </span>
              <span className="text-xs text-slate-400">
                Deterministic Compatibility Analysis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {job.title}
              <span className="text-slate-400 font-medium text-base ml-2">@ {job.company}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Score Comparison & Animated Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            {/* Score Ring / Metric */}
            <div className="flex flex-col items-center justify-center p-4 text-center border-b md:border-b-0 md:border-r border-slate-800">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Deterministic Match Score
                </span>
                <InfoButton
                  title="Role Eligibility Score"
                  description="Your total weighted alignment score for this role. Calculated strictly by summing the weights of all requirements you have verified."
                  rationale="Reaching 75% unlocks direct application, preventing unqualified candidate rejections."
                  placement="bottom"
                />
              </div>
              <div className="relative flex items-center justify-center w-28 h-28">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <motion.circle
                    className={isEligible ? 'text-emerald-500' : 'text-amber-500'}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 40 - (2 * Math.PI * 40 * breakdown.score) / 100,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{breakdown.score}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">Readiness</span>
                </div>
              </div>
            </div>

            {/* Match State & Threshold Explanation */}
            <div className="md:col-span-2 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isEligible
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {isEligible ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Application Threshold Unlocked (≥ 75%)
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Threshold Locked (Requires ≥ 75%)
                      </>
                    )}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {breakdown.score === 100
                    ? 'Perfect 100% Match! All requirements verified.'
                    : isEligible
                    ? 'Great fit! You surpass the minimum placement threshold.'
                    : `Skill gap identified: You are ${75 - breakdown.score}% away from the threshold.`}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  InternZen uses deterministic weighting: <code className="text-slate-300">Σ (Requirement Weight × Possession)</code>. No hidden AI hallucinations. Every requirement has clear percentage contribution.
                </p>
              </div>

              {/* Dynamic Action Trigger: Specifically for Power BI or missing skills */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                {powerBIReq && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onToggleSkillLearned(powerBIReq.skillId, powerBIReq.skillName)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                      hasPowerBI
                        ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                        : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                    }`}
                  >
                    {hasPowerBI ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Power BI Completed (Click to Reset / Unlearn)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-spin" />
                        <span>Mark Power BI as Learned (+15% Score Jump)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </motion.button>
                )}

                {/* Additional missing skills interactive toggle */}
                {breakdown.missingSkills
                  .filter((m) => !m.skillName.toLowerCase().includes('power bi'))
                  .slice(0, 2)
                  .map((missing) => {
                    const reqObj = job.requirements.find(
                      (r) => r.skillName.toLowerCase() === missing.skillName.toLowerCase()
                    );
                    if (!reqObj) return null;
                    return (
                      <button
                        key={reqObj.skillId}
                        onClick={() => onToggleSkillLearned(reqObj.skillId, reqObj.skillName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all"
                      >
                        <TrendingUp className="w-3 h-3 text-violet-400" />
                        <span>Learn {reqObj.skillName} (+{reqObj.weight}%)</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Section 1: Detailed Breakdown Table & Mobile Vertical Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Deterministic Skill Weight Decomposition</span>
                  <span className="text-xs font-normal text-slate-400 font-mono">(Sum = 100%)</span>
                </h3>
                <InfoButton
                  title="Mathematical Weight Decomposition"
                  description="Shows the exact contribution of each requirement. Possessing a skill awards its full designated percentage weight to your match total."
                  rationale="Provides mathematical verification of why you qualify or where your deficit lies."
                  tip="Use the '+ Mark Learned' button in any row to instantly simulate how gaining that skill impacts your match!"
                />
              </div>
            </div>

            {/* Desktop Table (Hidden on mobile <768px) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Skill Requirement</th>
                    <th className="py-3 px-4">Requirement Weight</th>
                    <th className="py-3 px-4">Possession Status</th>
                    <th className="py-3 px-4 text-right">Score Contribution</th>
                    <th className="py-3 px-4 text-center">Interactive Simulation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900">
                  {job.requirements.map((req) => {
                    const isPossessed = studentSkills.some(
                      (s) => s.skillId === req.skillId && s.proficiencyScore > 0
                    );
                    const contribution = isPossessed ? req.weight : 0;

                    return (
                      <tr
                        key={req.skillId}
                        className={`transition-colors ${
                          isPossessed ? 'hover:bg-emerald-950/10' : 'hover:bg-rose-950/10'
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{req.skillName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {req.weight}%
                        </td>
                        <td className="py-3 px-4">
                          {isPossessed ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              <Check className="w-3 h-3 text-emerald-400" />
                              Possessed & Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                              <X className="w-3 h-3 text-rose-400" />
                              Skill Deficit (-{req.weight}%)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          <span className={isPossessed ? 'text-emerald-400' : 'text-slate-500'}>
                            +{contribution}%
                          </span>
                          <span className="text-slate-500 text-[10px]"> / {req.weight}%</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              if (!isPossessed) fireConfetti('subtle');
                              onToggleSkillLearned(req.skillId, req.skillName);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              isPossessed
                                ? 'bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30'
                                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isPossessed ? 'Toggle Off' : '+ Mark Learned'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Vertical Cards (Visible only on mobile <768px) */}
            <div className="md:hidden space-y-3">
              {job.requirements.map((req) => {
                const isPossessed = studentSkills.some(
                  (s) => s.skillId === req.skillId && s.proficiencyScore > 0
                );
                const contribution = isPossessed ? req.weight : 0;

                return (
                  <div
                    key={req.skillId}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-xs">{req.skillName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Requirement Weight: {req.weight}%
                        </span>
                      </div>
                      <div>
                        {isPossessed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Verified (+{contribution}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            <X className="w-3 h-3 text-rose-400" />
                            Deficit (-{req.weight}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isPossessed) fireConfetti('subtle');
                        onToggleSkillLearned(req.skillId, req.skillName);
                      }}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isPossessed
                          ? 'bg-slate-800 text-slate-300 hover:text-rose-300 hover:bg-rose-950/30 border border-slate-700'
                          : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isPossessed ? 'Toggle Off (Reset)' : `+ Mark Learned (+${req.weight}%)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dedicated Curated Learning Tracks for Every Missing Skill */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    <span>Dedicated Learning Platforms for Every Skill Deficit</span>
                  </h3>
                  <InfoButton
                    title="Direct Learning Platform Pathways"
                    description="Every missing competency has 3 direct platform tracks: FreeCodeCamp/YouTube Video, Coursera/NPTEL Interactive Course, and Official Docs/PDF Cheat Sheet. Mark completed to immediately boost your match score."
                    rationale="Eliminates the placement knowledge gap with direct, verifiable study modules."
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actionable 3-track learning pathways mapped directly to each missing requirement
                </p>
              </div>
            </div>

            {breakdown.missingSkills.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/70 rounded-2xl border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">All Requirements Satisfied! Perfect 100% Match!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  You possess all verified competencies required for this role. The direct application threshold (≥ 75%) is unlocked.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {breakdown.missingSkills.map((missing) => {
                  const req = job.requirements.find(
                    (r) => r.skillName.toLowerCase() === missing.skillName.toLowerCase()
                  ) || {
                    skillId: '',
                    skillName: missing.skillName,
                    weight: missing.weight,
                  };

                  const isLearned = studentSkills.some(
                    (s) => s.skillName.toLowerCase() === missing.skillName.toLowerCase() && s.proficiencyScore > 0
                  );

                  const { videoTrack, courseTrack, docsTrack } = getSkillTracks(req.skillId, req.skillName);

                  return (
                    <div
                      key={req.skillId || missing.skillName}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3.5 shadow-md"
                    >
                      {/* Card Header with Live Completion Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse shrink-0" />
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {req.skillName}
                          </h4>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 uppercase font-mono">
                            Skill Deficit (-{req.weight}% Impact)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isLearned) fireConfetti('subtle');
                            onToggleSkillLearned(req.skillId, req.skillName);
                          }}
                          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                            isLearned
                              ? 'bg-slate-800 hover:bg-rose-950/40 text-emerald-300 hover:text-rose-300 border border-emerald-500/30 hover:border-rose-500/40'
                              : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                          }`}
                        >
                          {isLearned ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Module Completed ✓ (+{req.weight}%)</span>
                              <span className="text-[10px] text-slate-400">(Reset)</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                              <span>Mark Module Completed (+{req.weight}% Match)</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* 3 Distinct Platform Links (Video, Course, Docs) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* 1. Video Track: FreeCodeCamp / YouTube */}
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/30 flex flex-col justify-between group transition-all">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20">
                                <Youtube className="w-3 h-3 text-red-400" />
                                Video Track
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ⏱️ {videoTrack.duration}
                              </span>
                            </div>
                            <h5 className="text-xs font-semibold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-snug">
                              {videoTrack.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-1.5">
                              Platform: <strong className="text-slate-300">{videoTrack.platform}</strong>
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                            <a
                              href={videoTrack.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[44px] text-xs font-semibold text-red-400 hover:text-red-300 flex items-center justify-between"
                            >
                              <span>Watch Free Video</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* 2. Interactive / Course Track: Coursera / NPTEL / Kaggle */}
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/30 flex flex-col justify-between group transition-all">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                <GraduationCap className="w-3 h-3 text-indigo-400" />
                                Course Track
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                🎓 {courseTrack.duration}
                              </span>
                            </div>
                            <h5 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                              {courseTrack.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-1.5">
                              Platform: <strong className="text-slate-300">{courseTrack.platform}</strong>
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                            <a
                              href={courseTrack.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[44px] text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-between"
                            >
                              <span>Start Free Module</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* 3. Documentation / Notes Track: Official Docs / PDF */}
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 flex flex-col justify-between group transition-all">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                <FileText className="w-3 h-3 text-amber-400" />
                                Docs / PDF Track
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                📄 {docsTrack.duration}
                              </span>
                            </div>
                            <h5 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                              {docsTrack.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-1.5">
                              Platform: <strong className="text-slate-300">{docsTrack.platform}</strong>
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                            <a
                              href={docsTrack.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[44px] text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between"
                            >
                              <span>Read Docs & Cheatsheet</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Apply CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Current Match Readiness:{' '}
            <strong className={isEligible ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {breakdown.score}%
            </strong>{' '}
            {isEligible ? '(Application threshold met)' : '(75% needed to apply)'}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>

            {isApplied ? (
              <button
                disabled
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Application Submitted</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isEligible) {
                    onApply(job);
                  }
                }}
                disabled={!isEligible}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isEligible
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/25 cursor-pointer ring-1 ring-emerald-400/40'
                    : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {isEligible ? (
                  <>
                    <SendHorizontal className="w-3.5 h-3.5" />
                    <span>1-Click Apply Now</span>
                    <Sparkles className="w-3 h-3 text-emerald-100" />
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Apply Locked ({breakdown.score}% / 75%)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

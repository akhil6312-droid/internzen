import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Search, Target, BookOpen, TrendingUp, SendHorizontal } from 'lucide-react';
import { InfoButton } from './common/InfoButton';

const LOOP_STEPS = [
  {
    step: 1,
    id: 'assess',
    label: 'Assess',
    description: 'Verify skills with empirical badges',
    icon: CheckCircle,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    step: 2,
    id: 'match',
    label: 'Match',
    description: 'Weighted deterministic match calculation',
    icon: Search,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    step: 3,
    id: 'identify',
    label: 'Identify Gap',
    description: 'Skill mirror isolates missing requirements',
    icon: Target,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  {
    step: 4,
    id: 'learn',
    label: 'Learn',
    description: 'Curated 1-click micro-learning resources',
    icon: BookOpen,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    step: 5,
    id: 'improve',
    label: 'Improve Match',
    description: 'Live recalculation from 85% to 100%',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    step: 6,
    id: 'apply',
    label: 'Apply',
    description: '1-Click threshold application unlocked (>=75%)',
    icon: SendHorizontal,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
];

interface ResearchLoopBannerProps {
  activeStep?: number;
}

export const ResearchLoopBanner: React.FC<ResearchLoopBannerProps> = ({ activeStep = 3 }) => {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Research-Backed Placement Loop
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Evidence-based continuous candidate readiness pipeline
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-sm sm:text-base font-bold text-white">
              The Closed-Loop Skill Intelligence Architecture
            </h3>
            <InfoButton
              title="Closed-Loop Placement Model"
              description="Traditional platforms use black-box keyword filtering. InternZen follows an empirical 6-step loop: ASSESS skills -> MATCH with weights -> IDENTIFY gaps -> LEARN via micro-content -> IMPROVE match score -> APPLY when threshold (≥75%) is met."
              rationale="Backed by placement research to prevent resume rejection and guide students systematically to qualification."
              tip="Look for opportunities where learning just 1 missing skill (like Power BI) jumps your score to 100%!"
            />
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Threshold Rule: <strong className="text-emerald-400 font-semibold">Score ≥ 75%</strong> unlocks direct application
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {LOOP_STEPS.map((step) => {
          const Icon = step.icon;
          const isCurrent = step.step === activeStep;

          return (
            <motion.div
              key={step.id}
              whileHover={{ y: -2 }}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-slate-800/90 border-violet-500/60 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/40'
                  : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg border ${step.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  0{step.step}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  {step.label}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

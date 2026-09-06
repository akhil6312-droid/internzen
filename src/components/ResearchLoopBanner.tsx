import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Search, Target, BookOpen, TrendingUp, SendHorizontal } from 'lucide-react';
import { InfoButton } from './common/InfoButton';

const LOOP_STEPS = [
  {
    step: 1,
    id: 'assess',
    label: 'Assess',
    description: 'Add and verify your skills',
    icon: CheckCircle,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    step: 2,
    id: 'match',
    label: 'Match',
    description: 'Calculate match score for each job',
    icon: Search,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    step: 3,
    id: 'identify',
    label: 'Find Gaps',
    description: 'See missing skills for any role',
    icon: Target,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  {
    step: 4,
    id: 'learn',
    label: 'Learn',
    description: 'Learn missing skills with free courses',
    icon: BookOpen,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    step: 5,
    id: 'improve',
    label: 'Boost Score',
    description: 'Watch your match score increase',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    step: 6,
    id: 'apply',
    label: 'Apply',
    description: 'Apply directly once you reach 75%',
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
              How InternZen Works
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Your path from learning skills to getting hired
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-sm sm:text-base font-bold text-white">
              6 Simple Steps to Get Hired
            </h3>
            <InfoButton
              title="How InternZen Works"
              description="Instead of blindly sending resumes, InternZen shows you what skills jobs need, guides you to learn missing skills, and lets you apply when your match score hits 75%."
              rationale="Helps you focus on learning the exact skills employers want."
              tip="Learn just 1 missing skill to boost your match score and qualify!"
            />
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Rule: <strong className="text-emerald-400 font-semibold">Match Score ≥ 75%</strong> unlocks direct application
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

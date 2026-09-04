import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Briefcase, 
  Sparkles, 
  Search, 
  Plus, 
  Flame,
  Award,
  BookOpen,
  Layers
} from 'lucide-react';
import { Job, StudentProfile, MatchBreakdown } from '../../types';
import { calculateJobMatch } from '../../engine/matching';
import { JobCard } from './JobCard';
import { ResearchLoopBanner } from '../ResearchLoopBanner';
import { InfoButton } from '../common/InfoButton';

interface StudentViewProps {
  studentProfile: StudentProfile;
  jobs: Job[];
  onOpenDiagnostic: (job: Job) => void;
  onApply: (job: Job) => void;
  onToggleSkill: (skillId: string, skillName: string) => void;
  onOpenMultiSkillDrawer: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  studentProfile,
  jobs,
  onOpenDiagnostic,
  onApply,
  onToggleSkill,
  onOpenMultiSkillDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [readinessFilter, setReadinessFilter] = useState<'all' | 'ready' | 'upskilling'>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  // Calculate deterministic match breakdowns for all jobs against current student skills
  const jobBreakdowns: Record<string, MatchBreakdown> = {};
  let totalScoreSum = 0;

  jobs.forEach((job) => {
    const breakdown = calculateJobMatch(job, studentProfile.skills);
    jobBreakdowns[job.id] = breakdown;
    totalScoreSum += breakdown.score;
  });

  const verifiedSkillsCount = studentProfile.skills.filter(
    (s) => s.isVerified && s.proficiencyScore > 0
  ).length;

  const averageReadinessScore = jobs.length > 0 ? Math.round(totalScoreSum / jobs.length) : 0;
  const readyOpportunitiesCount = jobs.filter((job) => jobBreakdowns[job.id]?.unlockedApply).length;

  // Filter jobs based on search, readiness, and domain
  const filteredJobs = jobs.filter((job) => {
    const breakdown = jobBreakdowns[job.id];
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.domain.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (domainFilter !== 'all' && job.domain !== domainFilter) {
      return false;
    }

    if (readinessFilter === 'ready') return breakdown?.unlockedApply;
    if (readinessFilter === 'upskilling') return !breakdown?.unlockedApply;
    return true;
  });

  const domainTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'All Fields' },
    { id: 'software', label: 'Software & Data' },
    { id: 'mechanical', label: 'Mechanical & CAD' },
    { id: 'teaching', label: 'Education & Teaching' },
    { id: 'electrical', label: 'Electronics & IoT' },
    { id: 'business', label: 'Business & Finance' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Research Loop Workflow Architecture Banner */}
      <ResearchLoopBanner activeStep={3} />

      {/* 2. Header Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verified Skills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">Verified Competencies</span>
              <InfoButton
                title="Empirical Skill Verification"
                description="Skills in your portfolio backed by coursework, GitHub repositories, or verified certificates. Only verified skills contribute to deterministic employer compatibility."
                rationale="Eliminates resume buzzword stuffing by grounding profiles in empirical evidence."
                tip="Click '+ Add Skill (Multi-Domain)' to browse and add skills across 5 disciplines."
              />
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {verifiedSkillsCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">Verified Skills</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-400 font-medium">
            Cross-Disciplinary Profile
          </p>
        </motion.div>

        {/* Active Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Opportunities</span>
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Briefcase className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {jobs.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Open Positions</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            Across 5 Core Disciplines
          </p>
        </motion.div>

        {/* Average Readiness Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">Average Readiness</span>
              <InfoButton
                title="Placement Readiness Index"
                description="The mathematical mean of your compatibility score across all open opportunities. Reflects your overall market employability."
                rationale="Enables TPOs and students to benchmark overall industry readiness without subjective estimates."
                tip="Boost your average by bridging gaps on high-frequency skills like SQL, Git, or SolidWorks."
              />
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {averageReadinessScore}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Index Score</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-400 font-medium">
            Placement Readiness Index
          </p>
        </motion.div>

        {/* Qualified to Apply */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">Threshold Surpassed</span>
              <InfoButton
                title="75% Direct Application Threshold"
                description="Roles where your deterministic score is ≥ 75% unlock Direct Application. Below 75%, companies recommend upskilling first to protect candidate interview pipelines."
                rationale="Ensures recruiters interview candidates who meet their baseline skill criteria."
                tip="Use Skill Mirror to identify exactly which missing skill will push you over 75%!"
              />
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {readyOpportunitiesCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">of {jobs.length} Roles</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            ≥ 75% Match Unlocked
          </p>
        </motion.div>
      </div>

      {/* 3. Student Skills Management Strip */}
      <div className="p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>{studentProfile.name}&apos;s Verified Skill Portfolio</span>
              </h3>
              <InfoButton
                title="Interactive Skill Simulation"
                description="Click any skill chip to toggle possession on or off in real-time. Notice how your match scores recalculate instantly across all company openings!"
                rationale="Allows students and TPOs to simulate 'what-if' career scenarios before dedicating study time."
                tip="Click '+ Add Skill (Multi-Domain)' to add skills across Mechanical, Teaching, Electronics, and Finance."
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any skill chip to toggle possession, or use &quot;+ Add Skill&quot; to multi-select from all domains (Software, Mechanical, Teaching, etc.).
            </p>
          </div>

          <button
            onClick={onOpenMultiSkillDrawer}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/25 transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Skill (Multi-Domain)</span>
          </button>
        </div>

        {/* Skill Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {studentProfile.skills.map((skill) => {
            const isPossessed = skill.proficiencyScore > 0;
            return (
              <button
                key={skill.skillId}
                onClick={() => onToggleSkill(skill.skillId, skill.skillName)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isPossessed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750 line-through'
                }`}
                title={isPossessed ? 'Click to disable skill' : 'Click to enable skill'}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isPossessed ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{skill.skillName}</span>
                {skill.domain && (
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-800/80 text-slate-400 font-mono">
                    {skill.domain}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Add Power BI Pill if not possessed */}
          {!studentProfile.skills.some((s) => s.skillName.toLowerCase() === 'power bi' && s.proficiencyScore > 0) && (
            <button
              onClick={() => onToggleSkill('sk-pbi', 'Power BI')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 hover:from-emerald-600/40 hover:to-teal-600/40 shadow-sm transition-all animate-pulse"
              title="Quickly acquire Power BI to unlock 100% readiness on TechNova"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Learn Power BI (+15%)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Domain Navigation & Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-violet-400" />
          <span>Filter by Domain:</span>
        </div>
        {domainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDomainFilter(tab.id)}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              domainFilter === tab.id
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search internships by role, company, or domain..."
            aria-label="Search internships by role, company, or domain"
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Readiness Filter Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setReadinessFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-semibold rounded-lg transition-colors text-center ${
              readinessFilter === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Roles ({jobs.length})
          </button>
          <button
            onClick={() => setReadinessFilter('ready')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-semibold rounded-lg transition-colors text-center ${
              readinessFilter === 'ready'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Match Ready ≥75% ({readyOpportunitiesCount})
          </button>
          <button
            onClick={() => setReadinessFilter('upskilling')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-semibold rounded-lg transition-colors text-center ${
              readinessFilter === 'upskilling'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upskilling Needed ({jobs.length - readyOpportunitiesCount})
          </button>
        </div>
      </div>

      {/* 6. Personalized Opportunity Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Curated Cross-Domain Internship Opportunities</span>
            <span className="text-xs font-normal text-slate-400 font-mono">
              ({filteredJobs.length} roles found)
            </span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Ranked by deterministic compatibility
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Roles Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or switch to &quot;All Fields&quot;.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
            {filteredJobs.map((job) => {
              const breakdown = jobBreakdowns[job.id];
              const isApplied = studentProfile.appliedJobIds.includes(job.id);

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  breakdown={breakdown}
                  isApplied={isApplied}
                  onOpenDiagnostic={onOpenDiagnostic}
                  onApply={onApply}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

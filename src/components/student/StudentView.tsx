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
  Layers,
  Target,
  GraduationCap
} from 'lucide-react';
import { Job, StudentProfile, MatchBreakdown, ThemeOption } from '../../types';
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
  currentTheme?: ThemeOption;
}

export const StudentView: React.FC<StudentViewProps> = ({
  studentProfile,
  jobs,
  onOpenDiagnostic,
  onApply,
  onToggleSkill,
  onOpenMultiSkillDrawer,
  currentTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [readinessFilter, setReadinessFilter] = useState<'all' | 'ready' | 'upskilling'>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  const isDark = currentTheme
    ? currentTheme !== 'light' && currentTheme !== 'modern-light'
    : typeof document !== 'undefined'
    ? !document.documentElement.classList.contains('light')
    : true;

  const candidateSpecialization =
    studentProfile.specialization || studentProfile.department || 'Full-Stack Web Development';

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

    if (domainFilter === 'specialization') {
      const specWords = candidateSpecialization.toLowerCase().split(/[\s/,&+-]+/).filter((w) => w.length > 2);
      const matchesSpec =
        specWords.some((kw) => job.title.toLowerCase().includes(kw)) ||
        specWords.some((kw) => job.domain.toLowerCase().includes(kw)) ||
        job.requirements.some((r) => specWords.some((kw) => r.skillName.toLowerCase().includes(kw)));
      if (!matchesSpec) return false;
    } else if (domainFilter !== 'all' && job.domain !== domainFilter) {
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

      {/* 2. Candidate Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-slate-900/90 border border-slate-800/90 shadow-xl text-slate-100'
            : 'bg-white border border-slate-200 shadow-sm text-slate-900'
        }`}
      >
        {/* Ambient accent glow */}
        {isDark && (
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet-600/10 via-indigo-600/5 to-transparent pointer-events-none" />
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Avatar with initials and status ring */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-violet-500/30 ring-2 ring-violet-400/40">
                {studentProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 ${
                  isDark ? 'border-slate-900' : 'border-white'
                }`}
                title="Active Profile Verified"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`font-bold text-lg sm:text-xl tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {studentProfile.name}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                    : 'bg-violet-50 text-violet-700 border-violet-200'
                }`}>
                  {studentProfile.batch || 'Class of 2026'}
                </span>
              </div>

              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{studentProfile.college}</span>
                </div>
                <span className={isDark ? 'hidden sm:inline text-slate-600' : 'hidden sm:inline text-slate-300'}>&bull;</span>
                <div className="flex items-center gap-1.5">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{studentProfile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Specialization Badge */}
          <div className={`flex flex-col sm:items-end gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Target className={`w-3 h-3 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              <span>Target Internship Specialization</span>
            </span>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${
              isDark
                ? 'text-purple-200 bg-purple-950/60 border-purple-500/30 shadow-sm shadow-purple-500/10'
                : 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              <span className="text-xs font-bold tracking-wide">
                {candidateSpecialization}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Header Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verified Skills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 shadow-sm dark:shadow-lg relative overflow-visible transition-colors ${
            isDark
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Competencies</span>
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
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {verifiedSkillsCount}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Skills</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-500 dark:text-emerald-400 font-medium">
            Cross-Disciplinary Profile
          </p>
        </motion.div>

        {/* Active Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl p-5 shadow-sm dark:shadow-lg relative overflow-visible transition-colors ${
            isDark
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Opportunities</span>
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Briefcase className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {jobs.length}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Open Positions</span>
          </div>
          <p className={`mt-1 text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Across 5 Core Disciplines
          </p>
        </motion.div>

        {/* Average Readiness Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-5 shadow-sm dark:shadow-lg relative overflow-visible transition-colors ${
            isDark
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Readiness</span>
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
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {averageReadinessScore}%
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Index Score</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-500 dark:text-amber-400 font-medium">
            Placement Readiness Index
          </p>
        </motion.div>

        {/* Qualified to Apply */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl p-5 shadow-sm dark:shadow-lg relative overflow-visible transition-colors ${
            isDark
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Threshold Surpassed</span>
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
            <span className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 tracking-tight">
              {readyOpportunitiesCount}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>of {jobs.length} Roles</span>
          </div>
          <p className={`mt-1 text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ≥ 75% Match Unlocked
          </p>
        </motion.div>
      </div>

      {/* 3. Student Skills Management Strip */}
      <div className={`p-4 sm:p-5 rounded-2xl relative overflow-visible transition-colors ${
        isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
      <div className={`flex items-center gap-2 pb-2 border-b ${isDark ? 'border-slate-800/60' : 'border-slate-200'} overflow-x-auto no-scrollbar`}>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} mr-1 shrink-0`}>
          <Layers className="w-3.5 h-3.5 text-violet-400" />
          <span>Filter by Domain:</span>
        </div>

        {/* Candidate's Custom Specialization Filter Tab */}
        <button
          onClick={() => setDomainFilter(domainFilter === 'specialization' ? 'all' : 'specialization')}
          className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
            domainFilter === 'specialization'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-md shadow-violet-500/25 ring-1 ring-violet-400/40'
              : isDark
              ? 'bg-violet-950/40 text-violet-300 border-violet-500/40 hover:border-violet-400 hover:text-white'
              : 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-300'
          }`}
          title={`Filter opportunities tailored for ${candidateSpecialization}`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>🎯 Target: {candidateSpecialization}</span>
        </button>

        {domainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDomainFilter(tab.id)}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              domainFilter === tab.id
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20'
                : isDark
                ? 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300 shadow-sm'
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
            className={`w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          />
        </div>

        {/* Readiness Filter Tabs */}
        <div className={`flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 rounded-xl border ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setReadinessFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-semibold rounded-lg transition-colors text-center ${
              readinessFilter === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Roles ({jobs.length})
          </button>
          <button
            onClick={() => setReadinessFilter('ready')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-semibold rounded-lg transition-colors text-center ${
              readinessFilter === 'ready'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Match Ready ≥75% ({readyOpportunitiesCount})
          </button>
          <button
            onClick={() => setReadinessFilter('upskilling')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-xs font-semibold rounded-lg transition-colors text-center ${
              readinessFilter === 'upskilling'
                ? 'bg-amber-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upskilling Needed ({jobs.length - readyOpportunitiesCount})
          </button>
        </div>
      </div>

      {/* 6. Personalized Opportunity Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>Curated Cross-Domain Internship Opportunities</span>
            <span className={`text-xs font-normal font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ({filteredJobs.length} roles found)
            </span>
          </h2>
          <span className={`text-xs hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ranked by deterministic compatibility
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Matching Roles Found</h3>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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

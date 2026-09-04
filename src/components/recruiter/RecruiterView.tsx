import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Plus, 
  Star, 
  ShieldCheck, 
  Search
} from 'lucide-react';
import { Job, Candidate, StudentProfile, MatchBreakdown } from '../../types';
import { calculateJobMatch } from '../../engine/matching';
import { CandidateCard } from './CandidateCard';
import { JobCreatorModal } from './JobCreatorModal';
import { InfoButton } from '../common/InfoButton';

interface RecruiterViewProps {
  jobs: Job[];
  candidates: Candidate[];
  studentProfile: StudentProfile;
  onAddJob: (newJob: Job) => void;
  onToggleShortlist: (candidateId: string) => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  jobs,
  candidates,
  studentProfile,
  onAddJob,
  onToggleShortlist,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'qualified' | 'shortlisted'>('all');
  const [searchCandidate, setSearchCandidate] = useState('');

  // The active job selected for candidate ranking
  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Combine studentProfile into candidate pool so Aman Sharma's live skill changes reflect dynamically
  const liveAmanCandidate: Candidate = {
    id: studentProfile.id,
    name: studentProfile.name,
    email: studentProfile.email,
    college: studentProfile.college,
    batch: studentProfile.batch,
    skills: studentProfile.skills,
    isShortlisted: false,
  };

  // Ensure Aman is present in candidate pool
  const allCandidatesWithAman = [
    liveAmanCandidate,
    ...candidates.filter((c) => c.id !== studentProfile.id),
  ];

  // Calculate deterministic score for each candidate against activeJob
  interface RankedCandidate {
    candidate: Candidate;
    breakdown: MatchBreakdown;
  }

  const rankedCandidates: RankedCandidate[] = allCandidatesWithAman.map((c) => {
    const breakdown = calculateJobMatch(activeJob, c.skills);
    return {
      candidate: c,
      breakdown,
    };
  });

  // Sort descending by match score
  rankedCandidates.sort((a, b) => b.breakdown.score - a.breakdown.score);

  // Filter candidates
  const filteredCandidates = rankedCandidates.filter(({ candidate, breakdown }) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      candidate.college.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchCandidate.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'qualified') return breakdown.unlockedApply; // >= 75%
    if (filterTab === 'shortlisted') return candidate.isShortlisted;
    return true;
  });

  const totalQualifiedCount = rankedCandidates.filter((r) => r.breakdown.unlockedApply).length;
  const totalShortlistedCount = allCandidatesWithAman.filter((c) => c.isShortlisted).length;

  return (
    <div className="space-y-8">
      {/* 1. Recruiter KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Talent Pool</span>
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Users className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {allCandidatesWithAman.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Applicants</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            Empirically Assessed Candidates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Job Openings</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {jobs.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Positions</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-400 font-medium">
            100% Weight Validated
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Qualified Candidates</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {totalQualifiedCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">≥ 75% Match</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            Ready for Immediate Interview
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Shortlisted Pool</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Star className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
              {totalShortlistedCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">Candidates</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            Marked for Direct Outreach
          </p>
        </motion.div>
      </div>

      {/* 2. Opening Selector & Job Creator Trigger */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              Active Evaluation Target
            </span>
            <InfoButton
              title="Target Role Re-Ranking"
              description="Select any active opening to dynamically re-rank all candidate profiles according to that specific position's 100% weighted skill matrix."
              rationale="Permits recruiters to run instantaneous multi-role assessments on a single verified talent cohort."
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeJob.id === job.id
                    ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {job.title} ({job.company})
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsCreatorOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opening (100% Validator)</span>
        </button>
      </div>

      {/* 3. Candidate Feed Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            placeholder="Search candidate by name, university, or email..."
            aria-label="Search candidate by name, university, or email"
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterTab === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Ranked ({rankedCandidates.length})
          </button>
          <button
            onClick={() => setFilterTab('qualified')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterTab === 'qualified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Threshold ≥75% ({totalQualifiedCount})
          </button>
          <button
            onClick={() => setFilterTab('shortlisted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterTab === 'shortlisted'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shortlisted ({totalShortlistedCount})
          </button>
        </div>
      </div>

      {/* 4. Candidate Ranking Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Talent Leaderboard for {activeJob.title}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  ({filteredCandidates.length} evaluated)
                </span>
              </h2>
              <InfoButton
                title="Deterministic Talent Leaderboard"
                description="Applicants are ordered strictly by verified competence matches against the role's 100% skill requirements. No unexplainable LLM filtering or keyword stuffing."
                rationale="Gives hiring teams mathematical proof of candidate readiness before scheduling interviews."
                tip="Filter by 'Threshold ≥75%' to isolate interview-ready candidates immediately."
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly ranked by deterministic weighted formula: <code className="text-slate-300">Σ (Requirement Weight × Possession)</code>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> ≥ 75% Qualified
            <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> &lt; 75% Upskilling
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Candidates Match Filters</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Reset search or switch tab to "All Ranked".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCandidates.map(({ candidate, breakdown }, index) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                job={activeJob}
                breakdown={breakdown}
                rank={index + 1}
                onToggleShortlist={onToggleShortlist}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Job Creator Modal */}
      <JobCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSaveJob={onAddJob}
      />
    </div>
  );
};

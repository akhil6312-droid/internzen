import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Plus, 
  Star, 
  ShieldCheck, 
  Search,
  Clock,
  Send
} from 'lucide-react';
import { Job, Candidate, StudentProfile, MatchBreakdown, ThemeOption, RegisteredUser, UserAccount } from '../../types';
import { calculateJobMatch } from '../../engine/matching';
import { CandidateCard } from './CandidateCard';
import { JobCreatorModal } from './JobCreatorModal';
import { InfoButton } from '../common/InfoButton';
import { formatTimeAgo } from '../../utils/timeAgo';

interface RecruiterViewProps {
  jobs: Job[];
  candidates: Candidate[];
  studentProfile: StudentProfile;
  onAddJob: (newJob: Job) => void;
  onToggleShortlist: (candidateId: string) => void;
  currentTheme?: ThemeOption;
  isCreatorOpen?: boolean;
  onOpenCreator?: () => void;
  onCloseCreator?: () => void;
  currentUser?: RegisteredUser | UserAccount | null;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  jobs,
  candidates,
  studentProfile,
  onAddJob,
  onToggleShortlist,
  currentTheme,
  isCreatorOpen,
  onOpenCreator,
  onCloseCreator,
  currentUser,
}) => {
  const activeRecruiterEmail = currentUser?.email?.toLowerCase().trim();
  const activeRecruiterId = currentUser?.id;

  // Filter "My Posted Jobs" strictly by the active recruiter
  const myPostedJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (!activeRecruiterEmail && !activeRecruiterId) return false;
      const jobEmail = (job.recruiterEmail || (job as any).recruiter_email)?.toLowerCase().trim();
      const jobId = job.recruiterId || (job as any).user_id;
      return Boolean(
        (activeRecruiterEmail && jobEmail === activeRecruiterEmail) ||
        (activeRecruiterId && jobId === activeRecruiterId)
      );
    });
  }, [jobs, activeRecruiterEmail, activeRecruiterId]);

  const [selectedJobId, setSelectedJobId] = useState<string>(myPostedJobs[0]?.id || '');
  const [internalCreatorOpen, setInternalCreatorOpen] = useState(false);
  const showCreator = isCreatorOpen !== undefined ? isCreatorOpen : internalCreatorOpen;
  const handleOpenCreator = onOpenCreator || (() => setInternalCreatorOpen(true));
  const handleCloseCreator = onCloseCreator || (() => setInternalCreatorOpen(false));
  const [filterTab, setFilterTab] = useState<'all' | 'qualified' | 'shortlisted' | 'applied'>('all');
  const [searchCandidate, setSearchCandidate] = useState('');

  // Synchronize selectedJobId when myPostedJobs updates
  useEffect(() => {
    if (myPostedJobs.length > 0) {
      const exists = myPostedJobs.some((j) => j.id === selectedJobId);
      if (!exists) {
        setSelectedJobId(myPostedJobs[0].id);
      }
    } else {
      setSelectedJobId('');
    }
  }, [myPostedJobs, selectedJobId]);

  const isDark = currentTheme
    ? currentTheme !== 'light' && currentTheme !== 'modern-light'
    : typeof document !== 'undefined'
    ? !document.documentElement.classList.contains('light')
    : true;

  // The active job selected for candidate ranking
  const activeJob = myPostedJobs.find((j) => j.id === selectedJobId) || myPostedJobs[0] || null;

  const handleSaveJob = (newJob: Job) => {
    onAddJob(newJob);
    setSelectedJobId(newJob.id);
  };

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

  const rankedCandidates: RankedCandidate[] = activeJob
    ? allCandidatesWithAman.map((c) => {
        const breakdown = calculateJobMatch(activeJob, c.skills);
        return {
          candidate: c,
          breakdown,
        };
      })
    : [];

  // Sort descending by match score
  rankedCandidates.sort((a, b) => b.breakdown.score - a.breakdown.score);

  // Filter candidates
  const filteredCandidates = activeJob
    ? rankedCandidates.filter(({ candidate, breakdown }) => {
        const matchesSearch =
          candidate.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
          candidate.college.toLowerCase().includes(searchCandidate.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchCandidate.toLowerCase());

        if (!matchesSearch) return false;

        if (filterTab === 'applied') {
          const appliedEmails = new Set(
            (activeJob.appliedCandidates || []).map((ac) => ac.email.toLowerCase())
          );
          const isDirectlyApplied = 
            appliedEmails.has(candidate.email.toLowerCase()) ||
            (activeJob.appliedCandidates || []).some(
              (ac) => ac.name.toLowerCase() === candidate.name.toLowerCase()
            );
          return isDirectlyApplied;
        }

        if (filterTab === 'qualified') return breakdown.unlockedApply; // >= 75%
        if (filterTab === 'shortlisted') return candidate.isShortlisted;
        return true;
      })
    : [];

  const totalQualifiedCount = rankedCandidates.filter((r) => r.breakdown.unlockedApply).length;
  const totalShortlistedCount = allCandidatesWithAman.filter((c) => c.isShortlisted).length;
  const totalAppliedCount = activeJob
    ? activeJob.appliedCandidates?.length || activeJob.applicantCount || 0
    : 0;

  return (
    <div className="space-y-8">
      {/* 1. Recruiter KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Talent Pool</span>
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Users className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {allCandidatesWithAman.length}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Candidates</span>
          </div>
          <p className={`mt-1 text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Registered Student Talent
          </p>
        </motion.div>

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
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Job Openings</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {myPostedJobs.length}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Positions</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
            Published & Hiring
          </p>
        </motion.div>

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
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Qualified Candidates</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 tracking-tight">
              {totalQualifiedCount}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>≥ 75% Match</span>
          </div>
          <p className={`mt-1 text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ready to Interview
          </p>
        </motion.div>

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
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Shortlisted Pool</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Star className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 tracking-tight">
              {totalShortlistedCount}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Candidates</span>
          </div>
          <p className={`mt-1 text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Shortlisted for Interview
          </p>
        </motion.div>
      </div>

      {/* 2. Opening Selector & Job Creator Trigger */}
      {myPostedJobs.length === 0 ? (
        <div className={`p-8 sm:p-12 rounded-2xl text-center flex flex-col items-center justify-center transition-colors ${
          isDark
            ? 'bg-slate-900/90 border border-slate-800'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400 shadow-inner">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No Jobs Posted Yet
          </h3>
          <p className={`mt-2 text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            You have not published any internship listings yet. Start attracting candidates now!
          </p>
          <button
            onClick={handleOpenCreator}
            className="mt-6 flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all shrink-0 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post Your First Recruitment</span>
          </button>
        </div>
      ) : (
        <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-slate-900/90 border border-slate-800'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <div className="w-full">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                My Posted Jobs
              </span>
              <InfoButton
                title="Select Job Opening"
                description="Select any posted job to see candidates ranked by how closely their skills match that job's requirements."
                rationale="Allows recruiters to quickly evaluate candidates for each position."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {myPostedJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeJob?.id === job.id
                      ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20'
                      : isDark
                      ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {job.title} ({job.company})
                </button>
              ))}
            </div>

            {/* Active Job Meta Strip */}
            {activeJob && (
              <div className={`mt-3.5 pt-3 border-t flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ${
                isDark ? 'border-slate-800/80' : 'border-slate-200'
              }`}>
                <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Briefcase className={`w-3.5 h-3.5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                  <span>{activeJob.title}</span>
                </span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>at {activeJob.company}</span>
                <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden sm:inline`}>•</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-semibold">{activeJob.stipend}</span>
                <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden sm:inline`}>•</span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'} flex items-center gap-1`}>
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatTimeAgo(activeJob.createdAt)}</span>
                </span>
                <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden sm:inline`}>•</span>
                <div className="flex items-center gap-1.5 text-indigo-400 dark:text-indigo-300 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  <Users className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                  <span>👥 {activeJob.applicantCount ?? activeJob.appliedCandidates?.length ?? 0} Total Applicants</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleOpenCreator}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all shrink-0 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post New Job</span>
          </button>
        </div>
      )}

      {/* 3. Candidate Feed Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            placeholder="Search candidate by name, university, or email..."
            aria-label="Search candidate by name, university, or email"
            className={`w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl text-xs focus:outline-none focus:border-violet-500 transition-colors ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-400'
                : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
            }`}
          />
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-xl flex-wrap transition-colors ${
          isDark
            ? 'bg-slate-900 border border-slate-800'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Ranked ({rankedCandidates.length})
          </button>
          <button
            onClick={() => setFilterTab('qualified')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'qualified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Qualified (≥75%) ({totalQualifiedCount})
          </button>
          <button
            onClick={() => setFilterTab('applied')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              filterTab === 'applied'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>Applied ({totalAppliedCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('shortlisted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'shortlisted'
                ? 'bg-amber-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
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
              <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>{activeJob ? `Ranked Candidates for ${activeJob.title}` : 'Candidate Rankings'}</span>
                {activeJob && (
                  <span className={`text-xs font-normal font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ({filteredCandidates.length} evaluated)
                  </span>
                )}
              </h2>
              <InfoButton
                title="Candidate Ranking System"
                description="Candidates are ranked by how closely their verified skills match your job requirements."
                rationale="Clear, unbiased matching based directly on what skills the student has learned and verified."
                tip="Filter by 'Qualified (≥75%)' to view candidates ready for interview."
              />
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeJob
                ? 'Sorted by skill match score based on your required skills.'
                : 'Post a job opening to evaluate candidates against required skills and weights.'}
            </p>
          </div>

          {activeJob && (
            <div className={`hidden sm:flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> ≥ 75% Qualified
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> &lt; 75% Learning
            </div>
          )}
        </div>

        {!activeJob ? (
          <div className={`p-12 text-center rounded-2xl ${
            isDark
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200 shadow-sm'
          }`}>
            <Briefcase className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Awaiting Job Creation
            </h3>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Post an internship opening above to see candidates ranked and evaluated against your specific required skills.
            </p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl ${
            isDark
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200 shadow-sm'
          }`}>
            <Users className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Candidates Match Filters</h3>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Job Creator Modal */}
      <JobCreatorModal
        isOpen={showCreator}
        onClose={handleCloseCreator}
        onSaveJob={handleSaveJob}
        recruiterEmail={currentUser?.email || 'recruiter@internzen.com'}
        recruiterId={currentUser?.id}
      />
    </div>
  );
};

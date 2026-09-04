import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Briefcase, 
  Clock, 
  Banknote, 
  FileText, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight,
  Sparkles,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { ApplicationRecord } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';
import { InfoButton } from '../common/InfoButton';

interface AppliedCompaniesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationRecord[];
  onOpenJobDetails?: (jobId: string) => void;
  onWithdrawApplication?: (applicationId: string, jobId: string, company: string) => void;
}

export const AppliedCompaniesDrawer: React.FC<AppliedCompaniesDrawerProps> = ({
  isOpen,
  onClose,
  applications,
  onOpenJobDetails,
  onWithdrawApplication,
}) => {
  const [confirmingAppId, setConfirmingAppId] = useState<string | null>(null);

  if (!isOpen) return null;

  const statusMap = {
    under_review: {
      label: 'Under Review',
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: Clock,
    },
    shortlisted: {
      label: 'Shortlisted ⭐',
      bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      icon: Sparkles,
    },
    interview_scheduled: {
      label: 'Interview Scheduled 📅',
      bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: Calendar,
    },
    offer_extended: {
      label: 'Offer Extended 🏆',
      bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      icon: Award,
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Candidate Dashboard
              </span>
              <span className="text-xs text-slate-400">Application Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>My Applied Companies</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                  {applications.length} Active
                </span>
              </h2>
              <InfoButton
                title="Candidate Application Ledger"
                description="Your dispatched applications, tracked with deterministic readiness scores, uploaded verified credentials, and real-time recruitment progression states."
                rationale="Keeps an unalterable audit log of every role applied for and verified requirements."
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-base font-extrabold text-white">{applications.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Dispatched</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-base font-extrabold text-emerald-400">
              {applications.filter((a) => a.matchScore >= 75).length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">≥75% Readiness</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-base font-extrabold text-amber-400">
              {applications.filter((a) => a.status === 'interview_scheduled').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Interviews</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center bg-slate-950/50 rounded-2xl border border-slate-800 animate-in fade-in">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Applications Dispatched Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Explore internship opportunities, achieve $\ge 75\%$ match score, and use 1-Click Apply to dispatch your profile.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {applications.map((app) => {
                const statusInfo = statusMap[app.status] || statusMap.under_review;
                const StatusIcon = statusInfo.icon;
                const isConfirming = confirmingAppId === app.id;

                return (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.85, 
                      y: -20,
                      transition: { duration: 0.25, ease: 'easeInOut' } 
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3 relative overflow-hidden"
                  >
                    {/* Company & Role Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          logoType={app.logoType}
                          companyName={app.company}
                          brandColor={app.brandColor}
                          size="md"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {app.jobTitle}
                          </h4>
                          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{app.company}</span>
                            <span>•</span>
                            <span className="text-slate-400">{app.location}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${statusInfo.bg}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    {/* Compensation & Submission Timestamp */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-800/80">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Banknote className="w-3.5 h-3.5" />
                        <span>{app.stipend}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Applied: {app.appliedAt}</span>
                      </div>
                    </div>

                    {/* Submission Credentials Snapshot */}
                    <div className="p-3 bg-slate-900 rounded-xl space-y-2 border border-slate-800/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                          <span>Education:</span>
                        </span>
                        <span className="font-semibold text-white truncate max-w-[200px]">
                          {app.highestEducation}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Resume Attached:</span>
                        </span>
                        <span className="font-mono text-[11px] text-indigo-300 truncate max-w-[180px]">
                          {app.resumeFileName}
                        </span>
                      </div>

                      {app.certificateTitle && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Credential / Portfolio:</span>
                          </span>
                          <span className="text-[11px] text-amber-300 truncate max-w-[180px]">
                            {app.certificateTitle}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Verified Skills Cross-Check Badge List */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                        <span>Cross-Verified Match Snapshot</span>
                        <span className="text-emerald-400 font-bold">{app.matchScore}% Verified</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {app.verifiedSkills.map((sk, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            <span>{sk}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions & Withdrawal Controls */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      {isConfirming ? (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2"
                        >
                          <div className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Withdraw submission to {app.company}?</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            This will remove your submission from recruiter review. You can re-apply anytime from the dashboard.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                if (onWithdrawApplication) {
                                  onWithdrawApplication(app.id, app.jobId, app.company);
                                }
                                setConfirmingAppId(null);
                              }}
                              className="flex-1 py-2 px-3 min-h-[44px] rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Confirm Withdrawal</span>
                            </button>
                            <button
                              onClick={() => setConfirmingAppId(null)}
                              className="py-2 px-3.5 min-h-[44px] rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {onOpenJobDetails && (
                            <button
                              onClick={() => {
                                onOpenJobDetails(app.jobId);
                                onClose();
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 min-h-[44px] rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 transition-colors cursor-pointer active:scale-[0.98]"
                            >
                              <span>View Job Details</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onWithdrawApplication && (
                            <button
                              onClick={() => setConfirmingAppId(app.id)}
                              className="flex items-center justify-center gap-1.5 py-2 px-3.5 min-h-[44px] rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group"
                              title={`Withdraw application to ${app.company}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                              <span>Withdraw</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

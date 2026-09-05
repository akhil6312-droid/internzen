import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bell, 
  Mail, 
  GraduationCap, 
  CheckCheck,
  User,
  ExternalLink
} from 'lucide-react';
import { RecruiterNotification, JobApplicant } from '../../types';
import { formatTimeAgo } from '../../utils/timeAgo';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: RecruiterNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [selectedApplicant, setSelectedApplicant] = useState<{
    applicant: JobApplicant;
    jobTitle?: string;
  } | null>(null);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full relative z-10"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Recruiter Alerts
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500 text-white shadow-sm shadow-violet-500/30">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time applications from qualified candidates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 text-slate-400 hover:text-violet-300 rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Read All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Alerts Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-semibold text-slate-300">No applicant alerts yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                When candidates achieve ≥ 75% match and apply to your openings, their verified dossiers will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const applicant = notif.applicant;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    if (!notif.read) onMarkAsRead(notif.id);
                    if (applicant) {
                      setSelectedApplicant({ applicant, jobTitle: notif.jobTitle });
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                    notif.read
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      : 'bg-violet-950/20 border-violet-500/40 hover:border-violet-400 shadow-sm'
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 font-extrabold text-xs shrink-0 mt-0.5">
                      {applicant ? applicant.name.charAt(0).toUpperCase() : 'A'}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                          {applicant?.name || 'Candidate'}
                        </span>
                        {applicant && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {applicant.matchScore}% Match
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-snug">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[150px]">{applicant?.college || 'University'}</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {formatTimeAgo(notif.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Direct Candidate Outreach Modal Backdrop */}
        <AnimatePresence>
          {selectedApplicant && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 bg-slate-950 border-t border-slate-800 relative z-30"
            >
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Direct Candidate Dossier
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {selectedApplicant.applicant.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Applied for: <span className="text-violet-300 font-semibold">{selectedApplicant.jobTitle || 'Role'}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    College: <span className="text-slate-200">{selectedApplicant.applicant.college}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Candidate Email</span>
                    <span className="text-xs font-mono font-bold text-white truncate block">
                      {selectedApplicant.applicant.email}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {selectedApplicant.applicant.matchScore}% Score
                  </span>
                </div>

                <a
                  href={`mailto:${selectedApplicant.applicant.email}?subject=${encodeURIComponent(
                    `InternZen Interview Invitation: ${selectedApplicant.jobTitle || 'Internship'}`
                  )}&body=${encodeURIComponent(
                    `Hi ${selectedApplicant.applicant.name},\n\nWe reviewed your verified skills on InternZen with a ${selectedApplicant.applicant.matchScore}% match score and would like to invite you for an interview.\n\nBest regards,\nRecruiting Team`
                  )}`}
                  className="w-full min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email Outreach</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </div>
  );
};

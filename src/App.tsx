import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Job, 
  StudentProfile, 
  ToastMessage, 
  Candidate, 
  RegisteredUser,
  ApplicationRecord, 
  ThemeOption,
  SkillDomain,
  JobApplicant,
  RecruiterNotification
} from './types';
import { 
  INITIAL_STUDENT_PROFILE, 
  RECRUITER_CANDIDATES, 
  INITIAL_APPLICATIONS 
} from './data/seed';
import { calculateJobMatch } from './engine/matching';
import { Navbar } from './components/Navbar';
import { StudentView } from './components/student/StudentView';
import { RecruiterView } from './components/recruiter/RecruiterView';
import { LandingPage } from './components/landing/LandingPage';
import { ToastContainer } from './components/Toast';
import { fireConfetti } from './utils/confetti';
import { 
  initDatabase, 
  getSession, 
  logoutUser, 
  updateUserProgress,
  getAllJobs,
  addJob,
  recordJobApplication,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from './services/dbService';

// Code-split modals so they don't bloat the initial render bundle
const SkillMirrorModal = lazy(() =>
  import('./components/student/SkillMirrorModal').then((m) => ({ default: m.SkillMirrorModal }))
);
const AppliedCompaniesDrawer = lazy(() =>
  import('./components/student/AppliedCompaniesDrawer').then((m) => ({ default: m.AppliedCompaniesDrawer }))
);
const MultiSkillDrawer = lazy(() =>
  import('./components/student/MultiSkillDrawer').then((m) => ({ default: m.MultiSkillDrawer }))
);
const ApplyVerificationModal = lazy(() =>
  import('./components/student/ApplyVerificationModal').then((m) => ({ default: m.ApplyVerificationModal }))
);
const AuthModal = lazy(() =>
  import('./components/auth/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const ContactModal = lazy(() =>
  import('./components/common/ContactModal').then((m) => ({ default: m.ContactModal }))
);
const NotificationDrawer = lazy(() =>
  import('./components/recruiter/NotificationDrawer').then((m) => ({ default: m.NotificationDrawer }))
);

export default function App() {
  // Initialize persistent database on component mount
  const initialSession = useMemo(() => {
    initDatabase();
    return getSession();
  }, []);

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(() => {
    const saved = localStorage.getItem('internzen_theme') as ThemeOption;
    return saved || 'dark-slate';
  });

  // User Account State (Mandatory Auth Gate entry)
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(initialSession);

  const [currentMode, setCurrentMode] = useState<'student' | 'recruiter'>(
    currentUser?.role || 'student'
  );

  // Application Records State (backed by active user in persistent DB)
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    if (initialSession?.appliedJobs && Array.isArray(initialSession.appliedJobs)) {
      return initialSession.appliedJobs;
    }
    return INITIAL_APPLICATIONS;
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    if (initialSession?.profile) {
      return initialSession.profile;
    }
    return INITIAL_STUDENT_PROFILE;
  });

  const [jobs, setJobs] = useState<Job[]>(() => getAllJobs());
  const [candidates, setCandidates] = useState<Candidate[]>(RECRUITER_CANDIDATES);
  const [notifications, setNotifications] = useState<RecruiterNotification[]>(() => getNotifications());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Drawers States
  const [diagnosticJob, setDiagnosticJob] = useState<Job | null>(null);
  const [isApplicationsDrawerOpen, setIsApplicationsDrawerOpen] = useState(false);
  const [isMultiSkillDrawerOpen, setIsMultiSkillDrawerOpen] = useState(false);
  const [verificationModalJob, setVerificationModalJob] = useState<Job | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalRole, setAuthModalRole] = useState<'student' | 'recruiter'>('student');

  // Public Landing Page vs Core Dashboard View State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    return initialSession ? 'dashboard' : 'landing';
  });

  const handleMarkNotificationRead = (id: string) => {
    markNotificationRead(id);
    setNotifications(getNotifications());
  };

  const handleMarkAllNotificationsRead = () => {
    markAllNotificationsRead();
    setNotifications(getNotifications());
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Sync data-theme and light/dark classes on document root
  useEffect(() => {
    const isDark = currentTheme !== 'light' && currentTheme !== 'modern-light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('internzen_theme', currentTheme);
  }, [currentTheme]);

  // Session retention check on app load: bypasses landing page if active user session exists in localStorage
  useEffect(() => {
    const activeSession = getSession();
    if (activeSession) {
      setCurrentUser(activeSession);
      setCurrentMode(activeSession.role);
      setCurrentView('dashboard');
      if (activeSession.profile) {
        setStudentProfile(activeSession.profile);
      }
      if (activeSession.appliedJobs && Array.isArray(activeSession.appliedJobs)) {
        setApplications(activeSession.appliedJobs);
      }
    }
  }, []);

  // Sync mode with user role
  useEffect(() => {
    if (currentUser) {
      setCurrentMode(currentUser.role);
    }
  }, [currentUser]);

  // Toast Trigger Helper
  const addToast = (type: 'success' | 'info' | 'warning', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle Login / Registration Success
  const handleLoginSuccess = (user: RegisteredUser) => {
    setCurrentUser(user);
    setCurrentMode(user.role);
    setCurrentView('dashboard');

    if (user.role === 'student' && user.profile) {
      setStudentProfile(user.profile);
      if (user.appliedJobs) {
        setApplications(user.appliedJobs);
      }
    } else {
      if (user.profile) setStudentProfile(user.profile);
      if (user.appliedJobs) setApplications(user.appliedJobs);
    }

    setAuthModalOpen(false);

    addToast(
      'success',
      `Welcome, ${user.name}!`,
      `Successfully authenticated as ${user.role === 'student' ? 'Student Candidate' : 'Hiring Partner'}.`
    );
  };

  // Handle Logout (Clears session and returns to Landing Page)
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentView('landing');
    addToast('info', 'Logged Out', 'You have been signed out. Welcome back anytime.');
  };

  const handleOpenAuth = (
    mode: 'signin' | 'signup' = 'signin',
    role: 'student' | 'recruiter' = 'student'
  ) => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleExplorePortal = (persona: 'student' | 'recruiter') => {
    if (currentUser) {
      setCurrentMode(persona);
      setCurrentView('dashboard');
    } else {
      handleOpenAuth('signup', persona);
    }
  };

  // Toggle single skill possession with persistent database sync
  const handleToggleSkillLearned = (skillId: string, skillName: string) => {
    setStudentProfile((prev) => {
      const exists = prev.skills.find((s) => s.skillId === skillId);
      let updatedSkills = [...prev.skills];

      if (exists) {
        if (exists.proficiencyScore > 0) {
          updatedSkills = updatedSkills.map((s) =>
            s.skillId === skillId ? { ...s, proficiencyScore: 0, isVerified: false } : s
          );
          addToast('info', `${skillName} Unmarked`, `Removed ${skillName} from verified skills.`);
        } else {
          updatedSkills = updatedSkills.map((s) =>
            s.skillId === skillId ? { ...s, proficiencyScore: 1.0, isVerified: true } : s
          );
          addToast('success', `🎉 ${skillName} Verified!`, `Empirical requirement validated. Readiness increased.`);
        }
      } else {
        updatedSkills.push({
          skillId,
          skillName,
          isVerified: true,
          proficiencyScore: 1.0,
        });
        addToast('success', `🎉 ${skillName} Verified!`, `Skill added to verified profile.`);
      }

      const updatedProfile: StudentProfile = {
        ...prev,
        skills: updatedSkills,
      };

      // Sync progress to persistent client database
      if (currentUser) {
        updateUserProgress(currentUser.id, {
          verifiedSkills: updatedSkills,
          profile: updatedProfile,
        });
      }

      return updatedProfile;
    });
  };

  // Batch add skills from MultiSkillDrawer with persistent database sync
  const handleBatchAddSkills = (skillsToAdd: { id: string; name: string; domain?: SkillDomain }[]) => {
    setStudentProfile((prev) => {
      const existingMap = new Map(prev.skills.map((s) => [s.skillId, s]));

      skillsToAdd.forEach((sk) => {
        existingMap.set(sk.id, {
          skillId: sk.id,
          skillName: sk.name,
          domain: sk.domain,
          isVerified: true,
          proficiencyScore: 1.0,
        });
      });

      const updatedSkills = Array.from(existingMap.values());
      const updatedProfile: StudentProfile = {
        ...prev,
        skills: updatedSkills,
      };

      // Sync to persistent client database
      if (currentUser) {
        updateUserProgress(currentUser.id, {
          verifiedSkills: updatedSkills,
          profile: updatedProfile,
        });
      }

      return updatedProfile;
    });

    addToast(
      'success',
      `Added ${skillsToAdd.length} Competencies! 🚀`,
      `Your verified cross-disciplinary profile has been expanded. Readiness recalculated across all roles.`
    );
  };

  // Apply Trigger: Opens 2-step verification modal
  const handleApplyClick = (job: Job) => {
    const breakdown = calculateJobMatch(job, studentProfile.skills);
    if (!breakdown.unlockedApply) {
      addToast(
        'warning',
        'Placement Threshold Required',
        `You need at least 75% match to apply. Current match is ${breakdown.score}%. Use Skill Mirror to close the gap.`
      );
      return;
    }
    setVerificationModalJob(job);
  };

  // Final Application Submission from ApplyVerificationModal with persistent sync
  const handleSubmitVerifiedApplication = (appData: {
    highestEducation: string;
    specialization: string;
    resumeFileName: string;
    certificateTitle?: string;
  }) => {
    if (!verificationModalJob) return;

    const breakdown = calculateJobMatch(verificationModalJob, studentProfile.skills);

    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: verificationModalJob.id,
      jobTitle: verificationModalJob.title,
      company: verificationModalJob.company,
      stipend: verificationModalJob.stipend,
      location: verificationModalJob.location,
      brandColor: verificationModalJob.brandColor,
      logoType: verificationModalJob.logoType,
      appliedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'under_review',
      matchScore: breakdown.score,
      highestEducation: appData.highestEducation,
      specialization: appData.specialization,
      resumeFileName: appData.resumeFileName,
      certificateTitle: appData.certificateTitle,
      verifiedSkills: breakdown.matchedSkills.map((m) => `${m.skillName} (${m.contribution}%)`),
      missingSkills: breakdown.missingSkills.map((m) => `${m.skillName} (${m.gap}%)`),
    };

    const updatedApplications = [newRecord, ...applications];
    const updatedAppliedJobIds = Array.from(new Set([...studentProfile.appliedJobIds, verificationModalJob.id]));
    const updatedProfile: StudentProfile = {
      ...studentProfile,
      appliedJobIds: updatedAppliedJobIds,
    };

    setApplications(updatedApplications);
    setStudentProfile(updatedProfile);

    // Persist immediately in database
    if (currentUser) {
      updateUserProgress(currentUser.id, {
        appliedJobs: updatedApplications,
        profile: updatedProfile,
      });
    }

    // Closed-loop applicant record in global job directory and recruiter notification
    const applicantRecord: JobApplicant = {
      id: currentUser?.id || `cand-${Date.now()}`,
      name: currentUser?.name || studentProfile.name,
      email: currentUser?.email || 'student@internzen.com',
      college: studentProfile.college || currentUser?.university || 'Engineering Candidate',
      matchScore: breakdown.score,
      appliedAt: new Date().toISOString(),
      resumeFileName: appData.resumeFileName,
      highestEducation: appData.highestEducation,
      specialization: appData.specialization,
    };

    const dispatchResult = recordJobApplication(verificationModalJob.id, applicantRecord);
    if (dispatchResult.updatedJobs) {
      setJobs(dispatchResult.updatedJobs);
    }
    if (dispatchResult.notification) {
      setNotifications(getNotifications());
    }

    addToast(
      'success',
      `🚀 Dispatched to ${verificationModalJob.company}!`,
      `Application verified with ${breakdown.score}% match score. Track status in 'My Applications'.`
    );

    // Trigger celebration confetti twin-cannon animation
    fireConfetti('milestone');

    setVerificationModalJob(null);
  };

  // Handle Withdrawing an Application from My Applications Drawer with persistent sync
  const handleWithdrawApplication = (applicationId: string, jobId: string, company: string) => {
    const updated = applications.filter((app) => app.id !== applicationId);
    const updatedJobIds = studentProfile.appliedJobIds.filter((id) => id !== jobId);
    const updatedProfile: StudentProfile = { ...studentProfile, appliedJobIds: updatedJobIds };

    setApplications(updated);
    setStudentProfile(updatedProfile);

    // Persist in client database
    if (currentUser) {
      updateUserProgress(currentUser.id, {
        appliedJobs: updated,
        profile: updatedProfile,
      });
    }

    addToast(
      'info',
      'Application Withdrawn',
      `Your application to ${company} has been removed. You can re-apply anytime.`
    );
  };

  // Recruiter: Post new opening
  const handleAddJob = (newJob: Job) => {
    addJob(newJob);
    setJobs(getAllJobs());
    addToast(
      'success',
      'Opening Published Successfully',
      `"${newJob.title}" at ${newJob.company} is live with 100% validated skill weights.`
    );
  };

  // Recruiter: Toggle shortlist
  const handleToggleShortlist = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const nextState = !c.isShortlisted;
          if (nextState) {
            addToast('success', 'Candidate Shortlisted ⭐', `${c.name} moved to interview pipeline.`);
          } else {
            addToast('info', 'Shortlist Updated', `${c.name} removed from shortlist.`);
          }
          return { ...c, isShortlisted: nextState };
        }
        return c;
      })
    );
  };

  // Active diagnostic breakdown (memoized to avoid redundant calculations)
  const activeDiagnosticBreakdown = useMemo(() => {
    return diagnosticJob ? calculateJobMatch(diagnosticJob, studentProfile.skills) : null;
  }, [diagnosticJob, studentProfile.skills]);

  // Active verification breakdown (memoized to avoid redundant calculations)
  const activeVerificationBreakdown = useMemo(() => {
    return verificationModalJob ? calculateJobMatch(verificationModalJob, studentProfile.skills) : null;
  }, [verificationModalJob, studentProfile.skills]);

  // PUBLIC LANDING PAGE (LinkedIn / Linear Aesthetic Overview)
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative transition-colors duration-200">
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onExplorePortal={handleExplorePortal}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onOpenContact={() => setIsContactModalOpen(true)}
          currentUser={currentUser}
          jobs={jobs}
        />
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            initialMode={authModalMode}
            initialRole={authModalRole}
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />
        </Suspense>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // CORE PLACEMENT DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500/30 selection:text-white relative transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-emerald-600/10 blur-3xl rounded-full" />
      </div>

      {/* Sticky Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        studentProfile={studentProfile}
        currentUser={currentUser}
        applicationsCount={applications.length}
        onOpenApplicationsDrawer={() => setIsApplicationsDrawerOpen(true)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onReturnHome={() => setCurrentView('landing')}
      />

      {/* Main Vertically Scrollable Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Semantic Level 1 Heading for SEO & Screen-Reader Hierarchy */}
        <h1 className="sr-only">
          InternZen — Skill-First Internship & Placement Intelligence Platform
        </h1>

        <AnimatePresence mode="wait">
          {currentMode === 'student' ? (
            <motion.div
              key="student-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <StudentView
                studentProfile={studentProfile}
                jobs={jobs}
                onOpenDiagnostic={(job) => setDiagnosticJob(job)}
                onApply={handleApplyClick}
                onToggleSkill={handleToggleSkillLearned}
                onOpenMultiSkillDrawer={() => setIsMultiSkillDrawerOpen(true)}
                currentTheme={currentTheme}
              />
            </motion.div>
          ) : (
            <motion.div
              key="recruiter-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RecruiterView
                jobs={jobs}
                candidates={candidates}
                studentProfile={studentProfile}
                onAddJob={handleAddJob}
                onToggleShortlist={handleToggleShortlist}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Suspense Wrapper for Code-Split / Lazy-Loaded Interactive Modals */}
      <Suspense fallback={null}>
        {/* Skill Mirror Diagnostic Modal */}
        {diagnosticJob && activeDiagnosticBreakdown && (
          <SkillMirrorModal
            isOpen={Boolean(diagnosticJob)}
            onClose={() => setDiagnosticJob(null)}
            job={diagnosticJob}
            breakdown={activeDiagnosticBreakdown}
            studentSkills={studentProfile.skills}
            isApplied={studentProfile.appliedJobIds.includes(diagnosticJob.id)}
            onToggleSkillLearned={handleToggleSkillLearned}
            onApply={handleApplyClick}
          />
        )}

        {/* 2-Step Apply Verification Modal */}
        {verificationModalJob && activeVerificationBreakdown && (
          <ApplyVerificationModal
            isOpen={Boolean(verificationModalJob)}
            onClose={() => setVerificationModalJob(null)}
            job={verificationModalJob}
            breakdown={activeVerificationBreakdown}
            studentSkills={studentProfile.skills}
            onSubmitApplication={handleSubmitVerifiedApplication}
          />
        )}

        {/* Applied Companies Preview Slide-Over Drawer */}
        <AppliedCompaniesDrawer
          isOpen={isApplicationsDrawerOpen}
          onClose={() => setIsApplicationsDrawerOpen(false)}
          applications={applications}
          onOpenJobDetails={(jobId) => {
            const matched = jobs.find((j) => j.id === jobId);
            if (matched) setDiagnosticJob(matched);
          }}
          onWithdrawApplication={handleWithdrawApplication}
        />

        {/* 2-Step Multi-Skill Drawer (From user photo request) */}
        <MultiSkillDrawer
          isOpen={isMultiSkillDrawerOpen}
          onClose={() => setIsMultiSkillDrawerOpen(false)}
          currentSkills={studentProfile.skills}
          onAddSkills={handleBatchAddSkills}
        />

        {/* Auth Modal (Login / Sign Up) */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          initialRole={authModalRole}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Official Contact Modal */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        {/* Recruiter Notifications Drawer */}
        <NotificationDrawer
          isOpen={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationRead}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
        />
      </Suspense>

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">InternZen</span>
            <span>•</span>
            <span>Skill-First Placement & Career Intelligence</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Empirical Matching Engine: <code className="text-slate-400">Σ (Weight × Possession)</code></span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="text-violet-400 hover:text-violet-300 underline font-semibold transition-colors cursor-pointer"
            >
              Contact TEAM Zenith
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

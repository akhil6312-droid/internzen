import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Persona, 
  TargetRoleDiagnostic, 
  Candidate, 
  CurriculumGap, 
  JobOpening, 
  ToastMessage 
} from '../types';
import { 
  PERSONAS, 
  TARGET_ROLE_DIAGNOSTICS, 
  INITIAL_CANDIDATES, 
  INITIAL_CURRICULUM_GAPS, 
  INITIAL_JOB_OPENINGS 
} from '../data/mockData';

interface AppContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentPersona: Persona;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  
  // Student View State
  selectedTargetRoleId: string;
  targetRoleDiagnostic: TargetRoleDiagnostic;
  setSelectedTargetRoleId: (id: string) => void;
  availableTargetRoles: TargetRoleDiagnostic[];
  
  // Recruiter View State
  candidates: Candidate[];
  toggleShortlistCandidate: (candidateId: string) => void;
  selectedCandidateForReport: Candidate | null;
  setSelectedCandidateForReport: (candidate: Candidate | null) => void;
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;
  jobOpenings: JobOpening[];
  addNewJobOpening: (job: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => void;
  
  // TPO View State
  curriculumGaps: CurriculumGap[];
  triggerRemedialTraining: (gapId: string) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Role state
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('skillmatch_active_role');
    return (saved as UserRole) || 'student';
  });

  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');

  // Student diagnostic selection
  const [selectedTargetRoleId, setSelectedTargetRoleId] = useState<string>('phonepe-fullstack');
  const targetRoleDiagnostic = TARGET_ROLE_DIAGNOSTICS.find(r => r.id === selectedTargetRoleId) || TARGET_ROLE_DIAGNOSTICS[0];

  // Candidates state
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('skillmatch_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  // Modal states
  const [selectedCandidateForReport, setSelectedCandidateForReport] = useState<Candidate | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState<boolean>(false);

  // Job openings state
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('skillmatch_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOB_OPENINGS;
  });

  // Curriculum gaps state
  const [curriculumGaps, setCurriculumGaps] = useState<CurriculumGap[]>(() => {
    const saved = localStorage.getItem('skillmatch_gaps');
    return saved ? JSON.parse(saved) : INITIAL_CURRICULUM_GAPS;
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('skillmatch_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('skillmatch_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('skillmatch_jobs', JSON.stringify(jobOpenings));
  }, [jobOpenings]);

  useEffect(() => {
    localStorage.setItem('skillmatch_gaps', JSON.stringify(curriculumGaps));
  }, [curriculumGaps]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    setActiveNavTab('dashboard'); // Reset to main dashboard tab on role switch
    addToast(
      `Role Switched to ${PERSONAS[role].roleLabel}`,
      `Loaded perspective for ${PERSONAS[role].name} (${PERSONAS[role].departmentOrCompany})`,
      'info'
    );
  };

  const toggleShortlistCandidate = (candidateId: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        const nextState = !c.isShortlisted;
        addToast(
          nextState ? 'Candidate Shortlisted!' : 'Candidate Removed from Shortlist',
          `${c.name} (${c.matchScore}% Match) has been ${nextState ? 'added to' : 'removed from'} your review pipeline.`,
          nextState ? 'success' : 'info'
        );
        return { ...c, isShortlisted: nextState };
      }
      return c;
    }));
  };

  const addNewJobOpening = (job: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => {
    const newJob: JobOpening = {
      ...job,
      id: 'job-' + Date.now(),
      applicantsCount: 0,
      postedDate: 'Just now'
    };
    setJobOpenings(prev => [newJob, ...prev]);
    setIsPostJobModalOpen(false);
    addToast(
      'Internship Opening Published!',
      `"${job.title}" has been broadcast to all eligible students matching >70% criteria.`,
      'success'
    );
  };

  const triggerRemedialTraining = (gapId: string) => {
    setCurriculumGaps(prev => prev.map(gap => {
      if (gap.id === gapId) {
        const nextState = !gap.remedialScheduled;
        if (nextState) {
          addToast(
            'Remedial Intervention Dispatched',
            `Mandatory Industry Lab for "${gap.skillName}" queued for ${gap.affectedGroup}. Instructor notifications sent.`,
            'success'
          );
          return {
            ...gap,
            remedialScheduled: true,
            workshopTitle: `Departmental Accelerated Workshop: ${gap.skillName}`,
            scheduledDate: 'Next Saturday (10:00 AM IST)'
          };
        } else {
          addToast('Intervention Cancelled', `Remedial workshop for ${gap.skillName} has been unassigned.`, 'warning');
          return {
            ...gap,
            remedialScheduled: false,
            workshopTitle: undefined,
            scheduledDate: undefined
          };
        }
      }
      return gap;
    }));
  };

  const currentPersona = PERSONAS[activeRole] || PERSONAS.student;

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentPersona,
        activeNavTab,
        setActiveNavTab,
        selectedTargetRoleId,
        targetRoleDiagnostic,
        setSelectedTargetRoleId,
        availableTargetRoles: TARGET_ROLE_DIAGNOSTICS,
        candidates,
        toggleShortlistCandidate,
        selectedCandidateForReport,
        setSelectedCandidateForReport,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        jobOpenings,
        addNewJobOpening,
        curriculumGaps,
        triggerRemedialTraining,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

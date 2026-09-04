export type UserRole = 'student' | 'recruiter' | 'tpo';

export interface Persona {
  name: string;
  role: UserRole;
  roleLabel: string;
  title: string;
  departmentOrCompany: string;
  avatar: string;
  badgeColor: string;
}

export interface GapResource {
  id: string;
  type: 'video' | 'workshop' | 'cheatsheet';
  badgeLabel: string;
  title: string;
  provider: string;
  linkText: string;
  url: string;
}

export interface TargetRoleDiagnostic {
  id: string;
  roleTitle: string;
  company: string;
  companyLogoText: string;
  location: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  resources: GapResource[];
  unlockThreshold: number; // e.g., 80%
  skillsNeededCount: number; // e.g., 1
}

export interface ApplicationRecord {
  id: string;
  company: string;
  position: string;
  matchScore: number;
  dateApplied: string;
  status: 'Under Review' | 'Interview Scheduled' | 'Shortlisted' | 'Offer Extended';
  statusColor: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  batch: string;
  department: string;
  matchScore: number;
  githubVerified: boolean;
  githubHandle: string;
  codeAssessmentScore: number;
  cgpa: number;
  matchedSkills: string[];
  missingSkills: string[];
  isShortlisted: boolean;
  interviewStatus?: 'Scheduled' | 'Completed' | 'Pending';
}

export interface CurriculumGap {
  id: string;
  skillName: string;
  gapPercentage: number; // e.g. 68
  industryDemand: 'Critical' | 'High' | 'Moderate';
  affectedGroup: string;
  department: string;
  studentsCount: number;
  remedialScheduled: boolean;
  workshopTitle?: string;
  scheduledDate?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  stipend: string;
  location: string;
  requiredSkills: string[];
  applicantsCount: number;
  postedDate: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

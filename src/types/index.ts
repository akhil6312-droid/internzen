export type SkillDomain = 
  | 'software' 
  | 'mechanical' 
  | 'teaching' 
  | 'electrical' 
  | 'business' 
  | 'soft_skill';

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'tool' | 'soft_skill';
  domain: SkillDomain;
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
  isVerified: boolean;
  proficiencyScore: number; // 1.0 = present, 0.0 = absent
  domain?: SkillDomain;
}

export interface JobRequirement {
  skillId: string;
  skillName: string;
  weight: number; // Percentage integer; total must equal 100
  domain?: SkillDomain;
}

export interface LearningResource {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  type: 'youtube' | 'course' | 'pdf' | 'docs';
  platform: string;
  url: string;
  duration: string;
}

export interface JobApplicant {
  id: string;
  name: string;
  email: string;
  college: string;
  matchScore: number;
  appliedAt: string; // ISO string or formatted date
  resumeFileName?: string;
  highestEducation?: string;
  specialization?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  stipend: string;
  location: string;
  workMode?: 'Remote' | 'Hybrid' | 'Onsite' | string;
  description: string;
  requirements: JobRequirement[];
  domain: SkillDomain;
  logoType: string;
  brandColor: string;
  recruiterEmail?: string;
  recruiterId?: string;
  createdAt?: string; // ISO timestamp
  applicantCount?: number;
  appliedCandidates?: JobApplicant[];
}

export interface RecruiterNotification {
  id: string;
  targetRecruiterEmail?: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  jobId?: string;
  jobTitle?: string;
  applicant?: JobApplicant;
}

export interface MatchBreakdown {
  jobId: string;
  score: number; // 0 to 100
  matchedSkills: { skillName: string; weight: number; contribution: number }[];
  missingSkills: { skillName: string; weight: number; gap: number }[];
  unlockedApply: boolean; // true if score >= 75
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  specialization?: string;
  batch: string;
  skills: StudentSkill[];
  appliedJobIds: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  college: string;
  batch: string;
  skills: StudentSkill[];
  isShortlisted?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

export interface UserAccount {
  id: string;
  role: 'student' | 'recruiter';
  name: string;
  email: string;
  phone?: string;
  password?: string;
  college?: string;
  department?: string;
  targetRole?: string;
  specialization?: string;
  batch?: string;
  company?: string;
  designation?: string;
  skills?: StudentSkill[];
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'student' | 'recruiter';
  targetRole?: string;
  specialization?: string;
  university?: string;
  college?: string;
  department?: string;
  batch?: string;
  company?: string;
  designation?: string;
  profile: StudentProfile;
  appliedJobs: ApplicationRecord[];
  verifiedSkills: StudentSkill[];
  progress?: {
    readinessScore?: number;
    completedRemediations?: string[];
  };
}

export type ApplicationStatus = 
  | 'under_review' 
  | 'shortlisted' 
  | 'interview_scheduled' 
  | 'offer_extended';

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  stipend: string;
  location: string;
  brandColor: string;
  logoType: string;
  appliedAt: string;
  status: ApplicationStatus;
  matchScore: number;
  highestEducation: string;
  specialization: string;
  resumeFileName: string;
  certificateTitle?: string;
  verifiedSkills: string[];
  missingSkills: string[];
}

export type ThemeOption = 
  | 'dark'
  | 'light'
  | 'dark-slate' 
  | 'onyx-black' 
  | 'modern-light' 
  | 'emerald-forest';

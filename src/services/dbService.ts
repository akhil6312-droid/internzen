import { 
  RegisteredUser, 
  StudentProfile, 
  StudentSkill, 
  Job, 
  JobApplicant, 
  RecruiterNotification 
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_APPLICATIONS, 
  INITIAL_JOBS 
} from '../data/seed';

const USERS_KEY = 'internzen_registered_users';
const SESSION_KEY = 'internzen_active_user';
const JOBS_KEY = 'internzen_all_jobs';
const NOTIFICATIONS_KEY = 'internzen_notifications';

/**
 * Initializes the persistent client-side localStorage database if it doesn't already exist.
 * Seeds default demonstration accounts:
 * - Student: student@internzen.com / password123 (Aman Sharma)
 * - Recruiter: recruiter@internzen.com / password123 (HR Tech Corp)
 * - Retains demo shortcuts (aman.sharma@campus.edu, recruiter@technova.com).
 */
export function initDatabase(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed: RegisteredUser[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Migrate from legacy internzen_users if present
    const legacyRaw = localStorage.getItem('internzen_users');
    if (legacyRaw) {
      const legacyParsed: RegisteredUser[] = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
        localStorage.setItem(USERS_KEY, JSON.stringify(legacyParsed));
        return legacyParsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse internzen_registered_users from localStorage, re-initializing...', err);
  }

  // Default seed accounts
  const seedUsers: RegisteredUser[] = [
    {
      id: 'stu-internzen-01',
      name: 'Aman Sharma',
      email: 'student@internzen.com',
      password: 'password123',
      role: 'student',
      specialization: 'Full-Stack Web Development',
      targetRole: 'Full-Stack Web Development',
      university: 'Delhi Technological University',
      college: 'Delhi Technological University',
      department: 'Computer Science & Engineering',
      batch: 'Class of 2026',
      profile: {
        ...INITIAL_STUDENT_PROFILE,
        id: 'stu-internzen-01',
        name: 'Aman Sharma',
        email: 'student@internzen.com',
        specialization: 'Full-Stack Web Development',
      },
      appliedJobs: INITIAL_APPLICATIONS,
      verifiedSkills: INITIAL_STUDENT_PROFILE.skills,
      progress: {
        readinessScore: 85,
        completedRemediations: [],
      },
    },
    {
      id: 'rec-internzen-01',
      name: 'HR Tech Corp',
      email: 'recruiter@internzen.com',
      password: 'password123',
      role: 'recruiter',
      specialization: 'Technical Talent Acquisition',
      targetRole: 'Campus Hiring Partner',
      company: 'HR Tech Corp',
      designation: 'VP of Talent Acquisition',
      profile: {
        ...INITIAL_STUDENT_PROFILE,
        id: 'rec-internzen-01',
        name: 'HR Tech Corp',
        email: 'recruiter@internzen.com',
        college: 'HR Tech Corp',
      },
      appliedJobs: [],
      verifiedSkills: [],
      progress: {},
    },
    {
      id: 'stu-aman-01',
      name: 'Aman Sharma',
      email: 'aman.sharma@campus.edu',
      password: 'password123',
      role: 'student',
      specialization: 'Full-Stack Web Development',
      targetRole: 'Full Stack Web & AI/ML',
      university: 'Delhi Technological University',
      college: 'Delhi Technological University',
      department: 'Computer Science & Engineering',
      batch: 'Class of 2026',
      profile: INITIAL_STUDENT_PROFILE,
      appliedJobs: INITIAL_APPLICATIONS,
      verifiedSkills: INITIAL_STUDENT_PROFILE.skills,
      progress: {
        readinessScore: 85,
        completedRemediations: [],
      },
    },
    {
      id: 'rec-technova-01',
      name: 'TechNova Talent Lead',
      email: 'recruiter@technova.com',
      password: 'password123',
      role: 'recruiter',
      specialization: 'Enterprise Campus Hiring',
      targetRole: 'Campus Hiring Partner',
      company: 'TechNova',
      designation: 'Campus Hiring Director',
      profile: {
        ...INITIAL_STUDENT_PROFILE,
        id: 'rec-technova-01',
        name: 'TechNova Talent Lead',
        email: 'recruiter@technova.com',
        college: 'TechNova Inc.',
      },
      appliedJobs: [],
      verifiedSkills: [],
      progress: {},
    },
  ];

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  } catch (err) {
    console.error('Failed to write initial users to localStorage', err);
  }

  return seedUsers;
}

/**
 * Get all registered users from localStorage
 */
export function getUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return initDatabase();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initDatabase();
    }
    return parsed;
  } catch (err) {
    console.warn('Error reading users from localStorage', err);
    return initDatabase();
  }
}

/**
 * Save the entire users array to localStorage
 */
export function saveUsers(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

/**
 * Get active session user
 */
export function getSession(): RegisteredUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.id) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn('Error reading active session from localStorage', err);
    return null;
  }
}

/**
 * Save or clear the active session user
 */
export function saveSession(user: RegisteredUser | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (err) {
    console.error('Failed to update session in localStorage', err);
  }
}

/**
 * Register a new user with duplicate email prevention, immediate persistence, and auto-login
 */
export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'recruiter';
  targetRole?: string;
  specialization?: string;
  university?: string;
  college?: string;
  batch?: string;
  company?: string;
  designation?: string;
}): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getUsers();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Check duplicate email
  const existing = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in instead.',
    };
  }

  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const specialization = params.specialization?.trim() || params.targetRole?.trim() || (params.role === 'student' ? 'Full-Stack Web Development' : undefined);

  // Create initial student competencies
  const initialSkills: StudentSkill[] = [
    { skillId: 'sk-py', skillName: 'Python', isVerified: true, proficiencyScore: 1.0, domain: 'software' },
    { skillId: 'sk-git', skillName: 'Git', isVerified: true, proficiencyScore: 1.0, domain: 'software' },
    { skillId: 'sk-comm', skillName: 'Executive Communication', isVerified: true, proficiencyScore: 1.0, domain: 'soft_skill' },
  ];

  const profile: StudentProfile = {
    id: userId,
    name: params.name.trim(),
    email: normalizedEmail,
    college: params.university?.trim() || params.college?.trim() || params.company?.trim() || 'National Institute of Technology',
    department: specialization || 'Software Engineering',
    specialization,
    batch: params.batch?.trim() || 'Class of 2026',
    skills: initialSkills,
    appliedJobIds: [],
  };

  const newUser: RegisteredUser = {
    id: userId,
    name: params.name.trim(),
    email: normalizedEmail,
    password: params.password,
    role: params.role,
    specialization,
    targetRole: specialization,
    university: params.university?.trim() || params.college?.trim(),
    college: params.university?.trim() || params.college?.trim(),
    department: specialization || 'Software Engineering',
    batch: params.batch?.trim() || 'Class of 2026',
    company: params.company?.trim(),
    designation: params.designation?.trim(),
    profile,
    appliedJobs: [],
    verifiedSkills: initialSkills,
    progress: {
      readinessScore: 65,
      completedRemediations: [],
    },
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  saveSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Authenticate existing user with email and password fresh from localStorage
 */
export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password. Please sign up first.',
    };
  }

  saveSession(user);
  return { success: true, user };
}

/**
 * Clear the current session (removes active user only; leaves registered users intact)
 */
export function logoutUser(): void {
  saveSession(null);
}

/**
 * Update a user's skills, applications, or profile and immediately sync both internzen_users and internzen_session
 */
export function updateUserProgress(
  userId: string,
  updates: Partial<RegisteredUser>
): RegisteredUser | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  const updatedUser: RegisteredUser = {
    ...users[index],
    ...updates,
    profile: {
      ...users[index].profile,
      ...(updates.profile || {}),
      skills: updates.verifiedSkills || updates.profile?.skills || users[index].verifiedSkills,
    },
  };

  users[index] = updatedUser;
  saveUsers(users);

  // If this is the active session, sync it
  const active = getSession();
  if (active && active.id === userId) {
    saveSession(updatedUser);
  }

  return updatedUser;
}

/**
 * Initialize the persistent global jobs directory from localStorage ('internzen_all_jobs').
 * If missing, seeds the 15 companies with realistic timestamps, work modes, and applicant stats.
 */
export function initJobs(): Job[] {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (raw) {
      const parsed: Job[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse internzen_all_jobs from localStorage, re-initializing...', err);
  }

  const now = Date.now();
  const seedJobs: Job[] = INITIAL_JOBS.map((job, index) => {
    // Stagger timestamps across the past week
    const hoursAgo = (index + 1) * 6; // 6h, 12h, 18h, 24h, etc.
    const createdAt = new Date(now - hoursAgo * 3600 * 1000).toISOString();
    const applicantCount = 8 + (index * 3) % 25; // realistic counts between 8 and 32

    const workMode = job.location.toLowerCase().includes('remote')
      ? 'Remote'
      : job.location.toLowerCase().includes('hybrid')
      ? 'Hybrid'
      : 'Onsite';

    return {
      ...job,
      workMode,
      recruiterEmail: 'recruiter@internzen.com',
      recruiterId: 'rec-internzen-01',
      createdAt,
      applicantCount,
      appliedCandidates: [],
    };
  });

  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(seedJobs));
  } catch (err) {
    console.error('Failed to save initial jobs to localStorage', err);
  }

  return seedJobs;
}

/**
 * Get all jobs from the persistent global directory
 */
export function getAllJobs(): Job[] {
  return initJobs();
}

/**
 * Save all jobs to localStorage
 */
export function saveAllJobs(jobs: Job[]): void {
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to save jobs to localStorage', err);
  }
}

/**
 * Add a new job posted by a Recruiter to the global directory
 */
export function addJob(newJob: Job): Job[] {
  const jobs = getAllJobs();
  const updatedJobs = [newJob, ...jobs];
  saveAllJobs(updatedJobs);
  return updatedJobs;
}

/**
 * Record a student's application to a job:
 * - Increments job.applicantCount
 * - Appends student's mini-profile to job.appliedCandidates
 * - Dispatches a notification to internzen_notifications for the recruiter
 */
export function recordJobApplication(
  jobId: string,
  applicant: JobApplicant,
  targetRecruiterEmail?: string
): { updatedJobs: Job[]; notification: RecruiterNotification } {
  const jobs = getAllJobs();
  let targetJob = jobs.find((j) => j.id === jobId);

  const updatedJobs = jobs.map((job) => {
    if (job.id === jobId) {
      const candidates = job.appliedCandidates || [];
      const alreadyApplied = candidates.some((c) => c.id === applicant.id || c.email === applicant.email);
      const updatedCandidates = alreadyApplied ? candidates : [applicant, ...candidates];
      const applicantCount = alreadyApplied ? (job.applicantCount || candidates.length) : (job.applicantCount || 0) + 1;

      targetJob = {
        ...job,
        applicantCount,
        appliedCandidates: updatedCandidates,
      };
      return targetJob;
    }
    return job;
  });

  saveAllJobs(updatedJobs);

  // Generate Recruiter Notification
  const recruiterEmail = targetRecruiterEmail || targetJob?.recruiterEmail || 'recruiter@internzen.com';
  const roleTitle = targetJob?.title || 'Open Position';
  const companyName = targetJob?.company || 'Company';

  const notification: RecruiterNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    targetRecruiterEmail: recruiterEmail,
    title: 'New Application Received! 🎯',
    message: `${applicant.name} (Match Score: ${applicant.matchScore}%) applied for ${roleTitle} at ${companyName}.`,
    timestamp: new Date().toISOString(),
    read: false,
    jobId,
    jobTitle: roleTitle,
    applicant,
  };

  const currentNotifs = getNotifications();
  const updatedNotifs = [notification, ...currentNotifs];
  saveNotifications(updatedNotifs);

  return { updatedJobs, notification };
}

/**
 * Get all recruiter notifications from localStorage ('internzen_notifications')
 */
export function getNotifications(recruiterEmail?: string): RecruiterNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    const parsed: RecruiterNotification[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    if (recruiterEmail) {
      const normalized = recruiterEmail.trim().toLowerCase();
      return parsed.filter(
        (n) => !n.targetRecruiterEmail || n.targetRecruiterEmail.trim().toLowerCase() === normalized
      );
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to read notifications from localStorage', err);
    return [];
  }
}

/**
 * Save notifications list to localStorage
 */
export function saveNotifications(notifications: RecruiterNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications to localStorage', err);
  }
}

/**
 * Mark a single notification as read
 */
export function markNotificationRead(notificationId: string): RecruiterNotification[] {
  const notifs = getNotifications();
  const updated = notifs.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
  saveNotifications(updated);
  return updated;
}

/**
 * Mark all notifications as read for a recruiter
 */
export function markAllNotificationsRead(recruiterEmail?: string): RecruiterNotification[] {
  const notifs = getNotifications();
  const normalized = recruiterEmail ? recruiterEmail.trim().toLowerCase() : null;

  const updated = notifs.map((n) => {
    if (!normalized || !n.targetRecruiterEmail || n.targetRecruiterEmail.trim().toLowerCase() === normalized) {
      return { ...n, read: true };
    }
    return n;
  });

  saveNotifications(updated);
  return updated;
}

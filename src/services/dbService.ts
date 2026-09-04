import { RegisteredUser, StudentProfile, StudentSkill } from '../types';
import { INITIAL_STUDENT_PROFILE, INITIAL_APPLICATIONS } from '../data/seed';

const USERS_KEY = 'internzen_users';
const SESSION_KEY = 'internzen_session';

/**
 * Initializes the persistent client-side localStorage database if it doesn't already exist.
 * Seeds default demonstration accounts (Student: Aman Sharma, Recruiter: TechNova).
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
  } catch (err) {
    console.warn('Failed to parse internzen_users from localStorage, re-initializing...', err);
  }

  // Default seed accounts
  const seedUsers: RegisteredUser[] = [
    {
      id: 'stu-aman-01',
      name: 'Aman Sharma',
      email: 'aman.sharma@campus.edu',
      password: 'password123',
      role: 'student',
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
    return JSON.parse(raw);
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
    return JSON.parse(raw);
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
 * Register a new user with duplicate email prevention and auto-login
 */
export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'recruiter';
  targetRole?: string;
  university?: string;
  college?: string;
  batch?: string;
  company?: string;
  designation?: string;
}): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getUsers();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Check duplicate
  const existing = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in instead.',
    };
  }

  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Create customized student profile
  const initialSkills: StudentSkill[] = [
    { skillId: 'sk-py', skillName: 'Python', isVerified: true, proficiencyScore: 1.0, domain: 'software' },
    { skillId: 'sk-git', skillName: 'Git', isVerified: true, proficiencyScore: 1.0, domain: 'software' },
    { skillId: 'sk-comm', skillName: 'Executive Communication', isVerified: true, proficiencyScore: 1.0, domain: 'soft_skill' },
  ];

  const profile: StudentProfile = {
    id: userId,
    name: params.name.trim(),
    email: normalizedEmail,
    college: params.university?.trim() || params.company?.trim() || 'National Institute of Technology',
    department: params.targetRole?.trim() || 'Software Engineering',
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
    targetRole: params.targetRole?.trim(),
    university: params.university?.trim() || params.college?.trim(),
    college: params.university?.trim() || params.college?.trim(),
    department: params.targetRole?.trim(),
    batch: params.batch?.trim() || 'Class of 2026',
    company: params.company?.trim(),
    designation: params.designation?.trim(),
    profile,
    appliedJobs: [],
    verifiedSkills: initialSkills,
    progress: {
      readinessScore: 60,
      completedRemediations: [],
    },
  };

  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Authenticate existing user with email and password
 */
export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  if (!user) {
    return {
      success: false,
      error: 'User not found. No account is registered with this email.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      error: 'Invalid password credentials. Please verify and try again.',
    };
  }

  saveSession(user);
  return { success: true, user };
}

/**
 * Clear the current session
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

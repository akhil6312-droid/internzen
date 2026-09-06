import { createClient, User } from '@supabase/supabase-js';
import { Job, JobRequirement, SkillDomain, RegisteredUser, StudentProfile, StudentSkill } from '../types';
import { ALL_SKILLS } from '../data/seed';
import { getUsers, saveUsers, saveSession } from '../services/dbService';

export const SUPABASE_URL = 'https://sztcsztzgroxmsbyrvvs.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dGNzenR6Z3JveG1zYnlydnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MDA5MjEsImV4cCI6MjEwNDE3NjkyMX0.fJQohfU-VyDQ1lvEH-CbojeFWsaLWYmapLt-QN6KcTE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseJobRow {
  id: number | string;
  created_at: string;
  title: string;
  company: string;
  stipend: string;
  mode: string;
  skills: string | string[];
  recruiter_email: string;
  applicant_count?: number;
}

/**
 * Transforms a raw Supabase 'jobs' row into an InternZen 'Job' domain model
 * with deterministic 100% skill requirements, domain resolution, and brand styles.
 */
export function mapSupabaseRowToJob(row: SupabaseJobRow): Job {
  const skillList: string[] = Array.isArray(row.skills)
    ? row.skills
    : typeof row.skills === 'string'
    ? row.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const rawSkills = skillList.length > 0 ? skillList : ['General Competencies'];
  const count = rawSkills.length;
  const baseWeight = Math.floor(100 / count);
  const remainder = 100 - baseWeight * count;

  let inferredDomain: SkillDomain = 'software';

  const requirements: JobRequirement[] = rawSkills.map((name, index) => {
    const matched = ALL_SKILLS.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );

    const skillId = matched
      ? matched.id
      : `sk-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const domain = matched ? matched.domain : 'software';
    if (matched) {
      inferredDomain = matched.domain;
    }

    // Distribute weights so they deterministically sum to 100%
    const weight = index === 0 ? baseWeight + remainder : baseWeight;

    return {
      skillId,
      skillName: matched ? matched.name : name,
      weight,
      domain,
    };
  });

  const workMode = (row.mode as 'Remote' | 'Hybrid' | 'Onsite') || 'Hybrid';

  const brandColor =
    inferredDomain === 'software'
      ? '#8b5cf6'
      : inferredDomain === 'mechanical'
      ? '#0284c7'
      : inferredDomain === 'teaching'
      ? '#ea580c'
      : inferredDomain === 'electrical'
      ? '#dc2626'
      : '#0ea5e9';

  return {
    id: `sb-${row.id}`,
    title: row.title || 'Engineering Intern',
    company: row.company || 'Verified Employer',
    stipend: row.stipend || '₹25,000 / month',
    location: `${workMode} / India`,
    workMode,
    description: `Cloud-verified opening from ${row.company || 'hiring partner'} published via InternZen Cloud Registry.`,
    requirements,
    domain: inferredDomain,
    logoType: (row.company || 'tech').toLowerCase().replace(/\s+/g, ''),
    brandColor,
    recruiterEmail: row.recruiter_email ? row.recruiter_email.trim() : undefined,
    createdAt: row.created_at || new Date().toISOString(),
    applicantCount: Number(row.applicant_count) || 0,
    appliedCandidates: [],
  };
}

/**
 * Fetch all active jobs from the Supabase cloud table ordered by created_at descending.
 * Returns null if network error occurs or table is empty to trigger local fallback.
 */
export async function fetchCloudJobs(): Promise<Job[] | null> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, falling back to local storage:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return (data as SupabaseJobRow[]).map(mapSupabaseRowToJob);
  } catch (err) {
    console.warn('Network exception while fetching Supabase jobs, using local fallback:', err);
    return null;
  }
}

/**
 * Insert a newly created job opening into the Supabase 'jobs' table.
 */
export async function insertCloudJob(params: {
  title: string;
  company: string;
  stipend: string;
  mode?: string;
  skills: string | string[];
  recruiter_email: string;
  applicant_count?: number;
}) {
  const row = {
    title: params.title,
    company: params.company,
    stipend: params.stipend,
    mode: params.mode || 'Hybrid',
    skills: Array.isArray(params.skills) ? params.skills.join(', ') : params.skills,
    recruiter_email: params.recruiter_email || 'recruiter@internzen.com',
    applicant_count: params.applicant_count ?? 0,
  };

  return await supabase.from('jobs').insert([row]).select();
}

/**
 * Maps a Supabase Auth User object into the InternZen RegisteredUser domain model.
 * Preserves user metadata (name, role, college, specialization, company, designation, batch)
 * and synchronizes with local storage for instant offline capability and matching engine integration.
 */
export function mapSupabaseUserToRegisteredUser(user: User): RegisteredUser {
  const users = getUsers();
  const email = (user.email || '').trim().toLowerCase();
  const metadata = (user.user_metadata || {}) as Record<string, any>;

  // Check if this user exists in localStorage
  const existing = users.find(
    (u) => u.email.trim().toLowerCase() === email || u.id === user.id
  );

  const role: 'student' | 'recruiter' =
    metadata.role === 'recruiter'
      ? 'recruiter'
      : existing?.role || 'student';

  const name =
    metadata.name ||
    metadata.full_name ||
    existing?.name ||
    (email ? email.split('@')[0] : 'InternZen User');

  const college =
    metadata.college ||
    metadata.university ||
    existing?.college ||
    existing?.university ||
    (role === 'student' ? 'Delhi Technological University' : undefined);

  const company =
    metadata.company ||
    existing?.company ||
    (role === 'recruiter' ? 'Tech Innovators Corp' : undefined);

  const designation =
    metadata.designation ||
    existing?.designation ||
    (role === 'recruiter' ? 'Talent Acquisition Lead' : undefined);

  const specialization =
    metadata.specialization ||
    metadata.targetRole ||
    existing?.specialization ||
    (role === 'student' ? 'Full-Stack Web Development' : undefined);

  const batch = metadata.batch || existing?.batch || 'Class of 2026';

  const defaultSkills: StudentSkill[] = [
    { skillId: 'sk-py', skillName: 'Python', isVerified: true, proficiencyScore: 1.0, domain: 'software' },
    { skillId: 'sk-git', skillName: 'Git', isVerified: true, proficiencyScore: 1.0, domain: 'software' },
    { skillId: 'sk-comm', skillName: 'Executive Communication', isVerified: true, proficiencyScore: 1.0, domain: 'soft_skill' },
  ];

  const profile: StudentProfile = existing?.profile || {
    id: user.id,
    name,
    email,
    college: college || company || 'Delhi Technological University',
    department: specialization || 'Computer Science & Engineering',
    specialization,
    batch,
    skills: defaultSkills,
    appliedJobIds: [],
  };

  const registeredUser: RegisteredUser = {
    id: user.id,
    name,
    email,
    password: '●●●●●●', // Managed securely by Supabase Cloud Auth
    role,
    specialization,
    targetRole: specialization,
    university: college,
    college,
    department: specialization || 'Computer Science & Engineering',
    batch,
    company,
    designation,
    profile,
    appliedJobs: existing?.appliedJobs || [],
    verifiedSkills: existing?.verifiedSkills || profile.skills || defaultSkills,
    progress: existing?.progress || {
      readinessScore: 75,
      completedRemediations: [],
    },
  };

  // Synchronize with local storage database so matching engine and profile remain active
  const existingIndex = users.findIndex(
    (u) => u.email.trim().toLowerCase() === email || u.id === user.id
  );
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...registeredUser };
    saveUsers(users);
  } else {
    saveUsers([...users, registeredUser]);
  }
  saveSession(registeredUser);

  return registeredUser;
}


import { 
  Persona, 
  TargetRoleDiagnostic, 
  ApplicationRecord, 
  Candidate, 
  CurriculumGap, 
  JobOpening 
} from '../types';

export const PERSONAS: Record<string, Persona> = {
  student: {
    name: 'Aarav Sharma',
    role: 'student',
    roleLabel: 'Student View',
    title: 'Pre-final Year (B.Tech CS)',
    departmentOrCompany: 'Dept. of Computer Science & Eng.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  recruiter: {
    name: 'Priya Nair',
    role: 'recruiter',
    roleLabel: 'Recruiter View',
    title: 'Senior Technical Talent Lead',
    departmentOrCompany: 'PhonePe Campus Hiring',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
  },
  tpo: {
    name: 'Dr. K. Venkat',
    role: 'tpo',
    roleLabel: 'College TPO View',
    title: 'Dean of Corporate Relations & TPO',
    departmentOrCompany: 'Vellore Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  }
};

export const TARGET_ROLE_DIAGNOSTICS: TargetRoleDiagnostic[] = [
  {
    id: 'phonepe-fullstack',
    roleTitle: 'Full-Stack Web Intern @ PhonePe',
    company: 'PhonePe',
    companyLogoText: 'PP',
    location: 'Bangalore (Hybrid)',
    matchScore: 74,
    matchedSkills: ['React', 'Node.js', 'REST APIs', 'Git', 'Tailwind CSS'],
    missingSkills: ['Docker', 'PostgreSQL indexing', 'Redis caching'],
    resources: [
      {
        id: 'res-1',
        type: 'video',
        badgeLabel: 'Free Video',
        title: 'PostgreSQL Indexing & Optimization in 45 Mins',
        provider: 'FreeCodeCamp',
        linkText: 'FreeCodeCamp link badge',
        url: 'https://freecodecamp.org'
      },
      {
        id: 'res-2',
        type: 'workshop',
        badgeLabel: 'Campus Event',
        title: 'Weekend Docker Hands-On Lab',
        provider: 'Organized by College CS Dept',
        linkText: 'Register for Lab (Nov 15)',
        url: '#'
      },
      {
        id: 'res-3',
        type: 'cheatsheet',
        badgeLabel: 'Doc / Cheat Sheet',
        title: 'Redis Caching Patterns & Invalidation PDF',
        provider: 'SkillMatch Knowledge Base',
        linkText: 'Download Direct PDF',
        url: '#'
      }
    ],
    unlockThreshold: 80,
    skillsNeededCount: 1
  },
  {
    id: 'zerodha-backend',
    roleTitle: 'Backend Engineering Intern @ Zerodha',
    company: 'Zerodha',
    companyLogoText: 'ZD',
    location: 'Bangalore (On-site)',
    matchScore: 88,
    matchedSkills: ['Node.js', 'REST APIs', 'Git', 'PostgreSQL indexing', 'Linux CLI'],
    missingSkills: ['Go Microservices', 'Kafka Event Streaming'],
    resources: [
      {
        id: 'res-4',
        type: 'video',
        badgeLabel: 'Free Video',
        title: 'Go (Golang) Microservices Crash Course for High Throughput',
        provider: 'YouTube Tech Series',
        linkText: 'Watch Video (1h 10m)',
        url: '#'
      },
      {
        id: 'res-5',
        type: 'cheatsheet',
        badgeLabel: 'Doc / Cheat Sheet',
        title: 'Apache Kafka Architecture & Partitioning Cheatsheet',
        provider: 'Confluent Community',
        linkText: 'View Guide',
        url: '#'
      }
    ],
    unlockThreshold: 80,
    skillsNeededCount: 0
  },
  {
    id: 'swiggy-frontend',
    roleTitle: 'Frontend UI/UX Intern @ Swiggy',
    company: 'Swiggy',
    companyLogoText: 'SW',
    location: 'Remote',
    matchScore: 92,
    matchedSkills: ['React', 'Tailwind CSS', 'TypeScript', 'Git', 'Figma to Code', 'REST APIs'],
    missingSkills: ['Next.js SSR', 'Core Web Vitals'],
    resources: [
      {
        id: 'res-6',
        type: 'video',
        badgeLabel: 'Free Video',
        title: 'Next.js App Router & Performance Optimization',
        provider: 'Vercel Academy',
        linkText: 'Free Course',
        url: '#'
      }
    ],
    unlockThreshold: 80,
    skillsNeededCount: 0
  }
];

export const ACTIVE_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    company: 'PhonePe',
    position: 'Full-Stack Web Intern',
    matchScore: 74,
    dateApplied: '2026-10-12',
    status: 'Interview Scheduled',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'app-2',
    company: 'Razorpay',
    position: 'Backend Platform Intern',
    matchScore: 85,
    dateApplied: '2026-10-10',
    status: 'Under Review',
    statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  {
    id: 'app-3',
    company: 'CRED',
    position: 'Frontend Systems Intern',
    matchScore: 91,
    dateApplied: '2026-10-04',
    status: 'Shortlisted',
    statusColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
  },
  {
    id: 'app-4',
    company: 'Atlassian',
    position: 'Associate Developer Intern',
    matchScore: 68,
    dateApplied: '2026-09-28',
    status: 'Under Review',
    statusColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    batch: 'Batch 2026',
    department: 'Computer Science & Engineering',
    matchScore: 94,
    githubVerified: true,
    githubHandle: 'aarav-sharma-dev',
    codeAssessmentScore: 96,
    cgpa: 8.92,
    matchedSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS'],
    missingSkills: ['Redis caching'],
    isShortlisted: true
  },
  {
    id: 'cand-2',
    name: 'Tanya Sen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    batch: 'Batch 2026',
    department: 'Information Technology',
    matchScore: 88,
    githubVerified: true,
    githubHandle: 'tanya-builds',
    codeAssessmentScore: 91,
    cgpa: 8.75,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git'],
    missingSkills: ['Docker', 'PostgreSQL indexing'],
    isShortlisted: false
  },
  {
    id: 'cand-3',
    name: 'Rohan Varma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    batch: 'Batch 2025',
    department: 'Computer Science & Engineering',
    matchScore: 82,
    githubVerified: true,
    githubHandle: 'rohan-v-cloud',
    codeAssessmentScore: 84,
    cgpa: 8.41,
    matchedSkills: ['Node.js', 'Docker', 'PostgreSQL', 'Linux CLI'],
    missingSkills: ['React', 'Tailwind CSS'],
    isShortlisted: false
  },
  {
    id: 'cand-4',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    batch: 'Batch 2026',
    department: 'AI & Data Science',
    matchScore: 79,
    githubVerified: true,
    githubHandle: 'ananya-ai',
    codeAssessmentScore: 82,
    cgpa: 9.15,
    matchedSkills: ['Python', 'SQL', 'Git', 'REST APIs'],
    missingSkills: ['Docker', 'Node.js', 'Redis'],
    isShortlisted: false
  },
  {
    id: 'cand-5',
    name: 'Devansh Roy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    batch: 'Batch 2025',
    department: 'Electronics & Communication',
    matchScore: 76,
    githubVerified: false,
    githubHandle: 'devansh-embedded',
    codeAssessmentScore: 78,
    cgpa: 8.12,
    matchedSkills: ['C++', 'Linux', 'Git', 'Python'],
    missingSkills: ['React', 'Node.js', 'PostgreSQL'],
    isShortlisted: false
  },
  {
    id: 'cand-6',
    name: 'Meera Patel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    batch: 'Batch 2026',
    department: 'Computer Science & Engineering',
    matchScore: 73,
    githubVerified: true,
    githubHandle: 'meera-codes',
    codeAssessmentScore: 75,
    cgpa: 8.33,
    matchedSkills: ['React', 'HTML/CSS', 'JavaScript', 'Git'],
    missingSkills: ['Node.js', 'Docker', 'PostgreSQL'],
    isShortlisted: false
  }
];

export const INITIAL_CURRICULUM_GAPS: CurriculumGap[] = [
  {
    id: 'gap-cloud',
    skillName: 'Cloud Deployments & Kubernetes',
    gapPercentage: 68,
    industryDemand: 'Critical',
    affectedGroup: '3rd Year Students (Batch 2026)',
    department: 'Computer Science & Engineering',
    studentsCount: 342,
    remedialScheduled: false
  },
  {
    id: 'gap-sysdesign',
    skillName: 'System Design & High-Scale Architecture',
    gapPercentage: 54,
    industryDemand: 'Critical',
    affectedGroup: 'Final Year Students (Batch 2025)',
    department: 'Information Technology',
    studentsCount: 280,
    remedialScheduled: false
  },
  {
    id: 'gap-caching',
    skillName: 'Distributed Caching (Redis/Memcached)',
    gapPercentage: 46,
    industryDemand: 'High',
    affectedGroup: '3rd Year Students (Batch 2026)',
    department: 'Computer Science & Engineering',
    studentsCount: 215,
    remedialScheduled: true,
    workshopTitle: 'Hands-On Redis Masterclass by AWS Architects',
    scheduledDate: 'Nov 18, 2026'
  },
  {
    id: 'gap-cicd',
    skillName: 'CI/CD Pipelines & Automated Testing',
    gapPercentage: 42,
    industryDemand: 'High',
    affectedGroup: '3rd Year Students (Batch 2026)',
    department: 'AI & Data Science',
    studentsCount: 198,
    remedialScheduled: false
  },
  {
    id: 'gap-db-indexing',
    skillName: 'Production PostgreSQL Indexing & Explain Plans',
    gapPercentage: 38,
    industryDemand: 'Moderate',
    affectedGroup: '2nd & 3rd Year Students',
    department: 'Information Technology',
    studentsCount: 164,
    remedialScheduled: false
  }
];

export const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Full-Stack Web Intern',
    company: 'PhonePe',
    stipend: '₹45,000 / month',
    location: 'Bangalore (Hybrid)',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
    applicantsCount: 68,
    postedDate: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'Backend Platform Engineer Intern',
    company: 'PhonePe',
    stipend: '₹50,000 / month',
    location: 'Bangalore (On-site)',
    requiredSkills: ['Golang', 'Java', 'Distributed Systems', 'Kafka'],
    applicantsCount: 42,
    postedDate: '5 days ago'
  },
  {
    id: 'job-3',
    title: 'Security & Infrastructure Intern',
    company: 'PhonePe',
    stipend: '₹40,000 / month',
    location: 'Bangalore (Hybrid)',
    requiredSkills: ['Linux', 'Kubernetes', 'Python', 'AWS'],
    applicantsCount: 29,
    postedDate: '1 week ago'
  }
];

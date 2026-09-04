import { StudentSkill, JobRequirement, MatchBreakdown, Job } from '../types';

/**
 * Deterministic, explainable scoring function without black-box calculations.
 * Formula: Match Score = Σ (Requirement Weight × Possession Score)
 * - Possession Score = 1.0 if student has the skill, else 0.0
 * - Unlocked Apply threshold = 75%
 */
export function calculateMatch(
  studentSkills: StudentSkill[], 
  requirements: JobRequirement[]
): MatchBreakdown {
  let totalScore = 0;
  const matchedSkills: { skillName: string; weight: number; contribution: number }[] = [];
  const missingSkills: { skillName: string; weight: number; gap: number }[] = [];

  const studentSkillSet = new Set(
    studentSkills
      .filter(s => s.proficiencyScore > 0)
      .map(s => s.skillId)
  );

  requirements.forEach(req => {
    if (studentSkillSet.has(req.skillId)) {
      totalScore += req.weight;
      matchedSkills.push({ skillName: req.skillName, weight: req.weight, contribution: req.weight });
    } else {
      missingSkills.push({ skillName: req.skillName, weight: req.weight, gap: req.weight });
    }
  });

  const clampedScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  return {
    jobId: '',
    score: clampedScore,
    matchedSkills,
    missingSkills,
    unlockedApply: clampedScore >= 75
  };
}

/**
 * Convenience wrapper linking the match calculation to a specific job ID.
 */
export function calculateJobMatch(
  job: Job,
  studentSkills: StudentSkill[]
): MatchBreakdown {
  const result = calculateMatch(studentSkills, job.requirements);
  return {
    ...result,
    jobId: job.id,
  };
}

/**
 * Validates that the sum of requirements weights equals exactly 100%.
 */
export function validateRequirementsTotal(requirements: JobRequirement[]): {
  isValid: boolean;
  total: number;
  difference: number;
} {
  const total = requirements.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);
  return {
    isValid: total === 100,
    total,
    difference: 100 - total,
  };
}

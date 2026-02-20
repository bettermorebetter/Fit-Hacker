export type SkillCategory = "technical" | "soft" | "domain";
export type FitLevel = "Excellent" | "Good" | "Fair" | "Poor";
export type GapImportance = "critical" | "important" | "nice-to-have";

export interface Skill {
  name: string;
  /** 0–10: how strongly the JD demands this skill */
  required: number;
  /** 0–10: candidate proficiency inferred from resume */
  candidate: number;
  category: SkillCategory;
}

export interface Strength {
  title: string;
  description: string;
  evidence: string;
}

export interface Gap {
  skill: string;
  importance: GapImportance;
  /** First-person interview talking point to address this gap */
  defenseScript: string;
  /** Specific resources or steps to acquire this skill */
  learningPath: string;
}

export interface FitAnalysis {
  /** Integer 0–100 overall match score */
  overallScore: number;
  fitLevel: FitLevel;
  /** 2–3 sentence high-level analysis */
  summary: string;
  /** Actionable next-step recommendation */
  recommendation: string;
  /** 6–10 skills from JD mapped to candidate proficiency */
  skills: Skill[];
  /** 3–5 standout strengths */
  strengths: Strength[];
  /** All significant gaps (required – candidate ≥ 2) */
  gaps: Gap[];
}

export interface AnalyzeRequest {
  resume: string;
  jobDescription: string;
}

export interface AnalyzeError {
  error: string;
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FitAnalysis } from "@/types/analysis";

const SYSTEM_PROMPT = `You are an expert resume analyst and senior career coach. Analyze the candidate's resume against the provided job description with surgical precision.

Return ONLY a valid JSON object — no markdown fences, no explanation, no preamble. The JSON must conform exactly to this TypeScript interface:

{
  "overallScore": <integer 0-100>,
  "fitLevel": <"Excellent" | "Good" | "Fair" | "Poor">,
  "summary": <string: 2-3 sentence analysis of overall match>,
  "recommendation": <string: one clear actionable recommendation for the candidate>,
  "skills": [
    {
      "name": <string: skill name>,
      "required": <integer 0-10: how critical the JD requires this skill>,
      "candidate": <integer 0-10: candidate's demonstrated proficiency from resume>,
      "category": <"technical" | "soft" | "domain">
    }
  ],
  "strengths": [
    {
      "title": <string: short strength title>,
      "description": <string: 1-2 sentences explaining why this is a strength>,
      "evidence": <string: direct quote or specific reference from the resume>
    }
  ],
  "gaps": [
    {
      "skill": <string: skill or quality that is missing or weak>,
      "importance": <"critical" | "important" | "nice-to-have">,
      "defenseScript": <string: 2-3 sentences written in FIRST PERSON that the candidate can say in an interview to address this gap confidently and honestly>,
      "learningPath": <string: specific resources, courses, or concrete steps to close this gap>
    }
  ]
}

RULES:
- skills array: include 7-10 skills. Mix technical, soft, and domain knowledge skills from the JD.
- strengths array: include exactly 3-5 strengths supported by evidence from the resume.
- gaps array: include every skill where (required - candidate) >= 2, ordered by importance.
- defenseScript must be written as if the candidate is speaking (first person "I...").
- Be specific and evidence-based. Avoid generic statements.
- fitLevel mapping: 80-100 = Excellent, 60-79 = Good, 40-59 = Fair, 0-39 = Poor.`;

export async function analyzeResume(
  resume: string,
  jobDescription: string
): Promise<FitAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      maxOutputTokens: 4096,
    },
  });

  const userMessage = `${SYSTEM_PROMPT}

--- RESUME ---
${resume.trim()}

--- JOB DESCRIPTION ---
${jobDescription.trim()}`;

  const result = await model.generateContent(userMessage);
  const rawText = result.response.text();

  // Strip markdown code fences if Gemini wraps the JSON anyway
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  let parsed: FitAnalysis;
  try {
    parsed = JSON.parse(jsonText) as FitAnalysis;
  } catch {
    throw new Error(
      `Failed to parse Gemini response as JSON. Raw output: ${rawText.slice(0, 300)}`
    );
  }

  // Clamp score to valid range
  parsed.overallScore = Math.max(0, Math.min(100, Math.round(parsed.overallScore)));

  return parsed;
}

// Edge runtime — compatible with Cloudflare Pages via @cloudflare/next-on-pages
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/gemini";
import type { AnalyzeRequest, AnalyzeError } from "@/types/analysis";

const MAX_RESUME_CHARS = 12_000;
const MAX_JD_CHARS = 6_000;

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;

  try {
    body = (await req.json()) as AnalyzeRequest;
  } catch {
    return NextResponse.json<AnalyzeError>(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { resume, jobDescription } = body;

  if (!resume?.trim() || !jobDescription?.trim()) {
    return NextResponse.json<AnalyzeError>(
      { error: "Both resume and job description are required." },
      { status: 400 }
    );
  }

  if (resume.length > MAX_RESUME_CHARS) {
    return NextResponse.json<AnalyzeError>(
      { error: `Resume exceeds ${MAX_RESUME_CHARS.toLocaleString()} character limit.` },
      { status: 400 }
    );
  }

  if (jobDescription.length > MAX_JD_CHARS) {
    return NextResponse.json<AnalyzeError>(
      { error: `Job description exceeds ${MAX_JD_CHARS.toLocaleString()} character limit.` },
      { status: 400 }
    );
  }

  try {
    const analysis = await analyzeResume(resume, jobDescription);
    return NextResponse.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed.";
    console.error("[/api/analyze] Error:", message);

    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json<AnalyzeError>(
        { error: "API key not configured. Set GEMINI_API_KEY in your environment." },
        { status: 503 }
      );
    }

    return NextResponse.json<AnalyzeError>(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

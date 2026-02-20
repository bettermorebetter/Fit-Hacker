"use client";

import { useState } from "react";
import type { FitAnalysis, AnalyzeError } from "@/types/analysis";

const RESUME_PLACEHOLDER = `Paste your resume here…

Example:
John Doe | john@example.com | linkedin.com/in/johndoe

EXPERIENCE
Senior Software Engineer — Acme Corp (2021–Present)
• Led migration of monolithic Rails app to microservices (Node.js, Docker)
• Reduced API latency by 40% through Redis caching and query optimization
• Mentored team of 4 junior developers

SKILLS
JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Git`;

const JD_PLACEHOLDER = `Paste the job description here…

Example:
Software Engineer — Growth Team at TechStartup

We're looking for a full-stack engineer to join our growth team. You'll own
features end-to-end from database to UI.

Requirements:
• 3+ years of experience with React and Node.js
• Experience with GraphQL APIs
• Familiarity with A/B testing frameworks
• Strong communication skills
• AWS or GCP experience preferred`;

interface InputFormProps {
  onResult: (result: FitAnalysis) => void;
}

export default function InputForm({ onResult }: InputFormProps) {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resumeChars = resume.length;
  const jdChars = jd.length;
  const canSubmit = resume.trim().length > 50 && jd.trim().length > 50 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription: jd }),
      });

      const data = (await res.json()) as FitAnalysis | AnalyzeError;

      if (!res.ok || "error" in data) {
        setError(("error" in data ? data.error : null) ?? "Analysis failed.");
        return;
      }

      onResult(data as FitAnalysis);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-medium tracking-wide uppercase"
          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#06b6d4" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
          Powered by Gemini 1.5 Pro
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          <span className="gradient-text">Fit-Hacker</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Drop your resume + job description. Get an instant AI analysis with a
          skill radar, strengths highlight, and interview defense scripts.
        </p>
      </div>

      {/* Two-panel input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Resume */}
        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-lg">📄</span> Your Resume
            </label>
            <span
              className="text-xs tabular-nums"
              style={{ color: resumeChars > 11000 ? "#ef4444" : "#64748b" }}
            >
              {resumeChars.toLocaleString()} / 12,000
            </span>
          </div>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder={RESUME_PLACEHOLDER}
            maxLength={12000}
            rows={16}
            className="w-full bg-transparent text-slate-300 placeholder-slate-600 border rounded-xl px-3 py-2.5 leading-relaxed"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
            required
          />
        </div>

        {/* Job Description */}
        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-lg">💼</span> Job Description
            </label>
            <span
              className="text-xs tabular-nums"
              style={{ color: jdChars > 5500 ? "#ef4444" : "#64748b" }}
            >
              {jdChars.toLocaleString()} / 6,000
            </span>
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder={JD_PLACEHOLDER}
            maxLength={6000}
            rows={16}
            className="w-full bg-transparent text-slate-300 placeholder-slate-600 border rounded-xl px-3 py-2.5 leading-relaxed"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
            required
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
        >
          <span>⚠</span> {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 relative overflow-hidden"
        style={{
          background: canSubmit
            ? "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
            : "rgba(255,255,255,0.05)",
          color: canSubmit ? "#fff" : "#475569",
          cursor: canSubmit ? "pointer" : "not-allowed",
          boxShadow: canSubmit
            ? "0 0 40px rgba(6,182,212,0.25), 0 4px 24px rgba(0,0,0,0.4)"
            : "none",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Analyzing with Gemini 1.5 Pro…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Analyze Fit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </button>

      <p className="text-center text-xs text-slate-600 mt-3">
        Your data is sent directly to Gemini and never stored.
      </p>
    </form>
  );
}

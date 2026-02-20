"use client";

import dynamic from "next/dynamic";
import type { FitAnalysis } from "@/types/analysis";
import ScoreCircle from "./ScoreCircle";
import StrengthCard from "./StrengthCard";
import GapCard from "./GapCard";

// Load recharts client-side only (no SSR)
const SkillRadarChart = dynamic(() => import("./SkillRadarChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
      Loading chart…
    </div>
  ),
});

interface ResultsDashboardProps {
  analysis: FitAnalysis;
  onReset: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: "#06b6d4",
  soft: "#10b981",
  domain: "#8b5cf6",
};

export default function ResultsDashboard({ analysis, onReset }: ResultsDashboardProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          New Analysis
        </button>
        <span className="text-xs text-slate-600 font-mono">
          Fit-Hacker · Gemini 1.5 Pro
        </span>
      </div>

      {/* ── Row 1: Score + Summary ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score */}
        <div className="glass-card p-6 flex flex-col items-center justify-center md:col-span-1">
          <ScoreCircle score={analysis.overallScore} fitLevel={analysis.fitLevel} />
        </div>

        {/* Summary + Recommendation */}
        <div className="glass-card p-6 md:col-span-2 flex flex-col justify-center space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Analysis Summary
            </p>
            <p className="text-slate-200 leading-relaxed">{analysis.summary}</p>
          </div>
          <div
            className="rounded-xl px-4 py-3 border"
            style={{
              background: "rgba(6,182,212,0.06)",
              borderColor: "rgba(6,182,212,0.2)",
            }}
          >
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">
              Recommendation
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {analysis.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* ── Row 2: Radar Chart ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="text-xl">📡</span> Skill Radar
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-violet-500" /> Required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-cyan-500" /> You
            </span>
          </div>
        </div>
        <SkillRadarChart skills={analysis.skills} />

        {/* Skill breakdown table */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {analysis.skills.map((skill) => {
            const delta = skill.candidate - skill.required;
            const catColor = CATEGORY_COLORS[skill.category] ?? "#94a3b8";
            return (
              <div
                key={skill.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <span
                  className="shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: catColor }}
                />
                <span className="flex-1 text-xs text-slate-300 truncate">
                  {skill.name}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {skill.candidate}/{skill.required}
                </span>
                <span
                  className="text-xs font-semibold tabular-nums w-8 text-right"
                  style={{
                    color: delta >= 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {delta >= 0 ? `+${delta}` : delta}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Row 3: Strengths + Gaps ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strengths */}
        <div>
          <h2 className="font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <span className="text-xl">💪</span> Strengths
            <span
              className="ml-1 text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
            >
              {analysis.strengths.length}
            </span>
          </h2>
          <div className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <StrengthCard key={i} strength={s} index={i} />
            ))}
          </div>
        </div>

        {/* Gaps */}
        <div>
          <h2 className="font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <span className="text-xl">🎯</span> Gaps & Defense Scripts
            <span
              className="ml-1 text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}
            >
              {analysis.gaps.length}
            </span>
          </h2>
          <div className="space-y-3">
            {analysis.gaps.length === 0 ? (
              <div
                className="glass-card p-6 text-center text-sm text-slate-400"
              >
                No significant gaps detected — excellent fit!
              </div>
            ) : (
              analysis.gaps.map((g, i) => (
                <GapCard key={i} gap={g} index={i} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

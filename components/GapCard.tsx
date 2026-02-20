"use client";

import { useState } from "react";
import type { Gap, GapImportance } from "@/types/analysis";

const IMPORTANCE_STYLES: Record<
  GapImportance,
  { color: string; bg: string; border: string; label: string }
> = {
  critical: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    label: "Critical",
  },
  important: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    label: "Important",
  },
  "nice-to-have": {
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    border: "rgba(99,102,241,0.25)",
    label: "Nice to Have",
  },
};

interface GapCardProps {
  gap: Gap;
  index: number;
}

export default function GapCard({ gap, index }: GapCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = IMPORTANCE_STYLES[gap.importance];

  return (
    <div
      className="glass-card overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 0.09}s` }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="shrink-0 w-2 h-2 rounded-full pulse-dot"
              style={{ backgroundColor: style.color }}
            />
            <span className="font-semibold text-slate-100 text-sm truncate">
              {gap.skill}
            </span>
          </div>
          <span
            className="shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full border"
            style={{
              color: style.color,
              backgroundColor: style.bg,
              borderColor: style.border,
            }}
          >
            {style.label}
          </span>
        </div>

        {/* Defense script preview */}
        <p
          className={`text-xs text-slate-400 mt-2.5 leading-relaxed ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          <span className="text-slate-500 font-medium">Interview script: </span>
          {gap.defenseScript}
        </p>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium transition-colors"
          style={{ color: "#06b6d4" }}
        >
          {expanded ? "▲ Less" : "▼ Full script + learning path"}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* Full defense script */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(6,182,212,0.06)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            <p className="text-xs font-semibold text-cyan-400 mb-1.5 uppercase tracking-wider">
              Interview Defense Script
            </p>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{gap.defenseScript}"
            </p>
          </div>

          {/* Learning path */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <p className="text-xs font-semibold text-violet-400 mb-1.5 uppercase tracking-wider">
              Learning Path
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {gap.learningPath}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

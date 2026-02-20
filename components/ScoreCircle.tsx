"use client";

import { useEffect, useState } from "react";
import type { FitLevel } from "@/types/analysis";

const FIT_COLORS: Record<FitLevel, string> = {
  Excellent: "#10b981",
  Good: "#06b6d4",
  Fair: "#f59e0b",
  Poor: "#ef4444",
};

const FIT_BG: Record<FitLevel, string> = {
  Excellent: "rgba(16,185,129,0.12)",
  Good: "rgba(6,182,212,0.12)",
  Fair: "rgba(245,158,11,0.12)",
  Poor: "rgba(239,68,68,0.12)",
};

interface ScoreCircleProps {
  score: number;
  fitLevel: FitLevel;
}

export default function ScoreCircle({ score, fitLevel }: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const color = FIT_COLORS[fitLevel];
  const bgColor = FIT_BG[fitLevel];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          {/* Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tabular-nums"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-0.5">
            Score
          </span>
        </div>
      </div>

      {/* Fit Level Badge */}
      <span
        className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border"
        style={{
          color,
          backgroundColor: bgColor,
          borderColor: `${color}40`,
        }}
      >
        {fitLevel} Match
      </span>
    </div>
  );
}

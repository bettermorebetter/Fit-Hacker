import type { Strength } from "@/types/analysis";

interface StrengthCardProps {
  strength: Strength;
  index: number;
}

export default function StrengthCard({ strength, index }: StrengthCardProps) {
  return (
    <div
      className="glass-card p-4 animate-slide-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{
            background: "rgba(16,185,129,0.15)",
            color: "#10b981",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          ✓
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-100 text-sm leading-snug">
            {strength.title}
          </h4>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            {strength.description}
          </p>
          {strength.evidence && (
            <blockquote className="mt-2 pl-2.5 border-l-2 border-emerald-500/40 text-xs text-slate-500 italic">
              "{strength.evidence}"
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}

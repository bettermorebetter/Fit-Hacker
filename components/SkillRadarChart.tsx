"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { Skill } from "@/types/analysis";

interface SkillRadarChartProps {
  skills: Skill[];
}

interface CustomTickProps {
  payload?: { value: string };
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
}

function CustomTick({ payload, x = 0, y = 0, cx = 0, cy = 0 }: CustomTickProps) {
  const label = payload?.value ?? "";
  const words = label.split(" ");
  const dx = x - cx;
  const dy = y - cy;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const isRight = Math.cos((angle * Math.PI) / 180) > 0.1;
  const isLeft = Math.cos((angle * Math.PI) / 180) < -0.1;

  return (
    <text
      x={x}
      y={y}
      textAnchor={isRight ? "start" : isLeft ? "end" : "middle"}
      dominantBaseline="central"
      fill="#94a3b8"
      fontSize={11}
      fontFamily="Inter, sans-serif"
    >
      {words.map((word: string, i: number) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
          {word}
        </tspan>
      ))}
    </text>
  );
}

export default function SkillRadarChart({ skills }: SkillRadarChartProps) {
  // Recharts radar works best with 6-10 axes; truncate labels for display
  const chartData = skills.slice(0, 10).map((s) => ({
    skill: s.name.length > 18 ? s.name.slice(0, 16) + "…" : s.name,
    Required: s.required,
    You: s.candidate,
  }));

  return (
    <div className="w-full" style={{ height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid
            stroke="rgba(255,255,255,0.07)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={(props) => <CustomTick {...props} />}
            tickLine={false}
          />
          <Radar
            name="Required"
            dataKey="Required"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 3 }}
          />
          <Radar
            name="You"
            dataKey="You"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: "#06b6d4", r: 3 }}
          />
          <Legend
            wrapperStyle={{
              color: "#94a3b8",
              fontSize: "12px",
              paddingTop: "8px",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(8,8,26,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#e2e8f0",
              fontSize: "13px",
            }}
            formatter={(value: number, name: string) => [
              `${value} / 10`,
              name,
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

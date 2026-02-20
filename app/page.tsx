"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import type { FitAnalysis } from "@/types/analysis";

export default function Home() {
  const [result, setResult] = useState<FitAnalysis | null>(null);

  return (
    <main className="relative z-10 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {result ? (
        <ResultsDashboard
          analysis={result}
          onReset={() => setResult(null)}
        />
      ) : (
        <InputForm onResult={setResult} />
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-700">
        Fit-Hacker · Built with Next.js + Gemini 1.5 Pro · Deploy on Cloudflare Pages
      </footer>
    </main>
  );
}

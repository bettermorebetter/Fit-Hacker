# Fit-Hacker 🎯

> AI-powered resume × job description analyzer. Drop your resume + JD and get an instant fit score, skill radar chart, highlighted strengths, and interview defense scripts for every gap — powered by **Gemini 1.5 Pro**.

**[→ Live Demo](https://fit-hacker.pages.dev)**

---

## Features

| Feature | Detail |
|---|---|
| **Fit Score** | 0–100 match score with animated SVG ring |
| **Fit Level** | Excellent / Good / Fair / Poor badge |
| **Skill Radar** | Side-by-side "Required vs You" radar chart across 7–10 skills |
| **Strengths** | 3–5 standout strengths with resume evidence quotes |
| **Gap Analysis** | Every significant gap ranked Critical / Important / Nice-to-Have |
| **Defense Scripts** | First-person interview talking points ready to say out loud |
| **Learning Paths** | Specific resources to close each gap |

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| AI | Gemini 1.5 Pro via `@google/generative-ai` |
| Styling | Tailwind CSS — dark glassmorphism theme |
| Charts | Recharts (SVG, edge-safe) |
| Hosting | Cloudflare Pages |
| Edge Adapter | `@opennextjs/cloudflare` |
| Language | TypeScript |

## Local Development

```bash
# 1. Clone
git clone https://github.com/bettermorebetter/Fit-Hacker.git
cd Fit-Hacker

# 2. Install
npm install

# 3. Add your Gemini API key
cp .env.local.example .env.local
# edit .env.local → GEMINI_API_KEY=your_key_here

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

Get a free Gemini API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

## Project Structure

```
fit-hacker/
├── app/
│   ├── api/analyze/route.ts   # Edge API route — calls Gemini, returns JSON
│   ├── layout.tsx             # Root layout + metadata
│   ├── page.tsx               # Page state: InputForm ↔ ResultsDashboard
│   └── globals.css            # Theme, animations, custom properties
├── components/
│   ├── InputForm.tsx          # Resume + JD textareas, submit, char counter
│   ├── ResultsDashboard.tsx   # Full results layout
│   ├── SkillRadarChart.tsx    # Recharts RadarChart (dynamic, no SSR)
│   ├── ScoreCircle.tsx        # Animated SVG score ring
│   ├── StrengthCard.tsx       # Strength card with evidence quote
│   └── GapCard.tsx            # Gap card with expandable defense script
├── lib/
│   └── gemini.ts              # Gemini client + structured prompt
├── types/
│   └── analysis.ts            # FitAnalysis TypeScript interface
├── open-next.config.ts        # @opennextjs/cloudflare config
└── wrangler.toml              # Cloudflare Workers config
```

## Cloudflare Pages Deployment

The repo is wired for auto-deploy on every push to `main`.

| Setting | Value |
|---|---|
| Build command | `npm run cf:build` |
| Build output | `.open-next` |
| Node version | `20` |
| Env var | `GEMINI_API_KEY` |

To deploy manually:
```bash
npm run cf:build   # next build + opennextjs-cloudflare transform
npm run cf:deploy  # wrangler pages deploy
```

## API

**POST `/api/analyze`**

```json
// Request
{
  "resume": "...",          // max 12,000 chars
  "jobDescription": "..."   // max 6,000 chars
}

// Response — FitAnalysis
{
  "overallScore": 74,
  "fitLevel": "Good",
  "summary": "...",
  "recommendation": "...",
  "skills": [
    { "name": "React", "required": 9, "candidate": 8, "category": "technical" }
  ],
  "strengths": [
    { "title": "...", "description": "...", "evidence": "..." }
  ],
  "gaps": [
    {
      "skill": "GraphQL",
      "importance": "important",
      "defenseScript": "I haven't worked with GraphQL professionally yet...",
      "learningPath": "Complete the How to GraphQL tutorial..."
    }
  ]
}
```

## License

MIT

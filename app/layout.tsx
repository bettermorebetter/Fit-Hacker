import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit-Hacker — AI Resume × JD Analyzer",
  description:
    "Analyze your resume against any job description in seconds. Get a skill radar chart, highlighted strengths, and interview defense scripts for missing skills — powered by Gemini 1.5 Pro.",
  keywords: ["resume analyzer", "job fit", "AI career", "interview prep"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="relative z-10">{children}</body>
    </html>
  );
}

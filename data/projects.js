/**
 * GOKUL LABS — Project Registry
 * 
 * To add future projects (e.g., Project 03, Project 04):
 * Simply append a new project object to the `PROJECTS` array below.
 * The portfolio UI will dynamically render the project card, tags,
 * and links without requiring any architectural changes.
 */

const PROJECTS = [
  {
    id: "valtora",
    number: "01",
    name: "VALTORA",
    badge: "AI PRODUCT / STARTUP INTELLIGENCE",
    year: "2026",
    tagline: "Turn an idea into a company — in minutes.",
    description: "VALTORA is an analytical AI Co-Founder concept designed to help founders validate startup ideas and generate structured company strategy — from market sizing and MVP scope to technology architecture, roadmap and go-to-market planning.",
    stages: ["VALIDATE", "ARCHITECT", "LAUNCH"],
    tags: ["AI", "TypeScript", "Startup Intelligence", "LLM Strategy"],
    liveUrl: "https://valtora-swart.vercel.app",
    githubUrl: "https://github.com/gokul1599/valtora",
    accentColor: "#b5ff4d",
    visualType: "valtora-neural"
  },
  {
    id: "lifehub",
    number: "02",
    name: "LIFEHUB",
    badge: "LIFE PLATFORM",
    year: "2026",
    tagline: "One place for everyday life.",
    description: "A daily-life platform concept bringing schedules, reminders, motivation, expenses, weather and an AI assistant into one responsive experience.",
    stages: ["PLAN", "MANAGE", "IMPROVE"],
    tags: ["Web", "JavaScript", "Productivity", "AI Assistant"],
    liveUrl: "https://lifehub-sage.vercel.app",
    githubUrl: "https://github.com/gokul1599/lifehub",
    accentColor: "#38bdf8",
    visualType: "lifehub-dashboard"
  }
];

// Helper to expose projects globally
if (typeof window !== "undefined") {
  window.PROJECTS = PROJECTS;
}

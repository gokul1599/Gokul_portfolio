/**
 * GOKUL LABS — Project Registry & Case Study Architecture v8.0
 * Real, verified product data for Gokul Karpurapu's portfolio.
 * 
 * Strict Content Rule:
 *  - 100% genuine information.
 *  - Zero fabricated metrics, fake users, or invented repositories.
 *  - Structured WHAT / WHY / HOW / INTELLIGENCE / ENGINEERING / EXPERIENCE schema.
 */

const PROJECTS = [
  {
    id: "valtora",
    number: "01",
    name: "VALTORA",
    subtitle: "AI CO-FOUNDER & VENTURE STRATEGIST",
    category: "AI · PRODUCT STRATEGY · FULL STACK",
    year: "2026",
    tagline: "Turn an idea into a company.",
    description: "An analytical AI co-founder designed to turn raw startup ideas into structured validation, market sizing, technology architecture, and phased execution roadmaps.",
    liveUrl: "https://valtora-swart.vercel.app/",
    githubUrl: "https://github.com/gokul1599/valtora",
    accentColor: "#38bdf8",
    technologies: ["React", "TypeScript", "Tailwind CSS", "LLM Reasoning", "Vercel"],
    transformation: {
      from: "IDEA",
      core: "INTELLIGENCE",
      to: "COMPANY"
    },
    workflow: ["IDEA", "UNDERSTAND", "RESEARCH", "CHALLENGE", "BUILD", "EXECUTE", "ADAPT"],
    caseStudy: {
      what: "VALTORA is an analytical AI co-founder that helps founders transition from ambiguous ideas into structured, defensible venture strategy blueprints with phased execution milestones.",
      why: "First-time founders frequently struggle with unstructured brainstorming, premature scaling, and lack of objective stress-testing before writing code, wasting months on unvalidated hypotheses.",
      how: "Created a guided 7-stage analytical pipeline (Idea, Understand, Research, Challenge, Build, Execute, Adapt) that prompts founders through structured discovery, market sizing, and distribution modeling.",
      intelligence: "Employs disciplined LLM prompting pipelines to analyze problem-solution fit, model addressable market scopes (TAM/SAM), map competitive differentiation vectors, and challenge weak assumptions.",
      engineering: "Engineered with React and TypeScript for predictable state transitions, high-contrast dark aesthetic with Tailwind CSS, and optimized edge streaming response handling on Vercel.",
      stack: "React 18, TypeScript, Tailwind CSS, LLM API Orchestration, Lucide Icons, Vercel Edge Hosting.",
      experience: "A focused, dark-mode terminal canvas with interactive pipeline progress rails, real-time blueprint synthesis, risk engine cards, and actionable 90-day execution roadmaps."
    }
  },
  {
    id: "lifehub",
    number: "02",
    name: "LIFEHUB",
    subtitle: "PERSONAL OPERATING SYSTEM",
    category: "PRODUCTIVITY · WEB SYSTEM · UX CRAFT",
    year: "2026",
    tagline: "Everything you need for your day, in one place.",
    description: "A unified personal productivity workspace bringing schedules, agenda timelines, expense logs, habits, and task automation into one responsive dashboard.",
    liveUrl: "https://lifehub-sage.vercel.app/",
    githubUrl: "https://github.com/gokul1599/lifehub",
    accentColor: "#60a5fa",
    technologies: ["React 19", "TypeScript", "Tailwind CSS v4", "Zustand 5", "Vite", "Vercel"],
    transformation: {
      from: "CHAOS",
      core: "ORGANIZATION",
      to: "CLARITY"
    },
    workflow: ["PLAN", "ORGANIZE", "TRACK", "IMPROVE"],
    caseStudy: {
      what: "LifeHub is a comprehensive personal operating system that integrates daily agendas, task priorities, financial tracking, habit streaks, and goal roadmaps into a unified dashboard.",
      why: "Personal organization is chronically fragmented across disconnected calendar apps, standalone to-do lists, manual expense notes, and browser bookmarks, creating daily cognitive clutter.",
      how: "Architected a single-pane dashboard with unified state synchronization, allowing users to glance at their day, log expenditures, update tasks, and track routines in seconds.",
      intelligence: "Contextual heuristic algorithms that track daily routines, evaluate completion velocity across commitments, calculate expense burn rates, and surface timely daily priorities.",
      engineering: "Built with React 19, TypeScript, and Vite for sub-100ms client interactions; state management orchestrated with Zustand 5; styled with Tailwind CSS v4 design tokens.",
      stack: "React 19, TypeScript, Tailwind CSS v4, Zustand 5, Vite, React Router DOM 7, Vercel Edge Hosting.",
      experience: "Live digital clock and day counter, agenda timeline with task status indicators, categorized expense tracker with immediate balance summaries, and local weather glance."
    }
  },
  {
    id: "teluguva",
    number: "03",
    name: "TELUGUVA",
    subtitle: "BILINGUAL ACCESSIBILITY & OCR PLATFORM",
    category: "AI · NLP & TRANSLATION · ACCESSIBILITY",
    year: "2026",
    tagline: "English in. Telugu out. Understanding made simple.",
    description: "An intelligent bilingual translation and accessibility platform that converts English documents, circulars, and notices into natural conversational Telugu with instant voice narration.",
    liveUrl: "https://teluguva.vercel.app/",
    githubUrl: null, // No public repository — strict rule: do not fabricate
    accentColor: "#f59e0b",
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tesseract.js OCR", "Web Speech API", "Tailwind CSS v4"],
    transformation: {
      from: "ENGLISH NOTICE",
      core: "CONTEXT AI",
      to: "CONVERSATIONAL TELUGU"
    },
    workflow: ["INPUT / OCR", "CONTEXT PARSER", "SIMPLE TELUGU", "VOICE NARRATION"],
    caseStudy: {
      what: "Teluguva is an intelligent bilingual accessibility platform that translates dense English communications, circulars, bills, and notices into clear conversational Telugu with audio narration.",
      why: "Official government circulars, doctor prescriptions, school WhatsApp notices, and utility bills arrive in complex English, creating severe comprehension barriers for millions of Telugu speakers and elderly parents.",
      how: "Constructed a multimodal input pipeline (typed text, photo upload, document scan via OCR) paired with a specialized 'Simple Telugu Mode' that replaces formal literary jargon with everyday conversational speech.",
      intelligence: "Context-aware linguistic transformation tuned for colloquial clarity and situational nuance, paired with client-side OCR image text extraction and speech synthesis pacing.",
      engineering: "Built on Next.js 16 (App Router) and React 19; client-side Tesseract.js for in-browser OCR image extraction without server latency; Web Speech API integration with 0.75× and 1× playback pacing.",
      stack: "Next.js 16 (App Router), React 19, TypeScript, Tesseract.js OCR, Web Speech API, Tailwind CSS v4, Vercel.",
      experience: "Clean dual-pane comparative layout, drag-and-drop document scanner with OCR status indicators, audio playback controls with adjustable reading speeds, and font size scaling (A, A+, A++) for elderly readability."
    }
  }
];

if (typeof window !== "undefined") {
  window.PROJECTS = PROJECTS;
}


/**
 * GOKUL LABS — Project Registry & Case Study Architecture
 * Real, verified product data for Gokul Karpurapu's portfolio.
 * 
 * Strict Content Rule:
 *  - 100% genuine information.
 *  - Zero fabricated metrics, fake users, or invented repositories.
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
    description: "An analytical AI co-founder designed to turn startup ideas into structured validation, market sizing, technology architecture, and phased execution roadmaps.",
    liveUrl: "https://valtora-swart.vercel.app/",
    githubUrl: "https://github.com/gokul1599/valtora",
    accentColor: "#38bdf8",
    technologies: ["React", "TypeScript", "Tailwind CSS", "LLM Integration", "Vercel"],
    transformation: {
      from: "IDEA",
      core: "INTELLIGENCE",
      to: "COMPANY"
    },
    workflow: ["IDEA", "VALIDATE", "ARCHITECT", "BUILD", "LAUNCH"],
    caseStudy: {
      problem: "First-time founders frequently struggle to transition from an initial conceptual spark to a rigorously validated, technically defensible execution plan without drowning in unstructured thoughts.",
      product: "VALTORA acts as an analytical AI co-founder, systematically conducting structured founder discovery, breaking down core assumptions, and synthesizing comprehensive venture strategy blueprints in minutes.",
      intelligence: "Employs disciplined LLM reasoning pipelines to analyze problem-solution fit, evaluate competitive differentiation vectors, model addressable market scopes, and generate technical requirements.",
      engineering: "Engineered with React and TypeScript for predictable state flow, styled with a high-contrast dark aesthetic via Tailwind CSS, and optimized for fast streaming response rendering on Vercel.",
      stack: "React 18, TypeScript, Tailwind CSS, LLM API Orchestration, Vercel Edge Hosting.",
      experience: "A focused, dark-mode terminal-inspired canvas with guided discovery stages, real-time blueprint synthesis, interactive risk matrix inspection, and downloadable specification documentation."
    }
  },
  {
    id: "lifehub",
    number: "02",
    name: "LIFEHUB",
    subtitle: "PERSONAL OPERATING SYSTEM",
    category: "PRODUCTIVITY · WEB SYSTEM · UX CRAFT",
    year: "2026",
    tagline: "Your life. One intelligent space.",
    description: "A unified personal productivity workspace bringing schedules, agenda timelines, expense logs, weather forecasts, and task automation into one responsive dashboard.",
    liveUrl: "https://lifehub-sage.vercel.app/",
    githubUrl: "https://github.com/gokul1599/lifehub",
    accentColor: "#60a5fa",
    technologies: ["JavaScript (ES6+)", "HTML5", "CSS3", "LocalStorage API", "Vercel"],
    transformation: {
      from: "CHAOS",
      core: "ORGANIZATION",
      to: "CLARITY"
    },
    workflow: ["PLAN", "ORGANIZE", "TRACK", "IMPROVE"],
    caseStudy: {
      problem: "Everyday organization is chronically fragmented across disconnected calendar apps, standalone to-do lists, manual expense notes, and browser bookmark clutter.",
      product: "LifeHub unifies personal life administration into a single, high-speed client-side operating console designed for frictionless daily check-ins and zero-latency planning.",
      intelligence: "Context-aware heuristic algorithms that track daily routines, evaluate completion velocity across commitments, calculate expense burn rates, and surface timely daily priorities.",
      engineering: "Architected with vanilla modern JavaScript for maximum responsiveness, zero external runtime weight, reactive DOM state synchronization, and persistent LocalStorage state serialization.",
      stack: "Modern JavaScript (ES6+), HTML5 Semantic Shell, Modular CSS Custom Properties, LocalStorage Persistence, Vercel.",
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
    liveUrl: "https://teluguva.vercel.app",
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
      problem: "Complex English legal documents, institutional circulars, academic notifications, and medical instructions create severe comprehension bottlenecks for millions of native Telugu speakers.",
      product: "Teluguva bridges the accessibility gap by translating dense English communications into clear, everyday spoken Telugu, accompanied by synchronous audio narration for low-literacy users.",
      intelligence: "Context-sensitive linguistic transformation tuned for colloquial clarity rather than rigid literal word-for-word translation, paired with client-side OCR image text extraction.",
      engineering: "Built upon the Next.js 16 App Router and React 19, integrating client-side Tesseract.js for in-browser document processing without server roundtrips, and Web Speech API synthesis.",
      stack: "Next.js 16 (App Router), React 19, TypeScript, Tesseract.js OCR, Web Speech API, Tailwind CSS v4, Vercel.",
      experience: "Clean dual-pane comparative layout, drag-and-drop document scanner with OCR status indicators, audio playback controls with adjustable reading speeds (0.75× / 1×), and copy-to-clipboard actions."
    }
  },
  {
    id: "buildshift",
    number: "04",
    name: "BUILDSHIFT",
    subtitle: "3D SPATIAL ARCHITECTURE PLATFORM",
    category: "3D / SPATIAL · ARCHITECTURE · WEBGL",
    year: "2026",
    tagline: "See your home before you build it.",
    description: "An interactive architectural visualization platform that transforms floor plans into 3D spatial home environments — allowing users to customize materials, test pigments, inspect lighting, and experience spaces before construction begins.",
    liveUrl: "https://buildshift-green.vercel.app",
    githubUrl: null, // No public repository — strict rule: do not fabricate
    accentColor: "#b8664e",
    technologies: ["WebGL", "Three.js / Canvas", "JavaScript", "Spatial UI", "Vercel"],
    transformation: {
      from: "2D BLUEPRINT",
      core: "3D SPATIAL TWIN",
      to: "VIRTUAL TOUR"
    },
    workflow: ["FLOOR PLAN", "3D SPACE", "MATERIALS & PIGMENTS", "SPATIAL TOUR"],
    caseStudy: {
      problem: "Visualizing volumetric scale, natural daylight angles, and material textures from traditional flat 2D blueprint drawings is exceptionally difficult, leading to costly mid-construction alterations.",
      product: "BuildShift gives homeowners and designers an interactive 3D spatial environment to preview physical rooms, swap material finishes, calibrate pigments, and explore layouts in real-time.",
      intelligence: "Spatial dimension calculation, automated architectural room boundary mapping, and physical lighting calculations that accurately simulate surface reflections and ambient bounce.",
      engineering: "Interactive WebGL viewport integrating responsive camera controls, physically based material shaders (PBR), and lightweight procedural spatial geometry rendering.",
      stack: "WebGL, Three.js, JavaScript, CSS Spatial Transforms, Vercel Edge Hosting.",
      experience: "Interactive room viewport with clickable spatial navigation hotspots (Show Kitchen, Dining Pavilion, Terrace), live material inspector (Navona Travertine, Walnut, Bronze), and pigment hex swatches."
    }
  }
];

if (typeof window !== "undefined") {
  window.PROJECTS = PROJECTS;
}

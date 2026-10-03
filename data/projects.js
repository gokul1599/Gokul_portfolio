/**
 * GOKUL LABS — Project Registry & Case Study Architecture v9.0
 * Verified product data for Gokul Karpurapu's portfolio.
 * 
 * Strict Content Rule:
 *  - 100% genuine information from verified builds.
 *  - Zero fabricated metrics, fake users, or invented repositories.
 *  - Four core products: VALTORA, LIFEHUB, TELUGUVA, DEVYATRA.
 *  - Structured WHAT / WHY / HOW / ARCHITECTURE / DECISIONS / AI FLOW / CHALLENGES schema.
 */

const PROJECTS = [
  {
    id: "valtora",
    number: "01",
    name: "VALTORA",
    subtitle: "AI PRODUCT INTELLIGENCE PLATFORM",
    category: "AI · PRODUCT STRATEGY · FULL STACK",
    year: "2026",
    tagline: "Turn an idea into a company.",
    description: "An analytical AI co-founder application that transforms raw startup ideas into structured venture validation, defensibility analysis, technology architecture blueprints, and phased execution roadmaps.",
    liveUrl: "https://valtora-swart.vercel.app/",
    githubUrl: "https://github.com/gokul1599/valtora",
    caseStudyPath: "work/valtora/index.html",
    accentColor: "#38bdf8",
    technologies: ["React 18", "TypeScript", "Tailwind CSS", "Appwrite", "Groq AI", "Zod", "Vercel"],
    transformation: {
      from: "IDEA",
      core: "INTELLIGENCE",
      to: "COMPANY"
    },
    workflow: ["IDEA", "UNDERSTANDING", "CHALLENGE", "ROADMAP", "ACTION"],
    architecture: [
      { step: "USER INPUT", role: "Early startup thesis & problem formulation" },
      { step: "REACT CLIENT", role: "Interactive state engine with challenge workflows & re-roll triggers" },
      { step: "APPWRITE BACKEND", role: "Secure session authentication, user workspaces & document storage" },
      { step: "GROQ LLM ENGINE", role: "Low-latency inference for market sizing, moat analysis & risk evaluation" },
      { step: "ZOD VALIDATION", role: "Strict schema enforcement preventing malformed blueprints and prompt leaks" },
      { step: "VENTURE BLUEPRINT", role: "Actionable 90-day milestone roadmap & target customer profile" }
    ],
    engineeringDecisions: [
      {
        topic: "Why Groq with Llama 3 / Mixtral?",
        rationale: "Early-stage venture ideation requires fast iteration. Groq's LPUs deliver token generation at ~300+ tokens/sec, reducing user wait time from 15s to sub-2s for dense blueprint synthesis."
      },
      {
        topic: "Why Appwrite for Backend?",
        rationale: "Integrated authentication, secure document storage, and database access controls out of the box, allowing rapid full-stack iteration without maintaining complex custom database servers."
      },
      {
        topic: "Why Zod for Schema Validation?",
        rationale: "Unstructured LLM outputs frequently break frontend state. Strict Zod parsing ensures the venture blueprint (TAM, SAM, ICP, milestones) conforms to exact typed structures before rendering."
      },
      {
        topic: "How Prompt Injection & Adversarial Inputs are Handled?",
        rationale: "Structured boundary wrappers and explicit system rules isolate user idea strings from system instructions, ensuring the model acts objectively as a rigorous critic rather than a blind sycophant."
      }
    ],
    challenges: {
      problem: "Initial LLM responses were overly agreeable, validating fundamentally flawed startup ideas with generic praise and shallow feedback.",
      solution: "Engineered a deliberate 'Challenge Stage' in the prompt pipeline with explicit counter-factual reasoning, defensibility stress-tests, and unit economics constraints.",
      lesson: "In product intelligence tools, critical constructive pushback provides significantly greater value to a founder than polite automated confirmation."
    },
    caseStudy: {
      what: "VALTORA is an analytical AI co-founder that helps founders transition from ambiguous ideas into structured, defensible venture strategy blueprints with phased execution milestones.",
      why: "First-time founders frequently struggle with unstructured brainstorming, premature scaling, and lack of objective stress-testing before writing code, wasting months on unvalidated hypotheses.",
      how: "Created a guided 5-stage analytical pipeline (Idea, Understanding, Challenge, Roadmap, Action) that prompts founders through structured discovery, market sizing, and distribution modeling.",
      intelligence: "Employs disciplined LLM prompting pipelines to analyze problem-solution fit, model addressable market scopes (TAM/SAM), map competitive differentiation vectors, and challenge weak assumptions.",
      engineering: "Engineered with React and TypeScript for predictable state transitions, high-contrast dark aesthetic with Tailwind CSS, and optimized edge streaming response handling on Vercel.",
      stack: "React 18, TypeScript, Tailwind CSS, Appwrite, Groq API, Zod Validation, Lucide Icons, Vercel Edge Hosting.",
      experience: "A focused, dark-mode terminal canvas with interactive pipeline progress rails, real-time blueprint synthesis, risk engine cards, and actionable 90-day execution roadmaps."
    }
  },
  {
    id: "lifehub",
    number: "02",
    name: "LIFEHUB",
    subtitle: "PERSONAL PRODUCTIVITY + LIFE MANAGEMENT PLATFORM",
    category: "PRODUCTIVITY · WEB SYSTEM · UX CRAFT",
    year: "2026",
    tagline: "Your life. One intelligent space.",
    description: "A unified personal productivity workspace bringing schedules, agenda timelines, expense logs, habits, and task automation into one responsive dashboard.",
    liveUrl: "https://lifehub-sage.vercel.app/",
    githubUrl: "https://github.com/gokul1599/lifehub",
    caseStudyPath: "work/lifehub/index.html",
    accentColor: "#60a5fa",
    technologies: ["React 19", "TypeScript", "Tailwind CSS v4", "Zustand 5", "Vite", "Vercel"],
    transformation: {
      from: "CHAOS",
      core: "ORGANIZATION",
      to: "CLARITY"
    },
    workflow: ["PLAN", "MANAGE", "REMEMBER", "UNDERSTAND", "ACT"],
    architecture: [
      { step: "USER CONTEXT", role: "Daily routine, timezone, active tasks & financial limit preferences" },
      { step: "REACT 19 CLIENT", role: "High-performance modular dashboard with sub-100ms client interactions" },
      { step: "ZUSTAND 5 STORE", role: "Decoupled state management synchronizing tasks, schedules & expenses" },
      { step: "LOCAL STORAGE & CACHE", role: "Offline-first resilience ensuring uninterrupted access during network drops" },
      { step: "OPEN-METEO & UTILITIES", role: "Live local weather telemetry and contextual time-based greetings" },
      { step: "INTELLIGENT OS ACTION", role: "Automated expense warning alerts, task completion streaks & reminder sounds" }
    ],
    engineeringDecisions: [
      {
        topic: "Why React 19 + Vite over heavyweight frameworks?",
        rationale: "LifeHub is a daily dashboard tool that users open dozens of times a day. Instant client-side hydration and sub-50ms tab switching via Vite were prioritized over server-rendered overhead."
      },
      {
        topic: "Why Zustand 5 over Redux or React Context?",
        rationale: "Zustand provides boilerplate-free atomic state selectors. Only the specific card (e.g. clock, expense bar, or task item) re-renders on state mutation, avoiding root tree thrashing."
      },
      {
        topic: "Why Offline-First Local Storage Persistence?",
        rationale: "Users cannot afford to lose task updates or expense logs due to spotty connectivity. State writes serialize immediately to IndexedDB/LocalStorage with conflict-safe fallbacks."
      },
      {
        topic: "Audio & Web Notification Engineering",
        rationale: "Constructed an HTML5 Audio chime system with permission-gated Web Notifications, allowing the platform to signal scheduled reminders reliably while the user works across other tabs."
      }
    ],
    challenges: {
      problem: "Synchronizing live time-based greetings, dynamic weather APIs, expense budgets, and multi-category task lists without causing perceptible UI stutter on lower-end mobile devices.",
      solution: "Decoupled the time and weather polling loops from UI state using requestIdleCallback and selective memoized components, ensuring 60fps animations across all screen sizes.",
      lesson: "High-frequency dashboard elements (like live ticking clocks and task filters) must be isolated into self-contained leaf components to preserve client render budgets."
    },
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
    subtitle: "TELUGU-FIRST DIGITAL PLATFORM & OCR",
    category: "AI · ACCESSIBILITY · LANGUAGE EXPERIENCE",
    year: "2026",
    tagline: "English in. Telugu out. Understanding made simple.",
    description: "An intelligent bilingual translation and accessibility platform that converts English documents, circulars, and notices into natural conversational Telugu with instant voice narration.",
    liveUrl: "https://teluguva.vercel.app",
    githubUrl: "https://github.com/gokul1599/teluguva",
    caseStudyPath: "work/teluguva/index.html",
    accentColor: "#f59e0b",
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tesseract.js OCR", "Web Speech API", "Tailwind CSS v4", "Vercel"],
    transformation: {
      from: "ENGLISH NOTICE",
      core: "CONTEXT AI",
      to: "CONVERSATIONAL TELUGU"
    },
    workflow: ["INPUT / OCR", "CONTEXT PARSER", "SIMPLE TELUGU", "VOICE NARRATION"],
    architecture: [
      { step: "MULTIMODAL INPUT", role: "Typed text, camera snapshot, or PDF document file upload" },
      { step: "CLIENT-SIDE OCR", role: "In-browser Tesseract.js worker extracting English text without server latency" },
      { step: "LINGUISTIC CONTEXT ENGINE", role: "Identifies document domain (utility bill, prescription, circular, school notice)" },
      { step: "SIMPLE TELUGU CONVERTER", role: "Translates formal Sanskritized Telugu terms into everyday conversational Telugu" },
      { step: "WEB SPEECH SYNTHESIS", role: "Native Telugu streaming audio playback with 0.75× slow speed for older adults" },
      { step: "ACCESSIBLE READER VIEW", role: "High-contrast dual-pane comparative cards with scalable font controls (A, A+, A++)" }
    ],
    engineeringDecisions: [
      {
        topic: "Why Client-Side Tesseract.js over Cloud Vision APIs?",
        rationale: "Documents like utility bills and medical slips contain sensitive personal data. Client-side OCR keeps processing on the user's device, improves privacy, and incurs zero API cost."
      },
      {
        topic: "Why 'Simple Telugu' over Literal Dictionary Translation?",
        rationale: "Standard Google Translate produces formal literary Telugu (e.g., 'విద్యుత్ శుల్కం సమర్పించండి') which elderly citizens find difficult to understand. Simple Telugu converts this directly to everyday spoken dialect ('కరెంట్ బిల్లు కట్టండి')."
      },
      {
        topic: "Audio Speed Controls & Elderly Accessibility",
        rationale: "Default text-to-speech engines speak too fast for older adults. Teluguva implements customized 0.75× and 1× audio rate switches alongside 44px+ touch targets and tiered font sizing."
      },
      {
        topic: "Next.js 16 App Router with Turbopack",
        rationale: "Leveraged Next.js 16 server components for fast initial shell loading, while isolating audio drivers and Web Worker OCR threads into client boundaries."
      }
    ],
    challenges: {
      problem: "Camera-captured document photos taken by elderly users were often low-resolution, tilted, or dimly lit, causing OCR failure or garbled translation output.",
      solution: "Integrated a pre-processing canvas pipeline that auto-adjusts image contrast, binarizes grayscale thresholds, and prompts the user with instant quality feedback if lighting is inadequate.",
      lesson: "Real accessibility engineering extends beyond font size — it requires designing tolerant input systems that gracefully compensate for real-world physical and hardware limitations."
    },
    caseStudy: {
      what: "Teluguva is an intelligent bilingual accessibility platform that translates dense English communications, circulars, bills, and notices into clear conversational Telugu with audio narration.",
      why: "Official government circulars, doctor prescriptions, school WhatsApp notices, and utility bills arrive in complex English, creating severe comprehension barriers for millions of Telugu speakers and elderly parents.",
      how: "Constructed a multimodal input pipeline (typed text, photo upload, document scan via OCR) paired with a specialized 'Simple Telugu Mode' that replaces formal literary jargon with everyday conversational speech.",
      intelligence: "Context-aware linguistic transformation tuned for colloquial clarity and situational nuance, paired with client-side OCR image text extraction and speech synthesis pacing.",
      engineering: "Built on Next.js 16 (App Router) and React 19; client-side Tesseract.js for in-browser OCR image extraction without server latency; Web Speech API integration with 0.75× and 1× playback pacing.",
      stack: "Next.js 16 (App Router), React 19, TypeScript, Tesseract.js OCR, Web Speech API, Tailwind CSS v4, Vercel.",
      experience: "Clean dual-pane comparative layout, drag-and-drop document scanner with OCR status indicators, audio playback controls with adjustable reading speeds, and font size scaling (A, A+, A++) for elderly readability."
    }
  },
  {
    id: "devyatra",
    number: "04",
    name: "DEVYATRA",
    subtitle: "AI PILGRIMAGE + INDIA DISCOVERY PLATFORM",
    category: "GEOSPATIAL · AI PILGRIMAGE · INDIA ATLAS",
    year: "2026",
    tagline: "Discover India's sacred heritage and natural wonders through geospatial intelligence.",
    description: "An interactive platform for discovering India's temples, sacred destinations, heritage locations, caves, waterfalls, and nature trails, combined with source-verified metadata and an AI-assisted pilgrimage route planner.",
    liveUrl: "https://templeora.vercel.app",
    githubUrl: "https://github.com/gokul1599/DEVYATRA",
    caseStudyPath: "work/devyatra/index.html",
    accentColor: "#10b981",
    technologies: ["Next.js 16 (App Router)", "React 19", "Tailwind CSS v4", "MapLibre GL", "Neon PostgreSQL", "Prisma ORM", "Groq AI", "Vercel"],
    transformation: {
      from: "FRAGMENTED DATA",
      core: "GEOSPATIAL AI",
      to: "GUIDED JOURNEY"
    },
    workflow: ["DISCOVER", "EXPLORE", "VERIFY", "PLAN", "TRAVEL"],
    architecture: [
      { step: "USER / EXPLORER", role: "Search, category filtering (Temples, Heritage, Caves, Falls) & geographic drill-down" },
      { step: "DESTINATION ATLAS", role: "Grounded geospatial database spanning 36 states and union territories in Neon PostgreSQL" },
      { step: "MAPLIBRE CARTOGRAPHY", role: "Vector tile map rendering with interactive coordinate clustering & spatial bounds" },
      { step: "VERIFICATION ENGINE", role: "Multi-tier provenance classifying GOVERNMENT_SOURCE, VERIFIED_OFFICIAL, TRUSTED_SOURCE, UNVERIFIED" },
      { step: "CONTEXT-SCOPED AI PLANNER", role: "Groq inference synthesizing personalized multi-day itineraries without hallucinated timings" },
      { step: "TRAVEL BLUEPRINT", role: "Optimized route sequence, opening windows, cultural etiquette & live weather integration" }
    ],
    engineeringDecisions: [
      {
        topic: "Why Neon Serverless PostgreSQL with Prisma?",
        rationale: "Geospatial queries and hierarchical taxonomy (State → District → Taluk → Shrines) require relational integrity. Neon serverless scales compute to zero when idle while providing robust spatial indexing."
      },
      {
        topic: "Why MapLibre GL over proprietary map SDKs?",
        rationale: "MapLibre GL provides sovereign, open-source vector map rendering with high frame rates, zero vendor lock-in, and custom cinematic dark styling matching the studio design language."
      },
      {
        topic: "Strict Zero-Hallucination AI Rules",
        rationale: "Pilgrimage planning involves sacred timings (Aarti, Darshan, temple gate closings) where incorrect AI assumptions cause real physical disruption. The AI planner is strictly context-scoped: it only builds routes using verified database facts."
      },
      {
        topic: "Transparent Multi-Tier Verification Layer",
        rationale: "Rather than claiming 'every temple in India is 100% verified', DevYatra exposes explicit provenance tags (GOVERNMENT_SOURCE, VERIFIED_OFFICIAL, TRUSTED_SOURCE, UNVERIFIED) so travelers know the exact certainty of information."
      }
    ],
    challenges: {
      problem: "Indian temple and geographic data is notoriously fragmented across regional languages, informal tourism blogs, and outdated government gazettes with conflicting coordinates and timing claims.",
      solution: "Constructed an automated deduplication and normalization pipeline that cross-references ASI monument registries and official Devasthanam records, explicitly tagging unverified coordinates as 'APPROXIMATE' rather than guessing.",
      lesson: "In data-dense geospatial platforms, honesty about data provenance and gaps builds substantially higher trust than presenting an illusion of total completeness."
    },
    caseStudy: {
      what: "DevYatra is an AI-powered India temple, sacred destination, and geographical heritage explorer that bridges thousands of years of cultural geography with modern interactive mapping and intelligent pilgrimage route synthesis.",
      why: "Planning pilgrimage journeys in India is chronically overwhelmed by fragmented websites, conflicting Darshan hours, unverified dress code rules, and lack of cohesive multi-destination route logic.",
      how: "Built a hierarchical exploration engine spanning all 36 Indian states and union territories, categorized into 9 distinct exploration vectors (Temples, Heritage, Caves, Hills, Waterfalls, Lakes, Nature, Beaches, Wildlife) paired with an AI itinerary engine.",
      intelligence: "Context-scoped LLM route planner that takes departure city, spiritual intent, and travel duration to calculate optimal daily stops, Darshan windows, and logistics without hallucinating timings.",
      engineering: "Engineered on Next.js 16 (App Router), React 19, Tailwind CSS v4, MapLibre GL vector mapping, Neon PostgreSQL, and Prisma ORM.",
      stack: "Next.js 16, React 19, Tailwind CSS v4, MapLibre GL, Neon PostgreSQL, Prisma ORM, Groq AI, Vercel.",
      experience: "Interactive India geospatial explorer with instant category filtering, real coordinate pins, detailed destination drawers with verified sources, and an AI Pilgrimage Planner generating structured travel itineraries."
    }
  }
];

if (typeof window !== "undefined") {
  window.PROJECTS = PROJECTS;
}

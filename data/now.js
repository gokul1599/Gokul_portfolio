/**
 * GOKUL LABS — Live Status Registry (NOW Section)
 * Structured, factual status reflecting Gokul Karpurapu's real current focus.
 */

const NOW_STATUS = {
  lastUpdated: "OCTOBER 2026",
  availability: "AVAILABLE FOR INTERNSHIPS & COLLABORATIONS",
  columns: [
    {
      label: "CURRENTLY BUILDING",
      value: "Iterating on Valtora startup blueprints, LifeHub daily workspace, Teluguva OCR workflows, and DevYatra geospatial cartography.",
      detail: "Shipping continuous improvements across all four live products with real user testing."
    },
    {
      label: "CURRENTLY LEARNING",
      value: "Advanced LLM application architectures, Groq low-latency streaming, and WebGL Three.js spatial scenes.",
      detail: "Deepening core computer science and AI foundations through BITS Pilani and Scaler coursework."
    },
    {
      label: "CURRENTLY EXPLORING",
      value: "Multimodal interfaces, lightweight local-first web architectures, and seamless AI ergonomics.",
      detail: "Studying how thoughtful interface craft makes complex AI systems feel effortless."
    },
    {
      label: "LOOKING FOR",
      value: "AI engineering internships, frontend/full-stack developer roles, and hackathon teams.",
      detail: "Eager to contribute high visual craft and disciplined software execution to ambitious teams."
    }
  ]
};

if (typeof window !== "undefined") {
  window.NOW_STATUS = NOW_STATUS;
}

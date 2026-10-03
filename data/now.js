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
      value: "AI/product experiences, productivity systems, language accessibility systems, and geospatial experiences.",
      detail: "Iterating on Valtora venture blueprints, LifeHub daily workspace, Teluguva OCR, and DevYatra / Templeora sacred atlas."
    },
    {
      label: "CURRENTLY LEARNING",
      value: "JavaScript, Python, AI application development, and foundational software engineering.",
      detail: "Deepening core computer science and AI foundations through BITS Pilani and Scaler School of Technology coursework."
    },
    {
      label: "CURRENTLY EXPLORING",
      value: "WebGL spatial interactions, AI workflows, frontend architecture, and automation.",
      detail: "Studying how thoughtful interface craft and reliable engineering make complex digital systems feel effortless."
    },
    {
      label: "LOOKING FOR",
      value: "AI engineering internships, frontend/full-stack developer opportunities, and collaborative builds.",
      detail: "Eager to contribute strong interface craft and disciplined software execution to ambitious engineering teams."
    }
  ]
};

if (typeof window !== "undefined") {
  window.NOW_STATUS = NOW_STATUS;
}

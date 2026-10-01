/**
 * GOKUL LABS — Live Status Registry (NOW Section)
 * Structured, editable status reflecting Gokul Karpurapu's real current focus.
 */

const NOW_STATUS = {
  lastUpdated: "OCTOBER 2026",
  availability: "AVAILABLE FOR INTERNSHIPS & COLLABORATIONS",
  columns: [
    {
      label: "CURRENTLY LEARNING",
      value: "Advanced LLM Agent Orchestration, Spatial WebGL Architecture, and Modern Distributed Systems.",
      detail: "Deepening mathematical foundations in neural attention mechanisms alongside low-latency client rendering."
    },
    {
      label: "CURRENTLY BUILDING",
      value: "Production-grade personal digital studio & next-generation bilingual accessibility interfaces.",
      detail: "Refining user-centric AI experiences where intelligent models solve acute everyday comprehension bottlenecks."
    },
    {
      label: "CURRENTLY EXPLORING",
      value: "Autonomous agentic workflows, local client-side WebAssembly inference, and tactile micro-ergonomics.",
      detail: "Investigating how physical spatial UI and physical constraints eliminate cognitive friction for real users."
    },
    {
      label: "LOOKING FOR",
      value: "Engineering internships, builder collaborations, and challenging software roles.",
      detail: "Eager to contribute where high visual craft, rigorous systems engineering, and rapid product velocity intersect."
    }
  ]
};

if (typeof window !== "undefined") {
  window.NOW_STATUS = NOW_STATUS;
}

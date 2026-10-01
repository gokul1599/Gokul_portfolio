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
      value: "Next-generation intelligent tool prototypes and accessibility interfaces.",
      detail: "Focusing on products that solve real human friction through thoughtful engineering."
    },
    {
      label: "CURRENTLY LEARNING",
      value: "Advanced LLM orchestration and spatial WebGL graphics.",
      detail: "Connecting theoretical AI concepts with low-latency browser experiences."
    },
    {
      label: "CURRENTLY EXPLORING",
      value: "Practical AI applications and low-friction product ergonomics.",
      detail: "Designing interfaces where intelligent models feel seamless and effortless."
    },
    {
      label: "LOOKING FOR",
      value: "Engineering internships, builder collaborations, and software teams.",
      detail: "Open to challenging roles where strong frontend craft meets practical engineering."
    }
  ]
};

if (typeof window !== "undefined") {
  window.NOW_STATUS = NOW_STATUS;
}

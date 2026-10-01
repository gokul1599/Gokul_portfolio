/**
 * GOKUL LABS — Digital Experimentation Registry
 * Genuine, interactive engineering prototypes & micro-explorations.
 */

const LAB_EXPERIMENTS = [
  {
    id: "prompt-analyzer",
    number: "EXP-01",
    title: "PROMPT STRUCTURE ANALYZER",
    category: "AI · NLP ARCHITECTURE",
    status: "ACTIVE EXPLORATION",
    description: "An interactive analysis tool that breaks down prompt instructions into structural roles (Role, Context, Objective, Constraints) with real-time semantic parsing.",
    tags: ["LLM Frameworks", "Semantic Parsing", "Prompt Engineering"],
    presets: [
      {
        name: "Startup Venture Spec",
        text: "ROLE: Senior Venture Architect\nCONTEXT: Early-stage developer building an AI co-founder.\nOBJECTIVE: Formulate a lean MVP specification focusing on unit economics and retention.\nCONSTRAINTS: Avoid premature scaling; emphasize client-side privacy."
      },
      {
        name: "Bilingual Translation Heuristic",
        text: "ROLE: Bilingual Accessibility Linguist\nCONTEXT: Official technical circular drafted in dense English.\nOBJECTIVE: Translate into colloquial conversational Telugu with 0.8x speech pacing.\nCONSTRAINTS: Preserve technical terms while eliminating bureaucratic jargon."
      },
      {
        name: "3D Spatial Twin Protocol",
        text: "ROLE: Spatial Graphics Engineer\nCONTEXT: 2D residential floor plan with double-height ceiling.\nOBJECTIVE: Generate bounding box parameters and physically accurate daylight ray bounces.\nCONSTRAINTS: Cap draw calls under 60; enforce PBR energy conservation."
      }
    ]
  },
  {
    id: "refractive-material",
    number: "EXP-02",
    title: "REFRACTIVE MATERIAL CALIBRATOR",
    category: "3D · WEBGL MATERIALS",
    status: "REAL-TIME INTERACTIVE",
    description: "A physical shader laboratory allowing visitors to manipulate smoked glass transmission, surface roughness, and optical index of refraction (IOR) directly in WebGL.",
    tags: ["Three.js", "PBR Shading", "Physical Optics"],
    defaultParams: {
      transmission: 0.88,
      roughness: 0.08,
      ior: 1.55,
      metalness: 0.15
    }
  },
  {
    id: "kinetic-spring",
    number: "EXP-03",
    title: "KINETIC SPRING PHYSICS",
    category: "INTERACTION · MICRO-ERGONOMICS",
    status: "PHYSICS ENGINE",
    description: "Interactive harmonic oscillation playground evaluating spring mass, tension, and friction curves used for magnetic cursor interfaces and spatial glass card reveals.",
    tags: ["Kinetic Physics", "Damped Harmonics", "Micro-Interactions"],
    presets: [
      { name: "Snappy", stiffness: 280, damping: 22, mass: 1 },
      { name: "Ethereal", stiffness: 120, damping: 14, mass: 1.2 },
      { name: "Damped", stiffness: 200, damping: 35, mass: 1.5 }
    ]
  },
  {
    id: "state-pipeline",
    number: "EXP-04",
    title: "STATE PIPELINE VISUALIZER",
    category: "SYSTEMS · TRANSFORMATION GRAPH",
    status: "CONCEPT PROTOTYPE",
    description: "Interactive visual state machine demonstrating the core Gokul Labs architectural doctrine: IDEA → INTELLIGENCE → CODE → PRODUCT.",
    tags: ["State Machines", "System Architecture", "Visual Logic"],
    stages: [
      { id: "idea", label: "01 IDEA", concept: "Problem Definition & Hypothesis Formulation" },
      { id: "intel", label: "02 INTELLIGENCE", concept: "Model Selection, Heuristics & Feasibility Matrix" },
      { id: "code", label: "03 CODE", concept: "Type-Safe Architecture, Clean Contracts & Tests" },
      { id: "prod", label: "04 PRODUCT", concept: "Deployment, Accessibility, Real-World Interaction" }
    ]
  }
];

if (typeof window !== "undefined") {
  window.LAB_EXPERIMENTS = LAB_EXPERIMENTS;
}

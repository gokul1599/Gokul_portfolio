/**
 * GOKUL LABS — CINEMATIC 3D DIGITAL LABORATORY ENGINE v6.1
 * Award-Winning 3D Spatial Experience & Interactive AI Product Showcase
 *
 * Core Guarantee:
 *  - 100% Content Visibility: All content, text, links, and projects are ALWAYS visible and accessible.
 *  - Zero Blocking: No full-screen blocking veils or hidden opacities.
 *  - Continuous 3D WebGL Atmosphere: Active at 60 FPS in canvas background (z-index: 0).
 */

(function () {
  "use strict";

  /* ============================================================
     UTILITIES & MATHEMATICAL EASING
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* ============================================================
     GUARANTEE 100% CONTENT VISIBILITY (Instant Fallback & Reveal)
     ============================================================ */
  function initScrollReveal() {
    const reveals = $$(
      ".reveal, .reveal-fade, .reveal-stagger > *, .reveal-left, .reveal-right, .reveal-scale, .stage-card, .project-card, .stack-card, .timeline-milestone"
    );

    // Force all elements to be immediately visible so no content is ever missed
    reveals.forEach((el) => {
      el.classList.add("visible");
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.visibility = "visible";
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              entry.target.style.opacity = "1";
              entry.target.style.transform = "none";
            }
          });
        },
        { threshold: 0.05, rootMargin: "60px" }
      );
      reveals.forEach((el) => observer.observe(el));
    }
  }
  initScrollReveal();

  /* ============================================================
     LIVE CLOCK & METADATA
     ============================================================ */
  const liveClockEl = $("#live-clock");
  function updateLiveClock() {
    if (!liveClockEl) return;
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    liveClockEl.textContent = `${String(h).padStart(2, "0")}:${m} ${ampm}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  const yearEl = $("#copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     SCROLL PROGRESS & JOURNEY TRACKER
     ============================================================ */
  const progressBar = $("#scroll-progress");
  const trackerFill = $("#tracker-fill");
  const journeySteps = $$(".tracker-step", $("#journey-tracker"));
  const navbar = $("#navbar");
  const sections = $$("section[id]");
  let globalScrollProgress = 0;

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    globalScrollProgress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;

    if (progressBar) progressBar.style.width = `${globalScrollProgress * 100}%`;
    if (trackerFill) trackerFill.style.width = `${globalScrollProgress * 100}%`;

    const trackerDot = $("#scroll-tracker-dot");
    if (trackerDot) trackerDot.style.top = `${globalScrollProgress * 65}px`;

    if (navbar) navbar.classList.toggle("scrolled", scrollTop > 30);

    // Journey tracker active checkpoint
    let activeCheckpoint = "hero";
    if (globalScrollProgress >= 0.88) activeCheckpoint = "contact";
    else if (globalScrollProgress >= 0.78) activeCheckpoint = "journey";
    else if (globalScrollProgress >= 0.54) activeCheckpoint = "work";
    else if (globalScrollProgress >= 0.40) activeCheckpoint = "stack";
    else if (globalScrollProgress >= 0.22) activeCheckpoint = "about";
    else activeCheckpoint = "hero";

    journeySteps.forEach((step) => {
      step.classList.toggle("active", step.getAttribute("data-target") === activeCheckpoint);
    });

    // Dynamic nav link active state
    let current = "";
    sections.forEach((s) => {
      if (scrollTop >= s.offsetTop - 220) current = s.getAttribute("id");
    });
    if (current) {
      $$(".nav-link-dot").forEach((l) =>
        l.classList.toggle("active", l.getAttribute("href") === `#${current}`)
      );
    }

    // Intelligence Core Stage Cards highlight sync
    const stageCards = $$(".stage-card");
    if (stageCards.length >= 4) {
      let activeStage = 1;
      if (globalScrollProgress >= 0.28) activeStage = 4;
      else if (globalScrollProgress >= 0.24) activeStage = 3;
      else if (globalScrollProgress >= 0.20) activeStage = 2;
      else if (globalScrollProgress >= 0.16) activeStage = 1;

      if (globalScrollProgress >= 0.14 && globalScrollProgress <= 0.34) {
        stageCards.forEach((c, idx) => {
          c.classList.toggle("active", idx + 1 === activeStage);
        });
      }
    }

    // Builder Principles Sequential Activation on Scroll (01 BUILD -> 02 LEARN -> 03 REPEAT)
    const principlesSection = $("#builder-principles");
    if (principlesSection) {
      const rect = principlesSection.getBoundingClientRect();
      const pCards = $$(".principle-card", principlesSection);
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        const pProgress = clamp((window.innerHeight * 0.88 - rect.top) / (window.innerHeight * 0.55), 0, 1);
        pCards.forEach((c, idx) => {
          const threshold = (idx + 1) * 0.28;
          c.classList.toggle("active", pProgress >= threshold);
        });
      }
    }

    // Journey Credo Line Sequential Activation (BUILD -> LEARN -> REPEAT)
    const credoStrip = $("#journey-credo-strip");
    if (credoStrip) {
      const cRect = credoStrip.getBoundingClientRect();
      const laserBeam = $("#credo-laser-beam");
      const cWords = $$(".credo-word", credoStrip);
      const cArrows = $$(".credo-arrow", credoStrip);

      if (cRect.top < window.innerHeight * 0.92 && cRect.bottom > 0) {
        const cProgress = clamp((window.innerHeight * 0.92 - cRect.top) / (window.innerHeight * 0.45), 0, 1);
        if (laserBeam) laserBeam.style.width = `${cProgress * 100}%`;

        if (cWords[0]) cWords[0].classList.toggle("active", cProgress >= 0.15);
        if (cArrows[0]) cArrows[0].classList.toggle("active", cProgress >= 0.35);
        if (cWords[1]) cWords[1].classList.toggle("active", cProgress >= 0.55);
        if (cArrows[1]) cArrows[1].classList.toggle("active", cProgress >= 0.75);
        if (cWords[2]) cWords[2].classList.toggle("active", cProgress >= 0.9);
      }
    }

    // Work Section 3-Project Sequential Active Tracking
    const projectCards = $$(".project-card");
    if (projectCards.length >= 3) {
      let activeProjIndex = 0;
      projectCards.forEach((pc, idx) => {
        const pRect = pc.getBoundingClientRect();
        if (pRect.top <= window.innerHeight * 0.55 && pRect.bottom >= window.innerHeight * 0.15) {
          activeProjIndex = idx;
        }
      });
      const dockItems = $$(".nav-dock-item");
      dockItems.forEach((di, idx) => {
        di.classList.toggle("active", idx === activeProjIndex);
      });
      const activeIndicator = $("#work-active-indicator");
      if (activeIndicator) {
        activeIndicator.textContent = `0${activeProjIndex + 1}`;
      }
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ============================================================
     MOBILE NAVIGATION DRAWER
     ============================================================ */
  const menuBtn = $("#menu-btn");
  const navMenu = $("#nav-menu");
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuBtn.classList.toggle("active", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    $$(".nav-link-dot", navMenu).forEach((l) =>
      l.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuBtn.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL
     ============================================================ */
  $$("a[href^='#']").forEach((a) => {
    a.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ============================================================
     HERO ENTRANCE (Immediate 100% Content Guarantee)
     ============================================================ */
  function initHeroEntrance() {
    const kicker = $(".hero-kicker-cinematic");
    const titleRows = $$(".hero-title-cinematic .title-row");
    const desc = $(".hero-description-cinematic");
    const buttons = $$(".hero-buttons-cinematic > *");
    const terminal = $(".hero-terminal-window");
    const hudChips = $$(".floating-hud");
    const bottomBar = $(".hero-bottom-bar");

    const allHeroEls = [kicker, ...titleRows, desc, ...buttons, terminal, ...hudChips, bottomBar];
    allHeroEls.forEach((el) => {
      if (!el) return;
      el.style.opacity = "1";
      el.style.filter = "none";
      el.style.transform = "none";
      el.style.visibility = "visible";
    });
  }
  initHeroEntrance();

  /* ============================================================
     INTERACTIVE AI LABORATORY TERMINAL (Hero Stage)
     ============================================================ */
  function initTerminalEngine() {
    const tabs = $$(".terminal-tab");
    const panels = $$(".terminal-tab-panel");
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");
        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        panels.forEach((p) => p.classList.remove("active"));

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        const activePanel = $(`#tab-${target}`);
        if (activePanel) {
          activePanel.classList.add("active");
        }
      });
    });
  }
  initTerminalEngine();

  /* ============================================================
     ABOUT SECTION: EXECUTABLE BUILDER TERMINAL TYPING ENGINE
     (Types code line-by-letter on viewport entrance)
     ============================================================ */
  function initBuilderTerminalTyping() {
    const codeContainer = $("#dynamic-builder-code");
    const statusText = $("#terminal-status-text");
    const termOutput = $("#builder-terminal-output");
    const readyBadge = $("#system-ready-badge");
    const termWrapper = $("#about-builder-terminal");
    if (!codeContainer || !termWrapper) return;

    let hasTyped = false;

    const fullLines = [
      '<span class="code-keyword">const</span> <span class="code-variable">builder</span> = {',
      '  <span class="code-property">name</span>: <span class="code-string">"Gokul"</span>,',
      '  <span class="code-property">focus</span>: [<span class="code-string">"AI"</span>, <span class="code-string">"Web"</span>],',
      '  <span class="code-property">shipping</span>: <span class="code-keyword">true</span>,',
      '  <span class="code-property">ideas</span>: <span class="code-number">Infinity</span>',
      '};',
      '',
      '<span class="code-function">system.ready()</span>;'
    ];

    function startTyping() {
      if (hasTyped) return;
      hasTyped = true;

      codeContainer.innerHTML = "";
      let lineIndex = 0;

      function typeNextLine() {
        if (lineIndex < fullLines.length) {
          codeContainer.innerHTML += (lineIndex > 0 ? "\n" : "") + fullLines[lineIndex];
          lineIndex++;
          setTimeout(typeNextLine, 140);
        } else {
          // Finished typing: activate ready badge & status
          if (statusText) statusText.textContent = "ONLINE";
          const pulseDot = $("#terminal-pulse-dot");
          if (pulseDot) {
            pulseDot.classList.remove("pulse-dot-cyan");
            pulseDot.classList.add("pulse-dot-green");
          }
          if (readyBadge) {
            readyBadge.style.boxShadow = "0 0 16px rgba(181, 255, 77, 0.4)";
          }
          if (termOutput) {
            termOutput.textContent = ">>> System ready: [AI, Web] active. Shipping ideas to production.";
          }

          // Cycle subtle diagnostic messages periodically
          const diagMessages = [
            ">>> Ready: [AI, Web] active. Shipping ideas to production.",
            ">>> Neural pipeline initialized: Latency <12ms // 0 errors.",
            ">>> Deployed verification: VALTORA (Startup AI) & LifeHub (Daily OS).",
            ">>> Continuous laboratory loop: [ideas: ∞, shipping: true]."
          ];
          let dIdx = 0;
          setInterval(() => {
            dIdx = (dIdx + 1) % diagMessages.length;
            termOutput.style.opacity = "0";
            setTimeout(() => {
              termOutput.textContent = diagMessages[dIdx];
              termOutput.style.opacity = "1";
            }, 250);
          }, 4800);
        }
      }

      setTimeout(typeNextLine, 200);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startTyping();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(termWrapper);
    } else {
      startTyping();
    }
  }
  initBuilderTerminalTyping();

  /* ============================================================
     DYNAMIC SPECULAR SPOTLIGHT, PARALLAX & CARD TILTS
     ============================================================ */
  let rawMouseNormX = 0, rawMouseNormY = 0;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  function initSpecularTracking() {
    const tiltCards = $$(".tilt-card");
    const ringBuild = $(".ring-build");
    const ringLearn = $(".ring-learn");
    const ringRepeat = $(".ring-repeat");

    window.addEventListener(
      "mousemove",
      (e) => {
        rawMouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
        rawMouseNormY = (e.clientY / window.innerHeight) * 2 - 1;

        if (isTouch) return;

        // Parallax on Monolith Identity Core rings
        if (ringBuild && ringLearn && ringRepeat) {
          ringBuild.style.transform = `translate(${rawMouseNormX * 10}px, ${rawMouseNormY * 8}px)`;
          ringLearn.style.transform = `translate(${rawMouseNormX * -8}px, ${rawMouseNormY * -6}px)`;
          ringRepeat.style.transform = `translate(${rawMouseNormX * 6}px, ${rawMouseNormY * -4}px)`;
        }

        tiltCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          if (
            e.clientX >= rect.left - 60 &&
            e.clientX <= rect.right + 60 &&
            e.clientY >= rect.top - 60 &&
            e.clientY <= rect.bottom + 60
          ) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const maxTilt = parseFloat(card.dataset.tilt) || 6;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = -((y - cy) / cy) * maxTilt;
            const rotY = ((x - cx) / cx) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px)`;
          } else {
            if (card.style.transform && card.style.transform !== "none") {
              card.style.transform = "none";
            }
          }
        });
      },
      { passive: true }
    );

    tiltCards.forEach((card) => {
      card.addEventListener("mouseleave", () => {
        card.style.transform = "none";
      });
    });
  }
  initSpecularTracking();

  /* ============================================================
     MAGNETIC CTA BUTTONS (Smooth Spring Pull & Light Sweep)
     ============================================================ */
  function initMagneticButtons() {
    if (isTouch) return;
    const magneticElements = $$(
      ".btn-glow-cyan, .cta-pill-glass, .btn-live, .btn-large, .magnetic-btn, .btn-source, .cta-contact-trigger"
    );
    magneticElements.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${mx * 0.28}px, ${my * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }
  initMagneticButtons();

  /* ============================================================
     MINIMALIST CUSTOM CURSOR (Desktop)
     ============================================================ */
  const cursorDot = $("#cursor-dot");
  const cursorRing = $("#cursor-ring");
  const cursorGlow = $(".cursor-glow");

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorGlow) {
          cursorGlow.style.left = `${mouseX}px`;
          cursorGlow.style.top = `${mouseY}px`;
        }
      },
      { passive: true }
    );

    function animateCursorSystem() {
      dotX = lerp(dotX, mouseX, 0.85);
      dotY = lerp(dotY, mouseY, 0.85);
      ringX = lerp(ringX, mouseX, 0.25);
      ringY = lerp(ringY, mouseY, 0.25);

      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursorSystem);
    }
    animateCursorSystem();

    const interactiveElements = $$(
      "a, button, input, .tilt-card, .terminal-tab, .stage-card, .project-card, .stack-card, .tracker-step, .strata-step"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (cursorRing) cursorRing.classList.add("active");
      });
      el.addEventListener("mouseleave", () => {
        if (cursorRing) cursorRing.classList.remove("active");
      });
    });

    window.addEventListener("mousedown", () => {
      if (cursorRing) cursorRing.classList.add("clicking");
    });
    window.addEventListener("mouseup", () => {
      if (cursorRing) cursorRing.classList.remove("clicking");
    });
  }

  /* ============================================================
     STAGE CARDS INTERACTION
     ============================================================ */
  const stageCards = $$(".stage-card");
  stageCards.forEach((card) => {
    card.addEventListener("click", () => {
      stageCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  /* ============================================================
     AWARD-WINNING 3D WEBGL DIGITAL LABORATORY ENGINE
     Complete 20-Point Specification Implementation
     Runs in canvas background (z-index: 0) behind all content
     ============================================================ */
  const canvasEl = $("#webgl-canvas");
  if (canvasEl) initDigitalLaboratory(canvasEl);

  function initDigitalLaboratory(canvas) {
    if (typeof THREE === "undefined") {
      initFallback2D(canvas);
      return;
    }

    try {
      /* --- 1. Scene & Deep Atmosphere ----------------------------- */
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050608, 0.0085);

      /* --- 2. Cinematic Perspective Camera ------------------------ */
      const camera = new THREE.PerspectiveCamera(
        46,
        window.innerWidth / window.innerHeight,
        0.1,
        280
      );
      camera.position.set(0, 0, 24);

      /* --- 3. High Dynamic Range WebGL Renderer ------------------- */
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      /* --- 4. Master World Group ---------------------------------- */
      const worldGroup = new THREE.Group();
      scene.add(worldGroup);

      /* --- 5. Volumetric Lighting Rig ----------------------------- */
      const ambientLight = new THREE.AmbientLight(0x081226, 1.4);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
      keyLight.position.set(14, 18, 22);
      scene.add(keyLight);

      const rimCyan = new THREE.PointLight(0x38bdf8, 3.8, 75);
      rimCyan.position.set(18, 6, 14);
      scene.add(rimCyan);

      const backViolet = new THREE.PointLight(0x6366f1, 2.6, 65);
      backViolet.position.set(-18, -8, 10);
      scene.add(backViolet);

      const cursorSpotlight = new THREE.PointLight(0x38bdf8, 3.4, 45);
      cursorSpotlight.position.set(0, 0, 14);
      scene.add(cursorSpotlight);

      /* ============================================================
         6. THE HERO INTELLIGENCE CORE SYSTEM (Requirements 1, 4, 5)
         - Central Idea Point Singularity
         - Faceted Outer Glass Crystal Core
         - 3 Thin Concentric Orbital Coordinate Rings
         - 4 Orbital Satellite Nodes (UNDERSTAND, RESEARCH, CHALLENGE, BUILD)
         ============================================================ */
      const coreGroup = new THREE.Group();
      coreGroup.position.set(0, 0, 0);
      worldGroup.add(coreGroup);

      // 6A. Central Singularity Core ("The Idea Point of Light")
      const singularityGeo = new THREE.SphereGeometry(0.38, 24, 24);
      const singularityMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1.0
      });
      const singularityPoint = new THREE.Mesh(singularityGeo, singularityMat);
      coreGroup.add(singularityPoint);

      const singularityLight = new THREE.PointLight(0x38bdf8, 3.5, 24);
      coreGroup.add(singularityLight);

      const coronaGeo = new THREE.RingGeometry(0.42, 0.95, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      coreGroup.add(coronaMesh);

      // 6B. Faceted Futuristic Glass Crystal Intelligence Core
      const crystalGeo = new THREE.IcosahedronGeometry(2.4, 1);
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x07152b,
        metalness: 0.15,
        roughness: 0.05,
        transmission: 0.88,
        reflectivity: 0.85,
        ior: 1.55,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      coreGroup.add(crystalMesh);

      const crystalEdgesGeo = new THREE.EdgesGeometry(crystalGeo);
      const crystalEdgesMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const crystalEdges = new THREE.LineSegments(crystalEdgesGeo, crystalEdgesMat);
      coreGroup.add(crystalEdges);

      // 6C. 3 Thin Coordinate Orbital Rings
      const orbitalRingsGroup = new THREE.Group();
      orbitalRingsGroup.scale.set(1, 1, 1);
      coreGroup.add(orbitalRingsGroup);

      function createOrbitalRing(radius, tube, colorHex, tiltX, tiltY) {
        const ringGeo = new THREE.TorusGeometry(radius, tube, 12, 128);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = tiltX;
        ring.rotation.y = tiltY;
        orbitalRingsGroup.add(ring);
        return ring;
      }

      const ringInner = createOrbitalRing(3.8, 0.02, 0x38bdf8, Math.PI * 0.28, Math.PI * 0.15);
      const ringMid = createOrbitalRing(5.2, 0.02, 0x00f0ff, -Math.PI * 0.32, Math.PI * 0.25);
      const ringOuter = createOrbitalRing(6.6, 0.02, 0x818cf8, Math.PI * 0.12, -Math.PI * 0.35);

      // 6D. 4 Orbital Satellite Systems (UNDERSTAND, RESEARCH, CHALLENGE, BUILD)
      const orbitalNodes = [];
      const nodeLabels = ["UNDERSTAND", "RESEARCH", "CHALLENGE", "BUILD"];
      const nodeColors = [0x38bdf8, 0x00f0ff, 0xa78bfa, 0xb5ff4d];

      for (let i = 0; i < 4; i++) {
        const nodeGroup = new THREE.Group();
        const nGeo = new THREE.OctahedronGeometry(0.3, 0);
        const nMat = new THREE.MeshStandardMaterial({
          color: nodeColors[i],
          emissive: nodeColors[i],
          emissiveIntensity: 0.5,
          metalness: 0.5,
          roughness: 0.2
        });
        const nMesh = new THREE.Mesh(nGeo, nMat);
        nodeGroup.add(nMesh);

        const lineGeo = new THREE.BufferGeometry();
        const linePos = new Float32Array([0, 0, 0, 0, 0, 0]);
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
        const lineMat = new THREE.LineBasicMaterial({
          color: nodeColors[i],
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        });
        const connector = new THREE.Line(lineGeo, lineMat);
        worldGroup.add(connector);

        nodeGroup.userData = {
          name: nodeLabels[i],
          color: nodeColors[i],
          phase: i,
          mesh: nMesh,
          connector,
          angle: (i / 4) * Math.PI * 2,
          radius: 5.2
        };

        orbitalRingsGroup.add(nodeGroup);
        orbitalNodes.push(nodeGroup);
      }

      /* ============================================================
         7. ABOUT SECTION: 5 ARCHITECTURAL GLASS STRATA PANELS (Req 6)
         ============================================================ */
      const strataPanels = [];
      const strataNames = ["PROBLEM", "RESEARCH", "TECHNOLOGY", "PRODUCT", "EXECUTION"];
      const strataGroup = new THREE.Group();
      worldGroup.add(strataGroup);

      for (let k = 0; k < 5; k++) {
        const pBoxGeo = new THREE.BoxGeometry(7.2, 4.2, 0.28);
        const pBoxMat = new THREE.MeshPhysicalMaterial({
          color: 0x081326,
          metalness: 0.2,
          roughness: 0.08,
          transmission: 0.85,
          transparent: true,
          opacity: 0.5,
          depthWrite: false
        });
        const pMesh = new THREE.Mesh(pBoxGeo, pBoxMat);

        const pEdgeGeo = new THREE.EdgesGeometry(pBoxGeo);
        const pEdgeMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        const pEdges = new THREE.LineSegments(pEdgeGeo, pEdgeMat);

        const panelG = new THREE.Group();
        panelG.add(pMesh);
        panelG.add(pEdges);

        panelG.position.set((k - 2) * 3.2, (2 - k) * 0.9, -16 - k * 4.2);
        panelG.rotation.set(0.12, (k - 2) * 0.08, 0);
        panelG.userData = { name: strataNames[k], index: k, edges: pEdges };

        strataGroup.add(panelG);
        strataPanels.push(panelG);
      }

      /* ============================================================
         8. TOOLKIT SECTION: 3D TECHNICAL GRID (9 Modules, Req 7)
         ============================================================ */
      const toolkitGroup = new THREE.Group();
      toolkitGroup.position.set(0, -6, -38);
      worldGroup.add(toolkitGroup);

      const skillModules = [];
      const skillNames = [
        "Python", "Java", "C++",
        "HTML", "CSS", "JavaScript",
        "AI/ML", "Git/GitHub", "Product Thinking"
      ];
      const skillColors = [
        0xb5ff4d, 0x38bdf8, 0x00f0ff,
        0xf97316, 0x38bdf8, 0xfacc15,
        0x818cf8, 0xec4899, 0x38bdf8
      ];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const idx = row * 3 + col;
          const sGeo = new THREE.BoxGeometry(3.6, 2.2, 0.22);
          const sMat = new THREE.MeshPhysicalMaterial({
            color: 0x060d1b,
            metalness: 0.35,
            roughness: 0.05,
            transmission: 0.8,
            transparent: true,
            opacity: 0.55
          });
          const sMesh = new THREE.Mesh(sGeo, sMat);

          const sEdgeGeo = new THREE.EdgesGeometry(sGeo);
          const sEdgeMat = new THREE.LineBasicMaterial({
            color: skillColors[idx],
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending
          });
          const sEdges = new THREE.LineSegments(sEdgeGeo, sEdgeMat);

          const modG = new THREE.Group();
          modG.add(sMesh);
          modG.add(sEdges);

          const posX = (col - 1) * 5.2;
          const posY = (1 - row) * 3.4;
          modG.position.set(posX, posY, 0);
          modG.userData = {
            name: skillNames[idx],
            origX: posX,
            origY: posY,
            color: skillColors[idx],
            edges: sEdges
          };

          toolkitGroup.add(modG);
          skillModules.push(modG);
        }
      }

      /* ============================================================
         9. VALTORA SHOWCASE 3D PRODUCT FRAME (Requirement 8)
         ============================================================ */
      const valtoraGroup = new THREE.Group();
      valtoraGroup.position.set(0, -4, -62);
      worldGroup.add(valtoraGroup);

      const vFrameGeo = new THREE.BoxGeometry(14.5, 8.5, 0.4);
      const vFrameMat = new THREE.MeshPhysicalMaterial({
        color: 0x091428,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.65
      });
      const vFrameMesh = new THREE.Mesh(vFrameGeo, vFrameMat);
      valtoraGroup.add(vFrameMesh);

      const vFrameEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(vFrameGeo),
        new THREE.LineBasicMaterial({ color: 0xb5ff4d, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
      );
      valtoraGroup.add(vFrameEdges);

      /* ============================================================
         10. INTER-PROJECT SINGULARITY TRANSFORMATION POINT (Req 9)
         ============================================================ */
      const singularityPortalGroup = new THREE.Group();
      singularityPortalGroup.position.set(0, -2, -78);
      worldGroup.add(singularityPortalGroup);

      const portalCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
      );
      singularityPortalGroup.add(portalCore);

      const portalLight = new THREE.PointLight(0x38bdf8, 3.5, 45);
      singularityPortalGroup.add(portalLight);

      /* ============================================================
         11. LIFEHUB SHOWCASE MODULAR FLOATING LAYERS (Requirement 9)
         ============================================================ */
      const lifehubGroup = new THREE.Group();
      lifehubGroup.position.set(0, -3, -95);
      worldGroup.add(lifehubGroup);

      const lifehubLayers = [];
      const lhColors = [0x38bdf8, 0x00f0ff, 0x818cf8, 0x38bdf8];

      for (let l = 0; l < 4; l++) {
        const lhGeo = new THREE.BoxGeometry(11.0 - l * 1.5, 6.5 - l * 0.9, 0.2);
        const lhMat = new THREE.MeshPhysicalMaterial({
          color: 0x08162e,
          metalness: 0.15,
          roughness: 0.06,
          transmission: 0.82,
          transparent: true,
          opacity: 0.6
        });
        const lhMesh = new THREE.Mesh(lhGeo, lhMat);

        const lhEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(lhGeo),
          new THREE.LineBasicMaterial({ color: lhColors[l], transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
        );

        const layerG = new THREE.Group();
        layerG.add(lhMesh);
        layerG.add(lhEdges);
        layerG.position.set((l - 1.5) * 1.8, (l - 1.5) * 0.7, -l * 3.5);

        lifehubGroup.add(layerG);
        lifehubLayers.push(layerG);
      }

      /* ============================================================
         11B. TELUGUVA AMBIENT EDITORIAL GLYPH PRISM (Warm Amber)
         ============================================================ */
      const teluguvaGroup = new THREE.Group();
      teluguvaGroup.position.set(0, -2.5, -108);
      worldGroup.add(teluguvaGroup);

      const teluguvaRing = new THREE.Mesh(
        new THREE.TorusGeometry(6.2, 0.06, 16, 64),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.25 })
      );
      teluguvaGroup.add(teluguvaRing);

      const teluguvaLight = new THREE.PointLight(0xf59e0b, 1.8, 30);
      teluguvaGroup.add(teluguvaLight);

      /* ============================================================
         12. JOURNEY 3D TRAJECTORY TIMELINE (Requirement 11)
         ============================================================ */
      const journeyTrajectoryGroup = new THREE.Group();
      journeyTrajectoryGroup.position.set(0, -2, -138);
      worldGroup.add(journeyTrajectoryGroup);

      const splinePoints = [
        new THREE.Vector3(-8, 3, -15),
        new THREE.Vector3(-3, 0, -8),
        new THREE.Vector3(2, -1, 0),
        new THREE.Vector3(6, 2, 8),
        new THREE.Vector3(10, 0, 16)
      ];
      const splineCurve = new THREE.CatmullRomCurve3(splinePoints);
      const splineGeo = new THREE.BufferGeometry().setFromPoints(splineCurve.getPoints(80));
      const splineLine = new THREE.Line(
        splineGeo,
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
      );
      journeyTrajectoryGroup.add(splineLine);

      const milestoneGroup = new THREE.Group();
      journeyTrajectoryGroup.add(milestoneGroup);
      const milestoneMarkers = [];
      const mCoords = [new THREE.Vector3(-4, 0.6, -9), new THREE.Vector3(1.5, -0.8, 0), new THREE.Vector3(7, 1.6, 9)];

      for (let m = 0; m < 3; m++) {
        const mMesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.48, 0),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.6 })
        );
        mMesh.position.copy(mCoords[m]);
        milestoneGroup.add(mMesh);
        milestoneMarkers.push(mMesh);
      }

      /* ============================================================
         13. CONTACT SECTION: MONOLITHIC GLASS PRECISION RING (Req 12)
         ============================================================ */
      const contactRingGroup = new THREE.Group();
      contactRingGroup.position.set(0, 0, -165);
      worldGroup.add(contactRingGroup);

      const contactRingGeo = new THREE.TorusGeometry(8.2, 0.28, 16, 128);
      const contactRingMat = new THREE.MeshPhysicalMaterial({
        color: 0x06152d,
        metalness: 0.3,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.68,
        depthWrite: false
      });
      const contactRing = new THREE.Mesh(contactRingGeo, contactRingMat);
      contactRingGroup.add(contactRing);

      const contactRingEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(contactRingGeo),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
      );
      contactRingGroup.add(contactRingEdges);

      /* ============================================================
         14. LIVING CYBERNETIC WAVE MATRIX & HORIZON DATA BEAMS
         ============================================================ */
      const waveSegX = 48;
      const waveSegY = 48;
      const waveGeo = new THREE.PlaneGeometry(84, 84, waveSegX, waveSegY);

      const waveWireMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
      });
      const waveMesh = new THREE.Mesh(waveGeo, waveWireMat);
      waveMesh.rotation.x = -Math.PI * 0.44;
      waveMesh.position.set(0, -9.5, -8);
      worldGroup.add(waveMesh);

      const beamCount = 8;
      const beamSegments = [];
      const beamColors = [0x38bdf8, 0x00f0ff, 0xb5ff4d, 0x818cf8];

      for (let b = 0; b < beamCount; b++) {
        const beamLen = 9 + Math.random() * 8;
        const bGeo = new THREE.BufferGeometry();
        const bPos = new Float32Array([0, 0, 0, 0, 0, beamLen]);
        bGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));

        const beam = new THREE.Line(
          bGeo,
          new THREE.LineBasicMaterial({
            color: beamColors[b % beamColors.length],
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
          })
        );
        const laneX = (b - Math.floor(beamCount / 2)) * 7.5;
        const laneY = -9.2;
        beam.position.set(laneX, laneY, -50 - Math.random() * 30);
        beam.userData = { speed: 30 + Math.random() * 20, minZ: -70, maxZ: 14 };

        worldGroup.add(beam);
        beamSegments.push(beam);
      }

      /* ============================================================
         15. INTERACTIVE QUANTUM PHOTON PARTICLES
         ============================================================ */
      const PARTICLE_COUNT = 320;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(PARTICLE_COUNT * 3);
      const pVels = new Float32Array(PARTICLE_COUNT * 3);

      for (let p = 0; p < PARTICLE_COUNT; p++) {
        pPos[p * 3] = (Math.random() - 0.5) * 60;
        pPos[p * 3 + 1] = (Math.random() - 0.5) * 40;
        pPos[p * 3 + 2] = (Math.random() - 0.5) * 36 - 6;
        pVels[p * 3] = (Math.random() - 0.5) * 0.15;
        pVels[p * 3 + 1] = 0.08 + Math.random() * 0.2;
        pVels[p * 3 + 2] = (Math.random() - 0.5) * 0.1;
      }

      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const quantumDust = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 0.11,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        })
      );
      scene.add(quantumDust);

      /* ============================================================
         16. WINDOW RESIZE HANDLER
         ============================================================ */
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      /* ============================================================
         17. ANIMATION LOOP & CONTINUOUS SPATIAL CHOREOGRAPHY
         ============================================================ */
      let smoothMouseX = 0, smoothMouseY = 0;
      let smvx = 0, smvy = 0;
      let smoothScroll = 0;
      const clock = new THREE.Clock();

      function renderFrame() {
        requestAnimationFrame(renderFrame);

        const dt = clock.getDelta();
        const t = clock.getElapsedTime();

        // Smooth scroll interpolation
        smoothScroll = lerp(smoothScroll, globalScrollProgress, 0.075);

        // Mouse damping physics
        smvx = (smvx + (rawMouseNormX - smoothMouseX) * 0.085) * 0.82;
        smvy = (smvy + (rawMouseNormY - smoothMouseY) * 0.085) * 0.82;
        smoothMouseX += smvx;
        smoothMouseY += smvy;

        // Cursor spotlight in 3D camera space
        cursorSpotlight.position.x = smoothMouseX * 18;
        cursorSpotlight.position.y = -smoothMouseY * 13;
        cursorSpotlight.position.z = 12;

        /* ============================================================
           SPATIAL CAMERA CHOREOGRAPHY
           ============================================================ */
        let targetCamX = 0;
        let targetCamY = 0;
        let targetCamZ = 24;

        if (smoothScroll < 0.15) {
          const heroT = smoothScroll / 0.15;
          targetCamZ = lerp(24, 6, heroT);
          targetCamY = lerp(0, -0.6, heroT);
          targetCamX = smoothMouseX * 1.5;
        } else if (smoothScroll < 0.29) {
          const s1T = (smoothScroll - 0.15) / 0.14;
          targetCamZ = lerp(16, 12, s1T);
          targetCamY = lerp(1.5, -0.8, s1T);
          targetCamX = lerp(-2.5, 1.8, s1T);
        } else if (smoothScroll < 0.43) {
          const s2T = (smoothScroll - 0.29) / 0.14;
          targetCamZ = lerp(8, -6, s2T);
          targetCamX = lerp(-5.0, 4.0, s2T);
          targetCamY = lerp(1.0, -1.2, s2T);
        } else if (smoothScroll < 0.57) {
          const s3T = (smoothScroll - 0.43) / 0.14;
          targetCamZ = lerp(-20, -32, s3T);
          targetCamX = lerp(2.5, -2.5, s3T);
          targetCamY = lerp(-3.5, -5.5, s3T);
        } else if (smoothScroll < 0.70) {
          const s4T = (smoothScroll - 0.57) / 0.13;
          targetCamZ = lerp(-46, -56, s4T);
          targetCamX = lerp(-1.5, 1.2, s4T);
          targetCamY = lerp(-4.0, -4.2, s4T);
        } else if (smoothScroll < 0.81) {
          const s4bT = (smoothScroll - 0.70) / 0.11;
          targetCamZ = lerp(-68, -88, s4bT);
          targetCamX = 0;
          targetCamY = lerp(-2.5, -3.2, s4bT);
        } else if (smoothScroll < 0.89) {
          const s5T = (smoothScroll - 0.81) / 0.08;
          targetCamZ = lerp(-102, -120, s5T);
          targetCamX = lerp(3.0, -3.0, s5T);
          targetCamY = lerp(-1.0, -2.5, s5T);
        } else {
          const s6T = (smoothScroll - 0.89) / 0.11;
          targetCamZ = lerp(-140, -158, s6T);
          targetCamX = 0;
          targetCamY = 0;
        }

        camera.position.x = lerp(camera.position.x, targetCamX, 0.06);
        camera.position.y = lerp(camera.position.y, targetCamY, 0.06);
        camera.position.z = lerp(camera.position.z, targetCamZ, 0.06);

        const targetRotY = -smoothMouseX * 0.035;
        const targetRotX = -smoothMouseY * 0.024;
        camera.rotation.y = lerp(camera.rotation.y, targetRotY, 0.05);
        camera.rotation.x = lerp(camera.rotation.x, targetRotX, 0.05);

        /* --- 18. ANIMATION OF 3D ELEMENTS ------------------------- */

        // A. Intelligence Core & Orbital Rings
        coreGroup.rotation.y = t * 0.28 + smoothScroll * 4.0;
        coreGroup.rotation.x = Math.sin(t * 0.25) * 0.08;

        ringInner.rotation.z = t * 0.35;
        ringMid.rotation.z = -t * 0.28;
        ringOuter.rotation.z = t * 0.22;

        const pulse = 1.0 + Math.sin(t * 2.2) * 0.12;
        singularityPoint.scale.set(pulse, pulse, pulse);
        coronaMesh.scale.set(pulse * 1.1, pulse * 1.1, pulse * 1.1);

        // B. Orbital Satellite Nodes & Laser Connectors
        orbitalNodes.forEach((nodeG, idx) => {
          const u = nodeG.userData;
          const currAngle = u.angle + t * 0.45;
          const nx = Math.cos(currAngle) * u.radius;
          const ny = Math.sin(currAngle) * u.radius * 0.75;
          const nz = Math.sin(currAngle) * u.radius * 0.4;
          nodeG.position.set(nx, ny, nz);

          const cPos = u.connector.geometry.attributes.position.array;
          cPos[0] = coreGroup.position.x;
          cPos[1] = coreGroup.position.y;
          cPos[2] = coreGroup.position.z;
          cPos[3] = coreGroup.position.x + nx;
          cPos[4] = coreGroup.position.y + ny;
          cPos[5] = coreGroup.position.z + nz;
          u.connector.geometry.attributes.position.needsUpdate = true;

          const threshold = 0.16 + idx * 0.035;
          const isActivated = smoothScroll >= threshold;
          u.mesh.material.emissiveIntensity = isActivated ? 1.4 : 0.4;
          u.connector.material.opacity = isActivated ? 0.75 : 0.25;
        });

        // C. About Strata Panels Sequential Depth
        strataPanels.forEach((p, idx) => {
          p.position.y = (2 - idx) * 0.9 + Math.sin(t * 0.4 + idx) * 0.15;
        });

        // D. Toolkit 3D Technical Grid
        const stackProgress = smoothstep(0.42, 0.56, smoothScroll);
        skillModules.forEach((mod, idx) => {
          const actT = smoothstep(idx * 0.1, (idx + 1) * 0.1, stackProgress);
          mod.rotation.y = Math.sin(t * 0.5 + idx) * 0.08 + actT * 0.15;
          mod.position.z = actT * 1.2;
        });

        // E. VALTORA & Singularity Portal
        const transProgress = smoothstep(0.68, 0.74, smoothScroll);
        const vScale = clamp(1.0 - transProgress * 0.85, 0.15, 1.0);
        valtoraGroup.scale.set(vScale, vScale, vScale);

        const portalFlare = smoothstep(0.70, 0.75, smoothScroll) * (1.0 - smoothstep(0.76, 0.82, smoothScroll));
        portalCore.scale.set(1.0 + portalFlare * 3.5, 1.0 + portalFlare * 3.5, 1.0 + portalFlare * 3.5);
        portalLight.intensity = 3.5 + portalFlare * 4.0;

        // F. LifeHub Floating Layers
        const lhProgress = smoothstep(0.74, 0.82, smoothScroll);
        lifehubLayers.forEach((layer, idx) => {
          layer.position.x = (idx - 1.5) * 1.8 * lhProgress + Math.sin(t * 0.4 + idx) * 0.15;
          layer.position.y = (idx - 1.5) * 0.7 * lhProgress + Math.cos(t * 0.35 + idx) * 0.15;
        });

        // G. Journey Milestones
        milestoneMarkers.forEach((m, idx) => {
          m.rotation.y = t * 0.8 + idx;
        });

        // H. Contact Ring
        contactRingGroup.rotation.z = t * 0.12;
        contactRingGroup.rotation.y = Math.sin(t * 0.2) * 0.15;

        // I. Data Beams
        for (let b = 0; b < beamSegments.length; b++) {
          const beam = beamSegments[b];
          beam.position.z += beam.userData.speed * dt;
          if (beam.position.z > beam.userData.maxZ) {
            beam.position.z = beam.userData.minZ;
          }
        }

        // J. Living Wave Terrain
        const posAttr = waveGeo.attributes.position;
        const vertexCount = posAttr.count;
        const mouseWaveX = smoothMouseX * 28;
        const mouseWaveY = smoothMouseY * 24;

        for (let v = 0; v < vertexCount; v++) {
          const u = posAttr.getX(v);
          const w = posAttr.getY(v);

          const wave1 = Math.sin(u * 0.08 + t * 0.75) * Math.cos(w * 0.08 + t * 0.55) * 2.8;
          const wave2 = Math.sin((u + w) * 0.05 + t * 0.95) * 1.6;

          const dx = u - mouseWaveX;
          const dy = w - mouseWaveY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ripple = Math.exp(-dist * 0.09) * Math.sin(dist * 0.45 - t * 4.2) * 2.2;

          posAttr.setZ(v, wave1 + wave2 + ripple);
        }
        posAttr.needsUpdate = true;

        // K. Quantum Particles
        const pPositions = pGeo.attributes.position.array;
        const cursorWorldX = smoothMouseX * 22;
        const cursorWorldY = -smoothMouseY * 16;

        for (let p = 0; p < PARTICLE_COUNT; p++) {
          let px = pPositions[p * 3];
          let py = pPositions[p * 3 + 1];
          let pz = pPositions[p * 3 + 2];

          py += pVels[p * 3 + 1] * dt * 3.2;
          if (py > 22) {
            py = -22;
            px = (Math.random() - 0.5) * 60;
          }

          px += Math.sin(t * 0.35 + p) * 0.015;

          const pdx = px - cursorWorldX;
          const pdy = py - cursorWorldY;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pDist < 7.5) {
            const push = (1.0 - pDist / 7.5) * 0.16;
            px += pdx * push;
            py += pdy * push;
          }

          pPositions[p * 3] = px;
          pPositions[p * 3 + 1] = py;
          pPositions[p * 3 + 2] = pz;
        }
        pGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      }

      renderFrame();

    } catch (err) {
      console.warn("Digital Laboratory WebGL fallback:", err);
      initFallback2D(canvas);
    }
  }

  /* ============================================================
     2D CANVAS FALLBACK ENGINE
     ============================================================ */
  function initFallback2D(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
    let t = 0;
    function draw() {
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = `rgba(56,189,248,${0.05 + Math.sin(t * 0.02) * 0.02})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 280 + Math.sin(t * 0.015) * 8, cy - 180, 560, 360);
      ctx.strokeStyle = `rgba(148,163,184,${0.05 + Math.cos(t * 0.012) * 0.02})`;
      ctx.strokeRect(cx - 160, cy - 120 + Math.cos(t * 0.018) * 6, 320, 240);
      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ============================================================
     PROJECTS REGISTRY & QUICK NAVIGATOR
     ============================================================ */
  window.PROJECTS = [
    {
      id: "valtora",
      title: "VALTORA",
      subtitle: "AI CO-FOUNDER",
      tagline: "Turn an idea into a company.",
      description: "An analytical AI co-founder designed to turn startup ideas into structured validation, strategy, architecture and execution.",
      live: "https://valtora-swart.vercel.app/",
      github: "https://github.com/gokul1599/valtora",
      labels: ["AI", "STARTUP", "PRODUCT", "WEB"]
    },
    {
      id: "lifehub",
      title: "LIFEHUB",
      subtitle: "PERSONAL LIFE SYSTEM",
      tagline: "Your life. One intelligent space.",
      description: "A digital life-management experience designed to bring schedules, reminders, expenses, weather and everyday organization into one intelligent workspace.",
      live: "https://lifehub-sage.vercel.app/",
      github: "https://github.com/gokul1599/lifehub",
      labels: ["AI", "PRODUCTIVITY", "WEB", "SYSTEM"]
    },
    {
      id: "teluguva",
      title: "TELUGUVA",
      subtitle: "TELUGU DIGITAL EXPERIENCE",
      tagline: "English in. Telugu out. Understanding made simple.",
      description: "An intelligent bilingual translation and accessibility platform that translates English documents, notices, and text into simple, natural conversational Telugu with instant voice narration.",
      live: "https://teluguva.vercel.app",
      labels: ["AI", "TRANSLATION", "ACCESSIBILITY", "WEB"]
    }
  ];

  function initProjectNavigator() {
    const dockItems = $$(".nav-dock-item");
    if (!dockItems.length) return;

    dockItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const targetId = item.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            const navOffset = 90;
            const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementPosition - navOffset,
              behavior: "smooth"
            });
          }
        }
      });
    });

    // Subtle 3D cursor parallax on project preview frames (desktop only)
    if (!isTouch) {
      const frames = $$(".project-browser-frame");
      frames.forEach((frame) => {
        const parentCard = frame.closest(".project-card");
        if (!parentCard) return;

        parentCard.addEventListener("mousemove", (e) => {
          const rect = frame.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          const rotX = clamp(-dy * 3, -3, 3);
          const rotY = clamp(dx * 4, -4, 4);

          frame.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.015)`;
        });

        parentCard.addEventListener("mouseleave", () => {
          frame.style.transform = "none";
        });
      });
    }
  }

  initProjectNavigator();

  if (window.PROJECTS && Array.isArray(window.PROJECTS)) {
    console.log(`Gokul Labs: ${window.PROJECTS.length} verified projects loaded.`);
  }
})();

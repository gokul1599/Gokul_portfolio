/**
 * GOKUL LABS — Living Digital Architecture Engine v8.5
 * 
 * Production-Grade Interactive System:
 *  - Signature 3D Living Digital Artifact (Three.js WebGL)
 *  - Restrained, Purposeful Motion (Almost still at rest, controlled scroll evolution)
 *  - Scroll-Driven Architectural State Machine (Hero -> Work -> About -> Lab -> Stack -> Journey -> Contact)
 *  - Interactive Case Study Drawer Architecture (What, Why, How, Intelligence, Engineering, Experience)
 *  - Laboratory Interactive Workbench (Prompt Analyzer, Shader Calibrator, Spring Physics, Pipeline Visualizer)
 *  - Technical Stack Layer Resonance
 *  - Performance & Battery Optimization (DPR capped at 1.75, Page Visibility pausing, WebGL Fallback, prefers-reduced-motion)
 */

(function () {
  "use strict";

  /* ============================================================
     1. DOM UTILITIES & MATH HELPERS
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let isReadModeActive = false;

  /* ============================================================
     CENTRALIZED SCROLL LOCK & ACCESSIBLE FOCUS MANAGER
     Tracks active modals/drawers using a Set. Only restores scrolling
     when all overlays have unlocked. Restores trigger focus on close.
     ============================================================ */
  const ScrollLock = {
    locks: new Set(),
    lastFocused: new Map(),
    lock(id) {
      if (document.activeElement) {
        this.lastFocused.set(id, document.activeElement);
      }
      this.locks.add(id);
      document.body.style.overflow = "hidden";
    },
    unlock(id) {
      this.locks.delete(id);
      if (this.locks.size === 0) {
        document.body.style.overflow = "";
      }
      const prev = this.lastFocused.get(id);
      if (prev && typeof prev.focus === "function") {
        try { prev.focus(); } catch (err) {}
      }
      this.lastFocused.delete(id);
    },
    isLocked() {
      return this.locks.size > 0;
    }
  };

  // Keep keyboard navigation inside the most recently opened dialog.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const id = Array.from(ScrollLock.locks).pop();
    const dialog = id === "mobile-nav" ? document.getElementById("navbar") : id && document.getElementById(id);
    if (!dialog || (id !== "mobile-nav" && dialog.getAttribute("role") !== "dialog")) return;
    const focusable = Array.from(dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'))
      .filter((el) => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length > 0);
    if (!focusable.length) { event.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const outside = !dialog.contains(document.activeElement);
    if (outside || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });

  /* ============================================================
     2. ACCESSIBLE SCROLL REVEAL (Zero Content Blocking)
     ============================================================ */
  function initScrollReveal() {
    const reveals = $$(".reveal, .reveal-fade, .project-card, .stack-category-card, .timeline-entry, .lab-module-card");
    
    // Ensure all content is immediately accessible and visible
    reveals.forEach((el) => {
      el.classList.add("visible");
      el.style.opacity = "1";
    });

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
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
        { threshold: 0.08, rootMargin: "40px" }
      );
      reveals.forEach((el) => observer.observe(el));
    }
  }
  initScrollReveal();

  /* ============================================================
     3. LIVE METADATA & LIFEHUB CLOCK
     ============================================================ */
  const yearEl = $("#copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lhClockEl = $("#lh-clock-display");
  function updateLifeHubClock() {
    if (!lhClockEl) return;
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    lhClockEl.textContent = `${String(h).padStart(2, "0")}:${m} ${ampm}`;
  }
  updateLifeHubClock();
  setInterval(updateLifeHubClock, 1000);

  /* ============================================================
     4. HEADER, NAVIGATION & SCROLL TRACKING
     ============================================================ */
  const navbar = $("#navbar");
  const progressBar = $("#scroll-progress");
  const navLinks = $$(".nav-link");
  const sections = $$("section[id]");
  const projectCards = $$(".project-card");
  const dockItems = $$(".nav-dock-item");
  const activeWorkIndicator = $("#work-active-indicator");

  let currentSectionId = "hero";
  let globalScrollProgress = 0;

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    globalScrollProgress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;

    if (progressBar) {
      progressBar.style.width = `${(globalScrollProgress * 100).toFixed(2)}%`;
    }

    // Header glass transition on scroll
    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Active Section Tracking
    let foundSection = "hero";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 180;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        foundSection = sec.getAttribute("id") || "hero";
      }
    });

    if (foundSection !== currentSectionId) {
      currentSectionId = foundSection;
      navLinks.forEach((link) => {
        const active = link.getAttribute("data-nav") === currentSectionId;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    // Project Navigator Dock Visibility (Visible exclusively within Work section)
    const workSection = $("#work");
    const navDock = $("#project-nav-dock");
    if (workSection && navDock) {
      const workRect = workSection.getBoundingClientRect();
      const inWork = workRect.top <= window.innerHeight * 0.45 && workRect.bottom >= window.innerHeight * 0.15;
      navDock.classList.toggle("visible", inWork);
    }

    // Work Section Sequential Active Tracking for Dock Navigator (closest to viewport center)
    if (projectCards.length > 0) {
      const viewportCenter = window.innerHeight / 2;
      let minDistance = Infinity;
      let activeProjIndex = 0;

      projectCards.forEach((pc, idx) => {
        const pRect = pc.getBoundingClientRect();
        const cardCenter = pRect.top + pRect.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          activeProjIndex = idx;
        }
      });

      dockItems.forEach((di, idx) => {
        di.classList.toggle("active", idx === activeProjIndex);
      });

      if (activeWorkIndicator) {
        activeWorkIndicator.textContent = `0${activeProjIndex + 1}`;
      }
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Smooth Anchor Navigation with Header Offset
  $$("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = $(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        // Close mobile drawer if open
        if (navDrawer && navDrawer.classList.contains("open")) {
          closeMobileMenu();
        }
      }
    });
  });

  /* ============================================================
     5. MOBILE NAVIGATION DRAWER
     ============================================================ */
  const menuBtn = $("#menu-btn");
  const navDrawer = $("#mobile-nav");

  function openMobileMenu() {
    if (!menuBtn || !navDrawer) return;
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    navDrawer.classList.add("open");
    navDrawer.setAttribute("aria-hidden", "false");
    ScrollLock.lock("mobile-nav");
    const firstLink = navDrawer.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960 && navDrawer && navDrawer.classList.contains("open")) closeMobileMenu();
  });

  function closeMobileMenu() {
    if (!menuBtn || !navDrawer) return;
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    navDrawer.classList.remove("open");
    navDrawer.setAttribute("aria-hidden", "true");
    ScrollLock.unlock("mobile-nav");
  }

  if (menuBtn && navDrawer) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navDrawer.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* ============================================================
     6. RESTRAINED MINIMAL CURSOR & MAGNETIC BUTTONS (Desktop)
     ============================================================ */
  // Preserve the native cursor. Magnetic buttons run only during pointer input.
  if (!isTouch && !prefersReducedMotion) {
    $$(".magnetic-btn").forEach((btn) => {
      btn.addEventListener("pointermove", (event) => {
        const rect = btn.getBoundingClientRect();
        btn.style.transform = `translate(${((event.clientX - rect.left - rect.width / 2) * .1).toFixed(1)}px, ${((event.clientY - rect.top - rect.height / 2) * .1).toFixed(1)}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ============================================================
     7. SIGNATURE 3D LIVING DIGITAL ARTIFACT (Three.js WebGL)
     ============================================================ */
  let artifactShaderUniforms = {
    transmission: 0.88,
    roughness: 0.08,
    ior: 1.55,
    metalness: 0.15
  };

  let updateArtifactMaterial = null;
  let highlightArtifactLayer = null;

  const canvasEl = $("#webgl-canvas");
  if (canvasEl) {
    initLivingDigitalArtifact(canvasEl);
  }

  function initLivingDigitalArtifact(canvas) {
    if (!window.createCrystalInstallation) return;
    // Cap device pixel ratio to max 1.75 for rendering performance and battery optimization:
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const installation = window.createCrystalInstallation(canvas);
    updateArtifactMaterial = (params) => installation.update(params);
    highlightArtifactLayer = (layer) => installation.highlight(layer);
  }

  /* ============================================================
     8. CASE STUDY MODAL DRAWER SYSTEM
     ============================================================ */
  const modalBackdrop = $("#case-study-modal");
  const modalDrawer = $("#case-study-drawer");
  const drawerContent = $("#drawer-dynamic-content");
  const drawerCloseBtn = $("#drawer-close-btn");

  function openCaseStudy(projectId) {
    if (!window.PROJECTS || !modalBackdrop || !drawerContent) return;
    const project = window.PROJECTS.find((p) => p.id === projectId);
    if (!project) return;

    const cs = project.caseStudy || {};

    let sourceBtnHtml = "";
    if (project.githubUrl) {
      sourceBtnHtml = `
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="modal-cta-btn secondary">
          <svg viewBox="0 0 16 16" fill="currentColor" class="btn-icon" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8.01 8.01 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          <span>VIEW REPOSITORY</span>
        </a>
      `;
    }

    drawerContent.innerHTML = `
      <div class="modal-project-header">
        <div class="modal-meta-row">
          <span class="modal-num-badge">PROJECT ${project.number}</span>
          <span class="modal-cat">${project.category}</span>
          <span class="modal-year">${project.year}</span>
        </div>
        <h2 class="modal-title">${project.name}</h2>
        <p class="modal-subtitle">${project.subtitle}</p>
        <p class="modal-tagline">“${project.tagline}”</p>
      </div>

      <div class="modal-body-sections">
        <section class="modal-cs-block">
          <div class="cs-heading">01 // WHAT WAS BUILT</div>
          <p class="cs-text">${cs.what || cs.product || project.description}</p>
        </section>

        <section class="modal-cs-block">
          <div class="cs-heading">02 // WHY IT MATTERS (THE PROBLEM)</div>
          <p class="cs-text">${cs.why || cs.problem || ""}</p>
        </section>

        <section class="modal-cs-block">
          <div class="cs-heading">03 // HOW IT WAS APPROACHED</div>
          <p class="cs-text">${cs.how || ""}</p>
        </section>

        <section class="modal-cs-block">
          <div class="cs-heading">04 // WHERE AI &amp; MODELS CONTRIBUTE</div>
          <p class="cs-text">${cs.intelligence || ""}</p>
        </section>

        <section class="modal-cs-block">
          <div class="cs-heading">05 // SYSTEMS &amp; ENGINEERING ARCHITECTURE</div>
          <p class="cs-text">${cs.engineering || ""}</p>
          <div class="modal-tech-pills">
            ${(project.technologies || []).map((t) => `<span class="tech-pill">${t}</span>`).join("")}
          </div>
        </section>

        <section class="modal-cs-block">
          <div class="cs-heading">06 // INTERACTION &amp; USER EXPERIENCE</div>
          <p class="cs-text">${cs.experience || ""}</p>
        </section>
      </div>

      <div class="modal-footer-actions">
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="modal-cta-btn primary">
          <span>EXPLORE LIVE PRODUCT</span>
          <svg viewBox="0 0 12 12" fill="none" class="btn-arrow" aria-hidden="true"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        ${sourceBtnHtml}
      </div>
    `;

    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    ScrollLock.lock("case-study-modal");
    if (drawerCloseBtn) {
      setTimeout(() => drawerCloseBtn.focus(), 50);
    }
  }

  function closeCaseStudy() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    ScrollLock.unlock("case-study-modal");
  }

  window.openCaseStudy = openCaseStudy;
  window.closeCaseStudy = closeCaseStudy;

  // Event delegation for all current and dynamic case study buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-study]");
    if (btn) {
      const pId = btn.getAttribute("data-open-study");
      if (pId) openCaseStudy(pId);
    }
  });

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", closeCaseStudy);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeCaseStudy();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalBackdrop && modalBackdrop.classList.contains("open")) {
        closeCaseStudy();
      }
      if (navDrawer && navDrawer.classList.contains("open")) {
        closeMobileMenu();
      }
    }
  });

  /* ============================================================
     9. LABORATORY INTERACTIVE WORKBENCH
     ============================================================ */

  // --- Lab 01: Prompt Structure Analyzer -----------------------
  const promptInput = $("#prompt-input");
  const outRole = $("#out-role");
  const outContext = $("#out-context");
  const outObjective = $("#out-objective");
  const outConstraints = $("#out-constraints");
  const outWords = $("#out-words");
  const outTokens = $("#out-tokens");
  const presetBtns = $$(".preset-btn");

  const promptPresets = {
    venture: "ROLE: Venture Architect\nCONTEXT: Early-stage founder exploring venture hypotheses.\nOBJECTIVE: Formulate a lean MVP specification focusing on unit economics and retention.\nCONSTRAINTS: Avoid premature scaling; validate client-side privacy.",
    ocr: "ROLE: Bilingual Accessibility Linguist\nCONTEXT: Official technical circular drafted in dense English.\nOBJECTIVE: Translate into colloquial conversational Telugu with 0.8x speech pacing.\nCONSTRAINTS: Preserve technical terms while eliminating bureaucratic jargon.",
    spatial: "ROLE: Spatial Graphics Engineer\nCONTEXT: 2D residential floor plan with double-height ceiling.\nOBJECTIVE: Generate bounding box parameters and physically accurate daylight reflections.\nCONSTRAINTS: Cap draw calls under 60; enforce PBR energy conservation."
  };

  function analyzePrompt(text) {
    if (typeof text !== "string") return;
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
    const tokens = Math.round(words.length * 1.32);
    if (outWords) outWords.textContent = words.length;
    if (outTokens) outTokens.textContent = tokens;

    const roleMatch = text.match(/ROLE:\s*([^\n\r]+)/i);
    const contextMatch = text.match(/CONTEXT:\s*([^\n\r]+)/i);
    const objMatch = text.match(/OBJECTIVE:\s*([^\n\r]+)/i);
    const constMatch = text.match(/CONSTRAINTS:\s*([^\n\r]+)/i);

    if (outRole) outRole.textContent = roleMatch ? roleMatch[1].trim() : (words.length ? "Custom Structure" : "—");
    if (outContext) outContext.textContent = contextMatch ? contextMatch[1].trim() : (words.length ? "Implicit from query" : "—");
    if (outObjective) outObjective.textContent = objMatch ? objMatch[1].trim() : (words.length ? "General inquiry" : "—");
    if (outConstraints) outConstraints.textContent = constMatch ? constMatch[1].trim() : (words.length ? "Standard system rules" : "—");
  }

  if (promptInput) {
    promptInput.value = promptPresets.venture;
    analyzePrompt(promptPresets.venture);

    promptInput.addEventListener("input", (e) => {
      analyzePrompt(e.target.value);
    });

    presetBtns.forEach((pBtn) => {
      pBtn.addEventListener("click", () => {
        presetBtns.forEach((b) => b.classList.remove("active"));
        pBtn.classList.add("active");
        const key = pBtn.getAttribute("data-preset");
        if (key && promptPresets[key]) {
          promptInput.value = promptPresets[key];
          analyzePrompt(promptPresets[key]);
        }
      });
    });
  }

  // --- Lab 02: Refractive Material Shader Calibrator -----------
  const sliderTrans = $("#slider-transmission");
  const sliderRough = $("#slider-roughness");
  const sliderIor = $("#slider-ior");
  const valTrans = $("#val-transmission");
  const valRough = $("#val-roughness");
  const valIor = $("#val-ior");
  const btnResetShader = $("#btn-reset-shader");

  if (sliderTrans && sliderRough && sliderIor) {
    sliderTrans.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (valTrans) valTrans.textContent = val.toFixed(2);
      if (updateArtifactMaterial) updateArtifactMaterial({ transmission: val });
    });

    sliderRough.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (valRough) valRough.textContent = val.toFixed(2);
      if (updateArtifactMaterial) updateArtifactMaterial({ roughness: val });
    });

    sliderIor.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (valIor) valIor.textContent = val.toFixed(2);
      if (updateArtifactMaterial) updateArtifactMaterial({ ior: val });
    });

    if (btnResetShader) {
      btnResetShader.addEventListener("click", () => {
        sliderTrans.value = 0.88;
        sliderRough.value = 0.08;
        sliderIor.value = 1.55;
        if (valTrans) valTrans.textContent = "0.88";
        if (valRough) valRough.textContent = "0.08";
        if (valIor) valIor.textContent = "1.55";
        if (updateArtifactMaterial) {
          updateArtifactMaterial({ transmission: 0.88, roughness: 0.08, ior: 1.55 });
        }
      });
    }
  }

  // --- Lab 03: Kinetic Spring Physics --------------------------
  const springStage = $("#spring-stage");
  const springTarget = $("#spring-target");
  const lblStiffness = $("#lbl-stiffness");
  const lblDamping = $("#lbl-damping");
  const springPresetBtns = $$(".spring-preset-btn");

  let springParams = { stiffness: 280, damping: 22, mass: 1 };
  let springPos = { x: 0, y: 0 };
  let springVel = { x: 0, y: 0 };
  let isDraggingSpring = false;

  if (springStage && springTarget) {
    let springFrame = 0;
    function wakeSpring() {
      if (!springFrame && !document.hidden) springFrame = requestAnimationFrame(updateSpringPhysics);
    }
    function updateSpringPhysics() {
      springFrame = 0;
      if (isDraggingSpring || document.hidden) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        springPos = { x: 0, y: 0 }; springVel = { x: 0, y: 0 };
      } else {
        const forceX = -springParams.stiffness * (springPos.x * 0.01) - springParams.damping * springVel.x;
        const forceY = -springParams.stiffness * (springPos.y * 0.01) - springParams.damping * springVel.y;
        springVel.x += (forceX / springParams.mass) * .016;
        springVel.y += (forceY / springParams.mass) * .016;
        springPos.x += springVel.x; springPos.y += springVel.y;
      }
      const moving = Math.abs(springPos.x) + Math.abs(springPos.y) + Math.abs(springVel.x) + Math.abs(springVel.y) > .05;
      if (!moving) { springPos = { x: 0, y: 0 }; springVel = { x: 0, y: 0 }; }
      springTarget.style.transform = `translate3d(${springPos.x.toFixed(2)}px, ${springPos.y.toFixed(2)}px, 0)`;
      if (moving) wakeSpring();
    }
    springTarget.tabIndex = 0;
    springTarget.setAttribute("role", "button");
    springTarget.setAttribute("aria-label", "Spring physics demo. Use arrow keys to move and release.");
    springTarget.addEventListener("keydown", (event) => {
      const directions = { ArrowLeft: [-60, 0], ArrowRight: [60, 0], ArrowUp: [0, -40], ArrowDown: [0, 40] };
      if (!directions[event.key]) return;
      event.preventDefault();
      [springPos.x, springPos.y] = directions[event.key];
      wakeSpring();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(springFrame); springFrame = 0; }
      else wakeSpring();
    });

    springTarget.addEventListener("mousedown", () => {
      isDraggingSpring = true;
    });

    springTarget.addEventListener("touchstart", (e) => {
      isDraggingSpring = true;
      e.preventDefault();
    }, { passive: false });

    window.addEventListener("mousemove", (e) => {
      if (!isDraggingSpring) return;
      const rect = springStage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      springPos.x = clamp(e.clientX - cx, -90, 90);
      springPos.y = clamp(e.clientY - cy, -50, 50);
      springVel.x = 0;
      springVel.y = 0;
      springTarget.style.transform = `translate3d(${springPos.x}px, ${springPos.y}px, 0)`;
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDraggingSpring || !e.touches || !e.touches[0]) return;
      const rect = springStage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      springPos.x = clamp(e.touches[0].clientX - cx, -90, 90);
      springPos.y = clamp(e.touches[0].clientY - cy, -50, 50);
      springVel.x = 0;
      springVel.y = 0;
      springTarget.style.transform = `translate3d(${springPos.x}px, ${springPos.y}px, 0)`;
    }, { passive: true });

    window.addEventListener("mouseup", () => {
      isDraggingSpring = false;
      wakeSpring();
    });

    window.addEventListener("touchend", () => {
      isDraggingSpring = false;
      wakeSpring();
    });

    springPresetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        springPresetBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const s = parseFloat(btn.getAttribute("data-stiffness") || "280");
        const d = parseFloat(btn.getAttribute("data-damping") || "22");
        const m = parseFloat(btn.getAttribute("data-mass") || "1");
        springParams = { stiffness: s, damping: d, mass: m };
        if (lblStiffness) lblStiffness.textContent = s;
        if (lblDamping) lblDamping.textContent = d;
      });
    });
  }

  // --- Lab 04: State Pipeline Visualizer -----------------------
  const pipelineNodes = $$(".pipeline-step-node");
  const pipelineDetail = $("#pipeline-detail");

  const pipelineStages = [
    {
      tag: "STAGE 01 // PROBLEM DEFINITION",
      headline: "Idea &amp; Hypothesis Formulation",
      copy: "Isolate friction, question default assumptions, and define clear success criteria before writing code."
    },
    {
      tag: "STAGE 02 // MODEL & FEASIBILITY",
      headline: "Intelligence &amp; Architecture",
      copy: "Select the optimal LLM prompts, client-side OCR libraries, or spatial geometric math models to solve the problem directly."
    },
    {
      tag: "STAGE 03 // TYPE-SAFE IMPLEMENTATION",
      headline: "Engineering, Clean Contracts &amp; Performance",
      copy: "Construct modular React/Next.js/Three.js code with zero runtime errors, accessible DOM structure, and responsive interaction performance."
    },
    {
      tag: "STAGE 04 // POLISHED SHIP",
      headline: "Product Deployment &amp; User Experience",
      copy: "Host on production edge networks, test on real devices, collect user signals, and iterate into the next version."
    }
  ];

  pipelineNodes.forEach((node, idx) => {
    node.addEventListener("click", () => {
      pipelineNodes.forEach((n) => n.classList.remove("active"));
      node.classList.add("active");
      const stageData = pipelineStages[idx];
      if (stageData && pipelineDetail) {
        pipelineDetail.innerHTML = `
          <div class="box-tag">${stageData.tag}</div>
          <h4 class="box-headline">${stageData.headline}</h4>
          <p class="box-copy">${stageData.copy}</p>
        `;
      }
    });
  });

  /* ============================================================
     10. STACK LAYER RESONANCE WITH 3D ARTIFACT
     ============================================================ */
  const stackCards = $$(".stack-category-card");
  stackCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const targetLayer = card.getAttribute("data-layer-target");
      if (targetLayer && highlightArtifactLayer) {
        highlightArtifactLayer(targetLayer);
      }
    });

    card.addEventListener("mouseleave", () => {
      if (highlightArtifactLayer) highlightArtifactLayer(null);
    });
  });

  /* ============================================================
     11. DYNAMIC NOW SECTION HYDRATION (From data/now.js)
     ============================================================ */
  function initNowSection() {
    if (typeof window === "undefined" || !window.NOW_STATUS) return;
    const nowGrid = $(".now-grid");
    const dateEl = $("#now-updated-date");
    if (dateEl && window.NOW_STATUS.lastUpdated) {
      dateEl.textContent = `UPDATED ${window.NOW_STATUS.lastUpdated}`;
    }
    if (nowGrid && Array.isArray(window.NOW_STATUS.columns)) {
      nowGrid.innerHTML = window.NOW_STATUS.columns.map((col, idx) => `
        <div class="now-col ${idx === window.NOW_STATUS.columns.length - 1 ? 'highlight-col' : ''}">
          <span class="now-col-label">${col.label}</span>
          <p class="now-col-val">${col.value}</p>
          ${col.detail ? `<p class="now-col-detail" style="font-size: 12px; color: var(--text-muted); margin-top: 6px; line-height: 1.5;">${col.detail}</p>` : ''}
        </div>
      `).join("");
    }
  }
  initNowSection();

  /* ============================================================
     12. DEVYATRA INTERACTIVE GEOSPATIAL ATLAS & AI PLANNER
     ============================================================ */
  function initDevYatraInteractive() {
    const explorerBtn = $("#dy-tab-explorer-btn");
    const plannerBtn = $("#dy-tab-planner-btn");
    const explorerView = $("#dy-view-explorer");
    const plannerView = $("#dy-view-planner");

    if (explorerBtn && plannerBtn && explorerView && plannerView) {
      function switchDevYatraTab(tab) {
        if (tab === "explorer") {
          explorerBtn.classList.add("active");
          explorerBtn.setAttribute("aria-selected", "true");
          plannerBtn.classList.remove("active");
          plannerBtn.setAttribute("aria-selected", "false");
          explorerView.style.display = "grid";
          plannerView.style.display = "none";
        } else {
          plannerBtn.classList.add("active");
          plannerBtn.setAttribute("aria-selected", "true");
          explorerBtn.classList.remove("active");
          explorerBtn.setAttribute("aria-selected", "false");
          plannerView.style.display = "grid";
          explorerView.style.display = "none";
        }
      }

      explorerBtn.addEventListener("click", () => switchDevYatraTab("explorer"));
      plannerBtn.addEventListener("click", () => switchDevYatraTab("planner"));

      const dyTabs = [explorerBtn, plannerBtn];
      dyTabs.forEach((tab, index) => {
        tab.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const nextIndex = (index + 1) % dyTabs.length;
            dyTabs[nextIndex].focus();
            dyTabs[nextIndex].click();
          }
        });
      });
    }

    const catChips = $$(".dy-cat-chip");
    const categoryLabel = $("#dy-places-category-label");
    const countLabel = $("#dy-places-count-label");
    const placesList = $("#dy-places-list");
    const placeInspector = $("#dy-place-inspector");

    if (typeof window.DEVYATRA_PLACES === "undefined" || !placesList || !placeInspector) return;

    let activeCategory = "SACRED";
    let activePlaceId = "tirumala-venkateswara";

    function renderPlacesList(category) {
      const filtered = window.DEVYATRA_PLACES.filter((p) => p.category === category);
      if (categoryLabel) {
        const catObj = (window.DEVYATRA_CATEGORIES || []).find((c) => c.id === category);
        categoryLabel.textContent = catObj ? `${catObj.label.toUpperCase()} ATLAS` : `${category} ATLAS`;
      }
      if (countLabel) {
        countLabel.textContent = `${filtered.length} PLACES`;
      }

      placesList.innerHTML = filtered.map((place) => `
        <button class="dy-place-item ${place.id === activePlaceId ? 'active' : ''}" data-place-id="${place.id}" type="button">
          <span class="dy-item-name">${place.name}</span>
          <span class="dy-item-sub">${place.district ? place.district + ', ' : ''}${place.state}</span>
        </button>
      `).join("");

      $$(".dy-place-item", placesList).forEach((btn) => {
        btn.addEventListener("click", () => {
          activePlaceId = btn.getAttribute("data-place-id");
          $$(".dy-place-item", placesList).forEach((b) => b.classList.toggle("active", b === btn));
          const selected = window.DEVYATRA_PLACES.find((p) => p.id === activePlaceId);
          if (selected) renderPlaceInspector(selected);
        });
      });
    }

    function renderPlaceInspector(p) {
      if (!p) return;
      const provStatus = (p.verificationStatus || "TRUSTED_SOURCE").toLowerCase();
      const provTag = (p.verificationStatus || "TRUSTED_SOURCE").replace(/_/g, " ");

      placeInspector.innerHTML = `
        <div class="dy-insp-header">
          <div class="dy-insp-title-box">
            <h4>${p.name}</h4>
            ${p.nativeName ? `<div class="dy-insp-native">${p.nativeName}</div>` : ""}
            <div class="dy-insp-meta-chips">
              <span class="dy-meta-chip">${p.state}</span>
              ${p.district ? `<span class="dy-meta-chip">${p.district}</span>` : ""}
              ${p.elevation ? `<span class="dy-meta-chip">Elev: ${p.elevation}</span>` : ""}
              <span class="dy-meta-chip">${p.lat.toFixed(4)}°N, ${p.lng.toFixed(4)}°E</span>
            </div>
          </div>
          <span class="dy-provenance-tag ${provStatus}">${provTag}</span>
        </div>

        <p class="dy-insp-body">${p.description}</p>

        <div class="dy-insp-specs-grid">
          <div class="dy-spec-item">
            <span class="dy-spec-label">TRADITION / HERITAGE</span>
            <span class="dy-spec-val">${p.tradition || "National Heritage Monument"}</span>
          </div>
          <div class="dy-spec-item">
            <span class="dy-spec-label">ARCHITECTURE / GEOLOGY</span>
            <span class="dy-spec-val">${p.architecture || "Natural Landform / Rock formation"}</span>
          </div>
          <div class="dy-spec-item">
            <span class="dy-spec-label">ACCESS / TIMINGS</span>
            <span class="dy-spec-val">${p.timings || "Open during regular daylight hours"}</span>
          </div>
          <div class="dy-spec-item">
            <span class="dy-spec-label">PROTOCOL / DRESS CODE</span>
            <span class="dy-spec-val">${p.dressCode || "Modest attire recommended"}</span>
          </div>
        </div>

        ${p.highlights && p.highlights.length ? `
          <div class="dy-insp-highlights">
            <span class="dy-hl-label">SIGNIFICANT HIGHLIGHTS</span>
            <ul class="dy-hl-list">
              ${p.highlights.map((h) => `<li>${h}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <div class="dy-insp-footer">
          <span class="dy-source-meta">SOURCE: ${p.sourceName || "Official Gazette / Archaeological Survey"}</span>
          ${p.sourceUrl ? `
            <a href="${p.sourceUrl}" target="_blank" rel="noopener noreferrer" class="dy-source-link">
              <span>OFFICIAL PORTAL</span>
              <span>↗</span>
            </a>
          ` : ""}
        </div>
      `;
    }

    catChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        catChips.forEach((c) => {
          c.classList.remove("active");
          c.setAttribute("aria-selected", "false");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("active");
        chip.setAttribute("aria-selected", "true");
        chip.setAttribute("aria-pressed", "true");
        activeCategory = chip.getAttribute("data-category") || "SACRED";
        const matching = window.DEVYATRA_PLACES.filter((p) => p.category === activeCategory);
        if (matching.length) {
          activePlaceId = matching[0].id;
          renderPlacesList(activeCategory);
          renderPlaceInspector(matching[0]);
        }
      });
    });

    renderPlacesList("SACRED");
    const initialPlace = window.DEVYATRA_PLACES.find((p) => p.id === "tirumala-venkateswara") || window.DEVYATRA_PLACES[0];
    renderPlaceInspector(initialPlace);

    // Pilgrimage Route Planner Simulator (Portfolio Demo)
    const generateBtn = $("#dy-generate-route-btn");
    const citySelect = $("#dy-plan-city");
    const intentSelect = $("#dy-plan-intent");
    const planPills = $$(".plan-pill");
    const routeTitle = $("#dy-route-title");
    const routeTimeline = $("#dy-route-timeline");

    let planDays = 3;
    planPills.forEach((p) => {
      p.addEventListener("click", () => {
        planPills.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        p.classList.add("active");
        p.setAttribute("aria-pressed", "true");
        planDays = parseInt(p.getAttribute("data-days") || "3", 10);
      });
    });

    function generateItinerary() {
      if (!routeTimeline) return;
      const city = citySelect ? citySelect.value : "Hyderabad";
      const intent = intentSelect ? intentSelect.value : "jyotirlinga";

      if (routeTitle) {
        routeTitle.textContent = `${planDays}-Day ${intent.toUpperCase()} Circuit from ${city}`;
      }

      let relevantPlaces = [];
      if (intent === "jyotirlinga") {
        relevantPlaces = window.DEVYATRA_PLACES.filter((p) => p.category === "SACRED" && p.tradition && (p.tradition.includes("Shaivite") || p.tradition.includes("Jyotirlinga")));
      } else if (intent === "vaishnavite") {
        relevantPlaces = window.DEVYATRA_PLACES.filter((p) => p.category === "SACRED" && p.tradition && (p.tradition.includes("Vaishnavite") || p.tradition.includes("Divya Desam")));
      } else if (intent === "heritage") {
        relevantPlaces = window.DEVYATRA_PLACES.filter((p) => p.category === "HERITAGE" || p.category === "CAVES");
      } else {
        relevantPlaces = window.DEVYATRA_PLACES.filter((p) => p.category === "HILLS" || p.category === "WATERFALLS" || p.category === "LAKES" || p.category === "NATURE");
      }

      if (relevantPlaces.length === 0) {
        relevantPlaces = window.DEVYATRA_PLACES.slice(0, planDays);
      }

      const stops = relevantPlaces.slice(0, planDays);

      routeTimeline.innerHTML = stops.map((s, idx) => `
        <div class="route-stop-card">
          <span class="route-day-badge">DAY 0${idx + 1}</span>
          <div class="route-details">
            <h5 class="route-stop-title">${s.name}</h5>
            <p class="route-stop-desc">${(s.description || "").substring(0, 140)}...</p>
            <div class="route-stop-meta">
              <span>📍 ${s.state} (${(s.lat || 0).toFixed(2)}°N, ${(s.lng || 0).toFixed(2)}°E)</span>
              <span>⏰ ${(s.timings || "Standard visiting hours").substring(0, 30)}</span>
              <span>🛡️ ${s.verificationStatus || "VERIFIED"}</span>
            </div>
          </div>
        </div>
      `).join("");
    }

    if (generateBtn) {
      generateBtn.addEventListener("click", generateItinerary);
      generateItinerary();
    }
  }
  initDevYatraInteractive();

  /* ============================================================
     13. COMMAND PALETTE CONTROLLER (Cmd+K / Ctrl+K)
     ============================================================ */
  function initCommandPalette() {
    const paletteBackdrop = $("#command-palette");
    const cmdInput = $("#cmd-input");
    const cmdResults = $("#cmd-results");
    const triggerBtn = $("#cmd-trigger-btn");
    const cmdKeyBadge = $("#cmd-kbd-badge");

    // Dynamic OS Key Detection (Mac ⌘K vs Windows/Linux Ctrl K)
    const isMac = typeof navigator !== "undefined" && (
      (navigator.platform && navigator.platform.toUpperCase().includes("MAC")) ||
      (navigator.userAgent && navigator.userAgent.toUpperCase().includes("MAC"))
    );

    if (cmdKeyBadge) {
      cmdKeyBadge.innerHTML = isMac ? "<kbd>⌘</kbd><kbd>K</kbd>" : "<kbd>Ctrl</kbd><kbd>K</kbd>";
    }
    if (triggerBtn) {
      triggerBtn.setAttribute("title", isMac ? "Command Palette (⌘K)" : "Command Palette (Ctrl+K)");
      triggerBtn.setAttribute("aria-label", isMac ? "Open Command Palette (⌘K)" : "Open Command Palette (Ctrl+K)");
    }

    if (!paletteBackdrop || !cmdInput || !cmdResults) return;

    const commands = [
      // --- NAVIGATION ---
      { group: "Navigation", icon: "🏠", title: "Hero Introduction", desc: "Top of portfolio & identity statement", keywords: "hero home gokul karpurapu intro", action: () => scrollToSection("hero") },
      { group: "Navigation", icon: "💼", title: "Selected Work (04 Builds)", desc: "Jump directly to Valtora, LifeHub, Teluguva, DevYatra", keywords: "work projects apps builds products portfolio", action: () => scrollToSection("work") },
      { group: "Navigation", icon: "👤", title: "About the Builder", desc: "Background, mindset, education & philosophy", keywords: "about bio profile scaler bits pilani student", action: () => scrollToSection("about") },
      { group: "Navigation", icon: "🔬", title: "Digital Laboratory", desc: "Interactive workbenches and prototypes", keywords: "lab experiments prompt shader spring physics pipeline visualizer", action: () => scrollToSection("lab") },
      { group: "Navigation", icon: "⚡", title: "Technical Stack", desc: "Modern frontend, backend, 3D, and AI models", keywords: "stack skills tech tools technologies languages frameworks", action: () => scrollToSection("stack") },
      { group: "Navigation", icon: "🧭", title: "Journey & Milestones", desc: "Timeline, Scaler, BITS Pilani & now", keywords: "journey timeline experience milestones history education", action: () => scrollToSection("journey") },
      { group: "Navigation", icon: "✉️", title: "Contact & Connect", desc: "Get in touch for internships & opportunities", keywords: "contact email hire connect message linkedin github", action: () => scrollToSection("contact") },

      // --- PROJECTS ---
      { group: "Projects", icon: "💡", title: "Valtora", desc: "AI analytical co-founder for startup validation & sizing", keywords: "valtora startup venture market sizing cofounder groq llm case study", action: () => { closePalette(); openCaseStudy("valtora"); } },
      { group: "Projects", icon: "📋", title: "LifeHub", desc: "Personal daily operating system & dashboard", keywords: "lifehub dashboard habits productivity finance calendar offline localstorage case study", action: () => { closePalette(); openCaseStudy("lifehub"); } },
      { group: "Projects", icon: "🗣️", title: "Teluguva", desc: "Bilingual English to conversational Telugu with OCR", keywords: "teluguva telugu ocr tesseract translation audio speech accessibility case study", action: () => { closePalette(); openCaseStudy("teluguva"); } },
      { group: "Projects", icon: "🏛️", title: "DevYatra / Templeora", desc: "Sacred heritage geospatial atlas & pilgrimage route planner", keywords: "devyatra templeora temples sacred atlas maps gis route planner itinerary case study", action: () => { closePalette(); openCaseStudy("devyatra"); } },

      // --- ACTIONS ---
      { group: "Actions", icon: "⏱️", title: "Recruiter 30s Quick Scan", desc: "Dense executive summary of candidate credentials", keywords: "recruiter scan 30s summary resume candidate hire overview", action: () => { closePalette(); if (window.openRecruiterModal) window.openRecruiterModal(); } },
      { group: "Actions", icon: "✦", title: "Toggle Experience / Read Mode", desc: "Switch between 3D WebGL and minimal reader mode", keywords: "mode read experience 3d toggle dark light theme switch", action: () => { closePalette(); if (window.toggleExperienceMode) window.toggleExperienceMode(); } },
      { group: "Actions", icon: "📑", title: "View Verified Resume", desc: "Open print & ATS-ready developer resume", keywords: "resume cv pdf print credentials profile", action: () => { closePalette(); window.open("assets/resume/resume.html", "_blank"); } },
      { group: "Actions", icon: "🐙", title: "Open GitHub Profile", desc: "github.com/gokul1599", keywords: "github git code repository repo source open source", action: () => { closePalette(); window.open("https://github.com/gokul1599", "_blank"); } },
      { group: "Actions", icon: "🐦", title: "Open X / Twitter", desc: "x.com/gokul_k_12", keywords: "x twitter social profile tweets", action: () => { closePalette(); window.open("https://x.com/gokul_k_12", "_blank"); } },
      { group: "Actions", icon: "✉️", title: "Send Direct Email", desc: "gokulkarpurapu@gmail.com", keywords: "email mail send reach out contact get in touch", action: () => { closePalette(); window.location.href = "mailto:gokulkarpurapu@gmail.com"; } }
    ];

    let selectedIndex = 0;
    let filteredCommands = [...commands];

    function openPalette() {
      paletteBackdrop.classList.add("open");
      paletteBackdrop.setAttribute("aria-hidden", "false");
      cmdInput.value = "";
      filterCommands("");
      ScrollLock.lock("command-palette");
      setTimeout(() => cmdInput.focus(), 30);
    }

    function closePalette() {
      paletteBackdrop.classList.remove("open");
      paletteBackdrop.setAttribute("aria-hidden", "true");
      ScrollLock.unlock("command-palette");
    }

    function scrollToSection(id) {
      const el = $(`#${id}`);
      if (el) {
        closePalette();
        const headerOffset = 76;
        const pos = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: pos - headerOffset, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    }

    function renderResults() {
      if (filteredCommands.length === 0) {
        cmdInput.removeAttribute("aria-activedescendant");
        cmdResults.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-size: 12px;">
            No commands or projects matching query.
          </div>
        `;
        return;
      }

      let html = "";
      let currentGroup = "";
      filteredCommands.forEach((cmd, idx) => {
        if (cmd.group !== currentGroup) {
          currentGroup = cmd.group;
          html += `<div class="cmd-group-label">${currentGroup}</div>`;
        }
        html += `
          <div class="cmd-item ${idx === selectedIndex ? 'active' : ''}" id="cmd-option-${idx}" data-cmd-idx="${idx}" role="option" aria-selected="${idx === selectedIndex}">
            <div class="cmd-item-left">
              <span class="cmd-item-icon">${cmd.icon}</span>
              <div class="cmd-item-info">
                <span class="cmd-item-title">${cmd.title}</span>
                <span class="cmd-item-desc">${cmd.desc}</span>
              </div>
            </div>
            <span class="cmd-item-tag">${cmd.group}</span>
          </div>
        `;
      });
      cmdResults.innerHTML = html;
      cmdInput.setAttribute("aria-activedescendant", `cmd-option-${selectedIndex}`);

      $$(".cmd-item", cmdResults).forEach((item) => {
        item.addEventListener("click", () => {
          const idx = parseInt(item.getAttribute("data-cmd-idx") || "0", 10);
          if (filteredCommands[idx]) filteredCommands[idx].action();
        });
      });
    }

    function filterCommands(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        filteredCommands = [...commands];
      } else {
        filteredCommands = commands.filter((c) =>
          c.title.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.group.toLowerCase().includes(q) ||
          (c.keywords && c.keywords.toLowerCase().includes(q))
        );
      }
      selectedIndex = 0;
      renderResults();
    }

    cmdInput.addEventListener("input", (e) => {
      filterCommands(e.target.value);
    });

    cmdInput.addEventListener("keydown", (e) => {
      if (filteredCommands.length === 0) {
        if (e.key === "Escape") closePalette();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderResults();
        ensureActiveItemVisible();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderResults();
        ensureActiveItemVisible();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        closePalette();
      }
    });

    function ensureActiveItemVisible() {
      const activeEl = $(".cmd-item.active", cmdResults);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }

    if (triggerBtn) {
      triggerBtn.addEventListener("click", openPalette);
    }

    paletteBackdrop.addEventListener("click", (e) => {
      if (e.target === paletteBackdrop) closePalette();
    });

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (paletteBackdrop.classList.contains("open")) {
          closePalette();
        } else {
          openPalette();
        }
      }
    });
  }
  initCommandPalette();

  /* ============================================================
     14. EXPERIENCE MODE VS. READ MODE CONTROLLER
     ============================================================ */
  function initModeToggle() {
    const modeBtn = $("#mode-toggle-btn");
    const modeLabel = $("#mode-label");

    function applyMode(mode) {
      if (mode === "read") {
        isReadModeActive = true;
        document.documentElement.setAttribute("data-mode", "read");
        if (modeLabel) modeLabel.textContent = "READ MODE";
        try { localStorage.setItem("gl_mode", "read"); } catch (_) { /* Storage can be unavailable. */ }
      } else {
        isReadModeActive = false;
        document.documentElement.setAttribute("data-mode", "experience");
        if (modeLabel) modeLabel.textContent = "EXPERIENCE";
        try { localStorage.setItem("gl_mode", "experience"); } catch (_) { /* Keep the mode usable without persistence. */ }
      }
    }

    let savedMode = "experience";
    try { savedMode = localStorage.getItem("gl_mode") || savedMode; } catch (_) { /* Use the default when storage is blocked. */ }
    applyMode(savedMode);

    if (modeBtn) {
      modeBtn.addEventListener("click", () => {
        applyMode(isReadModeActive ? "experience" : "read");
      });
    }

    window.toggleExperienceMode = function () {
      applyMode(isReadModeActive ? "experience" : "read");
    };
  }
  initModeToggle();

  /* ============================================================
     15. RECRUITER 30-SECOND QUICK SCAN DRAWER
     ============================================================ */
  function initRecruiterQuickView() {
    const recruiterModal = $("#recruiter-modal");
    const quickBtn = $("#recruiter-quick-btn");
    const closeBtn = $("#recruiter-close-btn");

    function openRecruiterModal() {
      if (!recruiterModal) return;
      recruiterModal.classList.add("open");
      recruiterModal.setAttribute("aria-hidden", "false");
      ScrollLock.lock("recruiter-modal");
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 50);
      }
    }

    function closeRecruiterModal() {
      if (!recruiterModal) return;
      recruiterModal.classList.remove("open");
      recruiterModal.setAttribute("aria-hidden", "true");
      ScrollLock.unlock("recruiter-modal");
    }

    window.openRecruiterModal = openRecruiterModal;
    window.closeRecruiterModal = closeRecruiterModal;

    if (quickBtn) quickBtn.addEventListener("click", openRecruiterModal);
    if (closeBtn) closeBtn.addEventListener("click", closeRecruiterModal);

    if (recruiterModal) {
      recruiterModal.addEventListener("click", (e) => {
        if (e.target === recruiterModal) closeRecruiterModal();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && recruiterModal && recruiterModal.classList.contains("open")) {
        closeRecruiterModal();
      }
    });
  }
  initRecruiterQuickView();



  /* ============================================================
     16B. EMAIL COPY TO CLIPBOARD HANDLER
     ============================================================ */
  function initEmailCopy() {
    const btn = $("#btn-copy-email");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email") || "gokulkarpurapu@gmail.com";
      const copyText = btn.querySelector(".copy-text");
      const copyFeedback = btn.querySelector(".copy-feedback");

      function showSuccess() {
        btn.classList.add("copied");
        if (copyText) copyText.style.display = "none";
        if (copyFeedback) copyFeedback.style.display = "inline";

        setTimeout(() => {
          btn.classList.remove("copied");
          if (copyText) copyText.style.display = "inline";
          if (copyFeedback) copyFeedback.style.display = "none";
        }, 2200);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showSuccess).catch(() => {
          fallbackCopy(email);
          showSuccess();
        });
      } else {
        fallbackCopy(email);
        showSuccess();
      }
    });

    function fallbackCopy(text) {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "absolute";
      t.style.left = "-9999px";
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t);
    }
  }
  initEmailCopy();

  /* ============================================================
     17. FLOATING BACK TO TOP BUTTON
     ============================================================ */
  function initBackToTop() {
    const btn = $("#back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle("visible", scrollY > 500);
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
  initBackToTop();

  /* ============================================================
     17. LOG INITIALIZATION STATUS
     ============================================================ */
  console.log("%cGOKUL LABS %cv9.0 — Living Digital Architecture Engine Active (04 Products)", 
    "color: #38bdf8; font-weight: bold; font-family: monospace; font-size: 13px;",
    "color: #94a3b8; font-family: monospace; font-size: 11px;"
  );
})();

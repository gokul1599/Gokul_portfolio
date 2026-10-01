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
        link.classList.toggle("active", link.getAttribute("data-nav") === currentSectionId);
      });
    }

    // Work Section Sequential Active Tracking for Dock Navigator
    if (projectCards.length >= 4) {
      let activeProjIndex = 0;
      projectCards.forEach((pc, idx) => {
        const pRect = pc.getBoundingClientRect();
        if (pRect.top <= window.innerHeight * 0.55 && pRect.bottom >= window.innerHeight * 0.15) {
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
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!menuBtn || !navDrawer) return;
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    navDrawer.classList.remove("open");
    navDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
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
  const cursorDot = $("#cursor-dot");
  const cursorRing = $("#cursor-ring");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (!isTouch && cursorDot && cursorRing && !prefersReducedMotion) {
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function renderCursor() {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnetic interaction on buttons
    const magneticBtns = $$(".magnetic-btn, .btn-primary, .btn-secondary, .nav-link");
    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        cursorRing.classList.add("cursor-hover");
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate3d(0, 0, 0)";
        cursorRing.classList.remove("cursor-hover");
      });
    });
  } else {
    if (cursorDot) cursorDot.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";
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
    if (typeof THREE === "undefined") {
      activateFallback();
      return;
    }

    try {
      // 7A. Scene & Camera Setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x06070a, 0.012);

      const camera = new THREE.PerspectiveCamera(
        42,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      );
      camera.position.set(0, 0, 22);

      // 7B. High-Performance WebGL Renderer with Capped DPR
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      // 7C. Physically Believable Lighting Rig
      const ambientLight = new THREE.AmbientLight(0x08101e, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(12, 16, 20);
      scene.add(keyLight);

      const rimLightCyan = new THREE.PointLight(0x38bdf8, 3.2, 50);
      rimLightCyan.position.set(14, 6, 12);
      scene.add(rimLightCyan);

      const softFillViolet = new THREE.PointLight(0x6366f1, 2.0, 45);
      softFillViolet.position.set(-14, -8, 8);
      scene.add(softFillViolet);

      const cursorLight = new THREE.PointLight(0x38bdf8, 2.6, 32);
      cursorLight.position.set(0, 0, 10);
      scene.add(cursorLight);

      // 7D. Master Artifact Container
      const artifactGroup = new THREE.Group();
      artifactGroup.position.set(4.0, 0, 0); // Positioned to complement left typography on hero
      scene.add(artifactGroup);

      // --------------------------------------------------------
      // LAYER 1: INNER LUMINOUS INTELLIGENCE CORE
      // --------------------------------------------------------
      const coreGroup = new THREE.Group();
      artifactGroup.add(coreGroup);

      const coreGeo = new THREE.OctahedronGeometry(0.75, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.4
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(coreMesh);

      const corePointLight = new THREE.PointLight(0x38bdf8, 3.0, 18);
      coreGroup.add(corePointLight);

      // --------------------------------------------------------
      // LAYER 2: CORE GEOMETRICAL LATTICE (Dark Polished Chrome)
      // --------------------------------------------------------
      const latticeGroup = new THREE.Group();
      artifactGroup.add(latticeGroup);

      const latticeGeo = new THREE.IcosahedronGeometry(1.65, 0);
      const latticeWireGeo = new THREE.WireframeGeometry(latticeGeo);
      const latticeWireMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      const latticeLines = new THREE.LineSegments(latticeWireGeo, latticeWireMat);
      latticeGroup.add(latticeLines);

      // --------------------------------------------------------
      // LAYER 3: TRANSLUCENT SMOKED GLASS MONOLITH SHELLS
      // --------------------------------------------------------
      const glassGroup = new THREE.Group();
      artifactGroup.add(glassGroup);

      const glassGeo = new THREE.CylinderGeometry(2.3, 2.6, 3.8, 8, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x060f1c,
        metalness: artifactShaderUniforms.metalness,
        roughness: artifactShaderUniforms.roughness,
        transmission: artifactShaderUniforms.transmission,
        ior: artifactShaderUniforms.ior,
        reflectivity: 0.85,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const glassShell = new THREE.Mesh(glassGeo, glassMat);
      glassGroup.add(glassShell);

      const glassEdgesGeo = new THREE.EdgesGeometry(glassGeo);
      const glassEdgesMat = new THREE.LineBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.45
      });
      const glassEdges = new THREE.LineSegments(glassEdgesGeo, glassEdgesMat);
      glassGroup.add(glassEdges);

      // --------------------------------------------------------
      // LAYER 4: MODULAR ARCHITECTURAL LOGIC PLATES (Articulating)
      // --------------------------------------------------------
      const logicGroup = new THREE.Group();
      artifactGroup.add(logicGroup);

      const logicPlates = [];
      const plateCount = 4;
      for (let p = 0; p < plateCount; p++) {
        const plateGeo = new THREE.BoxGeometry(3.6, 0.08, 1.8);
        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x0a1626,
          metalness: 0.85,
          roughness: 0.18,
          transparent: true,
          opacity: 0.85
        });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = (p - 1.5) * 0.95;
        plate.rotation.y = (p * Math.PI) / 4;
        logicGroup.add(plate);
        logicPlates.push(plate);
      }

      // --------------------------------------------------------
      // LAYER 5: FINE POLAR COORDINATE ARMATURE RINGS
      // --------------------------------------------------------
      const armatureGroup = new THREE.Group();
      artifactGroup.add(armatureGroup);

      function createPolarRing(radius, tiltX, tiltZ, colorHex = 0x38bdf8) {
        const ringGeo = new THREE.TorusGeometry(radius, 0.018, 8, 120);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.42,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = tiltX;
        ring.rotation.z = tiltZ;
        armatureGroup.add(ring);
        return ring;
      }

      const ringInner = createPolarRing(3.4, Math.PI * 0.3, Math.PI * 0.15);
      const ringOuter = createPolarRing(4.8, -Math.PI * 0.25, Math.PI * 0.35, 0x818cf8);

      // Expose Shader Calibrator Hook (Lab Exp 02)
      updateArtifactMaterial = function (params) {
        if (params.transmission !== undefined) {
          glassMat.transmission = params.transmission;
          artifactShaderUniforms.transmission = params.transmission;
        }
        if (params.roughness !== undefined) {
          glassMat.roughness = params.roughness;
          artifactShaderUniforms.roughness = params.roughness;
        }
        if (params.ior !== undefined) {
          glassMat.ior = params.ior;
          artifactShaderUniforms.ior = params.ior;
        }
      };

      // Expose Stack Layer Resonance Hook
      highlightArtifactLayer = function (layerName) {
        if (layerName === "ai") {
          coreMat.emissiveIntensity = 2.4;
          corePointLight.intensity = 6.0;
        } else if (layerName === "web") {
          glassMat.opacity = 0.95;
          glassEdgesMat.opacity = 0.9;
        } else if (layerName === "tools") {
          armatureGroup.scale.set(1.12, 1.12, 1.12);
        } else if (layerName === "languages") {
          latticeWireMat.opacity = 0.95;
        } else {
          // Reset
          coreMat.emissiveIntensity = 0.85;
          corePointLight.intensity = 3.0;
          glassMat.opacity = 0.78;
          glassEdgesMat.opacity = 0.45;
          armatureGroup.scale.set(1, 1, 1);
          latticeWireMat.opacity = 0.5;
        }
      };

      // 7E. Target State Variables for Scroll Transformations
      // RESTRAINED MOTION: The artifact is almost still at rest, evolving calmly through scroll
      let targetArtifactPos = { x: 4.0, y: 0, z: 0 };
      let targetArtifactRot = { x: 0.15, y: 0.35, z: 0 };
      let targetGlassSeparation = 0;
      let targetLogicSeparation = 1;

      // Mouse Parallax Offsets
      let targetMouseX = 0;
      let targetMouseY = 0;
      let smoothMouseX = 0;
      let smoothMouseY = 0;

      if (!isTouch && !prefersReducedMotion) {
        window.addEventListener("mousemove", (e) => {
          targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
      }

      // Responsive Adjustments on Window Resize
      function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;

        // Position artifact comfortably on smaller screens
        if (width < 768) {
          camera.position.set(0, 0, 26);
          targetArtifactPos.x = 0;
          targetArtifactPos.y = -2.0;
        } else if (width < 1024) {
          camera.position.set(0, 0, 24);
          targetArtifactPos.x = 2.6;
          targetArtifactPos.y = 0;
        } else {
          camera.position.set(0, 0, 22);
          targetArtifactPos.x = 4.0;
          targetArtifactPos.y = 0;
        }

        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
      window.addEventListener("resize", onWindowResize);
      onWindowResize();

      // Page Visibility API to Pause Loop When Inactive
      let isDocumentVisible = true;
      document.addEventListener("visibilitychange", () => {
        isDocumentVisible = !document.hidden;
      });

      // 7F. Main WebGL Animation Frame Loop
      let clock = new THREE.Clock();

      function animateWebGL() {
        requestAnimationFrame(animateWebGL);
        if (!isDocumentVisible) return;

        const elapsedTime = clock.getElapsedTime();

        // Smooth Mouse Parallax
        smoothMouseX = lerp(smoothMouseX, targetMouseX, 0.05);
        smoothMouseY = lerp(smoothMouseY, targetMouseY, 0.05);

        cursorLight.position.x = smoothMouseX * 12;
        cursorLight.position.y = -smoothMouseY * 8;

        // Extremely gentle architectural resting breath (NOT endless screensaver spin)
        const idleBreathe = Math.sin(elapsedTime * 0.45) * 0.035;

        // Update State Targets based on Active Section
        const isMobile = window.innerWidth < 768;

        switch (currentSectionId) {
          case "hero":
            // State 0: IDEA / INTELLIGENCE (Compact, unified, resting calmly)
            targetArtifactPos.x = isMobile ? 0 : 4.0;
            targetArtifactPos.y = isMobile ? -2.0 : 0;
            targetArtifactPos.z = 0;
            targetArtifactRot.x = 0.15 + smoothMouseY * 0.1;
            targetArtifactRot.y = 0.35 + smoothMouseX * 0.15 + idleBreathe;
            targetGlassSeparation = 0;
            targetLogicSeparation = 1;
            break;

          case "work":
            // State 1: MODULAR PROJECT FOCUS (Shifts into viewport depth)
            targetArtifactPos.x = isMobile ? 0 : 5.0;
            targetArtifactPos.y = isMobile ? -2.5 : -0.5;
            targetArtifactPos.z = -3.5;
            targetArtifactRot.x = 0.25 + smoothMouseY * 0.08;
            targetArtifactRot.y = 0.65 + smoothMouseX * 0.12 + idleBreathe;
            targetGlassSeparation = 0.3;
            targetLogicSeparation = 1.25;
            break;

          case "about":
            // State 2: STRUCTURAL DISCLOSURE (Smoked shells glide open, revealing core)
            targetArtifactPos.x = isMobile ? 0 : -4.2;
            targetArtifactPos.y = isMobile ? -2.2 : 0.4;
            targetArtifactPos.z = -1.8;
            targetArtifactRot.x = 0.2 + smoothMouseY * 0.06;
            targetArtifactRot.y = 1.05 + smoothMouseX * 0.1 + idleBreathe;
            targetGlassSeparation = 0.9;
            targetLogicSeparation = 1.5;
            break;

          case "lab":
            // State 3: EXPERIMENTAL RESONANCE
            targetArtifactPos.x = isMobile ? 0 : 4.5;
            targetArtifactPos.y = isMobile ? -2.0 : -0.3;
            targetArtifactPos.z = -1.5;
            targetArtifactRot.x = 0.28 + smoothMouseY * 0.08;
            targetArtifactRot.y = 1.45 + smoothMouseX * 0.12 + idleBreathe;
            targetGlassSeparation = 0.5;
            targetLogicSeparation = 1.2;
            break;

          case "stack":
            // State 4: TECHNICAL STRATIFICATION (Tiers separate distinctly)
            targetArtifactPos.x = isMobile ? 0 : 0;
            targetArtifactPos.y = isMobile ? -1.8 : -1.0;
            targetArtifactPos.z = -2.5;
            targetArtifactRot.x = 0.45 + smoothMouseY * 0.06;
            targetArtifactRot.y = 1.95 + smoothMouseX * 0.1 + idleBreathe;
            targetGlassSeparation = 1.2;
            targetLogicSeparation = 1.8;
            break;

          case "journey":
            // State 5: PROGRESSION AXIS (Forward trajectory)
            targetArtifactPos.x = isMobile ? 0 : -4.5;
            targetArtifactPos.y = isMobile ? -1.8 : -0.4;
            targetArtifactPos.z = -2.0;
            targetArtifactRot.x = 0.22 + smoothMouseY * 0.06;
            targetArtifactRot.y = 2.45 + smoothMouseX * 0.1 + idleBreathe;
            targetGlassSeparation = 0.4;
            targetLogicSeparation = 1.3;
            break;

          case "contact":
            // State 6: REUNIFICATION & HARMONY (All layers converge back into one object)
            targetArtifactPos.x = isMobile ? 0 : 0;
            targetArtifactPos.y = isMobile ? -2.0 : 0;
            targetArtifactPos.z = 0.5;
            targetArtifactRot.x = 0.15 + smoothMouseY * 0.08;
            targetArtifactRot.y = 3.14 + smoothMouseX * 0.12 + idleBreathe;
            targetGlassSeparation = 0;
            targetLogicSeparation = 1;
            break;
        }

        // Interpolate Master Container Transform
        artifactGroup.position.x = lerp(artifactGroup.position.x, targetArtifactPos.x, 0.04);
        artifactGroup.position.y = lerp(artifactGroup.position.y, targetArtifactPos.y, 0.04);
        artifactGroup.position.z = lerp(artifactGroup.position.z, targetArtifactPos.z, 0.04);

        artifactGroup.rotation.x = lerp(artifactGroup.rotation.x, targetArtifactRot.x, 0.04);
        artifactGroup.rotation.y = lerp(artifactGroup.rotation.y, targetArtifactRot.y, 0.04);

        // Core Subtle Breathing
        const breathe = Math.sin(elapsedTime * 1.5) * 0.05 + 1.0;
        coreGroup.scale.set(breathe, breathe, breathe);

        // Sub-Layer Micro-Articulations (Subtle & slow, not spinning)
        latticeGroup.rotation.y = -elapsedTime * 0.03;
        armatureGroup.rotation.z = elapsedTime * 0.015;

        // Shell & Logic Separation
        glassShell.position.y = lerp(glassShell.position.y, targetGlassSeparation, 0.04);
        logicPlates.forEach((plate, idx) => {
          const baseHeight = (idx - 1.5) * 0.95;
          plate.position.y = lerp(plate.position.y, baseHeight * targetLogicSeparation, 0.04);
        });

        renderer.render(scene, camera);
      }

      animateWebGL();

    } catch (err) {
      console.warn("WebGL initialization failed, switching to clean fallback:", err);
      activateFallback();
    }
  }

  function activateFallback() {
    if (canvasEl) canvasEl.style.display = "none";
    const fallback = $("#webgl-fallback");
    if (fallback) fallback.classList.add("active");
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
    document.body.style.overflow = "hidden";
  }

  function closeCaseStudy() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Attach Open Listeners to Case Study Buttons
  $$("[data-open-study]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-open-study");
      if (pId) openCaseStudy(pId);
    });
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
  const outTokens = $("#out-tokens");
  const presetBtns = $$(".preset-btn");

  const promptPresets = {
    venture: "ROLE: Venture Architect\nCONTEXT: Early-stage founder exploring venture hypotheses.\nOBJECTIVE: Formulate a lean MVP specification focusing on unit economics and retention.\nCONSTRAINTS: Avoid premature scaling; validate client-side privacy.",
    ocr: "ROLE: Bilingual Accessibility Linguist\nCONTEXT: Official technical circular drafted in dense English.\nOBJECTIVE: Translate into colloquial conversational Telugu with 0.8x speech pacing.\nCONSTRAINTS: Preserve technical terms while eliminating bureaucratic jargon.",
    spatial: "ROLE: Spatial Graphics Engineer\nCONTEXT: 2D residential floor plan with double-height ceiling.\nOBJECTIVE: Generate bounding box parameters and physically accurate daylight reflections.\nCONSTRAINTS: Cap draw calls under 60; enforce PBR energy conservation."
  };

  function analyzePrompt(text) {
    if (!text) return;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const tokens = Math.round(words.length * 1.32);
    if (outTokens) outTokens.textContent = tokens;

    const match = text.match(/ROLE:\s*([^\n\r]+)/i);
    if (outRole) {
      outRole.textContent = match ? match[1].trim() : "Custom Structure";
    }
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
    function updateSpringPhysics() {
      if (!isDraggingSpring) {
        const forceX = -springParams.stiffness * (springPos.x * 0.01) - springParams.damping * springVel.x;
        const forceY = -springParams.stiffness * (springPos.y * 0.01) - springParams.damping * springVel.y;
        
        springVel.x += (forceX / springParams.mass) * 0.016;
        springVel.y += (forceY / springParams.mass) * 0.016;

        springPos.x += springVel.x;
        springPos.y += springVel.y;

        springTarget.style.transform = `translate3d(${springPos.x.toFixed(2)}px, ${springPos.y.toFixed(2)}px, 0)`;
      }
      requestAnimationFrame(updateSpringPhysics);
    }
    requestAnimationFrame(updateSpringPhysics);

    springTarget.addEventListener("mousedown", () => {
      isDraggingSpring = true;
    });

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

    window.addEventListener("mouseup", () => {
      isDraggingSpring = false;
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
      copy: "Construct modular React/Next.js/Three.js code with zero runtime errors, accessible DOM structure, and sub-100ms response targets."
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
     12. LOG INITIALIZATION STATUS
     ============================================================ */
  console.log("%cGOKUL LABS %cv8.5 — Living Digital Architecture Engine Active", 
    "color: #38bdf8; font-weight: bold; font-family: monospace; font-size: 13px;",
    "color: #94a3b8; font-family: monospace; font-size: 11px;"
  );
})();

/**
 * GOKUL LABS — LIVING AI ARCHITECTURE
 * 3D WebGL Architectural Environment & Creative Interaction Engine
 * 
 * Aesthetic: Futuristic Technology Laboratory built around intelligence,
 * engineering, and product creation.
 * 
 * Visual Foundation:
 * - Extremely deep graphite / near-black environment (80-90% quiet void)
 * - Enormous translucent glass planes & thin metallic frames
 * - Dynamic scroll camera moving through true physical depth
 * - Section-reactive architectural metamorphism:
 *   Hero (Void) → Intelligence Core (Separating Monoliths) → About (5 Thought Layers)
 *   → Toolkit (Precision Lab Grid) → Valtora (Startup Blueprint) → Singularity Collapse
 *   → LifeHub (Calm Modular System) → Convergence Void → Contact (Monolithic Ring)
 * - Contact button hover reacts with central ring lighting
 */

(function () {
  "use strict";

  // --- DOM SELECTORS ---
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // --- DYNAMIC YEAR & CLOCK ---
  const yearEl = $("#copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const liveClockEl = $("#live-clock");
  function updateLiveClock() {
    if (!liveClockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    liveClockEl.textContent = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // --- SCROLL PROGRESS & NAVBAR ---
  const progressBar = $("#scroll-progress");
  const navbar = $("#navbar");
  const navLinks = $$(".nav-link");
  const sections = $$("section[id]");

  let globalScrollProgress = 0;

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    globalScrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    if (progressBar) {
      progressBar.style.width = `${globalScrollProgress * 100}%`;
    }

    if (navbar) {
      if (scrollTop > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Active Section Indicator
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // --- MOBILE NAV DRAWER ---
  const menuBtn = $("#menu-btn");
  const navMenu = $("#nav-menu");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuBtn.classList.toggle("active", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".nav-link", navMenu).forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuBtn.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- SMOOTH SCROLL FOR ANCHORS ---
  $$("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = $(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // --- INTERSECTION OBSERVER REVEALS ---
  const revealElements = $$(".reveal, .reveal-fade");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // --- SUBTLE CURSOR GLOW ---
  const cursorGlow = $(".cursor-glow");
  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  // --- 3D PERSPECTIVE CARD TILT ---
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxTilt = parseFloat(card.dataset.tilt) || 6;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // --- THE INTELLIGENCE CORE: STAGES INTERACTION ---
  const stageCards = $$(".stage-card");
  stageCards.forEach((card) => {
    card.addEventListener("click", () => {
      stageCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  // ==========================================================================
  // GOKUL LABS — LIVING AI ARCHITECTURE (3D WEBGL ENGINE)
  // ==========================================================================
  const canvasEl = $("#webgl-canvas");
  if (canvasEl) {
    initLivingArchitecture(canvasEl);
  }

  function initLivingArchitecture(canvas) {
    if (typeof THREE === "undefined") {
      initArchitectural2DFallback(canvas);
      return;
    }

    try {
      // 1. Scene & Deep Atmospheric Haze (Fog)
      const scene = new THREE.Scene();
      const graphiteBg = new THREE.Color(0x050608);
      scene.background = graphiteBg;
      scene.fog = new THREE.FogExp2(0x050608, 0.016); // Subtle atmospheric depth-of-field

      // 2. Camera Setup
      const camera = new THREE.PerspectiveCamera(
        48,
        window.innerWidth / window.innerHeight,
        0.1,
        180
      );
      camera.position.set(0, 0, 26);

      // 3. Renderer with High Dynamic Range & Tone Mapping
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: false,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      // Master Architectural Group
      const archGroup = new THREE.Group();
      scene.add(archGroup);

      // 4. Lighting Rig
      const ambientLight = new THREE.AmbientLight(0x0a0d14, 0.9);
      scene.add(ambientLight);

      // Key soft light behind typography
      const keyLight = new THREE.DirectionalLight(0xe2e8f0, 0.85);
      keyLight.position.set(5, 12, 18);
      scene.add(keyLight);

      // Controlled rim light (subtle steel/cool cyan)
      const rimLight = new THREE.PointLight(0x38bdf8, 0.45, 60);
      rimLight.position.set(-15, -8, -5);
      scene.add(rimLight);

      // Contact Ring Accent Light
      const contactLight = new THREE.PointLight(0xb5ff4d, 0.1, 40);
      contactLight.position.set(0, 0, 5);
      scene.add(contactLight);

      // 5. Materials (Translucent Glass & Precision Metallic Wireframes)
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x111622,
        metalness: 0.2,
        roughness: 0.15,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const frameMat = new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.38
      });

      const thinAccentMat = new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.45
      });

      // --- ARCHITECTURAL ELEMENTS CREATION ---

      // A. Enormous Translucent Glass Planes at Varying Depths
      // Frame 1 (Far Void)
      const planeFarGeo = new THREE.PlaneGeometry(42, 28);
      const planeFar = new THREE.Mesh(planeFarGeo, glassMat);
      planeFar.position.set(6, 2, -38);
      planeFar.rotation.y = -0.12;
      const planeFarEdges = new THREE.LineSegments(new THREE.EdgesGeometry(planeFarGeo), frameMat);
      planeFar.add(planeFarEdges);
      archGroup.add(planeFar);

      // Frame 2 (Mid Depth - Angled Laboratory Wall)
      const planeMidGeo = new THREE.PlaneGeometry(28, 20);
      const planeMid = new THREE.Mesh(planeMidGeo, glassMat);
      planeMid.position.set(-8, -1, -18);
      planeMid.rotation.y = 0.18;
      planeMid.rotation.x = 0.05;
      const planeMidEdges = new THREE.LineSegments(new THREE.EdgesGeometry(planeMidGeo), frameMat);
      planeMid.add(planeMidEdges);
      archGroup.add(planeMid);

      // Frame 3 (Near Field Monolith)
      const planeNearGeo = new THREE.PlaneGeometry(18, 14);
      const planeNear = new THREE.Mesh(planeNearGeo, glassMat);
      planeNear.position.set(10, -3, -4);
      planeNear.rotation.y = -0.22;
      const planeNearEdges = new THREE.LineSegments(new THREE.EdgesGeometry(planeNearGeo), thinAccentMat);
      planeNear.add(planeNearEdges);
      archGroup.add(planeNear);

      // B. 5 Stepped Thought Layers for About Section (Metaphor: Problem → Research → Tech → Product → Execution)
      const thoughtLayers = [];
      const layerGeo = new THREE.PlaneGeometry(16, 10);
      for (let i = 0; i < 5; i++) {
        const tLayer = new THREE.Mesh(layerGeo, glassMat.clone());
        tLayer.material.opacity = 0.04 + i * 0.015;
        tLayer.position.set(0, 0, -12 - i * 4);
        const tEdges = new THREE.LineSegments(new THREE.EdgesGeometry(layerGeo), frameMat);
        tLayer.add(tEdges);
        archGroup.add(tLayer);
        thoughtLayers.push(tLayer);
      }

      // C. Technical Precision Grid & Coordinates for Toolkit Section
      const techGrid = new THREE.GridHelper(36, 18, 0x334155, 0x1e293b);
      techGrid.position.set(0, -10, -15);
      techGrid.material.transparent = true;
      techGrid.material.opacity = 0.22;
      archGroup.add(techGrid);

      // D. Central Singularity Core & Precision Concentric Rings
      const singularityGroup = new THREE.Group();
      singularityGroup.position.set(4, 0, -14);
      archGroup.add(singularityGroup);

      // Precision Rings
      const ringGeometries = [
        { r: 4.8, segs: 64, color: 0x94a3b8, opacity: 0.4 },
        { r: 7.2, segs: 72, color: 0x475569, opacity: 0.25 },
        { r: 9.6, segs: 96, color: 0x334155, opacity: 0.18 }
      ];

      const rings = [];
      ringGeometries.forEach((rg, idx) => {
        const ringGeo = new THREE.BufferGeometry();
        const positions = [];
        for (let j = 0; j <= rg.segs; j++) {
          const theta = (j / rg.segs) * Math.PI * 2;
          positions.push(Math.cos(theta) * rg.r, Math.sin(theta) * rg.r, 0);
        }
        ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        const rLine = new THREE.Line(
          ringGeo,
          new THREE.LineBasicMaterial({ color: rg.color, transparent: true, opacity: rg.opacity })
        );
        rLine.rotation.x = Math.PI / 4 + idx * 0.2;
        singularityGroup.add(rLine);
        rings.push(rLine);
      });

      // Octagonal Inner Chamber Wireframe
      const octGeo = new THREE.CylinderGeometry(2.6, 2.6, 3.8, 8, 1, true);
      const octEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(octGeo),
        new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })
      );
      singularityGroup.add(octEdges);

      // E. Contact Architectural Precision Ring (Centrally Positioned for Section 07)
      const contactRingGeo = new THREE.BufferGeometry();
      const contactPositions = [];
      const cSegs = 96;
      const cRadius = 11.5;
      for (let k = 0; k <= cSegs; k++) {
        const theta = (k / cSegs) * Math.PI * 2;
        contactPositions.push(Math.cos(theta) * cRadius, Math.sin(theta) * cRadius, 0);
      }
      contactRingGeo.setAttribute("position", new THREE.Float32BufferAttribute(contactPositions, 3));
      const contactRing = new THREE.Line(
        contactRingGeo,
        new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.3 })
      );
      contactRing.position.set(0, 0, -22);
      archGroup.add(contactRing);

      // Add architectural tick marks around contact ring
      const ticksGroup = new THREE.Group();
      for (let t = 0; t < 24; t++) {
        const rad = (t / 24) * Math.PI * 2;
        const tickGeo = new THREE.BufferGeometry();
        const innerX = Math.cos(rad) * 11.2;
        const innerY = Math.sin(rad) * 11.2;
        const outerX = Math.cos(rad) * 11.8;
        const outerY = Math.sin(rad) * 11.8;
        tickGeo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute([innerX, innerY, 0, outerX, outerY, 0], 3)
        );
        const tickLine = new THREE.Line(
          tickGeo,
          new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.25 })
        );
        ticksGroup.add(tickLine);
      }
      contactRing.add(ticksGroup);

      // --- MOUSE & INTERACTIVE SPRINGS ---
      let mouseX = 0;
      let mouseY = 0;
      let targetCamRotX = 0;
      let targetCamRotY = 0;
      let smoothScroll = 0;

      window.addEventListener("pointermove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        targetCamRotY = -mouseX * 0.04;
        targetCamRotX = -mouseY * 0.03;
      });

      // Contact button hover interaction
      let contactHovered = false;
      const contactButtons = $$("#contact a");
      contactButtons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          contactHovered = true;
        });
        btn.addEventListener("mouseleave", () => {
          contactHovered = false;
        });
      });

      // Handle Resize
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // 6. Animation Loop (60fps, Smooth Camera & Architectural Metamorphosis)
      const clock = new THREE.Clock();

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Smooth spring scroll interpolation
        smoothScroll += (globalScrollProgress - smoothScroll) * 0.06;

        // Camera distance & path across scroll checkpoints:
        // 0% (Hero): Camera z ~ 26
        // 25% (Intelligence/About): Camera z ~ 21
        // 50% (Toolkit): Camera z ~ 16
        // 75% (Projects): Camera z ~ 11
        // 100% (Contact): Camera z ~ 8
        const targetCamZ = 26 - smoothScroll * 18;
        camera.position.z += (targetCamZ - camera.position.z) * 0.08;

        // Subtle camera inertia tilt following cursor
        camera.rotation.y += (targetCamRotY - camera.rotation.y) * 0.05;
        camera.rotation.x += (targetCamRotX - camera.rotation.x) * 0.05;

        // --- STAGE-BY-STAGE ARCHITECTURAL TRANSFORMATION ---

        // 1. Hero / Intelligence Core (0 - 25%)
        // Large glass frames subtly drift and separate horizontally
        const heroSpread = Math.min(1, smoothScroll * 4);
        planeFar.position.x = 6 + heroSpread * 3;
        planeFar.rotation.y = -0.12 - heroSpread * 0.08;
        planeMid.position.x = -8 - heroSpread * 2.5;

        // 2. About Section: 5 Thought Layers Drifting Apart (20% - 40%)
        const aboutFactor = Math.max(0, Math.min(1, (smoothScroll - 0.2) * 5));
        thoughtLayers.forEach((layer, idx) => {
          layer.position.x = (idx - 2) * aboutFactor * 2.2;
          layer.rotation.y = (idx - 2) * aboutFactor * 0.04;
          layer.rotation.x = Math.sin(time * 0.3 + idx) * 0.02;
        });

        // 3. Toolkit Section: Grid Elevation & Technical Raking Light (40% - 60%)
        const toolFactor = Math.max(0, Math.min(1, (smoothScroll - 0.4) * 5));
        techGrid.position.y = -10 + toolFactor * 4;
        techGrid.material.opacity = 0.15 + toolFactor * 0.25;

        // 4. Projects: Valtora Blueprint & Singularity Collapse (60% - 85%)
        // As we move between Valtora and LifeHub, geometry compresses into center, then blooms
        const projTransition = Math.sin(Math.max(0, Math.min(Math.PI, (smoothScroll - 0.62) * Math.PI * 4)));
        singularityGroup.scale.setScalar(1 - projTransition * 0.45);
        singularityGroup.rotation.y = time * 0.15 + smoothScroll * Math.PI;

        // 5. Contact Section & Architectural Ring (85% - 100%)
        const contactFactor = Math.max(0, Math.min(1, (smoothScroll - 0.82) * 6));
        contactRing.rotation.z = time * 0.08;
        contactRing.scale.setScalar(0.7 + contactFactor * 0.3);

        // Contact Button Hover Interaction: Ring responds with subtle speed and emissive glow
        if (contactHovered) {
          contactRing.rotation.z += delta * 0.35;
          contactLight.intensity += (0.6 - contactLight.intensity) * 0.1;
        } else {
          contactLight.intensity += (0.05 - contactLight.intensity) * 0.05;
        }

        // Concentric precision rings rotation
        rings.forEach((r, idx) => {
          r.rotation.z += 0.003 * (idx % 2 === 0 ? 1 : -1);
        });

        octEdges.rotation.y = time * 0.1;

        // Dynamic light tracking
        keyLight.position.x = 5 + Math.sin(time * 0.2) * 3;
        keyLight.position.y = 12 - smoothScroll * 10;

        renderer.render(scene, camera);
      }

      renderFrame();
    } catch (err) {
      console.warn("Living Architecture WebGL fallback:", err);
      initArchitectural2DFallback(canvas);
    }
  }

  // --- RESTRAINED ARCHITECTURAL 2D CANVAS FALLBACK ---
  function initArchitectural2DFallback(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function drawArch2D() {
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle architectural perspective frames
      ctx.strokeStyle = "rgba(71, 85, 105, 0.18)";
      ctx.lineWidth = 1;

      const cx = width / 2;
      const cy = height / 2;

      // Outer frame
      ctx.strokeRect(cx - 300, cy - 200, 600, 400);

      // Inner frame with scroll shift
      const shift = (globalScrollProgress || 0) * 80;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
      ctx.strokeRect(cx - 200 + shift * 0.2, cy - 140 - shift * 0.1, 400, 280);

      requestAnimationFrame(drawArch2D);
    }

    drawArch2D();
  }

  // Extensible Project Registry log
  if (window.PROJECTS && Array.isArray(window.PROJECTS)) {
    console.log(`Gokul Labs: ${window.PROJECTS.length} verified projects loaded.`);
  }
})();

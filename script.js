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

    // Right vertical scroll tracker dot
    const trackerDot = $("#scroll-tracker-dot");
    if (trackerDot) {
      trackerDot.style.top = `${globalScrollProgress * 65}px`;
    }

    // Smooth parallax on hero visual background
    const heroBg = $(".hero-bg-layer");
    if (heroBg && scrollTop < window.innerHeight * 1.5) {
      heroBg.style.transform = `translate3d(0, ${scrollTop * 0.22}px, 0)`;
    }

    if (navbar) {
      if (scrollTop > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Active Section Indicator with Dot
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      $$(".nav-link-dot, .nav-link").forEach((link) => {
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
      // 1. Scene & Deep Atmospheric Fog
      const scene = new THREE.Scene();
      // Transparent background so the cinematic hero environment shows through
      scene.fog = new THREE.FogExp2(0x050608, 0.012);

      // 2. Camera Setup
      const camera = new THREE.PerspectiveCamera(
        46,
        window.innerWidth / window.innerHeight,
        0.1,
        180
      );
      camera.position.set(0, 0, 22);

      // 3. Renderer with High Dynamic Range & Alpha Transparency
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
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
      const ambientLight = new THREE.AmbientLight(0x0a101d, 1.2);
      scene.add(ambientLight);

      // Key soft light behind typography
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
      keyLight.position.set(8, 14, 18);
      scene.add(keyLight);

      // Controlled rim light (electric cyan)
      const rimLight = new THREE.PointLight(0x38bdf8, 2.8, 55);
      rimLight.position.set(8, 2, 8);
      scene.add(rimLight);

      // Deep violet accent light
      const violetRimLight = new THREE.PointLight(0x818cf8, 1.8, 45);
      violetRimLight.position.set(-12, -6, 6);
      scene.add(violetRimLight);

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

      // D. Central Singularity Core & Precision Living Architecture
      const singularityGroup = new THREE.Group();
      archGroup.add(singularityGroup);

      function updateSingularityPosition() {
        const isMobile = window.innerWidth < 900;
        singularityGroup.position.set(isMobile ? 0 : 5.8, isMobile ? 2.2 : 0.0, 0);
        singularityGroup.scale.setScalar(isMobile ? 0.72 : 1.0);
      }
      updateSingularityPosition();
      window.addEventListener("resize", updateSingularityPosition);

      // 1. Central Luminous Core & Multi-layer Glass Orb
      const coreGeo = new THREE.SphereGeometry(1.85, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      singularityGroup.add(coreMesh);

      const corePointLight = new THREE.PointLight(0x38bdf8, 3.8, 35);
      singularityGroup.add(corePointLight);

      const coronaGeo = new THREE.SphereGeometry(2.15, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      singularityGroup.add(coronaMesh);

      const glassSphereGeo = new THREE.SphereGeometry(2.45, 48, 48);
      const glassSphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x0c1424,
        metalness: 0.15,
        roughness: 0.05,
        transmission: 0.85,
        thickness: 1.5,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const glassSphereMesh = new THREE.Mesh(glassSphereGeo, glassSphereMat);
      singularityGroup.add(glassSphereMesh);

      const sphereWireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(2.48, 16, 16));
      const sphereWireMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });
      const sphereWire = new THREE.LineSegments(sphereWireGeo, sphereWireMat);
      singularityGroup.add(sphereWire);

      // 2. 3D Metallic Precision Orbit Rings with Satellites
      const metallicRingMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.95,
        roughness: 0.15,
        emissive: 0x0284c7,
        emissiveIntensity: 0.2
      });

      const ringConfigs = [
        { radius: 3.8, tube: 0.038, rot: [1.1, 0.35, 0.2], speed: 0.008, nodeRadius: 0.14 },
        { radius: 5.2, tube: 0.042, rot: [-0.8, -0.45, 0.4], speed: -0.006, nodeRadius: 0.16 },
        { radius: 6.8, tube: 0.046, rot: [0.4, 0.95, -0.3], speed: 0.005, nodeRadius: 0.18 }
      ];

      const metallicRings = [];
      ringConfigs.forEach((cfg) => {
        const ringHolder = new THREE.Group();
        ringHolder.rotation.set(...cfg.rot);

        const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
        const rMesh = new THREE.Mesh(rGeo, metallicRingMat);
        ringHolder.add(rMesh);

        // Satellite node dot
        const nodeGeo = new THREE.SphereGeometry(cfg.nodeRadius, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(cfg.radius, 0, 0);
        ringHolder.add(nodeMesh);

        singularityGroup.add(ringHolder);
        metallicRings.push({ group: ringHolder, speed: cfg.speed, node: nodeMesh, radius: cfg.radius });
      });

      // 3. Vertical Luminous Laser Beam Column
      const beamCoreGeo = new THREE.CylinderGeometry(0.04, 0.04, 45, 16);
      const beamCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
      const beamCore = new THREE.Mesh(beamCoreGeo, beamCoreMat);
      singularityGroup.add(beamCore);

      const beamGlowGeo = new THREE.CylinderGeometry(0.24, 0.24, 45, 16);
      const beamGlowMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      const beamGlow = new THREE.Mesh(beamGlowGeo, beamGlowMat);
      singularityGroup.add(beamGlow);

      const beamHaloGeo = new THREE.CylinderGeometry(0.7, 0.7, 45, 16);
      const beamHaloMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });
      const beamHalo = new THREE.Mesh(beamHaloGeo, beamHaloMat);
      singularityGroup.add(beamHalo);

      // 4. Floating Architectural Glass Panels in 3D
      const slabGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x0e1726,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.85,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      });
      const slabEdgeMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.45 });

      const glassSlabs = [
        { geo: new THREE.BoxGeometry(4.2, 6.4, 0.06), pos: [-3.4, 1.2, -2.5], rot: [0.1, 0.35, -0.05] },
        { geo: new THREE.BoxGeometry(3.6, 7.8, 0.06), pos: [3.6, -0.8, -3.0], rot: [-0.15, -0.4, 0.08] },
        { geo: new THREE.BoxGeometry(4.8, 3.2, 0.06), pos: [0.2, -3.8, 1.6], rot: [0.3, 0.1, -0.1] }
      ];

      glassSlabs.forEach((s) => {
        const m = new THREE.Mesh(s.geo, slabGlassMat);
        m.position.set(...s.pos);
        m.rotation.set(...s.rot);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(s.geo), slabEdgeMat);
        m.add(edge);
        singularityGroup.add(m);
      });

      // 5. Tumbling 3D Refraction Crystals & Prisms (6 Polyhedra)
      const crystalGroup = new THREE.Group();
      singularityGroup.add(crystalGroup);

      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xdbeafe,
        metalness: 0.2,
        roughness: 0.08,
        transmission: 0.8,
        thickness: 1.2,
        transparent: true,
        opacity: 0.65
      });
      const crystalEdgeMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 });

      const crystals = [
        { mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.85), crystalMat), pos: [-4.2, 3.5, 1.8], rotSpd: [0.012, 0.016, 0.008], floatOffset: 0 },
        { mesh: new THREE.Mesh(new THREE.IcosahedronGeometry(0.75), crystalMat), pos: [4.8, 3.8, 0.5], rotSpd: [-0.014, 0.012, 0.015], floatOffset: 1.2 },
        { mesh: new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), crystalMat), pos: [-3.8, -2.8, 2.2], rotSpd: [0.009, -0.014, 0.012], floatOffset: 2.4 },
        { mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.95), crystalMat), pos: [4.2, -2.5, 1.8], rotSpd: [-0.01, 0.015, -0.012], floatOffset: 3.6 },
        { mesh: new THREE.Mesh(new THREE.DodecahedronGeometry(0.65), crystalMat), pos: [-1.8, 4.5, -1.0], rotSpd: [0.015, -0.01, 0.012], floatOffset: 4.8 },
        { mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.7), crystalMat), pos: [2.5, -4.2, -0.8], rotSpd: [-0.012, -0.014, 0.01], floatOffset: 5.5 }
      ];

      crystals.forEach((c) => {
        c.mesh.position.set(...c.pos);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(c.mesh.geometry), crystalEdgeMat);
        c.mesh.add(edge);
        crystalGroup.add(c.mesh);
      });

      // 6. Ambient Quantum Dust / Starfield
      const particleCount = 280;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let p = 0; p < particleCount; p++) {
        particlePositions[p * 3] = (Math.random() - 0.5) * 45;
        particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 35;
        particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.12,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

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
        const targetTiltY = mouseX * 0.22;
        const targetTiltX = -mouseY * 0.18;
        singularityGroup.rotation.y += (targetTiltY - singularityGroup.rotation.y) * 0.04;
        singularityGroup.rotation.x += (targetTiltX - singularityGroup.rotation.x) * 0.04;

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

        // 3D Metallic Precision Rings & Orbiting Satellites
        metallicRings.forEach((mr, idx) => {
          mr.group.rotation.z += mr.speed;
          const angle = time * (0.5 + idx * 0.25);
          mr.node.position.x = Math.cos(angle) * mr.radius;
          mr.node.position.y = Math.sin(angle) * mr.radius;
        });

        // Core breathing & Wireframe Rotation
        sphereWire.rotation.y = time * 0.08;
        sphereWire.rotation.x = time * 0.04;
        coronaMesh.scale.setScalar(1.0 + Math.sin(time * 2.0) * 0.035);

        // Rotate 3D floating refraction crystals & hover sine wave
        crystals.forEach((c) => {
          c.mesh.rotation.x += c.rotSpd[0];
          c.mesh.rotation.y += c.rotSpd[1];
          c.mesh.rotation.z += c.rotSpd[2];
          c.mesh.position.y = c.pos[1] + Math.sin(time * 1.6 + c.floatOffset) * 0.22;
        });

        // Ambient particle drift
        particleSystem.rotation.y = time * 0.015;

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

/**
 * GOKUL LABS — PREMIUM ANIMATION ENGINE v3.0
 * Cinematic entrance, spring physics, upgraded 3D living architecture
 *
 * Features:
 *  - Staggered hero entrance (kicker → title words → description → buttons → cards)
 *  - Smooth spring-lerp on mouse parallax (damping + velocity)
 *  - 3D scene: breathing core with emissive pulse, beam flicker, ring energy pulse,
 *    crystal shimmer, particle colour-cycle, camera dolly on scroll
 *  - Scroll-driven section reveals with IntersectionObserver stagger
 *  - 3D card tilt with spring return
 *  - Live clock, cursor glow
 */

(function () {
  "use strict";

  /* ============================================================
     UTILITIES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Clamp a value between min and max */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /** Linear interpolation */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Smooth-step (ease-in-out) */
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* ============================================================
     LIVE CLOCK
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
     SCROLL PROGRESS & NAVBAR
     ============================================================ */
  const progressBar = $("#scroll-progress");
  const navbar = $("#navbar");
  const sections = $$("section[id]");
  let globalScrollProgress = 0;

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    globalScrollProgress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;

    if (progressBar) progressBar.style.width = `${globalScrollProgress * 100}%`;

    const trackerDot = $("#scroll-tracker-dot");
    if (trackerDot) trackerDot.style.top = `${globalScrollProgress * 65}px`;

    if (navbar) navbar.classList.toggle("scrolled", scrollTop > 30);

    // Active nav highlight
    let current = "";
    sections.forEach((s) => {
      if (scrollTop >= s.offsetTop - 220) current = s.getAttribute("id");
    });
    if (current) {
      $$(".nav-link").forEach((l) =>
        l.classList.toggle("active", l.getAttribute("href") === `#${current}`)
      );
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  const menuBtn = $("#menu-btn");
  const navMenu = $("#nav-menu");
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuBtn.classList.toggle("active", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    $$(".nav-link", navMenu).forEach((l) =>
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
     CINEMATIC HERO ENTRANCE ANIMATION
     Staggered reveal: kicker → title word by word → description → buttons → cards
     ============================================================ */
  function initHeroEntrance() {
    const kicker = $(".hero-kicker-cinematic");
    const titleRows = $$(".hero-title-cinematic .title-row");
    const desc = $(".hero-description-cinematic");
    const buttons = $$(".hero-buttons-cinematic > *");
    const cards = $$(".hologram-glass-card");
    const bottomBar = $(".hero-bottom-bar");

    // Set initial hidden state
    const hide = (el, opts = {}) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = opts.transform || "translateY(28px)";
      el.style.transition = "none";
    };
    const show = (el, delay, opts = {}) => {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${opts.td || 0}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${opts.td || 0}ms`;
        el.style.opacity = "1";
        el.style.transform = "none";
      }, delay);
    };

    hide(kicker);
    titleRows.forEach((r) => hide(r, { transform: "translateY(48px)" }));
    hide(desc);
    buttons.forEach((b) => hide(b));
    cards.forEach((c) => hide(c, { transform: "translateY(32px) scale(0.94)" }));
    if (bottomBar) hide(bottomBar, { transform: "translateY(20px)" });

    // Stagger in after a tiny initial delay (page load breathing room)
    const BASE = 180;
    show(kicker, BASE);
    titleRows.forEach((r, i) => show(r, BASE + 140 + i * 110));
    show(desc, BASE + 540);
    buttons.forEach((b, i) => show(b, BASE + 680 + i * 90));
    cards.forEach((c, i) => show(c, BASE + 760 + i * 140));
    if (bottomBar) show(bottomBar, BASE + 900);
  }
  // Run entrance once DOM settles
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroEntrance);
  } else {
    // Tiny rAF so CSS is applied before we measure
    requestAnimationFrame(initHeroEntrance);
  }

  /* ============================================================
     INTERSECTION OBSERVER SCROLL REVEALS — STAGGERED
     ============================================================ */
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
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    // Stagger children of reveal-stagger containers
    $$(".reveal-stagger").forEach((container) => {
      const children = container.children;
      Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 75}ms`;
      });
    });

    $$(".reveal, .reveal-fade, .reveal-stagger > *").forEach((el) =>
      revealObserver.observe(el)
    );
  } else {
    $$(".reveal, .reveal-fade").forEach((el) => el.classList.add("visible"));
  }

  /* ============================================================
     CURSOR GLOW (spring-tracked)
     ============================================================ */
  const cursorGlow = $(".cursor-glow");
  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let vx = 0, vy = 0;
    const STIFFNESS = 0.14, DAMPING = 0.78;

    window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; });

    function animateCursor() {
      vx = (vx + (mx - cx) * STIFFNESS) * DAMPING;
      vy = (vy + (my - cy) * STIFFNESS) * DAMPING;
      cx += vx; cy += vy;
      cursorGlow.style.left = `${cx}px`;
      cursorGlow.style.top = `${cy}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* ============================================================
     3D CARD TILT — spring physics
     ============================================================ */
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".tilt-card").forEach((card) => {
      let rx = 0, ry = 0, vrx = 0, vry = 0;
      let hovering = false;
      const MAX = parseFloat(card.dataset.tilt) || 8;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        hovering = true;
        const targetRX = -py * MAX * 2;
        const targetRY = px * MAX * 2;
        vrx = (vrx + (targetRX - rx) * 0.22) * 0.72;
        vry = (vry + (targetRY - ry) * 0.22) * 0.72;
        rx += vrx; ry += vry;
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(8px)`;
        card.style.transition = "box-shadow 0.3s ease";
      });

      card.addEventListener("mouseleave", () => {
        hovering = false;
        function springBack() {
          rx *= 0.78; ry *= 0.78;
          card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
          if (Math.abs(rx) > 0.05 || Math.abs(ry) > 0.05) requestAnimationFrame(springBack);
          else card.style.transform = "";
        }
        springBack();
      });
    });
  }

  /* ============================================================
     STAGE CARDS
     ============================================================ */
  const stageCards = $$(".stage-card");
  stageCards.forEach((card) => {
    card.addEventListener("click", () => {
      stageCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  /* ============================================================
     3D WEBGL — LIVING AI ARCHITECTURE (upgraded engine)
     ============================================================ */
  const canvasEl = $("#webgl-canvas");
  if (canvasEl) initLivingArchitecture(canvasEl);

  function initLivingArchitecture(canvas) {
    if (typeof THREE === "undefined") {
      initFallback2D(canvas);
      return;
    }

    try {
      /* --- Scene -------------------------------------------------- */
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050608, 0.011);

      /* --- Camera ------------------------------------------------- */
      const camera = new THREE.PerspectiveCamera(
        46, window.innerWidth / window.innerHeight, 0.1, 200
      );
      camera.position.set(0, 0, 24);

      /* --- Renderer ----------------------------------------------- */
      const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      /* --- Master Group ------------------------------------------ */
      const archGroup = new THREE.Group();
      scene.add(archGroup);

      /* --- Lighting ----------------------------------------------- */
      const ambient = new THREE.AmbientLight(0x080d1a, 1.4);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(8, 14, 18);
      scene.add(keyLight);

      // Main cyan rim (will be pulsed in animation loop)
      const rimLight = new THREE.PointLight(0x38bdf8, 3.2, 60);
      rimLight.position.set(8, 2, 8);
      scene.add(rimLight);

      // Violet accent
      const violetLight = new THREE.PointLight(0x818cf8, 2.0, 50);
      violetLight.position.set(-12, -6, 6);
      scene.add(violetLight);

      // Acid accent (subtle, for crystal highlights)
      const acidLight = new THREE.PointLight(0xb5ff4d, 0.8, 30);
      acidLight.position.set(-6, 8, 4);
      scene.add(acidLight);

      // Contact hover light
      const contactLight = new THREE.PointLight(0xb5ff4d, 0.05, 40);
      contactLight.position.set(0, 0, 5);
      scene.add(contactLight);

      /* --- Background Glass Architecture -------------------------- */
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x111622, metalness: 0.2, roughness: 0.15,
        transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false
      });
      const frameMat = new THREE.LineBasicMaterial({
        color: 0x334155, transparent: true, opacity: 0.32
      });
      const accentMat = new THREE.LineBasicMaterial({
        color: 0x64748b, transparent: true, opacity: 0.38
      });

      // Far glass plane
      const g1 = new THREE.PlaneGeometry(44, 30);
      const planeFar = new THREE.Mesh(g1, glassMat);
      planeFar.position.set(6, 2, -40);
      planeFar.rotation.y = -0.12;
      planeFar.add(new THREE.LineSegments(new THREE.EdgesGeometry(g1), frameMat));
      archGroup.add(planeFar);

      // Mid-depth wall
      const g2 = new THREE.PlaneGeometry(30, 22);
      const planeMid = new THREE.Mesh(g2, glassMat);
      planeMid.position.set(-8, -1, -20);
      planeMid.rotation.y = 0.18; planeMid.rotation.x = 0.05;
      planeMid.add(new THREE.LineSegments(new THREE.EdgesGeometry(g2), frameMat));
      archGroup.add(planeMid);

      // Near monolith slab
      const g3 = new THREE.PlaneGeometry(18, 14);
      const planeNear = new THREE.Mesh(g3, glassMat);
      planeNear.position.set(10, -3, -5);
      planeNear.rotation.y = -0.22;
      planeNear.add(new THREE.LineSegments(new THREE.EdgesGeometry(g3), accentMat));
      archGroup.add(planeNear);

      // Thought layers (About section)
      const thoughtLayers = [];
      const lg = new THREE.PlaneGeometry(16, 10);
      for (let i = 0; i < 5; i++) {
        const tl = new THREE.Mesh(lg, glassMat.clone());
        tl.material.opacity = 0.04 + i * 0.015;
        tl.position.set(0, 0, -12 - i * 4);
        tl.add(new THREE.LineSegments(new THREE.EdgesGeometry(lg), frameMat));
        archGroup.add(tl);
        thoughtLayers.push(tl);
      }

      // Tech grid
      const techGrid = new THREE.GridHelper(36, 18, 0x1e293b, 0x0f172a);
      techGrid.position.set(0, -10, -15);
      techGrid.material.transparent = true;
      techGrid.material.opacity = 0.18;
      archGroup.add(techGrid);

      /* --- Singularity Group (Hero Orb + Rings + Beam) ----------- */
      const singularityGroup = new THREE.Group();
      archGroup.add(singularityGroup);

      function placeSingularity() {
        const mob = window.innerWidth < 900;
        singularityGroup.position.set(mob ? 0 : 5.8, mob ? 2.2 : 0, 0);
        singularityGroup.scale.setScalar(mob ? 0.72 : 1.0);
      }
      placeSingularity();
      window.addEventListener("resize", placeSingularity);

      // ── Core sphere (luminous)
      const coreGeo = new THREE.SphereGeometry(1.85, 40, 40);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      singularityGroup.add(coreMesh);

      const coreLight = new THREE.PointLight(0x38bdf8, 4.2, 38);
      singularityGroup.add(coreLight);

      // ── Corona halo (additive blending)
      const coronaGeo = new THREE.SphereGeometry(2.18, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc, transparent: true, opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      singularityGroup.add(coronaMesh);

      // ── Second softer outer corona
      const corona2Geo = new THREE.SphereGeometry(2.68, 32, 32);
      const corona2Mat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9, transparent: true, opacity: 0.12,
        blending: THREE.AdditiveBlending
      });
      const corona2Mesh = new THREE.Mesh(corona2Geo, corona2Mat);
      singularityGroup.add(corona2Mesh);

      // ── Glass sphere
      const glassSphereGeo = new THREE.SphereGeometry(2.46, 48, 48);
      const glassSphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x0c1424, metalness: 0.15, roughness: 0.04,
        transmission: 0.88, thickness: 1.5,
        transparent: true, opacity: 0.72, side: THREE.DoubleSide
      });
      const glassSphereMesh = new THREE.Mesh(glassSphereGeo, glassSphereMat);
      singularityGroup.add(glassSphereMesh);

      // ── Wireframe overlay
      const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(2.5, 18, 18));
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8, transparent: true, opacity: 0.22
      });
      const sphereWire = new THREE.LineSegments(wireGeo, wireMat);
      singularityGroup.add(sphereWire);

      // ── Precision orbit rings
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9, metalness: 0.96, roughness: 0.12,
        emissive: 0x0284c7, emissiveIntensity: 0.25
      });

      const ringCfgs = [
        { r: 3.8, tube: 0.038, rot: [1.1, 0.35, 0.2], spd: 0.009, nR: 0.13 },
        { r: 5.2, tube: 0.042, rot: [-0.8, -0.45, 0.4], spd: -0.007, nR: 0.15 },
        { r: 6.8, tube: 0.046, rot: [0.4, 0.95, -0.3], spd: 0.006, nR: 0.17 }
      ];

      const metallicRings = [];
      ringCfgs.forEach((cfg, idx) => {
        const holder = new THREE.Group();
        holder.rotation.set(...cfg.rot);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(cfg.r, cfg.tube, 16, 128), ringMat);
        holder.add(ring);

        // Satellite node
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const node = new THREE.Mesh(new THREE.SphereGeometry(cfg.nR, 12, 12), nodeMat);
        node.position.set(cfg.r, 0, 0);
        holder.add(node);

        // Trailing glow dot
        const trailMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8, transparent: true, opacity: 0.35,
          blending: THREE.AdditiveBlending
        });
        const trail = new THREE.Mesh(new THREE.SphereGeometry(cfg.nR * 2.2, 8, 8), trailMat);
        trail.position.set(cfg.r, 0, 0);
        holder.add(trail);

        singularityGroup.add(holder);
        metallicRings.push({ group: holder, speed: cfg.spd, node, trail, radius: cfg.r, idx });
      });

      // ── Laser Beam Column (3-layer: white core + cyan + outer halo)
      const beamCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 48, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 })
      );
      singularityGroup.add(beamCore);

      const beamGlowMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8, transparent: true, opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      const beamGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 48, 12), beamGlowMat);
      singularityGroup.add(beamGlow);

      const beamHaloMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9, transparent: true, opacity: 0.16,
        blending: THREE.AdditiveBlending
      });
      const beamHalo = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 48, 12), beamHaloMat);
      singularityGroup.add(beamHalo);

      // ── Floating architectural glass slabs
      const slabMat = new THREE.MeshPhysicalMaterial({
        color: 0x0e1726, roughness: 0.08, metalness: 0.2,
        transmission: 0.88, transparent: true, opacity: 0.4, depthWrite: false
      });
      const slabEdgeMat = new THREE.LineBasicMaterial({
        color: 0x64748b, transparent: true, opacity: 0.42
      });
      const slabCfgs = [
        { g: new THREE.BoxGeometry(4.2, 6.4, 0.06), p: [-3.4, 1.2, -2.5], r: [0.1, 0.35, -0.05] },
        { g: new THREE.BoxGeometry(3.6, 7.8, 0.06), p: [3.6, -0.8, -3.0], r: [-0.15, -0.4, 0.08] },
        { g: new THREE.BoxGeometry(4.8, 3.2, 0.06), p: [0.2, -3.8, 1.6], r: [0.3, 0.1, -0.1] }
      ];
      const glassSlabs = [];
      slabCfgs.forEach((s) => {
        const m = new THREE.Mesh(s.g, slabMat.clone());
        m.position.set(...s.p);
        m.rotation.set(...s.r);
        m.add(new THREE.LineSegments(new THREE.EdgesGeometry(s.g), slabEdgeMat));
        singularityGroup.add(m);
        glassSlabs.push({ mesh: m, basePos: [...s.p], baseRot: [...s.r] });
      });

      // ── Refraction crystals (6 polyhedra)
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xdbeafe, metalness: 0.15, roughness: 0.06,
        transmission: 0.82, thickness: 1.2,
        transparent: true, opacity: 0.68
      });
      const crystalEdgeMat = new THREE.LineBasicMaterial({
        color: 0x7dd3fc, transparent: true, opacity: 0.8
      });
      const crystalCfgs = [
        { geo: new THREE.OctahedronGeometry(0.85), pos: [-4.2, 3.5, 1.8], spd: [0.012, 0.017, 0.008], fo: 0.0 },
        { geo: new THREE.IcosahedronGeometry(0.75), pos: [4.8, 3.8, 0.5], spd: [-0.014, 0.013, 0.016], fo: 1.2 },
        { geo: new THREE.BoxGeometry(0.8, 1.2, 0.8), pos: [-3.8, -2.8, 2.2], spd: [0.009, -0.015, 0.013], fo: 2.4 },
        { geo: new THREE.OctahedronGeometry(0.95), pos: [4.2, -2.5, 1.8], spd: [-0.01, 0.016, -0.012], fo: 3.6 },
        { geo: new THREE.DodecahedronGeometry(0.65), pos: [-1.8, 4.5, -1.0], spd: [0.015, -0.011, 0.013], fo: 4.8 },
        { geo: new THREE.OctahedronGeometry(0.72), pos: [2.5, -4.2, -0.8], spd: [-0.012, -0.014, 0.011], fo: 5.5 }
      ];
      const crystals = [];
      const crystalGroup = new THREE.Group();
      crystalCfgs.forEach((cfg) => {
        const mesh = new THREE.Mesh(cfg.geo, crystalMat.clone());
        mesh.position.set(...cfg.pos);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(cfg.geo), crystalEdgeMat.clone()));
        crystalGroup.add(mesh);
        crystals.push({ mesh, pos: [...cfg.pos], spd: cfg.spd, fo: cfg.fo });
      });
      singularityGroup.add(crystalGroup);

      // ── Quantum dust particles (400 points, 2-color)
      const PARTICLE_COUNT = 400;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(PARTICLE_COUNT * 3);
      const pColours = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 50;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 38;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 32 - 6;
        // Alternate cyan / violet
        const isCyan = Math.random() > 0.35;
        pColours[i * 3] = isCyan ? 0.22 : 0.51;
        pColours[i * 3 + 1] = isCyan ? 0.74 : 0.36;
        pColours[i * 3 + 2] = isCyan ? 0.97 : 0.96;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(pColours, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.11, transparent: true, opacity: 0.72,
        blending: THREE.AdditiveBlending, vertexColors: true
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── Contact precision ring
      const cRingPositions = [];
      const cSegs = 120;
      const cRad = 11.5;
      for (let k = 0; k <= cSegs; k++) {
        const th = (k / cSegs) * Math.PI * 2;
        cRingPositions.push(Math.cos(th) * cRad, Math.sin(th) * cRad, 0);
      }
      const cRingGeo = new THREE.BufferGeometry();
      cRingGeo.setAttribute("position", new THREE.Float32BufferAttribute(cRingPositions, 3));
      const contactRing = new THREE.Line(
        cRingGeo,
        new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.28 })
      );
      contactRing.position.set(0, 0, -22);
      archGroup.add(contactRing);

      // Tick marks
      const tickGroup = new THREE.Group();
      for (let t = 0; t < 32; t++) {
        const rad = (t / 32) * Math.PI * 2;
        const long = t % 4 === 0;
        const r1 = long ? 10.8 : 11.0;
        const r2 = 11.6;
        const tGeo = new THREE.BufferGeometry();
        tGeo.setAttribute("position", new THREE.Float32BufferAttribute([
          Math.cos(rad) * r1, Math.sin(rad) * r1, 0,
          Math.cos(rad) * r2, Math.sin(rad) * r2, 0
        ], 3));
        tickGroup.add(new THREE.Line(tGeo, new THREE.LineBasicMaterial({
          color: long ? 0x475569 : 0x334155, transparent: true, opacity: long ? 0.3 : 0.18
        })));
      }
      contactRing.add(tickGroup);

      /* --- Mouse Spring ------------------------------------------ */
      let rawMouseX = 0, rawMouseY = 0;
      let smoothMouseX = 0, smoothMouseY = 0;
      let vmx = 0, vmy = 0;

      window.addEventListener("pointermove", (e) => {
        rawMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        rawMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      /* --- Contact Hover ----------------------------------------- */
      let contactHovered = false;
      $$("#contact a").forEach((btn) => {
        btn.addEventListener("mouseenter", () => (contactHovered = true));
        btn.addEventListener("mouseleave", () => (contactHovered = false));
      });

      /* --- Resize ------------------------------------------------- */
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      /* --- Animation Loop ---------------------------------------- */
      const clock = new THREE.Clock();
      let smoothScroll = 0;

      // Per-crystal individual life phase
      crystals.forEach((c) => { c.phase = Math.random() * Math.PI * 2; });

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        const dt = clock.getDelta();
        const t = clock.getElapsedTime();

        /* Scroll spring */
        smoothScroll = lerp(smoothScroll, globalScrollProgress, 0.055);

        /* Camera dolly on scroll */
        const targetCamZ = 24 - smoothScroll * 16;
        camera.position.z = lerp(camera.position.z, targetCamZ, 0.07);

        /* Mouse spring (damped) */
        vmx = (vmx + (rawMouseX - smoothMouseX) * 0.06) * 0.82;
        vmy = (vmy + (rawMouseY - smoothMouseY) * 0.06) * 0.82;
        smoothMouseX += vmx;
        smoothMouseY += vmy;

        /* Camera inertia tilt */
        const targetCamRotY = -smoothMouseX * 0.038;
        const targetCamRotX = -smoothMouseY * 0.028;
        camera.rotation.y = lerp(camera.rotation.y, targetCamRotY, 0.05);
        camera.rotation.x = lerp(camera.rotation.x, targetCamRotX, 0.05);

        /* ── Scroll-driven architecture metamorphosis ── */

        // 1. Hero glass planes separation
        const heroSpread = smoothstep(0, 0.25, smoothScroll);
        planeFar.position.x = 6 + heroSpread * 3.5;
        planeFar.rotation.y = -0.12 - heroSpread * 0.09;
        planeMid.position.x = -8 - heroSpread * 2.8;

        // 2. About: thought layers fan out
        const aboutF = smoothstep(0.18, 0.42, smoothScroll);
        thoughtLayers.forEach((layer, i) => {
          layer.position.x = (i - 2) * aboutF * 2.4;
          layer.rotation.y = (i - 2) * aboutF * 0.045;
          layer.rotation.x = Math.sin(t * 0.28 + i) * 0.02;
        });

        // 3. Toolkit: grid rises
        const toolF = smoothstep(0.38, 0.62, smoothScroll);
        techGrid.position.y = -10 + toolF * 4.5;
        techGrid.material.opacity = 0.12 + toolF * 0.28;

        // 4. Projects: singularity scale
        const projT = Math.sin(clamp((smoothScroll - 0.62) * Math.PI * 4, 0, Math.PI));
        singularityGroup.scale.setScalar((window.innerWidth < 900 ? 0.72 : 1.0) - projT * 0.38);

        // Mouse-reactive tilt of singularity
        const tiltY = smoothMouseX * 0.24;
        const tiltX = -smoothMouseY * 0.18;
        singularityGroup.rotation.y = lerp(singularityGroup.rotation.y, tiltY, 0.04);
        singularityGroup.rotation.x = lerp(singularityGroup.rotation.x, tiltX, 0.04);

        // 5. Contact ring
        const contactF = smoothstep(0.82, 1.0, smoothScroll);
        const cSpd = contactHovered ? 0.16 : 0.07;
        contactRing.rotation.z += dt * cSpd;
        contactRing.scale.setScalar(0.65 + contactF * 0.35);
        contactLight.intensity = lerp(contactLight.intensity, contactHovered ? 0.7 : 0.05, 0.08);

        /* ── Core breathing (slow sine pulse) ── */
        const breathe = 1.0 + Math.sin(t * 1.8) * 0.04;
        coreMesh.scale.setScalar(breathe);
        coronaMesh.scale.setScalar(breathe * (1.0 + Math.sin(t * 2.4) * 0.025));
        corona2Mesh.scale.setScalar(breathe * (1.0 + Math.sin(t * 1.2 + 0.8) * 0.035));

        /* ── Core light pulse (adds energy flicker) ── */
        coreLight.intensity = 3.8 + Math.sin(t * 4.2) * 0.55 + Math.sin(t * 11.0) * 0.18;

        /* ── Rim light slow drift ── */
        rimLight.intensity = 3.0 + Math.sin(t * 0.85) * 0.8;

        /* ── Wireframe slow rotation ── */
        sphereWire.rotation.y = t * 0.09;
        sphereWire.rotation.x = t * 0.05;

        /* ── Beam flicker ── */
        const beamFlicker = 0.46 + Math.sin(t * 7.5) * 0.06 + Math.sin(t * 23.0) * 0.02;
        beamGlowMat.opacity = beamFlicker;
        beamHaloMat.opacity = 0.14 + Math.sin(t * 5.0) * 0.04;

        /* ── Metallic rings orbit + energy pulse ── */
        metallicRings.forEach((mr, i) => {
          mr.group.rotation.z += mr.speed;
          const angle = t * (0.5 + i * 0.28);
          mr.node.position.x = Math.cos(angle) * mr.radius;
          mr.node.position.y = Math.sin(angle) * mr.radius;
          mr.trail.position.x = Math.cos(angle - 0.14) * mr.radius;
          mr.trail.position.y = Math.sin(angle - 0.14) * mr.radius;
          // Ring emissive pulse
          mr.group.children[0].material.emissiveIntensity =
            0.18 + Math.sin(t * 2.2 + i * 1.5) * 0.14;
        });

        /* ── Glass slabs gentle sway ── */
        glassSlabs.forEach((s, i) => {
          s.mesh.position.y = s.basePos[1] + Math.sin(t * 0.6 + i * 2.1) * 0.18;
          s.mesh.rotation.y = s.baseRot[1] + Math.sin(t * 0.4 + i * 1.5) * 0.025;
        });

        /* ── Crystal animation: spin + float + emissive twinkle ── */
        crystals.forEach((c) => {
          c.mesh.rotation.x += c.spd[0];
          c.mesh.rotation.y += c.spd[1];
          c.mesh.rotation.z += c.spd[2];
          c.mesh.position.y = c.pos[1] + Math.sin(t * 1.55 + c.fo) * 0.28;
          // Crystal shimmer: change opacity slightly
          c.mesh.material.opacity = 0.58 + Math.sin(t * 2.8 + c.fo) * 0.12;
          c.mesh.material.emissiveIntensity = 0.05 + Math.sin(t * 3.5 + c.fo) * 0.06;
        });

        /* ── Particle slow rotation + Y drift ── */
        particles.rotation.y = t * 0.012;
        particles.rotation.x = Math.sin(t * 0.08) * 0.02;
        pMat.opacity = 0.6 + Math.sin(t * 0.6) * 0.15;

        /* ── Keylight drift ── */
        keyLight.position.x = 5 + Math.sin(t * 0.22) * 3.5;
        keyLight.position.y = 12 - smoothScroll * 10;

        /* ── Acid crystal light pulse ── */
        acidLight.intensity = 0.6 + Math.sin(t * 2.8) * 0.4;

        renderer.render(scene, camera);
      }

      renderFrame();

    } catch (err) {
      console.warn("Living Architecture WebGL fallback:", err);
      initFallback2D(canvas);
    }
  }

  /* ============================================================
     2D CANVAS FALLBACK
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
      ctx.strokeStyle = `rgba(56,189,248,${0.06 + Math.sin(t * 0.02) * 0.03})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 300 + Math.sin(t * 0.015) * 8, cy - 200, 600, 400);
      ctx.strokeStyle = `rgba(148,163,184,${0.08 + Math.cos(t * 0.012) * 0.03})`;
      ctx.strokeRect(cx - 180, cy - 130 + Math.cos(t * 0.018) * 6, 360, 260);
      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ============================================================
     PROJECTS REGISTRY LOG
     ============================================================ */
  if (window.PROJECTS && Array.isArray(window.PROJECTS)) {
    console.log(`Gokul Labs: ${window.PROJECTS.length} verified projects loaded.`);
  }
})();

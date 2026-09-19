/**
 * GOKUL LABS — AWWWARDS-GRADE ANIMATION ENGINE v5.0
 * Pure Architectural Atmosphere & Interactive AI Laboratory Console
 *
 * Core Systems:
 *  - Interactive AI Laboratory Terminal (multi-tab code engine, live telemetry)
 *  - Real-time specular cursor spotlight on all glass cards (--mouse-x, --mouse-y)
 *  - Magnetic CTA button physics with harmonic spring return
 *  - Subtle architectural WebGL atmosphere (90% quiet void, zero 3D shape clutter)
 *  - Cinematic blur-lift typography entrance
 *  - High-precision scroll-driven section reveals
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
     SCROLL PROGRESS & DYNAMIC NAVIGATION
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
     CINEMATIC BLUR-LIFT HERO ENTRANCE (Apple Keynote Grade)
     ============================================================ */
  function initHeroEntrance() {
    const kicker = $(".hero-kicker-cinematic");
    const titleRows = $$(".hero-title-cinematic .title-row");
    const desc = $(".hero-description-cinematic");
    const buttons = $$(".hero-buttons-cinematic > *");
    const terminal = $(".hero-terminal-window");
    const hudChips = $$(".floating-hud");
    const bottomBar = $(".hero-bottom-bar");

    const hide = (el, transform = "translateY(36px)") => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.filter = "blur(12px)";
      el.style.transform = transform;
      el.style.transition = "none";
    };

    const reveal = (el, delay, opts = {}) => {
      if (!el) return;
      setTimeout(() => {
        const dur = opts.dur || "0.95s";
        const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}, filter ${dur} ${ease}`;
        el.style.opacity = "1";
        el.style.filter = "blur(0px)";
        el.style.transform = opts.transform || "none";
      }, delay);
    };

    hide(kicker, "translateY(20px)");
    titleRows.forEach((r) => hide(r, "translateY(38px) scale(0.97)"));
    hide(desc, "translateY(24px)");
    buttons.forEach((b) => hide(b, "translateY(20px) scale(0.95)"));
    hide(terminal, "translateY(40px) scale(0.94)");
    hudChips.forEach((c) => hide(c, "translateY(20px) scale(0.9)"));
    if (bottomBar) hide(bottomBar, "translateY(20px)");

    const BASE = 120;
    reveal(kicker, BASE);
    titleRows.forEach((r, i) => reveal(r, BASE + 110 + i * 120, { dur: "1.05s" }));
    reveal(desc, BASE + 520, { dur: "0.85s" });
    buttons.forEach((b, i) => reveal(b, BASE + 640 + i * 80, { dur: "0.85s" }));
    reveal(terminal, BASE + 720, { dur: "1.0s" });
    hudChips.forEach((c, i) => reveal(c, BASE + 860 + i * 100, { dur: "0.8s" }));
    if (bottomBar) reveal(bottomBar, BASE + 950, { dur: "0.8s" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroEntrance);
  } else {
    requestAnimationFrame(initHeroEntrance);
  }

  /* ============================================================
     INTERACTIVE AI TERMINAL TABS
     ============================================================ */
  const terminalTabs = $$(".terminal-tab");
  const tabPanels = $$(".terminal-tab-panel");
  terminalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = `tab-${tab.dataset.tab}`;
      terminalTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const targetPanel = $(`#${targetId}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  /* ============================================================
     INTERACTIVE SPECULAR SPOTLIGHT ON ALL GLASS SURFACES
     (Linear.app / Apple style dynamic cursor reflection)
     ============================================================ */
  const interactiveCards = $$(
    ".hero-terminal-window, .floating-hud, .stage-card, .project-card, .skill-card, .journey-item"
  );
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* ============================================================
     MAGNETIC BUTTONS (Spring harmonic physics)
     ============================================================ */
  const magneticButtons = $$(
    ".btn-glow-cyan, .btn-glass-github, .cta-pill-glass, .btn-primary"
  );
  if (window.matchMedia("(hover: hover)").matches) {
    magneticButtons.forEach((btn) => {
      let bx = 0, by = 0;
      let targetX = 0, targetY = 0;
      let frameId = null;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetX = (e.clientX - centerX) * 0.28;
        targetY = (e.clientY - centerY) * 0.28;

        if (!frameId) {
          function springTick() {
            bx += (targetX - bx) * 0.22;
            by += (targetY - by) * 0.22;
            btn.style.transform = `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0) scale(1.02)`;
            if (Math.abs(targetX - bx) > 0.1 || Math.abs(targetY - by) > 0.1) {
              frameId = requestAnimationFrame(springTick);
            } else {
              frameId = null;
            }
          }
          springTick();
        }
      });

      btn.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
        function returnSpring() {
          bx *= 0.76;
          by *= 0.76;
          btn.style.transform = `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0)`;
          if (Math.abs(bx) > 0.1 || Math.abs(by) > 0.1) {
            requestAnimationFrame(returnSpring);
          } else {
            btn.style.transform = "";
          }
        }
        returnSpring();
      });
    });
  }

  /* ============================================================
     3D CARD TILT WITH SPRING RETURN
     ============================================================ */
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".tilt-card").forEach((card) => {
      let rx = 0, ry = 0, vrx = 0, vry = 0;
      const MAX = parseFloat(card.dataset.tilt) || 6;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const targetRX = -py * MAX * 2;
        const targetRY = px * MAX * 2;
        vrx = (vrx + (targetRX - rx) * 0.22) * 0.72;
        vry = (vry + (targetRY - ry) * 0.22) * 0.72;
        rx += vrx; ry += vry;
        card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(6px)`;
      });

      card.addEventListener("mouseleave", () => {
        function springBack() {
          rx *= 0.78; ry *= 0.78;
          card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
          if (Math.abs(rx) > 0.05 || Math.abs(ry) > 0.05) {
            requestAnimationFrame(springBack);
          } else {
            card.style.transform = "";
          }
        }
        springBack();
      });
    });
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

    $$(".reveal-stagger").forEach((container) => {
      Array.from(container.children).forEach((child, i) => {
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
     CURSOR GLOW (Chromatic double-layer spring)
     ============================================================ */
  const cursorGlow = $(".cursor-glow");
  let globalMouseX = window.innerWidth / 2;
  let globalMouseY = window.innerHeight / 2;

  window.addEventListener("pointermove", (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
  });

  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    let cx = globalMouseX, cy = globalMouseY;
    let vx = 0, vy = 0;
    const STIFFNESS = 0.15, DAMPING = 0.76;

    function animateCursor() {
      vx = (vx + (globalMouseX - cx) * STIFFNESS) * DAMPING;
      vy = (vy + (globalMouseY - cy) * STIFFNESS) * DAMPING;
      cx += vx; cy += vy;
      cursorGlow.style.left = `${cx}px`;
      cursorGlow.style.top = `${cy}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
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
     SUBTLE 3D WEBGL ARCHITECTURAL ATMOSPHERE
     90% Quiet Void Black. Zero spheres. Zero 3D geometric shapes.
     Ultra-subtle ambient depth, floor coordinate grid & soft lighting.
     ============================================================ */
  const canvasEl = $("#webgl-canvas");
  if (canvasEl) initLivingArchitecture(canvasEl);

  function initLivingArchitecture(canvas) {
    if (typeof THREE === "undefined") {
      initFallback2D(canvas);
      return;
    }

    try {
      /* --- Scene & Deep Void Fog ---------------------------------- */
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050608, 0.012);

      /* --- Camera Setup ------------------------------------------- */
      const camera = new THREE.PerspectiveCamera(
        46, window.innerWidth / window.innerHeight, 0.1, 200
      );
      camera.position.set(0, 0, 24);

      /* --- Renderer (High Dynamic Range & Alpha) ------------------- */
      const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      /* --- Master Architectural Group ---------------------------- */
      const archGroup = new THREE.Group();
      scene.add(archGroup);

      /* --- Lighting Rig (Volumetric Studio Atmosphere) ------------- */
      const ambient = new THREE.AmbientLight(0x080e1d, 1.4);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(8, 14, 18);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0x38bdf8, 2.6, 60);
      rimLight.position.set(8, 2, 8);
      scene.add(rimLight);

      const violetLight = new THREE.PointLight(0x818cf8, 1.8, 50);
      violetLight.position.set(-12, -6, 6);
      scene.add(violetLight);

      const contactLight = new THREE.PointLight(0xb5ff4d, 0.05, 40);
      contactLight.position.set(0, 0, 5);
      scene.add(contactLight);

      /* --- Subtle Background Architectural Planes ---------------- */
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x111622, metalness: 0.2, roughness: 0.15,
        transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false
      });
      const frameMat = new THREE.LineBasicMaterial({
        color: 0x1e293b, transparent: true, opacity: 0.28
      });

      // Far glass plane
      const g1 = new THREE.PlaneGeometry(44, 30);
      const planeFar = new THREE.Mesh(g1, glassMat);
      planeFar.position.set(6, 2, -40);
      planeFar.rotation.y = -0.12;
      planeFar.add(new THREE.LineSegments(new THREE.EdgesGeometry(g1), frameMat));
      archGroup.add(planeFar);

      // Mid-depth angled wall
      const g2 = new THREE.PlaneGeometry(30, 22);
      const planeMid = new THREE.Mesh(g2, glassMat);
      planeMid.position.set(-8, -1, -20);
      planeMid.rotation.y = 0.18; planeMid.rotation.x = 0.05;
      planeMid.add(new THREE.LineSegments(new THREE.EdgesGeometry(g2), frameMat));
      archGroup.add(planeMid);

      // Thought layers for About section
      const thoughtLayers = [];
      const lg = new THREE.PlaneGeometry(16, 10);
      for (let i = 0; i < 5; i++) {
        const tl = new THREE.Mesh(lg, glassMat.clone());
        tl.material.opacity = 0.03 + i * 0.012;
        tl.position.set(0, 0, -12 - i * 4);
        tl.add(new THREE.LineSegments(new THREE.EdgesGeometry(lg), frameMat));
        archGroup.add(tl);
        thoughtLayers.push(tl);
      }

      // Tech floor coordinate grid
      const techGrid = new THREE.GridHelper(36, 18, 0x1e293b, 0x0f172a);
      techGrid.position.set(0, -10, -15);
      techGrid.material.transparent = true;
      techGrid.material.opacity = 0.16;
      archGroup.add(techGrid);

      // ── Ultra-Subtle Quantum Air Particles (180 points, very dim ambient depth)
      const PARTICLE_COUNT = 180;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 50;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 36;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 8;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.09,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── Contact Section Architectural Ring
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
        new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.22 })
      );
      contactRing.position.set(0, 0, -22);
      archGroup.add(contactRing);

      /* --- Mouse Spring & Velocity Tracking ---------------------- */
      let rawMouseX = 0, rawMouseY = 0;
      let smoothMouseX = 0, smoothMouseY = 0;
      let vmx = 0, vmy = 0;

      window.addEventListener("pointermove", (e) => {
        rawMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        rawMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      let contactHovered = false;
      $$("#contact a").forEach((btn) => {
        btn.addEventListener("mouseenter", () => (contactHovered = true));
        btn.addEventListener("mouseleave", () => (contactHovered = false));
      });

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      /* --- Animation Loop (Clean 60 FPS Engine) ------------------- */
      const clock = new THREE.Clock();
      let smoothScroll = 0;

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        const dt = clock.getDelta();
        const t = clock.getElapsedTime();

        /* Smooth scroll interpolation */
        smoothScroll = lerp(smoothScroll, globalScrollProgress, 0.055);

        /* Camera dolly on scroll */
        const targetCamZ = 24 - smoothScroll * 16;
        camera.position.z = lerp(camera.position.z, targetCamZ, 0.07);

        /* Mouse spring with inertia */
        vmx = (vmx + (rawMouseX - smoothMouseX) * 0.06) * 0.82;
        vmy = (vmy + (rawMouseY - smoothMouseY) * 0.06) * 0.82;
        smoothMouseX += vmx;
        smoothMouseY += vmy;

        /* Camera tilt inertia */
        const targetCamRotY = -smoothMouseX * 0.025;
        const targetCamRotX = -smoothMouseY * 0.018;
        camera.rotation.y = lerp(camera.rotation.y, targetCamRotY, 0.05);
        camera.rotation.x = lerp(camera.rotation.x, targetCamRotX, 0.05);

        /* ── Scroll-driven architectural metamorphism ── */
        // 1. Hero glass frames separation
        const heroSpread = smoothstep(0, 0.25, smoothScroll);
        planeFar.position.x = 6 + heroSpread * 3.5;
        planeFar.rotation.y = -0.12 - heroSpread * 0.09;
        planeMid.position.x = -8 - heroSpread * 2.8;

        // 2. About: thought layers fan out in isometric depth
        const aboutF = smoothstep(0.18, 0.42, smoothScroll);
        thoughtLayers.forEach((layer, i) => {
          layer.position.x = (i - 2) * aboutF * 2.4;
          layer.rotation.y = (i - 2) * aboutF * 0.045;
          layer.rotation.x = Math.sin(t * 0.28 + i) * 0.02;
        });

        // 3. Toolkit: technical coordinate grid rises
        const toolF = smoothstep(0.38, 0.62, smoothScroll);
        techGrid.position.y = -10 + toolF * 4.5;
        techGrid.material.opacity = 0.12 + toolF * 0.25;

        // 4. Contact ring
        const contactF = smoothstep(0.82, 1.0, smoothScroll);
        const cSpd = contactHovered ? 0.14 : 0.05;
        contactRing.rotation.z += dt * cSpd;
        contactRing.scale.setScalar(0.65 + contactF * 0.35);
        contactLight.intensity = lerp(contactLight.intensity, contactHovered ? 0.6 : 0.05, 0.08);

        /* ── Ambient particle slow drift ── */
        particles.rotation.y = t * 0.008;
        particles.rotation.x = Math.sin(t * 0.05) * 0.015;

        /* ── Dynamic Light Tracking ── */
        keyLight.position.x = 5 + Math.sin(t * 0.22) * 3.5;
        keyLight.position.y = 12 - smoothScroll * 10;
        rimLight.intensity = 2.4 + Math.sin(t * 0.8) * 0.4;

        renderer.render(scene, camera);
      }

      renderFrame();

    } catch (err) {
      console.warn("Living Architecture WebGL fallback:", err);
      initFallback2D(canvas);
    }
  }

  /* ============================================================
     RESTRAINED 2D CANVAS FALLBACK
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
      ctx.strokeStyle = `rgba(56,189,248,${0.04 + Math.sin(t * 0.02) * 0.02})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 300 + Math.sin(t * 0.015) * 8, cy - 200, 600, 400);
      ctx.strokeStyle = `rgba(148,163,184,${0.05 + Math.cos(t * 0.012) * 0.02})`;
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

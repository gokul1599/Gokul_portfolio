/* Crystalline installation: lazy Three.js, demand rendering, native lifecycle. */
(function () {
  'use strict';
  window.createCrystalInstallation = function (canvas) {
    const host = canvas.parentElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const cleanups = [];
    const params = { transmission: .88, roughness: .08, ior: 1.55 };
    let renderScene, disposeScene, frame = 0, visible = false, loading = false, failed = false;
    let disposed = false, time = 0, last = 0, tint = '';
    const listen = (target, type, fn, options) => {
      target.addEventListener(type, fn, options);
      cleanups.push(() => target.removeEventListener(type, fn, options));
    };
    const readMode = () => document.documentElement.dataset.mode === 'read';
    function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; }
    function tick(now) {
      frame = 0;
      if (!visible || document.hidden || motion.matches || readMode() || disposed) return;
      time += last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      renderScene(time, params, tint);
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      stop();
      host.classList.toggle('scene-calm', motion.matches || readMode());
      host.dataset.renderState = failed ? 'fallback' : motion.matches || readMode() ? 'calm' : !visible || document.hidden ? 'paused' : renderScene ? 'running' : 'loading';
      if (!visible || document.hidden || motion.matches || readMode() || failed || disposed) return;
      if (renderScene) frame = requestAnimationFrame(tick);
      else load();
    }
    async function load() {
      if (loading) return;
      loading = true;
      try {
        if (!window.THREE) await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'vendor/three.min.js'; script.onload = resolve; script.onerror = reject;
          document.head.appendChild(script);
        });
        if (disposed) return;
        build();
        host.classList.add('scene-ready');
        sync();
      } catch (_) {
        failed = true;
        host.classList.add('scene-fallback');
        host.dataset.renderState = 'fallback';
        if (disposeScene) disposeScene();
      }
    }
    function build() {
      const T = window.THREE;
      const compact = host.clientWidth < 560;
      const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75));
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(38, 1, .1, 80);
      camera.position.set(0, 3.1, 13.8); camera.lookAt(0, -.1, 0);
      const objects = new T.Group(); scene.add(objects);
      const installation = new T.Group(); objects.add(installation);
      installation.position.y = .55;
      const cube = new T.Group(); installation.add(cube);
      cube.rotation.set(.12, Math.PI / 4, 0);
      const glass = new T.MeshPhysicalMaterial({ color: 0x80bbdf, metalness: .12, roughness: .08,
        transmission: .88, ior: 1.55, transparent: true, opacity: .38, depthWrite: false, side: T.DoubleSide });
      const cubeGeometry = new T.BoxGeometry(3.25, 3.25, 3.25);
      cube.add(new T.Mesh(cubeGeometry, glass));
      const edgeMat = new T.LineBasicMaterial({ color: 0xb8e8ff, transparent: true, opacity: .72 });
      cube.add(new T.LineSegments(new T.EdgesGeometry(cubeGeometry), edgeMat));
      // Inset, quieter edges give the glass a readable thickness.
      const innerEdge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(3.13,3.13,3.13)),
        new T.LineBasicMaterial({color:0x419acf,transparent:true,opacity:.25})); cube.add(innerEdge);
      const coreMat = new T.MeshStandardMaterial({ color: 0x3196c9, emissive: 0x058fe6, emissiveIntensity: .75,
        metalness: .15, roughness: .23, flatShading: true });
      const core = new T.Mesh(new T.IcosahedronGeometry(.66, 1), coreMat); installation.add(core);
      const lattice = new T.LineSegments(new T.WireframeGeometry(new T.IcosahedronGeometry(1.24, 1)),
        new T.LineBasicMaterial({ color:0x60ccff, transparent:true, opacity:.34, blending:T.AdditiveBlending }));
      installation.add(lattice);
      // A procedural radial texture produces soft light without a postprocessing pass.
      const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 128;
      const ctx = glowCanvas.getContext('2d'); const gradient = ctx.createRadialGradient(64,64,0,64,64,64);
      gradient.addColorStop(0,'rgba(150,232,255,.8)'); gradient.addColorStop(.18,'rgba(44,173,255,.32)');
      gradient.addColorStop(.55,'rgba(24,119,255,.08)'); gradient.addColorStop(1,'rgba(0,64,255,0)');
      ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
      const glowTexture = new T.CanvasTexture(glowCanvas);
      const glow = new T.Sprite(new T.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
      glow.scale.set(3.2,3.2,1); installation.add(glow);
      const orbital = [];
      for (let i=0;i<3;i++) {
        const group = new T.Group(); group.rotation.set(.65+i*.65,.25+i*.45,.2+i*.55); installation.add(group);
        const radius=2.7+i*.3;
        const ring=new T.Mesh(new T.TorusGeometry(radius,.007,4,compact?90:160),
          new T.MeshBasicMaterial({color:i===1?0xe2efff:0x68b8dc,transparent:true,opacity:i===1?.5:.28}));
        group.add(ring);
        const satellite=new T.Mesh(new T.SphereGeometry(i===0?.09:.055,12,8),
          new T.MeshStandardMaterial({color:0xc3eaff,emissive:0x178bcc,emissiveIntensity:.65,metalness:.7,roughness:.15}));
        group.add(satellite); orbital.push({group,satellite,radius,phase:i*2.2});
      }
      const pedestalMat=new T.MeshStandardMaterial({color:0x081320,metalness:.85,roughness:.25});
      const pedestal=new T.Mesh(new T.CylinderGeometry(3.1,3.15,.35,compact?64:100),pedestalMat);
      pedestal.position.y=-2.5; objects.add(pedestal);
      const top=new T.Mesh(new T.CylinderGeometry(2.93,2.93,.035,compact?64:100),
        new T.MeshStandardMaterial({color:0x07111b,metalness:.85,roughness:.22}));
      top.position.y=-2.3;objects.add(top);
      for (const radius of [2.97,1.65,.65]) {
        const ring=new T.Mesh(new T.TorusGeometry(radius,radius>2?.015:.006,6,100),
          new T.MeshBasicMaterial({color:0x50cfff,transparent:true,opacity:radius>2?.9:.45}));
        ring.rotation.x=Math.PI/2;ring.position.y=-2.275;objects.add(ring);
      }
      const floorGlow=new T.Sprite(new T.SpriteMaterial({map:glowTexture,transparent:true,opacity:.38,depthWrite:false,blending:T.AdditiveBlending}));
      floorGlow.scale.set(8,1.4,1);floorGlow.position.set(0,-2.7,0);objects.add(floorGlow);
      const beam=new T.Mesh(new T.CylinderGeometry(.018,.04,7.5,8,1,true),new T.MeshBasicMaterial({color:0x70d3ff,transparent:true,opacity:.13,depthWrite:false,blending:T.AdditiveBlending}));
      beam.position.y=1.2;objects.add(beam);
      const count=compact?36:100, positions=new Float32Array(count*3);
      // Deterministic particle distribution keeps the composition reproducible.
      for(let i=0;i<count;i++){const a=i*2.39996,r=1.5+(i%17)/6;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=(i%23)/3.2-3;positions[i*3+2]=Math.sin(a)*r*.65;}
      const particleGeo=new T.BufferGeometry();particleGeo.setAttribute('position',new T.BufferAttribute(positions,3));
      const particles=new T.Points(particleGeo,new T.PointsMaterial({color:0x6fc9f3,size:compact?.022:.018,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false}));objects.add(particles);
      scene.add(new T.AmbientLight(0x6997c7,.8));
      const key=new T.DirectionalLight(0xd8efff,2.5);key.position.set(3,6,5);scene.add(key);
      const rim=new T.PointLight(0x279bff,3,20);rim.position.set(-3,2,3);scene.add(rim);
      const innerLight=new T.PointLight(0x49d6ff,2,8);installation.add(innerLight);
      let pointerX=0,pointerY=0,x=0,y=0,baseCameraZ=13.8;
      listen(host,'pointermove',event=>{if(event.pointerType==='touch')return;const r=host.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width-.5;pointerY=(event.clientY-r.top)/r.height-.5;},{passive:true});
      listen(host,'pointerleave',()=>{pointerX=pointerY=0;});
      function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;baseCameraZ=camera.aspect<.85?16:13.8;camera.position.z=baseCameraZ;camera.updateProjectionMatrix();if(!frame&&renderScene&&visible&&!document.hidden&&!motion.matches&&!readMode())renderScene(time,params,tint);}
      const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
      renderScene=(elapsed,values,highlight)=>{
        x+=(pointerX-x)*.035;y+=(pointerY-y)*.035;
        const hero=document.getElementById('hero');const progress=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/hero.offsetHeight));
        camera.position.z=baseCameraZ+progress*1.2;
        cube.rotation.y=Math.PI/4+Math.sin(elapsed*.12)*.13+x*.15+progress*.35;
        cube.rotation.x=.04+y*.1+progress*.12;
        installation.position.y=.55+Math.sin(elapsed*.65)*.065-progress*.3;
        core.rotation.set(elapsed*.08,elapsed*.13,elapsed*.04);lattice.rotation.y=-elapsed*.035;
        coreMat.emissiveIntensity=highlight==='ai'||highlight==='tools'?1.3:.7+Math.sin(elapsed)*.1;
        glow.material.opacity=.7+Math.sin(elapsed)*.08;
        for(const orbit of orbital){const a=elapsed*(.07+orbit.phase*.012)+orbit.phase;orbit.satellite.position.set(Math.cos(a)*orbit.radius,Math.sin(a)*orbit.radius,0);}
        particles.rotation.y=elapsed*.014;objects.rotation.y=x*.07;objects.rotation.x=y*.025;
        glass.transmission=values.transmission;glass.roughness=values.roughness;glass.ior=values.ior;
        renderer.render(scene,camera);
      };
      disposeScene=()=>{resizeObserver.disconnect();scene.traverse(object=>{if(object.geometry)object.geometry.dispose();if(object.material){for(const material of [].concat(object.material))material.dispose();}});glowTexture.dispose();renderer.dispose();};
      listen(canvas,'webglcontextlost',event=>{event.preventDefault();failed=true;stop();host.classList.add('scene-fallback');host.dataset.renderState='fallback';});
      resize();renderScene(0,params,tint);
    }
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'120px'});
    observer.observe(host);
    const modeObserver=new MutationObserver(sync);modeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-mode']});
    listen(document,'visibilitychange',sync);listen(motion,'change',sync);
    listen(window,'pagehide',event=>{stop();if(!event.persisted){disposed=true;observer.disconnect();modeObserver.disconnect();cleanups.forEach(fn=>fn());if(disposeScene)disposeScene();}});
    listen(window,'pageshow',sync);
    return {update(values){Object.assign(params,values);},highlight(layer){tint=layer;}};
  };
})();

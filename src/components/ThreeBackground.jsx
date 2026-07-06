import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { COLOR_ARR } from "../data/constants";

/* ─────────────────────────────────────────────────────────────
  WebGL Capability Check helper
───────────────────────────────────────────────────────────── */
function checkWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
  Three.js animated background:
  • Rotating globe + coloured wireframe
  • Multi-colour rings
  • Coloured particle field
  • Floating orbs
  • Orbiting point lights
  • Mouse-driven camera parallax
  
  If WebGL fails, gracefully falls back to a CSS-only animated
  glowing radial background.
───────────────────────────────────────────────────────────── */
export default function ThreeBackground() {
  const ref = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(checkWebGLSupport);

  useEffect(() => {
    if (!hasWebGL) return;

    let renderer;
    let af;
    let onMouseMove;
    let onResize;

    try {
      const W = window.innerWidth, H = window.innerHeight;
      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      cam.position.z = 3;

      renderer = new THREE.WebGLRenderer({ canvas: ref.current, alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /* ── Globe base ── */
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x060e1e, emissive: 0x020408, transparent: true, opacity: 0.6 })
      );
      globe.position.set(3.2, -0.2, -1.5);
      scene.add(globe);

      /* ── Wireframe globe (colour-cycling) ── */
      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(1.17, 28, 28),
        new THREE.MeshBasicMaterial({ color: 0xF47B20, wireframe: true, transparent: true, opacity: 0.12 })
      );
      wire.position.copy(globe.position);
      scene.add(wire);

      /* ── Coloured rings ── */
      const ringDefs = [
        { r:1.32, t:0.012, rx:Math.PI/2.4, rz:0,         col:0x7B2FBE, op:0.50 },
        { r:1.48, t:0.008, rx:Math.PI/3,   rz:Math.PI/5, col:0xF47B20, op:0.40 },
        { r:1.60, t:0.007, rx:Math.PI/4,   rz:Math.PI/3, col:0xF9C515, op:0.30 },
        { r:1.70, t:0.006, rx:Math.PI/2,   rz:Math.PI/6, col:0x6DBE45, op:0.25 },
        { r:1.80, t:0.005, rx:Math.PI/1.8, rz:Math.PI/2, col:0x00A79D, op:0.20 },
        { r:1.90, t:0.005, rx:Math.PI/5,   rz:2,          col:0xE01F5C, op:0.18 },
      ];
      const rings = ringDefs.map(d => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(d.r, d.t, 16, 200),
          new THREE.MeshBasicMaterial({ color: d.col, transparent: true, opacity: d.op })
        );
        ring.rotation.x = d.rx;
        ring.rotation.z = d.rz;
        ring.position.copy(globe.position);
        scene.add(ring);
        return ring;
      });

      /* ── Coloured particle field ── */
      const N       = 3500;
      const pos     = new Float32Array(N * 3);
      const col     = new Float32Array(N * 3);
      const palette = [
        [0.48, 0.18, 0.74], // purple
        [0.96, 0.48, 0.13], // orange
        [0.98, 0.77, 0.08], // yellow
        [0.43, 0.75, 0.27], // green
        [0.00, 0.65, 0.62], // teal
        [0.88, 0.12, 0.36], // red
        [0.18, 0.45, 0.75], // blue
        [0.77, 0.09, 0.48], // magenta
      ];
      for (let i = 0; i < N; i++) {
        pos[i*3]   = (Math.random() - 0.5) * 26;
        pos[i*3+1] = (Math.random() - 0.5) * 26;
        pos[i*3+2] = (Math.random() - 0.5) * 18;
        const p    = palette[Math.floor(Math.random() * palette.length)];
        col[i*3] = p[0]; col[i*3+1] = p[1]; col[i*3+2] = p[2];
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.02, vertexColors: true, transparent: true, opacity: 0.8 }));
      scene.add(pts);

      /* ── Floating coloured orbs ── */
      const orbDefs = [
        { pos:[-3.5,  1.2, -2.5], color:0x7B2FBE, size:0.45, opacity:0.50 },
        { pos:[-1.8, -1.9, -3.0], color:0xF47B20, size:0.38, opacity:0.45 },
        { pos:[ 0.7,  2.6, -4.0], color:0xF9C515, size:0.22, opacity:0.60 },
        { pos:[-4.0, -0.5, -5.0], color:0x6DBE45, size:0.70, opacity:0.35 },
        { pos:[ 4.0,  1.5, -3.5], color:0x00A79D, size:0.50, opacity:0.40 },
        { pos:[-0.5, -3.0, -4.0], color:0xE01F5C, size:0.35, opacity:0.45 },
        { pos:[ 2.5,  3.0, -5.0], color:0x2D73BE, size:0.55, opacity:0.35 },
        { pos:[-2.5,  2.5, -4.5], color:0xC4187A, size:0.30, opacity:0.45 },
      ];
      const orbs = orbDefs.map(o => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(o.size, 20, 20),
          new THREE.MeshPhongMaterial({ color: o.color, transparent: true, opacity: o.opacity, emissive: o.color, emissiveIntensity: 0.3 })
        );
        m.position.set(...o.pos);
        scene.add(m);
        return m;
      });

      /* ── Orbiting point lights ── */
      const lightDefs = [
        { color:0x7B2FBE, intensity:2.0, dist:10, pos:[ 2,  3, 1] },
        { color:0xF47B20, intensity:1.8, dist: 9, pos:[-3,  2, 0] },
        { color:0x00A79D, intensity:1.6, dist: 8, pos:[ 0, -3, 2] },
        { color:0xE01F5C, intensity:1.4, dist: 8, pos:[-1,  0, 3] },
        { color:0x6DBE45, intensity:1.2, dist: 7, pos:[ 3, -2, 0] },
      ];
      const pointLights = lightDefs.map(l => {
        const pl = new THREE.PointLight(l.color, l.intensity, l.dist);
        pl.position.set(...l.pos);
        scene.add(pl);
        return pl;
      });
      scene.add(new THREE.AmbientLight(0x060e1e, 2));

      /* ── Mouse parallax ── */
      const mouse = { x: 0, y: 0 };
      onMouseMove = e => {
        mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove);

      /* ── Animation loop ── */
      let t = 0;
      const tick = () => {
        af = requestAnimationFrame(tick);
        t += 0.008;

        globe.rotation.y += 0.002;
        wire.rotation.y  += 0.002;
        wire.rotation.x  += 0.0005;

        rings.forEach((ring, i) => {
          ring.rotation.z += (i % 2 === 0 ? 1 : -1) * (0.002 + i * 0.0004);
          ring.rotation.y += 0.001;
        });

        pts.rotation.y += 0.00018;
        pts.rotation.x += 0.00006;

        orbs.forEach((o, i) => {
          o.position.y     += Math.sin(t + i * 0.8) * 0.003;
          o.position.x     += Math.cos(t * 0.6 + i) * 0.002;
          o.material.opacity = orbDefs[i].opacity + Math.sin(t * 1.2 + i) * 0.08;
        });

        pointLights.forEach((pl, i) => {
          const angle  = t * 0.4 + (i / pointLights.length) * Math.PI * 2;
          const radius = 4 + i * 0.5;
          pl.position.x = Math.cos(angle) * radius;
          pl.position.z = Math.sin(angle) * radius;
          pl.position.y = Math.sin(t * 0.3 + i) * 2;
        });

        // Wireframe colour cycle
        const colIdx = Math.floor((t * 0.3) % COLOR_ARR.length);
        wire.material.color.setHex(COLOR_ARR[colIdx]);

        // Camera parallax
        cam.position.x += (mouse.x *  0.18 - cam.position.x) * 0.04;
        cam.position.y += (-mouse.y * 0.12 - cam.position.y) * 0.04;
        cam.lookAt(0, 0, 0);

        renderer.render(scene, cam);
      };
      tick();

      onResize = () => {
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

    } catch (e) {
      console.warn("ThreeBackground: WebGL initialization failed. Falling back to CSS background.", e);
      setHasWebGL(false);
    }

    return () => {
      if (af) cancelAnimationFrame(af);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onResize) window.removeEventListener('resize', onResize);
      if (renderer) renderer.dispose();
    };
  }, [hasWebGL]);

  if (!hasWebGL) {
    return (
      <div className="fallback-bg" id="three-fallback-bg">
        <div className="fallback-orb fallback-orb-1" />
        <div className="fallback-orb fallback-orb-2" />
        <div className="fallback-orb fallback-orb-3" />
        <div className="fallback-orb fallback-orb-4" />
      </div>
    );
  }

  return <canvas ref={ref} className="canvas-bg" />;
}
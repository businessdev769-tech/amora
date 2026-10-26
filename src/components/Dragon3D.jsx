import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// World units: the showcase container spans -1..1 at z = 0; the canvas is 150% of it (-1.5..1.5)
const CANVAS_SCALE = 1.5;
const VIEW_HALF = CANVAS_SCALE;
const FOV = 30;
const CAMERA_DISTANCE = VIEW_HALF / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

const SEGMENTS = 140;
const RADIAL = 18;
const ORBIT_RADIUS = 1.08;
const BODY_SWEEP = Math.PI * 1.55;
const SPINE_COUNT = 56;
const ORBIT_TILT_X = 0.42; // far half of the orbit rises behind the logo, near half drops in front
const ORBIT_TILT_Z = -0.2;

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const bodyRadius = (s) =>
  0.108 * (0.78 + 0.22 * smoothstep(0, 0.12, s)) * Math.max(0.06, Math.pow(1 - s, 0.75));

const v = (x, y, z) => new THREE.Vector3(x, y, z);
const Y_AXIS = v(0, 1, 0);

// Overlapping scale pattern; columns run along the body so each scale's rim faces the tail
function makeScaleTexture([highlight, mid, edge], colorSpace) {
  const size = 256;
  const step = 64;
  const r = 44;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, size, size);

  for (let col = -1; col <= size / step; col++) {
    const cx = col * step;
    const offset = col & 1 ? step / 2 : 0;
    for (let row = -1; row <= size / step; row++) {
      const cy = row * step + offset;
      const g = ctx.createRadialGradient(cx - r * 0.35, cy, r * 0.1, cx, cy, r);
      g.addColorStop(0, highlight);
      g.addColorStop(0.55, mid);
      g.addColorStop(1, edge);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = colorSpace;
  return texture;
}

// TubeGeometry whose radius tapers linearly from r0 to r1 along the curve
function taperedTube(points, r0, r1, tubular = 24, radial = 8) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, c);
    const r = r0 + (r1 - r0) * t;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      p.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, p.x, p.y, p.z);
    }
  }
  return geo;
}

function createDragon(renderer) {
  const disposables = [];
  const track = (o) => { disposables.push(o); return o; };

  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const scaleColor = track(makeScaleTexture(['#fff0b8', '#d9a441', '#5c3a0e'], THREE.SRGBColorSpace));
  const scaleBump = track(makeScaleTexture(['#ffffff', '#9a9a9a', '#000000'], THREE.NoColorSpace));
  scaleColor.anisotropy = scaleBump.anisotropy = maxAniso;

  const mats = {
    body: track(new THREE.MeshStandardMaterial({
      map: scaleColor, bumpMap: scaleBump, bumpScale: 2.2,
      metalness: 1, roughness: 0.34, vertexColors: true,
    })),
    gold: track(new THREE.MeshStandardMaterial({ color: 0xe0ac4c, metalness: 1, roughness: 0.3 })),
    horn: track(new THREE.MeshStandardMaterial({ color: 0xf3d48a, metalness: 0.9, roughness: 0.25 })),
    fire: track(new THREE.MeshStandardMaterial({
      color: 0xff9a3a, emissive: 0xff5a00, emissiveIntensity: 0.65, metalness: 0.35, roughness: 0.45,
    })),
    claw: track(new THREE.MeshStandardMaterial({ color: 0xfff2d0, metalness: 0.6, roughness: 0.3 })),
    tooth: track(new THREE.MeshStandardMaterial({ color: 0xfffaf0, metalness: 0.1, roughness: 0.35 })),
    mouth: track(new THREE.MeshStandardMaterial({ color: 0x7a1408, emissive: 0x3a0500, roughness: 0.6 })),
    eye: track(new THREE.MeshStandardMaterial({ color: 0xffc23a, emissive: 0xff9a10, emissiveIntensity: 1.8 })),
    pupil: track(new THREE.MeshBasicMaterial({ color: 0x120400 })),
    occluder: track(new THREE.MeshBasicMaterial({ colorWrite: false })),
  };

  const sphereGeo = track(new THREE.SphereGeometry(1, 24, 16));
  const spikeGeo = track(new THREE.ConeGeometry(1, 1, 7).translate(0, 0.5, 0));

  const ellipsoid = (parent, mat, [sx, sy, sz], [x, y, z]) => {
    const m = new THREE.Mesh(sphereGeo, mat);
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const spike = (parent, mat, base, dir, len, rad) => {
    const m = new THREE.Mesh(spikeGeo, mat);
    m.position.copy(base);
    m.quaternion.setFromUnitVectors(Y_AXIS, dir.normalize());
    m.scale.set(rad, len, rad);
    parent.add(m);
    return m;
  };
  const tube = (parent, mat, ...args) => {
    const m = new THREE.Mesh(track(taperedTube(...args)), mat);
    parent.add(m);
    return m;
  };

  const root = new THREE.Group();

  // Body: a tube whose vertices are rewritten every frame along the animated spine
  const vertsPerRing = RADIAL + 1;
  const bodyGeo = track(new THREE.BufferGeometry());
  const positions = new Float32Array(SEGMENTS * vertsPerRing * 3);
  const normals = new Float32Array(SEGMENTS * vertsPerRing * 3);
  const uvs = new Float32Array(SEGMENTS * vertsPerRing * 2);
  const colors = new Float32Array(SEGMENTS * vertsPerRing * 3);
  const back = new THREE.Color(0.95, 0.66, 0.3);
  const belly = new THREE.Color(1, 0.86, 0.55);
  const tmpColor = new THREE.Color();
  for (let i = 0; i < SEGMENTS; i++) {
    for (let j = 0; j <= RADIAL; j++) {
      const k = i * vertsPerRing + j;
      uvs[k * 2] = (i / (SEGMENTS - 1)) * 28;
      uvs[k * 2 + 1] = (j / RADIAL) * 3;
      tmpColor.copy(back).lerp(belly, smoothstep(0.2, 0.8, -Math.sin((j / RADIAL) * Math.PI * 2)));
      tmpColor.toArray(colors, k * 3);
    }
  }
  const indices = [];
  for (let i = 0; i < SEGMENTS - 1; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * vertsPerRing + j;
      const b = a + vertsPerRing;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  bodyGeo.setIndex(indices);
  bodyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  bodyGeo.setAttribute('normal', new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
  bodyGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  bodyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const body = new THREE.Mesh(bodyGeo, mats.body);
  body.frustumCulled = false;
  root.add(body);

  // Dorsal fins
  const spines = new THREE.InstancedMesh(spikeGeo, mats.gold, SPINE_COUNT);
  spines.frustumCulled = false;
  root.add(spines);

  // Head: built facing +X, up +Y, side +Z, then aligned to the spine frame at s = 0
  const headMount = new THREE.Group();
  headMount.matrixAutoUpdate = false;
  root.add(headMount);
  const head = new THREE.Group();
  head.scale.setScalar(1.15);
  headMount.add(head);

  ellipsoid(head, mats.gold, [0.12, 0.085, 0.09], [0.03, 0.02, 0]);       // cranium
  ellipsoid(head, mats.gold, [0.145, 0.05, 0.066], [0.17, 0, 0]);          // snout
  ellipsoid(head, mats.gold, [0.045, 0.036, 0.058], [0.295, 0.012, 0]);    // nose
  ellipsoid(head, mats.mouth, [0.13, 0.015, 0.05], [0.16, -0.045, 0]);     // roof of mouth

  const whiskers = [];
  for (const side of [-1, 1]) {
    ellipsoid(head, mats.gold, [0.07, 0.024, 0.03], [0.1, 0.068, 0.05 * side]).rotation.z = -0.25;
    ellipsoid(head, mats.eye, [0.022, 0.022, 0.022], [0.115, 0.045, 0.062 * side]);
    ellipsoid(head, mats.pupil, [0.005, 0.016, 0.004], [0.122, 0.045, 0.083 * side]);
    ellipsoid(head, mats.pupil, [0.008, 0.008, 0.008], [0.31, 0.03, 0.035 * side]); // nostril

    tube(head, mats.horn,
      [v(0.02, 0.08, 0.04 * side), v(-0.08, 0.15, 0.07 * side), v(-0.2, 0.18, 0.09 * side), v(-0.32, 0.24, 0.06 * side)],
      0.022, 0.003);
    tube(head, mats.horn,
      [v(-0.1, 0.155, 0.075 * side), v(-0.12, 0.22, 0.1 * side), v(-0.1, 0.27, 0.12 * side)],
      0.012, 0.002, 12, 6);

    for (let i = 0; i < 3; i++) {
      spike(head, mats.fire, v(-0.01 - i * 0.03, -0.01 + i * 0.02, 0.075 * side),
        v(-1, 0.1 - i * 0.25, 0.9 * side), 0.09 - i * 0.015, 0.018);
    }
    for (let i = 0; i < 4; i++) {
      spike(head, mats.tooth, v(0.15 + i * 0.035, -0.035, 0.045 * side), v(0, -1, 0), 0.03 - i * 0.004, 0.007);
    }

    const root0 = v(0.28, 0, 0.05 * side);
    const pivot = new THREE.Group();
    pivot.position.copy(root0);
    head.add(pivot);
    tube(pivot, mats.horn,
      [v(0.28, 0, 0.05 * side), v(0.3, -0.02, 0.12 * side), v(0.16, -0.1, 0.22 * side),
        v(-0.08, -0.13, 0.28 * side), v(-0.3, -0.06, 0.3 * side)].map((p) => p.sub(root0)),
      0.007, 0.0015, 32, 5);
    whiskers.push({ pivot, side });
  }

  for (let i = 0; i < 7; i++) {
    const z = (i - 3) * 0.025;
    spike(head, mats.fire, v(-0.04 - Math.abs(z) * 0.5, 0.06, z), v(-1, 0.7, z * 4), 0.16 - Math.abs(z) * 0.8, 0.022);
  }

  const jaw = new THREE.Group();
  jaw.position.set(0, -0.035, 0);
  head.add(jaw);
  ellipsoid(jaw, mats.gold, [0.15, 0.03, 0.056], [0.15, -0.012, 0]);
  ellipsoid(jaw, mats.mouth, [0.13, 0.018, 0.045], [0.14, 0.006, 0]);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      spike(jaw, mats.tooth, v(0.17 + i * 0.03, 0.01, 0.04 * side), v(0, 1, 0), 0.025, 0.006);
    }
  }
  for (let i = 0; i < 4; i++) {
    spike(jaw, mats.fire, v(0.08 - i * 0.03, -0.035, (i - 1.5) * 0.02), v(-0.6, -1, 0), 0.08, 0.014);
  }

  // Legs at the shoulders and hips; the left pair mirrors the right
  const legs = [];
  for (const [s, phase] of [[0.13, 0], [0.52, Math.PI]]) {
    for (const side of [-1, 1]) {
      const mount = new THREE.Group();
      mount.matrixAutoUpdate = false;
      root.add(mount);
      const mirror = new THREE.Group();
      mirror.scale.z = side;
      mount.add(mirror);
      const leg = new THREE.Group();
      mirror.add(leg);
      tube(leg, mats.gold, [v(0, 0, 0), v(0.03, -0.05, 0.06), v(-0.03, -0.11, 0.09), v(0.02, -0.16, 0.1)],
        0.034, 0.016, 16, 8);
      const foot = new THREE.Group();
      foot.position.set(0.02, -0.16, 0.1);
      leg.add(foot);
      for (let i = 0; i < 3; i++) spike(foot, mats.claw, v(0, 0, 0), v(1, -0.5, (i - 1) * 0.6), 0.06, 0.009);
      spike(leg, mats.fire, v(-0.02, -0.09, 0.08), v(-1, 0.3, 0.3), 0.09, 0.016);
      legs.push({ mount, leg, s, side, phase: phase + (side > 0 ? 0 : Math.PI / 2) });
    }
  }

  // Flame tuft at the tail tip
  const tailMount = new THREE.Group();
  tailMount.matrixAutoUpdate = false;
  root.add(tailMount);
  const tailFlames = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 6 - 0.5) * 1.6;
    tailFlames.push(spike(tailMount, mats.fire, v(0, 0, 0), v(-1, Math.sin(a) * 0.9, Math.cos(a) * 0.5 - 0.25),
      0.14 + (1 - Math.abs(i / 6 - 0.5) * 2) * 0.1, 0.03));
  }

  // Depth-only disc matching the DOM logo: hides the parts of the dragon that pass behind it
  const occluder = new THREE.Mesh(track(new THREE.CircleGeometry(1, 64)), mats.occluder);
  occluder.renderOrder = -1;
  root.add(occluder);

  // Per-frame spine buffers
  const P = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const T = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const S = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const U = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const orbitMatrix = new THREE.Matrix4()
    .makeRotationZ(ORBIT_TILT_Z)
    .multiply(new THREE.Matrix4().makeRotationX(ORBIT_TILT_X));
  const orbitUp = Y_AXIS.clone().applyMatrix4(orbitMatrix).normalize();
  const m4 = new THREE.Matrix4();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const tmpScale = new THREE.Vector3();
  const mouthLocal = v(0.3, -0.04, 0);
  const mouthWorld = new THREE.Vector3();

  const indexAt = (s) => Math.round(s * (SEGMENTS - 1));
  const frameMatrix = (out, i) => out.makeBasis(T[i], U[i], S[i]).setPosition(P[i]);

  function update(time, headAngle, swoop) {
    for (let i = 0; i < SEGMENTS; i++) {
      const s = i / (SEGMENTS - 1);
      const theta = headAngle - s * BODY_SWEEP;
      const rr = ORBIT_RADIUS + 0.08 * Math.sin(Math.PI * 2 * 1.2 * s - 1.9 * time + 1);
      const h = 0.13 * Math.sin(Math.PI * 2 * 1.5 * s - 2.6 * time) * (0.35 + 0.65 * smoothstep(0, 0.3, s));
      P[i].set(rr * Math.cos(theta), h, rr * Math.sin(theta)).applyMatrix4(orbitMatrix);
    }
    for (let i = 0; i < SEGMENTS; i++) {
      T[i].subVectors(P[Math.max(i - 1, 0)], P[Math.min(i + 1, SEGMENTS - 1)]).normalize();
      S[i].crossVectors(T[i], orbitUp).normalize();
      U[i].crossVectors(S[i], T[i]);
    }

    for (let i = 0; i < SEGMENTS; i++) {
      const r = bodyRadius(i / (SEGMENTS - 1));
      for (let j = 0; j <= RADIAL; j++) {
        const phi = (j / RADIAL) * Math.PI * 2;
        const c = Math.cos(phi);
        const sn = Math.sin(phi);
        const k = (i * vertsPerRing + j) * 3;
        tmp.copy(S[i]).multiplyScalar(c).addScaledVector(U[i], sn);
        normals[k] = tmp.x; normals[k + 1] = tmp.y; normals[k + 2] = tmp.z;
        tmp2.copy(P[i]).addScaledVector(S[i], c * r * 0.92).addScaledVector(U[i], sn * r);
        positions[k] = tmp2.x; positions[k + 1] = tmp2.y; positions[k + 2] = tmp2.z;
      }
    }
    bodyGeo.attributes.position.needsUpdate = true;
    bodyGeo.attributes.normal.needsUpdate = true;

    for (let n = 0; n < SPINE_COUNT; n++) {
      const s = 0.03 + (n / (SPINE_COUNT - 1)) * 0.95;
      const i = indexAt(s);
      const r = bodyRadius(s);
      const dir = tmp.copy(U[i]).addScaledVector(T[i], -0.75).normalize();
      const xAxis = tmp2.crossVectors(dir, S[i]);
      m4.makeBasis(xAxis, dir, S[i])
        .scale(tmpScale.set(r * 0.45, r * 1.3, r * 0.15))
        .setPosition(tmp.copy(P[i]).addScaledVector(U[i], r * 0.85));
      spines.setMatrixAt(n, m4);
    }
    spines.instanceMatrix.needsUpdate = true;

    frameMatrix(headMount.matrix, 0);
    head.rotation.z = Math.sin(time * 1.1) * 0.08;
    head.rotation.x = Math.sin(time * 0.7) * 0.06;
    jaw.rotation.z = -(0.12 + 0.1 * Math.max(0, Math.sin(time * 1.3)) + swoop * 0.35);
    for (const { pivot, side } of whiskers) {
      pivot.rotation.y = Math.sin(time * 2.1 + side) * 0.18 * side;
      pivot.rotation.z = Math.sin(time * 1.7 + side * 0.5) * 0.12;
    }

    for (const { mount, leg, s, side, phase } of legs) {
      const i = indexAt(s);
      const r = bodyRadius(s);
      frameMatrix(mount.matrix, i);
      mount.matrix.setPosition(tmp.copy(P[i]).addScaledVector(S[i], side * r * 0.75).addScaledVector(U[i], -r * 0.35));
      leg.rotation.z = Math.sin(time * 2.6 + phase) * 0.45;
      leg.rotation.x = 0.2;
    }

    frameMatrix(tailMount.matrix, SEGMENTS - 1);
    tailFlames.forEach((flame, n) => {
      const flicker = 1 + Math.sin(time * 9 + n * 1.7) * 0.15;
      flame.scale.y = (0.14 + (1 - Math.abs(n / 6 - 0.5) * 2) * 0.1) * flicker;
    });

    root.updateMatrixWorld(true);
    head.localToWorld(mouthWorld.copy(mouthLocal));
    return { mouth: mouthWorld, forward: T[0] };
  }

  function dispose() {
    disposables.forEach((d) => d.dispose());
    spines.dispose();
  }

  return { root, occluder, update, dispose };
}

export default function Dragon3D({ visible, swooping, discRef, mouthRef }) {
  const canvasRef = useRef(null);
  const swoopRef = useRef(swooping);
  swoopRef.current = swooping;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return undefined; // no WebGL: the logo still works without the dragon
    }
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.9;

    scene.add(new THREE.HemisphereLight(0xfff1d0, 0x2a1606, 0.5));
    const key = new THREE.DirectionalLight(0xffe0a0, 2.4);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff8a2a, 2.2);
    rim.position.set(2, -1, -3);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    camera.position.set(0, 0, CAMERA_DISTANCE);

    const dragon = createDragon(renderer);
    scene.add(dragon.root);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isVisible = true;
    let frameId = 0;
    let lastTime = performance.now();
    let time = 2;
    let headAngle = 0.4;
    let speed = 0.5;
    const ndc = new THREE.Vector3();
    const ahead = new THREE.Vector3();

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const syncOccluder = () => {
      const disc = discRef.current;
      if (!disc) return;
      const cr = canvas.getBoundingClientRect();
      const dr = disc.getBoundingClientRect();
      if (!cr.width) return;
      const unitsPerPx = (VIEW_HALF * 2) / cr.width;
      dragon.occluder.position.set(
        (dr.left + dr.width / 2 - (cr.left + cr.width / 2)) * unitsPerPx,
        -(dr.top + dr.height / 2 - (cr.top + cr.height / 2)) * unitsPerPx,
        0,
      );
      // Layout size, not the rect, so the disc's spin doesn't inflate the radius
      dragon.occluder.scale.setScalar((disc.offsetWidth / canvas.offsetWidth) * VIEW_HALF);
    };

    const publishMouth = ({ mouth, forward }) => {
      if (!mouthRef) return;
      const side = canvas.offsetWidth;
      const containerW = side / CANVAS_SCALE;
      const toPx = (p) => {
        ndc.copy(p).project(camera);
        return [containerW / 2 + ndc.x * (side / 2), containerW / 2 - ndc.y * (side / 2)];
      };
      const [x, y] = toPx(mouth);
      const [ax, ay] = toPx(ahead.copy(mouth).addScaledVector(forward, 0.15));
      const len = Math.hypot(ax - x, ay - y) || 1;
      const o = dragon.occluder;
      const behindLogo = mouth.z < 0 && Math.hypot(mouth.x - o.position.x, mouth.y - o.position.y) < o.scale.x;
      mouthRef.current = { x, y, dirX: (ax - x) / len, dirY: (ay - y) / len, hidden: behindLogo };
    };

    const renderFrame = (swoop) => {
      syncOccluder();
      publishMouth(dragon.update(time, headAngle, swoop));
      renderer.render(scene, camera);
    };

    const loop = (now) => {
      frameId = requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (!isVisible || document.hidden) return;
      const swoop = swoopRef.current ? 1 : 0;
      speed += ((swoop ? 2.4 : 0.5) - speed) * Math.min(1, dt * 3);
      headAngle += speed * dt;
      time += dt * (1 + swoop * 0.8);
      renderFrame(swoop);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) renderFrame(0);
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    intersection.observe(canvas);

    resize();
    if (reducedMotion) renderFrame(0);
    else frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersection.disconnect();
      if (mouthRef) mouthRef.current = null;
      dragon.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [discRef, mouthRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`dragon-3d-canvas ${visible ? 'is-visible' : ''}`}
      aria-hidden="true"
    />
  );
}

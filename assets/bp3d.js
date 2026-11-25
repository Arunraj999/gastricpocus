/* NORA² block player: 3D probe-and-plane inset. Shows where the probe sits on the patient and the scan plane
   cutting through the body, with the current scan image mapped onto that plane. Loaded only when asked for. */
import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';
const BASE = 'media/model3d/', VER = '?v=1';
let DATA = null;
async function load() {
  if (DATA) return DATA;
  const [j, pos, idx] = await Promise.all([fetch(BASE + 'inset.json' + VER).then(r => r.json()),
    fetch(BASE + 'inset_pos.bin' + VER).then(r => r.arrayBuffer()).then(b => new Float32Array(b)),
    fetch(BASE + 'inset_idx.bin' + VER).then(r => r.arrayBuffer()).then(b => new Uint16Array(b))]);
  DATA = { j, pos, idx }; return DATA;
}
/* where each block is scanned: the nerve the plane is centred on, how far along it, and the direction from that
   nerve out to the skin under the probe. Right side; x is medial(+)/lateral(-), y anterior(-)/posterior(+), z up. */
const POSE = {
  interscalene: { n: 'C6 root', t: 0.85, out: [-1, -0.35, 0.05], eye: [-1, -0.9, 0.45] },
  superiortrunk: { n: 'Superior trunk', t: 0.25, out: [-1, -0.4, 0.2], eye: [-1, -0.9, 0.5] },
  supraclavicular: { n: 'Middle trunk', t: 0.6, out: [-0.15, -0.35, 1], eye: [-0.5, -1, 0.7] },
  suprascapularant: { n: 'Suprascapular nerve', t: 0.12, out: [-0.35, -0.3, 1], eye: [-0.6, -1, 0.7] },
  suprascapular: { n: 'Suprascapular nerve', t: 0.97, out: [0.05, 1, 0.55], eye: [-0.6, 1, 0.6] },
  raptir: { n: 'Lateral cord', t: 0.15, out: [0.05, -1, 0.25], eye: [-0.8, -1, 0.35] },
  costoclavicular: { n: 'Lateral cord', t: 0.0, out: [0.15, -1, 0.3], eye: [-0.6, -1, 0.4] }
};
const WORD = { medial: [1, 0, 0], lateral: [-1, 0, 0], anterior: [0, -1, 0], posterior: [0, 1, 0], cephalad: [0, 0, 1], caudad: [0, 0, -1], superior: [0, 0, 1], inferior: [0, 0, -1] };
function dirOf(label) { const v = new THREE.Vector3(); const s = String(label).toLowerCase();
  if (s.indexOf('anteromedial') > -1) v.add(new THREE.Vector3(1, -1, 0)); else if (s.indexOf('posterolateral') > -1) v.add(new THREE.Vector3(-1, 1, 0));
  else if (s.indexOf('anterolateral') > -1) v.add(new THREE.Vector3(-1, -1, 0)); else if (s.indexOf('posteromedial') > -1) v.add(new THREE.Vector3(1, 1, 0));
  else Object.keys(WORD).forEach(k => { if (s.indexOf(k) > -1) v.add(new THREE.Vector3(...WORD[k])); });
  return v.normalize(); }
export async function mount(box, opt) {
  const pose = POSE[opt.block] || POSE.interscalene, D = await load(), J = D.j;
  const W = box.clientWidth || 300, H = Math.round(W * 0.72);
  const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); ren.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); ren.setSize(W, H);
  ren.outputColorSpace = THREE.SRGBColorSpace; box.appendChild(ren.domElement);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, W / H, 5, 4000);
  scene.add(new THREE.HemisphereLight(0xfaf3ea, 0x334055, 1.15)); const sun = new THREE.DirectionalLight(0xffffff, 1.3); sun.position.set(-300, -500, 1900); scene.add(sun);
  const mk = (off, nv, nt, ioff) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(D.pos.subarray(off * 3, (off + nv) * 3), 3)); g.setIndex(new THREE.BufferAttribute(D.idx.subarray(ioff * 3, (ioff + nt) * 3), 1)); g.computeVertexNormals(); return g; };
  const sk = J.skin, bn = J.bone;
  const skinG = mk(0, sk[0], sk[1], 0), boneG = mk(sk[0], bn[0], bn[1], sk[1]);
  const skin = new THREE.Mesh(skinG, new THREE.MeshStandardMaterial({ color: 0xF0CDB4, roughness: 0.6, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
  const skinSolid = new THREE.Mesh(skinG, new THREE.MeshStandardMaterial({ color: 0xE2B79A, roughness: 0.7, side: THREE.DoubleSide, colorWrite: false }));
  const bone = new THREE.Mesh(boneG, new THREE.MeshStandardMaterial({ color: 0xEFE6D2, roughness: 0.55 }));
  scene.add(bone); scene.add(skin);
  const nmat = new THREE.MeshStandardMaterial({ color: 0xF2C230, roughness: 0.4, emissive: 0x4a3500 });
  let anchor = null, tangent = null;
  J.plexus.forEach((segs, k) => segs.forEach(s => { if (s.length < 2) return; const pts = s.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(4, pts.length * 2), J.names[k].match(/root|trunk|cord/i) ? 1.6 : 0.9, 6, false), nmat); scene.add(tube);
    if (J.names[k] === pose.n && !anchor) { const c = new THREE.CatmullRomCurve3(pts); anchor = c.getPointAt(pose.t); tangent = c.getTangentAt(pose.t).normalize(); } }));
  if (!anchor) { anchor = new THREE.Vector3(-40, -80, 1400); tangent = new THREE.Vector3(-1, 0, -0.4).normalize(); }
  /* probe on the skin: cast outwards from the nerve until the ray leaves the body */
  const out = new THREE.Vector3(...pose.out).normalize(), ray = new THREE.Raycaster(anchor.clone(), out, 0, 400);
  const hits = ray.intersectObject(skinSolid, false); const skinPt = hits.length ? hits[hits.length - 1].point : anchor.clone().addScaledVector(out, 30);
  const into = out.clone().negate(); let lat = new THREE.Vector3().crossVectors(tangent, into); if (lat.lengthSq() < 0.05) lat = new THREE.Vector3(0, 0, 1).cross(into); lat.normalize();
  const hint = dirOf((opt.ori || ['Anteromedial'])[0]); if (lat.dot(hint) > 0) lat.negate();   // image left (ORI[0]) points to -lat side, so flip so +lat = image right
  const MM = opt.mm || 0.0952, PW = 640 * MM, PD = 354 * MM, tx = ((opt.target ? opt.target[0] : 320) - 320) * MM;
  const centre = skinPt.clone().addScaledVector(lat, -tx);   // slide so the target sits over the nerve we centred on
  /* scan plane with the live image */
  const tex = new THREE.Texture(); tex.colorSpace = THREE.SRGBColorSpace; tex.repeat.set(1, 354 / 400); tex.offset.set(0, 0);
  const setImg = src => { const im = new Image(); im.onload = () => { tex.image = im; tex.needsUpdate = true; }; im.src = src; }; setImg(opt.img());
  const pg = new THREE.PlaneGeometry(PW, PD); const plane = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0.96, depthWrite: false, depthTest: false }));
  const nrm = new THREE.Vector3().crossVectors(lat, out).normalize();
  const basis = new THREE.Matrix4().makeBasis(lat, out, nrm); plane.quaternion.setFromRotationMatrix(basis);
  plane.position.copy(centre).addScaledVector(into, PD / 2 + 0.5); plane.renderOrder = 10; scene.add(plane);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(pg), new THREE.LineBasicMaterial({ color: 0x7FD3FF, depthTest: false, transparent: true })); edge.quaternion.copy(plane.quaternion); edge.position.copy(plane.position); edge.renderOrder = 11; scene.add(edge);
  /* probe: grip, lens and orientation marker on the ORI[0] end */
  const probe = new THREE.Group(), pm = new THREE.MeshStandardMaterial({ color: 0x9AA7B8, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.8 });
  const grip = new THREE.Mesh(new THREE.BoxGeometry(PW * 0.6, 34, 10), pm); grip.position.set(0, 21, 0); probe.add(grip);
  const head = new THREE.Mesh(new THREE.BoxGeometry(PW * 0.82, 10, 14), new THREE.MeshStandardMaterial({ color: 0xC5CFDB, roughness: 0.35, transparent: true, opacity: 0.85 })); head.position.set(0, 5, 0); probe.add(head);
  const mark = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 8), new THREE.MeshStandardMaterial({ color: 0xFFC61A, emissive: 0x664a00 })); mark.position.set(-PW * 0.41, 9, 7.5); probe.add(mark);
  probe.quaternion.copy(plane.quaternion); probe.position.copy(centre); scene.add(probe);
  /* camera: from the probe's outward side, a little above, looking at the plane */
  const look = plane.position.clone(); const ctl = new OrbitControls(cam, ren.domElement); ctl.target.copy(look); ctl.enableDamping = true; ctl.enablePan = false; ctl.minDistance = 120; ctl.maxDistance = 900;
  cam.up.set(0, 0, 1); const eye = new THREE.Vector3(...(pose.eye || [-1, -1, 0.5])).normalize(), sg = nrm.dot(eye) < 0 ? -1 : 1;
  const view = nrm.clone().multiplyScalar(0.8 * sg).add(out.clone().multiplyScalar(0.42)).add(eye.clone().multiplyScalar(0.35)).normalize();
  cam.position.copy(look).addScaledVector(view, 235); ctl.update(); ctl.autoRotate = true; ctl.autoRotateSpeed = 0.35;
  ren.domElement.addEventListener('pointerdown', () => { ctl.autoRotate = false; });
  let alive = true, vis = true; const io = 'IntersectionObserver' in window ? new IntersectionObserver(e => { vis = e[0].isIntersecting; }) : null; if (io) io.observe(box);
  (function tick() { if (!alive) return; if (vis && !document.hidden) { ctl.update(); ren.render(scene, cam); } requestAnimationFrame(tick); })();
  return { update: () => setImg(opt.img()), destroy: () => { alive = false; if (io) io.disconnect(); ren.dispose(); box.innerHTML = ''; } };
}

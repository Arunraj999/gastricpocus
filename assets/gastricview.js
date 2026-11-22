/* NORA² gastric antrum view: simulated ultrasound and matching anatomical illustration, with a slider.
   Original drawing and simulation by NORA² (Dr Arun Mohanraj FRCA EDRA). Sagittal epigastric plane at the level of the aorta.
   GVIEW.mount(el, {state, pos, labels}) ; states: empty, fluid, fluidbig, milk, solid, solidlate ; pos: supine | rld */
(function () {
  "use strict";
  var DEPTH = 125, R = 55, TH = 0.70;                     // mm, probe radius, half-angle (rad)
  function rng(s) { return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function cl(v, a, b) { return v < a ? a : v > b ? b : v; }
  /* ---------- anatomy (mm; x: + is caudad = right of screen, y: depth from skin) ---------- */
  function blob(cx, cy, rx, ry, rot, wob, seed, n) {
    var r = rng(seed), k = [], i, p = []; for (i = 0; i < 6; i++) k.push([r() * 6.28, (r() - 0.5) * wob]);
    n = n || 96;
    for (i = 0; i < n; i++) {
      var a = i / n * 6.2832, d = 1; k.forEach(function (q, j) { d += q[1] * Math.sin((j + 2) * a + q[0]); });
      var x = Math.cos(a) * rx * d, y = Math.sin(a) * ry * d, c = Math.cos(rot), s = Math.sin(rot);
      p.push([cx + x * c - y * s, cy + x * s + y * c]);
    } return p;
  }
  function antrum(st) {
    // outer serosa and lumen (content) contours, and wall thickness
    var A = {
      empty: { cx: 6, cy: 37, rx: 14, ry: 9, rot: -0.10, wall: 6.2, lum: 0 },
      fluid: { cx: 14, cy: 40, rx: 22, ry: 12.5, rot: -0.10, wall: 3.0, lum: 1 },
      fluidbig: { cx: 20, cy: 44, rx: 33, ry: 17, rot: -0.10, wall: 2.4, lum: 1 },
      milk: { cx: 19, cy: 43, rx: 30, ry: 16, rot: -0.10, wall: 2.6, lum: 1 },
      solid: { cx: 22, cy: 45, rx: 35, ry: 18, rot: -0.08, wall: 2.4, lum: 1 },
      solidlate: { cx: 21, cy: 44, rx: 33, ry: 17, rot: -0.08, wall: 2.6, lum: 1 }
    }[st];
    A.out = blob(A.cx, A.cy, A.rx, A.ry, A.rot, 0.07, 11);
    A.inn = blob(A.cx, A.cy, A.rx - A.wall, A.ry - A.wall, A.rot, 0.09, 11);
    return A;
  }
  var STATIC = null;
  function anatomy() {
    if (STATIC) return STATIC;
    var S = {};
    S.liver = [[-150, 24], [-30, 25], [-16, 28], [-14, 34], [-22, 43], [-34, 52], [-56, 60], [-150, 72]];
    S.pancreas = blob(-14, 66, 19, 7.5, -0.05, 0.08, 5);
    S.sma = blob(-70, 79, 24, 3.6, -0.17, 0.02, 4);
    S.smv = blob(-68, 64, 4.2, 3.4, 0, 0.05, 9);
    S.bowel = [blob(58, 40, 12, 8, 0.3, 0.1, 21), blob(66, 66, 11, 9, -0.2, 0.1, 22)];
    S.verts = []; for (var v = -130; v < 130; v += 33) S.verts.push(v);
    STATIC = S; return S;
  }
  function inPoly(p, x, y) { var c = false; for (var i = 0, j = p.length - 1; i < p.length; j = i++) { if (((p[i][1] > y) !== (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) c = !c; } return c; }
  /* tissue codes */
  var FAT = 1, SUBQ = 2, RECTUS = 3, PREP = 4, LIVER = 5, WALL_S = 6, WALL_M = 7, WALL_SM = 8, WALL_MU = 9, CONT = 10, PANC = 11, SMA = 12, SMV = 13, AORTA = 14, VWALL = 15, BONE = 16, DISC = 17, BOWEL = 18, MESFAT = 19, SKIN = 20;
  function tissue(x, y, A, S) {
    var rd = Math.hypot(x, y + R) - R;
    if (rd < 1.2) return SKIN;
    if (rd < 10 + 1.0 * Math.sin(x * 0.05)) return SUBQ;
    if (rd < 11.2) return FAT;
    if (rd < 19.5 + 0.6 * Math.sin(x * 0.07)) return RECTUS;
    if (rd < 22.5) return PREP;
    // antrum
    if (inPoly(A.out, x, y)) {
      if (!inPoly(A.inn, x, y)) {
        // wall layers by fractional depth inside the wall: serosa, muscularis, submucosa, mucosa
        var dd = wallFrac(x, y, A); return dd < 0.14 ? WALL_S : dd < 0.55 ? WALL_M : dd < 0.75 ? WALL_SM : WALL_MU;
      }
      return CONT;
    }
    if (inPoly(S.liver, x, y)) return LIVER;
    for (var b = 0; b < S.bowel.length; b++) if (inPoly(S.bowel[b], x, y)) return BOWEL;
    if (inPoly(S.pancreas, x, y)) return PANC;
    if (inPoly(S.smv, x, y)) return SMV;
    if (inPoly(S.sma, x, y)) return SMA;
    var ay = aortaY(x);
    if (y > ay[0] - 1.6 && y < ay[1] + 1.6) return (y < ay[0] || y > ay[1]) ? VWALL : AORTA;
    if (y > 109 + 0.03 * x + 0.0006 * x * x) { return vert(x) ? BONE : DISC; }
    return MESFAT;
  }
  function aortaY(x) { return [88 + 0.03 * x + 0.0006 * x * x, 103 + 0.03 * x + 0.0006 * x * x]; }
  function vert(x) { var u = ((x + 130) % 33 + 33) % 33; return u > 5.5; }
  function wallFrac(x, y, A) {
    var dx = x - A.cx, dy = y - A.cy, c = Math.cos(-A.rot), s = Math.sin(-A.rot), u = dx * c - dy * s, v = dx * s + dy * c;
    var ang = Math.atan2(v / A.ry, u / A.rx), ro = Math.hypot(Math.cos(ang) * A.rx, Math.sin(ang) * A.ry), r = Math.hypot(u, v);
    return cl((ro - r) / A.wall, 0, 1);
  }
  /* ---------- geometry of the fan on the canvas ---------- */
  function fan(W, H) {
    var sag = R * (1 - Math.cos(TH)), hw = (R + DEPTH) * Math.sin(TH), k = Math.min(W * 0.98 / (2 * hw), H * 0.95 / (DEPTH + sag));
    return { k: k, x0: W / 2, y0: H * 0.03 + sag * k };
  }
  function toCanvas(g, x, y) { return [g.x0 + x * g.k, g.y0 + y * g.k]; }
  function fromCanvas(g, X, Y) { var sx = (X - g.x0) / g.k, sy = (Y - g.y0) / g.k + R, rr = Math.hypot(sx, sy), th = Math.atan2(sx, sy); return [th, rr - R, th]; }
  /* ---------- ultrasound ---------- */
  var ECHO = {}; ECHO[SKIN] = 0.9; ECHO[SUBQ] = 0.16; ECHO[FAT] = 0.55; ECHO[RECTUS] = 0.30; ECHO[PREP] = 0.85; ECHO[LIVER] = 0.36; ECHO[WALL_S] = 1.2; ECHO[WALL_M] = 0.02; ECHO[WALL_SM] = 1.1; ECHO[WALL_MU] = 0.05;
  ECHO[PANC] = 0.62; ECHO[SMA] = 0.02; ECHO[SMV] = 0.03; ECHO[AORTA] = 0.02; ECHO[VWALL] = 0.95; ECHO[BONE] = 1.0; ECHO[DISC] = 0.08; ECHO[BOWEL] = 0.9; ECHO[MESFAT] = 0.70;
  var ATT = {}; [SKIN, SUBQ, FAT, RECTUS, PREP, LIVER, WALL_S, WALL_M, WALL_SM, WALL_MU, PANC, MESFAT, DISC].forEach(function (t) { ATT[t] = 0.0105; });
  ATT[SMA] = ATT[SMV] = ATT[AORTA] = 0.0015; ATT[VWALL] = 0.012; ATT[BONE] = 0.02; ATT[BOWEL] = 0.03;
  var NOISE = null, NW = 512, NH = 512;
  function noise() {
    if (NOISE) return NOISE; var r = rng(1234), a = new Float32Array(NW * NH), b = new Float32Array(NW * NH), i, j;
    for (i = 0; i < a.length; i++) { var u = r() || 1e-6, v = r(); a[i] = Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * v); }
    // anisotropic smoothing: longer across the beam (columns) than along it (rows)
    for (j = 0; j < NH; j++) for (i = 0; i < NW; i++) { var s = 0; for (var d = -3; d <= 3; d++) s += a[j * NW + ((i + d + NW) % NW)] * (1 - Math.abs(d) / 4); b[j * NW + i] = s; }
    for (j = 0; j < NH; j++) for (i = 0; i < NW; i++) { var s2 = 0; for (var e = -1; e <= 1; e++) s2 += b[((j + e + NH) % NH) * NW + i] * (e ? 0.5 : 1); a[j * NW + i] = s2; }
    var m = 0; for (i = 0; i < a.length; i++) m += a[i] * a[i]; m = Math.sqrt(m / a.length);
    for (i = 0; i < a.length; i++) a[i] = a[i] / m;
    NOISE = a; return a;
  }
  function nz(u, v) { var i = ((Math.floor(u) % NW) + NW) % NW, j = ((Math.floor(v) % NH) + NH) % NH; return NOISE[j * NW + i]; }
  function smoothNoise(x, y, s, seed) { var r = rng(seed); var ox = r() * 300, oy = r() * 300; var u = x / s + ox, v = y / s + oy, i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j;
    fu = fu * fu * (3 - 2 * fu); fv = fv * fv * (3 - 2 * fv); return lerp(lerp(nz(i * 7, j * 7), nz(i * 7 + 7, j * 7), fu), lerp(nz(i * 7, j * 7 + 7), nz(i * 7 + 7, j * 7 + 7), fu), fv); }
  function contentEcho(st, x, y, A, r) {
    if (st === "empty") return 0.95;
    if (st === "fluid" || st === "fluidbig") {               // anechoic with scattered bright bubbles
      var b = nz(x * 9.1, y * 9.7); return 0.015 + (b > 2.75 ? 1.6 : 0);
    }
    if (st === "milk") return 1.7 + 0.08 * smoothNoise(x, y, 6, 3);
    var top = A.cy - A.ry + A.wall;                          // solid: bright anterior band, everything behind it lost
    if (st === "solid") { var dz = y - top; return (2.6 + 0.6 * smoothNoise(x, y, 2.2, 5)) * Math.exp(-dz / 11) + 0.15; }
    return 0.75 + 0.9 * Math.max(0, smoothNoise(x, y, 4, 7)) + 0.3 * smoothNoise(x, y, 1.5, 8);   // later: heterogeneous
  }
  function contentAtt(st) { return st === "solid" ? 0.038 : st === "solidlate" ? 0.03 : st === "milk" ? 0.007 : st === "empty" ? 0.0105 : 0.0012; }
  function blur1(src, n, m, stride, step, rad) {           // box blur along one axis, in place (used three times = near Gaussian)
    var out = new Float32Array(src.length), i, j, k;
    for (i = 0; i < n; i++) { var base = i * stride, acc = 0, cnt = 0, q = [];
      for (j = -rad; j <= rad; j++) { var jj = cl(j, 0, m - 1); acc += src[base + jj * step]; }
      for (j = 0; j < m; j++) { out[base + j * step] = acc / (2 * rad + 1); var a0 = cl(j - rad, 0, m - 1), a1 = cl(j + rad + 1, 0, m - 1); acc += src[base + a1 * step] - src[base + a0 * step]; } }
    src.set(out);
  }
  function gblur(a, NR, NS, rl, ra) { for (var p = 0; p < 2; p++) { if (ra > 0) blur1(a, NR, NS, NS, 1, ra); if (rl > 0) blur1(a, NS, NR, 1, NS, rl); } }
  var INTF = {}; [[SKIN, 0.9], [WALL_S, 0.8], [VWALL, 1.0], [BONE, 1.4], [BOWEL, 1.3], [FAT, 0.7], [PREP, 0.8], [WALL_SM, 0.5]].forEach(function (p) { INTF[p[0]] = p[1]; });
  function renderUS(cv, st, gain) {
    noise(); var W = cv.width, H = cv.height, g = fan(W, H), A = antrum(st), S = anatomy();
    var NR = 420, NS = 520, ds = DEPTH / NS, E = new Float32Array(NR * NS), I = new Float32Array(NR * NS), Tm = new Float32Array(NR * NS), L = new Uint8Array(NR * NS);
    for (var i = 0; i < NR; i++) {
      var th = -TH + 2 * TH * (i + 0.5) / NR, sn = Math.sin(th), cs = Math.cos(th), T = 1, prev = -1;
      for (var j = 0; j < NS; j++) {
        var rr = (j + 0.5) * ds, x = (R + rr) * sn, y = (R + rr) * cs - R, t = tissue(x, y, A, S), e = t === CONT ? contentEcho(st, x, y, A) : ECHO[t], at = t === CONT ? contentAtt(st) : ATT[t];
        if (t === MESFAT) e *= Math.max(0.45, 0.85 + 0.35 * smoothNoise(x, y, 3.5, 2) + 0.3 * smoothNoise(x, y, 1.0, 12));
        if (t === LIVER) e *= 0.92 + 0.12 * smoothNoise(x, y, 6, 1);
        if (t === PANC) e *= 0.85 + 0.3 * smoothNoise(x, y, 1.8, 3);
        if (t === RECTUS) e *= 0.55 + 0.9 * Math.max(0, smoothNoise(x * 0.12, rr * 1.6, 1, 4) + 0.15);
        if (t === SUBQ) e *= 0.45 + 1.8 * Math.max(0, smoothNoise(x * 0.10, rr * 1.2, 1.1, 5) - 0.25);
        var itf = 0; if (prev >= 0 && prev !== t) { itf = INTF[t] || INTF[prev] || 0.35; if (prev === AORTA || prev === SMA || prev === SMV || prev === CONT) itf = Math.max(itf, 0.8); if (prev === LIVER || t === LIVER) itf = Math.max(itf, 0.55); }
        if (t === BONE && prev !== BONE) { itf = 1.6; } if (t === BOWEL && prev !== BOWEL) itf = 1.4;
        if (t === BONE) e = 0.05; if (t === BOWEL) e = 0.5 + 0.6 * Math.max(0, smoothNoise(x, y, 1.6, 17));
        E[i * NS + j] = e; I[i * NS + j] = itf; Tm[i * NS + j] = T; L[i * NS + j] = t;
        if (t === BONE && prev !== BONE) T *= 0.06; if (t === BOWEL && prev !== BOWEL) T *= 0.45;
        T *= Math.exp(-at * ds * 3.0); if (T < 0.02) T = 0.02; prev = t;
      }
    }
    gblur(E, NR, NS, 1, 2);                                 // soft boundaries: about 1 mm along the beam, a little more across it
    gblur(I, NR, NS, 1, 1);
    gblur(Tm, NR, NS, 2, 0);                                // shadows with soft edges
    var img = new Float32Array(NR * NS);
    for (i = 0; i < NR; i++) { var th2 = -TH + 2 * TH * (i + 0.5) / NR;
      for (j = 0; j < NS; j++) { var r2 = (j + 0.5) * ds, arc = th2 * (R + r2), q = i * NS + j;
        var n1 = smoothNoise(arc * 0.34, r2 * 0.95, 0.55, 99), n2 = smoothNoise(arc * 0.34, r2 * 0.95, 0.55, 98), sp = Math.sqrt(n1 * n1 + n2 * n2) * 0.72, sc = smoothNoise(arc * 0.5, r2 * 0.9, 1, 55); if (sc > 1.6 && L[q] === MESFAT) sp *= 1 + (sc - 1.6) * 2.2;
        var lv = 1 + 0.28 * smoothNoise(arc, r2, 7, 61); img[q] = (E[q] * lv * sp + I[q] * (0.5 + 0.5 * sp) * 2.2) * Tm[q] * Math.exp(0.026 * r2); } }
    gblur(img, NR, NS, 1, 1);
    var ctx = cv.getContext("2d"), out = ctx.createImageData(W, H), d = out.data, G = gain == null ? 1 : gain;
    for (var Y = 0; Y < H; Y++) for (var X = 0; X < W; X++) {
      var qq = fromCanvas(g, X, Y), o = (Y * W + X) * 4; d[o + 3] = 255;
      if (qq[1] < 0 || qq[1] >= DEPTH || Math.abs(qq[2]) > TH) { d[o] = d[o + 1] = d[o + 2] = 0; continue; }
      var fi = (qq[2] + TH) / (2 * TH) * NR - 0.5, fj = qq[1] / ds - 0.5, i0 = cl(Math.floor(fi), 0, NR - 2), j0 = cl(Math.floor(fj), 0, NS - 2), u = cl(fi - i0, 0, 1), w = cl(fj - j0, 0, 1);
      var v = lerp(lerp(img[i0 * NS + j0], img[(i0 + 1) * NS + j0], u), lerp(img[i0 * NS + j0 + 1], img[(i0 + 1) * NS + j0 + 1], u), w);
      v = (20 * Math.log(v * G + 1e-5) / Math.LN10 + 24) / 34; v = Math.pow(cl(v, 0, 1), 1.55);
      var edge = cl((TH - Math.abs(qq[2])) / 0.012, 0, 1) * cl((DEPTH - qq[1]) / 6, 0, 1);
      var c = Math.round(255 * v * edge); d[o] = c; d[o + 1] = c; d[o + 2] = Math.min(255, Math.round(c * 1.02));
    }
    ctx.putImageData(out, 0, 0);
  }
  /* ---------- illustration ---------- */
  function path(ctx, g, poly) { ctx.beginPath(); poly.forEach(function (p, i) { var c = toCanvas(g, p[0], p[1]); if (i) ctx.lineTo(c[0], c[1]); else ctx.moveTo(c[0], c[1]); }); ctx.closePath(); }
  function bandPath(ctx, g, f0, f1, curved) { ctx.beginPath(); var x; for (x = -160; x <= 160; x += 2) { var c = curved ? arcPt(g, x, f0(x)) : toCanvas(g, x, f0(x)); if (x === -160) ctx.moveTo(c[0], c[1]); else ctx.lineTo(c[0], c[1]); } for (x = 160; x >= -160; x -= 2) { var c2 = curved ? arcPt(g, x, f1(x)) : toCanvas(g, x, f1(x)); ctx.lineTo(c2[0], c2[1]); } ctx.closePath(); }
  function arcPt(g, x, rd) { var th = x / 140, rr = R + rd; return [g.x0 + Math.sin(th) * rr * g.k, g.y0 + (Math.cos(th) * rr - R) * g.k]; }
  function sectorClip(ctx, g) { ctx.beginPath(); var n = 60, i; for (i = 0; i <= n; i++) { var th = -TH + 2 * TH * i / n, c = [g.x0 + Math.sin(th) * R * g.k, g.y0 + (Math.cos(th) * R - R) * g.k]; if (i) ctx.lineTo(c[0], c[1]); else ctx.moveTo(c[0], c[1]); } for (i = n; i >= 0; i--) { var t2 = -TH + 2 * TH * i / n, rr = R + DEPTH; ctx.lineTo(g.x0 + Math.sin(t2) * rr * g.k, g.y0 + (Math.cos(t2) * rr - R) * g.k); } ctx.closePath(); }
  function specks(ctx, g, poly, n, col, size, seed) { var r = rng(seed), bb = bbox(poly); ctx.fillStyle = col; for (var i = 0; i < n; i++) { var x = lerp(bb[0], bb[2], r()), y = lerp(bb[1], bb[3], r()); if (!inPoly(poly, x, y)) continue; var c = toCanvas(g, x, y); ctx.beginPath(); ctx.arc(c[0], c[1], size * (0.5 + r()), 0, 7); ctx.fill(); } }
  function bbox(p) { var a = [1e9, 1e9, -1e9, -1e9]; p.forEach(function (q) { a[0] = Math.min(a[0], q[0]); a[1] = Math.min(a[1], q[1]); a[2] = Math.max(a[2], q[0]); a[3] = Math.max(a[3], q[1]); }); return a; }
  function renderIllus(cv, st) {
    var W = cv.width, H = cv.height, g = fan(W, H), A = antrum(st), S = anatomy(), ctx = cv.getContext("2d"), r = rng(77);
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    ctx.save(); sectorClip(ctx, g); ctx.clip();
    // mesenteric / retroperitoneal fat as the ground
    var gr = ctx.createLinearGradient(0, g.y0, 0, H); gr.addColorStop(0, "#E9B83A"); gr.addColorStop(1, "#D9A12C"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < 300; i++) { var x = -110 + 220 * r(), y = 24 + 95 * r(), c = toCanvas(g, x, y); ctx.strokeStyle = "rgba(160,95,20,.35)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(c[0], c[1], (3 + 5 * r()) * g.k / 3, 0, 7); ctx.stroke(); }
    for (i = 0; i < 14; i++) { var x0 = -90 + 180 * r(), y0 = 30 + 100 * r(); ctx.strokeStyle = "rgba(150,40,30,.55)"; ctx.lineWidth = 1; ctx.beginPath(); var p0 = toCanvas(g, x0, y0); ctx.moveTo(p0[0], p0[1]); for (var s = 1; s < 6; s++) { var p1 = toCanvas(g, x0 + s * 2.5 * (r() - 0.3), y0 + s * 2.2 * (r() - 0.5)); ctx.lineTo(p1[0], p1[1]); } ctx.stroke(); }
    // skin and subcutaneous fat, rectus, preperitoneal line
    bandPath(ctx, g, function () { return -5; }, function () { return 1.2; }, 1); ctx.fillStyle = "#E7C3A6"; ctx.fill();
    bandPath(ctx, g, function () { return 1.2; }, function (x) { return 10 + 1.0 * Math.sin(x * 0.05); }, 1); ctx.fillStyle = "#F2CF62"; ctx.fill();
    bandPath(ctx, g, function (x) { return 10 + 1.0 * Math.sin(x * 0.05); }, function () { return 11.2; }, 1); ctx.fillStyle = "#F3EEE6"; ctx.fill();
    bandPath(ctx, g, function () { return 11.2; }, function (x) { return 19.5 + 0.6 * Math.sin(x * 0.07); }, 1);
    var mg = ctx.createLinearGradient(0, toCanvas(g, 0, 11)[1], 0, toCanvas(g, 0, 20)[1]); mg.addColorStop(0, "#8E1F1C"); mg.addColorStop(0.5, "#B8322B"); mg.addColorStop(1, "#7E1A18"); ctx.fillStyle = mg; ctx.fill();
    ctx.strokeStyle = "rgba(255,190,180,.35)"; ctx.lineWidth = 1; for (i = 0; i < 40; i++) { var xx = -95 + 190 * r(), yy = 13 + 7 * r(), a1 = arcPt(g, xx, yy), a2 = arcPt(g, xx + 9, yy + 0.3); ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.stroke(); }
    bandPath(ctx, g, function (x) { return 19.5 + 0.6 * Math.sin(x * 0.07); }, function () { return 22.5; }, 1); ctx.fillStyle = "#F4EFE8"; ctx.fill();
    // aorta in long axis
    bandPath(ctx, g, function (x) { return aortaY(x)[0] - 1.6; }, function (x) { return aortaY(x)[1] + 1.6; });
    var ag = ctx.createLinearGradient(0, toCanvas(g, 0, 86)[1], 0, toCanvas(g, 0, 105)[1]); ag.addColorStop(0, "#7A1612"); ag.addColorStop(0.35, "#C2352C"); ag.addColorStop(0.6, "#A8261F"); ag.addColorStop(1, "#5E0F0C"); ctx.fillStyle = ag; ctx.fill(); ctx.strokeStyle = "#4A0B09"; ctx.lineWidth = 1.5; ctx.stroke();
    // vertebral bodies and discs
    S.verts.forEach(function (v) {
      var yv = function (x) { return 109 + 0.03 * x + 0.0006 * x * x; }, poly = [[v + 5.5, yv(v + 5.5)], [v + 33, yv(v + 33)], [v + 33, yv(v + 33) + 24], [v + 5.5, yv(v + 5.5) + 24]]; path(ctx, g, poly); var bg = ctx.createLinearGradient(0, toCanvas(g, 0, yv(v + 19))[1], 0, toCanvas(g, 0, yv(v + 19) + 14)[1]); bg.addColorStop(0, "#F1EBDD"); bg.addColorStop(1, "#BDB29C"); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = "#8C8270"; ctx.lineWidth = 1.2; ctx.stroke();
      specks(ctx, g, poly, 90, "rgba(120,105,80,.45)", 1.1, v + 500);
      var dpol = [[v + 0.5, yv(v + 0.5) + 1], [v + 5, yv(v + 5) + 1], [v + 5, yv(v + 5) + 24], [v + 0.5, yv(v + 0.5) + 24]]; path(ctx, g, dpol); ctx.fillStyle = "#6E9FD8"; ctx.fill();
    });
    // SMA and SMV
    path(ctx, g, S.sma); var sg = ctx.createLinearGradient(0, toCanvas(g, -50, 75)[1], 0, toCanvas(g, -50, 84)[1]); sg.addColorStop(0, "#7A1612"); sg.addColorStop(0.45, "#C9392F"); sg.addColorStop(1, "#5E0F0C"); ctx.fillStyle = sg; ctx.fill(); ctx.strokeStyle = "#4A0B09"; ctx.stroke();
    path(ctx, g, S.smv); ctx.fillStyle = "#2D4FA8"; ctx.fill(); ctx.strokeStyle = "#16295E"; ctx.stroke();
    // pancreas
    path(ctx, g, S.pancreas); ctx.fillStyle = "#EADFB8"; ctx.fill(); ctx.strokeStyle = "#A89566"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.save(); path(ctx, g, S.pancreas); ctx.clip(); var rb = rng(31), bbp = bbox(S.pancreas); for (i = 0; i < 70; i++) { var px = lerp(bbp[0], bbp[2], rb()), py = lerp(bbp[1], bbp[3], rb()), pc = toCanvas(g, px, py); ctx.beginPath(); ctx.arc(pc[0], pc[1], 2.2 * g.k * (0.6 + rb() * 0.6), 0, 7); ctx.fillStyle = rb() > 0.5 ? "#F6EFD2" : "#D8C994"; ctx.fill(); ctx.strokeStyle = "rgba(140,120,70,.5)"; ctx.lineWidth = 0.6; ctx.stroke(); } ctx.restore();
    // bowel
    S.bowel.forEach(function (b) { path(ctx, g, b); ctx.fillStyle = "#7B4A2E"; ctx.fill(); ctx.strokeStyle = "#4A2A18"; ctx.lineWidth = 1.2; ctx.stroke(); var bb = bbox(b), c = toCanvas(g, (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2); ctx.beginPath(); ctx.ellipse(c[0], c[1], (bb[2] - bb[0]) * g.k * 0.22, (bb[3] - bb[1]) * g.k * 0.22, 0, 0, 7); ctx.fillStyle = "#3A2314"; ctx.fill(); });
    // liver
    path(ctx, g, S.liver); var lg = ctx.createLinearGradient(toCanvas(g, -60, 20)[0], 0, toCanvas(g, 0, 40)[0], 0); lg.addColorStop(0, "#7A3F2C"); lg.addColorStop(1, "#9A5A42"); ctx.fillStyle = lg; ctx.fill(); ctx.strokeStyle = "#4E2416"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.save(); path(ctx, g, S.liver); ctx.clip(); specks(ctx, g, S.liver, 160, "rgba(60,25,15,.25)", 1.2, 41); ctx.restore();
    // stomach: serosa, muscularis, submucosa, mucosa
    var LAY = [[0, "#F4E9E1"], [0.14, "#B5574A"], [0.55, "#F2DCC8"], [0.75, "#D98E86"], [0.93, "#FFF4EE"]];   // serosa, muscularis propria, submucosa, mucosa, mucosal surface
    LAY.forEach(function (l, i) { var p = i ? blob(A.cx, A.cy, A.rx - A.wall * l[0], A.ry - A.wall * l[0], A.rot, 0.07 + 0.02 * l[0], 11) : A.out; path(ctx, g, p); ctx.fillStyle = l[1]; ctx.fill(); if (!i) { ctx.strokeStyle = "#7E4636"; ctx.lineWidth = 1.4; ctx.stroke(); } });
    path(ctx, g, A.inn);
    var bb2 = bbox(A.inn), cc = toCanvas(g, A.cx, A.cy);
    if (st === "empty") { ctx.fillStyle = "#B8786A"; ctx.fill(); ctx.strokeStyle = "#8A4E40"; ctx.lineWidth = 1; for (i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(cc[0] - A.rx * g.k * 0.45, cc[1] + i * 2); ctx.quadraticCurveTo(cc[0], cc[1] + i * 3 + 3, cc[0] + A.rx * g.k * 0.45, cc[1] + i * 2); ctx.stroke(); } }
    else if (st === "fluid" || st === "fluidbig") { var fg = ctx.createRadialGradient(cc[0], cc[1] - 10, 4, cc[0], cc[1], A.rx * g.k); fg.addColorStop(0, "#4F8FE0"); fg.addColorStop(1, "#1F4FA8"); ctx.fillStyle = fg; ctx.fill(); ctx.save(); path(ctx, g, A.inn); ctx.clip(); specks(ctx, g, A.inn, 60, "rgba(235,245,255,.85)", 1.3, 51); ctx.restore(); }
    else if (st === "milk") { ctx.fillStyle = "#F3F1EA"; ctx.fill(); ctx.save(); path(ctx, g, A.inn); ctx.clip(); specks(ctx, g, A.inn, 120, "rgba(210,205,190,.6)", 1.6, 52); ctx.restore(); }
    else { ctx.fillStyle = st === "solid" ? "#9C6A3C" : "#8E6A48"; ctx.fill(); ctx.save(); path(ctx, g, A.inn); ctx.clip(); var rf = rng(53); for (i = 0; i < 70; i++) { var fx = lerp(bb2[0], bb2[2], rf()), fy = lerp(bb2[1], bb2[3], rf()), fc = toCanvas(g, fx, fy); ctx.beginPath(); ctx.ellipse(fc[0], fc[1], (2 + 3 * rf()) * g.k, (1.2 + 2 * rf()) * g.k, rf() * 3, 0, 7); ctx.fillStyle = ["#C49A62", "#6E4A2A", "#B58450", "#D7B98A"][i % 4]; ctx.fill(); } if (st === "solid") { for (i = 0; i < 40; i++) { var ax = lerp(bb2[0], bb2[2], rf()), ay = bb2[1] + 4 * rf(), ac = toCanvas(g, ax, ay); ctx.beginPath(); ctx.arc(ac[0], ac[1], 2.2, 0, 7); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fill(); } } ctx.restore(); }
    ctx.restore();
    // vignette below the fan
    ctx.save(); sectorClip(ctx, g); ctx.clip(); var vg = ctx.createLinearGradient(0, toCanvas(g, 0, 112)[1], 0, toCanvas(g, 0, 140)[1]); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.65)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  /* ---------- labels ---------- */
  var CONTENT = { empty: "Empty antrum", fluid: "Clear fluid with bubbles", fluidbig: "Clear fluid", milk: "Thick fluid (milk)", solid: "Solid: frosted glass", solidlate: "Solid, mixed content" };
  function labels(st) {
    var A = antrum(st), L = [
      ["Rectus abdominis", 62, 15.5, 62, 15.5, 1], ["Liver", -48, 40, -48, 40, 0], ["Stomach (antrum)", A.cx + A.rx * 0.45, A.cy - A.ry * 0.85, A.cx + A.rx * 0.45 + 14, A.cy - A.ry - 9, 0],
      [CONTENT[st], A.cx, A.cy + (st === "solid" ? -A.ry * 0.55 : 0), A.cx + (st === "empty" ? 34 : 0), A.cy + (st === "solid" ? -A.ry * 0.55 : st === "empty" ? 14 : 0), 0], ["Pancreas", -14, 66, -14, 66, 0],
      ["Superior mesenteric artery", -64, 77, -70, 64, 0], ["Aorta", 10, 96, 10, 96, 0], ["Vertebral body", 40, 118, 40, 118, 0], ["Bowel", 64, 46, 84, 54, 0]];
    return L;
  }
  function T(s) { return window.NORA_T ? window.NORA_T(s) : s; }
  function wallInset(ctx, g, st) {
    var W = ctx.canvas.width, H = ctx.canvas.height, A = antrum(st), bw = W * 0.25, bh = H * 0.36, bx = W * 0.012, by = H * 0.085, fs = Math.max(10, Math.round(W / 78));
    ctx.save(); ctx.fillStyle = "rgba(8,18,44,.92)"; ctx.strokeStyle = "rgba(255,210,63,.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 10) : ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
    ctx.font = "800 " + fs + "px 'Plus Jakarta Sans',system-ui,sans-serif"; ctx.fillStyle = "#FFD23F"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(T("Antral wall: five ultrasound layers"), bx + 10, by + fs * 1.1);
    var L = [["5 Serosa", "#F4E9E1", "bright", 0.14], ["4 Muscularis propria", "#B5574A", "dark", 0.32], ["3 Submucosa", "#F2DCC8", "bright", 0.16], ["2 Mucosa", "#D98E86", "dark", 0.22], ["1 Mucosal interface", "#FFF4EE", "bright", 0.16]];
    var x0 = bx + 10, x1 = bx + bw * 0.34, y = by + fs * 2.2, hh = bh - fs * 4.4, gy = [];
    L.forEach(function (l, i) { var h = hh * l[3]; ctx.fillStyle = l[1]; ctx.fillRect(x0, y, x1 - x0, h); var c = l[2] === "bright" ? 225 : 55; ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")"; ctx.fillRect(x1 + 4, y, bw * 0.08, h);
      ctx.font = "600 " + (fs * 0.92) + "px 'Plus Jakarta Sans',system-ui,sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText(T(l[0]), x1 + bw * 0.08 + 10, y + h / 2); y += h; });
    ctx.font = "500 " + (fs * 0.82) + "px 'Plus Jakarta Sans',system-ui,sans-serif"; ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.fillText(T("Curved probe in adults: usually three bands."), bx + 10, by + bh - fs * 1.75); ctx.fillText(T("Trace the area at the outer serosa."), bx + 10, by + bh - fs * 0.7);
    ctx.restore();
  }
  function serosaTrace(ctx, g, st) {
    var A = antrum(st), fs = Math.max(10, Math.round(ctx.canvas.width / 70)); ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = "#FFD23F"; ctx.lineWidth = 2; path(ctx, g, blob(A.cx, A.cy, A.rx + 0.6, A.ry + 0.6, A.rot, 0.07, 11)); ctx.stroke(); ctx.setLineDash([]);
    var p = toCanvas(g, A.cx + A.rx * 0.75, A.cy + A.ry * 0.85), q = toCanvas(g, A.cx + A.rx * 0.95 + 8, A.cy + A.ry + 12);
    ctx.strokeStyle = "#FFD23F"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    ctx.font = "700 " + fs + "px 'Plus Jakarta Sans',system-ui,sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.lineWidth = 3.5; ctx.strokeStyle = "rgba(0,0,0,.8)"; var t = T("CSA: serosa to serosa"); ctx.strokeText(t, q[0] + 4, q[1]); ctx.fillStyle = "#FFD23F"; ctx.fillText(t, q[0] + 4, q[1]); ctx.restore();
  }
  function drawLabels(ctx, g, st) {
    var W = ctx.canvas.width, fs = Math.max(11, Math.round(W / 62)); ctx.font = "700 " + fs + "px 'Plus Jakarta Sans',system-ui,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    labels(st).forEach(function (l) {
      var a = toCanvas(g, l[1], l[2]), b = toCanvas(g, l[3], l[4]), t = T(l[0]);
      if (a[0] !== b[0] || a[1] !== b[1]) { ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      ctx.lineWidth = 3.5; ctx.strokeStyle = "rgba(0,0,0,.75)"; ctx.strokeText(t, b[0], b[1]); ctx.fillStyle = "#fff"; ctx.fillText(t, b[0], b[1]);
    });
  }
  /* ---------- component ---------- */
  function mount(el, o) {
    o = o || {}; el.classList.add("gv");
    el.innerHTML = '<div class="gv-stage"><canvas class="gv-us"></canvas><canvas class="gv-il"></canvas><canvas class="gv-lb"></canvas><div class="gv-bar" role="slider" aria-label="' + T("Ultrasound or illustration") + '" tabindex="0"><span></span></div>' +
      '<span class="gv-tag gv-tl">' + T("Ultrasound") + '</span><span class="gv-tag gv-tr">' + T("Illustration") + '</span><span class="gv-dot"></span><span class="gv-ori gv-o1">' + T("Cephalad") + '</span><span class="gv-ori gv-o2">' + T("Caudad") + '</span></div>';
    var st = o.state || "fluid", us = el.querySelector(".gv-us"), il = el.querySelector(".gv-il"), lb = el.querySelector(".gv-lb"), bar = el.querySelector(".gv-bar"), stage = el.querySelector(".gv-stage"), split = o.split == null ? 0.5 : o.split, showLab = o.labels !== false, showMeas = o.measure !== false, showWall = o.wall !== false;
    function size() { var w = stage.clientWidth, h = Math.round(w * 0.62), dpr = Math.min(window.devicePixelRatio || 1, 2); [il, lb].forEach(function (c) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.height = h + "px"; }); us.width = 720; us.height = Math.round(720 * 0.62); us.style.height = h + "px"; stage.style.height = h + "px"; }
    function draw() { renderUS(us, st, o.gain); renderIllus(il, st); clip(); lab(); }
    function lab() { var c = lb.getContext("2d"), gg = fan(lb.width, lb.height); c.clearRect(0, 0, lb.width, lb.height); if (showLab) drawLabels(c, gg, st); if (showMeas && st !== "empty") serosaTrace(c, gg, st); if (showWall && stage.clientWidth >= 600) wallInset(c, gg, st); }
    function clip() { il.style.clipPath = "inset(0 0 0 " + (split * 100) + "%)"; bar.style.left = (split * 100) + "%"; bar.setAttribute("aria-valuenow", Math.round(split * 100)); }
    function setFrom(e) { var r = stage.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; split = cl(x / r.width, 0, 1); clip(); }
    var drag = false; stage.addEventListener("pointerdown", function (e) { drag = true; setFrom(e); stage.setPointerCapture(e.pointerId); }); stage.addEventListener("pointermove", function (e) { if (drag) setFrom(e); }); stage.addEventListener("pointerup", function () { drag = false; });
    bar.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") { split = cl(split - 0.05, 0, 1); clip(); } if (e.key === "ArrowRight") { split = cl(split + 0.05, 0, 1); clip(); } });
    size(); draw(); var to; window.addEventListener("resize", function () { clearTimeout(to); to = setTimeout(function () { size(); draw(); }, 200); });
    return { set: function (s) { st = s; draw(); }, labels: function (v) { showLab = v; lab(); }, measure: function (v) { showMeas = v; lab(); }, wall: function (v) { showWall = v; lab(); }, split: function (v) { split = v; clip(); }, state: function () { return st; } };
  }
  window.GVIEW = { mount: mount, CONTENT: CONTENT };
})();

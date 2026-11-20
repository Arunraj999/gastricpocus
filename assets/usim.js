/* NORA² simulated B-mode image. Schematic teaching picture, not a real scan.
   USIM.draw(ctx, x, y, w, h, {depth, gain, tgc, freq, tilt, focus, doppler, needle, phase}) */
(function () {
  function rng(s) { return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
  var noise, streaks = [], septa = [], cells = [];
  function init() {
    var r = rng(7), i;
    noise = document.createElement("canvas"); noise.width = noise.height = 240;
    var n = noise.getContext("2d"), im = n.createImageData(240, 240);
    for (i = 0; i < im.data.length; i += 4) { var v = 95 + Math.floor(r() * 160); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    n.putImageData(im, 0, 0);
    for (i = 0; i < 150; i++) streaks.push([r() * 4, r(), 0.15 + r() * 0.5, r()]);
    for (i = 0; i < 7; i++) septa.push([r() * 4, 0.25 + r() * 0.55, 0.5 + r() * 0.9, (r() - 0.5) * 0.25]);
    for (i = 0; i < 19; i++) { var a = r() * 6.283, d = Math.sqrt(r()); cells.push([Math.cos(a) * d * 0.36, Math.sin(a) * d * 0.25, 0.05 + r() * 0.035]); }
  }
  var off;
  function draw(ctx, X, Y, W, H, o) {
    if (!noise) init();
    o = o || {};
    var D = o.depth || 4, gain = o.gain == null ? 0.5 : o.gain, tgc = o.tgc == null ? 1 : o.tgc, f = o.freq == null ? 0.75 : o.freq,
      tilt = o.tilt || 0, ph = o.phase || 0, an = Math.exp(-Math.pow(tilt / 7, 2)), s = H / D, ox = (W - 4 * s) / 2, i;
    if (!off) off = document.createElement("canvas");
    if (off.width !== Math.round(W) || off.height !== Math.round(H)) { off.width = Math.round(W); off.height = Math.round(H); }
    var c = off.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = "source-over"; c.filter = "none";
    c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    c.save(); c.beginPath(); c.rect(Math.max(0, ox), 0, Math.min(W, 4 * s), H); c.clip(); c.translate(ox, 0); c.scale(s, s);
    var g = function (v, a) { return "rgba(" + v + "," + v + "," + v + "," + (a == null ? 1 : a) + ")"; };
    c.fillStyle = g(52); c.fillRect(0, 0, 4, 7);                               /* background tissue */
    c.fillStyle = g(215); c.fillRect(0, 0, 4, 0.1);                            /* skin */
    c.fillStyle = g(38); c.fillRect(0, 0.1, 4, 0.8);                           /* subcutaneous fat */
    c.lineCap = "round";
    septa.forEach(function (q) { c.strokeStyle = g(150, 0.7); c.lineWidth = 0.025; c.beginPath(); c.moveTo(q[0] - q[2] / 2, q[1] - q[3]); c.quadraticCurveTo(q[0], q[1] + q[3], q[0] + q[2] / 2, q[1] - q[3] / 2); c.stroke(); });
    c.fillStyle = g(70); c.fillRect(0, 0.95, 4, 0.95); c.fillStyle = g(62); c.fillRect(0, 1.95, 4, 1.6);   /* muscles */
    streaks.forEach(function (q) { var y = q[1] < 0.37 ? 0.98 + q[1] / 0.37 * 0.88 : 1.98 + (q[1] - 0.37) / 0.63 * 1.5; c.strokeStyle = g(165, 0.22 + q[3] * 0.3); c.lineWidth = 0.014; c.beginPath(); c.moveTo(q[0], y); c.lineTo(q[0] + q[2], y + 0.03); c.stroke(); });
    [[0.92, 0.05], [1.92, 0.045], [3.55, 0.04]].forEach(function (q) { c.strokeStyle = g(Math.round(120 + 115 * an)); c.lineWidth = q[1]; c.beginPath(); c.moveTo(-0.1, q[0]); c.bezierCurveTo(1.2, q[0] + 0.06, 2.8, q[0] - 0.05, 4.1, q[0] + 0.02); c.stroke(); });
    /* bone with acoustic shadow */
    c.fillStyle = "#000"; c.beginPath(); c.moveTo(0.7, 4.35); c.quadraticCurveTo(2, 3.8, 3.3, 4.35); c.lineTo(3.3, 7); c.lineTo(0.7, 7); c.closePath(); c.fill();
    c.strokeStyle = g(250); c.lineWidth = 0.07; c.beginPath(); c.moveTo(0.7, 4.35); c.quadraticCurveTo(2, 3.8, 3.3, 4.35); c.stroke();
    /* artery: anechoic, pulsing, with enhancement behind */
    var vr = 0.3 + 0.025 * Math.sin(ph * 6.283), vx = 1.25, vy = 2.5;
    var eg = c.createLinearGradient(0, vy + vr, 0, vy + vr + 0.7); eg.addColorStop(0, g(190, 0.4)); eg.addColorStop(1, g(190, 0));
    c.fillStyle = eg; c.fillRect(vx - vr * 0.8, vy + vr, vr * 1.6, 0.7);
    c.fillStyle = "#020202"; c.beginPath(); c.arc(vx, vy, vr, 0, 6.283); c.fill(); c.strokeStyle = g(185, 0.8); c.lineWidth = 0.03; c.stroke();
    if (o.doppler) { var dg = c.createRadialGradient(vx, vy, 0.02, vx, vy, vr); var k = 0.55 + 0.45 * Math.sin(ph * 6.283); dg.addColorStop(0, "rgba(255," + Math.round(190 * k) + ",60," + (0.55 + 0.45 * k) + ")"); dg.addColorStop(1, "rgba(215,30,30," + (0.5 + 0.45 * k) + ")"); c.fillStyle = dg; c.beginPath(); c.arc(vx, vy, vr * 0.92, 0, 6.283); c.fill(); }
    /* nerve: hyperechoic rim, honeycomb of dark fascicles; fades with tilt (anisotropy) */
    var nx = 2.55, ny = 2.45, nb = Math.round(70 + 165 * an);
    c.fillStyle = g(nb); c.beginPath(); c.ellipse(nx, ny, 0.46, 0.33, -0.12, 0, 6.283); c.fill();
    cells.forEach(function (q) { c.fillStyle = g(Math.round(30 + 25 * (1 - an))); c.beginPath(); c.arc(nx + q[0], ny + q[1], q[2], 0, 6.283); c.fill(); });
    /* needle */
    if (o.needle) { var nd = o.needle, a = nd.angle * Math.PI / 180, L = nd.len || 3, tx = nd.x, ty = nd.d, bx = tx + Math.cos(a) * L, by = ty - Math.sin(a) * L, vis = Math.max(0.12, 1 - nd.angle / 62);
      for (i = 3; i >= 0; i--) { c.strokeStyle = g(255, i ? vis * 0.28 / i : vis); c.lineWidth = i ? 0.03 : 0.05; c.beginPath(); c.moveTo(tx + (i ? 0.2 : 0), ty + i * 0.16); c.lineTo(bx, by + i * 0.16); c.stroke(); if (nd.angle > 32) break; }
      if (nd.tip) { c.fillStyle = g(255, Math.min(1, vis + 0.25)); c.beginPath(); c.arc(tx, ty, 0.05, 0, 6.283); c.fill(); } }
    c.restore();
    /* speckle */
    c.globalCompositeOperation = "multiply"; c.fillStyle = c.createPattern(noise, "repeat"); c.save(); c.scale(1.6, 1.6); c.fillRect(0, 0, W, H); c.restore();
    c.globalCompositeOperation = "source-over";
    /* attenuation with depth, offset by time-gain compensation */
    var att = (0.25 + 0.6 * f) * (1 - tgc); if (att > 0.01) { var ag = c.createLinearGradient(0, 0, 0, H); ag.addColorStop(0.1, "rgba(0,0,0,0)"); ag.addColorStop(1, "rgba(0,0,0," + Math.min(0.97, att * 1.25) + ")"); c.fillStyle = ag; c.fillRect(0, 0, W, H); }
    if (f > 0.5) { var hg = c.createLinearGradient(0, 0, 0, H); var st = Math.min(0.95, 3.4 / D); hg.addColorStop(Math.max(0, st - 0.25), "rgba(0,0,0,0)"); hg.addColorStop(Math.min(1, st + 0.2), "rgba(0,0,0," + (f - 0.5) * 1.5 + ")"); c.fillStyle = hg; c.fillRect(0, 0, W, H); }
    if (gain < 0.5) { c.fillStyle = "rgba(0,0,0," + (0.5 - gain) * 1.75 + ")"; c.fillRect(0, 0, W, H); }
    else if (gain > 0.5) { c.globalCompositeOperation = "screen"; c.fillStyle = "rgba(255,255,255," + (gain - 0.5) * 1.5 + ")"; c.fillRect(0, 0, W, H); c.globalCompositeOperation = "source-over"; }
    var blur = (1 - f) * 3.2 + (o.focus != null ? Math.min(2.2, Math.abs(o.focus - 2.45) * 1.1) : 0);
    ctx.save(); ctx.beginPath(); ctx.rect(X, Y, W, H); ctx.clip();
    ctx.filter = blur > 0.25 ? "blur(" + (blur * W / 900).toFixed(2) + "px)" : "none"; ctx.drawImage(off, X, Y, W, H); ctx.filter = "none";
    if (o.doppler) { ctx.strokeStyle = "#FFD05A"; ctx.lineWidth = Math.max(2, W / 400); ctx.strokeRect(X + ox + 0.55 * s, Y + 1.85 * s, 1.5 * s, 1.35 * s); }
    if (o.focus != null) { ctx.fillStyle = "#FFD05A"; var fy = Y + o.focus * s, u = W / 60; ctx.beginPath(); ctx.moveTo(X + W - u * 0.4, fy); ctx.lineTo(X + W - u * 1.6, fy - u * 0.7); ctx.lineTo(X + W - u * 1.6, fy + u * 0.7); ctx.closePath(); ctx.fill(); }
    if (o.scale !== false) { ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = "500 " + Math.max(11, W / 52) + "px 'DM Mono',ui-monospace,monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; for (i = 1; i < D; i++) { ctx.fillRect(X, Y + i * s - 1, W / 70, 2); ctx.fillText(i + " cm", X + W / 50, Y + i * s); } }
    ctx.restore();
  }
  window.USIM = { draw: draw };
})();

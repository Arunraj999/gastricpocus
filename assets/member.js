/* NORA² members and CPD.
   Everything on the site stays open to everyone. Members (free) get their learning time recorded while they are signed in,
   tests with a certificate, and certificates for the time recorded.
   The member service is Supabase (settings in member-config.js). Until it is connected nothing here shows on the live site;
   on a local preview the same pages run in "preview mode", where everything is kept in this browser only. */
(function () {
  "use strict";
  var CFG = window.NORA_MEMBER || {}, LIVE = !!(CFG.url && CFG.key), PREVIEW = !LIVE && !!CFG.preview;
  if (!LIVE && !PREVIEW) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase(), mode = document.body.getAttribute("data-member") || "";
  var load = function (src) { return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = function () { no(new Error("Could not load " + src)); }; document.head.appendChild(s); }); };
  var iso = function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
  var nice = function (s) { var d = new Date(s + (String(s).length === 10 ? "T12:00:00" : "")); return d.getDate() + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " " + d.getFullYear(); };
  var hm = function (min) { min = Math.round(min); var h = Math.floor(min / 60), m = min % 60; return h ? h + " h " + (m ? m + " min" : "") : m + " min"; };
  var lang = (function () { try { return JSON.parse(localStorage.getItem("nora2.lang")) || "en"; } catch (e) { return "en"; } })();

  /* ------------------------------------------------------------------ the member service */
  var B, session = null;
  if (LIVE) {
    var sb, ready = load("assets/vendor/supabase.js").then(function () {
      sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
      sb.auth.onAuthStateChange(function (ev, s) { session = s; if (ev === "PASSWORD_RECOVERY" && mode === "account") showPanel("newpw"); });
      return sb.auth.getSession().then(function (r) { session = r.data.session; });
    });
    var must = function (r) { if (r.error) throw new Error(r.error.message || "Something went wrong"); return r.data; };
    B = {
      init: function () { return ready; },
      user: function () { return session ? { id: session.user.id, email: session.user.email } : null; },
      profile: function () { return sb.from("profiles").select("full_name,role,hospital,country,created_at").eq("id", session.user.id).single().then(must); },
      saveProfile: function (p) { return sb.from("profiles").update({ full_name: p.full_name, role: p.role, hospital: p.hospital, country: p.country, updated_at: new Date().toISOString() }).eq("id", session.user.id).then(must); },
      signUp: function (f) { return sb.auth.signUp({ email: f.email, password: f.password, options: { emailRedirectTo: location.origin + location.pathname.replace(/[^/]*$/, "") + "account.html", data: { full_name: f.full_name, role: f.role, hospital: f.hospital, country: f.country, hcp: true, consent: true, lang: lang } } }).then(must).then(function (d) { session = d.session; return { confirm: !d.session }; }); },
      signIn: function (e, p) { return sb.auth.signInWithPassword({ email: e, password: p }).then(must).then(function (d) { session = d.session; }); },
      signOut: function () { return sb.auth.signOut().then(function () { session = null; }); },
      reset: function (e) { return sb.auth.resetPasswordForEmail(e, { redirectTo: location.origin + location.pathname.replace(/[^/]*$/, "") + "account.html" }).then(must); },
      setPassword: function (p) { return sb.auth.updateUser({ password: p }).then(must); },
      addTime: function (page, kind, title, s) { return sb.rpc("add_time", { p_page: page, p_kind: kind, p_title: title, p_seconds: s }).then(must); },
      addTimeNow: function (page, kind, title, s) { try { fetch(CFG.url + "/rest/v1/rpc/add_time", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json", apikey: CFG.key, Authorization: "Bearer " + session.access_token }, body: JSON.stringify({ p_page: page, p_kind: kind, p_title: title, p_seconds: s }) }); } catch (e) {} },
      time: function (a, b) { return sb.from("cpd_time").select("day,page,kind,title,seconds").gte("day", a).lte("day", b).then(must); },
      test: function (id) { return sb.from("tests").select("id,title,pass_percent,meta,questions").eq("id", id).single().then(must); },
      submit: function (id, ans) { return sb.rpc("submit_test", { p_test: id, p_answers: ans }).then(must); },
      certs: function () { return sb.from("certificates").select("*").order("issued_at", { ascending: false }).then(must); },
      issue: function (a, b) { return sb.rpc("issue_time_certificate", { p_from: a, p_to: b }).then(must); },
      verify: function (c) { return sb.rpc("verify_certificate", { p_code: c }).then(must); },
      remove: function () { return sb.rpc("delete_my_account").then(must).then(function () { return sb.auth.signOut(); }).then(function () { session = null; }); },
      everything: function () { return Promise.all([B.profile(), B.time("2000-01-01", "2999-12-31"), sb.from("test_attempts").select("test_id,score,total,passed,created_at").then(must), B.certs()]).then(function (r) { return { email: session.user.email, profile: r[0], learning_time: r[1], test_attempts: r[2], certificates: r[3] }; }); }
    };
  } else {
    /* preview mode: the same behaviour, kept in this browser only */
    var db = (function () { try { return JSON.parse(localStorage.getItem("nora2.preview-members")) || {}; } catch (e) { return {}; } })();
    db.users = db.users || {}; var save = function () { localStorage.setItem("nora2.preview-members", JSON.stringify(db)); }, me = function () { return db.users[db.current]; };
    var code = function () { var h = "", c = "0123456789ABCDEF"; for (var i = 0; i < 12; i++) h += c[Math.floor(Math.random() * 16)]; return "NORA-" + h.slice(0, 4) + "-" + h.slice(4, 8) + "-" + h.slice(8); };
    var P = function (fn) { return new Promise(function (ok, no) { setTimeout(function () { try { ok(fn()); } catch (e) { no(e); } }, 120); }); };
    var tests = function () { return window.NORA_DEV_TESTS ? Promise.resolve() : load("dev/cpd-tests.js"); };
    B = {
      init: function () { return Promise.resolve(); },
      user: function () { return me() ? { id: db.current, email: db.current } : null; },
      profile: function () { return P(function () { return me().profile; }); },
      saveProfile: function (p) { return P(function () { Object.assign(me().profile, p); save(); }); },
      signUp: function (f) { return P(function () { if (db.users[f.email]) throw new Error("User already registered"); db.users[f.email] = { profile: { full_name: f.full_name, role: f.role, hospital: f.hospital, country: f.country, created_at: new Date().toISOString() }, time: [], attempts: [], certs: [] }; db.current = f.email; save(); return { confirm: false }; }); },
      signIn: function (e) { return P(function () { if (!db.users[e]) throw new Error("Invalid login credentials"); db.current = e; save(); }); },
      signOut: function () { return P(function () { db.current = null; save(); }); },
      reset: function () { return P(function () {}); }, setPassword: function () { return P(function () {}); },
      addTime: function (page, kind, title, s) { return P(function () { var u = me(), day = iso(new Date()), r = u.time.filter(function (x) { return x.day === day && x.page === page; })[0]; if (!r) u.time.push(r = { day: day, page: page, kind: kind, title: title, seconds: 0 }); r.seconds += s; r.title = title; save(); return s; }); },
      addTimeNow: function (page, kind, title, s) { var u = me(), day = iso(new Date()), r = u.time.filter(function (x) { return x.day === day && x.page === page; })[0]; if (!r) u.time.push(r = { day: day, page: page, kind: kind, title: title, seconds: 0 }); r.seconds += s; save(); },
      time: function (a, b) { return P(function () { return me().time.filter(function (x) { return x.day >= a && x.day <= b; }); }); },
      test: function (id) { return tests().then(function () { var t = window.NORA_DEV_TESTS[id]; if (!t) throw new Error("unknown test"); return { id: t.id, title: t.title, pass_percent: t.pass_percent, meta: t.meta, questions: t.items.map(function (i) { return { q: i.q, o: i.o }; }) }; }); },
      submit: function (id, ans) { return tests().then(function () { var t = window.NORA_DEV_TESTS[id], u = me(), sc = 0, rev = t.items.map(function (i, k) { var ok = ans[k] === i.a; if (ok) sc++; return { chosen: ans[k], correct: i.a, ok: ok, w: i.w, r: i.r }; }), pass = sc * 100 >= t.pass_percent * t.items.length, c = null;
        u.attempts.push({ test_id: id, score: sc, total: t.items.length, passed: pass, created_at: new Date().toISOString() });
        if (pass) { var old = u.certs.filter(function (x) { return x.test_id === id; })[0]; if (old) c = old.code; else { var secs = u.time.filter(function (x) { return x.page === "cpd-test:" + id; }).reduce(function (a, x) { return a + x.seconds; }, 0); c = code(); u.certs.unshift({ code: c, kind: "test", title: t.title, name_on_cert: u.profile.full_name, minutes: t.minutes || Math.max(1, Math.round(secs / 60)), test_id: id, score: sc, total: t.items.length, detail: [], issued_at: new Date().toISOString() }); } }
        save(); return { score: sc, total: t.items.length, passed: pass, pass_percent: t.pass_percent, review: rev, refs: t.refs, certificate: c }; }); },
      certs: function () { return P(function () { return me().certs; }); },
      issue: function (a, b) { return P(function () { var u = me(), rows = u.time.filter(function (x) { return x.day >= a && x.day <= b; }), secs = rows.reduce(function (s, x) { return s + x.seconds; }, 0); if (secs < 900) throw new Error("less than 15 minutes recorded in this period");
        var by = {}; rows.forEach(function (x) { by[x.page] = by[x.page] || { title: x.title, kind: x.kind, s: 0 }; by[x.page].s += x.seconds; });
        var d = Object.keys(by).map(function (k) { return { title: by[k].title, kind: by[k].kind, minutes: Math.round(by[k].s / 60) }; }).filter(function (x) { return x.minutes > 0; }).sort(function (x, y) { return y.minutes - x.minutes; }).slice(0, 12), c = code();
        u.certs.unshift({ code: c, kind: "time", title: "Learning on the NORA² website", name_on_cert: u.profile.full_name, minutes: Math.round(secs / 60), period_from: a, period_to: b, detail: d, issued_at: new Date().toISOString() }); save(); return c; }); },
      verify: function (c) { return P(function () { var hit = null; Object.keys(db.users).forEach(function (e) { db.users[e].certs.forEach(function (x) { if (x.code === String(c).trim().toUpperCase()) hit = x; }); }); return hit ? { valid: true, code: hit.code, name: hit.name_on_cert, title: hit.title, kind: hit.kind, minutes: hit.minutes, from: hit.period_from, to: hit.period_to, score: hit.score, total: hit.total, issued: hit.issued_at.slice(0, 10) } : { valid: false }; }); },
      remove: function () { return P(function () { delete db.users[db.current]; db.current = null; save(); }); },
      everything: function () { return P(function () { var u = me(); return { email: db.current, profile: u.profile, learning_time: u.time, test_attempts: u.attempts, certificates: u.certs }; }); }
    };
  }

  /* ------------------------------------------------------------------ what counts as learning time
     Time is counted for signed-in members only, while the page is on screen and in use: the member has scrolled, typed, clicked or moved
     within the last minute, or a film on the page is playing. It is reported to the member service twice a minute. */
  var KIND = function () {
    if (mode === "test") return ["test", "cpd-test:" + (new URLSearchParams(location.search).get("id") || "")];
    if (mode || /^(index|account|my-cpd|verify|privacy|meetings|about|blog|societies|resources)\.html$/.test(here)) return null;
    if (/video|videos\.html$/.test(here)) return ["video", here];
    if (/evidence|publications|references|research|summary|prospect|anticoagulation|medico-legal|complications/.test(here)) return ["reading", here];
    if (/calculator|dose|scanner|audit|anatomy-3d|plexus-anatomy|practice|quiz/.test(here)) return ["tool", here];
    return [document.body.getAttribute("data-page") === "blocks" || window.BLOCK ? "block" : "reading", here];
  };
  var today = 0, chip;
  function tracker() {
    var k = KIND(); if (!k || !B.user()) return;
    var title = ((document.querySelector("h1") || {}).textContent || document.title).replace(/\s+/g, " ").trim().slice(0, 150), last = Date.now(), active = 0, busy = false;
    ["pointerdown", "pointermove", "keydown", "scroll", "wheel", "touchstart"].forEach(function (ev) { window.addEventListener(ev, function () { last = Date.now(); }, { passive: true, capture: true }); });
    var playing = function () { return Array.prototype.some.call(document.querySelectorAll("video"), function (v) { return !v.paused && !v.ended && v.readyState > 2; }); };
    setInterval(function () { if (document.visibilityState === "visible" && (Date.now() - last < 60000 || playing())) active++; }, 1000);
    var send = function () { if (busy || active < 5 || !B.user()) return; var n = Math.min(active, 60); busy = true; B.addTime(k[1], k[0], title, n).then(function (got) { active -= n; today += (got || 0); paint(); }).catch(function () {}).then(function () { busy = false; }); };
    setInterval(send, 30000);
    window.addEventListener("pagehide", function () { if (active >= 5 && B.user()) { B.addTimeNow(k[1], k[0], title, Math.min(active, 60)); active = 0; } });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") send(); });
    window.NORA_CPD_FLUSH = send;
  }
  function paint() { if (chip) chip.innerHTML = '<span>My CPD</span>' + (today >= 60 ? " <b>" + hm(today / 60) + "</b>" : ""); }
  function headerButton() {
    var app = $("#open-app") || $("#open-search"); if (!app || $("#m-btn")) return;
    var a = document.createElement("a"); a.id = "m-btn"; a.className = "btn sm" + (B.user() ? " y" : "");
    if (B.user()) { a.href = "my-cpd.html"; chip = a; paint(); B.time(iso(new Date()), iso(new Date())).then(function (r) { today = r.reduce(function (s, x) { return s + x.seconds; }, 0); paint(); }).catch(function () {}); }
    else { a.href = "account.html"; a.textContent = "Sign in"; a.title = "Free membership: record your CPD time and get certificates"; }
    app.parentNode.insertBefore(a, app);
    if (!$("#m-style")) { var st = document.createElement("style"); st.id = "m-style"; st.textContent = "#m-btn{white-space:nowrap}#m-btn b{font-weight:800;margin-left:4px}.m-card{border:1px solid var(--hair);border-radius:22px;background:var(--card);padding:26px;box-shadow:var(--sh)}.m-grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.m-form{display:grid;gap:14px}.m-form label{display:grid;gap:6px;font-weight:700;font-size:.92rem}.m-form input[type=text],.m-form input[type=email],.m-form input[type=password],.m-form input[type=date],.m-form select{font:inherit;font-weight:600;padding:12px 14px;border:1.5px solid rgba(255,255,255,.22);border-radius:12px;background:rgba(255,255,255,.08);color:#fff;width:100%}.m-form select option{color:#0A1B3D}.m-check{display:flex!important;gap:10px;align-items:flex-start;font-weight:500!important}.m-check input{width:20px;height:20px;margin-top:2px;accent-color:var(--nerve);flex:none}.m-msg{padding:12px 14px;border-radius:12px;font-weight:600}.m-msg.bad{background:rgba(255,99,99,.16);border:1px solid rgba(255,120,120,.5)}.m-msg.good{background:rgba(17,184,168,.16);border:1px solid rgba(17,184,168,.55)}.m-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}.m-stat{font-size:2.3rem;font-weight:800;line-height:1.1}.m-table{width:100%;border-collapse:collapse}.m-table th,.m-table td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--hair)}.m-table td:last-child,.m-table th:last-child{text-align:right;white-space:nowrap}.m-bar{height:10px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden}.m-bar i{display:block;height:100%;background:var(--nerve)}.m-q{display:grid;gap:10px;padding:18px 0;border-bottom:1px solid var(--hair)}.m-q .opts{display:grid;gap:8px}.m-q label{display:flex;gap:10px;align-items:flex-start;padding:11px 14px;border:1.5px solid var(--hair);border-radius:12px;cursor:pointer;font-weight:600}.m-q label.sel{border-color:var(--nerve)}.m-q label.right{border-color:#11B8A8;background:rgba(17,184,168,.16)}.m-q label.wrong{border-color:#FF7B7B;background:rgba(255,99,99,.14)}.m-q input{margin-top:3px;accent-color:var(--nerve)}.m-why{font-size:.95rem;padding:10px 14px;border-left:3px solid var(--nerve);background:rgba(255,255,255,.05);border-radius:0 10px 10px 0}.m-lock{opacity:.45;pointer-events:none}.m-preview{background:#F6B92B;color:#0A1B3D;font-weight:700;text-align:center;padding:8px 12px}@media(max-width:860px){#m-btn span{display:none}#m-btn{padding-inline:10px}}"; document.head.appendChild(st); }
    if (PREVIEW && !$(".m-preview")) { var p = document.createElement("div"); p.className = "m-preview"; p.textContent = "Preview mode: member accounts are not connected yet. Anything you enter stays in this browser only."; document.body.insertBefore(p, document.body.firstChild); }
  }

  /* ------------------------------------------------------------------ certificates (made in the browser as a PDF) */
  function certificate(c) {
    return load("assets/vendor/jspdf.umd.min.js").catch(function () {}).then(function () { return new Promise(function (ok) { var im = new Image(); im.onload = function () { /* the logo is drawn on its own navy, and its edges are faded into exactly that colour, so that it sits in the header band without a visible edge */
          var cv = document.createElement("canvas"), w = cv.width = 760, h = cv.height = Math.round(760 * im.naturalHeight / im.naturalWidth), g = cv.getContext("2d"); g.drawImage(im, 0, 0, w, h);
          var p = g.getImageData(3, 3, 1, 1).data, on = "rgb(" + p[0] + "," + p[1] + "," + p[2] + ")", off = "rgba(" + p[0] + "," + p[1] + "," + p[2] + ",0)", fx = w * 0.035, fy = h * 0.06;
          [[0, 0, fx, 0, 0, 0, fx, h], [w, 0, w - fx, 0, w - fx, 0, fx, h], [0, 0, 0, fy, 0, 0, w, fy], [0, h, 0, h - fy, 0, h - fy, w, fy]].forEach(function (q) { var gr = g.createLinearGradient(q[0], q[1], q[2], q[3]); gr.addColorStop(0, on); gr.addColorStop(1, off); g.fillStyle = gr; g.fillRect(q[4], q[5], q[6], q[7]); });
          ok({ data: cv.toDataURL("image/png"), r: w / h, navy: [p[0], p[1], p[2]] }); }; im.onerror = function () { ok(null); }; im.src = "media/brand/nora2-logo.webp"; }); }).then(function (logo) {
      var doc = new window.jspdf.jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true }), W = 297, H = 210, mid = W / 2, y;
      var NAVY = (logo && logo.navy) || [2, 17, 51], INK = [10, 27, 61], BLUE = [27, 86, 224], TEAL = [17, 184, 168], GOLD = [246, 185, 43], DGOLD = [196, 140, 16];
      var fill = function (c3) { doc.setFillColor(c3[0], c3[1], c3[2]); }, draw = function (c3) { doc.setDrawColor(c3[0], c3[1], c3[2]); }, ink = function (c3) { doc.setTextColor(c3[0], c3[1], c3[2]); };
      var fade = function (o) { doc.setGState(new doc.GState({ opacity: o, "stroke-opacity": o })); };
      /* text in which NORA² appears: the superscript two is drawn by hand, because the PDF's built-in font does not print that character */
      var rich = function (text, x, yy, align, cs) { var parts = text.split("²"), fs = doc.getFontSize(), w = 0, ws = [], opt = cs ? { charSpace: cs } : {}, tw = function (t) { return doc.getTextWidth(t) + (cs ? cs * t.length : 0); };
        parts.forEach(function (p, i) { ws.push(tw(p)); w += ws[i]; if (i < parts.length - 1) { doc.setFontSize(fs * 0.6); w += tw("2") + 0.3; doc.setFontSize(fs); } });
        var cx = align === "center" ? x - w / 2 : (align === "right" ? x - w : x);
        parts.forEach(function (p, i) { doc.text(p, cx, yy, opt); cx += ws[i]; if (i < parts.length - 1) { doc.setFontSize(fs * 0.6); doc.text("2", cx + 0.15, yy - fs * 0.115, opt); cx += tw("2") + 0.3; doc.setFontSize(fs); } }); };

      /* the compass of the NORA² logo as a watermark behind the text */
      (function () { var cx = mid, cy = 126, R = 60, rad = Math.PI / 180, pt = function (a, r) { return [cx + Math.sin(a * rad) * r, cy - Math.cos(a * rad) * r]; }, kite = function (a, len, half, o1, o2) { var t = pt(a, len), l = pt(a - 90, half), r = pt(a + 90, half); fade(o1); doc.triangle(t[0], t[1], l[0], l[1], cx, cy, "F"); fade(o2); doc.triangle(t[0], t[1], r[0], r[1], cx, cy, "F"); };
        doc.saveGraphicsState(); fill(BLUE); draw(BLUE); fade(0.10); doc.setLineWidth(0.7); doc.circle(cx, cy, R, "S"); doc.setLineWidth(0.3); doc.circle(cx, cy, R - 4.5, "S"); doc.circle(cx, cy, R * 0.52, "S");
        for (var i = 0; i < 72; i++) { var p1 = pt(i * 5, R - 4.5), p2 = pt(i * 5, R - (i % 18 === 0 ? 12 : (i % 6 === 0 ? 9 : 6.5))); doc.setLineWidth(i % 6 === 0 ? 0.5 : 0.25); doc.line(p1[0], p1[1], p2[0], p2[1]); }
        for (var k = 0; k < 4; k++) kite(45 + k * 90, R * 0.56, R * 0.085, 0.05, 0.085);
        for (k = 0; k < 4; k++) kite(k * 90, R * 0.93, R * 0.115, 0.06, 0.11);
        fill(TEAL); fade(0.16); doc.circle(cx, cy, 2.6, "F"); doc.restoreGraphicsState(); })();

      /* the header: a navy band in the colour of the logo's own background, so the logo sits in it without an edge */
      fill(NAVY); doc.lines([[297, 0], [0, 43], [-90, 16, -190, -10, -297, 6]], 0, 0, [1, 1], "F", true);
      doc.saveGraphicsState(); draw([90, 140, 255]); fade(0.28); doc.setLineWidth(0.45); [16, 24, 32, 40].forEach(function (r) { doc.circle(24, -10, r, "S"); doc.circle(W - 24, -10, r, "S"); }); doc.restoreGraphicsState();
      draw(TEAL); doc.setLineWidth(1.1); doc.lines([[-90, 16, -190, -10, -297, 6]], 297, 44.9, [1, 1], "S", false); draw(GOLD); doc.setLineWidth(0.55); doc.lines([[-90, 16, -190, -10, -297, 6]], 297, 46.9, [1, 1], "S", false);
      if (logo) { var lh = 36, lw = lh * logo.r; doc.addImage(logo.data, "PNG", mid - lw / 2, 3, lw, lh); }
      else { ink([255, 255, 255]); doc.setFont("helvetica", "bold"); doc.setFontSize(30); rich("NORA²", mid, 24, "center"); }

      /* a fine gold frame and corner marks */
      draw(GOLD); doc.setLineWidth(0.45); doc.rect(7, 7, W - 14, H - 14); fill(GOLD); [[7, 7], [W - 7, 7], [7, H - 7], [W - 7, H - 7]].forEach(function (p) { doc.lines([[2.2, 2.2], [-2.2, 2.2], [-2.2, -2.2]], p[0], p[1] - 2.2, [1, 1], "F", true); });

      ink(TEAL); doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text("CONTINUING PROFESSIONAL DEVELOPMENT", mid, 62, { align: "center", charSpace: 1.3 });
      ink(INK); doc.setFontSize(27); doc.text("Certificate of learning", mid, 73.5, { align: "center" });
      doc.setFont("helvetica", "normal"); doc.setFontSize(12.5); ink([70, 84, 112]); doc.text("This is to certify that", mid, 84, { align: "center" });
      ink(BLUE); doc.setFont("helvetica", "bold"); doc.setFontSize(27); doc.text(c.name_on_cert, mid, 97, { align: "center" });
      draw(GOLD); doc.setLineWidth(0.6); doc.line(mid - 64, 101.5, mid - 4.5, 101.5); doc.line(mid + 4.5, 101.5, mid + 64, 101.5); fill(GOLD); doc.lines([[2.2, 2.2], [-2.2, 2.2], [-2.2, -2.2]], mid, 99.3, [1, 1], "F", true);
      ink(INK); doc.setFont("helvetica", "normal"); doc.setFontSize(12.5);
      var pill = function (text, yy) { doc.setFont("helvetica", "bold"); doc.setFontSize(17); var w = doc.getTextWidth(text) + 22; fill([226, 247, 244]); draw(TEAL); doc.setLineWidth(0.5); doc.roundedRect(mid - w / 2, yy - 8.2, w, 12, 6, 6, "FD"); ink(INK); doc.text(text, mid, yy, { align: "center" }); };
      if (c.kind === "test") {
        doc.text("watched the film and passed the test", mid, 111, { align: "center" });
        doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(doc.splitTextToSize(c.title, 230), mid, 121.5, { align: "center" });
        pill("Score " + c.score + " out of " + c.total + "   ·   Learning time " + hm(c.minutes), 138);
      } else {
        rich("recorded the following learning time on the NORA² website, regionalanesthesia.org", mid, 111, "center");
        pill(hm(c.minutes) + "   ·   " + (Math.round(c.minutes / 6) / 10).toFixed(1) + " hours", 123.5);
        doc.setFont("helvetica", "normal"); doc.setFontSize(11.5); ink([70, 84, 112]); doc.text("between " + nice(c.period_from) + " and " + nice(c.period_to), mid, 134, { align: "center" }); y = 141.5;
        var rows = (c.detail || []).slice(0, 6); doc.setFontSize(9.2); ink(INK);
        rows.forEach(function (r, i) { var x = i % 2 ? mid + 6 : 46, yy = y + Math.floor(i / 2) * 5.2; fill(i % 2 ? GOLD : TEAL); doc.circle(x - 2.4, yy - 1.1, 0.8, "F"); doc.text(doc.splitTextToSize(r.title, 80)[0], x, yy); doc.setFont("helvetica", "bold"); doc.text(hm(r.minutes), x + 98, yy, { align: "right" }); doc.setFont("helvetica", "normal"); });
        if ((c.detail || []).length > 6) { ink([70, 84, 112]); doc.text("and " + ((c.detail || []).length - 6) + ((c.detail || []).length === 7 ? " further page" : " further pages"), mid, y + 16.2, { align: "center" }); }
      }

      /* the seal */
      (function () { var sx = mid, sy = 176, rad = Math.PI / 180; fill(BLUE); doc.triangle(sx - 8, sy + 5, sx - 11.5, sy + 18, sx - 3.5, sy + 14.5, "F"); fill(TEAL); doc.triangle(sx + 8, sy + 5, sx + 11.5, sy + 18, sx + 3.5, sy + 14.5, "F");
        fill(GOLD); for (var i = 0; i < 24; i++) doc.circle(sx + Math.sin(i * 15 * rad) * 12.2, sy - Math.cos(i * 15 * rad) * 12.2, 1.9, "F"); doc.circle(sx, sy, 12.4, "F"); fill(DGOLD); doc.circle(sx, sy, 10.6, "F"); fill(NAVY); doc.circle(sx, sy, 9.9, "F");
        draw(GOLD); doc.setLineWidth(0.25); doc.circle(sx, sy, 8.6, "S"); ink(GOLD); doc.setFont("helvetica", "bold"); doc.setFontSize(6.2); rich("NORA²", sx, sy - 3.9, "center", 0.3); ink([255, 255, 255]); doc.setFontSize(13.5); doc.text("CPD", sx, sy + 1.9, { align: "center" }); ink(GOLD); doc.setFontSize(5.6); doc.text(String(c.issued_at).slice(0, 4), sx, sy + 5.9, { align: "center", charSpace: 0.5 }); })();

      /* signature block and certificate number */
      draw(INK); doc.setLineWidth(0.3); doc.line(24, 170, 104, 170); ink(INK); doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.text("Dr Arun Mohanraj FRCA EDRA", 24, 175);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.6); doc.text("Consultant Anaesthetist", 24, 179.4); doc.text("Wrightington, Wigan and Leigh NHS Foundation Trust", 24, 183.4); rich("Lead, NORA² Northwest Regional Anaesthesia Alliance", 24, 187.4, "left");
      fill(NAVY); doc.roundedRect(W - 24 - 76, 163.5, 76, 14.5, 2.6, 2.6, "F"); ink(GOLD); doc.setFont("helvetica", "bold"); doc.setFontSize(6.4); doc.text("CERTIFICATE NUMBER", W - 24 - 71, 168.2, { charSpace: 0.7 }); ink([255, 255, 255]); doc.setFontSize(12.5); doc.text(c.code, W - 24 - 71, 174.6);
      ink(INK); doc.setFont("helvetica", "normal"); doc.setFontSize(8.6); doc.text("Issued " + nice(String(c.issued_at).slice(0, 10)), W - 24, 183.4, { align: "right" }); doc.text("Check this certificate at regionalanesthesia.org/verify.html", W - 24, 187.4, { align: "right" });
      doc.setFontSize(7); ink([110, 120, 140]); doc.text("Learning time is counted only while the member is signed in and actively using a page. This certificate records self-directed learning for the holder's portfolio; it does not state accreditation by an external body.", mid, 199.4, { align: "center", maxWidth: 250 });
      doc.save("NORA2-CPD-certificate-" + c.code + ".pdf"); window.NORA_LAST_CERT = doc;
    });
  }

  /* ------------------------------------------------------------------ pages */
  var msg = function (el, text, good) { el.innerHTML = text ? '<div class="m-msg ' + (good ? "good" : "bad") + '">' + esc(text) + "</div>" : ""; };
  var friendly = function (e) { var m = String(e && e.message || e); if (/Invalid login/i.test(m)) return "The email address or password is not right."; if (/already registered/i.test(m)) return "There is already an account with this email address. Sign in instead."; if (/Email not confirmed/i.test(m)) return "Please open the link in the email we sent you, then sign in."; if (/rate limit/i.test(m)) return "Too many emails have been sent just now. Please try again in an hour."; if (/15 minutes/.test(m)) return "Less than 15 minutes of learning time is recorded in this period."; if (/too many attempts/.test(m)) return "You have used all five attempts for today. Please come back tomorrow."; if (/Password should/i.test(m)) return "Please choose a longer password (at least 10 characters)."; return m; };
  var busyBtn = function (b, on) { b.disabled = on; b.style.opacity = on ? 0.6 : 1; };
  function showPanel(id) { ["join", "in", "reset", "newpw", "me"].forEach(function (k) { var e = $("#m-" + k); if (e) e.hidden = k !== id; }); document.querySelectorAll("[data-panel]").forEach(function (b) { b.classList.toggle("y", b.getAttribute("data-panel") === id); }); }

  var PAGES = {
    account: function () {
      var out = $("#m-out"), ROLES = ["Consultant", "SAS or specialty doctor", "Anaesthetist in training", "Other doctor", "Anaesthesia associate or physician associate", "Operating department practitioner", "Nurse", "Medical student", "Other healthcare professional"];
      $("#j-role").innerHTML = '<option value="">Choose</option>' + ROLES.map(function (r) { return "<option>" + r + "</option>"; }).join("");
      document.querySelectorAll("[data-panel]").forEach(function (b) { b.addEventListener("click", function () { msg(out, ""); showPanel(b.getAttribute("data-panel")); }); });
      var signedIn = function () { $("#m-tabs").hidden = true; showPanel("me"); return B.profile().then(function (p) { $("#p-email").textContent = B.user().email; $("#p-name").value = p.full_name; $("#p-role").innerHTML = ROLES.map(function (r) { return "<option" + (r === p.role ? " selected" : "") + ">" + r + "</option>"; }).join(""); $("#p-hosp").value = p.hospital; $("#p-country").value = p.country; }); };
      if (B.user()) signedIn().catch(function (e) { msg(out, friendly(e)); }); else showPanel(/[#&]join/.test(location.hash) || !localStorage.getItem("nora2.member-seen") ? "join" : "in");
      $("#f-join").addEventListener("submit", function (ev) { ev.preventDefault(); var b = this.querySelector("button[type=submit]"), f = { full_name: $("#j-name").value.trim(), email: $("#j-email").value.trim().toLowerCase(), password: $("#j-pw").value, role: $("#j-role").value, hospital: $("#j-hosp").value.trim(), country: $("#j-country").value.trim() };
        if (f.full_name.length < 2) return msg(out, "Please give your name as it should appear on certificates."); if (f.password.length < 10) return msg(out, "Please choose a password of at least 10 characters."); if (!$("#j-hcp").checked || !$("#j-ok").checked) return msg(out, "Please tick both boxes to join.");
        busyBtn(b, true); B.signUp(f).then(function (r) { localStorage.setItem("nora2.member-seen", "1"); if (r.confirm) { msg(out, "Thank you. We have sent an email to " + f.email + ". Open the link in it to finish joining, then sign in.", true); showPanel("in"); } else location.href = "my-cpd.html"; }).catch(function (e) { msg(out, friendly(e)); }).then(function () { busyBtn(b, false); }); });
      $("#f-in").addEventListener("submit", function (ev) { ev.preventDefault(); var b = this.querySelector("button[type=submit]"); busyBtn(b, true); B.signIn($("#i-email").value.trim().toLowerCase(), $("#i-pw").value).then(function () { localStorage.setItem("nora2.member-seen", "1"); location.href = new URLSearchParams(location.search).get("next") || "my-cpd.html"; }).catch(function (e) { msg(out, friendly(e)); busyBtn(b, false); }); });
      $("#f-reset").addEventListener("submit", function (ev) { ev.preventDefault(); B.reset($("#r-email").value.trim().toLowerCase()).then(function () { msg(out, "If there is an account for that address, an email with a link to choose a new password is on its way.", true); }).catch(function (e) { msg(out, friendly(e)); }); });
      $("#f-newpw").addEventListener("submit", function (ev) { ev.preventDefault(); if ($("#n-pw").value.length < 10) return msg(out, "Please choose a password of at least 10 characters."); B.setPassword($("#n-pw").value).then(function () { msg(out, "Your new password is saved.", true); return signedIn(); }).catch(function (e) { msg(out, friendly(e)); }); });
      $("#f-me").addEventListener("submit", function (ev) { ev.preventDefault(); B.saveProfile({ full_name: $("#p-name").value.trim(), role: $("#p-role").value, hospital: $("#p-hosp").value.trim(), country: $("#p-country").value.trim() }).then(function () { msg(out, "Your details are saved.", true); }).catch(function (e) { msg(out, friendly(e)); }); });
      $("#b-out").addEventListener("click", function () { B.signOut().then(function () { location.href = "index.html"; }); });
      $("#b-data").addEventListener("click", function () { B.everything().then(function (d) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: "application/json" })); a.download = "NORA2-my-data.json"; a.click(); }); });
      $("#b-del").addEventListener("click", function () { var box = $("#del-box"); box.hidden = false; $("#b-del2").onclick = function () { if ($("#del-word").value.trim().toUpperCase() !== "DELETE") return msg(out, "Type DELETE in the box to confirm."); B.remove().then(function () { location.href = "index.html"; }).catch(function (e) { msg(out, friendly(e)); }); }; });
    },

    cpd: function () {
      if (!B.user()) { location.href = "account.html?next=my-cpd.html"; return; }
      var out = $("#c-out"), now = new Date(), a = $("#c-from"), b = $("#c-to"), KN = { video: "Films", block: "Block pages", reading: "Evidence and reading", test: "Tests", tool: "Calculators and interactive tools", other: "Other" };
      a.value = now.getFullYear() + "-01-01"; b.value = iso(now);
      var draw = function () { return Promise.all([B.time(a.value, b.value), B.certs(), B.profile()]).then(function (r) {
        var rows = r[0], total = rows.reduce(function (s, x) { return s + x.seconds; }, 0), byK = {}, byP = {}, days = {};
        rows.forEach(function (x) { byK[x.kind] = (byK[x.kind] || 0) + x.seconds; days[x.day] = 1; (byP[x.page] = byP[x.page] || { t: x.title, k: x.kind, s: 0 }).s += x.seconds; });
        $("#c-name").textContent = r[2].full_name; $("#c-total").textContent = hm(total / 60); $("#c-hours").textContent = (Math.round(total / 360) / 10).toFixed(1); $("#c-days").textContent = Object.keys(days).length;
        var mx = Math.max.apply(null, Object.keys(byK).map(function (k) { return byK[k]; }).concat([1]));
        $("#c-kinds").innerHTML = Object.keys(byK).sort(function (x, y) { return byK[y] - byK[x]; }).map(function (k) { return "<tr><td>" + (KN[k] || k) + '<div class="m-bar"><i style="width:' + Math.round(byK[k] / mx * 100) + '%"></i></div></td><td>' + hm(byK[k] / 60) + "</td></tr>"; }).join("") || '<tr><td colspan="2">No learning time is recorded in this period yet. Time is added while you are signed in and using the block pages, films, evidence pages and tools.</td></tr>';
        $("#c-pages").innerHTML = Object.keys(byP).sort(function (x, y) { return byP[y].s - byP[x].s; }).slice(0, 25).map(function (p) { return "<tr><td>" + (/\.html$/.test(p) ? '<a href="' + esc(p) + '">' + esc(byP[p].t) + "</a>" : esc(byP[p].t)) + "</td><td>" + hm(Math.max(1, byP[p].s / 60)) + "</td></tr>"; }).join("");
        $("#c-certs").innerHTML = r[1].map(function (c) { return "<tr><td><b>" + esc(c.title) + "</b><br><span class=\"muted\">" + (c.kind === "test" ? "Score " + c.score + " out of " + c.total : nice(c.period_from) + " to " + nice(c.period_to)) + " · " + esc(c.code) + "</span></td><td>" + hm(c.minutes) + ' <button class="btn sm" type="button" data-cert="' + esc(c.code) + '">Download</button></td></tr>'; }).join("") || '<tr><td colspan="2">No certificates yet.</td></tr>';
        document.querySelectorAll("[data-cert]").forEach(function (btn) { btn.addEventListener("click", function () { certificate(r[1].filter(function (c) { return c.code === btn.getAttribute("data-cert"); })[0]); }); });
      }).catch(function (e) { msg(out, friendly(e)); }); };
      a.addEventListener("change", draw); b.addEventListener("change", draw); draw();
      $("#c-make").addEventListener("click", function () { var btn = this; busyBtn(btn, true); msg(out, ""); B.issue(a.value, b.value).then(function (code) { return B.certs().then(function (cs) { var c = cs.filter(function (x) { return x.code === code; })[0]; msg(out, "Your certificate is ready: " + code, true); return certificate(c).then(draw); }); }).catch(function (e) { msg(out, friendly(e)); }).then(function () { busyBtn(btn, false); }); });
    },

    test: function () {
      var id = new URLSearchParams(location.search).get("id") || "gastric-ultrasound", out = $("#t-out"), form = $("#t-form"), gate = $("#t-gate"), vid = $("#t-video");
      B.test(id).then(function (t) {
        $("#t-title").textContent = t.title; $("#t-intro").textContent = t.meta.intro || ""; document.title = t.title + " · CPD test · NORA²";
        $("#t-read").innerHTML = (t.meta.read || []).map(function (r) { return '<a class="btn sm" href="' + esc(r[0]) + '">' + esc(r[1]) + "</a>"; }).join(" ");
        var need = (t.meta.video && t.meta.video.watch_percent) || 0, watched = !t.meta.video;
        if (t.meta.video) { vid.src = t.meta.video.src; if (t.meta.video.poster) vid.poster = t.meta.video.poster;
          vid.addEventListener("timeupdate", function () { if (!vid.duration) return; var got = 0, pl = vid.played; for (var i = 0; i < pl.length; i++) got += pl.end(i) - pl.start(i); var pc = Math.min(100, Math.round(got / vid.duration * 100));   /* the parts actually played; skipping ahead does not count */ $("#t-watch").textContent = pc + "% of the film watched"; if (pc >= need && !watched) { watched = true; unlock(); } }); } else $("#t-film").hidden = true;
        var order = t.questions.map(function (q) { var o = q.o.map(function (_, i) { return i; }); for (var i = o.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = o[i]; o[i] = o[j]; o[j] = x; } return o; });
        var paintQ = function (rev) { form.innerHTML = t.questions.map(function (q, k) { var R = rev && rev.review[k]; return '<div class="m-q"><b>' + (k + 1) + ". " + esc(q.q) + '</b><div class="opts">' + order[k].map(function (i) { var cls = R ? (i === R.correct ? "right" : (i === R.chosen ? "wrong" : "")) : ""; return '<label class="' + cls + '"><input type="radio" name="q' + k + '" value="' + i + '"' + (R ? " disabled" + (i === R.chosen ? " checked" : "") : "") + "> <span>" + esc(q.o[i]) + "</span></label>"; }).join("") + "</div>" + (R ? '<div class="m-why">' + (R.ok ? "<b>Correct.</b> " : "<b>Not correct.</b> ") + esc(R.w) + (R.r || []).map(function (n) { var ref = rev.refs[n] || "", m = ref.match(/https?:\/\/\S+$/); return "<br><small>" + esc(ref.replace(/https?:\/\/\S+$/, "")) + (m ? '<a href="' + esc(m[0]) + '" target="_blank" rel="noopener">' + esc(m[0]) + "</a>" : "") + "</small>"; }).join("") + "</div>" : "") + "</div>"; }).join("") + (rev ? "" : '<div class="cta" style="margin-top:18px"><button class="btn y" type="submit">Submit my answers</button></div>'); };
        var unlock = function () { var ok = watched && B.user(); gate.innerHTML = !B.user() ? 'The film and the questions are open to everyone. To have your answers marked and receive a certificate, <a href="account.html?next=' + encodeURIComponent("cpd-test.html?id=" + id) + '">sign in or join free</a>.' : (watched ? "" : "The questions open when you have watched the film (" + need + "% or more)."); gate.hidden = !gate.innerHTML; form.classList.toggle("m-lock", !ok); };
        paintQ(); unlock();
        form.addEventListener("change", function (e) { if (e.target.name) { document.querySelectorAll('input[name="' + e.target.name + '"]').forEach(function (i) { i.parentNode.classList.toggle("sel", i.checked); }); } });
        form.addEventListener("submit", function (ev) { ev.preventDefault(); var ans = t.questions.map(function (_, k) { var c = form.querySelector('input[name="q' + k + '"]:checked'); return c ? +c.value : null; });
          if (ans.indexOf(null) >= 0) return msg(out, "Please answer every question. Question " + (ans.indexOf(null) + 1) + " has no answer yet."); var b = form.querySelector("button[type=submit]"); busyBtn(b, true); if (window.NORA_CPD_FLUSH) window.NORA_CPD_FLUSH();
          setTimeout(function () { B.submit(id, ans).then(function (r) { paintQ(r); var pc = Math.round(r.score / r.total * 100);
            out.innerHTML = '<div class="m-card" style="margin-bottom:18px"><span class="eyebrow">Result</span><div class="m-stat">' + r.score + " out of " + r.total + "</div><p>" + (r.passed ? "You have passed (" + pc + "%; the pass mark is " + r.pass_percent + "%). Your certificate is ready." : "The pass mark is " + r.pass_percent + "%. Read the explanations below, watch the film again if it helps, and try again.") + '</p><div class="cta">' + (r.passed ? '<button class="btn y" type="button" id="t-cert">Download certificate</button> <a class="btn" href="my-cpd.html">My CPD</a>' : '<button class="btn y" type="button" id="t-again">Try again</button>') + "</div></div>";
            out.scrollIntoView({ behavior: "smooth", block: "start" });
            if (r.passed) $("#t-cert").addEventListener("click", function () { B.certs().then(function (cs) { certificate(cs.filter(function (c) { return c.code === r.certificate; })[0]); }); }); else $("#t-again").addEventListener("click", function () { out.innerHTML = ""; paintQ(); form.scrollIntoView({ behavior: "smooth" }); });
          }).catch(function (e) { msg(out, friendly(e)); busyBtn(b, false); }); }, 400); });
      }).catch(function (e) { msg(out, friendly(e)); });
    },

    verify: function () {
      var out = $("#v-out"), inp = $("#v-code"), go = function () { var c = inp.value.trim(); if (!c) return; B.verify(c).then(function (r) { out.innerHTML = r.valid ? '<div class="m-card"><span class="eyebrow">Valid certificate</span><h3 style="margin:8px 0">' + esc(r.name) + "</h3><p><b>" + esc(r.title) + "</b><br>" + (r.kind === "test" ? "Score " + r.score + " out of " + r.total + " · " : nice(r.from) + " to " + nice(r.to) + " · ") + "Learning time " + hm(r.minutes) + "<br>Issued " + nice(r.issued) + " · " + esc(r.code) + "</p></div>" : '<div class="m-msg bad">No certificate has this number. Please check it and try again.</div>'; }).catch(function (e) { msg(out, friendly(e)); }); };
      $("#v-form").addEventListener("submit", function (e) { e.preventDefault(); go(); }); var q = new URLSearchParams(location.search).get("c"); if (q) { inp.value = q; go(); }
    }
  };

  B.init().then(function () { headerButton(); tracker(); if (PAGES[mode]) PAGES[mode](); }).catch(function (e) { if (window.console) console.warn("NORA² members:", e); });
})();

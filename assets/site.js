/* NORA² site script. Content lives in content.js; you should not need to edit this file. */
(function () {
  "use strict";
  var N = window.NORA || { videos: [], gallery: [], meetings: [], blocks: [], regions: [] };
  var page = document.body.getAttribute("data-page") || "";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("nora2." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("nora2." + k, JSON.stringify(v)); } catch (e) {} }
  };
  var I = window.NORA_I18N || { langs: { en: "English" }, order: ["en"], t: {} };
  var lang = store.get("lang", "en"); if (I.order.indexOf(lang) < 0) lang = "en";
  var T = function (k, d) { var r = I.t[k]; return r ? (r[I.order.indexOf(lang)] || r[0]) : (d || k); };
  var TX = window.NORA_TEXT || {}, PAT = window.NORA_PAT || {}, li = I.order.indexOf(lang) - 1;
  function trText(t) {
    var k = t.replace(/\s+/g, " ").trim(); if (!k) return null;
    if (TX[k] && TX[k][li]) return t.replace(t.trim(), TX[k][li]);
    var nums = [], k2 = k.replace(/\d+(?:[.,]\d+)*/g, function (x) { nums.push(x); return "#"; });
    if (nums.length && TX[k2] && TX[k2][li]) { var ni = 0; return t.replace(t.trim(), TX[k2][li].replace(/#/g, function () { return nums[ni++] || ""; })); }
    var m = k.match(/^(\d+) blocks$/); if (m && PAT.blocks) return m[1] + " " + PAT.blocks[li];
    m = k.match(/^Question (\d+) of (\d+)$/); if (m && PAT.question) return PAT.question[li].replace("{a}", m[1]).replace("{b}", m[2]);
    m = k.match(/^(\d+) of (\d+) blocks$/); if (m && PAT.ofblocks) return PAT.ofblocks[li].replace("{a}", m[1]).replace("{b}", m[2]);
    m = k.match(/^(\d+) of (\d+) operations$/); if (m && PAT.ofops) return PAT.ofops[li].replace("{a}", m[1]).replace("{b}", m[2]);
    m = k.match(/^(\/|\d+ ·) (.+)$/); if (m && TX[m[2]] && TX[m[2]][li]) return t.replace(t.trim(), m[1] + " " + TX[m[2]][li]);
    if (k.indexOf(" · ") > 0) { var hit = 0, parts = k.split(" · ").map(function (x) { if (TX[x] && TX[x][li]) { hit++; return TX[x][li]; } return x; }); if (hit) return t.replace(t.trim(), parts.join(" · ")); }
    return null;
  }
  function trTree(root) {
    if (li < 0 || !root) return;
    if (root.nodeType === 3) { var r0 = trText(root.nodeValue); if (r0 != null) root.nodeValue = r0; return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.tagName)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.tagName)) list.push(n); }
    list.forEach(function (x) { var r = trText(x.nodeValue); if (r != null) x.nodeValue = r; });
    $$("[placeholder]", root).forEach(function (el) { var r = trText(el.getAttribute("placeholder")); if (r != null) el.setAttribute("placeholder", r); });
  }
  function translate() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) { var k = el.getAttribute("data-i18n"); if (I.t[k]) el.innerHTML = T(k); });
  }
  var region = function (id) { return N.regions.filter(function (r) { return r.id === id; })[0] || { name: "", c: "#16123A", cls: "" }; };

  var MARK = '<img class="mark" src="media/brand/logo-mark.webp" alt="" width="48" height="48">';
  var FILES = { home: "index.html", basics: "ultrasound-physics.html", pocus: "pocus.html", blocks: "blocks.html", surgery: "surgery.html", dose: "dose.html", audits: "audit-tools.html", awake: "awake.html", practice: "practice.html", resources: "resources.html", videos: "videos.html", cadaver: "cadaver-lab.html", meetings: "meetings.html", research: "research.html", blog: "blog.html", publications: "publications.html", about: "about.html" };
  var SUB = { basics: [["ultrasound-physics.html", "Ultrasound physics"], ["knobology.html", "Knobology"], ["needling.html", "Needling techniques"], ["anatomy-3d.html", "3D anatomy map"]], resources: [["emergency.html", "Emergencies and safety checks"], ["anticoagulation.html", "Antithrombotic drugs and blocks"], ["prospect.html", "Pain guidance by procedure (PROSPECT)"], ["societies.html", "Societies and diplomas"], ["leaflets.html", "Information for patients"]], pocus: [["pocus-gastric.html", "Gastric POCUS", "hot"], ["pocus-airway.html", "Airway POCUS"], ["pocus-lung.html", "Lung POCUS"]], audits: [["audit-tools.html#patients", "Patient-reported outcome and experience measures"], ["audit-tools.html#awake", "Awake surgery"], ["audit-tools.html#chest", "Rib fracture audit"], ["audit-tools.html#breast", "Breast surgery: blocks and volumes"], ["audit-tools.html#safety", "Prep, Stop, Block and follow-up"], ["audit.html", "Local anaesthetic dose audit (online)"], ["practice.html", "Safety"]], research: [["research.html#published", "Published research"], ["research.html#ongoing", "Ongoing research"]] };
  var MORE = [];
  var LINKS = Object.keys(FILES).map(function (k) { return [FILES[k], T("nav." + k), k]; });

  /* ---------- header, footer, phone tab bar ---------- */
  function chrome() {
    var cur = page === "block" ? "blocks" : page;
    var here = (location.pathname.split("/").pop() || "index.html");
    var lk = function (l) { return '<a href="' + l[0] + '"' + (l[2] === cur ? ' aria-current="page"' : "") + ">" + (l[2] === "dose" ? T("nav.dose.short") : l[1]) + "</a>"; };
    var dd = function (label, items, on) { return '<div class="dd' + (on ? " on" : "") + '"><button type="button" aria-haspopup="true" aria-expanded="false">' + label + ' <i aria-hidden="true"></i></button><div class="dd-m">' + items + "</div></div>"; };
    var nav = LINKS.slice(1).filter(function (l) { return MORE.indexOf(l[2]) < 0 && l[2] !== "cadaver" && l[2] !== "awake" && l[2] !== "practice"; }).map(function (l) {
      if (!SUB[l[2]]) return lk(l);
      return dd(l[1], (l[2] === "basics" ? "" : '<a href="' + l[0] + '"><b>' + l[1] + "</b></a>") + SUB[l[2]].map(function (s) { return '<a href="' + s[0] + '"' + (s[2] ? ' class="' + s[2] + '"' : "") + (s[0] === here ? ' aria-current="page"' : "") + ">" + s[1] + "</a>"; }).join(""), l[2] === cur);
    }).join("") + (MORE.length ? dd(T("nav.more"), LINKS.filter(function (l) { return MORE.indexOf(l[2]) >= 0; }).map(lk).join(""), MORE.indexOf(cur) >= 0) : "");
    var h = $("#site-header");
    if (h) h.outerHTML = '<header class="top"><div class="wrap"><a class="brand" href="index.html" aria-label="NORA² home">' + MARK +
      '<div><b>NORA<sup>2</sup></b><span>Northwest Regional Anaesthesia Alliance</span></div></a><nav class="nav" aria-label="Main">' + nav +
      '</nav><select id="lang" class="lang" aria-label="Language">' + I.order.map(function (c) { return '<option value="' + c + '"' + (c === lang ? " selected" : "") + ">" + c.toUpperCase() + " · " + I.langs[c] + "</option>"; }).join("") + '</select><button class="btn sm" id="open-search" type="button">' + T("ui.search") + ' <kbd>/</kbd></button><button class="btn sm y app" id="open-app" type="button">' + T("ui.app") + '</button></div></header>' +
      '<div class="ruler" aria-hidden="true"><b><span>0.0 cm</span></b></div>';
    var tabs = ["home", "blocks", "dose", "practice", "meetings"].map(function (k) { return LINKS.filter(function (l) { return l[2] === k; })[0]; }).map(function (l) {
      return '<a href="' + l[0] + '"' + (l[2] === cur ? ' aria-current="page"' : "") + "><i></i>" + (l[2] === "dose" ? T("nav.dose.short") : l[1]) + "</a>";
    }).join("");
    var f = $("#site-footer");
    if (f) f.outerHTML = '<footer><div class="wrap"><div><h3>NORA<sup>2</sup></h3><p style="margin-top:8px">Northwest Regional Anaesthesia Alliance. Teaching material for anaesthetists and trainees, led by Dr Arun Mohanraj FRCA EDRA, Consultant Anaesthetist, Wrightington, Wigan and Leigh NHS Foundation Trust.</p></div>' +
      '<div><h3>Explore</h3><ul>' + LINKS.map(function (l) { return '<li><a href="' + l[0] + '">' + l[1] + "</a></li>"; }).join("") + "</ul></div>" +
      '<div><h3>Our evidence rule</h3><p style="margin-top:8px">Clinical statements on this site carry a numbered link to a peer-reviewed source. The site is written for registered healthcare professionals and does not replace supervised training, local policy or clinical judgement.</p></div></div></footer>' +
      '<nav class="tabs" aria-label="App">' + tabs + "</nav>" +
      '<div class="ov" id="ov-search" role="dialog" aria-modal="true" aria-label="Search"><div class="box"><div class="search"><input id="q" type="search" placeholder="Search blocks, videos and meetings" autocomplete="off" aria-label="Search the site"><button class="btn sm k" type="button" data-close>Close</button></div><div class="res" id="q-res"></div></div></div>' +
      '<div class="ov" id="ov-app" role="dialog" aria-modal="true" aria-label="Install the app"><div class="box"><h3>Put NORA² on your phone</h3><p>The site installs as an app: its own icon, full screen, and pages you have opened stay available offline.</p><ol><li><b>iPhone or iPad (Safari):</b> tap Share, then “Add to Home Screen”.</li><li><b>Android (Chrome):</b> tap the menu, then “Install app” or “Add to Home screen”.</li><li><b>Computer (Chrome or Edge):</b> use the install icon in the address bar.</li></ol><div class="cta"><button class="btn y" id="do-install" type="button" hidden>Install now</button><button class="btn" type="button" data-close>Close</button></div></div></div>' +
      '<div class="ov" id="ov-img" role="dialog" aria-modal="true" aria-label="Image"><div class="box wide"><img id="lb-img" alt=""><div id="lb-cap"></div><div class="cta"><button class="btn sm y" id="lb-toggle" type="button" hidden>Show labels</button><button class="btn sm" type="button" data-close>Close</button></div></div></div>';

    $("#lang").addEventListener("change", function () { store.set("lang", this.value); location.reload(); });
    translate();
    var open = function (id) { var o = $(id); if (o) { o.classList.add("open"); var i = $("input,button", o); if (i) i.focus(); } };
    var closeAll = function () { $$(".ov.open").forEach(function (o) { o.classList.remove("open"); }); };
    window.NORAopen = open;
    document.addEventListener("click", function (e) {
      var t = e.target;
      var b = t.closest(".dd > button"), was = b && b.parentNode.classList.contains("open");
      $$(".dd.open").forEach(function (d) { d.classList.remove("open"); $("button", d).setAttribute("aria-expanded", "false"); });
      if (b && !was) { b.parentNode.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
      var pr = t.closest("[data-print]");
      if (pr) { $$(".leaf").forEach(function (d) { d.classList.remove("printing"); }); var lf = document.getElementById(pr.getAttribute("data-print")); if (lf) { lf.open = true; lf.classList.add("printing"); document.body.classList.add("print-leaf"); window.print(); } }
      if (t.closest("#open-search")) open("#ov-search");
      else if (t.closest("#open-app,[data-app]")) open("#ov-app");
      else if (t.closest("[data-close]") || t.classList.contains("ov")) closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); open("#ov-search"); }
    });

    /* search */
    var idx = [];
    N.blocks.forEach(function (b) { idx.push({ t: b.name, k: "Block · " + region(b.region).name, h: b.page || "blocks.html#" + b.region, x: (b.also || "") + " " + region(b.region).name, c: region(b.region).c }); });
    N.videos.forEach(function (v) { idx.push({ t: v.title, k: "Video · " + v.type, h: "videos.html", x: v.type, c: "#16123A" }); });
    N.meetings.forEach(function (m) { idx.push({ t: m.title, k: "Meeting · " + m.date, h: "meetings.html", x: m.venue, c: "#F2452E" }); });
    idx.push({ t: "Local anaesthetic dose calculator", k: "Tool", h: "dose.html", x: "maximum dose actual lean body weight toxicity LAST lipid breast", c: "#FFC61A" });
    (N.surgeries || []).forEach(function (x) { idx.push({ t: x.op, k: "Surgery · " + x.group, h: "surgery.html#" + x.region, x: x.blocks.map(function (b) { return b.name; }).join(" "), c: region(x.region).c }); });
    (N.research || []).forEach(function (r) { idx.push({ t: r.title, k: "Research", h: "research.html", x: (r.funder || "") + " " + (r.status || ""), c: "#7C3AED" }); });
    (N.posts || []).forEach(function (r) { idx.push({ t: r.title, k: "Blog · " + (r.date || ""), h: "blog.html", x: r.summary || "", c: "#11B8A8" }); });
    idx.push({ t: "Gastric POCUS", k: "POCUS", h: "pocus-gastric.html", x: "gastric ultrasound antrum aspiration full stomach GLP-1 volume calculator point-of-care", c: "#FFC61A" });
    idx.push({ t: "Gastric volume calculator", k: "Tool", h: "gastric-calculator.html", x: "gastric volume antral area Perlas mL/kg", c: "#FFC61A" });
    idx.push({ t: "Audit tools to download", k: "Tool", h: "audit-tools.html", x: "audit PROMs PREMs awake surgery erector spinae peak flow cough breast prep stop block catheter follow-up PDF", c: "#11B8A8" });
    idx.push({ t: "Local anaesthetic audit tool", k: "Tool", h: "audit.html", x: "audit total volume dose breast erector spinae fascial plane", c: "#11B8A8" });
    [["Managing local anaesthetic toxicity", "last.html", "LAST lipid emulsion intralipid seizure cardiac arrest"], ["Complications of regional anaesthesia", "complications.html", "nerve injury neuropathy NAP3 wrong side block bleeding"], ["PROMs and PREMs for block-only surgery", "proms-prems.html", "patient reported outcome experience QoR-15 awake surgery"], ["Medico-legal aspects of regional anaesthesia", "medico-legal.html", "consent litigation claims negligence documentation"]].forEach(function (x) { idx.push({ t: x[0], k: "Safety and practice", h: x[1], x: x[2], c: "#E5484D" }); });
    idx.push({ t: "Cadaver lab", k: "Dissection images", h: "cadaver-lab.html", x: "anatomy prosection", c: "#D43D78" });
    var q = $("#q"), res = $("#q-res");
    var run = function () {
      var s = q.value.trim().toLowerCase();
      var hits = idx.filter(function (i) { return !s || (i.t + " " + i.x + " " + i.k).toLowerCase().indexOf(s) > -1; }).slice(0, 9);
      res.innerHTML = hits.length ? hits.map(function (i) { return '<a href="' + i.h + '"><span class="dot" style="background:' + i.c + '"></span><span><b>' + esc(i.t) + '</b><br><small class="crumb">' + esc(i.k) + "</small></span></a>"; }).join("") : '<p class="empty">Nothing matches “' + esc(q.value) + "”. Try a region, a nerve or an operation.</p>";
    };
    if (q) { q.addEventListener("input", run); run(); }

    /* depth ruler: 1 cm for every 400 px scrolled */
    var mark = $(".ruler b"), lab = $(".ruler span");
    var onScroll = function () {
      if (!mark) return;
      var max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
      mark.style.top = (p * (innerHeight - 66 - 6)) + "px"; lab.textContent = (scrollY / 400).toFixed(1) + " cm";
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    /* install prompt + offline support (works once the site is on its own https address) */
    var deferred;
    addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; var b = $("#do-install"); if (b) b.hidden = false; });
    document.addEventListener("click", function (e) { if (e.target.id === "do-install" && deferred) { deferred.prompt(); deferred = null; } });
    try { if ("serviceWorker" in navigator && /^https:|^http:\/\/localhost/.test(location.href)) navigator.serviceWorker.register("sw.js").catch(function () {}); } catch (e) {}
  }

  /* ---------- interactive sonoanatomy ---------- */
  var ISB = [
    { id: "scm", t: "muscle", n: "Sternocleidomastoid", l: "SCM", d: "The superficial muscle that roofs the interscalene groove and tapers towards its lateral edge.", lx: 70, ly: 86 },
    { id: "ijv", t: "vein", n: "Internal jugular vein", l: "IJV", d: "Thin-walled and compressible under light probe pressure.", lx: 30, ly: 170 },
    { id: "ca", t: "artery", n: "Common carotid artery", l: "CA", d: "Round, pulsatile and non-compressible. The starting landmark when tracing laterally to the scalene muscles.", lx: 22, ly: 300 },
    { id: "asm", t: "muscle", n: "Anterior scalene", l: "ASM", d: "Forms the medial wall of the groove. The phrenic nerve runs on its anterior surface.", lx: 215, ly: 300 },
    { id: "msm", t: "muscle", n: "Middle scalene", l: "MSM", d: "Forms the lateral wall of the groove. An in-plane needle from the posterior side crosses this muscle, where the dorsal scapular and long thoracic nerves often lie.", c: 8, lx: 560, ly: 150 },
    { id: "c5", t: "nerve", n: "C5 root", l: "C5", d: "The most superficial of the round, dark roots stacked between the scalene muscles.", lx: 392, ly: 118 },
    { id: "c6", t: "nerve", n: "C6 root", l: "C6", d: "With C5 it forms the superior trunk, the main target for shoulder surgery.", lx: 312, ly: 196 },
    { id: "c7", t: "nerve", n: "C7 root", l: "C7", d: "The deepest root in this view.", lx: 318, ly: 290 },
    { id: "phr", t: "nerve", n: "Phrenic nerve", l: "Phrenic n.", d: "Lies on the anterior scalene close to the C5 root. Its position explains why local anaesthetic placed here so often reaches the diaphragm.", c: 12, lx: 150, ly: 132 },
    { id: "dsn", t: "nerve", n: "Dorsal scapular nerve", l: "DSN", d: "A nerve was visible in or on the middle scalene in 90% of 50 patients, about 0.7 cm posterior to the plexus; on stimulation 77% were the dorsal scapular nerve.", c: 8, lx: 498, ly: 196 },
    { id: "ltn", t: "nerve", n: "Long thoracic nerve", l: "LTN", d: "Identified by stimulation in 23% of the nerves seen within the middle scalene. Look for it before choosing the needle path.", c: 8, lx: 520, ly: 300 },
    { id: "va", t: "artery", n: "Vertebral artery", l: "VA", d: "Lies deep, close to the transverse process. Check with colour Doppler before needling.", lx: 250, ly: 362 },
    { id: "tp", t: "bone", n: "Transverse process", l: "TP", d: "A bright line with a dark acoustic shadow beneath it.", lx: 470, ly: 372 }
  ];
  var MOTOR = {
    dsn: { m: "Levator scapulae, rhomboid major and rhomboid minor.", s: "The scapula lifts and draws towards the spine." },
    ltn: { m: "Serratus anterior.", s: "The chest wall twitches and the scapula is drawn forwards." },
    phr: { m: "The diaphragm.", s: "A hiccup-like twitch of the diaphragm: the needle is too anterior." },
    c5: { m: "Through the superior trunk: deltoid and biceps.", s: "Deltoid or biceps twitch." },
    c6: { m: "Through the superior trunk: biceps, deltoid and the wrist extensors.", s: "Biceps or deltoid twitch." },
    c7: { m: "Through the middle trunk: triceps.", s: "Triceps twitch." }
  };
  var SHAPES = {
    scm: '<path class="shape" d="M30 62Q210 40 408 80Q250 120 40 112Z" fill="#3A3D46" stroke="#9AA0AC" stroke-width="1.5"/>',
    ijv: '<ellipse class="shape" cx="122" cy="166" rx="46" ry="22" fill="#07080C" stroke="#8990A0" stroke-width="1.5"/>',
    ca: '<circle class="shape" cx="96" cy="246" r="33" fill="#050609" stroke="#C9CED8" stroke-width="2.5"/>',
    asm: '<ellipse class="shape" cx="262" cy="216" rx="56" ry="70" fill="#353841" stroke="#9AA0AC" stroke-width="1.5"/>',
    msm: '<ellipse class="shape" cx="492" cy="226" rx="116" ry="86" fill="#383B44" stroke="#9AA0AC" stroke-width="1.5"/>',
    c5: '<circle class="shape" cx="350" cy="150" r="17" fill="#0A0B10" stroke="#D6DAE2" stroke-width="2"/>',
    c6: '<circle class="shape" cx="360" cy="206" r="19" fill="#0A0B10" stroke="#D6DAE2" stroke-width="2"/>',
    c7: '<circle class="shape" cx="366" cy="266" r="18" fill="#0A0B10" stroke="#D6DAE2" stroke-width="2"/>',
    phr: '<circle cx="232" cy="148" r="15" fill="transparent"/><circle class="shape" cx="232" cy="148" r="6" fill="#0A0B10" stroke="#D6DAE2" stroke-width="2"/>',
    dsn: '<circle cx="456" cy="206" r="15" fill="transparent"/><circle class="shape" cx="456" cy="206" r="6" fill="#0A0B10" stroke="#D6DAE2" stroke-width="2"/>',
    ltn: '<circle cx="474" cy="264" r="15" fill="transparent"/><circle class="shape" cx="474" cy="264" r="6" fill="#0A0B10" stroke="#D6DAE2" stroke-width="2"/>',
    va: '<circle class="shape" cx="300" cy="322" r="13" fill="#050609" stroke="#C9CED8" stroke-width="2"/>',
    tp: '<path d="M330 334Q372 300 410 324Q444 302 484 334V400H330Z" fill="#000"/><path class="shape" d="M330 334Q372 300 410 324Q444 302 484 334" fill="none" stroke="#F4F6FA" stroke-width="7" stroke-linecap="round"/>'
  };
  var ANCHOR = { scm: [190, 82], ijv: [122, 166], ca: [96, 246], asm: [262, 240], msm: [530, 190], c5: [350, 150], c6: [360, 206], c7: [366, 266], phr: [232, 148], dsn: [456, 206], ltn: [474, 264], va: [300, 322], tp: [440, 322] };

  function sono(el, refBase) {
    if (!el) return;
    var cite = function (n) { return n ? ' <a class="cite" href="' + refBase + "#ref-" + n + '" title="Reference ' + n + '">' + n + "</a>" : ""; };
    var uid = "sp" + Math.random().toString(36).slice(2, 7);
    var svg = '<svg viewBox="0 0 640 400" role="img" aria-label="Schematic ultrasound image of the interscalene groove with selectable structures">' +
      '<defs><filter id="' + uid + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85 0.5" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0.9 0.9 0 -0.95"/></filter>' +
      '<linearGradient id="' + uid + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2E36"/><stop offset="1" stop-color="#101116"/></linearGradient></defs>' +
      '<rect width="640" height="400" fill="url(#' + uid + 'g)"/><rect y="0" width="640" height="46" fill="#4A4E58"/><path d="M0 46H640" stroke="#C9CED8" stroke-width="1.5"/>' +
      ISB.map(function (s) { return '<g class="st t-' + s.t + '" data-id="' + s.id + '" tabindex="0" role="button" aria-label="' + s.n + '">' + SHAPES[s.id] + "</g>"; }).join("") +
      '<rect width="640" height="400" filter="url(#' + uid + ')" opacity=".3" pointer-events="none"/>' +
      '<g class="la la-in"><ellipse cx="368" cy="178" rx="30" ry="46"/></g><g class="la la-ex"><ellipse cx="402" cy="182" rx="26" ry="52"/></g>' +
      '<g class="needle"><path d="M640 62 396 176" stroke="#FFC61A" stroke-width="3.5"/><path d="M396 176l15-1-9-12z" fill="#FFC61A"/></g>' +
      ISB.map(function (s) { var a = ANCHOR[s.id]; return '<path class="lead" d="M' + a[0] + " " + a[1] + "L" + (s.lx + 4) + " " + (s.ly - 4) + '"/><text class="lbl" x="' + s.lx + '" y="' + s.ly + '" text-anchor="' + (s.lx > a[0] ? "start" : "end") + '">' + s.l + "</text>"; }).join("") +
      '<text class="ori" x="8" y="20">Anteromedial</text><text class="ori" x="632" y="20" text-anchor="end">Posterolateral</text><circle cx="12" cy="34" r="5" fill="#FFC61A"/>' +
      [1, 2, 3].map(function (c) { return '<path d="M630 ' + (46 + c * 105) + 'h10" stroke="#fff" stroke-width="1.5"/><text class="ori" x="626" y="' + (50 + c * 105) + '" text-anchor="end">' + c + "</text>"; }).join("") + "</svg>";
    el.classList.add("sono");
    el.innerHTML = '<div class="bar" role="toolbar" aria-label="Viewer controls"><button data-m="labels" aria-pressed="true">Labels</button><button data-m="col" aria-pressed="false">Colour the anatomy</button><button data-m="ndl" aria-pressed="false">Needle path</button><button data-m="avoid" aria-pressed="false">Nerves to avoid</button><button data-m="in" aria-pressed="false">Inject: within the sheath</button><button data-m="ex" aria-pressed="false">Inject: outside the sheath</button><button data-m="test" aria-pressed="false">Test me</button></div>' +
      svg + '<div class="info" aria-live="polite"></div><div class="cap">Original schematic, not to scale. Interscalene groove at the level of C6, right side.</div>';
    var info = $(".info", el), test = null, score = 0, asked = 0;
    var say = function (h, b, q) { info.innerHTML = (q ? '<span class="q">' + q + "</span>" : "") + "<b>" + h + "</b><span>" + b + "</span>"; };
    var idle = function () { say("Tap any structure", "Thirteen structures are selectable. Tap a nerve to see the muscles it supplies and how it answers a nerve stimulator."); };
    var ask = function () { test = ISB[Math.floor(Math.random() * ISB.length)]; say("Find: " + test.n, "Tap it on the image.", "Score " + score + " / " + asked); };
    var pick = function (g) {
      var s = ISB.filter(function (x) { return x.id === g.getAttribute("data-id"); })[0];
      $$(".st", el).forEach(function (x) { x.classList.toggle("on", x === g); });
      if (test) {
        asked++; var ok = s.id === test.id; if (ok) score++;
        say(ok ? "Correct: " + s.n : "That is the " + s.n.toLowerCase(), s.d + cite(s.c), "Score " + score + " / " + asked + (ok ? "" : " · you were asked for the " + test.n.toLowerCase()));
        var t = test; test = null; setTimeout(function () { if (el.classList.contains("testing")) ask(); }, ok ? 1700 : 3200); void t;
      } else {
        var x = MOTOR[s.id];
        say(s.n, s.d + cite(s.c) + (x ? '<span class="sup"><b>Supplies</b> ' + x.m + '</span><span class="sup"><b>Nerve stimulator</b> ' + x.s + "</span>" : ""));
      }
    };
    el.addEventListener("click", function (e) {
      var g = e.target.closest(".st"); if (g) return pick(g);
      var b = e.target.closest("button[data-m]"); if (!b) return;
      var m = b.getAttribute("data-m"), on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on);
      if (m === "labels") el.classList.toggle("nolabels", !on);
      if (m === "col") el.classList.toggle("col", on);
      if (m === "ndl") { el.classList.toggle("ndl", on); if (on) say("In-plane needle from the posterolateral side", "The needle crosses the middle scalene to reach the groove. Identify the dorsal scapular and long thoracic nerves first: they lie in this path in most patients." + cite(8)); }
      if (m === "avoid") {
        el.classList.toggle("avoid", on);
        if (on) { el.classList.add("ndl"); $('button[data-m="ndl"]', el).setAttribute("aria-pressed", true); say("Three nerves to keep the needle away from", "The dorsal scapular and long thoracic nerves lie inside the middle scalene, in the path of an in-plane needle from the posterior side. They look like small bright dots with a dark centre. If one is visible, pass the needle above or below it. A nerve stimulator confirms which is which." + cite(8) + '<span class="sup"><b>Dorsal scapular</b> levator scapulae and rhomboids: the scapula lifts and retracts.</span><span class="sup"><b>Long thoracic</b> serratus anterior: the chest wall twitches.</span><span class="sup"><b>Phrenic</b> on the anterior scalene: keep the injectate lateral.</span>'); } else idle();
      }
      if (m === "in" || m === "ex") {
        $$('button[data-m="in"],button[data-m="ex"]', el).forEach(function (x) { if (x !== b) x.setAttribute("aria-pressed", false); });
        el.classList.remove("inj"); $(".la-in", el).style.display = "none"; $(".la-ex", el).style.display = "none";
        if (on) {
          void el.offsetWidth; el.classList.add("inj", "ndl"); $('button[data-m="ndl"]', el).setAttribute("aria-pressed", true);
          $(m === "in" ? ".la-in" : ".la-ex", el).style.display = "block";
          if (m === "in") say("Injection between C5 and C6, inside the sheath", "With 20 mL of bupivacaine 0.5% placed here, hemidiaphragmatic paresis followed in 90% of patients (95% CI 68 to 99%)." + cite(10));
          else say("Injection 4 mm lateral to the sheath", "The same 20 mL placed outside the sheath produced hemidiaphragmatic paresis in 21% (95% CI 6 to 46%), with similar pain scores at 24 hours." + cite(10));
        } else idle();
      }
      if (m === "test") {
        el.classList.toggle("testing", on);
        if (on) { score = 0; asked = 0; el.classList.add("nolabels"); $('button[data-m="labels"]', el).setAttribute("aria-pressed", false); ask(); } else { test = null; idle(); }
      }
    });
    el.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("st")) { e.preventDefault(); pick(e.target); } });
    idle();
  }

  /* ---------- coverage figure: dermatomes, myotomes, osteotomes ---------- */
  function coverage(el, C) {
    if (!el || !C) return;
    var cur = 0, sel = -1, LAB = { yes: "Covered", part: "Variable", no: "Usually spared" };
    var im = function (name, cls) { return '<image' + (cls ? ' class="' + cls + '"' : "") + ' href="' + C.dir + name + '.webp" x="0" y="0" width="' + C.w + '" height="' + C.h + '"/>'; };
    var draw = function () {
      var V = C.views[cur];
      el.innerHTML = '<div class="cov-tabs" role="tablist">' + C.views.map(function (v, i) { return '<button type="button" class="btn sm" role="tab" aria-selected="' + (i === cur) + '" aria-pressed="' + (i === cur) + '" data-v="' + i + '">' + v.label + "</button>"; }).join("") + "</div>" +
        '<div class="cov-grid"><div class="figcard"><svg class="covfig' + (sel > -1 ? " has-sel" : "") + '" viewBox="' + C.box + '" role="img" aria-label="' + V.label + ' covered by this block">' + im(V.base || C.base) +
        V.zones.map(function (z, i) { return '<g class="z z-' + z.st + (i === sel ? " on" : "") + '" data-z="' + i + '" tabindex="0" role="button" aria-label="' + z.n + '">' + im(z.img) + '<polygon class="hit" points="' + z.pts + '"/></g>'; }).join("") +
        V.zones.map(function (z) { return z.l ? '<text class="zl" x="' + z.l[0] + '" y="' + z.l[1] + '">' + z.l[2] + "</text>" : ""; }).join("") + "</svg>" +
        '<div class="cov-key"><span class="k yes">Covered</span><span class="k part">Variable</span><span class="k no">Usually spared</span></div></div>' +
        '<div class="cov-list">' + V.zones.map(function (z, i) { return '<button type="button" class="cov-row' + (i === sel ? " on" : "") + '" data-z="' + i + '"><span class="k ' + z.st + '">' + LAB[z.st] + "</span><span><b>" + z.n + "</b><br>" + z.t + "</span></button>"; }).join("") + (V.note ? '<p class="note">' + V.note + "</p>" : "") + (C.credit ? '<p class="note">' + C.credit + "</p>" : "") + "</div></div>";
    };
    el.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var t = e.target.closest("[data-v]"); if (t) { cur = +t.getAttribute("data-v"); sel = -1; return draw(); }
      var z = e.target.closest("[data-z]"); if (z) { var i = +z.getAttribute("data-z"); sel = sel === i ? -1 : i; draw(); }
    });
    draw();
  }

  /* ---------- anatomical figure with the major nerve trunks ---------- */
  var BODY = [["head", "Head and neck", ["360,0 550,0 550,235 360,235"]], ["chest", "Chest wall", ["330,235 580,235 600,300 580,520 330,520 310,300"]], ["abdo", "Abdomen", ["330,520 580,520 600,800 455,840 310,800"]], ["upper", "Upper limb", ["580,235 640,240 911,560 911,720 800,700 585,400 600,300", "331,235 271,240 0,560 0,720 111,700 326,400 311,300"]], ["lower", "Lower limb", ["300,800 455,840 610,800 700,1500 210,1500"]], ["axial", "Neuraxial", ["440,215 471,215 471,800 440,800"]]];
  function figure(dark) {
    var im = function (name, cls) { return '<image' + (cls ? ' class="' + cls + '"' : "") + ' href="media/figures/' + name + '.webp" x="0" y="0" width="911" height="1500"/>'; };
    var nv = '<path class="br" d="M464 225C470 230 487 242 502 258C518 274 539 302 558 318C577 334 608 348 618 354"/><path class="br" d="M464 240C470 246 487 260 502 273C518 286 539 304 558 318C577 332 608 348 618 354"/><path class="br" d="M464 255C470 260 487 278 502 288C518 298 539 307 558 318C577 329 608 348 618 354"/><path class="br" d="M464 270C470 276 487 295 502 303C518 311 539 310 558 318C577 326 608 348 618 354"/><path d="M618 354C627 362 654 385 672 402C690 419 708 439 726 458C744 476 763 496 780 514C797 533 813 552 826 568C840 585 855 605 861 612"/><path class="br" d="M618 354C623 362 636 382 648 399C660 416 675 439 693 459C711 479 735 500 754 519C774 538 795 558 812 574C828 592 848 613 855 621"/><path class="br" d="M618 354C625 358 646 366 660 375C674 384 689 397 705 411C721 425 738 442 754 459C771 476 788 496 802 513C817 530 836 556 843 564"/><path class="br" d="M468 375C474 376 490 376 502 378C514 380 528 384 540 390C552 396 570 408 576 411"/><path class="br" d="M468 420C474 420 490 420 502 423C514 426 528 430 540 435C552 440 570 452 576 456"/><path class="br" d="M468 465C474 466 490 466 502 468C514 470 528 474 540 480C552 486 570 498 576 501"/><path class="br" d="M468 510C474 510 490 510 502 513C514 516 528 520 540 525C552 530 570 542 576 546"/><path class="br" d="M468 555C474 556 490 556 502 558C514 560 528 564 540 570C552 576 570 588 576 591"/><path class="br" d="M468 600C474 600 490 600 502 603C514 606 528 610 540 615C552 620 570 632 576 636"/><path d="M464 638C467 649 475 681 483 705C491 729 502 758 510 780C518 802 526 819 534 840C542 861 549 885 555 908C561 930 568 964 570 975"/><path class="br" d="M570 975C569 985 566 1016 564 1035C562 1054 556 1067 558 1092C560 1117 569 1152 576 1185C583 1218 592 1260 600 1290C608 1320 618 1355 621 1368"/><path class="br" d="M464 660C472 670 498 700 518 720C536 740 563 758 578 780C592 802 598 828 603 855C608 882 608 930 609 945"/><path class="br" d="M464 705C467 718 476 754 483 780C490 806 501 835 507 862C513 890 517 931 519 945"/><path class="post" d="M464 750C471 760 494 790 510 810C526 830 546 845 558 870C570 895 574 930 579 960C584 990 586 1035 588 1050"/><path class="post" d="M588 1050C590 1062 598 1098 603 1125C608 1152 614 1185 618 1215C622 1245 626 1279 630 1305C634 1331 640 1361 642 1372"/><path class="br" d="M588 1050C594 1058 617 1080 627 1098C637 1116 644 1130 648 1155C652 1180 650 1215 651 1245C652 1275 655 1308 654 1335C653 1362 646 1398 645 1410"/>';
    var nerves = nv + '<g transform="translate(911 0) scale(-1 1)">' + nv + '</g><path d="M455 138C455 165 455 240 455 300C455 360 455 440 455 495C455 550 455 605 455 627"/>';
    return '<svg class="bodymap' + (dark ? " dark" : "") + '" viewBox="0 0 911 1500" role="group" aria-label="Body map: choose a region">' + im("body") +
      BODY.map(function (r) { return '<g class="rg" data-r="' + r[0] + '" tabindex="0" role="button" aria-label="' + r[1] + '">' + im("body-" + r[0], "tint") + r[2].map(function (p) { return '<polygon class="hit" points="' + p + '"/>'; }).join("") + "</g>"; }).join("") +
      '<g class="nv base">' + nerves + '</g><g class="nv pulse">' + nerves + "</g></svg>";
  }

  /* ---------- shared renderers ---------- */
  function meetingCard(m) {
    var d = new Date(m.date + "T09:00:00"), days = Math.ceil((d - new Date()) / 864e5);
    var mon = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    return '<article class="meet"><div class="date"><span>' + d.toLocaleDateString("en-GB", { weekday: "short" }) + "</span><b>" + d.getDate() + "</b><span>" + mon + '</span></div><div><h3>' + esc(m.title) + '</h3><p style="margin-top:8px">' + esc(m.summary) + '</p><p class="note" style="margin-top:8px">' + esc(m.venue) + (m.fees ? " · " + esc(m.fees) : "") + "</p>" + (m.directors ? '<p class="note">Course directors: ' + esc(m.directors) + "</p>" : "") +
      (m.audience ? '<p class="note">For: ' + esc(m.audience) + "</p>" : "") + (m.cpd ? '<p class="note">' + esc(m.cpd) + "</p>" : "") + (m.refunds ? '<p class="note">Cancellation: ' + esc(m.refunds) + "</p>" : "") + (m.contact ? '<p class="note">Enquiries: <a href="mailto:' + esc(m.contact) + '">' + esc(m.contact) + "</a></p>" : "") +
      "<ul>" + (m.tags || []).map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + '</ul></div><div class="count">' + (days > 0 ? "<b>" + days + "</b>days to go" : "<b>Done</b>thank you for coming") + '<div style="margin-top:12px">' + (m.bookingUrl ? '<a class="btn y" href="' + esc(m.bookingUrl) + '" rel="noopener">Book a place</a>' + (m.qr ? '<img class="meet-qr" src="' + esc(m.qr) + '" alt="QR code for the booking page" width="150" height="150" loading="lazy"><span class="meet-qrc">Scan to book</span>' : "") : '<span class="chip soon">Booking opens soon</span>') + "</div></div></article>";
  }
  function videoCard(v) {
    var has = v.youtube || v.file, lab = { technique: "Technique", panel: "Panel discussion", lecture: "Lecture" }[v.type] || v.type;
    var thumb = v.youtube ? '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + esc(v.youtube) + '/hqdefault.jpg"><button class="play" type="button" aria-label="Play ' + esc(v.title) + '" data-yt="' + esc(v.youtube) + '"></button>'
      : v.file ? '<video controls preload="metadata" src="' + esc(v.file) + '"></video>'
      : '<span class="ph">Video in production</span>';
    return '<article class="tile vid" data-type="' + esc(v.type) + '"><div class="thumb">' + thumb + '</div><div class="body"><span class="n">' + lab + (v.minutes ? " · " + esc(v.minutes) + " min" : "") + "</span><h3>" + esc(v.title) + "</h3>" +
      (v.youtube ? '<a href="https://www.youtube.com/watch?v=' + esc(v.youtube) + '" rel="noopener">Watch on YouTube</a>' : has ? "" : '<span class="chip soon">Coming soon</span>') + "</div></article>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-yt]"); if (!b) return;
    b.parentNode.innerHTML = '<iframe title="Video player" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen src="https://www.youtube-nocookie.com/embed/' + b.getAttribute("data-yt") + '?autoplay=1"></iframe>';
  });

  /* ---------- pages ---------- */
  var P = {};
  function network(cv) {
    if (!cv || !cv.getContext) return;
    var c = cv.getContext("2d"), W, H, pts = [], mouse = { x: -999, y: -999 }, still = matchMedia("(prefers-reduced-motion: reduce)").matches, dpr = Math.min(devicePixelRatio || 1, 2);
    var size = function () { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); var n = Math.round(Math.min(90, W * H / 14000)); pts = []; for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: 1 + Math.random() * 2.2, p: Math.random() * 6.28 }); };
    var draw = function (t) {
      c.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i]; a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 19600) { var o = 1 - d / 19600, pulse = .5 + .5 * Math.sin(t / 900 + a.p + b.p); c.strokeStyle = "rgba(127,227,216," + (o * .28 + o * pulse * .14) + ")"; c.lineWidth = 1; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
        }
        var mx = a.x - mouse.x, my = a.y - mouse.y, near = mx * mx + my * my < 22500;
        if (near) { c.strokeStyle = "rgba(246,185,43,.55)"; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(mouse.x, mouse.y); c.stroke(); }
        c.fillStyle = near ? "rgba(246,185,43,.95)" : "rgba(190,214,255," + (.45 + .35 * Math.sin(t / 700 + a.p)) + ")";
        c.beginPath(); c.arc(a.x, a.y, near ? a.r + 1.4 : a.r, 0, 6.2832); c.fill();
      }
      if (!still) requestAnimationFrame(draw);
    };
    size(); addEventListener("resize", size);
    cv.parentNode.addEventListener("pointermove", function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    cv.parentNode.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });
    requestAnimationFrame(draw);
  }
  function miniQuiz(qz, QS, base) {
    if (!qz) return; var qi = 0, sc = 0;
    var show = function () {
      if (qi >= QS.length) { qz.innerHTML = '<span class="eyebrow">Result</span><h3>' + sc + " out of " + QS.length + '</h3><div class="cta"><a class="btn y" href="' + base + '#quiz">' + (base === "pocus-gastric.html" ? "Back to the gastric guide" : "Take the full quiz") + '</a><button class="btn" type="button" id="mq-again">Again</button></div>'; $("#mq-again").addEventListener("click", function () { qi = 0; sc = 0; show(); }); return; }
      var Q = QS[qi];
      qz.innerHTML = '<div class="meter"><i style="width:' + (qi / QS.length * 100) + '%"></i></div><span class="eyebrow">Question ' + (qi + 1) + " of " + QS.length + "</span><h3>" + Q.q + '</h3><div class="opts">' + Q.o.map(function (o, i) { return '<button type="button" data-i="' + i + '">' + o + "</button>"; }).join("") + '</div><p id="mq-why" aria-live="polite"></p>';
      $$(".opts button", qz).forEach(function (b) { b.addEventListener("click", function () {
        var ok = +b.getAttribute("data-i") === Q.a; if (ok) sc++;
        $$(".opts button", qz).forEach(function (x, j) { x.disabled = true; if (j === Q.a) x.classList.add("ok"); else if (x === b) x.classList.add("no"); });
        $("#mq-why").innerHTML = (ok ? "<b>Correct.</b> " : "<b>Not quite.</b> ") + Q.w + ' <button class="btn sm y" type="button" id="mq-next" style="margin-left:8px">Next</button>';
        $("#mq-next").addEventListener("click", function () { qi++; show(); });
      }); });
    };
    show();
  }
  P.home = function () {
    if (N.heroImage) { var he = $(".hero"); he.classList.add("photo"); he.style.setProperty("--hero", 'url("' + new URL(N.heroImage, document.baseURI).href + '")'); }
    else network($("#net"));
    var hf = $("#home-figure");
    if (hf) {
      hf.innerHTML = figure(true) + '<p class="figcap" id="figcap">Tap a region of the body</p>';
      $$(".rg", hf).forEach(function (g) {
        var r = region(g.getAttribute("data-r")); g.style.setProperty("--c", r.c);
        var n = N.blocks.filter(function (b) { return b.region === r.id; }).length;
        g.addEventListener("pointerenter", function () { $("#figcap").textContent = r.name + " · " + n + " blocks"; });
        g.addEventListener("click", function () { location.href = "blocks.html#" + r.id; });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter") location.href = "blocks.html#" + r.id; });
      });
    }
    var sb = $("#stat-blocks"); if (sb) sb.textContent = N.blocks.length;
    var sl = $("#stat-langs"); if (sl) sl.textContent = I.order.length;
    var rc = function (n) { return ' <a class="cite" href="interscalene.html#ref-' + n + '">' + n + "</a>"; };
    miniQuiz($("#home-quiz"), [
      { q: "A small nerve is seen inside the middle scalene during an interscalene scan. It is most often the:", o: ["Long thoracic nerve", "Dorsal scapular nerve", "Suprascapular nerve", "Phrenic nerve"], a: 1, w: "The dorsal scapular nerve in 77% of cases; the long thoracic nerve in 23%." + rc(8) },
      { q: "Placing 20 mL of local anaesthetic 4 mm outside the brachial plexus sheath changed hemidiaphragmatic paresis from 90% to:", o: ["71%", "45%", "21%", "5%"], a: 2, w: "21%, with similar analgesia at 24 hours." + rc(10) },
      { q: "Compared with interscalene block, the superior trunk block produced hemidiaphragmatic paralysis in:", o: ["4.8%", "21%", "45%", "71.4%"], a: 0, w: "4.8% against 71.4% in a randomised trial of 126 patients." + rc(5) }
    ], "interscalene.html");
    sono($("#hero-sono"), "interscalene.html");
    var rt = $("#region-tiles");
    if (rt) rt.innerHTML = N.regions.map(function (r) {
      var bs = N.blocks.filter(function (b) { return b.region === r.id; });
      return '<a class="tile region ' + r.cls + '" href="blocks.html#' + r.id + '"><span class="n">' + (bs.length < 10 ? "0" : "") + bs.length + " blocks</span><div><h3>" + r.name + '</h3><p style="margin-top:8px">' + bs.slice(0, 3).map(function (b) { return esc(b.name.replace(/ \(.*/, "")); }).join(" · ") + "</p></div></a>";
    }).join("");
    var up = N.meetings.filter(function (m) { return new Date(m.date + "T23:59:59") >= new Date(); }).sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0];
    var nm = $("#next-meeting"); if (nm) nm.innerHTML = up ? meetingCard(up) : '<p class="empty">The next meeting will be announced here.</p>';
    var lv = $("#home-videos"); if (lv) lv.innerHTML = N.videos.slice(0, 3).map(videoCard).join("");
  };
  P.blocks = function () {
    var slot = $("#bodymap-slot"); if (slot) slot.outerHTML = figure(false);
    var list = $("#block-list"), q = $("#block-q"), fl = $("#block-filters"), cur = (location.hash || "").slice(1);
    if (!region(cur).id) cur = "";
    fl.innerHTML = '<button class="btn sm" data-r="">All regions</button>' + N.regions.map(function (r) { return '<button class="btn sm" data-r="' + r.id + '">' + r.name + "</button>"; }).join("");
    var draw = function () {
      var s = q.value.trim().toLowerCase();
      var hits = N.blocks.filter(function (b) { return (!cur || b.region === cur) && (!s || (b.name + " " + (b.also || "")).toLowerCase().indexOf(s) > -1); });
      list.innerHTML = hits.length ? hits.map(function (b) {
        var r = region(b.region), inner = '<i></i><span><b>' + esc(b.name) + "</b><small>" + r.name + '</small></span><span class="chip ' + (b.page ? "live" : "soon") + '">' + (b.page ? "Open" : "In preparation") + "</span>";
        return b.page ? '<a class="blockrow" style="--c:' + r.c + '" href="' + b.page + '">' + inner + "</a>" : '<div class="blockrow" style="--c:' + r.c + '">' + inner + "</div>";
      }).join("") : '<p class="empty">No block matches that search. Clear the box or choose another region.</p>';
      $$("button", fl).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-r") === cur); });
      $$(".bodymap .rg").forEach(function (g) { g.classList.toggle("on", g.getAttribute("data-r") === cur); });
      $("#block-count").textContent = hits.length + " of " + N.blocks.length + " blocks";
    };
    var set = function (r) { cur = r === cur ? "" : r; try { history.replaceState(null, "", cur ? "#" + cur : location.pathname); } catch (e) {} draw(); };
    fl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { cur = ""; set(b.getAttribute("data-r")); } });
    $$(".bodymap .rg").forEach(function (g) {
      g.style.setProperty("--c", region(g.getAttribute("data-r")).c);
      g.addEventListener("click", function () { set(g.getAttribute("data-r")); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(g.getAttribute("data-r")); } });
    });
    q.addEventListener("input", draw); draw();
  };
  P.block = function () {
    sono($("#block-sono"), "");
    coverage($("#cov"), (window.BLOCK || {}).coverage);
    /* operations table: search and group filter */
    var opq = $("#op-q"), opf = $("#op-filters"), opcat = "";
    if (opq && opf) {
      var opdraw = function () { var q = opq.value.trim().toLowerCase(); $$("#op-table tbody tr").forEach(function (tr) { tr.hidden = !((!opcat || tr.getAttribute("data-cat") === opcat) && (!q || tr.textContent.toLowerCase().indexOf(q) > -1)); }); $$("button", opf).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cat") === opcat); }); };
      opq.addEventListener("input", opdraw);
      opf.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { opcat = b.getAttribute("data-cat"); opdraw(); } });
    }
    var B = window.BLOCK || { cards: [], quiz: [] };
    /* reference pop-ups on citation chips */
    $$("a.cite").forEach(function (a) { var li = $(a.getAttribute("href").replace(/^.*#/, "#")); if (li) a.title = li.textContent.trim().replace(/\s+/g, " ").slice(0, 220); });
    /* stage layout: sections grouped by what the reader is doing */
    (function () {
      var art = $(".doc article"), toc = $(".toc"); if (!art || !toc) return;
      var ST = [["Understand", ["difficulty", "anatomy", "surface", "nerves", "coverage"]], ["Plan", ["indications", "surgery", "contra", "comparison"]], ["Perform", ["ultrasound", "performance", "landmark", "continuous", "video"]], ["Stay safe", ["complications", "pearls"]], ["Evidence", ["literature", "evolving", "references"]], ["Test yourself", ["cards", "quiz"]]];
      var NM = {};
      var COL = ["#35C6B0", "#F6C445", "#FF8A6B", "#FF6B8A", "#9AA9FF", "#B7E36B"], h = "";
      ST.forEach(function (st, i) {
        var items = "";
        st[1].forEach(function (id) {
          var el = document.getElementById(id); if (!el || el.parentNode !== art) return;
          var h2 = $("h2", el); if (h2 && lang === "en" && NM[id]) h2.textContent = NM[id];
          art.appendChild(el); items += '<a href="#' + id + '">' + (h2 ? h2.textContent : id) + "</a>";
        });
        if (items) h += '<div class="stg" style="--c:' + COL[i] + '"><b>' + st[0] + "</b>" + items + "</div>";
      });
      toc.innerHTML = h; toc.classList.add("stages"); toc.setAttribute("aria-label", "Block map"); $(".doc").classList.add("staged");
    })();
    /* contents spy */
    var links = $$(".toc a"), secs = links.map(function (a) { return $(a.getAttribute("href")); });
    var spy = function () { var y = scrollY + 130, k = 0; secs.forEach(function (s, i) { if (s && s.offsetTop <= y) k = i; }); links.forEach(function (a, i) { a.classList.toggle("on", i === k); }); };
    addEventListener("scroll", spy, { passive: true }); spy();
    /* evidence bars */
    $$(".barrow").forEach(function (b) { b.addEventListener("click", function () { $$(".barrow").forEach(function (x) { x.classList.toggle("on", x === b); }); $("#bar-note").innerHTML = b.getAttribute("data-note"); }); });
    /* flashcards */
    var fc = $("#flash"), fi = 0;
    var showCard = function () { var c = B.cards[fi]; fc.classList.remove("flip"); $(".a p", fc).textContent = c.q; $(".b p", fc).innerHTML = c.a; $("#flash-n").textContent = (fi + 1) + " / " + B.cards.length; };
    if (fc && B.cards.length) {
      fc.addEventListener("click", function (e) { if (!e.target.closest("a")) fc.classList.toggle("flip"); });
      $("#flash-next").addEventListener("click", function () { fi = (fi + 1) % B.cards.length; showCard(); });
      $("#flash-prev").addEventListener("click", function () { fi = (fi + B.cards.length - 1) % B.cards.length; showCard(); });
      showCard();
    }
    /* quiz */
    var qz = $("#quiz"), qi = 0, sc = 0;
    var showQ = function () {
      if (qi >= B.quiz.length) {
        var best = Math.max(sc, store.get("quiz." + B.id, 0)); store.set("quiz." + B.id, best);
        qz.innerHTML = '<span class="eyebrow">Result</span><h3>' + sc + " out of " + B.quiz.length + "</h3><p>Your best score on this device: " + best + " / " + B.quiz.length + '.</p><div class="cta"><button class="btn y" type="button" id="quiz-again">Try again</button></div>';
        $("#quiz-again").addEventListener("click", function () { qi = 0; sc = 0; showQ(); }); return;
      }
      var Q = B.quiz[qi];
      qz.innerHTML = '<div class="meter"><i style="width:' + (qi / B.quiz.length * 100) + '%"></i></div><span class="eyebrow">Question ' + (qi + 1) + " of " + B.quiz.length + "</span><h3>" + Q.q + '</h3><div class="opts">' + Q.o.map(function (o, i) { return '<button type="button" data-i="' + i + '">' + o + "</button>"; }).join("") + '</div><p id="quiz-why" aria-live="polite"></p>';
      $$(".opts button", qz).forEach(function (b) {
        b.addEventListener("click", function () {
          var i = +b.getAttribute("data-i"), ok = i === Q.a; if (ok) sc++;
          $$(".opts button", qz).forEach(function (x, j) { x.disabled = true; if (j === Q.a) x.classList.add("ok"); else if (x === b) x.classList.add("no"); });
          $("#quiz-why").innerHTML = (ok ? "<b>Correct.</b> " : "<b>Not quite.</b> ") + Q.w + ' <button class="btn sm k" type="button" id="quiz-next" style="margin-left:8px">' + (qi + 1 < B.quiz.length ? "Next question" : "See result") + "</button>";
          $("#quiz-next").addEventListener("click", function () { qi++; showQ(); }); $("#quiz-next").focus();
        });
      });
    };
    if (qz && B.quiz.length) showQ();
  };
  P.videos = function () {
    var g = $("#video-grid"), fl = $("#video-filters"), cur = "";
    var draw = function () {
      var v = N.videos.filter(function (x) { return !cur || x.type === cur; });
      g.innerHTML = v.length ? v.map(videoCard).join("") : '<p class="empty">No videos of this type yet.</p>';
      $$("button", fl).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-t") === cur); });
    };
    fl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { cur = b.getAttribute("data-t"); draw(); } });
    var yt = $("#yt-channel"); if (yt && N.youtubeChannel) { yt.href = N.youtubeChannel; yt.hidden = false; }
    draw();
  };
  P.cadaver = function () {
    var gate = $("#gate"), room = $("#gallery-room"), g = $("#gallery");
    var enter = function () { gate.hidden = true; room.hidden = false; };
    if (store.get("gate", false)) enter();
    $("#gate-yes").addEventListener("click", function () { store.set("gate", true); enter(); });
    g.innerHTML = N.gallery.map(function (im, i) {
      var r = region(im.region);
      return '<button type="button" data-i="' + i + '"><span class="im">' + (im.src ? '<img loading="lazy" src="' + esc(im.src) + '" alt="' + esc(im.title) + '">' : '<span class="ph">Dissection image to be added</span>') + '</span><span class="capt"><b>' + esc(im.title) + '</b><br><small class="crumb">' + r.name + "</small></span></button>";
    }).join("");
    var cur, lab = false, img = $("#lb-img"), tg = $("#lb-toggle");
    g.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return; cur = N.gallery[+b.getAttribute("data-i")]; if (!cur.src) return;
      lab = false; img.src = cur.src; img.alt = cur.title; $("#lb-cap").innerHTML = "<b>" + esc(cur.title) + "</b> " + esc(cur.caption || "");
      tg.hidden = !cur.labelled; tg.textContent = "Show labels"; window.NORAopen("#ov-img");
    });
    tg.addEventListener("click", function () { lab = !lab; img.src = lab ? cur.labelled : cur.src; tg.textContent = lab ? "Hide labels" : "Show labels"; });
  };
  P.meetings = function () {
    var now = new Date(), up = [], past = [];
    N.meetings.forEach(function (m) { (new Date(m.date + "T23:59:59") >= now ? up : past).push(m); });
    $("#meet-up").innerHTML = up.length ? up.map(meetingCard).join("") : '<p class="empty">No meetings are open for booking at the moment.</p>';
    $("#meet-past").innerHTML = past.length ? past.map(meetingCard).join("") : '<p class="empty">Recordings and programmes from past meetings will be listed here.</p>';
  };
  P.surgery = function () {
    var S = N.surgeries || [], list = $("#surg-list"), q = $("#surg-q"), fl = $("#surg-filters"), cur = (location.hash || "").slice(1);
    if (!region(cur).id) cur = "";
    var NAME = { chest: "Thorax and breast" };
    fl.innerHTML = '<button class="btn sm" data-r="">All regions</button>' + N.regions.filter(function (r) { return S.some(function (x) { return x.region === r.id; }); }).map(function (r) { return '<button class="btn sm" data-r="' + r.id + '">' + (NAME[r.id] || r.name) + "</button>"; }).join("");
    var draw = function () {
      var s = q.value.trim().toLowerCase(), html = "", n = 0;
      N.regions.forEach(function (r) {
        if (cur && cur !== r.id) return;
        var groups = {}, order = [];
        S.forEach(function (x) { if (x.region !== r.id) return; if (s && (x.op + " " + x.group + " " + x.blocks.map(function (b) { return b.name; }).join(" ")).toLowerCase().indexOf(s) < 0) return; if (!groups[x.group]) { groups[x.group] = []; order.push(x.group); } groups[x.group].push(x); n++; });
        if (!order.length) return;
        html += '<h2 class="surg-h" style="--c:' + r.c + '">' + (NAME[r.id] || r.name) + "</h2>";
        order.forEach(function (gname) {
          html += '<h3 class="surg-g">' + esc(gname) + '</h3><div class="tscroll"><table><thead><tr><th>Operation</th><th>Blocks to consider</th></tr></thead><tbody>' + groups[gname].map(function (x) {
            var bl = x.blocks.length ? x.blocks.map(function (b) { return b.page ? '<a class="chip live" href="' + b.page + '">' + esc(b.name) + "</a>" : '<span class="chip">' + esc(b.name) + "</span>"; }).join(" ") + (x.more ? ' <a class="cite" href="' + x.more + '">evidence</a>' : "") : '<span class="chip soon">Block choice being referenced</span>';
            return "<tr><td><b>" + esc(x.op) + "</b></td><td>" + bl + "</td></tr>";
          }).join("") + "</tbody></table></div>";
        });
      });
      list.innerHTML = html || '<p class="empty">No operation matches that search.</p>';
      $("#surg-count").textContent = n + " of " + S.length + " operations";
      $$("button", fl).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-r") === cur); });
    };
    fl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { cur = b.getAttribute("data-r"); try { history.replaceState(null, "", cur ? "#" + cur : location.pathname); } catch (er) {} draw(); } });
    q.addEventListener("input", draw); draw();
  };
  P.practice = function () {
    var w = $("#lipid-w"), sel = $("#lipid-sel"), o = $("#lipid-out"); if (!w || !o) return;
    var r = function (x) { return Math.round(x).toLocaleString("en-GB"); };
    var go = function () {
      var v = parseFloat(w.value);
      if (!(v > 0)) { o.innerHTML = '<p class="lede">Enter a weight.</p>'; return; }
      var small = v < 70, bolus = small ? 1.5 * v : 100;
      var step = function (n, big, label, text) { return '<div class="rc-step"><span class="rc-n">' + n + '</span><div><div class="big">' + big + "</div><b>" + label + "</b><p>" + text + "</p></div></div>"; };
      o.innerHTML =
        step(1, r(bolus) + " mL", "Give now: bolus", "Over 2 to 3 minutes" + (small ? " (1.5 mL/kg)." : " (fixed dose at 70 kg and above).")) +
        step(2, small ? (0.25 * v).toFixed(1) + " mL/min" : "200 to 250 mL", "Then: infusion", small ? "0.25 mL/kg/min, until the circulation is stable or the maximum is reached." : "Given over 15 to 20 minutes.") +
        step(3, r(bolus) + " mL × 2", "If still unstable", "Repeat the bolus up to two more times, or raise the infusion to " + (0.5 * v).toFixed(1) + " mL/min (0.5 mL/kg/min).") +
        step(4, r(12 * v) + " mL", "Do not exceed", "Maximum total dose, 12 mL/kg.");
    };
    $("#lipid-form").addEventListener("submit", function (e) { e.preventDefault(); });
    w.addEventListener("input", function () { go(); });
    sel.addEventListener("change", function () { w.value = sel.value; go(); });
    go();
  };
  P.basics = function () {
    var DEF = { depth: [2.5, 6.5, 0.1, 5.5, "Depth", " cm"], freq: [0, 1, 0.01, 0.3, "Frequency", ""], gain: [0.05, 0.95, 0.01, 0.25, "Gain", ""], tgc: [0, 1, 0.01, 0.2, "Time-gain compensation", ""], focus: [0.4, 3.6, 0.05, 0.8, "Focus", " cm"], tilt: [0, 15, 0.5, 0, "Probe tilt", "°"], angle: [10, 65, 1, 20, "Needle angle", "°"] };
    $$(".usim").forEach(function (box) {
      var cv = $("canvas", box), ctx = cv.getContext("2d"), cw = $(".usim-c", box), keys = box.getAttribute("data-controls").split(","), st = { doppler: false }, ph = 0;
      keys.forEach(function (k) {
        if (k === "doppler") { cw.insertAdjacentHTML("beforeend", '<label class="check"><input type="checkbox" data-k="doppler"> <span>Colour Doppler</span></label>'); return; }
        var d = DEF[k]; st[k] = d[3];
        cw.insertAdjacentHTML("beforeend", '<label><span>' + d[4] + '</span><input type="range" data-k="' + k + '" min="' + d[0] + '" max="' + d[1] + '" step="' + d[2] + '" value="' + d[3] + '"><output></output></label>');
      });
      var paint = function () {
        var o = { depth: st.depth || 4, freq: st.freq == null ? 0.78 : st.freq, gain: st.gain == null ? 0.5 : st.gain, tgc: st.tgc == null ? 1 : st.tgc, tilt: st.tilt || 0, doppler: st.doppler, phase: ph };
        if (st.focus != null) o.focus = st.focus;
        if (st.angle != null) o.needle = { x: 3.08, d: 2.3, angle: st.angle, len: 4, tip: true };
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cv.width, cv.height); window.USIM.draw(ctx, 0, 0, cv.width, cv.height, o);
        $$("input[type=range]", cw).forEach(function (r) { var d = DEF[r.getAttribute("data-k")]; r.nextElementSibling.textContent = d[5] ? (+r.value).toFixed(d[2] < 1 ? 1 : 0) + d[5] : Math.round((+r.value - d[0]) / (d[1] - d[0]) * 100) + "%"; });
      };
      cw.addEventListener("input", function (e) { var k = e.target.getAttribute("data-k"); st[k] = e.target.type === "checkbox" ? e.target.checked : +e.target.value; paint(); });
      paint(); setInterval(function () { if (document.hidden) return; ph = (ph + 0.06) % 1; paint(); }, 80);
    });
  };
  P.publications = function () {
    var L = N.publications || [];
    $("#pub-list").innerHTML = L.map(function (r) {
      return '<article class="tile pub">' + (r.cover ? '<img src="' + esc(r.cover) + '" alt="Cover of ' + esc(r.title) + '" loading="lazy">' : '<div class="pub-ph" aria-hidden="true"><span>NORA<sup>2</sup></span></div>') + '<div><span class="chip">' + esc(r.status || "Book") + "</span><h3>" + esc(r.title) + "</h3><p>" + esc(r.authors || "") + "</p><p>" + esc(r.summary || "") + "</p>" + (r.url ? '<p class="cta"><a class="btn sm y" href="' + esc(r.url) + '" rel="noopener">' + esc(r.linkText || "Find the book") + "</a></p>" : "") + "</div></article>";
    }).join("");
  };
  P.research = function () {
    var L = N.research || [];
    var card = function (r) {
      return '<article class="tile"><span class="n">' + esc(r.status || "Research") + (r.funder ? " · " + esc(r.funder) : "") + "</span><h3>" + esc(r.title) + "</h3><p>" + esc(r.summary || "") + "</p>" +
        (r.team ? '<p class="note" style="margin-top:10px">Review team: ' + esc(r.team) + "</p>" : "") + (r.reg ? '<p class="note">Registration ' + esc(r.reg) + (r.registered ? ", " + esc(r.registered) : "") + "</p>" : "") +
        (r.url ? '<p style="margin-top:12px"><a class="btn sm y" href="' + esc(r.url) + '" rel="noopener">' + esc(r.linkText || "Read more") + "</a></p>" : "") + "</article>";
    };
    var on = L.filter(function (r) { return r.group !== "published"; }), pub = L.filter(function (r) { return r.group === "published"; });
    $("#research-ongoing").innerHTML = on.length ? on.map(card).join("") : '<p class="empty">Ongoing studies and registrations will be listed here.</p>';
    $("#research-published").innerHTML = pub.length ? pub.map(card).join("") : '<p class="empty">Published papers from the alliance will be listed here.</p>';
  };
  P.blog = function () {
    var L = (N.posts || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    $("#post-list").innerHTML = L.length ? L.map(function (r) {
      return '<article class="tile"><span class="n">' + esc(r.date || "") + (r.author ? " · " + esc(r.author) : "") + "</span><h3>" + esc(r.title) + "</h3><p>" + esc(r.summary || "") + "</p>" + (r.url ? '<a href="' + esc(r.url) + '" rel="noopener">Read the post</a>' : "") + "</article>";
    }).join("") : '<p class="empty">The first posts are being written.</p>';
  };
  P.about = function () {
    var c = $("#contact"); if (c && N.contactEmail) c.innerHTML = 'Write to <a href="mailto:' + esc(N.contactEmail) + '">' + esc(N.contactEmail) + "</a>.";
  };

  /* ---------- dose data shared by the calculator and the audit tool ----------
     Table 1, El-Boghdadly, Pawa and Chin 2018. [mg/kg, ceiling mg] plain, then with adrenaline. */
  var DOSE = {
    bupivacaine: { n: "Bupivacaine", p: [2, 175], e: [3, 225], conc: [0.25, 0.375, 0.5] },
    levobupivacaine: { n: "Levobupivacaine", p: [2, 200], e: [3, 225], conc: [0.125, 0.25, 0.375, 0.5] },
    ropivacaine: { n: "Ropivacaine", p: [3, 200], e: [3, 250], conc: [0.2, 0.375, 0.5, 0.75] },
    lidocaine: { n: "Lidocaine", p: [5, 350], e: [7, 500], conc: [0.5, 1, 1.5, 2] },
    mepivacaine: { n: "Mepivacaine", p: [5, 350], e: [7, 500], conc: [1, 1.5, 2] }
  };
  /* Janmahasatian et al. 2005: lean body weight from sex, weight (kg) and height (cm) */
  /* Dosing weight: actual body weight, switching to lean body weight at BMI 40 or more */
  function dosingWeight(w, h, male) { var bmi = w && h ? w / Math.pow(h / 100, 2) : 0, lbw = leanWeight(w, h, male), lean = bmi >= 40; return { bmi: bmi, lbw: lbw, lean: lean, dw: lean ? Math.min(lbw, w) : w }; }
  function dwText(d, w, f) { return d.lean ? "(lean body weight, because BMI is " + f(d.bmi, 1) + "; actual " + f(w, 1) + " kg)" : d.bmi ? "(actual body weight; BMI " + f(d.bmi, 1) + ")" : "(actual body weight)"; }
  function dwNote(d) { return !d.bmi ? '<p class="warn">Add the height. At a BMI of 40 or more the calculator switches to lean body weight, because actual weight overestimates the dose.</p>' : d.bmi >= 30 && !d.lean ? '<p class="warn">BMI 30 to 39.9: actual body weight is used and the ceiling dose will often be the limit. Consider a lower dose in a short or frail patient.</p>' : ""; }
  function leanWeight(w, h, male) { if (!(w && h)) return 0; var bmi = w / Math.pow(h / 100, 2); return 9270 * w / ((male ? 6680 : 8780) + (male ? 216 : 244) * bmi); }
  function doseMax(key, epi, wt) { var L = epi ? DOSE[key].e : DOSE[key].p; return Math.min(L[0] * wt, L[1]); }

  /* ---------- audit tool: total local anaesthetic per case ---------- */
  P.audit = function () {
    var cases = store.get("audit", []), inj = [{ block: "", drug: "levobupivacaine", conc: 0.25, vol: 20 }];
    var rows = $("#a-rows"), out = $("#a-now"), tb = $("#a-table"), sum = $("#a-sum");
    var opts = function (sel) { return Object.keys(DOSE).map(function (k) { return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + DOSE[k].n + "</option>"; }).join(""); };
    var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; };
    var f1 = function (x) { return (Math.round(x * 10) / 10).toLocaleString("en-GB"); };
    var med = function (a) { if (!a.length) return 0; a = a.slice().sort(function (x, y) { return x - y; }); var m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
    var drawRows = function () {
      rows.innerHTML = inj.map(function (r, i) { return '<div class="prow" data-i="' + i + '"><input aria-label="Block or infiltration" list="block-names" placeholder="Block or infiltration" value="' + esc(r.block) + '" data-k="block"><select aria-label="Drug" data-k="drug">' + opts(r.drug) + '</select><input aria-label="Concentration, percent" type="number" inputmode="decimal" step="0.005" min="0" value="' + esc(r.conc) + '" data-k="conc"><input aria-label="Volume, mL" type="number" inputmode="decimal" step="1" min="0" value="' + esc(r.vol) + '" data-k="vol"><output></output><button class="btn sm" type="button" data-del>Remove</button></div>'; }).join("");
    };
    var current = function () {
      var w = num("#a-w"), h = num("#a-h"), male = $("#a-sex").value === "m", DW = dosingWeight(w, h, male), lbw = DW.lean ? DW.dw : 0, dw = DW.dw, epi = $("#a-epi").checked, vol = 0, frac = 0, mg = 0;
      inj.forEach(function (r, i) { var m = (parseFloat(r.conc) || 0) * 10 * (parseFloat(r.vol) || 0); mg += m; vol += parseFloat(r.vol) || 0; if (dw) frac += m / doseMax(r.drug, epi, dw); var o = $$(".prow output", rows)[i]; if (o) o.textContent = f1(m) + " mg"; });
      return { date: $("#a-date").value, op: $("#a-op").value.trim(), sex: male ? "M" : "F", w: w, h: h, lbw: lbw, epi: epi, vol: vol, mg: mg, pct: frac * 100, mgkg: dw ? mg / dw : 0, inj: JSON.parse(JSON.stringify(inj)) };
    };
    var live = function () {
      var c = current();
      out.innerHTML = c.w ? '<span class="eyebrow">This case</span><div class="big">' + f1(c.vol) + ' mL</div><p>' + f1(c.mg) + " mg in total, " + f1(c.mgkg) + " mg/kg of " + (c.lbw ? "lean" : "actual") + " body weight.</p><div class=\"gauge " + (c.pct > 100 ? "over" : c.pct > 80 ? "near" : "ok") + '"><i style="width:' + Math.min(c.pct, 100) + '%"></i></div><p><b>' + Math.round(c.pct) + "%</b> of the suggested maximum.</p>" : '<p class="lede">Enter the weight to see the totals.</p>';
    };
    var table = function () {
      tb.innerHTML = cases.length ? cases.map(function (c, i) { return "<tr><td>" + (i + 1) + "</td><td>" + esc(c.date) + "</td><td>" + esc(c.op) + "</td><td>" + esc(c.inj.map(function (r) { return (r.block || "Injection") + " " + r.vol + " mL " + r.conc + "%"; }).join("; ")) + "</td><td>" + f1(c.vol) + "</td><td>" + f1(c.mg) + "</td><td>" + f1(c.mgkg) + '</td><td><span class="chip ' + (c.pct > 100 ? "rct" : "live") + '">' + Math.round(c.pct) + '%</span></td><td><button class="btn sm" type="button" data-rm="' + i + '">Delete</button></td></tr>'; }).join("") : '<tr><td colspan="9">No cases recorded on this device yet.</td></tr>';
      var over = cases.filter(function (c) { return c.pct > 100; }).length;
      sum.innerHTML = [[cases.length, "cases recorded"], [f1(med(cases.map(function (c) { return c.vol; }))) + " mL", "median total volume"], [f1(med(cases.map(function (c) { return c.mgkg; }))), "median mg/kg"], [cases.length ? Math.round((cases.length - over) / cases.length * 100) + "%" : "0%", "within the suggested maximum"]].map(function (x) { return '<div class="fact"><div class="big">' + x[0] + "</div><p>" + x[1] + "</p></div>"; }).join("");
    };
    var csv = function () {
      return ["case,date,operation,sex,weight_kg,height_cm,lean_weight_kg,adrenaline,injections,total_volume_ml,total_dose_mg,mg_per_kg,percent_of_maximum"].concat(cases.map(function (c, i) {
        return [i + 1, c.date, '"' + (c.op || "").replace(/"/g, "'") + '"', c.sex, c.w, c.h || "", c.lbw ? c.lbw.toFixed(1) : "", c.epi ? "yes" : "no", '"' + c.inj.map(function (r) { return (r.block || "Injection") + " " + DOSE[r.drug].n + " " + r.conc + "% " + r.vol + " mL"; }).join("; ").replace(/"/g, "'") + '"', c.vol, c.mg.toFixed(1), c.mgkg.toFixed(2), c.pct.toFixed(0)].join(",");
      })).join("\n");
    };
    $("#a-date").value = new Date().toISOString().slice(0, 10);
    $("#block-names").innerHTML = N.blocks.map(function (b) { return '<option value="' + esc(b.name) + '">'; }).join("") + '<option value="Surgical infiltration">';
    $("#a-form").addEventListener("input", function (e) { var el = e.target.closest(".prow"); if (el) inj[+el.getAttribute("data-i")][e.target.getAttribute("data-k")] = e.target.value; live(); });
    $("#a-form").addEventListener("submit", function (e) { e.preventDefault(); });
    $("#a-form").addEventListener("click", function (e) {
      if (e.target.closest("[data-del]")) { if (inj.length > 1) inj.splice(+e.target.closest(".prow").getAttribute("data-i"), 1); drawRows(); live(); }
      if (e.target.id === "a-add") { inj.push({ block: "", drug: inj[inj.length - 1].drug, conc: inj[inj.length - 1].conc, vol: 20 }); drawRows(); live(); }
      if (e.target.id === "a-save") { var c = current(); if (!c.w) { $("#a-msg").textContent = "Enter the patient's weight before saving."; return; } cases.push(c); store.set("audit", cases); $("#a-msg").textContent = "Case " + cases.length + " saved on this device."; table(); }
    });
    tb.addEventListener("click", function (e) { var b = e.target.closest("[data-rm]"); if (b) { cases.splice(+b.getAttribute("data-rm"), 1); store.set("audit", cases); table(); } });
    $("#a-csv").addEventListener("click", function () {
      var text = csv(), box = $("#a-csvbox"); box.hidden = false; box.value = text;
      try { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" })); a.download = "local-anaesthetic-audit.csv"; a.click(); } catch (er) {}
      try { navigator.clipboard.writeText(text).then(function () { $("#a-msg2").textContent = "Copied. Paste into Excel, or use the downloaded file."; }, function () { $("#a-msg2").textContent = "Select the text in the box and copy it into Excel."; }); } catch (er2) { $("#a-msg2").textContent = "Select the text in the box and copy it into Excel."; }
    });
    drawRows(); live(); table();
  };

  /* ---------- dose calculator ---------- */
  /* ---------- breast surgery: blocks by operation and volume check ---------- */
  var BREAST = {
    blocks: { pvb: ["Thoracic paravertebral block", 20], ipp: ["Interpectoral plane block (PECS I)", 10], psp: ["Pectoserratus plane block (second injection of PECS II)", 20], sap: ["Serratus anterior plane block", 20], esp: ["Erector spinae plane block", 20], tap: ["Transversus abdominis plane block, donor site, each side", 20], scp: ["Superficial cervical plexus block", 10], pst: ["Parasternal intercostal plane block", 15], icb: ["Intercostobrachial nerve block", 5] },
    plans: { pvb: ["Paravertebral", ["pvb"]], pecs: ["PECS II", ["ipp", "psp"]], sap: ["Serratus anterior plane", ["sap"]], esp: ["Erector spinae plane", ["esp"]], inf: ["Infiltration only", []] },
    ops: [
      ["awake", "Awake mastectomy (no general anaesthetic)", ["pvb", "sap"], 0, "a", 0, ["scp", "pst"], ["icb"]],
      ["mast", "Mastectomy", ["pvb", "pecs", "sap", "esp"], 0, "c"],
      ["mastanc", "Mastectomy with axillary node clearance", ["pvb", "pecs", "sap"], 0, "c"],
      ["wleidc", "Wide local excision for invasive ductal carcinoma", ["pecs", "sap", "inf"], 0, "c"],
      ["wledcis", "Wide local excision for ductal carcinoma in situ", ["pecs", "sap", "inf"], 0, "c"],
      ["slnb", "Sentinel lymph node biopsy", ["inf", "sap", "pecs"], 0, "c"],
      ["anc", "Axillary node clearance", ["pecs", "sap", "pvb"], 0, "c"],
      ["tram", "TRAM flap reconstruction", ["pvb", "pecs"], 1, "f"],
      ["diep", "DIEP flap reconstruction", ["pvb", "pecs"], 1, "f"],
      ["ld", "Latissimus dorsi flap reconstruction", ["pvb", "esp", "sap"], 0, "x"],
      ["implant", "Implant-based reconstruction or tissue expander", ["pecs", "pvb"], 0, "i"],
      ["aug", "Breast augmentation with implants", ["pecs", "pvb"], 0, "i", 1],
      ["exch", "Implant exchange or removal, including ruptured implant", ["pecs", "inf"], 0, "i"],
      ["reduc", "Breast reduction", ["pvb", "pecs", "inf"], 0, "x", 1]
    ],
    ev: { a: 'Surgery under regional anaesthesia alone needs every nerve territory of the breast covered: the supraclavicular nerves from the cervical plexus above, the lateral and anterior branches of the intercostal nerves, and the intercostobrachial nerve when the axilla is involved. This combination is the NORA² approach of Dr Arun Mohanraj FRCA EDRA; it is not taken from a guideline.',
      c: 'Oncological breast surgery: paravertebral block or pectoral nerves block, with or without wound infiltration, is recommended for major surgery.<a class="cite" href="#ref-1">1</a> PECS II gives analgesia comparable to paravertebral block.<a class="cite" href="#ref-2">2</a><a class="cite" href="#ref-3">3</a> The benefit of erector spinae plane block over systemic analgesia was judged not clinically important.<a class="cite" href="#ref-7">7</a>',
      f: 'Chest: as for mastectomy.<a class="cite" href="#ref-1">1</a> Abdominal donor site: transversus abdominis plane block reduced early morphine use in a randomised trial of abdominal flap reconstruction.<a class="cite" href="#ref-8">8</a>',
      i: 'The pectoral nerves blocks were described for tissue expanders and subpectoral implants, where stretching of the pectoral muscles is the main source of pain.<a class="cite" href="#ref-5">5</a> Block choice otherwise follows the breast cancer surgery evidence.<a class="cite" href="#ref-1">1</a>',
      x: 'No procedure-specific guideline is cited here; the choice is extrapolated from the breast cancer surgery evidence.<a class="cite" href="#ref-1">1</a><a class="cite" href="#ref-4">4</a>' }
  };
  P.breast = function () {
    var optOn = {};
    var B = BREAST, f = $("#bb-form"), out = $("#bb-out"), rows = $("#bb-rows"), vols = {}, inf = 0, plan = "";
    var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; };
    var fmt = function (x, d) { var m = Math.pow(10, d || 0); return (Math.round(x * m) / m).toLocaleString("en-GB"); };
    var op = function () { var id = $("#bb-op").value; return B.ops.filter(function (o) { return o[0] === id; })[0]; };
    $("#bb-op").innerHTML = B.ops.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join("");
    $("#bb-drug").innerHTML = Object.keys(DOSE).map(function (k) { return '<option value="' + k + '"' + (k === "levobupivacaine" ? " selected" : "") + ">" + DOSE[k].n + "</option>"; }).join("");
    $("#bb-table").innerHTML = B.ops.map(function (o) { return "<tr><td><b>" + o[1] + "</b></td><td>" + o[2].map(function (k, i) { return '<span class="chip' + (i ? "" : " live") + '">' + B.plans[k][0] + "</span>"; }).join(" ") + (o[3] ? ' <span class="chip">+ TAP, donor site</span>' : "") + (o[6] || []).map(function (k) { return ' <span class="chip live">+ ' + B.blocks[k][0] + "</span>"; }).join("") + (o[7] || []).map(function (k) { return ' <span class="chip">± ' + B.blocks[k][0] + "</span>"; }).join("") + "</td><td>" + B.ev[o[4]] + "</td></tr>"; }).join("");
    var setOp = function () {
      var o = op(); plan = o[2][0]; $("#bb-both").checked = !!o[5]; optOn = {};
      $("#bb-plans").innerHTML = o[2].map(function (k, i) { return '<button class="btn sm" type="button" data-plan="' + k + '" aria-pressed="' + (i === 0) + '">' + B.plans[k][0] + (i === 0 ? " · first listed" : "") + "</button>"; }).join("");
      $("#bb-ev").innerHTML = B.ev[o[4]]; drawRows();
    };
    var listFor = function () { var o = op(), l = (o[6] || []).concat(B.plans[plan][1]); (o[7] || []).forEach(function (k) { if (optOn[k]) l.push(k); }); if (o[3]) l.push("tap"); return l; };
    var drawRows = function () {
      var o = op(), list = (o[6] || []).concat(B.plans[plan][1]).concat(o[7] || []); if (o[3]) list.push("tap");
      rows.innerHTML = list.map(function (k) { if (vols[k] == null) vols[k] = B.blocks[k][1]; var isOpt = (o[7] || []).indexOf(k) >= 0;
        return '<div class="bbrow"><span>' + (isOpt ? '<label class="bbopt"><input type="checkbox" data-opt="' + k + '"' + (optOn[k] ? " checked" : "") + "> " + B.blocks[k][0] + " (optional)</label>" : B.blocks[k][0]) + '</span><input type="number" inputmode="decimal" min="0" step="1" value="' + vols[k] + '" data-k="' + k + '" aria-label="Volume in mL, ' + B.blocks[k][0] + '"><output data-o="' + k + '"></output></div>'; }).join("") +
        '<div class="bbrow"><span>Surgeon\u2019s wound infiltration, total</span><input type="number" inputmode="decimal" min="0" step="1" value="' + inf + '" data-k="inf" aria-label="Volume in mL, wound infiltration"><output data-o="inf"></output></div>';
      $$("[data-plan]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-plan") === plan); });
      calc();
    };
    var calc = function () {
      var w = num("#bb-w"), h = num("#bb-h"), male = $("#bb-sex").value === "m", key = $("#bb-drug").value, conc = num("#bb-conc"), epi = $("#bb-epi").checked, red = +$("#bb-red").value, both = $("#bb-both").checked;
      $("#bb-conc-list").innerHTML = DOSE[key].conc.map(function (c) { return '<option value="' + c + '">'; }).join("");
      if (!w || !conc) { out.innerHTML = '<p class="lede">Enter the weight and the concentration to see the limit.</p>'; return; }
      var DW = dosingWeight(w, h, male), dw = DW.dw, max = doseMax(key, epi, dw) * (1 - red / 100), maxVol = max / (conc * 10), L = epi ? DOSE[key].e : DOSE[key].p;
      var o = op(), list = listFor(), tot = 0;
      $$("output[data-o]", rows).forEach(function (el) { el.textContent = "not counted"; });
      list.forEach(function (k) { var sides = k === "tap" ? 2 : (both ? 2 : 1), v = (parseFloat(vols[k]) || 0) * sides; tot += v; var el = $('[data-o="' + k + '"]', rows); if (el) el.textContent = (sides === 2 ? "× 2 sides = " : "") + fmt(v, 1) + " mL"; });
      var blk = tot, left = maxVol - blk; tot += parseFloat(inf) || 0; var ie = $('[data-o="inf"]', rows); if (ie) ie.textContent = fmt(parseFloat(inf) || 0, 1) + " mL";
      var mg = tot * conc * 10, pct = max ? mg / max * 100 : 0, cls = pct > 100 ? "over" : pct > 80 ? "near" : "ok", fit = tot ? max / tot / 10 : 0;
      out.innerHTML = '<span class="eyebrow">' + DOSE[key].n + " " + conc + "%" + (epi ? " with adrenaline" : "") + '</span><div class="big">' + fmt(maxVol, 1) + ' mL</div><p>is the most that can be given in total, across every block and the surgeon’s infiltration (' + fmt(max) + " mg).</p>" +
        '<p class="bbleft ' + (left < 0 ? "over" : "") + '"><b>' + (left >= 0 ? fmt(left, 1) + " mL" : "Nothing") + "</b> " + (left >= 0 ? "of " + DOSE[key].n.toLowerCase() + " " + conc + "% is left for the surgeon\u2019s infiltration after " + fmt(blk, 1) + " mL of blocks." : "is left for the surgeon: the blocks alone are " + fmt(-left, 1) + " mL over the limit.") + "</p>" +
        '<div class="gauge ' + cls + '"><i style="width:' + Math.min(pct, 100) + '%"></i></div>' +
        "<p><b>This plan: " + fmt(tot, 1) + " mL = " + fmt(mg) + " mg, " + fmt(pct) + "% of the maximum.</b> " + (pct > 100 ? "This exceeds the limit by " + fmt(tot - maxVol, 1) + " mL. Reduce a volume, or dilute." : pct > 80 ? "Close to the limit: little room is left for top-ups." : "Within the limit, with " + fmt(maxVol - tot, 1) + " mL to spare.") + "</p>" +
        (tot ? "<p>For " + fmt(tot, 1) + " mL in total, the strongest concentration within the limit is <b>" + fmt(fit, 3) + "%</b>.</p>" : "") +
        '<dl class="work"><div><dt>Dosing weight</dt><dd>' + fmt(dw, 1) + " kg " + dwText(DW, w, fmt) + "</dd></div><div><dt>Weight-based limit</dt><dd>" + L[0] + " mg/kg × " + fmt(dw, 1) + " kg = " + fmt(L[0] * dw) + " mg</dd></div><div><dt>Ceiling</dt><dd>" + L[1] + " mg" + (L[0] * dw > L[1] ? " (this is the limit that applies)" : "") + "</dd></div>" + (red ? "<div><dt>Risk-factor reduction</dt><dd>" + red + "% taken off</dd></div>" : "") + "</dl>" +
        dwNote(DW) +
        (pct > 100 ? '<p class="warn">Over the suggested maximum. Do not proceed with this plan as entered.</p>' : "");
    };
    f.addEventListener("input", function (e) { if (e.target.id === "bb-op") { setOp(); return; } var k = e.target.getAttribute("data-k"); if (k === "inf") inf = e.target.value; else if (k) vols[k] = e.target.value; calc(); });
    f.addEventListener("change", function (e) { var k = e.target.getAttribute("data-opt"); if (k) { optOn[k] = e.target.checked; } calc(); });
    f.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#bb-plans").addEventListener("click", function (e) { var b = e.target.closest("[data-plan]"); if (!b) return; plan = b.getAttribute("data-plan"); drawRows(); });
    var hsh = (location.hash || "").slice(1); if (hsh && B.ops.some(function (o) { return o[0] === hsh; })) $("#bb-op").value = hsh;
    setOp();
  };
  P.pocus = function () {
    if (li >= 0 && /gastric/.test(location.pathname)) { var ph = $(".pagehead"), nt = TX["The gastric POCUS pages are shown in English until the text has been signed off; translations will follow."]; if (ph && nt) ph.insertAdjacentHTML("beforeend", '<p class="note" style="margin-top:10px">' + nt[li] + "</p>"); }
    var out = $("#gv-out");
    if (out) {
      var f1 = function (x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); };
      var run = function () {
        var age = +$("#gv-age").value, w = +$("#gv-w").value, h = +$("#gv-h").value, c = $("#gv-c").value, m = $("#gv-m").value;
        $("#gv-la").style.display = m === "a" ? "" : "none"; $("#gv-l1").style.display = $("#gv-l2").style.display = m === "d" ? "" : "none";
        var csa = m === "a" ? +$("#gv-a").value : Math.PI * (+$("#gv-ap").value) * (+$("#gv-cc").value) / 4 / 100;
        if (!(age >= 18 && w > 0 && csa > 0)) { out.innerHTML = '<p class="warn">Enter an age of 18 or more, the weight and the antral measurement.</p>'; return; }
        var raw = 27.0 + 14.6 * csa - 1.28 * age, v = Math.max(0, raw), pk = v / w, bmi = h ? w / Math.pow(h / 100, 2) : 0, full = c === "solid" || (c === "clear" && pk > 1.5);
        var verdict = c === "solid" ? "Full stomach. Thick fluid or solid is treated as a full stomach whatever the volume." : c === "empty" ? "Empty antrum in both positions: consistent with a fasted stomach." : pk > 1.5 ? "Above 1.5 mL/kg of clear fluid: treat as a full stomach." : "At or below 1.5 mL/kg of clear fluid: consistent with a fasted stomach.";
        out.innerHTML = '<span class="eyebrow">Estimated gastric volume</span>' + (c === "solid" ? '<div class="big">Full</div>' : '<div class="big">' + f1(v, 0) + " mL</div><p><b>" + f1(pk, 2) + " mL/kg</b></p>") +
          '<p class="' + (full ? "warn" : "okline") + '"><b>' + verdict + "</b></p>" +
          '<dl class="work"><div><dt>Antral area</dt><dd>' + f1(csa, 1) + " cm²</dd></div><div><dt>Model</dt><dd>27.0 + 14.6 × " + f1(csa, 1) + " − 1.28 × " + age + " = " + f1(raw, 0) + " mL</dd></div><div><dt>Threshold</dt><dd>1.5 mL/kg × " + f1(w, 1) + " kg = " + f1(1.5 * w, 0) + " mL</dd></div></dl>" +
          (raw < 0 ? '<p class="warn">The model gives a value below zero, shown as 0 mL.</p>' : "") + (v > 500 ? '<p class="warn">Above 500 mL the model has not been validated.</p>' : "") + (bmi >= 40 ? '<p class="warn">BMI is 40 or more: outside the range in which the model was validated.</p>' : "") +
          '<p class="note">For non-pregnant adults. The result supports a clinical decision and does not replace it.</p>';
      };
      $$("#gv-form input, #gv-form select").forEach(function (el) { el.addEventListener("input", run); el.addEventListener("change", run); }); run();
    }
    var gq = $("#gastric-quiz");
    if (gq) {
      var r = function (n) { return ' <a class="cite" href="pocus-gastric.html#ref-' + n + '">' + n + "</a>"; };
      miniQuiz(gq, [
        { q: "In which position is the antral area measured to estimate gastric volume?", o: ["Supine", "Right lateral", "Left lateral", "Sitting upright"], a: 1, w: "The validated adult model uses the antral area measured in the right lateral position." + r(2) },
        { q: "The antrum is empty supine but shows clear fluid in the right lateral position. This is:", o: ["Grade 0", "Grade 1", "Grade 2", "A full stomach"], a: 1, w: "Grade 1: fluid seen only in the right lateral position, with a predicted volume of 16 ± 36 mL." + r(1) },
        { q: "Above what volume of clear fluid is the stomach regarded as full?", o: ["0.4 mL/kg", "0.8 mL/kg", "1.5 mL/kg", "2.5 mL/kg"], a: 2, w: "More than 1.5 mL/kg of clear fluid, or any solid, defined a full stomach in the accuracy and cohort studies." + r(6) + r(8) },
        { q: "Solid content is seen in the antrum, but the measured area is small. The stomach is:", o: ["Empty", "Low risk because the area is small", "Full", "Not interpretable"], a: 2, w: "Solid or thick content is treated as a full stomach whatever the volume." + r(6) },
        { q: "In fasted patients taking a once-weekly GLP-1 receptor agonist, increased residual gastric content was found in:", o: ["6%", "19%", "56%", "90%"], a: 2, w: "56% of 62 patients, against 19% of 62 controls." + r(13) },
        { q: "How often did fasted elective surgical patients have a full stomach on ultrasound?", o: ["0.5%", "6.2%", "20%", "56%"], a: 1, w: "32 of 538 patients (6.2%); only six of them had a recognised risk factor." + r(8) },
        { q: "In consecutive emergency surgical patients, a full stomach was found in:", o: ["5%", "19%", "34%", "56%"], a: 3, w: "56% of emergency patients against 5% of elective patients." + r(9) },
        { q: "The adult volume model was validated in non-pregnant adults with a BMI below:", o: ["30", "35", "40", "50"], a: 2, w: "BMI below 40, for volumes from 0 to 500 mL. A later study supported its use in severe obesity." + r(2) + r(11) }
      ], "pocus-gastric.html");
    }
  };
  P.dose = function () {
    var D = DOSE;
    var f = $("#dose-form"), out = $("#dose-out"), rows = $("#plan-rows"), plan = store.get("plan", []);
    var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; };
    var drugOpts = function (sel) { return Object.keys(D).map(function (k) { return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + D[k].n + "</option>"; }).join(""); };
    var limits = function (key, epi, wt, red) {
      var d = D[key], L = epi ? d.e : d.p, byWt = L[0] * wt, max = Math.min(byWt, L[1]) * (1 - red / 100);
      return { perKg: L[0], cap: L[1], byWt: byWt, max: max, capped: byWt > L[1] };
    };
    var state = function () {
      var w = num("#d-w"), h = num("#d-h"), male = $("#d-sex").value === "m", lbw = 0, bmi = 0;
      /* Janmahasatian et al. 2005 (reference 3): fat-free mass from sex, weight and BMI */
      if (w && h) { bmi = w / Math.pow(h / 100, 2); lbw = 9270 * w / ((male ? 6680 : 8780) + (male ? 216 : 244) * bmi); }
      var DW = dosingWeight(w, h, male);
      return { w: w, h: h, bmi: bmi, lbw: lbw, DW: DW, dw: DW.dw, epi: $("#d-epi").checked, red: +$("#d-red").value, drug: $("#d-drug").value, conc: num("#d-conc") };
    };
    var fmt = function (x, d) { return (Math.round(x * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toLocaleString("en-GB"); };
    var drawRows = function () {
      rows.innerHTML = plan.map(function (r, i) {
        return '<div class="prow" data-i="' + i + '"><input aria-label="Block name" list="block-names" placeholder="Block" value="' + esc(r.name) + '" data-k="name"><select aria-label="Drug" data-k="drug">' + drugOpts(r.drug) + '</select><input aria-label="Concentration, percent" type="number" inputmode="decimal" step="0.005" min="0" value="' + esc(r.conc) + '" data-k="conc"><input aria-label="Volume, mL" type="number" inputmode="decimal" step="1" min="0" value="' + esc(r.vol) + '" data-k="vol"><output></output><button class="btn sm" type="button" data-del aria-label="Remove this injection">Remove</button></div>';
      }).join("");
    };
    var calc = function () {
      var s = state();
      $("#d-conc-list").innerHTML = D[s.drug].conc.map(function (c) { return '<option value="' + c + '">'; }).join("");
      if (!s.w) { out.innerHTML = '<p class="lede">' + T("dose.start") + "</p>"; $("#plan-out").innerHTML = ""; return; }
      var L = limits(s.drug, s.epi, s.dw, s.red), vol = s.conc ? L.max / (s.conc * 10) : 0;
      out.innerHTML = '<span class="eyebrow">' + D[s.drug].n + (s.epi ? " · " + T("dose.epi") : "") + '</span><div class="big">' + fmt(L.max) + ' mg</div><p>' + T("dose.max") + (s.conc ? ": <b>" + fmt(vol, 1) + " mL of " + s.conc + "%</b>" : "") + ".</p>" +
        '<dl class="work"><div><dt>' + T("dose.dw") + '</dt><dd>' + fmt(s.dw, 1) + " kg " + dwText(s.DW, s.w, fmt) + "</dd></div><div><dt>" + T("dose.wl") + "</dt><dd>" + L.perKg + " mg/kg × " + fmt(s.dw, 1) + " kg = " + fmt(L.byWt) + " mg</dd></div><div><dt>" + T("dose.cap") + "</dt><dd>" + L.cap + " mg" + (L.capped ? " (this is the limit that applies)" : "") + "</dd></div>" + (s.red ? "<div><dt>Risk-factor reduction</dt><dd>" + s.red + "% taken off</dd></div>" : "") + "</dl>" +
        dwNote(s.DW) +
        '<div class="rescue"><b>20% lipid emulsion if toxicity is suspected</b><span>' + (s.dw < 70 ? "Bolus " + fmt(1.5 * s.dw) + " mL (1.5 mL/kg) over 2 to 3 min, then " + fmt(0.25 * s.dw, 1) + " mL/min (0.25 mL/kg/min)." : "Bolus 100 mL over 2 to 3 min, then 200 to 250 mL over 15 to 20 min.") + " Ceiling " + fmt(12 * s.dw) + ' mL (12 mL/kg). Follow your local emergency guideline. <a class="cite" href="#ref-1">1</a><a class="cite" href="#ref-4">4</a></span></div>';
      /* multi-injection plan: fractions of each drug\'s maximum are added together */
      var tot = 0, vt = 0;
      $$(".prow", rows).forEach(function (el, i) {
        var r = plan[i], mg = (parseFloat(r.conc) || 0) * 10 * (parseFloat(r.vol) || 0), fr = mg / limits(r.drug, s.epi, s.dw, s.red).max;
        tot += fr; vt += parseFloat(r.vol) || 0; $("output", el).textContent = fmt(mg) + " mg · " + fmt(fr * 100) + "%";
      });
      var pct = tot * 100, cls = pct > 100 ? "over" : pct > 80 ? "near" : "ok";
      $("#plan-out").innerHTML = plan.length ? '<div class="gauge ' + cls + '"><i style="width:' + Math.min(pct, 100) + '%"></i></div><p><b>' + fmt(pct) + "% of the suggested maximum</b> across " + plan.length + " injection" + (plan.length > 1 ? "s" : "") + ", " + fmt(vt, 1) + " mL in total. " + (pct > 100 ? "This plan exceeds the limit. Lower a concentration or a volume." : pct > 80 ? "Close to the limit: little room is left for surgical infiltration or top-ups." : "Within the limit.") + "</p>" : '<p class="note">Add each injection you plan to give, including surgical infiltration, to see the running total.</p>';
      var tv = num("#d-tv"); $("#tv-out").innerHTML = tv ? "For " + fmt(tv, 1) + " mL of " + D[s.drug].n.toLowerCase() + " the strongest concentration within the limit is <b>" + fmt(L.max / tv / 10, 3) + "%</b> (" + fmt(L.max / tv, 2) + " mg/mL)." : "";
    };
    $("#d-drug").innerHTML = drugOpts("levobupivacaine");
    f.addEventListener("input", calc); f.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#plan-add").addEventListener("click", function () { var s = state(); plan.push({ name: "", drug: s.drug, conc: s.conc || D[s.drug].conc[0], vol: 20 }); store.set("plan", plan); drawRows(); calc(); });
    rows.addEventListener("input", function (e) { var el = e.target.closest(".prow"); if (!el) return; plan[+el.getAttribute("data-i")][e.target.getAttribute("data-k")] = e.target.value; store.set("plan", plan); calc(); });
    rows.addEventListener("click", function (e) { if (!e.target.closest("[data-del]")) return; plan.splice(+e.target.closest(".prow").getAttribute("data-i"), 1); store.set("plan", plan); drawRows(); calc(); });
    $("#block-names").innerHTML = N.blocks.map(function (b) { return '<option value="' + esc(b.name) + '">'; }).join("") + '<option value="Surgical infiltration">';
    drawRows(); calc();
  };

  chrome();
  if (P[page]) P[page]();
  if (li >= 0) {
    trTree(document.body);
    var top = $(".top");
    if (top && TX["Translated text is awaiting review by a clinician who speaks the language. If anything is unclear, the English version is the reference."]) top.insertAdjacentHTML("afterend", '<p class="langnote">' + TX["Translated text is awaiting review by a clinician who speaks the language. If anything is unclear, the English version is the reference."][li] + "</p>");
    try { new MutationObserver(function (ms) { ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, trTree); }); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
})();

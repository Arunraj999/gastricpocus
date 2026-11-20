/* NORA² offline support. Change the version number whenever you upload new files,
   so phones that installed the app pick up the update. */
var VERSION = "nora2-v57";
var CORE = ["index.html", "blocks.html", "surgery.html", "interscalene.html", "dose.html", "breast-blocks.html", "audit.html", "audit-tools.html", "pocus.html", "pocus-gastric.html", "gastric-calculator.html", "gastric-quiz.html", "practice.html", "last.html", "complications.html", "proms-prems.html", "medico-legal.html", "videos.html", "cadaver-lab.html", "meetings.html", "research.html", "blog.html", "about.html", "ultrasound-physics.html", "knobology.html", "needling.html", "anatomy-3d.html", "resources.html", "emergency.html", "anticoagulation.html", "societies.html", "prospect.html", "leaflets.html", "awake.html", "publications.html",
  "assets/site.css", "assets/site.js", "assets/content.js", "assets/usim.js", "assets/i18n.js", "assets/i18n-text.js", "media/figures/body.webp", "media/hero.webp", "media/brand/logo-mark.webp", "icons/icon.svg", "icons/icon-192.png", "manifest.webmanifest"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  /* fresh copy when online, saved copy when offline */
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && r.ok && new URL(e.request.url).origin === location.origin) { var copy = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("index.html"); }); }));
});

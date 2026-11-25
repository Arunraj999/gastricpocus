/* Parasternal intercostal plane blocks: superficial (pipsup) and deep (pipdeep).
   One parasagittal view beside the sternum over the 4th intercostal space; image left = caudal, right = cranial,
   so the in-plane needle enters at the cranial end of the probe and travels caudally. Original schematic. */
(function () {
  window.BP_SCENES = window.BP_SCENES || {};
  var PMAJ_UNDER = "M0 184C100 178 200 182 320 182C440 180 520 176 640 182";
  function shapes() {
    return [
      { id: "pmaj", t: "muscle", n: "Pectoralis major", l: "PMaj", k: "path", d: "M0 88C160 80 480 80 640 88V182C520 176 440 180 320 182C200 182 100 178 0 184Z", lx: 120, ly: 136, rec: "strong",
        x: "The superficial muscle of the chest wall, about 1 cm thick here, its fibres running obliquely across the image. Medial and lateral pectoral nerves. The superficial block is placed under it." },
      { id: "eim", t: "muscle", n: "External intercostal membrane", l: "", k: "path", d: "M186 201C220 190 280 186 320 186C370 186 420 189 456 198L453 204C420 196 370 193 320 193C280 193 226 196 192 207Z", lx: 0, ly: 0, rec: "weak",
        x: "This far forward the external intercostal muscle is only a thin membrane: a bright line bridging the two costal cartilages, just under pectoralis major." },
      { id: "iim", t: "muscle", n: "Internal intercostal muscle", l: "IIM", k: "path", d: "M192 207C226 196 280 193 320 193C370 193 420 196 453 204C442 214 435 226 433 238C400 240 360 238 320 237C280 237 240 238 205 240C204 228 200 216 192 207Z", lx: 320, ly: 222, rec: "strong",
        x: "The striated band filling the intercostal space between the cartilages. The deep block is placed on its deep surface; the superficial block stays on its front." },
      { id: "tt", t: "muscle", n: "Transversus thoracis", l: "TT", k: "path", d: "M150 300C220 290 400 290 490 300C492 305 490 309 486 310C400 302 220 302 154 310C150 307 148 303 150 300Z", lx: 412, ly: 304, rec: "strong",
        x: "A thin layer on the deep surface of the cartilages, just above the pleura. In 24 cadaver hemithoraces it was present in the second to sixth spaces, and ultrasound identified it correctly in more than 80% of the second to fifth spaces.", c: 16 },
      { id: "ita", t: "artery", n: "Internal thoracic artery", l: "ITA", k: "ellipse", cx: 318, cy: 258, rx: 110, ry: 10, lx: 318, ly: 262, avoid: 1, rec: "strong",
        x: "Runs vertically in the deep plane, so a parasagittal probe shows it along its length as a pulsatile tube that disappears under each cartilage. At the fourth space it lay about 1.5 cm from the lateral border of the sternum. Find it with colour Doppler before the needle goes in.", c: 1 },
      { id: "itv", t: "vein", n: "Internal thoracic vein", l: "ITV", k: "ellipse", cx: 300, cy: 280, rx: 80, ry: 5, lx: 232, ly: 284, avoid: 1, rec: "weak",
        x: "Accompanies the artery in the deep plane, on transversus thoracis. Thin-walled and compressible: lighten the probe pressure to see it." },
      { id: "cc5", t: "bone", n: "5th costal cartilage", l: "5th CC", k: "path", d: "M-20 240C-20 205 30 188 90 188C150 188 204 208 204 240C204 272 150 290 90 290C30 290 -20 272 -20 240Z", cortex: "M-20 240C-20 205 30 188 90 188C150 188 204 208 204 240", lx: 96, ly: 246, rec: "strong",
        x: "The caudal of the two cartilages: a dark oval with a bright anterior rim; the pleura can be followed beneath it. Count the level from the second cartilage, which meets the sternal angle.",
        hit: ["On the 5th costal cartilage", "The tip is on cartilage. Withdraw a millimetre and redirect."] },
      { id: "cc4", t: "bone", n: "4th costal cartilage", l: "4th CC", k: "path", d: "M432 240C432 208 476 188 536 188C600 188 660 205 660 240C660 275 600 290 536 290C476 290 432 272 432 240Z", cortex: "M432 240C432 208 476 188 536 188C600 188 660 205 660 240", lx: 540, ly: 246, rec: "strong",
        x: "The cranial of the two cartilages, under the needle entry. One cadaver study placed the tip of the superficial block on the anterior surface of the costal cartilage.", c: 19,
        hit: ["On the 4th costal cartilage", "The tip is on cartilage. Withdraw a millimetre so that it lies just above the cartilage, under pectoralis major."] },
      { id: "pleura", t: "bone", n: "Pleura", l: "PLEURA", k: "path", d: "M0 322C120 318 200 314 320 313C440 313 520 318 640 322V400H0Z", cortex: "M0 322C120 318 200 314 320 313C440 313 520 318 640 322", lx: 320, ly: 342, avoid: 1, rec: "strong",
        x: "The bright line deep to transversus thoracis that slides with breathing, lung beneath it. Between the cartilages it lies about 2.5 cm from the skin, a few millimetres below the deep plane.",
        hit: ["Pleura", "Stop and withdraw. The tip has reached the pleura and the lung lies beneath it."] }
    ];
  }
  var refs = function (where) { return { stim: 46, sens: 47, press: 48, cons: 7, where: where }; };
  var refuse = "Never inject against a nerve. At the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.";
  var common = {
    entry: [636, 58], ori: ["Caudal", "Cranial"], altLabel: "Plane", alts: [["pipsup", "Superficial"], ["pipdeep", "Deep"]],
    scanTitle: "Sonoanatomy beside the sternum, 4th intercostal space",
    recLab: { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] },
    consensus: "No consensus list has been published for these blocks. These are the structures named in the published technique; the two planes are defined by the ASRA-ESRA nomenclature consensus.",
    wrongNote: "Withdraw a millimetre and continue in the plane.",
    avoidNote: "Find these before the needle goes in. Colour Doppler between the cartilages shows the internal thoracic artery and vein in the deep plane, and the pleura lies only a few millimetres beneath them."
  };
  function make(o) { var s = JSON.parse(JSON.stringify(common)), k; for (k in o) s[k] = o[k]; return s; }

  window.BP_SCENES.pipsup = make({
    title: "Superficial parasternal intercostal plane block",
    target: [480, 187],
    fascia: [
      { id: "inv", n: "Pectoral fascia", d: "M0 88C160 80 480 80 640 88", t: "The thin fascia over pectoralis major, under the subcutaneous fat." },
      { id: "pre", n: "Deep fascia of pectoralis major", d: PMAJ_UNDER, t: "The fascia on the undersurface of pectoralis major. The superficial parasternal plane lies beneath it, on the costal cartilages and the intercostal layer." }
    ],
    shapes: shapes(),
    groove: "M0 172H640V216H0Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the cranial end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer. Pectoralis major lies beneath."],
      tri: ["Within pectoralis major", "Between the pectoral fascia and the deep fascia of the muscle. Advance until the tip is through the deep fascia."],
      groove: ["Superficial parasternal plane: under pectoralis major", "Between the deep fascia of pectoralis major and the costal cartilages and intercostal layer. This is the plane the fluid should open."],
      deep: ["The deep parasternal plane", "Too deep for this block: the tip is under the internal intercostal muscle, beside the internal thoracic vessels and a few millimetres from the pleura. Withdraw."]
    },
    zoneNote: {
      pmaj: ["", "Inside the muscle. Advance until the tip is just through its deep fascia. "],
      eim: ["warn", "Slightly too deep: the tip is in the intercostal layer. Withdraw a millimetre. "],
      iim: ["warn", "Too deep for the superficial block: the tip is in the internal intercostal muscle, heading for the artery. Withdraw. "],
      tt: ["warn", "Far too deep: the tip is at the pleura. Withdraw. "]
    },
    targetNote: "This is the target: under pectoralis major, on the anterior surface of the 4th costal cartilage.",
    la: { "in": [420, 188, 150, 9] },
    refs: refs(17),
    inj: {
      skin: "A skin wheal only. The plane lies under pectoralis major.",
      refuse: refuse,
      tri: "The fluid swells inside pectoralis major. Advance until the tip is through its deep fascia.", triZ: [],
      z: {
        pmaj: ["The fluid tracks between the muscle fibres: a striated, irregular swelling with no clean lift of the muscle. Advance a millimetre, through the deep fascia.", 26, 12],
        eim: ["The fluid is in the intercostal layer, not under the muscle. Withdraw a millimetre.", 22, 7],
        iim: ["The fluid swells inside the internal intercostal muscle. The superficial needle should never need to pass this layer: withdraw.", 24, 12],
        tt: ["The fluid is in transversus thoracis, against the pleura. Withdraw.", 22, 6]
      },
      deep: "Too deep: the fluid is in the deep plane, beside the internal thoracic artery. That is the deep block, not this one. Withdraw.",
      good: { "in": "Hydrodissection: an anechoic lens lifts pectoralis major off the cartilage and spreads cranially and caudally in the plane, over the intercostal space and the next cartilage." },
      tail: "In cadavers, 20 mL stained a median of 2 intercostal muscles and 1 intercostal nerve."
    },
    steps: [
      { to: 14, say: "The needle enters at the cranial end of the probe, in plane, and appears in the subcutaneous fat." },
      { to: "inv+3", pre: "Through the ", fas: "inv", hold: 2400 },
      { to: "pmaj+50", say: "Into pectoralis major. Keep the whole shaft in view: the intercostal layer, the internal thoracic artery and the pleura are only a few millimetres deeper.", hold: 3200 },
      { to: "pre+2", pre: "The tip passes the ", fas: "pre", hold: 3200 },
      { to: "L", say: "The tip rests on the anterior surface of the 4th costal cartilage, under pectoralis major. There is no twitch to look for: the endpoint is the spread.", hold: 3200 },
      { say: "Hydrodissect: inject a small volume and watch. An anechoic lens lifting pectoralis major off the cartilage confirms the plane; a striated swelling means the tip is still in the muscle.", inject: 1, hold: 4200 },
      { say: "Continue in small aliquots, aspirating between them. The fluid tracks under the muscle over the intercostal space and the next cartilage.", hold: 3600 },
      { say: "A second injection two levels lower widens the block: two injections blocked T2 to T6 in 81% of patients, against 51% after one. Open Plane, above the image, to compare the deep block.", hold: 5400 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ]
  });

  window.BP_SCENES.pipdeep = make({
    title: "Deep parasternal intercostal plane block",
    target: [300, 242],
    fascia: [
      { id: "inv", n: "Undersurface of pectoralis major", d: PMAJ_UNDER, t: "The superficial parasternal plane lies here, on the intercostal layer. For the deep block the needle carries on through the intercostal muscles." },
      { id: "pre", n: "Deep surface of the internal intercostal muscle", d: "M0 292C60 294 150 292 190 270C198 258 203 248 205 238C260 235 380 235 434 237C436 250 444 266 470 280C520 294 590 294 640 292", t: "Beneath it lies the deep parasternal plane, with the internal thoracic artery and veins on transversus thoracis. The pleura is a few millimetres further." }
    ],
    shapes: (function () { var a = shapes(); a.forEach(function (q) { if (q.id === "cc4" || q.id === "cc5") q.hit = [q.hit[0], "The tip is on cartilage. Withdraw and redirect into the intercostal space, between the cartilages."]; }); return a; })(),
    groove: "M204 236C260 234 380 234 434 236L440 293C380 291 260 291 198 295Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the cranial end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer. Pectoralis major lies beneath."],
      tri: ["Superficial parasternal plane", "Under pectoralis major, on the intercostal layer. This is the plane of the superficial block; for the deep block continue through the internal intercostal muscle."],
      groove: ["Deep parasternal plane", "Between the internal intercostal muscle and transversus thoracis, above the internal thoracic vessels. This is the plane the fluid should open."],
      deep: ["Beneath transversus thoracis", "Too deep: the tip is against the endothoracic fascia and the pleura. Withdraw."]
    },
    zoneNote: {
      pmaj: ["", "Keep going: the target is two layers deeper. "],
      eim: ["", "The thin membrane over the internal intercostal muscle. Continue. "],
      iim: ["", "Inside the internal intercostal muscle. Advance until the tip is just through its deep surface. "],
      tt: ["warn", "Too deep: the tip is in transversus thoracis, next to the pleura. Withdraw. "]
    },
    targetNote: "This is the target: between the internal intercostal muscle and transversus thoracis, just above the internal thoracic artery.",
    la: { "in": [318, 262, 118, 22] },
    refs: refs(20),
    variants: [
      { n: "Usual anatomy", t: "The internal thoracic artery and vein run in the deep plane on transversus thoracis, a few millimetres above the pleura." },
      { n: "After artery harvest", t: "Transversus thoracis can be hard to see once the internal thoracic artery has been taken down, and the superficial block has been suggested in that situation.", set: { ita: { hide: 1 }, itv: { hide: 1 }, tt: { d: "M150 302C220 296 400 296 490 302C491 305 490 307 487 308C400 302 220 302 154 308C151 306 149 304 150 302Z" } } }
    ], varLabel: "Variation", varRef: 1,
    inj: {
      skin: "A skin wheal only. The plane lies under three muscle layers.",
      refuse: refuse,
      tri: "The fluid spreads under pectoralis major, above the intercostal layer. This is the superficial parasternal block, a different block: for the deep block advance through the internal intercostal muscle.", triZ: ["eim"],
      z: {
        pmaj: ["The fluid swells inside pectoralis major. The target is two layers deeper.", 26, 12],
        iim: ["The fluid swells inside the internal intercostal muscle: a striated swelling, and transversus thoracis is not pushed down. Advance a millimetre.", 24, 12],
        tt: ["The fluid is inside transversus thoracis, against the pleura. Withdraw a millimetre.", 22, 6]
      },
      deep: "Too deep: the fluid is under transversus thoracis, against the endothoracic fascia and pleura. Withdraw. If the pleural line breaks, think of pneumothorax.",
      good: { "in": "Hydrodissection: the plane opens, transversus thoracis and the pleura are pushed down, and the fluid spreads along the space and around the internal thoracic vessels." },
      tail: "In cadavers, 20 mL between ribs 3 and 4 stained 4 intercostal nerves in every specimen, and transversus thoracis over 4 to 6 levels."
    },
    steps: [
      { to: 14, say: "The needle enters at the cranial end of the probe, in plane, and appears in the subcutaneous fat." },
      { to: "pmaj+70", say: "Through pectoralis major, passing over the 4th costal cartilage. The path is steeper than for the superficial block, so the tip must be followed the whole way.", hold: 3400 },
      { to: "inv+3", pre: "The tip passes the ", fas: "inv", hold: 3200 },
      { to: "iim+24", say: "Through the external intercostal membrane and into the internal intercostal muscle. A small bolus of saline shows where the tip is: a striated swelling means it is still in the muscle.", hold: 3800 },
      { to: "pre+2", pre: "The tip passes the ", fas: "pre", hold: 3400 },
      { to: "L", say: "The tip lies between the internal intercostal muscle and transversus thoracis, above the artery. On histology the artery lay a median of 1.9 mm from the fourth rib.", hold: 3800 },
      { say: "Hydrodissect: inject in small aliquots, aspirating between them. The plane opens and transversus thoracis and the pleura are pushed down. If the tip is not seen, stop.", inject: 1, hold: 4400 },
      { say: "In one trial pneumothorax was more frequent after the deep block than after the superficial one. Open Variation, above the image, to see the plane after the artery has been harvested.", flash: 1, hold: 5400 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ]
  });
})();

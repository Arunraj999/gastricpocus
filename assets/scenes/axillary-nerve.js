/* Axillary nerve block scenes for the NORA² block player: posterior (quadrangular space) and anterior (axillary fossa).
   Original schematics. Posterior image mirrored so that the needle, inserted from the cranial end, enters from the right. */
window.BP_SCENES = window.BP_SCENES || {};
(function () {
  var ALTS = [["axnervepost", "Posterior (quadrilateral space)"], ["axnerveant", "Anterior"]];
  var REC = { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] };

  /* ---------- Posterior approach: 5 cm image, 7.1 px per mm. Left = caudal (elbow), right = cranial (acromion). ---------- */
  window.BP_SCENES.axnervepost = {
    title: "Axillary nerve block: posterior approach at the quadrangular space",
    entry: [640, 60], target: [352, 276], mm: 0.141, ori: ["Caudal", "Cranial"],
    scanTitle: "Sonoanatomy at the quadrangular space", altLabel: "Approach", alts: ALTS, recLab: REC,
    fascia: [
      { id: "inv", n: "Superficial fascia of deltoid", d: "M0 90C200 86 440 86 640 88", t: "The first layer under the subcutaneous fat. Deltoid lies directly beneath it." },
      { id: "pre", n: "Deep fascia of deltoid (subdeltoid plane)", d: "M0 220C160 224 300 230 400 232C480 233 560 232 640 230", t: "The deep surface of deltoid. The axillary nerve and the posterior circumflex humeral artery leave the quadrangular space beneath this layer, so the tip must pass through it." }
    ],
    shapes: [
      { id: "del", t: "muscle", n: "Deltoid, posterior part", l: "DELTOID", k: "path", d: "M0 90C200 86 440 86 640 88V230C560 232 480 233 400 232C300 230 160 224 0 220Z", lx: 180, ly: 160, rec: "strong", x: "The superficial muscle, about 2 cm thick here. It roofs the space where the nerve and artery emerge. Supplied by the axillary nerve; it abducts the shoulder.", c: 1 },
      { id: "tmin", t: "muscle", n: "Teres minor", l: "TMin", k: "path", d: "M400 270C402 246 436 234 474 234C512 234 540 248 544 272C546 296 520 314 478 316C436 318 398 298 400 270Z", lx: 474, ly: 280, rec: "strong", x: "Cut across, as an oval on the cranial side of the space. It forms the cranial border of the quadrangular space. Supplied by the axillary nerve; it turns the arm outwards.", c: 9 },
      { id: "isp", t: "muscle", n: "Infraspinatus, lower edge", l: "IS", k: "path", d: "M556 270C560 246 590 236 640 236V330C606 330 572 318 560 300C554 290 554 280 556 270Z", lx: 598, ly: 300, x: "Cranial to teres minor, running towards the back of the humeral head. It is not part of the target space. Supplied by the suprascapular nerve." },
      { id: "tlh", t: "muscle", n: "Long head of triceps", l: "TRICEPS (LH)", k: "path", d: "M0 240C80 236 170 236 234 244C250 262 250 296 234 318C160 322 80 324 0 326Z", lx: 112, ly: 286, rec: "strong", x: "Seen along its length, its fibres running across the image. It forms the caudal and medial border of the space. Supplied by the radial nerve; it extends the elbow.", c: 9 },
      { id: "pcha", t: "artery", n: "Posterior circumflex humeral artery", l: "PCHA", k: "circle", cx: 310, cy: 294, r: 9, lx: 300, ly: 274, avoid: 1, rec: "strong", x: "Small, round and pulsatile, seen in short axis as it leaves the quadrangular space and winds round the neck of the humerus. Find it with colour Doppler: it is the landmark for the whole block, and the nerve lies on its cranial side. The point where Doppler found it lay on the line from the posterolateral acromion to the axillary fold in 77% of 88 shoulders.", c: 12 },
      { id: "pchv", t: "vein", n: "Posterior circumflex humeral vein", l: "", k: "ellipse", cx: 288, cy: 298, rx: 8, ry: 6, lx: 288, ly: 298, avoid: 1, x: "Runs beside the artery and flattens under probe pressure. Lighten the pressure to see it, and keep the tip on the cranial side of the vessels." },
      { id: "axn", t: "nerve", n: "Axillary nerve", l: "AxN", k: "circle", cx: 340, cy: 287, r: 9, lx: 366, ly: 304, bright: 1, rec: "strong", target: 1, m: "Deltoid and teres minor; the skin over the lower deltoid; the inferior parts of the shoulder joint capsule", s: "Shoulder abducts: deltoid contracts", mv: "sabd", x: "A small honeycomb oval on the cranial side of the artery, deep to deltoid. It is often hard to see: if it cannot be found, the artery and the muscles are enough to place the needle.", c: 1 },
      { id: "radn", t: "nerve", n: "Radial nerve", l: "RN", k: "circle", cx: 72, cy: 340, r: 8, lx: 104, ly: 346, bright: 1, wrong: 1, avoid: 1, m: "Triceps, and the wrist and finger extensors", s: "Elbow and wrist extend: the tip is too deep and too caudal", mv: "elbowext", wn: "Withdraw and redirect cranially, to the cranial side of the artery under deltoid.", x: "Deep and caudal, under the long head of triceps near the bone. Its position here is schematic. In cadavers it was lightly stained in 3 of 12 injections into the quadrangular space from behind.", c: 23 },
      { id: "hum", t: "bone", n: "Neck of the humerus", l: "HUMERUS", k: "path", d: "M0 372C80 360 180 342 280 332C360 326 440 324 520 328C580 331 620 338 640 344V400H0Z", cortex: "M0 372C80 360 180 342 280 332C360 326 440 324 520 328C580 331 620 338 640 344", lx: 430, ly: 368, rec: "strong", x: "A bright curved line with a full acoustic shadow: the deep border of the space. Beside the nerve it lay a mean of 4.0 cm deep in men (SD 0.5) and 3.6 cm in women (SD 0.4).", c: 12, hit: ["On the humerus", "The tip is on bone, deep to the nerve. Withdraw a few millimetres into the fat beside the artery."] }
    ],
    groove: "M236 226H420V332H236Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the cranial end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer. Deltoid lies beneath."],
      tri: ["Subdeltoid plane", "Just under the deep fascia of deltoid, above the fat of the space. Fluid here may spread under the muscle without reaching the nerve. Advance a little towards the artery."],
      groove: ["Quadrangular space exit, beside the nerve", "The fat bordered by deltoid, teres minor, the long head of triceps and the humerus, where the nerve and artery run. This is where the local anaesthetic should go."],
      deep: ["Outside the space", "Deep fat outside the quadrangular space. Withdraw and redirect towards the cranial side of the artery."]
    },
    zoneNote: { del: ["", "Too superficial: the nerve lies beneath this muscle. "], tmin: ["warn", "Inside teres minor, cranial to the space. Withdraw and aim just caudal to its edge. "], isp: ["warn", "Too cranial: this muscle is outside the space. Withdraw. "], tlh: ["warn", "Too caudal: you have crossed the space into triceps. Withdraw. "] },
    wrongNote: "Withdraw to the cranial side of the posterior circumflex humeral artery.",
    targetNote: "This is the target: in the fat of the space, on the cranial side of the artery, beside the axillary nerve.",
    la: { "in": [326, 288, 50, 22] },
    consensus: "No consensus list has been published for this block. These are the structures named in the published technique.",
    refs: { stim: 41, sens: 42, press: 43, cons: 9, where: 1 },
    avoidNote: "Find the artery with colour Doppler before the needle moves. The vein lies beside it, and the radial nerve is deep and caudal, under triceps.",
    inj: {
      skin: "A skin wheal only. The nerve lies under deltoid, about 3.5 cm deeper.",
      refuse: "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.",
      tri: "The fluid spreads in the subdeltoid plane, above the space. It may not reach the nerve. Advance a little towards the cranial side of the artery.", triZ: [],
      z: {
        del: ["The fluid swells inside deltoid and splits its fibres. The nerve lies beneath the deep fascia of the muscle.", 26, 12],
        tmin: ["The fluid swells inside teres minor. Withdraw and aim just caudal to the edge of the muscle, beside the artery.", 22, 13],
        isp: ["The fluid swells inside infraspinatus, cranial to the space. Withdraw.", 18, 12],
        tlh: ["The fluid swells inside the long head of triceps, caudal to the space and towards the radial nerve. Withdraw.", 24, 12]
      },
      deep: "Too deep, outside the space. Withdraw towards the cranial side of the artery.",
      medial: [298, "The fluid is on the caudal side of the artery, beside the vein. The nerve lies on its cranial side, and from here the spread tracks towards the radial nerve."],
      far: [46, "The fluid is in the space but away from the nerve and the artery. Spread round the nerve is not assured."],
      good: { "in": "The fluid surrounds the nerve and the artery and separates deltoid from the humerus and teres minor." },
      tail: "In 12 volunteers, 8 mL placed cranial to the artery blocked sensation in all 12 and gave complete motor block in 10."
    },
    steps: [
      { to: 14, say: "The needle enters at the cranial end of the probe, in plane, and appears in the subcutaneous fat. The target is about 3.5 cm deep, so the path is steep and a long needle is used." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "del+70", say: "Through deltoid. Keep the whole shaft in view: the space lies beneath the deep surface of this muscle.", hold: 2800 },
      { to: "pre+3", pre: "Through the ", fas: "pre", hold: 3200 },
      { to: "L-10", say: "Into the fat of the space, just caudal to teres minor. With the stimulator at 1.0 mA deltoid contracts and the shoulder abducts.", on: 1, ma: 1, hold: 3000 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance a millimetre, to the cranial side of the artery. The twitch returns at 0.5 mA: the tip is beside the nerve.", hold: 2600 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve. Aspirate: the artery is a few millimetres away.", ma: 0.2, hold: 3000 },
      { say: "Inject against low pressure. The fluid surrounds the nerve and the artery and lifts deltoid off the humerus.", inject: 1, hold: 3800 },
      { say: "There is a second way to this nerve. Open Approach, above the image, to see it from the front in the axillary fossa.", hold: 4600 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ]
  };

  /* ---------- Anterior approach: default 3.4 cm image. Left = anterior, right = posterior; needle posterior to anterior. ---------- */
  window.BP_SCENES.axnerveant = {
    title: "Axillary nerve block: anterior approach in the axillary fossa",
    entry: [640, 70], target: [352, 271], ori: ["Anterior", "Posterior"],
    scanTitle: "Sonoanatomy in the axillary fossa", altLabel: "Approach", alts: ALTS, recLab: REC,
    fascia: [
      { id: "inv", n: "Axillary fascia", d: "M0 98C200 94 440 94 640 98", t: "The first layer under the subcutaneous fat of the axilla." },
      { id: "pre", n: "Fascia on the deep surface of teres major and over subscapularis", d: "M0 232C100 230 190 238 250 250C290 258 310 266 324 262C334 258 340 250 350 251C390 256 420 266 440 270C520 280 590 286 640 286", t: "The layer under teres major, continuing forwards over subscapularis. The axillary nerve lies beneath it, at the inferolateral margin of subscapularis." }
    ],
    shapes: [
      { id: "tmaj", t: "muscle", n: "Teres major, with the latissimus dorsi tendon on its surface", l: "TERES MAJOR", k: "path", d: "M326 206C350 168 420 136 500 124C560 118 610 116 640 116V284C580 282 500 276 440 268C400 263 360 256 340 246C330 236 324 222 326 206Z", lx: 520, ly: 206, rec: "strong", x: "The posterior muscle of the window, thicker towards the posterior axillary fold. The latissimus tendon lies on its surface as a bright line. The nerve lies underneath it, over the humeral head.", c: 24 },
      { id: "subs", t: "muscle", n: "Subscapularis", l: "SUBSCAP", k: "path", d: "M0 236C80 234 170 238 240 250C282 258 312 272 328 292C318 312 300 332 280 342C254 354 226 364 200 372C150 386 90 396 0 400Z", lx: 120, ly: 320, rec: "strong", x: "A wedge tapering towards the humerus. The nerve lies at its inferolateral margin, the tip of the wedge. Fluid injected too far forwards can enter this muscle.", c: 2 },
      { id: "axv", t: "vein", n: "Axillary vein", l: "AV", k: "ellipse", cx: 96, cy: 156, rx: 36, ry: 28, lx: 96, ly: 160, avoid: 1, rec: "weak", x: "Large and compressible, at the anterior side of the fossa. Lighten the probe pressure to see it. It is not in the needle path from behind." },
      { id: "axa", t: "artery", n: "Axillary artery", l: "AA", k: "circle", cx: 206, cy: 168, r: 30, lx: 206, ly: 172, avoid: 1, rec: "weak", x: "Round and pulsatile, surrounded by the terminal nerves of the plexus. The axillary nerve target lies well posterior and deep to it." },
      { id: "med", t: "nerve", n: "Median nerve", l: "MN", k: "circle", cx: 196, cy: 118, r: 16, lx: 236, ly: 116, wrong: 1, avoid: 1, m: "The wrist and finger flexors and the thenar muscles", s: "Fingers and wrist flex: the tip is too anterior and superficial", wn: "Withdraw and redirect posteriorly and deeper, under teres major.", x: "Superficial to the axillary artery. Not the target." },
      { id: "uln", t: "nerve", n: "Ulnar nerve", l: "UN", k: "circle", cx: 150, cy: 196, r: 15, lx: 150, ly: 228, wrong: 1, avoid: 1, m: "The small muscles of the hand and the ulnar finger flexors", s: "Fingers flex: the tip is too anterior", wn: "Withdraw and redirect posteriorly and deeper, under teres major.", x: "Between the artery and the vein. Not the target." },
      { id: "rad", t: "nerve", n: "Radial nerve", l: "RN", k: "circle", cx: 238, cy: 218, r: 14, lx: 276, ly: 222, wrong: 1, avoid: 1, rec: "weak", m: "Triceps, and the wrist and finger extensors", s: "Elbow and wrist extend: the tip is too anterior, at the radial nerve", mv: "elbowext", wn: "Withdraw and redirect posteriorly, to the margin of subscapularis under teres major.", x: "Deep to the artery, on subscapularis. Spread to the axillary fossa, into subscapularis or to the radial nerve followed 8% of anterior injections in cadavers.", c: 2 },
      { id: "axn", t: "nerve", n: "Axillary nerve", l: "AxN", k: "circle", cx: 338, cy: 292, r: 14, lx: 320, ly: 322, rec: "strong", target: 1, m: "Deltoid and teres minor; the skin over the lower deltoid; the inferior parts of the shoulder joint capsule", s: "Shoulder abducts: deltoid contracts", mv: "sabd", x: "An oval at the inferolateral margin of subscapularis, underneath teres major and over the humeral head, on its way into the quadrangular space. It was seen in 99% of 92 cadaver sides from this window.", c: 2 },
      { id: "pcha", t: "artery", n: "Posterior circumflex humeral artery", l: "PCHA", k: "circle", cx: 374, cy: 298, r: 11, lx: 376, ly: 326, avoid: 1, rec: "weak", x: "Runs with the nerve into the quadrangular space, on its posterior side. Check with colour Doppler: the needle from behind meets it before the nerve." },
      { id: "pchv", t: "vein", n: "Posterior circumflex humeral vein", l: "", k: "ellipse", cx: 400, cy: 302, rx: 10, ry: 7, lx: 400, ly: 302, avoid: 1, x: "Beside the artery; flattens under probe pressure." },
      { id: "hum", t: "bone", n: "Humeral head and neck", l: "HUMERUS", k: "path", d: "M160 400C200 376 260 348 340 334C400 326 480 324 540 330C590 336 620 342 640 348V400H160Z", cortex: "M160 400C200 376 260 348 340 334C400 326 480 324 540 330C590 336 620 342 640 348", lx: 500, ly: 372, rec: "strong", x: "A bright convex line with a full acoustic shadow. The nerve lies in the superficial layer over it.", c: 24, hit: ["On the humerus", "The tip is on bone, deep to the nerve. Withdraw a few millimetres."] }
    ],
    groove: "M300 248H470V336H300Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the posterior end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer of the axilla."],
      tri: ["Axillary fossa, around the neurovascular bundle", "Fat around the axillary vessels and the terminal nerves of the plexus, superficial to the fascia over subscapularis. An injection here does not reliably reach the axillary nerve."],
      groove: ["Under teres major, at the margin of subscapularis", "The fat between teres major, subscapularis and the humeral head, where the axillary nerve and its vessels run towards the quadrangular space. This is where the local anaesthetic should go."],
      deep: ["Outside the target compartment", "Withdraw and redirect towards the margin of subscapularis, under teres major."]
    },
    zoneNote: { tmaj: ["", "Inside teres major. The nerve lies underneath this muscle: advance through its deep surface. "], subs: ["warn", "Inside subscapularis: too anterior and deep. Withdraw to its margin. "] },
    wrongNote: "Withdraw and redirect posteriorly, to the margin of subscapularis under teres major.",
    targetNote: "This is the target: under teres major, at the inferolateral margin of subscapularis, beside the axillary nerve and above the humeral head.",
    la: { "in": [344, 286, 40, 22] },
    consensus: "No consensus list has been published for this block. These are the structures named in the published descriptions of the anterior approach.",
    refs: { stim: 41, sens: 42, press: 43, cons: 2, where: 2 },
    avoidNote: "Use colour Doppler first. The axillary artery and vein, with the median, ulnar and radial nerves, lie anterior to the target, and the posterior circumflex humeral vessels lie beside the nerve, in the needle path from behind.",
    inj: {
      skin: "A skin wheal only. The nerve lies under teres major, about 2 cm deeper.",
      refuse: "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.",
      tri: "The fluid spreads in the axillary fossa, among the axillary vessels and the nerves of the plexus. This is one of the unintended spreads of this approach; it does not reliably reach the axillary nerve.", triZ: [],
      z: {
        tmaj: ["The fluid swells inside teres major. Advance through its deep surface to the margin of subscapularis.", 26, 12],
        subs: ["The fluid swells inside subscapularis, one of the unintended spreads of this approach. Withdraw to the margin of the muscle.", 24, 13]
      },
      deep: "Outside the target compartment. Withdraw and redirect under teres major.",
      medial: [306, "The fluid is tracking forwards, towards the axillary fossa and the radial nerve. The target is the margin of subscapularis, further back."],
      far: [48, "The fluid is under teres major but away from the nerve. Spread round it is not assured."],
      good: { "in": "The fluid surrounds the nerve at the margin of subscapularis, under teres major, and tracks back towards the quadrangular space." },
      tail: "In cadavers, latex placed by this approach surrounded the nerve in 96% of 92 injections."
    },
    steps: [
      { to: 14, say: "The needle enters at the posterior end of the probe, in plane, and passes from posterior to anterior. It appears in the subcutaneous fat." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "tmaj+80", say: "Through teres major, with the latissimus tendon on its surface.", hold: 2600 },
      { to: "pre+3", pre: "Out through the ", fas: "pre", hold: 3200 },
      { to: "L-16", say: "Under teres major, nearing the margin of subscapularis. With the stimulator at 1.0 mA deltoid contracts and the shoulder abducts.", on: 1, ma: 1, hold: 3000 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance a millimetre, keeping clear of the circumflex vessels below. The twitch returns at 0.5 mA: the tip is close.", hold: 2600 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
      { say: "Inject against low pressure. The fluid surrounds the nerve at the margin of subscapularis.", inject: 1, hold: 3800 },
      { say: "The axillary vessels and the radial nerve are close in front. Open Approach, above the image, to compare the posterior route.", hold: 4600 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ]
  };
})();

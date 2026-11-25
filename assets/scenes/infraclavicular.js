/* Infraclavicular block scenes for the NORA² block player: costoclavicular and lateral sagittal approaches.
   Original schematic drawings. Both images are mirrored so that the needle enters from the right edge. */
window.BP_SCENES = window.BP_SCENES || {};
(function () {
  var ALTS = [["costoclavicular", "Costoclavicular"], ["lsib", "Lateral sagittal"]];
  var RL = { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] };
  var REFUSE = "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.";

  /* Costoclavicular space. 105 px = 1 cm. Screen left = medial (sternum), right = lateral (shoulder): the needle comes from the lateral end. */
  window.BP_SCENES.costoclavicular = {
    title: "Infraclavicular block: costoclavicular approach",
    entry: [640, 62], target: [280, 282], ori: ["Medial", "Lateral"],
    scanTitle: "Sonoanatomy of the costoclavicular space", altLabel: "Approach", alts: ALTS, varLabel: "Variations",
    recLab: RL,
    fascia: [
      { id: "inv", n: "Pectoral and deltoid fascia", d: "M0 86C160 82 340 84 480 87C560 89 610 88 640 86", t: "The first layer under the subcutaneous tissue, covering pectoralis major and the front edge of deltoid." },
      { id: "pre", n: "Fascia beneath subclavius and the paraneural sheath", d: "M0 238C80 236 170 236 212 244C240 230 260 224 280 224C304 224 326 232 340 246C380 244 440 246 520 252C580 256 620 258 640 260", t: "The deep layer of the clavipectoral fascia under subclavius and pectoralis minor. Over the cords it becomes the paraneural sheath, a thin bright rim around all three. Inside it, a septum separates the lateral cord from the medial and posterior cords." }
    ],
    shapes: [
      { id: "clav", t: "bone", n: "Clavicle", l: "CLAV", k: "path", d: "M0 100C12 98 24 100 32 108C36 116 36 130 34 400H0Z", cortex: "M0 100C12 98 24 100 32 108C36 116 36 130 34 140", lx: 17, ly: 90, rec: "weak", x: "The probe lies just below the middle of the clavicle, parallel to it, and is tilted towards the head to look beneath the bone. Its edge casts a dark shadow at the medial end of the image.", c: 2, hit: ["Clavicle", "The tip is on bone. Withdraw and redirect beneath the clavicle, towards the cords."] },
      { id: "pmaj", t: "muscle", n: "Pectoralis major", l: "PMaj", k: "path", d: "M0 88C160 84 340 86 480 89C520 90 548 90 560 90C556 120 552 150 548 170C420 172 260 170 120 166C60 164 20 164 0 164Z", lx: 210, ly: 132, rec: "strong", x: "The superficial muscle of the chest wall. Medial and lateral pectoral nerves." },
      { id: "delt", t: "muscle", n: "Deltoid, anterior edge", l: "DELT", k: "path", d: "M564 90C600 89 624 88 640 88V174C610 174 580 172 552 172C556 150 560 120 564 90Z", lx: 600, ly: 136, rec: "weak", x: "The front edge of deltoid at the lateral end of the probe. In a cadaver study the needle passed through deltoid in six of eight paths.", c: 21 },
      { id: "sub", t: "muscle", n: "Subclavius", l: "SUB", k: "path", d: "M0 168C80 170 180 174 250 178C286 181 306 188 314 198C318 208 306 218 280 222C258 224 236 232 214 240C170 234 80 234 0 234Z", lx: 140, ly: 206, rec: "strong", x: "A small muscle under the clavicle, thicker at its medial end. The cords lie in the gap beneath it and pectoralis minor, with serratus anterior below.", c: 18 },
      { id: "pmin", t: "muscle", n: "Pectoralis minor, medial edge", l: "PMin", k: "path", d: "M640 174C560 174 470 175 404 180C364 186 340 198 330 212C324 222 330 236 342 242C380 241 440 243 520 249C580 253 620 255 640 257Z", lx: 540, ly: 220, rec: "weak", x: "Tapers towards the cords from the lateral side. The needle passed through it in some cadaver paths.", c: 21 },
      { id: "cv", t: "vein", n: "Cephalic vein", l: "CV", k: "ellipse", cx: 446, cy: 152, rx: 17, ry: 11, lx: 446, ly: 136, avoid: 1, rec: "strong", x: "Dives deep to join the axillary vein, close to the needle path. In a cadaver study it was consistently close to the needle, though never punctured. It flattens under the probe: find it with light pressure and colour Doppler.", c: 21 },
      { id: "taa", t: "artery", n: "Thoracoacromial artery", l: "TAA", k: "circle", cx: 318, cy: 224, r: 7, lx: 340, ly: 218, avoid: 1, rec: "strong", x: "A small pulsatile branch next to the cords, best shown with colour Doppler. It was consistently close to the needle path in cadavers.", c: 21 },
      { id: "aa", t: "artery", n: "Axillary artery", l: "AA", k: "circle", cx: 170, cy: 288, r: 33, lx: 170, ly: 292, avoid: 1, rec: "strong", x: "Round and pulsatile. The three cords run lateral to it and parallel to it, in the same arrangement in every one of eight cadavers.", c: 1 },
      { id: "av", t: "vein", n: "Axillary vein", l: "AV", k: "ellipse", cx: 84, cy: 280, rx: 44, ry: 30, lx: 84, ly: 284, avoid: 1, rec: "strong", x: "Medial to the artery and compressible. A needle brought in from the medial end of the probe passes close to it.", c: 22 },
      { id: "lc", t: "nerve", n: "Lateral cord", l: "LC", k: "circle", cx: 279, cy: 250, r: 22, lx: 279, ly: 254, rec: "strong", target: 1, m: "Biceps and brachialis through the musculocutaneous nerve, and the lateral root of the median nerve", s: "Elbow flexes: biceps, through the musculocutaneous nerve", mv: "elbowflex", x: "The most superficial cord, in front of the other two and nearest the needle. In a cadaver study the needle touched it in six of eight paths and pierced it in three: go slowly as you pass beneath it.", c: 21 },
      { id: "mc", t: "nerve", n: "Medial cord", l: "MC", k: "circle", cx: 254, cy: 312, r: 22, lx: 254, ly: 316, rec: "strong", target: 1, m: "Finger flexors and the small muscles of the hand through the ulnar nerve and the medial root of the median nerve", s: "Fingers flex and the small hand muscles twitch", x: "Directly behind the lateral cord and medial to the posterior cord, so it is the cord closest to the artery.", c: 1 },
      { id: "pc", t: "nerve", n: "Posterior cord", l: "PC", k: "circle", cx: 306, cy: 312, r: 22, lx: 306, ly: 316, rec: "strong", target: 1, m: "Deltoid through the axillary nerve; triceps and the wrist and finger extensors through the radial nerve", s: "Elbow, wrist and fingers extend: the posterior cord", mv: "elbowext", x: "The most lateral of the three cords, beside the medial cord and behind and lateral to the lateral cord.", c: 1 },
      { id: "sa", t: "muscle", n: "Serratus anterior", l: "SA", k: "path", d: "M0 336C120 338 220 346 320 346C420 344 540 326 640 306V352C540 364 420 368 320 366C220 366 120 364 0 364Z", lx: 470, ly: 358, rec: "weak", x: "On the chest wall, the deep border of the costoclavicular space.", c: 18 },
      { id: "rib", t: "bone", n: "Second rib", l: "RIB", k: "path", d: "M150 382C220 372 330 370 450 380V400H150Z", cortex: "M150 382C220 372 330 370 450 380", lx: 300, ly: 394, x: "A bright curved line with a dark shadow beneath it, deep to serratus anterior.", hit: ["On the rib", "The tip is on bone, beneath the costoclavicular space. Withdraw to the cords."] },
      { id: "pleura", t: "bone", n: "Pleura", l: "PLEURA", k: "path", d: "M36 386C80 386 120 385 150 383V400H36ZM450 381C520 385 590 387 640 387V400H450Z", cortex: "M36 386C80 386 120 385 150 383M450 381C520 385 590 387 640 387", lx: 560, ly: 398, avoid: 1, rec: "strong", x: "A bright line on either side of the rib that slides with breathing, with lung beneath it.", hit: ["Pleura", "Stop and withdraw. The tip has reached the pleura."] }
    ],
    groove: "M200 284A80 60 0 1 0 360 284A80 60 0 1 0 200 284Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the lateral end of the probe, in plane."],
      subcut: ["Skin and subcutaneous tissue", "The first layer. Pectoralis major and the edge of deltoid lie beneath."],
      tri: ["Between the muscle layers", "The plane between pectoralis major and the deeper muscles, where the cephalic vein and the thoracoacromial branches run. An injection here does not reach the cords."],
      groove: ["Inside the paraneural sheath, among the cords", "Beneath subclavius, inside the sheath that holds the three cords. The local anaesthetic should go in the middle of the three."],
      deep: ["Costoclavicular space, outside the sheath", "Fat outside the sheath around the cords, or towards the chest wall. Redirect to the middle of the three cords."]
    },
    zoneNote: { pmaj: ["", "Too superficial: the cords lie beneath subclavius. "], delt: ["", "Too superficial. "], sub: ["", "Too superficial: the cords lie beneath this muscle. "], pmin: ["", "Too superficial: the cords lie beneath this muscle. "], sa: ["warn", "Too deep: the tip is on the chest wall. Withdraw. "] },
    wrongNote: "Redirect to the middle of the three cords.",
    targetNote: "This is the target: in the middle of the three cords, beneath the lateral cord and above the medial and posterior cords.",
    la: { "in": [280, 284, 66, 50] },
    consensus: "No consensus list has been published for this block. These are the structures named in the published technique.",
    refs: { stim: 47, sens: 48, press: 49, cons: 2, where: 2 },
    avoidNote: "Find these with colour Doppler before the needle goes in. The cephalic vein and the thoracoacromial artery lie close to the needle path; the axillary vein is medial to the artery.",
    variants: [
      { n: "Three cords", t: "The three cords lie together lateral to the artery: the lateral cord in front, the medial cord behind it beside the artery, the posterior cord most lateral." },
      { n: "More than three structures", f: "median 4.5", t: "The cords are not always three neat circles. In a review of scans the median number of neural structures seen in the space was 4.5, with a range of 3 to 8, in several arrangements. Here the lateral and posterior cords each show as two.", set: { lc: { k: "duo", a: [266, 248, 15], b: [296, 254, 14], cx: 281, cy: 251, lx: 266, ly: 252 }, pc: { k: "duo", a: [296, 310, 15], b: [324, 318, 14], cx: 310, cy: 314, lx: 296, ly: 314 } } }
    ], varRef: 18,
    inj: {
      skin: "A skin wheal only. The cords lie beneath two muscle layers.",
      refuse: REFUSE,
      tri: "The fluid spreads between the muscle layers, outside the sheath. The cords are not outlined.", triZ: [],
      z: { pmaj: ["The fluid swells inside pectoralis major. The cords are beneath the next muscle layer.", 26, 10], delt: ["The fluid swells inside deltoid. The cords are much deeper.", 22, 10], sub: ["The fluid swells inside subclavius, above the sheath. Advance through the fascia beneath it.", 22, 9], pmin: ["The fluid swells inside pectoralis minor. Advance into the sheath beneath it.", 22, 9], sa: ["The fluid swells inside serratus anterior, on the chest wall. Withdraw to the cords.", 24, 8] },
      deep: "The fluid spreads in the space but outside the sheath, and the cords are not outlined. Redirect into the sheath, to the middle of the three cords.",
      good: { "in": "The fluid fills the sheath and separates the three cords. If the septum keeps it around the lateral cord, a second injection deep to it, between the medial cord and the artery, completes the spread." },
      tail: "In the first ultrasound series of this block, 29 of 30 patients (97%) had surgery under the block alone."
    },
    steps: [
      { to: 14, say: "The needle enters at the lateral end of the probe, in plane, and runs from lateral to medial." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "pmaj+34", say: "Through the edge of deltoid into pectoralis major. Check with colour Doppler first: the cephalic vein and the thoracoacromial artery lie close to this path.", hold: 3600 },
      { to: "pre+2", pre: "Through pectoralis minor, then the ", fas: "pre", hold: 3800 },
      { say: "Inside the sheath. With the stimulator at 1.0 mA the elbow flexes: the lateral cord is just above the needle.", on: 1, ma: 1, hold: 3000 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance slowly beneath the lateral cord to the middle of the three. The twitch returns at 0.5 mA: the tip is close. In cadavers the needle pierced the lateral cord in three of eight paths.", hold: 3800 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside a cord.", ma: 0.2, hold: 2800 },
      { say: "Inject against low pressure and watch the fluid separate the cords.", inject: 1, hold: 3800 },
      { say: "A septum under the lateral cord can hold the fluid in the superficial compartment. A second injection between the medial cord and the artery shortened onset. Open Approach, above the image, to compare the lateral sagittal view.", flash: 1, hold: 5600 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ]
  };

  /* Lateral sagittal view, medial to the coracoid. 70 px = 1 cm. Screen left = caudal, right = cranial: the needle comes from the cranial end. */
  window.BP_SCENES.lsib = {
    title: "Infraclavicular block: lateral sagittal approach",
    entry: [640, 60], target: [446, 304], mm: 0.143, ori: ["Caudal", "Cranial"],
    scanTitle: "Sonoanatomy medial to the coracoid process", altLabel: "Approach", alts: ALTS, varLabel: "Variations",
    recLab: RL,
    fascia: [
      { id: "inv", n: "Pectoral fascia", d: "M0 81C200 78 440 78 640 82", t: "The first layer under the subcutaneous tissue, covering pectoralis major." },
      { id: "pre", n: "Clavipectoral fascia beneath pectoralis minor", d: "M0 226C120 222 260 218 380 216C460 214 560 214 640 216", t: "The deep layer of the fascia that encloses pectoralis minor. The axillary artery, the vein and the three cords lie beneath it." }
    ],
    shapes: [
      { id: "pmaj", t: "muscle", n: "Pectoralis major", l: "PMaj", k: "path", d: "M0 83C200 80 440 80 640 84V154C440 150 200 152 0 158Z", lx: 160, ly: 122, rec: "strong", x: "The superficial muscle of the chest wall. Medial and lateral pectoral nerves." },
      { id: "pmin", t: "muscle", n: "Pectoralis minor", l: "PMin", k: "path", d: "M0 168C200 162 440 160 640 166V213C560 211 460 211 380 213C260 215 120 219 0 223Z", lx: 180, ly: 194, rec: "strong", x: "Deep to pectoralis major. The cords lie behind it." },
      { id: "cv", t: "vein", n: "Cephalic vein", l: "CV", k: "ellipse", cx: 598, cy: 160, rx: 13, ry: 8, lx: 598, ly: 147, avoid: 1, rec: "weak", x: "Runs between the pectoral muscles towards the axillary vein, on the cranial side of the image. It flattens under the probe: use light pressure and colour Doppler." },
      { id: "taa", t: "artery", n: "Thoracoacromial artery and its pectoral branches", l: "TAA", k: "circle", cx: 512, cy: 162, r: 6, lx: 512, ly: 148, avoid: 1, rec: "weak", x: "Small pulsatile branches between the pectoral muscles, best shown with colour Doppler." },
      { id: "aa", t: "artery", n: "Axillary artery", l: "AA", k: "circle", cx: 425, cy: 270, r: 26, lx: 425, ly: 274, avoid: 1, rec: "strong", x: "Round and pulsatile behind pectoralis minor, with the cords around it. The needle is aimed at its back wall, on the cranial side.", c: 3 },
      { id: "av", t: "vein", n: "Axillary vein", l: "AV", k: "ellipse", cx: 315, cy: 284, rx: 35, ry: 24, lx: 315, ly: 288, avoid: 1, rec: "strong", x: "Caudal to the artery and compressible, on the far side of the artery from the needle." },
      { id: "lc", t: "nerve", n: "Lateral cord", l: "LC", k: "circle", cx: 460, cy: 236, r: 16, lx: 424, ly: 232, rec: "strong", target: 1, bright: 1, m: "Biceps and brachialis through the musculocutaneous nerve, and the lateral root of the median nerve", s: "Elbow flexes: biceps, through the musculocutaneous nerve", mv: "elbowflex", x: "Usually cranial and superficial to the artery. The needle passes on its cranial side." },
      { id: "pc", t: "nerve", n: "Posterior cord", l: "PC", k: "circle", cx: 424, cy: 322, r: 16, lx: 424, ly: 326, rec: "strong", target: 1, bright: 1, m: "Deltoid through the axillary nerve; triceps and the wrist and finger extensors through the radial nerve", s: "Wrist and fingers extend: the posterior cord, through the radial nerve", mv: "elbowext", x: "Usually behind the artery. Its twitch, extension of the wrist and fingers, is the usual response at the target." },
      { id: "mc", t: "nerve", n: "Medial cord", l: "MC", k: "circle", cx: 386, cy: 318, r: 15, lx: 366, ly: 344, rec: "strong", target: 1, bright: 1, m: "Finger flexors and the small muscles of the hand through the ulnar nerve and the medial root of the median nerve", s: "Fingers flex", x: "Usually behind the artery, between the artery and the vein: the cord furthest from the needle." },
      { id: "ssc", t: "muscle", n: "Subscapularis and serratus anterior", l: "SSc", k: "path", d: "M0 350C140 348 300 346 420 346C520 346 600 344 640 342V400H380C340 392 300 384 260 382C200 372 150 372 100 380C70 380 30 380 0 380Z", lx: 530, ly: 378, rec: "weak", x: "The deep muscle layer behind the cords, on the chest wall." },
      { id: "rib", t: "bone", n: "Rib", l: "RIB", k: "path", d: "M100 386C150 374 210 374 260 386V400H100Z", cortex: "M100 386C150 374 210 374 260 386", lx: 180, ly: 396, x: "A bright curved line with a shadow beneath it, on the caudal side of the image.", hit: ["On the rib", "The tip is on bone, deep and caudal. Withdraw to the back of the artery."] },
      { id: "pleura", t: "bone", n: "Pleura", l: "PLEURA", k: "path", d: "M0 384C40 385 70 386 100 388V400H0ZM260 388C300 389 340 392 380 396V400H260Z", cortex: "M0 384C40 385 70 386 100 388M260 388C300 389 340 392 380 396", lx: 50, ly: 397, avoid: 1, rec: "strong", x: "A bright sliding line beside the rib, caudal and deep to the vessels. In volunteers the pleura was never closer than 7.5 cm in the sagittal plane, but a needle steered caudally and deep is heading here.", c: 3, hit: ["Pleura", "Stop and withdraw. The tip has reached the pleura. A pneumothorax has been reported after this block under ultrasound."] }
    ],
    groove: "M398 280H512V346H398Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it just below the clavicle, at the cranial end of the probe, in plane."],
      subcut: ["Skin and subcutaneous tissue", "The first layer. Pectoralis major lies beneath."],
      tri: ["Between the pectoral muscles", "The plane between pectoralis major and pectoralis minor, where the cephalic vein and the thoracoacromial branches run. An injection here does not reach the cords."],
      groove: ["Behind the axillary artery, on its cranial side", "Fat behind the artery, beside the posterior cord. This is where the local anaesthetic should go."],
      deep: ["Around the vessels, but not behind the artery", "Beneath pectoralis minor but in front of or beside the vessels, or too deep. Redirect to the back of the artery, on its cranial side."]
    },
    zoneNote: { pmaj: ["", "Too superficial. Withdraw and aim behind the artery. "], pmin: ["", "Too superficial: the cords lie behind this muscle. "], ssc: ["warn", "Too deep: the tip is in the muscle of the chest wall. Withdraw. "] },
    wrongNote: "Redirect to the back of the artery.",
    targetNote: "This is the target: behind the axillary artery on its cranial side, beside the posterior cord.",
    la: { "in": [440, 308, 50, 17] },
    consensus: "No consensus list has been published for this block. These are the structures named in the published technique.",
    refs: { stim: 47, sens: 48, press: 49, cons: 3, where: 32 },
    avoidNote: "Find the artery and the vein before the needle moves, and look for the pleura on the caudal side. The steep needle is often hard to see: move it only when the tip is in view.",
    variants: [
      { n: "Usual arrangement", t: "The lateral cord is cranial to the artery, the posterior and medial cords behind it." },
      { n: "Lateral cord in front", t: "The arrangement of the cords around the artery varies between patients. Here the lateral cord lies in front of the artery and the medial cord between the artery and the vein. The target behind the artery does not change.", set: { lc: { cx: 440, cy: 232, lx: 404, ly: 228 }, mc: { cx: 372, cy: 296, lx: 372, ly: 330 } } }
    ],
    inj: {
      skin: "A skin wheal only.",
      refuse: REFUSE,
      tri: "The fluid spreads between the pectoral muscles. It does not reach the cords.", triZ: [],
      z: { pmaj: ["The fluid swells inside pectoralis major. The cords are two layers deeper.", 26, 10], pmin: ["The fluid swells inside pectoralis minor. The cords lie behind this muscle.", 24, 9], ssc: ["The fluid swells inside the deep muscle on the chest wall. Withdraw to the back of the artery.", 24, 9] },
      deep: "The fluid lies around the vessels but not behind the artery; the cords behind it stay dry. Redirect to the back of the artery, on its cranial side.",
      medial: [404, "The fluid is behind the artery but on its caudal side, towards the vein. The published technique places it on the cranial side."],
      far: [52, "The fluid is in the fat beside the artery, away from its back wall. Redirect to the back of the artery, beside the posterior cord."],
      good: { "in": "The fluid pools behind the artery in a U shape, lifts it forwards and wraps round to the posterior and medial cords and up to the lateral cord." },
      tail: "One injection behind the artery was as good as three around the cords: complete sensory block at 15 minutes in 84% and 78%."
    },
    steps: [
      { to: 14, say: "The needle enters just below the clavicle, medial to the coracoid process, at the cranial end of the probe, in plane. The angle is steep: a median of 50 degrees to the chest wall in 23 patients.", hold: 4200 },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "pmaj+40", say: "Through pectoralis major. At this angle the needle was hard to see in 39% of patients: advance only when the tip is in view.", hold: 3400 },
      { to: "pre+3", pre: "Across the plane between the pectoral muscles, through pectoralis minor and the ", fas: "pre", hold: 3800 },
      { to: "L-14", say: "The needle passes on the cranial side of the lateral cord and the artery, aiming behind the artery. With the stimulator at 1.0 mA the wrist and fingers extend: the posterior cord.", on: 1, ma: 1, hold: 3600 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance behind the artery. The twitch returns at 0.5 mA: the tip is close.", hold: 2400 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the cord.", ma: 0.2, hold: 2800 },
      { say: "Inject against low pressure. The fluid pools behind the artery and lifts it forwards.", inject: 1, hold: 3800 },
      { say: "Open Approach, above the image, to compare the costoclavicular view, where the cords lie together lateral to the artery and the needle path is shallower.", flash: 1, hold: 5200 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ]
  };
})();

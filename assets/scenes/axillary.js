/* NORA² block player scene: axillary brachial plexus block, in-plane from the lateral (biceps) end of the probe.
   The image is mirrored from the usual textbook view so that the needle can enter from the right: left = medial, right = lateral. */
window.BP_SCENES = window.BP_SCENES || {};
window.BP_SCENES.axillary = {
  title: "Axillary brachial plexus block: perivascular in-plane approach",
  entry: [640, 60], target: [318, 224], ori: ["Medial", "Lateral"],
  scanTitle: "Sonoanatomy in the axilla", varLabel: "Variations",
  recLab: { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] },
  fascia: [
    { id: "inv", n: "Deep fascia of the arm", d: "M0 77C200 74 440 74 640 78", t: "The first layer under the subcutaneous fat. Biceps and coracobrachialis lie beneath it on the lateral side, and the sheath around the artery on the medial side." },
    { id: "pre", n: "Fascia on the medial side of coracobrachialis", d: "M0 90C120 88 260 84 340 87C360 88 374 94 380 110C386 150 386 240 390 286C420 292 520 300 640 306", t: "Separates coracobrachialis from the fat around the artery. Once through it, the tip is in the compartment that holds the artery, the veins and the median, ulnar and radial nerves." },
    { id: "ct", n: "Conjoint tendon of latissimus dorsi and teres major", d: "M96 262C160 258 240 252 300 248C340 246 380 242 412 236", t: "The bright band deep to the artery, and a landmark for this block. The radial nerve usually lies on it and the perivascular injection goes just above it. Fluid placed beneath it does not reach the nerves." }
  ],
  shapes: [
    { id: "bic", t: "muscle", n: "Biceps, short head", l: "Biceps", k: "path", d: "M400 84C470 80 560 80 640 82V250C612 242 594 214 586 190C578 160 552 138 518 132C470 126 424 122 406 106C402 98 400 90 400 84Z", lx: 540, ly: 108, rec: "weak", x: "The superficial muscle on the lateral side. Musculocutaneous nerve; flexes the elbow and supinates the forearm. The needle crosses its medial edge." },
    { id: "cb", t: "muscle", n: "Coracobrachialis", l: "CB", k: "path", d: "M392 148C404 134 450 128 500 130C548 134 580 160 584 200C588 242 566 276 522 284C476 292 418 290 394 284C390 240 388 190 392 148Z", lx: 500, ly: 250, rec: "strong", x: "Lateral to the artery and deep to biceps. The musculocutaneous nerve usually runs through it, and the needle crosses it on the way to the artery. Musculocutaneous nerve; flexes and adducts the arm." },
    { id: "tric", t: "muscle", n: "Triceps, long and medial heads", l: "Triceps", k: "path", d: "M0 272C30 270 70 268 96 268C160 264 240 258 300 254C340 252 380 248 410 243C416 262 408 284 400 296C430 300 456 304 472 312C482 340 486 370 486 400H0Z", lx: 210, ly: 330, rec: "weak", x: "Deep to the conjoint tendon. Radial nerve; extends the elbow. A needle in this muscle has gone too deep." },
    { id: "hum", t: "bone", n: "Humerus", l: "Humerus", k: "path", d: "M490 400C496 356 530 326 580 320C606 318 626 322 640 328V400Z", cortex: "M490 400C496 356 530 326 580 320C606 318 626 322 640 328", lx: 548, ly: 374, avoid: 1, rec: "weak", x: "A bright curved line with a dark shadow beneath it: the shaft of the humerus, lateral and deep to the nerves.", hit: ["On the humerus", "The tip is on bone. Withdraw and aim more medially, towards the deep wall of the artery."] },
    { id: "aa", t: "artery", n: "Axillary artery", l: "AA", k: "circle", cx: 310, cy: 161, r: 31, lx: 310, ly: 165, avoid: 1, rec: "strong", x: "Round, pulsatile and not compressible. The landmark for the whole block: find it in short axis at the lateral border of pectoralis major. A double axillary artery was seen in 9.2% of 131 patients, so run colour Doppler.", c: 7 },
    { id: "v1", t: "vein", n: "Axillary vein", l: "V", k: "ellipse", cx: 233, cy: 139, rx: 31, ry: 20, lx: 233, ly: 143, avoid: 1, rec: "strong", x: "Thin-walled and compressible, medial to the artery. More than one axillary vein was seen in 87% of patients. Probe pressure collapses the veins, so ease off before every injection.", c: 7 },
    { id: "v2", t: "vein", n: "Second axillary vein, deeper", l: "V", k: "ellipse", cx: 228, cy: 213, rx: 24, ry: 15, lx: 228, ly: 217, avoid: 1, x: "A deeper vein beside the radial nerve. Vascular puncture was more common when the needle went deep to the artery: 22.5% below the artery against 5% with perineural injections, in 240 patients.", c: 27 },
    { id: "v3", t: "vein", n: "Small superficial vein", l: "", k: "ellipse", cx: 168, cy: 116, rx: 16, ry: 10, lx: 168, ly: 120, avoid: 1, x: "A small vein that is the first to collapse under the probe." },
    { id: "mn", t: "nerve", n: "Median nerve", l: "M", k: "circle", cx: 356, cy: 112, r: 16, lx: 356, ly: 116, rec: "strong", target: 1, m: "Forearm flexors and the thenar muscles; skin of the palm, thumb, index and middle fingers", s: "Wrist and fingers flex: the forearm pronates and the thumb, index and middle fingers flex", x: "Superficial and lateral to the artery, and close to it: a mean 2.1 mm away. It moves under probe pressure. A honeycomb pattern of dark fascicles in a bright border.", c: 13 },
    { id: "un", t: "nerve", n: "Ulnar nerve", l: "U", k: "circle", cx: 252, cy: 180, r: 13, lx: 252, ly: 184, rec: "strong", target: 1, m: "Flexor carpi ulnaris and the small muscles of the hand; skin of the little finger and the ulnar side of the hand", s: "Ring and little fingers flex: the wrist deviates to the ulnar side and the thumb adducts", x: "Medial to the artery, between it and the veins. It lay deep to the vein in 81% of 60 blocks and superficial to it in 19%.", c: 12 },
    { id: "rn", t: "nerve", n: "Radial nerve", l: "R", k: "circle", cx: 281, cy: 223, r: 14, lx: 281, ly: 227, rec: "strong", target: 1, m: "Triceps and the wrist and finger extensors; skin of the back of the arm, forearm and hand", s: "Elbow and wrist extend: triceps and the extensors", mv: "elbowext", x: "Deep to the artery and on its medial side, resting on the conjoint tendon. The perivascular injection goes beside it, at 6 o'clock under the artery.", c: 17 },
    { id: "mcn", t: "nerve", n: "Musculocutaneous nerve", l: "MC", k: "duo", a: [432, 200, 10], b: [451, 200, 10], cx: 441, cy: 200, r: 10, lx: 441, ly: 204, rec: "strong", target: 1, m: "Biceps, brachialis and coracobrachialis; skin of the lateral forearm", s: "Elbow flexes: biceps and brachialis", mv: "elbowflex", x: "A flat oval inside coracobrachialis, away from the artery, so it needs its own injection. In 387 blocks it lay outside the muscle in 22% and was fused with the median nerve in 16%.", c: 16 }
  ],
  groove: "M0 80H392V240C360 244 330 247 300 249C240 253 160 258 96 262C60 264 30 266 0 268Z",
  zones: {
    air: ["Above the skin", "The needle has not entered yet. Insert it at the lateral (biceps) end of the probe, in plane, at a shallow angle."],
    subcut: ["Skin and subcutaneous fat", "The first layer. The intercostobrachial and medial brachial cutaneous nerves run at this depth, further medially, off the image."],
    tri: ["Under the deep fascia, outside the sheath", "Fat between the deep fascia and the muscles or the sheath around the artery. An injection here does not reach the nerves."],
    groove: ["In the sheath around the axillary artery", "The fat around the artery, the veins and the median, ulnar and radial nerves. The perivascular injection goes deep to the artery, above the conjoint tendon."],
    deep: ["Deep to the nerves", "Too deep: below the conjoint tendon or beside the humerus. Withdraw towards the deep wall of the artery."]
  },
  zoneNote: { bic: ["", "Too superficial for the nerves around the artery. "], cb: ["", "The musculocutaneous nerve runs in this muscle. "], tric: ["warn", "Too deep: below the conjoint tendon. Withdraw. "] },
  wrongNote: "Redirect towards the deep wall of the artery.",
  targetNote: "This is the target: deep to the artery at 6 o'clock, above the conjoint tendon, beside the radial nerve.",
  variants: [
    { n: "Usual: MCN in coracobrachialis", t: "The musculocutaneous nerve runs through coracobrachialis, away from the artery, and is blocked with its own injection. In 387 blocks it lay outside the muscle in 22%." },
    { n: "MCN beside the artery", f: "6%", t: "The musculocutaneous nerve has left coracobrachialis and lies close to the lateral side of the artery. It still needs to be found and covered: trace it up and down the arm.", set: { mcn: { a: [362, 162, 8], b: [377, 162, 8], cx: 370, cy: 162, r: 8, lx: 398, ly: 150, x: "Outside coracobrachialis, beside the artery. In 387 blocks the nerve lay close to the artery in 6%." } } },
    { n: "MCN fused with the median nerve", f: "16%", t: "There is no separate nerve in coracobrachialis. The musculocutaneous and median nerves run as one larger structure lateral to the artery. After injection, 61% of these fused structures separated into two nerves.", set: { mcn: { hide: 1 }, mn: { r: 20, n: "Median and musculocutaneous nerves, fused", l: "M+MC", m: "Forearm flexors, thenar muscles, biceps and brachialis; skin of the palm and the lateral forearm", s: "Elbow and fingers flex: biceps, with the forearm flexors", mv: "elbowflex", x: "One larger structure, lateral to the artery, carrying both nerves. If there is no nerve in coracobrachialis, look here." } } }
  ], varRef: 16,
  la: { "in": [306, 214, 52, 22] },
  consensus: "No consensus list has been published for this block. These are the structures named in the published technique.",
  refs: { stim: 46, sens: 32, press: 47, cons: 3, where: 3 },
  avoidNote: "Find the veins before the needle moves: they collapse under probe pressure and reappear when it is released. Run colour Doppler for a second artery. The humerus lies lateral and deep.",
  inj: {
    skin: "A subcutaneous bleb only. The nerves lie beneath the deep fascia, around the artery.",
    refuse: "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.",
    tri: "The fluid spreads under the deep fascia, outside the sheath around the artery. It does not reach the nerves.", triZ: [],
    z: {
      bic: ["The fluid swells inside biceps. Advance through coracobrachialis towards the deep wall of the artery.", 24, 12],
      cb: ["The fluid swells inside coracobrachialis. Beside the musculocutaneous nerve this is its own injection, and the fluid should ring the nerve: 5.5 mL of lidocaine 1.5% in a dose-finding study.<a class=\"cite\" href=\"#ref-4\">4</a> For the main injection, advance through the fascia to the deep wall of the artery.", 24, 14],
      tric: ["The fluid swells inside triceps, deep to the conjoint tendon. It does not reach the nerves. Withdraw above the tendon.", 26, 12]
    },
    deep: "Deep to the conjoint tendon or beside the humerus: the fluid does not reach the nerves. Withdraw.",
    medial: [250, "The fluid is among the veins, medial to the artery, where vascular puncture happens. Ease off the probe, aspirate and move back towards the artery."],
    far: [56, "The fluid is in the sheath but away from the deep wall of the artery. Beside one nerve this is a perineural injection: it covers that nerve, and the others need their own."],
    good: { "in": "The fluid spreads deep to the artery, lifts it and tracks round it towards the median and ulnar nerves, with the radial nerve outlined." },
    tail: "In 50 patients, 24 mL deep to the artery after a separate musculocutaneous injection gave surgical anaesthesia as often as perineural injections (92 to 96%), with fewer needle passes."
  },
  steps: [
    { to: 14, say: "The needle enters at the lateral end of the probe, over biceps, in plane and at a shallow angle." },
    { to: "inv+3", fas: "inv", hold: 2600 },
    { to: "cb+16", say: "Through the medial edge of biceps into coracobrachialis. The stimulator goes on at 1.0 mA.", on: 1, ma: 1, hold: 2600 },
    { to: 241, say: "The musculocutaneous nerve lies just below the needle, inside coracobrachialis, and the elbow flexes. Block it first, on its own: a small volume that rings the flat nerve. A dose-finding study used 5.5 mL of lidocaine 1.5%.", hold: 5200 },
    { to: "pre+3", pre: "Out of coracobrachialis through the ", fas: "pre", hold: 3200 },
    { to: "L", say: "The tip lies deep to the artery, at 6 o'clock, above the bright conjoint tendon. The radial nerve answers: the elbow and wrist extend.", hold: 3000 },
    { say: "Turn the current down. At 0.5 mA the twitch is still there: the tip is close.", ma: 0.5, hold: 2600 },
    { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
    { say: "Ease off the probe so the veins reappear, aspirate, and inject against low pressure. The fluid spreads deep to the artery and lifts it.", inject: 1, hold: 4200 },
    { say: "For a perineural block, the needle is redirected to the median and ulnar nerves in turn, 8 mL around each in one trial. Perivascular injection took fewer passes; perineural had a faster onset and less vascular puncture.", hold: 6000 },
    { say: "The musculocutaneous nerve is not always in coracobrachialis. Open Variations, above the image, to see where else it lies.", flash: 1, hold: 4800 },
    { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
  ]
};

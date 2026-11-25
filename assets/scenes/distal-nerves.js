/* NORA² block player scenes: distal (terminal) nerve blocks of the arm and forearm.
   radialarm: radial nerve above the elbow, in plane from the lateral end of the probe. Mirrored so the needle enters from the right: left = anterior/medial, right = lateral.
   medianforearm: median nerve in the mid-forearm, in plane from the radial end. Mirrored: left = ulnar, right = radial.
   ulnarforearm: ulnar nerve in the mid-forearm, in plane from the ulnar end: left = radial, right = ulnar. */
window.BP_SCENES = window.BP_SCENES || {};
(function () {
  var ALTS = [["radialarm", "Radial"], ["medianforearm", "Median"], ["ulnarforearm", "Ulnar"]];
  var REC = { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] };
  var REFUSE = "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.";
  var CONS = "No consensus list has been published for this block. These are the structures named in the published technique.";
  var LAST = { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 };

  /* ---------------- Radial nerve above the elbow (105 px = 1 cm) ---------------- */
  window.BP_SCENES.radialarm = {
    title: "Radial nerve block above the elbow: in plane from the lateral side",
    entry: [636, 58], target: [364, 234], ori: ["Anterior/medial", "Lateral"],
    scanTitle: "Sonoanatomy of the lateral distal arm", altLabel: "Nerve", alts: ALTS, recLab: REC,
    fascia: [
      { id: "inv", n: "Deep fascia of the arm", d: "M0 90C160 84 420 84 640 92", t: "The first layer under the subcutaneous fat. Brachioradialis lies beneath it on the lateral side, brachialis on the anterior side." },
      { id: "pre", n: "Fascia between brachioradialis and brachialis", d: "M0 104C90 102 170 100 214 102C238 122 274 176 304 210C316 216 344 216 370 212C440 194 540 160 640 150", t: "The deep surface of brachioradialis, running obliquely down to the nerve. Beneath it, in the cleft against brachialis, lie the radial nerve and the small radial collateral artery. This is the plane the fluid should open." }
    ],
    shapes: [
      { id: "cv", t: "vein", n: "Cephalic vein", l: "CV", k: "ellipse", cx: 140, cy: 70, rx: 15, ry: 8, lx: 180, ly: 74, x: "A small compressible vein in the subcutaneous fat on the front of the arm. It flattens under the probe and lies away from the needle path." },
      { id: "br", t: "muscle", n: "Brachioradialis", l: "BR", k: "path", d: "M214 102C216 96 240 94 270 94C380 92 520 92 640 98V150C540 160 440 194 370 212C344 216 316 216 304 210C274 176 238 122 214 102Z", lx: 470, ly: 132, rec: "strong", x: "The superficial muscle on the lateral side, arising from the lateral supracondylar ridge. Radial nerve; flexes the elbow with the forearm midway between pronation and supination. The needle crosses it to reach the nerve on its deep surface.", c: 4 },
      { id: "bra", t: "muscle", n: "Brachialis", l: "BRA", k: "path", d: "M0 110C80 108 160 106 206 110C226 130 250 162 268 184C262 210 258 250 274 266C300 280 360 270 392 250C404 238 406 226 404 216C440 202 500 178 560 164C552 214 544 268 536 320C470 306 420 304 384 306C300 308 210 326 150 362V400H0Z", lx: 110, ly: 230, rec: "strong", x: "The large muscle lying on the front of the humerus, medial and deep to the nerve. Mainly musculocutaneous nerve; flexes the elbow. A tip inside it has gone past the plane.", c: 4 },
      { id: "tric", t: "muscle", n: "Triceps, lateral head", l: "TRI", k: "path", d: "M566 160C590 156 616 154 640 154V400H600V350C580 338 560 328 540 322C548 270 556 210 566 160Z", lx: 598, ly: 312, rec: "weak", x: "Behind the lateral intermuscular septum, the bright line between it and brachialis. Radial nerve; extends the elbow. Higher in the arm the radial nerve runs behind the humerus under this muscle, then pierces the septum to reach the front." },
      { id: "hum", t: "bone", n: "Humerus", l: "HUMERUS", k: "path", d: "M150 362C210 326 300 308 384 306C460 305 520 314 600 348V400H150Z", cortex: "M150 362C210 326 300 308 384 306C460 305 520 314 600 348", lx: 380, ly: 356, rec: "weak", x: "A bright curved line with a clean acoustic shadow beneath it. The nerve lies about a centimetre above the bone at this level.", hit: ["Bone contact: humerus", "Too deep. The tip is on the humerus. Withdraw into the plane between the two muscles, beside the nerve."] },
      { id: "rn", t: "nerve", n: "Radial nerve", l: "RN", k: "duo", a: [321, 230, 7.5], b: [339, 230, 7.5], sheath: [330, 230, 21, 13], cx: 330, cy: 230, r: 13, lx: 330, ly: 234, rec: "strong", target: 1, m: "Brachioradialis, the wrist and finger extensors and the thumb extensors through the deep branch (posterior interosseous nerve), and the skin of the back of the radial side of the hand through the superficial branch", s: "Wrist and fingers extend: the radial nerve, still undivided at this level", x: "An oval honeycomb with a bright border in the cleft between brachioradialis and brachialis. In volunteers it lay at a mean depth of 1.71 cm here, with a cross-sectional area of 2.9 mm2, and had not yet divided into its superficial and deep branches.", c: 4 },
      { id: "rca", t: "artery", n: "Radial collateral artery (profunda brachii branch)", l: "RCA", k: "circle", cx: 284, cy: 250, r: 8, lx: 246, ly: 268, avoid: 1, rec: "strong", x: "A small pulsatile vessel in the same cleft, a few millimetres from the nerve. Colour Doppler finds it. At this point the vessels were further from the nerve than in the spiral groove, which is why the authors preferred it.", c: 4 }
    ],
    groove: "M270 182C290 200 310 214 340 216C370 214 390 210 402 214C406 230 396 248 372 260C340 270 296 274 278 262C264 248 264 206 270 182Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the lateral end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer. The cephalic vein runs here on the front of the arm."],
      tri: ["In a fascial plane, away from the nerve", "The tip is under the deep fascia or in the cleft between the muscles, but not beside the nerve. Follow the plane to the nerve."],
      groove: ["Beside the radial nerve, between brachioradialis and brachialis", "The fat of the cleft that holds the nerve and the radial collateral artery. This is where the local anaesthetic should go."],
      deep: ["Deep to the muscles", "Too deep. Withdraw into the plane between brachioradialis and brachialis."]
    },
    zoneNote: { br: ["", "Not yet through brachioradialis. Keep advancing towards its deep surface. "], bra: ["warn", "Too deep: you have passed the plane and entered brachialis. Withdraw a little. "], tric: ["warn", "Too posterior: this is behind the septum. Redirect. "] },
    wrongNote: "Redirect towards the radial nerve in the plane between brachioradialis and brachialis.",
    targetNote: "This is the target: in the plane between brachioradialis and brachialis, on the lateral side of the nerve, outside it.",
    la: { "in": [330, 232, 46, 24] },
    consensus: CONS,
    refs: { stim: 41, sens: 34, press: 42, cons: 4, where: 4 },
    avoidNote: "Find the small artery beside the nerve with colour Doppler before the needle goes in. In the spiral groove, higher up, the nerve lies closer to the profunda brachii vessels.",
    inj: {
      skin: "A skin wheal only. The nerve lies under brachioradialis, nearly 2 cm deeper.",
      refuse: REFUSE,
      tri: "The fluid spreads in a fascial plane but does not reach the nerve. Follow the plane down to the nerve and inject beside it.", triZ: [],
      z: {
        br: ["The fluid streaks through brachioradialis and swells the muscle. Advance through its deep surface into the plane beside the nerve.", 24, 13],
        bra: ["The fluid swells inside brachialis, deep to the plane. Withdraw until the tip lies in the cleft beside the nerve.", 24, 15],
        tric: ["The fluid swells inside triceps, behind the septum. Withdraw and redirect towards the nerve.", 20, 14]
      },
      deep: "Too deep: the fluid lies on the humerus, away from the nerve. Withdraw into the plane.",
      far: [44, "The fluid is in the cleft, but on the anterior side of the nerve, next to the radial collateral artery. Come back to the lateral side of the nerve."],
      good: { "in": "The fluid opens the plane between brachioradialis and brachialis and surrounds the nerve: the doughnut sign." },
      tail: "In volunteers the nerve lay at a mean depth of 1.71 cm at this point, with the vessels further away than in the spiral groove."
    },
    steps: [
      { to: 14, say: "The needle enters at the lateral end of the probe, in plane, and appears in the subcutaneous fat." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "br+60", say: "Through brachioradialis, keeping the whole shaft in view. The stimulator goes on at 1.0 mA.", on: 1, ma: 1, hold: 2800 },
      { to: "pre+3", pre: "Out of the deep surface of brachioradialis, through the ", fas: "pre", hold: 3400 },
      { to: "L-20", say: "The tip nears the lateral side of the nerve. The wrist and fingers extend.", hold: 2800 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance a millimetre or two along the plane. The twitch returns at 0.5 mA: the tip is close.", hold: 2600 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
      { say: "Inject against low pressure. The fluid opens the plane and surrounds the nerve; if the ring is incomplete, move the tip to the other side of the nerve.", inject: 1, hold: 4200 },
      LAST
    ]
  };

  /* ---------------- Median nerve in the mid-forearm (125 px = 1 cm) ---------------- */
  window.BP_SCENES.medianforearm = {
    title: "Median nerve block in the mid-forearm: in plane from the radial side",
    entry: [636, 58], target: [375, 206], mm: 0.08, ori: ["Ulnar", "Radial"],
    scanTitle: "Sonoanatomy of the mid-forearm", altLabel: "Nerve", alts: ALTS, recLab: REC, varLabel: "Variations",
    fascia: [
      { id: "inv", n: "Deep fascia of the forearm", d: "M0 86C200 80 440 80 640 86", t: "The first layer under the subcutaneous fat. The superficial flexors lie beneath it." },
      { id: "pre", n: "Plane between flexor digitorum superficialis and profundus", d: "M0 214C80 206 160 196 240 190C290 186 370 184 420 188C480 192 560 204 640 216", t: "The bright fascial line under flexor digitorum superficialis. The median nerve runs down the forearm in this plane, and the fluid should spread along it." }
    ],
    shapes: [
      { id: "fcu", t: "muscle", n: "Flexor carpi ulnaris", l: "FCU", k: "path", d: "M0 92C60 88 140 88 176 94C186 120 184 156 172 176C150 184 70 194 0 200Z", lx: 84, ly: 140, x: "The superficial muscle on the ulnar side. Ulnar nerve; flexes the wrist towards the little finger. The ulnar nerve and artery lie beneath it." },
      { id: "pl", t: "muscle", n: "Palmaris longus", l: "PL", k: "path", d: "M300 92C330 86 380 86 410 92C416 108 402 124 362 128C330 130 304 120 300 108Z", lx: 356, ly: 112, x: "A small superficial muscle in the middle of the forearm, absent in some people. Median nerve; tenses the palmar fascia." },
      { id: "fcr", t: "muscle", n: "Flexor carpi radialis", l: "FCR", k: "path", d: "M420 92C460 86 510 86 538 92C548 118 540 148 510 158C470 164 434 152 426 128C420 112 418 100 420 92Z", lx: 482, ly: 126, rec: "weak", x: "The superficial muscle on the radial side of the median nerve. Median nerve; flexes the wrist. The needle crosses it on the way to the plane." },
      { id: "br", t: "muscle", n: "Brachioradialis", l: "BR", k: "path", d: "M552 90C590 86 620 86 640 88V196C610 196 574 182 560 160C548 136 546 108 552 90Z", lx: 604, ly: 128, x: "The superficial muscle at the radial edge of the forearm. Radial nerve; flexes the elbow. The radial artery and the superficial radial nerve lie under its medial edge." },
      { id: "fds", t: "muscle", n: "Flexor digitorum superficialis", l: "FDS", k: "path", d: "M184 94C224 88 268 88 296 92C300 118 320 134 362 134C398 134 410 116 414 100C420 128 440 160 488 164C514 166 534 162 550 170C550 186 542 196 530 199C480 192 420 187 370 185C320 185 260 188 182 196C190 170 192 130 184 94Z", lx: 250, ly: 146, rec: "strong", x: "The broad muscle across the middle of the forearm. Median nerve; flexes the fingers at the middle joints. The median nerve lies against its deep surface, and the needle passes through it to reach the plane.", c: 5 },
      { id: "fdp", t: "muscle", n: "Flexor digitorum profundus", l: "FDP", k: "path", d: "M0 222C80 214 160 204 240 198C268 196 282 200 286 210C294 230 344 238 376 232C402 226 412 212 414 198C420 240 430 300 434 372C380 368 300 366 226 372C214 356 196 346 170 342C120 334 40 340 0 352Z", lx: 160, ly: 284, rec: "strong", x: "The deep finger flexor, lying on the ulna and the interosseous membrane. Median nerve (anterior interosseous branch) on the radial side, ulnar nerve on the ulnar side. A tip inside it has gone past the plane.", c: 5 },
      { id: "fpl", t: "muscle", n: "Flexor pollicis longus", l: "FPL", k: "path", d: "M424 198C480 198 580 208 640 220V352C620 344 590 338 560 340C510 344 466 356 446 372C442 300 434 240 424 198Z", lx: 530, ly: 280, x: "The deep muscle on the radial side, lying on the radius. Anterior interosseous branch of the median nerve; flexes the tip of the thumb." },
      { id: "rad", t: "bone", n: "Radius", l: "RADIUS", k: "path", d: "M446 400C454 366 500 344 560 340C600 338 626 344 640 352V400Z", cortex: "M450 386C462 360 504 344 560 340C600 338 626 344 640 352", lx: 560, ly: 380, x: "A bright curved line with a shadow beneath it on the radial side.", hit: ["Bone contact: radius", "Far too deep. Withdraw to the plane under flexor digitorum superficialis."] },
      { id: "uln", t: "bone", n: "Ulna", l: "ULNA", k: "path", d: "M0 352C40 340 120 334 170 342C200 348 220 364 226 400H0Z", cortex: "M0 352C40 340 120 334 170 342C200 348 216 362 222 384", lx: 96, ly: 380, x: "A bright curved line with a shadow beneath it on the ulnar side. The interosseous membrane joins it to the radius.", hit: ["Bone contact: ulna", "Far too deep. Withdraw to the plane under flexor digitorum superficialis."] },
      { id: "mn", t: "nerve", n: "Median nerve", l: "MN", k: "duo", a: [316, 202, 10.5], b: [344, 202, 10.5], sheath: [330, 202, 31, 15], cx: 330, cy: 202, r: 15, lx: 330, ly: 206, rec: "strong", target: 1, m: "Most of the thumb muscles (opposition), the radial finger flexors and the skin of the palm, thumb, index, middle and half the ring finger", s: "Thumb opposes and index finger flexes: the median nerve; the wrist may flex too if branches to the flexors are reached", x: "A flattened honeycomb oval with a bright border, lying in the plane between the two finger flexors. Slide the probe up and down: tendons turn into muscle, the nerve stays in the plane.", c: 5 },
      { id: "ma", t: "artery", n: "Median artery", l: "", k: "circle", cx: 300, cy: 222, r: 5, lx: 300, ly: 238, avoid: 1, hide: 1, x: "A small artery running with the nerve. A large persistent median artery is an uncommon variant. Colour Doppler shows it: keep the tip on the side of the nerve away from it." },
      { id: "ra", t: "artery", n: "Radial artery", l: "RA", k: "circle", cx: 540, cy: 150, r: 13, lx: 516, ly: 182, avoid: 1, rec: "strong", x: "Round and pulsatile, under the medial edge of brachioradialis on the radial side. The needle passes above it.", c: 5 },
      { id: "srn", t: "nerve", n: "Superficial radial nerve", l: "SRN", k: "circle", cx: 574, cy: 152, r: 6, lx: 576, ly: 178, bright: 1, wrong: 1, rec: "weak", m: "Skin only: the back of the thumb, the index finger and the radial side of the hand", s: "No twitch, only tingling over the back of the thumb: the superficial radial nerve, a sensory nerve", wn: "This is the superficial radial nerve beside the radial artery. Aim deeper and more ulnar, for the plane under flexor digitorum superficialis.", x: "A small bright dot beside the radial artery under brachioradialis. It carries only sensation, and can be blocked on its own here.", c: 9 },
      { id: "ua", t: "artery", n: "Ulnar artery", l: "UA", k: "circle", cx: 198, cy: 176, r: 14, lx: 198, ly: 180, avoid: 1, rec: "weak", x: "Pulsatile, under flexor carpi ulnaris on the radial side of the ulnar nerve. It is far from the needle on this approach.", c: 5 },
      { id: "un", t: "nerve", n: "Ulnar nerve", l: "UN", k: "duo", a: [128, 196, 8], b: [148, 196, 8], sheath: [138, 196, 24, 12], cx: 138, cy: 196, r: 12, lx: 138, ly: 220, wrong: 1, rec: "weak", m: "Most of the small muscles of the hand and the skin of the little finger", s: "Little finger flexes and fingers adduct: the ulnar nerve, not the median", wn: "Too ulnar: this is the ulnar nerve. Withdraw and redirect towards the median nerve in the middle of the forearm.", x: "Under flexor carpi ulnaris, on the ulnar side of the ulnar artery. In about 19.5% of limbs fibres cross from the median to the ulnar nerve in the forearm (Martin-Gruber anastomosis), so a hand muscle may keep working after one nerve is blocked.", c: 16 }
    ],
    groove: "M282 192C320 184 380 184 412 194C414 212 402 226 376 232C340 238 300 234 288 216C284 208 280 198 282 192Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the radial end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer."],
      tri: ["In a fascial plane, away from the nerve", "The tip lies between the superficial muscles or in the plane under flexor digitorum superficialis, but not beside the nerve. Follow the plane to the nerve."],
      groove: ["Beside the median nerve, between the two finger flexors", "The plane between flexor digitorum superficialis and profundus, against the nerve. This is where the local anaesthetic should go."],
      deep: ["Deep to the flexors", "Too deep. Withdraw to the plane under flexor digitorum superficialis."]
    },
    zoneNote: { fds: ["", "Not yet through flexor digitorum superficialis. Keep advancing towards its deep surface. "], fdp: ["warn", "Too deep: you have passed the plane and entered flexor digitorum profundus. Withdraw a little. "], fpl: ["warn", "Too deep and too radial. Withdraw to the plane. "], fcu: ["warn", "Too ulnar. "] },
    wrongNote: "Redirect towards the median nerve in the plane under flexor digitorum superficialis.",
    targetNote: "This is the target: in the plane between flexor digitorum superficialis and profundus, on the radial side of the nerve, outside it.",
    la: { "in": [332, 206, 60, 22] },
    variants: [
      { n: "Usual anatomy", t: "The median nerve lies alone in the plane between flexor digitorum superficialis and profundus, with the radial and ulnar arteries well to either side." },
      { n: "Artery with the nerve", t: "An artery can run with the median nerve: a small median artery, or occasionally a large persistent one. Check with colour Doppler before injecting and keep the tip on the side of the nerve away from it.", set: { ma: { hide: 0 } } }
    ],
    consensus: CONS,
    refs: { stim: 41, sens: 34, press: 42, cons: 5, where: 33 },
    avoidNote: "Find the radial artery under brachioradialis and the ulnar artery under flexor carpi ulnaris, and check for an artery running with the nerve, before the needle goes in.",
    inj: {
      skin: "A skin wheal only. The nerve lies about a centimetre deeper, under flexor digitorum superficialis.",
      refuse: REFUSE,
      tri: "The fluid spreads in a fascial plane but does not reach the nerve. Follow the plane under flexor digitorum superficialis to the nerve.", triZ: ["pl", "br"],
      z: {
        fds: ["The fluid streaks through flexor digitorum superficialis, above the plane, and the nerve is not outlined. Advance through the deep surface of the muscle.", 24, 12],
        fcr: ["The fluid swells inside flexor carpi radialis, far above the nerve. Advance through flexor digitorum superficialis to the plane beneath it.", 22, 12],
        fdp: ["The fluid swells inside flexor digitorum profundus, below the plane, and does not surround the nerve. Withdraw a little.", 24, 13],
        fpl: ["The fluid swells inside flexor pollicis longus, deep and radial to the nerve. Withdraw to the plane.", 22, 13],
        fcu: ["The fluid swells inside flexor carpi ulnaris, on the ulnar side. Withdraw and redirect.", 22, 12]
      },
      deep: "Too deep: the fluid lies on the interosseous membrane, away from the nerve. Withdraw to the plane.",
      far: [44, "The fluid is in the plane, but on the ulnar side of the nerve rather than against it. Bring the tip back to the radial side of the nerve."],
      good: { "in": "The fluid spreads along the plane between the two finger flexors, lifts flexor digitorum superficialis off the nerve and surrounds it." },
      tail: "With ultrasound, 2 mL of mepivacaine 1.5% was enough for the median nerve in half of patients, against 4 mL with nerve stimulation."
    },
    steps: [
      { to: 14, say: "The needle enters at the radial end of the probe, in plane, above the radial artery, and appears in the subcutaneous fat." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "fcr+30", say: "Through the edge of brachioradialis and into flexor carpi radialis. The radial artery and the superficial radial nerve lie below and behind the needle.", hold: 3200 },
      { to: "fds+30", say: "Into flexor digitorum superficialis. The stimulator goes on at 1.0 mA.", on: 1, ma: 1, hold: 2600 },
      { to: "pre+2", pre: "Out of the deep surface of the muscle, into the ", fas: "pre", hold: 3400 },
      { to: "L-26", say: "The tip nears the radial side of the nerve. The thumb opposes and the index finger flexes.", hold: 2800 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance a millimetre or two along the plane. The twitch returns at 0.5 mA: the tip is close.", hold: 2600 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
      { say: "Inject against low pressure. The fluid spreads along the plane and lifts the muscle off the nerve.", inject: 1, hold: 3800 },
      { say: "Check for an artery running with the nerve before you inject. Open Variations, above the image, to see one.", flash: 1, hold: 4600 },
      LAST
    ]
  };

  /* ---------------- Ulnar nerve in the mid-forearm (140 px = 1 cm) ---------------- */
  window.BP_SCENES.ulnarforearm = {
    title: "Ulnar nerve block in the mid-forearm: in plane from the ulnar side",
    entry: [636, 58], target: [420, 198], mm: 0.0714, ori: ["Radial", "Ulnar"],
    scanTitle: "Sonoanatomy of the ulnar side of the forearm", altLabel: "Nerve", alts: ALTS, recLab: REC, varLabel: "Variations",
    fascia: [
      { id: "inv", n: "Deep fascia of the forearm", d: "M0 88C200 82 440 82 640 88", t: "The first layer under the subcutaneous fat. Flexor carpi ulnaris lies beneath it on the ulnar side." },
      { id: "pre", n: "Deep fascia of flexor carpi ulnaris", d: "M0 230C100 226 200 214 260 200C300 190 340 178 380 174C460 170 560 172 640 180", t: "The bright line under flexor carpi ulnaris. The ulnar nerve and artery lie beneath it, on flexor digitorum profundus. Once through it the tip is beside the nerve." }
    ],
    shapes: [
      { id: "fds", t: "muscle", n: "Flexor digitorum superficialis", l: "FDS", k: "path", d: "M0 92C80 88 180 88 236 94C250 130 254 170 248 204C200 214 100 224 0 226Z", lx: 110, ly: 150, rec: "weak", x: "The broad finger flexor in the middle of the forearm. Median nerve; flexes the fingers at the middle joints. The median nerve lies against its deep surface, at the radial edge of this image." },
      { id: "fcu", t: "muscle", n: "Flexor carpi ulnaris", l: "FCU", k: "path", d: "M246 94C380 88 540 88 640 94V178C560 170 460 168 380 172C340 176 296 186 262 196C262 160 256 120 246 94Z", lx: 470, ly: 128, rec: "strong", x: "The superficial muscle on the ulnar side. Ulnar nerve; flexes the wrist towards the little finger. The nerve and artery lie beneath it, and the needle passes through it.", c: 5 },
      { id: "fdp", t: "muscle", n: "Flexor digitorum profundus", l: "FDP", k: "path", d: "M0 240C80 234 170 224 240 214C270 210 310 214 338 210C346 222 372 224 402 220C432 216 452 204 456 180C520 176 580 178 640 186V342C600 334 540 328 500 330C430 334 370 356 350 400H0Z", lx: 200, ly: 300, rec: "weak", x: "The deep finger flexor, on which the nerve rests. Ulnar nerve to its ulnar half, median nerve to its radial half. A tip inside it has gone past the nerve." },
      { id: "ulna", t: "bone", n: "Ulna", l: "ULNA", k: "path", d: "M350 400C370 356 430 334 500 330C560 328 610 336 640 344V400Z", cortex: "M352 396C372 354 430 334 500 330C560 328 610 336 640 344", lx: 520, ly: 372, x: "A bright curved line with a shadow beneath it, deep on the ulnar side.", hit: ["Bone contact: ulna", "Far too deep. Withdraw to the nerve under flexor carpi ulnaris."] },
      { id: "un", t: "nerve", n: "Ulnar nerve", l: "UN", k: "duo", a: [368, 190, 10.5], b: [392, 190, 10.5], sheath: [380, 190, 28, 14], cx: 380, cy: 190, r: 14, lx: 380, ly: 194, rec: "strong", target: 1, m: "Most of the small muscles of the hand (the interossei, adductor pollicis and the little finger muscles) and the skin of the little finger and the ulnar side of the hand", s: "Little finger flexes and fingers adduct: the ulnar nerve. The branches to flexor carpi ulnaris have left higher up", x: "A small honeycomb oval under flexor carpi ulnaris, on the ulnar side of the ulnar artery and a few millimetres from it at this level. Its mean cross-sectional area in the proximal forearm was 6.2 mm2.", c: 6 },
      { id: "ua", t: "artery", n: "Ulnar artery", l: "UA", k: "circle", cx: 300, cy: 188, r: 15, lx: 300, ly: 192, avoid: 1, rec: "strong", x: "Round and pulsatile, under flexor carpi ulnaris on the radial side of the nerve, with its two veins. Lower in the forearm it comes to lie against the nerve. Coming from the ulnar side, the tip reaches the nerve first.", c: 5 },
      { id: "uv", t: "vein", n: "Ulnar veins (venae comitantes)", l: "", k: "ellipse", cx: 270, cy: 204, rx: 7, ry: 4.5, lx: 270, ly: 216, avoid: 1, x: "Two small compressible veins beside the artery. They flatten under the probe." },
      { id: "uv2", t: "vein", n: "Ulnar veins (venae comitantes)", l: "", k: "ellipse", cx: 326, cy: 204, rx: 7, ry: 4.5, lx: 326, ly: 216, x: "Two small compressible veins beside the artery. They flatten under the probe." },
      { id: "mn", t: "nerve", n: "Median nerve", l: "MN", k: "duo", a: [22, 238, 11], b: [50, 238, 11], sheath: [36, 238, 34, 15], cx: 36, cy: 238, r: 15, lx: 44, ly: 268, wrong: 1, rec: "weak", m: "Most of the thumb muscles and the radial finger flexors", s: "Thumb opposes and index finger flexes: the median nerve, not the ulnar", wn: "Far too radial: this is the median nerve. Withdraw and redirect towards the ulnar nerve under flexor carpi ulnaris.", x: "At the radial edge of the image, in the plane between the two finger flexors. In about 19.5% of limbs median fibres cross to the ulnar nerve in the forearm (Martin-Gruber anastomosis), so an ulnar block can weaken muscles a median block was expected to reach.", c: 16 }
    ],
    groove: "M336 176C370 168 420 168 452 176C460 196 446 214 414 220C380 224 350 220 340 208C334 198 332 186 336 176Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the ulnar end of the probe, in plane."],
      subcut: ["Skin and subcutaneous fat", "The first layer."],
      tri: ["In a fascial plane, away from the nerve", "The tip lies under a fascial layer, but not beside the nerve. Follow the plane under flexor carpi ulnaris to the nerve."],
      groove: ["Beside the ulnar nerve, under flexor carpi ulnaris", "Through the deep fascia of the muscle, on flexor digitorum profundus, against the nerve. This is where the local anaesthetic should go."],
      deep: ["Deep to the flexors", "Too deep. Withdraw to the nerve under flexor carpi ulnaris."]
    },
    zoneNote: { fcu: ["", "Not yet through flexor carpi ulnaris. Keep advancing towards its deep fascia. "], fdp: ["warn", "Too deep: you have passed the nerve and entered flexor digitorum profundus. Withdraw a little. "], fds: ["warn", "Too radial: you have crossed the artery. Withdraw. "] },
    wrongNote: "Redirect towards the ulnar nerve under flexor carpi ulnaris.",
    targetNote: "This is the target: under flexor carpi ulnaris, on the ulnar side of the nerve, outside it, with the nerve between the tip and the artery.",
    la: { "in": [384, 194, 48, 22] },
    variants: [
      { n: "Usual anatomy", t: "The ulnar artery lies on the radial side of the nerve under flexor carpi ulnaris. Choose the level where they are apart." },
      { n: "Superficial ulnar artery", f: "1 of 22", t: "In one of 22 forearms scanned the ulnar artery ran superficially, above the fascia, and joined the nerve only at the wrist. Find it before the needle crosses the subcutaneous fat.", set: { ua: { cx: 300, cy: 70, r: 11, lx: 300, ly: 74, x: "Here the artery runs superficially, in the subcutaneous fat above the fascia, and joins the nerve only at the wrist. It lies across the start of a more radial needle path." }, uv: { hide: 1 }, uv2: { hide: 1 } } }
    ], varRef: 5,
    consensus: CONS,
    refs: { stim: 41, sens: 34, press: 42, cons: 5, where: 6 },
    avoidNote: "Find the ulnar artery and its veins with colour Doppler before the needle goes in. They lie on the radial side of the nerve, the far side from the needle.",
    inj: {
      skin: "A skin wheal only. The nerve lies under flexor carpi ulnaris, about a centimetre deeper.",
      refuse: REFUSE,
      tri: "The fluid spreads in a fascial plane but does not reach the nerve. Follow the plane under flexor carpi ulnaris to the nerve.", triZ: [],
      z: {
        fcu: ["The fluid streaks through flexor carpi ulnaris, above its deep fascia, and the nerve is not outlined. Advance through the fascia.", 26, 12],
        fdp: ["The fluid swells inside flexor digitorum profundus, deep to the nerve. Withdraw a little.", 24, 13],
        fds: ["The fluid swells inside flexor digitorum superficialis, on the far side of the artery. Withdraw and redirect towards the ulnar side.", 22, 12]
      },
      deep: "Too deep: the fluid lies on the ulna, away from the nerve. Withdraw.",
      medial: [350, "The fluid is on the radial side of the nerve, around the artery and its veins. Withdraw and redirect towards the ulnar side of the nerve."],
      good: { "in": "The fluid spreads under flexor carpi ulnaris, surrounds the nerve and separates it from the artery." },
      tail: "In volunteers the dose that blocked the ulnar nerve in 95% was 0.11 mL of mepivacaine 1% per mm2 of nerve cross-section, a mean of 0.7 mL."
    },
    steps: [
      { to: 14, say: "The needle enters at the ulnar end of the probe, in plane, and appears in the subcutaneous fat." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "fcu+40", say: "Through flexor carpi ulnaris. The stimulator goes on at 1.0 mA.", on: 1, ma: 1, hold: 2600 },
      { to: "pre+2", pre: "Out of the muscle, through the ", fas: "pre", hold: 3400 },
      { to: "L-30", say: "The tip nears the ulnar side of the nerve, with the nerve between it and the artery. The little finger flexes and the fingers draw together.", hold: 3000 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L", say: "Advance a millimetre or two. The twitch returns at 0.5 mA: the tip is close.", hold: 2600 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
      { say: "Inject against low pressure. The fluid surrounds the nerve and pushes it away from the artery.", inject: 1, hold: 3800 },
      { say: "In one forearm in 22 the artery ran above the fascia. Open Variations, above the image, to see it.", flash: 1, hold: 4600 },
      LAST
    ]
  };
})();

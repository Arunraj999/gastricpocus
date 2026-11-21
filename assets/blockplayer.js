/* NORA² block player. Drag the needle through the layers, compare ultrasound with anatomy, use the nerve stimulator, inject.
   One engine; each block supplies its own scene in DATA. Original schematic drawings, not to scale. */
(function () {
  "use strict";
  var MM = 0.0952; /* 105 px = 1 cm */
  var DATA = {
    interscalene: {
      title: "Interscalene block: posterior in-plane approach at C6",
      entry: [640, 60], target: [389, 160],
      fascia: [
        { id: "inv", n: "Investing layer of the deep cervical fascia", d: "M0 61C130 47 262 49 352 65C400 75 470 88 640 100", t: "The first fascial layer. It splits to enclose sternocleidomastoid and roofs the posterior triangle. A blunt needle gives a small click here." },
        { id: "pre", n: "Prevertebral layer of the deep cervical fascia", d: "M150 204C172 152 226 128 296 126C326 124 350 118 372 116C440 98 536 100 596 130C626 146 638 182 640 220", t: "Covers the scalene muscles, the roots between them and the phrenic nerve. The plexus lies deep to this layer; local anaesthetic left superficial to it does not reach the roots." }
      ],
      shapes: [
        { id: "ejv", t: "vein", n: "External jugular vein", l: "EJV", k: "ellipse", cx: 430, cy: 62, rx: 15, ry: 4.5, lx: 470, ly: 60, avoid: 1, x: "Runs in the subcutaneous tissue and commonly crosses the posterior border of sternocleidomastoid at this level. It flattens under the probe: lighten the pressure to find it, and enter away from it." },
        { id: "scm", t: "muscle", n: "Sternocleidomastoid", l: "SCM", k: "path", d: "M0 66C130 52 262 54 352 70C384 76 404 84 412 92C372 106 300 116 204 120C120 122 50 118 0 114Z", lx: 150, ly: 92, rec: "weak", x: "The superficial muscle. It covers the great vessels and tapers to a point over the groove. Accessory nerve (cranial nerve XI); turns the head to the opposite side." },
        { id: "ijv", t: "vein", n: "Internal jugular vein", l: "IJV", k: "ellipse", cx: 118, cy: 174, rx: 46, ry: 22, lx: 118, ly: 178, x: "Thin-walled and compressible under light probe pressure. The plexus lies lateral to it." },
        { id: "ca", t: "artery", n: "Common carotid artery", l: "CA", k: "circle", cx: 92, cy: 254, r: 31, lx: 92, ly: 258, x: "Round, pulsatile and non-compressible. The starting landmark: slide laterally from here to the scalene muscles." },
        { id: "asm", t: "muscle", n: "Anterior scalene", l: "ASM", k: "path", d: "M212 170C230 138 292 130 322 144C338 158 344 196 346 232C346 262 332 290 300 296C258 300 220 268 208 226C204 204 204 186 212 170Z", lx: 270, ly: 236, rec: "strong", x: "Medial wall of the groove. Supplied by the anterior rami of the cervical nerves; flexes the neck and raises the first rib. The phrenic nerve runs down its front surface." },
        { id: "msm", t: "muscle", n: "Middle scalene", l: "MSM", k: "path", d: "M370 126C420 108 524 110 584 140C624 162 638 212 628 258C616 302 556 324 498 320C452 318 412 306 396 286C396 262 388 236 384 220C382 196 376 170 372 152C368 142 366 132 370 126Z", lx: 530, ly: 236, rec: "strong", x: "Lateral wall of the groove and the muscle an in-plane needle crosses. The dorsal scapular and long thoracic nerves run through it.", c: 8 },
        { id: "c5", t: "nerve", n: "C5 root", l: "C5", k: "circle", cx: 352, cy: 150, r: 14, lx: 352, ly: 154, rec: "strong", target: 1, m: "Deltoid, supraspinatus, infraspinatus and biceps, through the superior trunk", s: "Shoulder abducts", mv: "sabd", sup: ["c5", "hr=C5", "Muscles whose main root is C5, in red: deltoid, supraspinatus, infraspinatus, biceps, brachialis and brachioradialis among them."], x: "The most superficial root, and smaller than C6 or C7. It is the top circle of the stoplight sign and the root to aim beside for shoulder surgery.", c: 26 },
        { id: "c6", t: "nerve", n: "C6 root", l: "C6", k: "duo", a: [360, 190, 15], b: [363, 219, 15], cx: 362, cy: 205, r: 15, lx: 361, ly: 209, rec: "strong", target: 1, m: "Biceps, brachioradialis and the wrist extensors, through the superior trunk", s: "Elbow flexes", mv: "elbowflex", sup: ["c6", "hr=C6", "Muscles whose main root is C6, in red: serratus anterior, the radial wrist extensors, pronator teres, subscapularis and teres major among them."], x: "Usually seen as two dark circles: the upper and lower fascicles of the one root. With C5 they make the three circles of the stoplight sign. The gap between them is inside the root, so never place the needle there.", c: 26 },
        { id: "c7", t: "nerve", n: "C7 root", l: "C7", k: "circle", cx: 372, cy: 290, r: 16, lx: 372, ly: 294, rec: "weak", m: "Triceps, through the middle trunk", s: "Elbow extends", mv: "elbowext", sup: ["c7", "hr=C7", "Muscles whose main root is C7, in red: triceps, latissimus dorsi, the finger extensors and flexor carpi radialis among them."], x: "Deeper, lying on its own transverse process. It is not one of the three circles of the stoplight sign.", c: 26 },
        { id: "phr", t: "nerve", n: "Phrenic nerve", l: "Phr", k: "circle", cx: 318, cy: 136, r: 4.5, lx: 290, ly: 152, wrong: 1, avoid: 1, m: "The diaphragm on that side", s: "Hiccup-like twitch of the diaphragm: the tip is too anterior, on the anterior scalene", wn: "Withdraw and redirect posteriorly, towards the groove.", x: "On the front of the anterior scalene, under the prevertebral fascia. At the level of the cricoid cartilage it lay a mean of 1.8 mm from C5 and measured 0.76 mm across; it moved about 3 mm further from the plexus for every centimetre down the neck.", c: 27 },
        { id: "dsn", t: "nerve", n: "Dorsal scapular nerve", l: "DSN", k: "circle", cx: 452, cy: 188, r: 5, lx: 478, ly: 184, wrong: 1, avoid: 1, bright: 1, m: "Levator scapulae and the rhomboids", s: "The scapula lifts and draws towards the spine: a nerve inside the middle scalene, not the plexus", sup: ["dsn", "hl=rhomboid%7Clevator%20scapulae&hv=-0.35,0.3,-0.9&hg=1", "Rhomboid major, rhomboid minor and levator scapulae, in red, seen from behind through trapezius."], x: "A branch of C5 that crosses the middle scalene as a small bright dot. A nerve was visible in or on the muscle in 90% of 50 patients, about 0.7 cm posterior to the plexus; on stimulation 77% were the dorsal scapular nerve.", c: 8 },
        { id: "ltn", t: "nerve", n: "Long thoracic nerve", l: "LTN", k: "circle", cx: 474, cy: 252, r: 5, lx: 500, ly: 256, wrong: 1, avoid: 1, bright: 1, m: "Serratus anterior", s: "The chest wall twitches and the scapula is drawn forwards: a nerve inside the middle scalene, not the plexus", sup: ["ltn", "hl=serratus%20anterior&hv=-0.95,0.12,0.3&hg=1", "Serratus anterior, in red, seen from the side. Injury leaves a winged scapula."], x: "Identified by stimulation in 23% of the nerves seen within the middle scalene.", c: 8 },
        { id: "va", t: "artery", n: "Vertebral artery", l: "VA", k: "circle", cx: 322, cy: 322, r: 12, lx: 322, ly: 326, avoid: 1, x: "Lies deep, in front of the C7 transverse process. Confirm it with colour Doppler before needling." },
        { id: "tp", t: "bone", n: "Transverse process of C7", l: "TP C7", k: "path", d: "M348 336Q380 312 420 320Q462 328 496 356V400H348Z", cortex: "M348 336Q380 312 420 320Q462 328 496 356", lx: 426, ly: 370, x: "A bright line with a dark acoustic shadow. C7 has no anterior tubercle, unlike C6 above it, and the C7 root lies on it." }
      ],
      groove: "M322 144C338 128 356 120 370 126C366 140 376 180 384 220C390 250 396 270 396 286C388 304 372 312 356 306C346 280 346 250 346 232C344 196 338 158 322 144Z",
      zones: {
        air: ["Above the skin", "The needle has not entered yet. Insert it at the lateral edge of the probe, in plane."],
        subcut: ["Skin and subcutaneous tissue", "Platysma is a thin sheet in this layer. Find the external jugular vein before you start."],
        tri: ["Posterior triangle, between the two fascial layers", "Fat and loose tissue under the investing layer. Branches of the superficial cervical plexus run at this depth; an injection here does not reach the roots."],
        groove: ["Interscalene groove, among the roots", "Deep to the prevertebral layer, between the scalene muscles. You have passed the inner edge of the middle scalene: the tip is now inside the sheath."],
        deep: ["Deep to the scalene muscles", "Too deep. The vertebral artery and the transverse process lie here."]
      },
      variants: [
        { n: "Usual arrangement", f: "60%", t: "C5, C6 and C7 run between the anterior and middle scalene. This textbook arrangement was found in only 60% of sides in 51 cadavers." },
        { n: "C5 and C6 through anterior scalene", f: "15%", t: "C5 and C6 join and pierce the belly of the anterior scalene together. The groove looks empty: look for the dark circles inside the anterior scalene, medial to where you expect them. In a further 6% the two roots pierce the muscle separately.", set: { c5: { cx: 298, cy: 170, lx: 298, ly: 174 }, c6: { a: [308, 206, 15], b: [311, 235, 15], cx: 310, cy: 221, lx: 309, ly: 225 } } },
        { n: "C5 alone through anterior scalene", f: "13%", t: "C5 alone runs through the belly of the anterior scalene. The top circle of the stoplight is missing from the groove: look inside the muscle, medial to C6.", set: { c5: { cx: 300, cy: 176, lx: 300, ly: 180 } } },
        { n: "C5 in front of anterior scalene", f: "3%", t: "C5 lies completely in front of the anterior scalene, where the phrenic nerve usually runs.", set: { c5: { cx: 216, cy: 152, r: 12, lx: 216, ly: 156 } } }
      ], varRef: 28,
      targetNote: "This is the target: at the inner edge of the middle scalene, beside C5.",
      la: { "in": [360, 186, 24, 52], ex: [388, 186, 16, 46] },
      consensus: "Core structures for the block view by international consensus: anterior scalene, middle scalene, C5 root and C6 root. Sternocleidomastoid, the C7 root and the upper trunk carry a weaker recommendation.",
      refs: { stim: 22, sens: 23, press: 24, cons: 25, where: 10 }, avoidNote: "Before the needle goes in, find and name these. The two small nerves cross the middle scalene in the needle path.",
      scanTitle: "Sonoanatomy at C6",
      zoneNote: { scm: ["", "Too medial and superficial for this approach. "], asm: ["warn", "You have crossed the groove and passed the roots. Withdraw. "] },
      wrongNote: "Note where this nerve lies and steer the needle away from it, then continue towards the groove.",
      inj: {
        skin: "A skin wheal only. The plexus lies two fascial layers deeper.",
        tri: "The fluid spreads between the investing and prevertebral layers. This reaches branches of the superficial cervical plexus, not the roots.", triZ: ["scm"],
        z: { msm: ["The fluid swells inside the middle scalene. Advance to the inner edge of the muscle, beside C5.", 22, 15], asm: ["The fluid swells inside the anterior scalene, next to the phrenic nerve. Withdraw to the groove.", 20, 15] }, ex: "msm",
        deep: "Too deep. Withdraw towards the groove.",
        good: { ex: "The fluid tracks down the outer side of C5 and C6, outside the sheath.", "in": "The fluid tracks around C5 and C6, inside the sheath." },
        tail: "With 20 mL, hemidiaphragmatic paresis followed in 21% when the injection was 4 mm lateral to the sheath and in 90% when it was between C5 and C6, with similar analgesia."
      },
      steps: [
        { to: 14, say: "The needle enters at the lateral edge of the probe, in plane, and appears in the subcutaneous tissue." },
        { to: "inv+3", fas: "inv", hold: 2600 },
        { to: "pre+2", pre: "Fat of the posterior triangle, then the ", fas: "pre", hold: 3000 },
        { to: "msm+26", say: "Into the middle scalene. The stimulator goes on at 1.0 mA: the dorsal scapular and long thoracic nerves run through this muscle.", on: 1, ma: 1, hold: 2600 },
        { to: "L-2", say: "The tip reaches the inner edge of the muscle, beside C5. The deltoid twitches and the shoulder abducts: C5 is answering.", hold: 2800 },
        { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
        { to: "L+7", say: "Advance a millimetre. The twitch returns at 0.5 mA: the tip is close.", hold: 2400 },
        { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
        { say: "Inject against low pressure and watch the spread.", inject: 1, hold: 3800 },
        { say: "Not every neck is built like this. In 4 of every 10 sides the roots were not all in the groove: open Variations, above the image, to see where else to look.", flash: 1, hold: 5200 },
        { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
      ]
    },
    superiortrunk: {
      title: "Superior trunk block: lateral-to-medial in-plane approach",
      entry: [640, 60], target: [448, 174],
      scanTitle: "Sonoanatomy at the superior trunk", varLabel: "Probe level",
      recLab: { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] },
      fascia: [
        { id: "inv", n: "Investing layer of the deep cervical fascia", d: "M0 61C130 47 262 49 352 65C400 75 470 88 640 100", t: "The first fascial layer. It roofs the posterior triangle; omohyoid lies beneath it." },
        { id: "pre", n: "Prevertebral layer of the deep cervical fascia", d: "M150 208C172 158 226 136 296 134C330 134 360 142 392 146C430 148 470 144 500 147C540 150 590 162 640 188", t: "Covers the scalene muscles, the trunk and the phrenic nerve. The trunk lies just beneath it, so the needle must pass through this layer before the injection can surround the trunk." }
      ],
      shapes: [
        { id: "ejv", t: "vein", n: "External jugular vein", l: "EJV", k: "ellipse", cx: 300, cy: 62, rx: 15, ry: 4.5, lx: 340, ly: 60, avoid: 1, x: "Runs in the subcutaneous tissue across the posterior triangle. It flattens under the probe: lighten the pressure to find it, and enter away from it." },
        { id: "scm", t: "muscle", n: "Sternocleidomastoid", l: "SCM", k: "path", d: "M0 66C110 54 220 54 300 66C330 72 350 80 358 90C330 104 270 114 190 118C110 120 45 118 0 114Z", lx: 140, ly: 92, rec: "weak", x: "The superficial muscle, medial to the block site. Accessory nerve (cranial nerve XI); turns the head to the opposite side." },
        { id: "omo", t: "muscle", n: "Omohyoid, inferior belly", l: "OH", k: "ellipse", cx: 462, cy: 112, rx: 58, ry: 10, lx: 462, ly: 116, rec: "weak", x: "A thin strap muscle that crosses the posterior triangle superficial to the plexus. The suprascapular nerve leaves the trunk and runs laterally beneath it.", c: 1 },
        { id: "ijv", t: "vein", n: "Internal jugular vein", l: "IJV", k: "ellipse", cx: 118, cy: 174, rx: 46, ry: 22, lx: 118, ly: 178, x: "Thin-walled and compressible under light probe pressure. The plexus lies lateral to it." },
        { id: "ca", t: "artery", n: "Common carotid artery", l: "CA", k: "circle", cx: 92, cy: 254, r: 31, lx: 92, ly: 258, x: "Round, pulsatile and non-compressible. Slide laterally from here to the scalene muscles." },
        { id: "asm", t: "muscle", n: "Anterior scalene", l: "ASM", k: "path", d: "M214 178C232 148 290 140 322 152C340 164 348 200 350 236C350 266 336 292 304 298C262 302 222 270 210 230C206 208 206 194 214 178Z", lx: 272, ly: 240, rec: "strong", x: "Medial to the trunk at this level. The phrenic nerve runs down its front surface, now well away from the plexus." },
        { id: "msm", t: "muscle", n: "Middle scalene", l: "MSM", k: "path", d: "M374 199C394 193 414 197 440 191C470 183 500 177 540 173C580 171 615 185 640 201V304C610 332 540 342 480 336C430 332 394 318 380 298C382 272 374 246 367 228C362 216 364 204 374 199Z", lx: 520, ly: 266, rec: "strong", x: "The trunk lies on its surface. The needle stays superficial to this muscle, away from the dorsal scapular and long thoracic nerves that run through it.", c: 1 },
        { id: "st", t: "nerve", n: "Superior trunk", l: "ST", k: "duo", a: [380, 172, 12.5], b: [404, 172, 12.5], sheath: [392, 172, 30, 17], cx: 392, cy: 172, r: 17, lx: 392, ly: 176, rec: "strong", target: 1, m: "Deltoid, teres minor, supraspinatus, infraspinatus, subscapularis, biceps, brachialis and brachioradialis, through the suprascapular, axillary, subscapular, musculocutaneous and radial nerves", s: "Shoulder abducts and the elbow flexes", mv: "sabd", sup: ["st", "hl=deltoid%7Cteres%20minor%7Csupraspinatus%7Cinfraspinatus%7Csubscapularis%7Cbiceps%20brachii%7Cbrachialis%7Cbrachioradialis&hv=-0.62,0.22,0.75&hg=1", "Muscles that receive C5 and C6 fibres through the superior trunk, in red: deltoid, the rotator cuff, biceps, brachialis and brachioradialis."], x: "C5 and C6 joined into one structure with a bright connective tissue border, lying just under the prevertebral fascia. The target is its lateral border, above the point where the suprascapular nerve leaves.", c: 1 },
        { id: "c5", hide: 1, t: "nerve", n: "C5 root", l: "C5", k: "circle", cx: 372, cy: 168, r: 12, lx: 372, ly: 172, target: 1, m: "Deltoid, supraspinatus, infraspinatus and biceps", s: "Shoulder abducts", mv: "sabd", x: "Still a separate dark circle. You are above the trunk: slide the probe down the neck until C5 and C6 merge." },
        { id: "c6", hide: 1, t: "nerve", n: "C6 root", l: "C6", k: "duo", a: [398, 170, 12], b: [414, 186, 11], cx: 406, cy: 178, r: 12, lx: 432, ly: 170, target: 1, m: "Biceps, brachioradialis and the wrist extensors", s: "Elbow flexes", mv: "elbowflex", x: "Usually seen as two dark circles, its upper and lower bundles. The gap between them is inside the root: never place the needle there.", c: 1 },
        { id: "ssn", hide: 1, t: "nerve", n: "Suprascapular nerve", l: "SSN", k: "circle", cx: 452, cy: 164, r: 6, lx: 476, ly: 160, m: "Supraspinatus and infraspinatus", s: "Shoulder abducts and turns outwards", sup: ["ssn", "hl=supraspinatus%7Cinfraspinatus&hv=-0.35,0.3,-0.9&hg=1", "Supraspinatus and infraspinatus, in red, seen from behind."], x: "A small dark circle that separates from the lateral side of the trunk and runs laterally under omohyoid. If you can see it apart from the trunk you are too low: slide back up until it rejoins.", c: 1 },
        { id: "mt", t: "nerve", n: "C7 root, becoming the middle trunk", l: "C7", k: "circle", cx: 357, cy: 252, r: 14, lx: 357, ly: 256, m: "Triceps", s: "Elbow extends", mv: "elbowext", sup: ["c7", "hr=C7", "Muscles whose main root is C7, in red: triceps, latissimus dorsi, the finger extensors and flexor carpi radialis among them."], x: "Deeper, still between the scalene muscles. It is not the target of this block." },
        { id: "phr", t: "nerve", n: "Phrenic nerve", l: "Phr", k: "circle", cx: 262, cy: 144, r: 4.5, lx: 240, ly: 166, wrong: 1, avoid: 1, m: "The diaphragm on that side", s: "Hiccup-like twitch of the diaphragm: the tip is far too medial, on the anterior scalene", wn: "Withdraw to the lateral side of the trunk.", x: "On the front of the anterior scalene, under the prevertebral fascia. At the cricoid cartilage it lay a mean of 1.8 mm from C5, and it moved about 3 mm further from the plexus for every centimetre down the neck. That widening gap is the reason for blocking at the trunk.", c: 4 },
        { id: "tca", t: "artery", n: "Transverse cervical artery", l: "TCA", k: "circle", cx: 398, cy: 126, r: 6, lx: 374, ly: 122, avoid: 1, rec: "strong", x: "May cross superficial to the plexus at this level. Lighten the probe pressure and use colour Doppler before the needle goes in.", c: 1 },
        { id: "dsn", t: "nerve", n: "Dorsal scapular nerve", l: "DSN", k: "circle", cx: 486, cy: 240, r: 5, lx: 512, ly: 238, wrong: 1, avoid: 1, bright: 1, m: "Levator scapulae and the rhomboids", s: "The scapula lifts and draws towards the spine: the tip is inside the middle scalene, too deep", sup: ["dsn", "hl=rhomboid%7Clevator%20scapulae&hv=-0.35,0.3,-0.9&hg=1", "Rhomboid major, rhomboid minor and levator scapulae, in red, seen from behind through trapezius."], x: "Runs through the middle scalene. At the interscalene level a nerve was visible in or on the muscle in 90% of 50 patients. This approach stays on the surface of the muscle and does not cross it.", c: 23 },
        { id: "ltn", t: "nerve", n: "Long thoracic nerve", l: "LTN", k: "circle", cx: 526, cy: 290, r: 5, lx: 552, ly: 292, wrong: 1, avoid: 1, bright: 1, m: "Serratus anterior", s: "The chest wall twitches and the scapula is drawn forwards: the tip is inside the middle scalene, too deep", sup: ["ltn", "hl=serratus%20anterior&hv=-0.95,0.12,0.3&hg=1", "Serratus anterior, in red, seen from the side. Injury leaves a winged scapula."], x: "Also runs through the middle scalene. It lies below the needle path of this approach.", c: 23 }
      ],
      groove: "M330 136H612V204H402V302H330Z",
      zones: {
        air: ["Above the skin", "The needle has not entered yet. Insert it at the lateral edge of the probe, in plane."],
        subcut: ["Skin and subcutaneous tissue", "Platysma is a thin sheet in this layer. Find the external jugular vein before you start."],
        tri: ["Posterior triangle, between the two fascial layers", "Fat and loose tissue under the investing layer, with omohyoid and the supraclavicular nerves. An injection here does not reach the trunk."],
        groove: ["Under the prevertebral fascia, on the middle scalene", "The plane between the fascia and the surface of the muscle, beside the trunk. This is the plane the local anaesthetic should open."],
        deep: ["Deep to the scalene muscles", "Too deep. Withdraw to the surface of the middle scalene."]
      },
      zoneNote: { scm: ["", "Too medial and superficial for this approach. "], omo: ["", "Too superficial: this muscle lies above the prevertebral fascia. "], asm: ["warn", "Too medial: you have passed the trunk and are heading for the phrenic nerve. Withdraw. "], msm: ["warn", "Too deep: the tip has entered the muscle beneath the trunk. Withdraw until it lies on the surface. "] },
      wrongNote: "Withdraw until the tip lies on the surface of the middle scalene, then continue towards the lateral border of the trunk.",
      variants: [
        { n: "Superior trunk: block here", t: "C5 and C6 have joined into one structure with a bright border, lying on the middle scalene just under the prevertebral fascia. The suprascapular nerve has not yet left. This is the level described for the block." },
        { n: "Too high: roots still separate", t: "C5 and the two bundles of C6 are still separate dark circles. This is the interscalene level, where the phrenic nerve lies closest to the plexus. Slide the probe down the neck until the circles merge.", set: { st: { hide: 1 }, c5: { hide: 0 }, c6: { hide: 0 }, phr: { cx: 318, cy: 141, lx: 300, ly: 164 } } },
        { n: "Too low: suprascapular nerve has left", t: "A small dark circle has separated from the lateral side of the trunk and runs laterally under omohyoid: the suprascapular nerve. A small volume placed at or below this level may miss it. Slide back up until it rejoins the trunk.", set: { ssn: { hide: 0 }, st: { a: [378, 174, 11.5], b: [400, 174, 11.5], sheath: [389, 174, 27, 16], cx: 389, cy: 174 } } }
      ], varRef: 1,
      targetNote: "This is the target: under the prevertebral fascia, on the surface of the middle scalene, beside the lateral border of the trunk.",
      la: { "in": [404, 171, 54, 26] },
      consensus: "No consensus list has been published for the superior trunk block; these are the structures named in the published technique. For the interscalene block view, an international consensus lists the upper trunk among the structures to identify.",
      refs: { stim: 24, sens: 25, press: 26, cons: 27, where: 3 }, avoidNote: "Before the needle goes in, find and name these. The transverse cervical artery may lie over the trunk. The two small nerves stay inside the middle scalene, below the needle path.",
      inj: {
        skin: "A skin wheal only. The trunk lies two fascial layers deeper.",
        refuse: "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi.",
        tri: "The fluid spreads between the investing and prevertebral layers, where the supraclavicular nerves run. The original description placed 5 mL at this depth on purpose, to numb the skin over the shoulder. It does not reach the trunk.", triZ: ["scm", "omo"],
        z: { msm: ["The fluid swells inside the middle scalene, deep to the trunk. Withdraw until the tip lies on the surface of the muscle.", 22, 15], asm: ["The fluid swells inside the anterior scalene, next to the phrenic nerve. Withdraw to the lateral side of the trunk.", 20, 15] },
        deep: "Too deep. Withdraw to the surface of the middle scalene.",
        medial: [364, "The fluid is on the medial side of the trunk, the side nearer the phrenic nerve. The published technique places the tip at the lateral border."],
        good: { "in": "The fluid lifts the prevertebral fascia off the middle scalene and tracks round the trunk." },
        tail: "With 15 mL of ropivacaine 0.5%, complete hemidiaphragmatic paresis followed in 5.3% after superior trunk block against 72.5% after interscalene block, and partial paresis in 71.1% against 25%."
      },
      steps: [
        { to: 14, say: "The needle enters at the lateral edge of the probe, in plane, and appears in the subcutaneous tissue." },
        { to: "inv+3", fas: "inv", hold: 2600 },
        { to: "pre+3", pre: "Fat of the posterior triangle, beneath omohyoid, then the ", fas: "pre", hold: 3200 },
        { to: "pre+14", say: "Under the fascia, on the surface of the middle scalene. The needle has not crossed the muscle, so the dorsal scapular and long thoracic nerves are not in its path. The stimulator goes on at 1.0 mA.", on: 1, ma: 1, hold: 3200 },
        { to: "L-2", say: "The tip nears the lateral border of the trunk. Deltoid and biceps twitch: the shoulder abducts and the elbow flexes.", hold: 2800 },
        { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
        { to: "L+7", say: "Advance a millimetre. The twitch returns at 0.5 mA: the tip is close.", hold: 2400 },
        { say: "Down to 0.2 mA. No twitch: the tip is not inside the trunk.", ma: 0.2, hold: 2800 },
        { say: "Inject against low pressure. The fluid lifts the fascia and surrounds the trunk.", inject: 1, hold: 3800 },
        { say: "Finding the right level is the skill in this block. Open Probe level, above the image, to see the view when the probe is too high or too low.", flash: 1, hold: 5200 },
        { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
      ]
    },
    suprascapular: {
      title: "Suprascapular nerve block: posterior approach in the supraspinous fossa",
      entry: [640, 60], target: [359, 335], mm: 0.125, ori: ["Lateral", "Medial"],
      scanTitle: "Sonoanatomy in the supraspinous fossa", altLabel: "Approach", alts: [["suprascapular", "Posterior: supraspinous fossa"], ["suprascapularant", "Anterior: under omohyoid"]],
      recLab: { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] },
      fascia: [
        { id: "inv", n: "Fascia over trapezius", d: "M0 70C200 64 440 64 640 72", t: "The first layer under the subcutaneous tissue. Trapezius lies directly beneath it." },
        { id: "pre", n: "Fascia of supraspinatus", d: "M0 298C150 316 280 324 380 322C470 318 560 306 640 294", t: "The deep fascia of supraspinatus, just above the bone. The nerve and artery run beneath it. On early scans this bright line was taken for the transverse scapular ligament." }
      ],
      shapes: [
        { id: "tra", t: "muscle", n: "Trapezius", l: "TRAP", k: "path", d: "M0 70C200 64 440 64 640 72V120C440 112 200 114 0 124Z", lx: 150, ly: 102, rec: "strong", x: "The thin superficial muscle. Accessory nerve (cranial nerve XI); it lifts and steadies the scapula." },
        { id: "ssp", t: "muscle", n: "Supraspinatus", l: "SSP", k: "path", d: "M0 130C200 120 440 118 640 126V294C560 306 470 318 380 322C280 324 150 316 0 298Z", lx: 170, ly: 222, rec: "strong", x: "Fills the supraspinous fossa. Supplied by the suprascapular nerve; it starts abduction of the shoulder. The needle passes through it to reach the floor of the fossa." },
        { id: "floor", t: "bone", n: "Floor of the supraspinous fossa", l: "SCAPULA", k: "path", d: "M0 318C150 338 290 348 380 346C470 342 560 328 640 314V400H0Z", cortex: "M0 318C150 338 290 348 380 346C470 342 560 328 640 314", lx: 470, ly: 376, rec: "strong", x: "A bright concave line with a dark shadow beneath: the scapula, between the suprascapular notch and the spinoglenoid notch. This line, and not the notch itself, is what the scan shows.", c: 3 },
        { id: "ssn", t: "nerve", n: "Suprascapular nerve", l: "SSN", k: "circle", cx: 330, cy: 334, r: 9, lx: 330, ly: 310, rec: "strong", target: 1, bright: 1, m: "Supraspinatus and infraspinatus", s: "Shoulder abducts and turns outwards", sup: ["ssn", "hl=supraspinatus%7Cinfraspinatus&hv=-0.35,0.3,-0.9&hg=1", "Supraspinatus and infraspinatus, in red, seen from behind."], x: "A small bright oval on the floor of the fossa, beneath the fascia of supraspinatus and beside its artery. It is often hard to make out at this depth: in volunteers it was identified with certainty in 36% of scans here.", c: 2 },
        { id: "ssa", t: "artery", n: "Suprascapular artery", l: "SSA", k: "circle", cx: 304, cy: 335, r: 7, lx: 284, ly: 312, avoid: 1, rec: "strong", x: "Runs beneath the fascia beside the nerve. Colour Doppler finds it more easily than the nerve and marks the place to inject.", c: 3 }
      ],
      groove: "M0 296H640V352H0Z",
      zones: {
        air: ["Above the skin", "The needle has not entered yet. Insert it at the medial end of the probe, in plane."],
        subcut: ["Skin and subcutaneous tissue", "The first layer. Trapezius lies beneath."],
        tri: ["Between the muscle layers", "The thin plane between trapezius and supraspinatus. An injection here does not reach the nerve."],
        groove: ["Beneath the fascia of supraspinatus, on the floor of the fossa", "The space between the fascia and the bone, where the nerve and artery run. This is where the local anaesthetic should go."],
        deep: ["Bone", "The needle cannot pass the scapula."]
      },
      zoneNote: { floor: ["warn", "Bone: the tip is on the floor of the fossa. Withdraw a millimetre and inject beneath the fascia. "] },
      wrongNote: "Redirect towards the floor of the fossa.",
      targetNote: "This is the target: through the fascia of supraspinatus, on the floor of the fossa, beside the nerve and away from the artery.",
      la: { "in": [338, 335, 84, 12] },
      consensus: "No consensus list has been published for this block. These are the structures named in the published ultrasound technique.",
      refs: { stim: 24, sens: 25, press: 26, cons: 3, where: 12 }, avoidNote: "Find the artery with colour Doppler before the needle goes in. The pleura is not in this picture, but it lies in front of the scapula: a needle that slips forwards off the bone at the notch is heading for the chest.",
      inj: {
        skin: "A skin wheal only. The nerve lies beneath two muscles, on the bone.",
        tri: "The fluid spreads between trapezius and supraspinatus. It does not reach the nerve.", triZ: [],
        z: { tra: ["The fluid swells inside trapezius. The nerve lies beneath the next muscle, on the bone.", 26, 9], ssp: ["The fluid swells inside supraspinatus, above its deep fascia. Advance until the tip is through the fascia and resting on the floor of the fossa.", 24, 13], floor: ["The tip is against bone and the injection is tight. Withdraw a millimetre.", 9, 5] },
        deep: "The needle cannot pass the bone.",
        good: { "in": "The fluid spreads along the floor of the fossa beneath the fascia, lifts the muscle off the bone and surrounds the nerve." },
        tail: "In cadavers, 10 mL placed by this approach stained the nerve in 11 of 14 shoulders and did not reach the phrenic nerve in any.",
        refuse: "In a study at the interscalene roots, opening injection pressure reached 15 psi or more in 35 of 36 injections with the needle touching a root; 1 mm away it stayed below 15 psi."
      },
      steps: [
        { to: 14, say: "The needle enters at the medial end of the probe, in plane, and appears in the subcutaneous tissue." },
        { to: "tra+16", say: "Through trapezius, the thin superficial muscle.", hold: 2400 },
        { to: "ssp+70", say: "Into supraspinatus. The nerve is at the bottom of this muscle, about 3.5 cm from the skin, so the needle path is steep and the tip is harder to follow.", hold: 3200 },
        { to: "pre+3", pre: "Through the ", fas: "pre", hold: 3400 },
        { to: "L-2", say: "The tip rests on the floor of the fossa beneath the fascia. With the stimulator at 1.0 mA the shoulder abducts and turns outwards.", on: 1, ma: 1, hold: 3000 },
        { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
        { to: "L+7", say: "Advance a millimetre along the bone. The twitch returns at 0.5 mA: the tip is close.", hold: 2400 },
        { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
        { say: "Inject against low pressure. The fluid spreads along the bone under the fascia.", inject: 1, hold: 3800 },
        { say: "There is a second way to this nerve. Open Approach, above the image, to see it under omohyoid in the neck, where it is shallow and easier to see.", hold: 5200 },
        { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
      ]
    }
  };
  /* anterior (subomohyoid) approach to the suprascapular nerve: the superior trunk scene at the level where the nerve has left the trunk */
  DATA.suprascapularant = (function () {
    var s = JSON.parse(JSON.stringify(DATA.superiortrunk)), by = {}; s.shapes.forEach(function (q) { by[q.id] = q; });
    s.title = "Suprascapular nerve block: anterior approach under omohyoid"; s.scanTitle = "Sonoanatomy under omohyoid"; s.target = [484, 166];
    s.altLabel = "Approach"; s.alts = [["suprascapular", "Posterior: supraspinous fossa"], ["suprascapularant", "Anterior: under omohyoid"]]; delete s.variants; delete s.varLabel; delete s.varRef;
    s.shapes = s.shapes.filter(function (q) { return q.id !== "c5" && q.id !== "c6"; });
    by.ssn.hide = 0; by.ssn.target = 1; by.ssn.rec = "strong"; by.ssn.c = 1; by.ssn.x = "A small dark circle under omohyoid, lateral to the brachial plexus. In volunteers it lay at a median depth of 8 mm and was identified in 81% of scans, against 36% in the supraspinous fossa.";
    by.st.target = 0; by.st.wrong = 1; by.st.rec = "weak"; by.st.a = [378, 174, 11.5]; by.st.b = [400, 174, 11.5]; by.st.sheath = [389, 174, 27, 16]; by.st.cx = 389; by.st.cy = 174; by.st.c = 16;
    by.st.wn = "Too medial: this is the brachial plexus. Withdraw to the lateral side of the suprascapular nerve."; by.st.x = "The suprascapular nerve has just left its lateral side. Local anaesthetic placed here can track back to the trunk: in cadavers 5 mL stained it in 9 of 10 injections.";
    by.omo.rec = "strong"; by.omo.c = 1; by.omo.x = "The landmark for this approach. The suprascapular nerve runs laterally beneath this thin strap muscle."; by.tca.c = 0; by.msm.c = 0; by.msm.x = "The nerve runs over its surface. The needle stays superficial to this muscle."; by.mt.x = "Deeper, between the scalene muscles. It is not the target."; by.dsn.c = 0; by.dsn.x = "Runs through the middle scalene, below the needle path of this approach."; by.ltn.c = 0;
    by.phr.c = 15; by.phr.x = "On the front of the anterior scalene, under the same fascia. With this approach and an axillary nerve block, 10 mL on each nerve, the diaphragm was paralysed in 40% of patients."; by.phr.wn = "Withdraw to the lateral side of the suprascapular nerve.";
    s.zones.groove = ["Under omohyoid, beside the suprascapular nerve", "Between the fascia and the surface of the middle scalene, lateral to the brachial plexus. This is where the local anaesthetic should go."];
    s.zoneNote.asm = ["warn", "Far too medial: you have passed the brachial plexus. Withdraw. "]; s.zoneNote.msm = ["warn", "Too deep: the tip has entered the muscle beneath the nerve. Withdraw until it lies on the surface. "];
    s.zones.tri = ["Posterior triangle, between the two fascial layers", "Fat and loose tissue under the investing layer, with omohyoid and the supraclavicular nerves. An injection here does not reach the nerve."];
    s.inj.z.asm = ["The fluid swells inside the anterior scalene, next to the phrenic nerve. Withdraw to the lateral side of the suprascapular nerve.", 20, 15];
    s.wrongNote = "Withdraw to the lateral side of the suprascapular nerve.";
    s.targetNote = "This is the target: under omohyoid and the fascia, beside the lateral border of the suprascapular nerve.";
    s.la = { "in": [470, 166, 34, 17] };
    s.consensus = "No consensus list has been published for this block. These are the structures named in the published descriptions of the anterior approach.";
    s.refs = { stim: 24, sens: 25, press: 26, cons: 1, where: 16 };
    s.avoidNote = "Before the needle goes in, find and name these. The brachial plexus lies just medial to the nerve, and the phrenic nerve beyond it.";
    s.inj.skin = "A skin wheal only. The nerve lies under omohyoid, two fascial layers deeper.";
    s.inj.tri = "The fluid spreads above the fascia, around omohyoid. It does not reach the nerve.";
    s.inj.z.msm = ["The fluid swells inside the middle scalene, deep to the nerve. Withdraw until the tip lies on the surface of the muscle.", 22, 15];
    s.inj.medial = [440, "The fluid is between the nerve and the brachial plexus. From here it reaches the trunk, and the phrenic nerve beyond it, more easily."];
    s.inj.good = { "in": "The fluid spreads under omohyoid and surrounds the nerve." };
    s.inj.tail = "In cadavers, 5 mL placed here stained the suprascapular nerve in 9 of 10 injections, the superior trunk in 9 of 10 and the phrenic nerve in 2 of 10.";
    s.steps = [
      { to: 14, say: "The needle enters at the lateral edge of the probe, in plane, and appears in the subcutaneous tissue." },
      { to: "inv+3", fas: "inv", hold: 2600 },
      { to: "pre+3", pre: "Beneath omohyoid, then the ", fas: "pre", hold: 3200 },
      { to: "L-2", say: "The tip nears the lateral side of the nerve, under omohyoid. With the stimulator at 1.0 mA the shoulder abducts and turns outwards.", on: 1, ma: 1, hold: 3000 },
      { say: "Turn the current down. At 0.5 mA the twitch fades.", ma: 0.5, hold: 2400 },
      { to: "L+7", say: "Advance a millimetre. The twitch returns at 0.5 mA: the tip is close.", hold: 2400 },
      { say: "Down to 0.2 mA. No twitch: the tip is not inside the nerve.", ma: 0.2, hold: 2800 },
      { say: "Inject a small volume against low pressure. The fluid surrounds the nerve under omohyoid.", inject: 1, hold: 3800 },
      { say: "The brachial plexus is a few millimetres away, and the phrenic nerve beyond it. That is the price of the easier view. Open Approach, above the image, to compare the posterior route.", hold: 5600 },
      { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 }
    ];
    return s;
  })();
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  function shapeSvg(s, st) {
    st = st ? ' style="' + st + '"' : "";
    if (s.sheath) return '<ellipse class="shape" cx="' + s.sheath[0] + '" cy="' + s.sheath[1] + '" rx="' + s.sheath[2] + '" ry="' + s.sheath[3] + '"/>';
    if (s.k === "circle") return '<circle class="shape"' + st + ' cx="' + s.cx + '" cy="' + s.cy + '" r="' + s.r + '"/>' + (s.r < 10 ? '<circle class="hit" cx="' + s.cx + '" cy="' + s.cy + '" r="15"/>' : "");
    if (s.k === "duo") return '<circle class="shape"' + st + ' cx="' + s.a[0] + '" cy="' + s.a[1] + '" r="' + s.a[2] + '"/><circle class="shape"' + st + ' cx="' + s.b[0] + '" cy="' + s.b[1] + '" r="' + s.b[2] + '"/>';
    if (s.k === "ellipse") return '<ellipse class="shape"' + st + ' cx="' + s.cx + '" cy="' + s.cy + '" rx="' + s.rx + '" ry="' + s.ry + '"/>';
    return '<path class="shape"' + st + ' d="' + s.d + '"/>' + (s.cortex ? '<path class="cortex" d="' + s.cortex + '"/>' : "");
  }
  function pathOf(s) { if (s.k === "path") return new Path2D(s.d); var p = new Path2D(); if (s.sheath) { p.ellipse(s.sheath[0], s.sheath[1], s.sheath[2], s.sheath[3], 0, 0, 6.2832); return p; } if (s.k === "circle") p.arc(s.cx, s.cy, s.r, 0, 6.2832); else if (s.k === "duo") { p.arc(s.a[0], s.a[1], s.a[2], 0, 6.2832); p.moveTo(s.b[0] + s.b[2], s.b[1]); p.arc(s.b[0], s.b[1], s.b[2], 0, 6.2832); } else p.ellipse(s.cx, s.cy, s.rx, s.ry, 0, 0, 6.2832); return p; }
  function paintAN(B, bb) {
    var W = 640, H = 400, K = 2, c = document.createElement("canvas"); c.width = W * K; c.height = H * K; var g = c.getContext("2d"); g.scale(K, K);
    var seed = 5, R = function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }, of = function (t) { return B.shapes.filter(function (s) { return s.t === t; }); }, i, x, y, r, n;
    var blob = function (x, y, r, fill, line) { g.beginPath(); g.ellipse(x, y, r, r * (0.62 + R() * 0.38), R() * 3.1, 0, 6.2832); g.fillStyle = fill; g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = 0.6; g.stroke(); } };
    g.fillStyle = "#DDB564"; g.fillRect(0, 0, W, H);                                   /* fat and loose tissue: lobules */
    for (i = 0; i < 1500; i++) blob(R() * W, 46 + R() * (H - 46), 3.5 + R() * 8, "hsl(" + (38 + R() * 9).toFixed(0) + "," + (60 + R() * 20).toFixed(0) + "%," + (60 + R() * 16).toFixed(0) + "%)", "rgba(140,96,36,.28)");
    g.fillStyle = "#C08A68"; g.fillRect(0, 46, W, 8); g.fillStyle = "#EBC0A2"; g.fillRect(0, 46, W, 3);  /* skin */
    of("muscle").forEach(function (s) { var p = pathOf(s), b = bb(s); g.save(); g.clip(p); g.fillStyle = "#6E1814"; g.fillRect(b.x, b.y, b.width, b.height); n = b.width * b.height / 24;
      for (i = 0; i < n; i++) blob(b.x + R() * b.width, b.y + R() * b.height, 2.4 + R() * 3.4, "hsl(" + (2 + R() * 8).toFixed(0) + "," + (56 + R() * 18).toFixed(0) + "%," + (31 + R() * 15).toFixed(0) + "%)");   /* fascicles */
      for (i = 0; i < n / 16; i++) { x = b.x + R() * b.width; y = b.y + R() * b.height; g.strokeStyle = "rgba(250,222,205,.3)"; g.lineWidth = 0.7 + R(); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + (R() - 0.5) * 44, y + (R() - 0.5) * 44, x + (R() - 0.5) * 76, y + (R() - 0.5) * 76); g.stroke(); }  /* perimysium */
      [[34, 0.16], [22, 0.2], [11, 0.26]].forEach(function (q) { g.strokeStyle = "rgba(38,4,4," + q[1] + ")"; g.lineWidth = q[0]; g.stroke(p); });   /* rounded belly */
      var lg = g.createLinearGradient(b.x, b.y, b.x + b.width * 0.55, b.y + b.height); lg.addColorStop(0, "rgba(255,205,185,.3)"); lg.addColorStop(0.55, "rgba(255,255,255,0)"); g.fillStyle = lg; g.fillRect(b.x, b.y, b.width, b.height);
      g.restore(); g.strokeStyle = "rgba(60,20,10,.45)"; g.lineWidth = 4; g.stroke(p); g.strokeStyle = "rgba(252,240,226,.95)"; g.lineWidth = 2; g.stroke(p); });
    B.fascia.forEach(function (f) { var p = new Path2D(f.d); g.strokeStyle = "rgba(80,45,15,.35)"; g.lineWidth = 6.5; g.stroke(p); g.strokeStyle = "#F7F0DF"; g.lineWidth = 3.4; g.stroke(p); g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 1; g.stroke(p); });
    of("artery").concat(of("vein")).forEach(function (s) { var a = s.t === "artery", rx = s.rx || s.r, ry = s.ry || s.r, w = a ? Math.max(3, rx * 0.26) : 1.8, lg;
      g.beginPath(); g.ellipse(s.cx, s.cy, rx, ry, 0, 0, 6.2832); g.fillStyle = a ? "#D2705F" : "#5A6CC0"; g.fill(); g.strokeStyle = a ? "#6E1410" : "#1B2760"; g.lineWidth = 1.4; g.stroke();
      lg = g.createRadialGradient(s.cx - rx * 0.25, s.cy - ry * 0.3, 1, s.cx, s.cy, Math.max(rx, ry)); lg.addColorStop(0, a ? "#B31616" : "#33409A"); lg.addColorStop(1, a ? "#4E0505" : "#10153E");
      g.beginPath(); g.ellipse(s.cx, s.cy, Math.max(1, rx - w), Math.max(1, ry - w), 0, 0, 6.2832); g.fillStyle = lg; g.fill();
      g.beginPath(); g.ellipse(s.cx - rx * 0.28, s.cy - ry * 0.34, Math.max(1, rx * 0.26), Math.max(0.6, ry * 0.14), -0.5, 0, 6.2832); g.fillStyle = "rgba(255,255,255,.3)"; g.fill(); });
    of("nerve").forEach(function (s) { if (s.sheath) { var q0 = s.sheath; g.beginPath(); g.ellipse(q0[0], q0[1], q0[2], q0[3], 0, 0, 6.2832); g.fillStyle = "#F6ECC4"; g.fill(); g.strokeStyle = "rgba(90,70,20,.5)"; g.lineWidth = 4.5; g.stroke(); g.strokeStyle = "#FBF4DC"; g.lineWidth = 2.2; g.stroke(); }
      (s.k === "duo" ? [s.a, s.b] : [[s.cx, s.cy, s.r]]).forEach(function (q) { var cx = q[0], cy = q[1], rr = q[2], m = rr < 8 ? 1 : Math.round(rr * rr / 11), j;
      g.beginPath(); g.arc(cx, cy, rr, 0, 6.2832); g.fillStyle = "#F4E7B2"; g.fill(); g.strokeStyle = "#A8872B"; g.lineWidth = 1.5; g.stroke();
      for (j = 0; j < m; j++) { var a2 = R() * 6.2832, d = m === 1 ? 0 : Math.sqrt(R()) * rr * 0.66, fr = m === 1 ? rr * 0.55 : rr * (0.18 + R() * 0.12); g.beginPath(); g.arc(cx + Math.cos(a2) * d, cy + Math.sin(a2) * d, fr, 0, 6.2832); g.fillStyle = "#E3C24F"; g.fill(); g.strokeStyle = "rgba(150,115,25,.7)"; g.lineWidth = 0.7; g.stroke(); }
      g.beginPath(); g.arc(cx - rr * 0.3, cy - rr * 0.35, rr * 0.3, 0, 6.2832); g.fillStyle = "rgba(255,255,255,.28)"; g.fill(); }); });
    of("bone").forEach(function (s) { var p = pathOf(s), b = bb(s); g.save(); g.clip(p); g.fillStyle = "#E9DDBB"; g.fillRect(b.x, b.y, b.width, b.height); for (i = 0; i < b.width * b.height / 40; i++) blob(b.x + R() * b.width, b.y + R() * b.height, 1.2 + R() * 2.2, "rgba(170,140,90,.5)"); g.restore(); if (s.cortex) { p = new Path2D(s.cortex); g.strokeStyle = "rgba(90,70,30,.45)"; g.lineWidth = 9; g.stroke(p); g.strokeStyle = "#FFFBEC"; g.lineWidth = 6; g.stroke(p); } });
    g.setTransform(1, 0, 0, 1, 0, 0); var vg = g.createRadialGradient(W * K / 2, H * K * 0.55, H * K * 0.3, W * K / 2, H * K * 0.55, W * K * 0.75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(40,20,5,.3)"); g.fillStyle = vg; g.fillRect(0, 0, W * K, H * K);
    return c.toDataURL("image/jpeg", 0.88);
  }
  function paintUS(B, bb) {
    var W = 640, H = 400, K = 2, c = document.createElement("canvas"); c.width = W * K; c.height = H * K; var g = c.getContext("2d"); g.scale(K, K);
    var seed = 11, R = function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    var P = function (s) { if (s.k === "path") return new Path2D(s.d); var p = new Path2D(); if (s.fas) { s.fas.forEach(function (q) { p.moveTo(q[0] + q[2], q[1]); p.arc(q[0], q[1], q[2], 0, 6.2832); }); return p; } if (s.k === "circle") p.arc(s.cx, s.cy, s.r, 0, 6.2832); else if (s.k === "duo") { p.arc(s.a[0], s.a[1], s.a[2], 0, 6.2832); p.moveTo(s.b[0] + s.b[2], s.b[1]); p.arc(s.b[0], s.b[1], s.b[2], 0, 6.2832); } else p.ellipse(s.cx, s.cy, s.rx, s.ry, 0, 0, 6.2832); return p; };
    var of = function (t) { return B.shapes.filter(function (s) { return s.t === t; }); }, i, x, y, l;
    var bg = g.createLinearGradient(0, 46, 0, H); bg.addColorStop(0, "#8d9096"); bg.addColorStop(1, "#4a4c51"); g.fillStyle = bg; g.fillRect(0, 0, W, H); g.lineCap = "round";
    for (i = 0; i < 520; i++) { x = R() * W; y = 46 + R() * (H - 46); l = 5 + R() * 28; g.strokeStyle = "rgba(245,247,250," + (0.05 + R() * 0.2).toFixed(2) + ")"; g.lineWidth = 0.6 + R() * 1.3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y + (R() - 0.5) * 6, x + l, y + (R() - 0.5) * 5); g.stroke(); }
    of("muscle").forEach(function (s) { var p = P(s), b = bb(s), n = Math.round(b.width * b.height / 22); g.save(); g.clip(p); g.fillStyle = "#33353a"; g.fillRect(0, 0, W, H);
      for (i = 0; i < n; i++) { x = b.x + R() * b.width; y = b.y + R() * b.height; l = 1.5 + R() * 6; var a = (R() - 0.5) * 1.2; g.strokeStyle = "rgba(238,240,244," + (0.18 + R() * 0.5).toFixed(2) + ")"; g.lineWidth = 0.6 + R() * 1.1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
      g.restore(); g.strokeStyle = "rgba(246,247,250,.85)"; g.lineWidth = 1.7; g.stroke(p); });
    of("artery").concat(of("vein")).forEach(function (s) { var p = P(s), rx = s.rx || s.r, ry = s.ry || s.r, e = g.createLinearGradient(0, s.cy + ry, 0, s.cy + ry + 70); e.addColorStop(0, "rgba(255,255,255,.2)"); e.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = e; g.fillRect(s.cx - rx * 0.85, s.cy + ry, rx * 1.7, 70);
      g.fillStyle = "#030405"; g.fill(p); g.strokeStyle = s.t === "artery" ? "rgba(252,252,254,.95)" : "rgba(214,218,226,.75)"; g.lineWidth = s.t === "artery" ? 2.8 : 1.3; g.stroke(p); });
    B.fascia.forEach(function (f) { var p = new Path2D(f.d); g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = 5; g.stroke(p); g.strokeStyle = "rgba(252,252,254,.92)"; g.lineWidth = 1.9; g.stroke(p); });
    of("nerve").forEach(function (s) { var p = P(s); if (s.sheath) { var q0 = s.sheath; g.beginPath(); g.ellipse(q0[0], q0[1], q0[2], q0[3], 0, 0, 6.2832); g.fillStyle = "rgba(196,199,206,.96)"; g.fill(); g.strokeStyle = "rgba(252,252,254,.98)"; g.lineWidth = 2.6; g.stroke(); g.fillStyle = "#1b1c20"; g.fill(p); g.strokeStyle = "rgba(248,249,252,.7)"; g.lineWidth = 1; g.stroke(p); return; }
      if (s.bright) { g.fillStyle = "rgba(250,250,252,.95)"; g.fill(p); g.fillStyle = "#1a1b1e"; g.beginPath(); g.arc(s.cx, s.cy, s.r * 0.45, 0, 6.2832); g.fill(); return; }
      g.fillStyle = "#1b1c20"; g.fill(p); g.strokeStyle = "rgba(248,249,252,.95)"; g.lineWidth = s.r < 8 ? 1.5 : 2.1; g.stroke(p); });
    of("bone").forEach(function (s) { g.fillStyle = "#000"; g.fill(P(s)); if (s.cortex) { var p = new Path2D(s.cortex); g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 12; g.stroke(p); g.strokeStyle = "#fff"; g.lineWidth = 6; g.stroke(p); } });
    var n2 = document.createElement("canvas"); n2.width = W; n2.height = H; var nd = n2.getContext("2d"), im = nd.createImageData(W, H);
    for (i = 0; i < im.data.length; i += 4) { var v = 105 + Math.floor(R() * 150); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } nd.putImageData(im, 0, 0);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "multiply"; g.drawImage(n2, 0, 0, W * K, H * K); g.globalCompositeOperation = "source-over";
    var at = g.createLinearGradient(0, 46 * K, 0, H * K); at.addColorStop(0, "rgba(0,0,0,0)"); at.addColorStop(1, "rgba(0,0,0,.34)"); g.fillStyle = at; g.fillRect(0, 0, W * K, H * K);
    return c.toDataURL("image/jpeg", 0.86);
  }
  function mount(el) {
    var B0 = DATA[el.getAttribute("data-block")]; if (!B0) return; var MM = B0.mm || 0.0952, PC = 10 / MM; var B = JSON.parse(JSON.stringify(B0)), VI = +(el.getAttribute("data-var") || 0), VV = B.variants && B.variants[VI];
    if (VV && VV.set) B.shapes.forEach(function (s) { var o = VV.set[s.id], k; if (o) for (k in o) s[k] = o[k]; });
    B.shapes = B.shapes.filter(function (s) { return !s.hide; });
    B.shapes.forEach(function (s) { if (s.sheath) s.fas = s.k === "duo" ? [s.a, s.b] : [[s.cx, s.cy, s.r]]; });
    var I = B.inj, RL = B.recLab || { strong: ["Core structure", "core"], weak: ["Also recommended", "also recommended"] }, ORI = B.ori || ["Anteromedial", "Posterolateral"];
    var u = "bp" + Math.random().toString(36).slice(2, 7), cite = function (n) { return n ? ' <a class="cite" href="#ref-' + n + '">' + n + "</a>" : ""; };
    var layer = function (an) {
      return '<g class="lay">' + B.shapes.map(function (s) { return '<g class="st t-' + s.t + (s.avoid ? " av" : "") + '" data-id="' + s.id + '" tabindex="0" role="button" aria-label="' + esc(s.n) + '">' + shapeSvg(s, an ? (s.t === "muscle" ? "fill:url(#" + u + "mp)" : s.t === "nerve" ? "fill:url(#" + u + "f)" : "") : "") + "</g>"; }).join("") +
        B.fascia.map(function (f) { return '<path class="fas" data-f="' + f.id + '" d="' + f.d + '"/><path class="fas-hit" data-f="' + f.id + '" d="' + f.d + '"/>'; }).join("") + "</g>";
    };
    var svg = '<svg viewBox="0 0 640 400" class="bp-svg" role="img" aria-label="Schematic cross-section at the block site. Drag to move the needle tip.">' +
      '<defs><filter id="' + u + 'n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85 0.5" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0.9 0.9 0 -0.95"/></filter>' +
      '<pattern id="' + u + 'mp" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#A8362D"/><circle cx="4" cy="4" r="3" fill="#8F251F"/><circle cx="0" cy="0" r="1.6" fill="#8F251F"/><circle cx="8" cy="8" r="1.6" fill="#8F251F"/></pattern>' +
      '<linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2E36"/><stop offset="1" stop-color="#101116"/></linearGradient>' +
      '<linearGradient id="' + u + 'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1D892"/><stop offset=".16" stop-color="#E9C77C"/><stop offset="1" stop-color="#C99C5E"/></linearGradient>' +
      '<pattern id="' + u + 'f" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#F1DC83"/><circle cx="2.5" cy="2.5" r="1.7" fill="#D9B94C"/><circle cx="7" cy="6.5" r="1.7" fill="#D9B94C"/></pattern>' +
      '<clipPath id="' + u + 'w"><rect class="bp-clip" x="640" y="0" width="640" height="400"/></clipPath><clipPath id="' + u + 'v"><rect class="bp-clipu" x="0" y="0" width="640" height="400"/></clipPath>' +
      '<linearGradient id="' + u + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6772"/><stop offset=".3" stop-color="#F2F5F8"/><stop offset=".62" stop-color="#A9B1BB"/><stop offset="1" stop-color="#3F454D"/></linearGradient>' +
      '<pattern id="' + u + 'e" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#77808b"/><path d="M0 1.5L2 0L4 1.5L2 3Z" fill="#EEF1F5"/></pattern></defs>' +
      '<g class="bp-us"><rect width="640" height="400" fill="#101116"/><image class="bp-usimg" x="0" y="0" width="640" height="400" preserveAspectRatio="none"/>' + layer(0) + "</g>" +
      '<g class="bp-an" clip-path="url(#' + u + 'w)"><rect width="640" height="400" fill="#DDB564"/><image class="bp-animg" x="0" y="0" width="640" height="400" preserveAspectRatio="none"/>' + layer(0) + "</g>" +
      '<rect y="0" width="640" height="46" class="bp-head"/><path d="M0 46H640" class="bp-skin"/>' +
      '<path class="bp-div" d="M640 0V400"/>' +
      '<g class="bp-la"><ellipse class="la" cx="0" cy="0" rx="0" ry="0"/></g>' +
      '<g class="bp-lbl">' + B.shapes.map(function (s) { return '<text x="' + s.lx + '" y="' + s.ly + '" text-anchor="middle">' + s.l + "</text>"; }).join("") + "</g>" +
      '<g class="bp-ndl"><g class="ndl-us" clip-path="url(#' + u + 'v)"><g class="nx"><path class="rv r3" d="M70 15H830"/><path class="rv r2" d="M40 10H830"/><path class="rv r1" d="M22 5H830"/><path class="ln" d="M2 0H830"/><path class="eg" d="M15 0H31M37 0H53"/><path d="M0 .8L9.5 -2.4V2.4Z" fill="#fff"/></g></g>' +
      '<g class="ndl-an" clip-path="url(#' + u + 'w)"><g class="nx"><rect x="10.5" y="-3" width="820" height="6" fill="url(#' + u + 's)"/><rect x="15" y="-3" width="16" height="6" fill="url(#' + u + 'e)"/><rect x="37" y="-3" width="16" height="6" fill="url(#' + u + 'e)"/>' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return '<path d="M' + (k * PC) + ' -3v6" stroke="#20242a" stroke-width="1.6"/><path d="M' + (k * PC - PC / 2) + ' -3v3" stroke="#20242a" stroke-width=".9"/>'; }).join("") +
      '<path d="M10.5 -1.9H830" stroke="rgba(255,255,255,.6)" stroke-width=".8"/><path d="M0 .8L10.5 -3V3Z" fill="#DCE2E8" stroke="#59616b" stroke-width=".6"/><ellipse cx="6.8" cy="-.4" rx="2.9" ry="1" transform="rotate(-20 6.8 -.4)" fill="#30363d"/></g></g>' +
      '<g class="nx"><circle class="pulse" r="0"/></g></g>' +
      '<text class="ori" x="8" y="20">' + ORI[0] + '</text><text class="ori" x="632" y="20" text-anchor="end">' + ORI[1] + '</text><circle cx="12" cy="34" r="5" fill="#FFC61A"/>' +
      [1, 2, 3, 4].filter(function (c) { return 46 + c * PC < 392; }).map(function (c) { return '<path d="M630 ' + (46 + c * PC) + 'h10" stroke="#fff" stroke-width="1.5"/><text class="ori" x="626" y="' + (50 + c * PC) + '" text-anchor="end">' + c + " cm</text>"; }).join("") +
      '<text class="bp-twitch" x="320" y="30" text-anchor="middle"></text></svg>';
    el.classList.add("bp");
    el.innerHTML = '<div class="bp-bar" role="toolbar" aria-label="View"><span>View</span><button data-v="0" aria-pressed="true">Ultrasound</button><button data-v="50" aria-pressed="false">Half and half</button><button data-v="100" aria-pressed="false">Anatomy</button><input type="range" min="0" max="100" value="0" class="bp-wipe" aria-label="Wipe between ultrasound and anatomy"><button data-a="labels" aria-pressed="true">Labels</button><button data-a="tint" aria-pressed="false">Colour the structures</button><button data-a="avoid" aria-pressed="false">Structures to avoid</button><button data-a="test" aria-pressed="false">Test me</button><button data-a="play" class="bp-play">Play the block</button><button data-a="reset">Reset</button></div>' +
      (B.alts ? '<div class="bp-var bp-alt"><span>' + esc(B.altLabel || "Approach") + '</span>' + B.alts.map(function (q) { return '<button data-alt="' + q[0] + '" aria-pressed="' + (q[0] === el.getAttribute("data-block")) + '">' + esc(q[1]) + "</button>"; }).join("") + "</div>" : "") +
      (B.variants ? '<div class="bp-var"><span>' + esc(B.varLabel || "Variations") + '</span>' + B.variants.map(function (v, i) { return '<button data-var="' + i + '" aria-pressed="' + (i === VI) + '">' + esc(v.n) + (v.f ? " <b>" + v.f + "</b>" : "") + "</button>"; }).join("") + '<p class="bp-varn">' + esc(VV.t) + cite(B.varRef) + "</p></div>" : "") +
      '<div class="bp-main"><div class="bp-stage">' + svg + '<p class="bp-hint">Drag anywhere on the image to steer the needle tip. Arrow keys also work: left and right advance and withdraw, up and down change the angle.</p></div>' +
      '<div class="bp-side"><div class="bp-card bp-where" aria-live="polite"></div>' +
      '<div class="bp-card bp-stim"><h4>Nerve stimulator <label class="bp-sw"><input type="checkbox" class="bp-on"> on</label></h4><div class="bp-cur"><button data-c="-0.1" aria-label="Reduce current">−</button><output>1.0 mA</output><button data-c="0.1" aria-label="Increase current">+</button><input type="range" min="0.1" max="2" step="0.1" value="1" class="bp-ma" aria-label="Stimulating current in milliamps"><small>2 Hz · 0.1 ms</small></div><div class="bp-resp" aria-live="polite"></div></div>' +
      '<div class="bp-card bp-inj"><h4>Injection</h4><button data-a="inject">Inject 1 mL test dose</button><button data-a="clear">Clear</button><div class="bp-injr" aria-live="polite"></div></div>' +
      '<div class="bp-card bp-chk"><h4>Find before you needle</h4><ul>' + B.shapes.filter(function (s) { return s.rec; }).map(function (s) { return '<li data-id="' + s.id + '"><span></span>' + esc(s.n) + (s.rec === "strong" ? " <b>" + RL.strong[1] + "</b>" : " <i>" + RL.weak[1] + "</i>") + "</li>"; }).join("") + "</ul><small>" + esc(B.consensus) + cite(B.refs.cons) + "</small></div></div></div>" +
      '<p class="bp-cap">Original schematic, not to scale. The twitch thresholds are a teaching model: the current needed rises with the square of the distance from the nerve. Real thresholds vary between patients and are higher in diabetes.' + cite(B.refs.stim) + "</p>";
    var $ = function (q) { return el.querySelector(q); }, $$ = function (q) { return [].slice.call(el.querySelectorAll(q)); };
    var sv = $("svg"), byId = {}; B.shapes.forEach(function (s) { byId[s.id] = s; });
    var scan = el.getAttribute("data-mode") === "scan"; el.classList.toggle("scan", scan);
    try { var bbf = function (s) { return sv.querySelector('.bp-us [data-id="' + s.id + '"]').getBBox(); }; $(".bp-usimg").setAttribute("href", paintUS(B, bbf)); $(".bp-animg").setAttribute("href", paintAN(B, bbf)); } catch (e) {}
    /* fascia as y(x) look-ups, and path regions for hit tests */
    var fy = {}; B.fascia.forEach(function (f) {
      var p = sv.querySelector('.bp-us .fas[data-f="' + f.id + '"]'), L = p.getTotalLength(), a = [];
      for (var i = 0; i <= 160; i++) { var q = p.getPointAtLength(L * i / 160); a.push([q.x, q.y]); }
      a.sort(function (m, n) { return m[0] - n[0]; });
      fy[f.id] = function (x) { if (x < a[0][0] || x > a[a.length - 1][0]) return 999; for (var j = 1; j < a.length; j++) if (a[j][0] >= x) { var t = (x - a[j - 1][0]) / ((a[j][0] - a[j - 1][0]) || 1); return a[j - 1][1] + (a[j][1] - a[j - 1][1]) * t; } return 999; };
    });
    var NS = "http://www.w3.org/2000/svg", gp = document.createElementNS(NS, "path"); gp.setAttribute("d", B.groove); gp.setAttribute("fill", "none"); gp.setAttribute("stroke", "none"); gp.style.pointerEvents = "none"; sv.appendChild(gp);
    var pt = sv.createSVGPoint(), inPath = function (node, x, y) { pt.x = x; pt.y = y; try { return node.isPointInFill(pt); } catch (e) { return false; } };
    var pathNode = {}; B.shapes.forEach(function (s) { if (s.k === "path") pathNode[s.id] = sv.querySelector('.bp-us [data-id="' + s.id + '"] .shape'); });
    function inShape(s, x, y) {
      if (s.sheath) { var a0 = (x - s.sheath[0]) / s.sheath[2], b0 = (y - s.sheath[1]) / s.sheath[3]; return a0 * a0 + b0 * b0 <= 1; }
      if (s.k === "circle") return Math.hypot(x - s.cx, y - s.cy) <= s.r;
      if (s.k === "duo") return Math.hypot(x - s.a[0], y - s.a[1]) <= s.a[2] || Math.hypot(x - s.b[0], y - s.b[1]) <= s.b[2];
      if (s.k === "ellipse") { var a = (x - s.cx) / s.rx, b = (y - s.cy) / s.ry; return a * a + b * b <= 1; }
      return inPath(pathNode[s.id], x, y);
    }
    var ORDER = ["nerve", "artery", "vein", "bone", "muscle"];
    function where(x, y) {
      if (y < 46) return "air";
      for (var o = 0; o < ORDER.length; o++) for (var i = 0; i < B.shapes.length; i++) { var s = B.shapes[i]; if (s.t === ORDER[o] && inShape(s, x, y)) return s.id; }
      if (y < fy.inv(x)) return "subcut";
      if (y < fy.pre(x)) return "tri";
      if (inPath(gp, x, y)) return "groove";
      return y - fy.pre(x) < 14 ? "tri" : "deep"; /* the thin plane just under the fascia, before the muscle */
    }
    var name = function (z) { return byId[z] ? byId[z].n : B.zones[z][0]; };
    /* state */
    var S = { tip: [B.entry[0] - 6, B.entry[1] + 3], on: false, ma: 1, la: null, seen: {}, play: 0 };
    var nx = $$(".bp-ndl .nx"), pulse = $(".bp-ndl .pulse"), tw = $(".bp-twitch"), laE = $(".bp-la .la");
    function track() { /* layers crossed from the skin to the tip */
      var e = B.entry, t = S.tip, n = Math.max(2, Math.round(Math.hypot(t[0] - e[0], t[1] - e[1]) / 2)), out = [], last = null, pi = null, pp = null;
      for (var i = 0; i <= n; i++) {
        var x = e[0] + (t[0] - e[0]) * i / n, y = e[1] + (t[1] - e[1]) * i / n, z = where(x, y), ai = y >= fy.inv(x), ap = y >= fy.pre(x) && fy.pre(x) < 900;
        if (pi !== null && ai && !pi) out.push({ f: "inv" }); if (pp !== null && ap && !pp) out.push({ f: "pre" });
        pi = ai; pp = ap; if (z !== last) { out.push({ z: z }); last = z; }
      }
      return out;
    }
    function gap(s, x, y) { /* px from a point to the surface of a nerve; 0 or less = inside */
      if (s.sheath) { var q = s.sheath, rho = Math.sqrt(Math.pow((x - q[0]) / q[2], 2) + Math.pow((y - q[1]) / q[3], 2)) || 1e-6; return Math.hypot(x - q[0], y - q[1]) * (1 - 1 / rho); }
      if (s.k === "duo") return Math.min(Math.hypot(x - s.a[0], y - s.a[1]) - s.a[2], Math.hypot(x - s.b[0], y - s.b[1]) - s.b[2]);
      return Math.hypot(x - s.cx, y - s.cy) - s.r; }
    function thr(s) { var d = gap(s, S.tip[0], S.tip[1]); if (d <= 0) return 0.2; var mm = d * MM; return 0.3 + 0.04 * mm * mm; }
    function draw() {
      if (scan) return;
      var e = B.entry, t = S.tip, dx = t[0] - e[0], dy = t[1] - e[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      var tf = "translate(" + t[0].toFixed(1) + " " + t[1].toFixed(1) + ") rotate(" + (Math.atan2(-dy, -dx) * 180 / Math.PI).toFixed(2) + ")"; nx.forEach(function (n) { n.setAttribute("transform", tf); });
      var tr = track(), z = tr.length ? tr[tr.length - 1].z || where(t[0], t[1]) : "air"; z = where(t[0], t[1]);
      var s = byId[z], depth = Math.max(0, (t[1] - 46) * MM / 10), head, body, warn = "";
      if (s) {
        head = s.n; body = s.x + cite(s.c);
        if (s.t === "nerve") { warn = "bad"; head = "Tip inside the " + s.n.toLowerCase(); body = "Stop. Withdraw until the tip lies outside the nerve. Do not inject."; }
        else if (s.t === "artery" || s.t === "vein") { warn = "bad"; head = "Tip inside the " + s.n.toLowerCase(); body = "Stop and withdraw. Do not inject. " + s.x; }
        else if (s.t === "bone") { warn = "bad"; head = "Bone contact: " + s.n.toLowerCase(); body = "Too deep. Withdraw and redirect more superficially."; }
        else if (B.zoneNote && B.zoneNote[z]) { if (B.zoneNote[z][0]) warn = B.zoneNote[z][0]; body = B.zoneNote[z][1] + body; }
      } else { head = B.zones[z][0]; body = B.zones[z][1]; if (z === "deep") warn = "warn"; }
      var dT = Math.hypot(t[0] - B.target[0], t[1] - B.target[1]) * MM;
      if (!warn && dT < 1.6) { warn = "good"; body += " <b>" + B.targetNote + "</b>"; }
      $(".bp-where").className = "bp-card bp-where " + warn;
      $(".bp-where").innerHTML = "<h4>Needle tip · " + depth.toFixed(1) + " cm deep</h4><p class=\"bp-z\">" + esc(head) + "</p><p>" + body + "</p><ol class=\"bp-trk\">" +
        tr.map(function (k) { if (k.f) { var f = B.fascia.filter(function (q) { return q.id === k.f; })[0]; return '<li class="f" title="' + esc(f.t) + '">' + esc(f.n) + "</li>"; } return "<li>" + esc(name(k.z)) + "</li>"; }).join("") + "</ol>";
      $$(".fas").forEach(function (p) { p.classList.toggle("hit", tr.some(function (k) { return k.f === p.getAttribute("data-f"); })); });
      stim(z);
    }
    function stim(z) {
      var r = $(".bp-resp"); $(".bp-cur output").textContent = S.ma.toFixed(1) + " mA"; $(".bp-ma").value = S.ma; $(".bp-on").checked = S.on;
      el.classList.toggle("stim-on", S.on); tw.textContent = ""; el.classList.remove("twitch");
      if (!S.on) { r.innerHTML = "<p>Switch the stimulator on, start at 1.0 mA and watch for a twitch as the tip nears a motor nerve.</p>"; return; }
      var ns = B.shapes.filter(function (s) { return s.t === "nerve"; }).map(function (s) { return { s: s, t: thr(s) }; }).filter(function (q) { return S.ma + 1e-9 >= q.t; }).sort(function (a, b) { return a.t - b.t; });
      var h = "";
      var close = B.shapes.filter(function (s) { return s.target && thr(s) <= 0.5 + 1e-9; }).length;
      if (!ns.length && close && S.ma <= 0.2 + 1e-9) h = "<p class=\"bp-coach good\"><b>No twitch at 0.2 mA, with a twitch still present at 0.5 mA.</b> This is the pattern to look for before injecting: the tip is close to the nerve and the stimulator gives no sign that it is inside it.</p>";
      else if (!ns.length && close) h = "<p class=\"bp-none\"><b>No twitch at " + S.ma.toFixed(1) + " mA.</b> The tip is close: the twitch returns at 0.5 mA.</p>";
      else if (!ns.length) h = "<p class=\"bp-none\"><b>No twitch at " + S.ma.toFixed(1) + " mA.</b> " + (S.ma < 0.95 ? "Raise the current to 1.0 mA to search, or advance a millimetre at a time." : "The tip is not yet close to a motor nerve. Advance.") + "</p>";
      else {
        var q = ns[0], s = q.s, inside = gap(s, S.tip[0], S.tip[1]) <= 0;
        el.classList.add("twitch"); tw.textContent = s.s.split(":")[0];
        h = "<p class=\"bp-tw\"><b>Twitch:</b> " + esc(s.s) + ".<br><small>" + esc(s.n) + " · " + esc(s.m) + "</small>" + (s.mv ? ' <a class="bp-3d" href="anatomy-3d.html?mode=myo&amp;move=' + s.mv + '" target="_blank" rel="noopener">See this movement in 3D</a>' : "") + "</p>";
        if (s.wrong) h += "<p class=\"bp-coach warn\">Not the plexus. " + (s.wn || B.wrongNote) + "</p>";
        else if (S.ma <= 0.2 + 1e-9) h += "<p class=\"bp-coach bad\"><b>Stop. Do not inject.</b> A twitch at 0.2 mA or less was never seen with the needle outside the nerve, so treat this tip as inside it. Withdraw until the twitch is lost at 0.2 mA." + cite(B.refs.stim) + "</p>";
        else if (S.ma <= 0.5 + 1e-9) h += "<p class=\"bp-coach good\"><b>Close to the nerve.</b> Now turn the current down to 0.2 mA. The twitch should disappear; if it stays, the tip may be inside the nerve. A twitch between 0.2 and 0.5 mA did not rule out an intraneural tip, so confirm the tip position on ultrasound and inject only against low pressure." + cite(B.refs.stim) + cite(B.refs.press) + "</p>";
        else h += "<p class=\"bp-coach\">Right muscle group. Reduce the current in steps and advance only when the twitch fades, until it is still present at 0.5 mA or less." + (inside ? "" : "") + "</p>";
        if (ns.length > 1) h += "<p><small>Also answering: " + ns.slice(1).map(function (k) { return esc(k.s.n); }).join(", ") + ".</small></p>";
      }
      h += "<p class=\"bp-ev\"><small>No twitch does not mean no contact: a motor response at 0.5 mA or less was present in 74.5% of needle-to-nerve contacts seen on ultrasound." + cite(B.refs.sens) + "</small></p>";
      r.innerHTML = h;
    }
    function inject() {
      var t = S.tip, z = where(t[0], t[1]), s = byId[z], o = $(".bp-injr"), good = 0, msg, shape = null;
      var near = B.shapes.filter(function (k) { return k.t === "nerve" && gap(k, t[0], t[1]) <= 2; })[0];
      if (near) msg = "<b>Injection refused.</b> The tip is against or inside the " + near.n.toLowerCase() + ". " + (I.refuse || "With the needle touching a root, opening injection pressure reached 15 psi or more in 35 of 36 injections; 1 mm away it stayed below 15 psi.") + cite(B.refs.press);
      else if (s && (s.t === "artery" || s.t === "vein")) msg = "<b>Intravascular.</b> Aspirate, withdraw and reposition. Do not inject.";
      else if (s && s.t === "bone") msg = "<b>No flow.</b> The tip is on bone.";
      else if (z === "subcut" || z === "air") { msg = I.skin; shape = [t[0], t[1] + 4, 20, 7]; }
      else if (z === "tri" || (I.triZ || []).indexOf(z) > -1) { msg = I.tri; shape = [t[0] - 8, t[1] + 2, 46, 11]; }
      else if (I.z[z] && !(z === I.ex && Math.hypot(t[0] - B.target[0], t[1] - B.target[1]) * MM <= 2.2)) { msg = I.z[z][0]; shape = [t[0], t[1], I.z[z][1], I.z[z][2]]; }
      else if (z === "deep") { msg = I.deep; shape = [t[0], t[1], 16, 10]; }
      else if (I.medial && t[0] < I.medial[0]) { msg = I.medial[1]; shape = [t[0], t[1], 20, 13]; }
      else { good = 1; var ex = z === I.ex; shape = ex ? B.la.ex : B.la["in"];
        msg = "<b>Good spread.</b> " + (ex ? I.good.ex : I.good["in"]) + " " + I.tail + cite(B.refs.where) + ' <a href="#coverage">See what the block covers</a>.'; }
      o.className = "bp-injr " + (good ? "good" : shape ? "warn" : "bad"); o.innerHTML = "<p>" + msg + "</p>";
      if (shape) { laE.setAttribute("cx", shape[0]); laE.setAttribute("cy", shape[1]); laE.setAttribute("rx", 2); laE.setAttribute("ry", 2); laE.style.opacity = 1; var t0 = performance.now(); (function g(now) { var k = Math.max(0, Math.min(1, (now - t0) / 1600)), e2 = 1 - Math.pow(1 - k, 3); laE.setAttribute("rx", (2 + (shape[2] - 2) * e2).toFixed(1)); laE.setAttribute("ry", (2 + (shape[3] - 2) * e2).toFixed(1)); if (k < 1) requestAnimationFrame(g); })(t0);
        el.classList.toggle("blocked", !!good); } else clearLa();
    }
    function clearLa() { laE.style.opacity = 0; el.classList.remove("blocked"); $(".bp-injr").innerHTML = ""; }
    function setTip(x, y) { var e = B.entry; x = Math.max(8, Math.min(e[0] - 4, x)); y = Math.max(e[1] + 1, Math.min(392, y)); S.tip = [x, y]; draw(); }
    function setView(v) { v = Math.max(0, Math.min(100, +v)); var x = 640 * (1 - v / 100); $(".bp-clip").setAttribute("x", x); $(".bp-clipu").setAttribute("width", x); $(".bp-div").setAttribute("d", "M" + x + " 0V400"); $(".bp-div").style.opacity = v > 0 && v < 100 ? 1 : 0; $(".bp-wipe").value = v; $$("[data-v]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-v") === v)); }); el.classList.toggle("an-full", v >= 100); }
    function pick(id) { var s = byId[id]; if (!s) return; S.seen[id] = 1; var li = $('.bp-chk li[data-id="' + id + '"]'); if (li) li.classList.add("ok");
      $(".bp-where").className = "bp-card bp-where"; $(".bp-where").innerHTML = "<h4>" + esc(s.n) + (s.rec ? ' <span class="chip ' + (s.rec === "strong" ? "sy" : "obs") + '">' + RL[s.rec === "strong" ? "strong" : "weak"][0] + "</span>" : "") + "</h4><p>" + s.x + cite(s.c) + "</p>" + (s.m ? "<p><b>Supplies:</b> " + esc(s.m) + ".<br><b>On stimulation:</b> " + esc(s.s) + "." + (s.mv ? ' <a class="bp-3d" href="anatomy-3d.html?mode=myo&amp;move=' + s.mv + '" target="_blank" rel="noopener">See this movement in 3D</a>' : "") + "</p>" : "") +
        (s.sup ? '<figure class="bp-sup"><a href="anatomy-3d.html?' + s.sup[1].replace(/&/g, "&amp;") + '&amp;ht=' + encodeURIComponent(s.n) + '" target="_blank" rel="noopener"><img loading="lazy" src="media/figures/supply-' + s.sup[0] + '.jpg" alt="' + esc(s.sup[2]) + '"></a><figcaption>' + esc(s.sup[2]) + ' <a class="bp-3d" href="anatomy-3d.html?' + s.sup[1].replace(/&/g, "&amp;") + '&amp;ht=' + encodeURIComponent(s.n) + '" target="_blank" rel="noopener">Turn it in 3D</a></figcaption></figure>' : "") +
        (s.avoid ? '<p class="bp-coach warn"><b>Structure to avoid.</b> Find it before the needle goes in.</p>' : "");
      $$(".st").forEach(function (g) { g.classList.toggle("sel", g.getAttribute("data-id") === id); }); }
    /* pointer: a short tap selects a structure, a drag steers the needle */
    var drag = null, toSvg = function (ev) { var m = sv.getScreenCTM().inverse(); pt.x = ev.clientX; pt.y = ev.clientY; var p = pt.matrixTransform(m); return [p.x, p.y]; };
    sv.addEventListener("pointerdown", function (ev) { stop(); drag = { p: toSvg(ev), moved: false, id: (ev.target.closest && ev.target.closest(".st") || { getAttribute: function () { return null; } }).getAttribute("data-id"), f: ev.target.getAttribute && ev.target.getAttribute("data-f") }; try { sv.setPointerCapture(ev.pointerId); } catch (e) {} });
    sv.addEventListener("pointermove", function (ev) { if (!drag || scan) return; var p = toSvg(ev); if (!drag.moved && Math.hypot(p[0] - drag.p[0], p[1] - drag.p[1]) < 6) return; drag.moved = true; clearLa(); setTip(p[0], p[1]); ev.preventDefault(); });
    var up = function () { if (!drag) return; var d = drag; drag = null; if (!d.moved) { if (TQ.on) { if (d.id) answer(d.id); return; } if (d.id) pick(d.id); else if (d.f) { var f = B.fascia.filter(function (q) { return q.id === d.f; })[0]; $(".bp-where").className = "bp-card bp-where"; $(".bp-where").innerHTML = "<h4>" + esc(f.n) + "</h4><p>" + esc(f.t) + "</p>"; } } };
    sv.addEventListener("pointerup", up); sv.addEventListener("pointercancel", up);
    sv.addEventListener("keydown", function (ev) { var k = ev.key, e = B.entry, t = S.tip, dx = t[0] - e[0], dy = t[1] - e[1], L = Math.hypot(dx, dy), a = Math.atan2(dy, -dx);
      if (ev.target.closest && ev.target.closest(".st") && (k === "Enter" || k === " ")) { pick(ev.target.closest(".st").getAttribute("data-id")); ev.preventDefault(); return; }
      if (scan) return; if (k === "ArrowLeft") L += 4; else if (k === "ArrowRight") L -= 4; else if (k === "ArrowDown") a += 0.03; else if (k === "ArrowUp") a -= 0.03; else return;
      ev.preventDefault(); stop(); clearLa(); L = Math.max(6, L); setTip(e[0] - Math.cos(a) * L, e[1] + Math.sin(a) * L); });
    sv.setAttribute("tabindex", "0");
    el.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-pick")) { pick(b.getAttribute("data-pick")); return; }
      if (b.hasAttribute("data-alt")) { S.play = 0; var to = b.getAttribute("data-alt"), ids = B.alts.map(function (q) { return q[0]; });
        [].forEach.call(document.querySelectorAll(".block-player"), function (pl) { if (ids.indexOf(pl.getAttribute("data-block")) < 0) return; var nn = pl.cloneNode(false); nn.className = "block-player"; nn.setAttribute("data-block", to); nn.removeAttribute("data-var"); pl.parentNode.replaceChild(nn, pl); mount(nn); }); return; }
      if (b.hasAttribute("data-var")) { S.play = 0; var nn = el.cloneNode(false); nn.className = "block-player"; nn.setAttribute("data-var", b.getAttribute("data-var")); el.parentNode.replaceChild(nn, el); mount(nn); return; }
      if (b.hasAttribute("data-v")) setView(b.getAttribute("data-v"));
      else if (b.hasAttribute("data-c")) { stop(); S.on = true; S.ma = Math.max(0.1, Math.min(2, Math.round((S.ma + +b.getAttribute("data-c")) * 10) / 10)); draw(); }
      else { var a = b.getAttribute("data-a"); if (a === "labels") { var on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(on)); el.classList.toggle("no-lbl", !on); } else if (a === "tint") { var tn = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(tn)); el.classList.toggle("tint", tn); }
        else if (a === "avoid") { var av = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(av)); el.classList.toggle("avoid", av); if (scan || av) home(); else draw(); }
        else if (a === "test") { TQ.on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(TQ.on)); el.classList.toggle("testing", TQ.on); if (TQ.on) { TQ.ok = TQ.n = 0; TQ.q = null; ask(); } else home(); }
        else if (a === "inject") { stop(); inject(); } else if (a === "clear") clearLa(); else if (a === "reset") { stop(); reset(); } else if (a === "play") { if (S.play) stop(); else play(); } } });
    $(".bp-wipe").addEventListener("input", function () { setView(this.value); });
    $(".bp-ma").addEventListener("input", function () { stop(); S.on = true; S.ma = +this.value; draw(); });
    $(".bp-on").addEventListener("change", function () { stop(); S.on = this.checked; draw(); });
    function home() { var av = B.shapes.filter(function (s) { return s.avoid; });
      $(".bp-where").className = "bp-card bp-where"; $(".bp-where").innerHTML = el.classList.contains("avoid") ? "<h4>Structures to avoid</h4><p>" + esc(B.avoidNote) + '</p><ul class="bp-av">' + av.map(function (s) { return '<li><button data-pick="' + s.id + '">' + esc(s.n) + "</button> " + esc(s.x.split(". ")[0]) + ".</li>"; }).join("") + "</ul>" : "<h4>" + esc(B.scanTitle || "Sonoanatomy") + "</h4><p>Tap any structure on the image. Its colour shows what it is: muscle, artery, vein, nerve or bone. Tap a nerve to see what it supplies.</p>"; }
    var TQ = { on: false, q: null, ok: 0, n: 0 };
    function ask(fb) { var pool = B.shapes.filter(function (s) { return s.id !== TQ.q; }), s = pool[Math.floor(Math.random() * pool.length)]; TQ.q = s.id; $$(".st").forEach(function (g) { g.classList.remove("sel"); });
      $(".bp-where").className = "bp-card bp-where"; $(".bp-where").innerHTML = (fb || "") + "<h4>Test me · " + TQ.ok + " of " + TQ.n + '</h4><p class="bp-z">Find: ' + esc(s.n) + ".</p><p><small>Labels are hidden while the test runs.</small></p>"; }
    function answer(id) { TQ.n++; var good = id === TQ.q, s = byId[TQ.q]; if (good) TQ.ok++; ask('<p class="bp-coach ' + (good ? "good" : "bad") + '">' + (good ? "<b>Correct.</b> " : "<b>Not quite.</b> You tapped: " + esc(byId[id] ? byId[id].n : "background") + ". ") + esc(s.n) + ": " + esc(s.x.split(". ")[0]) + ".</p>"); }
    function reset() { if (scan) { home(); return; } S.on = false; S.ma = 1; clearLa(); setTip(B.entry[0] - 6, B.entry[1] + 3); $$(".st").forEach(function (g) { g.classList.remove("sel"); }); }
    /* guided run: the same controls, moved for the learner, with a caption at each step */
    var cap = document.createElement("div"); cap.className = "bp-capn"; $(".bp-stage").appendChild(cap);
    function stop() { if (!S.play) return; S.play = 0; cap.classList.remove("on"); $(".bp-play").textContent = "Play the block"; }
    function play() {
      reset(); S.play = 1; $(".bp-play").textContent = "Stop"; var e = B.entry, T = B.target, L = Math.hypot(T[0] - e[0], T[1] - e[1]), ux = (T[0] - e[0]) / L, uy = (T[1] - e[1]) / L, at = function (s) { setTip(e[0] + ux * s, e[1] + uy * s); };
      var cuts = {}; (function () { var pi = false, pp = false, pz = null; for (var s = 4; s <= L; s += 1) { var x = e[0] + ux * s, y = e[1] + uy * s, ai = y >= fy.inv(x), ap = y >= fy.pre(x) && fy.pre(x) < 900, z = where(x, y); if (ai && !pi && cuts.inv == null) cuts.inv = s; if (ap && !pp && cuts.pre == null) cuts.pre = s; if (z !== pz && cuts[z] == null) cuts[z] = s; pi = ai; pp = ap; pz = z; } })();
      var F = function (k) { return B.fascia.filter(function (q) { return q.id === k; })[0]; };
      var pos2 = function (v) { if (v == null || typeof v === "number") return v; var m = /^([A-Za-z0-9]+)([+-]\d+)?$/.exec(v), base = m[1] === "L" ? L : (cuts[m[1]] == null ? L * 0.5 : cuts[m[1]]); return base + (m[2] ? +m[2] : 0); };
      var steps = B.steps.map(function (q) { var f = q.fas ? F(q.fas) : null; return { to: pos2(q.to), hold: q.hold, say: f ? (q.pre ? q.pre + f.n.toLowerCase() : f.n) + ". " + f.t : q.say,
        fn: (q.on != null || q.ma || q.inject || q.flash) ? function () { if (q.on != null) S.on = !!q.on; if (q.ma) S.ma = q.ma; if (q.inject) { S.on = false; draw(); inject(); } if (q.flash) { var vb = $(".bp-var"); if (vb) vb.classList.add("flash"); } } : null }; });
      var i = 0, pos = 0;
      (function next() { if (!S.play) return; if (i >= steps.length) { stop(); return; } var st = steps[i++]; cap.textContent = st.say; cap.classList.add("on"); if (st.fn) { st.fn(); draw(); }
        var from = pos, to = st.to == null ? pos : st.to, t0 = performance.now(), dur = Math.abs(to - from) * 26 + 1;
        (function mv(now) { if (!S.play) return; var k = Math.max(0, Math.min(1, (now - t0) / dur)); pos = from + (to - from) * k; if (to !== from) at(pos); if (k < 1) requestAnimationFrame(mv); else setTimeout(next, st.hold || 1500); })(t0); })();
    }
    setView(0); reset();
    (function () { var l = "en"; try { l = JSON.parse(localStorage.getItem("nora2.lang")) || "en"; } catch (e) {} var i = ["fr", "es", "de", "it", "tr", "sv", "ta"].indexOf(l); if (i < 0) return;
      var k = "This interactive figure and the notes beneath it are in English for now. Translation is in progress.", d = window.NORA_TEXT && window.NORA_TEXT[k], n = document.createElement("p"); n.className = "langnote"; n.style.cssText = "border-radius:12px;text-align:left;padding:10px 14px;margin:0 0 12px"; n.textContent = d && d[i] ? d[i] : k; el.insertBefore(n, el.firstChild); })();
    var Q = new URLSearchParams(location.search); if (Q.get("bp") === "play") play(); if (Q.get("bpv")) setView(Q.get("bpv")); if (Q.get("bpt")) { var a = Q.get("bpt").split(",").map(Number); setTip(a[0], a[1]); if (a[2]) { S.on = true; S.ma = a[2]; draw(); } if (a[3]) inject(); }
  }
  function boot() { [].forEach.call(document.querySelectorAll(".block-player[data-block]"), mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

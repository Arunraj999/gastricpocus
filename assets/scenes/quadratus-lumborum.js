/* Quadratus lumborum block scenes for the NORA² block player: lateral (qllat), posterior (qlpost) and anterior transmuscular (qlant).
   Original schematic drawings. Depths are schematic adult estimates, not measured data. */
(function () {
  window.BP_SCENES = window.BP_SCENES || {};
  var ALTS = [["qllat", "Lateral"], ["qlpost", "Posterior"], ["qlant", "Anterior (transmuscular)"]];
  var REC = { strong: ["Named in the technique", "technique"], weak: ["Worth finding", "worth finding"] };
  var CONS = "No consensus list of structures to identify has been published for this block. These are the structures named in the published technique; the names of the three approaches follow the ASRA-ESRA consensus.";
  var FINAL = { say: "Now try it yourself: drag the needle, change the current, and see what happens off target.", hold: 3200 };

  /* ---------- flank view shared by the lateral and posterior blocks (left = posterior, right = anterior), 0.21 mm/px ---------- */
  function flank() {
    return [
      { id: "lat", t: "muscle", n: "Latissimus dorsi", l: "LD", k: "path", d: "M0 119C120 118 200 118 270 120C230 128 180 134 130 138C80 142 40 145 0 147Z", lx: 92, ly: 136, rec: "weak", x: "A thin muscle superficial to the back of quadratus lumborum. Thoracodorsal nerve; it extends, adducts and medially rotates the arm." },
      { id: "es", t: "muscle", n: "Erector spinae", l: "ES", k: "path", d: "M0 152C60 150 130 150 178 160C198 168 202 176 194 182C168 180 140 180 118 186C80 198 44 220 0 248Z", lx: 70, ly: 182, rec: "weak", x: "The large muscle at the medial (posterior) edge of the image, behind quadratus lumborum. The middle layer of the thoracolumbar fascia separates the two. Dorsal rami; it extends the spine." },
      { id: "ql", t: "muscle", n: "Quadratus lumborum", l: "QL", k: "path", d: "M40 244C64 222 100 198 140 186C170 179 200 177 222 177C262 178 300 190 318 204C328 212 326 224 314 232C270 256 200 280 130 290C90 294 54 284 44 268C38 258 36 250 40 244Z", lx: 186, ly: 238, rec: "strong", x: "The key muscle: hypoechoic and striated, thickest medially, wrapped in thin bright fascia. It runs from the iliac crest to the 12th rib and the lumbar transverse processes. Subcostal nerve and branches of T12 to L4; it steadies the 12th rib and bends the trunk to the side.", c: 2 },
      { id: "eo", t: "muscle", n: "External oblique", l: "EO", k: "path", d: "M640 92C500 97 380 107 292 116C340 122 420 124 500 123C560 122 610 121 640 121Z", lx: 560, ly: 111, rec: "strong", x: "The most superficial of the three flank muscles. It thins as it runs backwards. Lower intercostal and subcostal nerves." },
      { id: "io", t: "muscle", n: "Internal oblique", l: "IO", k: "path", d: "M640 125C560 125 470 126 400 127C370 128 345 133 328 146C360 158 420 164 480 167C560 169 610 170 640 170Z", lx: 520, ly: 150, rec: "strong", x: "The thickest of the flank muscles, tapering towards quadratus lumborum. Lower intercostal, subcostal, iliohypogastric and ilioinguinal nerves." },
      { id: "ta", t: "muscle", n: "Transversus abdominis", l: "TA", k: "path", d: "M640 174C560 173 480 173 430 175C410 176 396 179 388 183C420 190 480 193 540 194C590 195 620 196 640 196Z", lx: 560, ly: 189, rec: "strong", x: "The deepest flank muscle. It ends in a thin bright aponeurosis that runs back to the lateral border of quadratus lumborum. The plane between it and internal oblique is the transversus abdominis plane." },
      { id: "per", t: "bone", n: "Peritoneum and bowel", l: "BOWEL", k: "path", d: "M344 262C400 244 500 232 640 228V400H462C424 352 386 300 344 262Z", cortex: "M344 262C400 244 500 232 640 228", lx: 500, ly: 300, avoid: 1, rec: "weak", x: "A bright line deep to the transversalis fascia and its thin layer of retroperitoneal fat, with bowel gas casting a dirty shadow beneath. The bowel slides with peristalsis.", hit: ["Peritoneum", "Stop and withdraw. The tip has passed the transversalis fascia and reached the peritoneum, with bowel beneath."] },
      { id: "kid", t: "muscle", n: "Kidney, lower pole", l: "KIDNEY", k: "path", d: "M60 336C90 312 180 308 236 324C268 336 266 366 232 382C180 398 96 394 64 376C46 364 46 348 60 336Z", lx: 158, ly: 357, avoid: 1, x: "An oval organ with a bright capsule deep to quadratus lumborum, seen when the probe is near its lower pole. Its position changes with the level and with breathing." }
    ];
  }
  var TF = { id: "tf", n: "Transversalis fascia", d: "M0 300C80 298 150 292 210 278C260 266 300 248 320 236C350 222 380 206 420 200C500 197 580 196 640 198", t: "Lines the deep surface of transversus abdominis and continues over the front of quadratus lumborum. The retroperitoneal fat, the peritoneum and the kidney lie beneath it: the needle should not cross it." };
  var APO = { id: "apo", n: "Aponeurosis of transversus abdominis", d: "M318 205C340 199 362 191 388 183", t: "The thin bright sheet in which transversus abdominis ends. It meets the lateral border of quadratus lumborum and joins the thoracolumbar fascia." };
  var MID = { id: "mid", n: "Middle layer of the thoracolumbar fascia", d: "M0 252C40 230 80 204 118 189C150 180 190 176 222 176C262 176 296 186 316 202", t: "Covers the back of quadratus lumborum and separates it from erector spinae." };
  var INV = { id: "inv", n: "Superficial fascia over the flank muscles", d: "M0 117C120 116 200 116 292 115C380 106 500 96 640 91", t: "The first layer under the subcutaneous fat, over external oblique and latissimus dorsi." };

  window.BP_SCENES.qllat = {
    title: "Lateral quadratus lumborum block: in-plane from the anterior end",
    scanTitle: "Sonoanatomy on the flank", mm: 0.21, entry: [632, 58], target: [342, 213], ori: ["Posterior", "Anterior"],
    altLabel: "Approach", alts: ALTS, recLab: REC,
    fascia: [INV,
      { id: "pre", n: "Transversus abdominis aponeurosis and the fascia over quadratus lumborum", d: "M0 252C40 230 80 204 118 189C150 180 190 176 222 176C262 176 296 186 318 205C340 199 362 191 388 182C410 177 440 174 480 173C560 172 610 172 640 172", t: "The layer over transversus abdominis that becomes its aponeurosis and joins the fascia around quadratus lumborum. The target lies just beneath the aponeurosis, at the lateral border of the muscle." },
      TF, MID],
    shapes: flank(),
    groove: "M320 206C340 200 362 192 386 184C396 190 398 198 390 204C374 212 354 222 336 232C324 228 318 218 320 206Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the anterior end of the probe, in plane: on this image the anterior end is on the right."],
      subcut: ["Skin and subcutaneous fat", "The first layer. External oblique lies beneath."],
      tri: ["Between the flank muscles", "Outside the target plane. Fluid here spreads between the muscle layers, as a transversus abdominis plane block would, and does not reach the border of quadratus lumborum."],
      groove: ["Beneath the aponeurosis, at the lateral border of quadratus lumborum", "Deep to the aponeurosis of transversus abdominis and superficial to the transversalis fascia. This is where the local anaesthetic should go."],
      deep: ["Deep to the target plane", "Too deep: through the transversalis fascia, in the retroperitoneal fat, towards the peritoneum and kidney. Withdraw."]
    },
    zoneNote: { ql: ["warn", "Inside the muscle: withdraw to its lateral border. "], kid: ["warn", "Stop: this is the kidney. Withdraw. "], ta: ["", "Continue through the end of the muscle to the space beneath its aponeurosis. "], es: ["warn", "Far too posterior for this approach. "], lat: ["warn", "Far too posterior and superficial for this approach. "] },
    targetNote: "This is the target: beneath the aponeurosis of transversus abdominis, at the lateral border of quadratus lumborum, superficial to the transversalis fascia.",
    wrongNote: "No nerve is the target in this block. Withdraw and redirect towards the lateral border of quadratus lumborum.",
    la: { "in": [334, 218, 24, 13] },
    consensus: CONS,
    refs: { stim: 47, sens: 48, press: 49, cons: 1, where: 13 },
    avoidNote: "Before the needle goes in, find the peritoneum and bowel beneath the transversalis fascia, and the kidney deep to quadratus lumborum.",
    inj: {
      skin: "A skin wheal only. The target is beneath three muscle layers.",
      tri: "The fluid spreads between the flank muscles, as a transversus abdominis plane block would. It does not reach the border of quadratus lumborum.",
      triZ: [],
      z: {
        eo: ["The fluid swells inside external oblique. Advance through the flank muscles.", 26, 8],
        io: ["The fluid swells inside internal oblique. Advance through the muscle and the end of transversus abdominis.", 26, 12],
        ta: ["The fluid swells inside transversus abdominis. Advance through the end of the muscle to the space beneath its aponeurosis.", 22, 8],
        ql: ["The fluid swells inside quadratus lumborum and no plane opens. Withdraw to the lateral border of the muscle.", 24, 16],
        es: ["The fluid swells inside erector spinae. This is far from the target of the lateral block.", 24, 16],
        lat: ["The fluid swells inside latissimus dorsi. This is far from the target of the lateral block.", 24, 8],
        kid: ["Stop. The tip is in the kidney. Withdraw at once and do not inject.", 6, 6]
      },
      deep: "Too deep: the fluid is through the transversalis fascia, in the retroperitoneal fat beside the peritoneum. Withdraw.",
      far: [50, "The fluid is beneath the aponeurosis but away from the lateral border of quadratus lumborum. Redirect to the border of the muscle."],
      good: { "in": "The fluid opens a dark lens at the lateral border of quadratus lumborum, beneath the aponeurosis, and tracks along the border of the muscle." },
      tail: "In cadavers, two of three lateral injections of 20 mL also spread into the transversus abdominis plane."
    },
    steps: [
      { to: 14, say: "The needle enters at the anterior end of the probe, in plane, and appears in the subcutaneous fat. On this image anterior is on the right.", hold: 2600 },
      { to: "inv+3", fas: "inv", hold: 2400 },
      { to: "io+12", say: "Through external oblique and into internal oblique. Follow the three flank muscles as they taper backwards.", hold: 2800 },
      { to: "pre+3", pre: "Through the end of transversus abdominis: the ", fas: "pre", hold: 3400 },
      { to: "L", say: "The tip lies beneath the aponeurosis, at the lateral border of quadratus lumborum and above the transversalis fascia. No nerve is sought: this is a fascial plane block.", hold: 3400 },
      { say: "Aspirate, then hydrodissect with a small volume. The fluid should open a dark lens at the border of the muscle, not swell inside it.", inject: 1, hold: 3800 },
      { say: "If the fluid lifts the peritoneum, the tip is too deep. If it spreads between internal oblique and transversus abdominis, it is too superficial.", hold: 4200 },
      FINAL
    ]
  };

  window.BP_SCENES.qlpost = {
    title: "Posterior quadratus lumborum block: the lumbar interfascial triangle",
    scanTitle: "Sonoanatomy on the flank, tilted backwards", mm: 0.21, entry: [632, 58], target: [226, 163], ori: ["Posterior", "Anterior"],
    altLabel: "Approach", alts: ALTS, recLab: REC,
    fascia: [INV,
      { id: "pre", n: "Posterior layer of the thoracolumbar fascia, beneath latissimus dorsi", d: "M0 149C60 147 140 143 200 139C240 136 262 133 272 132C300 138 316 146 330 150C380 160 460 166 640 172", t: "The fascia on the deep surface of latissimus dorsi. The lumbar interfascial triangle lies beneath it, on the back of quadratus lumborum, lateral to erector spinae." },
      APO, TF, MID],
    shapes: (function () { var s = flank(); s.forEach(function (q) {
      if (q.id === "lat") { q.rec = "strong"; q.c = 8; q.x = "The thin muscle that roofs the lumbar interfascial triangle. Thoracodorsal nerve; it extends, adducts and medially rotates the arm."; }
      if (q.id === "es") { q.rec = "strong"; q.c = 8; q.x = "The medial wall of the lumbar interfascial triangle. The middle layer of the thoracolumbar fascia separates it from quadratus lumborum. Dorsal rami; it extends the spine."; }
      if (q.id === "ql") q.x = "The floor of the lumbar interfascial triangle. The posterior block puts the fluid on its back surface, not inside it. Subcostal nerve and branches of T12 to L4.";
      if (q.id === "ta") q.rec = "weak";
      if (q.id === "eo" || q.id === "io") q.rec = "weak";
    }); return s; })(),
    groove: "M198 152C230 144 262 138 282 140C296 152 304 168 306 186C290 182 260 176 226 178C206 180 196 172 196 160Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the anterior end of the probe, in plane: on this image the anterior end is on the right."],
      subcut: ["Skin and subcutaneous fat", "The first layer. External oblique and latissimus dorsi lie beneath."],
      tri: ["Superficial to the target", "Between the superficial fascia and the deep surface of latissimus dorsi, among the flank muscles. Fluid here does not reach the back of quadratus lumborum."],
      groove: ["Lumbar interfascial triangle, on the back of quadratus lumborum", "Fat between quadratus lumborum, latissimus dorsi and erector spinae. This is where the local anaesthetic should go."],
      deep: ["Not on the back of quadratus lumborum", "The tip is at the lateral border of the muscle or deeper, towards the transversalis fascia and the peritoneum. Withdraw and pass over the edge of the muscle to its back surface."]
    },
    zoneNote: { ql: ["warn", "Inside the muscle: an injection here does not reach the paravertebral space. Withdraw to its back surface. "], kid: ["warn", "Stop: this is the kidney. Withdraw. "], es: ["warn", "Too medial: inside erector spinae. Withdraw laterally into the triangle. "], lat: ["warn", "Too superficial: inside latissimus dorsi. The triangle is beneath it. "] },
    targetNote: "This is the target: the lumbar interfascial triangle, on the back of quadratus lumborum, beneath latissimus dorsi and lateral to erector spinae.",
    wrongNote: "No nerve is the target in this block. Redirect to the back of quadratus lumborum.",
    la: { "in": [236, 166, 40, 9] },
    consensus: CONS,
    refs: { stim: 47, sens: 48, press: 49, cons: 1, where: 27 },
    avoidNote: "Before the needle goes in, find the peritoneum and bowel at the anterior end of the image and the kidney deep to quadratus lumborum.",
    inj: {
      skin: "A skin wheal only, in the subcutaneous fat.",
      tri: "The fluid is superficial to the target, above the fascia under latissimus dorsi or between the flank muscles. It does not reach the back of quadratus lumborum.",
      triZ: [],
      z: {
        eo: ["The fluid swells inside external oblique. Advance and pass over the lateral edge of quadratus lumborum.", 26, 8],
        io: ["The fluid swells inside internal oblique. Advance and pass over the lateral edge of quadratus lumborum.", 26, 12],
        ta: ["The fluid swells inside transversus abdominis: too deep and too lateral. Withdraw.", 22, 8],
        ql: ["The fluid swells inside quadratus lumborum, pushing the striations apart. An injection into the muscle did not reach the paravertebral space. Withdraw to its back surface.", 24, 16],
        es: ["The fluid swells inside erector spinae, medial to the triangle. Withdraw and redirect laterally.", 24, 16],
        lat: ["The fluid swells inside latissimus dorsi, above the triangle. Advance through its deep fascia.", 24, 8],
        kid: ["Stop. The tip is in the kidney. Withdraw at once and do not inject.", 6, 6]
      },
      deep: "The fluid is not on the back of quadratus lumborum: it is at the lateral border of the muscle or deeper. Withdraw and steer over the edge of the muscle to its back surface.",
      far: [40, "The fluid is on the back of quadratus lumborum but lateral to the triangle. Advance medially, towards erector spinae."],
      good: { "in": "The fluid spreads as a thin layer over the back of quadratus lumborum, filling the triangle and separating the muscle from latissimus dorsi and the middle layer of the thoracolumbar fascia." },
      tail: "In volunteers, the posterior approach spread into the paravertebral space at T10 to T12; an injection into the muscle itself did not."
    },
    steps: [
      { to: 14, say: "The needle enters at the anterior end of the probe, in plane, and appears in the subcutaneous fat. On this image anterior is on the right.", hold: 2600 },
      { to: "inv+3", fas: "inv", hold: 2400 },
      { to: "eo+12", say: "Through the thin posterior part of external oblique, then the tapering end of internal oblique.", hold: 2800 },
      { to: "pre+3", pre: "Past the end of internal oblique, over the lateral edge of quadratus lumborum and beneath the ", fas: "pre", hold: 3600 },
      { to: "L", say: "The tip rests on the back of quadratus lumborum, in the lumbar interfascial triangle: latissimus dorsi above, erector spinae medially. The needle has not entered the muscle.", hold: 3600 },
      { say: "Aspirate, then hydrodissect with a small volume. The fluid should lie as a layer behind the muscle, not inside it.", inject: 1, hold: 3800 },
      { say: "If the muscle swells and its striations part, the tip is inside it. Withdraw a millimetre and try again.", hold: 3800 },
      FINAL
    ]
  };

  /* ---------- shamrock view for the anterior (transmuscular) block (left = anterolateral, right = posteromedial), 0.225 mm/px ---------- */
  window.BP_SCENES.qlant = {
    title: "Anterior (transmuscular) quadratus lumborum block: the shamrock view",
    scanTitle: "Sonoanatomy at L3 to L4: the shamrock", mm: 0.225, entry: [636, 56], target: [405, 297], ori: ["Anterolateral", "Posteromedial"],
    altLabel: "Approach", alts: ALTS, recLab: REC,
    fascia: [
      { id: "inv", n: "Superficial fascia over latissimus dorsi and the flank", d: "M0 99C150 99 300 100 640 100", t: "The first layer under the subcutaneous fat." },
      { id: "pre", n: "Fascia on the anterior surface of quadratus lumborum", d: "M0 160C80 160 150 166 198 186C230 222 280 264 330 282C380 290 430 290 476 300C520 306 580 318 640 334", t: "The thin investing fascia on the front of quadratus lumborum. The tip should come to rest just through it, between the muscle and the anterior layer of the thoracolumbar fascia." },
      { id: "af", n: "Anterior layer of the thoracolumbar fascia", d: "M0 190C80 190 160 194 200 206C240 238 288 278 330 296C380 304 430 305 472 306", t: "Covers the front of quadratus lumborum and continues over psoas. In the two-layer model it is the transversalis fascia. Keep the tip on the quadratus lumborum side of this layer." }
    ],
    shapes: [
      { id: "eo", t: "muscle", n: "External oblique", l: "EO", k: "path", d: "M0 101C60 101 120 103 180 108C140 116 80 120 0 122Z", lx: 54, ly: 116, x: "The flank muscles taper at the anterior edge of the image." },
      { id: "io", t: "muscle", n: "Internal oblique", l: "IO", k: "path", d: "M0 126C70 126 140 130 196 140C160 152 90 156 0 158Z", lx: 60, ly: 145, x: "The middle flank muscle, tapering towards quadratus lumborum." },
      { id: "ta", t: "muscle", n: "Transversus abdominis", l: "TA", k: "path", d: "M0 163C60 163 130 167 190 178C150 184 70 187 0 187Z", lx: 60, ly: 179, x: "The deepest flank muscle; its aponeurosis reaches the lateral border of quadratus lumborum." },
      { id: "lat", t: "muscle", n: "Latissimus dorsi", l: "LD", k: "path", d: "M206 112C300 104 460 102 640 102V124C470 126 320 128 220 121Z", lx: 300, ly: 119, rec: "weak", x: "The thin muscle the needle crosses first. Thoracodorsal nerve." },
      { id: "es", t: "muscle", n: "Erector spinae", l: "ES", k: "path", d: "M380 140C440 130 560 130 640 134V328C626 318 610 310 590 306C550 298 510 296 484 300C474 276 462 240 446 212C430 186 410 160 380 140Z", lx: 560, ly: 222, rec: "strong", x: "The posterior leaf of the shamrock, behind the transverse process. Dorsal rami; it extends the spine.", c: 11 },
      { id: "ql", t: "muscle", n: "Quadratus lumborum", l: "QL", k: "path", d: "M205 194C230 180 290 172 340 172C390 172 420 186 440 214C458 240 470 272 478 300C460 296 440 290 405 288C360 286 320 278 286 258C250 238 220 214 205 194Z", lx: 334, ly: 232, rec: "strong", x: "The lateral leaf of the shamrock, attached to the tip of the transverse process. In this approach the needle passes through it and stops where it leaves its anterior surface.", c: 11 },
      { id: "pm", t: "muscle", n: "Psoas major", l: "PM", k: "path", d: "M318 322C334 306 380 302 420 304C452 306 470 316 474 336C478 360 462 384 424 390C378 396 334 380 320 360C312 346 310 334 318 322Z", lx: 372, ly: 356, rec: "strong", avoid: 1, x: "The anterior leaf of the shamrock, in front of quadratus lumborum and beside the vertebral body. The lumbar plexus runs within it. When the injection went through the fascia onto psoas, 80% of patients needed help to walk at 1 hour, against 15% when it stayed on the quadratus lumborum side.", c: 12 },
      { id: "tp", t: "bone", n: "Transverse process (L3 or L4)", l: "TP", k: "path", d: "M474 306C510 298 560 302 600 314C620 320 632 330 640 340V400H504C494 372 482 340 474 306Z", cortex: "M474 306C510 298 560 302 600 314C620 320 632 330 640 340", lx: 574, ly: 364, rec: "strong", x: "The stem of the shamrock: a bright line with a dense acoustic shadow, running medially to the vertebral body. Quadratus lumborum is attached to its tip.", c: 11, hit: ["On the transverse process", "Bone contact. Withdraw and redirect towards the plane between quadratus lumborum and psoas, lateral to the tip of the process."] },
      { id: "kid", t: "muscle", n: "Kidney", l: "KIDNEY", k: "path", d: "M130 340C160 316 250 312 300 330C330 342 330 372 300 386C250 400 160 398 132 382C112 370 112 352 130 340Z", lx: 222, ly: 360, avoid: 1, rec: "weak", x: "An oval organ with a bright capsule and darker cortex, anterolateral to quadratus lumborum and psoas. It moves with breathing." },
      { id: "per", t: "bone", n: "Peritoneum and bowel", l: "BOWEL", k: "path", d: "M0 222C40 224 80 234 112 254C124 262 128 280 120 300C90 330 40 340 0 342Z", cortex: "M0 222C40 224 80 234 112 254", lx: 52, ly: 290, avoid: 1, x: "At the anterior edge of the image, deep to the flank muscles: a bright line with bowel gas beneath.", hit: ["Peritoneum", "Stop and withdraw. The tip is at the peritoneum, with bowel beneath."] },
      { id: "lp", t: "nerve", n: "Lumbar plexus roots", l: "LP", k: "duo", a: [446, 326, 5], b: [458, 344, 5], cx: 452, cy: 335, r: 5, lx: 422, ly: 332, avoid: 1, wrong: 1, m: "Quadriceps through the femoral nerve, and the adductors through the obturator nerve (L2 to L4)", s: "Quadriceps twitch: the tip is in or near psoas, too deep", wn: "Withdraw out of psoas to the plane between quadratus lumborum and the anterior layer of the fascia.", x: "Small dark dots in the posterior part of psoas, near the transverse process. Schematic: they are not always seen. A quadriceps twitch means the tip is near them." }
    ],
    groove: "M316 280C350 290 390 292 430 292C452 293 466 296 476 302C468 308 440 307 410 306C370 305 340 302 316 294Z",
    zones: {
      air: ["Above the skin", "The needle has not entered yet. Insert it at the posterior end of the probe, in plane: on this image the posterior end is on the right."],
      subcut: ["Skin and subcutaneous fat", "The first layer. Latissimus dorsi lies beneath."],
      tri: ["Outside the target plane", "Fat around the posterior muscles or the flank muscles. Fluid here does not open the plane between quadratus lumborum and psoas."],
      groove: ["Between quadratus lumborum and psoas, on the quadratus lumborum side of the fascia", "Just through the anterior surface of quadratus lumborum, superficial to the anterior layer of the thoracolumbar fascia over psoas. This is where the local anaesthetic should go."],
      deep: ["Deep to the target plane", "Too deep: beyond the anterior layer of the thoracolumbar fascia, towards psoas, the kidney or the retroperitoneum. Withdraw."]
    },
    zoneNote: { ql: ["", "Inside the muscle. Continue until the tip just leaves its anterior surface. "], es: ["", "Erector spinae: keep going, through quadratus lumborum. "], pm: ["warn", "Too deep: through the fascia, inside psoas, near the lumbar plexus. Withdraw. "], kid: ["warn", "Stop: this is the kidney. Withdraw. "], lat: ["", "Continue through latissimus dorsi. "] },
    targetNote: "This is the target: between quadratus lumborum and psoas, on the quadratus lumborum side of the anterior layer of the thoracolumbar fascia.",
    wrongNote: "Withdraw out of psoas to the plane between quadratus lumborum and the anterior layer of the fascia.",
    la: { "in": [402, 298, 50, 9] },
    consensus: CONS,
    refs: { stim: 47, sens: 48, press: 49, cons: 1, where: 11 },
    avoidNote: "Before the needle goes in, find psoas and the lumbar plexus within it, the kidney, and the transverse process.",
    inj: {
      skin: "A skin wheal only. The target lies deep to two muscles.",
      tri: "The fluid is outside quadratus lumborum, in fat away from the plane between the muscle and psoas.",
      triZ: [],
      z: {
        lat: ["The fluid swells inside latissimus dorsi. Advance.", 24, 8],
        es: ["The fluid swells inside erector spinae. Advance into quadratus lumborum.", 24, 16],
        ql: ["The fluid swells inside quadratus lumborum and no plane opens. Advance until the tip just leaves the anterior surface of the muscle.", 26, 18],
        pm: ["The fluid is through the fascia, inside psoas, beside the lumbar plexus: this behaves partly like a lumbar plexus block and weakens the leg. Withdraw to the quadratus lumborum side of the fascia.", 26, 16],
        kid: ["Stop. The tip is in the kidney. Withdraw at once and do not inject.", 6, 6],
        eo: ["The fluid swells inside external oblique, far from the target.", 24, 8],
        io: ["The fluid swells inside internal oblique, far from the target.", 24, 10],
        ta: ["The fluid swells inside transversus abdominis, far from the target.", 24, 8]
      },
      deep: "Too deep: the fluid is beyond the anterior layer of the fascia, towards psoas and the retroperitoneum. Withdraw.",
      far: [46, "The fluid is between quadratus lumborum and the fascia, but away from the tip of the transverse process. Redirect medially, towards the shamrock."],
      good: { "in": "The fluid opens the interface between quadratus lumborum and psoas as a dark lens and tracks medially towards the tip of the transverse process." },
      tail: "In cadavers, 30 mL placed here reached the thoracic paravertebral space behind the arcuate ligaments.",
      refuse: "With the needle touching a nerve, opening injection pressure reached 15 psi or more in 35 of 36 injections; 1 mm away it stayed below 15 psi."
    },
    steps: [
      { to: 14, say: "The needle enters at the posterior end of the probe, in plane, and appears in the subcutaneous fat. On this image posterior is on the right.", hold: 2600 },
      { to: "inv+3", fas: "inv", hold: 2200 },
      { to: "lat+8", say: "Through latissimus dorsi. The shamrock is below: erector spinae behind, quadratus lumborum at the tip of the transverse process, psoas in front.", hold: 3600 },
      { to: "es+30", say: "Past the edge of erector spinae.", hold: 2200 },
      { to: "ql+40", say: "Into quadratus lumborum: this is the transmuscular route. Keep the whole shaft in view.", hold: 3000 },
      { to: "pre+3", pre: "Out through the ", fas: "pre", hold: 3600 },
      { to: "L", say: "The tip rests between quadratus lumborum and psoas, still on the quadratus lumborum side of the anterior layer of the fascia.", hold: 3400 },
      { say: "Aspirate, then hydrodissect with a small volume. The fluid should separate the two muscles, not track into psoas.", inject: 1, hold: 3800 },
      { say: "Switch the stimulator on if you wish: a quadriceps twitch means the tip is in or near psoas, beside the lumbar plexus. Withdraw.", hold: 4200 },
      FINAL
    ]
  };
})();

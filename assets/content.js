/* ============================================================
   NORA² CONTENT FILE: this is the only file you need to edit
   to add videos, cadaver images, meetings and blocks.
   Keep the commas and quote marks exactly as in the examples.
   ============================================================ */
window.NORA = {

  /* Your YouTube channel address. Leave "" to hide the button. */
  youtubeChannel: "",

  /* Optional picture behind the home page headline, e.g. "media/hero.jpg".
     Use only an image you own or have licensed. Leave "" for the animated nerve network alone. */
  heroImage: "media/hero.webp",

  /* Contact address shown on the About page. */
  contactEmail: "",

  /* ---------- VIDEOS ----------
     type:  "technique" | "panel" | "lecture"
     youtube: the 11-character ID from the YouTube link
              (https://www.youtube.com/watch?v=THIS_PART)
     file:  OR a file you host yourself, e.g. "media/video/isb.mp4"
     Leave both empty and the card shows as "coming soon".        */
  videos: [
    { title: "Interscalene block: scanning and needling", type: "technique", block: "interscalene", minutes: "", youtube: "", file: "" },
    { title: "Phrenic-sparing shoulder analgesia: panel discussion", type: "panel", block: "", minutes: "", youtube: "", file: "" },
    { title: "Fascial plane blocks of the chest wall", type: "lecture", block: "", minutes: "", youtube: "", file: "" }
  ],

  /* ---------- CADAVER LAB IMAGES ----------
     Put the image file in media/cadaver/ and list it here.
     labelled: optional second image with structures labelled;
               visitors can switch between the two.               */
  gallery: [
    { src: "", labelled: "", title: "Interscalene groove, right side", region: "upper", caption: "" },
    { src: "", labelled: "", title: "Supraclavicular brachial plexus", region: "upper", caption: "" },
    { src: "", labelled: "", title: "Femoral triangle", region: "lower", caption: "" },
    { src: "", labelled: "", title: "Popliteal fossa: sciatic bifurcation", region: "lower", caption: "" },
    { src: "", labelled: "", title: "Pectoral and serratus planes", region: "chest", caption: "" },
    { src: "", labelled: "", title: "Transversus abdominis plane", region: "abdo", caption: "" }
  ],

  /* ---------- MEETINGS ----------
     date: YYYY-MM-DD.  Past meetings move to "Past meetings" automatically. */
  meetings: [
    {
      title: "ESRA 4th World Day of Regional Anaesthesia and Pain Medicine: Wrightington",
      date: "2027-01-30",
      venue: "Wrightington Hall Conference Centre, Wrightington Hospital, Hall Lane, Appley Bridge, Wigan WN6 9EP (two minutes from M6 junction 27)",
      summary: "Building Skills That Change Care. A one-day regional anaesthesia course, part of the ESRA World Day running in more than 200 cities. Lectures and video demonstrations through the day, with small-group, hands-on ultrasound nerve block workshops on live models in the afternoon.",
      tags: ["Lectures", "Video demonstrations", "Live-model ultrasound workshops", "Small groups"],
      fees: "£70 ESRA or RA-UK members · £90 non-members",
      directors: "Dr Arun Mohanraj FRCA EDRA, Wrightington, Wigan and Leigh NHS Foundation Trust · Dr Veerabadran Velayutham, Royal Preston Hospital",
      audience: "Consultants, SAS doctors and anaesthetists in training",
      cpd: "6 CPD points (ESRA; RCoA accreditation applied for)",
      contact: "Arun.Mohanraj@wwl.nhs.uk",
      refunds: "Full refund less administration charges more than 8 weeks before the day; no refund after that.",
      qr: "media/meetings/wdrapm-2027-qr.png",
      bookingUrl: "https://bookcpd.com/events/esra-4th-world-day-of-regional-anaesthesia-pain-medicine-wrightington-orthopedic-hospital"
    }
  ],

  /* ---------- RESEARCH ----------
     status: e.g. "Recruiting", "In analysis", "Published".  funder: e.g. "NIHR".
     Example:
     { title: "Study title", status: "Recruiting", funder: "NIHR", summary: "One or two sentences.", url: "https://...", linkText: "Trial registration" }  */
  /* Books and in-house publications. Fill in title, summary, url (where to buy or read) and cover
     (put the cover picture in media/ and write its path, for example "media/book-plane-blocks.webp"). */
  publications: [
    { status: "In preparation", title: "Second NORA² book", authors: "Northwest Regional Anaesthesia Alliance", summary: "A second book from the alliance is being written. Details will follow.", url: "", cover: "" }
  ],
  research: [
    { group: "ongoing", status: "Systematic review and meta-analysis", funder: "Registered on PROSPERO (NIHR)", reg: "CRD420261541500", registered: "15 October 2026",
      title: "Continuous peripheral nerve catheter versus single-injection block for surgery: a systematic review and meta-analysis of randomised trials with a focus on safety",
      team: "Arun Kuppuswamy Mohanraj, Georgia Halladay, Anjali Kundu",
      summary: "Nerve and fascial-plane catheters extend pain relief beyond the 12 to 24 hours of a single injection, but they add equipment, staff time and their own ways to fail, such as dislodgement, leakage, infection and local anaesthetic toxicity. This review of randomised trials asks whether, in adults having surgery, a catheter changes the risk of block-related or catheter-related adverse events compared with a single-injection block at the same site.",
      url: "https://www.crd.york.ac.uk/PROSPERO/view/CRD420261541500", linkText: "View the PROSPERO registration" },
    { group: "ongoing", status: "Systematic review and meta-analysis", funder: "Registered on PROSPERO (NIHR)", reg: "CRD420261556529", registered: "30 October 2026",
      title: "Gastric ultrasound before anaesthesia and sedation: a systematic review and meta-analysis of at-risk stomach prevalence, predictors including GLP-1 receptor agonists, fasting regimens and management impact",
      team: "Arun Kuppuswamy Mohanraj, Anjali Kundu, Marietta Avramopoulou",
      summary: "Fasting rules assume that the stomach empties predictably, yet emptying is delayed or variable in several groups, including people taking GLP-1 receptor agonists, people with diabetes or obesity, emergency and trauma patients, women in labour and patients receiving opioids. This review estimates how often gastric ultrasound before a procedure finds an at-risk stomach, overall and in each of these groups, what predicts it, and how the scan changes management.",
      url: "https://www.crd.york.ac.uk/PROSPERO/view/CRD420261556529", linkText: "View the PROSPERO registration" },
    { group: "ongoing", status: "Systematic review", funder: "Registered on PROSPERO (NIHR)", reg: "CRD420261541530", registered: "15 October 2026",
      title: "Peripheral nerve and fascial plane blocks after radiotherapy for cancer: a systematic review of early, intermediate and late challenges in block performance, efficacy and complications",
      team: "Arun Kuppuswamy Mohanraj, Anjali Kundu",
      summary: "A growing number of patients who have had radiotherapy later need surgery or analgesia in or near the treated region: the axilla and brachial plexus after breast cancer, the neck after head and neck cancer, the pelvis and groin. Radiotherapy changes the tissues the anaesthetist works in. This review examines the success rate and complications of nerve and fascial plane blocks performed in or near irradiated tissue, early, in the intermediate period and late after treatment.",
      url: "https://www.crd.york.ac.uk/PROSPERO/view/CRD420261541530", linkText: "View the PROSPERO registration" }
  ],

  /* ---------- BLOG AND DISCUSSION ----------
     date: YYYY-MM-DD. url: link to the full post (a page you add, or an external article).
     Example:
     { title: "Post title", date: "2027-02-01", author: "Dr A Name", summary: "Two sentences.", url: "posts/my-post.html" }  */
  posts: [],

  /* ---------- SURGERIES AND BLOCKS ----------
     One line per operation. blocks: the blocks to list against it; give page: "file.html"
     when that block has a finished page. Leave blocks: [] until the choice is referenced.
     more: optional link to the evidence, e.g. "interscalene.html#surgery".              */
  surgeries: [
    { op: "Arthroscopic rotator cuff repair", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Arthroscopic subacromial decompression", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Biceps tenodesis or tenotomy", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Labral repair and stabilisation (Bankart, SLAP)", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Capsular release for frozen shoulder", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Excision of calcific deposit", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Arthroscopic excision of the distal clavicle", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }, { name: "Suprascapular with axillary", page: "suprascapular.html" }], more: "interscalene.html#surgery" },
    { op: "Total shoulder replacement", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Reverse shoulder replacement", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Shoulder hemiarthroplasty", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Revision shoulder replacement", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Open rotator cuff repair", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Open stabilisation (Latarjet)", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Proximal humerus fracture fixation", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }], more: "interscalene.html#surgery" },
    { op: "Humeral shaft fracture fixation", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }, { name: "Superior trunk", page: "superior-trunk.html" }], more: "interscalene.html#surgery" },
    { op: "Clavicle fracture fixation", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Acromioclavicular joint stabilisation", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Manipulation of the shoulder under anaesthesia", region: "upper", group: "Shoulder", blocks: [{ name: "Interscalene", page: "interscalene.html" }], more: "interscalene.html#surgery" },
    { op: "Elbow replacement", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Distal humerus fracture fixation", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Olecranon fracture fixation", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Ulnar nerve decompression", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Distal radius fracture fixation", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Carpal tunnel decompression", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Dupuytren's fasciectomy", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Trapeziectomy", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Tendon repair of the hand", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Wrist arthroscopy", region: "upper", group: "Elbow, forearm and hand", blocks: [] },
    { op: "Arteriovenous fistula formation", region: "upper", group: "Vascular access", blocks: [] },
    { op: "Arteriovenous graft insertion", region: "upper", group: "Vascular access", blocks: [] },
    { op: "Total hip replacement", region: "lower", group: "Hip", blocks: [] },
    { op: "Revision hip replacement", region: "lower", group: "Hip", blocks: [] },
    { op: "Hip fracture: hemiarthroplasty", region: "lower", group: "Hip", blocks: [] },
    { op: "Hip fracture: dynamic hip screw or nail", region: "lower", group: "Hip", blocks: [] },
    { op: "Hip arthroscopy", region: "lower", group: "Hip", blocks: [] },
    { op: "Total knee replacement", region: "lower", group: "Knee", blocks: [] },
    { op: "Unicompartmental knee replacement", region: "lower", group: "Knee", blocks: [] },
    { op: "Anterior cruciate ligament reconstruction", region: "lower", group: "Knee", blocks: [] },
    { op: "Knee arthroscopy", region: "lower", group: "Knee", blocks: [] },
    { op: "Tibial plateau fracture fixation", region: "lower", group: "Knee", blocks: [] },
    { op: "Ankle fracture fixation", region: "lower", group: "Foot and ankle", blocks: [] },
    { op: "Ankle fusion or replacement", region: "lower", group: "Foot and ankle", blocks: [] },
    { op: "Achilles tendon repair", region: "lower", group: "Foot and ankle", blocks: [] },
    { op: "Bunion correction", region: "lower", group: "Foot and ankle", blocks: [] },
    { op: "Forefoot surgery", region: "lower", group: "Foot and ankle", blocks: [] },
    { op: "Above-knee amputation", region: "lower", group: "Amputation", blocks: [] },
    { op: "Below-knee amputation", region: "lower", group: "Amputation", blocks: [] },
    { op: "Toe or forefoot amputation", region: "lower", group: "Amputation", blocks: [] },
    { op: "Awake mastectomy (no general anaesthetic)", region: "chest", group: "Breast", blocks: [{ name: "Superficial cervical plexus" }, { name: "Thoracic paravertebral or serratus anterior plane" }, { name: "Parasternal intercostal plane" }, { name: "Intercostobrachial (optional)" }], more: "breast-blocks.html#awake" },
    { op: "Mastectomy", region: "chest", group: "Breast", blocks: [{ name: "Thoracic paravertebral" }, { name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Serratus anterior plane" }, { name: "Erector spinae plane" }], more: "breast-blocks.html#mast" },
    { op: "Mastectomy with axillary node clearance", region: "chest", group: "Breast", blocks: [{ name: "Thoracic paravertebral" }, { name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Serratus anterior plane" }], more: "breast-blocks.html#mastanc" },
    { op: "Wide local excision for invasive ductal carcinoma", region: "chest", group: "Breast", blocks: [{ name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Serratus anterior plane" }, { name: "Wound infiltration" }], more: "breast-blocks.html#wleidc" },
    { op: "Wide local excision for ductal carcinoma in situ", region: "chest", group: "Breast", blocks: [{ name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Serratus anterior plane" }, { name: "Wound infiltration" }], more: "breast-blocks.html#wledcis" },
    { op: "Sentinel lymph node biopsy", region: "chest", group: "Breast", blocks: [{ name: "Wound infiltration" }, { name: "Serratus anterior plane" }, { name: "PECS II (interpectoral and pectoserratus planes)" }], more: "breast-blocks.html#slnb" },
    { op: "Axillary node clearance", region: "chest", group: "Breast", blocks: [{ name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Serratus anterior plane" }, { name: "Thoracic paravertebral" }], more: "breast-blocks.html#anc" },
    { op: "TRAM flap reconstruction", region: "chest", group: "Breast", blocks: [{ name: "Thoracic paravertebral" }, { name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "TAP, donor site" }], more: "breast-blocks.html#tram" },
    { op: "DIEP flap reconstruction", region: "chest", group: "Breast", blocks: [{ name: "Thoracic paravertebral" }, { name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "TAP, donor site" }], more: "breast-blocks.html#diep" },
    { op: "Latissimus dorsi flap reconstruction", region: "chest", group: "Breast", blocks: [{ name: "Thoracic paravertebral" }, { name: "Erector spinae plane" }, { name: "Serratus anterior plane" }], more: "breast-blocks.html#ld" },
    { op: "Implant-based reconstruction or tissue expander", region: "chest", group: "Breast", blocks: [{ name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Thoracic paravertebral" }], more: "breast-blocks.html#implant" },
    { op: "Breast augmentation with implants", region: "chest", group: "Breast", blocks: [{ name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Thoracic paravertebral" }], more: "breast-blocks.html#aug" },
    { op: "Implant exchange or removal, including ruptured implant", region: "chest", group: "Breast", blocks: [{ name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Wound infiltration" }], more: "breast-blocks.html#exch" },
    { op: "Breast reduction", region: "chest", group: "Breast", blocks: [{ name: "Thoracic paravertebral" }, { name: "PECS II (interpectoral and pectoserratus planes)" }, { name: "Wound infiltration" }], more: "breast-blocks.html#reduc" },
    { op: "Video-assisted thoracoscopic surgery", region: "chest", group: "Thoracic and chest wall", blocks: [] },
    { op: "Thoracotomy", region: "chest", group: "Thoracic and chest wall", blocks: [] },
    { op: "Rib fracture fixation", region: "chest", group: "Thoracic and chest wall", blocks: [] },
    { op: "Sternotomy", region: "chest", group: "Thoracic and chest wall", blocks: [] },
    { op: "Chest drain insertion", region: "chest", group: "Thoracic and chest wall", blocks: [] },
    { op: "Open inguinal hernia repair", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Laparoscopic inguinal hernia repair", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Umbilical or incisional hernia repair", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Laparoscopic cholecystectomy", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Laparotomy", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Appendicectomy", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Nephrectomy", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Caesarean section", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Abdominal hysterectomy", region: "abdo", group: "Abdominal wall and abdomen", blocks: [] },
    { op: "Carotid endarterectomy", region: "head", group: "Head, neck and eye", blocks: [] },
    { op: "Thyroidectomy", region: "head", group: "Head, neck and eye", blocks: [] },
    { op: "Cataract surgery", region: "head", group: "Head, neck and eye", blocks: [] },
    { op: "Vitreoretinal surgery", region: "head", group: "Head, neck and eye", blocks: [] },
    { op: "Awake craniotomy", region: "head", group: "Head, neck and eye", blocks: [] }
  ],

  /* ---------- BLOCK LIBRARY ----------
     page: the file name of the finished block page. Leave "" while in preparation. */
  regions: [
    { id: "upper", name: "Upper limb", cls: "r-upper", c: "#E5484D" },
    { id: "lower", name: "Lower limb", cls: "r-lower", c: "#2563EB" },
    { id: "chest", name: "Chest wall", cls: "r-chest", c: "#0E9F8E" },
    { id: "abdo",  name: "Abdomen",    cls: "r-abdo",  c: "#F59E0B" },
    { id: "axial", name: "Neuraxial",  cls: "r-axial", c: "#7C3AED" },
    { id: "head",  name: "Head and neck", cls: "r-head", c: "#0891B2" }
  ],
  /* GUIDES: pages that compare or choose between blocks. Listed with the blocks of their region, not counted as blocks. */
  guides: [
    { name: "Phrenic-sparing blocks for shoulder surgery", region: "upper", page: "phrenic-sparing.html", also: "diaphragm sparing hemidiaphragmatic paresis shoulder respiratory COPD" }
  ],
  blocks: [
    { name: "Interscalene brachial plexus block", region: "upper", page: "interscalene.html", also: "ISB shoulder" },
    { name: "Superior trunk block", region: "upper", page: "superior-trunk.html", also: "STB upper trunk phrenic sparing shoulder" },
    { name: "Supraclavicular block", region: "upper", page: "" },
    { name: "Infraclavicular block (costoclavicular)", region: "upper", page: "" },
    { name: "Retroclavicular block (RAPTIR)", region: "upper", page: "retroclavicular.html", also: "retroclavicular approach to the infraclavicular region infraclavicular raptir" },
    { name: "Axillary brachial plexus block", region: "upper", page: "" },
    { name: "Suprascapular nerve block", region: "upper", page: "suprascapular.html", also: "SSNB shoulder block subomohyoid anterior posterior supraspinous fossa axillary nerve phrenic sparing" },
    { name: "Axillary nerve block", region: "upper", page: "" },
    { name: "Forearm nerve blocks", region: "upper", page: "", also: "median ulnar radial" },
    { name: "Wrist block", region: "upper", page: "" },
    { name: "Femoral nerve block", region: "lower", page: "" },
    { name: "Fascia iliaca block (suprainguinal)", region: "lower", page: "", also: "hip fracture" },
    { name: "Pericapsular nerve group (PENG) block", region: "lower", page: "", also: "hip" },
    { name: "Adductor canal block", region: "lower", page: "", also: "knee saphenous" },
    { name: "Genicular nerve blocks", region: "lower", page: "", also: "knee" },
    { name: "iPACK block", region: "lower", page: "", also: "knee posterior capsule" },
    { name: "Popliteal sciatic block", region: "lower", page: "", also: "foot ankle" },
    { name: "Subgluteal sciatic block", region: "lower", page: "" },
    { name: "Obturator nerve block", region: "lower", page: "" },
    { name: "Lateral femoral cutaneous nerve block", region: "lower", page: "" },
    { name: "Ankle block", region: "lower", page: "" },
    { name: "Interpectoral and pectoserratus plane blocks (PECS)", region: "chest", page: "", also: "breast" },
    { name: "Serratus anterior plane block", region: "chest", page: "", also: "breast rib fracture" },
    { name: "Erector spinae plane block", region: "chest", page: "", also: "ESP rib fracture" },
    { name: "Thoracic paravertebral block", region: "chest", page: "", also: "breast" },
    { name: "Parasternal intercostal plane blocks", region: "chest", page: "", also: "sternum" },
    { name: "Intercostal nerve block", region: "chest", page: "" },
    { name: "Transversus abdominis plane (TAP) block", region: "abdo", page: "" },
    { name: "Subcostal TAP block", region: "abdo", page: "" },
    { name: "Rectus sheath block", region: "abdo", page: "" },
    { name: "Quadratus lumborum block", region: "abdo", page: "" },
    { name: "Ilioinguinal and iliohypogastric block", region: "abdo", page: "", also: "hernia" },
    { name: "Spinal anaesthesia", region: "axial", page: "" },
    { name: "Lumbar epidural", region: "axial", page: "" },
    { name: "Thoracic epidural", region: "axial", page: "" },
    { name: "Combined spinal-epidural", region: "axial", page: "", also: "CSE" },
    { name: "Neuraxial ultrasound", region: "axial", page: "" },
    { name: "Superficial cervical plexus block", region: "head", page: "", also: "carotid clavicle" },
    { name: "Sub-Tenon's block", region: "head", page: "", also: "eye ophthalmic" },
    { name: "Peribulbar block", region: "head", page: "", also: "eye ophthalmic" },
    { name: "Scalp block", region: "head", page: "" },
    { name: "Greater occipital nerve block", region: "head", page: "" }
  ]
};

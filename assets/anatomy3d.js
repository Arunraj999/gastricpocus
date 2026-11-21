import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { createSkin } from './a3skin.js?v=65';
const BASE='media/model3d/';
const $=s=>document.querySelector(s);
const stage=$('#a3-stage'), panel=$('#a3-info'), legend=$('#a3-legend'), labelsEl=$('#a3-labels');
const Q=new URLSearchParams(location.search);
const SK={"V":"#E2B58F","C2":"#C99B6B","C3":"#0E6B3A","C4":"#58B56B","C5":"#1F8A4C","C6":"#9AD98A","C7":"#12806F","C8":"#C4EBB0","T1":"#6E4B14","T2":"#D9A235","T3":"#9C6B12","T4":"#F0C766","T5":"#B07D18","T6":"#F5D58A","T7":"#BE8B24","T8":"#F7DFA2","T9":"#C99A33","T10":"#FAE8B8","T11":"#D2A640","T12":"#FCF0CC","L1":"#14267F","L2":"#6C8FE8","L3":"#2B45A8","L4":"#A9C0F5","L5":"#4A6BD0","S1":"#C8402A","S2":"#F3A08A","S3":"#8E2A1C","S4-5":"#E8C1B6","X":"#CFC8BC"};
const MAPS={eb:{label:'Evidence-based',src:'Evidence-based map: drawn on the NORA² model after Lee MWL, McPhee RW, Stringer MD. An evidence-based approach to human dermatomes. Clin Anat 2008;21:363–373. Coloured areas are the most consistent tactile area of each root; the neutral tone marks the areas that paper leaves blank for major variability and overlap. Key sensory points: ISNCSCI, revised 2019.'},
 std:{label:'ASIA / ISNCSCI',src:'ASIA/ISNCSCI map: drawn on the NORA² model to the key sensory points and outlines of the International Standards for Neurological Classification of Spinal Cord Injury worksheet (ASIA and ISCoS, revised 2019). The worksheet does not chart the back of the trunk; those borders follow the vertebral levels.'}};
const DCOL={V:'#9AA7B8',C2:'#C9B6F2',C3:'#8E6CD9',C4:'#5567D8',C5:'#E5484D',C6:'#F58A1F',C7:'#F6CF2B',C8:'#7CB83F',T1:'#0E9F8E',T2:'#35C6E0',
 T3:'#2A7DE1',T4:'#9AD0F5',T5:'#3D4FB8',T6:'#35C6E0',T7:'#2A7DE1',T8:'#9AD0F5',T9:'#3D4FB8',T10:'#35C6E0',T11:'#2A7DE1',T12:'#9AD0F5',
 L1:'#F28BB3',L2:'#D43D78',L3:'#FF7A4D',L4:'#F6B92B',L5:'#9BCB5A',S1:'#1FA898',S2:'#5C6BD6',S3:'#A855C7',"S4-5":'#7A5A46',XI:'#8FA0B8',T:'#6FA8DC',DR:'#7D8AA3'};
const KEY={C2:'At least 1 cm lateral to the occipital protuberance',C3:'Supraclavicular fossa, in the midclavicular line',C4:'Over the acromioclavicular joint',C5:'Lateral side of the antecubital fossa',C6:'Dorsal surface of the proximal phalanx of the thumb',C7:'Dorsal surface of the proximal phalanx of the middle finger',C8:'Dorsal surface of the proximal phalanx of the little finger',T1:'Medial side of the antecubital fossa',T2:'Apex of the axilla',T3:'Third intercostal space, midclavicular line',T4:'Fourth intercostal space (nipple line)',T5:'Fifth intercostal space',T6:'Level of the xiphisternum',T7:'Seventh intercostal space',T8:'Eighth intercostal space',T9:'Ninth intercostal space',T10:'Level of the umbilicus',T11:'Eleventh intercostal space',T12:'Midpoint of the inguinal ligament',L1:'Midway between the T12 and L2 key points',L2:'Mid-anterior thigh',L3:'Medial femoral condyle',L4:'Medial malleolus',L5:'Dorsum of the foot at the third metatarsophalangeal joint',S1:'Lateral heel',S2:'Midline of the popliteal fossa',S3:'Ischial tuberosity',"S4-5":'Perianal area',V:'Trigeminal nerve (cranial nerve V), not a spinal dermatome'};
const JOINT={
 gh:['Shoulder (glenohumeral) joint',[['Suprascapular nerve','core','posterior capsule, 16/16 shoulders'],['Axillary nerve','core','posterior and inferior capsule, 16/16'],['Lateral pectoral nerve','frequent','anterior capsule; articular branch in 67% (29/43)'],['Subscapular nerves','variable','anterior capsule']],'Eckmann 2017; Nam 2016; Laumonerie 2020; Aly 2021'],
 ac:['Acromioclavicular joint',[['Suprascapular nerve','core','25/25'],['Lateral pectoral nerve','core','25/25'],['Supraclavicular nerves','frequent','']],'Aszmann 1996; Leurcharusmee 2021'],
 sc:['Sternoclavicular joint',[['Medial supraclavicular nerve','core','12/12'],['Lateral pectoral nerve','frequent','7/12']],'Emura 2025'],
 clav:['Clavicle (bone)',[['Supraclavicular nerves','core','superior and anterior surfaces, whole length'],['Nerve to subclavius','core','inferior and posterior, medial two-thirds'],['Lateral pectoral nerve','core','inferior, lateral two-thirds']],'Leurcharusmee 2021'],
 elbow:['Elbow joint',[['Musculocutaneous nerve','core','anterior capsule, 10/13'],['Radial nerve','core','anterolateral and posterolateral capsule; nerve to anconeus 100%'],['Ulnar nerve','core','posteromedial capsule'],['Median nerve','variable','anterior capsule, minor'],['Medial and posterior antebrachial cutaneous nerves','frequent','epicondylar areas, 100% and 83%']],'Nourbakhsh 2016; De Kesel 2012; Laumonerie 2020; Arnold 2026'],
 wrist:['Wrist (radiocarpal) joint',[['Posterior interosseous nerve','core','14/14'],['Lateral antebrachial cutaneous nerve','core','14/14'],['Palmar cutaneous branch of median nerve','frequent','10/14'],['Superficial branch of radial nerve','variable','5/14'],['Deep branch of ulnar nerve','core','palmar intercarpal and carpometacarpal joints']],'Tran 2022; Fukumoto 1993; Van de Pol 2006'],
 druj:['Distal radioulnar joint',[['Anterior interosseous nerve','core','14/14'],['Posterior interosseous nerve','frequent','9/14']],'Tran 2022; Hohenberger 2017'],
 cmc1:['Thumb carpometacarpal joint',[['Superficial branch of radial nerve','core','58% to 100% by study'],['Thenar branch of median nerve','core','9/10; 47%'],['Deep (motor) branch of ulnar nerve','frequent','47%'],['Lateral antebrachial cutaneous nerve','frequent',''],['Palmar cutaneous branch of median nerve','frequent','']],'Tran 2024; Miki 2011; Lorea 2002'],
 mcp:['Metacarpophalangeal joints',[['Palmar digital nerves','core',''],['Dorsal digital nerves','core',''],['Deep branch of ulnar nerve','frequent','']],'Gandolfi 2021'],
 pip:['Proximal interphalangeal joints',[['Proper palmar digital nerves','core','one branch each side'],['Dorsal branches','variable','little finger only']],'Pastrana 2019; Gandolfi 2021'],
 dip:['Distal interphalangeal joints',[['Proper palmar digital nerves','core','no dorsal branches found']],'Gandolfi 2021'],
 hip:['Hip joint',[['Femoral nerve','core','anterior capsule'],['Obturator nerve','core','anterior capsule, inferomedial'],['Accessory obturator nerve','frequent','85% where the nerve exists'],['Nerve to quadratus femoris','core','posterior capsule, 15/18'],['Superior gluteal nerve','variable','6/18'],['Sciatic nerve','variable','1/16']],'Short 2018; Tomlinson 2021; Nagpal 2021; Birnbaum 1997'],
 knee:['Knee joint',[['Nerves to vastus medialis, intermedius and lateralis','core','anterior capsule'],['Superior and inferior genicular nerves','core','anterior capsule'],['Tibial nerve','core','whole posterior capsule'],['Posterior division of obturator nerve','frequent','superomedial posterior capsule'],['Common fibular nerve','frequent','lateral and superolateral'],['Infrapatellar branch of saphenous nerve','variable','']],'Tran 2018; Tran 2019; Fonkoué 2019; Roberts 2020 (12 to 13 nerves in all)'],
 patella:['Patella',[['Superomedial and superolateral patellar nerves','core',''],['Infrapatellar branch of saphenous nerve','frequent','histologically confirmed']],'Maralcan 2005; Suresh 2025'],
 dfem:['Distal femur (bone)',[['Periosteal nerves entering the nutrient foramina','core','71.1% of anterior foramina in the medial half; from the nerves to vastus intermedius and the genicular nerves']],'Tran 2025'],
 ptfj:['Proximal tibiofibular joint',[['Common fibular nerve, articular branch','core','']],'de Sèze 2005'],
 ankle:['Ankle joint',[['Deep fibular nerve','core','anterior'],['Saphenous nerve','core','anterior and medial'],['Tibial nerve','core','medial and posterior'],['Sural nerve','core','lateral'],['Superficial fibular nerve','variable','highly variable']],'Han 2021; Hohenberger 2025'],
 mmal:['Medial malleolus (periosteum)',[['Saphenous nerve','core','5/5 limbs, histology']],'Clendenen 2013'],
 sinus:['Sinus tarsi',[['Deep fibular nerve, lateral terminal branch','core','']],'Rab 2001'],
 sij:['Sacroiliac joint',[['Posterior sacral network: L5 posterior ramus and sacral lateral branches','core','L5 in all specimens'],['L4 posterior ramus','frequent','68.75%'],['L5 anterior ramus','core','anterior joint, 80%'],['L4 anterior ramus','variable','10%']],'Zhu 2021; Roberts 2014; Cox 2017'],
 cfacet:['Cervical facet joints',[['Medial branches of posterior rami','core',''],['Direct branches from the posterior root region','variable','']],'Büsken 2022'],
 tfacet:['Thoracic facet joints',[['Posterior ramus, articular branches','core','origin varies side to side']],'Joshi 2019']};
const DIG=['','thumb','index finger','middle finger','ring finger','little finger'],TOE=['','great toe','second toe','third toe','fourth toe','little toe'],PH=['','proximal phalanx','middle phalanx','distal phalanx (tip)'];
let SKIN,MAP=MAPS[Q.get('map')]?Q.get('map'):'eb';let M,scene,camera,renderer,controls,skin,mus,bone,joints=[],mode=Q.get('mode')||'derm',sel=null,att,autoRot=Q.get('spin')!=='0'&&!Q.get('view');
let showOv=Q.get('ov')==='1';const WHITE=new THREE.Color('#ffffff');const ray=new THREE.Raycaster(), col=new THREE.Color(), col2=new THREE.Color();
async function buf(n,T){const r=await fetch(BASE+n+'?v=34');return new T(await r.arrayBuffer());}
function nervePalette(n){const a=[];for(let i=0;i<n;i++){const c=new THREE.Color().setHSL((i*0.61803)%1,0.62,0.56);a.push('#'+c.getHexString());}return a;}
let NCOL;
function geom(pos,idx){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();return g;}
function paintSkin(){SKIN.paint(M.DN.map(n=>n?SK[n]:null),sel&&sel.kind==='skin'?sel.id:null);SKIN.U.uSoft.value=showOv?0.42:0;}
function paintMus(){const pid=mus.userData.pid,c=mus.geometry.attributes.color.array;
  for(let i=0;i<pid.length;i++){const r=M.mrow[pid[i]]; col.set(r<0?'#8A6F6F':DCOL[M.MT[r][0]]||'#B56A6A');
    if(sel&&sel.kind==='mus'&&M.mrow[pid[i]]!==sel.row){const g=(col.r+col.g+col.b)/3;col.setRGB(g*0.5+0.14,g*0.5+0.13,g*0.5+0.15);}
    c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;} mus.geometry.attributes.color.needsUpdate=true;}
function paintBone(){const a=bone.userData.att,c=bone.geometry.attributes.color.array,on=mode==='bone';for(let i=0;i<a.length;i++){col.set(on?M.BT[a[i]][2]:'#CFC6B4');if(on&&sel&&sel.kind==='bone'&&a[i]!==sel.id){const g=(col.r+col.g+col.b)/3;col.setRGB(g*0.5+0.16,g*0.5+0.16,g*0.5+0.18);}c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;}bone.geometry.attributes.color.needsUpdate=true;}
function setMode(m){mode=m;sel=null;
  document.querySelectorAll('[data-a3mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a3mode===m));
  skin.visible=(m==='derm'||m==='nerve'); mus.visible=(m==='myo'); bone.visible=(m==='myo'||m==='bone'); joints.forEach(j=>j.visible=(m==='bone'));
  paintBone();
  if(skin.visible)paintSkin(); if(mus.visible)paintMus(); drawLegend(); buildLabels(); info(null); showSrc();}
function showSrc(){const el=$('#a3-source'),mb=$('#a3-maps');if(mb)mb.style.display=mode==='derm'?'':'none';if(el)el.textContent=mode==='derm'?MAPS[MAP].src:'';}
async function setMap(k){if(!MAPS[k])return;MAP=k;document.querySelectorAll('[data-a3map]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a3map===k));$('#a3-source').textContent='Loading map…';await SKIN.setMap(k);sel=null;paintSkin();drawLegend();buildLabels();info(null);showSrc();}
function chip(t,c){return `<span class="a3-chip" style="--c:${c}">${t}</span>`;}
function drawLegend(){let h='';
  if(mode==='derm')h=M.DN.slice(1).filter(n=>n!=='X').map(n=>chip(n==='V'?'CN V':n,SK[n])).join('')+(MAP==='eb'?chip('Variable, overlapping',SK.X):'');
  else if(mode==='myo')h=['C4','C5','C6','C7','C8','T1','L2','L3','L4','L5','S1','S2'].map(n=>chip(n,DCOL[n])).join('')+chip('Accessory (XI)',DCOL.XI)+chip('Intercostal, segmental',DCOL.T)+chip('Posterior rami',DCOL.DR);
  else if(mode==='bone')h=M.BT.slice(1).map(t=>chip(t[0],t[2])).join('')+chip('White marker: joint with reviewed nerve supply','#ffffff');
  else h='<span class="a3-hint">Each colour is one cutaneous nerve. Select the skin to name it.</span>';
  legend.innerHTML=h;}
function where(v){const b7=att[v*4+1],b8=att[v*4+2],reg=M.REG[b7&15],side=(b7>>4&1)?'Left':'Right',pal=b7>>5&1,pl=b7>>6&1,r=b8&7,ph=b8>>3&3;
  if(reg==='digit')return `${side} ${DIG[r]}, ${PH[ph]}, ${pal?'palmar':'dorsal'} surface`;
  if(reg==='hand')return `${side} hand, ${pal?'palm':'dorsum'}${r?', in line with the '+DIG[r]:''}`;
  if(reg==='toe')return `${side} ${TOE[r]}, ${pl?'plantar':'dorsal'} surface`;
  if(reg==='foot')return `${side} foot, ${pl?'sole':'dorsum or border'}`;
  if(reg==='head'||reg==='neck'||reg==='trunk')return reg[0].toUpperCase()+reg.slice(1)+', '+side.toLowerCase()+' side';
  return `${side} ${({arm:'upper arm',forearm:'forearm',thigh:'thigh',leg:'leg'})[reg]}`;}
function extra(v){const b7=att[v*4+1],b8=att[v*4+2],reg=M.REG[b7&15],r=b8&7;
  if(reg==='digit'&&r===2)return 'Published maps place the index finger in C6 or C7. Treat it as shared between the two.';
  if(reg==='digit'&&r===4)return 'The ring finger is shared: C7 and C8 by root, median and ulnar nerves by nerve, split along its midline.';
  if(reg==='digit'&&r===1)return 'The dorsal surface of the proximal phalanx is the C6 key sensory point.';
  if(reg==='toe'&&r===4)return 'The fourth toe lies on the L5 and S1 border.';return '';}
function info(h){
  if(!h){panel.innerHTML=`<p class="a3-hint">${({derm:'Select any point on the skin to see its spinal root (dermatome) and the nerve that supplies it.',nerve:'Select any point on the skin to see the cutaneous nerve and the root level.',myo:'Select a muscle to see its root supply, nerve and action.',bone:'Bones are coloured by the nerve that supplies them. Select any bone for the nerve and its roots, or a white marker for the full nerve supply of that joint.'})[mode]}</p>`;return;}
  panel.innerHTML=h;}
function skinInfo(h){const v=h.v,d=M.DN[h.cls],d2=h.second?M.DN[h.second]:'',ni=att[v*4],n=M.NN[ni];
  if(d==='X'){info(`<p class="a3-where">${where(v)}</p><h3>${chip('Variable, overlapping',SK.X)}</h3><p class="a3-ov">No single root supplies this skin consistently. The evidence-based map leaves it blank because overlap and variation between people are the rule here${d2&&d2!=='X'?'; the nearest consistent area is '+chip(d2,SK[d2]):''}.</p><h3>${chip(n,NCOL[ni])}</h3><p class="a3-ov"><small>nerve that carries sensation from this spot</small></p><p class="a3-note">Switch to the ASIA / ISNCSCI map to see the conventional root label for this area.</p><p class="a3-src">Lee, McPhee, Stringer. Clin Anat 2008;21:363–373.</p>`);return;}
  const nm=x=>x==='V'?'Trigeminal nerve (cranial nerve V)':x; const ex=extra(v);
  info(`<p class="a3-where">${where(v)}</p>
  <h3>${chip(nm(d),SK[d])} <small>dermatome</small></h3>
  ${d2&&h.margin<0.45?`<p class="a3-ov">Border zone with ${chip(nm(d2),SK[d2])}. Adjacent dermatomes share skin, so a single root block or lesion rarely leaves this area numb.</p>`:`<p class="a3-ov">Core zone of ${nm(d)}.</p>`}
  <p><b>Key sensory point:</b> ${KEY[d]||''}</p>
  <h3>${chip(n,NCOL[ni])}</h3><p class="a3-ov"><small>nerve that carries sensation from this spot</small></p>
  ${(SKIN.nerves[h.cls]||[]).length>1?`<p><b>Nerves that carry ${nm(d)} fibres to the skin:</b></p><ul class="a3-nl">${SKIN.nerves[h.cls].map(k=>`<li>${M.NN[k]}</li>`).join('')}</ul>`:''}
  ${ex?`<p class="a3-note">${ex}</p>`:''}
  <p class="a3-src">${MAP==='eb'?'Dermatome: Lee, McPhee, Stringer. Clin Anat 2008;21:363–373.':'Dermatome: ISNCSCI worksheet, ASIA and ISCoS, revised 2019.'} Nerve fields are typical; they vary between people (Keplinger 2018).</p>`);}
function musInfo(p){const r=M.mrow[p],name=M.muscles[p];const t=r<0?null:M.MT[r];
  info(`<p class="a3-where">${name[0].toUpperCase()+name.slice(1)}</p>`+(t?`<h3>${chip(t[0]==='XI'?'Accessory nerve':t[0]==='T'?'Thoracic, segmental':t[0]==='DR'?'Segmental':t[0],DCOL[t[0]])} <small>main root</small></h3>
  <p><b>All roots:</b> ${t[1]}</p><p><b>Nerve:</b> ${t[2]}</p><p><b>Action:</b> ${t[3]}</p>
  <p class="a3-src">${t[4]==='R'?'Root values from nerve root stimulation, lesion and EMG studies in the NORA² review (Schirmer 2011; Bell 2016; Furukawa 2021; Chiba 2015; Zhu 2015; Hashimoto 2024) and the international key muscles.':'Standard anatomical root values. Not yet checked against primary studies in the NORA² review.'} Every muscle receives more than one root.</p>`:'<p>Root supply not classified.</p>'));}
function jointInfo(k){const j=JOINT[k];info(`<p class="a3-where">${j[0]}</p><table class="a3-t">${j[1].map(r=>`<tr><td><span class="a3-lv a3-${r[1]}">${r[1]}</span></td><td><b>${r[0]}</b>${r[2]?'<br><small>'+r[2]+'</small>':''}</td></tr>`).join('')}</table><p class="a3-src">${j[2]}</p>`);}
function boneInfo(p,vi){const n=M.bones[p],t=M.BT[bone.userData.att[vi]];info(`<p class="a3-where">${n[0].toUpperCase()+n.slice(1)}</p>`+(t[1]?`<h3>${chip(t[0],t[2])}</h3><p><b>Roots:</b> ${t[1]}</p><p><b>Bone territory of this nerve:</b> ${t[3]}.</p><p class="a3-ov">Periosteum also receives fibres from the nerves to the attached muscles and, where the bone is subcutaneous, from the overlying cutaneous nerve, so territories overlap at their borders.</p><p class="a3-src">Standard osteotome chart used in regional anaesthesia. Human dissection evidence for bone shafts is limited (Ivanusic 2007; Tran 2025; Sonawane 2026). Select a white marker for the reviewed nerve supply of each joint.</p>`:'<p>Not assigned.</p>'));}
function pick(ev){const r=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);ray.setFromCamera(p,camera);
  if(mode==='bone'){const hj=ray.intersectObjects(joints)[0];if(hj){sel={kind:'joint'};paintBone();joints.forEach(j=>j.material.opacity=j===hj.object?0.95:0.45);jointInfo(hj.object.userData.k);return;}
    const hb=ray.intersectObject(bone)[0];if(hb){sel={kind:'bone',id:bone.userData.att[hb.face.a]};joints.forEach(j=>j.material.opacity=0.6);paintBone();boneInfo(bone.userData.pid[hb.face.a],hb.face.a);}else{sel=null;paintBone();info(null);}return;}
  if(mode==='myo'){const h=ray.intersectObject(mus)[0];if(!h){sel=null;paintMus();info(null);return;}const p=mus.userData.pid[h.face.a];sel={kind:'mus',row:M.mrow[p]};paintMus();musInfo(p);return;}
  const h=ray.intersectObject(skin)[0];if(!h){sel=null;paintSkin();info(null);return;}
  const hi=SKIN.hit(h);sel={kind:'skin',id:hi.cls};paintSkin();skinInfo(hi);}
/* labels for dermatome and myotome views */
let LAB=[];
function buildLabels(){LAB=[];labelsEl.innerHTML='';if(mode!=='derm'||!SKIN.lab)return;
  for(const l of SKIN.lab){const el=document.createElement('span');el.textContent=l.t;el.style.background='transparent';el.style.color='#0B1020';el.style.textShadow='0 0 3px #fff,0 0 3px #fff,0 0 2px #fff';
    const tr=/^(T([2-9]|1[0-2])|C[34]|L1)$/.test(l.t);if(tr){el.style.fontSize='9px';el.style.padding='1px 3px';}labelsEl.appendChild(el);
    LAB.push({el,tr,off:tr&&/^T/.test(l.t)?((+l.t.slice(1))%2?-12:12):0,face:l.f,p:new THREE.Vector3(l.p[0],l.p[1],l.p[2]).applyMatrix4(skin.matrixWorld)});}}
function placeLabels(){if(!LAB.length)return;const dir=new THREE.Vector3();camera.getWorldDirection(dir);const w=stage.clientWidth,h=stage.clientHeight,show=$('#a3-lab').getAttribute('aria-pressed')==='true';
  const used=[];for(const L of LAB){const front=dir.z<-0.5?'F':dir.z>0.5?'B':null;const v=L.p.clone().project(camera);let ok=show&&front===L.face&&v.z<1;const sx=(v.x+1)/2*w,sy=(1-v.y)/2*h;if(ok&&!L.tr){for(const u of used){if(Math.abs(u[0]-sx)<20&&Math.abs(u[1]-sy)<8){ok=false;break;}}if(ok)used.push([sx,sy]);}L.el.style.display=ok?'':'none';if(ok){L.el.style.left=((v.x+1)/2*w+L.off)+'px';L.el.style.top=((1-v.y)/2*h)+'px';}}}
function view(v,zoom){const d=({front:[0,0,1],back:[0,0,-1],right:[-1,0,0],left:[1,0,0]})[v];const t=controls.target;const dist=zoom||3550;camera.position.set(t.x+d[0]*dist,t.y+d[1]*dist,t.z+d[2]*dist);controls.update();}
async function init(){
  M=await (await fetch(BASE+'model.json?v=34')).json(); NCOL=nervePalette(M.NN.length); if(!M.DN.includes('X'))M.DN.push('X');
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.appendChild(renderer.domElement);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(30,1,50,12000);
  scene.add(new THREE.HemisphereLight(0xffffff,0x33405e,1.25));const dl=new THREE.DirectionalLight(0xffffff,1.6);dl.position.set(600,900,1500);camera.add(dl);scene.add(camera);
  const root=new THREE.Group();root.rotation.x=-Math.PI/2;scene.add(root); /* model: z up, front -y */
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,815,0);controls.minDistance=300;controls.maxDistance=5200;controls.autoRotateSpeed=1.1;
  $('#a3-load').textContent='Loading skin…';
  SKIN=await createSkin(root);skin=SKIN.mesh;att=SKIN.att;await SKIN.setMap(MAP);
  $('#a3-load').textContent='Loading bones and muscles…';
  const [bp,bi,bpid,batt,mp,mi,mpid]=await Promise.all([buf('bone_pos.wasm',Float32Array),buf('bone_idx.wasm',Uint32Array),buf('bone_pid.wasm',Uint16Array),buf('bone_att.wasm',Uint8Array),buf('mus_pos.wasm',Float32Array),buf('mus_idx.wasm',Uint32Array),buf('mus_pid.wasm',Uint16Array)]);
  const bg=geom(bp,bi);bg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(bp.length),3));bone=new THREE.Mesh(bg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.6}));bone.userData.pid=bpid;bone.userData.att=batt;root.add(bone);
  const mg=geom(mp,mi);mg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(mp.length),3));mus=new THREE.Mesh(mg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.5,metalness:0.03}));mus.userData.pid=mpid;root.add(mus);
  for(const j of M.joints){const s=new THREE.Mesh(new THREE.SphereGeometry(j.r,20,14),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.6,depthTest:false}));s.position.set(j.p[0],j.p[1],j.p[2]);s.userData.k=j.k;s.renderOrder=5;root.add(s);joints.push(s);}
  root.updateMatrixWorld(true);$('#a3-load').remove();
  const rs=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(rs).observe(stage);rs();
  view(Q.get('view')||'front',+Q.get('zoom')||0); if(Q.get('ty'))controls.target.y=+Q.get('ty'),view(Q.get('view')||'front',+Q.get('zoom')||0); if(Q.get('tx')){controls.target.x=+Q.get('tx');view(Q.get('view')||'front',+Q.get('zoom')||0);}
  setMode(mode);
  let down=null;renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];autoRot=false;$('#a3-spin').setAttribute('aria-pressed','false');});
  renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5)pick(e);down=null;});
  document.querySelectorAll('[data-a3mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.a3mode));
  document.querySelectorAll('[data-a3map]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.a3map===MAP);b.onclick=()=>setMap(b.dataset.a3map);});
  document.querySelectorAll('[data-a3view]').forEach(b=>b.onclick=()=>{autoRot=false;$('#a3-spin').setAttribute('aria-pressed','false');view(b.dataset.a3view);});
  $('#a3-spin').onclick=e=>{autoRot=!autoRot;e.currentTarget.setAttribute('aria-pressed',autoRot);};$('#a3-spin').setAttribute('aria-pressed',autoRot);
  $('#a3-ov').onclick=e=>{showOv=!showOv;e.currentTarget.setAttribute('aria-pressed',showOv);if(skin.visible)paintSkin();};$('#a3-ov').setAttribute('aria-pressed',showOv);$('#a3-lab').onclick=e=>{const b=e.currentTarget;b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');};
  (function loop(){controls.autoRotate=autoRot;controls.update();renderer.render(scene,camera);placeLabels();requestAnimationFrame(loop);})();
  window.__a3ready=true;
}
init().catch(e=>{$('#a3-load').textContent='The 3D model could not be loaded: '+e.message;});

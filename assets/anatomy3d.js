import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';
const BASE='media/model3d/';
const $=s=>document.querySelector(s);
const stage=$('#a3-stage'), panel=$('#a3-info'), legend=$('#a3-legend'), labelsEl=$('#a3-labels');
const Q=new URLSearchParams(location.search);
const SK={"V": "#E2B58F", "C2": "#D9A877", "C3": "#1F7A35", "C4": "#2C8C3F", "C5": "#3F9E4B", "C6": "#55AF58", "C7": "#74C06C", "C8": "#97CF86", "T1": "#8C6A2C", "T2": "#B37F22", "T3": "#BA8930", "T4": "#C0933E", "T5": "#C79D4D", "T6": "#CEA75B", "T7": "#D4B069", "T8": "#DBBA77", "T9": "#E2C485", "T10": "#E9CE94", "T11": "#EFD8A2", "T12": "#F6E2B0", "L1": "#24389E", "L2": "#2F49B4", "L3": "#3F5CC4", "L4": "#5674D0", "L5": "#7C95DD", "S1": "#E0502F", "S2": "#EE8E73", "S3": "#D4674E", "S4-5": "#A9503F"};
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
const AS=14;let lineD,lineC;let M,scene,camera,renderer,controls,skin,mus,bone,joints=[],mode=Q.get('mode')||'derm',sel=null,att,autoRot=Q.get('spin')!=='0'&&!Q.get('view');
let showOv=Q.get('ov')==='1';const WHITE=new THREE.Color('#ffffff');const ray=new THREE.Raycaster(), col=new THREE.Color(), col2=new THREE.Color();
async function buf(n,T){const r=await fetch(BASE+n+'?v=34');return new T(await r.arrayBuffer());}
function nervePalette(n){const a=[];for(let i=0;i<n;i++){const c=new THREE.Color().setHSL((i*0.61803)%1,0.62,0.56);a.push('#'+c.getHexString());}return a;}
let NCOL;
function geom(pos,idx){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();return g;}
function paintSkin(){
  const n=att.length/AS, c=skin.geometry.attributes.color.array, useD=mode!=='nerve';
  for(let i=0;i<n;i++){const o=i*AS; const a=useD?att[o]:att[o+3], b=useD?att[o+1]:att[o+4], w=(useD?att[o+2]:att[o+5])/255*0.5;
    col.set(useD?SK[M.DN[a]]:NCOL[a]); const dd=(useD?att[o+8]:att[o+9])/10; if(showOv&&b&&w>0){col2.set(useD?SK[M.DN[b]]:NCOL[b]);col.lerp(col2,w);}else{const e=useD?att[o+10]:att[o+12],ew=(useD?att[o+11]:att[o+13])/255*0.5;if(e&&ew>0){col2.set(useD?SK[M.DN[e]]:NCOL[e]);col.lerp(col2,ew);col.multiplyScalar(1-0.32*ew*2*ew*2);}}
    if(sel&&sel.kind==='skin'){const hit=(a===sel.id)||(b===sel.id&&w>0.12); if(!hit){const g=(col.r+col.g+col.b)/3; col.setRGB(g*0.55+0.12,g*0.55+0.13,g*0.55+0.17);} }
    c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;}
  skin.geometry.attributes.color.needsUpdate=true;
}
function paintMus(){const pid=mus.userData.pid,c=mus.geometry.attributes.color.array;
  for(let i=0;i<pid.length;i++){const r=M.mrow[pid[i]]; col.set(r<0?'#8A6F6F':DCOL[M.MT[r][0]]||'#B56A6A');
    if(sel&&sel.kind==='mus'&&M.mrow[pid[i]]!==sel.row){const g=(col.r+col.g+col.b)/3;col.setRGB(g*0.5+0.14,g*0.5+0.13,g*0.5+0.15);}
    c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;} mus.geometry.attributes.color.needsUpdate=true;}
function paintBone(){const a=bone.userData.att,c=bone.geometry.attributes.color.array,on=mode==='bone';for(let i=0;i<a.length;i++){col.set(on?M.BT[a[i]][2]:'#CFC6B4');if(on&&sel&&sel.kind==='bone'&&a[i]!==sel.id){const g=(col.r+col.g+col.b)/3;col.setRGB(g*0.5+0.16,g*0.5+0.16,g*0.5+0.18);}c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;}bone.geometry.attributes.color.needsUpdate=true;}
function setMode(m){mode=m;sel=null;
  document.querySelectorAll('[data-a3mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a3mode===m));
  skin.visible=(m==='derm'||m==='nerve');lineD.visible=false;lineC.visible=false; mus.visible=(m==='myo'); bone.visible=(m==='myo'||m==='bone'); joints.forEach(j=>j.visible=(m==='bone'));
  paintBone();
  if(skin.visible)paintSkin(); if(mus.visible)paintMus(); drawLegend(); buildLabels(); info(null);}
function chip(t,c){return `<span class="a3-chip" style="--c:${c}">${t}</span>`;}
function drawLegend(){let h='';
  if(mode==='derm')h=M.DN.slice(1).map(n=>chip(n==='V'?'CN V':n,SK[n])).join('');
  else if(mode==='myo')h=['C4','C5','C6','C7','C8','T1','L2','L3','L4','L5','S1','S2'].map(n=>chip(n,DCOL[n])).join('')+chip('Accessory (XI)',DCOL.XI)+chip('Intercostal, segmental',DCOL.T)+chip('Posterior rami',DCOL.DR);
  else if(mode==='bone')h=M.BT.slice(1).map(t=>chip(t[0],t[2])).join('')+chip('White marker: joint with reviewed nerve supply','#ffffff');
  else h='<span class="a3-hint">Each colour is one cutaneous nerve. Select the skin to name it.</span>';
  legend.innerHTML=h;}
function where(o){const b7=att[o+6],b8=att[o+7],reg=M.REG[b7&15],side=(b7>>4&1)?'Left':'Right',pal=b7>>5&1,pl=b7>>6&1,r=b8&7,ph=b8>>3&3;
  if(reg==='digit')return `${side} ${DIG[r]}, ${PH[ph]}, ${pal?'palmar':'dorsal'} surface`;
  if(reg==='hand')return `${side} hand, ${pal?'palm':'dorsum'}${r?', in line with the '+DIG[r]:''}`;
  if(reg==='toe')return `${side} ${TOE[r]}, ${pl?'plantar':'dorsal'} surface`;
  if(reg==='foot')return `${side} foot, ${pl?'sole':'dorsum or border'}`;
  if(reg==='head'||reg==='neck'||reg==='trunk')return reg[0].toUpperCase()+reg.slice(1)+', '+side.toLowerCase()+' side';
  return `${side} ${({arm:'upper arm',forearm:'forearm',thigh:'thigh',leg:'leg'})[reg]}`;}
function extra(o){const b7=att[o+6],b8=att[o+7],reg=M.REG[b7&15],r=b8&7;
  if(reg==='digit'&&r===2)return 'Published maps place the index finger in C6 or C7. Treat it as shared between the two.';
  if(reg==='digit'&&r===4)return 'The ring finger is shared: C7 and C8 by root, median and ulnar nerves by nerve, split along its midline.';
  if(reg==='digit'&&r===1)return 'The dorsal surface of the proximal phalanx is the C6 key sensory point.';
  if(reg==='toe'&&r===4)return 'The fourth toe lies on the L5 and S1 border.';return '';}
function info(h){
  if(!h){panel.innerHTML=`<p class="a3-hint">${({derm:'Select any point on the skin to see its spinal root (dermatome) and the nerve that supplies it.',nerve:'Select any point on the skin to see the cutaneous nerve and the root level.',myo:'Select a muscle to see its root supply, nerve and action.',bone:'Bones are coloured by the nerve that supplies them. Select any bone for the nerve and its roots, or a white marker for the full nerve supply of that joint.'})[mode]}</p>`;return;}
  panel.innerHTML=h;}
function skinInfo(vi){const o=vi*AS,d=M.DN[att[o]],d2=att[o+1]?M.DN[att[o+1]]:'',dw=att[o+2]/255*0.5,n=M.NN[att[o+3]],n2=att[o+4]?M.NN[att[o+4]]:'',nw=att[o+5]/255*0.5;
  const nm=x=>x==='V'?'Trigeminal nerve (cranial nerve V)':x; const ex=extra(o);
  info(`<p class="a3-where">${where(o)}</p>
  <h3>${chip(nm(d),SK[d])} <small>dermatome</small></h3>
  ${d2&&dw>0.06?`<p class="a3-ov">Overlap zone: also ${chip(nm(d2),SK[d2])}. Adjacent dermatomes share skin, so a single root block or lesion rarely leaves this area numb.</p>`:`<p class="a3-ov">Core zone of ${nm(d)}.</p>`}
  <p><b>Key sensory point:</b> ${KEY[d]||''}</p>
  <h3>${chip(n,NCOL[att[o+3]])}</h3><p class="a3-ov"><small>nerve that carries sensation from this spot</small>${n2&&nw>0.06?' · border with '+n2:''}</p>
  ${ex?`<p class="a3-note">${ex}</p>`:''}
  <p class="a3-src">Dermatomes: international key sensory points and evidence-based maps (Lee 2008; Downs 2011; Wolff 2001). Nerve fields are typical; they vary between people (Keplinger 2018).</p>`);}
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
  const f=h.face,P=skin.geometry.attributes.position;let best=f.a,bd=1e9;for(const v of [f.a,f.b,f.c]){const d=h.point.distanceToSquared(new THREE.Vector3().fromBufferAttribute(P,v));if(d<bd){bd=d;best=v;}}
  sel={kind:'skin',id:att[best*AS+(mode==='nerve'?3:0)]};paintSkin();skinInfo(best);}
/* labels for dermatome and myotome views */
let LAB=[];
function buildLabels(){LAB=[];labelsEl.innerHTML='';if(mode!=='derm')return;
  const P=skin.geometry.attributes.position.array,N=skin.geometry.attributes.normal.array,n=att.length/AS,acc={};
  for(let i=0;i<n;i+=2){const o=i*AS;if(att[o+8]<60&&att[o+1])continue;const d=att[o],ny=N[i*3+1],face=ny<-0.45?'F':ny>0.45?'B':null;if(!face)continue;const side=P[i*3]<0?'R':'L';
    const k=d+face+side+((att[o+6]&15)>=7?'l':(att[o+6]&15)>=3?'u':'t');(acc[k]=acc[k]||{d,face,side,x:0,y:0,z:0,c:0,pts:[]});const a=acc[k];a.x+=P[i*3];a.y+=P[i*3+1];a.z+=P[i*3+2];a.c++;if(a.c%3===0)a.pts.push(i);}
  const bestK={};for(const k in acc){const a=acc[k],g=a.d+a.face+a.side;if(!bestK[g]||acc[bestK[g]].c<a.c)bestK[g]=k;}
  for(const k in acc){const a=acc[k];if(a.c<45||bestK[a.d+a.face+a.side]!==k)continue;const cx=a.x/a.c,cy=a.y/a.c,cz=a.z/a.c;let bi=-1,by=a.face==='F'?1e9:-1e9;for(const i of a.pts){const dx=P[i*3]-cx,dz=P[i*3+2]-cz;if(dx*dx+dz*dz>18*18)continue;const yy=P[i*3+1];if(a.face==='F'?yy<by:yy>by){by=yy;bi=i;}}if(bi<0)continue;if(a.side==='L'&&/^(T([2-9]|1[0-2])|C[234]|V|L1|S[345].*)$/.test(M.DN[a.d]))continue;if(a.face==='F'&&(M.DN[a.d]==='S3'||M.DN[a.d]==='S4-5'))continue;const el=document.createElement('span');el.textContent=M.DN[a.d]==='V'?'CN V':M.DN[a.d];el.style.background='transparent';el.style.color='#0B1020';el.style.textShadow='0 0 3px #fff,0 0 3px #fff,0 0 2px #fff';const tr=/^(T([2-9]|1[0-2])|C[34]|L1)$/.test(M.DN[a.d]);if(tr){el.style.fontSize='9px';el.style.padding='1px 3px';}labelsEl.appendChild(el);LAB.push({el,tr,off:tr&&/^T/.test(M.DN[a.d])?((+M.DN[a.d].slice(1))%2?-12:12):0,face:a.face,p:new THREE.Vector3(P[bi*3],P[bi*3+1],P[bi*3+2]).applyMatrix4(skin.matrixWorld)});}}
function placeLabels(){if(!LAB.length)return;const dir=new THREE.Vector3();camera.getWorldDirection(dir);const w=stage.clientWidth,h=stage.clientHeight,show=$('#a3-lab').getAttribute('aria-pressed')==='true';
  const used=[];for(const L of LAB){const front=dir.z<-0.5?'F':dir.z>0.5?'B':null;const v=L.p.clone().project(camera);let ok=show&&front===L.face&&v.z<1;const sx=(v.x+1)/2*w,sy=(1-v.y)/2*h;if(ok&&!L.tr){for(const u of used){if(Math.abs(u[0]-sx)<20&&Math.abs(u[1]-sy)<8){ok=false;break;}}if(ok)used.push([sx,sy]);}L.el.style.display=ok?'':'none';if(ok){L.el.style.left=((v.x+1)/2*w+L.off)+'px';L.el.style.top=((1-v.y)/2*h)+'px';}}}
function view(v,zoom){const d=({front:[0,0,1],back:[0,0,-1],right:[-1,0,0],left:[1,0,0]})[v];const t=controls.target;const dist=zoom||3550;camera.position.set(t.x+d[0]*dist,t.y+d[1]*dist,t.z+d[2]*dist);controls.update();}
async function init(){
  M=await (await fetch(BASE+'model.json?v=34')).json(); NCOL=nervePalette(M.NN.length);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.appendChild(renderer.domElement);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(30,1,50,12000);
  scene.add(new THREE.HemisphereLight(0xffffff,0x33405e,1.25));const dl=new THREE.DirectionalLight(0xffffff,1.6);dl.position.set(600,900,1500);camera.add(dl);scene.add(camera);
  const root=new THREE.Group();root.rotation.x=-Math.PI/2;scene.add(root); /* model: z up, front -y */
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,815,0);controls.minDistance=300;controls.maxDistance=5200;controls.autoRotateSpeed=1.1;
  $('#a3-load').textContent='Loading skin…';
  const [sp,si,sa]=await Promise.all([buf('skin_pos.wasm',Float32Array),buf('skin_idx.wasm',Uint32Array),buf('skin_att.wasm',Uint8Array)]);att=sa;
  const sg=geom(sp,si);sg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(sp.length),3));
  skin=new THREE.Mesh(sg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.7,metalness:0,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));root.add(skin);
  const [ld,lc]=await Promise.all([buf('skin_lnd.wasm',Float32Array),buf('skin_lnc.wasm',Float32Array)]);
  const mkL=a=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.6}));root.add(l);return l;};
  lineD=mkL(ld);lineC=mkL(lc);
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
  document.querySelectorAll('[data-a3view]').forEach(b=>b.onclick=()=>{autoRot=false;$('#a3-spin').setAttribute('aria-pressed','false');view(b.dataset.a3view);});
  $('#a3-spin').onclick=e=>{autoRot=!autoRot;e.currentTarget.setAttribute('aria-pressed',autoRot);};$('#a3-spin').setAttribute('aria-pressed',autoRot);
  $('#a3-ov').onclick=e=>{showOv=!showOv;e.currentTarget.setAttribute('aria-pressed',showOv);if(skin.visible)paintSkin();};$('#a3-ov').setAttribute('aria-pressed',showOv);$('#a3-lab').onclick=e=>{const b=e.currentTarget;b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');};
  (function loop(){controls.autoRotate=autoRot;controls.update();renderer.render(scene,camera);placeLabels();requestAnimationFrame(loop);})();
  window.__a3ready=true;
}
init().catch(e=>{$('#a3-load').textContent='The 3D model could not be loaded: '+e.message;});

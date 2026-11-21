/* NORA² 3D movement rig: bones turn rigidly about joint centres taken from the skeleton; muscles follow the bone they lie on,
   blended across each joint; the working muscles glow and swell slightly as they shorten. */
import * as THREE from './vendor/three.module.min.js';
const BASE='media/model3d/', VER='?v=67';
export const MOVES=[
 {id:'elbowflex',root:'C5',name:'Elbow flexion',group:'Elbow flexors',comp:'anterior compartment of the arm',key:'Elbow flexors (biceps brachii, brachialis)',anta:'Elbow extensors: triceps brachii',dof:[['elbow',0,128]],mus:['biceps brachii','\\bbrachialis'],assist:['brachioradialis'],focus:'elbow',tip:'wrist',cam:[-0.86,0.12,0.5,1500]},
 {id:'wristext',root:'C6',name:'Wrist extension',group:'Wrist extensors',comp:'posterior compartment of the forearm',key:'Wrist extensors (extensor carpi radialis longus and brevis)',anta:'Wrist flexors: flexor carpi radialis and ulnaris',dof:[['elbow',88,88],['wrist',-8,58]],mus:['extensor carpi radialis'],assist:['extensor carpi ulnaris'],focus:'wrist',tip:'mcp3',cam:[-0.92,0.2,0.34,1000]},
 {id:'elbowext',root:'C7',name:'Elbow extension',group:'Elbow extensors',comp:'posterior compartment of the arm',key:'Elbow extensors (triceps brachii)',anta:'Elbow flexors: biceps brachii, brachialis',dof:[['elbow',125,0]],mus:['triceps brachii'],assist:['anconeus'],focus:'elbow',tip:'wrist',cam:[-0.86,0.12,0.5,1500]},
 {id:'fingerflex',root:'C8',name:'Finger flexion',group:'Long finger flexors',comp:'anterior compartment of the forearm',key:'Finger flexors (flexor digitorum profundus), tested at the distal phalanx of the middle finger',anta:'Finger extensors: extensor digitorum',dof:[['elbow',88,88],['mcp2',0,62],['pip2',0,88],['dip2',0,58],['mcp3',0,66],['pip3',0,92],['dip3',0,64],['mcp4',0,68],['pip4',0,92],['dip4',0,60],['mcp5',0,70],['pip5',0,88],['dip5',0,58]],mus:['flexor digitorum profundus'],assist:['flexor digitorum superficialis'],ghost:1,focus:'mcp3',tip:'dip3',cam:[-0.92,0.2,0.34,900]},
 {id:'abd5',root:'T1',name:'Little finger abduction',group:'Hypothenar muscles',comp:'intrinsic muscles of the hand',key:'Small finger abductors (abductor digiti minimi)',anta:'Palmar interossei (adduction)',dof:[['elbow',88,88],['abd5',0,30]],mus:['abductor digiti minimi(?!.*foot)'],assist:[],focus:'mcp5',tip:'dip5',cam:[-0.5,0.82,0.3,820]},
 {id:'hipflex',root:'L2',name:'Hip flexion',group:'Hip flexors',comp:'iliopsoas, helped by the anterior thigh',key:'Hip flexors (iliopsoas)',anta:'Hip extensors: gluteus maximus, hamstrings',dof:[['hip',0,84],['knee',0,82]],mus:['iliacus','psoas major'],assist:['rectus femoris','sartorius','pectineus','tensor fasciae latae'],ghost:1,focus:'hip',tip:'knee',cam:[-0.97,0.08,0.22,2500],drop:210},
 {id:'kneeext',root:'L3',name:'Knee extension',group:'Knee extensors',comp:'quadriceps femoris, anterior compartment of the thigh',key:'Knee extensors (quadriceps femoris)',anta:'Knee flexors: hamstrings',dof:[['hip',72,72],['knee',92,2]],mus:['rectus femoris','vastus'],assist:[],focus:'knee',tip:'ankle',cam:[-0.97,0.08,0.22,2300],drop:60},
 {id:'dorsiflex',root:'L4',name:'Ankle dorsiflexion',group:'Ankle dorsiflexors',comp:'anterior compartment of the leg',key:'Ankle dorsiflexors (tibialis anterior)',anta:'Plantar flexors: gastrocnemius, soleus',dof:[['ankle',-6,22]],mus:['tibialis anterior'],assist:['extensor digitorum longus','extensor hallucis longus'],focus:'ankle',tip:'mtp1',cam:[-0.95,0.12,0.28,1100],drop:-90},
 {id:'toeext',root:'L5',name:'Great toe extension',group:'Long toe extensors',comp:'anterior compartment of the leg',key:'Long toe extensors (extensor hallucis longus)',anta:'Flexor hallucis longus',dof:[['mtp1',0,48]],mus:['extensor hallucis longus'],assist:['extensor hallucis brevis'],focus:'ankle',tip:'',cam:[-0.9,0.2,0.4,1000],drop:-60},
 {id:'plantarflex',root:'S1',name:'Ankle plantarflexion',group:'Ankle plantar flexors',comp:'triceps surae, superficial posterior compartment of the leg',key:'Ankle plantar flexors (gastrocnemius, soleus)',anta:'Dorsiflexors: tibialis anterior',dof:[['ankle',6,-40]],mus:['gastrocnemius','soleus'],assist:['plantaris'],focus:'ankle',tip:'mtp1',cam:[-0.95,0.12,0.28,1100],drop:-90}];
async function buf(n,T){const r=await fetch(BASE+n+VER);return new T(await r.arrayBuffer());}
export async function createRig(mus,bone,names){
  const [rig,msk,bsk,mfx]=await Promise.all([fetch(BASE+'rig.json'+VER).then(r=>r.json()),buf('mus_sk.wasm',Uint8Array),buf('bone_sk.wasm',Uint8Array),buf('mus_fx.wasm',Int16Array)]);
  const NS=rig.ns,mats=[];for(let i=0;i<NS;i++)mats.push(new THREE.Matrix4());
  const U={uSeg:{value:mats},uGlow:{value:0},uGhost:{value:0}},UB={uSeg:U.uSeg,uGlow:{value:0},uGhost:{value:0}};
  const nm=mus.geometry.attributes.position.count,a=new Float32Array(nm*3),hi=new Float32Array(nm);
  for(let i=0;i<nm;i++){a[i*3]=msk[i*3];a[i*3+1]=msk[i*3+1];a[i*3+2]=msk[i*3+2]/255;}
  mus.geometry.setAttribute('aSk',new THREE.BufferAttribute(a,3));mus.geometry.setAttribute('aHi',new THREE.BufferAttribute(hi,1));mus.geometry.setAttribute('aFx',new THREE.BufferAttribute(mfx,3,false));mus.material.roughness=0.4;
  const nb=bone.geometry.attributes.position.count,b=new Float32Array(nb*3);for(let i=0;i<nb;i++){b[i*3]=b[i*3+1]=bsk[i];}
  bone.geometry.setAttribute('aSk',new THREE.BufferAttribute(b,3));bone.geometry.setAttribute('aHi',new THREE.BufferAttribute(new Float32Array(nb),1));
  for(const m of [mus,bone]){m.frustumCulled=false;m.material.onBeforeCompile=s=>{Object.assign(s.uniforms,m===mus?U:UB);
    const isM=m===mus;
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 aSk;attribute float aHi;'+(isM?'attribute vec3 aFx;varying vec3 vFx;':'')+'uniform mat4 uSeg['+NS+'];uniform float uGlow;varying float vHi;')
      .replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nmat4 skA=uSeg[int(aSk.x+0.5)];mat4 skB=uSeg[int(aSk.y+0.5)];objectNormal=normalize(mix(mat3(skA)*objectNormal,mat3(skB)*objectNormal,aSk.z));')
      .replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed+=normal*aHi*uGlow*2.4;transformed=mix((skA*vec4(transformed,1.0)).xyz,(skB*vec4(transformed,1.0)).xyz,aSk.z);vHi=aHi;'+(isM?'vFx=vec3(aFx.xy/16.0,aFx.z/32767.0);':''));
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vHi;uniform float uGlow;uniform float uGhost;')
      .replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(uGhost>0.0&&vHi<0.5){float q_n=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(0.06711056,0.00583715))));if(q_n>1.0-0.55*uGhost)discard;}')
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vHi*uGlow*vec3(0.42,0.10,0.03);');
    if(isM)s.fragmentShader=s.fragmentShader.replace('varying float vHi;','varying float vHi;varying vec3 vFx;').replace('#include <color_fragment>','#include <color_fragment>\nfloat q_f=sin(vFx.x*1.75+sin(vFx.y*0.21)*1.4)*0.5+0.5;q_f=mix(0.80,1.05,smoothstep(0.12,0.88,q_f));float q_g=sin(vFx.x*7.3+vFx.y*0.9)*0.5+0.5;q_f*=mix(0.96,1.0,q_g);diffuseColor.rgb=mix(diffuseColor.rgb*q_f,vec3(0.87,0.83,0.74),clamp(vFx.z,0.0,1.0)*0.82);');};m.material.needsUpdate=true;}
  const pos=mus.geometry.attributes.position.array;
  const loc=[];for(let i=0;i<NS;i++)loc.push(new THREE.Matrix4());
  const T=new THREE.Matrix4(),R=new THREE.Matrix4(),ax=new THREE.Vector3();
  function pose(ang,side){for(let i=0;i<NS;i++)loc[i].identity();
    for(const k in ang){const j=rig.joints[k+side];if(!j)continue;ax.set(j.a[0],j.a[1],j.a[2]);
      T.makeTranslation(j.c[0],j.c[1],j.c[2]);R.makeRotationAxis(ax,ang[k]*Math.PI/180);T.multiply(R);R.makeTranslation(-j.c[0],-j.c[1],-j.c[2]);T.multiply(R);loc[j.seg].multiply(T);}
    mats[0].identity();for(let i=1;i<NS;i++)mats[i].multiplyMatrices(mats[rig.par[i]],loc[i]);}
  let cur=null,t0=0,side='R',paused=false,frac=0;
  const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
  const api={rig,MOVES,active:()=>cur,
    select(id,now){cur=MOVES.find(m=>m.id===id)||null;t0=now;paused=false;const P=mus.userData.pid,set=new Set(),as=new Set();
      if(cur){const re=cur.mus.map(x=>new RegExp(x)),ra=(cur.assist||[]).map(x=>new RegExp(x));names.forEach((n,i)=>{if(!n.includes(side==='R'?'right':'left'))return;if(re.some(r=>r.test(n)))set.add(i);else if(ra.some(r=>r.test(n)))as.add(i);});}
      api.assist=as;api.anchors=[];if(cur){const acc={};for(let i=0;i<nm;i++){const p=P[i];if(!set.has(p)&&!as.has(p))continue;const o=acc[p]||(acc[p]={x:0,y:0,z:0,c:0,sg:{}});o.x+=pos[i*3];o.y+=pos[i*3+1];o.z+=pos[i*3+2];o.c++;const sg=msk[i*3];o.sg[sg]=(o.sg[sg]||0)+1;}
        const by={};for(const p in acc){const o=acc[p],nmz=names[p].replace(/\b(right|left) /,'').replace(/^(long|short|lateral|medial|radial|humeroulnar|humeral|ulnar) head of /,'').replace(/ of hand$/,'');const sg=+Object.keys(o.sg).sort((a,b)=>o.sg[b]-o.sg[a])[0];const e=by[nmz]||(by[nmz]={n:nmz,x:0,y:0,z:0,c:0,seg:sg,prime:set.has(+p)});e.x+=o.x;e.y+=o.y;e.z+=o.z;e.c+=o.c;}
        for(const k in by){const e=by[k];api.anchors.push({name:e.n[0].toUpperCase()+e.n.slice(1),p:new THREE.Vector3(e.x/e.c,e.y/e.c,e.z/e.c),seg:e.seg,prime:e.prime});}}
      for(let i=0;i<nm;i++)hi[i]=set.has(P[i])?1:as.has(P[i])?0.5:0;mus.geometry.attributes.aHi.needsUpdate=true;U.uGhost.value=cur&&cur.ghost?1:0;if(!cur){pose({},side);U.uGlow.value=0;}return set;},
    stop(){return api.select(null,0);},pause(p){paused=p;},setFrac(f){frac=f;paused=true;},
    focus(m,root){/* world position of the joint to look at, mid-movement */
      const ang={};for(const d of m.dof)ang[d[0]]=(d[1]+d[2])/2;pose(ang,side);const j=rig.joints[m.focus+side],v=new THREE.Vector3(j.c[0],j.c[1],j.c[2]-(m.drop||0)).applyMatrix4(mats[rig.par[j.seg]]);return v.applyMatrix4(root.matrixWorld);},
    posed(a,out){return out.copy(a.p).applyMatrix4(mats[a.seg]);},
    arc(m){if(!m.tip)return null;const j=rig.joints[m.tip+side],pts=[],mv=m.dof.filter(d=>d[1]!==d[2]);for(let k=0;k<=28;k++){const ang={};for(const d of m.dof)ang[d[0]]=d[1]+(d[2]-d[1])*k/28;pose(ang,side);pts.push(new THREE.Vector3(j.c[0],j.c[1],j.c[2]).applyMatrix4(mats[rig.par[j.seg]]));}return pts;},
    state:{angle:0,s:0},
    tick(now){if(!cur)return;if(!paused)frac=((now-t0)/4800)%1;let s,g;
      if(frac<0.12){s=0;g=0;}else if(frac<0.5){s=ease((frac-0.12)/0.38);g=Math.min(1,s*1.6);}else if(frac<0.72){s=1;g=1;}else{s=1-ease((frac-0.72)/0.28);g=s*0.5;}
      const ang={};for(const d of cur.dof)ang[d[0]]=d[1]+(d[2]-d[1])*s;pose(ang,side);U.uGlow.value=g;const d0=cur.dof.find(d=>d[1]!==d[2]);api.state.angle=d0[1]+(d0[2]-d0[1])*s;api.state.s=s;}};
  pose({},side);return api;}

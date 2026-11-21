/* NORA² 3D movement rig: bones turn rigidly about joint centres taken from the skeleton; muscles follow the bone they lie on,
   blended across each joint; the working muscles glow and swell slightly as they shorten. */
import * as THREE from './vendor/three.module.min.js';
const BASE='media/model3d/', VER='?v=66';
export const MOVES=[
 {id:'elbowflex',root:'C5',name:'Elbow flexion',key:'Elbow flexors (biceps brachii, brachialis)',dof:[['elbow',0,128]],mus:['biceps brachii','\\bbrachialis','brachioradialis'],focus:'elbow',cam:[-0.86,0.12,0.5,1500]},
 {id:'wristext',root:'C6',name:'Wrist extension',key:'Wrist extensors (extensor carpi radialis longus and brevis)',dof:[['elbow',88,88],['wrist',-8,58]],mus:['extensor carpi radialis','extensor carpi ulnaris'],focus:'wrist',cam:[-0.92,0.2,0.34,1000]},
 {id:'elbowext',root:'C7',name:'Elbow extension',key:'Elbow extensors (triceps brachii)',dof:[['elbow',125,0]],mus:['triceps brachii','anconeus'],focus:'elbow',cam:[-0.86,0.12,0.5,1500]},
 {id:'fingerflex',root:'C8',name:'Finger flexion',key:'Finger flexors (flexor digitorum profundus), tested at the distal phalanx of the middle finger',dof:[['elbow',88,88],['mcp2',0,62],['pip2',0,88],['dip2',0,58],['mcp3',0,66],['pip3',0,92],['dip3',0,64],['mcp4',0,68],['pip4',0,92],['dip4',0,60],['mcp5',0,70],['pip5',0,88],['dip5',0,58]],mus:['flexor digitorum profundus'],ghost:1,focus:'mcp3',cam:[-0.92,0.2,0.34,900]},
 {id:'abd5',root:'T1',name:'Little finger abduction',key:'Small finger abductors (abductor digiti minimi)',dof:[['elbow',88,88],['abd5',0,30]],mus:['abductor digiti minimi(?!.*foot)'],focus:'mcp5',cam:[-0.5,0.82,0.3,820]},
 {id:'hipflex',root:'L2',name:'Hip flexion',key:'Hip flexors (iliopsoas)',dof:[['hip',0,84],['knee',0,82]],mus:['iliacus','psoas major'],ghost:1,focus:'hip',cam:[-0.97,0.08,0.22,2500],drop:210},
 {id:'kneeext',root:'L3',name:'Knee extension',key:'Knee extensors (quadriceps femoris)',dof:[['hip',72,72],['knee',92,2]],mus:['rectus femoris','vastus'],focus:'knee',cam:[-0.97,0.08,0.22,2300],drop:60},
 {id:'dorsiflex',root:'L4',name:'Ankle dorsiflexion',key:'Ankle dorsiflexors (tibialis anterior)',dof:[['ankle',-6,22]],mus:['tibialis anterior'],focus:'ankle',cam:[-0.95,0.12,0.28,1100],drop:-90},
 {id:'toeext',root:'L5',name:'Great toe extension',key:'Long toe extensors (extensor hallucis longus)',dof:[['mtp1',0,48]],mus:['extensor hallucis longus'],focus:'ankle',cam:[-0.9,0.2,0.4,1000],drop:-60},
 {id:'plantarflex',root:'S1',name:'Ankle plantarflexion',key:'Ankle plantar flexors (gastrocnemius, soleus)',dof:[['ankle',6,-40]],mus:['gastrocnemius','soleus'],focus:'ankle',cam:[-0.95,0.12,0.28,1100],drop:-90}];
async function buf(n,T){const r=await fetch(BASE+n+VER);return new T(await r.arrayBuffer());}
export async function createRig(mus,bone,names){
  const [rig,msk,bsk]=await Promise.all([fetch(BASE+'rig.json'+VER).then(r=>r.json()),buf('mus_sk.wasm',Uint8Array),buf('bone_sk.wasm',Uint8Array)]);
  const NS=rig.ns,mats=[];for(let i=0;i<NS;i++)mats.push(new THREE.Matrix4());
  const U={uSeg:{value:mats},uGlow:{value:0},uGhost:{value:0}},UB={uSeg:U.uSeg,uGlow:{value:0},uGhost:{value:0}};
  const nm=mus.geometry.attributes.position.count,a=new Float32Array(nm*3),hi=new Float32Array(nm);
  for(let i=0;i<nm;i++){a[i*3]=msk[i*3];a[i*3+1]=msk[i*3+1];a[i*3+2]=msk[i*3+2]/255;}
  mus.geometry.setAttribute('aSk',new THREE.BufferAttribute(a,3));mus.geometry.setAttribute('aHi',new THREE.BufferAttribute(hi,1));
  const nb=bone.geometry.attributes.position.count,b=new Float32Array(nb*3);for(let i=0;i<nb;i++){b[i*3]=b[i*3+1]=bsk[i];}
  bone.geometry.setAttribute('aSk',new THREE.BufferAttribute(b,3));bone.geometry.setAttribute('aHi',new THREE.BufferAttribute(new Float32Array(nb),1));
  for(const m of [mus,bone]){m.frustumCulled=false;m.material.onBeforeCompile=s=>{Object.assign(s.uniforms,m===mus?U:UB);
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 aSk;attribute float aHi;uniform mat4 uSeg['+NS+'];uniform float uGlow;varying float vHi;')
      .replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nmat4 skA=uSeg[int(aSk.x+0.5)];mat4 skB=uSeg[int(aSk.y+0.5)];objectNormal=normalize(mix(mat3(skA)*objectNormal,mat3(skB)*objectNormal,aSk.z));')
      .replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed+=normal*aHi*uGlow*2.4;transformed=mix((skA*vec4(transformed,1.0)).xyz,(skB*vec4(transformed,1.0)).xyz,aSk.z);vHi=aHi;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vHi;uniform float uGlow;uniform float uGhost;')
      .replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(uGhost>0.0&&vHi<0.5){float q_n=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(0.06711056,0.00583715))));if(q_n>1.0-0.55*uGhost)discard;}')
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vHi*uGlow*vec3(0.50,0.24,0.04);');};m.material.needsUpdate=true;}
  const loc=[];for(let i=0;i<NS;i++)loc.push(new THREE.Matrix4());
  const T=new THREE.Matrix4(),R=new THREE.Matrix4(),ax=new THREE.Vector3();
  function pose(ang,side){for(let i=0;i<NS;i++)loc[i].identity();
    for(const k in ang){const j=rig.joints[k+side];if(!j)continue;ax.set(j.a[0],j.a[1],j.a[2]);
      T.makeTranslation(j.c[0],j.c[1],j.c[2]);R.makeRotationAxis(ax,ang[k]*Math.PI/180);T.multiply(R);R.makeTranslation(-j.c[0],-j.c[1],-j.c[2]);T.multiply(R);loc[j.seg].multiply(T);}
    mats[0].identity();for(let i=1;i<NS;i++)mats[i].multiplyMatrices(mats[rig.par[i]],loc[i]);}
  let cur=null,t0=0,side='R',paused=false,frac=0;
  const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
  const api={rig,MOVES,active:()=>cur,
    select(id,now){cur=MOVES.find(m=>m.id===id)||null;t0=now;paused=false;const P=mus.userData.pid,set=new Set();
      if(cur){const re=cur.mus.map(x=>new RegExp(x));names.forEach((n,i)=>{if(n.includes(side==='R'?'right':'left')&&re.some(r=>r.test(n)))set.add(i);});}
      for(let i=0;i<nm;i++)hi[i]=set.has(P[i])?1:0;mus.geometry.attributes.aHi.needsUpdate=true;U.uGhost.value=cur&&cur.ghost?1:0;if(!cur){pose({},side);U.uGlow.value=0;}return set;},
    stop(){return api.select(null,0);},pause(p){paused=p;},setFrac(f){frac=f;paused=true;},
    focus(m,root){/* world position of the joint to look at, mid-movement */
      const ang={};for(const d of m.dof)ang[d[0]]=(d[1]+d[2])/2;pose(ang,side);const j=rig.joints[m.focus+side],v=new THREE.Vector3(j.c[0],j.c[1],j.c[2]-(m.drop||0)).applyMatrix4(mats[rig.par[j.seg]]);return v.applyMatrix4(root.matrixWorld);},
    tick(now){if(!cur)return;if(!paused)frac=((now-t0)/3600)%1;let s,g;
      if(frac<0.12){s=0;g=0;}else if(frac<0.5){s=ease((frac-0.12)/0.38);g=Math.min(1,s*1.6);}else if(frac<0.72){s=1;g=1;}else{s=1-ease((frac-0.72)/0.28);g=s*0.5;}
      const ang={};for(const d of cur.dof)ang[d[0]]=d[1]+(d[2]-d[1])*s;pose(ang,side);U.uGlow.value=g;}};
  pose({},side);return api;}

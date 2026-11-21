/* NORA² 3D skin: dermatome borders worked out per pixel (no vertex colouring), one clean line between territories. */
import * as THREE from './vendor/three.module.min.js';
const BASE='media/model3d/', VER='?v=65';
async function buf(n,T){const r=await fetch(BASE+n+VER);return new T(await r.arrayBuffer());}
export async function createSkin(root){
  const [pos,idx,att]=await Promise.all([buf('skin2_pos.wasm',Float32Array),buf('skin2_idx.wasm',Uint32Array),buf('skin2_att.wasm',Uint8Array)]);
  const nB=pos.length/3;
  const g0=new THREE.BufferGeometry();g0.setAttribute('position',new THREE.BufferAttribute(pos,3));g0.setIndex(new THREE.BufferAttribute(idx,1));g0.computeVertexNormals();
  const nrm=g0.attributes.normal.array;
  const pal=new Uint8Array(64*4), tex=new THREE.DataTexture(pal,64,1,THREE.RGBAFormat);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;
  const U={uPal:{value:tex},uLine:{value:1.25},uLineCol:{value:new THREE.Color('#0B1020')},uLineA:{value:0.72},uSoft:{value:0}};
  const mat=new THREE.MeshStandardMaterial({roughness:0.72,metalness:0,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
  mat.onBeforeCompile=s=>{Object.assign(s.uniforms,U);
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 aCls;attribute vec3 aW;varying vec3 vCls;varying vec3 vW;').replace('#include <begin_vertex>','#include <begin_vertex>\nvCls=aCls;vW=aW;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D uPal;uniform float uLine;uniform vec3 uLineCol;uniform float uLineA;uniform float uSoft;varying vec3 vCls;varying vec3 vW;\nvec3 palC(float c){return texture2D(uPal,vec2((c+0.5)/64.0,0.5)).rgb;}')
     .replace('#include <color_fragment>',`
      vec3 q_w=vW; vec3 q_c=floor(vCls+0.5);
      float q_dxy=q_w.x-q_w.y, q_dxz=q_w.x-q_w.z, q_dyz=q_w.y-q_w.z; float q_fxy=fwidth(q_dxy), q_fxz=fwidth(q_dxz), q_fyz=fwidth(q_dyz);
      float q_c1,q_c2,q_d,q_fw;
      if(q_w.z<=q_w.x&&q_w.z<=q_w.y){q_d=q_dxy;q_fw=q_fxy;q_c1=q_c.x;q_c2=q_c.y;}
      else if(q_w.y<=q_w.x&&q_w.y<=q_w.z){q_d=q_dxz;q_fw=q_fxz;q_c1=q_c.x;q_c2=q_c.z;}
      else{q_d=q_dyz;q_fw=q_fyz;q_c1=q_c.y;q_c2=q_c.z;}
      if(q_d<0.0){float q_t=q_c1;q_c1=q_c2;q_c2=q_t;q_d=-q_d;}
      float q_e=q_d/max(q_fw,1e-6); vec3 q_k1=palC(q_c1), q_k2=palC(q_c2);
      float q_same=step(abs(q_c1-q_c2),0.5);
      vec3 q_col=mix(mix(q_k1,q_k2,0.5),q_k1,clamp(q_e,0.0,1.0));
      if(uSoft>0.0){q_col=mix(mix(q_k1,q_k2,0.5),q_k1,smoothstep(0.0,uSoft,q_d));}
      float q_ln=(1.0-smoothstep(uLine-0.6,uLine+0.6,q_e))*(1.0-q_same);
      q_col=mix(q_col,uLineCol,q_ln*uLineA);
      diffuseColor.rgb=q_col;`);};
  const mesh=new THREE.Mesh(g0,mat);root.add(mesh);
  const maps={};let cur=null;
  async function loadMap(name){if(maps[name])return maps[name];
    const [top,bt,bc,bw,lab]=await Promise.all([buf(`derm_${name}_top.wasm`,Uint8Array),buf(`derm_${name}_bt.wasm`,Uint32Array),buf(`derm_${name}_bc.wasm`,Uint8Array),buf(`derm_${name}_bw.wasm`,Uint8Array),fetch(BASE+`derm_${name}_lab.json`+VER).then(r=>r.json())]);
    const m=bt.length,n=nB+3*m,P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Uint8Array(n*3),W=new Uint8Array(n*3),I=new Uint32Array(idx);
    P.set(pos);N.set(nrm);for(let i=0;i<nB;i++){C[i*3]=C[i*3+1]=C[i*3+2]=top[i];W[i*3]=255;}
    for(let j=0;j<m;j++){const t=bt[j];for(let k=0;k<3;k++){const v=idx[t*3+k],o=(nB+3*j+k)*3;P[o]=pos[v*3];P[o+1]=pos[v*3+1];P[o+2]=pos[v*3+2];N[o]=nrm[v*3];N[o+1]=nrm[v*3+1];N[o+2]=nrm[v*3+2];
      C[o]=bc[j*3];C[o+1]=bc[j*3+1];C[o+2]=bc[j*3+2];W[o]=bw[j*9+k*3];W[o+1]=bw[j*9+k*3+1];W[o+2]=bw[j*9+k*3+2];I[t*3+k]=nB+3*j+k;}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));
    g.setAttribute('aCls',new THREE.BufferAttribute(C,3,false));g.setAttribute('aW',new THREE.BufferAttribute(W,3,true));g.setIndex(new THREE.BufferAttribute(I,1));g.computeBoundingSphere();g.computeBoundingBox();
    const byN={};for(let i=0;i<nB;i++){const c=top[i],nv=att[i*4];if(!nv)continue;const o=byN[c]||(byN[c]={t:0});o[nv]=(o[nv]||0)+1;o.t++;}
    const nerves={};for(const c in byN){const o=byN[c];nerves[c]=Object.keys(o).filter(k=>k!=='t'&&o[k]/o.t>=0.05).sort((a,b)=>o[b]-o[a]).map(Number);}
    return maps[name]={g,top,lab,C,W,nerves};}
  const api={mesh,att,nB,idx,pos,nrm,U,
    async setMap(name){const m=await loadMap(name);cur=m;mesh.geometry=m.g;api.map=name;api.lab=m.lab;api.nerves=m.nerves;return m;},
    paint(colors,sel){for(let i=0;i<64;i++){const c=colors[i];pal[i*4+3]=255;if(!c)continue;let r=parseInt(c.slice(1,3),16)/255,g=parseInt(c.slice(3,5),16)/255,b=parseInt(c.slice(5,7),16)/255;
        if(sel!=null&&sel!==i){const y=(r+g+b)/3;r=y*0.45+0.16;g=y*0.45+0.17;b=y*0.45+0.21;}
        pal[i*4]=Math.round(r*255);pal[i*4+1]=Math.round(g*255);pal[i*4+2]=Math.round(b*255);}tex.needsUpdate=true;},
    hit(h){/* intersection -> {cls, second, margin, base vertex} */
      const f=h.face,A=mesh.geometry.attributes,p=mesh.worldToLocal(h.point.clone()),a=new THREE.Vector3().fromBufferAttribute(A.position,f.a),b=new THREE.Vector3().fromBufferAttribute(A.position,f.b),c=new THREE.Vector3().fromBufferAttribute(A.position,f.c),bc=new THREE.Vector3();
      THREE.Triangle.getBarycoord(p,a,b,c,bc);const C=cur.C,W=cur.W,w=[0,0,0];
      for(let s=0;s<3;s++)w[s]=bc.x*W[f.a*3+s]+bc.y*W[f.b*3+s]+bc.z*W[f.c*3+s];
      const cl=[C[f.a*3],C[f.a*3+1],C[f.a*3+2]];let i1=0;for(let s=1;s<3;s++)if(w[s]>w[i1])i1=s;let i2=-1;for(let s=0;s<3;s++)if(s!==i1&&cl[s]!==cl[i1]&&(i2<0||w[s]>w[i2]))i2=s;
      const t=h.faceIndex,vs=[idx[t*3],idx[t*3+1],idx[t*3+2]],bb=[bc.x,bc.y,bc.z];let vb=vs[0];if(bb[1]>bb[0]&&bb[1]>=bb[2])vb=vs[1];else if(bb[2]>bb[0]&&bb[2]>bb[1])vb=vs[2];
      return {cls:cl[i1],second:i2<0?0:cl[i2],margin:i2<0?1:(w[i1]-w[i2])/255,v:vb,p};}};
  return api;}

/* ಪ್ರತಿಭಾನ್ವೇಷಣೆ ಪರೀಕ್ಷೆ – ಸಾಮಾನ್ಯ ಕೋಡ್ (common.js)
   ವೆಬ್‌ಸೈಟ್ (index.html) ಮತ್ತು ಅಡ್ಮಿನ್ (admin.html) ಎರಡೂ ಇದನ್ನು ಬಳಸುತ್ತವೆ. */
'use strict';
const FB_CONFIG={apiKey:"AIzaSyBNlxiLH9fAdaAnkQM37Yu0QegXbP3rVgs",authDomain:"with-you-qp2.firebaseapp.com",projectId:"with-you-qp2",storageBucket:"with-you-qp2.firebasestorage.app",messagingSenderId:"845596413344",appId:"1:845596413344:web:e634a5cba403e51f91e8c5"};
const ADMIN_UID='1CPwmUVVePdJ2E8t6VgdFLxHit02';
const FB_VER='10.12.2';
const MOCK=/[?&]mock=1/.test(location.search);   // ಪರೀಕ್ಷೆಗಾಗಿ ಮಾತ್ರ
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LET=['A','B','C','D'];
const SECS={gk:{kn:'ಸಾಮಾನ್ಯ ಜ್ಞಾನ',en:'General Knowledge',subj:false},mat:{kn:'ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ',en:'Mental Ability',subj:false},
 ca:{kn:'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ',en:'Current Affairs',subj:false},lang:{kn:'ಭಾಷೆ',en:'Language',subj:false},
 ss:{kn:'ಸಮಾಜ ವಿಜ್ಞಾನ',en:'Social Science',subj:true},sci:{kn:'ವಿಜ್ಞಾನ',en:'Science',subj:true},math:{kn:'ಗಣಿತ',en:'Mathematics',subj:true}};
const SEC_ORDER=['gk','mat','ca','lang','ss','sci','math'];
const DIFF={easy:'ಸುಲಭ',medium:'ಮಧ್ಯಮ',hard:'ಕಠಿಣ'};
function fmtDate(d){if(!d)return '';const [y,m,dd]=d.split('-');const days=['ಭಾನುವಾರ','ಸೋಮವಾರ','ಮಂಗಳವಾರ','ಬುಧವಾರ','ಗುರುವಾರ','ಶುಕ್ರವಾರ','ಶನಿವಾರ'];const dt=new Date(+y,+m-1,+dd);if(isNaN(dt))return d;return `${dd}-${m}-${y} (${days[dt.getDay()]})`}
function fmtShort(d){if(!d)return '';const [y,m,dd]=d.split('-');return `${dd}-${m}-${y}`}
const levelOf=cls=>(+cls<=8?'jr':'sr');
const blen=s=>new TextEncoder().encode(s).length;   // UTF-8 ಬೈಟ್ ಗಾತ್ರ (ಕನ್ನಡ ಅಕ್ಷರ = 3 ಬೈಟ್)

/* ---------- ಸಾರ್ವಜನಿಕ ಓದು (Firestore REST, SDK ಇಲ್ಲದೆ) ---------- */
const PUB={
 async get(path){
  if(MOCK){const v=localStorage.getItem('mockfs:'+path);return v?JSON.parse(v):null}
  const url=`https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/${path}?key=${FB_CONFIG.apiKey}`;
  const r=await fetch(url);if(r.status===404)return null;if(!r.ok)throw new Error('ಸರ್ವರ್ ದೋಷ '+r.status);
  const j=await r.json();const s=j.fields&&j.fields.json&&j.fields.json.stringValue;return s?JSON.parse(s):null}
};

/* ---------- ಅಡ್ಮಿನ್ ಸಂಗ್ರಹ (Firebase SDK ಅಥವಾ ಪರೀಕ್ಷಾ ಮಾದರಿ) ----------
   ಪ್ರತಿ ಡಾಕ್ಯುಮೆಂಟ್ {json: "<JSON ಪಠ್ಯ>"} ರೂಪದಲ್ಲಿ ಉಳಿಯುತ್ತದೆ. */
const STORE={ready:false,user:null,
 async init(onAuth){
  if(MOCK){this._cb=onAuth;this.ready=true;const u=sessionStorage.getItem('mockuser');this.user=u?{uid:ADMIN_UID,email:u}:null;setTimeout(()=>onAuth(this.user),0);return}
  const base=`https://www.gstatic.com/firebasejs/${FB_VER}/`;
  const [app,auth,fs]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
  this.app=app.initializeApp(FB_CONFIG);this.A=auth;this.F=fs;this.auth=auth.getAuth(this.app);this.db=fs.getFirestore(this.app);this.ready=true;
  auth.onAuthStateChanged(this.auth,u=>{this.user=u;onAuth(u)})},
 async login(email,pw){if(MOCK){if(pw!=='test')throw new Error('auth/wrong-password');sessionStorage.setItem('mockuser',email);this.user={uid:ADMIN_UID,email};setTimeout(()=>this._cb(this.user),0);return this.user}
  const c=await this.A.signInWithEmailAndPassword(this.auth,email,pw);return c.user},
 async logout(){if(MOCK){sessionStorage.removeItem('mockuser');location.reload();return}await this.A.signOut(this.auth)},
 async get(path){if(MOCK){const v=localStorage.getItem('mockfs:'+path);return v?JSON.parse(v):null}
  const s=await this.F.getDoc(this.F.doc(this.db,path));return s.exists()?JSON.parse(s.data().json):null},
 async set(path,obj){const json=JSON.stringify(obj);const n=blen(json);if(n>1000000)throw new Error('ಡಾಕ್ಯುಮೆಂಟ್ ತುಂಬಾ ದೊಡ್ಡದು ('+path+', '+Math.round(n/1024)+' KB)');
  if(MOCK){localStorage.setItem('mockfs:'+path,json);return n}
  await this.F.setDoc(this.F.doc(this.db,path),{json,updated:Date.now()});return n},
 async del(path){if(MOCK){localStorage.removeItem('mockfs:'+path);return}await this.F.deleteDoc(this.F.doc(this.db,path))},
 async list(coll){if(MOCK){const pre='mockfs:'+coll+'/';const out=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith(pre)&&!k.slice(pre.length).includes('/'))out.push({id:k.slice(pre.length),data:JSON.parse(localStorage.getItem(k))})}return out}
  const snap=await this.F.getDocs(this.F.collection(this.db,coll));return snap.docs.map(d=>({id:d.id,data:JSON.parse(d.data().json)}))}
};

const OMR=(()=>{
 // Template geometry in millimetres (A4 210 x 297)
 const G={W:210,H:297,mk:[[12,12],[198,12],[198,285],[12,285]],mkS:8,bar:{x:80,y:9,w:50,h:5},r:2,
  regX:i=>24+i*7.5,regY:d=>73+d*5.6,setX:k=>112+k*9,setY:70,
  ansCol:[16,61,106,151],ansY:i=>143+i*5.4,ansX:(c,k)=>16+45*c+12+k*7};
 const qXY=(q,k)=>{const c=Math.floor(q/25),i=q%25;return [G.ansX(c,k),G.ansY(i)]};
 // sample point sets (mm offsets)
 const INNER=[];for(let a=-1.2;a<=1.2001;a+=0.3)for(let b=-1.2;b<=1.2001;b+=0.3)if(a*a+b*b<=1.45)INNER.push([a,b]);
 const RING=[];for(let k=0;k<16;k++){const t=k*Math.PI/8;RING.push([2.75*Math.cos(t),2.75*Math.sin(t)])}
 const BAR_IN=[];for(let x=82;x<=128;x+=3)for(const y of [10,11.5,13])BAR_IN.push([x,y]);
 const BAR_WH=[[72,11.5],[138,11.5],[70,5.5],[90,5.5],[105,5.5],[120,5.5],[140,5.5],[60,8]];

 function solve(A,b){const n=b.length;for(let i=0;i<n;i++)A[i]=A[i].concat([b[i]]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];
   if(Math.abs(A[c][c])<1e-12)return null;for(let r=0;r<n;r++){if(r===c)continue;const f=A[r][c]/A[c][c];for(let k=c;k<=n;k++)A[r][k]-=f*A[c][k]}}
  return A.map((row,i)=>row[n]/row[i])}
 function homog(src,dst){const A=[],b=[];for(let i=0;i<4;i++){const [x,y]=src[i],[u,v]=dst[i];
  A.push([x,y,1,0,0,0,-u*x,-u*y]);b.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);b.push(v)}
  const h=solve(A,b);if(!h)return null;h.push(1);return h}
 const mp=(h,x,y)=>{const w=h[6]*x+h[7]*y+h[8];return [(h[0]*x+h[1]*y+h[2])/w,(h[3]*x+h[4]*y+h[5])/w]};

 function smallGray(src,maxSide){const W=src.videoWidth||src.naturalWidth||src.width,H=src.videoHeight||src.naturalHeight||src.height,sc=Math.min(1,maxSide/Math.max(W,H));
  const w=Math.max(1,Math.round(W*sc)),h=Math.max(1,Math.round(H*sc));const c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(src,0,0,w,h);const d=x.getImageData(0,0,w,h).data;
  const g=new Uint8Array(w*h);for(let i=0,j=0;i<g.length;i++,j+=4)g[i]=(d[j]*0.5+d[j+1]*0.4+d[j+2]*0.1)|0;
  return {w,h,g,scale:w/W}}

 // find corner-marker candidates; returns array of point sets [TL,TR,BR,BL]
 function findMarkers(Sm){const {w,h,g}=Sm,N=w*h,W1=w+1;const I=new Float64Array(W1*(h+1));
  for(let y=0;y<h;y++){let row=0;for(let x=0;x<w;x++){row+=g[y*w+x];I[(y+1)*W1+x+1]=I[y*W1+x+1]+row}}
  const hs=Math.max(7,Math.round(Math.min(w,h)/14));const bin=new Uint8Array(N);
  for(let y=0;y<h;y++){const y0=Math.max(0,y-hs),y1=Math.min(h,y+hs+1);for(let x=0;x<w;x++){const x0=Math.max(0,x-hs),x1=Math.min(w,x+hs+1);
   const m=(I[y1*W1+x1]-I[y0*W1+x1]-I[y1*W1+x0]+I[y0*W1+x0])/((y1-y0)*(x1-x0));const v=g[y*w+x];if(v<m*0.72&&v<m-18)bin[y*w+x]=1}}
  const lab=new Int32Array(N),st=new Int32Array(N),comps=[];let id=0;
  for(let p=0;p<N;p++){if(!bin[p]||lab[p])continue;id++;let sp=0;st[sp++]=p;lab[p]=id;let area=0,sx=0,sy=0,mnx=w,mny=h,mxx=0,mxy=0,border=false;
   while(sp){const q=st[--sp];const x=q%w,y=(q/w)|0;area++;sx+=x;sy+=y;if(x<mnx)mnx=x;if(x>mxx)mxx=x;if(y<mny)mny=y;if(y>mxy)mxy=y;
    if(x===0||y===0||x===w-1||y===h-1)border=true;
    if(x>0&&bin[q-1]&&!lab[q-1]){lab[q-1]=id;st[sp++]=q-1}if(x<w-1&&bin[q+1]&&!lab[q+1]){lab[q+1]=id;st[sp++]=q+1}
    if(y>0&&bin[q-w]&&!lab[q-w]){lab[q-w]=id;st[sp++]=q-w}if(y<h-1&&bin[q+w]&&!lab[q+w]){lab[q+w]=id;st[sp++]=q+w}}
   const bw=mxx-mnx+1,bh=mxy-mny+1;if(area<12)continue;
   if(Math.max(bw,bh)/Math.min(bw,bh)>1.9||area/(bw*bh)<0.5)continue;
   comps.push({x:sx/area+0.5,y:sy/area+0.5,area,border})}
  const maxNB=Math.max(0,...comps.filter(c=>!c.border).map(c=>c.area));
  for(let i=comps.length-1;i>=0;i--)if(comps[i].border&&comps[i].area>maxNB*1.5)comps.splice(i,1);
  comps.sort((a,b)=>b.area-a.area);const out=[];
  for(let k=0;k<Math.min(4,comps.length-3);k++){const maxA=comps[k].area;const cand=comps.slice(k).filter(c=>c.area>=maxA*0.25);if(cand.length<4)continue;
   const by=f=>cand.reduce((a,c)=>f(c)>f(a)?c:a);
   const TL=by(c=>-(c.x+c.y)),BR=by(c=>c.x+c.y),TR=by(c=>c.x-c.y),BL=by(c=>c.y-c.x);const q=[TL,TR,BR,BL];
   if(new Set(q).size<4)continue;const ar=q.map(c=>c.area);if(Math.max(...ar)/Math.min(...ar)>4)continue;
   let sgn=0,ok=true;for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],c=q[(i+2)%4];const cr=(b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);const s=Math.sign(cr);if(!sgn)sgn=s;else if(s!==sgn)ok=false}
   if(!ok)continue;const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);const s1=(d(TL,TR)+d(BL,BR))/2,s2=(d(TL,BL)+d(TR,BR))/2;const rt=Math.max(s1,s2)/Math.min(s1,s2);
   if(rt<1.12||rt>2.3)continue;if(s1*s2<w*h*0.06)continue;
   const key=q.map(c=>c.x.toFixed(0)).join();if(out.some(o=>o.key===key))continue;
   out.push({key,pts:q.map(c=>[c.x,c.y]),quadArea:s1*s2/(w*h),edge:q.some(c=>c.border)})}
  return out}

 function grade(F,pts){const {w,h,data}=F;
  const lum=(x,y)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=w||y>=h)return 255;const i=(y*w+x)*4;return data[i]*0.5+data[i+1]*0.4+data[i+2]*0.1};
  const region=(H,inn,wh)=>{let s=0;for(const [x,y] of inn){const p=mp(H,x,y);s+=lum(p[0],p[1])}s/=inn.length;
   const wv=wh.map(([x,y])=>{const p=mp(H,x,y);return lum(p[0],p[1])}).sort((a,b)=>b-a);const k=Math.max(1,Math.floor(wv.length/2));let wr=0;for(let i=0;i<k;i++)wr+=wv[i];wr/=k;
   return wr<=0?0:Math.max(0,1-s/wr)};
  const tries=[];for(let r=0;r<4;r++){const src=[0,1,2,3].map(j=>G.mk[(j+r)%4]);const H=homog(src,pts);if(!H)continue;tries.push({r,H,bd:region(H,BAR_IN,BAR_WH)})}
  tries.sort((a,b)=>b.bd-a.bd);
  if(!tries.length||tries[0].bd<0.35||(tries[1]&&tries[0].bd-tries[1].bd<0.15))return {error:'ಹಾಳೆಯ ದಿಕ್ಕು ಗುರುತಿಸಲಾಗಲಿಲ್ಲ – ಮೇಲಿನ ಕಪ್ಪು ಪಟ್ಟಿ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಬೇಕು'};
  const H=tries[0].H;
  for(const [mx,my] of G.mk){const inn=[],wh=[];for(let a=-2.5;a<=2.5;a+=1.25)for(let b=-2.5;b<=2.5;b+=1.25)inn.push([mx+a,my+b]);
   for(let k=0;k<12;k++){const t=k*Math.PI/6;wh.push([mx+6.8*Math.cos(t),my+6.8*Math.sin(t)])}
   if(region(H,inn,wh)<0.4)return {error:'ಮೂಲೆಯ ಚೌಕಗಳು ಸರಿಯಾಗಿ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ'}}
  const bub=(cx,cy)=>region(H,INNER.map(([a,b])=>[cx+a,cy+b]),RING.map(([a,b])=>[cx+a,cy+b]));
  const ansD=[];for(let q=0;q<100;q++)ansD.push([0,1,2,3].map(k=>bub(...qXY(q,k))));
  const regD=[];for(let i=0;i<9;i++){const col=[];for(let d=0;d<10;d++)col.push(bub(G.regX(i),G.regY(d)));regD.push(col)}
  const setD=[0,1,2,3].map(k=>bub(G.setX(k),G.setY));
  const all=ansD.flat().sort((a,b)=>a-b);const base=all[Math.floor(all.length*0.5)];
  const tops=ansD.map(v=>Math.max(...v)).filter(t=>t>base+0.3).sort((a,b)=>a-b);const mf=tops.length?tops[Math.floor(tops.length/2)]:base+0.6;
  const T1=base+Math.max(0.12,0.25*(mf-base)),T2=base+Math.max(0.25,0.55*(mf-base));
  const pick=v=>{const o=v.map((x,i)=>[x,i]).sort((a,b)=>b[0]-a[0]);const top=o[0][0],sec=o[1][0];
   if(top<T1)return {v:-1,d:false};if(top<T2)return {v:-1,d:true};if(sec>=T2)return {v:-2,d:true};if(sec>=T1)return {v:o[0][1],d:true};return {v:o[0][1],d:false}};
  const answers=[],doubts=[];ansD.forEach((v,q)=>{const p=pick(v);answers.push(p.v>=0?LET[p.v]:p.v===-2?'*':'');if(p.d)doubts.push(q)});
  let reg='',regDoubt=false;regD.forEach(col=>{const p=pick(col);if(p.v>=0)reg+=p.v;else{reg+='?';regDoubt=true}if(p.d)regDoubt=true});
  const sp=pick(setD);const set=sp.v>=0?LET[sp.v]:'?';const setDoubt=sp.d||sp.v<0;
  return {answers,doubts,reg,regDoubt,set,setDoubt,H,base,D:ansD}}

 function rectify(F,H,ppm=3){const W=G.W*ppm,Hh=G.H*ppm;const c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d');
  const out=x.createImageData(W,Hh),o=out.data,d=F.data;
  for(let v=0;v<Hh;v++)for(let u=0;u<W;u++){const p=mp(H,(u+0.5)/ppm,(v+0.5)/ppm);const sx=Math.round(p[0]),sy=Math.round(p[1]);const k=(v*W+u)*4;
   if(sx<0||sy<0||sx>=F.w||sy>=F.h){o[k]=o[k+1]=o[k+2]=200}else{const i=(sy*F.w+sx)*4;o[k]=d[i];o[k+1]=d[i+1];o[k+2]=d[i+2]}o[k+3]=255}
  x.putImageData(out,0,0);return c}

 // full pipeline from a canvas
 function processCanvas(fc){const Sm=smallGray(fc,800);const cands=findMarkers(Sm);if(!cands.length)return {error:'ನಾಲ್ಕು ಮೂಲೆಯ ಕಪ್ಪು ಚೌಕಗಳು ಸಿಗಲಿಲ್ಲ'};
  const F=fc.getContext('2d',{willReadFrequently:true}).getImageData(0,0,fc.width,fc.height);const Fo={w:fc.width,h:fc.height,data:F.data};
  let last=null;for(const c of cands){const g=grade(Fo,c.pts.map(([x,y])=>[x/Sm.scale,y/Sm.scale]));if(!g.error){g.rect=rectify(Fo,g.H);return g}last=g}
  return {error:(last&&last.error?last.error+'. ':'')+'ನಾಲ್ಕೂ ಮೂಲೆಯ ಚೌಕಗಳು ಪೂರ್ತಿಯಾಗಿ, ನೆರಳಿಲ್ಲದೆ ಕಾಣುವಂತೆ ಮತ್ತೆ ತೆಗೆಯಿರಿ'}}
 return {G,qXY,smallGray,findMarkers,grade,rectify,processCanvas}
})();


/* ---------- OMR ಹಾಳೆ (SVG) ---------- */
function omrSVG(cfg,st,nq){const G=OMR.G;const o=[];const F="'Noto Sans Kannada','Tunga','Nirmala UI',sans-serif";nq=nq||100;
 o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" font-family="${F}">`);
 o.push('<rect width="210" height="297" fill="#fff"/>');
 G.mk.forEach(([x,y])=>o.push(`<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="#000"/>`));
 o.push(`<rect x="${G.bar.x}" y="${G.bar.y}" width="${G.bar.w}" height="${G.bar.h}" fill="#000"/>`);
 const T=(x,y,t,sz=3,ext='')=>o.push(`<text x="${x}" y="${y}" font-size="${sz}" ${ext}>${esc(t)}</text>`);
 T(105,22,`${cfg.examName||''} ${cfg.activeYear||''}`,4.6,'text-anchor="middle" font-weight="700"');
 if(cfg.school)T(105,27.5,cfg.school,3.3,'text-anchor="middle"');
 T(105,32.3,'OMR ಉತ್ತರ ಪತ್ರಿಕೆ / OMR ANSWER SHEET',3,'text-anchor="middle" font-weight="700"');
 const L=(x1,y,x2)=>o.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="0.2"/>`);
 T(16,39.5,'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು / Name:',3);L(58,40.3,196);if(st)T(60,39.3,st.name,3.6,'font-weight="700"');
 T(16,46.5,'ತರಗತಿ / Class:',3);L(40,47.3,70);if(st)T(48,46.3,st.cls,3.6,'font-weight="700"');
 T(80,46.5,'ದಿನಾಂಕ / Date:',3);L(104,47.3,150);T(106,46.3,fmtShort(cfg.examDate),3.2);
 T(16,53.5,'ವಿದ್ಯಾರ್ಥಿಯ ಸಹಿ:',3);L(44,54.3,96);T(104,53.5,'ಕೊಠಡಿ ಮೇಲ್ವಿಚಾರಕರ ಸಹಿ:',3);L(146,54.3,196);
 o.push('<rect x="14" y="57" width="77" height="70" fill="none" stroke="#000" stroke-width="0.3"/>');
 T(52.5,61,'ನೋಂದಣಿ ಸಂಖ್ಯೆ / Registration No.',2.8,'text-anchor="middle" font-weight="700"');
 const reg=st?st.reg:'';
 for(let i=0;i<9;i++){const x=G.regX(i);o.push(`<rect x="${x-3}" y="62.3" width="6" height="6.3" fill="none" stroke="#000" stroke-width="0.25"/>`);
  if(reg)T(x,67.2,reg[i],4,'text-anchor="middle" font-weight="700"');
  for(let d=0;d<10;d++){const y=G.regY(d);const fill=reg&&+reg[i]===d;
   o.push(`<circle cx="${x}" cy="${y}" r="${G.r}" fill="${fill?'#000':'none'}" stroke="#000" stroke-width="0.25"/>`);
   if(!fill)T(x,y+0.8,d,2.1,'text-anchor="middle" fill="#c4c4c4"')}}
 o.push('<rect x="100" y="57" width="96" height="17" fill="none" stroke="#000" stroke-width="0.3"/>');
 T(104,61.6,'ಪ್ರಶ್ನೆಪತ್ರಿಕೆಯ ಸೆಟ್ / Question Paper Set',2.8,'font-weight="700"');
 for(let k=0;k<4;k++){const x=G.setX(k);o.push(`<circle cx="${x}" cy="${G.setY}" r="${G.r}" fill="none" stroke="#000" stroke-width="0.25"/>`);T(x,G.setY+0.8,LET[k],2.2,'text-anchor="middle" fill="#c4c4c4"');T(x,G.setY-2.9,LET[k],2.4,'text-anchor="middle" font-weight="700"')}
 T(148,69,'ನಿಮ್ಮ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಯ ಮೇಲಿನ',2.4);T(148,72,'ಸೆಟ್ ಅಕ್ಷರದ ವೃತ್ತ ತುಂಬಿ',2.4);
 o.push('<rect x="100" y="77" width="96" height="50" fill="none" stroke="#000" stroke-width="0.3"/>');
 T(104,82,'ಸೂಚನೆಗಳು / Instructions',3,'font-weight="700"');
 ['1. ನೀಲಿ ಅಥವಾ ಕಪ್ಪು ಬಾಲ್‌ಪೆನ್ ಮಾತ್ರ ಬಳಸಿ.','2. ವೃತ್ತವನ್ನು ಪೂರ್ತಿಯಾಗಿ ಕಪ್ಪಾಗಿ ತುಂಬಿ.','3. ಒಂದು ಪ್ರಶ್ನೆಗೆ ಒಂದೇ ವೃತ್ತ. ಉತ್ತರ ಬದಲಿಸುವಂತಿಲ್ಲ.','4. ವೈಟ್ನರ್/ರಬ್ಬರ್ ಬಳಸಬೇಡಿ. ಹಾಳೆ ಮಡಚಬೇಡಿ.','5. ಮೂಲೆಯ ಕಪ್ಪು ಚೌಕಗಳ ಮೇಲೆ ಏನನ್ನೂ ಬರೆಯಬೇಡಿ.']
  .forEach((t,i)=>T(104,88+i*5,t,2.6));
 T(104,118.5,'ಸರಿಯಾದ ವಿಧಾನ:',2.6);o.push('<circle cx="131" cy="117.6" r="1.8" fill="#000"/>');
 T(140,118.5,'ತಪ್ಪು ವಿಧಾನ:',2.6);
 [[163,'✓'],[170,'✗'],[177,'•']].forEach(([x,t])=>{o.push(`<circle cx="${x}" cy="117.6" r="1.8" fill="none" stroke="#000" stroke-width="0.25"/>`);T(x,118.6,t,2.6,'text-anchor="middle"')});
 o.push('<circle cx="184" cy="117.6" r="1.8" fill="none" stroke="#000" stroke-width="0.25"/><path d="M182.2 117.6 A1.8 1.8 0 0 0 185.8 117.6 Z" fill="#000"/>');
 T(104,124,'ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ: '+nq,2.6,'font-weight="700"');
 T(105,133,'ಉತ್ತರಗಳು / Answers',3,'text-anchor="middle" font-weight="700"');
 for(let c=0;c<4;c++){const cx=G.ansCol[c];o.push(`<rect x="${cx-2}" y="135" width="42" height="140.5" fill="none" stroke="#000" stroke-width="0.3"/>`);
  for(let k=0;k<4;k++)T(G.ansX(c,k),139.4,LET[k],2.5,'text-anchor="middle" font-weight="700"');
  for(let i=0;i<25;i++){const q=c*25+i,y=G.ansY(i);const used=q<nq;
   T(cx+7,y+0.9,q+1,2.6,`text-anchor="end" font-weight="700"${used?'':' fill="#bbb"'}`);
   for(let k=0;k<4;k++){const x=G.ansX(c,k);o.push(`<circle cx="${x}" cy="${y}" r="${G.r}" fill="none" stroke="${used?'#000':'#bbb'}" stroke-width="0.25"/>`);T(x,y+0.8,LET[k],2.1,'text-anchor="middle" fill="#c4c4c4"')}
   if(i%5===4&&i<24)o.push(`<line x1="${cx}" y1="${y+2.7}" x2="${cx+38}" y2="${y+2.7}" stroke="#d0d0d0" stroke-width="0.15"/>`)}}
 T(20,293.5,'ಸ್ಕ್ಯಾನ್ ಮಾಡುವಾಗ ನಾಲ್ಕೂ ಮೂಲೆಯ ಕಪ್ಪು ಚೌಕಗಳು ಕಾಣಬೇಕು.',2.2,'fill="#555"');
 if(st)T(190,293.5,st.reg,2.2,'text-anchor="end" fill="#555"');
 o.push('</svg>');return o.join('')}

/* ---------- ಮುದ್ರಣ ---------- */
function doPrint(html){let pa=document.getElementById('printArea');if(!pa){pa=document.createElement('div');pa.id='printArea';document.body.appendChild(pa)}pa.innerHTML=html;setTimeout(()=>window.print(),400)}
window.addEventListener('afterprint',()=>{const pa=document.getElementById('printArea');if(pa)pa.innerHTML=''});
const PRINT_CSS=`#printArea{display:none}
@media print{@page{size:A4;margin:0}html,body{margin:0!important;background:#fff!important}body>*:not(#printArea){display:none!important}#printArea{display:block!important}
.page{width:210mm;height:297mm;overflow:hidden;page-break-after:always;break-after:page;position:relative}.flow{padding:10mm 11mm}.flow table{page-break-inside:auto}.flow tr{page-break-inside:avoid;break-inside:avoid}}
.page svg{display:block}`;

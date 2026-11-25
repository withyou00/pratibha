/* ಪ್ರತಿಭಾನ್ವೇಷಣೆ – ಅಡ್ಮಿನ್ ಲಾಜಿಕ್ (admin.js) */
'use strict';
let CFG=null,IDX=null,USED={},EXAM=null,BANK=new Map(),CHUNKS={},PAPERS={},SCANS=[],IMGC={};
const P={site:'pratibha_public/site',idx:'pratibha_meta/index',used:'pratibha_meta/used',
 chunk:id=>'pratibha_qb/'+id,img:id=>'pratibha_img/'+id,exam:()=>'pratibha_exams/'+CFG.activeYear,
 paper:(c,t)=>`pratibha_exams/${CFG.activeYear}/papers/${c}_${t}`,scans:()=>`pratibha_exams/${CFG.activeYear}/scans`,mock:c=>'pratibha_public/mock_'+c};
const DEF_BP=[{sec:'gk',n:15},{sec:'mat',n:20},{sec:'ca',n:15},{sec:'lang',n:10},{sec:'ss',n:13},{sec:'sci',n:13},{sec:'math',n:14}];
const DEF_NOTES={gk:'ಭಾರತ, ಕರ್ನಾಟಕ ಮತ್ತು ಬೆಳಗಾವಿ ಜಿಲ್ಲೆಯ ಇತಿಹಾಸ, ಭೂಗೋಳ, ಸಂವಿಧಾನ, ವಿಜ್ಞಾನ, ಸಾಹಿತ್ಯ, ಕ್ರೀಡೆ ಮತ್ತು ಪ್ರಮುಖ ವ್ಯಕ್ತಿಗಳು',
 mat:'ಸಂಖ್ಯಾ ಸರಣಿ, ಅಕ್ಷರ ಸರಣಿ, ಸಂಕೇತ ಭಾಷೆ, ದಿಕ್ಕು ಮತ್ತು ದೂರ, ಸಂಬಂಧಗಳು, ಶ್ರೇಣೀಕರಣ, ಗಡಿಯಾರ, ಕ್ಯಾಲೆಂಡರ್, ಚಿತ್ರ ಆಧಾರಿತ ತಾರ್ಕಿಕತೆ, ಸರಳ ಗಣಿತೀಯ ತಾರ್ಕಿಕತೆ',
 ca:'ಈ ವರ್ಷದ ರಾಷ್ಟ್ರೀಯ, ರಾಜ್ಯ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ಪ್ರಮುಖ ಘಟನೆಗಳು, ಪ್ರಶಸ್ತಿಗಳು, ಕ್ರೀಡೆ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
 lang:'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ವ್ಯಾಕರಣ, ಪದ ಸಂಪತ್ತು, ಸಮಾನಾರ್ಥಕ/ವಿರುದ್ಧಾರ್ಥಕ ಪದಗಳು, ಗಾದೆಗಳು'};
function defCfg(){return {activeYear:'2026-27',examName:'ಪ್ರತಿಭಾನ್ವೇಷಣೆ ಪರೀಕ್ಷೆ',tagline:'7 ಮತ್ತು 8ನೇ ತರಗತಿ ವಿದ್ಯಾರ್ಥಿಗಳ ಪ್ರತಿಭೆಗೆ ಒಂದು ವೇದಿಕೆ',
 school:'',address:'',contact:'',schoolCode:'001',center:'',examDate:'2027-01-09',examTime:'ಬೆಳಿಗ್ಗೆ 10:00 ರಿಂದ 12:00',durationMin:120,hm:'',
 classes:[7,8],sets:4,caYear:2026,resultsTopN:10,announcement:'',prizeNote:'ಗಣರಾಜ್ಯೋತ್ಸವದಂದು (ಜನವರಿ 26) ಬಹುಮಾನ ವಿತರಣೆ',
 prizes:[{cls:7,title:'ಪ್ರಥಮ ಬಹುಮಾನ',amount:1000},{cls:8,title:'ಪ್ರಥಮ ಬಹುಮಾನ',amount:1000}],
 timeline:[{date:'2026-12-01',label:'ಪರೀಕ್ಷೆಯ ಘೋಷಣೆ'},{date:'2026-12-15',label:'ನೋಂದಣಿ ಕೊನೆಯ ದಿನ'},{date:'2026-12-19',label:'ಅಣಕು ಪರೀಕ್ಷೆ'},{date:'2027-01-02',label:'ಹಾಲ್ ಟಿಕೆಟ್ ವಿತರಣೆ'},{date:'2027-01-09',label:'ಮುಖ್ಯ ಪರೀಕ್ಷೆ'},{date:'2027-01-16',label:'ಫಲಿತಾಂಶ ಪ್ರಕಟಣೆ'},{date:'2027-01-26',label:'ಬಹುಮಾನ ವಿತರಣೆ'}],
 sponsors:[],rules:['ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ಬಹು ಆಯ್ಕೆಯವು. ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ 1 ಅಂಕ. ತಪ್ಪು ಉತ್ತರಕ್ಕೆ ಅಂಕ ಕಳೆಯುವುದಿಲ್ಲ.','ಉತ್ತರಗಳನ್ನು OMR ಹಾಳೆಯಲ್ಲಿ ನೀಲಿ/ಕಪ್ಪು ಬಾಲ್‌ಪೆನ್‌ನಿಂದ ವೃತ್ತ ತುಂಬಿ ಗುರುತಿಸಬೇಕು.','ಹಾಲ್ ಟಿಕೆಟ್ ಇಲ್ಲದೆ ಪರೀಕ್ಷಾ ಕೊಠಡಿಗೆ ಪ್ರವೇಶವಿಲ್ಲ.','ಮೊಬೈಲ್ ಮತ್ತು ಕ್ಯಾಲ್ಕುಲೇಟರ್ ನಿಷೇಧ.','ಸಮಾನ ಅಂಕ ಬಂದರೆ ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ, ನಂತರ ಗಣಿತ ವಿಭಾಗದ ಅಂಕ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.','ಪ್ರತಿ ತರಗತಿಗೆ ಪ್ರತ್ಯೇಕ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ ಮತ್ತು ಪ್ರತ್ಯೇಕ ಬಹುಮಾನ.'],
 blueprint:{7:DEF_BP.map(x=>({...x})),8:DEF_BP.map(x=>({...x}))},diffMix:{easy:30,medium:50,hard:20},tieOrder:['mat','math'],
 syllabus:{7:{chapters:[],notes:{...DEF_NOTES}},8:{chapters:[],notes:{...DEF_NOTES}}},syllabusView:{},catalog:{},
 results:{published:false,lists:{}},mockPublished:{}}}
const classes=()=>(CFG.classes||[]).map(Number).filter(x=>x>0);
const nqOf=c=>Math.min(100,(CFG.blueprint[c]||[]).reduce((a,b)=>a+(+b.n||0),0));
const nsets=()=>Math.max(1,Math.min(4,+CFG.sets||1));
const yy=()=>(CFG.examDate||'2027').slice(2,4);

/* ---------- UI helpers ---------- */
function toast(m,ms=2600){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',ms)}
function busy(on,txt){$('#loading').style.display=on?'flex':'none';if(txt)$('#loadTxt').textContent=txt}
function dl(name,text,type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
function openM(id){$('#'+id).classList.remove('hidden')}
function closeM(id){$('#'+id).classList.add('hidden')}
document.addEventListener('click',e=>{const c=e.target.closest('[data-close]');if(c)closeM(c.dataset.close)});
function errMsg(e){const m=String(e&&e.message||e);if(/permission|insufficient/i.test(m))return 'ಅನುಮತಿ ಇಲ್ಲ – Firestore Rules ಪರಿಶೀಲಿಸಿ';if(/offline|network|Failed to fetch/i.test(m))return 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಇಲ್ಲ';return m}
async function guard(fn,txt){busy(true,txt||'ಉಳಿಸಲಾಗುತ್ತಿದೆ…');try{return await fn()}catch(e){console.error(e);alert('ದೋಷ: '+errMsg(e))}finally{busy(false)}}
const secName=s=>(SECS[s]||{kn:s}).kn;
const chKey=q=>`${q.sec}|${q.cls}|${q.part||1}|${q.ch}`;
function chLabel(k){const [s,c,p,ch]=k.split('|');return `${c}ನೇ ತರಗತಿ ಭಾಗ-${p} • ಅಧ್ಯಾಯ ${ch}: ${CFG.catalog[k]||''}`}

/* ---------- LOGIN & LOAD ---------- */
STORE.init(async u=>{
 if(!u){$('#login').style.display='block';$('#appMain').style.display='none';$('#hdrBtns').style.display='none';return}
 if(u.uid!==ADMIN_UID){$('#login').style.display='block';$('#lgMsg').innerHTML='<span class="bad">ಈ ಖಾತೆಗೆ ಅಡ್ಮಿನ್ ಅನುಮತಿ ಇಲ್ಲ.</span>';return}
 $('#login').style.display='none';await loadAll();$('#appMain').style.display='block';$('#hdrBtns').style.display='block';
}).catch(e=>{$('#login').style.display='block';$('#lgMsg').innerHTML='<span class="bad">Firebase ಲೋಡ್ ಆಗಲಿಲ್ಲ: '+esc(errMsg(e))+'</span>'});
$('#lgBtn').onclick=async()=>{$('#lgMsg').textContent='…';try{await STORE.login($('#lgEmail').value.trim(),$('#lgPw').value)}catch(e){$('#lgMsg').innerHTML='<span class="bad">ಲಾಗಿನ್ ಆಗಲಿಲ್ಲ: ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪು</span>'}};
$('#lgPw').onkeydown=e=>{if(e.key==='Enter')$('#lgBtn').click()};
$('#logoutBtn').onclick=()=>STORE.logout();

async function loadAll(){busy(true,'ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ…');
 try{
  const saved=await STORE.get(P.site);const d=defCfg();CFG=Object.assign(d,saved||{});
  CFG.blueprint=Object.assign(d.blueprint,CFG.blueprint||{});CFG.syllabus=CFG.syllabus||{};
  classes().forEach(c=>{if(!CFG.blueprint[c])CFG.blueprint[c]=DEF_BP.map(x=>({...x}));if(!CFG.syllabus[c])CFG.syllabus[c]={chapters:[],notes:{...DEF_NOTES}};CFG.syllabus[c].notes=Object.assign({...DEF_NOTES},CFG.syllabus[c].notes||{})});
  IDX=await STORE.get(P.idx)||{chunks:{},counters:{},sizes:{},imgs:{}};['chunks','counters','sizes','imgs'].forEach(k=>IDX[k]=IDX[k]||{});
  USED=await STORE.get(P.used)||{};
  BANK=new Map();CHUNKS={};
  const ids=Object.values(IDX.chunks).flat();let n=0;
  for(const cid of ids){$('#loadTxt').textContent=`ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ… (${++n}/${ids.length})`;
   const c=await STORE.get(P.chunk(cid));if(!c)continue;CHUNKS[cid]={bucket:c.bucket,items:c.items||{},_len:IDX.sizes[cid]||blen(JSON.stringify(c))};
   for(const [id,q] of Object.entries(CHUNKS[cid].items)){BANK.set(id,Object.assign({},q,{_chunk:cid}))}}
  await loadExam();
  if(!saved){await STORE.set(P.site,CFG)}
 }catch(e){console.error(e);alert('ಲೋಡ್ ದೋಷ: '+errMsg(e))}
 busy(false);renderAll()}
async function loadExam(){EXAM=await STORE.get(P.exam())||{students:[]};EXAM.students=EXAM.students||[];PAPERS={};
 for(const c of classes())for(const t of ['final','mock']){const p=await STORE.get(P.paper(c,t));if(p)PAPERS[c+'_'+t]=p}
 SCANS=null}
function renderAll(){$('#hdrInfo').textContent=`${CFG.examName} • ${CFG.activeYear}${MOCK?' • ಪರೀಕ್ಷಾ ಮೋಡ್':''}`;
 fillClassSelects();renderDash();renderSite();renderSyl();initBankFilters();renderBank();renderPaper();renderStudents();scanKeyInfo()}
function fillClassSelects(){const o=classes().map(c=>`<option value="${c}">${c}ನೇ ತರಗತಿ</option>`).join('');
 ['#sylCls','#pCls','#rCls'].forEach(s=>{const v=$(s).value;$(s).innerHTML=o;if(v&&classes().includes(+v))$(s).value=v});
 const v=$('#prCls').value;$('#prCls').innerHTML='<option value="all">ಎಲ್ಲಾ ತರಗತಿಗಳು</option>'+o;if(v)$('#prCls').value=v}

document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
 document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.id==='t-'+b.dataset.t));
 const t=b.dataset.t;if(t!=='scan'&&cam.run)camStop();
 if(t==='dash')renderDash();if(t==='bank')renderBank();if(t==='paper')renderPaper();if(t==='syl')renderSyl();
 if(t==='scan'){scanKeyInfo();ensureScans().then(scanStat)}if(t==='res')ensureScans().then(renderResults)});

/* ---------- DASHBOARD ---------- */
function renderDash(){const act=[...BANK.values()].filter(q=>q.status!=='retired');
 const cnt=s=>act.filter(q=>q.sec===s).length;
 $('#dashStats').innerHTML=`<div class="stat"><b>${BANK.size}</b>ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು</div><div class="stat"><b>${act.length}</b>ಸಕ್ರಿಯ</div>`+
  SEC_ORDER.map(s=>`<div class="stat"><b>${cnt(s)}</b>${secName(s)}</div>`).join('')+
  `<div class="stat"><b>${EXAM.students.length}</b>ವಿದ್ಯಾರ್ಥಿಗಳು (${esc(CFG.activeYear)})</div><div class="stat"><b>${Object.keys(USED).length}</b>ಬಳಕೆಯಾದ ಪ್ರಶ್ನೆಗಳು</div>`;
 const bytes=Object.values(IDX.sizes).reduce((a,b)=>a+b,0)+Object.values(IDX.imgs).reduce((a,b)=>a+b,0)+60000;
 const pct=bytes/1073741824*100;$('#meterBar').style.width=Math.max(0.5,pct).toFixed(2)+'%';
 $('#meterTxt').textContent=`ಬಳಸಿದ್ದು ಸುಮಾರು ${(bytes/1048576).toFixed(2)} MB / 1024 MB (${pct.toFixed(2)}%). ಉಚಿತ ಮಿತಿ 1 GiB. ದಿನಕ್ಕೆ 50,000 ಓದು ಮತ್ತು 20,000 ಬರೆಯುವ ಮಿತಿ ಇದೆ.`;
 $('#yrNow').textContent=CFG.activeYear}
$('#connTest').onclick=async()=>{const out=[];const r=(ok,t)=>out.push(`<div class="${ok?'okbox':'errbox'}">${ok?'✔':'✖'} ${t}</div>`);
 busy(true,'ಪರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ…');
 try{r(!!STORE.user,'ಲಾಗಿನ್: '+esc(STORE.user&&STORE.user.email))}catch(e){}
 try{await STORE.set('pratibha_meta/ping',{t:Date.now()});const v=await STORE.get('pratibha_meta/ping');r(!!v,'ಖಾಸಗಿ ಡೇಟಾ ಬರೆಯುವುದು ಮತ್ತು ಓದುವುದು');await STORE.del('pratibha_meta/ping')}catch(e){r(false,'ಬರೆಯಲು/ಓದಲು ಆಗಲಿಲ್ಲ: '+esc(errMsg(e)))}
 try{const s=await PUB.get('pratibha_public/site');r(!!s,'ಸಾರ್ವಜನಿಕ ವೆಬ್‌ಸೈಟ್ ಮಾಹಿತಿ ಓದು (ಲಾಗಿನ್ ಇಲ್ಲದೆ)')}catch(e){r(false,'ಸಾರ್ವಜನಿಕ ಓದು: '+esc(errMsg(e)))}
 if(!MOCK){try{const url=`https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/pratibha_meta/index?key=${FB_CONFIG.apiKey}`;const x=await fetch(url);r(x.status===403||x.status===401,x.status===403||x.status===401?'ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಹೊರಗಿನವರಿಗೆ ಗುಪ್ತವಾಗಿದೆ (ಸುರಕ್ಷಿತ)':'⚠ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಹೊರಗಿನವರಿಗೂ ಕಾಣುತ್ತಿದೆ! Rules ಸರಿಪಡಿಸಿ')}catch(e){r(false,'ಸುರಕ್ಷತಾ ಪರೀಕ್ಷೆ ಆಗಲಿಲ್ಲ')}}
 busy(false);$('#connRes').innerHTML=out.join('')};
$('#newYrBtn').onclick=()=>guard(async()=>{const y=$('#newYr').value.trim();if(!/^\d{4}-\d{2}$/.test(y)){alert('ವರ್ಷವನ್ನು 2027-28 ರೂಪದಲ್ಲಿ ಬರೆಯಿರಿ');return}
 if(y===CFG.activeYear)return;if(!confirm(`${y} ವರ್ಷವನ್ನು ಆರಂಭಿಸಬೇಕೇ? ವೆಬ್‌ಸೈಟ್‌ನ ಫಲಿತಾಂಶ ಮತ್ತು ಮಾದರಿ ಪತ್ರಿಕೆ ತೆಗೆಯಲಾಗುತ್ತದೆ. ದಿನಾಂಕಗಳನ್ನು ವೆಬ್‌ಸೈಟ್ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಬದಲಿಸಿ.`))return;
 CFG.activeYear=y;CFG.results={published:false,lists:{}};for(const c of classes()){CFG.mockPublished[c]=false;try{await STORE.del(P.mock(c))}catch(e){}}
 CFG.caYear=+('20'+y.slice(2,4))||CFG.caYear;await STORE.set(P.site,CFG);await loadExam();renderAll();toast('ಹೊಸ ವರ್ಷ ಆರಂಭವಾಯಿತು')});

/* ---------- BACKUP ---------- */
async function fullBackup(){const imgs={};for(const id of Object.keys(IDX.imgs)){try{const d=await STORE.get(P.img(id));if(d)imgs[id]=d.data}catch(e){}}
 await ensureScans();
 return {kind:'pratibha-backup',v:1,at:new Date().toISOString(),cfg:CFG,questions:[...BANK.values()].map(strip),images:imgs,used:USED,exam:EXAM,papers:PAPERS,scans:SCANS||[]}}
$('#bkAll').onclick=()=>guard(async()=>{const b=await fullBackup();dl(`pratibha_backup_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(b))},'ಬ್ಯಾಕಪ್ ತಯಾರಾಗುತ್ತಿದೆ…');
$('#bkRestore').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;let b;try{b=JSON.parse(await f.text())}catch(x){alert('ಫೈಲ್ ಓದಲಾಗಲಿಲ್ಲ');return}
 if(b.kind!=='pratibha-backup'){alert('ಇದು ಪೂರ್ಣ ಬ್ಯಾಕಪ್ ಫೈಲ್ ಅಲ್ಲ. ಪ್ರಶ್ನೆಗಳ JSON ಆದರೆ "ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ → JSON ಆಮದು" ಬಳಸಿ.');return}
 if(!confirm(`ಬ್ಯಾಕಪ್ (${b.at}) ನಿಂದ ಮರುಸ್ಥಾಪಿಸಬೇಕೇ? ಪ್ರಶ್ನೆಗಳು ಸೇರುತ್ತವೆ/ನವೀಕರಣಗೊಳ್ಳುತ್ತವೆ; ಸೆಟ್ಟಿಂಗ್ಸ್, ಬಳಕೆಯ ಪಟ್ಟಿ ಮತ್ತು ಆ ವರ್ಷದ ಪರೀಕ್ಷಾ ಮಾಹಿತಿ ಬದಲಾಗುತ್ತದೆ.`))return;
 await guard(async()=>{CFG=Object.assign(defCfg(),b.cfg);await STORE.set(P.site,CFG);USED=b.used||{};await STORE.set(P.used,USED);
  const qs=(b.questions||[]).map(q=>{const x={...q};if(x.img&&x.img.startsWith('IMG:')&&b.images[x.img.slice(4)])x.img=b.images[x.img.slice(4)];return x});
  await saveQs(qs);if(b.exam)await STORE.set(P.exam(),b.exam);
  for(const [k,p] of Object.entries(b.papers||{})){const [c,t]=k.split('_');await STORE.set(P.paper(c,t),p)}
  for(const s of b.scans||[])await STORE.set(P.scans()+'/'+s.id,s);
  await loadAll();toast('ಮರುಸ್ಥಾಪನೆ ಆಯಿತು')},'ಮರುಸ್ಥಾಪಿಸಲಾಗುತ್ತಿದೆ…')};

/* ---------- SITE SETTINGS ---------- */
function renderSite(){document.querySelectorAll('[data-c]').forEach(el=>{const k=el.dataset.c;let v=CFG[k];if(k==='classes')v=classes().join(',');if(k==='rulesTxt')v=(CFG.rules||[]).join('\n');el.value=v??''});
 rowsEd('#prizeEd',CFG.prizes,[['cls','ತರಗತಿ','number'],['title','ಬಹುಮಾನ'],['amount','ಮೊತ್ತ (₹)','number']]);
 rowsEd('#tlEd',CFG.timeline,[['date','ದಿನಾಂಕ','date'],['label','ವಿವರ']]);
 rowsEd('#spEd',CFG.sponsors,[['name','ಪ್ರಾಯೋಜಕರ ಹೆಸರು'],['note','ವಿವರ (ಉದಾ: ಪ್ರಥಮ ಬಹುಮಾನ ₹1000)']])}
function rowsEd(sel,arr,cols){const el=$(sel);el.innerHTML=`<table class="t"><tr>${cols.map(c=>`<th>${c[1]}</th>`).join('')}<th></th></tr>${arr.map((r,i)=>`<tr>${cols.map(c=>`<td><input type="${c[2]||'text'}" data-i="${i}" data-k="${c[0]}" value="${esc(r[c[0]]??'')}"></td>`).join('')}<td><button class="b red sm" data-del="${i}">✕</button></td></tr>`).join('')}</table>`;
 el.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{arr[+inp.dataset.i][inp.dataset.k]=inp.type==='number'?+inp.value:inp.value});
 el.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{arr.splice(+b.dataset.del,1);rowsEd(sel,arr,cols)})}
$('#prizeAdd').onclick=()=>{try{readSite()}catch(e){};CFG.prizes.push({cls:classes()[0]||7,title:'ಪ್ರಥಮ ಬಹುಮಾನ',amount:1000});renderSite()};
$('#tlAdd').onclick=()=>{try{readSite()}catch(e){};CFG.timeline.push({date:'',label:''});renderSite()};
$('#spAdd').onclick=()=>{try{readSite()}catch(e){};CFG.sponsors.push({name:'',note:''});renderSite()};
function readSite(){document.querySelectorAll('[data-c]').forEach(el=>{const k=el.dataset.c;let v=el.value.trim();
  if(k==='classes'){const cs=[...new Set(v.split(/[,\s]+/).map(Number).filter(x=>x>0&&x<=12))];if(!cs.length)throw new Error('ಕನಿಷ್ಠ ಒಂದು ತರಗತಿ ಬೇಕು');CFG.classes=cs;return}
  if(k==='rulesTxt'){CFG.rules=v.split('\n').map(x=>x.trim()).filter(Boolean);return}
  if(['durationMin','sets','caYear','resultsTopN'].includes(k))v=+v||0;if(k==='schoolCode')v=(v.replace(/\D/g,'')||'1').padStart(3,'0').slice(-3);CFG[k]=v});}
$('#siteSave').onclick=()=>guard(async()=>{readSite();
 CFG.timeline.sort((a,b)=>String(a.date).localeCompare(String(b.date)));CFG.sponsors=CFG.sponsors.filter(s=>s.name);
 classes().forEach(c=>{if(!CFG.blueprint[c])CFG.blueprint[c]=DEF_BP.map(x=>({...x}));if(!CFG.syllabus[c])CFG.syllabus[c]={chapters:[],notes:{...DEF_NOTES}}});
 await STORE.set(P.site,CFG);renderAll();$('#siteMsg').textContent='✔ ಉಳಿಸಲಾಗಿದೆ, ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕಾಣುತ್ತದೆ';setTimeout(()=>$('#siteMsg').textContent='',3000)});

/* ---------- SYLLABUS & BLUEPRINT ---------- */
function inSyl(q,c){if(q.status==='retired')return false;const s=SECS[q.sec];if(!s)return false;
 if(s.subj)return (CFG.syllabus[c]?.chapters||[]).includes(chKey(q));
 if(q.level&&q.level!=='all'&&q.level!==levelOf(c))return false;
 if(q.sec==='ca')return +q.year===+CFG.caYear;return true}
function renderSyl(){const c=+$('#sylCls').value||classes()[0];if(!c){$('#sylBody').innerHTML='';return}
 const bp=CFG.blueprint[c],syl=CFG.syllabus[c];const tot=bp.reduce((a,b)=>a+(+b.n||0),0);
 const avail=s=>[...BANK.values()].filter(q=>q.sec===s&&inSyl(q,c)&&!USED[q.id]).length;
 let h=`<h3>${c}ನೇ ತರಗತಿ: ವಿಭಾಗವಾರು ಪ್ರಶ್ನೆಗಳು (ಒಟ್ಟು <span id="bpTot">${tot}</span>/100)</h3>
 <table class="t"><tr><th>ವಿಭಾಗ</th><th>ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ</th><th>ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಲಭ್ಯ (ಬಳಸದವು)</th></tr>${bp.map((b,i)=>{const a=avail(b.sec);return `<tr><td>${secName(b.sec)}</td><td><input type="number" min="0" max="100" data-bp="${i}" value="${b.n}" style="max-width:90px"></td><td>${a} ${a<b.n?'<span class="pill r">ಕಡಿಮೆ</span>':a<b.n*3?'<span class="pill y">ಇನ್ನಷ್ಟು ಬೇಕು</span>':'<span class="pill g">ಸಾಕು</span>'}</td></tr>`}).join('')}</table>
 <p class="note">ಮುಂದಿನ ವರ್ಷಗಳಲ್ಲಿ ಪುನರಾವರ್ತನೆ ಆಗದಿರಲು ಪ್ರತಿ ವಿಭಾಗದಲ್ಲಿ ಬೇಕಾದುದರ ಕನಿಷ್ಠ 3 ಪಟ್ಟು ಪ್ರಶ್ನೆಗಳಿರಲಿ.</p>
 <h3>ವಿಷಯಗಳ ಅಧ್ಯಾಯಗಳು</h3><button class="b sec sm" id="sylAuto">ಸ್ವಯಂ ಆಯ್ಕೆ: ${c-1}ನೇ ತರಗತಿ ಪೂರ್ಣ + ${c}ನೇ ತರಗತಿ ಭಾಗ-1</button> <button class="b sec sm" id="sylNone">ಎಲ್ಲಾ ತೆಗೆ</button>`;
 for(const s of SEC_ORDER.filter(s=>SECS[s].subj)){const keys=Object.keys(CFG.catalog).filter(k=>k.startsWith(s+'|')).sort((a,b)=>{const A=a.split('|').map(Number),B=b.split('|').map(Number);return A[1]-B[1]||A[2]-B[2]||A[3]-B[3]});
  h+=`<div style="margin-top:8px"><b>${secName(s)}</b>${keys.length?'':' <span class="note">– ಇನ್ನೂ ಅಧ್ಯಾಯಗಳಿಲ್ಲ (ಪ್ರಶ್ನೆ ಆಮದು ಮಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಸೇರಿಸಿ)</span>'}`+
   keys.map(k=>{const n=[...BANK.values()].filter(q=>chKey(q)===k&&q.status!=='retired').length;return `<label class="chk"><input type="checkbox" data-ck="${esc(k)}" ${syl.chapters.includes(k)?'checked':''}> ${esc(chLabel(k))} <span class="pill">${n} ಪ್ರಶ್ನೆ</span></label>`}).join('')+'</div>'}
 h+=`<h3>ಇತರ ವಿಭಾಗಗಳ ಪಠ್ಯಕ್ರಮ (ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕಾಣುತ್ತದೆ)</h3>`+['gk','mat','ca','lang'].map(s=>`<label class="f" style="margin-top:6px">${secName(s)}<input data-note="${s}" value="${esc(syl.notes[s]||'')}"></label>`).join('')+
 `<h3>ಸಮಾನ ಅಂಕ ಬಂದರೆ ಆದ್ಯತೆ</h3><div class="row"><select id="tie1">${SEC_ORDER.map(s=>`<option value="${s}" ${CFG.tieOrder[0]===s?'selected':''}>${secName(s)}</option>`).join('')}</select><span>ನಂತರ</span><select id="tie2">${SEC_ORDER.map(s=>`<option value="${s}" ${CFG.tieOrder[1]===s?'selected':''}>${secName(s)}</option>`).join('')}</select></div>`;
 $('#sylBody').innerHTML=h;
 document.querySelectorAll('[data-bp]').forEach(i=>i.oninput=()=>{bp[+i.dataset.bp].n=Math.max(0,+i.value||0);$('#bpTot').textContent=bp.reduce((a,b)=>a+(+b.n||0),0)});
 document.querySelectorAll('[data-ck]').forEach(i=>i.onchange=()=>{const k=i.dataset.ck;syl.chapters=syl.chapters.filter(x=>x!==k);if(i.checked)syl.chapters.push(k)});
 document.querySelectorAll('[data-note]').forEach(i=>i.oninput=()=>{syl.notes[i.dataset.note]=i.value});
 $('#tie1').onchange=$('#tie2').onchange=()=>{CFG.tieOrder=[$('#tie1').value,$('#tie2').value]};
 $('#sylAuto').onclick=()=>{syl.chapters=Object.keys(CFG.catalog).filter(k=>{const [s,cl,p]=k.split('|');return +cl===c-1||(+cl===c&&+p===1)});renderSyl()};
 $('#sylNone').onclick=()=>{syl.chapters=[];renderSyl()}}
$('#sylCls').onchange=renderSyl;
$('#catAdd').onclick=()=>guard(async()=>{const k=`${$('#catSec').value}|${+$('#catCls').value}|${+$('#catPart').value}|${+$('#catCh').value}`;const t=$('#catTitle').value.trim();
 if(!+$('#catCls').value||!+$('#catCh').value||!t){alert('ತರಗತಿ, ಅಧ್ಯಾಯ ಸಂಖ್ಯೆ ಮತ್ತು ಹೆಸರು ಬೇಕು');return}CFG.catalog[k]=t;await STORE.set(P.site,CFG);$('#catTitle').value='';$('#catCh').value='';renderSyl();toast('ಅಧ್ಯಾಯ ಸೇರಿಸಲಾಗಿದೆ')});
function buildSylView(){const v={};for(const c of classes()){const syl=CFG.syllabus[c];const sub={};
  for(const k of syl.chapters){if(!CFG.catalog[k])continue;const s=k.split('|')[0];(sub[s]=sub[s]||[]).push(chLabel(k))}
  v[c]={subjects:SEC_ORDER.filter(s=>SECS[s].subj&&sub[s]).map(s=>({sec:s,name:secName(s),items:sub[s].sort()})),notes:syl.notes,
   pattern:CFG.blueprint[c].filter(b=>+b.n>0).map(b=>({sec:b.sec,name:secName(b.sec),n:+b.n})),total:nqOf(c)}}
 CFG.syllabusView=v}
$('#sylSave').onclick=()=>guard(async()=>{for(const c of classes()){if(nqOf(c)>100)throw new Error(`${c}ನೇ ತರಗತಿಯ ಒಟ್ಟು ಪ್ರಶ್ನೆ 100 ಮೀರಬಾರದು`)}
 buildSylView();await STORE.set(P.site,CFG);$('#sylMsg').textContent='✔ ಉಳಿಸಲಾಗಿದೆ';setTimeout(()=>$('#sylMsg').textContent='',3000)});

/* ---------- QUESTION BANK STORAGE ---------- */
const PREFIX={sci:'SC',math:'MA',ss:'SS',gk:'GK',mat:'MAT',lang:'LN'};
function prefixOf(q){return q.sec==='ca'?'CA'+String(q.year).slice(2):PREFIX[q.sec]||'Q'}
function newId(q){const p=prefixOf(q);let n=IDX.counters[p]||0;let id;do{n++;id=`${p}-${String(n).padStart(4,'0')}`}while(BANK.has(id));IDX.counters[p]=n;return id}
function bucketOf(q){if(SECS[q.sec].subj)return `${q.sec}_${q.cls}_${q.ch}`;if(q.sec==='ca')return `ca_${q.year}`;return `${q.sec}_${q.level||'jr'}`}
function strip(q){const o={...q};delete o._chunk;return o}
function pickChunk(b){const list=IDX.chunks[b]||(IDX.chunks[b]=[]);for(const cid of list){if(CHUNKS[cid]&&CHUNKS[cid]._len<700000)return cid}
 let i=list.length,cid;do{cid=`${b}_${i++}`}while(CHUNKS[cid]);list.push(cid);CHUNKS[cid]={bucket:b,items:{},_len:40};return cid}
async function putImg(q){if(q.img&&q.img.startsWith('data:')){const id='IMG-'+q.id.replace(/[^\w-]/g,'_');const sz=await STORE.set(P.img(id),{data:q.img});IDX.imgs[id]=sz;IMGC[id]=q.img;q.img='IMG:'+id}}
async function saveQs(list,onProg){const touched=new Set();let i=0;const ids=[];
 for(const q0 of list){const q={...q0};delete q._chunk;if(onProg)onProg(++i,list.length);
  if(!q.id)q.id=newId(q);ids.push(q.id);await putImg(q);q.updated=Date.now();
  const old=BANK.get(q.id);const b=bucketOf(q);
  if(old&&old._chunk&&CHUNKS[old._chunk]&&CHUNKS[old._chunk].bucket!==b){const oc=CHUNKS[old._chunk];oc._len-=blen(JSON.stringify(oc.items[q.id]||{}));delete oc.items[q.id];touched.add(old._chunk)}
  const cid=(old&&old._chunk&&CHUNKS[old._chunk]&&CHUNKS[old._chunk].bucket===b)?old._chunk:pickChunk(b);
  const c=CHUNKS[cid];if(c.items[q.id])c._len-=blen(JSON.stringify(c.items[q.id]));c.items[q.id]=q;c._len+=blen(JSON.stringify(q))+10;
  BANK.set(q.id,Object.assign({},q,{_chunk:cid}));touched.add(cid);
  if(SECS[q.sec].subj&&q.ch_kn&&!CFG.catalog[chKey(q)])CFG.catalog[chKey(q)]=q.ch_kn}
 await flushChunks(touched);await STORE.set(P.site,CFG);return ids}
async function flushChunks(touched){for(const cid of touched){const c=CHUNKS[cid];if(!c)continue;
  if(!Object.keys(c.items).length){await STORE.del(P.chunk(cid));delete CHUNKS[cid];delete IDX.sizes[cid];IDX.chunks[c.bucket]=(IDX.chunks[c.bucket]||[]).filter(x=>x!==cid);if(!IDX.chunks[c.bucket].length)delete IDX.chunks[c.bucket];continue}
  const sz=await STORE.set(P.chunk(cid),{bucket:c.bucket,items:c.items});IDX.sizes[cid]=sz;c._len=sz}
 await STORE.set(P.idx,IDX)}
async function deleteQs(ids){const touched=new Set();for(const id of ids){const q=BANK.get(id);if(!q)continue;const c=CHUNKS[q._chunk];if(c){delete c.items[id];touched.add(q._chunk)}BANK.delete(id);
  if(q.img&&q.img.startsWith('IMG:')){const iid=q.img.slice(4);try{await STORE.del(P.img(iid))}catch(e){}delete IDX.imgs[iid]}}
 await flushChunks(touched)}
async function getImg(ref){if(!ref)return '';if(!ref.startsWith('IMG:'))return ref;const id=ref.slice(4);if(IMGC[id])return IMGC[id];const d=await STORE.get(P.img(id));IMGC[id]=d?d.data:'';return IMGC[id]}

/* ---------- NORMALISE / VALIDATE ---------- */
const SUBJ_MAP={science:'sci',sci:'sci',vijnana:'sci',maths:'math',math:'math',mathematics:'math',ganita:'math',social:'ss',ss:'ss','social science':'ss',socialscience:'ss',gk:'gk','general knowledge':'gk',mat:'mat','mental ability':'mat',ca:'ca','current affairs':'ca',lang:'lang',language:'lang'};
function normQ(r){const e=[];const t=v=>String(v??'').trim();
 const sec=SUBJ_MAP[t(r.sec||r.subj).toLowerCase()];if(!sec)e.push('ವಿಭಾಗ ಗೊತ್ತಿಲ್ಲ ('+t(r.sec||r.subj)+')');
 const q={id:t(r.id)||'',sec:sec||'gk',diff:['easy','medium','hard'].includes(t(r.diff))?t(r.diff):'medium',
  q_kn:t(r.q_kn),q_en:t(r.q_en),opt_kn:(r.opt_kn||[]).map(t),opt_en:(r.opt_en||[]).map(t),ans:t(r.ans).toUpperCase(),exp_kn:t(r.exp_kn),
  img:t(r.img),status:r.status==='retired'?'retired':'active',volatile:!!r.volatile,src:t(r.src)};
 if(sec&&SECS[sec].subj){q.cls=+r.cls;q.part=+r.part||1;q.ch=+r.ch;q.ch_kn=t(r.ch_kn);if(!q.cls)e.push('ತರಗತಿ ಇಲ್ಲ');if(!q.ch)e.push('ಅಧ್ಯಾಯ ಸಂಖ್ಯೆ ಇಲ್ಲ')}
 else{q.level=['jr','sr','all'].includes(t(r.level))?t(r.level):'jr';if(sec==='ca'){q.year=+r.year||+CFG.caYear}}
 if(!q.q_kn)e.push('ಕನ್ನಡ ಪ್ರಶ್ನೆ ಇಲ್ಲ');
 if(q.opt_kn.length!==4||q.opt_kn.some(x=>!x))e.push('ಕನ್ನಡದಲ್ಲಿ 4 ಆಯ್ಕೆಗಳು ಬೇಕು');
 if(q.q_en&&(q.opt_en.length!==4||q.opt_en.some(x=>!x)))e.push('ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ 4 ಆಯ್ಕೆಗಳು ಬೇಕು');
 if(!q.q_en){q.opt_en=[]}
 if(!LET.includes(q.ans))e.push('ಸರಿಯುತ್ತರ A/B/C/D ಆಗಿರಬೇಕು');
 if(q.opt_kn.length===4&&new Set(q.opt_kn).size<4)e.push('ಆಯ್ಕೆಗಳು ಪುನರಾವರ್ತನೆಯಾಗಿವೆ');
 return {q,e}}

/* ---------- BANK UI ---------- */
let bankShown=50;
function initBankFilters(){$('#fSec').innerHTML='<option value="">ಎಲ್ಲಾ</option>'+SEC_ORDER.map(s=>`<option value="${s}">${secName(s)}</option>`).join('');updChFilter()}
function updChFilter(){const s=$('#fSec').value;const cls=[...new Set([...BANK.values()].filter(q=>!s||q.sec===s).map(q=>q.cls).filter(Boolean))].sort((a,b)=>a-b);
 const cv=$('#fCls').value;$('#fCls').innerHTML='<option value="">ಎಲ್ಲಾ</option>'+cls.map(c=>`<option value="${c}">${c}</option>`).join('');if(cls.includes(+cv))$('#fCls').value=cv;
 const c=$('#fCls').value;const chs=[...new Set([...BANK.values()].filter(q=>(!s||q.sec===s)&&(!c||q.cls==c)&&q.ch).map(q=>chKey(q)))].sort();
 const hv=$('#fCh').value;$('#fCh').innerHTML='<option value="">ಎಲ್ಲಾ</option>'+chs.map(k=>`<option value="${esc(k)}">${esc(secName(k.split('|')[0])+' '+chLabel(k))}</option>`).join('');if(chs.includes(hv))$('#fCh').value=hv}
['#fSec','#fCls'].forEach(s=>$(s).onchange=()=>{updChFilter();bankShown=50;renderBank()});
['#fCh','#fStat','#fDiff'].forEach(s=>$(s).onchange=()=>{bankShown=50;renderBank()});
$('#fTxt').oninput=()=>{bankShown=50;clearTimeout($('#fTxt')._h);$('#fTxt')._h=setTimeout(renderBank,250)};
function filtered(){const s=$('#fSec').value,c=$('#fCls').value,h=$('#fCh').value,st=$('#fStat').value,d=$('#fDiff').value,tx=$('#fTxt').value.trim().toLowerCase();
 return [...BANK.values()].filter(q=>(!s||q.sec===s)&&(!c||q.cls==c)&&(!h||chKey(q)===h)&&(!d||q.diff===d)&&
  (st===''||(st==='active'&&q.status!=='retired')||(st==='retired'&&q.status==='retired')||(st==='volatile'&&q.volatile&&q.status!=='retired')||(st==='used'&&USED[q.id])||(st==='unused'&&!USED[q.id]&&q.status!=='retired'))&&
  (!tx||q.id.toLowerCase().includes(tx)||q.q_kn.toLowerCase().includes(tx)||(q.q_en||'').toLowerCase().includes(tx))).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}))}
function qCard(q){const used=USED[q.id];return `<div class="qcard ${q.status==='retired'?'ret':''}"><div class="top"><span><b>${esc(q.id)}</b> • ${secName(q.sec)}${q.cls?` • ${q.cls}ನೇ ಭಾಗ-${q.part||1} ಅ.${q.ch}`:''}${q.sec==='ca'?` • ${q.year}`:''}${q.level&&!q.cls?` • ${{jr:'7–8',sr:'9–10',all:'ಎಲ್ಲರಿಗೂ'}[q.level]}`:''}</span>
 <span><span class="pill ${q.diff==='hard'?'r':q.diff==='easy'?'g':'y'}">${DIFF[q.diff]}</span>${q.status==='retired'?'<span class="pill">ನಿವೃತ್ತ</span>':''}${q.volatile?'<span class="pill y">ಬದಲಾಗಬಹುದು</span>':''}${used?used.map(u=>`<span class="pill b">${esc(u)}</span>`).join(''):''}</span></div>
 <div class="qt">${esc(q.q_kn)}</div>${q.q_en?`<div class="note" style="margin:0">${esc(q.q_en)}</div>`:''}${q.img?`<div data-img="${esc(q.img)}"></div>`:''}
 <ol>${q.opt_kn.map((o,i)=>`<li class="${LET[i]===q.ans?'ok':''}">${LET[i]}) ${esc(o)}${q.opt_en[i]?` <span class="note">/ ${esc(q.opt_en[i])}</span>`:''}</li>`).join('')}</ol>
 ${q.exp_kn?`<div class="note">💡 ${esc(q.exp_kn)}</div>`:''}
 <div><button class="b sec sm" data-ed="${esc(q.id)}">✎ ತಿದ್ದು</button><button class="b sec sm" data-tg="${esc(q.id)}">${q.status==='retired'?'▶ ಸಕ್ರಿಯಗೊಳಿಸು':'⏸ ನಿವೃತ್ತಿ'}</button>${q.volatile&&q.status!=='retired'?`<button class="b green sm" data-ok="${esc(q.id)}">✔ ಈ ವರ್ಷ ಸರಿ ಇದೆ</button>`:''}<button class="b red sm" data-dl="${esc(q.id)}">🗑</button></div></div>`}
function renderBank(){const list=filtered();$('#bankCount').textContent=list.length+' / '+BANK.size;
 $('#bankList').innerHTML=list.length?list.slice(0,bankShown).map(qCard).join(''):'<p class="note">ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇಲ್ಲ. ಮೇಲಿನ ಬಟನ್‌ಗಳಿಂದ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ.</p>';
 $('#bankMore').innerHTML=list.length>bankShown?`<button class="b sec" id="moreBtn">ಇನ್ನಷ್ಟು ತೋರಿಸು (${list.length-bankShown})</button>`:'';
 if($('#moreBtn'))$('#moreBtn').onclick=()=>{bankShown+=100;renderBank()};
 document.querySelectorAll('#bankList [data-img]').forEach(async d=>{const u=await getImg(d.dataset.img);if(u)d.innerHTML=`<img src="${u}">`});
 document.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>openQ(BANK.get(b.dataset.ed)));
 document.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>guard(async()=>{const q=BANK.get(b.dataset.tg);await saveQs([{...q,status:q.status==='retired'?'active':'retired'}]);renderBank()}));
 document.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>guard(async()=>{const q=BANK.get(b.dataset.ok);await saveQs([{...q,checked:CFG.activeYear}]);toast('ಪರಿಶೀಲಿಸಲಾಗಿದೆ');renderBank()}));
 document.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{const id=b.dataset.dl;const msg=USED[id]?'ಈ ಪ್ರಶ್ನೆ ಹಿಂದಿನ ಪತ್ರಿಕೆಯಲ್ಲಿ ಬಳಕೆಯಾಗಿದೆ. ಅಳಿಸುವ ಬದಲು "ನಿವೃತ್ತಿ" ಉತ್ತಮ. ಆದರೂ ಅಳಿಸಬೇಕೇ?':'ಈ ಪ್ರಶ್ನೆಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಬೇಕೇ?';if(confirm(msg))guard(async()=>{await deleteQs([id]);renderBank()},'ಅಳಿಸಲಾಗುತ್ತಿದೆ…')})}
$('#bulkRetire').onclick=()=>{const l=filtered().filter(q=>q.status!=='retired');if(!l.length){alert('ಫಿಲ್ಟರ್‌ನಲ್ಲಿ ಸಕ್ರಿಯ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ');return}
 if(confirm(`${l.length} ಪ್ರಶ್ನೆಗಳನ್ನು ನಿವೃತ್ತಿಗೊಳಿಸಬೇಕೇ?`))guard(async()=>{await saveQs(l.map(q=>({...q,status:'retired'})));renderBank()})};
$('#bulkActivate').onclick=()=>{const l=filtered().filter(q=>q.status==='retired');if(!l.length){alert('ಫಿಲ್ಟರ್‌ನಲ್ಲಿ ನಿವೃತ್ತ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ');return}
 if(confirm(`${l.length} ಪ್ರಶ್ನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಬೇಕೇ?`))guard(async()=>{await saveQs(l.map(q=>({...q,status:'active'})));renderBank()})};
$('#caDel').onclick=()=>{const y=+$('#caDelYr').value;if(!y){alert('ವರ್ಷ ಬರೆಯಿರಿ');return}const l=[...BANK.values()].filter(q=>q.sec==='ca'&&+q.year<y);
 if(!l.length){alert('ಆ ವರ್ಷಕ್ಕಿಂತ ಹಳೆಯ ಪ್ರಚಲಿತ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ');return}
 if(!confirm(`${y} ಕ್ಕಿಂತ ಹಳೆಯ ${l.length} ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಳಿಸಬೇಕೇ? ಮೊದಲು ಅವುಗಳ ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತದೆ.`))return;
 guard(async()=>{dl(`pratibha_ca_before_${y}.json`,JSON.stringify({questions:l.map(strip)}));await deleteQs(l.map(q=>q.id));renderBank();renderDash()},'ಅಳಿಸಲಾಗುತ್ತಿದೆ…')};
$('#bankExport').onclick=()=>guard(async()=>{const l=filtered();const qs=[];for(const q of l){const x=strip(q);if(x.img&&x.img.startsWith('IMG:'))x.img=await getImg(x.img);qs.push(x)}
 dl(`pratibha_questions_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({bank:'pratibha',count:qs.length,questions:qs},null,1))},'ತಯಾರಾಗುತ್ತಿದೆ…');

/* ---------- QUESTION EDITOR ---------- */
let qmEdit=null,qmImg='';
function openQ(q){qmEdit=q||null;$('#qmTitle').textContent=q?'ಪ್ರಶ್ನೆ ತಿದ್ದು – '+q.id:'ಹೊಸ ಪ್ರಶ್ನೆ';
 $('#qmSec').innerHTML=SEC_ORDER.map(s=>`<option value="${s}">${secName(s)}</option>`).join('');
 const d=q||{sec:$('#fSec').value||'gk',cls:+$('#fCls').value||6,part:1,level:'jr',year:CFG.caYear,diff:'medium',q_kn:'',q_en:'',opt_kn:['','','',''],opt_en:['','','',''],ans:'A',exp_kn:'',img:'',volatile:false};
 $('#qmSec').value=d.sec;$('#qmCls').value=d.cls||6;$('#qmPart').value=d.part||1;$('#qmLevel').value=d.level||'jr';$('#qmYear').value=d.year||CFG.caYear;$('#qmDiff').value=d.diff;$('#qmVol').checked=!!d.volatile;
 $('#qmQkn').value=d.q_kn;$('#qmQen').value=d.q_en||'';$('#qmAns').value=d.ans;$('#qmExp').value=d.exp_kn||'';
 $('#qmOkn').innerHTML=LET.map((L,i)=>`<label class="f" style="margin-top:4px">${L}) <input data-ok-kn="${i}" value="${esc(d.opt_kn[i]||'')}"></label>`).join('');
 $('#qmOen').innerHTML=LET.map((L,i)=>`<label class="f" style="margin-top:4px">${L}) <input data-ok-en="${i}" value="${esc((d.opt_en||[])[i]||'')}"></label>`).join('');
 qmImg=d.img||'';showQmImg();qmSecChange(d.ch);$('#qmMsg').textContent='';openM('qModal')}
async function showQmImg(){const u=await getImg(qmImg);$('#qmImgPrev').innerHTML=u?`<img src="${u}" style="max-width:260px;max-height:180px;border:1px solid #ccc;border-radius:6px">`:''}
function qmSecChange(ch){const s=$('#qmSec').value;const subj=SECS[s].subj;document.querySelectorAll('.qmSub').forEach(e=>e.style.display=subj?'':'none');
 document.querySelectorAll('.qmNon').forEach(e=>e.style.display=subj?'none':'');document.querySelectorAll('.qmCa').forEach(e=>e.style.display=s==='ca'?'':'none');
 if(subj){const c=+$('#qmCls').value,p=+$('#qmPart').value;const ks=Object.keys(CFG.catalog).filter(k=>{const a=k.split('|');return a[0]===s&&+a[1]===c&&+a[2]===p}).sort((a,b)=>+a.split('|')[3]-+b.split('|')[3]);
  $('#qmCh').innerHTML=ks.length?ks.map(k=>`<option value="${k.split('|')[3]}">${k.split('|')[3]}. ${esc(CFG.catalog[k])}</option>`).join(''):'<option value="">– ಪಠ್ಯಕ್ರಮ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಅಧ್ಯಾಯ ಸೇರಿಸಿ –</option>';if(ch)$('#qmCh').value=ch}}
['#qmSec','#qmCls','#qmPart'].forEach(s=>$(s).onchange=()=>qmSecChange());
$('#qAddBtn').onclick=()=>openQ(null);
$('#qmImgIn').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;qmImg=await compressImg(f);showQmImg()};
$('#qmImgDel').onclick=()=>{qmImg='';showQmImg()};
function compressImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{let w=im.naturalWidth,h=im.naturalHeight;const sc=Math.min(1,800/w,800/h);w=Math.round(w*sc);h=Math.round(h*sc);
 const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(im,0,0,w,h);let q=0.8,d=c.toDataURL('image/jpeg',q);while(d.length>80000&&q>0.35){q-=0.1;d=c.toDataURL('image/jpeg',q)}URL.revokeObjectURL(u);res(d)};im.onerror=rej;im.src=u})}
$('#qmSave').onclick=()=>{const s=$('#qmSec').value;const r={id:qmEdit?qmEdit.id:'',sec:s,cls:+$('#qmCls').value,part:+$('#qmPart').value,ch:+$('#qmCh').value,
  level:$('#qmLevel').value,year:+$('#qmYear').value,diff:$('#qmDiff').value,volatile:$('#qmVol').checked,q_kn:$('#qmQkn').value,q_en:$('#qmQen').value,
  opt_kn:LET.map((_,i)=>$(`[data-ok-kn="${i}"]`).value),opt_en:LET.map((_,i)=>$(`[data-ok-en="${i}"]`).value),ans:$('#qmAns').value,exp_kn:$('#qmExp').value,img:qmImg,
  status:qmEdit?qmEdit.status:'active',src:qmEdit?qmEdit.src:'ಅಡ್ಮಿನ್'};
 if(SECS[s].subj)r.ch_kn=CFG.catalog[`${s}|${r.cls}|${r.part}|${r.ch}`]||'';
 const {q,e}=normQ(r);if(e.length){$('#qmMsg').innerHTML='<span class="bad">'+e.map(esc).join('<br>')+'</span>';return}
 guard(async()=>{const list=[];
  if(qmEdit&&qmEdit.ans!==q.ans&&USED[qmEdit.id]){if(confirm('ಈ ಪ್ರಶ್ನೆ ಹಿಂದಿನ ಪತ್ರಿಕೆಯಲ್ಲಿ ಬಳಕೆಯಾಗಿದೆ ಮತ್ತು ಉತ್ತರ ಬದಲಾಗಿದೆ. ಹಳೆಯದನ್ನು ನಿವೃತ್ತಿಗೊಳಿಸಿ ಹೊಸ ID ಯಲ್ಲಿ ಉಳಿಸಬೇಕೇ?\n(ಸರಿ = ಹೊಸ ID, ರದ್ದು = ಅದೇ ID ಯಲ್ಲಿ ತಿದ್ದು)')){list.push({...qmEdit,status:'retired'});q.id='';q.replaces=qmEdit.id}}
  list.push(q);const ids=await saveQs(list);closeM('qModal');updChFilter();renderBank();toast('ಉಳಿಸಲಾಗಿದೆ: '+ids[ids.length-1])})};

/* ---------- IMPORT ---------- */
let impData=null;
$('#jsonIn').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;let d;try{d=JSON.parse(await f.text())}catch(x){alert('JSON ಫೈಲ್ ಓದಲಾಗಲಿಲ್ಲ: '+x.message);return}
 const arr=Array.isArray(d)?d:(d.questions||[]);if(!arr.length){alert('ಫೈಲ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ');return}previewImport(arr,f.name)};
const CMP_KEYS=['sec','cls','part','ch','level','year','diff','q_kn','q_en','opt_kn','opt_en','ans','exp_kn','volatile'];
function sameQ(a,b){if(CMP_KEYS.some(k=>JSON.stringify(a[k]??'')!==JSON.stringify(b[k]??'')))return false;if(b.img&&!(b.img.startsWith('data:')&&a.img&&a.img.startsWith('IMG:'))&&b.img!==a.img)return false;return true}
function previewImport(arr,name){const ok=[],bad=[],dup=[],same=[];
 arr.forEach((r,i)=>{const {q,e}=normQ(r);if(e.length){bad.push({i,id:r.id,e});return}
  if(q.id&&BANK.has(q.id)){if(sameQ(BANK.get(q.id),q))same.push(q);else dup.push(q);return}
  ok.push(q)});
 impData={ok,dup,same};
 $('#impBody').innerHTML=`<p><b>${esc(name)}</b>: ಒಟ್ಟು ${arr.length}</p>
 <div class="okbox">✔ ಹೊಸ ಪ್ರಶ್ನೆಗಳು: <b>${ok.length}</b></div>
 ${dup.length?`<div class="warn">⚠ ಈಗಾಗಲೇ ಇರುವ ID ಗಳು, ವಿಷಯ ಬದಲಾಗಿದೆ: <b>${dup.length}</b> (${dup.slice(0,8).map(q=>esc(q.id)).join(', ')}${dup.length>8?'…':''})<br>
  <label class="chk"><input type="radio" name="dupAct" value="skip" checked> ಬಿಟ್ಟುಬಿಡು (ಹಳೆಯದೇ ಉಳಿಯಲಿ)</label><label class="chk"><input type="radio" name="dupAct" value="update"> ಹೊಸದರಿಂದ ನವೀಕರಿಸು (ತಿದ್ದುಪಡಿ)</label></div>`:''}
 ${same.length?`<div class="note">ಈಗಾಗಲೇ ಇರುವ, ಬದಲಾವಣೆ ಇಲ್ಲದವು (ಬಿಡಲಾಗುತ್ತದೆ): ${same.length}</div>`:''}
 ${bad.length?`<div class="errbox">✖ ದೋಷವಿರುವವು (ಸೇರಿಸುವುದಿಲ್ಲ): <b>${bad.length}</b><br>${bad.slice(0,15).map(b=>`#${b.i+1} ${esc(b.id||'')}: ${b.e.map(esc).join(', ')}`).join('<br>')}</div>`:''}
 <button class="b green" id="impGo" ${ok.length||dup.length?'':'disabled'}>✔ ಬ್ಯಾಂಕ್‌ಗೆ ಸೇರಿಸು</button>`;
 openM('impModal');
 $('#impGo').onclick=()=>{const upd=(document.querySelector('input[name=dupAct]:checked')||{}).value==='update';const list=[...impData.ok,...(upd?impData.dup.map(q=>({...q,status:BANK.get(q.id).status})):[])];
  guard(async()=>{await saveQs(list,(i,n)=>{$('#loadTxt').textContent=`ಸೇರಿಸಲಾಗುತ್ತಿದೆ… ${i}/${n}`});closeM('impModal');updChFilter();renderBank();renderDash();toast(`${list.length} ಪ್ರಶ್ನೆಗಳು ಸೇರಿವೆ`)},'ಸೇರಿಸಲಾಗುತ್ತಿದೆ…')}}
const CSV_COLS=['sec','cls','part','ch','ch_kn','level','year','diff','q_kn','q_en','opt_a_kn','opt_b_kn','opt_c_kn','opt_d_kn','opt_a_en','opt_b_en','opt_c_en','opt_d_en','ans','exp_kn','volatile'];
$('#csvTpl').onclick=()=>{const rows=[CSV_COLS,['gk','','','','','jr','','medium','ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಪಕ್ಷಿ ಯಾವುದು?','Which is the national bird of India?','ನವಿಲು','ಗಿಳಿ','ಹಂಸ','ಗರುಡ','Peacock','Parrot','Swan','Eagle','A','',''],
 ['ca','','','','','jr','2026','medium','(ಪ್ರಚಲಿತ ಘಟನೆಯ ಪ್ರಶ್ನೆ)','(Current affairs question)','..','..','..','..','..','..','..','..','B','','1'],
 ['sci','7','1','3','ಅಧ್ಯಾಯದ ಹೆಸರು','','','hard','(ವಿಜ್ಞಾನ ಪ್ರಶ್ನೆ)','(Science question)','..','..','..','..','..','..','..','..','C','ವಿವರಣೆ','']];
 dl('pratibha_question_template.csv','﻿'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv')};
function parseCSV(t){t=t.replace(/^﻿/,'');const rows=[];let row=[],f='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];
  if(q){if(ch==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}
  else if(ch==='"')q=true;else if(ch===','){row.push(f);f=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f=''}else f+=ch}
 if(f!==''||row.length){row.push(f);rows.push(row)}return rows.filter(r=>r.some(x=>x.trim()!==''))}
$('#csvIn').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const rows=parseCSV(await f.text());if(rows.length<2){alert('CSV ಖಾಲಿ ಇದೆ');return}
 const h=rows[0].map(x=>x.trim());const miss=['sec','q_kn','ans'].filter(c=>!h.includes(c));if(miss.length){alert('ಈ ಕಾಲಂಗಳು ಬೇಕು: '+miss.join(', ')+'. ಮಾದರಿ ಫೈಲ್ ಬಳಸಿ.');return}
 const arr=rows.slice(1).map(r=>{const o={};h.forEach((k,i)=>o[k]=(r[i]||'').trim());return {sec:o.sec,cls:o.cls,part:o.part,ch:o.ch,ch_kn:o.ch_kn,level:o.level,year:o.year,diff:o.diff,q_kn:o.q_kn,q_en:o.q_en,
  opt_kn:[o.opt_a_kn,o.opt_b_kn,o.opt_c_kn,o.opt_d_kn],opt_en:[o.opt_a_en,o.opt_b_en,o.opt_c_en,o.opt_d_en],ans:o.ans,exp_kn:o.exp_kn,volatile:/^(1|yes|y|true|ಹೌದು)$/i.test(o.volatile||''),id:o.id||'',src:'Excel'}});
 previewImport(arr,f.name)};

/* ---------- PAPER GENERATION ---------- */
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function paperLabel(c,t){return `${CFG.activeYear} ${t==='final'?'ಮುಖ್ಯ':'ಮಾದರಿ'} ${c}ನೇ`}
function excludeFor(c,t){const ex=new Set();const mine=paperLabel(c,t);for(const [id,labs] of Object.entries(USED)){if(labs.some(l=>l!==mine))ex.add(id)}
 const other=PAPERS[`${c}_${t==='final'?'mock':'final'}`];if(other)other.qs.forEach(q=>ex.add(q.id));return ex}
function poolFor(c,sec,ex){return [...BANK.values()].filter(q=>q.sec===sec&&inSyl(q,c)&&!ex.has(q.id))}
function pickMix(pool,n,r){const mix=CFG.diffMix;const by={easy:[],medium:[],hard:[]};shuffle(pool,r).forEach(q=>(by[q.diff]||by.medium).push(q));
 const want={easy:Math.round(n*mix.easy/100),hard:Math.round(n*mix.hard/100)};want.medium=n-want.easy-want.hard;const out=[];
 for(const d of ['easy','medium','hard'])out.push(...by[d].splice(0,want[d]));const rest=shuffle([...by.easy,...by.medium,...by.hard],r);while(out.length<n&&rest.length)out.push(rest.shift());
 const ord={easy:0,medium:1,hard:2};return shuffle(out,r).sort((a,b)=>ord[a.diff]-ord[b.diff])}
function availTable(c,t){const ex=excludeFor(c,t);return `<table class="t"><tr><th>ವಿಭಾಗ</th><th>ಬೇಕು</th><th>ಲಭ್ಯ</th></tr>${CFG.blueprint[c].filter(b=>+b.n>0).map(b=>{const a=poolFor(c,b.sec,ex).length;return `<tr><td>${secName(b.sec)}</td><td>${b.n}</td><td>${a} ${a<b.n?'<span class="pill r">ಕೊರತೆ '+(b.n-a)+'</span>':'<span class="pill g">ಸರಿ</span>'}</td></tr>`}).join('')}</table>`}
function buildSets(p){const r=rng(p.seed+7);p.sets={};p.keys={};const n=p.qs.length;
 LET.slice(0,nsets()).forEach((L,si)=>{let perm=[...Array(n).keys()];if(si>0){perm=[];for(const s of p.sections){const idx=[];for(let i=s.from;i<=s.to;i++)idx.push(i);perm.push(...shuffle(idx,r))}}
  p.sets[L]=perm;p.keys[L]=perm.map(i=>p.qs[i].ans).join('')})}
async function genPaper(c,t){const ex=excludeFor(c,t);const seed=Date.now()%2147483647;const r=rng(seed);const qs=[],sections=[],short=[];
 for(const b of CFG.blueprint[c]){const n=+b.n;if(!n)continue;const pool=poolFor(c,b.sec,ex);const picked=pickMix(pool,n,r);if(picked.length<n)short.push(`${secName(b.sec)}: ${n-picked.length}`);
  if(!picked.length)continue;sections.push({sec:b.sec,name:secName(b.sec),from:qs.length,to:qs.length+picked.length-1});qs.push(...picked.map(strip))}
 if(!qs.length)throw new Error('ಪಠ್ಯಕ್ರಮದಲ್ಲಿ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಲಭ್ಯವಿಲ್ಲ. ಪಠ್ಯಕ್ರಮ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಅಧ್ಯಾಯ ಆಯ್ಕೆ ಮಾಡಿ ಉಳಿಸಿ.');
 if(short.length&&!confirm('ಕೆಲವು ವಿಭಾಗಗಳಲ್ಲಿ ಪ್ರಶ್ನೆಗಳ ಕೊರತೆ ಇದೆ:\n'+short.join('\n')+`\n\nಒಟ್ಟು ${qs.length} ಪ್ರಶ್ನೆಗಳ ಪತ್ರಿಕೆ ತಯಾರಿಸಬೇಕೇ?`))return;
 const p={cls:c,type:t,year:CFG.activeYear,created:Date.now(),locked:false,seed,sections,qs};buildSets(p);
 await STORE.set(P.paper(c,t),p);PAPERS[`${c}_${t}`]=p;renderPaper();toast('ಪತ್ರಿಕೆ ತಯಾರಾಯಿತು')}
async function replaceQ(c,t,i){const p=PAPERS[`${c}_${t}`];const sec=p.sections.find(s=>i>=s.from&&i<=s.to);const ex=excludeFor(c,t);p.qs.forEach(q=>ex.add(q.id));
 const pool=poolFor(c,sec.sec,ex);if(!pool.length){alert('ಈ ವಿಭಾಗದಲ್ಲಿ ಬದಲಿ ಪ್ರಶ್ನೆ ಲಭ್ಯವಿಲ್ಲ');return}
 const same=pool.filter(q=>q.diff===p.qs[i].diff);const pick=(same.length?same:pool)[Math.floor(Math.random()*(same.length||pool.length))];
 p.qs[i]=strip(pick);buildSets(p);await STORE.set(P.paper(c,t),p);renderPaper()}
async function lockPaper(c,t,lock){const p=PAPERS[`${c}_${t}`];const lab=paperLabel(c,t);
 if(lock){p.locked=true;p.lockedAt=Date.now();p.qs.forEach(q=>{const l=USED[q.id]||(USED[q.id]=[]);if(!l.includes(lab))l.push(lab)})}
 else{p.locked=false;for(const id of Object.keys(USED)){USED[id]=USED[id].filter(l=>l!==lab);if(!USED[id].length)delete USED[id]}}
 await STORE.set(P.used,USED);await STORE.set(P.paper(c,t),p);renderPaper()}
async function publishMock(c,on){const p=PAPERS[`${c}_mock`];const old=await STORE.get(P.mock(c));if(old&&old.imgs)for(const k of old.imgs){try{await STORE.del('pratibha_public/'+k)}catch(e){}}
 if(on){const qs=[],imgs=[];for(const [i,q] of p.qs.entries()){let img='';if(q.img){const d=await getImg(q.img);if(d&&d.startsWith('data:')){const k=`mimg_${c}_${i}`;await STORE.set('pratibha_public/'+k,{data:d});imgs.push(k);img='PUB:'+k}else img=d||''}
  qs.push({q_kn:q.q_kn,q_en:q.q_en,opt_kn:q.opt_kn,opt_en:q.opt_en,ans:q.ans,exp_kn:q.exp_kn,img})}
  await STORE.set(P.mock(c),{cls:c,year:CFG.activeYear,title:`${CFG.examName} – ಮಾದರಿ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ (${c}ನೇ ತರಗತಿ)`,sections:p.sections,qs,imgs,at:Date.now()})}
 else await STORE.del(P.mock(c));CFG.mockPublished[c]=on;await STORE.set(P.site,CFG);renderPaper()}
function renderPaper(){const c=+$('#pCls').value||classes()[0],t=$('#pType').value;if(!c)return;const p=PAPERS[`${c}_${t}`];const nm=t==='final'?'ಮುಖ್ಯ ಪರೀಕ್ಷೆಯ ಪತ್ರಿಕೆ':'ಮಾದರಿ ಪತ್ರಿಕೆ';
 let st='',bt='';
 if(!p){st=`<div class="warn">${c}ನೇ ತರಗತಿಯ ${nm} ಇನ್ನೂ ತಯಾರಾಗಿಲ್ಲ.</div>${availTable(c,t)}`;bt=`<button class="b" id="pgGen">⚙ ಪತ್ರಿಕೆ ತಯಾರಿಸು (${nqOf(c)} ಪ್ರಶ್ನೆ)</button>`}
 else{st=`<div class="${p.locked?'okbox':'warn'}">${c}ನೇ ತರಗತಿ ${nm}: <b>${p.qs.length}</b> ಪ್ರಶ್ನೆಗಳು • ${nsets()} ಸೆಟ್ • ${p.locked?'🔒 ಲಾಕ್ ಆಗಿದೆ (ಅಂತಿಮ)':'✎ ಕರಡು – ಪರಿಶೀಲಿಸಿ, ಬೇಕಾದ ಪ್ರಶ್ನೆ ಬದಲಿಸಿ, ನಂತರ ಲಾಕ್ ಮಾಡಿ'}${t==='mock'&&CFG.mockPublished[c]?' • 🌐 ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾಗಿದೆ':''}</div>
  <p class="note">ವಿಭಾಗಗಳು: ${p.sections.map(s=>`${s.name} (${s.from+1}–${s.to+1})`).join(' • ')}</p>`;
  bt=LET.slice(0,nsets()).map(L=>`<button class="b" data-pp="${L}">🖨 ಸೆಟ್ ${L}</button>`).join('')+`<button class="b sec" id="pgKey">🖨 ಉತ್ತರ ಕೀ</button>`;
  if(!p.locked)bt+=`<button class="b green" id="pgLock">🔒 ${t==='final'?'ಅಂತಿಮಗೊಳಿಸಿ ಲಾಕ್ ಮಾಡು':'ಲಾಕ್ ಮಾಡು'}</button><button class="b sec" id="pgRegen">↻ ಹೊಸದಾಗಿ ತಯಾರಿಸು</button><button class="b red" id="pgDel">🗑 ಅಳಿಸು</button>`;
  else bt+=`<button class="b sec" id="pgUnlock">🔓 ಲಾಕ್ ತೆರೆ</button>`;
  if(t==='mock'&&p.locked)bt+=CFG.mockPublished[c]?`<button class="b sec" id="pgUnpub">ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ತೆಗೆ</button>`:`<button class="b green" id="pgPub">🌐 ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸು</button>`}
 $('#paperStatus').innerHTML=st;$('#paperBtns').innerHTML=bt;
 const on=(id,fn)=>{const el=$(id);if(el)el.onclick=fn};
 on('#pgGen',()=>guard(()=>genPaper(c,t),'ತಯಾರಾಗುತ್ತಿದೆ…'));
 on('#pgRegen',()=>{if(confirm('ಈ ಕರಡು ಅಳಿಸಿ ಹೊಸ ಪತ್ರಿಕೆ ತಯಾರಿಸಬೇಕೇ?'))guard(()=>genPaper(c,t),'ತಯಾರಾಗುತ್ತಿದೆ…')});
 on('#pgDel',()=>{if(confirm('ಈ ಕರಡು ಪತ್ರಿಕೆ ಅಳಿಸಬೇಕೇ?'))guard(async()=>{await STORE.del(P.paper(c,t));delete PAPERS[`${c}_${t}`];renderPaper()})});
 on('#pgLock',()=>{if(confirm(t==='final'?'ಪತ್ರಿಕೆ ಅಂತಿಮಗೊಳಿಸಬೇಕೇ? ಇದರ ಪ್ರಶ್ನೆಗಳು "ಬಳಕೆಯಾದವು" ಎಂದು ಗುರುತಾಗುತ್ತವೆ ಮತ್ತು ಮುಂದಿನ ವರ್ಷಗಳಲ್ಲಿ ಬರುವುದಿಲ್ಲ. ಉತ್ತರ ಕೀ OMR ಸ್ಕ್ಯಾನ್‌ಗೆ ಸಿದ್ಧವಾಗುತ್ತದೆ.':'ಮಾದರಿ ಪತ್ರಿಕೆ ಲಾಕ್ ಮಾಡಬೇಕೇ? ಇದರ ಪ್ರಶ್ನೆಗಳು ಮುಖ್ಯ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಬರುವುದಿಲ್ಲ.'))guard(()=>lockPaper(c,t,true)).then(scanKeyInfo)});
 on('#pgUnlock',()=>{if(confirm('ಲಾಕ್ ತೆರೆಯಬೇಕೇ? (ಈಗಾಗಲೇ ಮುದ್ರಿಸಿದ್ದರೆ ಬದಲಾವಣೆ ಮಾಡಬೇಡಿ)'))guard(()=>lockPaper(c,t,false)).then(scanKeyInfo)});
 on('#pgPub',()=>guard(()=>publishMock(c,true),'ಪ್ರಕಟಿಸಲಾಗುತ್ತಿದೆ…'));on('#pgUnpub',()=>guard(()=>publishMock(c,false)));
 on('#pgKey',()=>printKeys(p));document.querySelectorAll('[data-pp]').forEach(b=>b.onclick=()=>guard(()=>printPaper(p,b.dataset.pp),'ಮುದ್ರಣಕ್ಕೆ ಸಿದ್ಧವಾಗುತ್ತಿದೆ…'));
 if(p){$('#paperView').style.display='block';$('#paperList').innerHTML=p.qs.map((q,i)=>{const s=p.sections.find(s=>s.from===i);return (s?`<h3>${esc(s.name)} (${s.from+1}–${s.to+1})</h3>`:'')+
   `<div class="paperq"><span class="n">${i+1}.</span> ${esc(q.q_kn)} <span class="pill">${DIFF[q.diff]}</span> <span class="pill">${esc(q.id)}</span><br><span class="note">${q.opt_kn.map((o,k)=>`${LET[k]}) ${esc(o)}`).join(' &nbsp; ')} → <b>${q.ans}</b></span>${p.locked?'':` <button class="b sec sm" data-rq="${i}">⇄ ಬದಲಿಸು</button>`}</div>`}).join('');
  document.querySelectorAll('[data-rq]').forEach(b=>b.onclick=()=>guard(()=>replaceQ(c,t,+b.dataset.rq)))}else $('#paperView').style.display='none'}
$('#pCls').onchange=renderPaper;$('#pType').onchange=renderPaper;
async function printPaper(p,L){const perm=p.sets[L];const imgs={};for(const q of p.qs)if(q.img)imgs[q.id]=await getImg(q.img);
 const ins=['ಈ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಯಲ್ಲಿ '+p.qs.length+' ಬಹು ಆಯ್ಕೆ ಪ್ರಶ್ನೆಗಳಿವೆ. ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ 1 ಅಂಕ. ತಪ್ಪು ಉತ್ತರಕ್ಕೆ ಅಂಕ ಕಳೆಯುವುದಿಲ್ಲ.','ಸರಿಯಾದ ಉತ್ತರದ ವೃತ್ತವನ್ನು OMR ಹಾಳೆಯಲ್ಲಿ ನೀಲಿ ಅಥವಾ ಕಪ್ಪು ಬಾಲ್‌ಪೆನ್‌ನಿಂದ ಪೂರ್ತಿಯಾಗಿ ತುಂಬಿ.',
  'ಒಂದು ಪ್ರಶ್ನೆಗೆ ಒಂದೇ ವೃತ್ತ ತುಂಬಬೇಕು. ಉತ್ತರ ಬದಲಿಸುವಂತಿಲ್ಲ. ವೈಟ್ನರ್/ರಬ್ಬರ್ ಬಳಸಬೇಡಿ.',`OMR ಹಾಳೆಯಲ್ಲಿ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಮತ್ತು ಪ್ರಶ್ನೆಪತ್ರಿಕೆಯ ಸೆಟ್ (${L}) ವೃತ್ತ ತುಂಬಲು ಮರೆಯಬೇಡಿ.`,
  'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಸಂದೇಹವಿದ್ದರೆ ಇಂಗ್ಲಿಷ್ ಪ್ರಶ್ನೆಯನ್ನು ಅಂತಿಮವೆಂದು ಪರಿಗಣಿಸಿ.','ಲೆಕ್ಕಾಚಾರಕ್ಕಾಗಿ ಪತ್ರಿಕೆಯ ಕೊನೆಯ "ರಫ್ ಕೆಲಸ" ಪುಟ ಬಳಸಿ. ಮೊಬೈಲ್, ಕ್ಯಾಲ್ಕುಲೇಟರ್ ನಿಷೇಧ.','ಪರೀಕ್ಷೆ ಮುಗಿದ ನಂತರ OMR ಹಾಳೆಯನ್ನು ಕೊಠಡಿ ಮೇಲ್ವಿಚಾರಕರಿಗೆ ಒಪ್ಪಿಸಿ.'];
 let h=`<div class="page ppr"><div style="padding:10mm"><div class="cover"><div class="set">${L}</div><h1>${esc(CFG.examName)} ${esc(CFG.activeYear)}</h1><h2>${esc(CFG.school)}</h2>
 <h2>${p.cls}ನೇ ತರಗತಿ ${p.type==='mock'?'(ಮಾದರಿ ಪತ್ರಿಕೆ)':''}</h2><table class="info"><tr><td>ದಿನಾಂಕ<br><b>${esc(fmtShort(CFG.examDate))}</b></td><td>ಸಮಯ<br><b>${esc(CFG.examTime)}</b></td><td>ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು<br><b>${p.qs.length}</b></td><td>ಒಟ್ಟು ಅಂಕ<br><b>${p.qs.length}</b></td><td>ಅವಧಿ<br><b>${CFG.durationMin} ನಿಮಿಷ</b></td></tr></table>
 <p style="text-align:center"><b>ವಿದ್ಯಾರ್ಥಿಯ ನೋಂದಣಿ ಸಂಖ್ಯೆ</b></p><div class="regbox">${'<span></span>'.repeat(9)}</div>
 <p><b>ವಿಭಾಗಗಳು:</b> ${p.sections.map(s=>`${esc(s.name)} (${s.from+1}–${s.to+1})`).join(', ')}</p>
 <p><b>ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮುಖ್ಯ ಸೂಚನೆಗಳು:</b></p><ol class="ins">${ins.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
 <div class="sig" style="position:absolute;bottom:8mm;left:6mm;right:6mm"><span>ವಿದ್ಯಾರ್ಥಿಯ ಸಹಿ</span><span>ಕೊಠಡಿ ಮೇಲ್ವಿಚಾರಕರ ಸಹಿ</span></div></div></div></div>
 <div class="flow ppr"><table class="q">`;
 perm.forEach((qi,pos)=>{const q=p.qs[qi];const s=p.sections.find(s=>s.from===pos);if(s)h+=`<tr><td class="sec" colspan="2">${esc(s.name)} / ${esc(SECS[s.sec].en)} (${s.from+1}–${s.to+1})</td></tr>`;
  const op=(arr)=>`<div class="op">${arr.map((o,k)=>`<div>${LET[k]}) ${esc(o)}</div>`).join('')}</div>`;
  h+=`<tr><td><b>${pos+1}.</b> ${esc(q.q_kn)}${op(q.opt_kn)}</td><td>${q.q_en?`<b>${pos+1}.</b> ${esc(q.q_en)}${op(q.opt_en)}`:''}</td></tr>`;
  if(imgs[q.id])h+=`<tr><td colspan="2" class="qi"><img src="${imgs[q.id]}"></td></tr>`});
 h+=`</table><p style="text-align:center;margin-top:4mm">*****</p></div><div class="page ppr"><div style="padding:12mm"><h2>ರಫ್ ಕೆಲಸಕ್ಕಾಗಿ / For Rough Work</h2></div></div>`;
 doPrint(h)}
function printKeys(p){let h='<div class="flow lp" style="padding:0">';LET.slice(0,nsets()).forEach(L=>{const k=p.keys[L];
  h+=`<h3>${esc(CFG.examName)} ${esc(CFG.activeYear)} – ${p.cls}ನೇ ತರಗತಿ ${p.type==='mock'?'(ಮಾದರಿ)':''} – ಉತ್ತರ ಕೀ: ಸೆಟ್ ${L}</h3><table style="margin-bottom:8mm">`;
  for(let r=0;r<Math.ceil(k.length/10);r++){h+='<tr>'+[...Array(10)].map((_,j)=>{const i=r*10+j;return i<k.length?`<td><b>${i+1}</b>-${k[i]}</td>`:'<td></td>'}).join('')+'</tr>'}h+='</table>'});
 doPrint(h+'</div>')}

/* ---------- STUDENTS ---------- */
async function saveExam(){await STORE.set(P.exam(),EXAM)}
function makeReg(c,serial){return yy()+String(c%10)+String(CFG.schoolCode||'1').padStart(3,'0').slice(-3)+String(serial).padStart(3,'0')}
const stuByReg=r=>EXAM.students.find(s=>s.reg===r);
function clsFromReg(r){const st=stuByReg(r);if(st)return st.cls;return classes().find(c=>String(c%10)===String(r||'')[2])||null}
function renderStudents(){const rows=EXAM.students.slice().sort((a,b)=>a.reg.localeCompare(b.reg));$('#stuCount').textContent=rows.length;
 $('#stuTbl').innerHTML='<tr><th>ನೋಂದಣಿ ಸಂಖ್ಯೆ</th><th>ಹೆಸರು</th><th>ತಂದೆ</th><th>ತರಗತಿ</th><th>SATS</th><th>ಶಾಲೆ</th><th></th></tr>'+rows.map(s=>`<tr><td><b>${esc(s.reg)}</b></td><td>${esc(s.name)}</td><td>${esc(s.father)}</td><td>${esc(s.cls)}</td><td>${esc(s.sats)}</td><td>${esc(s.school||'')}</td><td><button class="b sec sm" data-sdel="${esc(s.reg)}">✕</button></td></tr>`).join('');
 document.querySelectorAll('[data-sdel]').forEach(b=>b.onclick=()=>{if(confirm('ಈ ವಿದ್ಯಾರ್ಥಿಯನ್ನು ಅಳಿಸಬೇಕೇ?'))guard(async()=>{EXAM.students=EXAM.students.filter(s=>s.reg!==b.dataset.sdel);await saveExam();renderStudents()})})}
$('#stuAdd').onclick=()=>guard(async()=>{const cs=classes();const errs=[];let added=0;
 $('#stuIn').value.split('\n').map(l=>l.trim()).filter(Boolean).forEach((l,i)=>{const p=(l.includes('\t')?l.split('\t'):l.split(',')).map(x=>x.trim());const [name,father,cl,sats,school]=p;const c=parseInt(cl,10);
  if(!name||!cs.includes(c)){errs.push(`ಸಾಲು ${i+1}: "${l.slice(0,30)}" – ಹೆಸರು/ತರಗತಿ ಸರಿಯಿಲ್ಲ`);return}
  if(sats&&EXAM.students.some(s=>s.sats&&s.sats===sats)){errs.push(`ಸಾಲು ${i+1}: SATS ${sats} ಈಗಾಗಲೇ ಇದೆ`);return}
  const serial=Math.max(0,...EXAM.students.filter(s=>s.cls===c).map(s=>parseInt(s.reg.slice(-3),10)))+1;if(serial>999){errs.push('999 ಮಿತಿ');return}
  EXAM.students.push({name,father:father||'',cls:c,sats:sats||'',school:school||'',reg:makeReg(c,serial)});added++});
 await saveExam();renderStudents();$('#stuMsg').innerHTML=`✔ ${added} ಸೇರಿಸಲಾಗಿದೆ`+(errs.length?`<br><span class="bad">${errs.map(esc).join('<br>')}</span>`:'');if(added)$('#stuIn').value=''});
$('#stuClear').onclick=()=>{if(confirm('ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಅಳಿಸಬೇಕೇ?'))guard(async()=>{EXAM.students=[];await saveExam();renderStudents()})};
function selStu(){const v=$('#prCls').value;return EXAM.students.filter(s=>v==='all'||String(s.cls)===v).sort((a,b)=>a.reg.localeCompare(b.reg))}
const chunk=(a,n)=>{const r=[];for(let i=0;i<a.length;i+=n)r.push(a.slice(i,i+n));return r};
function hallTicket(st){return `<div class="ht"><div class="ht-head"><div class="t1">${esc(CFG.examName)} ${esc(CFG.activeYear)}</div><div>${esc(CFG.school)}</div><div class="t2">ಪ್ರವೇಶ ಪತ್ರ / HALL TICKET</div></div>
<div class="ht-body"><table><tr><td>ನೋಂದಣಿ ಸಂಖ್ಯೆ</td><td class="reg">${esc(st.reg)}</td></tr><tr><td>ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</td><td><b>${esc(st.name)}</b></td></tr><tr><td>ತಂದೆಯ ಹೆಸರು</td><td>${esc(st.father)}</td></tr>
<tr><td>ತರಗತಿ</td><td>${esc(st.cls)}ನೇ ತರಗತಿ</td></tr><tr><td>SATS ಸಂಖ್ಯೆ</td><td>${esc(st.sats)}</td></tr>${st.school?`<tr><td>ಶಾಲೆ</td><td>${esc(st.school)}</td></tr>`:''}<tr><td>ಪರೀಕ್ಷಾ ದಿನಾಂಕ</td><td>${esc(fmtDate(CFG.examDate))}</td></tr>
<tr><td>ಸಮಯ</td><td>${esc(CFG.examTime)}</td></tr><tr><td>ಪರೀಕ್ಷಾ ಕೇಂದ್ರ</td><td>${esc(CFG.center||CFG.school)}</td></tr></table><div class="photo">ಭಾವಚಿತ್ರ<br>ಅಂಟಿಸಿ</div></div>
<div class="sig"><span>ವಿದ್ಯಾರ್ಥಿಯ ಸಹಿ</span><span>ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಸಹಿ ಮತ್ತು ಮುದ್ರೆ${CFG.hm?'<br>'+esc(CFG.hm):''}</span></div>
<ol><li>ಈ ಪ್ರವೇಶ ಪತ್ರ ಇಲ್ಲದೆ ಪರೀಕ್ಷಾ ಕೊಠಡಿಗೆ ಪ್ರವೇಶವಿಲ್ಲ. ಪರೀಕ್ಷೆ ಆರಂಭಕ್ಕೆ 15 ನಿಮಿಷ ಮುಂಚೆ ಹಾಜರಿರಿ.</li><li>ನೀಲಿ ಅಥವಾ ಕಪ್ಪು ಬಾಲ್‌ಪೆನ್, ಪೆನ್ಸಿಲ್ ಮತ್ತು ಸ್ಕೇಲ್ ತನ್ನಿ. ಮೊಬೈಲ್, ಕ್ಯಾಲ್ಕುಲೇಟರ್ ನಿಷೇಧ.</li>
<li>ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ಬಹು ಆಯ್ಕೆಯವು. ಉತ್ತರಗಳನ್ನು OMR ಹಾಳೆಯಲ್ಲಿ ವೃತ್ತ ತುಂಬಿ ಗುರುತಿಸಬೇಕು. ತಪ್ಪು ಉತ್ತರಕ್ಕೆ ಅಂಕ ಕಳೆಯುವುದಿಲ್ಲ.</li><li>ಈ ಪ್ರವೇಶ ಪತ್ರವನ್ನು ಫಲಿತಾಂಶ ಮತ್ತು ಬಹುಮಾನ ವಿತರಣೆಯವರೆಗೆ ಜೋಪಾನವಾಗಿ ಇಡಿ.</li></ol></div>`}
const omrCfg=()=>({examName:CFG.examName,activeYear:CFG.activeYear,school:CFG.school,examDate:CFG.examDate});
$('#prHall').onclick=()=>{const st=selStu();if(!st.length){alert('ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿ ಖಾಲಿ ಇದೆ');return}doPrint(chunk(st,2).map(p=>`<div class="page">${p.map(hallTicket).join('')}</div>`).join(''))};
$('#prOmr').onclick=()=>{const st=selStu();if(!st.length){alert('ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿ ಖಾಲಿ ಇದೆ');return}doPrint(st.map(s=>`<div class="page">${omrSVG(omrCfg(),s,nqOf(s.cls))}</div>`).join(''))};
$('#prBlank').onclick=()=>{const n=Math.max(1,Math.min(300,+$('#prCopies').value||1));const v=$('#prCls').value;const nq=v==='all'?Math.max(...classes().map(nqOf)):nqOf(+v);const svg=omrSVG(omrCfg(),null,nq);doPrint(Array.from({length:n},()=>`<div class="page">${svg}</div>`).join(''))};
$('#prAtt').onclick=()=>{let h='';const v=$('#prCls').value;classes().filter(c=>v==='all'||String(c)===v).forEach(c=>{const st=EXAM.students.filter(x=>x.cls===c).sort((a,b)=>a.reg.localeCompare(b.reg));
 chunk(st,25).forEach((p,pi)=>{h+=`<div class="page"><div class="lp"><h3>${esc(CFG.examName)} ${esc(CFG.activeYear)}</h3><h4>${esc(CFG.school)} • ${c}ನೇ ತರಗತಿ • ಹಾಜರಾತಿ ಪಟ್ಟಿ • ${esc(fmtDate(CFG.examDate))}</h4>
 <table class="att"><tr><th>ಕ್ರ.ಸಂ</th><th>ನೋಂದಣಿ ಸಂಖ್ಯೆ</th><th>ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th><th>ಸೆಟ್</th><th>ವಿದ್ಯಾರ್ಥಿಯ ಸಹಿ</th></tr>${p.map((x,i)=>`<tr><td>${pi*25+i+1}</td><td>${esc(x.reg)}</td><td>${esc(x.name)}</td><td></td><td></td></tr>`).join('')}</table>
 <div class="sig" style="margin-top:10mm"><span>ಕೊಠಡಿ ಮೇಲ್ವಿಚಾರಕರ ಸಹಿ</span><span>ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಸಹಿ</span></div></div></div>`})});if(!h){alert('ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿ ಖಾಲಿ ಇದೆ');return}doPrint(h)};

/* ---------- SCANNING ---------- */
const IDB={db:null,open(){return new Promise(res=>{try{const r=indexedDB.open('pratibha_img',1);r.onupgradeneeded=()=>r.result.createObjectStore('img');r.onsuccess=()=>{this.db=r.result;res()};r.onerror=()=>res()}catch(e){res()}})},
 tx(m,fn){return new Promise((res,rej)=>{if(!this.db)return res(null);const t=this.db.transaction('img',m);const rq=fn(t.objectStore('img'));t.oncomplete=()=>res(rq&&rq.result);t.onerror=()=>rej(t.error)})},
 put(k,v){return this.tx('readwrite',s=>s.put(v,k))},get(k){return this.tx('readonly',s=>s.get(k))},del(k){return this.tx('readwrite',s=>s.delete(k))}};
IDB.open();
async function ensureScans(){if(SCANS)return SCANS;try{SCANS=(await STORE.list(P.scans())).map(d=>d.data)}catch(e){console.error(e);SCANS=[]}return SCANS}
const finalPaper=c=>{const p=PAPERS[`${c}_final`];return p&&p.locked?p:null};
function scanKeyInfo(){const el=$('#scanKeyInfo');if(!el)return;el.innerHTML=classes().map(c=>finalPaper(c)?`<div class="okbox">✔ ${c}ನೇ ತರಗತಿ: ಉತ್ತರ ಕೀ ಸಿದ್ಧ (${finalPaper(c).qs.length} ಪ್ರಶ್ನೆ, ${nsets()} ಸೆಟ್)</div>`:`<div class="warn">⚠ ${c}ನೇ ತರಗತಿ: ಅಂತಿಮ ಪತ್ರಿಕೆ ಇನ್ನೂ ಲಾಕ್ ಆಗಿಲ್ಲ – ಸ್ಕ್ಯಾನ್ ಉಳಿಯುತ್ತದೆ, ಅಂಕ ಲೆಕ್ಕ ಲಾಕ್ ನಂತರ</div>`).join('')}
function scoreOf(rec){const c=rec.cls||clsFromReg(rec.reg);const p=finalPaper(c);let set=rec.set;
 if(!set||set==='?'){if(nsets()===1)set='A';else return {err:'ಸೆಟ್ ಗೊತ್ತಿಲ್ಲ',cls:c}}
 if(!p)return {err:`${c||'?'}ನೇ ತರಗತಿ ಕೀ ಇಲ್ಲ`,cls:c};const key=p.keys[set];if(!key)return {err:'ಸೆಟ್ '+set+' ಕೀ ಇಲ್ಲ',cls:c};
 const n=key.length,sec=p.sections.map(()=>0);let total=0;const per=[];
 for(let i=0;i<n;i++){const ok=rec.answers[i]===key[i];per.push(ok);if(ok){total++;const si=p.sections.findIndex(s=>i>=s.from&&i<=s.to);if(si>=0)sec[si]++}}
 return {total,n,sec,per,set,cls:c,sections:p.sections}}
function needsReview(r){return r.doubts.length>0||r.regDoubt||r.setDoubt||!stuByReg(r.reg)||r.dup}
async function storeResult(g,src){await ensureScans();const c=clsFromReg(g.reg);const nq=c?nqOf(c):100;
 const rec={id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),reg:g.reg,cls:c,set:nsets()===1?'A':g.set,answers:g.answers.slice(0,100),doubts:g.doubts.filter(q=>q<nq),regDoubt:g.regDoubt,setDoubt:nsets()>1&&g.setDoubt,dup:false,edited:false,time:Date.now(),src,by:STORE.user&&STORE.user.email};
 const prevs=rec.regDoubt?[]:SCANS.filter(r=>r.reg===rec.reg);
 const same=prevs.find(p=>p.set===rec.set&&p.answers.slice(0,nq).join()===rec.answers.slice(0,nq).join());if(same)return {rec:same,repeat:true};
 if(prevs.length){rec.dup=true;for(const p of prevs){p.dup=true;await STORE.set(P.scans()+'/'+p.id,p)}}
 await STORE.set(P.scans()+'/'+rec.id,rec);SCANS.push(rec);
 if(g.rect)await new Promise(res=>g.rect.toBlob(async b=>{try{await IDB.put(rec.id,b)}catch(e){}res()},'image/jpeg',0.72));
 return {rec}}
function resultCard(rec,repeat){const st=stuByReg(rec.reg),sc=scoreOf(rec),rv=needsReview(rec);const issues=[];
 if(!st)issues.push('ನೋಂದಣಿ ಸಂಖ್ಯೆ ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ');if(rec.regDoubt)issues.push('ನೋಂದಣಿ ಸಂಖ್ಯೆ ಅಸ್ಪಷ್ಟ');if(rec.setDoubt)issues.push('ಸೆಟ್ ಅಸ್ಪಷ್ಟ');if(rec.doubts.length)issues.push(rec.doubts.length+' ಉತ್ತರ ಸಂದೇಹ');if(rec.dup)issues.push('ಇದೇ ನೋಂದಣಿ ಸಂಖ್ಯೆಯ ಇನ್ನೊಂದು ಸ್ಕ್ಯಾನ್ ಇದೆ');
 return `<div class="res ${repeat||rv?'y':'g'}"><div class="big">${sc.err?'—':sc.total+' / '+sc.n}</div><div><b>${esc(st?st.name:'ಅಪರಿಚಿತ')}</b> • ${esc(rec.reg)} • ${esc(rec.cls||'?')}ನೇ ತರಗತಿ • ಸೆಟ್ ${esc(rec.set)}</div>
 ${sc.err?`<div class="bad">${esc(sc.err)}</div>`:''}${repeat?'<div>ಈ ಹಾಳೆ ಈಗಾಗಲೇ ಸ್ಕ್ಯಾನ್ ಆಗಿದೆ.</div>':''}
 ${issues.length?`<div class="bad">⚠ ${issues.join(' • ')}</div><button class="b" onclick="openReview('${rec.id}')">ಪರಿಶೀಲಿಸಿ</button>`:'<div class="ok">✔ ಸರಿಯಾಗಿ ಓದಲಾಗಿದೆ</div>'}</div>`}
function logLine(h){const d=document.createElement('div');d.innerHTML=h;$('#scanLog').prepend(d)}
function scanStat(){const tot=EXAM.students.length,done=new Set((SCANS||[]).map(r=>r.reg)).size;$('#scanStat').textContent=`ಸ್ಕ್ಯಾನ್ ಆದ ಹಾಳೆಗಳು: ${(SCANS||[]).length} • ನೋಂದಾಯಿತ: ${tot} • ಬಾಕಿ: ${Math.max(0,tot-done)}`}
const cam={stream:null,track:null,run:false,busy:false,stable:0,last:null,wait:false,miss:0,torch:false,lastT:0,lastText:''};
let audioCtx=null;function beep(ok){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=ok?1200:400;g.gain.value=0.15;o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+(ok?0.15:0.4))}catch(e){}if(navigator.vibrate)navigator.vibrate(ok?80:[80,60,80])}
async function camStart(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){alert('ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕ್ಯಾಮೆರಾ ಸೌಲಭ್ಯ ಇಲ್ಲ. Chrome ಬಳಸಿ.');return}
 await ensureScans();
 try{cam.stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920}}})}catch(e){alert('ಕ್ಯಾಮೆರಾ ತೆರೆಯಲು ಆಗಲಿಲ್ಲ: '+e.message);return}
 cam.track=cam.stream.getVideoTracks()[0];const v=$('#video');v.srcObject=cam.stream;await v.play().catch(()=>{});
 try{const caps=cam.track.getCapabilities?cam.track.getCapabilities():{};if(caps.focusMode&&caps.focusMode.includes('continuous'))await cam.track.applyConstraints({advanced:[{focusMode:'continuous'}]});$('#camTorch').disabled=!caps.torch}catch(e){}
 $('#camWrap').style.display='block';$('#camStop').disabled=false;$('#camShot').disabled=false;$('#camStart').disabled=true;
 try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)()}catch(e){}
 cam.run=true;cam.wait=false;cam.stable=0;cam.last=null;requestAnimationFrame(camLoop)}
function camStop(){cam.run=false;if(cam.stream)cam.stream.getTracks().forEach(t=>t.stop());cam.stream=null;$('#camWrap').style.display='none';$('#camStop').disabled=true;$('#camShot').disabled=true;$('#camTorch').disabled=true;$('#camStart').disabled=false}
const camMsg=t=>{$('#camMsg').textContent=t};
function camLoop(t){if(!cam.run)return;requestAnimationFrame(camLoop);if(cam.busy||t-cam.lastT<220)return;cam.lastT=t;const v=$('#video');if(!v.videoWidth)return;
 const ov=$('#overlay');if(ov.width!==v.videoWidth){ov.width=v.videoWidth;ov.height=v.videoHeight}const oc=ov.getContext('2d');oc.clearRect(0,0,ov.width,ov.height);
 const Sm=OMR.smallGray(v,640);const c=OMR.findMarkers(Sm)[0];
 if(!c){cam.stable=0;cam.last=null;cam.miss++;if(cam.wait&&cam.miss>=3)cam.wait=false;camMsg(cam.wait?'ಮುಂದಿನ ಹಾಳೆ ಇಡಿ':'ನಾಲ್ಕೂ ಮೂಲೆಯ ಕಪ್ಪು ಚೌಕಗಳು ಕಾಣುವಂತೆ ಹಿಡಿಯಿರಿ');return}
 cam.miss=0;const Pp=c.pts.map(([x,y])=>[x/Sm.scale,y/Sm.scale]);
 oc.lineWidth=Math.max(4,ov.width/150);oc.strokeStyle=cam.wait?'#facc15':'#22c55e';oc.beginPath();Pp.forEach((p,i)=>i?oc.lineTo(p[0],p[1]):oc.moveTo(p[0],p[1]));oc.closePath();oc.stroke();
 if(cam.wait){camMsg((cam.lastText||'ಸ್ಕ್ಯಾನ್ ಆಯಿತು ✔')+' – ಮುಂದಿನ ಹಾಳೆ ಇಡಿ');return}
 if(c.edge){cam.stable=0;camMsg('ಮೊಬೈಲ್ ಅನ್ನು ಸ್ವಲ್ಪ ಹಿಂದೆ ಸರಿಸಿ – ಮೂಲೆಗಳು ಅಂಚಿಗೆ ತಾಗಿವೆ');return}
 if(c.quadArea<0.18){cam.stable=0;camMsg('ಮೊಬೈಲ್ ಅನ್ನು ಹಾಳೆಗೆ ಸ್ವಲ್ಪ ಹತ್ತಿರ ತನ್ನಿ');return}
 const diag=Math.hypot(ov.width,ov.height);const mv=cam.last?Math.max(...Pp.map((p,i)=>Math.hypot(p[0]-cam.last[i][0],p[1]-cam.last[i][1]))):1e9;cam.last=Pp;
 if(mv<diag*0.012)cam.stable++;else cam.stable=0;camMsg(cam.stable?'ಅಲುಗಾಡಿಸಬೇಡಿ…':'ಸ್ಥಿರವಾಗಿ ಹಿಡಿಯಿರಿ');if(cam.stable>=3)camCapture(false)}
async function camCapture(manual){const v=$('#video');if(!v.videoWidth||cam.busy)return;cam.busy=true;camMsg('ಓದಲಾಗುತ್ತಿದೆ…');
 try{const fc=document.createElement('canvas');fc.width=v.videoWidth;fc.height=v.videoHeight;fc.getContext('2d',{willReadFrequently:true}).drawImage(v,0,0);const g=OMR.processCanvas(fc);
  if(g.error){cam.stable=0;if(manual){beep(false);camMsg(g.error)}cam.busy=false;return}
  const {rec,repeat}=await storeResult(g,'cam');beep(!needsReview(rec)&&!repeat);$('#lastResult').innerHTML=resultCard(rec,repeat);const st=stuByReg(rec.reg),sc=scoreOf(rec);
  if(!repeat)logLine(`${needsReview(rec)?'⚠':'✔'} ${esc(rec.reg)} – ${esc(st?st.name:'ಅಪರಿಚಿತ')} – ${sc.err?esc(sc.err):sc.total+'/'+sc.n}`);
  cam.lastText=`${needsReview(rec)?'⚠':'✔'} ${st?st.name:rec.reg} ${sc.err?'':sc.total+'/'+sc.n}`;cam.wait=true;cam.stable=0;cam.miss=0;scanStat()}
 catch(e){console.error(e);camMsg('ದೋಷ: '+errMsg(e))}cam.busy=false}
const PDFJS_BASE='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.2.108/legacy/build/';let pdfLib=null;
async function loadPdfJs(){if(pdfLib)return pdfLib;try{pdfLib=await import(PDFJS_BASE+'pdf.min.mjs');pdfLib.GlobalWorkerOptions.workerSrc=PDFJS_BASE+'pdf.worker.min.mjs';return pdfLib}catch(e){pdfLib=null;throw new Error('PDF ಓದುವ ಸಾಧನ ಲೋಡ್ ಆಗಲಿಲ್ಲ – ಇಂಟರ್ನೆಟ್ ಬೇಕು (ಅಥವಾ JPG ಫೋಟೋ ಬಳಸಿ)')}}
async function handleCanvas(fc,label){const g=OMR.processCanvas(fc);if(g.error){logLine(`✖ ${esc(label)}: <span class="bad">${esc(g.error)}</span>`);return}
 const {rec,repeat}=await storeResult(g,'file');const st=stuByReg(rec.reg),sc=scoreOf(rec);
 logLine(`${repeat?'↺':needsReview(rec)?'⚠':'✔'} ${esc(label)}: ${esc(rec.reg)} – ${esc(st?st.name:'ಅಪರಿಚಿತ')} – ${sc.err?esc(sc.err):sc.total+'/'+sc.n}${repeat?' (ಈಗಾಗಲೇ ಸ್ಕ್ಯಾನ್ ಆಗಿದೆ)':''}`);$('#lastResult').innerHTML=resultCard(rec,repeat)}
function canvasFrom(src,W,H){const sc=Math.min(1,2400/Math.max(W,H));const c=document.createElement('canvas');c.width=Math.round(W*sc);c.height=Math.round(H*sc);c.getContext('2d',{willReadFrequently:true}).drawImage(src,0,0,c.width,c.height);return c}
async function handleFiles(files){await ensureScans();for(const f of files){try{
 if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){logLine(`⏳ ${esc(f.name)} ಓದಲಾಗುತ್ತಿದೆ…`);const lib=await loadPdfJs();const pdf=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;
  for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p);const v1=page.getViewport({scale:1});const vp=page.getViewport({scale:2200/Math.max(v1.width,v1.height)});
   const c=document.createElement('canvas');c.width=Math.round(vp.width);c.height=Math.round(vp.height);const x=c.getContext('2d',{willReadFrequently:true});x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
   await page.render({canvasContext:x,canvas:c,viewport:vp}).promise;await handleCanvas(c,`${f.name} ಪುಟ ${p}`)}}
 else{const url=URL.createObjectURL(f);const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('ಚಿತ್ರ ತೆರೆಯಲಾಗಲಿಲ್ಲ'));i.src=url});
  await handleCanvas(canvasFrom(img,img.naturalWidth,img.naturalHeight),f.name);URL.revokeObjectURL(url)}}
 catch(e){console.error(e);logLine(`✖ ${esc(f.name)}: <span class="bad">${esc(errMsg(e))}</span>`)}}scanStat()}
$('#camStart').onclick=camStart;$('#camStop').onclick=camStop;$('#camShot').onclick=()=>{cam.wait=false;camCapture(true)};
$('#camTorch').onclick=async()=>{try{cam.torch=!cam.torch;await cam.track.applyConstraints({advanced:[{torch:cam.torch}]})}catch(e){}};
$('#fileIn').onchange=e=>{const f=[...e.target.files];e.target.value='';handleFiles(f)};

/* ---------- RESULTS ---------- */
function ranked(c){const p=finalPaper(c);const tie=(CFG.tieOrder||[]).map(s=>p?p.sections.findIndex(x=>x.sec===s):-1).filter(i=>i>=0);
 const rows=(SCANS||[]).filter(r=>String(r.cls||clsFromReg(r.reg))===String(c)).map(r=>({r,s:scoreOf(r),st:stuByReg(r.reg)}));
 const cmp=(a,b)=>{const as=a.s.err?-1:a.s.total,bs=b.s.err?-1:b.s.total;if(bs!==as)return bs-as;for(const i of tie){const d=(b.s.sec?b.s.sec[i]:0)-(a.s.sec?a.s.sec[i]:0);if(d)return d}return 0};
 rows.sort((a,b)=>cmp(a,b)||a.r.reg.localeCompare(b.r.reg));let rank=0;rows.forEach((x,i)=>{if(i===0||cmp(rows[i-1],x)!==0)rank=i+1;x.rank=x.s.err?'-':rank});return rows}
function renderResults(){const c=+$('#rCls').value||classes()[0];if(!c)return;const rows=ranked(c);const p=finalPaper(c);const secs=p?p.sections:[];const flt=$('#rFilter').value;
 const reg=EXAM.students.filter(s=>s.cls===c);const done=new Set(rows.map(x=>x.r.reg));const missing=reg.filter(s=>!done.has(s.reg));const nrev=rows.filter(x=>needsReview(x.r)).length;
 $('#rSummary').innerHTML=`ಸ್ಕ್ಯಾನ್: <b>${rows.length}</b> • ನೋಂದಾಯಿತ: <b>${reg.length}</b> • ಪರಿಶೀಲನೆ ಬೇಕಾದವು: <b class="${nrev?'bad':'ok'}">${nrev}</b>${CFG.results.published?' • 🌐 ವಿಜೇತರು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟ':''}`+(missing.length?`<br>ಸ್ಕ್ಯಾನ್ ಆಗದವರು/ಗೈರು: ${missing.map(s=>esc(s.reg+' '+s.name)).join(', ')}`:'')+(p?'':'<br><span class="bad">ಅಂತಿಮ ಪತ್ರಿಕೆ ಲಾಕ್ ಆಗಿಲ್ಲ – ಅಂಕ ಲೆಕ್ಕ ಸಾಧ್ಯವಿಲ್ಲ</span>');
 $('#resTbl').innerHTML=`<tr><th>ಸ್ಥಾನ</th><th>ನೋಂದಣಿ</th><th>ಹೆಸರು</th><th>ಸೆಟ್</th>${secs.map(s=>`<th>${esc(s.name.slice(0,9))}</th>`).join('')}<th>ಒಟ್ಟು</th><th>ಸ್ಥಿತಿ</th></tr>`+
  rows.filter(x=>flt==='all'||needsReview(x.r)).map(x=>{const r=x.r,s=x.s;const tags=[];if(!x.st)tags.push('<span class="pill r">ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ</span>');if(r.dup)tags.push('<span class="pill r">ನಕಲು</span>');if(r.regDoubt)tags.push('<span class="pill y">ನೋಂದಣಿ?</span>');if(r.setDoubt)tags.push('<span class="pill y">ಸೆಟ್?</span>');if(r.doubts.length)tags.push(`<span class="pill y">${r.doubts.length} ಸಂದೇಹ</span>`);if(r.edited)tags.push('<span class="pill g">ಪರಿಶೀಲಿಸಲಾಗಿದೆ</span>');
  return `<tr class="click" data-id="${r.id}"><td>${x.rank}</td><td>${esc(r.reg)}</td><td>${esc(x.st?x.st.name:'?')}</td><td>${esc(r.set)}</td>${secs.map((_,i)=>`<td>${s.err?'':s.sec[i]}</td>`).join('')}<td><b>${s.err?'<span class="bad">'+esc(s.err)+'</span>':s.total}</b></td><td>${tags.join('')||'<span class="pill g">✔</span>'}</td></tr>`}).join('');
 document.querySelectorAll('#resTbl tr.click').forEach(tr=>tr.onclick=()=>openReview(tr.dataset.id));scanStat()}
$('#rCls').onchange=renderResults;$('#rFilter').onchange=renderResults;$('#rReload').onclick=()=>guard(async()=>{SCANS=null;await ensureScans();renderResults()},'ಲೋಡ್ ಆಗುತ್ತಿದೆ…');
$('#rCsv').onclick=()=>{const out=[['ತರಗತಿ','ಸ್ಥಾನ','ನೋಂದಣಿ ಸಂಖ್ಯೆ','ಹೆಸರು','ತಂದೆ','SATS','ಶಾಲೆ','ಸೆಟ್','ವಿಭಾಗವಾರು ಅಂಕ','ಒಟ್ಟು','ಪರಿಶೀಲನೆ']];
 classes().forEach(c=>ranked(c).forEach(x=>out.push([c,x.rank,x.r.reg,x.st?x.st.name:'',x.st?x.st.father:'',x.st?x.st.sats:'',x.st?x.st.school:'',x.r.set,x.s.err?'':x.s.sections.map((s,i)=>s.name+':'+x.s.sec[i]).join('; '),x.s.err?x.s.err:x.s.total,needsReview(x.r)?'ಬೇಕು':''])));
 dl('pratibha_result.csv','﻿'+out.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv')};
$('#rPrint').onclick=()=>{const c=+$('#rCls').value;const rows=ranked(c);const p=finalPaper(c);if(!rows.length||!p){alert('ಫಲಿತಾಂಶ ಇಲ್ಲ');return}
 doPrint(chunk(rows,28).map(pg=>`<div class="page"><div class="lp"><h3>${esc(CFG.examName)} ${esc(CFG.activeYear)}</h3><h4>${esc(CFG.school)} • ${c}ನೇ ತರಗತಿ • ಮೆರಿಟ್ ಪಟ್ಟಿ (ಗರಿಷ್ಠ ಅಂಕ ${p.qs.length})</h4>
 <table><tr><th>ಸ್ಥಾನ</th><th>ನೋಂದಣಿ</th><th>ಹೆಸರು</th>${p.sections.map(s=>`<th style="font-size:2.8mm">${esc(s.name)}</th>`).join('')}<th>ಒಟ್ಟು</th></tr>${pg.map(x=>`<tr><td><b>${x.rank}</b></td><td>${esc(x.r.reg)}</td><td>${esc(x.st?x.st.name:'?')}</td>${p.sections.map((_,i)=>`<td>${x.s.err?'':x.s.sec[i]}</td>`).join('')}<td><b>${x.s.err?'-':x.s.total}</b></td></tr>`).join('')}</table>
 <div class="sig" style="margin-top:12mm"><span>ಮೌಲ್ಯಮಾಪಕರ ಸಹಿ</span><span>ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಸಹಿ</span></div></div></div>`).join(''))};
$('#rCert').onclick=()=>{let h='';const pos={1:'ಪ್ರಥಮ',2:'ದ್ವಿತೀಯ',3:'ತೃತೀಯ'};classes().forEach(c=>ranked(c).filter(x=>x.rank>=1&&x.rank<=3&&x.st).forEach(x=>{
 h+=`<div class="cert"><div class="in"><div><h1>ಪ್ರಶಂಸಾ ಪತ್ರ</h1><p style="font-size:5.5mm"><b>${esc(CFG.examName)} ${esc(CFG.activeYear)}</b><br>${esc(CFG.school)}</p></div>
 <div><p>ಈ ಪ್ರಶಂಸಾ ಪತ್ರವನ್ನು</p><div class="nm">${esc(x.st.name)}</div><p>${c}ನೇ ತರಗತಿ${x.st.school?', '+esc(x.st.school):''} ಇವರು ಪ್ರತಿಭಾನ್ವೇಷಣೆ ಪರೀಕ್ಷೆಯಲ್ಲಿ ${x.s.n} ಅಂಕಗಳಿಗೆ <b>${x.s.total}</b> ಅಂಕಗಳನ್ನು ಪಡೆದು<br><b style="font-size:7mm">${pos[x.rank]} ಸ್ಥಾನ</b> ಗಳಿಸಿರುವುದಕ್ಕಾಗಿ ನೀಡಲಾಗಿದೆ. ಅಭಿನಂದನೆಗಳು!</p></div>
 <div class="sig"><span>ದಿನಾಂಕ: ${esc(fmtShort(CFG.timeline.find(t=>/ಬಹುಮಾನ/.test(t.label))?.date||''))}</span><span>ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಸಹಿ${CFG.hm?'<br>'+esc(CFG.hm):''}</span></div></div></div>`}));
 if(!h){alert('ಮೊದಲ 3 ಸ್ಥಾನದ ಫಲಿತಾಂಶ ಇಲ್ಲ');return}doPrint(h)};
$('#rPublish').onclick=()=>guard(async()=>{const lists={};const N=+CFG.resultsTopN||10;for(const c of classes()){const rows=ranked(c).filter(x=>x.rank!=='-'&&x.st&&x.rank<=N);
  lists[c]=rows.map(x=>({rank:x.rank,name:x.st.name,school:x.st.school||CFG.school,score:x.s.total,of:x.s.n}))}
 if(!Object.values(lists).some(l=>l.length)){alert('ಪ್ರಕಟಿಸಲು ಫಲಿತಾಂಶ ಇಲ್ಲ');return}
 if(!confirm('ವಿಜೇತರ ಹೆಸರು ಮತ್ತು ಅಂಕಗಳು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಕಾಣುತ್ತವೆ. ಪರಿಶೀಲನೆ ಮುಗಿದಿದೆಯೇ?'))return;
 CFG.results={published:true,at:Date.now(),lists};await STORE.set(P.site,CFG);renderResults();toast('ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾಯಿತು')});
$('#rUnpublish').onclick=()=>guard(async()=>{CFG.results={published:false,lists:{}};await STORE.set(P.site,CFG);renderResults();toast('ತೆಗೆಯಲಾಗಿದೆ')});

/* ---------- REVIEW ---------- */
let revRec=null;
async function openReview(id){revRec=(SCANS||[]).find(r=>r.id===id);if(!revRec)return;const r=revRec;$('#revReg').value=r.reg;$('#revSet').value=LET.includes(r.set)?r.set:'A';$('#revAns').innerHTML='';openM('revModal');
 const blob=await IDB.get(r.id).catch(()=>null);const cv=$('#revCanvas'),x=cv.getContext('2d');x.fillStyle='#eee';x.fillRect(0,0,cv.width,cv.height);
 if(blob){const img=await createImageBitmap(blob);x.drawImage(img,0,0,cv.width,cv.height)}else{x.fillStyle='#555';x.font='18px sans-serif';x.fillText('ಸ್ಕ್ಯಾನ್ ಚಿತ್ರ ಈ ಸಾಧನದಲ್ಲಿ ಇಲ್ಲ',150,440)}
 cv._base=x.getImageData(0,0,cv.width,cv.height);renderReview()}
window.openReview=openReview;
function renderReview(){const r=revRec;const tmp={...r,reg:$('#revReg').value.trim(),set:$('#revSet').value,answers:r.answers.slice()};
 document.querySelectorAll('#revAns select').forEach(s=>{tmp.answers[+s.dataset.q]=s.value});tmp.cls=clsFromReg(tmp.reg);const sc=scoreOf(tmp);const p=finalPaper(tmp.cls);const key=p?p.keys[sc.set||tmp.set]||'':'';const st=stuByReg(tmp.reg);
 const nq=tmp.cls?nqOf(tmp.cls):100;
 $('#revTitle').textContent=`ಪರಿಶೀಲನೆ – ${st?st.name:'ಅಪರಿಚಿತ'} (${tmp.reg})`;
 $('#revInfo').innerHTML=(st?`${esc(st.name)} • ${esc(st.cls)}ನೇ ತರಗತಿ`:'<span class="bad">ಈ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ – ಸರಿಪಡಿಸಿ</span>')+' • '+(sc.err?`<span class="bad">${esc(sc.err)}</span>`:`<b>ಅಂಕ: ${sc.total} / ${sc.n}</b>`)+(r.doubts.length?` • ಹಳದಿ = ${r.doubts.length} ಸಂದೇಹ`:'');
 if(!document.querySelector('#revAns select')){$('#revAns').innerHTML=Array.from({length:nq},(_,q)=>`<div data-q="${q}"><b>${q+1}</b><select data-q="${q}">${['','A','B','C','D','*'].map(v=>`<option value="${v}"${r.answers[q]===v?' selected':''}>${v===''?'–':v==='*'?'ಬಹು':v}</option>`).join('')}</select></div>`).join('');
  document.querySelectorAll('#revAns select').forEach(s=>s.onchange=renderReview)}
 document.querySelectorAll('#revAns div').forEach(d=>{const q=+d.dataset.q;d.className=r.doubts.includes(q)?'d':key[q]?(tmp.answers[q]===key[q]?'c':'w'):''});
 const cv=$('#revCanvas'),x=cv.getContext('2d');if(cv._base)x.putImageData(cv._base,0,0);const k=3,G=OMR.G;
 const circ=(mx,my,col,lw)=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();x.arc(mx*k,my*k,G.r*k+2,0,Math.PI*2);x.stroke()};
 for(let q=0;q<nq;q++){const a=tmp.answers[q],kq=key[q];if(r.doubts.includes(q)){const [x1,y1]=OMR.qXY(q,0),[x4]=OMR.qXY(q,3);x.fillStyle='rgba(250,204,21,.35)';x.fillRect((x1-3)*k,(y1-2.7)*k,(x4-x1+6)*k,5.4*k)}
  if(LET.includes(a)){const [mx,my]=OMR.qXY(q,LET.indexOf(a));circ(mx,my,kq?(a===kq?'#16a34a':'#dc2626'):'#2563eb',2.5)}
  if(kq&&LET.includes(kq)&&a!==kq){const [mx,my]=OMR.qXY(q,LET.indexOf(kq));circ(mx,my,'#16a34a',1.2)}}
 const reg=tmp.reg;for(let i=0;i<9;i++){if(reg[i]>='0'&&reg[i]<='9')circ(G.regX(i),G.regY(+reg[i]),r.regDoubt?'#ca8a04':'#2563eb',2.5)}
 if(LET.includes(tmp.set))circ(G.setX(LET.indexOf(tmp.set)),G.setY,r.setDoubt?'#ca8a04':'#2563eb',2.5)}
$('#revReg').oninput=renderReview;$('#revSet').onchange=renderReview;
$('#revSave').onclick=()=>{const r=revRec;const reg=$('#revReg').value.trim();if(!/^\d{9}$/.test(reg)){alert('ನೋಂದಣಿ ಸಂಖ್ಯೆ 9 ಅಂಕೆ ಇರಬೇಕು');return}
 if(SCANS.some(x=>x.id!==r.id&&x.reg===reg)&&!confirm('ಇದೇ ನೋಂದಣಿ ಸಂಖ್ಯೆಯ ಇನ್ನೊಂದು ಸ್ಕ್ಯಾನ್ ಇದೆ. ಆದರೂ ಉಳಿಸಬೇಕೇ? (ನಂತರ ಒಂದನ್ನು ಅಳಿಸಿ)'))return;
 guard(async()=>{r.reg=reg;r.cls=clsFromReg(reg);r.set=$('#revSet').value;document.querySelectorAll('#revAns select').forEach(s=>{r.answers[+s.dataset.q]=s.value});r.doubts=[];r.regDoubt=false;r.setDoubt=false;r.edited=true;
  await fixDups();closeM('revModal');renderResults()})};
async function fixDups(){const cnt={};SCANS.forEach(x=>cnt[x.reg]=(cnt[x.reg]||0)+1);for(const x of SCANS){const d=cnt[x.reg]>1;if(x.dup!==d||x===revRec){x.dup=d;await STORE.set(P.scans()+'/'+x.id,x)}}}
$('#revDel').onclick=()=>{if(!confirm('ಈ ಸ್ಕ್ಯಾನ್ ಅಳಿಸಬೇಕೇ?'))return;guard(async()=>{const id=revRec.id;await STORE.del(P.scans()+'/'+id);try{await IDB.del(id)}catch(e){}SCANS=SCANS.filter(x=>x.id!==id);revRec=null;await fixDups();closeM('revModal');renderResults()})};

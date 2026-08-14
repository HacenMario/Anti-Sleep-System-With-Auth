/* Anti Sleep System — Platform Enhancement Layer
 * IMPORTANT: this file never changes EAR calculation, eye tracking, MediaPipe,
 * alarm thresholds, or alarm decision logic. It only adds platform features.
 */
(function(){
  'use strict';
  const DB_NAME='AntiSleepPlatformDB';
  const DB_VERSION=1;
  const STORE='pendingSessions';
  const $=id=>document.getElementById(id);
  const t=(key,fallback)=>window.t?window.t(key,fallback):fallback||key;

  function safeText(v){ return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  function fmtTime(sec){sec=Math.max(0,Math.round(Number(sec)||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return [h,m,s].map((x,i)=>i===0?String(x).padStart(2,'0'):String(x).padStart(2,'0')).join(':');}
  function fmtDate(v){try{return new Date(v).toLocaleString()}catch(_){return String(v||'--')}}
  function notify(msg){ if(typeof window.showToast==='function') window.showToast(msg); else {const el=$('toast');if(el){el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600);}} }

  /* ---------- IndexedDB offline queue ---------- */
  let dbPromise=null;
  function openDB(){
    if(!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if(dbPromise)return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE)){const s=db.createObjectStore(STORE,{keyPath:'id'});s.createIndex('createdAt','createdAt');}};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('IndexedDB error'));
    });
    return dbPromise;
  }
  async function queuePut(payload){
    try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({id:payload.clientSessionId||crypto.randomUUID(),createdAt:Date.now(),attempts:0,payload});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});await refreshQueueUI();return true;}catch(e){console.warn('Offline queue unavailable',e);return false;}}
  async function queueAll(){try{const db=await openDB();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);});}catch(_){return[]}}
  async function queueDelete(id){try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}catch(_){} }

  async function syncQueue(){
    if(!navigator.onLine)return;
    const items=await queueAll();
    if(!items.length){await refreshQueueUI();return;}
    let synced=0;
    for(const item of items){
      try{
        const res=await fetch('/api/data/sessions',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(item.payload)});
        if(res.status===401){await queueDelete(item.id);continue;}
        if(!res.ok)throw new Error('HTTP '+res.status);
        await queueDelete(item.id);synced++;
      }catch(e){
        try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');const s=tx.objectStore(STORE);const req=s.get(item.id);req.onsuccess=()=>{const x=req.result;if(x){x.attempts=(x.attempts||0)+1;s.put(x)}resolve()};req.onerror=()=>reject(req.error);});}catch(_){}
      }
    }
    await refreshQueueUI();
    if(synced){notify(t('تمت مزامنة الجلسات المؤجلة','Pending sessions synchronized'));}
  }
  async function refreshQueueUI(){
    const items=await queueAll();
    const n=items.length;
    const el=$('pendingSyncCount');if(el)el.textContent=String(n);
    const status=$('cloudQueueStatus');if(status)status.textContent=n?`${n} ${t('معلقة','pending')}`:t('متزامن','Synced');
    const health=$('cloudHealthPlatform');if(health){health.textContent=n?t('معلّق','Pending'):t('متزامن','Synced');health.className='platform-status '+(n?'warn':'ok');}
  }

  /* Replace only the session-upload hook. Core session creation stays untouched. */
  function installSessionQueueHook(){
    const hook=window.__antiSleepSaveRemoteSession;
    if(typeof hook!=='function'||hook.__platformWrapped)return false;
    const wrapped=async function(payload){
      const enriched={...payload,clientSessionId:payload.clientSessionId||('web-'+Date.now()+'-'+Math.random().toString(36).slice(2,10))};
      if(!navigator.onLine){await queuePut(enriched);notify(t('تم حفظ الجلسة محليًا وسيتم مزامنتها لاحقًا','Session saved locally and will sync later'));return;}
      try{
        const res=await fetch('/api/data/sessions',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(enriched)});
        if(!res.ok){if(res.status>=500||res.status===429)throw new Error('HTTP '+res.status);return;}
        await refreshQueueUI();
      }catch(e){
        await queuePut(enriched);
        notify(t('تعذر الاتصال بالسحابة، تم حفظ الجلسة محليًا','Cloud unavailable; session saved locally'));
      }
    };
    wrapped.__platformWrapped=true;
    window.__antiSleepSaveRemoteSession=wrapped;
    return true;
  }

  /* ---------- Platform center ---------- */
  function injectStyles(){
    const s=document.createElement('style');s.textContent=`
      .platform-modal{position:fixed;inset:0;z-index:120000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.82);backdrop-filter:blur(12px)}
      .platform-modal.show{display:flex}.platform-card{width:min(980px,96vw);max-height:92vh;overflow:auto;border:1px solid rgba(96,165,250,.24);border-radius:22px;background:linear-gradient(145deg,rgba(17,24,39,.99),rgba(7,13,26,.99));box-shadow:0 30px 100px rgba(0,0,0,.7);padding:18px}
      .platform-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px}.platform-title{font-size:1.15rem;font-weight:900}.platform-sub{font-size:.68rem;color:var(--text-secondary);margin-top:4px}.platform-close{width:36px;height:36px;border:1px solid var(--line-soft);background:rgba(255,255,255,.03);color:var(--text-secondary);border-radius:10px;cursor:pointer}
      .platform-tabs{display:flex;gap:6px;overflow:auto;padding:4px;background:rgba(8,12,24,.45);border-radius:12px;margin-bottom:12px}.platform-tab{border:0;background:transparent;color:var(--text-secondary);padding:9px 12px;border-radius:9px;font:inherit;font-size:.7rem;font-weight:800;cursor:pointer;white-space:nowrap}.platform-tab.active{background:rgba(59,130,246,.14);color:var(--text-primary)}
      .platform-page{display:none}.platform-page.active{display:block}.platform-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.platform-stat,.platform-box{padding:12px;border:1px solid var(--line-soft);border-radius:13px;background:rgba(8,12,24,.35)}.platform-stat small,.platform-box small{display:block;color:var(--text-secondary);font-size:.6rem;margin-bottom:5px}.platform-stat strong{font-size:1rem}.platform-status{font-weight:900}.platform-status.ok{color:#86efac}.platform-status.warn{color:#fcd34d}.platform-status.bad{color:#fda4af}
      .platform-chart{height:190px;margin-top:10px;border:1px solid var(--line-soft);border-radius:13px;background:rgba(8,12,24,.3);padding:8px}.platform-chart canvas{width:100%;height:100%}.platform-list{display:grid;gap:7px;margin-top:10px}.platform-row{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:9px 10px;border-radius:10px;background:rgba(26,35,50,.45);border:1px solid rgba(148,163,200,.06);font-size:.68rem}.platform-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.platform-btn{border:1px solid rgba(96,165,250,.2);background:rgba(59,130,246,.08);color:var(--text-primary);border-radius:10px;padding:8px 11px;font:inherit;font-size:.68rem;font-weight:800;cursor:pointer}.platform-btn.danger{border-color:rgba(244,63,94,.25);background:rgba(244,63,94,.07);color:#fda4af}.platform-btn.secondary{background:rgba(255,255,255,.03)}.platform-field{display:grid;gap:5px;margin-top:9px}.platform-field label{font-size:.66rem;color:var(--text-secondary);font-weight:800}.platform-field input{height:40px;border:1px solid var(--line-soft);background:rgba(8,12,24,.55);color:var(--text-primary);border-radius:10px;padding:0 10px;font:inherit}.platform-kpi{font-size:1.25rem;font-weight:900}.platform-note{font-size:.62rem;color:var(--text-secondary);line-height:1.55;margin-top:8px}.platform-security{display:grid;grid-template-columns:1fr 1fr;gap:10px}.platform-health{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.platform-health .platform-box{text-align:center}.pending-badge{display:inline-flex;min-width:20px;height:20px;padding:0 6px;align-items:center;justify-content:center;border-radius:20px;background:rgba(245,158,11,.12);color:#fcd34d;border:1px solid rgba(245,158,11,.2);font-size:.6rem;margin-inline-start:4px}
      @media(max-width:760px){.platform-grid{grid-template-columns:1fr 1fr}.platform-security{grid-template-columns:1fr}.platform-health{grid-template-columns:1fr 1fr}}
      @media(max-width:480px){.platform-grid{grid-template-columns:1fr}.platform-card{padding:12px}.platform-tab{padding:8px 9px}}
    `;document.head.appendChild(s);
  }
  function injectUI(){
    const tools=document.querySelector('.tool-actions');
    if(tools&&!$('platformBtn')){const b=document.createElement('button');b.id='platformBtn';b.className='tool-btn';b.type='button';b.textContent='⚙️ '+t('المنصة','Platform');tools.appendChild(b);}
    if($('platformModal'))return;
    const wrap=document.createElement('div');wrap.className='platform-modal';wrap.id='platformModal';wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML=`<div class="platform-card" role="dialog" aria-modal="true" aria-labelledby="platformTitle">
      <div class="platform-head"><div><div class="platform-title" id="platformTitle">🚀 ${safeText(t('مركز المنصة','Platform Center'))}</div><div class="platform-sub">${safeText(t('ميزات إضافية تعمل خارج محرك تتبع العين والتحليل الأساسي.','Additive platform features that stay outside the core eye tracking and analysis engine.'))}</div></div><button class="platform-close" id="platformClose" type="button">×</button></div>
      <div class="platform-tabs">
        <button class="platform-tab active" data-page="overview">📊 ${safeText(t('لوحة المنصة','Platform dashboard'))}</button>
        <button class="platform-tab" data-page="sessions">📈 ${safeText(t('الجلسات والاتجاهات','Sessions & trends'))}</button>
        <button class="platform-tab" data-page="settings">⚙️ ${safeText(t('الإعدادات','Settings'))}</button>
        <button class="platform-tab" data-page="security">🔐 ${safeText(t('الأمان والحساب','Security & account'))}</button>
        <button class="platform-tab" data-page="privacy">🔒 ${safeText(t('الخصوصية والتشخيص','Privacy & diagnostics'))}</button>
      </div>
      <section class="platform-page active" data-platform-page="overview">
        <div class="platform-grid">
          <div class="platform-stat"><small>${safeText(t('الجلسات المحلية','Local sessions'))}</small><strong id="localSessionCount">0</strong></div>
          <div class="platform-stat"><small>${safeText(t('الجلسات المعلقة للمزامنة','Pending sync'))}</small><strong id="pendingSyncCount" class="pending-badge">0</strong></div>
          <div class="platform-stat"><small>${safeText(t('حالة السحابة','Cloud status'))}</small><strong id="cloudQueueStatus" class="platform-status">${safeText(t('جارٍ التحقق','Checking'))}</strong></div>
          <div class="platform-stat"><small>${safeText(t('حالة التطبيق','App status'))}</small><strong class="platform-status ok">${safeText(t('نشط','Active'))}</strong></div>
        </div>
        <div class="platform-health" style="margin-top:10px">
          <div class="platform-box"><small>📷 ${safeText(t('الكاميرا','Camera'))}</small><strong id="cameraHealthPlatform">--</strong></div>
          <div class="platform-box"><small>👤 ${safeText(t('تتبع الوجه','Face tracking'))}</small><strong id="faceHealthPlatform">--</strong></div>
          <div class="platform-box"><small>👁️ ${safeText(t('تتبع العين','Eye tracking'))}</small><strong id="eyeHealthPlatform">--</strong></div>
          <div class="platform-box"><small>🔊 ${safeText(t('الصوت','Audio'))}</small><strong id="audioHealthPlatform">--</strong></div>
          <div class="platform-box"><small>☁️ ${safeText(t('المزامنة','Sync'))}</small><strong id="cloudHealthPlatform" class="platform-status">--</strong></div>
          <div class="platform-box"><small>📦 ${safeText(t('التخزين المحلي','Local storage'))}</small><strong id="storageHealthPlatform" class="platform-status ok">IndexedDB</strong></div>
        </div>
        <div class="platform-actions"><button class="platform-btn" id="platformSyncBtn">↻ ${safeText(t('مزامنة الآن','Sync now'))}</button><button class="platform-btn" id="platformInstallBtn">📱 ${safeText(t('تثبيت التطبيق','Install app'))}</button><button class="platform-btn secondary" id="platformFullscreenBtn">⛶ ${safeText(t('ملء الشاشة','Fullscreen'))}</button></div>
        <div class="platform-note">${safeText(t('محرك EAR وتتبع العين والإنذار الأساسي لا يتم تعديلها بواسطة هذه الطبقة.','The EAR engine, eye tracking and core alarm logic are not modified by this layer.'))}</div>
      </section>
      <section class="platform-page" data-platform-page="sessions">
        <div class="platform-grid"><div class="platform-stat"><small>${safeText(t('إجمالي الجلسات','Total sessions'))}</small><strong id="trendSessions">0</strong></div><div class="platform-stat"><small>${safeText(t('إجمالي وقت المراقبة','Monitoring time'))}</small><strong id="trendTime">0m</strong></div><div class="platform-stat"><small>${safeText(t('إجمالي التنبيهات','Total alarms'))}</small><strong id="trendAlerts">0</strong></div><div class="platform-stat"><small>${safeText(t('متوسط التنبيهات/جلسة','Avg alarms/session'))}</small><strong id="trendAvgAlerts">0</strong></div></div>
        <div class="platform-chart"><canvas id="trendChart" width="900" height="220"></canvas></div>
        <div class="platform-actions"><button class="platform-btn" id="platformExportJson">📥 ${safeText(t('تصدير البيانات','Export data'))}</button><button class="platform-btn" id="platformPrintReport">📄 ${safeText(t('تقرير PDF / طباعة','PDF / Print report'))}</button></div>
        <div class="platform-list" id="platformSessionList"></div>
      </section>
      <section class="platform-page" data-platform-page="settings">
        <div class="platform-grid"><div class="platform-box"><small>${safeText(t('حد الإنذار الحالي','Current alarm limit'))}</small><strong id="platformAlarmSetting">--</strong></div><div class="platform-box"><small>${safeText(t('عتبة EAR الحالية','Current EAR threshold'))}</small><strong id="platformEarSetting">--</strong></div><div class="platform-box"><small>${safeText(t('المعايرة التكيفية','Adaptive calibration'))}</small><strong id="platformAdaptiveSetting">--</strong></div><div class="platform-box"><small>${safeText(t('اللغة الحالية','Current language'))}</small><strong id="platformLanguageSetting">--</strong></div></div>
        <div class="platform-actions"><button class="platform-btn" id="platformOpenSettings">⚙️ ${safeText(t('فتح الإعدادات الحالية','Open current settings'))}</button><button class="platform-btn secondary" id="platformCompactBtn">▦ ${safeText(t('تبديل الواجهة المختصرة','Toggle compact UI'))}</button></div>
        <div class="platform-note">${safeText(t('هذه اللوحة لا تعيد تعريف أي قيمة كشف؛ هي تعرض وتدير إعدادات الواجهة الحالية فقط.','This panel does not redefine detection values; it only exposes the existing UI settings.'))}</div>
      </section>
      <section class="platform-page" data-platform-page="security">
        <div class="platform-security"><div class="platform-box"><small>${safeText(t('الحساب الحالي','Current account'))}</small><strong id="securityUser">--</strong><div class="platform-note" id="securityLogin">--</div></div><div class="platform-box"><small>${safeText(t('جلسة المصادقة','Authentication session'))}</small><strong class="platform-status ok">${safeText(t('محمية عبر HttpOnly Cookie','Protected by HttpOnly Cookie'))}</strong><div class="platform-actions"><button class="platform-btn danger" id="platformLogoutAll">↪ ${safeText(t('تسجيل الخروج من جميع الجلسات','Sign out all sessions'))}</button></div></div></div>
        <div class="platform-box" style="margin-top:10px"><small>${safeText(t('تغيير كلمة المرور','Change password'))}</small><div class="platform-field"><label>${safeText(t('كلمة المرور الحالية','Current password'))}</label><input id="oldPassword" type="password" autocomplete="current-password"></div><div class="platform-field"><label>${safeText(t('كلمة المرور الجديدة','New password'))}</label><input id="newPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password"></div><div class="platform-field"><label>${safeText(t('تأكيد كلمة المرور','Confirm password'))}</label><input id="confirmPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password"></div><div class="platform-actions"><button class="platform-btn" id="changePasswordBtn">🔑 ${safeText(t('تحديث كلمة المرور','Update password'))}</button></div></div>
      </section>
      <section class="platform-page" data-platform-page="privacy">
        <div class="platform-grid"><div class="platform-box"><small>🎥 ${safeText(t('الفيديو','Video'))}</small><strong>${safeText(t('لا يتم تخزينه','Not stored'))}</strong></div><div class="platform-box"><small>👤 ${safeText(t('صور الوجه','Face images'))}</small><strong>${safeText(t('لا يتم تخزينها','Not stored'))}</strong></div><div class="platform-box"><small>📍 ${safeText(t('Landmarks','Landmarks'))}</small><strong>${safeText(t('لا يتم إرسالها','Not sent'))}</strong></div><div class="platform-box"><small>📦 ${safeText(t('بيانات الجلسة','Session data'))}</small><strong>${safeText(t('ملخصات فقط','Summaries only'))}</strong></div></div>
        <div class="platform-list"><div class="platform-row"><span>${safeText(t('الاتصال بالخادم','Backend connectivity'))}</span><strong id="backendHealthPlatform">Checking</strong></div><div class="platform-row"><span>${safeText(t('حالة IndexedDB','IndexedDB status'))}</span><strong id="idbHealthPlatform">Checking</strong></div><div class="platform-row"><span>${safeText(t('FPS الحالي','Current FPS'))}</span><strong id="diagFpsPlatform">--</strong></div><div class="platform-row"><span>${safeText(t('جودة التتبع','Tracking quality'))}</span><strong id="diagQualityPlatform">--</strong></div><div class="platform-row"><span>${safeText(t('حالة العين الحالية','Current eye state'))}</span><strong id="diagEyePlatform">--</strong></div></div>
        <div class="platform-actions"><button class="platform-btn" id="platformHealthCheck">🩺 ${safeText(t('فحص النظام','Run health check'))}</button><button class="platform-btn secondary" id="platformClearLocal">🗑 ${safeText(t('مسح بيانات المنصة المحلية','Clear local platform data'))}</button></div>
      </section>
    </div>`;
    document.body.appendChild(wrap);
  }

  function openPlatform(page){const m=$('platformModal');if(!m)return;m.classList.add('show');m.setAttribute('aria-hidden','false');if(page)activatePage(page);refreshAll();}
  function closePlatform(){const m=$('platformModal');if(!m)return;m.classList.remove('show');m.setAttribute('aria-hidden','true');}
  function activatePage(page){document.querySelectorAll('.platform-tab').forEach(b=>b.classList.toggle('active',b.dataset.page===page));document.querySelectorAll('[data-platform-page]').forEach(p=>p.classList.toggle('active',p.dataset.platformPage===page));if(page==='sessions')loadTrends();if(page==='security')loadSecurity();}

  function getLocalSessions(){try{return JSON.parse(localStorage.getItem('antiSleepSessions')||'[]')}catch(_){return[]}}
  function drawTrend(sessions){const c=$('trendChart');if(!c)return;const ctx=c.getContext('2d');const dpr=window.devicePixelRatio||1;const w=c.clientWidth||900,h=c.clientHeight||220;c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const data=(sessions||[]).slice(0,12).reverse();if(!data.length){ctx.fillStyle='#94a3c8';ctx.font='13px system-ui';ctx.fillText(t('لا توجد بيانات جلسات بعد','No session data yet'),20,30);return;}const vals=data.map(x=>Number(x.alerts??x.alertCount??0));const max=Math.max(1,...vals);const left=30,top=18,right=12,bottom=28;const cw=w-left-right,ch=h-top-bottom;ctx.strokeStyle='rgba(148,163,200,.16)';ctx.lineWidth=1;for(let i=0;i<4;i++){const y=top+ch*i/3;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();}ctx.strokeStyle='#60a5fa';ctx.lineWidth=2.5;ctx.beginPath();data.forEach((x,i)=>{const px=left+(data.length===1?cw/2:cw*i/(data.length-1));const py=top+ch-(vals[i]/max)*ch;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.fillStyle='#60a5fa';data.forEach((x,i)=>{const px=left+(data.length===1?cw/2:cw*i/(data.length-1));const py=top+ch-(vals[i]/max)*ch;ctx.beginPath();ctx.arc(px,py,3.5,0,Math.PI*2);ctx.fill();});}

  async function loadTrends(){
    let sessions=getLocalSessions();
    try{const res=await fetch('/api/data/sessions?limit=30',{credentials:'include'});if(res.ok){const data=await res.json();if(Array.isArray(data.sessions)&&data.sessions.length)sessions=data.sessions.map(x=>({date:x.endedAt||x.startedAt,duration:x.durationSeconds,alerts:x.alertCount,alertSeconds:x.alertSeconds,avgEar:x.avgEar,minEar:x.minEar,perclos:x.perclos,riskScore:x.riskScore,completed:x.completed}));}}catch(_){ }
    const total=sessions.reduce((a,x)=>a+(Number(x.duration)||0),0),alerts=sessions.reduce((a,x)=>a+(Number(x.alerts??x.alertCount)||0),0);$('trendSessions').textContent=sessions.length;$('trendTime').textContent=fmtTime(total);$('trendAlerts').textContent=alerts;$('trendAvgAlerts').textContent=sessions.length?(alerts/sessions.length).toFixed(1):'0';
    drawTrend(sessions);const box=$('platformSessionList');if(box)box.innerHTML=sessions.slice(0,10).map(x=>`<div class="platform-row"><span>${safeText(fmtDate(x.date))}</span><strong>🚨 ${Number(x.alerts??x.alertCount)||0} • ${fmtTime(x.duration)}</strong></div>`).join('')||`<div class="platform-note">${safeText(t('لا توجد جلسات محفوظة بعد.','No saved sessions yet.'))}</div>`;
  }

  function refreshSettings(){const alarm=$('thresholdSlider'),ear=$('earThresholdSlider');$('platformAlarmSetting').textContent=alarm?alarm.value+' '+t('ث','s'):'--';$('platformEarSetting').textContent=ear?ear.value:'--';const adaptive=$('adaptiveThresholdLabel');$('platformAdaptiveSetting').textContent=adaptive?adaptive.textContent:t('غير مؤكد','Unconfirmed');$('platformLanguageSetting').textContent=window.getAntiSleepLanguage?window.getAntiSleepLanguage().toUpperCase():'AR';}
  async function loadSecurity(){
    const u=$('authUserName')?.textContent||'--';$('securityUser').textContent=u;
    try{const res=await fetch('/api/auth/security',{credentials:'include'});if(res.ok){const d=await res.json();$('securityLogin').textContent=t('آخر دخول','Last login')+': '+fmtDate(d.lastLoginAt);}}catch(_){$('securityLogin').textContent=t('غير متاح حاليًا','Currently unavailable');}
  }
  async function healthCheck(){
    const button=$('platformHealthCheck');
    const backend=$('backendHealthPlatform');
    const idb=$('idbHealthPlatform');
    if(button){ button.disabled=true; button.setAttribute('aria-busy','true'); button.dataset.originalText=button.dataset.originalText||button.textContent; button.textContent='🩺 '+t('جارٍ الفحص…','Checking…'); }

    try {
      if(backend) backend.textContent=t('جارٍ الفحص…','Checking…');
      const res=await fetch('/api/health',{credentials:'include',cache:'no-store',headers:{'Accept':'application/json'}});
      const contentType=res.headers.get('content-type')||'';
      if(!res.ok) throw new Error('HTTP '+res.status);
      const d=contentType.includes('application/json') ? await res.json() : {};
      if(backend){
        const ok=d.ok !== false;
        backend.textContent=ok?t('متصل','Connected'):t('غير متاح','Unavailable');
        backend.className='platform-status '+(ok?'ok':'bad');
      }
    } catch (_) {
      if(backend){ backend.textContent=t('غير متاح','Unavailable'); backend.className='platform-status bad'; }
    }

    try {
      await openDB();
      if(idb){ idb.textContent=t('جاهز','Ready'); idb.className='platform-status ok'; }
    } catch (_) {
      if(idb){ idb.textContent=t('غير مدعوم','Unsupported'); idb.className='platform-status bad'; }
    }

    const fps=$('diagFpsPlatform'), quality=$('diagQualityPlatform'), eye=$('diagEyePlatform');
    if(fps) fps.textContent=$('fpsValue')?.textContent||'--';
    if(quality) quality.textContent=$('qualityPercent')?.textContent||'--';
    if(eye) eye.textContent=$('eyeState')?.textContent||'--';

    if(button){
      button.disabled=false;
      button.removeAttribute('aria-busy');
      button.textContent='🩺 '+t('فحص النظام','Run health check');
    }
  }
  async function refreshAll(){await refreshQueueUI();refreshSettings();healthCheck();const ls=getLocalSessions();$('localSessionCount').textContent=String(ls.length);$('cameraHealthPlatform').textContent=$('cameraHealth')?.textContent||'--';$('faceHealthPlatform').textContent=$('faceHealth')?.textContent||'--';$('eyeHealthPlatform').textContent=$('eyeHealth')?.textContent||'--';$('audioHealthPlatform').textContent=$('audioHealth')?.textContent||'--';}

  function exportData(){const data={application:'Anti Sleep System',exportedAt:new Date().toISOString(),localSessions:getLocalSessions(),pendingSync:[]};queueAll().then(q=>{data.pendingSync=q;const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='anti-sleep-platform-data.json';a.click();URL.revokeObjectURL(a.href);notify(t('تم تصدير بيانات المنصة','Platform data exported'));});}
  function printReport(){const sessions=getLocalSessions();const rows=sessions.slice(0,20).map(x=>`<tr><td>${safeText(fmtDate(x.date))}</td><td>${fmtTime(x.duration)}</td><td>${Number(x.alerts)||0}</td><td>${x.avgEar??'--'}</td><td>${x.perclos??'--'}%</td><td>${x.riskScore??'--'}</td></tr>`).join('');const w=window.open('','_blank','noopener,noreferrer');if(!w){notify(t('اسمح بالنوافذ المنبثقة لإنشاء التقرير','Allow pop-ups to create the report'));return;}w.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>Anti Sleep System Report</title><style>body{font-family:Arial,sans-serif;padding:30px;color:#111}h1{margin-bottom:4px}p{color:#555}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;text-align:center}th{background:#f3f4f6}@media print{button{display:none}}</style></head><body><h1>Anti Sleep System</h1><p>${safeText(t('تقرير جلسات المراقبة','Monitoring sessions report'))} — ${new Date().toLocaleString()}</p><table><thead><tr><th>${safeText(t('التاريخ','Date'))}</th><th>${safeText(t('المدة','Duration'))}</th><th>${safeText(t('التنبيهات','Alerts'))}</th><th>EAR</th><th>PERCLOS</th><th>Risk</th></tr></thead><tbody>${rows||'<tr><td colspan="6">No data</td></tr>'}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();}

  async function changePassword(){const oldP=$('oldPassword').value,newP=$('newPassword').value,confirmP=$('confirmPassword').value;if(newP.length<8||newP.length>128){notify(t('كلمة المرور يجب أن تكون بين 8 و128 حرفًا.','Password must be 8–128 characters.'));return;}if(newP!==confirmP){notify(t('كلمتا المرور غير متطابقتين','Passwords do not match'));return;}try{const res=await fetch('/api/auth/change-password',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword:oldP,newPassword:newP})});const d=await res.json();if(!res.ok)throw new Error(d.message||'Error');$('oldPassword').value='';$('newPassword').value='';$('confirmPassword').value='';notify(t('تم تحديث كلمة المرور','Password updated'));}catch(e){notify(e.message);}}
  async function logoutAll(){try{const res=await fetch('/api/auth/logout-all',{method:'POST',credentials:'include'});if(res.ok){notify(t('تم تسجيل الخروج من جميع الجلسات','Signed out from all sessions'));setTimeout(()=>location.reload(),500);}}catch(_){notify(t('تعذر تنفيذ العملية','Operation failed'));}}

  function bind(){
    $('platformBtn')?.addEventListener('click',()=>openPlatform('overview'));$('platformClose')?.addEventListener('click',closePlatform);$('platformModal')?.addEventListener('click',e=>{if(e.target.id==='platformModal')closePlatform();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closePlatform();});document.querySelectorAll('.platform-tab').forEach(b=>b.addEventListener('click',()=>activatePage(b.dataset.page)));
    $('platformSyncBtn')?.addEventListener('click',()=>syncQueue());$('platformInstallBtn')?.addEventListener('click',()=>document.getElementById('installBtn')?.click());$('platformFullscreenBtn')?.addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.();});
    $('platformExportJson')?.addEventListener('click',exportData);$('platformPrintReport')?.addEventListener('click',printReport);$('platformOpenSettings')?.addEventListener('click',()=>{closePlatform();document.querySelector('.settings-row')?.scrollIntoView({behavior:'smooth',block:'center'});});$('platformCompactBtn')?.addEventListener('click',()=>document.getElementById('compactBtn')?.click());$('changePasswordBtn')?.addEventListener('click',changePassword);$('platformLogoutAll')?.addEventListener('click',logoutAll);$('platformClearLocal')?.addEventListener('click',async()=>{if(confirm(t('مسح بيانات المنصة المحلية؟ لن يحذف جلسات Cloud.','Clear local platform data? Cloud sessions will not be deleted.'))){try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});localStorage.removeItem('antiSleepPlatformNotifications');await refreshQueueUI();notify(t('تم مسح بيانات المنصة المحلية','Local platform data cleared'));}catch(_){}}});
    document.addEventListener('click',event=>{const target=event.target?.closest?.('#platformHealthCheck');if(target) healthCheck();});
    window.addEventListener('online',syncQueue);window.addEventListener('antiSleepLanguageChanged',()=>{ const lang=window.getAntiSleepLanguage?.()||'ar'; const modal=$('platformModal'); if(modal){ modal.dir=lang==='ar'?'rtl':'ltr'; modal.style.setProperty('direction',lang==='ar'?'rtl':'ltr','important'); } setTimeout(refreshAll,50); });
    setInterval(()=>{if($('platformModal')?.classList.contains('show')){refreshSettings();$('diagFpsPlatform').textContent=$('fpsValue')?.textContent||'--';$('diagQualityPlatform').textContent=$('qualityPercent')?.textContent||'--';$('diagEyePlatform').textContent=$('eyeState')?.textContent||'--';}},1000);
  }

  async function init(){injectStyles();injectUI();bind();refreshAll();installSessionQueueHook();setTimeout(installSessionQueueHook,500);setTimeout(installSessionQueueHook,1500);syncQueue();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

from pathlib import Path
p=Path('/mnt/data/anti_sleep_auth/index(5).html')
s=p.read_text(encoding='utf-8')

css=r'''
        /* ============================================================
           ACCOUNT AUTHENTICATION UI
           Additive layer only. Monitoring/detection logic untouched.
           ============================================================ */
        .auth-user-area{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
        .auth-btn{border:1px solid rgba(96,165,250,.22);background:rgba(26,35,50,.72);color:var(--text-primary);border-radius:10px;min-height:34px;padding:6px 11px;cursor:pointer;font-size:.76rem;font-weight:800;transition:var(--transition)}
        .auth-btn:hover{transform:translateY(-1px);border-color:rgba(96,165,250,.48);background:rgba(59,130,246,.11)}
        .auth-user-badge{display:none;align-items:center;gap:7px;padding:6px 9px;border-radius:10px;background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.16);color:#a7f3d0;font-size:.68rem;font-weight:800}
        .auth-user-badge.show{display:inline-flex}
        .auth-user-dot{width:7px;height:7px;border-radius:50%;background:var(--accent-green);box-shadow:0 0 10px rgba(52,211,153,.45)}
        .auth-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(3,7,18,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
        .auth-modal.show{display:flex}
        .auth-card{width:min(440px,94vw);padding:22px;border:1px solid rgba(96,165,250,.24);border-radius:20px;background:linear-gradient(145deg,rgba(17,24,39,.98),rgba(9,15,28,.98));box-shadow:0 25px 80px rgba(0,0,0,.65),0 0 50px rgba(59,130,246,.08)}
        .auth-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}
        .auth-card-title{font-size:1.15rem;font-weight:900;color:var(--text-primary)}
        .auth-card-sub{margin-top:4px;color:var(--text-secondary);font-size:.68rem;line-height:1.55}
        .auth-close{width:34px;height:34px;border:1px solid var(--line-soft);border-radius:10px;background:rgba(255,255,255,.03);color:var(--text-secondary);cursor:pointer;font-size:1.05rem}
        .auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px;padding:4px;border-radius:12px;background:rgba(8,12,24,.42)}
        .auth-tab{border:0;border-radius:9px;padding:9px;background:transparent;color:var(--text-secondary);font:inherit;font-size:.75rem;font-weight:800;cursor:pointer}
        .auth-tab.active{background:rgba(59,130,246,.14);color:var(--text-primary);box-shadow:inset 0 0 0 1px rgba(96,165,250,.15)}
        .auth-form{display:grid;gap:10px}
        .auth-field{display:grid;gap:5px}
        .auth-field label{color:var(--text-secondary);font-size:.68rem;font-weight:700}
        .auth-field input{width:100%;height:44px;padding:0 12px;border-radius:11px;border:1px solid var(--line-soft);background:rgba(8,12,24,.58);color:var(--text-primary);outline:none;font:inherit;font-size:.8rem}
        .auth-field input:focus{border-color:rgba(96,165,250,.55);box-shadow:0 0 0 3px rgba(59,130,246,.08)}
        .auth-submit{height:45px;margin-top:3px;border:1px solid #60a5fa;border-radius:12px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;font:inherit;font-size:.82rem;font-weight:900;cursor:pointer}
        .auth-submit:disabled{opacity:.55;cursor:wait}
        .auth-message{min-height:18px;font-size:.68rem;line-height:1.45;color:var(--text-secondary)}
        .auth-message.error{color:#fda4af}.auth-message.success{color:#a7f3d0}
        .auth-privacy{margin-top:10px;padding:9px 10px;border-radius:10px;background:rgba(52,211,153,.045);border:1px solid rgba(52,211,153,.12);color:#b7f7d8;font-size:.61rem;line-height:1.5}
        .auth-logged-panel{display:none;gap:10px}.auth-logged-panel.show{display:grid}
        .auth-profile{padding:11px;border-radius:12px;background:rgba(8,12,24,.35);border:1px solid rgba(148,163,200,.07)}
        .auth-profile-name{font-size:.86rem;font-weight:900;color:var(--text-primary)}
        .auth-profile-email{margin-top:3px;color:var(--text-secondary);font-size:.68rem}
        .auth-logout{height:42px;border:1px solid rgba(244,63,94,.28);border-radius:11px;background:rgba(244,63,94,.08);color:#fda4af;font:inherit;font-weight:800;cursor:pointer}
        @media(max-width:600px){.auth-user-area{width:100%;justify-content:flex-end}.auth-btn{flex:1}.auth-user-badge{flex:1;justify-content:center}.auth-card{padding:18px}}
'''
if 'ACCOUNT AUTHENTICATION UI' not in s:
    s=s.replace('</style>',css+'\n    </style>',1)

html=r'''
        <!-- ====== ACCOUNT ====== -->
        <div class="auth-user-area" style="display:none" id="authUserArea">
            <span class="auth-user-badge" id="authUserBadge"><span class="auth-user-dot"></span><span id="authUserName">حساب</span></span>
            <button class="auth-btn" id="authAccountBtn" type="button">👤 تسجيل الدخول</button>
        </div>
'''
# Place account controls inside toolbar without disturbing existing controls.
anchor='''            <div class="tool-actions">\n                <button class="tool-btn" id="compactBtn" type="button">▦ واجهة مختصرة</button>\n                <button class="tool-btn" id="fullscreenBtn" type="button">⛶ ملء الشاشة</button>\n            </div>'''
replacement='''            <div class="tool-actions">\n                <button class="tool-btn" id="compactBtn" type="button">▦ واجهة مختصرة</button>\n                <button class="tool-btn" id="fullscreenBtn" type="button">⛶ ملء الشاشة</button>\n                <button class="tool-btn" id="authAccountBtnToolbar" type="button">👤 حساب</button>\n            </div>'''
if 'authAccountBtnToolbar' not in s:
    if anchor not in s: raise SystemExit('toolbar anchor not found')
    s=s.replace(anchor,replacement,1)

modal=r'''
    <!-- ====== AUTH MODAL ====== -->
    <div class="auth-modal" id="authModal" aria-hidden="true">
        <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="authTitle">
            <div class="auth-card-header">
                <div>
                    <div class="auth-card-title" id="authTitle">حسابك في Anti Sleep System</div>
                    <div class="auth-card-sub">أنشئ حسابًا أو سجّل الدخول للوصول إلى حسابك من أي جهاز.</div>
                </div>
                <button class="auth-close" id="authCloseBtn" type="button" aria-label="إغلاق">×</button>
            </div>
            <div class="auth-tabs" id="authTabs">
                <button class="auth-tab active" id="loginTab" type="button">تسجيل الدخول</button>
                <button class="auth-tab" id="registerTab" type="button">إنشاء حساب</button>
            </div>

            <form class="auth-form" id="loginForm" autocomplete="on">
                <div class="auth-field"><label for="loginEmail">البريد الإلكتروني</label><input id="loginEmail" name="email" type="email" autocomplete="email" required placeholder="name@example.com"></div>
                <div class="auth-field"><label for="loginPassword">كلمة المرور</label><input id="loginPassword" name="password" type="password" autocomplete="current-password" required minlength="8" placeholder="••••••••"></div>
                <button class="auth-submit" type="submit">🔐 تسجيل الدخول</button>
            </form>

            <form class="auth-form" id="registerForm" autocomplete="on" style="display:none">
                <div class="auth-field"><label for="registerName">الاسم</label><input id="registerName" name="name" type="text" autocomplete="name" required maxlength="60" placeholder="MADOUNINE HACENE"></div>
                <div class="auth-field"><label for="registerEmail">البريد الإلكتروني</label><input id="registerEmail" name="email" type="email" autocomplete="email" required maxlength="160" placeholder="name@example.com"></div>
                <div class="auth-field"><label for="registerPassword">كلمة المرور</label><input id="registerPassword" name="password" type="password" autocomplete="new-password" required minlength="8" maxlength="128" placeholder="8 أحرف على الأقل"></div>
                <button class="auth-submit" type="submit">✨ إنشاء الحساب</button>
            </form>

            <div class="auth-message" id="authMessage" role="status" aria-live="polite"></div>
            <div class="auth-privacy">🔒 كلمة المرور تُخزّن في قاعدة البيانات بشكل مشفّر/مُجزّأ ولا يتم تخزينها كنص عادي. فيديو الكاميرا يبقى محليًا ولا يتم رفعه إلى MongoDB.</div>

            <div class="auth-logged-panel" id="authLoggedPanel">
                <div class="auth-profile"><div class="auth-profile-name" id="authProfileName">--</div><div class="auth-profile-email" id="authProfileEmail">--</div></div>
                <button class="auth-logout" id="authLogoutBtn" type="button">↪ تسجيل الخروج</button>
            </div>
        </div>
    </div>
'''
if 'id="authModal"' not in s:
    s=s.replace('</body>',modal+'\n</body>',1)

js=r'''
<script>
/* ============================================================
   ACCOUNT AUTHENTICATION CLIENT
   Additive only. It does not touch camera, MediaPipe, EAR,
   alarm logic, Driver Monitoring Mode, analytics, or PWA logic.
   ============================================================ */
(function(){
    'use strict';
    const $=id=>document.getElementById(id);
    const modal=$('authModal'), closeBtn=$('authCloseBtn');
    const loginTab=$('loginTab'), registerTab=$('registerTab');
    const loginForm=$('loginForm'), registerForm=$('registerForm');
    const message=$('authMessage');
    const toolbarBtn=$('authAccountBtnToolbar');
    const userArea=$('authUserArea');
    const userBadge=$('authUserBadge'), userName=$('authUserName');
    const profileName=$('authProfileName'), profileEmail=$('authProfileEmail');
    const loggedPanel=$('authLoggedPanel'), tabs=$('authTabs');
    const logoutBtn=$('authLogoutBtn');
    let currentUser=null;

    function setMessage(text,type){
        if(!message)return;
        message.textContent=text||'';
        message.className='auth-message '+(type||'');
    }
    function openAuth(mode='login'){
        modal?.classList.add('show');
        modal?.setAttribute('aria-hidden','false');
        setMode(mode); setMessage('');
        setTimeout(()=>$(mode==='login'?'loginEmail':'registerName')?.focus(),50);
    }
    function closeAuth(){
        modal?.classList.remove('show');
        modal?.setAttribute('aria-hidden','true');
    }
    function setMode(mode){
        const login=mode==='login';
        loginTab?.classList.toggle('active',login); registerTab?.classList.toggle('active',!login);
        if(loginForm)loginForm.style.display=login?'grid':'none';
        if(registerForm)registerForm.style.display=login?'none':'grid';
        if(tabs)tabs.style.display=currentUser?'none':'grid';
        if(loggedPanel)loggedPanel.classList.toggle('show',!!currentUser);
        if(loginTab)loginTab.disabled=!!currentUser;
        if(registerTab)registerTab.disabled=!!currentUser;
    }
    function setLoading(form,on){
        const btn=form?.querySelector('button[type="submit"]');
        if(btn){btn.disabled=on;btn.dataset.oldText ??= btn.textContent;if(on)btn.textContent='⏳ جارٍ التنفيذ...';else btn.textContent=btn.dataset.oldText;}
    }
    function updateAuthUI(){
        if(!userArea)return;
        userArea.style.display='flex';
        const logged=!!currentUser;
        toolbarBtn.textContent=logged?'👤 الحساب':'👤 تسجيل الدخول';
        userBadge?.classList.toggle('show',logged);
        if(userName)userName.textContent=logged?(currentUser.name||currentUser.email):'حساب';
        if(profileName)profileName.textContent=logged?(currentUser.name||'مستخدم'):'--';
        if(profileEmail)profileEmail.textContent=logged?(currentUser.email||''):'--';
        if(logged) setMode('login');
    }
    async function api(path,options={}){
        const res=await fetch(path,{credentials:'include',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
        let data=null; try{data=await res.json()}catch(e){}
        if(!res.ok) throw new Error(data?.message||'حدث خطأ في الخادم');
        return data;
    }
    async function refreshUser(){
        try{const data=await api('/api/auth/me');currentUser=data.user||null}catch(e){currentUser=null}
        updateAuthUI();
    }

    toolbarBtn?.addEventListener('click',()=>openAuth(currentUser?'login':'login'));
    closeBtn?.addEventListener('click',closeAuth);
    loginTab?.addEventListener('click',()=>setMode('login'));
    registerTab?.addEventListener('click',()=>setMode('register'));
    modal?.addEventListener('click',e=>{if(e.target===modal)closeAuth()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('show'))closeAuth()});

    loginForm?.addEventListener('submit',async e=>{
        e.preventDefault();setMessage('');setLoading(loginForm,true);
        const fd=new FormData(loginForm);
        try{
            const data=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:fd.get('email'),password:fd.get('password')})});
            currentUser=data.user;updateAuthUI();setMessage('تم تسجيل الدخول بنجاح.','success');
            setTimeout(closeAuth,650);
        }catch(err){setMessage(err.message,'error')}
        finally{setLoading(loginForm,false)}
    });

    registerForm?.addEventListener('submit',async e=>{
        e.preventDefault();setMessage('');setLoading(registerForm,true);
        const fd=new FormData(registerForm);
        try{
            const data=await api('/api/auth/register',{method:'POST',body:JSON.stringify({name:fd.get('name'),email:fd.get('email'),password:fd.get('password')})});
            currentUser=data.user;updateAuthUI();setMessage('تم إنشاء الحساب وتسجيل الدخول.','success');registerForm.reset();
            setTimeout(closeAuth,700);
        }catch(err){setMessage(err.message,'error')}
        finally{setLoading(registerForm,false)}
    });

    logoutBtn?.addEventListener('click',async()=>{
        try{await api('/api/auth/logout',{method:'POST'});currentUser=null;updateAuthUI();setMessage('تم تسجيل الخروج.','success');setMode('login');}
        catch(err){setMessage(err.message,'error')}
    });

    refreshUser();
})();
</script>
'''
if 'ACCOUNT AUTHENTICATION CLIENT' not in s:
    s=s.replace('</body>',js+'\n</body>',1)

p.write_text(s,encoding='utf-8')

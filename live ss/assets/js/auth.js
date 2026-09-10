/* LiveSight — Auth: جلسة، 2FA، قفل تلقائي، حراسة، سجلات */
const Auth = {
  _sessKey:'ls_session', _lockKey:'ls_locked', _seenKey:'ls_seen',
  failed:{count:0, until:0},

  current(){ try{ return JSON.parse(localStorage.getItem(this._sessKey)); }catch(e){ return null; } },
  save(s){ localStorage.setItem(this._sessKey, JSON.stringify(s)); },
  clear(){ localStorage.removeItem(this._sessKey); },

  isLocked(){ return localStorage.getItem(this._lockKey) === '1'; },
  setLock(v){ v ? localStorage.setItem(this._lockKey,'1') : localStorage.removeItem(this._lockKey); },

  get db(){ return Store.db(); },

  findUser(email, pass){
    const u = this.db.users.find(x=> x.email.toLowerCase()===String(email).toLowerCase().trim());
    if(u && u.pass===pass) return u;
    return null;
  },
  /* 2FA: تخطي للجهاز الموثوق */
  skipTfa(){ const s=this.current(); if(s){ s.tfaOk=true; this.save(s); } },
  resetFailed(){ this.failed.count=0; this.failed.until=0; },

  attempt(email,pass){
    const now=Date.now();
    if(now < this.failed.until){ return {ok:false, locked:true}; }
    const u=this.findUser(email,pass);
    if(!u){
      this.failed.count++;
      if(this.failed.count>=5){ this.failed.until=now+5*60*1000; this.failed.count=0; }
      const db=this.db;
      Audit.log(db, String(email||'unknown'),'LOGIN_FAIL','محاولة دخول فاشلة','Échec connexion');
      Store.save(db);
      return {ok:false, locked:false};
    }
    if(u.banned){
      const db=this.db;
      Audit.log(db, u.id,'LOGIN_BLOCKED','دخول مرفوض — الحساب موقوف','Connexion refusée — compte suspendu');
      Store.save(db);
      return {ok:false, locked:false, banned:true};
    }
    this.resetFailed();
    return {ok:true, user:u};
  },

  /* بدء الجلسة: يعيد الطرقة التي يجب الانتقال إليها */
  start(userId){
    const db=this.db;
    const u=db.users.find(x=>x.id===userId);
    if(!u) return;
    u.online=true; u.lastSeen=new Date().toISOString();
    const seen=JSON.parse(localStorage.getItem(this._seenKey)||'{}');
    let needTfa = u.twoFA && !seen[userId];
    this.save({
      userId, role:u.role, name:u.name, email:u.email,
      loginAt:new Date().toISOString(), tfaOk:!needTfa, lastActive:Date.now()
    });
    Audit.log(db, u.id, 'LOGIN', 'دخول ناجح: '+u.name, 'Connexion: '+ (u.nameFr||u.name));
    Store.save(db);
    return needTfa ? '2fa' : 'ok';
  },

  finishTfa(){ const s=this.current(); if(s){ s.tfaOk=true; this.lastActive=Date.now(); } setTimeout(()=>{ const c=this.current(); if(c){ c.tfaOk=true; this.save(c); } },0); },

  touch(){ const s=this.current(); if(s){ s.lastActive=Date.now(); this.save(s); } localStorage.setItem('ls_last_activity', Date.now()); },

  logout(){
    const s=this.current();
    if(s){
      const db=this.db; const u=db.users.find(x=>x.id===s.userId);
      if(u){ u.online=false; u.lastSeen=new Date().toISOString(); }
      Audit.log(db, s.userId, 'LOGOUT','تسجيل خروج','Déconnexion');
      Store.save(db);
    }
    this.clear(); this.setLock(false);
    location.href='login.html';
  },

  guard(requiredRole){
    const s=this.current();
    if(!s){ location.href='login.html'; return null; }
    const u=s.userId?this.db.users.find(x=>x.id===s.userId):null;
    if(u && u.banned){ this.clear(); this.setLock(false); location.href='login.html'; return null; }
    if(requiredRole==='admin' && s.role!=='admin'){ location.href='app.html'; return null; }
    return s;
  },

  /* قفل تلقائي عند الخمول */
  startAutoLock(){
    setInterval(()=>{
      const s=this.current(); if(!s) return;
      const cfg=this.db.settings; const opt=Store.read('ls_prefs', {autoLock:false, mins:5});
      if(!opt.autoLock) return;
      const last=Number(localStorage.getItem('ls_last_activity')||Date.now());
      if(!this.isLocked() && Date.now()-last > opt.mins*60000) this.setLock(true);
    }, 15000);
  },

  refreshLang(){ /* يُحدّث نصوص UI ثابتة */ I18n.apply(); }
};
window.Auth=Auth;
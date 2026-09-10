/* LiveSight — شاشات المستخدم */
const AppView = { _draft:null, _appliedSet:null, _mapTab:'tasks' };

AppView.db=()=>Store.db();

/* ---------- أدوات عامة ---------- */
AppView.statusChip=function(s){
  const map={open:['teal','open'],in_progress:['blue','inProgress'],awaiting_proof:['warn','awaitingProof'],done:['gray','done'],paid:['ok','paid'],cancelled:['gray','cancelled'],disputed:['danger','disputed']};
  const k=map[s]||['gray',s];
  return `<span class="chip ${k[0]}">${I18n.t(k[1])}</span>`;
};
AppView.catIc=function(cid){ const c=Helpers.catObj(cid); const k=c&&c.ic; if(k&&ICONS[k]) return ICONS[k]; return ICONS.box; };
AppView.taskCard=function(t){
  const db=this.db(); const me=Auth.current(); const mine=me && t.client===me.userId;
  const latlng=HelpT.latlngOf(t); const d=latlng?Helpers.dist(HelpT.meLatLng(), latlng):null;
  return `
  <article class="task-row" data-go="task/${t.id}">
    <div class="mono">${this.catIc(t.cat)}</div>
    <div class="task-meta">
      <div class="task-line">${this.statusChip(t.status)} <span>●</span> ${Helpers.cat(t.cat)} <span>●</span> ${Helpers.wilaya(t.wilaya)} ${d!=null?`<span>●</span> ${d} ${I18n.t('kmAway')}`:''}</div>
      <h3>${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</h3>
      <div class="task-line">${IC.pin} ${Helpers.esc(t.town||'')} ${t.addr?'· '+Helpers.esc(t.addr):''} ${t.schedule?`· ${IC.clock} ${Helpers.date(t.schedule)}`:``} ${!t.schedule?`· ${IC.clock} ${I18n.t('now')}`:''}</div>
      <div class="task-line"><span class="muted small">${Helpers.userName(Helpers.user(mine?t.assignee||t.client:(mine?t.assignee:t.client)))}</span></div>
    </div>
    <div class="task-side">
      <span class="task-price">${Helpers.money(t.budget)}</span>
      ${this.statusChip(t.status)}
      ${mine?'<span class="link-tag">'+I18n.t('myTasks')+'</span>':''}
    </div>
  </article>`;
};

const HelpT = {
  meLatLng(){ const s=Auth.current(); const u=Store.db().users.find(x=>x.id===s.userId); return [u.lat,u.lng]; },
  latlngOf(t){ if(!t) return null; return (t.lat!=null&&t.lng!=null)?[t.lat,t.lng]:null; },
  myAppliedSet(){
    if(this._appliedSet) return this._appliedSet;
    const s=Auth.current(); const db=Store.db();
    this._appliedSet=new Set(db.tasks.filter(t=>t.applications&&t.applications.some(a=>a.user===s.userId)).map(t=>t.id));
    return this._appliedSet;
  },
  refreshApplied(){ this._appliedSet=null; },
  escrowLockedFor(db, userId){
    return db.tasks.filter(t=>t.client===userId && t.offerAmount && ['in_progress','awaiting_proof','disputed'].includes(t.status))
      .reduce((s,t)=>s+t.offerAmount,0);
  },
  wNumber(n){ return `<div style="font-weight:800;font-size:17px">${Helpers.money(n)}</div>`; },
  notifText(n){
    const db=Store.db();
    const t=db.tasks.find(x=>x.id===n.taskId);
    const title=t?Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title):'';
    switch(n.kind){
      case 'notifApplied': return I18n.t('notifApplied')+' — '+title;
      case 'notifProof': return I18n.t('notifProof')+' — '+title;
      case 'notifGeo': return I18n.t('notifGeo')+' — '+title;
      case 'notifAssigned': return I18n.t('notifAssigned')+' — '+title;
      case 'notifEscrow': return I18n.t('notifEscrow')+' — '+title;
      case 'notifRelease': return I18n.t('notifRelease')+' — '+title;
      case 'notifMsg': return I18n.t('notifMsg');
      case 'notifRate': return I18n.t('notifRate');
      case 'notifWallet': return I18n.t('notifWallet');
      case 'notifNewProvider': return I18n.t('notifNewProvider');
      default: return '';
    }
  }
};
AppView.H=HelpT;

/* ---------- Dashboard ---------- */
AppView.dashboard=function(){
  const el=document.getElementById('view');
  const s=Auth.current(); const db=this.db(); const me=db.users.find(u=>u.id===s.userId);
  const myTasks=db.tasks.filter(t=>t.client===s.userId);
  const active=myTasks.filter(t=>['open','in_progress','awaiting_proof'].includes(t.status));
  const locked=HelpT.escrowLockedFor(db, s.userId);
  const myExecuting=db.tasks.filter(t=>t.assignee===s.userId && ['in_progress','awaiting_proof'].includes(t.status));
  const earned=db.wallet.filter(w=>w.user===s.userId && ['txRelease','txEarning'].includes(w.type)).reduce((a,x)=>a+x.amount,0);
  const online=me.online;
  const notifs=db.notifs.filter(n=>n.user===s.userId).slice(0,4);

  el.innerHTML=`
  <div class="app-hero">
    <div>
      <div class="ah-sub">${I18n.t('dashHello')}</div>
      <div class="ah-nm">${Helpers.esc(Helpers.userName(me))}</div>
      <button class="pill-btn" data-act="toggleOnline"><span class="pulse-dot ${online?'':'off'}"></span> ${online?I18n.t('online'):I18n.t('offline')}</button>
    </div>
    <div class="ah-ava">${Helpers.initials(Helpers.userName(me))}</div>
  </div>

  <div class="app-balance">
    <div>
      <div class="ab-lbl">${I18n.t('balance')}</div>
      <div class="ab-num">${Helpers.money(me.balance)}</div>
      <div class="ab-lbl" style="margin-top:4px">${I18n.t('escrowHeld')} — ${Helpers.money(locked)}</div>
    </div>
    <div class="ab-acts">
      <button class="btn sm" data-act="goWallet">${ICONS.walletIc}</button>
      <button class="btn ghost sm" data-act="goNew">${ICONS.plus} ${I18n.t('newTask')}</button>
    </div>
  </div>

  <div class="sec-title" style="margin-bottom:10px"><span class="mono">${ICONS.sparkle}</span> ${I18n.t('quickActions')}</div>
  <div class="qa-shelf mb">
    <button class="qa-tile" data-act="goNew"><span class="ic">${ICONS.plus}</span><b>${I18n.t('qaNewTask')}</b><small>${I18n.t('newTaskS')}</small></button>
    <button class="qa-tile" data-act="goAvailable"><span class="ic" style="background:linear-gradient(135deg,#0076F1,#00B8FF)">${ICONS.available}</span><b>${I18n.t('qaFindTask')}</b><small>${I18n.t('distance')}</small></button>
    <button class="qa-tile" data-act="goMap"><span class="ic" style="background:linear-gradient(135deg,#03AEA8,#3DD68C)">${ICONS.map}</span><b>${I18n.t('qaMap')}</b><small>${I18n.t('radarLive')}</small></button>
    <button class="qa-tile" data-go="chats"><span class="ic" style="background:linear-gradient(135deg,#F5A623,#FF9D5C)">${ICONS.chats}</span><b>${I18n.t('chats')}</b><small>${I18n.t('typeMsg')}</small></button>
    <button class="qa-tile" data-act="goWallet"><span class="ic" style="background:linear-gradient(135deg,#0FBF7F,#2EE6A6)">${ICONS.walletIc}</span><b>${I18n.t('qaWallet')}</b><small>${I18n.t('availableNow')}</small></button>
  </div>

  <div class="app-stat mb">
    <div class="as-cell"><div class="as-n">${Helpers.money(earned)}</div><div class="as-l">${I18n.t('totalEarned')}</div></div>
    <div class="as-cell"><div class="as-n">${active.length}</div><div class="as-l">${I18n.t('activeCount')}</div></div>
    <div class="as-cell"><div class="as-n">${db.tasks.filter(t=>t.assignee===s.userId && t.status==='paid').length}</div><div class="as-l">${I18n.t('tasksDoneTask')}</div></div>
  </div>

  <div class="sec-title"><span class="mono">${ICONS.tasks}</span> ${I18n.t('myTasks')}</div>
  ${ myTasks.length? myTasks.slice(0,3).map(t=>this.taskCard(t)).join('') : `<div class="empty">${ICONS.tasks}<b>${I18n.t('emptyList')}</b><button class="btn ghost sm" data-act="goNew">${I18n.t('newTask')}</button></div>` }
  ${ myTasks.length>3?`<button class="btn line full sm" data-act="goTasks" style="margin-block-start:8px">${I18n.t('seeAll')}</button>`:''}

  <div class="sec-title"><span class="mono">${ICONS.tasks}</span> ${I18n.t('tasksIExecuting')}</div>
  ${ myExecuting.length? myExecuting.slice(0,3).map(t=>this.taskCard(t)).join('') : `<div class="empty">${ICONS.available}<b>${I18n.t('noAvail')}</b><button class="btn ghost sm" data-act="goAvailable">${I18n.t('qaFindTask')}</button></div>` }

  <div class="sec-title"><span class="mono">${ICONS.bell}</span> ${I18n.t('notifications')}</div>
  ${ notifs.length? notifs.map(n=>`
    <div class="notif-row ${n.read?'':'unread'}" data-go-notif="${n.id}">
      <div class="mono">${ICONS.bell}</div>
      <div class="task-meta"><b class="small">${Helpers.esc(HelpT.notifText(n))}</b><div class="muted small" style="margin-top:2px">${Helpers.date(n.date)}</div></div>
    </div>`).join('') : `<div class="empty">${ICONS.bell}<b>${I18n.t('noNotifs')}</b></div>`}
  <button class="btn line full sm" style="margin-block-start:8px" data-act="goNotifs">${I18n.t('viewAll')}</button>`;
  Layout.crumb(I18n.t('dashboard'));
  Layout.markNav('dashboard');
};
AppView.toggleOnline=function(){
  const db=this.db(); const s=Auth.current(); const u=db.users.find(x=>x.id===s.userId);
  u.online=!u.online; if(!u.online) u.lastSeen=new Date().toISOString();
  Store.save(db); this.dashboard();
  Toast.show(u.online?I18n.t('online'):I18n.t('offline'), u.online?'ok':'warn');
};

/* ---------- المهام (استعراض) ---------- */
AppView.tasks=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const my=db.tasks.filter(t=>t.client===s.userId);
  const others=db.tasks.filter(t=>t.client!==s.userId && t.public && ['open','in_progress','awaiting_proof','disputed'].includes(t.status));
  const list=[...my, ...others.filter(t=>!my.some(m=>m.id===t.id))];
  const f=this._tf || {q:'',cat:'',wil:'',status:''};
  let filtered=list.filter(t=>{
    if(f.cat && t.cat!==f.cat) return false;
    if(f.wil && t.wilaya!=f.wil) return false;
    if(f.status && t.status!==f.status) return false;
    const txt=(t.title+' '+t.desc+' '+t.town).toLowerCase();
    if(f.q && !txt.includes(f.q.toLowerCase())) return false;
    return true;
  });
  filtered=filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date));

  el.innerHTML=`
  <div class="page-head">
    <div><h2>${I18n.t('tasks')}</h2><div class="sub">${filtered.length} ${I18n.t('totalTasks')}</div></div>
    <div class="acts">
      <button class="btn ghost" data-act="goMap">${ICONS.map} ${I18n.t('map')}</button>
      <a class="btn" href="#" onclick="return false" data-act="goNew">${ICONS.plus} ${I18n.t('newTask')}</a>
    </div>
  </div>
  <div class="filter-bar">
    <div class="field grow"><input data-fi="q" value="${Helpers.esc(f.q)}" placeholder="${I18n.t('search')}…"></div>
    <div class="field"><label>${I18n.t('category')}</label><select data-fi="cat"><option value="">${I18n.t('allCat')}</option>${db.cats.map(c=>`<option value="${c.id}" ${f.cat===c.id?'selected':''}>${langState.lang==='ar'?c.ar:c.fr}</option>`).join('')}</select></div>
    <div class="field"><label>${I18n.t('wilaya')}</label><select data-fi="wil"><option value="">${I18n.t('allWil')}</option>${db.wilayas.map(w=>`<option value="${w[0]}" ${f.wil==w[0]?'selected':''}>${w[1]}</option>`).join('')}</select></div>
    <div class="field"><label>${I18n.t('status')}</label><select data-fi="status"><option value="">${I18n.t('allCat')}</option>${Object.keys(STATUS).map(k=>`<option value="${STATUS[k]}" ${f.status===STATUS[k]?'selected':''}>${I18n.t(k)}</option>`).join('')}</select></div>
  </div>
  ${filtered.length? filtered.map(t=>this.taskCard(t)).join('') : `<div class="empty"><div class="ie">${ICONS.folder}</div><b>${I18n.t('noTasks')}</b>${I18n.t('noResults')}</div>`}`;
  Layout.crumb(I18n.t('tasks'));
  Layout.markNav('tasks');
  el.querySelectorAll('[data-fi]').forEach(inp=>{
    inp.addEventListener('input'||'change',()=>{ this._tf=this._tf||{}; if(inp.getAttribute('data-fi')==='q'){ this._tf.q=inp.value; } else { this._tf[inp.getAttribute('data-fi')]=inp.value; } this._defer(this.tasks.bind(this)); });
  });
};
AppView._defer=function(fn){ clearTimeout(this._td); this._td=setTimeout(fn, 300); };

/* ---------- مهام متاحة ---------- */
AppView.available=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const me=db.users.find(u=>u.id===s.userId);
  const f=this._af || {q:'',cat:'',wil:''};
  let list=db.tasks.filter(t=> t.public && t.client!==s.userId && t.status===STATUS.open);
  list=list.filter(t=>{
    if(f.cat && t.cat!==f.cat) return false;
    if(f.wil && t.wilaya!=f.wil) return false;
    const txt=(t.title+' '+t.desc+' '+t.town+' '+(langState.lang==='fr'?(t.titleFr||''):'')).toLowerCase();
    if(f.q && !txt.includes(f.q.toLowerCase())) return false;
    return true;
  });
  const prefs=Store.read('ls_prefs',{radius:15});
  const applied=HelpT.myAppliedSet();
  list.sort((a,b)=> Helpers.dist(HelpT.meLatLng(), HelpT.latlngOf(a)||HelpT.meLatLng()) - Helpers.dist(HelpT.meLatLng(), HelpT.latlngOf(b)||HelpT.meLatLng()));

  el.innerHTML=`
  <div class="page-head">
    <div><h2>${I18n.t('available')}</h2><div class="sub">${I18n.t('geoDesc')}</div></div>
    <div class="acts">
      <button class="btn ghost" data-act="openGeo">${ICONS.locationIc} ${I18n.t('geo')} · ${prefs.radius} ${I18n.t('kmAway')}</button>
      <button class="btn ghost" data-act="saveWatch">${ICONS.watch} ${I18n.t('watchAdd')}</button>
      <button class="btn" data-act="goMap">${ICONS.map} ${I18n.t('map')}</button>
    </div>
  </div>
  <div class="filter-bar">
    <div class="field grow"><input data-fi="q" value="${Helpers.esc(f.q)}" placeholder="${I18n.t('search')}…"></div>
    <div class="field"><label>${I18n.t('category')}</label><select data-fi="cat"><option value="">${I18n.t('allCat')}</option>${db.cats.map(c=>`<option value="${c.id}" ${f.cat===c.id?'selected':''}>${langState.lang==='ar'?c.ar:c.fr}</option>`).join('')}</select></div>
    <div class="field"><label>${I18n.t('wilaya')}</label><select data-fi="wil"><option value="">${I18n.t('allWil')}</option>${db.wilayas.map(w=>`<option value="${w[0]}" ${f.wil==w[0]?'selected':''}>${w[1]}</option>`).join('')}</select></div>
  </div>
  ${list.length? list.map(t=>{
    const d=Helpers.dist(HelpT.meLatLng(), HelpT.latlngOf(t)||HelpT.meLatLng());
    const near = d<=prefs.radius;
    return `
    <article class="task-row">
      <div class="mono">${this.catIc(t.cat)}</div>
      <div class="task-meta">
        <div class="task-line">${this.statusChip(t.status)} <span>●</span> ${Helpers.cat(t.cat)} <span>●</span> ${Helpers.wilaya(t.wilaya)}</div>
        <h3>${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</h3>
        <div class="task-line">${ICONS.pin} ${Helpers.esc(t.town||'')} <span>●</span> ${d} ${I18n.t('kmAway')} ${near?`<span class="chip ok">${I18n.t('near')}</span>`:''}</div>
        <div class="task-line">${ICONS.clock} ${t.schedule?Helpers.date(t.schedule):I18n.t('now')} <span>●</span> ${t.priceType==='negotiable'?'<span class="chip warn">'+I18n.t('negotiablePrice')+'</span>':I18n.t('fixedPrice')}</div>
      </div>
      <div class="task-side">
        <span class="task-price">${Helpers.money(t.budget)}</span>
        ${applied.has(t.id)?`<span class="chip ok">${I18n.t('applied')}</span>`:`<button class="btn sm" data-act="applyNow" data-id="${t.id}">${I18n.t('apply')}</button>`}
        <button class="btn ghost sm" data-act="taskOpen" data-id="${t.id}">${I18n.t('viewRequest')}</button>
      </div>
    </article>`; }).join('') : `<div class="empty"><div class="ie">${ICONS.map}</div><b>${I18n.t('noAvail')}</b>${I18n.t('noResults')}</div>`}`;
  Layout.crumb(I18n.t('available'));
  Layout.markNav('tasks/available');
  el.querySelectorAll('[data-fi]').forEach(inp=>{ Object.assign(inp,{ oninput:()=>{ this._af=this._af||{}; if(inp.getAttribute('data-fi')==='q') this._af.q=inp.value; else this._af[inp.getAttribute('data-fi')]=inp.value; this._defer(this.available.bind(this)); } }); });
};
AppView.applyNow=function(t){
  const db=this.db(); const s=Auth.current(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  const hasOffer = task.priceType==='negotiable';
  const submit=(offer)=>{
    task.applications=task.applications||[];
    if(task.applications.some(a=>a.user===s.userId)){ Toast.show(I18n.t('applied'),'warn'); return; }
    task.applications.push({user:s.userId, when:new Date().toISOString(), offer:offer||task.budget, msg:''});
    addNotif(db,'u_lina','notifApplied',task.id); /* demo: نفيد عميلًا */
    Store.save(db); HelpT.refreshApplied(); this.callIfAvailable();
    Toast.show(I18n.t('applied'),'ok');
  };
  if(hasOffer){
    Modal.prompt(I18n.t('apply'), Helpers.esc(langState.lang==='ar'?task.title:task.titleFr||task.title),
      `<div class="field mt"><label>${I18n.t('offer')}</label><input data-val="offer" type="number" value="${task.budget}"></div>`, I18n.t('apply')).then(v=>{ if(v && v.offer){ submit(Number(v.offer)); this.taskDetail(['id',task.id]); } });
    return;
  }
  submit(task.budget);
  this.taskDetail(['id',task.id]);
};
AppView.callIfAvailable=function(){ /* تحديث بعد التطبيق */ this.available(); };

/* ---------- الطلبات ---------- */
AppView.requests=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const incoming=db.tasks.filter(t=>t.client===s.userId && t.status===STATUS.open && t.applications && t.applications.length);
  const appliedIds=new Set(db.tasks.filter(t=>t.applications&&t.applications.some(a=>a.user===s.userId)).map(t=>t.id));
  const outgoing=db.tasks.filter(t=>appliedIds.has(t.id));

  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('requests')}</h2><div class="sub">${incoming.length} ${I18n.t('applicants')} · ${outgoing.length} ${I18n.t('tasksIApplied')}</div></div></div>
  <div class="sec-title"><span class="mono">${ICONS.requests}</span> ${I18n.t('reviewReq')} — ${I18n.t('incoming')}</div>
  ${incoming.length? incoming.map(t=>{
    const apps=t.applications||[];
    return `<div class="card mb">
      <div class="flex between wrap">
        <b style="font-size:15px">${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</b>
        <span class="task-price">${Helpers.money(t.budget)}</span>
      </div>
      <div class="divider"></div>
      ${apps.map(a=>{ const u=Helpers.user(a.user); return `
      <div class="flex between wrap mb" style="padding:8px 0;border-bottom:1px dashed var(--line)">
        <div class="flex">
          <div class="avatar sm">${Helpers.initials(Helpers.userName(u))}</div>
          <div><b>${Helpers.esc(Helpers.userName(u))}</b><div class="muted small">${Helpers.ratingStars(u&&u.rating||0)} ${a.offer?Helpers.money(a.offer):''} · ${Helpers.date(a.when)}</div></div>
        </div>
        <div class="flex">
          <button class="btn sm" data-act="acceptApp" data-task="${t.id}" data-user="${a.user}">${I18n.t('acceptOffer')}</button>
          <button class="btn line sm" data-act="rejectApp" data-task="${t.id}" data-user="${a.user}">${I18n.t('reject')}</button>
<button class="btn ghost sm" data-act="chatWith" data-user="${a.user}" data-task="${t.id}">${ICONS.chats}</button>
        </div>
      </div>`;}).join('')}
    </div>`; }).join('') : `<div class="empty">${ICONS.requests}<b>${I18n.t('noApplicants')}</b></div>`}
  <div class="sec-title" style="margin-top:26px"><span class="mono">${ICONS.available}</span> ${I18n.t('tasksIApplied')}</div>
  ${outgoing.length? outgoing.map(t=>this.taskCard(t)).join('') : `<div class="empty">${ICONS.available}<b>${I18n.t('emptyList')}</b></div>`}`;
  Layout.crumb(I18n.t('requests'));
  Layout.markNav('requests');
};
AppView.acceptApp=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-task'));
  const app=task.applications.find(a=>a.user===t.getAttribute('data-user'));
  const client=db.users.find(x=>x.id===task.client);
  const offer=app.offer||task.budget;
  if(client.balance < offer){ Toast.show(I18n.t('noFunds'),'err'); return; }
  Modal.confirm(I18n.t('acceptOfferTitle'), I18n.t('acceptOfferSub')+' — '+Helpers.money(offer), I18n.t('acceptOffer')).then(ok=>{
    if(!ok) return;
    client.balance-=offer;
    task.assignee=app.user; task.status=STATUS.inProgress; task.offerAmount=offer;
    db.wallet.unshift({id:Store.uid(),user:task.client,type:'txEscrow',amount:-offer,date:new Date().toISOString(),ref:'ESC-'+task.id,taskId:task.id,status:'hold'});
    addNotif(db, app.user, 'notifAssigned', task.id);
    addNotif(db, app.user, 'notifEscrow', task.id);
    Audit.log(db, Auth.current().userId,'TASK_ASSIGN','إسناد مهمة '+task.id,'Tâche attribuée '+task.id);
    ensureChat(task.client, app.user, task.id);
    Store.save(db);
    this.taskDetail(['id',task.id]);
    Toast.show(I18n.t('taskAssigned')||'OK','ok');
  });
};
AppView.rejectApp=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-task'));
  task.applications=task.applications.filter(a=>a.user!==t.getAttribute('data-user'));
  Store.save(db); this.requests();
};

/* ---------- إنشاء مهمة (معالج 4 خطوات) ---------- */
AppView.taskCreate=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const d=this.vDraft || this._draft || {step:1, cat:'', wil:16, lat:null, lng:null, town:'', addr:'', schedNow:true, date:'', time:'', pub:true, ptype:'fixed', budget:1000, title:'', desc:''};
  this.vDraft=d; this._draft=d;
  const steps=[I18n.t('firstCat'),I18n.t('secondLoc'),I18n.t('thirdTime'),I18n.t('fourthAvail')];
  const stepHTML=`
  <div class="stepper">${steps.map((s,i)=>`
    <div class="step ${i+1<d.step?'done':(i+1===d.step?'active':'')}"><span class="n">${i+1<d.step?ICONS.check:(i+1)}</span>${s}</div>
    ${i<3?`<div class="step-line ${i+1<d.step?'done':''}"></div>`:''}`).join('')}</div>`;

  let body='';
  if(d.step===1){
    body=`
    <div class="page-head"><div><h2>${I18n.t('catTitle')}</h2><div class="sub">${I18n.t('catSub')}</div></div></div>
    <div class="cat-grid">${db.cats.map(c=>`<div class="cat-opt ${d.cat===c.id?'sel':''}" data-cat="${c.id}"><span class="ci">${this.catIc(c.id)}</span>${langState.lang==='ar'?c.ar:c.fr}</div>`).join('')}</div>`;
  } else if(d.step===2){
    body=`
    <div class="page-head"><div><h2>${I18n.t('locTitle')}</h2><div class="sub">${I18n.t('locSub')}</div></div></div>
    <div class="map-picker lg" id="locmap"></div>
    <div class="field mt"><input id="locsearch" placeholder="${I18n.t('locSearch')}"></div>
    <div class="grid c2 mt">
      <div class="field"><label>${I18n.t('wilaya')}</label><select id="locwil">${db.wilayas.map(w=>`<option value="${w[0]}" ${d.wil==w[0]?'selected':''}>${w[1]}</option>`).join('')}</select></div>
      <div class="field"><label>${I18n.t('townF')}</label><input id="loctown" value="${Helpers.esc(d.town)}"></div>
    </div>
    <div class="field mt"><label>${I18n.t('addressF')}</label><input id="locaddr" value="${Helpers.esc(d.addr)}" placeholder="${I18n.t('addressPh')}"></div>`;
  } else if(d.step===3){
    body=`
    <div class="page-head"><div><h2>${I18n.t('timeTitle')}</h2><div class="sub">${I18n.t('timeSub')}</div></div></div>
    <div class="flex mb">
      <label class="btn ghost" style="cursor:pointer"><input type="radio" name="sch" value="now" ${d.schedNow?'checked':''} style="display:none"> ${I18n.t('scheduleNow')}</label>
      <label class="btn line" style="cursor:pointer"><input type="radio" name="sch" value="later" ${!d.schedNow?'checked':''} style="display:none"> ${I18n.t('date')}</label>
    </div>
    <div class="grid c2" id="schedFields" style="${d.schedNow?'opacity:.45;pointer-events:none':''}">
      <div class="field"><label>${I18n.t('date')}</label><input id="tdate" type="date" value="${d.date}"></div>
      <div class="field"><label>${I18n.t('time')}</label><input id="ttime" type="time" value="${d.time}"></div>
    </div>
    <div class="card mt"><div class="flex" style="gap:14px"><span class="mono">${ICONS.clock}</span><div><b>${I18n.t('estDone')}</b><div class="muted small">${I18n.t('timeSub')}</div></div></div></div>`;
  } else {
    body=`
    <div class="page-head"><div><h2>${I18n.t('availTitle')}</h2><div class="sub">${I18n.t('availSub')}</div></div></div>
    <div class="grid c2 mb">
      <label class="cat-opt ${d.pub?'sel':''}" data-vis="1">${ICONS.users} ${I18n.t('public')}</label>
      <label class="cat-opt ${!d.pub?'sel':''}" data-vis="0">${ICONS.lock}</label>
    </div>
    <div class="field mb"><label>${I18n.t('budget')}</label><input id="tbudget" type="number" value="${d.budget}" min="100" step="100"></div>
    <div class="flex mb">
      <label class="btn ghost" style="cursor:pointer"><input type="radio" name="pt" value="fixed" ${d.ptype==='fixed'?'checked':''} style="display:none"> ${I18n.t('fixedPrice')}</label>
      <label class="btn line" style="cursor:pointer"><input type="radio" name="pt" value="negotiable" ${d.ptype==='negotiable'?'checked':''} style="display:none"> ${I18n.t('negotiablePrice')}</label>
    </div>
    <div class="field mt"><label>${I18n.t('titleF')}</label><input id="ttitle" value="${Helpers.esc(d.title)}" placeholder="${I18n.t('titlePh')}"></div>
    <div class="field mt"><label>${I18n.t('descF')}</label><textarea id="tdesc" rows="4" placeholder="${I18n.t('descPh')}">${Helpers.esc(d.desc)}</textarea></div>`;
  }

  el.innerHTML=`
  <div class="page-head" style="margin-bottom:6px">
    <div><h2>${I18n.t('newTask')}</h2><div class="sub">${I18n.t('newTaskS')}</div></div>
  </div>
  ${stepHTML}
  ${body}
  <div class="flex between mt" style="margin-top:24px">
    ${d.step>1?`<button class="btn line" data-act="prevStep">${I18n.t('back')}</button>`:'<span></span>'}
    ${d.step<4?`<button class="btn" data-act="nextStep">${I18n.t('next')}</button>`:`<button class="btn lg" data-act="saveTask">${I18n.t('createTask')}</button>`}
  </div>`;
  Layout.crumb(I18n.t('newTask'));
  Layout.markNav('tasks');

  if(d.step===1){
    el.querySelectorAll('[data-cat]').forEach(c=>c.addEventListener('click',()=>{ this.vDraft.cat=c.getAttribute('data-cat'); this.taskCreate(); }));
  }
  if(d.step===2){
    if(window.L && !this._mapEl){ setTimeout(()=>{
      const m=Maps.init(el.querySelector('#locmap'));
      const start=d.lat!=null?[d.lat,d.lng]:HelpT.meLatLng();
      const mm=L.marker(start,{draggable:true}).addTo(m);
      m.setView(start, 12);
      mm.on('dragend',()=>{ const p=mm.getLatLng(); this.vDraft.lat=p.lat; this.vDraft.lng=p.lng; });
      m.on('click',(e)=>{ mm.setLatLng(e.latlng); this.vDraft.lat=e.latlng.lat; this.vDraft.lng=e.latlng.lng; });
    },0); }
    const wil=el.querySelector('#locwil'); wil.addEventListener('change',()=>{ const w=Helpers.wilayaObj(Number(wil.value)); if(w){ this.vDraft.lat=w[3]; this.vDraft.lng=w[4]; this.vDraft.wil=Number(wil.value); this.taskCreate(); } });
    ['loctown','locaddr'].forEach(id=>{ const i=el.querySelector('#'+id); i.addEventListener('input',()=>this.vDraft[id.slice(3)]=i.value); });
    el.querySelector('#locsearch').addEventListener('keydown',e=>{ if(e.key==='Enter' && window.L && Maps._map){ const v=e.target.value.trim();
      if(!v) return;
      fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(v+' ,Algérie'))
        .then(r=>r.json()).then(res=>{
          if(res&&res[0]){ const pt=[Number(res[0].lat),Number(res[0].lon)];
            Maps._map.setView(pt,13);
            const mk=Object.values(Maps._map._layers).find(l=>l.options&&l.options.draggable); if(mk) mk.setLatLng(pt);
            this.vDraft.lat=pt[0]; this.vDraft.lng=pt[1]; }
        }).catch(()=>{});
    }});
  }
  if(d.step===3){
    el.querySelectorAll('input[name="sch"]').forEach(r=>r.addEventListener('change',()=>{ this.vDraft.schedNow = r.value==='now'; this.taskCreate(); }));
    const tdate=el.querySelector('#tdate'), ttime=el.querySelector('#ttime');
    tdate.addEventListener('change',()=>this.vDraft.date=tdate.value);
    ttime.addEventListener('change',()=>this.vDraft.time=ttime.value);
  }
  if(d.step===4){
    el.querySelectorAll('[data-vis]').forEach(v=>v.addEventListener('click',()=>{ this.vDraft.pub = v.getAttribute('data-vis')==='1'; this.taskCreate(); }));
    el.querySelectorAll('input[name="pt"]').forEach(r=>r.addEventListener('change',()=>this.vDraft.ptype=r.value));
    const b=el.querySelector('#tbudget'); b.addEventListener('change',()=>this.vDraft.budget=Number(b.value));
    const tt=el.querySelector('#ttitle'); tt.addEventListener('input',()=>this.vDraft.title=tt.value);
    const td=el.querySelector('#tdesc'); td.addEventListener('input',()=>this.vDraft.desc=td.value);
  }
};
AppView.nextStep=function(){ const d=this.vDraft; if(d.step===1 && !d.cat){ Toast.show(I18n.t('required'),'warn'); return; } d.step++; this._draft=this.vDraft; this.taskCreate(); };
AppView.prevStep=function(){ this.vDraft.step--; this._draft=this.vDraft; this.taskCreate(); };
AppView.saveTask=function(){
  const d=this.vDraft;
  if(d.step<4) return;
  if(!d.cat){ Toast.show(I18n.t('required'),'warn'); return; }
  const title=d.title.trim(); const budget=Number(d.budget);
  if(!title){ Toast.show(I18n.t('titleF')+' — '+I18n.t('required'),'warn'); return; }
  if(!budget || budget<100){ Toast.show(I18n.t('invalidAmount'),'err'); return; }
  const db=this.db(); const s=Auth.current();
  const task={ id:Store.uid(), client:s.userId, assignee:null, title:title, titleFr:title, desc:d.desc, descFr:d.desc,
    cat:d.cat, wilaya:d.wil, lat:d.lat||Helpers.wilayaObj(d.wil)[3], lng:d.lng||Helpers.wilayaObj(d.wil)[4],
    town:d.town, addr:d.addr, budget:budget, priceType:d.ptype, public:d.pub,
    schedule: d.schedNow?null:(d.date?new Date(d.date+'T'+(d.time||'09:00')).toISOString():null),
    steps:null, evidence:null, date:new Date().toISOString(), status:STATUS.open, applications:[], offerAmount:null };
  db.tasks.unshift(task);
  Audit.log(db, s.userId,'TASK_CREATE','إنشاء مهمة '+task.id,'Création tâche '+task.id);
  checkGeoAlerts(db, task);
  Store.save(db);
  this._draft=null; this.vDraft=null;
  Toast.show(I18n.t('taskCreated'),'ok');
  Router.go('task/'+task.id);
};

/* ---------- تفاصيل مهمة ---------- */
AppView.taskDetail=function(params){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const id=Array.isArray(params)?params[0]:(params&&params.id);
  const t=db.tasks.find(x=>x.id===id);
  if(!t){ el.innerHTML='<div class="empty">'+I18n.t('noResults')+'</div>'; return; }
  const me=db.users.find(u=>u.id===s.userId);
  const mine = t.client===s.userId;
  const IamProvider = t.assignee===s.userId;
  const clientU=Helpers.user(t.client), provU=t.assignee?Helpers.user(t.assignee):null;
  const d=Helpers.dist(HelpT.meLatLng(), HelpT.latlngOf(t)||HelpT.meLatLng());
  const ratedPair=db.ratings.filter(r=>r.taskId===t.id);
  const applied=HelpT.myAppliedSet().has(t.id);

  const statusPath=['open','in_progress','awaiting_proof','paid'].includes(t.status)?t.status:(t.status==='disputed'?'disputed':'open');
  const stepsTree=[
    {k:'createdOn', done:true, when:t.date},
    {k:'open', done:['open','in_progress','awaiting_proof','paid','disputed'].includes(t.status), when:t.date},
    {k:'inProgress', done:['in_progress','awaiting_proof','paid','disputed'].includes(t.status), when:t.schedule||t.date},
    {k:'awaitingProof', done:['awaiting_proof','paid'].includes(t.status), when: t.status==='awaiting_proof'? t.evidence&&t.evidence.sentAt:null},
    {k:'paid', done:['paid'].includes(t.status), when:t.paidOn||null}
  ];

  el.innerHTML=`
  <div class="page-head">
    <div><h2>${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</h2>
      <div class="sub flex"><span>${this.statusChip(t.status)}</span><span>${Helpers.cat(t.cat)}</span><span>${Helpers.wilaya(t.wilaya)}</span>${d!=null?`<span>${d} ${I18n.t('kmAway')}</span>`:''}</div></div>
    <div class="acts">
      <button class="btn ghost" data-act="shareQr" data-id="${t.id}">${ICONS.qr} QR</button>
      <button class="btn ghost" data-act="chatOpen" data-user="${provU?provU.id:(mine?'u_me':t.client)}" data-task="${t.id}">${ICONS.chats} ${I18n.t('chat')}</button>
      ${mine && !['paid','cancelled'].includes(t.status) ? `<button class="btn line" data-act="cancelTask" data-id="${t.id}">${I18n.t('cancel')}</button>`:''}
      ${mine && ['open','cancelled'].includes(t.status) ? `<button class="btn line" data-act="deleteTask" data-id="${t.id}">${I18n.t('delete')}</button>`:''}
    </div>
  </div>

  <div class="grid" style="grid-template-columns:1.5fr 1fr">
    <div>
      <div class="card">
        <div class="muted small mb" style="font-weight:700">${I18n.t('descF')}</div>
        <p class="mb">${Helpers.esc(langState.lang==='ar'?t.desc:t.descFr||t.desc)}</p>
        <div class="divider"></div>
        <div class="grid c2">
          <div><div class="muted small">${I18n.t('wilaya')}</div><b>${Helpers.wilaya(t.wilaya)}</b></div>
          <div><div class="muted small">${I18n.t('townF')}</div><b>${Helpers.esc(t.town||'—')}</b></div>
          <div style="grid-column:1/-1"><div class="muted small">${I18n.t('addressF')}</div><b>${Helpers.esc(t.addr||'—')}</b></div>
          <div><div class="muted small">${I18n.t('schedule')}</div><b>${t.schedule?Helpers.date(t.schedule):I18n.t('now')}</b></div>
          <div><div class="muted small">${I18n.t('budget')}</div><b class="task-price">${Helpers.money(t.budget)}</b></div>
        </div>
        ${t.offerAmount? `<div class="card" style="background:rgba(245,166,35,.07);border-color:#F3D9B0;margin-top:14px"><div class="flex"><span class="mono" style="background:rgba(245,166,35,.2);color:#C77E08">${ICONS.shield}</span><div><b>${I18n.t('escrowHeld')}</b><div class="muted small">${I18n.t('escrowNote')}. ${I18n.t('releaseInfo')}.</div></div></div></div>`:''}
        ${t.public?'':'<div class="chip warn mt" style="margin-top:12px">'+I18n.t('privateTask')+'</div>'}
      </div>

      <div class="sec-title"><span class="mono">${ICONS.timeline}</span> ${I18n.t('timeline')}</div>
      <div class="card"><div class="timeline">${stepsTree.map((st,i)=>`
        <div class="tl-item ${st.done?'da':''}"><div class="tl-dot">${st.done?ICONS.check:'•'}</div>
        <div class="tl-b"><b>${I18n.t(st.k)}</b>${st.when?`<span>${Helpers.date(st.when)}</span>`:''}</div></div>`).join('')}</div></div>

      ${t.evidence && (mine||IamProvider)? `
      <div class="sec-title"><span class="mono">${ICONS.img}</span> ${I18n.t('evidence')}</div>
      <div class="card">
        ${t.evidence.steps && t.evidence.steps.length?`<div class="mb">${t.evidence.steps.map(ss=>`<div class="chk-step done"><span class="ck">${ICONS.check}</span><b class="small">${Helpers.esc(langState.lang==='ar'?ss:ss)}</b></div>`).join('')}</div>`:''}
        ${t.evidence.photos && t.evidence.photos.length?`<div class="photos-row mb">${t.evidence.photos.map(p=>`<img src="${p}" alt="">`).join('')}</div>`:''}
        ${t.evidence.signature?`<div class="muted small mb">${I18n.t('signature')}</div><img src="${t.evidence.signature}" style="height:60px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:4px">`:''}
        ${t.evidence.note?`<p class="small muted mt">${Helpers.esc(t.evidence.note)}</p>`:''}
      </div>`:''}
    </div>

    <div>
      <div class="card mb">
        <div class="muted small mb">${I18n.t('client')}</div>
        <div class="flex">
          <div class="avatar">${Helpers.initials(Helpers.userName(clientU))}</div>
          <div style="flex:1"><b>${Helpers.esc(Helpers.userName(clientU))}</b>
            <div class="muted small">${Helpers.ratingStars(clientU.rating||0)} ${clientU.rates?`(${clientU.rates})`:''}</div>
          </div>
          <span class="pulse-dot ${clientU.online?'':'off'}"></span>
        </div>
      </div>
      ${provU?`
      <div class="card mb">
        <div class="muted small mb">${I18n.t('provider')}</div>
        <div class="flex">
          <div class="avatar">${Helpers.initials(Helpers.userName(provU))}</div>
          <div style="flex:1"><b>${Helpers.esc(Helpers.userName(provU))}</b>
            <div class="muted small">${Helpers.ratingStars(provU.rating||0)} ${provU.rates?`(${provU.rates})`:''}</div>
          </div>
          <span class="pulse-dot ${provU.online?'':'off'}"></span>
        </div>
        <button class="btn ghost sm full mt" data-act="providerView" data-id="${provU.id}">${I18n.t('viewProfile')}</button>
      </div>`:''}

      ${t.status===STATUS.open && mine && t.applications && t.applications.length?`
      <div class="card mb">
        <div class="sec-title" style="margin:0 0 10px">${I18n.t('applicants')}</div>
        ${t.applications.map(a=>{ const u=Helpers.user(a.user); return `<div class="flex between wrap mb">
          <div class="flex"><div class="avatar sm">${Helpers.initials(Helpers.userName(u))}</div><div><b class="small">${Helpers.esc(Helpers.userName(u))}</b><div class="muted small">${a.offer?Helpers.money(a.offer):''}</div></div></div>
          <div class="flex"><button class="btn sm" data-act="acceptApp" data-task="${t.id}" data-user="${a.user}">${I18n.t('assign')}</button><button class="btn ghost sm" data-act="chatWith" data-user="${a.user}">${ICONS.chats}</button></div></div>`;}).join('')}
      </div>`:''}

      ${t.status===STATUS.open && !mine && t.public && !applied?`
      <div class="card mb">
        <div class="flex col" style="gap:12px">
          <span class="muted small">${I18n.t('tasksIApplied')}?</span>
          <button class="btn full" data-act="applyNow" data-id="${t.id}">${I18n.t('apply')} · ${Helpers.money(t.budget)}</button>
        </div>
      </div>`:''}
      ${applied && !mine && t.status===STATUS.open?`<div class="card mb"><span class="chip ok">${I18n.t('applied')}</span></div>`:''}

      ${IamProvider && t.status===STATUS.inProgress?`
      <div class="card mb" style="border-color:var(--teal)">
        <b class="mb" style="display:block">${I18n.t('stepsChecklist')}</b>
        <div id="chklist"></div>
        <button class="btn ghost sm mt" data-act="addStep">${ICONS.plus} ${I18n.t('addStep')}</button>
        <div class="divider"></div>
        <b class="mb" style="display:block">${I18n.t('proofPhoto')}</b>
        <div class="flex mb">
          <label class="btn ghost sm" style="cursor:pointer">${ICONS.img} ${I18n.t('addPhoto')}<input type="file" accept="image/*" hidden id="photofile"></label>
        </div>
        <div class="photos-row mb" id="photorow"></div>
        <b class="mb" style="display:block">${I18n.t('signature')}</b>
        <canvas class="sign-box" id="signpad" width="440" height="150"></canvas>
        <div class="flex between mt" style="justify-content:flex-end"><button class="btn line sm" data-act="clearSign">${I18n.t('clearSign')}</button></div>
        <div class="field mt"><label>${I18n.t('comment')}</label><input id="evnote"></div>
        <button class="btn full mt" data-act="submitEvidence" data-id="${t.id}">${I18n.t('submitEvidence')}</button>
      </div>`:''}
      ${mine && t.status===STATUS.awaiting_proof?`
      <div class="card mb" style="border-color:var(--teal)">
        <b class="mb" style="display:block">${I18n.t('evidence')}</b>
        <p class="muted small">${I18n.t('confirmDoneSub')}</p>
        <button class="btn full mt" data-act="confirmDone" data-id="${t.id}">${ICONS.check} ${I18n.t('confirmDone')}</button>
        ${!ratedPair.some(r=>r.from===s.userId)?`<button class="btn ghost full mt" data-act="rateTask" data-id="${t.id}">${I18n.t('ratingAfter')}</button>`:''}
      </div>`:''}
      ${(mine||IamProvider) && t.status===STATUS.paid && !ratedPair.some(r=>r.from===s.userId)?`
      <div class="card mb"><button class="btn full" data-act="rateTask" data-id="${t.id}">${ICONS.star} ${I18n.t('ratingAfter')}</button></div>`:''}
      ${(mine||IamProvider) && !['cancelled','paid'].includes(t.status)?`
      <button class="btn line full" data-act="openDispute" data-id="${t.id}">${ICONS.flag} ${I18n.t('dispute')}…</button>`:''}
    </div>
  </div>`;

  Layout.crumb(I18n.t('taskDetail'));
  Layout.markNav('tasks');
  this._detailTaskId=t.id;

  if(IamProvider && t.status===STATUS.inProgress){
    const steps=t.steps||[];
    const row=()=>document.querySelector('#chklist');
    const renderSteps=()=>{ if(row()) row().innerHTML=steps.length?steps.map((s,i)=>`
      <div class="chk-step ${s.done?'done':''}" data-tog="true"><span class="ck">${s.done?ICONS.check:''}</span><b class="small">${Helpers.esc(langState.lang==='ar'?(s.t||s.tFr):(s.tFr||s.t))}</b><button style="margin-inline-start:auto;color:var(--danger)" data-rm="true">✕</button></div>`).join(''):''; };
    renderSteps();
    if(row()) row().addEventListener('click',e=>{ const el=e.target.closest('[data-tog]'); if(el){ const i=Array.from(el.parentNode.children).indexOf(el); steps[i].done=!steps[i].done; renderSteps(); } });
    if(row()) row().addEventListener('click',e=>{ const rm=e.target.closest('[data-rm]'); if(rm){ rowsStep: steps.splice(Array.from(rm.parentNode.parentNode.children).indexOf(rm.parentNode),1); renderSteps(); } });
    const pf=document.querySelector('#photofile');
    if(pf) pf.addEventListener('change',()=>{ const f=pf.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ this._proofPhotos=this._proofPhotos||[]; this._proofPhotos.push(r.result); const pr=document.querySelector('#photorow'); if(pr) pr.innerHTML=(this._proofPhotos||[]).map(p=>`<img src="${p}">`).join(''); }; r.readAsDataURL(f); });
  }
};
AppView.addStep=function(){
  if(!this._detailTaskId) return;
  Modal.prompt(I18n.t('addStep'),'',`<div class="field mt"><input data-val="text" placeholder="${I18n.t('addStep')}"></div>`).then(v=>{
    if(v&&v.text){ const db=this.db(); const t=db.tasks.find(x=>x.id===this._detailTaskId); t.steps=t.steps||[]; t.steps.push({t:v.text, tFr:v.text, done:false}); Store.save(db); this.taskDetail(['id',t.id]); }
  });
};
AppView.clearSign=function(){ const c=document.querySelector('#signpad'); if(!c) return; const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); };
AppView._sign=null;
AppView.submitEvidence=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  const canvas=document.querySelector('#signpad'); let sig=this._sign||null;
  if(canvas){ const x=canvas.getContext('2d'); const has=canvas.toDataURL()!==canvas.getAttribute('data-blank'); if(has) sig=canvas.toDataURL(); }
  const note=document.querySelector('#evnote')?document.querySelector('#evnote').value:'';
  if(!sig){ Toast.show(I18n.t('signature')+' — '+I18n.t('required'),'warn'); return; }
  task.evidence={ steps:(task.steps||[]).map(s=>langState.lang==='ar'?s.t:s.tFr||s.t), photos:this._proofPhotos||[], signature:sig, note, sentAt:new Date().toISOString() };
  task.status=STATUS.awaiting_proof;
  addNotif(db, task.client, 'notifProof', task.id);
  Audit.log(db, Auth.current().userId,'EVIDENCE','دليل إنجاز '+task.id,'Preuve '+task.id);
  Store.save(db);
  Toast.show(I18n.t('evidenceSent'),'ok');
  this.taskDetail(['id',task.id]);
};
AppView.confirmDone=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  const client=db.users.find(u=>u.id===task.client);
  const prov=db.users.find(u=>u.id===task.assignee);
  const offer=task.offerAmount||task.budget;
  const fee=Math.round(offer*(db.settings.feePercent||5)/100);
  const pay=offer-fee;
  Modal.confirm(I18n.t('confirmDone'), I18n.t('confirmDoneSub'), I18n.t('yesConfirm'), 'ok').then(ok=>{
    if(!ok) return;
    task.status=STATUS.paid; task.paidOn=new Date().toISOString();
    client.escrow=Math.max(0,(client.escrow||0)-offer);
    prov.balance=(prov.balance||0)+pay;
    prov.points=(prov.points||0)+20;
    prov.level=Helpers.levelOf(prov.points);
    db.wallet.unshift(
      {id:Store.uid(),user:task.client,type:'txRelease',amount:offer,date:new Date().toISOString(),ref:'REL-'+task.id,taskId:task.id,status:'done'},
      {id:Store.uid(),user:prov.id,type:'txEarning',amount:pay,date:new Date().toISOString(),ref:'PAY-'+task.id,taskId:task.id,status:'done'},
      {id:Store.uid(),user:prov.id,type:'txFee',amount:-fee,date:new Date().toISOString(),ref:'FEE-'+task.id,taskId:task.id,status:'done'}
    );
    addNotif(db, prov.id, 'notifRelease', task.id);
    addNotif(db, client.id, 'notifWallet', null);
    Audit.log(db, Auth.current().userId,'TASK_RELEASE','إفراج ضمان '+task.id,'Libération garantie '+task.id);
    Store.save(db);
    Toast.show(I18n.t('rated')||'OK','ok');
    this.taskDetail(['id',task.id]);
    this.rateTask(t);
  });
};
AppView.rateTask=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  const s=Auth.current();
  const target = task.client===s.userId ? task.assignee : task.client;
  const targetU=Helpers.user(target);
  let stars=5;
  const o=Modal.open(`
    <h3>${s.userId===task.client?I18n.t('rateProvider'):I18n.t('rateClient')} — ${Helpers.esc(Helpers.userName(targetU))}</h3>
    <p class="msub">${I18n.t('ratingAfter')}</p>
    <div class="rating-input mb" id="rinput">${[1,2,3,4,5].map(i=>`<button data-s="${i}">★</button>`).join('')}</div>
    <div class="field"><label>${I18n.t('comment')}</label><input data-val="comment" placeholder="${I18n.t('comment')}"></div>
    <div class="flex mt" style="justify-content:flex-end"><button class="btn" data-ok="${I18n.t('sendRating')}">${I18n.t('sendRating')}</button></div>`);
  o.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{ stars=Number(b.getAttribute('data-s')); o.querySelectorAll('[data-s]').forEach((x,i)=>x.classList.toggle('on', i<stars)); }));
  o.querySelector('[data-ok]').addEventListener('click',()=>{
    const comment=o.querySelector('[data-val="comment"]').value;
    db.ratings.push({id:Store.uid(),taskId:task.id,from:s.userId,to:target,stars,comment,when:new Date().toISOString()});
    const u=db.users.find(x=>x.id===target); const rr=db.ratings.filter(r=>r.to===target);
    u.rating=Math.round(rr.reduce((a,r)=>a+r.stars,0)/rr.length*10)/10; u.rates=rr.length;
    addNotif(db,target,'notifRate',task.id);
    Audit.log(db,s.userId,'RATE','تقييم '+task.id,'Évaluation '+task.id);
    Store.save(db); Modal.close(); Toast.show(I18n.t('rated'),'ok');
    this.taskDetail(['id',task.id]);
  });
};
AppView.openDispute=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  Modal.prompt(I18n.t('dispute'), Helpers.esc(langState.lang==='ar'?task.title:task.titleFr||task.title),
    `<div class="field mt"><label>${I18n.t('reason')}</label><textarea data-val="reason" rows="3"></textarea></div>`, I18n.t('submitEvidence')).then(v=>{
      if(v&&v.reason){
        task.status=STATUS.disputed;
        task.dispute={ reason:v.reason, openedBy:Auth.current().userId, when:new Date().toISOString(), decision:null };
        db.disputes.unshift({id:Store.uid(),taskId:task.id,openedBy:Auth.current().userId,reason:v.reason,reasonFr:v.reason,when:new Date().toISOString(),status:'open',decision:null});
        Audit.log(db,Auth.current().userId,'DISPUTE','فتح نزاع '+task.id,'Litige ouvert '+task.id);
        Store.save(db); Toast.show(I18n.t('taskAssigned')||'OK','ok'); this.taskDetail(['id',task.id]);
      }
    });
};
AppView.cancelTask=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  Modal.confirm(I18n.t('cancel'), I18n.t('cancelTaskSure'), I18n.t('confirm'),'danger').then(ok=>{
    if(!ok) return;
    task.status=STATUS.cancelled;
    if(task.offerAmount && task.client){ const c=db.users.find(u=>u.id===task.client); c.balance+=task.offerAmount; c.escrow=Math.max(0,(c.escrow||0)-task.offerAmount);
      db.wallet.unshift({id:Store.uid(),user:c.id,type:'txRelease',amount:task.offerAmount,date:new Date().toISOString(),ref:'REF-'+task.id,taskId:task.id,status:'done'});
    }
    Store.save(db); Toast.show(I18n.t('taskCancelled'),'ok'); this.taskDetail(['id',task.id]);
  });
};
AppView.deleteTask=function(t){
  const db=this.db(); const id=t.getAttribute('data-id'); const task=db.tasks.find(x=>x.id===id);
  if(!task) return;
  Modal.confirm(I18n.t('delete'), I18n.t('deleteTaskSure'), I18n.t('delete'),'danger').then(ok=>{
    if(!ok) return;
    db.tasks=db.tasks.filter(x=>x.id!==id);
    Store.save(db); Toast.show(I18n.t('taskDeleted'),'ok'); Router.go('tasks');
  });
};
AppView.shareQr=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  const title=Helpers.esc(langState.lang==='ar'?task.title:task.titleFr||task.title);
  const o=Modal.open(`<h3>${I18n.t('qrTask')}</h3><p class="msub">${I18n.t('shareQr')}</p><div class="qr-box"><div id="qrbox"></div><b class="small">${title}</b></div>`);
  QR.make(o.querySelector('#qrbox'), 'livesight://task/'+task.id, 170);
};

/* ---------- الخريطة ---------- */
AppView.mapView=function(){
  this._mapTab=this._mapTab||'tasks';
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current(); const me=db.users.find(u=>u.id===s.userId);
  const prefs=Store.read('ls_prefs',{radius:15});
  el.innerHTML=`
  <div class="map-page">
    <div class="map-side">
      <div class="map-tabs">
        <button data-mtab="tasks" class="${this._mapTab==='tasks'?'active':''}">${I18n.t('tasksLive')}</button>
        <button data-mtab="providers" class="${this._mapTab==='providers'?'active':''}">${ICONS.users} ${I18n.t('providers')}</button>
      </div>
      <div class="top-search">
        ${ICONS.search}<input id="mrowserch" placeholder="${this._mapTab==='providers'?I18n.t('searchProviders'):I18n.t('mapSearch')}">
      </div>
      ${this._mapTab==='tasks'?`
      <div class="flex">
        <div class="field grow"><label>${I18n.t('category')}</label><select id="mcat"><option value="">${I18n.t('allCat')}</option>${db.cats.map(c=>`<option value="${c.id}">${langState.lang==='ar'?c.ar:c.fr}</option>`).join('')}</select></div>
        <div class="field grow"><label>${I18n.t('geo')}</label><input id="mrad" type="number" value="${prefs.radius}" min="1"></div>
      </div>`:`
      <div class="flex">
        <div class="field grow"><label>${I18n.t('category')}</label><select id="mcat"><option value="">${I18n.t('allCat')}</option>${db.cats.map(c=>`<option value="${c.id}">${langState.lang==='ar'?c.ar:c.fr}</option>`).join('')}</select></div>
        <div class="field" style="width:110px"><label>${I18n.t('yourRating')} ≥</label><input id="mmin" type="number" value="4" min="0" max="5" step="0.1"></div>
      </div>`}
      <div class="map-results" id="mlist"></div>
    </div>
    <div class="map-box">
      <span class="live-badge"><span class="pulse-dot"></span> ${I18n.t('live')}</span>
      <div id="lmap" style="height:100%"></div>
    </div>
  </div>`;
  Layout.crumb(I18n.t('map'));
  Layout.markNav('map');

  el.querySelectorAll('[data-mtab]').forEach(b=>b.addEventListener('click',()=>{ this._mapTab=b.getAttribute('data-mtab'); this.mapView(); }));
  const mcat=el.querySelector('#mcat');
  const reRender=()=>{
    const cat=mcat?mcat.value:'';
    const q=el.querySelector('#mrowserch')?el.querySelector('#mrowserch').value.toLowerCase():'';
    const min=el.querySelector('#mmin')?Number(el.querySelector('#mmin').value):0;
    this._renderMap(cat,q,min);
  };
  if(mcat) mcat.addEventListener('change',reRender);
  el.querySelector('#mrowserch').addEventListener('input',()=>this._defer(reRender));
  const mrad=el.querySelector('#mrad'); if(mrad) mrad.addEventListener('change',()=>{ const p=Store.read('ls_prefs',{}); p.radius=Number(mrad.value)||15; Store.write('ls_prefs',p); this.mapView(); });
  const mmin=el.querySelector('#mmin'); if(mmin) mmin.addEventListener('change',reRender);
  this._renderMap('','',0);
};
AppView._renderMap=function(cat,q,min){
  const db=this.db(); const s=Auth.current(); const me=db.users.find(u=>u.id===s.userId);
  const prefs=Store.read('ls_prefs',{radius:15});
  const mL=document.getElementById('lmap');
  if(!mL) return;
  if(!window.L){ document.getElementById('mlist').innerHTML='<div class="empty">Leaflet لم يُحمّل (تحقق من الاتصال)</div>'; return; }
  const map=Maps.init(mL);
  const start=[me.lat,me.lng];
  map.setView(start, 11);
  Maps.me(start);
  Maps.circle(start, prefs.radius, '#0076F1');

  const applied=HelpT.myAppliedSet();
  if(this._mapTab==='tasks'){
    let tasks=db.tasks.filter(t=> (t.public || t.client===s.userId) && ['open','in_progress','awaiting_proof'].includes(t.status) && t.lat&&t.lng);
    if(cat) tasks=tasks.filter(t=>t.cat===cat);
    if(q) tasks=tasks.filter(t=>(t.title+' '+(t.titleFr||t.title)+' '+t.town).toLowerCase().includes(q));
    const listEl=document.getElementById('mlist');
    if(tasks.length===0){ listEl.innerHTML=`<div class="empty">${ICONS.map}<b>${I18n.t('noResults')}</b></div>`; return; }
    listEl.innerHTML=tasks.map(t=>{
      const d=Helpers.dist(start,[t.lat,t.lng]);
      const mine=t.client===s.userId;
      return `<div class="task-row" data-act="flyTo" data-lat="${t.lat}" data-lng="${t.lng}">
        <div class="mono">${this.catIc(t.cat)}</div>
        <div class="task-meta"><div class="task-line">${this.statusChip(t.status)} · ${Helpers.wilaya(t.wilaya)} ${mine?`<span class="chip warn">${I18n.t('me')}</span>`:''}</div>
        <h3 style="font-size:14px">${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</h3>
        <div class="task-line small">${d} ${I18n.t('kmAway')} · ${t.town||''}</div></div>
        <div class="task-side"><div class="task-price" style="font-size:14px">${Helpers.money(t.budget)}</div>
        ${!mine && applied.has(t.id)?`<span class="chip ok">${I18n.t('applied')}</span>`:''}
        ${!mine && !applied.has(t.id)?`<button class="btn sm" data-act="applyNow" data-id="${t.id}">${I18n.t('apply')}</button>`:''}
        <button class="link-tag" data-act="taskOpen" data-id="${t.id}">${I18n.t('viewRequest')}</button></div></div>`;
    }).join('');
    const markers=tasks.map(t=>{
      const d=Helpers.dist(start,[t.lat,t.lng]);
      const near=d<=prefs.radius;
      const mine=t.client===s.userId;
      const popup=`<b>${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</b><div class="small">${Helpers.wilaya(t.wilaya)} · ${d} ${I18n.t('kmAway')} · ${Helpers.money(t.budget)} ${mine?`· <span class="chip warn">${I18n.t('me')}</span>`:near?`· <span class="chip ok">${I18n.t('near')}</span>`:''}</div><a href="#" data-pop-task="${t.id}" onclick="return false" style="display:block;margin-top:6px;font-weight:700">${I18n.t('viewRequest')}</a>`;
      const color=mine?'#F5A623':(t.status==='open'?'#03AEA8':'#0076F1');
      return Maps.pin([t.lat,t.lng], popup, color);
    });
    document.querySelectorAll('[data-pop-task]').forEach(a=>a.addEventListener('click',()=>Router.go('task/'+a.getAttribute('data-pop-task'))));
    Maps.fit([start].concat(tasks.map(t=>[t.lat,t.lng])));
  } else {
    /* منفّذون */
    let provs=db.users.filter(u=> u.role==='user' && u.id!==s.userId && u.online && u.skills && u.skills.length);
    provs=provs.filter(u=> (u.rating||0)>=min);
    if(cat) provs=provs.filter(u=>u.skills.includes(cat));
    if(q) provs=provs.filter(u=>(Helpers.userName(u)+' '+(u.bio||'')+' '+(u.bioFr||'')).toLowerCase().includes(q));
    const listEl=document.getElementById('mlist');
    provs.forEach(p=>{
      const d=Helpers.dist(start,[p.lat,p.lng]);
      const popup=`<div style="text-align:center"><b>${Helpers.esc(Helpers.userName(p))}</b><div class="muted small"><span class="chip ok">${I18n.t('online')}</span> ${Helpers.ratingStars(p.rating||0)} (${p.rates||0})</div><div class="small">${Helpers.wilaya(p.wilaya)} · ${d} ${I18n.t('kmAway')}</div>
      <div class="flex" style="justify-content:center;margin-top:8px"><button class="btn sm" data-pop-prov="${p.id}" onclick="return false">${I18n.t('viewProfile')}</button><button class="btn ghost sm" data-pop-chat="${p.id}" onclick="return false">${ICONS.chats}</button></div></div>`;
      Maps.pin([p.lat,p.lng], popup, '#03AEA8');
    });
    listEl.innerHTML=provs.length? provs.map(p=>{
      const d=Helpers.dist(start,[p.lat,p.lng]);
      return `<div class="card mb" data-act="flyTo" data-lat="${p.lat}" data-lng="${p.lng}">
        <div class="flex"><div class="avatar">${Helpers.initials(Helpers.userName(p))}</div>
        <div class="grow"><b>${Helpers.esc(Helpers.userName(p))}</b>
        <div class="muted small" style="display:flex;gap:8px">${Helpers.ratingStars(p.rating||0)} (${p.rates||0}) <span>·</span> ${p.online?`<span class="chip ok">${I18n.t('online')}</span>`:`<span class="chip gray">${I18n.t('offline')}</span>`}</div>
        <div class="muted small">${Helpers.wilaya(p.wilaya)} · ${d} ${I18n.t('kmAway')}</div></div>
        <button class="btn ghost sm" data-act="chatWith" data-user="${p.id}">${ICONS.chats}</button></div>
        <div class="badge-row mt" style="margin-top:10px">${(p.skills||[]).slice(0,3).map(x=>`<span class="chip teal">${this.catIc(x)} ${Helpers.cat(x)}</span>`).join('')}</div>
        <button class="link-tag mt" data-act="providerView" data-id="${p.id}">${I18n.t('providerOpen')}</button></div>`;
    }).join('') : `<div class="empty">${ICONS.users}<b>${I18n.t('noProviders')}</b></div>`;
    document.querySelectorAll('[data-pop-prov]').forEach(a=>a.addEventListener('click',()=>this.providerModal(a.getAttribute('data-pop-prov'))));
    document.querySelectorAll('[data-pop-chat]').forEach(a=>a.addEventListener('click',()=>this.chatWithById(a.getAttribute('data-pop-chat'))));
    Maps.fit([start].concat(provs.map(p=>[p.lat,p.lng])));
  }
  document.querySelectorAll('[data-act="flyTo"]').forEach(card=>card.addEventListener('click',e=>{
    const a=e.target.closest('[data-act]');
    if(a && (a.getAttribute('data-act')==='applyNow'||a.getAttribute('data-act')==='taskOpen'||a.getAttribute('data-act')==='chatWith'||a.getAttribute('data-act')==='providerView')) return;
    if(a&&a.getAttribute('data-act')==='flyTo'){ if(Maps._map) Maps._map.setView([Number(card.getAttribute('data-lat')),Number(card.getAttribute('data-lng'))], 13); }
  }));
};
AppView.providerModal=function(uid){
  const db=this.db(); const u=db.users.find(x=>x.id===uid); if(!u) return;
  const me=Auth.current();
  const canon=db.tasks.filter(t=>t.assignee===uid && t.status==='paid');
  const o=Modal.open(`<div class="center">
    <div class="avatar lg" style="margin-inline:auto">${Helpers.initials(Helpers.userName(u))}</div>
    <h3 class="mt">${Helpers.esc(Helpers.userName(u))}</h3>
    <div class="flex center" style="justify-content:center">${Helpers.ratingStars(u.rating||0)} <span class="small muted">(${u.rates||0})</span></div>
    <p class="muted small mt">${Helpers.esc(u.bio||'')}</p>
    <div class="badge-row mt center" style="justify-content:center">${(u.skills||[]).slice(0,4).map(x=>`<span class="chip teal">${this.catIc(x)} ${Helpers.cat(x)}</span>`).join('')} ${u.verified?`<span class="chip ok">${ICONS.shield} ${I18n.t('verifiedAcc')}</span>`:''}</div>
    <div class="flex mt" style="justify-content:center;gap:22px">
      <div class="center"><b>${canon.length}</b><div class="muted small">${I18n.t('tasksDoneTask')}</div></div>
      <div class="center"><b>${Helpers.wilaya(u.wilaya)}</b><div class="muted small">${I18n.t('location')}</div></div>
    </div>
    <div class="qr-box mt"><div id="qrp"></div><span class="small muted">${I18n.t('qrProfile')}</span></div>
    <div class="flex mt">
      <button class="btn grow" data-act="chatWith" data-user="${u.id}">${ICONS.chats} ${I18n.t('sendMsg')}</button>
      <a class="btn ghost" href="tel:${u.phone}">${I18n.t('call')}</a>
    </div></div>`);
  QR.make(o.querySelector('#qrp'), 'livesight://user/'+u.id, 130);
};
AppView.providerView=function(t){ this.providerModal(t.getAttribute('data-id')); };

/* ---------- الدردشة ---------- */
AppView.chats=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const list=db.chats.filter(c=>c.participants.includes(s.userId));
  list.sort((a,b)=>{ const lm=a.messages.length?new Date(a.messages[a.messages.length-1].when):0; const lm2=b.messages.length?new Date(b.messages[b.messages.length-1].when):0; return lm2-lm; });
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('chats')}</h2><div class="sub">${list.length} ${I18n.t('chat')}</div></div></div>
  ${list.length? list.map(c=>{
    const other=c.participants.find(p=>p!==s.userId); const o=Helpers.user(other);
    const msgs=c.messages||[]; const last=msgs[msgs.length-1];
    const unread=msgs.filter(m=>m.from!==s.userId && !m.read).length;
    const t=db.tasks.find(x=>x.id===c.taskId);
    return `<div class="chat-row ${unread?'unread':''}" data-go="chat/${c.id}">
      <div class="avatar">${Helpers.initials(Helpers.userName(o))}</div>
      <div class="chat-body"><div class="nm"><b>${Helpers.esc(Helpers.userName(o))}</b><time>${last?Helpers.date(last.when):''}</time></div>
      <div class="msg ${unread?'unrd':''}">${last?Helpers.esc(last.from===s.userId? I18n.t('me')+': ':'') +(last.text):I18n.t('noChatYet')}</div>
      ${t?`<div class="chip teal" style="margin-top:6px">${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</div>`:''}</div>
      ${unread?`<span class="msg-unread">${unread}</span>`:''}
    </div>`; }).join('') : `<div class="empty">${ICONS.chats}<b>${I18n.t('noChats')}</b></div>`}`;
  Layout.crumb(I18n.t('chats'));
  Layout.markNav('chats');
};
AppView.chatDetail=function(params){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const cid=Array.isArray(params)?params[0]:(params&&params.id);
  const c=db.chats.find(x=>x.id===cid);
  if(!c){ el.innerHTML='<div class="empty">'+I18n.t('noResults')+'</div>'; return; }
  const other=c.participants.find(p=>p!==s.userId); const o=Helpers.user(other);
  c.messages.forEach(m=>{ if(m.from!==s.userId) m.read=true; }); Store.save(db);
  const t=db.tasks.find(x=>x.id===c.taskId);
  el.innerHTML=`
  <div class="chat-open">
    <div class="chat-list-pane">
      ${db.chats.filter(x=>x.participants.includes(s.userId)).map(x=>{
        const ob=x.participants.find(p=>p!==s.userId); const ou=Helpers.user(ob); const lm=x.messages[x.messages.length-1];
        const un=x.messages.filter(m=>m.from!==s.userId&&!m.read).length;
        return `<div class="chat-row ${x.id===cid?'':' '}" data-go="chat/${x.id}" style="border:${x.id===cid?'2px solid var(--teal)':'1px solid var(--line)'}">
          <div class="avatar sm">${Helpers.initials(Helpers.userName(ou))}</div><div class="chat-body"><div class="nm"><b class="small">${Helpers.esc(Helpers.userName(ou))}</b></div>
          <div class="msg">${lm?Helpers.trunc(lm.text,26):'—'}</div></div></div>`; }).join('')}
    </div>
    <div class="chat-thread">
      <div class="chat-head">
        <button class="icon-btn" data-go="chats" style="flex:none;width:38px;height:38px" aria-label="back">→</button>
        <div class="avatar">${Helpers.initials(Helpers.userName(o))}</div>
        <div class="grow"><b>${Helpers.esc(Helpers.userName(o))}</b><div class="muted small">${o.online?`<span class="pulse-dot"></span> ${I18n.t('online')}`:`${I18n.t('offline')} · ${o.lastSeen?Helpers.date(o.lastSeen):''}`}</div></div>
        ${t?`<a class="chip teal" href="#" onclick="event.preventDefault();Router.go('task/${t.id}')">${I18n.t('taskTitle')}</a>`:''}
      </div>
      <div class="chat-msgs" id="cmsgs">${c.messages.map(m=>`
        <div class="bubble ${m.from===s.userId?'me':'them'}">${Helpers.esc(m.text)}<time>${Helpers.date(m.when)}</time></div>`).join('')}</div>
      <div class="chat-input">
        <input id="cinput" placeholder="${I18n.t('typeMsg')}">
        <button class="btn" data-act="sendChat" data-id="${c.id}">${ICONS.send||I18n.t('send')}</button>
      </div>
    </div>
  </div>`;
  Layout.crumb(I18n.t('chatWith')+' '+Helpers.userName(o));
  Layout.markNav('chats');
  const box=document.getElementById('cmsgs'); if(box) box.scrollTop=box.scrollHeight;
  const inp=document.getElementById('cinput');
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter') this.sendChatById(c.id, inp.value); });
};
AppView.sendChat=function(t){
  const inp=document.getElementById('cinput'); if(!inp) return;
  this.sendChatById(t.getAttribute('data-id'), inp.value); inp.value='';
};
AppView.sendChatById=function(cid,text){
  text=(text||'').trim(); if(!text) return;
  const db=this.db(); const c=db.chats.find(x=>x.id===cid); if(!c) return;
  c.messages.push({from:Auth.current().userId,text,when:new Date().toISOString(),read:false});
  const other=c.participants.find(p=>p!==Auth.current().userId);
  addNotif(db, other, 'notifMsg', c.taskId||null);
  Store.save(db); this.chatDetail(['id',cid]);
};
AppView.chatWithById=function(uid){
  const db=this.db(); const s=Auth.current();
  const c=ensureChat(s.userId, uid, null);
  Router.go('chat/'+c.id);
};
AppView.chatWith=function(t){
  const db=this.db(); const s=Auth.current();
  const taskId=t.getAttribute('data-task');
  const uid=t.getAttribute('data-user');
  const c=ensureChat(s.userId, uid, taskId);
  Router.go('chat/'+c.id);
};
AppView.chatOpen=function(t){
  const db=this.db(); const s=Auth.current();
  const uid=t.getAttribute('data-user'); const taskId=t.getAttribute('data-task')||null;
  const c=ensureChat(s.userId, uid, taskId);
  Router.go('chat/'+c.id);
};

/* ---------- المحفظة ---------- */
AppView.wallet=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current(); const me=db.users.find(u=>u.id===s.userId);
  const f=this._wf||'txAll';
  const locked=HelpT.escrowLockedFor(db, s.userId);
  const txs=db.wallet.filter(w=>w.user===s.userId).sort((a,b)=>new Date(b.date)-new Date(a.date));
  let list=txs;
  if(f==='txIn') list=txs.filter(x=>x.amount>0);
  else if(f==='txOut') list=txs.filter(x=>x.amount<0 && x.type!=='txEscrow');
  else if(f==='txHold') list=txs.filter(x=>x.type==='txEscrow');
  const earned=txs.filter(x=>['txRelease','txEarning'].includes(x.type)).reduce((a,x)=>a+x.amount,0);
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('walletTitle')}</h2><div class="sub">${I18n.t('walletOf')} — ${Helpers.esc(Helpers.userName(me))}</div></div>
  <div class="acts"><button class="btn ghost" data-act="qrWallet">${ICONS.qr}</button><button class="btn line" data-act="withdrawOpen">${I18n.t('withdraw')}</button><button class="btn" data-act="topUpOpen">${ICONS.plus} ${I18n.t('topUp')}</button></div></div>

  <div class="wallet-bal mb">
    <div class="wl-lbl">${I18n.t('balance')}</div>
    <div class="wl-num">${Helpers.money(me.balance)}</div>
    <div class="wl-sub">
      <div><span class="small" style="opacity:.85">${I18n.t('escrow')}</span><b>${locked>0?'− '+Helpers.money(locked):Helpers.money(0)}</b></div>
      <div><span class="small" style="opacity:.85">${I18n.t('totalEarned')}</span><b>${Helpers.money(earned)}</b></div>
    </div>
  </div>

  <div class="filter-bar">
    <div class="chip teal" style="cursor:pointer" data-f="txAll">${I18n.t('txAll')}</div>
    <div class="chip" style="cursor:pointer" data-f="txIn">${I18n.t('txIn')}</div>
    <div class="chip" style="cursor:pointer" data-f="txOut">${I18n.t('txOut')}</div>
    <div class="chip" style="cursor:pointer" data-f="txHold">${I18n.t('txHold')}</div>
    <div class="grow"></div>
    <span class="muted small">${ICONS.logBook} ${txs.length}</span>
  </div>
  ${list.length? list.map(x=>{
    const isIn=x.amount>0; const hold=x.type==='txEscrow';
    const t=db.tasks.find(tt=>tt.id===x.taskId);
    const icon=hold?ICONS.shield:isIn?ICONS.walletIc:ICONS.walletIc;
    return `<div class="tx-row" data-act="txDetail" data-tx="${x.id}">
      <div class="tx-ic" style="background:${hold?'rgba(245,166,35,.15)':isIn?'rgba(15,191,127,.12)':'rgba(229,72,77,.1)'};color:${hold?'#C77E08':isIn?'#0B9E6C':'#D63B40'}">${icon}</div>
      <div class="tx-b"><b>${I18n.t(x.type)}</b><span>${x.ref} · ${Helpers.date(x.date)}${t?` · ${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}`:''}</span></div>
      <div class="amount ${hold?'hold':isIn?'in':'out'}">${x.amount>0?'+':''}${Helpers.money(Math.abs(x.amount))}</div>
    </div>`; }).join('') : `<div class="empty">${ICONS.walletIc}<b>${I18n.t('emptyList')}</b></div>`}`;
  Layout.crumb(I18n.t('wallet'));
  Layout.markNav('wallet');
  el.querySelectorAll('[data-f]').forEach(c=>c.addEventListener('click',()=>{ this._wf=c.getAttribute('data-f'); this.wallet(); }));
};
AppView.topUpOpen=function(){
  Modal.prompt(I18n.t('topUp'), I18n.t('topUpNote'),
    `<div class="field mt"><label>${I18n.t('topUpAmount')}</label><input data-val="amt" type="number" value="2000" min="100"></div>`, I18n.t('topUp')).then(v=>{
      if(v&&Number(v.amt)>0){ const db=this.db(); const me=db.users.find(u=>u.id===Auth.current().userId); const amt=Number(v.amt); me.balance+=amt;
        db.wallet.unshift({id:Store.uid(),user:me.id,type:'txDeposit',amount:amt,date:new Date().toISOString(),ref:'TOP-'+Date.now().toString().slice(-5),status:'done'});
        Audit.log(db,me.id,'WALLET','شحن محفظة','Rechargement'); Store.save(db); Toast.show(I18n.t('topUpDone'),'ok'); this.wallet(); }
    });
};
AppView.withdrawOpen=function(){
  const db=this.db(); const me=db.users.find(u=>u.id===Auth.current().userId);
  Modal.prompt(I18n.t('withdraw'), I18n.t('withdrawNote')+' · '+I18n.t('withdrawMin'),
    `<div class="field mt"><label>${I18n.t('withdrawAmt')}</label><input data-val="amt" type="number" value="${Math.min(me.balance,1000)}" max="${me.balance}"></div>`, I18n.t('withdraw')).then(v=>{
      const amt=Number(v&&v.amt);
      if(!amt || amt<500){ Toast.show(I18n.t('withdrawMin'),'warn'); return; }
      if(amt>me.balance){ Toast.show(I18n.t('noFunds'),'err'); return; }
      me.balance-=amt;
      db.wallet.unshift({id:Store.uid(),user:me.id,type:'txWithdraw',amount:-amt,date:new Date().toISOString(),ref:'WDR-'+Date.now().toString().slice(-5),status:'done'});
      Audit.log(db,me.id,'WALLET_WITHDRAW','سحب محفظة','Retrait portefeuille'); Store.save(db);
      Toast.show(I18n.t('withdrawDone'),'ok'); this.wallet();
    });
};
AppView.txDetail=function(t){
  const db=this.db(); const x=db.wallet.find(w=>w.id===t.getAttribute('data-tx'));
  const task=x.taskId?db.tasks.find(tt=>tt.id===x.taskId):null;
  Modal.open(`<h3>${I18n.t(x.type)}</h3><p class="msub">${x.ref}</p>
    <div class="grid c2">${[['txDate',Helpers.date(x.date)],['amount',Helpers.money(x.amount)],['ref','REF'],['txId',x.id.slice(0,8).toUpperCase()]].map(([k,v])=>`
      <div><div class="muted small">${I18n.t(k)}${k==='ref'?'':' '}</div><b>${Helpers.esc(String(v))}</b></div>`).join('')}</div>
    ${task?`<div class="card mt" style="background:var(--bg-soft)"><b class="small">${Helpers.esc(langState.lang==='ar'?task.title:task.titleFr||task.title)}</b></div>`:''}`);
};
AppView.qrWallet=function(){
  const db=this.db(); const me=db.users.find(u=>u.id===Auth.current().userId);
  const o=Modal.open(`<h3>${I18n.t('walletOf')}</h3><p class="msub">${I18n.t('shareQr')}</p><div class="qr-box"><div id="qrw"></div><b class="small">${I18n.t('wallet')} — ${Helpers.money(me.balance)}</b></div>`);
  QR.make(o.querySelector('#qrw'), 'livesight://wallet/'+me.id, 160);
};

/* ---------- التشخيصvalue الملف ---------- */
AppView.profile=function(params){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current(); const me=db.users.find(u=>u.id===s.userId);
  const ptab=Array.isArray(params)?params[0]:(params&&params.tab);
  const tab=(ptab==='settings')?'settings':'profile';
  const prefs=Store.read('ls_prefs',{autoLock:false,mins:5,radius:15});
  const lvlKey=Helpers.levelKey(me); const lvlTxt=I18n.t('lvl'+lvlKey.charAt(0).toUpperCase()+lvlKey.slice(1));
  const lvlPct=Math.min(100, Math.round(me.points/500*100));
  const myDone=db.tasks.filter(t=>t.assignee===me.id && t.status==='paid').length;
  const unread=db.notifs.filter(n=>n.user===me.id && !n.read).length;
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t(me.role==='admin'?'adminSettings':'profileTitle')}</h2></div>
  <div class="acts"><button class="btn ghost" data-act="qrProfileBtn">${ICONS.qr} QR</button><button class="btn" data-act="editProfile">${ICONS.pen} ${I18n.t('editProfile')}</button></div></div>

  ${tab==='profile'?`
  <div class="profile-head mb">
    <div class="avatar lg">${Helpers.initials(Helpers.userName(me))}</div>
    <div>
      <div class="flex wrap" style="align-items:center"><h3>${Helpers.esc(Helpers.userName(me))}</h3>
        ${me.verified?`<span class="chip ok">${ICONS.shield} ${I18n.t('verifiedAcc')}</span>`:`<span class="chip gray">${I18n.t('notVerified')}</span>`}
        ${me.online?`<span class="chip teal"><span class="pulse-dot"></span> ${I18n.t('online')}</span>`:`<span class="chip gray">${I18n.t('offline')}</span>`}</div>
      <div class="muted mt" style="display:flex;gap:8px;align-items:center">${Helpers.ratingStars(me.rating||0)}<span>(${me.rates||0})</span></div>
      <div class="lvl-bar"><i style="width:${lvlPct}%"></i></div>
      <div class="flex between small muted" style="margin-top:4px"><b>${lvlTxt} · ${Helpers.fmtNum(me.points)} ${I18n.t('points')}</b></div>
    </div>
  </div>
  <div class="grid" style="grid-template-columns:1.4fr 1fr">
    <div class="card">
      <div class="sec-title" style="margin-top:0"><span class="mono">${ICONS.profile}</span> ${I18n.t('personalInfo')}</div>
      <div class="grid c2">${[['fullName',Helpers.userName(me)],['phone',me.phone],['email',me.email],['location',Helpers.wilaya(me.wilaya)+' · '+Helpers.esc(me.town||'')],['memberSince',Helpers.date(me.memberSince)],['level',lvlTxt+' · '+Helpers.fmtNum(me.points)+' '+I18n.t('points')]].map(([k,v])=>`
        <div><div class="muted small">${I18n.t(k)}</div><b>${Helpers.esc(String(v))}</b></div>`).join('')}</div>
      <div class="divider"></div>
      <b class="small">${I18n.t('bio')}</b>
      <p class="muted small mt">${Helpers.esc(me.bio || (langState.lang==='fr'?me.bioFr:'')||'')}</p>
      ${(me.skills&&me.skills.length)?`<div class="badge-row mt">${me.skills.map(x=>`<span class="chip teal">${this.catIc(x)} ${Helpers.cat(x)}</span>`).join('')}</div>`:''}
      ${me.badges&&me.badges.length?`<div class="badge-row mt">${me.badges.map(b=>`<span class="badge-item ${b==='star'?'star':b==='ring'?'ring':'diamond'}">${Helpers.badgeIcon(b)} ${I18n.t('badges')}</span>`).join('')}</div>`:''}
    </div>
    <div>
      <div class="card mb">
        <div class="muted small">${I18n.t('tasksDoneTask')}</div>
        <div style="font-size:30px;font-weight:800">${myDone}</div>
      </div>
      <div class="card mb">
        <div class="muted small">${I18n.t('ratingAfter')}</div>
        <div class="flex mt">${Helpers.ratingStars(me.rating||0)}</div>
      </div>
      <div class="card">
        <div class="muted small mb">${I18n.t('secure')}</div>
        <div class="setting-row"><div><div class="sr-t">${I18n.t('verifiedAcc')}</div><div class="sr-s">${me.verified?'✓':'—'}</div></div></div>
      </div>
      <button class="btn line full mt" data-act="goSettings">${ICONS.gear} ${I18n.t('settings')}</button>
    </div>
  </div>
  <div class="card mt">
    <div class="sec-title" style="margin-top:0"><span class="mono">${ICONS.sparkle}</span> ${I18n.t('quickActions')}</div>
    <button type="button" class="setting-row crow" data-go="wallet">
      <span class="row-ic" style="color:var(--teal-d)">${ICONS.wallet}</span>
      <span class="grow"><span class="sr-t">${I18n.t('wallet')}</span><span class="sr-s">${I18n.t('balance')} — ${Helpers.money(me.balance)}</span></span>
      ${ICONS.chev}
    </button>
    <button type="button" class="setting-row crow" data-go="notifications">
      <span class="row-ic" style="color:var(--blue)">${ICONS.bell}</span>
      <span class="grow"><span class="sr-t">${I18n.t('notifications')}</span><span class="sr-s">${unread} ${I18n.t('unread')}</span></span>
      ${ICONS.chev}
    </button>
    <button type="button" class="setting-row crow" data-go="watchlist">
      <span class="row-ic" style="color:var(--warn)">${ICONS.watch}</span>
      <span class="grow"><span class="sr-t">${I18n.t('watchlist')}</span><span class="sr-s">${I18n.t('geoDesc')}</span></span>
      ${ICONS.chev}
    </button>
    <button type="button" class="setting-row crow" style="border-bottom:none;color:var(--danger)" data-act="doLogout">
      <span class="row-ic">${ICONS.logout}</span>
      <span class="grow"><span class="sr-t">${I18n.t('logout')}</span><span class="sr-s">${I18n.t('logoutSure')}</span></span>
      ${ICONS.chev}
    </button>
  </div>`:''}
  ${tab==='settings'?`
  <div class="card mb">
    <div class="sec-title" style="margin-top:0"><span class="mono">${ICONS.gear}</span> ${I18n.t('settings')}</div>
    <div class="setting-row">
      <div><div class="sr-t">${I18n.t('language')}</div><div class="sr-s">${I18n.t('langDesc')}</div></div>
      <div class="lang-toggle">${['ar','fr'].map(l=>`<button class="${langState.lang===l?'active':''}" data-lang-btn="${l}">${l==='ar'?'ع':'FR'}</button>`).join('')}</div>
    </div>
    <div class="setting-row">
      <div><div class="sr-t">${I18n.t('location')}</div><div class="sr-s">${Helpers.wilaya(me.wilaya)} · ${Helpers.esc(me.town||'')}</div></div>
      <button class="btn ghost sm" data-act="editLoc">${I18n.t('edit')}</button>
    </div>
    <div class="setting-row">
      <div><div class="sr-t">${I18n.t('radius')}</div><div class="sr-s">${I18n.t('geoDesc')}</div></div>
      <div class="field" style="width:110px"><input id="radinp" type="number" value="${prefs.radius}" min="1"></div>
    </div>
    <div class="setting-row">
      <div><div class="sr-t">${I18n.t('twoFA')}</div><div class="sr-s">${I18n.t('twoFaDesc')}</div></div>
      <div class="toggle ${me.twoFA?'on':''}" data-tog="tfa"></div>
    </div>
    <div class="setting-row">
      <div><div class="sr-t">${I18n.t('autoLock')}</div><div class="sr-s">${I18n.t('autoLockDesc')}</div></div>
      <div class="toggle ${prefs.autoLock?'on':''}" data-tog="lock"></div>
    </div>
    <div class="setting-row" id="lockrow" style="${prefs.autoLock?'':'display:none'}">
      <div><div class="sr-t">${I18n.t('autoLockMins')}</div></div>
      <div class="field" style="width:110px"><input id="lockmins" type="number" value="${prefs.mins}" min="1"></div>
    </div>
    <div class="setting-row">
      <div><div class="sr-t">${I18n.t('changePin')}</div><div class="sr-s">${I18n.t('changePinDesc')}</div></div>
      <button class="btn ghost sm" data-act="setPin">${I18n.t('edit')}</button>
    </div>
  </div>
  <div class="flex" style="gap:10px"><button class="btn full" data-act="savePrefs">${I18n.t('saveChanges')}</button>
  <button class="btn line full" data-act="goProfile">${I18n.t('back')}</button></div>`:''}`;
  Layout.crumb(I18n.t('profile'));
  Layout.markNav('profile');

  if(tab==='settings'){
    const ri=el.querySelector('#radinp'); if(ri) ri.addEventListener('change',()=>{ const p=Store.read('ls_prefs',{}); p.radius=Number(ri.value)||15; Store.write('ls_prefs',p); });
    el.querySelectorAll('[data-tog]').forEach(x=>x.addEventListener('click',()=>{
      if(x.getAttribute('data-tog')==='lock'){ const p=Store.read('ls_prefs',{}); p.autoLock=!p.autoLock; Store.write('ls_prefs',p); this.profile(); }
      else { const db=this.db(); const u=db.users.find(y=>y.id===Auth.current().userId);
        if(!u.twoFA){ u.twoFA=true; const seen=JSON.parse(localStorage.getItem(Auth._seenKey)||'{}'); seen[u.id]=false; localStorage.setItem(Auth._seenKey, JSON.stringify(seen)); }
        u.twoFA=!u.twoFA; const seen=JSON.parse(localStorage.getItem(Auth._seenKey)||'{}'); if(u.twoFA) delete seen[u.id]; localStorage.setItem(Auth._seenKey, JSON.stringify(seen)); Store.save(db); this.profile(); }
    }));
    const lm=el.querySelector('#lockmins'); if(lm) lm.addEventListener('change',()=>{ const p=Store.read('ls_prefs',{}); p.mins=Number(lm.value)||5; Store.write('ls_prefs',p); });
    I18n.mount();
  }
};
AppView.goSettings=function(){ Router.go('profile/settings'); };
AppView.goProfile=function(){ Router.go('profile'); };
AppView.doLogout=function(){ Modal.confirm(I18n.t('logout'), I18n.t('logoutSure'), I18n.t('logout'), 'danger').then(ok=>{ if(ok) Auth.logout(); }); };
AppView.editProfile=function(){
  const db=this.db(); const me=db.users.find(u=>u.id===Auth.current().userId);
  Modal.prompt(I18n.t('editProfile'),I18n.t('personalInfo'),`
    <div class="field mt"><label>${I18n.t('fullName')}</label><input data-val="name" value="${Helpers.esc(me.name)}"></div>
    <div class="field mt"><label>${I18n.t('phone')}</label><input data-val="phone" value="${Helpers.esc(me.phone)}"></div>
    <div class="field mt"><label>${I18n.t('bio')}</label><textarea data-val="bio" rows="3">${Helpers.esc(me.bio||'')}</textarea></div>`, I18n.t('save')).then(v=>{
      if(v){ me.name=v.name||me.name; me.nameFr=v.name||me.nameFr; me.phone=v.phone||me.phone; me.bio=v.bio; Store.save(db); Toast.show(I18n.t('savedProfile'),'ok'); this.profile(); }
  });
};
AppView.editLoc=function(){
  const db=this.db(); const me=db.users.find(u=>u.id===Auth.current().userId);
  Modal.prompt(I18n.t('location'),'',`<div class="field mt"><label>${I18n.t('wilaya')}</label><select data-val="wil">${db.wilayas.map(w=>`<option value="${w[0]}" ${me.wilaya==w[0]?'selected':''}>${w[1]}</option>`).join('')}</select></div>
    <div class="field mt"><label>${I18n.t('townF')}</label><input data-val="town" value="${Helpers.esc(me.town||'')}"></div>`, I18n.t('save')).then(v=>{
      if(v){ me.wilaya=Number(v.wil)||me.wilaya; const w=Helpers.wilayaObj(me.wilaya); me.lat=w[3]; me.lng=w[4]; me.town=v.town||me.town; Store.save(db); this.profile(); }
  });
};
AppView.setPin=function(){
  Modal.prompt(I18n.t('changePin'),I18n.t('pinPrompt'),`<div class="field mt"><input data-val="pin" type="password" inputmode="numeric" maxlength="4" placeholder="••••"></div>`, I18n.t('save')).then(v=>{
    if(v&&/^\d{4}$/.test(String(v.pin))){ const p=Store.read('ls_prefs',{}); p.pin=String(v.pin); Store.write('ls_prefs',p); Toast.show(I18n.t('pinDone'),'ok'); }
    else if(v) Toast.show(I18n.t('wrongPin'),'err');
  });
};
AppView.savePrefs=function(){
  const p=Store.read('ls_prefs',{});
  const ri=document.getElementById('radinp'); const lm=document.getElementById('lockmins');
  if(ri) p.radius=Number(ri.value)||15;
  if(lm) p.mins=Number(lm.value)||5;
  p.autoLock=document.querySelector('[data-tog="lock"]').classList.contains('on');
  Store.write('ls_prefs',p); Toast.show(I18n.t('savedProfile'),'ok');
};
AppView.qrProfileBtn=function(){
  const me=Store.db().users.find(u=>u.id===Auth.current().userId);
  const o=Modal.open(`<h3>${I18n.t('qrProfile')}</h3><p class="msub">${Helpers.esc(Helpers.userName(me))}</p><div class="qr-box"><div id="qrp2"></div><span class="small muted">${I18n.t('shareQr')}</span></div>`);
  QR.make(o.querySelector('#qrp2'), 'livesight://user/'+me.id, 160);
};

/* ---------- الإشعارات ---------- */
AppView.notifications=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const list=db.notifs.filter(n=>n.user===s.userId).sort((a,b)=>new Date(b.date)-new Date(a.date));
  db.notifs.forEach(n=>{ if(n.user===s.userId) n.read=true; }); Store.save(db); Layout.refreshBadges();
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('notificationsTitle')}</h2><div class="sub">${list.length}</div></div>
  <div class="acts"><button class="btn ghost" data-act="markAllRead">${I18n.t('markAll')}</button></div></div>
  ${list.length? list.map(n=>`
    <div class="notif-row" data-go-notif="${n.id}">
      <div class="mono">${ICONS.bell}</div>
      <div class="task-meta"><b class="small">${Helpers.esc(HelpT.notifText(n))}</b><div class="muted small" style="margin-top:2px">${Helpers.date(n.date)}</div></div>
    </div>`).join('') : `<div class="empty">${ICONS.bell}<b>${I18n.t('noNotifs')}</b></div>`}`;
  Layout.crumb(I18n.t('notifications'));
  this.goNotifsRoute=function(){};
};
AppView.markAllRead=function(){ const db=this.db(); db.notifs.forEach(n=>{ if(n.user===Auth.current().userId) n.read=true; }); Store.save(db); this.notifications(); };

/* ---------- المساعدة ---------- */
AppView.helpView=function(){
  const el=document.getElementById('view');
  const qs=[['help1q','help1a'],['help2q','help2a'],['help3q','help3a'],['help4q','help4a'],['help5q','help5a'],['help6q','help6a']];
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('helpTitle')}</h2><div class="sub">${I18n.t('howItWorks')}</div></div></div>
  <div class="card mb"><div class="flex"><span class="mono lg" style="width:46px;height:46px;border-radius:14px;font-size:20px">${ICONS.shield}</span>
  <div><b>${I18n.t('tips')}</b><p class="muted small mt">${I18n.t('tipText')}</p></div></div></div>
  <div class="sec-title"><span class="mono">${ICONS.help}</span> ${I18n.t('faq')}</div>
  ${qs.map(([q,a])=>`<details class="help-item"><summary>${I18n.t(q)}<span class="chev">${ICONS.chev}</span></summary><div class="hd">${I18n.t(a)}</div></details>`).join('')}
  <div class="sec-title"><span class="mono">${ICONS.chats}</span> ${I18n.t('contactUs')}</div>
  <div class="flex"><div class="mono" style="background:rgba(0,118,241,.12);color:var(--blue)">${ICONS.mail}</div><div><b>${I18n.t('contactMail')}</b><div class="muted small">${I18n.t('contactUs')}</div></div></div>`;
  Layout.crumb(I18n.t('help'));
  Layout.markNav('help');
};

AppView.watchlist=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=Auth.current();
  const wl=db.watchlist.filter(w=>w.user===s.userId);
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('myWatch')}</h2><div class="sub">${I18n.t('geoDesc')}</div></div><div class="acts"><button class="btn" data-act="saveWatch">${ICONS.watch} ${I18n.t('watchAdd')}</button></div></div>
  ${wl.length? wl.map(w=>{
    const matches=db.tasks.filter(t=> t.status===STATUS.open && t.public && (!w.filters.cat||t.cat===w.filters.cat) && (!w.filters.wil||t.wilaya==w.filters.wil) && (!w.filters.max||t.budget<=w.filters.max));
    return `<div class="card mb">
      <div class="flex between">
        <div><b>${Helpers.esc(langState.lang==='ar'?w.name:w.nameFr)}</b>
          <div class="muted small">${w.filters.cat?Helpers.cat(w.filters.cat):I18n.t('allCat')} · ${w.filters.wil?Helpers.wilaya(w.filters.wil):I18n.t('allWil')} · ≤${Helpers.money(w.filters.max||999999)}</div></div>
        <div class="flex"><span class="chip teal">${matches.length}</span><button class="btn line sm" data-act="delWatch" data-id="${w.id}">${I18n.t('watchRemove')}</button></div>
      </div>
      ${matches.length?`<div class="divider"></div>${matches.slice(0,2).map(t=>this.taskCard(t)).join('')}`:''}
    </div>`; }).join('') : `<div class="empty">${ICONS.watch}<b>${I18n.t('emptyList')}</b><button class="btn ghost sm mt" data-act="saveWatch">${I18n.t('watchAdd')}</button></div>`}`;
  Layout.crumb(I18n.t('watchlist'));
  Layout.markNav('watchlist');
};
AppView.delWatch=function(t){
  const db=this.db(); db.watchlist=db.watchlist.filter(w=>w.id!==t.getAttribute('data-id')); Store.save(db); this.watchlist();
};
AppView.saveWatch=function(){
  const db=this.db(); const s=Auth.current();
  const f=this._af||{};
  Modal.prompt(I18n.t('watchAdd'), I18n.t('geoDesc'),
    `<div class="field mt"><label>${I18n.t('watchName')}</label><input data-val="name" value="${Helpers.esc(f.q||I18n.t('search'))}">
    <div class="field mt"><label>${I18n.t('maxBudget')}</label><input data-val="max" type="number" value="5000"></div>
    <div class="field mt"><label>${I18n.t('geo')}</label><input data-val="rad" type="number" value="${(Store.read('ls_prefs',{radius:15})).radius}" min="1"></div>`, I18n.t('save')).then(v=>{
      if(v){ db.watchlist.unshift({id:Store.uid(),user:s.userId,name:v.name||I18n.t('search'),nameFr:v.name||I18n.t('search'),filters:{cat:this._af?.cat||'',wil:this._af?.wil||null,max:v.max?Number(v.max):null}});
      const p=Store.read('ls_prefs',{}); if(v.rad)p.radius=Number(v.rad); Store.write('ls_prefs',p);
      Store.save(db); Toast.show(I18n.t('watchSaved'),'ok'); this.watchlist(); }
  });
};
AppView.openGeo=function(){
  const p=Store.read('ls_prefs',{radius:15});
  Modal.prompt(I18n.t('geo'), I18n.t('geoDesc'), `<div class="field mt"><label>${I18n.t('radius')}</label><input data-val="rad" type="number" value="${p.radius}" min="1"></div>`, I18n.t('save')).then(v=>{
    if(v){ const p2=Store.read('ls_prefs',{}); p2.radius=Number(v.rad)||15; Store.write('ls_prefs',p2); this.available(); }
  });
};

/* ---------- تنقلات عامة ---------- */
AppView.goNew=function(){ Router.go('tasks/new'); }; AppView.goTasks=function(){ Router.go('tasks'); };
AppView.goAvailable=function(){ Router.go('tasks/available'); };
AppView.goMap=function(){ Router.go('map'); }; AppView.goWallet=function(){ Router.go('wallet'); };
AppView.goNotifs=function(){ Router.go('notifications'); };
AppView.taskOpen=function(t){ Router.go('task/'+t.getAttribute('data-id')); };

AppView.onLang=function(){ if(document.getElementById('view')) this.refresh(); };
AppView.refreshLang=function(){ };
AppView.refresh=function(){ const m=Router.route(Router.current()); if(m) m.fn(m.params); else Router.go('dashboard'); };

/* ---------- إسناد الأحداث (delegation) ---------- */
document.addEventListener('click', function(e){
  const a=e.target.closest('[data-go]');
  if(a){ e.preventDefault(); Router.go(a.getAttribute('data-go')); return; }
  const n=e.target.closest('[data-go-notif]');
  if(n){
    const db=Store.db(); const nid=n.getAttribute('data-go-notif');
    const not=db.notifs.find(x=>x.id===nid); if(not){ not.read=true; Store.save(db); Layout.refreshBadges();
      if(not.taskId) Router.go('task/'+not.taskId); else if(not.chatId) Router.go('chat/'+not.chatId); }
    return;
  }
  const b=e.target.closest('[data-act]');
  if(!b) return;
  const act=b.getAttribute('data-act');
  if(typeof AppView[act]==='function'){ e.preventDefault(); AppView[act](b, e); }
});

/* دوال مساعدة للموديول */
function addNotif(db, user, kind, taskId, chatId){
  db.notifs.unshift({id:Store.uid(), user, kind, taskId:taskId||null, chatId:chatId||null, read:false, date:new Date().toISOString()});
}
function ensureChat(u1, u2, taskId){
  const db=Store.db();
  let c=db.chats.find(x=>x.participants.includes(u1)&&x.participants.includes(u2) && (x.taskId===taskId || taskId===null));
  if(!c){ c={id:Store.uid(), participants:[u1,u2], taskId, messages:[]}; db.chats.push(c); Store.save(db); }
  return c;
}
function checkGeoAlerts(db, task){
  const prefs=Store.read('ls_prefs',{radius:15});
  db.users.forEach(u=>{
    if(u.role!=='user' || u.id===task.client) return;
    const d=Helpers.dist([u.lat,u.lng],[task.lat,task.lng]);
    const radius = prefs.radius||15;
    if(d<=radius){ addNotif(db, u.id,'notifGeo', task.id); }
  });
}
AppView._delegateBound=true;

Router.on('dashboard', ()=>AppView.dashboard());
Router.on('tasks', ()=>AppView.tasks());
Router.on('tasks/new', ()=>AppView.taskCreate());
Router.on('tasks/available', ()=>AppView.available());
Router.on('requests', ()=>AppView.requests());
Router.on('map', ()=>AppView.mapView());
Router.on('watchlist', ()=>AppView.watchlist());
Router.on('chats', ()=>AppView.chats());
Router.on('chat/:id', (p)=>AppView.chatDetail(p));
Router.on('wallet', ()=>AppView.wallet());
Router.on('profile', ()=>AppView.profile());
Router.on('profile/:tab', (p)=>AppView.profile(p));
Router.on('notifications', ()=>AppView.notifications());
Router.on('help', ()=>AppView.helpView());
Router.on('task/:id', (p)=>AppView.taskDetail(p));
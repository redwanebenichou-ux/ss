/* LiveSight — لوحة الإداري */
const AdminView = { _ucat:'', _q:'' };

AdminView.db=()=>Store.db();

AdminView.icon=function(k,d){ return {users:'user',tasks:'task',tx:'transactions',cat:'categories',wil:'wilayas'}[k]||'module'; };

/* =================== نظرة عامة =================== */
AdminView.overview=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const users=db.users.filter(u=>u.role==='user');
  const online=users.filter(u=>u.online).length;
  const tasks=db.tasks; const open=tasks.filter(t=>t.status==='open').length;
  const active=tasks.filter(t=>['in_progress','awaiting_proof'].includes(t.status)).length;
  const paid=tasks.filter(t=>t.status==='paid').length;
  const turnover=db.wallet.filter(w=>['txRelease','txEarning'].includes(w.type)).reduce((a,x)=>a+x.amount,0);
  const disputes=db.disputes.filter(d=>d.status==='open').length;
  const verified=users.filter(u=>u.verified).length;
  const unreadAudits=1;
  const byStatus={};
  Object.values(STATUS).forEach(s=>byStatus[s]=tasks.filter(t=>t.status===s).length);
  const byWilGroup=Helpers.groupBy(users, u=>u.wilaya);
  const wilTop=Object.entries(byWilGroup).sort((a,b)=>b[1].length-a[1].length).slice(0,6);
  const recentAudit=db.audit.slice(0,5);
  const week = Array.from({length:7},(_,i)=>db.wallet.filter(w=>{ const wd=new Date(w.date); const dd=new Date(); dd.setDate(dd.getDate()-(6-i)); return wd.toDateString()===dd.toDateString(); }).reduce((a,w)=>a+Math.abs(w.amount),0));

  el.innerHTML=`
  <div class="page-head">
    <div><h2>${I18n.t('adminWelcome')} 👋</h2><div class="sub flex"><span class="chip ok"><span class="pulse-dot"></span> ${I18n.t('live')}</span> ${I18n.t('radarLive')}</div></div>
    <div class="acts"><button class="btn ghost" data-act="refreshAll">↻</button></div>
  </div>

  <div class="stat-grid mb">
    ${[['users',users.length,I18n.t('users'),'rgba(0,118,241,.12)','#0076F1',ICONS.users],['totalTasks',tasks.length,I18n.t('totalTasks'),'rgba(3,174,168,.12)','#03AEA8',ICONS.tasks],['turnover',Helpers.money(turnover),I18n.t('turnover'),'rgba(15,191,127,.12)','#0B9E6C',ICONS.coins],['disputes',disputes,I18n.t('disputes'),'rgba(229,72,77,.12)','#D63B40',ICONS.flag],['online',online+' / '+users.length,I18n.t('onlineCount'),'rgba(245,166,35,.15)','#C77E08',ICONS.available]].map(([k,v,l,c,cl,ic])=>`
      <div class="kpi"><div class="kk" style="background:${c};color:${cl}">${ic}</div><div class="kl">${l}</div><div class="kn">${v}</div></div>`).join('')}
  </div>

  <div class="grid c2 mb">
    <div class="chart-box"><h4>${ICONS.tasks} ${I18n.t('tasks')} — ${I18n.t('state')}</h4><canvas id="cStatus" height="150"></canvas></div>
    <div class="chart-box"><h4>${ICONS.trend} ${I18n.t('turnover')} — ${I18n.t('week')||'7j'}</h4><canvas id="cWeek" height="150"></canvas></div>
  </div>

  <div class="grid c2">
    <div class="chart-box"><h4>${ICONS.users} ${I18n.t('wilayaStats')}</h4><canvas id="cWil" height="160"></canvas></div>
    <div>
      <div class="chart-box mb"><h4>${ICONS.flag} ${I18n.t('topWilayas')}</h4>
        <div class="flex col" style="gap:8px">${wilTop.map(([w,n])=>`
          <div class="flex between"><span>${Helpers.wilaya(Number(w))}</span><div class="lvl-bar grow" style="margin:0"><i style="width:${Math.min(100,n/users.length*100*1.2)}%"></i></div><b class="small">${n}</b></div>`).join('')||'—'}</div></div>
      <div class="chart-box"><h4>${ICONS.logBook} ${I18n.t('audit')}</h4>
        ${recentAudit.map(a=>`<div class="flex between small" style="padding:5px 0;border-bottom:1px dashed var(--line)"><span><b>${a.actor}</b> · ${Helpers.esc(langState.lang==='ar'?a.detail:a.detailFr||a.detail)}</span><span class="muted">${Helpers.date(a.when)}</span></div>`).join('')}
        <button class="btn line sm mt" data-act="goAudit">${I18n.t('viewAll')}</button></div>
    </div>
  </div>`;
  Layout.crumb(I18n.t('overview'));
  Layout.markNav('overview');
  setTimeout(()=>this.drawCharts(db, byStatus, wilTop, week), 0);
};
AdminView.drawCharts=function(db, byStatus, wilTop, week){
  if(!window.Chart){ return; }
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  const grid=dark?'#1F2C50':'#EAF2F5';
  const uni=dark?'#93A3CC':'#6C8A96';
  Chart.defaults.color=uni; Chart.defaults.borderColor=grid;
  const mk=(id,cfg)=>{ const c=document.getElementById(id); if(c) new Chart(c,cfg); };
  mk('cStatus',{type:'bar',data:{labels:Object.values(STATUS).map(s=>I18n.t(Helpers.statusKey(s))),datasets:[{data:Object.values(STATUS).map(s=>byStatus[s]||0),backgroundColor:['#03AEA8','#0076F1','#F5A623','#9FB6C0','#0FBF7F','#B9C9D0','#E5484D']}]},options:{plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:grid}}}}});
  mk('cWeek',{type:'line',data:{labels:week.map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d.getDate();}),datasets:[{data:week,borderColor:'#03AEA8',backgroundColor:'rgba(3,174,168,.12)',fill:true,tension:.4,pointRadius:3}]},options:{plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:grid}}}}});
  mk('cWil',{type:'bar',data:{labels:wilTop.map(([w])=>langState.lang==='ar'?Helpers.wilaya(Number(w)):Helpers.wilaya(Number(w))),datasets:[{data:wilTop.map(([,n])=>n),backgroundColor:'rgba(3,174,168,.75)',borderRadius:6}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:grid}}}}});
};
AdminView.refreshAll=function(){ Toast.show(I18n.t('upToDate'),'ok'); this.overview(); };

/* =================== المستخدمون =================== */
AdminView.users=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const list=db.users.filter(u=>u.role==='user');
  const f=this._uf||{q:'',sts:'',ver:''};
  let rows=list.filter(u=>{
    if(f.q){ const t=(u.name+' '+(u.nameFr||'')+' '+u.phone+' '+u.email).toLowerCase(); if(!t.includes(f.q.toLowerCase())) return false; }
    if(f.sts==='on'&&!u.online) return false; if(f.sts==='off'&&u.online) return false;
    if(f.ver==='ver'&&!u.verified) return false; if(f.ver==='no'&&u.verified) return false;
    return true;
  });
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('users')}</h2><div class="sub">${rows.length} ${I18n.t('registered')} · ${list.filter(u=>u.online).length} ${I18n.t('onlineCount')}</div></div>
  <div class="acts"><button class="btn ghost" data-act="csvUsers">${ICONS.logBook} ${I18n.t('exportCsv')}</button></div></div>
  <div class="filter-bar mb">
    <div class="field grow"><input data-fi="q" value="${Helpers.esc(f.q)}" placeholder="${I18n.t('searchUser')}"></div>
    <div class="field"><label>${I18n.t('statusPeople')}</label><select data-fi="sts"><option value="">${I18n.t('allCat')}</option><option value="on" ${f.sts==='on'?'selected':''}>${I18n.t('online')}</option><option value="off" ${f.sts==='off'?'selected':''}>${I18n.t('offline')}</option></select></div>
    <div class="field"><label>${I18n.t('verification')}</label><select data-fi="ver"><option value="">${I18n.t('allCat')}</option><option value="ver" ${f.ver==='ver'?'selected':''}>${I18n.t('verifiedAcc')}</option><option value="no" ${f.ver==='no'?'selected':''}>${I18n.t('notVerified')}</option></select></div>
  </div>
  <div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>${I18n.t('name')}</th><th>${I18n.t('location')}</th><th>${I18n.t('level')}</th><th>${I18n.t('ratingAfter')}</th><th>${I18n.t('status')}</th><th>${I18n.t('actions')}</th></tr></thead>
    <tbody>${rows.map(u=>`
      <tr>
        <td><div class="flex"><div class="avatar sm">${Helpers.initials(Helpers.userName(u))}</div><div><b>${Helpers.esc(Helpers.userName(u))}</b><div class="muted small">${u.email}</div></div>${u.verified?`<span class="chip ok">${ICONS.shield}</span>`:''}</div></td>
        <td>${Helpers.wilaya(u.wilaya)}<div class="muted small">${Helpers.esc(u.town||'')}</div></td>
        <td><span class="chip teal">${I18n.t('lvl'+Helpers.levelKey(u).charAt(0).toUpperCase()+Helpers.levelKey(u).slice(1))}</span></td>
        <td>${Helpers.ratingStars(u.rating||0)}<div class="muted small">${u.rates||0}</div></td>
        <td><span class="pulse-dot ${u.online?'':'off'}"></span> ${u.online?I18n.t('online'):I18n.t('offline')}</td>
        <td><div class="flex">
          <button class="btn ghost sm" data-act="uView" data-id="${u.id}">${I18n.t('viewProfile')}</button>
          ${u.verified?`<button class="btn line sm" data-act="uUnverify" data-id="${u.id}">${I18n.t('rejectDoc')}</button>`:`<button class="btn sm" data-act="uVerify" data-id="${u.id}">${I18n.t('approve')}</button>`}
          <button class="btn line sm" data-act="uBan" data-id="${u.id}" data-banned="${u.banned?'1':'0'}">${u.banned?I18n.t('unlock'):I18n.t('delete')}</button>
        </div></td>
      </tr>`).join('')||`<tr><td colspan="6" class="center muted">${I18n.t('noResults')}</td></tr>`}</tbody>
  </table></div>`;
  Layout.crumb(I18n.t('users'));
  Layout.markNav('users');
  el.querySelectorAll('[data-fi]').forEach(inp=>{
    inp.addEventListener('input'||'change',()=>{ this._uf=this._uf||{}; if(inp.getAttribute('data-fi')==='q') this._uf.q=inp.value; else this._uf[inp.getAttribute('data-fi')]=inp.value; this._defer(this.users.bind(this)); });
  });
};
AdminView._defer=function(fn){ clearTimeout(this._td); this._td=setTimeout(fn,300); };
AdminView.uView=function(t){ this.profileModal(t.getAttribute('data-id')); };
AdminView.uVerify=function(t){
  const db=this.db(); const u=db.users.find(x=>x.id===t.getAttribute('data-id')); u.verified=true;
  Audit.log(db,Auth.current().userId,'USER_VERIFY','توثيق '+u.name,'Vérif. '+ (u.nameFr||u.name));
  Store.save(db); Toast.show(I18n.t('approved')||'OK','ok'); this.users();
};
AdminView.uUnverify=function(t){
  const db=this.db(); const u=db.users.find(x=>x.id===t.getAttribute('data-id')); u.verified=false;
  Audit.log(db,Auth.current().userId,'USER_UNVERIFY','إلغاء توثيق '+u.name,'Détochage '+u.name); Store.save(db); this.users();
};
AdminView.uBan=function(t){
  const db=this.db(); const u=db.users.find(x=>x.id===t.getAttribute('data-id')); const was=u.banned;
  Modal.confirm(was?I18n.t('unlock'):I18n.t('delete'), Helpers.userName(u), was?I18n.t('unlock'):I18n.t('delete'),'danger').then(ok=>{
    if(!ok) return; u.banned=!was; if(u.banned) u.online=false;
    Audit.log(db,Auth.current().userId,was?'USER_UNBAN':'USER_BAN',(was?'فك حظر ':'حظر ')+u.name,was?'Déblocage ':'Blocage '+u.name); Store.save(db); this.users();
  });
};
AdminView.profileModal=function(uid){
  const db=this.db(); const u=db.users.find(x=>x.id===uid); if(!u) return;
  const done=db.tasks.filter(t=>t.assignee===uid && t.status==='paid').length;
  const modal=Modal.open(`<h3>${Helpers.esc(Helpers.userName(u))}</h3><p class="msub">${u.email} · ${u.phone}</p>
    <div class="flex" style="align-items:center;gap:14px"><div class="avatar lg">${Helpers.initials(Helpers.userName(u))}</div>
    <div><b>${Helpers.esc(Helpers.userName(u))}</b><div class="muted small">${Helpers.wilaya(u.wilaya)} · ${Helpers.esc(u.town||'')}</div>
    <div class="mt">${Helpers.ratingStars(u.rating||0)} (${u.rates||0})</div></div></div>
    <div class="grid c3 mt">${[['level',I18n.t('lvl'+Helpers.levelKey(u).charAt(0).toUpperCase()+Helpers.levelKey(u).slice(1))],['memberSince',Helpers.date(u.memberSince)],['tasksDoneTask',done],['online',u.online?I18n.t('online'):I18n.t('offline')],['verifiedAcc',u.verified?I18n.t('yesConfirm'):I18n.t('notVerified')],['points',u.points+' '+I18n.t('points')]].map(([k,v])=>`<div class="card flat" style="border:1px solid var(--line)"><div class="muted small">${I18n.t(k)}</div><b>${Helpers.esc(String(v))}</b></div>`).join('')}</div>
    <div class="badge-row mt">${(u.skills||[]).map(x=>`<span class="chip teal">${AppView.catIc(x)} ${Helpers.cat(x)}</span>`).join('')}</div>
    <p class="muted small mt">${Helpers.esc(u.bio||'')}</p>`);
};
AdminView.csvUsers=function(){
  const rows=this.db().users.filter(u=>u.role==='user').map(u=>[u.name,(u.nameFr||''),u.email,u.phone,Helpers.wilaya(u.wilaya),u.online?1:0,u.verified?1:0,u.rating||'']);
  CSV.download([['name','nameFr','email','phone','wilaya','online','verified','rating'],...rows],'livesight-users.csv');
};

/* =================== المهام =================== */
AdminView.tasks=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const f=this._at||{q:'',sts:''};
  let list=db.tasks.slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(f.sts) list=list.filter(t=>t.status===f.sts);
  if(f.q) list=list.filter(t=>(t.title+' '+(t.titleFr||'')+' '+t.town).toLowerCase().includes(f.q.toLowerCase()));
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('tasks')}</h2><div class="sub">${list.length}</div></div>
  <div class="acts"><button class="btn ghost" data-act="csvTasks">${ICONS.logBook} ${I18n.t('exportCsv')}</button></div></div>
  <div class="filter-bar mb">
    <div class="field grow"><input data-fi="q" value="${Helpers.esc(f.q)}" placeholder="${I18n.t('search')}…"></div>
    <div class="field"><label>${I18n.t('state')}</label><select data-fi="sts"><option value="">${I18n.t('allCat')}</option>${Object.keys(STATUS).map(k=>`<option value="${STATUS[k]}" ${f.sts===STATUS[k]?'selected':''}>${I18n.t(k)}</option>`).join('')}</select></div>
  </div>
  <div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>${I18n.t('taskTitle')}</th><th>${I18n.t('clientU')}</th><th>${I18n.t('provider')}</th><th>${I18n.t('wilaya')}</th><th>${I18n.t('amount')}</th><th>${I18n.t('state')}</th><th>${I18n.t('actions')}</th></tr></thead>
    <tbody>${list.map(t=>`
      <tr>
        <td style="max-width:230px"><b class="small">${Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title)}</b><div class="muted small">${Helpers.cat(t.cat)} · ${Helpers.date(t.date)}</div></td>
        <td class="small">${Helpers.esc(Helpers.userName(Helpers.user(t.client)))}</td>
        <td class="small">${t.assignee?Helpers.esc(Helpers.userName(Helpers.user(t.assignee))):'—'}</td>
        <td class="small">${Helpers.wilaya(t.wilaya)}</td>
        <td><b>${Helpers.money(t.budget)}</b></td>
        <td>${AppView.statusChip(t.status)}</td>
        <td><div class="flex"><button class="btn ghost sm" data-act="tView" data-id="${t.id}">${I18n.t('viewRequest')}</button>
        ${['open','in_progress','awaiting_proof'].includes(t.status)?`<button class="btn line sm" data-act="tCancel" data-id="${t.id}">${I18n.t('cancel')}</button>`:''}</div></td>
      </tr>`).join('')||`<tr><td colspan="7" class="center muted">${I18n.t('noResults')}</td></tr>`}</tbody>
  </table></div>`;
  Layout.crumb(I18n.t('tasks')); Layout.markNav('tasks');
  el.querySelectorAll('[data-fi]').forEach(inp=>{ inp.addEventListener('input'||'change',()=>{ this._at=this._at||{}; if(inp.getAttribute('data-fi')==='q') this._at.q=inp.value; else this._at[inp.getAttribute('data-fi')]=inp.value; this._defer(this.tasks.bind(this)); }); });
};
AdminView.tView=function(t){ // يُفتح بنافذة تفاصيل مصغرة
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  Modal.open(`<h3>${Helpers.esc(langState.lang==='ar'?task.title:task.titleFr||task.title)}</h3><p class="msub">${AppView.statusChip(task.status)} · ${Helpers.cat(task.cat)} · ${Helpers.wilaya(task.wilaya)}</p>
    <div class="grid c2">${[['clientU',Helpers.userName(Helpers.user(task.client))],['provider',task.assignee?Helpers.userName(Helpers.user(task.assignee)):'—'],['amount',Helpers.money(task.budget)],['schedule',task.schedule?Helpers.date(task.schedule):I18n.t('now')]].map(([k,v])=>`<div><div class="muted small">${I18n.t(k)}</div><b>${Helpers.esc(String(v))}</b></div>`).join('')}</div>
    <p class="small muted mt">${Helpers.esc(langState.lang==='ar'?task.desc:task.descFr||task.desc)}</p>
    <div class="flex mt"><button class="btn grow" onclick="location.href='app.html#/task/${task.id}';Modal.close()">${I18n.t('taskDetail')}</button></div>`);
};
AdminView.tCancel=function(t){
  const db=this.db(); const task=db.tasks.find(x=>x.id===t.getAttribute('data-id'));
  Modal.confirm(I18n.t('cancel'),I18n.t('deleteTaskSure'),I18n.t('confirm'),'danger').then(ok=>{ if(!ok) return;
    task.status=STATUS.cancelled;
    if(task.offerAmount && task.client){ const c=db.users.find(u=>u.id===task.client); c.balance+=task.offerAmount; db.wallet.unshift({id:Store.uid(),user:c.id,type:'txRelease',amount:task.offerAmount,date:new Date().toISOString(),ref:'REF-'+task.id,taskId:task.id,status:'done'}); }
    Audit.log(db,Auth.current().userId,'TASK_CANCEL','إلغاء '+task.id,'Annulation '+task.id); Store.save(db); this.tasks();
  });
};
AdminView.csvTasks=function(){
  const rows=this.db().tasks.map(t=>[t.title,t.titleFr||t.title,Helpers.cat(t.cat),Helpers.wilaya(t.wilaya),t.budget,t.status,t.client,t.assignee||'',Helpers.date(t.date)]);
  CSV.download([['title','titleFr','cat','wilaya','budget','status','client','assignee','date'],...rows],'livesight-tasks.csv');
};

/* =================== النزاعات =================== */
AdminView.disputes=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const list=db.disputes.slice().sort((a,b)=>new Date(b.when)-new Date(a.when));
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('disputes')}</h2><div class="sub">${list.filter(d=>d.status==='open').length} ${I18n.t('openN')}</div></div></div>
  ${list.length? list.map(d=>{ const task=db.tasks.find(t=>t.id===d.taskId);
    return `<div class="card mb">
      <div class="flex between wrap">
        <div><b>${task?Helpers.esc(langState.lang==='ar'?task.title:task.titleFr||task.title):d.taskId}</b>
        <div class="muted small mt">${I18n.t('openedBy')}: ${Helpers.esc(Helpers.userName(Helpers.user(d.openedBy)))} · ${Helpers.date(d.when)}</div></div>
        ${d.status==='open'?`<span class="chip danger">${I18n.t('openN')}</span>`:`<span class="chip ok">${I18n.t('resolved')}</span>`}
      </div>
      <div class="card mt" style="background:var(--bg-soft);border-color:var(--line)">${Helpers.esc(langState.lang==='ar'?d.reason:d.reasonFr||d.reason)}</div>
      ${task&&task.evidence?`<div class="photos-row mt">${task.evidence.photos.map(p=>`<img src="${p}" alt="">`).join('')||'<span class="muted small">'+I18n.t('emptyList')+'</span>'}</div>`:''}
      ${d.status==='open'?`
      <div class="flex mt" style="flex-wrap:wrap">
        <button class="btn sm" data-act="dPayProv" data-id="${d.id}">${I18n.t('payProvider')}</button>
        <button class="btn line sm" data-act="dRefund" data-id="${d.id}">${I18n.t('refundClient')}</button>
        <button class="btn ghost sm" data-act="dReopen" data-id="${d.id}" data-st="${task?task.status:''}">${I18n.t('resolveTask')}</button>
        <button class="btn ghost sm" data-act="dClose" data-id="${d.id}">${I18n.t('closeDispute')}</button>
      </div>`:''}
    </div>`; }).join('') : `<div class="empty">${ICONS.flag}<b>${I18n.t('emptyList')}</b></div>`}`;
  Layout.crumb(I18n.t('disputes')); Layout.markNav('disputes');
};
AdminView.dResolve=function(did, mode){
  const db=this.db(); const d=db.disputes.find(x=>x.id===did); const task=db.tasks.find(t=>t.id===d.taskId);
  const amt=task.offerAmount||task.budget;
  if(mode==='pay'){ const prov=db.users.find(u=>u.id===task.assignee); if(prov&&task.status!=='paid'){ prov.balance+=amt; db.wallet.unshift({id:Store.uid(),user:prov.id,type:'txEarning',amount:amt,date:new Date().toISOString(),ref:'ADM-'+task.id,taskId:task.id,status:'done'}); task.status=STATUS.paid; }}
  if(mode==='refund'){ const c=db.users.find(u=>u.id===task.client); if(c){ c.balance+=amt; db.wallet.unshift({id:Store.uid(),user:c.id,type:'txRelease',amount:amt,date:new Date().toISOString(),ref:'ADM-'+task.id,taskId:task.id,status:'done'}); task.status=STATUS.cancelled; }}
  if(mode==='reopen'){ task.status=STATUS.open; task.applications=[]; }
  d.status='closed'; d.decision=mode; d.closedWhen=new Date().toISOString();
  Audit.log(db,Auth.current().userId,'DISPUTE_RESOLVE','حسم نزاع '+d.taskId+' ('+mode+')','Résolution '+d.taskId+' ('+mode+')');
  Store.save(db); this.disputes(); Toast.show(I18n.t('resolved'),'ok');
};
AdminView.dPayProv=function(t){ this.dResolve(t.getAttribute('data-id'),'pay'); };
AdminView.dRefund=function(t){ this.dResolve(t.getAttribute('data-id'),'refund'); };
AdminView.dReopen=function(t){ this.dResolve(t.getAttribute('data-id'),'reopen'); };
AdminView.dClose=function(t){ const db=this.db(); const d=db.disputes.find(x=>x.id===t.getAttribute('data-id')); d.status='closed'; d.closedWhen=new Date().toISOString(); Store.save(db); this.disputes(); };

/* =================== الأصناف =================== */
AdminView.categories=function(){
  const el=document.getElementById('view');
  const db=this.db();
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('categories')}</h2><div class="sub">${db.cats.length}</div></div>
  <div class="acts"><button class="btn" data-act="catAdd">${ICONS.plus} ${I18n.t('addCat')}</button></div></div>
  <div class="cat-grid">${db.cats.map(c=>`
    <div class="cat-opt"><span class="ci">${AppView.catIc(c.id)}</span>${langState.lang==='ar'?c.ar:c.fr}
      <div class="flex" style="width:100%">
        <button class="btn ghost sm grow" data-act="catEdit" data-id="${c.id}">${I18n.t('edit')}</button>
        <button class="btn line sm" data-act="catDel" data-id="${c.id}">${ICONS.trash||'✕'}</button>
      </div></div>`).join('')}</div>`;
  Layout.crumb(I18n.t('categories')); Layout.markNav('categories');
};
AdminView.catAdd=function(){ this.catForm(null); };
AdminView.catEdit=function(t){ this.catForm(t.getAttribute('data-id')); };
AdminView.catForm=function(id){
  const db=this.db(); const c=id?db.cats.find(x=>x.id===id):null;
  Modal.prompt(c?I18n.t('edit'):I18n.t('addCat'),'',`
    <div class="field mt"><label>${I18n.t('icon')}</label><input data-val="ic" value="${c?c.ic:'box'}" maxlength="16" placeholder="box / van / wrench …"></div>
    <div class="field mt"><label>${I18n.t('catNameAr')}</label><input data-val="ar" value="${c?Helpers.esc(c.ar):''}"></div>
    <div class="field mt"><label>${I18n.t('catNameFr')}</label><input data-val="fr" value="${c?Helpers.esc(c.fr):''}"></div>`, I18n.t('save')).then(v=>{
      if(!v) return;
      if(c){ c.ic=v.ic||c.ic; c.ar=v.ar||c.ar; c.fr=v.fr||c.fr; }
      else { db.cats.push({id:Store.uid(),ar:v.ar,fr:v.fr,ic:v.ic||'box'}); }
      Audit.log(db,Auth.current().userId,'CAT_EDIT','تعديل/إضافة صنف','Catégorie modifiée'); Store.save(db); this.categories(); Toast.show(I18n.t('catAdded'),'ok');
    });
};
AdminView.catDel=function(t){
  const db=this.db(); const id=t.getAttribute('data-id');
  Modal.confirm(I18n.t('delete'),I18n.t('catDeleted'),I18n.t('delete'),'danger').then(ok=>{ if(!ok) return;
    db.cats=db.cats.filter(c=>c.id!==id); Audit.log(db,Auth.current().userId,'CAT_DEL','حذف صنف','Catégorie supprimée'); Store.save(db); this.categories();
  });
};

/* =================== الولايات =================== */
AdminView.wilayas=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const byW=Helpers.groupBy(db.users.filter(u=>u.role==='user'), u=>u.wilaya);
  const grid=[];
  for(let i=0;i<58;i+=2){
    const wa=db.wilayas[i], wb=db.wilayas[i+1];
    const ca=wa?wa[0]:null, cb=wb?wb[0]:null;
    grid.push([wa,wb]);
  }
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('wilayas')}</h2><div class="sub">${db.wilayas.length} · ${I18n.t('number')||''} ${db.wilayas.filter(w=>{const g=byW[w[0]];return g&&g.length;}).length} ${I18n.t('activeNow')}</div></div></div>
  <div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>#</th><th>${I18n.t('name')}</th><th>${I18n.t('users')}</th><th>${I18n.t('tasks')}</th><th>${I18n.t('onlineCount')}</th></tr></thead>
    <tbody>${grid.map(([a,b])=>`
      <tr>${[a,b].map(w=>w?`
        <td class="muted small" style="width:34px">${w[0]}</td>
        <td><b class="small">${langState.lang==='ar'?w[1]:w[2]}</b></td>
        <td class="small">${(byW[w[0]]||[]).length}</td>
        <td class="small">${db.tasks.filter(t=>t.wilaya===w[0]).length}</td>
        <td class="small">${(byW[w[0]]||[]).filter(u=>u.online).length}</td>`:'<td colspan="5"></td>').join('')}</tr>`).join('')}</tbody>
  </table></div>`;
  Layout.crumb(I18n.t('wilayas')); Layout.markNav('wilayas');
};

/* =================== المعاملات =================== */
AdminView.transactions=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const f=this._xf||'all';
  let list=db.wallet.slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(f!=='all') list=list.filter(x=>x.type===f);
  const classes={all:'teal'};
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('transactions')}</h2><div class="sub">${list.length}</div></div>
  <div class="acts"><button class="btn ghost" data-act="csvTx">${ICONS.logBook} ${I18n.t('exportCsv')}</button></div></div>
  <div class="filter-bar">
    <div class="chip teal" style="cursor:pointer" data-f="all">${I18n.t('txAll')}</div>
    ${['txDeposit','txEscrow','txRelease','txEarning','txWithdraw','txFee'].map(k=>`<div class="chip" style="cursor:pointer" data-f="${k}">${I18n.t(k)}</div>`).join('')}
  </div>
  <div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>${I18n.t('txId')}</th><th>${I18n.t('dateCreated')}</th><th>${I18n.t('name')}</th><th>${I18n.t('type')}</th><th>${I18n.t('ref')}</th><th>${I18n.t('amount')}</th></tr></thead>
    <tbody>${list.map(x=>{ const u=Helpers.user(x.user);
      return `<tr>
        <td class="muted small">${x.id.slice(0,8)}</td>
        <td class="small">${Helpers.date(x.date)}</td>
        <td class="small">${Helpers.esc(Helpers.userName(u))}</td>
        <td><span class="chip ${x.amount>0?'ok':'gray'}">${I18n.t(x.type)}</span></td>
        <td class="muted small">${x.ref}</td>
        <td><b class="amount ${x.amount>0?'in':'out'}">${x.amount>0?'+':''}${Helpers.money(x.amount)}</b></td>
      </tr>`;}).join('')||`<tr><td colspan="6" class="center muted">${I18n.t('noResults')}</td></tr>`}</tbody>
  </table></div>`;
  Layout.crumb(I18n.t('transactions')); Layout.markNav('transactions');
  el.querySelectorAll('[data-f]').forEach(c=>c.addEventListener('click',()=>{ this._xf=c.getAttribute('data-f'); this.transactions(); }));
};
AdminView.csvTx=function(){
  const rows=this.db().wallet.map(x=>[x.ref,Helpers.userName(Helpers.user(x.user)),Helpers.date(x.date),x.type,x.amount]);
  CSV.download([['ref','user','date','type','amount'],...rows],'livesight-transactions.csv');
};

/* =================== التقييمات =================== */
AdminView.ratings=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const list=db.ratings.slice().sort((a,b)=>new Date(b.when)-new Date(a.when));
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('ratings')}</h2><div class="sub">${list.length}</div></div></div>
  <div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>${I18n.t('taskTitle')}</th><th>${I18n.t('from')}</th><th>${I18n.t('to')}</th><th>${I18n.t('yourRating')}</th><th>${I18n.t('comment')}</th><th>${I18n.t('dateCreated')}</th></tr></thead>
    <tbody>${list.map(r=>{ const t=db.tasks.find(x=>x.id===r.taskId);
      return `<tr>
        <td class="small">${t?Helpers.esc(langState.lang==='ar'?t.title:t.titleFr||t.title):r.taskId}</td>
        <td class="small">${Helpers.esc(Helpers.userName(Helpers.user(r.from)))}</td>
        <td class="small">${Helpers.esc(Helpers.userName(Helpers.user(r.to)))}</td>
        <td>${Helpers.ratingStars(r.stars)}</td>
        <td class="small muted">${Helpers.esc(r.comment||'')}</td>
        <td class="small muted">${Helpers.date(r.when)}</td></tr>`;}).join('')||`<tr><td colspan="6" class="center muted">${I18n.t('noResults')}</td></tr>`}</tbody>
  </table></div>`;
  Layout.crumb(I18n.t('ratings')); Layout.markNav('ratings');
};

/* =================== التوثيق =================== */
AdminView.verification=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const notVerified=db.users.filter(u=>u.role==='user' && !u.verified);
  const verified=db.users.filter(u=>u.role==='user' && u.verified);
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('verificationTitle')}</h2><div class="sub">${notVerified.length} ${I18n.t('pendingDoc')}</div></div></div>
  <div class="sec-title"><span class="mono" style="background:rgba(245,166,35,.15);color:#C77E08">${ICONS.shield}</span> ${I18n.t('pendingDoc')}</div>
  ${notVerified.length? notVerified.map(u=>`
    <div class="card mb"><div class="flex between wrap">
      <div class="flex"><div class="avatar">${Helpers.initials(Helpers.userName(u))}</div>
        <div><b>${Helpers.esc(Helpers.userName(u))}</b><div class="muted small">${u.email} · ${Helpers.wilaya(u.wilaya)}</div>
        <div class="chip warn mt" style="margin-top:6px">${u.docType?I18n.t('idDoc'):I18n.t('idDoc')} · ${I18n.t('pendingDoc')}</div></div></div>
      <div class="flex">
        <button class="btn sm" data-act="vApprove" data-id="${u.id}">${I18n.t('approve')}</button>
        <button class="btn line sm" data-act="vReject" data-id="${u.id}">${I18n.t('rejectDoc')}</button></div>
    </div></div>`).join('') : `<div class="empty">${ICONS.shield}<b>${I18n.t('emptyList')}</b></div>`}
  <div class="sec-title"><span class="mono" style="background:rgba(15,191,127,.12);color:#0B9E6C">${ICONS.shield}</span> ${I18n.t('verifiedAcc')}</div>
  ${verified.map(u=>`<div class="flex between" style="padding:10px 0;border-bottom:1px dashed var(--line)">
      <div class="flex"><div class="avatar sm">${Helpers.initials(Helpers.userName(u))}</div><b class="small">${Helpers.esc(Helpers.userName(u))}</b></div>
      <span class="chip ok">✓ ${I18n.t('verifiedAcc')}</span></div>`).join('')}`;
  Layout.crumb(I18n.t('verification')); Layout.markNav('verification');
};
AdminView.vApprove=function(t){ this.db().users.find(u=>u.id===t.getAttribute('data-id')).verified=true; Audit.log(this.db(),Auth.current().userId,'VERIFY_OK','اعتماد توثيق','Vérif validée'); Store.save(this.db()); this.verification(); };
AdminView.vReject=function(t){ const db=this.db(); const u=db.users.find(x=>x.id===t.getAttribute('data-id')); u.docStatus='rejected'; Audit.log(db,Auth.current().userId,'VERIFY_NO','رفض توثيق','Vérif refusée'); Store.save(db); this.verification(); };

/* =================== سجلات التدقيق =================== */
AdminView.audit=function(){
  const el=document.getElementById('view');
  const db=this.db();
  const list=db.audit.slice().sort((a,b)=>new Date(b.when)-new Date(a.when));
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('auditTitle')}</h2><div class="sub">${list.length}</div></div>
  <div class="acts"><button class="btn ghost" data-act="csvAudit">${ICONS.logBook} ${I18n.t('exportCsv')}</button></div></div>
  <div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>${I18n.t('actor')}</th><th>${I18n.t('event')}</th><th>${I18n.t('detailsDetails')}</th><th>${I18n.t('dateCreated')}</th></tr></thead>
    <tbody>${list.map(a=>`
      <tr><td class="small"><b>${Helpers.esc(a.actor)}</b></td>
      <td><span class="chip ${a.action.includes('FAIL')||a.action.includes('BAN')?'danger':'blue'}">${Helpers.esc(a.action)}</span></td>
      <td class="small">${Helpers.esc(langState.lang==='ar'?a.detail:a.detailFr||a.detail)}</td>
      <td class="small muted">${Helpers.date(a.when)}</td></tr>`).join('')||`<tr><td colspan="4" class="center muted">${I18n.t('noResults')}</td></tr>`}</tbody>
  </table></div>`;
  Layout.crumb(I18n.t('audit')); Layout.markNav('audit');
};
AdminView.csvAudit=function(){
  const rows=this.db().audit.map(a=>[a.actor,a.action,a.detail,Helpers.date(a.when)]);
  CSV.download([['actor','action','detail','when'],...rows],'livesight-audit.csv');
};

/* =================== الإعدادات =================== */
AdminView.settingsView=function(){
  const el=document.getElementById('view');
  const db=this.db(); const s=db.settings;
  el.innerHTML=`
  <div class="page-head"><div><h2>${I18n.t('settingsTitle')}</h2><div class="sub">${I18n.t('platformName')}</div></div></div>
  <div class="card" style="max-width:560px">
    <div class="field mb"><label>${I18n.t('platformName')}</label><input id="setName" value="${Helpers.esc(s.name)}"></div>
    <div class="field mb"><label>${I18n.t('supportPhone')}</label><input id="setPhone" value="${Helpers.esc(s.supportPhone)}"></div>
    <div class="grid c2 mb">
      <div class="field"><label>${I18n.t('feePercent')}</label><input id="setFee" type="number" value="${s.feePercent}" min="0" max="30"></div>
      <div class="field"><label>${I18n.t('minWithdraw')}</label><input id="setMin" type="number" value="${s.minWithdraw}" min="100"></div>
    </div>
    <button class="btn" data-act="saveSettings">${I18n.t('saveChanges')}</button>
  </div>`;
  Layout.crumb(I18n.t('adminSettings')); Layout.markNav('settings');
};
AdminView.saveSettings=function(){
  const db=this.db(); const s=db.settings;
  s.name=document.getElementById('setName').value||s.name;
  s.supportPhone=document.getElementById('setPhone').value||s.supportPhone;
  s.feePercent=Number(document.getElementById('setFee').value)||s.feePercent;
  s.minWithdraw=Number(document.getElementById('setMin').value)||s.minWithdraw;
  Audit.log(db,Auth.current().userId,'SETTINGS','تعديل إعدادات المنصة','Paramètres modifiés'); Store.save(db); Toast.show(I18n.t('settingsSaved'),'ok');
};

AdminView.goAudit=function(){ Router.go('audit'); };
AdminView.refreshLang=function(){ if(document.getElementById('view')) { const m=Router.route(Router.current()); if(m) m.fn(m.params); } };

document.addEventListener('click', function(e){
  const a=e.target.closest('[data-route]');
  if(a){ e.preventDefault(); return; }
  const b=e.target.closest('[data-act]');
  if(!b) return;
  const act=b.getAttribute('data-act');
  if(typeof AdminView[act]==='function'){ e.preventDefault(); AdminView[act](b,e); }
});

Router.on('overview', ()=>AdminView.overview());
Router.on('users', ()=>AdminView.users());
Router.on('tasks', ()=>AdminView.tasks());
Router.on('disputes', ()=>AdminView.disputes());
Router.on('categories', ()=>AdminView.categories());
Router.on('wilayas', ()=>AdminView.wilayas());
Router.on('transactions', ()=>AdminView.transactions());
Router.on('ratings', ()=>AdminView.ratings());
Router.on('verification', ()=>AdminView.verification());
Router.on('audit', ()=>AdminView.audit());
Router.on('settings', ()=>AdminView.settingsView());
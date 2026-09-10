/* LiveSight — Hash Router بسيط */
const Router = {
  routes:{},
  on(hash, fn){ this.routes[hash]=fn; },
  current(hash){ return location.hash.replace(/^#\/?/, '') || 'dashboard'; },
  during(fn){ if(fn) fn(); },

  parse(){
    const raw=this.current();
    const parts=raw.split('/');
    return { name:parts[0], params:parts.slice(1) };
  },

  route(routeName){
    for(const p in this.routes){
      const seg=p.split('/');
      const pSeg=routeName.split('/');
      if(seg.length!==pSeg.length) continue;
      const m={};
      let ok=true;
      for(let i=0;i<seg.length;i++){
        if(seg[i].startsWith(':')) m[seg[i].slice(1)]=decodeURIComponent(pSeg[i]);
        else if(seg[i]!==pSeg[i]){ ok=false; break; }
      }
      if(ok) return {fn:this.routes[p], params:m};
    }
    return null;
  },

  go(path){ location.hash = '#/' + path; setTimeout(()=>this.run(),0); },
  run(){
    const m=this.route(this.current());
    if(m) m.fn(m.params);
  }
};
window.addEventListener('hashchange', ()=>Router.run());
window.Router=Router;
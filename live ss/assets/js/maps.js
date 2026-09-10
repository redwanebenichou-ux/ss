/* LiveSight — طبقة الخرائط (Leaflet + OSM) */
const Maps = {
  _map:null, _layer:null, _markers:[],
  icon(color){
    const c = color || '#03AEA8';
    return L.divIcon({ className:'', html:`<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${c};box-shadow:0 4px 12px rgba(0,0,0,.3);border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;"><span style="width:6px;height:6px;border-radius:50%;background:#fff;margin:22px 0 0 6px"></span></div>`, iconSize:[26,26], iconAnchor:[13,26], popupAnchor:[0,-24]});
  },
  init(el){
    if(!window.L) return null;
    this.dispose();
    this._map=L.map(el, {zoomControl:true}).setView([28.0, 2.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this._map);
    if(el._leaflet_load && typeof location !== 'undefined'){ setTimeout(()=>this._map.invalidateSize(), 120); }
    setTimeout(()=>{ if(this._map) this._map.invalidateSize(); }, 150);
    return this._map;
  },
  dispose(){
    if(this._map){ this._map.remove(); this._map=null; }
    this._layer=null;
    this._markers=[];
  },
  clearMarkers(){ if(this._layer){ this._layer.clearLayers(); } },
  fit(latlngs){
    if(!this._map || !latlngs.length) return;
    const b=L.latLngBounds(latlngs);
    if(latlngs.length===1) this._map.setView(latlngs[0], 13);
    else this._map.fitBounds(b.pad(0.3));
  },
  me(coords, label){
    if(!this._map) return null;
    const m=L.circleMarker(coords, {radius:8, color:'#fff', weight:3, fillColor:'#0076F1', fillOpacity:1});
    m.bindPopup(label||I18n.t('myLocation'));
    m.addTo(this._map);
    return m;
  },
  pin(coords, popupHtml, color){
    if(!this._map) return null;
    if(!this._layer){ this._layer=L.layerGroup().addTo(this._map); }
    const m=L.marker(coords, {icon:this.icon(color)});
    if(popupHtml) m.bindPopup(popupHtml, {maxWidth:280, closeButton:false});
    m.addTo(this._layer);
    this._markers.push(m);
    return m;
  },
  circle(coords, radiusKm, color){
    if(!this._map) return null;
    return L.circle(coords, {radius:radiusKm*1000, color:color||'#0076F1', weight:1, dashArray:'4 6', fillColor:color||'#0076F1', fillOpacity:.08}).addTo(this._map);
  }
};
window.Maps=Maps;
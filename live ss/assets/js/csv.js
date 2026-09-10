/* LiveSight — تصدير CSV */
const CSV = {
  download(rows, filename){
    const esc=v=>{ v=String(v==null?'':v); return /[",\n]/.test(v)? '"'+v.replace(/"/g,'""')+'"' : v; };
    const csv = rows.map(r=>r.map(esc).join(';')).join('\r\n');
    const blob=new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    Toast.show(I18n.t('exportDone'),'ok');
  }
};
window.CSV=CSV;
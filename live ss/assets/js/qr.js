/* LiveSight — مكتبة QR (إذا توفرت ليفرينة qrcode) */
const QR = {
  make(el, text, size){
    if(!el) return;
    if(window.QRCode){
      el.innerHTML=''; new QRCode(el, {text, width:size||180, height:size||180, colorDark:'#0E2A32', colorLight:'#ffffff'});
    } else {
      el.innerHTML='<div class="qr-fallback">&nbsp;</div>';
    }
  }
};
window.QR=QR;
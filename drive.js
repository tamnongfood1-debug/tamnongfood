// Tải ảnh lên Google Drive thông qua Google Apps Script (xem README, mục "Tải ảnh lên Google Drive").
import {auth} from './firebase-config.js';

// Dán URL Web app của Apps Script vào đây (dạng https://script.google.com/macros/s/.../exec)
export const UPLOAD_URL='https://script.google.com/macros/s/AKfycbyjKB2KiOer2jNZ26aLIgWAnSVxVl8ltCOQRwzQbaFjsBnVaGi_FVtBzeOsLSk30BnY/exec';

// Thu nhỏ ảnh trước khi tải để nhanh và nhẹ (tối đa 900px, JPEG)
function compress(file,max=900,q=.82){
 return new Promise((ok,no)=>{
  const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');
   c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
   const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
   URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',q))};
  img.onerror=()=>{URL.revokeObjectURL(u);no(new Error('Không đọc được file ảnh'))};
  img.src=u})
}
export async function uploadImage(file,kind='img'){
 if(!UPLOAD_URL)throw new Error('Chưa cấu hình UPLOAD_URL trong drive.js (xem README)');
 if(!auth.currentUser)throw new Error('Bạn chưa đăng nhập');
 const data=(await compress(file)).split(',')[1],token=await auth.currentUser.getIdToken();
 // Gửi dạng text/plain để trình duyệt không cần preflight CORS với Apps Script
 const r=await fetch(UPLOAD_URL,{method:'POST',body:JSON.stringify({token,kind,data})});
 const j=await r.json();if(!j.ok)throw new Error(j.error||'Tải ảnh thất bại');return j.url}

// Gắn ô chọn file + ô link + ảnh xem trước + dòng trạng thái
export function bindPicker(fileEl,urlEl,prevEl,statEl,kind){
 const show=()=>{prevEl.hidden=!urlEl.value;if(urlEl.value)prevEl.src=urlEl.value};
 fileEl.onchange=async()=>{const f=fileEl.files[0];if(!f)return;
  fileEl.dataset.busy='1';statEl.textContent='Đang tải ảnh lên Google Drive...';
  try{urlEl.value=await uploadImage(f,kind);show();statEl.textContent='Đã tải lên ✓'}
  catch(e){statEl.textContent='Lỗi: '+(e.message||e)}
  fileEl.dataset.busy='';fileEl.value=''};
 urlEl.addEventListener('input',show);show();
 return {refresh:show,clear(){urlEl.value='';statEl.textContent='';show()},busy:()=>fileEl.dataset.busy==='1'}
}

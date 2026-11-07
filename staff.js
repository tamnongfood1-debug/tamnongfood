import {auth,db,ready} from './firebase-config.js';
import {signInWithEmailAndPassword as si,createUserWithEmailAndPassword as cu,onAuthStateChanged as oa,signOut,sendPasswordResetEmail as rp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {doc,getDoc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
export const $=s=>document.querySelector(s);
export const money=n=>(n||0).toLocaleString('vi-VN')+'đ';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ST={new:'Chờ quán nhận',accepted:'Quán đang làm',ready:'Chờ tài xế',delivering:'Đang giao',done:'Đã giao',cancelled:'Đã hủy'};
export const tm=o=>o.createdAt?new Date(o.createdAt.seconds*1000).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'}):'';
export const byTime=(a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0);
export const viErr=c=>({
 'auth/invalid-email':'Email không hợp lệ.','auth/missing-password':'Chưa nhập mật khẩu.',
 'auth/weak-password':'Mật khẩu quá yếu (cần từ 6 ký tự).','auth/email-already-in-use':'Email này đã được đăng ký.',
 'auth/invalid-credential':'Sai email hoặc mật khẩu.','auth/wrong-password':'Sai email hoặc mật khẩu.','auth/user-not-found':'Sai email hoặc mật khẩu.',
 'auth/too-many-requests':'Thử sai quá nhiều lần, vui lòng đợi một lúc.','auth/network-request-failed':'Mất kết nối mạng.',
 'permission-denied':'Không có quyền thực hiện. Kiểm tra Firestore Rules.'
}[c]||('Lỗi: '+c));
window.logout=()=>signOut(auth);
export function gate(role,title,start){
 $('#lg').className='lg';
 if(!ready){$('#lg').innerHTML='<h2>'+title+'</h2><p class="e" style="padding:10px">Chưa cấu hình Firebase.<br>Mở file <b>firebase-config.js</b> và dán thông tin dự án (xem README.md).</p>';return}
 $('#lg').innerHTML='<h2>'+title+'</h2><input id="em" type="email" placeholder="Email" autocomplete="email"><input id="pw" type="password" placeholder="Mật khẩu (từ 6 ký tự)" autocomplete="current-password"><div id="rg" style="display:none"><input id="nm" placeholder="Họ tên"><input id="ph" placeholder="Số điện thoại" inputmode="tel"></div><button class="b" id="bi">Đăng nhập</button>'+(role==='admin'?'':'<button class="b g" id="br">Đăng ký tài khoản mới</button>')+'<button class="b g" id="bf" style="font-size:14px;padding:9px">Quên mật khẩu?</button><p id="ms"></p>';
 const ms=(t,ok)=>{$('#ms').textContent=t;$('#ms').style.color=ok?'#1a7a35':'#c62912'};let reg=false,busy=false;
 if($('#br'))$('#br').onclick=()=>{reg=!reg;$('#rg').style.display=reg?'block':'none';$('#bi').textContent=reg?'Gửi đăng ký':'Đăng nhập';$('#br').textContent=reg?'Quay lại đăng nhập':'Đăng ký tài khoản mới'};
 $('#bf').onclick=async()=>{const e=$('#em').value.trim();if(!e)return ms('Nhập email trước rồi bấm "Quên mật khẩu".');try{await rp(auth,e);ms('Đã gửi email đặt lại mật khẩu.',1)}catch(x){ms(viErr(x.code))}};
 async function check(u){
  const s=await getDoc(doc(db,'users',u.uid)),p=s.exists()?s.data():null;
  if(!p||p.role!==role){ms('Tài khoản này không có quyền vào trang này.');await signOut(auth);return}
  if(!p.approved){ms('Tài khoản đang chờ admin duyệt hoặc đã bị khóa.');await signOut(auth);return}
  $('#lg').hidden=true;$('#ap').hidden=false;start(u,p)}
 $('#bi').onclick=async()=>{ms('');const e=$('#em').value.trim(),w=$('#pw').value;
  try{if(reg){const n=$('#nm').value.trim(),ph=$('#ph').value.trim();if(!n||!ph)return ms('Nhập họ tên và số điện thoại');busy=true;
    const c=await cu(auth,e,w);await setDoc(doc(db,'users',c.user.uid),{role,name:n,phone:ph,email:e,approved:false,createdAt:serverTimestamp()});busy=false;
    await signOut(auth);ms('Đăng ký thành công. Vui lòng chờ admin duyệt tài khoản.',1)}
   else await si(auth,e,w)}catch(x){busy=false;ms(viErr(x.code||x.message))}};
 oa(auth,u=>{if(u&&!busy)check(u).catch(x=>ms(viErr(x.code||x.message)))});
}

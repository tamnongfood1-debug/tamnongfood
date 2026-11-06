import {auth,db} from './firebase-config.js';
import {signInWithEmailAndPassword as si,createUserWithEmailAndPassword as cu,onAuthStateChanged as oa,signOut} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {doc,getDoc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
export const $=s=>document.querySelector(s);
export const money=n=>(n||0).toLocaleString('vi-VN')+'đ';
export const ST={new:'Chờ quán nhận',accepted:'Quán đang làm',ready:'Chờ tài xế',delivering:'Đang giao',done:'Đã giao',cancelled:'Đã hủy'};
export const tm=o=>o.createdAt?new Date(o.createdAt.seconds*1000).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'}):'';
export const byTime=(a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0);
window.logout=()=>signOut(auth);
export function gate(role,title,start){
 $('#lg').className='lg';
 $('#lg').innerHTML='<h2>'+title+'</h2><input id="em" type="email" placeholder="Email"><input id="pw" type="password" placeholder="Mật khẩu (từ 6 ký tự)"><div id="rg" style="display:none"><input id="nm" placeholder="Họ tên"><input id="ph" placeholder="Số điện thoại" inputmode="tel"></div><button class="b" id="bi">Đăng nhập</button>'+(role==='admin'?'':'<button class="b g" id="br">Đăng ký tài khoản mới</button>')+'<p id="ms"></p>';
 const ms=t=>$('#ms').textContent=t;let reg=false,busy=false;
 if($('#br'))$('#br').onclick=()=>{reg=!reg;$('#rg').style.display=reg?'block':'none';$('#bi').textContent=reg?'Gửi đăng ký':'Đăng nhập';$('#br').textContent=reg?'Quay lại đăng nhập':'Đăng ký tài khoản mới'};
 async function check(u){
  const s=await getDoc(doc(db,'users',u.uid)),p=s.exists()?s.data():null;
  if(!p||p.role!==role){ms('Tài khoản này không có quyền vào trang này.');await signOut(auth);return}
  if(!p.approved){ms('Đã đăng ký. Vui lòng chờ admin duyệt tài khoản.');await signOut(auth);return}
  $('#lg').hidden=true;$('#ap').hidden=false;start(u,p)}
 $('#bi').onclick=async()=>{ms('');const e=$('#em').value.trim(),w=$('#pw').value;
  try{if(reg){if(!$('#nm').value||!$('#ph').value)return ms('Nhập họ tên và số điện thoại');busy=true;
    const c=await cu(auth,e,w);await setDoc(doc(db,'users',c.user.uid),{role,name:$('#nm').value,phone:$('#ph').value,email:e,approved:false,createdAt:serverTimestamp()});busy=false;await check(c.user)}
   else await si(auth,e,w)}catch(x){busy=false;ms('Lỗi: '+(x.code||x.message))}};
 oa(auth,u=>{if(u&&!busy)check(u).catch(x=>ms('Lỗi: '+x.message))});
}

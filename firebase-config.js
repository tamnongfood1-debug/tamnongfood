import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// Dán thông tin Firebase của bạn vào đây (Firebase Console > Project settings > Your apps > Web app)
// Xem hướng dẫn từng bước trong README.md
export const cfg={
  apiKey:"DÁN_API_KEY",
  authDomain:"TEN-PROJECT.firebaseapp.com",
  projectId:"TEN-PROJECT",
  appId:"DÁN_APP_ID"
};
export const ready=!cfg.apiKey.startsWith('DÁN');
export const app=initializeApp(cfg),db=getFirestore(app),auth=getAuth(app);

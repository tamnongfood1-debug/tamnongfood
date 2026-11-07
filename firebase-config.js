import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
export const cfg={
  apiKey:"AIzaSyAECDJ5Nxsom9JAnXSEQ-6SyhL9d4j1IDo",
  authDomain:"tamnongfood-2e8a8.firebaseapp.com",
  projectId:"tamnongfood-2e8a8",
  appId:"1:119971165608:web:ebb1c58a553552f6a9199d"
};
export const ready=!cfg.apiKey.startsWith('DÁN');
export const app=initializeApp(cfg),db=getFirestore(app),auth=getAuth(app);

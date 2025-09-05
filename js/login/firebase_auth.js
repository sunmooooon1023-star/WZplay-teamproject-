import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFxFQ9xGmM83c4t4bT6hnS5M9qs8VzcKo",
  authDomain: "wzplay.firebaseapp.com",
  projectId: "wzplay",
  storageBucket: "wzplay.firebasestorage.app",
  messagingSenderId: "207734500469",
  appId: "1:207734500469:web:50aa60ce05102d53d89c3c",
  measurementId: "G-BQK9V00QZN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

//구글로그인
export const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return user;
  } catch (error) {
    alert("예기치 못한 오류가 발생했습니다.다시 시도해 주세요.");
    console.log(error);
    throw error;
  }
};

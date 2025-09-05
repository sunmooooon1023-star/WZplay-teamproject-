import { checkLogin } from "../layout.js";
import { googleLogin } from "./firebase_auth.js";

document.addEventListener("DOMContentLoaded", async () => {

    //레이아웃 렌더링
    await renderHeader(); 
    checkLogin();
    await renderFooter();

    login();
    handleGoogleLogin();
    handleKakaoLogin();
})

const renderHeader = async () => {
    const mainHeader = document.getElementById("mainHeader");

    const res = await fetch("layout.html");
    const htmlText = await res.text(); 

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html"); 
    const header = doc.getElementById("mainHeader").innerHTML; 

    mainHeader.innerHTML = header;
};

const renderFooter = async () => {
    const mainFooter = document.getElementById("mainFooter");

    const response = await fetch("layout.html");
    const htmlText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const footer = doc.getElementById("mainFooter").innerHTML;

    mainFooter.innerHTML = footer;
}



//로그인 관련 로직
const login = () => {
    const loginBtn = document.querySelector(".form-content-box.login button");
    
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const inputId = document.getElementById("id").value.trim();
        const inputPw = document.getElementById("password").value;

        if(inputId === "" || inputPw === ""){
            alert("아이디와 비밀번호를 입력해주세요");
            return;
        }

        if(inputId === "demo@demo.com" && inputPw === "demotest123"){
            const member = {
                name: "User",
                profile:"./source/image/profile.png"
            };
            sessionStorage.setItem("member", JSON.stringify(member));
            window.location.href = "home.html";
        } 
        else {
            alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    });
};

const handleGoogleLogin = () => {
    document.querySelector(".oauth-login-box .google")?.addEventListener("click", async () => {
        try{
            const userInfo = await googleLogin();
            const member = {
                name: userInfo.displayName,
                profile:userInfo.photoURL
            } 

            sessionStorage.setItem("member", JSON.stringify(member));
            window.location.href = "home.html";
        }
        catch(error){  
            alert("예기치 못한 오류가 발생했습니다. 다시 시도해 주세요.");
            console.log(error);
        }

    })
}

const handleKakaoLogin = () => {
    const redirectUri = window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:5501/login.html" : "https://wzplay.netlify.app/login.html";
    document.querySelector(".oauth-login-box .kakao").addEventListener("click", () => {
        Kakao.Auth.authorize({
            redirectUri: redirectUri
        });
    });

}
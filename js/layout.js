document.addEventListener('DOMContentLoaded', () => {

    mainHeaderAnimation();
    checkLogin();
})


const mainHeaderAnimation = () => {
    const currentPage = window.location.pathname;
    const header = document.querySelector("#mainHeader");
    let postScrollPoint = window.pageYOffset;

    if (currentPage.includes("home.html")) {
        header.classList.add("atHome");

        if (postScrollPoint === 0) {
            header.classList.add("onTop");
        }
    }

    window.addEventListener("scroll", () => {
        const currentScrollPoint = window.pageYOffset;

        if (currentScrollPoint > postScrollPoint) {
            header.classList.add("scrollDown");
            header.classList.remove("scrollUp");
        } 
        else {
            header.classList.add("scrollUp");
            header.classList.remove("scrollDown");
        }

        if (currentPage.includes("home.html")) {
            if (currentScrollPoint === 0) {
                header.classList.add("onTop");
            } 
            else {
                header.classList.remove("onTop");
            }
        }

        postScrollPoint = currentScrollPoint;
  });
};

export const checkLogin = () => {
    const isLogined = sessionStorage.getItem("member");
    const accountBox = document.getElementById("mainHeader").querySelector(".account-box");
    if(!accountBox) return;

    const user = isLogined ? JSON.parse(isLogined) : null;

    if(user){
        accountBox.innerHTML =
        `
            <span class="user-name">${user.name}</span>
            <span class="user-profile">
                <img src="${user.profile}" alt="profile"/>
            </span>
            <div class="account-hover-box">
                <div class="hover-box-upper">
                    <img src="${user.profile}" alt="profile"/>
                    <span>${user.name}</span>
                </div>
                <div class="hover-box-nav">
                    <ul>
                        <li><a href="#">프로필관리</a></li>
                        <li><a href="#">구매내역 관리</a></li>
                        <li><a href="#">관심 콘텐츠 목록</a></li>
                    </ul>
                </div>
                <div class="logout">
                    <span>로그아웃</span>
                </div>
            </div>
        `
    }
    else{
        accountBox.style.justifyContent = "center";
        accountBox.innerHTML = 
        `
        <a href=login.html>로그인</a>
        `
    }

    document.querySelector(".logout")?.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.reload();
    })
}

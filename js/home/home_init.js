import { bindCardClickEvent, bindCardHoverEvent, bindHomeAnimation } from "./home_event.js";
import { initAutoplaySwiper, renderHomeSwiper, renderAutoplaySwiper } from "./home_swiper.js";

export const fetchData = async () => {
    const res = await fetch('./source/data.json');
    const data = await res.json();
    return Object.values(data);
};

document.addEventListener("DOMContentLoaded", async () => {

    //배너 비디오
    bannerVideo();

    //스와이퍼 렌더링 및 초기화
    await renderHomeSwiper();
    await renderAutoplaySwiper();
    initAutoplaySwiper();

    //그리드 렌더링
    await renderExclusiveContentGrid();

    //이벤트 바인딩
    bindCardHoverEvent();
    bindCardClickEvent();
    bindHomeAnimation();
})

const bannerVideo = () => {
    const bannerVideoList = [
        {
            video: "./source/video/ani_11_KimetsuNoYaiba_V.mp4",
            iframe: "https://www.youtube.com/embed/O-IWJk6K8IY?si=JVthpD0pOOobB3lD&autoplay=1&mute=1&controls=0&loop=1&playlist=O-IWJk6K8IY&vq=hd1080&enablejsapi=1",
            detail: "/content-detail.html?query=ani-03"
        },
        {
            video: "./source/video/mov_TheRoundUp_V.mp4",
            iframe: "https://www.youtube.com/embed/pMAPj6WVsT4?si=WhXH-sa3sK3pz0nB&autoplay=1&mute=1&controls=0&loop=1&playlist=pMAPj6WVsT4&vq=hd1080&enablejsapi=1",
            detail: "/content-detail.html?query=mov-08"
        },
        {
            video: "./source/video/mu_Dear_evan_hansen_V.mp4",
            iframe: "https://www.youtube.com/embed/zsspfFI3IH4?autoplay=1&mute=1&controls=0&loop=1&playlist=zsspfFI3IH4&vq=hd1080&enablejsapi=1",
            detail: "/content-detail.html?query=mu-14"
        },
        {
            video: "./source/video/dra10_10_Hotel_Del_Luna_V.mp4",
            iframe: "https://www.youtube.com/embed/wi6kzEHVqRk?si=e85VFXW91iSW_7vT&autoplay=1&mute=1&controls=0&loop=1&playlist=wi6kzEHVqRk&vq=hd1080&enablejsapi=1",
            detail: "/content-detail.html?query=dra-10"
        },
        {
            video: "./source/video/show08_6_My Child's Privacy_V.mp4",
            iframe: "https://www.youtube.com/embed/YdV4hvzNIiQ?si=-KXfSakUq6LfQICl&autoplay=1&mute=1&controls=0&loop=1&playlist=YdV4hvzNIiQ&vq=hd1080&enablejsapi=1",
            detail: "/content-detail.html?query=show-8"
        },
        {
            video: "./source/video/docu_4_The_Whale_and_I_V.mp4",
            iframe: "https://www.youtube.com/embed/AEqe7eyv6aY?si=Hl8mGM9gk6TAnWnz&autoplay=1&mute=1&controls=0&loop=1&playlist=AEqe7eyv6aY&vq=hd1080&enablejsapi=1",
            detail: "/content-detail.html?query=docu-02"
        },
    ]
    const randomBanner = bannerVideoList[Math.floor(Math.random() * bannerVideoList.length)];
    document.getElementById("bannerVideo").src = randomBanner.video;
    document.querySelector(".watch-btn").href = randomBanner.iframe;
    document.querySelector(".more-btn").href = randomBanner.detail;

    
}

const renderExclusiveContentGrid = async () => {
    const gridContainer = document.querySelector(".grid-container");
    const data = await fetchData();
    const randomItems = [...data].sort(() => Math.random() - 0.5);
    const upperContents = randomItems.slice(0,4);
    const lowerContents = randomItems.slice(4,8);

    const gridItem = (item) => 
    `
          <div class="grid-item">
            <a href="/content-detail.html?query=${item.id}"><img src="${item.image_poster}" alt="${item.title}">
                <div class="overlay-text">${item.title}</div>
            </a>
        </div>  
    `

    gridContainer.innerHTML =
    `
        ${upperContents.map(content => gridItem(content)).join("")}


        <div class="logo-wrapper">
            <img src="./source/image/wz_logo.png" alt="logo" class="logo-wz">
            <div class="logo-play">play</div>
        </div>

        ${lowerContents.map(content => gridItem(content)).join("")}
    `
}
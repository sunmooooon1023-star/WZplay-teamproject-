import { checkLogin } from "../layout.js";
import { updateBoard } from "./community_board.js";
import { initDB } from "./community_db.js";
import { bindModalEvent, bindPaginationEvent, bindReelsSortEvent, bindSearchEvent, bindVideoEvent } from "./community_events.js";

export let currentPage = 1;
export let swiper;

document.addEventListener('DOMContentLoaded', async () => {

    //헤더 렌더링
    await renderHeader(); 
    checkLogin();

    //스와이퍼 렌더링
    const response = await fetch("./source/reels.json");
    const reelsList = await response.json();
    const reelsCurrentLike = reelsList.map(reel => {
        const likeCount = Number(localStorage.getItem(`reels-${reel.id}-like-count`)) || reel.like;
        return {...reel, like:likeCount};
    })
    renderReelsSwiper(reelsCurrentLike);   

    const customProgressBar = document.querySelector('.swiper-custom-progressbar');
    swiper.on('progress', (swiper, progress) => {
        const progressWidth = progress * 100;
        customProgressBar.style.width = `${progressWidth}%`;
    });


    //게시판 초기화
    await initDB();
    updateBoard(currentPage);

    //이벤트 바인딩
    bindModalEvent();
    bindPaginationEvent();
    bindSearchEvent();
    bindVideoEvent();
    bindReelsSortEvent();
});

const renderHeader = async () => {
    const mainHeader = document.getElementById("mainHeader");
    
    const res = await fetch("layout.html");
    const htmlText = await res.text(); 

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html"); 
    const header = doc.getElementById("mainHeader").innerHTML; 
    
    mainHeader.innerHTML = header;
};


const popularCheckbox = document.getElementById('popularCheck');
const popularCheckLabel = document.querySelector('.reels-sort-btn label');

popularCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        popularCheckLabel.classList.add("checked");
    } else {
        popularCheckLabel.classList.remove("checked");
    }
});

export const renderReelsSwiper = (reelsList) => {
    swiper = new Swiper(".reels-swiper", {
        slidesPerView: "4",
        spaceBetween: 30,
        freeMode: {
            enabled: true,
            momentumRatio: 0.3, 
            momentumVelocityRatio: 0.3 
        },
        scrollbar: {
            el: ".swiper-scrollbar",
            draggable: true,
            dragSize: 50
        },
    });
    swiper.removeAllSlides();

    reelsList.forEach(reel => {
        const tagList = reel.tag.slice(0,3).map(tag => `#${tag}`).join(' ');
        const swiperSlide = document.createElement("div");

        swiperSlide.className = "swiper-slide";
        swiperSlide.id = reel.id;

        swiperSlide.innerHTML = `
            <video class="reels-thumbnail" muted src="${reel.video}" type="video/mp4"></video>
            <div class="reels-info-summary">
                <div class="info-left">
                    <span class="user-name">${reel.creator}</span>
                    <p>${reel.title}</p>
                    <div>${tagList}</div>          
                </div>
                <div class="info-right">
                    <div class="like-info">
                        <button class="reels-like"><span class="ico"></span></button>
                        <span class="reels-like-count">${reel.like}</span>             
                    </div>
                    <div class="share-info">
                        <button class="reels-share"><span class="ico"></span></button>
                        <span class="reels-share-count">${reel.share}</span>  
                    </div>
                    <img src="./source/image/profile.png">
                </div>
            </div>
        `;

        swiper.appendSlide(swiperSlide); 
    });

    swiper.update();
}

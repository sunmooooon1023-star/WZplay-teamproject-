import { checkLogin } from "../layout.js";

export const fetchData = async () => {
    const res = await fetch("./source/data.json");
    const data = await res.json();
    return Object.values(data);
}

document.addEventListener("DOMContentLoaded", async () => {
    const category = window.location.search.slice(1);
    const pageTitle = document.querySelector("title");
    switch (category) {
        case "animation":
            pageTitle.textContent = "애니메이션 | WZ"
            break;
        case "movie":
            pageTitle.textContent = "영화 | WZ"
            break;
        case "documentary":
            pageTitle.textContent = "다큐멘터리 | WZ"
            break;
        case "varietyShow":
            pageTitle.textContent = "예능 | WZ"
            break;
        case "drama":
            pageTitle.textContent = "드라마 | WZ"
            break;
        case "musical":
            pageTitle.textContent = "뮤지컬 | WZ"
            break;
        default:
            break;
    }
    
    //헤더 렌더링
    const renderHeader = async () => {
        const mainHeader = document.getElementById("mainHeader");

        const res = await fetch("layout.html");
        const htmlText = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const header = doc.getElementById("mainHeader").innerHTML;

        mainHeader.innerHTML = header;
    };
    await renderHeader();
    checkLogin();


    //타겟 컨텐츠 데이터 전달
    const setContentsData = async () => {
        const contentData = await fetchData();
        const category = window.location.search.slice(1);

        const mainText = [
            {
                category: "animation",
                title: "애니메이션",
                desc: "따뜻한 감성과 무한한 상상력이 어우러진, 애니메이션의 세계로 초대합니다."
            },
            {
                category: "movie",
                title: "영화",
                desc: "따뜻한 감성과 깊은 이야기가 어우러진, 영화의 세계로 초대합니다."
            },
            {
                category: "documentary",
                title: "다큐멘터리",
                desc: "진실과 깊은 통찰이 담긴, 다큐멘터리의 세계로 초대합니다."
            },
            {
                category: "varietyShow",
                title: "예능",
                desc: "즐거움과 웃음이 넘치는, 예능의 세계로 초대합니다."
            },
            {
                category: "drama",
                title: "드라마",
                desc: "가슴을 울리는 감동과 진한 여운이 가득한, 드라마의 세계로 초대합니다."
            },
            {
                category: "musical",
                title: "뮤지컬",
                desc: "감미로운 선율과 눈부신 무대가 펼쳐지는, 뮤지컬의 세계로 초대합니다."
            }
        ];



        // 화면에 렌더링 함수

        let filteredData;

        function renderContent() {

            const title = document.querySelector('.category-detail-main-visual-title');
            const desc = document.querySelector('.category-detail-main-visual-text');
            const main = document.querySelector('.category-detail-main-visual');

            const textFind = mainText.find(item => item.category === category);

            if (textFind && filteredData.length > 0) {
                title.innerHTML = textFind.title;
                desc.innerHTML = textFind.desc;


                main.style.background = `
                linear-gradient(to bottom, rgba(0, 0, 0, 0.3), #21252B 99%),
                url(${filteredData[0].image_default})`;
                main.style.backgroundRepeat = 'no-repeat';
                main.style.backgroundPosition = 'center';
                main.style.backgroundSize = 'cover';
            }

        }

        function renderRank() {
            const swiperRank = document.querySelector('.swiper-wrapper');
            swiperRank.innerHTML = "";

            for (let i = 0; i < 8 && i < filteredData.length; i++) {
                const item = filteredData[i];
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');

                slide.innerHTML = `
            <a href="content-detail.html?query=${item.id}">
            <span>${i + 1}</span>
                <img src="${item.image_poster}" alt="${item.title}">
            </a>
            
        `;
                swiperRank.appendChild(slide);
            }

            new Swiper('.reels-swiper', {
                slidesPerView: 4,
                slidesPerGroup: 4,
                loop: false,
                allowTouchMove: false,
                navigation: {
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next'
                }
            });
        }

        function renderRecommend() {
            const recommendImg01 = document.querySelector('.recommendImg01');
            const recommendImg02 = document.querySelector('.recommendImg02');
            recommendImg01.innerHTML = '';

            for (let i = 0; i < 16 && i < filteredData.length; i++) {
                const item = filteredData[i];
                const recommendImg = ` <a href="content-detail.html?query=${item.id}">
                <img src="${item.image_default}" alt="${item.title}">
                <span>${item.title}</span>
                </a> `;

                if (i > 7) {
                    recommendImg01.innerHTML += recommendImg;
                } else {
                    recommendImg02.innerHTML += recommendImg;
                }
            }

            document.querySelector('.recommend01 > .button > img').addEventListener('click', function () {
                const recommendImg01 = document.querySelector('.recommendImg01');
                const slideHeight01 = window.getComputedStyle(recommendImg01).height;

                if (slideHeight01 === "240px") {
                    recommendImg01.style.height = "480px";
                    this.style.transform = "rotate(180deg)";
                    document.querySelector('.category-detail-content-box-recommend').scrollIntoView({behavior: "smooth", block: "end"});
                return;
                } else {
                    recommendImg01.style.height = "240px";
                    this.style.transform = "rotate(0deg)";
                }
                
                

            })

            
            document.querySelector('.recommend02 > .button > img').addEventListener('click', function () {
                const recommendImg02 = document.querySelector('.recommendImg02');
                const slideHeight02 = window.getComputedStyle(recommendImg02).height;

                if (slideHeight02 === "240px") {
                    recommendImg02.style.height = "480px";
                    this.style.transform = "rotate(180deg)";
                    document.querySelector('.recommend02').scrollIntoView({behavior: "smooth"});
                } else {
                    recommendImg02.style.height = "240px";
                    this.style.transform = "rotate(0deg)";
                }
                
                return;
            })

        }



        switch (category) {
            case "animation":
                filteredData = contentData.filter(content => content.category === category);
                renderContent();
                renderRank();
                renderRecommend();
                break;
            case "movie":
                filteredData = contentData.filter(content => content.category === category);
                renderContent();
                renderRank();
                renderRecommend();
                break;
            case "documentary":
                filteredData = contentData.filter(content => content.category === category);
                renderContent();
                renderRank();
                renderRecommend();
                break;
            case "varietyShow":
                filteredData = contentData.filter(content => content.category === category);
                renderContent();
                renderRank();
                renderRecommend();
                break;
            case "drama":
                filteredData = contentData.filter(content => content.category === category);
                renderContent();
                renderRank();
                renderRecommend();
                break;
            case "musical":
                filteredData = contentData.filter(content => content.category === category);
                renderContent();
                renderRank();
                renderRecommend();
                break;
            default:
                break;
        }
    };

    await setContentsData();


})



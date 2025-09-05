import { initPlayer } from "./home_iframe_player.js";
import { fetchData } from "./home_init.js";

export const hoverModal = async (data, id, card) => {
    const hoveredContent = data.find(item => item.id === id);
    if(!hoveredContent) {
        hoverModalWrapper.classList.remove("active");
        return;
    };
    const hoverModalWrapper = document.getElementById("homeHoverModalWrapper");
    hoverModalWrapper.innerHTML = '';

    try{
        const response = await fetch("home_modals.html");
        const htmlText = await response.text();
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(htmlText, "text/html");
        const modalElement = parsedHTML.getElementById("homeHoverModal")?.cloneNode(true);

        if (modalElement) {
            const iframe = modalElement.querySelector("#hoverModalIframe");
            iframe.src = hoveredContent.video;
            modalElement.querySelector(".title-row h3").textContent = hoveredContent.title;
            modalElement.querySelector(".content-rating .rating").textContent = hoveredContent.rating;
            modalElement.querySelector(".content-rating p").textContent = `에피소드 ${hoveredContent.episode}개`

            const tagList = hoveredContent.tag.slice(0,3).map(tag => {
                return `<li class="tag"><span><span class="hash">#</span>${tag}</span></li>`
            }).join("");
            modalElement.querySelector(".hover-modal-tags").innerHTML = tagList;

            switch(hoveredContent.rating){
                case "ALL":
                    modalElement.querySelector(".rating").style.backgroundColor = "#1CA40C";
                    break;
                case "12+":
                    modalElement.querySelector(".rating").style.backgroundColor = "#E5B200";
                    break;
                case "15+":
                    modalElement.querySelector(".rating").style.backgroundColor = "#DD8100";
                    break;
                case "18+":
                    modalElement.querySelector(".rating").style.backgroundColor = "#D60000";
                    break;
            }

            //getBoundingClientRect : DOM 요소의 화면상 크기와 위치 반환
            const cardPosition = card.getBoundingClientRect(); 
            const modalPosition = modalElement.getBoundingClientRect();

            //카드의 중앙 좌표
            const cardCenterX = cardPosition.left + cardPosition.width / 2;
            const cardCenterY = cardPosition.top + cardPosition.height / 2;

            //모달의 중앙을 카드 중앙에 맞추기
            modalElement.style.left = `${cardCenterX - modalPosition.width / 2}px`;
            modalElement.style.top = `${cardCenterY - modalPosition.height / 2}px`;

            hoverModalWrapper.append(modalElement);
            gsap.fromTo(modalElement, { opacity:0 }, { opacity:1, duration:0.3 });
            hoverModalWrapper.classList.add("active");

            const videoURL = hoveredContent.video;
            const videoId = videoURL.split('/embed/')[1].split('?')[0];

            initPlayer(iframe, modalElement, videoId);
            
            modalElement.querySelector(".inner-plus button").addEventListener("click", async () => {
                await detailModal(hoveredContent);
                hoverModalWrapper.classList.remove("active");
            })
            
            const removeModalOnScroll = () => {
                hoverModalWrapper.classList.remove("active");
                window.removeEventListener("scroll", removeModalOnScroll);
            }
            window.addEventListener("scroll", removeModalOnScroll);
        }
    }
    catch(error){
        console.error(error)
    }

}

const detailModal = async (content) => {
    if(!content){
        detailModalWrapper.classList.remove("active");
        document.documentElement.classList.remove("modal-active");
        return;
    }
    const detailModalWrapper = document.getElementById("homeDetailModalWrapper");
    detailModalWrapper.innerHTML = '';

    try{
        const response = await fetch("home_modals.html");
        const htmlText = await response.text();
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(htmlText, "text/html");
        const modalElement = parsedHTML.getElementById("homeDetailModal")?.cloneNode(true);

        if (modalElement) {
            const tagList = content.tag.map(tag => {
                return `<li class="tag"><span>${tag}</span></li>`
            }).join("");
            const iframe = modalElement.querySelector("#detailModalIframe");
            const data = await fetchData();

            iframe.src = content.video;
            modalElement.querySelector(".detail-modal-content .title-box h2").textContent = content.title;
            modalElement.querySelector(".content-info .rating").textContent = content.rating;
            modalElement.querySelector(".content-info .episode").textContent = `에피소드 ${content.episode}개`;
            modalElement.querySelector(".content-info .director").textContent = `감독 : ${content.director}`;
            modalElement.querySelector(".detail-modal-tags").innerHTML = tagList;
            modalElement.querySelector(".content-summary").textContent = content.summary;

            if(content.cast){
                const castList = content.cast.join(", ");
                modalElement.querySelector(".content-info .cast").textContent = `출연 : ${castList}`;
            }

            modalElement.querySelector(".detail-modal-more-info").innerHTML =
            `
            <a href="/content-detail.html?query=${content.id}">
                <span>상세정보 보러 가기</span>
                <img src="./source/image/ico/ico_right_arrow.png" alt="바로가기">
            </a>
            `
            const randomDefaultContent = [...data]
            .filter(data => data.category === content.category && data.id !== content.id)
            .sort(() => Math.random() - 0.5).slice(0, 6);
            const contentBoxItems = randomDefaultContent.map(item => {
                const innerTagList = item.tag.slice(0,3).map(tag => {
                    return `<li class="box-detail-tags-tag"><span><span class=hash>#</span>${tag}</span></li>`
                }).join("");

                return `                
                <div class="box">
                    <a href="/content-detail.html?query=${item.id}">
                        <div class="box-inner-img-box">
                            <img src="${item.image_default}" alt="${item.title}" />
                        </div>
                        <div class="box-inner-contain">
                            <h4>${item.title}</h4>
                            <ul class="box-detail-tags">
                                ${innerTagList}
                            </ul>
                            <p>
                                ${item.summary}
                            </p>
                        </div>
                    </a>
                </div>
                `;
            })
            modalElement.querySelector(".contentBox-grid").innerHTML = contentBoxItems.join("");




            switch(content.rating){
                case "ALL":
                    modalElement.querySelector(".rating").style.backgroundColor = "#1CA40C";
                    break;
                case "12+":
                    modalElement.querySelector(".rating").style.backgroundColor = "#E5B200";
                    break;
                case "15+":
                    modalElement.querySelector(".rating").style.backgroundColor = "#DD8100";
                    break;
                case "18+":
                    modalElement.querySelector(".rating").style.backgroundColor = "#D60000";
                    break;
            }


            detailModalWrapper.append(modalElement);
            detailModalWrapper.classList.add("active");
            document.documentElement.classList.add("modal-active");

            gsap.fromTo(modalElement, { y:"100%", opacity:0 }, { y:0, opacity:1, duration:0.5 });

            modalElement.querySelector(".close-button").addEventListener("click", () => {
                gsap.to(modalElement, { y:"100%", opacity:0, duration:0.3, 
                    onComplete: () => {
                        detailModalWrapper.classList.remove("active");
                        document.documentElement.classList.remove("modal-active");
                        modalWrapper.innerHTML = '';
                    } 
                });
            })

            const videoURL = content.video;
            const videoId = videoURL.split('/embed/')[1].split('?')[0];

            initPlayer(iframe, modalElement, videoId);
            
            // modalElement.querySelector(".inner-plus button").addEventListener("click", async () => {
            //     detailModalWrapper.classList.remove("active");
            // })
        }

    }catch(err){
        console.error(err);
    }
}
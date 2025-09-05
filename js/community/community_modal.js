import { writingPost } from "./community_board_writingPost.js";
import { detailPost } from "./community_board_detailPost.js";
import { reelsDetail } from "./community_reels.js";

export const handleModal = async (modalWrapperId, modalContentId, options = {}) => {
    const data = options.post || options.reels;
    const modalWrapper = document.getElementById(modalWrapperId);
    if (!modalWrapper) return;
    modalWrapper.innerHTML = '';

    try {
        const response = await fetch('community_modals.html');
        const htmlText = await response.text();
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(htmlText, "text/html");
        const modalElement = parsedHTML.getElementById(modalContentId)?.cloneNode(true);

        gsap.fromTo(modalElement, { y:"100%", opacity:0 }, { y:0, opacity:1, duration:0.5 });

        const closeModal = () => {
            gsap.to(modalElement, { y:"100%", opacity:0, duration:0.3, 
                onComplete: () => {
                    modalWrapper.classList.remove("active");
                    document.documentElement.classList.remove("modal-active");
                    modalWrapper.innerHTML = '';
                } 
            });
        };

        if (modalElement) {
            modalWrapper.appendChild(modalElement);
            modalWrapper.classList.add("active");
            document.documentElement.classList.add("modal-active");

            if (modalContentId === "postWriteModal") writingPost(modalElement, modalWrapper, options, closeModal);
            if (modalContentId === "postDetailModal") detailPost(modalElement, data, closeModal);
            if (modalContentId === "reelsDetailModal") reelsDetail(modalElement, data);

            const closeBtn = modalElement.querySelector(".close-btn");
            if (closeBtn) closeBtn.addEventListener("click", closeModal);
        }
    } catch (error) {
        console.error(error);
    }
};
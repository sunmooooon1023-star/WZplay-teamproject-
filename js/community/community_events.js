import { handleModal } from "./community_modal.js";
import { filteredPosts, searchPost, updateBoard } from "./community_board.js";
import { updatePost, getPost } from "./community_db.js";
import { currentPage, renderReelsSwiper } from "./community_init.js";

//검색 이벤트
export const bindSearchEvent = () => {
    const searchConditionSelector = document.querySelector(".search-condition-selector");
    const searchConditionList = document.querySelector(".search-condition-list");
    const searchCondition = document.querySelectorAll(".search-condition");

    searchConditionSelector.addEventListener("click", () => {
        searchConditionSelector.classList.toggle("active");
        searchConditionList.classList.toggle("active");
    })

    searchCondition.forEach(each => {
        each.addEventListener("click", () => {
            searchConditionSelector.querySelector(".search-condition-display").textContent = each.textContent;
            searchConditionSelector.classList.remove("active");
            searchConditionList.classList.remove("active");
        })
    })

    document.addEventListener("click", (e) => {
        if(!searchConditionSelector.contains(e.target) && !searchConditionList.contains(e.target)){
            searchConditionSelector.classList.remove("active");
            searchConditionList.classList.remove("active");
        }
    })

    document.querySelector(".board-search-btn").addEventListener("click", async () => {
        await searchPost();
    })
}

//페이지네이션 이벤트
export const bindPaginationEvent = () => {
    document.querySelector(".prev-btn").addEventListener("click", () => {
        currentPage--;
        updateBoard(currentPage);
    });
    document.querySelector(".next-btn").addEventListener("click", () => {
        currentPage++;
        updateBoard(currentPage);
    });
}

//모달관련 이벤트
export const bindModalEvent = () => {
    document.body.addEventListener("click", async (e) => {
        const targetedReelCard = e.target.closest(".reels-swiper .swiper-slide");
        if(!targetedReelCard) return;

        const response = await fetch("./source/reels.json");
        const reels = await response.json();

        const reelId = Number(targetedReelCard.id);
        const targetedReel = reels.find(reel => reel.id === reelId);
        if(!targetedReel) return;

        handleModal("reelsDetailModalWrapper", "reelsDetailModal", { reels: targetedReel });
    });
    document.querySelector(".reels-btn")?.addEventListener("click", () => {
        handleModal("blockModalWrapper", "blockModal");
    });
    document.querySelector(".write-btn")?.addEventListener("click", () => {
        const isLogined = sessionStorage.getItem("member");
        if(!isLogined){
            alert("로그인 후 이용해주세요.");
            window.location.href = "login.html";
        }
        handleModal("postWriteModalWrapper", "postWriteModal");
    });
    document.body.addEventListener("click", async(e) => {
        const targetedCard = e.target.closest(".post-card, .board-best-item");
        if(!targetedCard) return;

        const getPostId = targetedCard.getAttribute("id");
        const postNumber = Number(getPostId.split("-")[1]);
        const targetedPost = await getPost(postNumber);

        targetedPost.views++;
        await updatePost(targetedPost);
        const card = document.getElementById(`post-${targetedPost.id}`);

        if(card){
            card.querySelectorAll(".views").forEach(each => {
                each.textContent = `조회 ${targetedPost.views}`;
            })
        }
        await updateBoard(currentPage, filteredPosts);
        handleModal("postDetailModalWrapper", "postDetailModal", {post:targetedPost});
    })
}

//동영상 이벤트
export const bindVideoEvent = () => {
    const reels = document.querySelectorAll(".swiper-slide video");
    reels.forEach(each => {
        each.addEventListener("mouseenter", () => {
            each.play();
        })
        each.addEventListener("mouseleave", () => {
            each.pause();
            each.currentTime = 0;
        })
    })
}

//정렬 이벤트
export const bindReelsSortEvent = async () => {
    const checkSort = document.querySelector("#popularCheck");
    const response = await fetch("../source/reels.json");
    const data = await response.json();

    const reelsCurrentLike = () => {
        return data.map(reel => {
            const likeCount = Number(localStorage.getItem(`reels-${reel.id}-like-count`)) || reel.like;
            return {...reel, like:likeCount};
        })
    }
    
    checkSort.addEventListener("change", () => {
        if(checkSort.checked){
            const sortedReelsList = [...reelsCurrentLike()].sort((a, b) => b.like - a.like);
            renderReelsSwiper(sortedReelsList);
        }
        else{
            renderReelsSwiper(reelsCurrentLike())
        }
    })
}
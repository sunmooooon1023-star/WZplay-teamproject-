import { getAllPosts } from "./community_db.js";

let posts = [];
let bestPosts = [];
const postsPerPage = 12;
const maxPaginationPerPage = 10;

const renderPosts = (displayPosts) => {
    const boardGrid = document.querySelector(".board-grid");
    boardGrid.innerHTML = '';

    if (displayPosts.length === 0) {
        boardGrid.innerHTML = 
        `
        <div class="no-data">
             <p>게시물이 없습니다.</p>   
        </div>
        `;
        return;
    }

    displayPosts.forEach(post => {
        const card = document.createElement("div");
        const tagList = post.tag.slice(0, 3).map(tag => `<span class="tag"><span class="hash">#</span>${tag}</span>`).join(" ");

        card.className = "post-card";
        card.id = `post-${post.id}`;
        card.innerHTML = `
        <div class="post-thumbnail">
            <span class="category-tab">${post.category}</span>
            <img src="${post.thumbnail}" alt="썸네일">
        </div>
        <div class="post-info">
            <div class="tag-list">${tagList}</div>
            <p class="post-title">${post.title}</p>
            <div class="post-additional-util">
                <span class="ico like-count">${post.like}</span>
                <span class="ico comment-count">${post.comment}</span>
            </div>
            <div class="post-info-detail">
                <span>${post.author}</span>|
                <span class="views">조회 ${post.views}</span>|
                <span>날짜 ${post.date}</span>
            </div>
        </div>`;
        boardGrid.append(card);
    });
};

const renderPagination = (totalPages, currentPage) => {
    if(!totalPages || !currentPage) return;

    const startPageNum = Math.floor((currentPage - 1) / maxPaginationPerPage) * maxPaginationPerPage + 1;
    const endPageNum = Math.min(startPageNum + maxPaginationPerPage - 1, totalPages);

    const paginationList = document.querySelector(".pagination-list");
    paginationList.innerHTML = '';

    for (let i = startPageNum; i <= endPageNum; i++) {
        const page = document.createElement("li");
        page.className = "page";

        const paginationBtn = document.createElement("button");
        if (currentPage === i) {
            paginationBtn.style.fontWeight = "bold";
            paginationBtn.style.opacity = 1;
        }
        paginationBtn.innerHTML = `<span>${i}</span>`;
        paginationBtn.addEventListener("click", () => {
            updateBoard(i);
        });

        page.append(paginationBtn);
        paginationList.append(page);
    }
};

const renderBestPosts = (bestPosts) => {
    const medals = ["gold", "silver", "bronze"];

    const bestList = document.querySelector(".board-best-list");
    bestList.innerHTML = '';

    bestPosts.forEach((post, index) => {
        const bestItem = document.createElement("li");
        const medal = medals[index] || "gold";
        const tagList = post.tag.slice(0, 3).map(tag => `<span class="tag"><span class="hash">#</span>${tag}</span>`).join(" ");
        
        bestItem.className = "board-best-item";
        bestItem.id =`post-${post.id}`;
        bestItem.innerHTML = `
        <div class="best-medal ${medal}"><span class="ico"></span></div>
        <div class="best-post">
            <div class="best-user-profile">
                <img src="${post.profile}" alt="프로필사진">
                <span>${post.author}</span>
            </div>
            <div class="best-post-summary">
                <p class="best-title">${post.title}</p>
                <p class="best-content">${post.summary}</p>
            </div>
            <div class="best-additional-util">
                <div class="best-like">
                    <span class="ico"></span>
                    <span class="like-count">${post.like}</span>
                </div>
                <div class="best-comment">
                    <span class="ico"></span>
                    <span class="comment-count">${post.comment}</span>
                </div>
                <div class="tag-list">${tagList}</div>
            </div>
        </div>
        <div class="best-thumbnail">
            <img src="${post.thumbnail}" alt="프로필사진">
        </div>`;
        bestList.append(bestItem);
    });
};

export let filteredPosts = null;

export const searchPost = async () => {
    const searchInput = document.querySelector("#boardSearchInput").value;
    const searchCondition = document.querySelector(".search-condition-display").textContent;
    const posts = await getAllPosts();
    filteredPosts = posts;

    if(searchInput){
        if(searchCondition === "제목"){
            filteredPosts = posts.filter(post => post.title.includes(searchInput));
        }
        else if(searchCondition === "본문"){
            filteredPosts = posts.filter(post => post.content.includes(searchInput));
        }
        else if(searchCondition === "글쓴이"){
            filteredPosts = posts.filter(post => post.author === searchInput);
        }
    }

    updateBoard(1, filteredPosts);
}

export const updateBoard = async (currentPage, filteredPosts) => {
    if(!currentPage) return;
    const originPosts = await getAllPosts();
    posts = filteredPosts ? filteredPosts : originPosts;
    bestPosts = [...originPosts].sort((a, b) => b.like - a.like).slice(0, 3);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startPostNum = (currentPage - 1) * postsPerPage;
    const endPostNum = startPostNum + postsPerPage;
    const displayPosts = posts.slice(startPostNum, endPostNum);


    renderPosts(displayPosts);
    renderPagination(totalPages, currentPage);
    renderBestPosts(bestPosts);

    document.querySelector(".prev-btn").disabled = currentPage === 1;
    document.querySelector(".next-btn").disabled = currentPage === totalPages;
};

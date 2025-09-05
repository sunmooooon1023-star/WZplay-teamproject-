import { postComment, renderComments } from "./community_board_comment.js";

export const reelsDetail = (modalElement, reels) => {
    const leftSection = modalElement.querySelector(".reels-form-left");
    const rightSection = modalElement.querySelector(".reels-form-right");
    const tagList = reels.tag.map(tag => `<li class="tag"><span><span class="hash">#</span>${tag}</span></li>`).join("");
    const comments = JSON.parse(localStorage.getItem(`comment-${reels.id}`)) || [];

    let reelsLike = Number(localStorage.getItem(`reels-${reels.id}-like-count`)) || reels.like;
    let reelsShare = Number(localStorage.getItem(`reels-${reels.id}-share-count`)) || reels.share;

    leftSection.innerHTML = 
    `
        <div class="video-container">
            <video src=${reels.video} loop autoplay controls type="video/mp4">
        </div>
    `

    rightSection.querySelector(".reels-form-content").innerHTML = 
    `
        <div class="user-info">
            <img src="./source/image/profile.png">
            <span>user</span>
        </div>
        <div class="reels-content-text">
            ${reels.context}
        </div>
        <ul class="tag-list">
            ${tagList}
        </ul>
        <div class="reels-form-util">
            <div class="reels-form-util-box">
                <button class="reels-form-like"><span class="ico"></span></button>
                <span class="reels-like-count">${reelsLike}</span>
            </div>
            <div class="reels-form-util-box">
                <button class="reels-form-share"><span class="ico"></span></button>
                <span class="reels-share-count">${reelsShare}</span>
            </div>
        </div>
    `
    modalElement.querySelector(".comment-count").textContent = comments.length;

    const commentList = modalElement.querySelector(".comment-list");
    commentList.innerHTML = '';

    const getComments = JSON.parse(localStorage.getItem(`comment-${reels.id}`)) || [];
    getComments.forEach(comment => renderComments(comment, commentList, reels));

    //댓글 입력
    const commentForm = modalElement.querySelector(".comment-input-form");
    const commentInput = modalElement.querySelector("#commentInput");
    commentForm.addEventListener("submit", e => {
        e.preventDefault();
        const text = commentInput.value.trim();
        if (!text) return;
        postComment(text, modalElement, reels, "reels");
        commentInput.value = "";
    });

    reelsUtil(modalElement, reels, "like", reelsLike);
    reelsUtil(modalElement, reels, "share", reelsShare);
}

const reelsUtil = (modalElement, reels, type, value) => {
    const btn = modalElement.querySelector(`.reels-form-${type}`);
    const reelsModalCount = modalElement.querySelector(`.reels-${type}-count`);
    const reelsCardCount = document.getElementById(`${reels.id}`).querySelector(`.reels-${type}-count`);

    btn.onclick = () => {
        value++;
        reelsModalCount.textContent = value;
        reelsCardCount.textContent = value;
        localStorage.setItem(`reels-${reels.id}-${type}-count`, value);
    }
}

export const sortReels = () => {

}
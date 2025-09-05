import { updatePost } from "./community_db.js";
import { filteredPosts, updateBoard } from "./community_board.js";
import { currentPage } from "./community_init.js";

export const postComment = async (text, modalElement, target, type) => {
    const commentList = modalElement.querySelector(".comment-list");
    const date = new Date();
    const formattedTime = new Intl.DateTimeFormat('ko-KR', { 
        hour:'2-digit', minute:'2-digit', hour12:false 
    }).format(date);

    const comment = { 
        text, 
        time: formattedTime, 
        like:0, 
        dislike:0 
    };
    const comments = JSON.parse(localStorage.getItem(`comment-${target.id}`)) || [];
    comments.push(comment);
    localStorage.setItem(`comment-${target.id}`, JSON.stringify(comments));

    renderComments(comment, commentList, target);

    target.comment++;
    if(type === "post"){
        await updatePost(target);
        modalElement.querySelectorAll(".comment-count").forEach(each => each.textContent = target.comment);

        const card = document.getElementById(`post-${target.id}`);
        if(card) {
            card.querySelectorAll(".comment-count").forEach(each => each.textContent = target.comment)
        };
        await updateBoard(currentPage, filteredPosts);
    }
    if(type === "reels"){
        modalElement.querySelector(".comment-count").textContent = comments.length;
    }

};

export const renderComments = (comment, commentList, target) => {
    const isLogined = sessionStorage.getItem("member");
    if(!isLogined){
        alert("로그인 후 이용해주세요.");
        window.location.href = "login.html";
    }
    const user = JSON.parse(sessionStorage.getItem("member"));
    const commentItem = document.createElement("li");
    commentItem.className = "comment";
    commentItem.innerHTML = 
    `
        <div class="comment-content">
            <div class="comment-content-upper">
                <div class="comment-user-profile">
                    <img src="${user.profile}" alt="프로필 사진">
                    <span>${user.name}</span>
                </div>
                <span>|</span>
                <span>${comment.time}</span>
            </div>
            <div class="comment-cotent-lower">
                <p>${comment.text}</p>
            </div>
        </div>
        <div class="comment-util">
            <button class="comment-like-btn"><span>${comment.like}</span></button>
            <button class="comment-dislike-btn"><span>${comment.dislike}</span></button>
        </div>
    `;
    commentList.append(commentItem);

    commentItem.querySelector(".comment-like-btn").addEventListener("click", () => {
        comment.like++;

        commentItem.querySelector(".comment-like-btn span").textContent = comment.like;

        const comments = JSON.parse(localStorage.getItem(`comment-${target.id}`)) || [];
        const idx = comments.findIndex(c => c.time===comment.time && c.text===comment.text);
        comments[idx].like = comment.like;

        localStorage.setItem(`comment-${target.id}`, JSON.stringify(comments));
    });

    commentItem.querySelector(".comment-dislike-btn").addEventListener("click", () => {
        comment.dislike++;

        commentItem.querySelector(".comment-dislike-btn span").textContent = comment.dislike;

        const comments = JSON.parse(localStorage.getItem(`comment-${target.id}`)) || [];
        const idx = comments.findIndex(c => c.time===comment.time && c.text===comment.text);
        comments[idx].dislike = comment.dislike;

        localStorage.setItem(`comment-${target.id}`, JSON.stringify(comments));
    });
};
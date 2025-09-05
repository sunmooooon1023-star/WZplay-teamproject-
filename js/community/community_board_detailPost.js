import { updatePost, deletePost } from "./community_db.js";
import { filteredPosts, updateBoard } from "./community_board.js";
import { handleModal } from "./community_modal.js";
import { postComment, renderComments } from "./community_board_comment.js";
import { currentPage } from "./community_init.js";

export const detailPost = (modalElement, post, closeModal) => {
    modalElement.querySelector(".post-category").textContent = post.category;
    modalElement.querySelector(".detail-title-area .modal-area-title").textContent = post.title;

    const infoBox = modalElement.querySelector(".content-info-box");
    const content = modalElement.querySelector(".content-main-box");
    const reactionBtns = modalElement.querySelector(".reaction-btn-list");
    const commentCount = modalElement.querySelector(".comment-input-form .comment-count");

    const tagList = post.tag.map(tag => `<li class="tag"><span><span class="hash">#</span>${tag}</span></li>`).join("");

    infoBox.innerHTML = `
        <div class="user-profile">
            <img src="${post.profile}" alt="profile">
            <span>${post.author}</span>
        </div>
        <span>|</span>
        <span>${post.date}</span>
        <span>|</span>
        <span class="comment-count">${post.comment}</span>
        <span class="like-count">${post.like}</span>
        <span>|</span>
        <span>조회 ${post.views}</span>
    `;
    content.innerHTML = `
        <ul class="tag-list">${tagList}</ul>
        <div class="content">${post.content}</div>
    `;
    reactionBtns.innerHTML = `
        <button class="like-btn"><span>${post.like}</span></button>
        <button class="dislike-btn"><span>${post.dislike}</span></button>
    `;
    commentCount.textContent = post.comment;

    //댓글 렌더링
    const commentList = modalElement.querySelector(".comment-list");
    commentList.innerHTML = '';

    const getComments = JSON.parse(localStorage.getItem(`comment-${post.id}`)) || [];
    getComments.forEach(comment => renderComments(comment, commentList, post));

    //댓글 입력
    const commentForm = modalElement.querySelector(".comment-input-form");
    const commentInput = modalElement.querySelector("#commentInput");
    commentForm.addEventListener("submit", e => {
        e.preventDefault();
        const text = commentInput.value.trim();
        if (!text) return;
        postComment(text, modalElement, post, "post");
        commentInput.value = "";
    });

    //좋아요 싫어요
    //const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    //const dislikedPosts = JSON.parse(localStorage.getItem("dislikedPosts")) || [];

    const likeBtn = reactionBtns.querySelector(".like-btn");
    const dislikeBtn = reactionBtns.querySelector(".dislike-btn");

    likeBtn.addEventListener("click", async () => {
        // if (likedPosts.includes(post.id)) { 
        //     alert("이미 좋아요를 누르셨습니다."); 
        //     return; 
        // }
        post.like++;
        await updatePost(post);

        //likedPosts.push(post.id);
        //localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

        modalElement.querySelector(".like-count").textContent = post.like;
        likeBtn.querySelector("span").textContent = post.like;
        await updateBoard(currentPage, filteredPosts);

    });

    dislikeBtn.addEventListener("click", async () => {
        // if (dislikedPosts.includes(post.id)) { 
        //     alert("이미 싫어요를 누르셨습니다."); 
        //     return; 
        // }
        post.dislike++;
        await updatePost(post);

        //dislikedPosts.push(post.id);
        //localStorage.setItem("dislikedPosts", JSON.stringify(dislikedPosts));

        dislikeBtn.querySelector("span").textContent = post.dislike;
    });

    modalElement.querySelector(".write-btn")?.addEventListener("click", () => {
        closeModal();
        handleModal("postWriteModalWrapper", "postWriteModal");
    })
    modalElement.querySelector(".update-btn")?.addEventListener("click", () => {
        closeModal();
        handleModal("postWriteModalWrapper", "postWriteModal", { mode:"update", post });
    });
    modalElement.querySelector(".delete-btn")?.addEventListener("click", async () => {
        const isConfirmed = confirm("게시글을 삭제하시겠습니까?")
        if (!isConfirmed) return;

        await deletePost(post.id);
        await updateBoard(currentPage, filteredPosts);

        alert("게시글이 삭제되었습니다.");
        closeModal();
    });
};
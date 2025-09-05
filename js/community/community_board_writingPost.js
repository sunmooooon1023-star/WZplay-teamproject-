import { addPost, updatePost, getPost } from "./community_db.js";
import { filteredPosts, updateBoard } from "./community_board.js";
import { handleModal } from "./community_modal.js";
import { currentPage } from "./community_init.js";

export const writingPost = (modalElement, modalWrapper, options, closeModal) => {
    const quill = new Quill(modalElement.querySelector('#editor'), {
        modules: { toolbar: modalElement.querySelector('#toolbar') },
        theme: 'snow'
    });

    if (options.mode === "update" && options.post) {
        modalElement.querySelector("#title").value = options.post.title;
        modalElement.querySelector("#tag").value = options.post.tag.join(", ");
        modalElement.querySelector(".selected-category").textContent = options.post.category;
        quill.root.innerHTML = options.post.content;
    }

    //게시글 탭
    const categorySelector = modalElement.querySelector(".category-selector");
    const categoryList = modalElement.querySelector(".category-list");
    const selectedCategory = modalElement.querySelector(".selected-category");
    const categoryItems = modalElement.querySelectorAll(".category-list li");
    const user = JSON.parse(sessionStorage.getItem("member"));

    categorySelector.addEventListener("click", () => {
        categorySelector.classList.toggle("active");
        categoryList.classList.toggle("active");
    })
    categoryItems.forEach(item => {
        item.addEventListener("click", () => {
            selectedCategory.textContent = item.querySelector("span").textContent;
            categorySelector.classList.remove("active");
            categoryList.classList.remove("active");
        });
    });
    document.addEventListener("click", (e) => {
        if(!categorySelector.contains(e.target) && !categoryList.contains(e.target)){
            categorySelector.classList.remove("active");
            categoryList.classList.remove("active");
        }
    })

    //업로드 버튼
    modalElement.querySelector("#uploadBtn").addEventListener("click", async e => {
        e.preventDefault();

        const img = quill.root.querySelector("img");
        const thumbnail = img ? img.getAttribute("src") : "./source/image/profile.png";
        const plainText = quill.getText().trim();
        const lines = plainText.split("\n").filter(line => line.trim() !== "");
        const summary = lines.slice(0, 2).join(" ");
        const content = quill.root.innerHTML;
        const tag = modalElement.querySelector("#tag").value;
        const formattedTagList = tag ? tag.split(",").map(t => t.trim()) : [];
        const date = new Date();
        const formattedTime = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);

        if (!content || content.trim() === "<p><br></p>") { alert("내용을 입력해주세요."); return; }

        if (options.mode === "update" && options.post) {
            Object.assign(options.post, {
                title: modalElement.querySelector("#title").value,
                summary,
                content,
                thumbnail,
                date: formattedTime,
                category: selectedCategory.textContent,
                tag: formattedTagList
            });
            await updatePost(options.post);
            await updateBoard(currentPage, filteredPosts);

            const directToDetail = await getPost(options.post.id);
            closeModal();

            handleModal("postDetailModalWrapper", "postDetailModal", { post: directToDetail });
        } else {
            const newPost = {
                title: modalElement.querySelector("#title").value,
                profile:user.profile,
                author:user.name,
                summary: summary,
                content: content,
                thumbnail: thumbnail,
                like:0, 
                dislike:0, 
                comment:0, 
                views:0,
                date: formattedTime,
                category: selectedCategory.textContent,
                tag: formattedTagList
            };
            const newPostId = await addPost(newPost);
            await updateBoard(currentPage, filteredPosts);

            const directToDetail = await getPost(newPostId);
            closeModal();

            handleModal("postDetailModalWrapper", "postDetailModal", { post: directToDetail });
        }
    });

    //취소 버튼
    modalElement.querySelector(".cancel-btn").addEventListener("click", () => {
        if (options.mode === "update") {
            closeModal();
            handleModal("postDetailModalWrapper", "postDetailModal", { post: options.post });
        } else {
            gsap.to(modalElement, { y:"100%", opacity:0, duration:0.3,
                onComplete: () => {
                    modalWrapper.classList.remove("active");
                    document.documentElement.classList.remove("modal-active");
                    modalWrapper.innerHTML = '';
                }
            });
        }
    });
};
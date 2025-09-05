import { openDB } from "https://cdn.jsdelivr.net/npm/idb@8/+esm";

let boardPostsDB;

// indexedDB 초기화
export const initDB = async () => {
    boardPostsDB = await openDB('boardDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("posts")) {
                const store = db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
                store.createIndex('createAt', 'createAt', { unique: false });
            }
        }
    });
};

export const getAllPosts = async () => await boardPostsDB.getAll("posts");
export const addPost = async (post) => await boardPostsDB.add("posts", post);
export const getPost = async (id) => await boardPostsDB.get("posts", id);
export const updatePost = async (post) => await boardPostsDB.put("posts", post);
export const deletePost = async (id) => await boardPostsDB.delete("posts", id);

// const clearPosts = async () => {
//     if (!boardPostsDB) {
//         await initDB();
//     }
    
//     const tx = boardPostsDB.transaction("posts", "readwrite");
//     await tx.objectStore("posts").clear();
//     await tx.done;
//     console.log("모든 게시글이 삭제되었습니다.");
// };

// document.addEventListener("DOMContentLoaded", async () => {
//     await clearPosts();  
// });
// localStorage.clear();
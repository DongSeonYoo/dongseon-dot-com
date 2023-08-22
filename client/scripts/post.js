const commentsSection = document.querySelector(".comments");
const commentsCount = document.getElementById("comment-count");
const postInfoArea = document.getElementById("post-info-area");
const backBtn = document.getElementById("back-button");
const postInfoDiv = document.getElementById("post-info-temp-div");

let userId;
const postId = parseUrl();
let commentCount = commentsSection.childElementCount;

window.onload = async () => {
    const json = await checkAuth();
    userId = json.data.userPk;
    const postAuthor = await displayPost();

    // 해당 포스트의 주인일 경우
    if (userId === postAuthor) {
        // 수정, 삭제 버튼 생성
        makeManagePostUI();
    }
    await displayComment();
}

async function displayPost() {
    try {
        const res = await fetch("/api/post/" + postId);
        const json = await res.json();

        if (res.status === 200) {
            if (json.data !== null) {
                const post = json.data;

                
                const postTitle = document.getElementById("post-title");
                const authorProfileImg = document.createElement("img");
                const postContent = document.getElementById("post-content");

                const postAuthorLink = document.getElementById("post-author-link");
                
                const postAuthor = document.createElement("p");
                const postCreateDate = document.createElement("p");
                const postUpdateDate = document.createElement("p");

                const parsingUpdatedDate = new Date(post.updated_date).toLocaleDateString();
                const parsingCreateDate = new Date(post.created_date).toLocaleString();

                const authorPk = post.user_id;

                postTitle.innerHTML = post.title;
                authorProfileImg.src = s3ImageUrl + "/" + post.author_profile_img;
                postAuthor.innerHTML = post.author_name;
                
                postContent.innerHTML = post.content;
                postContent.id = "post-content";
                if (post.image_key !== null) {
                    post.image_key.forEach(item => {
                        const postImage = document.createElement("img");
                        postImage.src = s3ImageUrl + "/" + item;
                        postImage.alt = "Image";
                        postContent.appendChild(postImage);
                    });
                }
                postCreateDate.innerHTML = "작성일: " + parsingCreateDate;
                postUpdateDate.innerHTML = "최근 수정일: " + parsingUpdatedDate;

                postInfoDiv.appendChild(postCreateDate);
                postInfoDiv.appendChild(postUpdateDate);

                postAuthorLink.appendChild(authorProfileImg);
                postAuthorLink.appendChild(postAuthor);

                postAuthor.id = "post-author";
                postAuthor.classList.add("post-info")

                postCreateDate.id = "post-create-date";
                postCreateDate.classList.add("post-info")

                postUpdateDate.id = "post-update-date";
                postUpdateDate.classList.add("post-info")

                postAuthorLink.href = `/view-profile/${authorPk}`;

                authorProfileImg.id = "post-author-img";

                return post.user_id;
            }
        } else if (res.status === 404) {
            location.href = "../pages/404.html";
        } else if (res.status === 401 || res.status === 419) {
            alert(json.message);
            location.href = "/";
        } else if (res.status === 500) {
            alert("데이터베이스 오류");
            console.log(json);
        }
    } catch (error) {
        console.error(error.message);
        alert("데이터베이스 오류");
        location.href = "/";
    }
}


async function displayComment() {
    try {
        const json = await loadCommentFetch(postId);
        if (json.data !== null) {
            commentCount = json.data.length; // 댓글 숫자 업데이트

            if (commentCount === 0) {
                commentsCount.innerHTML = "댓글이 존재하지 않습니다";
            } else {
                commentsCount.innerHTML = commentCount + "개의 댓글";
            }
            // if (json.data.length !== 0) {
            json.data.forEach(comment => {
                makeCommentList(comment);
            });
        }

    } catch (error) {
        console.log(error);
    }
}

async function loadCommentFetch(postId) {
    try {
        const result = await fetch("/api/comment/post/" + postId);
        const json = await result.json();
        if (result.status !== 200) {
            alert(json.message);
            location.href = "/";
            return;
        }
        return json;

    } catch (error) {
        console.error(error.message);
    }
}

function parseUrl() {
    const url = window.location.href.split("/");
    const postId = url[url.length - 1];

    return postId;
}

function makeCommentList(comment) {
    const commentDiv = document.createElement("div");
    const commentInfoArea = document.createElement("div");
    const commentAuthor = document.createElement("p");
    const commentCreatedDate = document.createElement("p");
    const commentUpdatedDate = document.createElement("p");
    const commentContent = document.createElement("p");

    const parsedCreatedDate = new Date(comment.created_date).toLocaleString();
    const parsedUpdatedDate = new Date(comment.updated_date).toDateString();

    commentAuthor.innerHTML = comment.authorName;
    commentAuthor.onclick = () => {
        location.href = `/view-profile/${comment.user_id}`
    }
    commentCreatedDate.innerHTML = "작성일: " + parsedCreatedDate;
    commentUpdatedDate.innerHTML = "최근 수정일: " + parsedUpdatedDate;
    commentContent.innerHTML = comment.content;

    commentInfoArea.appendChild(commentAuthor);
    commentInfoArea.appendChild(commentCreatedDate);
    commentInfoArea.appendChild(commentUpdatedDate);
    commentDiv.appendChild(commentInfoArea);
    commentDiv.appendChild(commentContent);

    // 만약 현재 보고있는 유저와 댓글의 아이디가 일치하면 (댓글주인일경우)
    if (userId == comment.user_id) {
        const authorOwner = document.createElement("div");
        authorOwner.innerHTML = "(작성자)";
        commentInfoArea.appendChild(authorOwner);
        makeMamnageCommentUI(commentInfoArea, comment.id);
    }

    commentsSection.appendChild(commentDiv);

    commentDiv.classList.add("comment");
    commentInfoArea.classList.add("comment-info-area");
    commentAuthor.classList.add("comment-author");
    commentCreatedDate.classList.add("comment-date");
    commentUpdatedDate.classList.add("comment-date");
    commentContent.classList.add("comment-content");
}

function makeManagePostUI() {
    const buttonZone = document.createElement("div");
    const postModifyButton = document.createElement("button");
    const postDeleteButton = document.createElement("button");

    postModifyButton.innerHTML = "수정";
    postDeleteButton.innerHTML = "삭제";

    buttonZone.id = "button-zone";
    postModifyButton.id = "postModifyButton";
    postDeleteButton.id = "postDeleteButton";

    postModifyButton.onclick = clickPostModifyButton;
    postDeleteButton.onclick = clickPostDeleteButton;

    buttonZone.appendChild(postModifyButton);
    buttonZone.appendChild(postDeleteButton);

    postInfoDiv.appendChild(buttonZone);
}

function makeMamnageCommentUI(commentInfoArea, commentId) {
    const manageButtonArea = document.createElement("div");
    const commentModifyBtn = document.createElement("button");
    const commentDeleteBtn = document.createElement("button");

    commentModifyBtn.innerHTML = "수정";
    commentDeleteBtn.innerHTML = "삭제";

    manageButtonArea.appendChild(commentModifyBtn);
    manageButtonArea.appendChild(commentDeleteBtn);
    commentInfoArea.appendChild(manageButtonArea);

    // commentModifyBtn.onclick = clickCommentModifyButton;
    commentDeleteBtn.onclick = () => clickCommentDeleteButton(commentId);
}

function clickPostModifyButton() {
    location.href = `/modify-post/${postId}`;
}

async function clickPostDeleteButton() {
    const askDelete = confirm("게시글을 삭제하시겠습니까?");
    if (!askDelete) {
        return;
    }

    try {
        const response = await fetch("/api/post", {
            "method": "DELETE",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "postId": `${postId}`,
            })
        });

        const data = await response.json();
        if (response.status !== 200) {
            alert(json.message);
            return;
        }
        if (!data.isSuccess) {
            alert(data.message);
            return;
        }
        location.href = "/community";

    } catch (error) {
        console.error(error);
        alert("데이터베이스 오류: " + error);
    }
}

async function clickCommentSubmitBtn() {
    const commentContent = document.getElementById("comment-input");

    if (!userId) {
        alert("로그인 후 이용해주세요");
        return;
    }

    if (commentContent.value === "") {
        alert("댓글이 입력되지 않았습니다");
        return;
    }

    if (commentContent.value.length > 300) {
        alert("댓글은 300자 내로 입력해주세요");
        return;
    }

    try {
        const response = await fetch("/api/comment", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },

            "body": JSON.stringify({
                "postId": postId,
                "content": commentContent.value
            })
        });
        const json = await response.json();
        if (response.status !== 200) {
            alert(json.message);
            location.href = "/community";
            return;
        }
        commentsSection.innerHTML = "";
        commentContent.value = "";
        commentCount += 1;
        await displayComment();

    } catch (error) {
        console.error(error);
        alert(error);
    }
}

function clickCommentModifyButton() {
    const commentInfoArea = document.querySelector(".comment-info-area");
    const modifyCommentInput = document.createElement("input");

    commentInfoArea.appendChild(modifyCommentInput);
}

async function clickCommentDeleteButton(commentId) {
    const askDelete = confirm("댓글을 삭제하시겠습니까?");
    if (!askDelete) {
        return;
    }

    await deleteCommentFetch(postId, commentId);
    commentsSection.innerHTML = "";
    if (commentCount !== 0) {
        commentCount -= 1; // 댓글 숫자 감소
    }

    await displayComment();
}

async function deleteCommentFetch(postId, commentId) {
    try {
        const response = await fetch("/api/comment", {
            "method": "DELETE",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "postId": postId,
                "commentId": commentId,
            })
        });

        const json = await response.json();
        if (response.status !== 200) {
            alert(json.message);
            return;
        }
        if (!json.isSuccess) {
            alert("해당하는 댓글이 존재하지 않습니다");
        }

    } catch (error) {
        console.error(error);
    }
}

backBtn.addEventListener("click", () => {
    location.href = "/community";
});

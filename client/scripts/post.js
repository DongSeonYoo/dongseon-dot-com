const commentsSection = document.querySelector(".comments");
const commentsCount = document.getElementById("comment-count");
const postInfoArea = document.getElementById("post-info-area");
const backBtn = document.getElementById("back-button");

const userId = sessionStorage.getItem("loginUserSession");
const postId = parseUrl();

window.onload = async () => {
  const postAuthor = await displayPost();

  // 해당 포스트의 주인일 경우
  if (userId === String(postAuthor)) {
    // 수정, 삭제 버튼 생성
    makeManagePostUI();
  }
  displayComment();
}

backBtn.addEventListener("click", () => {
  location.href = "/community"
})

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

  commentAuthor.innerHTML = "작성자: " + comment.authorName;
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
    makeMamnageCommentUI(commentDiv, comment.id);
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

  postInfoArea.appendChild(buttonZone);
}

function makeMamnageCommentUI(commentDiv, commentId) {
  const commentModifyBtn = document.createElement("button");
  const commentDeleteBtn = document.createElement("button");

  commentModifyBtn.innerHTML = "수정";
  commentDeleteBtn.innerHTML = "삭제";

  commentDiv.appendChild(commentModifyBtn);
  commentDiv.appendChild(commentDeleteBtn);

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
    const result = await fetch("/api/post", {
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "userId": `${userId}`,
        "postId": `${postId}`,
      })
    });
    const data = await result.json();
    if (data.isSuccess) {
      location.href = "/community";
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("데이터베이스 오류: " + error);
    console.error(error);
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

  const json = await writeCommentFetch(postId, userId, commentContent.value);
  if (json.isSuccess) {
    commentsSection.innerHTML = "";
    commentContent.value = "";
    displayComment();

  } else {
    alert("댓글 작성에 실패하였습니다: " + json.message);
  }
}

async function clickCommentModifyButton() {
  const commentInfoArea = document.querySelector(".comment-info-area");
  const modifyCommentInput = document.createElement("input");
  modifyCommentInput.value = "qwer"

  commentInfoArea.appendChild(modifyCommentInput);
}

async function clickCommentDeleteButton(commentId) {
  const askDelete = confirm("댓글을 삭제하시겠습니까?");
  if (!askDelete) {
    return;
  }

  const json = await deleteCommentFetch(postId, commentId, userId);
  if (json.isSuccess) {
    commentsSection.innerHTML = "";
    await displayComment();

  } else {
    alert("댓글 삭제에 실패하였습니다" + json.message);
  }
}

async function displayPost() {
  const json = await loadPostFetch(postId);

  if (json.isSuccess) {
    const post = json.data;

    const postTitle = document.getElementById("post-title");
    const postAuthor = document.getElementById("post-author");
    const postContent = document.getElementById("post-content");
    const postCreateDate = document.getElementById("post-create-date");
    const postUpdateDate = document.getElementById("post-update-date");
    
    const parsingUpdatedDate = new Date(post.updated_date).toLocaleDateString();
    const parsingCreateDate = new Date(post.created_date).toLocaleString();

    postTitle.innerHTML = post.title;
    postAuthor.innerHTML = "작성자: " + post.author_name;
    postContent.innerHTML = post.content;
    postCreateDate.innerHTML = "작성일: " + parsingUpdatedDate;
    postUpdateDate.innerHTML = "최근 수정일: " + parsingCreateDate;

    return post.user_id;

  } else {
    alert("존재하지 않는 게시글입니다");
    location.href = "/community";
  }
}

async function displayComment() {
  try {
    const json = await loadCommentFetch(postId);

    if (json.isSuccess) {
      commentsCount.innerHTML = json.data.length + "개의 댓글";
      if (json.data.length !== 0) {
        json.data.forEach(comment => {
          makeCommentList(comment);
        });
      } else {
        // 댓글이 없으면?

      }
    }

  } catch (error) {
    console.log(error);
  }
}

async function loadPostFetch(postId) {
  try {
    const result = await fetch("/api/post/" + postId);

    return await result.json();
  } catch (error) {
    alert("데이터베이스 오류: " + error);
    console.error(error);
  }
}

async function loadCommentFetch(postId) {
  try {
    const result = await fetch("/api/comment/post/" + postId);

    return await result.json();
  } catch (error) {
    console.error(error);
  }
}

// postId, userId, content
async function writeCommentFetch(postId, userId, content) {
  try {
    const result = await fetch("/api/comment", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },

      "body": JSON.stringify({
        "postId": postId,
        "userId": userId,
        "content": content
      })
    });

    return await result.json();

  } catch (error) {
    alert("데이터베이스 오류");
    console.error(error);
    location.href = "/";
  }
}

async function deleteCommentFetch(postId, commentId, userId) {
  try {
    const result = await fetch("/api/comment", {
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "postId": postId,
        "commentId": commentId,
        "userId": userId
      })
    });
    
    const json = await result.json();
    if (json.isSuccess) {
      location.reload();
    }

  } catch (error) {
    console.error(error);
  }
}
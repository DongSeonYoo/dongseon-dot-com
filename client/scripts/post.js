const commentsSection = document.querySelector(".comments");
const commentsCount = document.getElementById("comment-count");
const postInfoArea = document.getElementById("post-info-area");
const backBtn = document.getElementById("back-button");

const userId = sessionStorage.getItem("loginUserSession");
const postId = parseUrl();
let commentCount = commentsSection.childElementCount;
window.onload = async () => {
  const postAuthor = await displayPost();
  // 해당 포스트의 주인일 경우
  if (userId === String(postAuthor)) {
    // 수정, 삭제 버튼 생성
    makeManagePostUI();
  }
  await displayComment();
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

  try {
    const res = await fetch("/api/comment", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },

      "body": JSON.stringify({
        "postId": postId,
        "userId": userId,
        "content": commentContent.value
      })
    });
    const json = await res.json();

    if (res.status === 200) {
      if (json.isSuccess) {
        commentsSection.innerHTML = "";
        commentContent.value = "";
        commentCount += 1;
        await displayComment();
      } else {
        alert(json.message);
        location.href = "/community";
      }
    } else if (res.status === 400) {
      alert(json.message);
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

async function clickCommentModifyButton() {
  const commentInfoArea = document.querySelector(".comment-info-area");
  const modifyCommentInput = document.createElement("input");

  commentInfoArea.appendChild(modifyCommentInput);
}

async function clickCommentDeleteButton(commentId) {
  const askDelete = confirm("댓글을 삭제하시겠습니까?");
  if (!askDelete) {
    return;
  }

  await deleteCommentFetch(postId, commentId, userId);
  commentsSection.innerHTML = "";
  if (commentCount !== 0) {
    commentCount -= 1; // 댓글 숫자 감소
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

      } else if (json.data === null) {
        alert(json.message);
        location.href = "/community";
      }
    } else if (res.status === 404) {

    } else if (res.status === 500) {
      alert("데이터베이스 오류");
      location.href = "/";
    }

  } catch (error) {
    console.error(error);
    alert("네트워크 오류: " + error);
    location.href = "/";
  }
}

async function displayComment() {
    try {
      const json = await loadCommentFetch(postId);
      if (json.data !== null) {
        commentCount = json.data.length; // 댓글 숫자 업데이트

      if (commentCount === 0){
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

    if (result.status === 200) {
      return json;

    } else if (result.status === 400 || result.status === 500) {
      alert("잘못된 요청: " + json.message)
      location.reload();
      return;
    }
  } catch (error) {
    console.error(error.message);
  }
}

// postId, userId, content
// async function writeCommentFetch(postId, userId, content) {
//   try {
//     const result = await fetch("/api/comment", {
//       "method": "POST",
//       "headers": {
//         "Content-Type": "application/json"
//       },

//       "body": JSON.stringify({
//         "postId": postId,
//         "userId": userId,
//         "content": content
//       })
//     });
//     if (result.status === 200) {
//       return await result.json();
//     } 

//   } catch (error) {
//     alert("데이터베이스 오류");
//     console.error(error);
//     location.href = "/";
//   }
// }

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
    if (result.status === 200) {
      if (!json.isSuccess) {
        alert("해당하는 댓글이 존재하지 않습니다");
      }

    } else if (result.status === 400) {
        alert("잘못된 요청: " + json.message);
    } else if (result.status === 500) {
        alert("서버 에러,");
    }

  } catch (error) {
    console.error(error);
  }
}

backBtn.addEventListener("click", () => {
  location.href = "/community"
})
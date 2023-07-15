const submitBtn = document.getElementById("submit-button");
const cancelBtn = document.getElementById("cancel-button");

const postTitle = document.getElementById("input-title");
const postContent = document.getElementById("input-content");

const userId = sessionStorage.getItem("loginUserSession");
const postId = parseUrl();

let existingValue = {
  title: "",
  content: "",
};

if (!userId) {
  location.href = "/";
}

loadPostData(postId);

const validateInput = () => {
  const titleValue = document.getElementById("input-title").value;
  const contentValue = document.getElementById("input-content").value;

  if (existingValue.title === titleValue && existingValue.content === contentValue) {
    alert("변경된 내용이 없습니다")
    return false;
  }

  if (titleValue.length === 0) {
    alert("제목이 입력되지 않았습니다")
    return false;
  }

  if (titleValue.length > 30) {
    alert("제목이 너무 깁니다 30자 내로 입력해주세요");
    return false;
  }

  if (contentValue.length === 0) {
    alert("내용이 입력되지 않았습니다");
    return false;
  }

  if (contentValue.length > 300) {
    alert("본문의 내용이 너무 깁니다 300자 내로 입력해주세요");
    return false;
  }

  return true;
}

function parseUrl() {
  const url = window.location.href.split("/");
  const postId = url[url.length - 1];

  return postId;
}

async function loadPostData(postId) {
  try {
    const result = await fetch("/api/post/" + postId);
    const json = await result.json();

    postTitle.value = json.data.title;
    postContent.value = json.data.content;

    existingValue.title = json.message.title;
    existingValue.content = json.message.content;

  } catch (error) {
    console.error(error);
  }
}

async function modifyPostFetch(titleValue, contentValue) {
  // PUT post api
  try {
    const result = await fetch("/api/post", {
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "postId": postId,
        "title": titleValue,
        "content": contentValue,
        "userId": userId
      })
    });

    const json = await result.json();
    if (json.isSuccess) {
      location.href = `/post/${postId}`;

    } else {
      alert(json.message);
    }

  } catch (error) {
    alert("데이터베이스 오류" + error);
    console.error(error);
  }
}

submitBtn.addEventListener("click", () => {
  if (validateInput()) {
    const titleValue = document.getElementById("input-title").value;
    const contentValue = document.getElementById("input-content").value;

    modifyPostFetch(titleValue, contentValue);
  }
});

cancelBtn.addEventListener("click", () => {
  location.href = "/community";
});
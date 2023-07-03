const url = window.location.href.split("/");
const pathVariable = url[url.length - 1];

async function displayPost() {
  const pathVariable = parseUrl();
  const json = await specificPostFetch(pathVariable);

  if (json.success) {
    const post = json.message;
    const postTitle = document.getElementById("post-title");
    const postAuthor = document.getElementById("post-author");
    const postContent = document.getElementById("post-content");
    const postCreateDate = document.getElementById("post-create-date");
    const postUpdateDate = document.getElementById("post-update-date");
    
    const parsingUpdatedDate = new Date(post.updated_date).toLocaleString();
    const parsingCreateDate = new Date(post.created_date).toDateString();

    postTitle.innerHTML = post.title;
    postAuthor.innerHTML = "작성자: " + post.author_name;
    postContent.innerHTML = post.content;
    postCreateDate.innerHTML = "작성일: " + parsingUpdatedDate;
    postUpdateDate.innerHTML = "최근 수정일: " + parsingCreateDate;
  }
}

function parseUrl() {
  const url = window.location.href.split("/");
  const pathVariable = url[url.length - 1];

  return pathVariable;
}

async function specificPostFetch(pathVariable) {
  try {
    const result = await fetch("/api/post/" + pathVariable);

    return await result.json();
  } catch (error) {
    alert("데이터베이스 오류: " + error);
    console.error(error);
  }
}
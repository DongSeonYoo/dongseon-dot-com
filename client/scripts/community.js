const container = document.getElementById("container");
const posts = document.getElementById("posts");

const homeBtn = document.getElementById("home-button");
const createPostBtn = document.getElementById("create-post-button");


getAllPostsFetch();

homeBtn.addEventListener("click", () => {
  location.href = "/";
})

createPostBtn.addEventListener("click", () => {
  if (localStorage.getItem("loginUserSession")) {
    location.href = "/write-post";

  } else {
    alert("로그인 후 이용해주세요");
  }
});

async function getAllPostsFetch() {
  try {
    const result = await fetch("/api/post/all");
    const json = await result.json();

    if (json.isSuccess) {
      json.data.forEach(post => {
        makePostList(post);
      });
      
    } else {
      alert("데이터베이스 오류: " + json.message);
      location.href = "/";
    }

  } catch (error) {
    console.error(error);
  }

  const post = document.querySelectorAll(".post");
  post.forEach((postElement) => {
    postElement.addEventListener("click", () => {
      const postId = postElement.querySelector("input").value;

      location.href = `/post/${postId}`;
    })
  });
}

function makePostList(post) {
  const postDiv = document.createElement("div");
  const postInfoSection = document.createElement("section");
  const postTitle = document.createElement("h2");
  const postDate = document.createElement("p");
  const postAuthor = document.createElement("p");
  const postId = document.createElement("input");

  const createDate = new Date(post.created_date);

  postTitle.innerHTML = post.title;
  postId.value = post.id;

  postDate.innerHTML = createDate.toDateString();
  postAuthor.innerHTML = "작성자: " + post.author_name;

  postInfoSection.appendChild(postDate);
  postInfoSection.appendChild(postAuthor);

  postDiv.appendChild(postTitle);
  postDiv.appendChild(postInfoSection);
  postDate.appendChild(postId);

  posts.appendChild(postDiv);

  postId.type = "hidden";

  postTitle.classList.add("post-title");
  postAuthor.classList.add("post-author");
  postDate.classList.add("post-date");
  postDiv.classList.add("post");
  postInfoSection.id = "post-info-section";
}
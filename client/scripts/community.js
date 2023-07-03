const container = document.getElementById("container");
const posts = document.getElementById("posts");

const homeBtn = document.getElementById("home-button");
const createPostBtn = document.getElementById("create-post-button");


getAllPostsFetch();

homeBtn.addEventListener("click", () => {
  location.href = "/";
})

createPostBtn.addEventListener("click", () => {
  location.href = "/write-post"
});

async function getAllPostsFetch() {
  try {
    const result = await fetch("/api/post/all");
    const json = await result.json();

    if (json.success) {

      json.message.forEach(post => {
        makePostList(post);
      });
      
    } else {
      alert("데이터베이스 오류");
      location.href = "/";
    }

  } catch (error) {
    console.error(error);
  }
}

function makePostList(post) {
  const postDiv = document.createElement("div");
  const postTitle = document.createElement("h2");
  const postDate = document.createElement("p");
  const postAuthor = document.createElement("p");
  const postId = document.createElement("input");

  const createDate = new Date(post.created_date);

  postTitle.innerHTML = post.title;
  postDate.innerHTML = createDate.toDateString();
  postAuthor.innerHTML = "작성자: " + post.author_name;
  postId.value = post.id;

  postDiv.appendChild(postTitle);
  postDiv.appendChild(postAuthor);
  postDiv.appendChild(postDate);
  postDate.appendChild(postId);

  posts.appendChild(postDiv);

  postTitle.classList.add("post-title");
  postAuthor.classList.add("post-author");
  postDate.classList.add("post-date");
  postId.type = "hidden";
  postDiv.classList.add("post");
}
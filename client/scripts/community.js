const container = document.getElementById("container");
const posts = document.getElementById("posts");

const homeBtn = document.getElementById("home-button");
const createPostBtn = document.getElementById("create-post-button");

homeBtn.addEventListener("click", () => {
  location.href = "/";
})

createPostBtn.addEventListener("click", () => {
  location.href = "/write-post"
});

getAllPostsFetch();

async function getAllPostsFetch() {
  try {
    const result = await fetch("/post/all");
    const json = await result.json();

    if (json.success) {

      json.message.forEach(post => {
        makePostList(post);
      });
      
    } else {
      alert("데이터베이스 오류");
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

  postTitle.innerHTML = post.title;
  postDate.innerHTML = post.created_date;
  postAuthor.innerHTML = "작성자: " + post.author_name;

  postDiv.appendChild(postTitle);
  postDiv.appendChild(postAuthor);
  postDiv.appendChild(postDate);

  posts.appendChild(postDiv);

  postTitle.classList.add("post-title");
  postAuthor.classList.add("post-author");
  postDate.classList.add("post-date");
  postDiv.classList.add("post");
}

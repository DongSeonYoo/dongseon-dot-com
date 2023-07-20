const container = document.getElementById("container");
const posts = document.getElementById("posts");

const homeBtn = document.getElementById("home-button");
const createPostBtn = document.getElementById("create-post-button");

getAllPostsFetch();

async function getAllPostsFetch() {
  try {
    const result = await fetch("/api/post/all");
    const json = await result.json();

    // 응답이 성공적으로 이루어졌을 경우
    if (result.status === 200) {
      // data가 null이 아니라면 성공적으로 게시글들을 불러온것
      if (json.data !== null) {
        json.data.forEach(post => {
          makePostList(post);
        });
      }
      // 만약 게시글이 null이라면 아무 게시글도 존재하지 않음
      else {
        const noPostTitle = document.getElementById("no-post-title");
        noPostTitle.innerHTML = "게시글이 존재하지 않습니다";
      }
    // 해당 api는 요청이 없기때문에 400 처리는 해줄 필요가 없ㄷ음

    // 500 error코드가 반환되었을 시 백엔드에서 온 메세지를 그대로 출력
    } else if (result.status === 500) {
      alert(json.message);
      location.href = "/";
    }

  } catch (error) {
    alert("네트워크 오류");
    console.error(error);
    location.href = "/";
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


homeBtn.addEventListener("click", () => {
  location.href = "/";
});

createPostBtn.addEventListener("click", () => {
  if (sessionStorage.getItem("loginUserSession")) {
    location.href = "/write-post";

  } else {
    alert("로그인 후 이용해주세요");
  }
});
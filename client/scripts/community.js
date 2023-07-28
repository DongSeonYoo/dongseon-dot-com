const container = document.getElementById("container");
const posts = document.getElementById("posts");
const createPostBtn = document.getElementById("create-post-button");
const postCountSpan = document.getElementById("post-counts");
const pageSelectContainer = document.getElementById("page-select-container");

let allPostCounts;
let currentPage = 1; // 현재 페이지 번호

window.onload = async () => {
  try {
    // 게시글의 개수 먼저 불러오고
    const postCounts = await getPostCountFetch();
    allPostCounts = postCounts;
    postCountSpan.innerHTML = allPostCounts;

    // 한 페이지에 보여주는 게시글의 기본값이 7 이니 postCounts / 8 한 값
    const maxPageSelectCount = Math.floor(postCounts / 8);
    makePageSelectButton(maxPageSelectCount);
    await getPostFetch(currentPage);

  } catch (error) {
    alert("요청에 실패하였습니다");
    console.error(error);
    location.href = "/";
  }
}

// 페이지 이동 버튼을 만들어주는 함수
function makePageSelectButton(count) {
  if (count === 0) {
    count = 1;
  }
  for (let i = 1; i <= count + 1; i++) {
    const pageSelectBtn = document.createElement("button");
    pageSelectBtn.classList.add("page-select-btn");
    pageSelectBtn.innerHTML = String(i);

    pageSelectBtn.onclick = () => {
      currentPage = i;
      clearPost();
      getPostFetch(i);
    }
    pageSelectContainer.appendChild(pageSelectBtn);
  }
}

function clearPost() {
  while (posts.firstChild) {
    posts.removeChild(posts.firstChild);
  }
}

// async function movePageFetch(count) {
//   try {
//     const result = fetch(`/api/post?pageNumber=${count}`);

//   } catch (error) {
    
//   }
// }

// 게시글을 가져오는 요청을 하는 함수
async function getPostFetch(count = 1) {
  try {
    const result = await fetch(`/api/post?pageNumber=${count - 1}`);
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

      }

    } else if (result.status === 400) {
      alert(json.message);
      location.href = "/";
    } else if (result.status === 401) {
      alert(json.message);
      location.href = "/";
    } else if (result.status === 419) {
      alert(json.message);
      location.href = "/";
    } else if (result.status === 500) {
      alert(json.message);
      location.href = "/";
    }

  } catch (error) {
    alert("네트워크 오류: " + error.message);
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

async function getPostCountFetch() {
  const result = await fetch("/api/post/all/count");
  const json = await result.json();
  if (result.status === 200) {
    if (json.data !== null) {
      return await json.data;
    } else {

    }

  } else {
    alert("서버 오류: " + json.message);
    location.href = "/";
  }
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
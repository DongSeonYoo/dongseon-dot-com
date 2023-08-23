const contentTag = document.getElementById("content");
const viewUserName = document.getElementById("view-user-name");
const userId = parseUrl();

window.onload = () => {
    loadWritedPostFetch();
}

const loadWritedPostFetch = async () => {
    try {
        const response = await fetch(`/api/list/post/${userId}`);
        const json = await response.json();
        if (response.status !== 200) {
            throw new Error(json.message);    
        }

        const data = json.data;

        data.forEach(element => {
            makePostListUI(element);
        });
    } catch (error) {
        alert(error);
    }
}

const makePostListUI = (data) => {
    const { id, title, content, created_date, updated_date } = data;
    let postImage;
    if (data.image_key) {
        postImage = data.image_key[0];
    }

    const postDataRow = document.createElement("div");
    const postTitleSpan = document.createElement("span");
    const postContentSpan = document.createElement("span");
    const postCreateDateSpan = document.createElement("span");
    const postUpdateDateSpan = document.createElement("span");
    const postIdInput = document.createElement("input");

    postTitleSpan.innerHTML = "제목: " + title;
    postContentSpan.innerHTML = "내용: " + content;
    postCreateDateSpan.innerHTML = "생성 날짜: " + new Date(created_date).toLocaleString();
    postUpdateDateSpan.innerHTML = "최근 수정일: " + new Date(updated_date).toLocaleString();
    postIdInput.value = id;

    postDataRow.appendChild(postTitleSpan);
    postDataRow.appendChild(postContentSpan);
    postDataRow.appendChild(postCreateDateSpan);
    postDataRow.appendChild(postUpdateDateSpan);
    postDataRow.appendChild(postIdInput);
    contentTag.appendChild(postDataRow);

    postDataRow.classList.add("post-data-row");
    postTitleSpan.classList.add("post-title");
    postContentSpan.classList.add("post-content");
    postCreateDateSpan.classList.add("post-create-date");
    postUpdateDateSpan.classList.add("post-update-date");
    postIdInput.type = "hidden";
}

function parseUrl() {
    const url = window.location.href.split("/");
    const postId = url[url.length - 1];

    return postId;
}
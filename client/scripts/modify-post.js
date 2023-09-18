const submitBtn = document.getElementById("submit-button");
const cancelBtn = document.getElementById("cancel-button");

const postTitle = document.getElementById("input-title");
const postContent = document.getElementById("input-content");

const userId = sessionStorage.getItem("loginUserSession");
const postId = parseUrl();

const existingValue = {
    title: "",
    content: "",
};

window.onload = async () => {
    loadPostData(postId);
}

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
        if (result.status !== 200) {
            alert(json.message);
            return location.href = "/";
        }
        const post = json.data;


        // 기존 값과 변경된 값을 비교하기 위해 전역변수로 보관
        existingValue.title = json.data.title;
        existingValue.content = json.data.content;
        existingValue.image = json.data.image_key;

        // 기존 필드들 채워줌
        postTitle.value = post.title;
        postContent.value = post.content;

        const imagePreviewContainer = document.getElementById("image-preview-container");
        imagePreviewContainer.innerHTML = ""; // 이미지 컨테이너 내용 초기화

        // 이미지 미리보기 및 삭제 버튼 추가
        if (post.image_key !== null) {
            post.image_key.forEach((item, index) => {
                const imageWrapper = document.createElement("div");
                imageWrapper.className = "image-wrapper";

                const postImage = document.createElement("img");
                postImage.src = item;
                postImage.alt = "img";
                postImage.style.width = "600px";

                const deleteButton = document.createElement("button");
                deleteButton.innerHTML = "X";
                deleteButton.className = "delete-button";

                // X 버튼 클릭 이벤트 처리
                deleteButton.addEventListener("click", () => {
                    // 이미지 및 해당 인덱스의 이미지 키 삭제
                    imageWrapper.remove();
                    post.image_key[index] = "";
                    existingValue.image = post.image_key;
                });

                imageWrapper.appendChild(postImage);
                imageWrapper.appendChild(deleteButton);
                imagePreviewContainer.appendChild(imageWrapper);
            });
        }

    } catch (error) {
        console.error(error);
    }
}

async function modifyPostFetch() {
    // PUT post api
    const titleValue = postTitle.value;
    const contentValue = postContent.value;
    const modifiedImages = existingValue.image.filter((item) => item !== '');

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
                "images": modifiedImages
            })
        });
        if (result.status === 200) {
            const json = await result.json();
            if (!json.isSuccess) {
                alert(json.message);
                return location.href = "/community";
            }
            location.href = `/post/${postId}`;

        } else if (result.status === 401 || result.status === 403) {
            alert("다시 로그인 해주세요");
            location.href = "/";
        }

    } catch (error) {
        alert(error.message);
    }
}

submitBtn.addEventListener("click", () => {
    modifyPostFetch();
});

cancelBtn.addEventListener("click", () => {
    location.href = "/community";
});
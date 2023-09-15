const submitBtn = document.getElementById("submit-button");
const cancelBtn = document.getElementById("cancel-button");
const postImages = document.getElementById("image-file");
let uploadedImageLocation;

const formArea = document.querySelector(".form-area");

window.onload = async () => {
    await checkAuth();
}

submitBtn.addEventListener("click", () => {
    if (validateInput()) {
        createPostFetch();
        submitBtn.disabled = true;
    }
});

cancelBtn.addEventListener("click", () => {
    location.href = "/community";
});

const validateInput = () => {
    const titleValue = document.getElementById("input-title").value;
    const contentValue = document.getElementById("input-content").value;

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

    if (contentValue.length > 500) {
        alert("본문의 내용이 너무 깁니다 500자 내로 입력해주세요");
        return false;
    }

    if (postImages.files.length > 5) {
        alert("사진은 5개까지만 가능합니다");
        return false;
    }

    return true;
}

const onchangeFile = async (e) => {
    // 여기서 s3에 이미지 업로드하는 api 계속 호출
    const postFiles = e.files;
    const loadingIcon = document.getElementById('loading-icon');

    try {
        const formData = new FormData();
        for (const file of postFiles) {
            formData.append("postImage", file);
        }

        loadingIcon.style.display = 'block';

        const response = await fetch("/api/uploader/file/post", {
            "method": "POST",
            "body": formData,
        });

        if (response.status !== 200) {
            alert("개수를 확인해 주세요");
            e.value = "";
        }
        const json = await response.json();
        uploadedImageLocation = json.data;

        loadingIcon.style.display = 'none';
        createPreview(uploadedImageLocation);

    } catch (error) {
        console.log(error);
    }
}

const createPreview = (uploadedImageLocation) => {
    uploadedImageLocation.map(item => {
        const imgTag = document.createElement("img");
        imgTag.src = item;
        formArea.appendChild(imgTag);
    });
}

const createPostFetch = async () => {
    const titleValue = document.getElementById("input-title").value;
    const contentValue = document.getElementById("input-content").value;
    const postImageLocation = uploadedImageLocation;

    try {
        const response = await fetch("/api/post", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },

            "body": JSON.stringify({
                "title": titleValue,
                "content": contentValue,
                "postImageLocation": postImageLocation
            })
        });

        const json = await response.json();
        if (json.isSuccess) {
            const createdPostId = json.postId;
            location.href = `/post/${createdPostId}`;

        } else {
            alert(json.message);
            pageInit();
        }

    } catch (error) {
        alert(error);
        console.error(error);
    }
}

const pageInit = () => {
    let titleValue = document.getElementById("input-title").value;
    let contentValue = document.getElementById("input-content").value;
    let postFiles = postImages;

    titleValue = "";
    contentValue = "";
    postFiles = "";
}

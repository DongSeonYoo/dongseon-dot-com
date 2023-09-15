const idForm = document.getElementById("id-form");
const nameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");
const token = getCookie("accessToken");
const userName = document.getElementById("user-name");
const buttonContainer = document.querySelector(".button-container");
const profileImg = document.getElementById("profile-img");
const editProfileBtn = document.getElementById("edit-profile-button");


window.onload = async () => {
    const viewUserPk = parseUrl();
    viewProfileFetch(viewUserPk);
    // 토큰이 존재하는지 확인
    if (token) {
        // 현재 보고있는 프로필의 주인일 시 프로필 수정 버튼 생성
        try {
            const response = await fetch("/api/auth/login");
            const json = await response.json();

            if (response.status === 200) {
                const userId = json.data.userPk;
                if (viewUserPk === String(userId)) {
                    makeProfileModifyButton(userId);
                }
            }
        }
        catch (error) {
            alert(error);
        }
    }
}

function makeProfileModifyButton() {
    const moveModifyProfileBtn = document.createElement("button");
    moveModifyProfileBtn.innerHTML = "프로필 수정";
    moveModifyProfileBtn.addEventListener("click", () => {
        location.href = `/modify-profile`;
    });

    moveModifyProfileBtn.id = "edit-profile-button";
    buttonContainer.appendChild(moveModifyProfileBtn);
}

function parseUrl() {
    const url = window.location.href.split("/");
    const postId = url[url.length - 1];

    return postId;
}

const viewProfileFetch = async (userPk) => {
    try {
        const result = await fetch(`/api/account/${userPk}`);
        const json = await result.json();
        if (json.data === null) {
            throw new Error("해당하는 사용자가 존재하지 않습니다");
        }
        const user = json.data;
        if (user.profile_img) {
            userName.innerHTML = `${user.name}의 프로필`;
            profileImg.src = user.profile_img;
        }
        idForm.innerHTML = user.login_id;
        nameForm.innerHTML = user.name;
        phoneNumberForm.innerHTML = user.phone_number;
        emailForm.innerHTML = user.email;

        const signUpDate = new Date(user.created_date);
        signUpDateForm.innerHTML = signUpDate.toLocaleString();

        const updatedDate = new Date(user.updated_date);
        updateDateForm.innerHTML = updatedDate.toLocaleString();

        existingName = user.name;
        existingEmail = user.email;
        existingPhoneNumber = user.phone_number;

    } catch (error) {
        alert(error.message);
        location.href = "/";
    }
};

const backButton = document.getElementById("back-button").addEventListener("click", () => {
    history.back();
})
const idForm = document.getElementById("id-form");
const nameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");
const token = getCookie("accessToken");
const userName = document.getElementById("user-name");
const buttonContainer = document.querySelector(".button-container");

const editProfileBtn = document.getElementById("edit-profile-button");


window.onload = async () => {
    const viewUserPk = parseUrl();
    viewProfileFetch(viewUserPk);
    // 토큰이 존재하는지 확인
    if (token) {
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

const onchangeImg = (event) => {
    if (event.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
        }
        reader.readAsDataURL(event.files[0]);
    } else {
        previewImg.src = "";
    }
}

const viewProfileFetch = async (userPk) => {
    try {
        const result = await fetch("/api/account/" + userPk);
        const json = await result.json();
        const user = json.data;

        userName.innerHTML = `${user.name}의 프로필`;
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
        alert(error);
        location.href = "/";
    }
};

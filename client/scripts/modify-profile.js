const idForm = document.getElementById("id-form");
const nameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");
const token = getCookie("accessToken");

const editProfileBtn = document.getElementById("edit-profile-button");
const dropUserBtn = document.getElementById("drop-user-button");
const previewImg = document.getElementById("preview");
const profileImg = document.getElementById("file");

let existingName;
let existingPhoneNumber;
let existingEmail;

window.onload = async () => {
    // 토큰이 존재하는지 확인
    if (!token) {
        location.href = "/";
        return;
    }

    const json = await checkAuth();
    const userData = json.data.userPk;
    viewProfileFetch(userData);
}

const onchangeImg = async (event) => {
    // 여기서 s3에 이미지 업로드하는 api 계속 호출
    const profileImage = event.files[0];

    try {
        const formData = new FormData();
        formData.append("profileImage", profileImage);

        const response = await fetch("/api/uploader/file/profile", {
            "method": "POST",
            "body": formData,
        });
        const json = await response.json();
        previewImg.src = json.data;

    } catch (error) {
        console.log(error);
    }
}

const inputValidate = (existingName, existingPhoneNumber, existingEmail) => {
    const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
    const phoneNumberRegex = /^0\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const newName = nameForm.value;
    const newPhoneNumber = phoneNumberForm.value;
    const newEmail = emailForm.value;

    // if (existingName === newName && existingPhoneNumber === newPhoneNumber && existingEmail === newEmail) {
    //     alert("프로필 정보가 변경되지 않았습니다.");
    //     return false;
    // }


    if (newName.length === 0 || newPhoneNumber.length === 0 || newEmail.length === 0) {
        alert("이름, 전화번호 또는 이메일의 값이 비어있습니다.")
        return false;
    }

    if (!nameRegex.test(newName)) {
        alert("이름은 2~8자의 한글 또는 영문으로 입력해주세요.");
        return false;
    }

    if (!phoneNumberRegex.test(newPhoneNumber)) {
        alert("전화번호는 010부터 시작하는 11자리의 숫자로 입력해주세요.");
        return false;
    }

    if (!emailRegex.test(newEmail)) {
        alert("유효한 이메일 주소를 입력해주세요.");
        return false;
    }

    return true;
};

const viewProfileFetch = async (userData) => {
    const userPk = userData;
    try {
        const result = await fetch("/api/account/" + userPk);
        const json = await result.json();
        const user = json.data;
        if (user.profile_img) {
            previewImg.src = user.profile_img;
        }

        idForm.innerHTML = user.login_id;
        nameForm.value = user.name;
        phoneNumberForm.value = user.phone_number;
        emailForm.value = user.email;

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

const editProfileFetch = async () => {
    const name = nameForm.value;
    const phoneNumber = phoneNumberForm.value;
    const email = emailForm.value;
    const profileImageUrl = previewImg.src;

    try {
        const response = await fetch("/api/account", {
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json"
            },

            "body": JSON.stringify({
                "name": name,
                "phoneNumber": phoneNumber,
                "email": email,
                "profileImageUrl": profileImageUrl
            })
        });

        const json = await response.json();
        if (response.status !== 200) {
            alert(json.message);
            return location.href = "/";
        }
        if (json.isSuccess) {
            return location.href = "/";
        }

    } catch (error) {
        alert("요청 오류: " + error);
        console.error(error);
        location.href = "/";
    }
}

const dropUserFetch = async () => {
    const deleteUserPk = sessionStorage.getItem("loginUserSession")
    try {
        const res = await fetch("/api/account", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userId": deleteUserPk,
            }),
        });
        const json = await res.json();
        if (res.status !== 200) {
            alert(json.message);
            return;
        }
        if (!json.isSuccess) {
            alert("회원 탈퇴 실패: " + json.message);
        }

    } catch (error) {
        alert("요청 오류: " + error.message);
        console.error(error);
    } finally {
        sessionStorage.clear();
        location.href = "/";
    }
}

editProfileBtn.addEventListener("click", () => {
    if (inputValidate(existingName, existingPhoneNumber, existingEmail)) {
        editProfileFetch();
    }
});

dropUserBtn.addEventListener("click", () => {
    const askDropUser = confirm("회원을 탈퇴하시겠습니끼?")
    if (askDropUser) {
        dropUserFetch();
    }
})
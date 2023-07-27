const idForm = document.getElementById("id-form");
const nameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");
const homeBtn = document.querySelector(".home-button");
const editProfileBtn = document.getElementById("edit-profile-button");
const dropUserBtn = document.getElementById("drop-user-button");
const token = getCookie("accessToken");

let existingName;
let existingPhoneNumber;
let existingEmail;

window.onload = async () => {
  // 토큰이 존재하는지 확인
  if (!token) {
    location.href = "/";
    return;
  }
  const authResponse = await fetch("/api/auth");
  if (authResponse.status === 200) {
    const json = await authResponse.json();
    const userData = json.data.userPk;
    viewProfileFetch(userData);
  }
}

const inputValidate = (existingName, existingPhoneNumber, existingEmail) => {
  const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
  const phoneNumberRegex = /^0\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const newName = nameForm.value;
  const newPhoneNumber = phoneNumberForm.value;
  const newEmail = emailForm.value;

  if (existingName === newName && existingPhoneNumber === newPhoneNumber && existingEmail === newEmail) {
    alert("값이 변경되지 않았습니다.");
    return false;
  }


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

  try {
    const result = await fetch("/api/account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": name,
        "phoneNumber": phoneNumber,
        "email": email
      }),
    });

    const json = await result.json();

    if (result.status === 200) {
      if (json.isSuccess) {
        location.href = "/";
      } else {
        alert("수정 실패: " + json.message);
        location.href = "/";
      }
    } else if (result.status === 400) {
      alert("잘못된 요청: " + json.message);
    } else if (result.status === 500) {
      alert("서버 에러, 관리자께 문의하삼");
      location.href = "/";
    }

  } catch (error) {
    alert("요청 오류: " + error.message);
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
    if (res.status === 200) {
      if (json.isSuccess) {
      } else {
        alert("회원 탈퇴 실패: " + json.message);
      }
    } else if (res.status === 400) {
      alert("잘못된 요청: " + json.message);
    } else if (res.status === 500) {
      alert("서버 오류, 관리자에게 문의해주세요");
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

homeBtn.addEventListener("click", () => {
  location.href = "/";
});
const idForm = document.getElementById("id-form");
const nameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");
const homeBtn = document.querySelector(".home-button");
const editProfileBtn = document.getElementById("edit-profile-button");

let existingName;
let existingPhoneNumber;
let existingEmail;

viewProfileFetch();

async function viewProfileFetch() {
  try {
    const userId = sessionStorage.getItem("loginUserSession");
    const pathVariable = userId;

    const result = await fetch("/account/" + pathVariable);
    const json = await result.json();

    if (json.success) {
      const user = json.message;

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

    } else {
      // 세션이 없는 경우?
      // 로그인하지않은경우?
      location.href = "/";
    }
  } catch (error) {
    alert(error);
  }

};

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
}

editProfileBtn.addEventListener("click", () => {
  if (inputValidate(existingName, existingEmail, existingEmail)) {
    editProfileFetch();
  }
})

const editProfileFetch = async () => {
  const userId = sessionStorage.getItem("loginUserSession");
  const name = nameForm.value;
  const phoneNumber = phoneNumberForm.value;
  const email = emailForm.value;

  try {
    const res = await fetch("/account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userId": userId,
        "name": name,
        "phoneNumber": phoneNumber,
        "email": email
      }),
    })

    const json = await res.json();

    if (json.success) {
      alert(json.message);
      location.href = "/";

    } else {
      alert(json.message);
    }

  } catch (error) {
    console.log(error);
  }
}

homeBtn.addEventListener("click", () => {
  location.href = "/";
});
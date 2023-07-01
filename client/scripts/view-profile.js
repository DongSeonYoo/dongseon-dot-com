const idForm = document.getElementById("id-form");
const nicknameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");

const viewProfileFetch = async () => {
  try {
    const userId = sessionStorage.getItem("loginUserSession");
    const pathVariable = userId;

    const result = await fetch("/account/" + pathVariable);
    const json = await result.json();

    if (json.success) {
      const user = json.message;

      idForm.innerHTML = user.login_id;
      nicknameForm.value = user.name;
      phoneNumberForm.value = user.phone_number;
      emailForm.value = user.email;

      const signUpDate = new Date(user.created_date);
      signUpDateForm.innerHTML = signUpDate.toLocaleString();

      const updatedDate = new Date(user.updated_date);
      updateDateForm.innerHTML = updatedDate.toLocaleString();

    } else {
      // 세션이 없는 경우?
      // 로그인하지않은경우?
      location.href = "/";
    }
  } catch (error) {
    alert(error);
  }
};

viewProfileFetch();

const homeBtn = document.querySelector(".home-button");
homeBtn.addEventListener("click", () => {
  location.href = "/";
});

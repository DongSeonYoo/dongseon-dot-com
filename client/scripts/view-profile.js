const idForm = document.getElementById("id-form");
const nicknameForm = document.getElementById("name-form");
const phoneNumberForm = document.getElementById("phoneNumber-form");
const emailForm = document.getElementById("email-form");
const signUpDateForm = document.getElementById("signup-date-form");
const updateDateForm = document.getElementById("update-date-form");

const homeBtn = document.querySelector(".home-button");
homeBtn.addEventListener("click", () => {
  location.href = "/";
});
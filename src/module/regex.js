const loginIdRegex = /^[A-Za-z0-9]{5,20}$/;
const pwRegex = /^.{10,20}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
const phoneNumberRegex = /^0\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


module.exports = {
  loginIdRegex,
  pwRegex,
  nameRegex,
  phoneNumberRegex,
  emailRegex
}
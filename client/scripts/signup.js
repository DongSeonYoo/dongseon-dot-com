const loginIdRegex = /^[A-Za-z0-9]{8,15}$/;
const pwRegex = /^.{10,17}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
const phoneNumberRegex = /^0\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validate() {
  const idField = document.getElementById('id-text-field');
  const idRegex = /^[a-zA-Z0-9]{5,30}$/; // 아이디 정규식
  if (idField.value === "") {
    alert("아이디를 입력해주세요");
    idField.focus();

    return false;
  }

  if (!idRegex.test(idField.value)) {
    alert("아이디는 영문자, 숫자 조합의 30자 이하의 문자열이어야 합니다.");
    idField.focus();

    return false;
  }

  const pwField = document.getElementById('pw-text-field');
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,25}$/; //비밀번호 정규식

  if (pwField.value === "") {
    alert("비밀번호를 입력해주세요");
    pwField.focus();

    return false;
  }

  if (pwRegex.test(pwField.value)) {
    alert('비밀번호는 영문자와 숫자 조합의 8 ~ 25자리 문자열이어야 합니다.');
    pwField.focus();

    return false;
  }

  const pwCheckField = document.getElementById('pw-check-text-field');
  if (pwField.value !== pwCheckField.value) {
    alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    pwCheckField.focus();

    return false;
  }

  const nicknameField = document.getElementById('nickname-text-field');
  const nicknameRegex = /^[a-zA-Z가-힣0-9]{2,20}$/; // 닉네임 정규식
  if (nicknameField.value === "") {
    alert("닉네임을 입력해주세요");
    nicknameField.focus();

    return false;
  }

  if (!nicknameRegex.test(nicknameField.value)) {
    alert('닉네임은 영문자, 한글, 숫자 조합의 20자 이하의 문자열이어야 합니다. (최소 2글자)');
    nicknameField.focus();

    return false;
  }

  const emailField = document.getElementById('email-text-field');
  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/; // 이메일 정규식
  if (emailField.value === "") {
    alert("이메일을 입력해주세요");
    emailField.focus();

    return false;
  }

  if (!emailRegex.test(emailField.value)) {
    alert('이메일 형식이 올바르지 않습니다.');
    emailField.focus();

    return false;
  }

  return true;
}

document.querySelector("#home-button").addEventListener('click', () => {
  location.href = "/";
})
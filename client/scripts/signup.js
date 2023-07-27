const idField = document.getElementById('id-text-field');
const pwField = document.getElementById('pw-text-field');
const pwCheckField = document.getElementById('pw-check-text-field');
const nicknameField = document.getElementById('name-text-field');
const emailField = document.getElementById('email-text-field');
const phoneNumberField = document.getElementById('phonenumber-text-field');

const loginIdRegex = /^[A-Za-z0-9]{5,15}$/;
const pwRegex = /^.{10,17}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
const phoneNumberRegex = /^0\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let isIdDuplicate = false;
let isPhoneNumberDuplicate = false;
let isEmailDuplicate = false;

const validate = () => {
  if (!idInputValidate()) {
    return false;
  }

  if (!pwInputValidate()) {
    return false;
  }

  if (!nicknameInputValidate()) {
    return false;
  }

  if (!phoneNumberInputValidate()) {
    return false;
  }

  if (!emailInputValidate()) {
    return false;
  }

  if (!isCheckDuplicateButton()) {
    return false;
  }

  return true;
};

const idInputValidate = () => {
  if (idField.value === "") {
    alert("아이디를 입력해주세요");
    idField.focus();
    return false;
  }

  if (!loginIdRegex.test(idField.value)) {
    alert("아이디는 영문자, 숫자 조합의 5 ~ 15자 이내 문자열이어야 합니다.");
    idField.focus();
    return false;
  }

  return true;
}

const pwInputValidate = () => {
  if (pwField.value === "") {
    alert("비밀번호를 입력해주세요");
    pwField.focus();
    return false;
  }

  if (!pwRegex.test(pwField.value)) {
    alert("비밀번호는 영문자, 숫자, 특수문자 조합의 8~25자리 문자열이어야 합니다.");
    pwField.focus();
    return false;
  }

  return true;
}

const nicknameInputValidate = () => {
  if (nicknameField.value === "") {
    alert("닉네임을 입력해주세요");
    nicknameField.focus();
    return false;
  }

  if (!nameRegex.test(nicknameField.value)) {
    alert("닉네임은 영문자, 한글, 숫자 조합의 2~8자 이내 문자열이어야 합니다.");
    nicknameField.focus();
    return false;
  }

  return true;
};

const phoneNumberInputValidate = () => {
  if (phoneNumberField.value === "") {
    alert("전화번호를 입력해주세요");
    phoneNumberField.focus();
    return false;
  }

  if (!phoneNumberRegex.test(phoneNumberField.value)) {
    alert("전화번호는 010으로 시작하는 11자리 숫자 문자열이어야 합니다.");
    phoneNumberField.focus();
    return false;
  }

  return true;
};

const emailInputValidate = () => {
  if (emailField.value === "") {
    alert("이메일을 입력해주세요");
    emailField.focus();
    return false;
  }

  if (!emailRegex.test(emailField.value)) {
    alert("유효한 이메일 주소를 입력해주세요");
    emailField.focus();
    return false;
  }

  return true;
};

const isCheckDuplicateButton = () => {
  if (!isIdDuplicate) {
    alert("아이디 중복체크를 완료해주세요");
    return false;
  }

  if (!isPhoneNumberDuplicate) {
    alert("전화번호 중복체크를 완료해주세요");
    return false;
  }

  if (!isEmailDuplicate) {
    alert("이메일 중복체크를 완료해주세요");
    return false;
  }

  return true;
}

const clickIdDuplicate = () => {
  if (idInputValidate()) {
    fetchIdDuplicate();
  }
};

const clickPhoneNumberDuplicate = () => {
  if (phoneNumberInputValidate()) {
    fetchPhoneNumberDuplicate();
  }
}

const clickEmailDuplicate = () => {
  if (emailInputValidate()) {
    fetchEmailDuplicate();
  }
}

const clickSignup = () => {
  if (validate()) {
    fetchSignupData();
  }
};

const onchangeIdInput = () => {
  isIdDuplicate = false;
}

const onchangePhoneNumberInput = () => {
  isPhoneNumberDuplicate = false;
}

const onchangeEmailInput = () => {
  isEmailDuplicate = false;
}

const fetchIdDuplicate = async () => {
  const result = await fetch("/api/account/id/duplicate/" + idField.value);
  const json = await result.json();
  if (result.status === 200) {
    // 중복된 아이디가 존재하는 경우
    if (json.data) {
      alert("중복된 아이디가 존재합니다");
      // 중복된 아이디가 존재하지 않는 경우
    } else {
      isIdDuplicate = true;
      alert("사용 가능한 아이디입니다");
    }
  }
}

const fetchPhoneNumberDuplicate = async () => {
  const result = await fetch("/api/account/phoneNumber/duplicate/" + phoneNumberField.value);
  const json = await result.json();
  if (result.status === 200) {
    // 중복된 전화번호가 존재하는 경우
    if (json.data) {
      alert("중복된 전화번호가 존재합니다");
      // 중복된 전화번호가 존재하지 않는 경우
    } else {
      isPhoneNumberDuplicate = true;
      alert("사용 가능한 전화번호입니다");
    }
  }
}

const fetchEmailDuplicate = async () => {
  const result = await fetch("/api/account/email/duplicate/" + emailField.value);
  const json = await result.json();
  if (result.status === 200) {
    // 중복된 이메일이 존재하는 경우
    if (json.data) {
      alert("중복된 이메일이 존재합니다");
      // 중복된 이메일이 존재하지 않는 경우
    } else {
      isEmailDuplicate = true;
      alert("사용 가능한 이메일입니다");
    }
    // 클라이언트에서 유효하지 않은 요청을 보냈을 경우
  } else if (response.status === 400) {
    alert(json.message);
    location.href = "/";
  // 서버에서 에러가 발생한 경우
  } else if (response.status === 500) {
    alert("서버 오류: " + json.message);
    location.href = "/";
  }
}

const fetchSignupData = async () => {
  const loginId = idField.value;
  const pw = pwField.value;
  const name = nicknameField.value;
  const phoneNumber = phoneNumberField.value;
  const email = emailField.value;

  try {
    const res = await fetch("/api/account/signup", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "loginId": loginId,
        "password": pw,
        "name": name,
        "phoneNumber": phoneNumber,
        "email": email
      })
    });

    const json = await res.json();
    if (json.isSuccess) {
      location.href = "/";

    } else {
      location.href = "/";
    }

  } catch (err) {
    alert(err);
  }
}

document.querySelector("#home-button").addEventListener("click", () => {
  location.href = "/";
});

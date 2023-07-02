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

const validate = () => {
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

  if (pwField.value !== pwCheckField.value) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    pwCheckField.focus();
    return false;
  }

  if (nicknameField.value === "") {
    alert("닉네임을 입력해주세요");
    nicknameField.focus();
    return false;
  }

  if (!nameRegex.test(nicknameField.value)) {
    alert("닉네임은 영문자, 한글, 숫자 조합의 2~20자 이내 문자열이어야 합니다.");
    nicknameField.focus();
    return false;
  }

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

const clickSignup = () => {
  if (validate()) {
    fetchData();
  }
}

const fetchData = async () => {
  const loginId = document.getElementById("id-text-field").value;
  const pw = document.getElementById("pw-text-field").value;
  const name = document.getElementById("name-text-field").value;
  const phoneNumber = document.getElementById("phonenumber-text-field").value;
  const email = document.getElementById("email-text-field").value;

  try {
    const res = await fetch("/account/signup", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "loginId": loginId,
        "pw": pw,
        "name": name,
        "phoneNumber": phoneNumber,
        "email": email
      })
    });

    const json = await res.json();
    if (json.success) {
      location.href = "/";

    } else {
      console.error(json.message);
    }

  } catch (err) {
    alert(err);
  }
}

document.querySelector("#home-button").addEventListener("click", () => {
  location.href = "/";
});

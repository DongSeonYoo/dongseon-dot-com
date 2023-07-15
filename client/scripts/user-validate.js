document.getElementById("home-button").addEventListener("click", () => {
  location.href = "/";
});

function validate() {
  const loginIdRegex = /^[A-Za-z0-9]{8,15}$/;
  const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
  const phoneNumberRegex = /^0\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const loginId = document.querySelector("#id-text-field").value;
  const nickname = document.querySelector("#name-text-field").value;
  const email = document.querySelector("#email-text-field").value;
  const phoneNumber = document.querySelector("#phone-number-text-field").value;

  if (loginId === "") {
    alert("아이디를 입력해주세요");
    return false;
  }

  if (!loginIdRegex.test(loginId)) {
    alert("아이디는 8~15자의 영문 대소문자와 숫자로만 입력해야 합니다");
    return false;
  }

  if (nickname === "") {
    alert("닉네임을 입력해주세요");
    return false;
  }

  if (!nameRegex.test(nickname)) {
    alert("닉네임은 2~8자의 한글 또는 영문으로 입력해야 합니다");
    return false;
  }

  if (phoneNumber === "") {
    alert("전화번호를 입력해주세요");
    return false;
  }

  if (!phoneNumberRegex.test(phoneNumber)) {
    alert("전화번호는 010으로 시작하는 11자리의 숫자로 입력해야 합니다");
    return false;
  }

  if (email === "") {
    alert("이메일을 입력해주세요");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("유효한 이메일 주소를 입력해주세요");
    return false;
  }

  return true;
}

const clickResetPw = () => {
  const isValidValues = validate();

  if (isValidValues) {
    fetchData();
  }
}

const fetchData = async () => {
  const loginId = document.getElementById("id-text-field").value;
  const name = document.getElementById("name-text-field").value;
  const phoneNumber = document.getElementById("phone-number-text-field").value;
  const email = document.getElementById("email-text-field").value;
  const queryString = `loginId=${loginId}&name=${name}&phoneNumber=${phoneNumber}&email=${email}`;

  try {
    const response = await fetch("/api/account/pw?" + queryString);
    const json = await response.json();

    if (json.isSuccess) {
      const userPk = json.data;
      sessionStorage.setItem("resetPwSession", userPk);
      location.href = "/reset-pw";

    } else {
      alert(json.message);
    }

  } catch (error) {
    alert(error);
  }
}

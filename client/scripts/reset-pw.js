document.getElementById("home-button").addEventListener("click", () => {
  location.href = "/";
})

function validate() {
  const newPassword = document.querySelector("#new-pw-text-field").value;
  const checkPassword = document.querySelector("#check-password-text-field").value;
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/; // 비밀번호 정규식

  if (newPassword === "") {
    alert("새롭게 설정할 비밀번호를 입력해주세요");
    return false;
  }

  if (!pwRegex.test(newPassword)) {
    alert('비밀번호는 영문자와 숫자 조합의 8 ~ 25자리 문자열이어야 합니다.');
    return false;
  }

  if (checkPassword === "") {
    alert("비밀번호 재확인이 필요합니다.");
    return false;
  }

  if (newPassword !== checkPassword) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
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
  const userId = sessionStorage.getItem("resetPwSession");
  const newPw = document.getElementById("new-pw-text-field").value;

  try {
    const res = await fetch("/api/account/pw", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        newPw: newPw,
      }),
    });

    const json = await res.json();
    if (json.success) {
      sessionStorage.clear();
      location.href = "/";

    } else {
      alert("잘못된 데이터를 입력하셨습니다");
    }

  } catch (err) {
    alert(err);
  }
};
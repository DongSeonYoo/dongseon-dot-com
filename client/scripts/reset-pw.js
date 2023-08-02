document.getElementById("home-button").addEventListener("click", () => {
    sessionStorage.removeItem("resetPwUserPkSession");
    location.href = "/";
})

window.onload = () => {
    const resetPwUserPk = sessionStorage.getItem("resetPwUserPkSession");
    if (!resetPwUserPk) {
        location.href = "/";
    }
}

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
    if (validate()) {
        fetchData();
    }
}

const fetchData = async () => {
    const userId = sessionStorage.getItem("resetPwUserPkSession");
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
        if (res.status === 200) {
            if (json.isSuccess) {
                location.href = "/";
            } else {
                alert("해당하는 사용자가 존재하지 않습니다. 처음부터 시도해주세요");
                location.href = "/";
            }
        } else if (res.status === 400) {
            alert("잘못된 요청: " + json.message);
        } else if (res.status === 500) {
            alert("서버 에러: " + json.message);
        }

    } catch (err) {
        alert(err);
    }
};
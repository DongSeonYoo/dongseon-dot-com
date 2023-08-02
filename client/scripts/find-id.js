window.onload = () => {
    if (checkCookie()) location.href = "/";
}

function validate() {
    const name = document.getElementById("name-text-field").value;
    const phoneNumber = document.getElementById("phonenumber-text-field").value;
    const email = document.getElementById("email-text-field").value;

    const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
    const phoneNumberRegex = /^0\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name === "") {
        alert("이름을 입력해주세요");
        return false;
    }

    if (name.length > 8) {
        alert("이름이 너무 깁니다");
        return false;
    }

    if (!nameRegex.test(name)) {
        alert("이름 형식에 맞지 않습니다");
        return false;
    }

    if (phoneNumber === "") {
        alert("전화번호를 입력해주세요");
        return false;
    }

    if (phoneNumber.length !== 11) {
        alert("전화번호는 11자리여야 합니다");
        return false;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
        alert("전화번호 형식에 맞지 않습니다");
        return false;
    }

    if (email === "") {
        alert("이메일을 입력해주세요");
        return false;
    }

    if (!emailRegex.test(email)) {
        alert("이메일 형식에 맞지 않습니다");
        return false;
    }

    return true;
}

const clickFindId = () => {
    const isValidValues = validate();

    if (isValidValues) {
        fetchData();
    }
}

const fetchData = async () => {
    const name = document.getElementById("name-text-field").value;
    const phoneNumber = document.getElementById("phonenumber-text-field").value;
    const email = document.getElementById("email-text-field").value;

    const queryString = `name=${name}&phoneNumber=${phoneNumber}&email=${email}`;

    try {
        const res = await fetch("/api/account/loginId?" + queryString);
        const json = await res.json();

        // 200 status code: 요청이 성공적으로 전달된 경우
        if (res.status === 200) {
            // 만약 사용자를 찾았다면?
            if (json.data) {
                alert("아이디: " + json.data);
                location.href = "/";
                // 만약 사용자를 찾지 못했다면?
            } else {
                alert(json.message);
            }

            // 클라이언트에서 잘못된 응답을 보내주었을 경우
        } else if (res.status === 400) {
            alert(json.message);

            // 서버에서 예상치 못한 오류가 생겼을 경우
        } else if (res.status === 500) {
            alert("서버 에러가 발생하였습니다");
        }
    } catch (err) {
        alert(err);
    }
}

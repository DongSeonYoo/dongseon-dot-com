const homeBtn = document.getElementById("home-button");

// 이름, 토큰을 받아 쿠키를 생성
const setCookie = (name, value) => {
    document.cookie = name + "=" + (value || "");
}

// 매개변수로 온 이름의 쿠키를 가져옴, 쿠키의 value를 리턴
const getCookie = (name) => {
    const cookieValue = document.cookie
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(name + '='));

    if (cookieValue) {
        return cookieValue.split('=')[1];
    } else {
        return null;
    }
}

// 매개변수로 온 이름의 쿠키를 지움
const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// accessToken이 있는지 확인, 있다면 true, 없다면 false
const checkCookie = () => {
    if (getCookie("accessToken")) {
        return true;
    }
    return false;
}

// 토큰이 유효한지 검사하고 디코딩한 유저 식별값을 넘겨줌
async function checkAuth() {
    try {
        const response = await fetch("/api/auth/login");
        const user = await response.json();
        if (response.status !== 200) {
            deleteCookie("accessToken");
            location.href = "/";
            return false;
        }
        return user;

    } catch (error) {
        alert(error);
        location.href = "/";
    }
}

// 관리자 권한 체크
async function adminAuthCheck() {
    try {
        const response = await fetch("/api/auth/admin");
        if (response.status !== 200) {
            location.href = "/";
        }
    } catch (error) {
        console.log(error);
    }
}

// 공용 homeBtn
if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        location.href = "/";
    });
}
// DOM 요소 선택
const navBar = document.getElementById("nav-bar");
const home = document.getElementById('home-container');
const scrollTopButton = document.querySelector(".scroll-top-button");
const navMenu = document.getElementById("nav-menu");
const navbarButton = document.querySelector(".navbar-toggle-button");
const modal = document.querySelector(".modal");
const idInput = document.getElementById("id-form");
const pwInput = document.getElementById("pw-form");
const signupBtn = document.querySelector("#sign-up-button");
const findIdBtn = document.querySelector("#find-id-button");
const findPwBtn = document.getElementById("find-pw-button");

const a = location.href;
console.log(a);

// 요소의 높이 계산
const navBarHeight = navBar.getBoundingClientRect().height;
const homeHeight = home.getBoundingClientRect().height;

if (sessionStorage.getItem("loginUserSession")) {
  const loginModalBtn = document.getElementById("login-modal-open-button");
  
  const navbarDiv = document.getElementById("nav-bar");
  const tempDiv = document.createElement("div");
  
  const viewProfileAtag = document.createElement("a");
  const viewProfileButton = document.createElement("button");
  const logoutBtn = document.createElement("button");

  // 로그인 버튼 제거
  loginModalBtn.style.display = "none";

  // 내 프로필 보기 버튼
  viewProfileAtag.href = `/view-profile`;
  viewProfileButton.classList.add("login-only-button");
  viewProfileButton.innerHTML = "내 프로필";
  viewProfileAtag.appendChild(viewProfileButton);
  tempDiv.appendChild(viewProfileAtag);
  navbarDiv.appendChild(tempDiv);

  // 로그아웃 버튼
  logoutBtn.classList.add("login-only-button");
  logoutBtn.innerHTML = "로그아웃";
  logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    location.reload();
  });

  tempDiv.appendChild(logoutBtn);
  navbarDiv.appendChild(tempDiv);
}

// 스크롤 이벤트 처리
document.addEventListener('scroll', () => {
  if (window.scrollY > navBarHeight) {
    navBar.classList.add("navbar-draw-color");

  } else {
    navBar.classList.remove("navbar-draw-color");
  }

  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// 스크롤 맨 위로 이동 이벤트 처리
scrollTopButton.addEventListener("click", () => {
  document.body.scrollIntoView({
    behavior: "smooth"
  });
});

// 메뉴 토글 이벤트 처리
navbarButton.addEventListener('click', () => {
  navMenu.classList.toggle("open");
});

// 모달창 열기/닫기 이벤트
const modalOpen = () => {
  modal.classList.remove("hidden");
}

const modalClose = () => {
  modal.classList.add("hidden");
}

document.querySelector("#login-modal-open-button").addEventListener("click", modalOpen);
document.querySelector("#modal-close-button").addEventListener("click", modalClose);
document.querySelector(".background").addEventListener("click", modalClose);

// 회원가입, 아이디 찾기, 비밀번호 찾기 버튼 이벤트
findIdBtn.addEventListener("click", () => {
  location.href = "/find-id";
});

findPwBtn.addEventListener("click", () => {
  location.href = "/user-validate";
});

signupBtn.addEventListener("click", () => {
  location.href = "/signup";
});

// 로그인 유효성 검사
const validate = () => {
  const idValue = idInput.value;
  const pwValue = pwInput.value;

  if (idValue === "" || pwValue === "") {
    alert("아이디 또는 비밀번호를 입력해주세요");
    return false;
  }

  if (idValue.length > 10 || pwValue.length > 20) {
    alert("아이디 또는 비밀번호의 길이가 너무 깁니다");
    return false;
  }

  return true;
}

// 로그인 버튼 이벤트
const clickLogin = () => {
  const isValidateLoginValue = validate();
  if (isValidateLoginValue) {
    loginFetch();
  }
}

const loginFetch = async () => {
  try {
    const id = idInput.value;
    const pw = pwInput.value;

    const res = await fetch("/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        loginId: id,
        pw: pw
      })
    });

    const json = await res.json();
    if (json.success) {
      const userPk = json.message;
      sessionStorage.setItem("loginUserSession", userPk);
      location.reload();

    } else {
      alert("로그인 실패: " + json.message);
      clearInputFields();
    }

  } catch (error) {
    alert(error);
  }
}

const clearInputFields = () => {
  idInput.value = "";
  pwInput.value = "";
};
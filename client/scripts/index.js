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

// 요소의 높이 계산
const navBarHeight = navBar.getBoundingClientRect().height;
const homeHeight = home.getBoundingClientRect().height;

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
  location.href = "../pages/find-id.html";
});

findPwBtn.addEventListener("click", () => {
  location.href = "../pages/user-validate.html";
});

signupBtn.addEventListener("click", () => {
  location.href = "../pages/signup.html";
})

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
    fetchData();
  }
}


const fetchData = async () => {
  try {
    const id = idInput.value;
    const pw = pwInput.value;

    const res = await fetch("/account/login", {
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

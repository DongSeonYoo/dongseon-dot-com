// getBoundingClientRect: 엘리먼트의 위치값을 전부 가지고있음
const navBar = document.getElementById("nav-bar");
const navBarHeight = navBar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  // console.log(window.scrollY)
  // navBarHeight : 96

  if (window.scrollY > navBarHeight) {
    navBar.classList.add("navbar-draw-color");

  } else {
    navBar.classList.remove("navbar-draw-color");
  }
})

// home 컨테이너의 높이를 계산하고 home에 투명도를 준다
const home = document.getElementById('home-container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// scrollIntoView(): 특정 위치로 이동시켜주는 함수
const scrollTopButton = document.querySelector(".scroll-top-button");
scrollTopButton.addEventListener("click", () => {
  document.body.scrollIntoView({
    behavior: "smooth"
  });
});

const navMenu = document.getElementById("nav-menu");
const navbarButton = document.querySelector(".navbar-toggle-button");
navbarButton.addEventListener('click', () => {
  navMenu.classList.toggle("open")
})

const modalOpen = () => {
  document.querySelector(".modal").classList.remove("hidden");
}

const modalClose = () => {
  document.querySelector(".modal").classList.add("hidden");
}

document.querySelector("#login-modal-open-button").addEventListener("click", modalOpen);

document.querySelector("#modal-close-button").addEventListener("click", modalClose);
document.querySelector(".background").addEventListener("click", modalClose);

function validate() {
  const idValue = document.getElementById("id-form").value;
  const pwValue = document.getElementById("pw-form").value;

  if (idValue === "" || pwValue === "") {
    alert("아이디 또는 비밀번호를 입력해주세요");
    return false;
  }

  return true;
}

const signupBtn = document.querySelector("#sign-up-button");
if (signupBtn !== null) {
  signupBtn.addEventListener("click", () => {
    location.href = "../signup/signup.jsp";
  })
}

const findIdBtn = document.querySelector("#find-id-button");
findIdBtn.addEventListener("click", () => {
  location.href = "../pages/find-id.html";
})
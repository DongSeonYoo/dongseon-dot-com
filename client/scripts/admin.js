const logSection = document.getElementById("log-section");
const recentOption = document.getElementById("recent-option");
const oldOption = document.getElementById("old-option");
const prevPageBtn = document.getElementById("prev-page-button");
const nextPageBtn = document.getElementById("next-page-button");
const logCountDiv = document.getElementById("log-count");

let apiCounts;
let maxPageCount;
let selectedOrderValue = "recent";
let selectedMethodValue = "all";
let currentPage = 1;

window.onload = async () => {
  // 관리자 권한 체크
  try {
    await adminAuthCheck();
    const logsCount = await getDocumentCountFetch();
    apiCounts = logsCount;
    maxPageCount = Math.ceil(logsCount / 16);
    updatePageMoveButton();
    logCountDiv.innerHTML = logsCount + "개의 로그";

    await loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
  } catch (error) {
    console.log(error);
  }
}

const onchangePage = (page) => {
  currentPage = page;
  logSection.innerHTML = "";
  loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
  updatePageMoveButton();
}

const updatePageMoveButton = () => {
  if (currentPage === 1) {
    prevPageBtn.disabled = true;
  } else {
    prevPageBtn.disabled = false;
  }

  if (currentPage === maxPageCount) {
    nextPageBtn.disabled = true;
  } else {
    nextPageBtn.disabled = false;
  }
}

const getDocumentCountFetch = async () => {
  const response = await fetch("/api/log/count");
  const json = await response.json();

  if (response.status === 200) {
    return json.data;
  }
}

const loadApiFetch = async (order, method, page) => {
  try {
    const response = await fetch(`/api/log?order=${order}&method=${method}&page=${page}`);
    const json = await response.json();

    if (response.status === 200) {
      if (json.data) {
        const responsedData = json.data;
        responsedData.forEach(data => makeTag(data));
      }
    }

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

const makeTag = (data) => {
  const logDiv = document.createElement("div");
  logDiv.classList.add("log");

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("time");
  timeSpan.textContent = data.time;

  const ipSpan = document.createElement("span");
  ipSpan.classList.add("ip");
  ipSpan.textContent = data.ip;

  const statusSpan = document.createElement("span");
  statusSpan.classList.add("status");
  statusSpan.textContent = data.status;

  const methodSpan = document.createElement("span");
  methodSpan.classList.add("method");
  methodSpan.textContent = data.method;

  const apiSpan = document.createElement("span");
  apiSpan.classList.add("api");
  apiSpan.textContent = truncateData(JSON.stringify(data.api));

  const reqSpan = document.createElement("span");
  reqSpan.classList.add("request");
  reqSpan.textContent = truncateData(JSON.stringify(data.req));
  if (reqSpan.textContent === "{}") {
    reqSpan.textContent = "none";
  }

  const resSpan = document.createElement("span");
  resSpan.classList.add("response");
  resSpan.textContent = truncateData(JSON.stringify(data.res));

  logDiv.appendChild(timeSpan);
  logDiv.appendChild(ipSpan);
  logDiv.appendChild(statusSpan);
  logDiv.appendChild(methodSpan);
  logDiv.appendChild(apiSpan);
  logDiv.appendChild(reqSpan);
  logDiv.appendChild(resSpan);

  logSection.appendChild(logDiv);
}

// 요청과 응답 데이터가 너무 길 경우 줄여서 표시
const truncateData = (data) => {
  const maxLength = 28;
  if (data.length > maxLength) {
    return data.slice(0, maxLength) + "...";
  }
  return data;
}

const onchangeOrderOption = () => {
  const orderOptionList = document.getElementById("order-option-list");
  selectedOrderValue = orderOptionList[orderOptionList.selectedIndex].value;

  currentPage = 1;
  updatePageMoveButton();

  logSection.innerHTML = "";
  loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
}

const onchangeMethodOption = () => {
  const methodOptionList = document.getElementById("method-option-list");
  selectedMethodValue = methodOptionList[methodOptionList.selectedIndex].value;

  currentPage = 1;
  updatePageMoveButton();

  logSection.innerHTML = "";
  loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
}

const onclickPrevButton = () => {
  if (currentPage > 1) {
    onchangePage(currentPage - 1);
  }
}

const onclickNextButton = () => {
  if (currentPage < maxPageCount) {
    onchangePage(currentPage + 1);
  }
}

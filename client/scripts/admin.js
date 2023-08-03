const logSection = document.getElementById("log-section");
const recentOption = document.getElementById("recent-option");
const oldOption = document.getElementById("old-option");
const prevPageBtn = document.getElementById("prev-page-button");
const nextPageBtn = document.getElementById("next-page-button");
const logCountDiv = document.getElementById("log-count");
const idSerchForm = document.getElementById("loginid-search-form");

let apiCounts;
let maxPageCount;
let selectedOrderValue = "recent";
let selectedMethodValue = "all";
let selectedSerchValue = "";
let currentPage = 1;

const data = {
    req: "",
    res: "",
};

window.onload = async () => {
    // 관리자 권한 체크
    try {
        await adminAuthCheck();
        const logsCount = await getDocumentCountFetch();
        apiCounts = logsCount;
        maxPageCount = Math.ceil(logsCount / 16);

        await loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
    } catch (error) {
        console.log(error);
    }
}

const onchangePage = (page) => {
    currentPage = page;
    loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
}

const updatePageMoveButton = () => {
    if (currentPage === 1) {
        prevPageBtn.disabled = true;
        return;
    }
    prevPageBtn.disabled = false;

    if (currentPage === maxPageCount) {
        nextPageBtn.disabled = true;
        return;
    }
    nextPageBtn.disabled = false;
}

const getDocumentCountFetch = async () => {
    const response = await fetch("/api/log/count");
    const json = await response.json();

    if (response.status === 200) {
        return json.data;
    }
}

const loadApiFetch = async (order, method, page, loginId = selectedSerchValue) => {
    try {
        const response = await fetch(`/api/log?order=${order}&method=${method}&page=${page}&loginId=${loginId}`);
        const json = await response.json();

        if (response.status === 200) {
            if (json.data) {
                logSection.innerHTML = "";
                const responsedData = json.data;
                responsedData.forEach(data => makeTag(data));
            }

            if (json.logCount) {
                apiCounts = json.logCount;
                maxPageCount = Math.ceil(apiCounts / 16);
                logCountDiv.innerHTML = apiCounts + "개의 로그";
                console.log(json.logCount);
            }
        }
        updatePageMoveButton();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

const makeTag = (data) => {
    const logDiv = document.createElement("div");
    logDiv.classList.add("log");
    logDiv.onclick = clickLog;

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

    const loginIdSpan = document.createElement("span");
    loginIdSpan.classList.add("loginId");
    if (data.loginId) {
        loginIdSpan.textContent = data.loginId;
    } else {
        loginIdSpan.textContent = "로그인 X";
    }

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

    const reqValue = document.createElement("input");
    reqValue.value = JSON.stringify(data.req);
    reqValue.type = 'hidden';

    const resValue = document.createElement("input");
    resValue.value = JSON.stringify(data.res);
    resValue.type = 'hidden';

    logDiv.appendChild(timeSpan);
    logDiv.appendChild(ipSpan);
    logDiv.appendChild(statusSpan);
    logDiv.appendChild(methodSpan);
    logDiv.appendChild(loginIdSpan);
    logDiv.appendChild(apiSpan);
    logDiv.appendChild(reqSpan);
    logDiv.appendChild(resSpan);
    logDiv.appendChild(reqValue);
    logDiv.appendChild(resValue);

    logSection.appendChild(logDiv);
}

const clickLog = (e) => {
    console.log(e.target)
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
    loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
}

const onchangeMethodOption = () => {
    const methodOptionList = document.getElementById("method-option-list");

    selectedMethodValue = methodOptionList[methodOptionList.selectedIndex].value;
    currentPage = 1;
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

const onclickSerchButton = () => {
    selectedSerchValue = idSerchForm.value;
    if (selectedSerchValue) {
        console.log(selectedSerchValue);
        loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage, selectedSerchValue);
    }
}

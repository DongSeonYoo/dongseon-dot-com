const logSection = document.getElementById("log-section");

const a = async () => {
  try {
    const result = await fetch("/api/log");
    const json = await result.json();

    if (json.isSuccess) {
      json.data.forEach(data => {
        makeTag(data);
      });
    }

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

a();

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
  apiSpan.textContent = data.api;

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

// truncateData 함수를 사용하여 요청과 응답 데이터를 너무 길 경우 줄여서 표시합니다.
const truncateData = (data) => {
  const maxLength = 15;
  if (data.length > maxLength) {
    return data.slice(0, maxLength) + "...";
  }
  return data;
}

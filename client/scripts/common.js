const setCookie = (name, value) => {
  document.cookie = name + "=" + (value || "");
}

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

const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
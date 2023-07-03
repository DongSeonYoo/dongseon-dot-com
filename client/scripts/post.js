const url = window.location.href.split("/");
const pathVariable = url[url.length - 1];

console.log(pathVariable);

specificPostFetch();

async function specificPostFetch() {
  const res = await fetch("/api/post/" + pathVariable);
  const json = await res.json();

  console.log(json.message);
}
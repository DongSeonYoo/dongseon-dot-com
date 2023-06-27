const express = require("express");
const app = express();

// db connect
const db = require("./database/connect/mariadb");
db.connect();

app.use(express.json());

const accountApi = require("./router/account");
app.use("/account", accountApi);

const postApi = require("./router/post");
app.use("/post", postApi);

const commentApi = require("./router/comment");
app.use("/comment", commentApi);

app.listen(8000, () => {
  console.log("8000번 포트에서 기다리는중");
});
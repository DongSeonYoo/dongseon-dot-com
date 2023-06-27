const express = require("express");
const app = express();

const db = require("./database/connect/mariadb");

const accountApi = require("./router/api/account/account");
const postApi = require("./router/api/post/post");
const commentApi = require("./router/api/comment/comment");

app.use(express.json());
app.use("/account", accountApi);
app.use("/post", postApi);
app.use("/comment", commentApi);

db.connect();

module.exports = app;
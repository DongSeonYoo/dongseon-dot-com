const express = require("express");
const app = express();

const db = require("./database/connect/mariadb");

const accountApi = require("./router/account");
const postApi = require("./router/post");
const commentApi = require("./router/comment");

app.use("/account", accountApi);
app.use("/post", postApi);
app.use("/comment", commentApi);

app.use(express.json());
db.connect();

module.exports = app;
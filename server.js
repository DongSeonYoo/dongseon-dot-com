const express = require("express");
const app = express();

const db = require("./src/database/connect/mariadb");

const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");

app.use(express.json());
app.use("/account", accountApi);
app.use("/post", postApi);
app.use("/comment", commentApi);

db.connect();

module.exports = app;
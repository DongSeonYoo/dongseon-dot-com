const express = require("express");
const app = express();

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");

app.use(express.json());
app.use(express.static("client/"));

app.use("/", pagesRoute);

app.use("/account", accountApi);
app.use("/post", postApi);
app.use("/comment", commentApi);

module.exports = app;
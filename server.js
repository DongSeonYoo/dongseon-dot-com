const express = require("express");
const app = express();

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");

app.use(express.json());
app.use(express.static("client/"));

app.use("/", pagesRoute);

app.use("/api/account", accountApi);
app.use("/api/post", postApi);
app.use("/api/comment", commentApi);

module.exports = app;
const express = require("express");
const app = express();
const path = require("path");
const CLIENT_PATH = path.join(__dirname, './client/pages');

const loggingSetting = require('./src/middleware/loggingSetting');
const errorHandling = require("./src/middleware/errorHandling");

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");
const authApi = require("./src/router/auth");
const logApi = require("./src/router/log");

require("dotenv").config();

// 전역 미들웨어
app.use(express.json());
app.use(express.static("client/"));
app.use(loggingSetting());

// 페이지 미들웨어
app.use("/", pagesRoute);

// api 호출 미들웨어
app.use("/api/auth", authApi);
app.use("/api/account", accountApi);
app.use("/api/post", postApi);
app.use("/api/comment", commentApi);
app.use("/api/log", logApi);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(CLIENT_PATH, '404.html'))
});

// error catch middleware
app.use(errorHandling());

module.exports = app;

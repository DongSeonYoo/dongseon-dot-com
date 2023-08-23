const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const loggingSetting = require('./src/middleware/loggingSetting');
const errorHandling = require("./src/middleware/errorHandling");

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");
const authApi = require("./src/router/auth");
const logApi = require("./src/router/log");
const loginCountApi = require("./src/router/loginCount");
const listApi = require("./src/router/list");

require("./src/module/schedule");
require("dotenv").config();

// 전역 미들웨어
app.use(express.json());
app.use(cookieParser());
app.use(express.static("client/"));
app.use(loggingSetting());

// 페이지 미들웨어
app.use("/", pagesRoute);

// api 호출 미들웨어
app.use("/api/auth", authApi);
app.use("/api/account", accountApi);
app.use("/api/post", postApi);
app.use("/api/comment", commentApi);
app.use("/api/loginCount", loginCountApi);
app.use("/api/list", listApi);

// 로깅 미들웨어
app.use("/api/log", logApi);

// 404 error handling
app.use((req, res, next) => {
    const error = new Error();
    error.status = 404;
    next(error);
});

// error catch middleware
app.use(errorHandling());

module.exports = app;

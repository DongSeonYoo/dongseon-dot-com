const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const redisClient = require("../config/database/redis");

const pagesRoute = require("./router/pages");
const accountApi = require("./router/account");
const postApi = require("./router/post");
const commentApi = require("./router/comment");
const replyApi = require("./router/reply");
const authApi = require("./router/auth");
const logApi = require("./router/log");
const loginCountApi = require("./router/loginCount");
const listApi = require("./router/list");
const searchApi = require("./router/search");
const uploaderApi = require("./router/uploader");

const loggingSetting = require('./middleware/loggingSetting');
const errorHandling = require("./middleware/errorHandling");

const passport = require("passport");
const passportConfig = require("./module/passport");

require("./module/schedule");
require("dotenv").config();

// redis 연결
redisClient.connect();

// 전역 미들웨어
app.use(express.json());
app.use(cookieParser());
app.use(express.static("client/"));
app.use(loggingSetting());
passportConfig();
app.use(passport.initialize());

// 페이지 미들웨어
app.use("/", pagesRoute);

// api 호출 미들웨어
app.use("/api/auth", authApi);
app.use("/api/search", searchApi);
app.use("/api/account", accountApi);
app.use("/api/post", postApi);
app.use("/api/comment", commentApi);
app.use("/api/reply", replyApi);
app.use("/api/loginCount", loginCountApi);
app.use("/api/uploader", uploaderApi);
app.use("/api/list", listApi);

// 로깅 미들웨어
app.use("/api/log", logApi);

// error catch middleware
app.use(errorHandling());

module.exports = app;

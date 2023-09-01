const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const redisClient = require("./config/database/redis");

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");
const authApi = require("./src/router/auth");
const logApi = require("./src/router/log");
const loginCountApi = require("./src/router/loginCount");
const listApi = require("./src/router/list");

const loggingSetting = require('./src/middleware/loggingSetting');
const errorHandling = require("./src/middleware/errorHandling");

const https = require("https");
const fs = require("fs");

const path = require("path");

require("./src/module/schedule");
require("dotenv").config();

// SSL 옵션
// const options = {
//     "key": fs.readFileSync(path.join(__dirname, "./ssl/key.pem")),
//     "cert": fs.readFileSync(path.join(__dirname, "./ssl/cert.pem")),
//     "passphrase": "1234"
// };

// redis 연결
redisClient.connect();

// 전역 미들웨어
app.use(express.json());
app.use(cookieParser());
app.use(express.static("client/"));
app.use(loggingSetting());
// CORS
// app.use((req, res) => {
//     res.header("Access-Control-Allow-Origin", "*"); // 모든 도메인 허용
// });

// 페이지 미들웨어
app.use("/", pagesRoute);

// https 연결
// app.get("*", (req, res, next) => {
//     const protocol = req.protocol;
//     if (protocol === "https") {
//         next();
//     } else {
//         const destination = `https://${req.hostname}:8443/`;
//         res.redirect(destination);
//     }
// });

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

// https.createServer(options, app).listen(8443, '0.0.0.0', () => {
//     console.log("8443포트에서 https 웹 서버 실행");
// });

module.exports = app;

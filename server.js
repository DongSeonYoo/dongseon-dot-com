const express = require("express");
const app = express();
const path = require("path");
const CLIENT_PATH = path.join(__dirname,'./client/pages');
const logging = require("./src/module/logging");

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");
const logApi = require("./src/router/log");
require("dotenv").config();

app.use(express.json());
app.use(express.static("client/"));
app.use((req, res, next) => {
  const originResultSend = res.send;

  res.send = function(result) {
    // if(typeof result !== 'string'){} ?
    if(typeof result !== 'string' && req.originalUrl.split('/')[2] !== "log") {
      logging(req, res, result);
    }

    return originResultSend.call(this, result);
  }
  next();
});

app.use("/", pagesRoute);
app.use("/api/account", accountApi);
app.use("/api/post", postApi);
app.use("/api/comment", commentApi);
app.use("/api/log", logApi);

// 404 error handling
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_PATH, '404.html'))
});

// 500 error catch middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500);
});

module.exports = app;

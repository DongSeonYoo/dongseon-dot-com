const express = require("express");
const app = express();

const morgan = require("morgan");
const client = require("mongodb").MongoClient;

const pagesRoute = require("./src/router/pages");
const accountApi = require("./src/router/account");
const postApi = require("./src/router/post");
const commentApi = require("./src/router/comment");

app.use(express.json());
app.use(express.static("client/"));

app.use(async (req, res, next) => {
  let connect = null;

  try {
    connect = await client.connect("mongodb://localhost:27017");
    const document = {
      "ip": req.ip,
      "time": new Date().toISOString(),
      "method": req.method,
      "path": req.path,
    }

    await connect.db("logs").collection("api_logs").insertOne(document);
    
  } catch (error) {
    console.log("logs.api_logs Error: " + error.message);

  } finally {
    if (connect) {
      await connect.close();
    }
    next();
  }
})

app.use((req, res, next) => {
  console.log(req);
  console.log(res);
  next();
})
app.use("/", pagesRoute);

app.use("/api/account", accountApi);
app.use("/api/post", postApi);
app.use("/api/comment", commentApi);

module.exports = app;
const router = require("express").Router();
const mongoClient = require("mongodb").MongoClient;
const exception = require("../module/exception");

require("dotenv").config();

router.get("/", async (req, res, next) => {
  let { order, method, page } = req.query;
  const ITEMS_PER_PAGE = 15;
  const result = {
    data: "",
    message: ""
  }

  let connect = null;
  try {
    // request값 validater
    exception(order, "order").checkInput().checkLength(1, 6);
    exception(method, "method").checkInput().checkLength(1, 6);
    exception(page, "page").checkInput().isNumber();

    if (order === 'recent') {
      order = 1;
    } else if (order === 'old') {
      order = -1;
    }
    if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
      method = { "method": method };
    } else {
      method = {};
    }

    // db연결
    connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);

    // 쿼리 실행
    const cursor = await connect.db().collection("api_logs").find(method).sort({"_id": order})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    const data = await cursor.toArray();
    result.data = data;

  } catch (error) {
    console.error(error);
    if (error.status === 400) {
      result.message = error.message;
      res.status(400);
    } else {
      result.message = error.message;
      next(new Error("500 Error!"));
    }

  } finally {
    if (connect) connect.close();
    res.send(result);
  }
});

router.get("/count", async (req, res, next) => {
  const result = {
    data: "",
    message: ""
  }
  let connect = null;

  try {
    connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);
    const data = await connect.db().collection("api_logs").countDocuments();

    result.data = data;

  } catch (error) {
    result.message = error.message;
    next(new Error("500 Error!"));
    
  } finally {
    if (connect) connect.close();
    res.send(result);
  }
})

module.exports = router;
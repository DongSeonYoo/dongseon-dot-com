const router = require("express").Router();
const mongoClient = require("mongodb").MongoClient;
require("dotenv").config();

router.get("/", async (req, res) => {
  const result = {
    isSuccess: false,
    data: "",
  }

  let connect = null;
  try {
    connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);
    const cursor = await connect.db().collection("api_logs").find();
    const data = await cursor.toArray();
    
    result.isSuccess = true;
    result.data = data;

  } catch (error) {
    console.error(error);
    result.message = error.message;

  } finally {
    if (connect) connect.close();
    res.send(result);
  }
});

module.exports = router;
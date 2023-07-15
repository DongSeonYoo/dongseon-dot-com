const mongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const logging = async (req, res, resBody) => {
  // const reqObj = {
  //   type: "request",
  //   time: new Date(),
  //   body: req.body
  // }
  // const resObj = {
  //   type: "response",
  //   time: new Date(),
  //   body: resBody
  // }
  const document = {
    ip: req.ip,
    method: req.method,
    api: req.originalUrl,
    req: req.body,
    res: resBody
  }
  let connect = null;
  
  try {
    connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);
    await connect.db().collection("api_logs").insertOne(document);

  } catch (error) {
    console.log("api logger ERROR: " + error.message);

  } finally {
    if (connect) connect.close();
  }
}

module.exports = logging;
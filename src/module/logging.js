const mongoClient = require("mongodb").MongoClient;
const moment = require("moment");
const momentTimeZone = require("moment-timezone");

require("dotenv").config();
// 한국시간 설정
momentTimeZone.tz.setDefault("Asia/Seoul");

const logging = async (req, res, resBody) => {
    // document 준비
    const document = {
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        ip: req.ip,
        status: res.statusCode,
        method: req.method,
        loginId: req.decoded?.loginId || "",
        api: req.originalUrl,
        req: req.body,
        res: resBody
    }

    let connect = null;
    try {
        connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);
        await connect
            .db()
            .collection("api_logs")
            .insertOne(document);

    } catch (error) {
        console.log("api logger ERROR: " + error);

    } finally {
        if (connect) connect.close();
    }
}

module.exports = logging;

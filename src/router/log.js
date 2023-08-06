const router = require("express").Router();
const mongoClient = require("mongodb").MongoClient;
const redisClient = require("redis").createClient();

const exception = require("../module/exception");
const { maxItemPerPage } = require("../module/global");
const adminAuth = require("../middleware/adminAuth");
const { maxLoginIdLength } = require("../module/global");
require("dotenv").config();

// 한 페이지의 로그와 전체 로그의 개수를 보내주는 api
router.get("/", adminAuth, async (req, res, next) => {
    let { order, method, page, loginId = "" } = req.query;
    let queryOption;
    const result = {
        data: {},
    };

    let connect = null;
    try {
        exception(order, "order").checkInput().checkLength(1, 6);
        exception(method, "method").checkInput().checkLength(0, 6);
        exception(page, "page").checkInput().isNumber().checkLength(1, 6);
        exception(loginId, "loginId").checkInput().checkLength(0, maxLoginIdLength);

        if (order === 'old') {
            order = 1;
        } else if (order === 'recent') {
            order = -1;
        }

        if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
            queryOption = { "method": method, "loginId": loginId };
        }
        if (method === 'all' && loginId) {
            queryOption = { "loginId": loginId };
        }
        if (method === 'all' && loginId === "") {
            queryOption = {};
        }
        if (method !== 'all' && loginId === "") {
            queryOption = { "method": method };
        }

        // db연결
        connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);

        // mongodb 쿼리 실행
        const logData = await connect
            .db()
            .collection("api_logs")
            .find(queryOption)
            .sort({ "_id": order })
            .skip((page - 1) * maxItemPerPage)
            .limit(maxItemPerPage)
            .toArray();
        const logCount = await connect
            .db()
            .collection("api_logs")
            .countDocuments(queryOption);

        // 결과 담아주자
        result.data.log = logData;
        result.data.logCount = logCount;
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (connect) connect.close();
    }
});

module.exports = router;
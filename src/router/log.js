const router = require("express").Router();
const mongoClient = require("mongodb").MongoClient;
const exception = require("../module/exception");
const { maxItemPerPage } = require("../module/global");
const adminAuth = require("../middleware/adminAuth");
const { maxLoginIdLength } = require("../module/global");
require("dotenv").config();

router.get("/", adminAuth, async (req, res, next) => {
    let { order, method, page, loginId = "" } = req.query;
    let queryOption;
    const result = {
        data: "",
    }
    console.log(`${method}, ${loginId === ""}`);

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
        // 쿼리 실행
        const cursor = await connect
            .db()
            .collection("api_logs")
            .find(queryOption)
            .sort({ "_id": order })
            .skip((page - 1) * maxItemPerPage)
            .limit(maxItemPerPage);

        const data = await cursor.toArray();
        result.data = data;

        const logCount = await connect
            .db()
            .collection("api_logs")
            .countDocuments(queryOption);

        result.logCount = logCount;

        res.send(result);

    } catch (error) {
        next(error);

    } finally {
        if (connect) connect.close();
    }
});

router.get("/count", adminAuth, async (req, res, next) => {
    const result = {
        data: "",
    }
    let connect = null;

    try {
        connect = await mongoClient.connect(process.env.MONGO_DB_LOGS);
        const data = await connect
            .db()
            .collection("api_logs")
            .countDocuments();

        result.data = data;
        res.send(result);

    } catch (error) {
        next(error);

    } finally {
        if (connect) connect.close();
    }
})

module.exports = router;
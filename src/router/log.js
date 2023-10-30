const router = require("express").Router();
const mongoClient = require("mongodb").MongoClient;
const redisClient = require("../config/database/redis");

const exception = require("../module/exception");
const adminAuth = require("../middleware/adminAuth");

const { maxItemPerPageOfLog, maxLoginIdLength } = require("../module/global");
const env = require('../config/env');

const redisRecentSearchKey = env.REDIS_RECENT_SEARCH;

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
        exception(loginId, "loginId").checkLength(0, maxLoginIdLength);

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
        connect = await mongoClient.connect(env.MONGO_DB_LOGS);

        // mongodb 쿼리 실행
        const logData = await connect
            .db()
            .collection("api_logs")
            .find(queryOption)
            .sort({ "_id": order })
            .skip((page - 1) * maxItemPerPageOfLog)
            .limit(maxItemPerPageOfLog)
            .toArray();
        const logCount = await connect
            .db()
            .collection("api_logs")
            .countDocuments(queryOption);

        // redis 쿼리 실행
        if (loginId.length !== 0) {
            const timestamp = Math.floor(Date.now() / 1000);
            await redisClient.zAdd(redisRecentSearchKey, {
                score: timestamp,
                value: loginId
            });
            await redisClient.ZREMRANGEBYRANK(redisRecentSearchKey, 0, -6);
        }

        // 결과 담아주자
        result.isSuccess = true;
        result.data.log = logData;
        result.data.logCount = logCount;
        res.send(result);

    } catch (error) {
        next(error);

    } finally {
        if (connect) connect.close();
    }
});

// 최근 5개 검색 목록을 가져오는 api
router.get("/recentSearch", adminAuth, async (req, res, next) => {
    const result = {
        data: null,
    };

    try {
        const resultData = await redisClient.zRange(redisRecentSearchKey, 0, -1);

        result.data = resultData;
        res.send(result);

    } catch (error) {
        next(error);
    }
});

module.exports = router;

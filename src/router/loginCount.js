const express = require("express");
const router = express.Router();

const pool = require("../../config/database/postgresql");

router.get("/hour", async (req, res, next) => {
    const result = {
        isSuccess: false,
        data: null,
    };

    try {
        const count = await req.redisClient.sCard("dailyLoginUser");
        result.data = count;
        result.isSuccess = true;
        res.send(result);
        
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/total", async (req, res, next) => {
    const result = {
        isSuccess: false,
        data: null,
    };
    let pgPool = null;

    try {
        pgPool = await pool.connect();

        const sql = "SELECT count(*) FROM logged_in_user";
        const data = await pgPool.query(sql);
        result.isSuccess = true;
        result.data = data.rows[0].count;
        res.send(result);
    } catch (error) {
        console.error(error);
        next(error);
    } finally {
        pgPool.release();
    }
})

module.exports = router;
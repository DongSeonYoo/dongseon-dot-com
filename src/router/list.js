const express = require("express");
const router = express.Router();
const exception = require("../module/exception");
const pool = require("../../config/database/postgresql");
const { maxUserIdLength } = require("../module/global");

// GET
// 해당 유저의 게시글 내역을 보여주자
router.get("/post/:userId", async (req, res, next) => {
    const { userId } = req.params;
    const result = {
        message: "",
        data: null
    }
    let pgPool = null;

    try {
        exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
        pgPool = await pool.connect();
        const sql = `SELECT id, title, content, created_date, updated_date, image_key 
                        FROM post_TB 
                        WHERE user_id = $1`;
        const params = [userId];
        const data = await pgPool.query(sql, params);

        if (data.rows.length !== 0) {
            result.data = data.rows;
        } else {
            result.message = "해당 유저의 게시글이 존재하지 않습니다";
        }
        res.send(result);


    } catch (error) {
        next(error);

    } finally {
        if (pgPool) {
            pgPool.release();
        }
    }
});

router.get("/comment/:userId", async (req, res, next) => {
    const { userId } = req.params;
    const result = {
        message: "",
        data: null
    }
    let pgPool = null;

    try {
        exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
        
        pgPool = await pool.connect();
        const sql = `SELECT content, created_date, updated_date 
                        FROM comment_TB 
                        WHERE user_id = $1`;
        const params = [userId];
        const data = await pgPool.query(sql, params);

        if (data.rows.length !== 0) {
            result.data = data.rows[0];
        } else {
            result.message = "해당 유저의 댓글이 존재하지 않습니다";
        }
        res.send(result);


    } catch (error) {
        next(error);

    } finally {
        if (pgPool) {
            pgPool.release();
        }
    }
});

module.exports = router;
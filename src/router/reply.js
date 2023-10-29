const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const exception = require("../module/exception");
const authGuard = require("../middleware/authGuard");

// 답글 불러오기
router.get("/:commentId", async (req, res, next) => {
    const { commentId } = req.params;
    const result = {
        data: null,
    }

    try {
        exception(commentId, "commentId").checkInput();
        const sql = "SELECT * FROM reply_tb WHERE comment_id = $1";
        const params = [commentId];
        const data = await pool.query(sql, params);
        result.data = data.rows[0];
        res.send(result);

    } catch (error) {
        next(error);
    }
});

// 답글 개수 가져오기
router.get("/:commentId/count", async (req, res, next) => {
    const { commentId } = req.params;
    const result = {
        data: null,
    }

    try {
        exception(commentId, "commentId").checkInput();
        const sql = "SELECT COUNT(*) FROM reply_tb WHERE comment_id = $1";

        const params = [commentId];
        const data = await pool.query(sql, params);
        result.data = data.rows[0];
        res.send(result);

    } catch (error) {
        next(error);
    }
});

// 답글 작성
router.post("/", authGuard, async (req, res, next) => {
    const { userPk } = req.decoded;
    const { commentId, content } = req.body;
    const result = {
        isSuccess: false,
        data: {}
    }

    try {
        exception(commentId, "commentId").checkInput();
        exception(content, "content").checkInput();
        const sql = "INSERT INTO reply_tb (user_id, comment_id, content) VALUES ($1, $2, $3) RETURNING id";
        const params = [userPk, commentId, content];
        const data = await pool.query(sql, params);
        if (data.rows.length !== 0) {
            result.isSuccess = true;
            result.data = data.rows[0].id;
        }

        res.send(result);

    } catch (error) {
        next(error);
    }
});

// 답글 수정
router.put("/", authGuard, async (req, res, next) => {
    const { userPk } = req.decoded;
    const { replyId, content } = req.body;
    const result = {
        isSuccess: false,
        data: {}
    }

    try {
        exception(replyId, "replyId").checkInput();
        exception(content, "content").checkInput();
        const sql = "UPDATE reply_tb SET content = $1 WHERE id = $2 AND user_id = $3";
        const params = [content, replyId, userPk];
        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
        }
        res.send(result);

    } catch (error) {
        next(error);
    }
});

// 답글 삭제
router.delete("/", authGuard, async (req, res, next) => {
    const { userPk } = req.decoded;
    const { replyId } = req.body;
    const result = {
        isSuccess: false,
        data: {}
    }

    try {
        exception(replyId, "replyId").checkInput();
        const sql = "DELETE FROM reply_tb WHERE id = $1 AND user_id = $2";
        const params = [replyId, userPk];
        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
        }
        res.send(result);

    } catch (error) {
        next(error);
    }
});

module.exports = router;

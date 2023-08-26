const express = require("express");
const router = express.Router();
const pool = require("../../config/database/postgresql");
const exception = require("../module/exception");
const { maxPostIdLength, maxCommentIdLength, maxCommentContentLength } = require("../module/global");
const authGuard = require("../middleware/authGuard");


// 댓글 생성 api
// postId, userId, content
// POST
router.post("/", authGuard, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { postId, content } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };
    let pgPool = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(content, "content").checkInput().checkLength(1, maxCommentContentLength);

        pgPool = await pool.connect();
        const sql = `INSERT INTO comment_TB (post_id, user_id, content) VALUES ($1, $2, $3)`;
        const params = [postId, userId, content];

        const data = await pgPool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (pgPool) {
            pgPool.release();
        }
    }
});

// 댓글 조회 api
// :postId
// GET
router.get("/post/:postId", authGuard, async (req, res, next) => {
    const { postId } = req.params;
    const result = {
        data: null,
        message: ""
    };
    let pgPool = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

        pgPool = await pool.connect();
        const sql = `SELECT 
                      comment_TB.*, 
                      user_TB.name AS "authorName" 
                    FROM 
                      comment_TB 
                    JOIN 
                      user_TB 
                    ON 
                      comment_TB.user_id = user_TB.id 
                    WHERE 
                      post_id = $1
                    ORDER BY id DESC`;
        const params = [postId];

        const data = await pgPool.query(sql, params);
        // 만약 해당 게시글에 댓글이 존재하면?
        if (data.rows.length !== 0) {
            result.data = data.rows;

            // 댓글이 존재하지 않으면? data = null
        } else {
            result.message = "해당 게시글에 댓글이 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (pgPool) {
            pgPool.release();
        }
    }
});

// 댓글 수정 api
// postId, commentId, userId, content
// PUT
router.put("/", authGuard, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { content, postId, commentId } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };
    let pgPool = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(commentId, "commentId").checkInput().isNumber().checkLength(1, maxCommentIdLength);
        exception(content, "content").checkInput().checkLength(1, maxCommentContentLength);

        pgPool = await pool.connect();
        const sql = "UPDATE comment_TB SET content = $1 WHERE post_id = $2 AND user_id = $3 AND id = $4";
        const params = [content, postId, userId, commentId];
        const data = await pgPool.query(sql, params)
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            result.message = "댓글 수정 성공";
        } else {
            result.message = "해당하는 댓글이 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (pgPool) {
            pgPool.release();
        }
    }
});

// 댓글 삭제 api
// postId, commentId, userId
// DELETE
router.delete("/", authGuard, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { postId, commentId } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };
    let pgPool = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(commentId, "commentId").checkInput().isNumber().checkLength(1, maxCommentIdLength);

        pgPool = await pool.connect();
        const sql = "DELETE FROM comment_TB WHERE post_id = $1 AND user_id = $2 AND id = $3";
        const params = [postId, userId, commentId];
        const data = await pgPool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
        } else {
            result.message = "해당하는 댓글이 존재하지 않습니다";
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

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
// router.get("/user/:userLoginId", commentCtrl.readUserComment);

module.exports = router;
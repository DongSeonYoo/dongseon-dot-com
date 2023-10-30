const express = require("express");
const router = express.Router();
const pool = require("../config/database/postgresql");
const exception = require("../module/exception");
const { maxPostIdLength, maxCommentIdLength, maxCommentContentLength } = require("../module/global");
const authGuard = require("../middleware/authGuard");
const { BadRequestException } = require('../module/customError');


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

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(content, "content").checkInput().checkLength(1, maxCommentContentLength);

        const sql = `INSERT INTO comment_TB (post_id, user_id, content) VALUES ($1, $2, $3)`;
        const params = [postId, userId, content];

        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
        }
        res.send(result);

    } catch (error) {
        if (error.constraint === "comment_tb_user_id_fkey") {
            return next(new BadRequestException("해당하는 유저가 존재하지 않습니다"));
        }

        if (error.constraint === "comment_tb_post_id_fkey") {
            return next(new BadRequestException("해당하는 게시글이 존재하지 않습니다"));
        }
        next(error);
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

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

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

        const data = await pool.query(sql, params);
        // 만약 해당 게시글에 댓글이 존재하면?
        if (data.rows.length !== 0) {
            result.data = data.rows;
        }

        res.send(result);

    } catch (error) {
        next(error);
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

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(commentId, "commentId").checkInput().isNumber().checkLength(1, maxCommentIdLength);
        exception(content, "content").checkInput().checkLength(1, maxCommentContentLength);

        const sql = "UPDATE comment_TB SET content = $1 WHERE post_id = $2 AND user_id = $3 AND id = $4";
        const params = [content, postId, userId, commentId];
        const data = await pool.query(sql, params)
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            result.message = "댓글 수정 성공";
            return res.send(result);
        }

        throw new BadRequestException("해당하는 댓글이 존재하지 않습니다");

    } catch (error) {
        next(error);
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

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(commentId, "commentId").checkInput().isNumber().checkLength(1, maxCommentIdLength);

        const sql = "DELETE FROM comment_TB WHERE post_id = $1 AND user_id = $2 AND id = $3";
        const params = [postId, userId, commentId];
        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            return res.send(result);
        }

        throw new BadRequestException("해당하는 댓글이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
// router.get("/user/:userLoginId", commentCtrl.readUserComment);

module.exports = router;
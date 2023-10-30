const express = require("express");
const router = express.Router();
const pool = require("../config/database/postgresql");
const exception = require("../module/exception");
const { maxPostIdLength, maxPostTitleLength, maxPostContentLength, maxItemPerPageOfCommunity } = require("../module/global");
const authGuard = require("../middleware/authGuard");

const AWS = require("../config/aws");
const { BadRequestException, NotFoundException } = require('../module/customError');
const env = require('../config/env');
const s3 = new AWS.S3();
require("dotenv").config();

// 게시글 작성 api
// userId, title, content
router.post("/", authGuard, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { title, content } = req.body;
    const { postImageLocation } = req.body;
    const result = {
        isSuccess: false,
        postId: "",
    };

    try {
        exception(title, "title").checkInput().checkLength(1, maxPostTitleLength);
        exception(content, "content").checkInput().checkLength(1, maxPostContentLength);

        const sql = `INSERT INTO 
                        post_TB (user_id, title, content, image_key) 
                        VALUES
                        ($1, $2, $3, $4) RETURNING id`;

        const params = [userId, title, content, postImageLocation];
        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            result.postId = data.rows[0].id;
        }

        res.send(result);

    } catch (error) {
        if (error.constraint === "post_tb_user_id_fkey") {
            return next(BadRequestException("해당하는 유저가 존재하지 않습니다"));
        }
        next(error);
    }
});


// 특정 페이지 게시글 조회 api
// GET
// 명사이자 단수형으로
router.get("/", async (req, res, next) => {
    const counterPage = maxItemPerPageOfCommunity;
    let { pageNumber } = req.query;
    const result = {
        data: null,
        message: ""
    };

    try {
        exception(pageNumber, "pageNumber").isNumber();

        const offset = Number(pageNumber * counterPage);
        const sql = `SELECT 
                        post_TB.id, post_TB.title, post_TB.content, post_TB.created_date, user_TB.name AS author_name
                        FROM post_TB
                        JOIN user_TB ON post_TB.user_id = user_TB.id 
                        ORDER BY created_date DESC OFFSET $1 LIMIT $2`;
        const params = [offset, counterPage];

        const data = await pool.query(sql, params);
        if (data.rows.length !== 0) {
            result.data = data.rows;
        } else {
            result.data = null;
            result.message = "게시글이 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        next(error);
    }
});

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId", authGuard, async (req, res, next) => {
    const { postId } = req.params;
    const result = {
        data: null,
    };

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

        const sql = `SELECT post_TB.*,
                        user_TB.name AS author_name,
                        user_TB.profile_img AS author_profile_img
                        FROM post_TB 
                        JOIN user_TB ON post_TB.user_id = user_TB.id 
                        WHERE post_TB.id = $1`;
        const params = [postId];

        const data = await pool.query(sql, params)
        if (data.rows.length !== 0) {
            result.data = data.rows[0];
            return res.send(result);
        }

        throw new NotFoundException("해당하는 페이지가 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

// 게시글 수정 api
// userId, postId, title, content
// PUT
router.put("/", authGuard, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { postId, title, content, images } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(title, "title").checkInput().checkLength(1, maxPostTitleLength);
        exception(content, "content").checkInput().checkLength(1, maxPostContentLength);

        const sql = "UPDATE post_TB SET title = $1, content = $2, image_key = $3 WHERE user_id = $4 AND id = $5";
        const params = [title, content, images, userId, postId];
        const data = await pool.query(sql, params);

        if (data.rowCount !== 0) {
            result.isSuccess = true;
            return res.send(result);
        }

        throw new BadRequestException("수정 실패, 해당하는 게시글이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

// 게시글 삭제 api
// userId, postId
// DELETE
router.delete("/", authGuard, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { postId } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };
    let pgClient = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

        pgClient = await pool.connect();

        pgClient.query("BEGIN");
        const sql = "DELETE FROM post_TB WHERE id = $1 AND user_id = $2 RETURNING image_key";
        const params = [postId, userId];
        const data = await pgClient.query(sql, params);

        if (data.rowCount !== 0) {
            const deletedImagekey = data.rows[0].image_key;
            // 이미지가 있는 게시글인 경우 s3에 업로드된 이미지도 함께 삭제
            if (deletedImagekey) {
                for (const imgPath of deletedImagekey) {
                    await s3.deleteObject({
                        Bucket: env.AWS_BUCKET_NAME,
                        Key: imgPath,
                        // 만약 s3 연결에 문제가 생겼다면? 에러를 던지고 롤백
                    }, (err, data) => {
                        if (err) {
                            throw err;
                        }
                    }).promise();
                }
            }
            result.isSuccess = true;
            pgClient.query("COMMIT");
            return res.send(result);
        }

        throw new BadRequestException("삭제 실패, 해당하는 게시글이 존재하지 않습니다");

    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK");
        }
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

// 모든 게시글의 수를 가져오는 api
// GET
router.get("/all/count", authGuard, async (req, res, next) => {
    const result = {
        data: null,
        message: ""
    };

    try {
        const sql = `SELECT COUNT(*)::int FROM post_TB`;

        const data = await pool.query(sql);
        if (data.rows.length !== 0) {
            result.data = data.rows[0].count;
        } else {
            result.message = "게시글이 존재하지 않습니다"
        }
        res.send(result);

    } catch (error) {
        next(error);
    }
});

// 특정 사용자가 작성한 게시글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// router.get("/user/:userLoginId", post.getUserPost);

module.exports = router;

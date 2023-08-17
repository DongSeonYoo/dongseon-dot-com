const express = require("express");
const router = express.Router();
const pool = require("../../config/database/postgresql");
const exception = require("../module/exception");
const { maxUserIdLength, maxPostIdLength, maxPostTitleLength, maxPostContentLength } = require("../module/global");
const loginAuth = require("../middleware/loginAuth");
const imageUploader = require("../middleware/imageUploader");

const AWS = require("../../config/s3");
const s3 = new AWS.S3();
require("dotenv").config();

// 게시글 작성 api
// userId, title, content
router.post("/", loginAuth, imageUploader, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const images = req.files;
    const { title, content } = req.body;
    const result = {
        isSuccess: false,
        postId: "",
    };
    let pgClient = null;

    try {
        exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
        exception(title, "title").checkInput().checkLength(1, maxPostTitleLength);
        exception(content, "content").checkInput().checkLength(1, maxPostContentLength);

        pgClient = await pool.connect();
        const sql = `INSERT INTO 
                        post_TB (user_id, title, content, image_key) 
                        VALUES
                        ($1, $2, $3, $4) RETURNING id`;

        const params = [userId, title, content, images.map(item => item.transforms[0].key)];
        const data = await pgClient.query(sql, params)
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            result.postId = data.rows[0].id;
        }

        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});


// 특정 페이지 게시글 조회 api
// GET
// 명사이자 단수형으로
router.get("/", loginAuth, async (req, res, next) => {
    const counterPage = 8;
    let { pageNumber } = req.query;
    const result = {
        data: null,
        message: ""
    };
    let pgClient = null;

    try {
        exception(pageNumber, "pageNumber").isNumber();

        const offset = Number(pageNumber * counterPage);
        pgClient = await pool.connect();
        const sql = `SELECT 
              post_TB.id, post_TB.title, post_TB.content, post_TB.created_date, user_TB.name AS author_name
              FROM post_TB
              JOIN user_TB ON post_TB.user_id = user_TB.id 
              ORDER BY created_date DESC OFFSET $1 LIMIT $2`;
        const params = [offset, counterPage];

        const data = await pgClient.query(sql, params);
        if (data.rows.length !== 0) {
            result.data = data.rows;
        } else {
            result.data = null;
            result.message = "게시글이 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId", loginAuth, async (req, res, next) => {
    const { postId } = req.params;
    const result = {
        data: null,
    };
    let pgClient = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

        pgClient = await pool.connect();
        const sql = `SELECT post_TB.*,
      user_TB.name AS author_name
      FROM post_TB 
      JOIN user_TB ON post_TB.user_id = user_TB.id 
      WHERE post_TB.id = $1`;
        const params = [postId];

        const data = await pgClient.query(sql, params)
        if (data.rows.length !== 0) {
            result.data = data.rows[0];
        } else {
            next();
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

// 게시글 수정 api
// userId, postId, title, content
// PUT
router.put("/", loginAuth, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { postId, title, content } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };
    let pgClient = null;

    try {
        exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(title, "title").checkInput().checkLength(1, maxPostTitleLength);
        exception(content, "content").checkInput().checkLength(1, maxPostContentLength);

        pgClient = await pool.connect();
        const sql = "UPDATE post_TB SET title = $1, content = $2 WHERE user_id = $3 AND id = $4";
        const params = [title, content, userId, postId];
        const data = await pgClient.query(sql, params);

        if (data.rowCount !== 0) {
            result.isSuccess = true;
        } else {
            result.isSuccess = false;
            result.message = "수정 실패, 해당하는 게시글이 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

// 게시글 삭제 api
// userId, postId
// DELETE
router.delete("/", loginAuth, async (req, res, next) => {
    const userId = req.decoded.userPk;
    const { postId } = req.body;
    const result = {
        isSuccess: false,
        message: ""
    };
    let pgClient = null;

    try {
        exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
        exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);

        pgClient = await pool.connect();

        pgClient.query("BEGIN");
        const sql = "DELETE FROM post_TB WHERE id = $1 AND user_id = $2 RETURNING image_key";
        const params = [postId, userId];
        const data = await pgClient.query(sql, params);

        if (data.rowCount !== 0) {
            result.isSuccess = true;
            const deletedImagekey = data.rows[0].image_key;
            for (const imgPath of deletedImagekey) {
                await s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: imgPath,
                // 만약 s3 연결에 문제가 생겼다면? 에러를 던지고 롤백
                }, (err, data) => {
                    if (err) {
                        throw err;
                    }
                }).promise();
            }

        } else {
            await pgClient.query("ROLLBACK")
            result.message = "해당하는 게시글이 존재하지 않습니다";
        }
        pgClient.query("COMMIT");
        res.send(result);

    } catch (error) {
        console.error(error);
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
router.get("/all/count", loginAuth, async (req, res, next) => {
    const result = {
        data: null,
        message: ""
    };
    let pgClient = null;

    try {
        pgClient = await pool.connect();

        const sql = `SELECT COUNT(*) FROM post_TB`;

        const data = await pgClient.query(sql);
        if (data.rows.length !== 0) {
            result.data = data.rows[0].count;
        } else {
            result.message = "게시글이 존재하지 않습니다"
        }
        res.send(result);

    } catch (error) {
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

// 특정 사용자가 작성한 게시글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// router.get("/user/:userLoginId", post.getUserPost);

module.exports = router;
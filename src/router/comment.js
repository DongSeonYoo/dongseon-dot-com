const express = require("express");
const router = express.Router();
const createClient = require("../../config/database/postgresql");
const exception = require("../module/exception");
const { maxUserIdLength, maxPostIdLength, maxCommentIdLength, maxCommentContentLength } = require("../module/global");
const loginAuth = require("../middleware/loginAuth");


// 댓글 생성 api
// postId, userId, content
// POST
router.post("/", loginAuth, async (req, res, next) => {
  const userId = req.decoded.userPk;
  const { postId, content } = req.body;
  const result = {
    isSuccess: false,
    message: ""
  };
  let client = null;

  try {
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
    exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
    exception(content, "content").checkInput().checkLength(1, maxCommentContentLength);

    client = createClient();
    await client.connect();
    const sql = `INSERT INTO comment_TB (post_id, user_id, content) VALUES ($1, $2, $3)`;
    const params = [postId, userId, content];

    const data = await client.query(sql, params);
    if (data.rowCount !== 0) {
      result.isSuccess = true;
    }
    res.send(result);

  } catch (error) {
    console.error(error);
    next(error);

  } finally {
    if (client) {
      await client.end();
    }
  }
});

// 댓글 조회 api
// :postId
// GET
router.get("/post/:postId", loginAuth, async (req, res, next) => {
  const { postId } = req.params;
  const result = {
    data: null,
    message: ""
  };
  let client = null;

  try {
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

    client = createClient();
    await client.connect();
    const sql = `SELECT 
                      comment_TB.id, 
                      comment_TB.user_id, 
                      comment_TB.content, 
                      comment_TB.created_date, 
                      comment_TB.updated_date, 
                      user_TB.name AS "authorName" 
                    FROM 
                      comment_TB 
                    JOIN 
                      user_TB 
                    ON 
                      comment_TB.user_id = user_TB.id 
                    WHERE 
                      post_id = $1`;
    const params = [postId];

    const data = await client.query(sql, params);
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
    if (client) {
      await client.end();
    }
  }
});

// 댓글 수정 api
// postId, commentId, userId, content
// PUT
router.put("/", loginAuth, async (req, res, next) => {
  const userId = req.decoded.userPk;
  const { content, postId, commentId } = req.body;
  const result = {
    isSuccess: false,
    message: ""
  };
  let client = null;

  try {
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
    exception(commentId, "commentId").checkInput().isNumber().checkLength(1, maxCommentIdLength);
    exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
    exception(content, "content").checkInput().checkLength(1, maxCommentContentLength);

    client = createClient();
    await client.connect();
    const sql = "UPDATE comment_TB SET content = $1 WHERE post_id = $2 AND user_id = $3 AND id = $4";
    const params = [content, postId, userId, commentId];
    const data = await client.query(sql, params)
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
    if (client) {
      await client.end();
    }
  }
});

// 댓글 삭제 api
// postId, commentId, userId
// DELETE
router.delete("/", loginAuth, async (req, res, next) => {
  const userId = req.decoded.userPk;
  const { postId, commentId } = req.body;
  const result = {
    isSuccess: false,
    message: ""
  };
  let client = null;

  try {
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
    exception(commentId, "commentId").checkInput().isNumber().checkLength(1, maxCommentIdLength);
    exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength)

    client = createClient();
    await client.connect();
    const sql = "DELETE FROM comment_TB WHERE post_id = $1 AND user_id = $2 AND id = $3";
    const params = [postId, userId, commentId];
    const data = await client.query(sql, params);
    if (data.rowCount !== 0) {
      result.isSuccess = true;
    } else {
      result.message = "해당하는 댓글이 존재하지 않습니다";
    }
    res.send(result);

  } catch (error) {
    console.error(error);
    next(error);

  } finally {
    if (client) {
      await client.end();
    }
  }
});

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
// router.get("/user/:userLoginId", commentCtrl.readUserComment);

module.exports = router;
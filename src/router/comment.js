const express = require("express");
const router = express.Router();

const createClient = require("../database/connect/postgresql");
const { makeResult, printError } = require("../module/util/func");
const commentValidate = require("../module/util/validate/commentValidate");
const validateMessage = "데이터 형식이 유효하지 않습니다, (regex테스트 실패)";
// const commentCtrl = require("../router/controller/comment.controller");

// 댓글 생성 api
// postId, userId, content
// POST
router.post("/", async (req, res) => {
  const { postId, userId, content } = req.body;
  const result = makeResult();

  const isValidateValue = commentValidate.validateCreateCommentInput(postId, userId, content);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `INSERT INTO comment_TB (post_id, user_id, content) VALUES ($1, $2, $3)`;
    const params = [postId, userId, content];

    const data = await client.query(sql, params);
    if (data.rowCount !== 0) {
      result.success = true;
      result.message = "댓글 작성에 성공하였습니다";
    } else {
      result.message = "댓글 작성에 실패하였습니다";
    }

  } catch (error) {
    result.message = "POST /api/comment/ error: " + error.message;

  } finally {
    await client.end();
    res.send(result);
  }
});

// 댓글 조회 api
// :postId
// GET
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const result = makeResult();

  const isValidateValue = commentValidate.validateReadCommentInput(postId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `SELECT comment_TB.id, comment_TB.user_id, comment_TB.content, comment_TB.created_date, comment_TB.updated_date, 
               user_TB.name AS author_name 
               FROM comment_TB JOIN user_TB ON comment_TB.user_id = user_TB.id 
               WHERE post_id = $1`
    const params = [postId];

    const data = await client.query(sql, params);
    if (data.rows.length !== 0) {
      result.success = true;
      result.message = data.rows;
    } else {
      result.message = "해당 게시글에 댓글이 존재하지 않습니다";
    }
    
  } catch (error) {
    result.message = "GET /api/comment/ error: " + error.message;

  } finally {
    await client.end();
    res.send(result);
  }
});

// 댓글 수정 api
// postId, commentId, userId, content
// PUT
router.put("/", async (req, res) => {
  const { userId, content, postId, commentId } = req.body;
  const result = makeResult();

  const isValidateValue = commentValidate.validateUpdateCommentInput(userId, content, postId, commentId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "UPDATE comment_TB SET content = $1 WHERE post_id = $2 AND user_id = $3 AND id = $4";
    const param = [content, postId, userId, commentId];

    const data = await client.query(sql, param);
    if (data.rowCount !== 0) {
      result.success = true;
      result.message = "댓글 수정에 성공하였습니다";
    } else {
      result.message = "댓글 수정에 실패하였습니다";
    }
  } catch (error) {
    result.message = "GET /api/comment/ error: " + error.message;
  } finally {
    await client.end();
    res.send(result);
  }
});

// 댓글 삭제 api
// postId, commentId, userId
// DELETE
router.delete("/", async (req, res) => {
  const { postId, commentId, userId } = req.body;
  const result = makeResult();

  const isValidateValue = commentValidate.validateDeleteCommentInput(postId, commentId, userId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "DELETE FROM comment_TB WHERE post_id = $1 AND user_id = $2 AND id = $3";
    const params = [postId, userId, commentId];

    const data = await client.query(sql, params)
    if (data.rowCount !== 0) {
      result.success = true;
      result.message = "댓글 삭제 성공";
    } else {
      result.message = "댓글 삭제 실패"
    }
  } catch (error) {
    result.message = "GET /api/comment/ error: " + error.message;

  } finally {
    await client.end();
    res.send(result);
  }
});

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
// router.get("/user/:userLoginId", commentCtrl.readUserComment);

module.exports = router;
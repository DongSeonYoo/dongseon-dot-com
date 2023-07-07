const express = require("express");
const router = express.Router();

const createClient = require("../database/connect/postgresql");
const { makeResult, printError } = require("../module/util/func");

const postValidate = require("../module/util/validate/postValidate");
const validateMessage = "데이터 형식이 유효하지 않습니다";

// 게시글 작성 api
// userId, title, content
router.post("/", (req, res) => {
  const { userId, title, content } = req.body;
  const result = makeResult();

  const isValidateInput = postValidate.validateCreatePost(userId, title, content);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  client.connect()
    .then(() => {
      const sql = `INSERT INTO post_TB (user_id, title, content) VALUES ($1, $2, $3)`;
      const params = [userId, title, content];

      return client.query(sql, params);
    })
    .then((data) => {
      if (data.rowCount !== 0) {
        result.success = true;
        result.message = "게시글 작성 성공";
      }
    })
    .catch((error) => {
      result.message = "POST /api/post/ error: " + error;
    })
    .finally(() => {
      client.end();
      res.send(result);
    })
});

// 모든 게시글 조회 api
// GET
// 명사이자 단수형으로
router.get("/all", (req, res) => {
  const result = makeResult();
  const client = createClient();
  client.connect()
    .then(() => {
      const result = makeResult();
      const sql = `SELECT post_TB.id, post_TB.title, post_TB.content, post_TB.created_date, user_TB.name AS author_name
               FROM post_TB 
               JOIN user_TB ON post_TB.user_id = user_TB.id 
               ORDER BY created_date DESC LIMIT 8`

      return client.query(sql);
    })
    .then((data) => {
      if (data.rows.length !== 0) {
        result.success = true;
        result.message = data.rows;
      }
    })
    .catch((error) => {
      result.message = "GET /api/post/all";
    })
    .finally (() => {
      client.end();
      res.send(result);
    });
});

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId", (req, res) => {
  const { postId } = req.params;
  const result = makeResult();

  const isValidateInput = postValidate.validateReadPost(postId);
  if (!isValidateInput) {
    result.message = validateMessage;
    return res.send(result);
  }

  const client = createClient();
  client.connect()
    .then(() => {
      const sql = `SELECT post_TB.*, 
      user_TB.name AS author_name 
      FROM post_TB 
      JOIN user_TB ON post_TB.user_id = user_TB.id 
      WHERE post_TB.id = $1`;
      const params = [postId];

      return client.query(sql, params);
    })
    .then((data) => {
      if (data.rows.length !== 0) {
        result.success = true;
        result.message = data.rows[0];
      } else {
        result.message = "해당하는 게시글이 존재하지 않습니다";
      }
    })
    .catch((error) => {
      result.message = "GET /api/post/:userId/ error: " + error.message;
    })
    .finally(() => {
      client.end();
      res.send(result);
    });
});

// 게시글 수정 api
// userId, postId, title, content
// PUT
router.put("/", (req, res) => {
  const { postId, userId, title, content } = req.body;
  const result = makeResult();

  const isValidateInput = postValidate.validateUpdatePostInput(postId, userId, title, content);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  client.connect()
    .then(() => {
      const sql = "UPDATE post_TB SET title = $1, content = $2 WHERE user_id = $3 AND id = $4";
      const params = [title, content, userId, postId];

      return client.query(sql, params);
    })
    .then((data) => {
      if (data.rowCount !== 0) {
        result.success = true;
        result.message = "수정에 성공하였습니다";
      }
    })
    .catch((error) => {
      result.message = "PUT /api/post/:userId/ error: " + error.message;
    })
    .finally(() => {
      client.end();
      res.send(result);
    })
});

// 게시글 삭제 api
// userId, postId
// DELETE
router.delete("/", (req, res) => {
  const { postId, userId } = req.body;
  const result = makeResult();

  const isValidateInput = postValidate.validateDeletePostInput(postId, userId);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  client.connect()
    .then(() => {
      const sql = "DELETE FROM post_TB WHERE id = $1 AND user_id = $2";
      const params = [postId, userId];

      return client.query(sql, params);
    })
    .then((data) => {
      if (data.rowCount !== 0) {
        result.success = true;
        result.message = "삭제에 성공하였습니다";
      } else {
        result.message = "삭제에 실패하였습니다(존재하지 않는 사용자 혹은 게시물)";
      }
    })
    .catch((error) => {
      result.message = "DELETE /api/post/ error: " + error.message;
    })
    .finally(() => {
      client.end();
      res.send(result);
    });
});

// 특정 사용자가 작성한 게시글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// router.get("/user/:userLoginId", post.getUserPost);

module.exports = router;
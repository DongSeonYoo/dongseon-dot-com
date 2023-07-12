const express = require("express");
const router = express.Router();
const createClient = require("../database/connect/postgresql");
const exception = require("../module/exception");
const { maxUserIdLength, maxPostIdLength, maxPostTitleLength, maxPostContentLength } = require("../module/global");

// 게시글 작성 api
// userId, title, content
router.post("/", async (req, res) => {
  const { userId, title, content } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: ""
  };
  let client = null;

  try {
    exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
    exception(title, "title").checkInput().checkLength(1, maxPostTitleLength);
    exception(content, "content").checkInput().checkLength(1, maxPostContentLength);

    client = createClient();
    await client.connect();
    const sql = `INSERT INTO post_TB (user_id, title, content) VALUES ($1, $2, $3)`;
    const params = [userId, title, content];
    const data = await client.query(sql, params)
    if (data.rowCount !== 0) {
      result.isSuccess = true;
    }

  } catch (error) {
    console.error(error)
    result.message = error.message;

  } finally {
    if (client) {
      await client.end();
    }
    res.send(result);
  }
});

// 모든 게시글 조회 api
// GET
// 명사이자 단수형으로
router.get("/all", async (req, res) => {
  const result = {
    isSuccess: false,
    data: "",
    message: ""
  };
  let client = null;
  try {
    client = createClient();
    await client.connect();
    const sql = `SELECT post_TB.id, post_TB.title, post_TB.content, post_TB.created_date, user_TB.name AS author_name
               FROM post_TB 
               JOIN user_TB ON post_TB.user_id = user_TB.id 
               ORDER BY created_date DESC LIMIT 8`;
    const data = await client.query(sql);
    if (data.rows.length !== 0) {
      result.isSuccess = true;
      result.data = data.rows;
    } else {
      result.message = "게시글이 존재하지 않습니다";
    }
  } catch (error) {
    console.error(error);
    result.message = error;
  } finally {
    if (client) {
      await client.end();
    }
    res.send(result);
  }
});

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId",async (req, res) => {
  const { postId } = req.params;
  const result = {
    isSuccess: false,
    data: "",
    message: ""
  };
  let client = null;

  try {
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);

    client = createClient();
    await client.connect()
    const sql = `SELECT post_TB.*, 
      user_TB.name AS author_name 
      FROM post_TB 
      JOIN user_TB ON post_TB.user_id = user_TB.id 
      WHERE post_TB.id = $1`;
    const params = [postId];

    const data = await client.query(sql, params)
    if (data.rows.length !== 0) {
      result.isSuccess = true;
      result.data = data.rows[0];
    } else {
      result.message = "해당하는 게시글이 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = error.message;

  } finally {
    if (client) {
      await client.end();
    }
    res.send(result);
  }
});

// 게시글 수정 api
// userId, postId, title, content
// PUT
router.put("/", async (req, res) => {
  const { postId, userId, title, content } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: ""
  };
  let client = null;

  try {
    exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
    exception(title, "title").checkInput().checkLength(1, maxPostTitleLength);
    exception(content, "content").checkInput().checkLength(1, maxPostContentLength);

    client = createClient();
    await client.connect();
    const sql = "UPDATE post_TB SET title = $1, content = $2 WHERE user_id = $3 AND id = $4";
    const params = [title, content, userId, postId];
    const data = await client.query(sql, params);

    if (data.rowCount !== 0) {
      result.isSuccess = true;
    } else {
      result.message = "해당하는 게시글이 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = error.message;
    
  } finally {
    if (client) {
      await client.end();
    }
    res.send(result);
  }
});

// 게시글 삭제 api
// userId, postId
// DELETE
router.delete("/", async (req, res) => {
  const { postId, userId } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: ""
  };
  let client = null;

  try {
    exception(postId, "postId").checkInput().isNumber().checkLength(1, maxPostIdLength);
    exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);

    client = createClient();
    await client.connect();

    const sql = "DELETE FROM post_TB WHERE id = $1 AND user_id = $2";
    const params = [postId, userId];  
    const data = await client.query(sql, params);

    if (data.rowCount !== 0) {
      result.isSuccess = true;
    } else {
      result.message = "해당하는 게시글이 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = error.message;

  } finally {
    if (client) {
      await client.end();
    }
    res.send(result);
  }
});

// 특정 사용자가 작성한 게시글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// router.get("/user/:userLoginId", post.getUserPost);

module.exports = router;
const express = require("express");
const router = express.Router();

const createClient = require("../database/connect/postgresql");
const data = require("../module/util/validate");

const maxUserIdLength = 10;
const maxPostIdLength = 10;
const maxPostTitleLength = 200;
const maxPostContentLength = 500;
const inputError = {
  userId: "userId 형식이 올바르지 않습니다",
  postId: "postId 형식이 올바르지 않습니다",
  title: "title 형식이 올바르지 않습니다",
  content: "content 형식이 올바르지 않습니다",
}

// 게시글 작성 api
// userId, title, content
router.post("/", (req, res) => {
  const { userId, title, content } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const userIdValidate = data(userId).checkInput().checkLength(1, maxUserIdLength);
  const titleValidate = data(title).checkInput().checkLength(1, maxPostTitleLength);
  const contentValidate = data(content).checkInput().checkLength(1, maxPostContentLength);
  if (!userIdValidate) {
    result.message = inputError.userId;
    res.status(400).send(result);
    return;
  }

  if (!titleValidate) {
    result.message = inputError.title;
    res.status(400).send(result);
    return;
  }

  if (!contentValidate) {
    result.message = inputError.content;
    res.status(400).send(result);
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
        result.isSuccess = true;
      }
    })
    .catch((error) => {
      result.message = "존재하지 않는 사용자입니다";
      result.db.errorMessage = "POST /api/post/ error: " + error.message;
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
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };
  const client = createClient();
  client.connect()
    .then(() => {
      const sql = `SELECT post_TB.id, post_TB.title, post_TB.content, post_TB.created_date, user_TB.name AS author_name
               FROM post_TB 
               JOIN user_TB ON post_TB.user_id = user_TB.id 
               ORDER BY created_date DESC LIMIT 8`
      return client.query(sql);
    })
    .then((data) => {
      if (data.rows.length !== 0) {
        result.isSuccess = true;
        result.data = data.rows;
      }
    })
    .catch((error) => {
      result.db.errorMessage = "GET /api/post/all/ error: " + error.messageg;
    })
    .finally(() => {
      client.end();
      res.send(result);
    });
});

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId", (req, res) => {
  const { postId } = req.params;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const postIdValidate = data(postId).checkInput().checkLength(1, maxPostIdLength);
  if (!postIdValidate) {
    result.message = inputError.postId;
    res.status(400).send(result);
    return;
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
        result.isSuccess = true;
        result.data = data.rows[0];
      } else {
        result.message = "해당하는 게시글이 존재하지 않습니다";
      }
    })
    .catch((error) => {
      result.db.errorMessage = "GET /api/post/:userId/ error: " + error.message;
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
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const userIdValidate = data(userId).checkInput().checkLength(1, maxUserIdLength);
  const postIdValidate = data(postId).checkInput().checkLength(1, maxPostIdLength);
  const titleValidate = data(title).checkInput().checkLength(1, maxPostTitleLength);
  const contentValdiate = data(content).checkInput().checkLength(1, maxPostContentLength);
  if (!userIdValidate) {
    result.status(400).message = inputError.userId;
    res.send(result);
    return;
  }

  if (!postIdValidate) {
    result.message = inputError.postId;
    res.status(400).send(result);
    return;
  }

  if (!titleValidate) {
    result.message = inputError.title;
    res.status(400).send(result);
    return;
  }

  if (!contentValdiate) {
    result.message = inputError.connect;
    res.status(400).send(result);
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
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const userIdValidate = data(userId).checkInput().checkLength(1, maxUserIdLength);
  const postIdValidate = data(postId).checkInput().checkLength(1, maxPostIdLength);
  if (!userIdValidate) {
    result.message = inputError.userId;
    res.status(400).send(result);
    return;
  }

  if (!postIdValidate) {
    result.message = inputError.postId;
    res.status(400).send(result);
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
      result.db.errorMessage = "DELETE /api/post/ error: " + error.message;
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
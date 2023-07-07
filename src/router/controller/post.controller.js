const createClient = require("../../database/connect/postgresql");
const { makeResult, printError } = require("../controller/util/func");

const postValidate = require("../controller/util/validate/postValidate");
const validateMessage = "데이터 형식이 유효하지 않습니다";

const createPost = (req, res) => {
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
};

const readAllPost = (req, res) => {
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
};

const readPost = (req, res) => {
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
};

const updatePost = (req, res) => {
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
};

const deletePost = (req, res) => {
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
};

// const getUserPost = (req, res) => {
//   const { userLoginId } = req.params;
//   const result = makeResult();

//   const isValidateInput = postValidate.validateGetUserPostInput(userLoginId);
//   if (!isValidateInput) {
//     result.message = validateMessage;
//     res.send(result);
//     return;
//   }

//   const sql = "SELECT * FROM post_TB WHERE user_id IN (SELECT id FROM user_TB WHERE login_id = ?)";
//   const param = [userLoginId];

//   db.query(sql, param, (error, results, fields) => {
//     if (error) {
//       printError(error, result, res);
//       return;
//     }

//     // 게시글을 찾으면 true, 찾지 못하면 false
//     const isFindPost = results.length === 0;
//     if (!isFindPost) {
//       result.success = true;
//       result.message = results;

//     } else {
//       result.message = "해당하는 사용자의 게시글이 존재하지 않습니다";
//     }

//     res.send(result);
//   });
// };

module.exports = {
  createPost,
  readAllPost,
  readPost,
  updatePost,
  deletePost,
}
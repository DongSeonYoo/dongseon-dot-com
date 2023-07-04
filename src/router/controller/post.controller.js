const db = require("../../database/connect/mariadb");
const { makeResult, printError } = require("../controller/util/func");

const postValidate = require("../controller/util/validate/postValidate");
const validateMessage = "데이터 형식이 유효하지 않습니다";

const path = require("path");

const createPost = (req, res) => {
  const { userId, title, content } = req.body;
  const result = makeResult();

  const isValidateInput = postValidate.validateCreatePost(userId, title, content);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }
  
  const sql = "INSERT INTO post_TB (user_id, title, content) VALUES (?, ?, ?)";
  const param = [userId, title, content];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      result.message = "존재하지 않는 사용자입니다";
      res.send(result);
      return;
    }

    result.success = true;
    result.message = "작성에 성공하였습니다";

    res.send(result);
  });
};

const readAllPost = (req, res) => {
  const result = makeResult();
  const sql = `SELECT post_TB.id, post_TB.title, post_TB.content, post_TB.created_date, user_TB.name 
                AS author_name FROM post_TB JOIN user_TB 
                ON post_TB.user_id = user_TB.id ORDER BY created_date DESC LIMIT 8`

  db.query(sql, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    result.success = true;
    result.message = results;
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

  const sql = "SELECT post_TB.*, user_TB.name AS author_name FROM post_TB JOIN user_TB ON post_TB.user_id = user_TB.id WHERE post_TB.id = ?";
  const param = postId;

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    // 게시글을 찾으면 true, 찾지 못하면 false
    const isFindPost = results.length === 0;
    if (!isFindPost) {
      result.success = true;
      result.message = results[0];
    } else {
      result.message = "해당하는 게시글이 존재하지 않습니다";
    }

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

  const sql = "UPDATE post_TB SET title = ?, content = ? WHERE user_id = ? AND id = ?";
  const param = [title, content, userId, postId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "수정 성공";

    } else {
      result.message = "수정 실패, 본인만 수정 가능";
    }

    res.send(result);
  });
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

  const sql = "DELETE FROM post_TB WHERE id = ? AND user_id = ?";
  const param = [postId, userId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const isDeleted = results.affectedRows === 0;
    if (!isDeleted) {
      result.success = true;
      result.message = "삭제 성공";
    } else {
      result.message = "삭제 실패, 본인만 삭제 가능";
    }

    res.send(result);
  });
};

const getUserPost = (req, res) => {
  const { userLoginId } = req.params;
  const result = makeResult();

  const isValidateInput = postValidate.validateGetUserPostInput(userLoginId);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const sql = "SELECT * FROM post_TB WHERE user_id IN (SELECT id FROM user_TB WHERE login_id = ?)";
  const param = [userLoginId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    // 게시글을 찾으면 true, 찾지 못하면 false
    const isFindPost = results.length === 0;
    if (!isFindPost) {
      result.success = true;
      result.message = results;

    } else {
      result.message = "해당하는 사용자의 게시글이 존재하지 않습니다";
    }

    res.send(result);
  });
};

module.exports = {
  createPost,
  readAllPost,
  readPost,
  updatePost,
  deletePost,
  getUserPost
}
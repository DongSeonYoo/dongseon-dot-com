const db = require("../../database/connect/mariadb");
const { makeResult, printError } = require("../controller/util/func");

const commentValidate = require("../controller/util/validate/commentValidate");
const validateMessage = "데이터 형식이 유효하지 않습니다";

const createComment = (req, res) => {
  const { postId, userId, content } = req.body;
  const result = makeResult();

  const isValidateValue = commentValidate.validateCreateCommentInput(postId, userId, content);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const sql = "INSERT INTO comment_TB (post_id, user_id, content) VALUES (?, ?, ?)";
  const param = [postId, userId, content];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "댓글 작성 성공";
    }

    res.send(result);
  });
};

const readComment = (req, res) => {
  const { postId } = req.params;
  const result = makeResult();

  const isValidateValue = commentValidate.validateReadCommentInput(postId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  // const sql = "SELECT * FROM comment_TB WHERE post_id = ?";
  const sql = `SELECT comment_TB.id, comment_TB.user_id, comment_TB.content, comment_TB.created_date, comment_TB.updated_date, 
               user_TB.name AS author_name 
               FROM comment_TB JOIN user_TB ON comment_TB.user_id = user_TB.id 
               WHERE post_id = ?`
  const param = postId;

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const isEmptyResult = results.length === 0;
    if (!isEmptyResult) {
      result.success = true;
      result.message = results;

    } else {
      result.message = "게시글 또는 댓글이 존재하지 않습니다";
    }

    res.send(result);
  });
};

const updateComment = (req, res) => {
  const { userId, content, postId, commentId } = req.body;
  const result = makeResult();

  const isValidateValue = commentValidate.validateUpdateCommentInput(userId, content, postId, commentId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const sql = "UPDATE comment_TB SET content = ? WHERE post_id = ? AND user_id = ? AND id = ?";
  const param = [content, postId, userId, commentId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "댓글 수정 성공";

    } else {
      result.success = false;
      result.message = "댓글 수정 실패 (본인 댓글이 아니거나 존재하지 않는 게시글임)";
    }

    res.send(result);
  });
};

const deleteComment = (req, res) => {
  const { postId, commentId, userId } = req.body;
  const result = makeResult();

  const isValidateValue = commentValidate.validateDeleteCommentInput(postId, commentId, userId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const sql = "DELETE FROM comment_TB WHERE post_id = ? AND user_id = ? AND id = ?";
  const param = [postId, userId, commentId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "댓글 삭제 성공";

    } else {
      result.success = false;
      result.message = "댓글 삭제 실패 (존재하지 않는 게시글, 댓글이거나 본인 댓글이 아님)";
    }

    res.send(result);
  });
};

const readUserComment = (req, res) => {
  const { userLoginId } = req.params;
  const result = makeResult();

  const isValidateValue = commentValidate.validateReadUserCommentInput(userLoginId);
  if (!isValidateValue) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const sql = "SELECT * FROM comment_TB WHERE user_id IN (SELECT id FROM user_TB WHERE login_id = ?)";
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
}

module.exports = {
  createComment,
  readComment,
  updateComment,
  deleteComment,
  readUserComment
}
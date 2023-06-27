const router = require("express").Router();
const db = require("../database/connect/mariadb");
const common = require("../common");

const makeResult = common.makeResult;
const printError = common.printError;

// 댓글 생성 api
// postId, userId, content
// POST
router.post("/", (req, res) => {
  const { postId, userId, content } = req.body;
  const result = makeResult();

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
});

// 댓글 조회 api
// :postId
// GET
router.get("/post/:postId", (req, res) => {
  const { postId } = req.params;
  const result = makeResult();

  const sql = "SELECT * FROM comment_TB WHERE post_id = ?";
  const param = [postId];

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
});

// 댓글 수정 api
// postId, commentId, userId, content
// PUT
router.put("/", (req, res) => {
  const { userId, content, postId, commentId } = req.body;
  const result = makeResult();

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
});

// 댓글 삭제 api
// postId, commentId, userId
// DELETE
router.delete("/", (req, res) => {
  const { postId, commentId, userId } = req.body;
  const result = makeResult();

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
});

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
router.get("/user/:userLoginId", (req, res) => {
  const { userLoginId } = req.params;
  const result = makeResult();

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
});

module.exports = router;
const router = require("express").Router();
const common = require("../common");
const db = require("../database/connect/mariadb");

const makeResult = common.makeResult;
const printError = common.printError;

// 게시글 작성 api
// userId, title, content
router.post("/", (req, res) => {
  const { userId, title, content } = req.body;
  const result = makeResult();

  const sql = "INSERT INTO post_TB (user_id, title, content) VALUES (?, ?, ?)";
  const param = [userId, title, content];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "작성에 성공하였습니다";
    }

    res.send(result);
  });
});

// 모든 게시글 조회 api
// GET
// 명사이자 단수형으로
router.get("/all", (req, res) => {
  const result = makeResult();
  const sql = "SELECT * FROM post_TB";

  db.query(sql, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    result.success = true;
    result.message = results;
    res.send(result);
  });
});

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId", (req, res) => {
  const { postId } = req.params;
  const result = makeResult();

  const sql = "SELECT * FROM post_TB WHERE id = ?";
  const param = [postId];

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
      result.message = "해당하는 게시글이 존재하지 않습니다";
    }

    res.send(result);
  });
});

// 게시글 수정 api
// userId, postId, title, content
// PUT
router.put("/", (req, res) => {
  const { postId, userId, title, content } = req.body;
  const result = makeResult();

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
});

// 게시글 삭제 api
// userId, postId
// DELETE
router.delete("/", (req, res) => {
  const { postId, userId } = req.body;
  const result = makeResult();

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
});

// 특정 사용자가 작성한 게시글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
router.get("/user/:userLoginId", (req, res) => {
  const { userLoginId } = req.params;
  const result = makeResult();

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
});

module.exports = router;
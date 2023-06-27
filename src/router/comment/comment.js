const express = require("express");
const router = express.Router();

const comment = require("../comment/comment.controller");
// 댓글 생성 api
// postId, userId, content
// POST
router.post("/", comment.createComment);

// 댓글 조회 api
// :postId
// GET
router.get("/post/:postId", comment.readComment);

// 댓글 수정 api
// postId, commentId, userId, content
// PUT
router.put("/", comment.updateComment);

// 댓글 삭제 api
// postId, commentId, userId
// DELETE
router.delete("/", comment.deleteComment);

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
router.get("/user/:userLoginId", comment.readUserComment);

module.exports = router;
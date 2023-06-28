const express = require("express");
const router = express.Router();

const commentCtrl = require("../controller/comment.controller");
// 댓글 생성 api
// postId, userId, content
// POST
router.post("/", commentCtrl.createComment);

// 댓글 조회 api
// :postId
// GET
router.get("/post/:postId", commentCtrl.readComment);

// 댓글 수정 api
// postId, commentId, userId, content
// PUT
router.put("/", commentCtrl.updateComment);

// 댓글 삭제 api
// postId, commentId, userId
// DELETE
router.delete("/", commentCtrl.deleteComment);

// 특정 사용자가 작성한 댓글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
// "/comment/user/:userLoginId"
router.get("/user/:userLoginId", commentCtrl.readUserComment);

module.exports = router;
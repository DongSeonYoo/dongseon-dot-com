const express = require("express");
const router = express.Router();

const post = require("../controller/post.controller");

// 게시글 작성 api
// userId, title, content
router.post("/", post.createPost);

// 모든 게시글 조회 api
// GET
// 명사이자 단수형으로
router.get("/all", post.readAllPost);

// 특정 게시글 조회 api
// postId
// GET
router.get("/:postId", post.readPost);

// 게시글 수정 api
// userId, postId, title, content
// PUT
router.put("/", post.updatePost);

// 게시글 삭제 api
// userId, postId
// DELETE
router.delete("/", post.deletePost);

// 특정 사용자가 작성한 게시글 조회 api (로그인 아이디 기반으로)
// userLoginId
// GET
router.get("/user/:userLoginId", post.deletePost);

module.exports = router;
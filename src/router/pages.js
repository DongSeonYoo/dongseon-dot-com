const express = require("express");
const router = express.Router();
const path = require("path");
const CLIENT_PATH = path.join(__dirname,'../../client/pages');

// 아이디 찾기 페이지
router.get('/find-id', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'find-id.html'));
});

// 비밀번호 찾기 (1: 사용자 검증 단계)
router.get('/user-validate', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'user-validate.html'));
});

// 비밀번호 찾기 (2: 비밀번호 재설정 단계)
router.get('/reset-pw', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'reset-pw.html'));
});

// 프로필 보기 페이지 (2: 비밀번호 재설정 단계)
router.get('/view-profile', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'view-profile.html'));
});

//회원가입 페이지 
router.get('/signup', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'signup.html'));
});

//커뮤니티 페이지 
router.get('/community', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'community.html'));
});

//게시글 보기 페이지 
router.get('/post/:postId', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'post.html'));
});

//게시글 작성 페이지 
router.get('/write-post', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'write-post.html'));
});

//게시글 수정 페이지 
router.get('/modify-post/:postId', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'modify-post.html'));
});

// 관리자 페이지
router.get('/admin', (req, res)=>{
  res.sendFile(path.join(CLIENT_PATH,'admin.html'));
});

module.exports = router;
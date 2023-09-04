const express = require("express");
const router = express.Router();

const authGuard = require("../middleware/authGuard");
const adminAuth = require('../middleware/adminAuth');
const passport = require("passport");

const jwtUtil = require("../module/jwt");
require("dotenv").config();

// 카카오 로그인 페이지로 이동시켜주는 api
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 인증 전략 실행
router.get('/kakao/callback', passport.authenticate("kakao", {
    session: false,
    failureRedirect: '/',
}), async (req, res, next) => {
    const accessToken = await jwtUtil.userSign(req.user.rows[0]);
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: false,
    });
    res.redirect("/");
});

// 로그인 권한 체크 api
router.get("/login", authGuard, (req, res) => {
    req.decoded.iat = new Date(req.decoded.iat * 1000);
    res.status(200).send({
        data: req.decoded,
    });
});

// 관리자 권한 체크 api
router.get("/admin", adminAuth, (req, res) => {
    req.decoded.iat = new Date(req.decoded.iat * 1000);
    res.status(200).send({
        data: req.decoded,
    });
});

module.exports = router;

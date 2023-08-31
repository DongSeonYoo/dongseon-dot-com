const express = require("express");
const router = express.Router();

const pool = require("../../config/database/postgresql");
const authGuard = require("../middleware/authGuard");
const adminAuth = require('../middleware/adminAuth');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
require("dotenv").config();

passport.use('kakao', new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: process.env.KAKAO_CALLBACKURL,
}, async (accessToken, refreshToken, profile, done) => {
    // 인증 전략 실행하자
    // 기존 테이블을 새로 만들어서 관리할건지 기존 테이블에 컬럼을 추가해서 통합으로 관리할건지
}));

// 카카오 로그인 페이지로 이동시켜주는 api
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 인증 전략 실행
router.get('/kakao/callback', passport.authenticate("kakao", {
    failureRedirect: '/',
}), (res, req) => {
    res.redirect('/');
});

router.get("/login", authGuard, (req, res) => {
    req.decoded.iat = new Date(req.decoded.iat * 1000);
    res.status(200).send({
        data: req.decoded,
    });
});

router.get("/admin", adminAuth, (req, res) => {
    req.decoded.iat = new Date(req.decoded.iat * 1000);
    res.status(200).send({
        data: req.decoded,
    });
});

module.exports = router;

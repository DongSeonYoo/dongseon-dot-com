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
    console.log(`accessTOken: ${accessToken}`);
    console.log(`refreshToken: ${refreshToken}`);

    try {
        const { id, username, provider } = profile;
        const email = profile._json.kakao_account.email;

        const selectSql = `SELECT id FROM user_TB WHERE login_id = $1`;
        const params = [id];

        const selectedData = await pool.query(selectSql, params);
        // 만약 기존에 가입한 유저가 아니라면 (회원가입시켜줘야지)
        if (selectedData.rows.length === 0) {
            const insertSql = "INSERT INTO user_TB (login_id, name, email, provider) VALUES ($1, $2, $3, $4)";
            const params = [id, username, email, provider];
            await pool.query(insertSql, params);
        }
        done(null, selectedData);

    } catch (error) {
        console.log(error);
    }
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

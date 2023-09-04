const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const pool = require("../../../config/database/postgresql");

module.exports = () => {
    passport.use('kakao', new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: process.env.KAKAO_CALLBACKURL,
    }, async (accessToken, refreshToken, profile, done) => {
        // 인증 전략 실행
        try {
            const { id, username, provider } = profile;
            const email = profile._json.kakao_account.email;

            const selectSql = `SELECT id, login_id, name, provider FROM user_TB WHERE login_id = $1`;
            const params = [id];

            const selectedData = await pool.query(selectSql, params);
            // 만약 기존에 가입한 유저가 아니라면 (회원가입시켜줘야지)
            if (selectedData.rows.length === 0) {
                const insertSql = "INSERT INTO user_TB (login_id, name, email, provider) VALUES ($1, $2, $3, $4) RETURNING id";
                const params = [id, username, email, provider];
                const insertedData = await pool.query(insertSql, params);
                return done(null, insertedData);
            }
            // 만약 기존에 가입한 유저라면 (바로 로그인 시켜줘야지)
            done(null, selectedData);

        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
}
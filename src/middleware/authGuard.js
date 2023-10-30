const jwt = require("jsonwebtoken");
const { UnauthorizedException } = require("../module/customError");
const env = require('../config/env');

module.exports = (req, res, next) => {
    // 쿠키에 담긴 토큰을 추출
    const { accessToken } = req.cookies;

    try {
        req.decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
        return next();

    } catch (error) {
        return next(new UnauthorizedException("로그인 후 이용가능합니다"));
    }
};

require("dotenv").config();

const jwt = require("jsonwebtoken");
const { UnauthorizedException, ForbbidenException } = require("../module/customError");

module.exports = (req, res, next) => {
    // 쿠키에 담긴 토큰을 추출
    const { accessToken } = req.cookies;
    try {
        // 쿠키 이름이 잘못되었을때?(쿠키 이름을 조작한경우)
        if (!accessToken) {
            throw new Error("invalid token");
        }

        req.decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        const { role } = req.decoded;
        if (role !== "admin") {
            return next(new ForbbidenException("권한이 거부되었습니다"));
        }
        next();

    } catch (error) {
        if (error.message === "jwt expired" || error.message === "invalid token") {
            return next(new UnauthorizedException("로그인 후 이용가능합니다"));
        }
        next(error);
    }
};

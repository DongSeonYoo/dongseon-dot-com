const jwt = require("jsonwebtoken");
require("dotenv").config();

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
            throw new Error("admin only")
        }
        next();

    } catch (error) {
        if (error.message === "jwt expired") {
            error.status = 419;
        } else if (error.message === "invalid token") {
            error.status = 401;
        } else if (error.message === "admin only") {
            error.status = 403;
        }
        next(error);
    }
};

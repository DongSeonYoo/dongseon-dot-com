const jwt = require("jsonwebtoken");
const createClient = require("../../config/database/postgresql");
require("dotenv").config();

module.exports = async (req, res, next) => {
    let client = null;
    // 쿠키에 담긴 토큰을 추출
    const accessToken = req.cookies.accessToken;
    try {
        // 쿠키 이름이 잘못되었을때?(쿠키 이름을 조작한경우)
        if (!accessToken) {
            throw new Error("invalid token");
        }

        // 토큰이 블랙리스트에 등록되어있는지 체크
        client = createClient();
        await client.connect();

        const sql = "SELECT id FROM token_blacklist WHERE token = $1";
        const params = [accessToken];
        const data = await client.query(sql, params);
        // 블랙리스트에 해당하는 토큰이 존재한다면?
        if (data.rows.length !== 0) {
            const error = new Error();
            error.status = 401;
            res.clearCookie("accessToken");
            throw error;

            // 블랙리스트에 토큰이 존재하지 않는 경우 (request에 디코딩한 값 담아줌)
        } else {
            req.decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            next();
        }

    } catch (error) {
        if (error.message === "jwt expired") {
            error.status = 419;
        } else if (error.message === "invalid token") {
            error.status = 401;
        }
        next(error);
    } finally {
        if (client) await client.end();
    }
};

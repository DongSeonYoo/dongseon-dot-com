const path = require("path");
const CLIENT_PATH = path.join(__dirname, '../../client/pages');
const multer = require("multer");

const errorHandling = () => {
    return (err, req, res, next) => {
        const result = {
            message: "",
        }
        const statusCode = {
            badRequest: 400,
            tokenInvalid: 401,
            forbidden: 403,
            notFound: 404,
            internerServer: 500
        }
        console.error(err);

        // 유효하지 않은 요청
        if (err.status === statusCode.badRequest) {
            result.message = err.message;
            return res.status(statusCode.badRequest).send(result);
        }
        // 404 error
        if (err.status === statusCode.notFound) {
            result.message = err.message;
            return res.status(statusCode.notFound).sendFile(path.join(CLIENT_PATH, "404.html"));

        }
        // 토큰 invalid
        if (err.status === statusCode.tokenInvalid) {
            result.message = err.message;
            return res.status(statusCode.tokenInvalid).send(result);

        }
        // 권한 에러
        if (err.status === statusCode.forbidden) {
            result.message = err.message;
            return res.status(statusCode.forbidden).send(result);

        }
        // unique 제약조건 위반 
        if (err.code === '23505') {
            result.message = err.message;
            return res.status(statusCode.badRequest).send(result);

        }
        // fk 에러
        if (err.code === '23503') {
            result.message = err.message;
            return res.status(statusCode.badRequest).send(result);

        }
        // multer 에러
        if (err instanceof multer.MulterError) {
            result.message = `이미지 업로드 실패: ${err.message}`;
            return res.status(statusCode.badRequest).send(result);
        }

        result.message = "서버에서 오류가 발생하였습니다";
        res.status(statusCode.internerServer).send(result);
    }
}

module.exports = errorHandling;

const path = require("path");
const CLIENT_PATH = path.join(__dirname, '../../client/pages');
const multer = require("multer");

const errorHandling = () => {
    return (err, req, res, next) => {
        const result = {
            message: err.message,
        }
        const statusCode = {
            badRequest: 400,
            tokenInvalid: 401,
            forbidden: 403,
            notFound: 404,
            internerServer: 500
        }
        console.error(err);

        if (err.status === statusCode.notFound) {
            return res.sendFile(path.join(CLIENT_PATH, "404.html"));
        }

        return res.status(err.status).send(result);
    }
}

module.exports = errorHandling;

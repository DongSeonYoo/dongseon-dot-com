const path = require("path");
const CLIENT_PATH = path.join(__dirname, '../../client/pages');

const errorHandling = () => {
    return (err, req, res, next) => {
        const result = {
            message: err.message,
        }
        console.error(err);

        if (!err.status) {
            return res.status(500).send("서버에서 오류가 발생하였습니다");
        }

        if (err.status === 404) {
            return res.sendFile(path.join(CLIENT_PATH, "404.html"));
        }

        return res.status(err.status).send(result);
    }
}

module.exports = errorHandling;

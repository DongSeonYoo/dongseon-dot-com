const { secretKey, option } = require("../../config/secretKey");
const jwt = require("jsonwebtoken");

const userSign = async (user) => {
    const payload = {
        userPk: user.id,
        loginId: user.login_id,
        name: user.name,
        role: "user",
    }
    return jwt.sign(payload, secretKey, option);
}

const adminSign = async () => {
    const payload = {
        userPk: "",
        role: "admin",
    }
    return jwt.sign(payload, secretKey, option);
}

module.exports = {
    userSign,
    adminSign
};

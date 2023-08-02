const { secretKey, option } = require("../../config/secretKey");
const jwt = require("jsonwebtoken");

const userSign = async (userPk, loginId) => {
    const payload = {
        userPk,
        loginId,
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
}
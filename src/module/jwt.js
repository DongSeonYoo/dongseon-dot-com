const { secretKey, accessTokenOption, refreshTokenOption } = require("../../config/secretKey");
const jwt = require("jsonwebtoken");

const userSign = async (user) => {
    const payload = {
        userPk: user.id,
        loginId: user.login_id,
        name: user.name,
        role: "user",
    }
    return jwt.sign(payload, secretKey, accessTokenOption);
}

const adminSign = async () => {
    const payload = {
        userPk: "",
        role: "admin",
    }
    return jwt.sign(payload, secretKey, accessTokenOption);
}

const refreshSign = async () => {
    return jwt.sign({}, secretKey, refreshTokenOption)
}

module.exports = {
    userSign,
    adminSign,
    refreshSign
};

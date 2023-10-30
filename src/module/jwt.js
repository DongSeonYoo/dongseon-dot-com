const { secretKey, accessTokenOption, refreshTokenOption } = require("../../config/secretKey");
const env = require('../config/env');
const dailyLoginCount = require("../module/dailyLoginCount");
const jwt = require("jsonwebtoken");

const userSign = async (user) => {
    const payload = {
        userPk: user.id,
        loginId: user.login_id,
        name: user.name,
        role: "user",
    }

    dailyLoginCount.writeUser(user.login_id);
    return jwt.sign(payload, secretKey, accessTokenOption);
}

const adminSign = () => {
    const payload = {
        userPk: env.ADMIN_PK,
        role: "admin",
    }
    return jwt.sign(payload, secretKey, accessTokenOption);
}

const refreshSign = () => {
    return jwt.sign({}, secretKey, refreshTokenOption)
}

module.exports = {
    userSign,
    adminSign,
    refreshSign
};

const { secretKey, option } = require("../../config/secretKey");
const jwt = require("jsonwebtoken");

const userSign = async (user) => {
    const payload = {
        userPk: user.id,
        name: user.name,
        phoneNumber: user.phone_number,
        email: user.email,
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

const { secretKey, options } = require("../../config/secretKey");
const jwt = require("jsonwebtoken");

const userSign = async (userPk) => {
  const payload = {
    userPk,
    role: "user",
  }
  return jwt.sign(payload, secretKey, options);
}

const adminSign = async () => {
  const payload = {
    userPk: "",
    role: "admin",
  }
  return jwt.sign(payload, secretKey, options);
}

module.exports = {
  userSign,
  adminSign
}
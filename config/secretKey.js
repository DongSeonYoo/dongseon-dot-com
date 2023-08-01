require("dotenv").config();

module.exports = {
  secretKey: process.env.JWT_SECRET_KEY,
  option: {
    "algorithm": "HS256",
    "expiresIn": "1h",
    "issuer": "ehdtjs.com"
  }
}
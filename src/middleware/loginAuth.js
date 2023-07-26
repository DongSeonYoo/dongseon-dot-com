const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginAuth = () => {
  return (req, res, next) => {
    try {
      req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
      next();

    } catch (error) {
      if (error.message === "jwt expired") {
        error.status = 419;
        next(error);
      } else {
        error.status = 401;
        next(error);
      }
    }
  }
}

module.exports = loginAuth;
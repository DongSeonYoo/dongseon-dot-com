const logging = require("../module/logging");

const loggingSetting = () => {
  return (req, res, next) => {
    const originResultSend = res.send;
 
    res.send = function (resBody) {
      if (typeof resBody !== 'string' 
          && !req.originalUrl.startsWith('/api/log')
          && !req.originalUrl.startsWith('/api/auth')) {
        logging(req, res, resBody);
      }
  
      return originResultSend.call(this, resBody);
    }
    next();
  }
}

module.exports = loggingSetting;

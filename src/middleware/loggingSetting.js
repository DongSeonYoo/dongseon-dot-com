const logging = require("../module/logging");

const loggingSetting = () => {
  return (req, res, next) => {
    const originResultSend = res.send;
 
    res.send = function (result) {
      // if(typeof result !== 'string'){} ?
      if (typeof result !== 'string' && (req.originalUrl.indexOf('/log?') === -1 || req.originalUrl.indexOf('/log') === -1)) {
        logging(req, res, result);
      }
  
      return originResultSend.call(this, result);
    }
    next();
  }
}

module.exports = loggingSetting;

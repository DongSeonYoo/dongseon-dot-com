const db = require("../../database/connect/mariadb");
const { makeResult, printError } = require("../../common/common");

const login = (req, res) => {
  const { loginId, pw } = req.body;
  const result = makeResult();

  const sql = "SELECT id FROM user_TB WHERE login_id = ? AND password = ?";
  const param = [loginId, pw];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results[0];
    if (data) {
      result.success = true;
      result.message = data.id;

    } else {
      result.message = `아이디 또는 비밀번호가 올바르지 않습니다`;
    }

    res.send(result);
  });
};

module.exports = {
  login,

}
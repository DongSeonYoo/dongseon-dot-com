const router = require("express").Router();
const common = require("../common");
const db = require("../database/connect/mariadb");

const makeResult = common.makeResult;
const printError = common.printError;

// 로그인 api
// loginId, pw
// POST
router.post("/login", (req, res) => {
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
});

// 회원가입 api
// loginId, pw, name, phoneNumber, email
// POST
router.post("/signup", (req, res) => {
  const { loginId, pw, name, phoneNumber, email } = req.body;
  const result = makeResult();

  const sql = "INSERT INTO user_TB (login_id, password, name, phone_number, email) VALUES (?, ?, ?, ?, ?)";
  const param = [loginId, pw, name, phoneNumber, email];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const isRegistered = results.affectedRows === 0;
    if (!isRegistered) {
      result.success = true;
      result.message = "회원가입 성공";
    }

    res.send(result);
  });
});

// 아이디 찾기 api
// name, phoneNumber, email
// GET
router.get("/loginId", (req, res) => {
  const { name, phoneNumber, email } = req.query;
  const result = makeResult();

  const sql = "SELECT login_id FROM user_TB WHERE name = ? AND phone_number = ? AND email = ?";
  const param = [name, phoneNumber, email];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results[0];
    if (data) {
      result.success = true;
      result.message = data.login_id;

    } else {
      result.message = "해당하는 아이디가 없습니다";
    }

    res.send(result);
  });
});

// 비밀번호 찾기 api
// 1.(사용자 인증 단계)
// loginId, name, phoneNumber, email
router.get("/pw", (req, res) => {
  const { loginId, name, phoneNumber, email } = req.query;
  const result = makeResult();

  const sql = "SELECT id FROM user_TB WHERE login_id = ? AND name = ? AND phone_number = ? AND email = ?";
  const param = [loginId, name, phoneNumber, email];

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
      result.message = "해당하는 유저가 없습니다";
    }

    res.send(result);
  });
});

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// userId, newPw
router.post("/pw", (req, res) => {
  const { userId, newPw } = req.body;
  const result = makeResult();

  const sql = "UPDATE user_TB SET password = ? WHERE id = ?";
  const param = [newPw, userId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const isModified = results.affectedRows === 0;
    if (!isModified) {
      result.success = true;
      result.message = "재설정 성공";

    } else {
      result.message = "재설정 실패, 해당하는 사용자를 찾지 못했습니다";
    }

    res.send(result);
  });
});

// 프로필 보기 api
// userId
// GET
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const result = makeResult();

  const sql = "SELECT login_id, name, phone_number, email, created_date, updated_date from user_TB WHERE id = ?";
  const param = [userId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results[0];
    if (data) {
      result.success = true;
      result.message = data;

    } else {
      result.message = "조회에 실패하였습니다. (존재하지 않는 유저)";
    }

    res.send(result);
  });
});

// 회원 정보 수정 api
// userId, name, phoneNumber, email
// PUT
router.put("/", (req, res) => {
  const { userId, name, phoneNumber, email } = req.body;
  const result = makeResult();

  const sql = "UPDATE user_TB SET name = ?, phone_number = ?, email = ? WHERE id = ?";
  const param = [name, phoneNumber, email, userId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "수정에 성공하였습니다";

    } else {
      result.message = "수정에 실패하였습니다";
    }

    res.send(result);
  });
});

// 회원 탈퇴 api
// userId
// DELETE
router.delete("/", (req, res) => {
  const { userId } = req.body;
  const result = makeResult();

  const sql = "DELETE FROM user_TB WHERE id = ?";
  const param = [userId];

  db.query(sql, param, (error, results, fields) => {
    if (error) {
      printError(error, result, res);
      return;
    }

    const data = results.affectedRows === 0;
    if (!data) {
      result.success = true;
      result.message = "탈퇴되었습니다";

    } else {
      result.message = "탈퇴에 실패하였습니다";
    }

    res.send(result);
  })
});

module.exports = router;
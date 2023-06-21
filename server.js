const express = require("express");
const app = express();

// db connect
const db = require("./database/connect/mariadb");
const { error } = require('console');
db.connect();

app.use(express.json());

// 로그인 api
// POST
app.post("/account/login", (req, res) => {
  const { id, pw } = req.body;

  const result = makeResult();

  const query = "SELECT id FROM user_TB WHERE login_id=? AND password=?";
  const params = [id, pw];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error;
      res.send(result);
      return;
    }

    const data = results[0];
    if (data) {
      result.success = true;
      result.message = "로그인 성공";

    } else {
      result.message = "아이디 혹은 비밀번호가 올바르지 않습니다.";
    }

    res.send(result);
  });
});

// 회원가입 api
// id, pw, name, phoneNumber, email
// POST
app.post("/account/signup", (req, res) => {
  const { id, pw, name, phoneNumber, email } = req.body;

  const result = makeResult();

  const query = "INSERT INTO user_TB (login_id, password, name, phone_number, email, created_date, updated_date) VALUES (?, ?, ?, ?, ?, now(), now())";
  const params = [id, pw, name, phoneNumber, email];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = `회원가입 실패: ${error}`;
      res.send(result);
      return;
    }

    const isRegistered = results.affectedRows === 1;
    if (isRegistered) {
      result.success = true;
      result.message = "회원가입 성공";
    }

    res.send(result);
  })
});

// 아이디 찾기 api
// name, phoneNumber, email
// GET
app.get("/account/id", (req, res) => {
  const { name, phoneNumber, email } = req.body;

  const result = makeResult();

  const query = "SELECT login_id FROM user_TB WHERE name=? AND phone_number=? AND email=?";
  const params = [name, phoneNumber, email];
  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error;
      res.send(result);
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
// id, name, phoneNumber, email
app.post("/accout/find-pw/validate", (req, res) => {
  const { id, name, phoneNumber, email } = req.body;

  const result = makeResult();

  const query = "SELECT id FROM user_TB WHERE login_id=? AND name=? AND phone_number=? AND email=?";
  const params = [id, name, phoneNumber, email];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error;
      res.send(result);
      return;
    }

    const data = results[0];

    if (data) {
      result.success = true;
      result.message = data.id;

    } else {
      result.message = "해당하는 사용자를 찾지 못했습니다";
    }

    res.send(result);
  });
});

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// userPk, newPassword
app.post("/accout/find-pw/reset-pw", (req, res) => {
  const { userPk, newPassword } = req.body;

  const result = makeResult();

  const query = "UPDATE user_TB SET password=? WHERE id=?";
  const params = [newPassword, userPk];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error;
      res.send(result);
      return;
    }

    const isModified = results.affectedRows === 1;
    if (isModified) {
      result.success = true;
      result.message = "재설정 성공";
    } else {
      result.message = "재설정 실패, 해당하는 사용자를 찾지 못했습니다";
    }

    res.send(result);
  });
});

app.listen(8000, () => {
  console.log("8000번 포트에서 기다리는중");
});

function makeResult() {
  return {
    success: false,
    message: "",
  };
};
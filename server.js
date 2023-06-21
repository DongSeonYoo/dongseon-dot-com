const express = require("express");
const app = express();

// db connect
const db = require("./database/connect/mariadb");
db.connect();

app.use(express.json());

// 로그인 api
// POST
app.post("/account/login", (req, res) => {
  const { id, pw } = req.body;

  const result = {
    "success": false,
    "message": ""
  }

  const query = "SELECT id FROM user_TB WHERE login_id=? AND password=?";
  const params = [id, pw];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = "데이터베이스 오류";
      res.send(result);
      return;
    }

    if (results.length) {
      result.success = true;
      result.message = "로그인 성공";

    } else {
      result.message = "아이디 혹은 비밀번호가 올바르지 않습니다.";
    }

    res.send(result);
  }
  );
});

// 회원가입 api
// id, pw, name, phone_number, email
// POST
app.post("/account/signup", (req, res) => {
  const { id, pw, name, phoneNumber, email } = req.body;

  const result = {
    success: false,
    message: "",
  };

  const query = "INSERT INTO user_TB (login_id, password, name, phone_number, email, created_date, updated_date) VALUES (?, ?, ?, ?, ?, now(), now())";
  const params = [id, pw, name, phoneNumber, email];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      const isDuplicateId = String(error).includes("login_id");
      const isDuplicatePhoneNumber = String(error).includes("phone_number");
      const isDuplicatedEmail = String(error).includes("email");

      if (isDuplicateId) {
        result.message = "중복된 아이디가 존재합니다";

      } else if (isDuplicatePhoneNumber) {
        result.message = "중복된 전화번호가 존재합니다";

      } else if (isDuplicatedEmail) {
        result.message = "중복된 이메일이 존재합니다";
      }

    } else {
      result.success = true;
      result.message = "회원가입 성공";
    }

    res.send(result);
  }
  );
});

// 아이디 찾기 api
// name, phoneNumber, email
// GET
app.get("/account/id", (req, res) => {
  const { name, phoneNumber, email } = req.query;

  const result = {
    success: false,
    message: {},
  }

  const query = "SELECT login_id FROM user_TB WHERE name=? AND phone_number=? AND email=?";
  const params = [name, phoneNumber, email];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      console.log(error);

    } else {

      if (results.length > 0) {
        result.success = true;
        result.message = results[0].login_id;

      } else {
        result.success = false;
        result.message = "아이디를 찾지 못했습니다";
      }
    }

    res.send(result);
  })
})

// 비밀번호 찾기 api
// 1.(사용자 인증 단계)
// id, name, phoneNumber, email
app.post("/accout/find-pw/validate", (req, res) => {
  const { id, name, phoneNumber, email } = req.body;

  const result = {
    success: false,
    message: "",
  };

  const query = "SELECT id FROM user_TB WHERE login_id=? AND name=? AND phone_number=? AND email=?";
  const params = [id, name, phoneNumber, email];

  db.query(query, params, (error, results, fields) => {
    if (error) {
      console.log(error);
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
  })
})

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// newPassword
app.post("/accout/find-pw/reset-pw", (req, res) => {

  res.send();
})



app.listen(8000, () => {
  console.log("8000번 포트에서 기다리는중");
})
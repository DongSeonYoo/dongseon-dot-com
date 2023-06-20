const express = require("express");
const app = express();

// db connect
const db = require("./database/connect/mariadb");
db.connect();

app.use(express.json());

// 로그인 api
// GET
app.post("/login", (req, res) => {
  const { id, pw } = req.body;

  const result = {
    "success": false,
    "message": ""
  }

  db.query(
      `SELECT id FROM user_TB WHERE login_id='${id}' AND password='${pw}'`,
      (error, results, fields) => {
      if (error) {
        result.message = "데이터베이스 오류.";
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
app.post("/signup", (req, res) => {
  const { id, pw, name, phoneNumber, email } = req.body;

  const result = {
    success: false,
    message: "",
  };

  db.query(
    `INSERT INTO user_TB (login_id, password, name, phone_number, email, created_date, updated_date) VALUES ('${id}', '${pw}', '${name}', '${phoneNumber}', '${email}', now(), now())`,
    (error, results, fields) => {
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

app.listen(8000, () => {
  console.log("8000번 포트에서 기다리는중");
})
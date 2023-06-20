const express = require("express");
const app = express();

// db connect
const db = require("./database/connect/mariadb");
db.connect();

app.use(express.json());

// 로그인 api
// GET
app.get("/login", (req, res) => {
  const { id, pw } = req.query;

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

      if (results.length === 1) {
        result.success = true;
        result.message = "로그인 성공";
        
      } else {
        result.message = "아이디 혹은 비밀번호가 올바르지 않습니다.";
      }

      res.send(result);
    }
  );
});

app.listen(8000, () => {
  console.log("8000번 포트에서 기다리는중");
})
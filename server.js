const express = require("express");
const app = express();

app.use(express.json());

let userDB = [];

// 로그인 api
app.get("/login", (req, res) => {
  const { id, pw } = req.body;

  const result = {
    "success": false,
    "message": ""
  }

  if (id === "ehdtjs0612" && pw === "1234") {
    result.success = true;
    result.message = "로그인 성공";

  } else {
    result.message = "아이디 혹은 비밀번호가 올바르지 않습니다";
  }

  res.send(result);
});

// 회원가입api
//(아이디, 비밀번호, 이메일, 전화번호) body로 넘겨줌
app.post("/signup", (req, res) => {
  const { id, pw, email, phoneNumber } = req.body;

  const result = {
    "success": false,
  }

  // db연결 일단은 배열로 임시 db 만들자
  const user = {
    "id": id,
    "pw": pw,
    "email": email,
    "phoneNumber": phoneNumber
  };

  userDB.push(user);
  result.success = true;

  res.send(userDB);
})



app.listen(8000, () => {
  console.log("8000포트에서 실행");
})
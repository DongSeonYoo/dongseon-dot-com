const express = require("express");
const app = express();

app.use(express.json());

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

app.listen(8000, () => {
  console.log("8000포트에서 실행");
})
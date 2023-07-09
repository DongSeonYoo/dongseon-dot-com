const express = require("express");
const router = express.Router();
const createClient = require("../database/connect/postgresql");
const data = require("../module/util/validate");

const validate = {
  message: "데이터 형식이 유효하지 않습니다"
}

// 로그인 api
// loginId, pw
// POST
router.post("/login", async (req, res) => {
  const { loginId, pw } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const idValidate = data(loginId).checkInput().checkLength(1, 20);
  const pwValidate = data(pw).checkInput().checkLength(1, 15);
  if (!idValidate || !pwValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "SELECT id FROM user_TB WHERE login_id = $1 AND password = $2";
    const params = [loginId, pw];
    const data = await client.query(sql, params)

    const row = data.rows;
    if (row.length !== 0) {
      result.isSuccess = true;
      result.data = row[0].id;
      result.message = "로그인 성공";
    } else {
      result.isSuccess = false;
      result.message = "아이디 또는 비밀번호가 올바르지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.db.errorMessage = "POST /api/account/ error: " + error.message;

  } finally {
    res.send(result);
    await client.end();
  };
});

// 회원가입 api
// loginId, pw, name, phoneNumber, email
// POST
router.post("/signup", async (req, res) => {
  const { loginId, pw, name, phoneNumber, email } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const idValidate = data(loginId).checkInput().checkIdRegex();
  const pwValidate = data(pw).checkInput().checkPwRegex();
  const nameValidate = data(name).checkInput().checkNameRegex();
  const phoneNumberValidate = data(phoneNumber).checkInput().checkPhoneNumberRegex();
  const emailValidate = data(email).checkInput().checkEmailRegex();
  if (!idValidate || !pwValidate || !nameValidate || !phoneNumberValidate || !emailValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `INSERT INTO user_TB (login_id, password, name, phone_number, email) VALUES ($1, $2, $3, $4, $5)`;
    const params = [loginId, pw, name, phoneNumber, email];
    const data = await client.query(sql, params);
    if (data.rowCount !== 0) {
      result.isSuccess = true;
      result.message = "회원가입 성공";
    } else {
      result.db.errorMessage = "회원가입 실패 (데이터베이스 오류)";
    }

  } catch (error) {
    console.error(error);
    result.db.errorMessage = "POST /api/account/ error: " + error.message;

  } finally {
    res.send(result);
    await client.end();
  }
});

// 아이디 찾기 api
// name, phoneNumber, email
// GET
router.get("/loginId", async (req, res) => {
  const { name, phoneNumber, email } = req.query;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: "",
    }
  };

  const nameValidate = data(name).checkInput().checkLength(2, 8);
  const phoneNumberValidate = data(phoneNumber).checkInput().checkLength(1, 11);
  const emailValidate = data(email).checkInput().checkLength(1, 320);
  if (!nameValidate || !phoneNumberValidate || !emailValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "SELECT login_id FROM user_TB WHERE name = $1 AND phone_number = $2 AND email = $3";
    const params = [name, phoneNumber, email];
    const data = await client.query(sql, params);
    if (data.rows.length !== 0) {
      result.isSuccess = true;
      result.data = data.rows[0].login_id;
      result.message = "아이디 찾기 성공";

    } else {
      result.message = "해당하는 아이디가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.db.errorMessage = "GET /api/account/findId/ error: " + error.message;

  } finally {
    res.send(result);
    await client.end();
  }
});

// 비밀번호 찾기 api
// 1.(사용자 인증 단계)
// GET
// loginId, name, phoneNumber, email
router.get("/pw", async (req, res) => {
  const { loginId, name, phoneNumber, email } = req.query;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: ""
    }
  }

  const idValidate = data(loginId).checkInput().checkLength(1, 20);
  const nameValidate = data(name).checkInput().checkLength(1, 10);
  const phoneNumberValidate = data(phoneNumber).checkInput().checkLength(1, 11);
  const emailValidate = data(email).checkInput().checkLength(1, 50);
  if (!idValidate || !nameValidate || !phoneNumberValidate || !emailValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `SELECT id FROM user_TB WHERE login_id = $1 AND name = $2 AND phone_number = $3 AND email = $4`;

    const params = [loginId, name, phoneNumber, email];
    const data = await client.query(sql, params);
    if (data.rows.length !== 0) {
      result.isSuccess = true;
      result.data = data.rows[0].id;

    } else {
      result.message = "해당하는 사용자가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.db.errorMessage = "GET /api/account/ error: " + error.message;

  } finally {
    res.send(result);
    await client.end();
  }
});

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// PUT
// userId, newPw
router.put("/pw", async (req, res) => {
  const { userId, newPw } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: ""
    }
  }

  const userIdValidate = data(userId).checkInput().checkLength(1, 10);
  const newPwValidate = data(newPw).checkInput().checkPwRegex();
  if (!userIdValidate || !newPwValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "UPDATE user_TB SET password = $1 WHERE id = $2";
    const param = [newPw, userId];
    const data = await client.query(sql, param);
    if (data.rowCount !== 0) {
      result.success = true;
      result.message = "수정 성공"

    } else {
      result.message = "해당하는 유저가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = "PUT /api/account/ error: " + error.message;

  } finally {
    await client.end();
    res.send(result);
  }
});

// 프로필 보기 api
// userId
// GET
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: ""
    }
  }
  const userIdValidate = data(userId).checkInput().checkLength(1, 10);
  if (!userIdValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `SELECT login_id, name, phone_number, email, created_date, updated_date 
                    FROM user_TB WHERE id = $1`;
    const params = [userId];
    const data = await client.query(sql, params);
    if (data.rows.length !== 0) {
      result.isSuccess = true;
      result.data = data.rows[0];
    } else {
      result.message = "해당하는 사용자가 없습니다";
    }

  } catch (error) {
    console.error(error);
    result.db.errorMessage = "/api/account/:userId/ error: " + error.message;

  } finally {
    await client.end();
    res.send(result);
  }
});

// 회원 정보 수정 api
// userId, name, phoneNumber, email
// PUT
router.put("/", async (req, res) => {
  const { userId, name, phoneNumber, email } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: ""
    }
  }

  const userIdValidate = data(userId).checkInput().checkLength(1, 10);
  const nameValidate = data(name).checkInput().checkNameRegex();
  const phoneNumberValidate = data(phoneNumber).checkInput().checkPhoneNumberRegex();
  const emailValidate = data(email).checkInput().checkEmailRegex();
  if (!userIdValidate || !nameValidate || !phoneNumberValidate || !emailValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "UPDATE user_TB SET name = $1, phone_number = $2, email = $3 WHERE id = $4";
    const param = [name, phoneNumber, email, userId];

    const data = await client.query(sql, param);
    if (data.rowCount !== 0) {
      result.isSuccess = true;
      result.message = "수정 성공"

    } else {
      result.message = "해당하는 유저가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.db.errorMessage = "DELETE /api/account/ error: " + error.message;

  } finally {
    await client.end();
    res.send(result);
  }
});

// 회원 탈퇴 api
// userId
// DELETE
router.delete("/", (req, res) => {
  const { userId } = req.body;
  const result = {
    isSuccess: false,
    data: "",
    message: "",
    db: {
      errorMessage: ""
    }
  }

  const userIdValidate = data(userId).checkInput().checkLength(1, 10);
  if (!userIdValidate) {
    result.message = validate.message;
    res.send(result);
    return;
  }

  const client = createClient();
  client.connect()
    .then(() => {
      const sql = "DELETE FROM user_TB WHERE id = $1";
      const param = [userId];

      return client.query(sql, param);
    })
    .then((data) => {
      if (data.rowCount !== 0) {
        result.isSuccess = true;
        result.message = "삭제 성공";
      } else {
        result.message = "해당하는 사용자가 존재하지 않습니다";
      }
    })
    .catch((err) => {
      result.db.errorMessage = "DELETE /api/account/" + err.message;
      console.error(err);
    })
    .finally(() => {
      client.end();
      res.send(result);
    })
});

module.exports = router;
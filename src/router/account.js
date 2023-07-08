const express = require("express");
const router = express.Router();

const createClient = require("../database/connect/postgresql");
const { makeResult, printError } = require("../module/util/func");
const accountValidate = require("../module/util/validate/accountValidate");

function Validate(data) {
  this.isValid = true;

  this.checkInput = () => {
    if (typeof data === undefined || data === "") {
      this.isValid = false;
    }

    return this;
  }

  this.checkLength = (minLength, maxLength) => {
    if (data.length < minLength || data.length > maxLength) {
      this.isValid = false;
    }

    return this;
  }
}

const data = (data) => {
  return new Validate(data);
}

// 로그인 api
// loginId, pw
// POST
// 어떤걸 검증? 길이만 검증한다. 아이디(1 ~ 30) 비밀번호 (1 ~ 20)
router.post("/login", async (req, res) => {
  const { loginId, pw } = req.body;
  const result = {
    isSuccess: true,
    data: "",
    errorMessage: ""
  };

  const idValidate = data(loginId).checkInput().checkLength(1, 30).isValid;
  const pwValidate = data(pw).checkInput().checkLength(1, 20).isValid;
  if (!idValidate || !pwValidate) {
    result.isSuccess = false;
    result.errorMessage = "유효하지 않은 데이터 형식입니다";
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
    }  else {
      result.isSuccess = false;
      result.errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.errorMessage = "POST /api/account/ error: " + error.message;
    
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
  const result = makeResult();

  const isValidateInput = accountValidate.validateSignupInput(loginId, pw, name, phoneNumber, email);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `INSERT INTO user_TB (login_id, password, name, phone_number, email) VALUES ($1, $2, $3, $4, $5)`;
    const params = [loginId, pw, name, phoneNumber, email];
    const data = await client.query(sql, params);
    result.message = data;

  } catch (error) {
    console.error(error);
    result.message = "POST /api/account/ error: " + error.message;

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
  const result = makeResult();

  const isValidateInput = accountValidate.validateFindIdInput(name, phoneNumber, email);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = "SELECT login_id FROM user_TB WHERE name = $1 AND phone_number = $2 AND email = $3";
    const params = [name, phoneNumber, email];
    const data = await client.query(sql, params);

    const row = data.rows[0];
    if (row.length !== 0) {
      result.success = true;
      result.message = row.login_id;

    } else {
      result.message = "해당하는 아이디가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = "GET /api/account/findId/ error: " + error.message;

  } finally {
    res.send(result);
    await client.end();
  }
});

// 비밀번호 찾기 api
// 1.(사용자 인증 단계)
// loginId, name, phoneNumber, email
router.get("/pw", async (req, res) => {
  const { loginId, name, phoneNumber, email } = req.query;
  const result = makeResult();

  const isValidateInput = accountValidate.validateUserInput(loginId, name, phoneNumber, email);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();
    const sql = `SELECT id FROM user_TB WHERE login_id = $1 AND name = $2 AND phone_number = $3 AND email = $4`;

    const params = [loginId, name, phoneNumber, email];
    const data = await client.query(sql, params);

    const row = data.rows;
    if (row.length !== 0) {
      result.success = true;
      result.message = row[0].id;
    } else {
      result.message = "해당하는 사용자가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = "GET /api/account/ error: " + error.message;

  } finally {
    res.send(result);
    await client.end();
  }
});

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// userId, newPw
router.put("/pw", async (req, res) => {
  const { userId, newPw } = req.body;
  const result = makeResult();

  const isValidateInput = accountValidate.validateResetPwInput(userId, newPw);
  if (!isValidateInput) {
    result.message = validateMessage;
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
    client.end();
    await res.send(result);
  }
});

// 프로필 보기 api
// userId
// GET
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = makeResult();

  const isValidateInput = accountValidate.validateViewProfileInput(userId);
  if (!isValidateInput) {
    result.message = validateMessage;
    res.send(result);
    return;
  }

  const client = createClient();
  try {
    await client.connect();

    const sql = "SELECT login_id, name, phone_number, email, created_date, updated_date from user_TB WHERE id = $1";
    const params = [userId];
    const data = await client.query(sql, params);

    const row = data.rows;
    if (row.length !== 0) {
      result.success = true;
      result.message = row[0];
    } else {
      result.message = "해당하는 사용자가 없습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = "/api/account/:userId/ error: " + error.message;
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
  const result = makeResult();

  const isValidateInput = accountValidate.validateModifyPrifileInput(userId, name, phoneNumber, email);
  if (!isValidateInput) {
    result.message = validateMessage;
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
      result.success = true;
      result.message = "수정 성공"

    } else {
      result.message = "해당하는 유저가 존재하지 않습니다";
    }

  } catch (error) {
    console.error(error);
    result.message = "DELETE /api/account/ error: " + error.message;
    
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
  const result = makeResult();

  const validateUserInput = accountValidate.validateDeleteUserInput(userId);
  if (!validateUserInput) {
    result.message = validateMessage;
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
      result.success = true;
      result.message = "삭제 성공";
    } else {
      result.message = "해당하는 사용자가 존재하지 않습니다";
    }
  })
  .catch((err) => {
    result.message = "DELETE /api/account/" + err.message;
    console.error(err);
  })
  .finally(() => {
    client.end();
    res.send(result);
  })
});

module.exports = router;
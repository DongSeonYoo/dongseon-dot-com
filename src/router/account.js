const express = require("express");
const router = express.Router();
const pool = require("../../config/database/postgresql");
const exception = require("../module/exception");
const { maxUserIdLength, maxLoginIdLength, maxPwLength, maxNameLength, maxPhoneNumberLength, maxEmailLength } = require("../module/global");

const loginAuth = require("../middleware/loginAuth");
const jwt = require("../module/jwt");
const dailyLoginCount = require("../module/dailyLoginCount");

const AWS = require("../../config/s3");
const s3 = new AWS.S3();

require("dotenv").config();

router.post("/login", async (req, res, next) => {
    const { loginId, password } = req.body;
    const result = {
        message: "",
        token: null
    };
    let client = null;

    try {
        // request값 유효성 검증
        exception(loginId, "loginId").checkInput().checkLength(1, maxLoginIdLength);
        exception(password, "password").checkInput().checkLength(1, maxPwLength);
        if (loginId === process.env.ADMIN_ID && password === process.env.ADMIN_PW) {
            const token = await jwt.adminSign();
            res.cookie('accessToken', token);
            return res.redirect('/admin');
        }

        // db연결
        client = await pool.connect();

        const sql = "SELECT id, login_id, name FROM user_TB WHERE login_id = $1 AND password = $2";
        const params = [loginId, password];
        const data = await client.query(sql, params);

        if (data.rows.length !== 0) {
            const userData = data.rows[0];
            const token = await jwt.userSign(userData);
            dailyLoginCount.writeUser(loginId);

            result.message = "로그인 성공";
            result.token = token;
        } else {
            result.message = "아이디 또는 비밀번호가 올바르지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
});

// 로그아웃 api
router.get("/logout", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
    };

    try {
        result.message = "로그아웃 성공";
        res.clearCookie("accessToken");
        res.send(result);

    } catch (error) {
        result.message = error.message;
        next(error);
    }
});

// 아이디 중복체크 api
// GET
// pathVariable: loginId
router.get("/id/duplicate/:loginId", async (req, res, next) => {
    const { loginId } = req.params;
    const result = {
        data: false,
        message: "",
    };
    let client = null;

    try {
        exception(loginId, "loginId").checkInput().checkIdRegex();

        client = await pool.connect();
        const sql = "SELECT id FROM user_TB WHERE login_id = $1";
        const params = [loginId];
        const data = await client.query(sql, params);

        if (data.rows.length !== 0) {
            result.data = true;
        } else {
            result.data = false;
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);
    } finally {
        if (client) {
            await client.release();
        }
    }
});

// 전화번호 중복체크 api
// GET
// pathVariable: phoneNumber
router.get("/phoneNumber/duplicate/:phoneNumber", async (req, res, next) => {
    const { phoneNumber } = req.params;
    const result = {
        data: false,
        message: "",
    };
    let client = null;

    try {
        exception(phoneNumber, "phoneNumber").checkInput().checkPhoneNumberRegex();

        client = pool.connect();
        const sql = "SELECT phone_number FROM user_TB WHERE phone_number = $1";
        const params = [phoneNumber];
        const data = await client.query(sql, params);
        if (data.rows.length !== 0) {
            result.data = true;
        } else {
            result.data = false;
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);
    } finally {
        if (client) {
            await client.release();
        }
    }
})

// 이메일 중복체크 api
// GET
// pathVariable: email
router.get("/email/duplicate/:email", async (req, res, next) => {
    const { email } = req.params;
    const result = {
        data: false,
        message: "",
    };
    let client = null;

    try {
        exception(email, "email").checkInput().checkEmailRegex();
        client = await pool.connect();
        const sql = "SELECT email FROM user_TB WHERE email = $1";
        const params = [email];
        const data = await client.query(sql, params);
        if (data.rows.length !== 0) {
            result.data = true;
        } else {
            result.data = false;
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);
    } finally {
        if (client) {
            await client.release();
        }
    }
})

// 회원가입 api
// loginId, password, name, phoneNumber, email
// POST
router.post("/signup", async (req, res, next) => {
    const { loginId, password, name, phoneNumber, email } = req.body;
    const result = {
        data: "",
        message: "",
    };
    let client = null;

    try {
        exception(loginId, "loginId").checkInput().checkIdRegex();
        exception(password, "password").checkInput().checkPwRegex();
        exception(name, "name").checkInput().checkNameRegex();
        exception(phoneNumber, "phoneNumber").checkInput().checkPhoneNumberRegex();
        exception(email, "email").checkInput().checkEmailRegex();

        client = pool.connect();
        const sql = `INSERT INTO user_TB (login_id, password, name, phone_number, email) VALUES ($1, $2, $3, $4, $5)`;
        const params = [loginId, password, name, phoneNumber, email];

        const data = await client.query(sql, params);
        if (data.rowCount !== 0) {
            result.message = "회원가입 성공";
        }
        res.send(result);

    } catch (error) {
        console.error(error)
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    };
});

// 아이디 찾기 api
// name, phoneNumber, email
// GET
router.get("/loginId", async (req, res, next) => {
    const { name, phoneNumber, email } = req.query;
    const result = {
        data: "",
        message: ""
    }
    let client = null;

    try {
        exception(name, "name").checkInput().checkLength(1, maxNameLength);
        exception(phoneNumber, "phoneNumber").checkInput().checkLength(maxPhoneNumberLength, maxPhoneNumberLength);
        exception(email, "email").checkInput().checkLength(1, maxEmailLength);

        client = await pool.connect();
        const sql = "SELECT login_id FROM user_TB WHERE name = $1 AND phone_number = $2 AND email = $3";
        const params = [name, phoneNumber, email];
        const data = await client.query(sql, params);
        if (data.rows.length !== 0) {
            result.data = data.rows[0].login_id;
        } else {
            result.data = null;
            result.message = "해당하는 아이디가 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
})

// 비밀번호 찾기 api
// 1.(사용자 인증 단계)
// GET
// loginId, name, phoneNumber, email
router.post("/pw", async (req, res, next) => {
    const { loginId, name, phoneNumber, email } = req.body;
    const result = {
        data: "",
        message: "",
    };
    let client = null;

    try {
        exception(loginId, "loginId").checkInput().checkIdRegex();
        exception(name, "name").checkInput().checkNameRegex();
        exception(phoneNumber, "phoneNumber").checkInput().checkPhoneNumberRegex();
        exception(email, "email").checkInput().checkEmailRegex();

        client = await pool.connect();
        const sql = `SELECT id FROM user_TB WHERE login_id = $1 AND name = $2 AND phone_number = $3 AND email = $4`;
        const params = [loginId, name, phoneNumber, email];
        const data = await client.query(sql, params);
        if (data.rows.length !== 0) {
            result.isSuccess = true;
            result.data = data.rows[0].id;
        } else {
            result.data = null;
            result.message = "해당하는 사용자가 없습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
});

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// PUT
// userId, newPw
router.put("/pw", async (req, res, next) => {
    const { userId, newPw } = req.body;
    const result = {
        isSuccess: false,
        data: "",
        message: "",
    };
    let client = null;

    try {
        exception(userId, "userId").checkInput().isNumber().checkLength(1, maxUserIdLength);
        exception(newPw, "newPw").checkInput().checkPwRegex();

        client = await pool.connect();
        const sql = "UPDATE user_TB SET password = $1 WHERE id = $2";
        const param = [newPw, userId];
        const data = await client.query(sql, param);
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            result.message = "비밀번호 수정 성공";
        } else {
            result.message = "해당하는 사용자가 없습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
});

// 프로필 보기 api
// userId
// GET
router.get("/:userId", loginAuth, async (req, res, next) => {
    const { userPk } = req.decoded;
    const result = {
        data: "",
        message: "",
    };
    let client = null;

    try {
        exception(userPk, "userPk").checkInput().isNumber().checkLength(1, maxUserIdLength);

        client = await pool.connect();
        const sql = `SELECT login_id, name, phone_number, email, created_date, updated_date 
                    FROM user_TB WHERE id = $1`;
        const params = [userPk];
        const data = await client.query(sql, params);

        if (data.rows.length !== 0) {
            result.data = data.rows[0];
        } else {
            result.data = null;
            result.message = "해당하는 사용자가 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
});

// 회원 정보 수정 api
// userId, name, phoneNumber, email
// PUT
router.put("/", loginAuth, async (req, res, next) => {
    const { userPk } = req.decoded;
    const { name, phoneNumber, email } = req.body;
    const result = {
        isSuccess: false,
        message: "",
    };
    let client = null;

    try {
        exception(userPk, "userPk").checkInput().isNumber().checkLength(1, maxUserIdLength);
        exception(name, "name").checkInput().checkNameRegex();
        exception(phoneNumber, "phoneNumber").checkInput().checkPhoneNumberRegex();
        exception(email, "email").checkInput().checkEmailRegex();

        client = await pool.connect();
        const sql = "UPDATE user_TB SET name = $1, phone_number = $2, email = $3 WHERE id = $4";
        const params = [name, phoneNumber, email, userPk];
        const data = await client.query(sql, params)
        if (data.rowCount !== 0) {
            result.isSuccess = true;
            result.message = "프로필 수정 성공";
        } else {
            result.message = "해당하는 사용자가 존재하지 않습니다";
        }
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
});

// 회원 탈퇴 api
// userId
// DELETE
router.delete("/", loginAuth, async (req, res, next) => {
    const { userPk } = req.decoded;
    const result = {
        isSuccess: false
    }
    let client = null;

    try {
        exception(userPk, "userPk").checkInput().isNumber().checkLength(1, maxUserIdLength);

        client = await pool.connect();
        const deleteUserSql = "DELETE FROM user_TB WHERE id = $1";
        const deleteUser = [userPk];
        const data = await client.query(deleteUserSql, deleteUser);
        // 삭제 성공 시 해당 토큰을 블랙리스트에 등록
        if (data.rowCount !== 0) {
            const token = req.cookies.accessToken;
            const expiredDate = new Date(req.decoded.exp * 1000);
            const reason = "leave";
            const registerBlackListSql = `INSERT INTO token_blacklist (token, expired_date, reason) VALUES ($1, $2, $3)`;

            const params = [token, expiredDate, reason];
            const data = await client.query(registerBlackListSql, params);
            if (data.rowCount !== 0) {
                result.isSuccess = true;
                const objects = await s3.listObjects({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Prefix: req.decoded.loginId,
                }).promise();

                if (objects.Contents.length > 0) {
                    const deleteParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Delete: {
                            Objects: objects.Contents.map(obj => ({ Key: obj.Key }))
                        }
                    };
                    await s3.deleteObjects(deleteParams).promise();
                }
            }
        }
        res.clearCookie("accessToken");
        res.send(result);

    } catch (error) {
        console.error(error);
        next(error);

    } finally {
        if (client) {
            await client.release();
        }
    }
});

module.exports = router;

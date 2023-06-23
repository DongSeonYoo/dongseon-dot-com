const express = require("express");
const app = express();

// db connect
const db = require("./database/connect/mariadb");
const { error } = require('console');
db.connect();

app.use(express.json());

// 로그인 api
// POST
app.post("/login", (req, res) => {
  const { id, pw } = req.body;
  const { query, params } = makeQuery("SELECT id FROM user_TB WHERE login_id = ? AND password = ?", [id, pw]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
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
app.post("/account", (req, res) => {
  const { id, pw, name, phoneNumber, email } = req.body;
  const { query, params } = makeQuery("INSERT INTO user_TB (login_id, password, name, phone_number, email) VALUES (?, ?, ?, ?, ?)", [id, pw, name, phoneNumber, email]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
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
  const { name, phoneNumber, email } = req.query;
  const { query, params } = makeQuery("SELECT login_id FROM user_TB WHERE name=? AND phone_number=? AND email=?", [name, phoneNumber, email]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
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
app.get("/account/pw", (req, res) => {
  const { id, name, phoneNumber, email } = req.query;
  const { query, params } = makeQuery("SELECT id FROM user_TB WHERE login_id = ? AND name = ? AND phone_number = ? AND email = ?", [id, name, phoneNumber, email]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }
    
    const data = results[0];
    if (data) {
      result.success = true;
      result.message = data;

    } else {
      result.message = "해당하는 유저가 없습니다";
    }

    res.send(result);
  });
});

// 비밀번호 찾기 api
// 2.(비밀번호 재설정 단계)
// userPk, newPassword
app.post("/account/pw", (req, res) => {
  const { userPk, newPw } = req.body;
  const { query, params } = makeQuery("UPDATE user_TB SET password=? WHERE id=?", [newPw, userPk]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
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

// 내 프로필 보기 api
// userPk
// GET
app.get("/account", (req, res) => {
  const { userPk } = req.query;
  const { query, params } = makeQuery("SELECT * from user_TB WHERE id = ?", userPk);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    const data = results[0];
    if (data) {
      result.success = true;
      result.message = data;

    } else {
      result.message = "조회에 실패하였습니다";
    }

    res.send(result);
  });
});

// 회원 정보 수정 api
// userPk, name, phoneNumber, email
// PUT
app.put("/account", (req, res) => {
  const { userPk, name, phoneNumber, email } = req.body;
  const { query, params } = makeQuery("UPDATE user_TB SET name = ?, phone_number = ?, email = ? WHERE id = ?", [name, phoneNumber, email, userPk]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    const data = results.affectedRows === 1;
    if (data) {
      result.success = true;
      result.message = "수정에 성공하였습니다";

    } else {
      result.message = "수정에 실패하였습니다";
    }

    res.send(result);
  });
});

// 회원 탈퇴 api
// userPk
// DELETE
app.delete("/account", (req, res) => {
  const { userPk } = req.body;
  const { query, params } = makeQuery("DELETE FROM user_TB WHERE id = ?", [userPk]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    const data = results.affectedRows === 1;
    if (data) {
      result.success = true;
      result.message = "탈퇴되었습니다";

    } else {
      result.message = "탈퇴에 실패하였습니다";
    }

    res.send(result);
  })
});

// 게시글 작성 api
// userPk, title, content
app.post("/post", (req, res) => {
  const { userPk, title, content } = req.body; 
  const { query, params } = makeQuery("INSERT INTO post_TB (user_id, title, content) VALUES (?, ?, ?)", [userPk, title, content]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error;
      res.send(result);
      return;
    }

    const data = results.affectedRows === 1;
    if (data) {
      result.success = true;
      result.message = "작성에 성공하였습니다";

    } else {
      result.message = "게시글 작성에 실패하였습니다";
    }

    res.send(result);
  });
});

// 모든 게시글 조회 api
// GET
app.get("/posts", (req, res) => {
  // const { query, params } = makeQuery("SELECT * FROM post_TB LIMIT ?, ?", [1, 10]);
  const { query } = makeQuery("SELECT * FROM post_TB");
  const result = makeResult();

  db.query(query, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    result.success = true;
    result.message = results;
    res.send(result);
  });
});

// 특정 게시글 조회 api
// postId
// GET
app.get("/post/:postId", (req, res) => {
  const { postId } = req.params;
  const { query, params } = makeQuery("SELECT * FROM post_TB WHERE id = ?", [postId]);
  
  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    // 게시글을 찾으면 true, 찾지 못하면 false
    const isFindPost = results.length !== 0;
    if (isFindPost) {
      result.success = true;
      result.message = results;

    } else {
      result.message = "해당하는 게시글이 존재하지 않습니다";
    }
    
    res.send(result);
  });
});

// 특정 사용자의 게시글을 조회
// userId
// GET
app.get("/:userId/posts", (req, res) => {
  const { userId } = req.params;
  const { query, params } = makeQuery("SELECT * FROM post_TB JOIN user_TB ON post_TB.user_id = user_TB.id WHERE user_TB.login_id = ?", [userId]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    // 게시글을 찾으면 true, 찾지 못하면 false
    const isFindPost = results.length !== 0;
    if (isFindPost) {
      result.success = true;
      result.message = results;

    } else {
      result.message = "해당하는 사용자의 게시글이 존재하지 않습니다";
    }
    
    res.send(result);
  });
});

// 게시글 제목 수정
// userId, postId, title
// PATCH
app.patch("/post/:postId/title", (req, res) => {
  const { postId } = req.params;
  const { userId, title } = req.body;
  const { query, params } = makeQuery("UPDATE post_TB SET title = ? WHERE user_id = ? AND id = ?", [title, userId, postId]);

  const result = makeResult();

  db.query(query, params, (error, results, fields) => {
    if (error) {
      result.message = error.sqlMessage;
      res.send(result);
      return;
    }

    const data = results.affectedRows === 1;
    if (data) {
      result.success = true;
      result.message = "수정 성공";

    } else {
      result.message = "수정 실패";
    }

    res.send(result);
  });
});

// 게시글 본문 수정
// userId, postId, content
// PATCH
app.patch("/post/:postId/content", (req, res) => {

});

// 게시글 수정
// userId, postId, title, content
// PUT
app.put("/post/:postId", (req, res) => {

});

// 게시글 삭제
// userId, postId
// DELETE
app.delete("post/:postId", (req, res) => {

});

app.listen(8000, () => {
  console.log("8000번 포트에서 기다리는중");
});

function makeResult() {
  return {
    success: false,
    message: "",
  };
}

function makeQuery(sql, params) {
  return {
    query: sql,
    params: params,
  };
}
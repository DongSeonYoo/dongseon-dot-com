const errorHandling = () => {
  return (err, req, res, next) => {
    const result = {
      message: "",
    }
    // 유효하지 않은 요청
    if (err.status === 400) {
      result.message = err.message;
      res.status(400).send(result);
  
    // 토큰 inavlid
    } else if (err.status === 401) {
      result.message = "로그인 후 이용가능합니다";
      res.status(401).send(result);
      
    // 토큰 expired
    } else if (err.status === 419) {
      result.message = "토큰이 만료되었습니다, 다시 로그인해주세요";
      res.status(401).send(result);

    // 권한 거부
    } else if (err.status === 403) {
      result.message = "권한이 거부되었습니다";
      res.status(403).send(result);

      // unique 제약조건 위반
    } else if (err.code === '23505') {
      result.message = err.message;
      res.status(400).send(result);
  
    // fk 에러
    } else if (err.code === '23503') {
      if (err.constraint === "comment_tb_user_id_fkey") {
        result.message = "해당하는 유저가 존재하지 않습니다";
        res.status(400).send(result);
      }
      else if (err.constraint === "comment_tb_post_id_fkey") {
        result.message = "해당하는 게시글이 존재하지 않습니다";
        res.status(400).send(result);
      }

      else if (err.constraint === "post_tb_user_id_fkey") {
        result.message = "해당하는 유저가 존재하지 않습니다";
        res.status(400).send(result);
      }

    } else {
      console.error(err);
      result.message = "서버에서 오류가 발생하였습니다";
      res.status(500).send(result);
    }
  }
}

module.exports = errorHandling;
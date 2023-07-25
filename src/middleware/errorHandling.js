const errorHandling = () => {
  return (err, req, res, next) => {
    // 유효하지 않은 요청
    if (err.status === 400) {
      res.status(400).send({
        isSuccess: false,
        message: err.message,
      });
  
    // unique 제약조건 위반
    } else if (err.code === '23505') {
      res.status(400).send({
        message: "제약조건 위반: " + err.constraint,
      });
  
    // 서버 에러
    } else if (err.code === '23503') {
      res.status(400).send({
        message: "해당하는 사용자가 존재하지 않습니다"
      });

    } else {
      res.status(500).send({
        message: "서버 오류가 발생하였습니다",
      });
    }
  }
}

module.exports = errorHandling;
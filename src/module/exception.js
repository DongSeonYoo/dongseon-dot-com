const { loginIdRegex, pwRegex, nameRegex, phoneNumberRegex, emailRegex } = require("../module/regex");

function Exception(input, name) {
  this.checkInput = () => {
    if (input === undefined) {
      const error = new Error(`(${name}): 요청값이 잘못되었습니다`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.checkLength = (min, max) => {
    if (input.length < min || input.length > max) {
      const error = new Error(`(${name}): 길이가 비정상적입니다`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.checkIdRegex = () => {
    if (!loginIdRegex.test(input)) {
      const error = new Error(`(${name}): 정규표현식 실패`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.checkPwRegex = () => {
    if (!pwRegex.test(input)) {
      const error = new Error(`(${name}): 정규표현식 실패`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.checkNameRegex = () => {
    if (!nameRegex.test(input)) {
      const error = new Error(`(${name}): 정규표현식 실패`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.checkPhoneNumberRegex = () => {
    if (!phoneNumberRegex.test(input)) { 
      const error = new Error(`(${name}): 정규식표현식 실패`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.checkEmailRegex = () => {
    if (!emailRegex.test(input)) {
      const error = new Error(`(${name}): 정규표현식 실패`);
      error.status = 400;
      throw error;
    }

    return this;
  }

  this.isNumber = () => {
    if (isNaN(Number(input))) {
      const error = new Error(`(${name}): 정수가 아닙니다`);
      error.status = 400;
      throw error;
    }
    
    return this;
  }
}

const exception = (input, name) => {
  const res = new Exception(input, name);
  return res;
}

module.exports = exception;
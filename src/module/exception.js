const { loginIdRegex, pwRegex, nameRegex, phoneNumberRegex, emailRegex } = require("../module/regex");

function Exception(input, name) {
  this.checkInput = () => {
    if (typeof input === undefined || input === "") throw Error(`(${name}): 값이 비어있습니다`);
    return this;
  }

  this.checkLength = (min, max) => {
    if (input.length < min || input.length > max) throw Error(`(${name}): 길이가 비정상적입니다`);
    return this;
  }

  this.checkIdRegex = () => {
    if (!loginIdRegex.test(input)) throw Error(`(${name}): 정규표현식 실패`);
    return this;
  }

  this.checkPwRegex = () => {
    if (!pwRegex.test(input)) throw Error(`(${name}): 정규표현식 실패`);
    return this;
  }

  this.checkNameRegex = () => {
    if (!nameRegex.test(input)) throw Error(`(${name}): 정규표현식 실패`);
    return this;
  }

  this.checkPhoneNumberRegex = () => {
    if (!phoneNumberRegex.test(input)) throw Error(`(${name}): 정규식표현식 실패`);
    return this;
  }

  this.checkEmailRegex = () => {
    if (!emailRegex.test(input)) throw Error(`(${name}): 정규표현식 실패`);
    return this;
  }

  this.isNumber = () => {
    if (isNaN(Number(input))) throw Error(`(${name}): 정수가 아닙니다`);
    return this;
  }
}

const exception = (input, name) => {
  const res = new Exception(input, name);
  return res;
}

module.exports = exception;
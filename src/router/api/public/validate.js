const loginIdRegex = /^[A-Za-z0-9]{8,15}$/;
const pwRegex = /^.{10,17}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
const phoneNumberRegex = /^0\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isNumber = (number) => !isNaN(Number(number));


const validateLoginInput = (loginId, pw) => {
  if (!loginIdRegex.test(loginId)) {
    return false;
  } 

  if (!pwRegex.test(pw)) {
    return false;
  }

  return true;
}

const validateSignupInput = (loginId, pw, name, phoneNumber, email) => {
  if (!loginIdRegex.test(loginId)) {
    return false;
  }

  if (!pwRegex.test(pw)) {
    return false;
  }

  if (!nameRegex.test(name)) {
    return false;
  }

  if (!phoneNumberRegex.test(phoneNumber)) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

const validateFindIdInput = (name, phoneNumber, email) => {
  if (!nameRegex.test(name)) {
    return false;
  }

  if (!phoneNumberRegex.test(phoneNumber)) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

const validateUserInput = (loginId, name, phoneNumber, email) => {
  if (!loginIdRegex.test(loginId)) {
    return false;
  }

  if (!nameRegex.test(name)) {
    return false;
  }

  if (!phoneNumberRegex.test(phoneNumber)) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

const validateResetPwInput = (userId, newPw) => {
  if (!isNumber(userId)) {
    return false;
  }

  if (!pwRegex.test(newPw)) {
    return false;
  }

  return true;
}

const validateViewProfileInput = (userId) => {
  if (!isNumber(userId)) {
    return false;
  }

  return true;
}

const validateModifyPrifileInput = (userId, name, phoneNumber, email) => {
  if (!isNumber(userId)) {
    return false;
  }

  if (!nameRegex.test(name)) {
    return false;
  }

  if (!phoneNumberRegex.test(phoneNumber)) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

const validateDeleteUserInput = (userId) => {
  if (!isNumber(userId)) {
    return false;
  }

  return true;
}


module.exports = {
  validateLoginInput,
  validateSignupInput,
  validateFindIdInput,
  validateUserInput,
  validateResetPwInput,
  validateViewProfileInput,
  validateModifyPrifileInput,
  validateDeleteUserInput
}
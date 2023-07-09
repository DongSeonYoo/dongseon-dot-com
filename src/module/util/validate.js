const { loginIdRegex, pwRegex, nameRegex, phoneNumberRegex, emailRegex } = require("../util/regex");

const data = (input) => {
  const validate = {
    checkInput: () => {
      if (typeof input === "undefined" || input === "") {
        return false;
      }
      return validate;
    },

    checkLength: (min, max) => {
      if (input.length < min || input.length > max) {
        return false;
      }
      return validate;
    },

    checkIdRegex: () => {
      if (!loginIdRegex.test(input)) {
        return false;
      }
      return validate;
    },

    checkPwRegex: () => {
      if (!pwRegex.test(input)) {
        return false;
      }
      return validate;
    },

    checkNameRegex: () => {
      if (!nameRegex.test(input)) {
        return false;
      }
      return validate;
    },

    checkPhoneNumberRegex: () => {
      if (!phoneNumberRegex.test(input)) {
        return false;
      }
      return validate;
    },

    checkEmailRegex: () => {
      if (!emailRegex.test(input)) {
        return false;
      }
      return validate;
    }
  };
  
  return validate;
};

module.exports = data;

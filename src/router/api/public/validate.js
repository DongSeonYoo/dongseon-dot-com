const idRegex = /^[A-Za-z0-9]{8,15}$/;
const pwRegex = /^.{10,17}$/;

const validateLoginInput = (loginId, pw) => {
  if (!idRegex.test(loginId)) {
    return false;

  } else if (!pwRegex.test(pw)) {
    return false;
  }

  return true;
}

module.exports = {
  validateLoginInput,

}
const { loginIdRegex } = require("../regex");
const isNumber = (number) => !isNaN(Number(number));

const maxCommentLength = 300;


const validateCreateCommentInput = (postId, userId, content) => {
  if (!isNumber(postId)) {
    return false;
  }

  if (!isNumber(userId)) {
    return false;
  }

  if (content.length > maxCommentLength) {
    return false;
  }

  return true;
}

const validateReadCommentInput = (postId) => {
  if (!isNumber(postId)) {
    return false;
  }

  return true;
}

const validateUpdateCommentInput = (userId, content, postId, commentId) => {
  if (!isNumber(userId)) {
    return false;
  }

  if (content.length > maxCommentLength) {
    return false;
  }

  if (!isNumber(postId)) {
    return false;
  }

  if (!isNumber(commentId)) {
    return false;
  }

  return true;
}

const validateDeleteCommentInput = (postId, commentId, userId) => {
  if (!isNumber(postId)) {
    return false;
  }

  if (!isNumber(commentId)) {
    return false;
  }

  if (!isNumber(userId)) {
    return false;
  }

  return true;
}

const validateReadUserCommentInput = (userLoginId) => {
  if (!loginIdRegex.test(userLoginId)) {
    return false;
  }

  return true;
}

module.exports = {
  validateCreateCommentInput,
  validateReadCommentInput,
  validateUpdateCommentInput,
  validateDeleteCommentInput,
  validateReadUserCommentInput
}
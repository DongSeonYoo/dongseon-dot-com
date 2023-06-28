const isNumber = (number) => !isNaN(Number(number));

const maxTitleLength = 20;
const maxContentLength = 300;


const validateCreatePost = (userId, title, content) => {
  if (!isNumber(userId)) {
    return false;
  }

  if (title.length > maxTitleLength) {
    return false;
  }

  if (content.length > maxContentLength) {
    return false;
  }

  return true;
}

const validateReadPost = (postId) => {
  if (!isNumber(postId)) {
    return false;
  }

  return true;
}

// 미완
const validateUpdatePostInput = (postId, userId, title, content) => {
  if (!isNumber(postId)) {
    return false;
  }

  return true;
}



module.exports = {
  validateCreatePost,
  validateReadPost,

}
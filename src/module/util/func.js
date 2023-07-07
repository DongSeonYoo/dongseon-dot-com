function printError(error, result, res) {
  console.error(error.message);
  result.message = error.sqlMessage;
  res.send(result);
}

function makeResult() {
  return {
    success: false,
    message: "",
  };
}

module.exports = {
  printError,
  makeResult
}
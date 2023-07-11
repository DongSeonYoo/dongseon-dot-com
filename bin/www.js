const app = require("../server");
require("dotenv").config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("8000 포트 켜짐");
});
const app = require("../server");
require("dotenv").config();
const PORT = process.env.PORT;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log("8000 포트 켜짐");
});
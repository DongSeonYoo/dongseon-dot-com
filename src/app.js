const app = require("./server");
const env = require("./config/env");
const PORT = env.PORT;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`${PORT} 포트 켜짐`);
});

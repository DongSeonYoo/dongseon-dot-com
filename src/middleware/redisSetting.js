const redisClient = require("redis").createClient();

(async () => {
    await redisClient.connect();
})();

redisClient.on("connect", () => {
    console.log(`Redis client connected`);
});

redisClient.on = ("error", (err) => {
    console.error(`Redis error: ${err}`);
});

const redisSetting = () => {
    return async (req, res, next) => {
        req.redisClient = redisClient;
        next();
    }
}

module.exports = redisSetting;

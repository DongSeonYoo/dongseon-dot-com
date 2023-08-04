const redis = require("redis").createClient();

const writeUser = async (loginId) => {
    try {
        await redis.connect();

        await redis.sAdd("dailyLoginUser", loginId);

        await redis.disconnect();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    writeUser
};

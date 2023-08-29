const redisClient = require("../../config/database/redis");

const writeUser = async (loginId) => {
    try {
        await redisClient.sAdd("dailyLoginUser", loginId);

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    writeUser
};

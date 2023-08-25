const writeUser = async (req, loginId) => {
    try {
        await req.redisClient.sAdd("dailyLoginUser", loginId);

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    writeUser
};

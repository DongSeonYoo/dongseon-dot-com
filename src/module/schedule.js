const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();

const redisClient = require("redis").createClient();
const createClient = require("../../config/database/postgresql");

//매 0분마다 (한시간마다) 실행
rule.minute = 0;
const job = schedule.scheduleJob(rule, () => {
    moveDataToPostgres();
});


// redis -> postgresql
const moveDataToPostgres = async () => {
    let pgClient = null;

    try {
        pgClient = createClient();
        // redis, postgresql 데이터베이스 연결
        await redisClient.connect();
        await pgClient.connect();

        // redis에 저장되어있는 1시간동안의 로그인 기록을 가져옴 (type: array)
        const data = await redisClient.sMembers("dailyLoginUser");

        // postgresql에 데이터 삽입
        for (const loginId of data) {
            const query = `INSERT INTO logged_in_user (login_id, created_date, updated_date) VALUES ($1, $2, $3)`;
            const values = [loginId, new Date(), new Date()];

            await pgClient.query(query, values);
        }
        await redisClient.del("dailyLoginUser");

        console.log("스케쥴러 작동 성공");

    } catch (error) {
        console.error(error);

    } finally {
        // redis, postgresql 연결 해제
        await redisClient.disconnect();
        await pgClient.end();
    }
}

module.exports = job;

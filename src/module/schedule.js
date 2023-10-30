const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();

const redisClient = require("../config/database/redis");
const pool = require("../config/database/postgresql");

//매 0분마다 (한시간마다) 실행
rule.minute = 0;
const job = schedule.scheduleJob(rule, async () => {
    await moveDataToPostgres();
});

// redis -> postgresql
const moveDataToPostgres = async () => {
    let pgPool = null;

    try {
        // postgresql get connection
        pgPool = await pool.connect();

        // 트랜잭션 시작
        await pgPool.query("BEGIN");

        // redis에 저장되어있는 1시간동안의 로그인 기록을 가져옴 (type: array)
        const data = await redisClient.sMembers("dailyLoginUser");

        // postgresql에 데이터 삽입
        for (const loginId of data) {
            const query = `INSERT INTO 
                            logged_in_user (login_id, created_date, updated_date) 
                            VALUES ($1, $2, $3)`;
            const values = [loginId, new Date(), new Date()];
            await pgPool.query(query, values);
        }

        await redisClient.del("dailyLoginUser");
        // 트랜잭션 종료
        await pgPool.query("COMMIT");
        console.log("스케쥴러 작동 성공");

    } catch (error) {
        // 에러 어떻게 넘겨줄건지?
        console.error(error);
        await pgPool.query("ROLLBACK");

    } finally {
        // postgresql 커넥션 반환
        await pgPool.release();
    }
}

module.exports = job;

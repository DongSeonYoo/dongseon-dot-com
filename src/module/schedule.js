const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();
rule.second = 0;

const job = schedule.scheduleJob(rule, () => {
    // redis의 데이터를 postgresql로 옮겨주자
    
})

module.exports = job
const { Pool } = require("pg");
const env = require('../env');

const pool = new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_DATABASE,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    max: 20
});

module.exports = pool;

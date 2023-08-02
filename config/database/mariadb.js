const maria = require("mysql");

const connect = maria.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'ehdtjs',
    password: '1234',
    database: 'yoo_DB'
});

module.exports = connect;
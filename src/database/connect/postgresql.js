const { Client } = require("pg");

const createClient = () => {
  const config = {
    user: 'ubuntu',
    host: 'localhost',
    database: 'yoo_pg',
    password: '1234',
    port: 5432
  };

  const client = new Client(config);
  return client;
};

module.exports = createClient;
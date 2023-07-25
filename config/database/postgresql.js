require("dotenv").config();
const { Client } = require("pg");

const createClient = () => {
  const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  };

  const client = new Client(config);
  return client;
};

module.exports = createClient;
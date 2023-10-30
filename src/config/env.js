require("dotenv").config();

const env = {
  PORT: process.env.PORT,

  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,

  MONGO_DB_LOGS: process.env.MONGO_DB_LOGS,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,

  ADMIN_ID: process.env.ADMIN_ID,
  ADMIN_PW: process.env.ADMIN_PW,
  ADMIN_PK: process.env.ADMIN_PK,

  REDIS_RECENT_SEARCH: process.env.REDIS_RECENT_SEARCH,

  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  KAKAO_ID: process.env.KAKAO_ID,
  KAKAO_CALLBACKURL: process.env.KAKAO_CALLBACKURL,

  NODE_MAILER_ID: process.env.NODE_MAILER_ID,
  NODE_MAILER_PW: process.env.NODE_MAILER_PW
};

module.exports = env;

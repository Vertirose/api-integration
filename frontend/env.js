require("dotenv").config({ path: "./.env" });

const production = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  api: process.env.API_MAIN,
  message: process.env.API_MESSAGE,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN || "",
  },
  sequelize: {
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbEngine: process.env.DB_ENGINE,
  },
};

const development = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 8000,
  api: process.env.API_MAIN,
  message: process.env.API_MESSAGE,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN || "",
  },
  sequelize: {
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbEngine: process.env.DB_ENGINE,
  },
};

const config = process.env.NODE_ENV === "production" ? production : development;

module.exports = config;

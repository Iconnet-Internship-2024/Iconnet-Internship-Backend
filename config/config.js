require('dotenv').config();
const { Sequelize } = require("sequelize");

const {
  DB_NAME_DEV,
  DB_NAME_TEST,
  DB_NAME_PROD,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
} = process.env;

const sequelize = new Sequelize(
  DB_NAME_DEV,
  DB_USERNAME,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: DB_DIALECT,
  }
);

const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error(
      `Failed to connect to the database: ${error}`
    );
  }
};

module.exports = {
    testDBConnection,
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME_DEV,
    host: DB_HOST,
    dialect: DB_DIALECT,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME_TEST,
    host: DB_HOST,
    dialect: DB_DIALECT,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME_PROD,
    host: DB_HOST,
    dialect: DB_DIALECT,
  },
};

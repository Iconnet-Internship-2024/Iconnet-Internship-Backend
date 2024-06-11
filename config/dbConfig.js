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
    console.log("Koneksi ke database berhasil.");
  } catch (err) {
    console.error(
      `Gagal terkoneksi ke database: ${err}`
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
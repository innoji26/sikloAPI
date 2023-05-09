const Sequelize = require('sequelize');
const config = require('./dbConfig.js');

const database = new Sequelize(config.db, config.user, config.pass, {
  host: config.host,
  dialect: config.dialect,
  port: config.port,
  operatorsAliases: 0,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = database;

module.exports = db;

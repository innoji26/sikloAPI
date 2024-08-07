const Sequelize = require('sequelize');
const config = require('./dbConfig.js');

const database = new Sequelize(config.db, config.user, config.pass, {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: 0,
  port: config.port,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  dialectOptions: {
    connectTimeout: 60000 // increase connection timeout to 60 seconds
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = database;

module.exports = db;

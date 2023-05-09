require('dotenv').config();
const config = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  pass: process.env.MYSQLPASSWORD,
  db: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = config;

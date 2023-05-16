require('dotenv').config();
module.exports = {
  host: process.env.HOST,
  user: process.env.USER,
  pass: process.env.PASSWORD,
  db: process.env.DATABASE,
  port: process.env.PORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

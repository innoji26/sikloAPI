const Sequelize = require("sequelize");
const config = require("../config/dbConfig.js");

const database = new Sequelize(config.db, config.user, config.pass, {
    host: config.host,
    dialect: config.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = database;

module.exports = db;

// define semua models yang ada pada aplikasi
db.user = require("./user.js")(database, Sequelize);
db.news = require("./news.js")(database, Sequelize);

db.user.hasMany(db.news, { foreignKey: "idUser" });
db.news.belongsTo(db.user, { foreignKey: "idUser" });
module.exports = db;
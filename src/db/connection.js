require("dotenv").config();
const {Sequelize} = require("sequelize");

const SQLconnection = new Sequelize(process.env.MYSQL_URI);

SQLconnection.authenticate();

console.log("connected to SQL database");

module.exports = SQLconnection;
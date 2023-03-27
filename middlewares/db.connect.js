var mysql = require("mysql");
require("dotenv").config();

const con = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQL_WAT_BE_HOST,
    user: process.env.MYSQL_WAT_BE_USER_NAME,
    password: process.env.MYSQL_WAT_BE_USER_PASSWORD,
    database: process.env.MYSQL_WAT_BE_DATABASE,
    port: process.env.MYSQL_WAT_BE_PORT,
    debug: false,
    multipleStatements: true,
  });

module.exports = con;